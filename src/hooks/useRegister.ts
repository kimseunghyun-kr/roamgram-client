import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegistrationRequest {
  username: string;
  password: string;
  name: string;
  email: string;
}

export const useRegister = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = async (registrationRequest: RegistrationRequest) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/authentication/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationRequest),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      navigate('/login'); // Redirect to login page after successful registration
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError('Registration failed: ' + error.message);
      }
    }
  };

  return { register, error };
};
