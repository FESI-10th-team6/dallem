'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { EditIcon } from '@/shared/ui/icon';
import { Modal } from '@/shared/ui/modal';
import { ProfileEditForm } from './ProfileEditForm';

interface ProfileEditBtnProps {
  companyName: string;
  email: string;
}

export const ProfileEditBtn = ({ companyName, email }: ProfileEditBtnProps) => {
  const t = useTranslations('pages.myPage');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <EditIcon
        className="cursor-pointer"
        onClick={handleOpenModal}
      />

      <Modal.Root
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        variant="form"
      >
        <Modal.Header>{t('profile.edit')}</Modal.Header>
        <Modal.Body>
          <ProfileEditForm
            companyName={companyName}
            email={email}
            onClose={handleCloseModal}
          />
        </Modal.Body>
      </Modal.Root>
    </>
  );
};
