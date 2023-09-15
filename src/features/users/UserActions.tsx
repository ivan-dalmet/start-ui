import React from 'react';

import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuProps,
  Portal,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LuCheckCircle, LuEdit3, LuTrash2, LuXCircle } from 'react-icons/lu';

import { ActionsButton } from '@/components/ActionsButton';
import { ConfirmMenuItem } from '@/components/ConfirmMenuItem';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Icon } from '@/components/Icons';
import { useToastError, useToastSuccess } from '@/components/Toast';
import { RouterOutputs, trpc } from '@/lib/trpc/client';

export type UserActionProps = Omit<MenuProps, 'children'> & {
  user: RouterOutputs['users']['getAll']['items'][number];
};

export const UserActions = ({ user, ...rest }: UserActionProps) => {
  const { t } = useTranslation(['common', 'users']);
  const session = useSession();
  const trpcContext = trpc.useContext();
  const isCurrentUser = session.data?.user.id === user.id;

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  // const userUpdate = trpc.users.updateById.useMutation({
  //   // TODO
  //   // onSuccess: ({  activated, email }) => {
  //   //   if (activated) {
  //   //     toastSuccess({
  //   //       title: t('users:feedbacks.activateUserSuccess.title'),
  //   //       description: t('users:feedbacks.activateUserSuccess.description', {
  //   //         login: email, // TODO
  //   //       }),
  //   //     });
  //   //   } else {
  //   //     toastSuccess({
  //   //       title: t('users:feedbacks.deactivateUserSuccess.title'),
  //   //       description: t('users:feedbacks.deactivateUserSuccess.description', {
  //   //         login,
  //   //       }),
  //   //     });
  //   //   }
  //   // },
  //   // onError: (_, { body }) => {
  //   //   if (body?.activated) {
  //   //     toastError({
  //   //       title: t('users:feedbacks.activateUserError.title'),
  //   //       description: t('users:feedbacks.activateUserError.description', {
  //   //         login: body?.login ?? '??',
  //   //       }),
  //   //     });
  //   //   } else {
  //   //     toastError({
  //   //       title: t('users:feedbacks.deactivateUserError.title'),
  //   //       description: t('users:feedbacks.deactivateUserError.description', {
  //   //         login: body?.login ?? '??',
  //   //       }),
  //   //     });
  //   //   }
  //   // },
  // });

  const activateUser = trpc.users.activate.useMutation({
    onSuccess: async () => {
      await trpcContext.users.invalidate();
      toastSuccess({
        title: 'Success', // TODO
      });
    },
    onError: () => {
      toastError({
        title: 'Error', // TODO
      });
    },
  });
  const deactivateUser = trpc.users.deactivate.useMutation({
    onSuccess: async () => {
      await trpcContext.users.invalidate();
      toastSuccess({
        title: 'Success', // TODO
      });
    },
    onError: () => {
      toastError({
        title: 'Error', // TODO
      });
    },
  });

  const removeUser = trpc.users.removeById.useMutation({
    onSuccess: async () => {
      await trpcContext.users.getAll.invalidate();
    },
    onError: () => {
      toastError({
        title: 'Error', // TODO
      });
    },
    // onError: (_, { params: { login } }) => {
    //   toastError({
    //     title: t('users:feedbacks.deleteUserError.title'),
    //     description: t('users:feedbacks.deleteUserError.description', {
    //       login,
    //     }),
    //   });
    // },
  });

  const isLoading =
    activateUser.isLoading || deactivateUser.isLoading || removeUser.isLoading;

  return (
    <Menu placement="left-start" {...rest}>
      <MenuButton as={ActionsButton} isLoading={isLoading} />
      <Portal>
        <MenuList>
          <MenuItem
            as={Link}
            href={`/admin/users/${user.id}`}
            icon={<Icon icon={LuEdit3} fontSize="lg" color="gray.400" />}
          >
            {t('common:actions.edit')}
          </MenuItem>
          {!isCurrentUser && (
            <>
              {user.activated ? (
                <ConfirmMenuItem
                  onClick={() => deactivateUser.mutate({ id: user.id })}
                  icon={
                    <Icon icon={LuXCircle} fontSize="lg" color="gray.400" />
                  }
                >
                  {t('common:actions.deactivate')}
                </ConfirmMenuItem>
              ) : (
                <ConfirmMenuItem
                  onClick={() => activateUser.mutate({ id: user.id })}
                  icon={
                    <Icon icon={LuCheckCircle} fontSize="lg" color="gray.400" />
                  }
                >
                  {t('common:actions.activate')}
                </ConfirmMenuItem>
              )}
              <MenuDivider />
              <ConfirmModal
                title={t('users:deleteModal.title')}
                message={t('users:deleteModal.message', {
                  name: user.email,
                })}
                onConfirm={() => removeUser.mutate({ id: user.id })}
                confirmText={t('common:actions.delete')}
                confirmVariant="@danger"
                size="sm"
              >
                <MenuItem
                  icon={<Icon icon={LuTrash2} fontSize="lg" color="gray.400" />}
                >
                  {t('common:actions.delete')}
                </MenuItem>
              </ConfirmModal>
            </>
          )}
        </MenuList>
      </Portal>
    </Menu>
  );
};
