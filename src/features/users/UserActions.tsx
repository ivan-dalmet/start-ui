import React from 'react';

import {
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuCheckCircle, LuEdit, LuTrash2, LuXCircle } from 'react-icons/lu';
import { Link } from 'react-router-dom';

import { ActionsButton } from '@/components/ActionsButton';
import { ConfirmMenuItem } from '@/components/ConfirmMenuItem';
import { Icon } from '@/components/Icons';
import { useToastError, useToastSuccess } from '@/components/Toast';
import { User } from '@/features/users/schema';
import { useUserRemove, useUserUpdate } from '@/features/users/service';

export type UserActionProps = Omit<MenuProps, 'children'> & {
  user: User;
};

export const UserActions = ({ user, ...rest }: UserActionProps) => {
  const { t } = useTranslation(['common', 'users']);

  const confirmDeleteModal = useDisclosure();
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();
  const userUpdate = useUserUpdate({
    onSuccess: ({ activated, login }) => {
      if (activated) {
        toastSuccess({
          title: t('users:feedbacks.activateUserSuccess.title'),
          description: t('users:feedbacks.activateUserSuccess.description', {
            login,
          }),
        });
      } else {
        toastSuccess({
          title: t('users:feedbacks.deactivateUserSuccess.title'),
          description: t('users:feedbacks.deactivateUserSuccess.description', {
            login,
          }),
        });
      }
    },
    onError: (_, { activated, login }) => {
      if (activated) {
        toastError({
          title: t('users:feedbacks.activateUserError.title'),
          description: t('users:feedbacks.activateUserError.description', {
            login,
          }),
        });
      } else {
        toastError({
          title: t('users:feedbacks.deactivateUserError.title'),
          description: t('users:feedbacks.deactivateUserError.description', {
            login,
          }),
        });
      }
    },
  });

  const activateUser = () => userUpdate.mutate({ ...user, activated: true });
  const deactivateUser = () => userUpdate.mutate({ ...user, activated: false });
  const isActionsLoading = userUpdate.isLoading;

  const userRemove = useUserRemove({
    onSuccess: (_, { login }) => {
      toastSuccess({
        title: t('users:feedbacks.deleteUserSuccess.title'),
        description: t('users:feedbacks.deleteUserSuccess.description', {
          login,
        }),
      });
    },
    onError: (_, { login }) => {
      toastError({
        title: t('users:feedbacks.deleteUserError.title'),
        description: t('users:feedbacks.deleteUserError.description', {
          login,
        }),
      });
    },
  });
  const removeUser = () => userRemove.mutate(user);
  const isRemovalLoading = userRemove.isLoading;

  return (
    <>
      <Menu isLazy placement="left-start" {...rest}>
        <MenuButton
          as={ActionsButton}
          isLoading={isActionsLoading || isRemovalLoading}
        />
        <Portal>
          <MenuList>
            <MenuItem
              as={Link}
              to={`/admin/users/${user.login}`}
              icon={<Icon icon={LuEdit} fontSize="lg" color="gray.400" />}
            >
              {t('common:actions.edit')}
            </MenuItem>
            {user.activated ? (
              <MenuItem
                onClick={deactivateUser}
                icon={<Icon icon={LuXCircle} fontSize="lg" color="gray.400" />}
              >
                {t('common:actions.deactivate')}
              </MenuItem>
            ) : (
              <ConfirmMenuItem
                onClick={activateUser}
                icon={
                  <Icon icon={LuCheckCircle} fontSize="lg" color="gray.400" />
                }
              >
                {t('common:actions.activate')}
              </ConfirmMenuItem>
            )}
            <MenuDivider />
            <MenuItem
              icon={<Icon icon={LuTrash2} fontSize="lg" color="gray.400" />}
              onClick={confirmDeleteModal.onOpen}
            >
              {t('common:actions.delete')}
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>
      <Modal
        isOpen={confirmDeleteModal.isOpen}
        onClose={confirmDeleteModal.onClose}
      >
        <Portal>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <Box flex={1}>{t('users:deleteModal.title')}</Box>
                <CloseButton onClick={confirmDeleteModal.onClose} />
              </HStack>
            </ModalHeader>
            <ModalBody fontSize="sm">
              {t('users:deleteModal.message', { name: user.login })}
            </ModalBody>
            <ModalFooter>
              <ButtonGroup justifyContent="space-between" w="full">
                <Button onClick={confirmDeleteModal.onClose}>
                  {t('common:actions.cancel')}
                </Button>
                <Button
                  variant="@danger"
                  onClick={() => {
                    removeUser();
                    confirmDeleteModal.onClose();
                  }}
                >
                  {t('common:actions.delete')}
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Portal>
      </Modal>
    </>
  );
};
