import React from 'react';

import { Button, ButtonGroup, Heading } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import {
  Page,
  PageBottomBar,
  PageContent,
  PageTopBar,
} from '@/components/Page';
import { useToastError, useToastSuccess } from '@/components/Toast';
import { UserForm, UserFormFields } from '@/features/users/UserForm';
import { trpc } from '@/lib/trpc/client';

export default function PageUserCreate() {
  const { t } = useTranslation(['common', 'users']);
  const router = useRouter();
  const trpcContext = trpc.useContext();

  const toastError = useToastError();
  const toastSuccess = useToastSuccess();

  const createUser = trpc.users.create.useMutation({
    onSuccess: async () => {
      await trpcContext.users.getAll.invalidate();
      toastSuccess({
        title: t('users:create.feedbacks.updateSuccess.title'),
      });
      router.back();
    },
    onError: () => {
      toastError({
        title: 'Error', // TODO
      });
    },
    // onError: (error) => {
    //   if (error.status === 400) {
    //     const { title, errorKey } = error.body;
    //     toastError({
    //       title: t('users:create.feedbacks.updateError.title'),
    //       description: title,
    //     });
    //     switch (errorKey) {
    //       case 'userexists':
    //         form.setErrors({
    //           login: t('users:data.login.alreadyUsed'),
    //         });
    //         break;
    //       case 'emailexists':
    //         form.setErrors({
    //           email: t('users:data.email.alreadyUsed'),
    //         });
    //         break;
    //     }
    //     return;
    //   }

    //   toastError({
    //     title: t('users:create.feedbacks.updateError.title'),
    //   });
    // },
  });

  const form = useForm<UserFormFields>({
    onValidSubmit: (values) => {
      createUser.mutate(values);
    },
  });

  return (
    <Page containerSize="md" isFocusMode>
      <Formiz connect={form}>
        <form noValidate onSubmit={form.submit}>
          <PageTopBar showBack onBack={() => router.back()}>
            <Heading size="md">{t('users:create.title')}</Heading>
          </PageTopBar>
          <PageContent>
            <UserForm />
          </PageContent>
          <PageBottomBar>
            <ButtonGroup justifyContent="space-between">
              <Button onClick={() => router.back()}>
                {t('common:actions.cancel')}
              </Button>
              <Button
                type="submit"
                variant="@primary"
                isLoading={createUser.isLoading}
              >
                {t('users:create.action.save')}
              </Button>
            </ButtonGroup>
          </PageBottomBar>
        </form>
      </Formiz>
    </Page>
  );
}
