import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { z } from 'zod';

import EmailActivateAccount from '@/emails/templates/activate-account';
import EmailResetPassword from '@/emails/templates/reset-password';
import { env } from '@/env.mjs';
import i18n from '@/lib/i18n/server';
import { AUTH_COOKIE_NAME, decodeJwt } from '@/server/config/auth';
import { sendEmail } from '@/server/config/email';
import { ExtendedTRPCError } from '@/server/config/errors';
import { createTRPCRouter, publicProcedure } from '@/server/config/trpc';

export const authRouter = createTRPCRouter({
  checkAuthenticated: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/auth/check',
        tags: ['auth'],
      },
    })
    .input(z.void())
    .output(z.boolean())
    .query(async ({ ctx }) => {
      ctx.logger.debug(`User ${!!ctx.user ? 'is' : 'is not'} logged`);
      return !!ctx.user;
    }),

  login: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/auth/login',
        tags: ['auth'],
      },
    })
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .output(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      ctx.logger.debug('Retrieving user info by email');
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        ctx.logger.warn('User not found');
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }

      if (!user.password || !user.activated || !user.emailVerified) {
        ctx.logger.warn('Invalid user');
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }

      ctx.logger.debug('Checking user password');
      const isPasswordValid = await bcrypt.compare(
        input.password,
        user.password
      );

      if (!isPasswordValid) {
        ctx.logger.warn('Invalid user password');
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Password not valid',
        });
      }

      ctx.logger.debug('User password valid and decoding JWT');
      const token = await jwt.sign({ id: user.id }, env.AUTH_SECRET);
      if (!token) {
        ctx.logger.warn('Failed to decode JWT');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create the JWT token',
        });
      }

      ctx.logger.debug('Set auth cookie');
      cookies().set({
        name: AUTH_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
      });

      return {
        token,
      };
    }),

  logout: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/auth/logout',
        tags: ['auth'],
      },
    })
    .input(z.void())
    .output(z.void())
    .mutation(async ({ ctx }) => {
      ctx.logger.debug('Delete auth cookie');
      cookies().delete('auth');
    }),

  register: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/auth/register',
        tags: ['auth'],
      },
    })
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
        name: z.string(),
        language: z.string(),
      })
    )
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      ctx.logger.debug('Hash password');
      const passwordHash = await bcrypt.hash(input.password, 12);

      let user;
      try {
        ctx.logger.debug('Create user');
        user = await ctx.db.user.create({
          data: {
            email: input.email.toLowerCase().trim(),
            password: passwordHash,
            name: input.name,
            language: input.language,
          },
        });
      } catch (e) {
        ctx.logger.warn('Failed to create user');
        throw new ExtendedTRPCError({
          cause: e,
        });
      }

      ctx.logger.debug('Sign JWT');
      const token = jwt.sign({ id: user.id }, env.AUTH_SECRET);

      ctx.logger.debug('Create verification token in database');
      await ctx.db.verificationToken.create({
        data: {
          userId: user.id,
          token,
          expires: dayjs().add(1, 'hour').toDate(),
        },
      });

      const link = `${env.NEXT_PUBLIC_BASE_URL}/register/activate?token=${token}`;

      ctx.logger.debug('Send email');
      await sendEmail({
        to: input.email,
        subject: i18n.t('emails:activateAccount.subject', {
          lng: user.language,
        }),
        template: (
          <EmailActivateAccount
            language={user.language}
            name={user.name ?? ''}
            link={link}
          />
        ),
      });

      return undefined;
    }),

  activate: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/auth/register/activate',
        tags: ['auth'],
      },
    })
    .input(z.object({ token: z.string().optional() }))
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      ctx.logger.debug('Clear all expired tokens');
      await ctx.db.verificationToken.deleteMany({
        where: { expires: { lt: new Date() } },
      });

      if (!input.token) {
        ctx.logger.warn('Missing input token');
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Missing input token',
        });
      }

      ctx.logger.warn('Decode JWT');
      const jwtDecoded = decodeJwt(input.token);
      if (!jwtDecoded?.id) {
        ctx.logger.warn('Failed to decode JWT');
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      ctx.logger.debug('Check verification token in database');
      const verificationToken = await ctx.db.verificationToken.findUnique({
        where: { token: input.token, userId: jwtDecoded.id },
      });

      if (!verificationToken) {
        ctx.logger.warn('No verification token in database');
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      ctx.logger.debug('Update user activation and remove verification token');
      const [user] = await ctx.db.$transaction([
        ctx.db.user.update({
          where: { id: verificationToken.userId },
          data: { activated: true, emailVerified: true },
        }),
        ctx.db.verificationToken.delete({
          where: { token: verificationToken.token },
        }),
      ]);

      if (!user) {
        ctx.logger.fatal(verificationToken, 'User does not exist');
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      return undefined;
    }),

  resetPasswordRequest: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/auth/reset-password/request',
        tags: ['auth'],
      },
    })
    .input(z.object({ email: z.string().email() }))
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: { email: input.email },
      });

      if (!user) {
        ctx.logger.warn('User not found');
        // Silent failure for security
        return undefined;
      }

      ctx.logger.debug('Creating reset password JWT');
      const token = jwt.sign({ id: user.id }, env.AUTH_SECRET);

      await ctx.db.verificationToken.create({
        data: {
          userId: user.id,
          token,
          expires: dayjs().add(1, 'hour').toDate(),
        },
      });

      ctx.logger.debug('JWT stored in database');
      const link = `${env.NEXT_PUBLIC_BASE_URL}/reset-password/confirm?token=${token}`;

      ctx.logger.debug('Sending email');
      await sendEmail({
        to: input.email,
        subject: i18n.t('emails:resetPassword.subject', { lng: user.language }),
        template: (
          <EmailResetPassword
            language={user.language}
            name={user.name ?? ''}
            link={link}
          />
        ),
      });

      return undefined;
    }),

  resetPasswordConfirm: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/auth/reset-password/confirm',
        tags: ['auth'],
      },
    })
    .input(z.object({ token: z.string(), newPassword: z.string() }))
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      ctx.logger.debug('Removing expired tokens');
      await ctx.db.verificationToken.deleteMany({
        where: { expires: { lt: new Date() } },
      });

      const jwtDecoded = decodeJwt(input.token);
      if (!jwtDecoded?.id) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      ctx.logger.debug('Checking if user id match the provided JWT');
      const verificationToken = await ctx.db.verificationToken.findUnique({
        where: { token: input.token, userId: jwtDecoded.id },
      });

      if (!verificationToken) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      ctx.logger.debug('Hashing new password');
      const passwordHash = await bcrypt.hash(input.newPassword, 12);

      ctx.logger.debug('Saving new hash and removing verification JWT');
      const [user] = await ctx.db.$transaction([
        ctx.db.user.update({
          where: { id: verificationToken.userId },
          data: { password: passwordHash },
        }),
        ctx.db.verificationToken.delete({ where: { token: input.token } }),
      ]);

      if (!user) {
        ctx.logger.error('User not found');
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      return undefined;
    }),
});