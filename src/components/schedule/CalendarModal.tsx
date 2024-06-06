// ConfirmModal.tsx
import React from 'react';
import { Modal, Button, Select } from '@mantine/core';

interface CalenderModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: (option: string) => void;
  options: { label: string, value: string }[];
}

const CalendarModal: React.FC<CalenderModalProps> = ({ opened, onClose, onConfirm, options }) => {
  const handleSelectOption = (value: string | null) => {
    if (value) {
      onConfirm(value);
      onClose(); // Close the modal after selecting an option
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Select Action" size="sm">
      <Select
        data={options}
        onChange={handleSelectOption}
        placeholder="Choose an action"
      />
      <Button onClick={onClose} style={{ marginTop: '20px' }}>Cancel</Button>
    </Modal>
  );
};

export default CalendarModal;
