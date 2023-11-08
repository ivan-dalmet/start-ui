import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { ConfirmModal } from '@/components/ConfirmModal';

export type AdminCancelButtonProps = {
  withConfrim?: boolean;
};

export const AdminCancelButton = (props: AdminCancelButtonProps) => {
  const router = useRouter();
  const { t } = useTranslation(['common']);

  return (
    <ConfirmModal
      onConfirm={() => router.back()}
      size="lg"
      isEnabled={props.withConfrim ?? false}
      title={t('common:confirmDiscardChanges.title')}
      message={t('common:confirmDiscardChanges.message')}
      confirmVariant="@danger"
      confirmText={t('common:confirmDiscardChanges.confirmText')}
      cancelText={t('common:confirmDiscardChanges.cancelText')}
    >
      <Button display={{ base: 'none', md: 'inline-flex' }}>
        {t('common:actions.cancel')}
      </Button>
    </ConfirmModal>
  );
};
