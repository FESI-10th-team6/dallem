'use client';

import { useTranslations } from 'next-intl';
import { Modal } from '@/shared/ui/modal';
import { CreateGatheringForm } from './CreateGatheringForm';

interface CreateGatheringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGatheringModal = ({ isOpen, onClose }: CreateGatheringModalProps) => {
  const t = useTranslations('pages.gatherings.create');

  return (
    <Modal.Root
      isOpen={isOpen}
      onClose={onClose}
      variant="form"
    >
      <Modal.Header>{t('title')}</Modal.Header>
      <Modal.Body>
        <CreateGatheringForm onClose={onClose} />
      </Modal.Body>
    </Modal.Root>
  );
};
