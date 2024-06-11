// src/components/login/LogoutButton.tsx
import React from 'react';
import { Button as MantineButton } from '@mantine/core';
import { useAuthContext } from '../../context/AuthContext';

interface LogoutButtonProps {
  useMantine?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ useMantine = true }) => {
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
  };

  if (useMantine) {
    return (
      <MantineButton
        onClick={handleLogout}
        variant="filled"
        color="red"
        size="md"
        radius="md"
      >
        Logout
      </MantineButton>
    );
  }

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
