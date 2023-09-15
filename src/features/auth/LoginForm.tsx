import React, { useState } from 'react';

import { Alert, Box, BoxProps, Button, Stack } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { isEmail } from '@formiz/validations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'react-i18next';

import { FieldInput } from '@/components/FieldInput';
import { useToastError } from '@/components/Toast';

type LoginFormProps = BoxProps;

export const LoginForm = ({ ...rest }: LoginFormProps) => {
  const [emailSentTo, setEmailSent] = useState<null | string>(null);
  const { t } = useTranslation(['auth']);
  const toastError = useToastError();
  const queryCache = useQueryClient();

  const login = useMutation({
    mutationFn: async (email: string) => {
      const response = await signIn('email', { email, redirect: false });
      if (response?.error) {
        throw new Error(response.error);
      }
      if (!response?.ok) {
        throw new Error('Login Failed');
      }
      setEmailSent(email);
    },
    onSuccess: () => {
      queryCache.clear();
    },
    onError: () => {
      // TODO
    },
  });

  const form = useForm<{ email: string }>({
    onValidSubmit: (values) => login.mutate(values.email),
  });

  if (emailSentTo) {
    return (
      <Box {...rest}>
        <Alert status="success">
          Login email sent to {emailSentTo} {/* TODO */}
          <br />
          Check your inbox.
        </Alert>
      </Box>
    );
  }

  return (
    <Box {...rest}>
      <Formiz autoForm connect={form}>
        <Stack spacing={4}>
          <FieldInput
            name="email"
            label="Email" //TODO
            required="Email is required" //TODO
            validations={[
              {
                handler: isEmail(),
                message: 'Invalid email', //TODO
              },
            ]}
          />
          <Button
            isLoading={login.isLoading}
            isDisabled={form.isSubmitted && !form.isValid}
            type="submit"
            variant="@primary"
            ms="auto"
          >
            {t('auth:login.actions.login')}
          </Button>
        </Stack>
      </Formiz>
    </Box>
  );
};
