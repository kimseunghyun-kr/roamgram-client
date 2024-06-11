// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, getGoogleAuthUrl } = useAuthContext();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(username, password);
      navigate('/travelPlans'); // Redirect after login
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError('Login failed: ' + error.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    const authUrl = getGoogleAuthUrl();
    const newWindow = window.open(authUrl, '_blank', 'width=500,height=600');

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== import.meta.env.VITE_APP_API_URL) {
        return;
      }

      const { accessToken, refreshToken } = event.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      if (newWindow) {
        newWindow.close();
      }

      window.removeEventListener('message', handleMessage);
      navigate('/travelPlans'); // Redirect after login
    };

    window.addEventListener('message', handleMessage);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      {error && <div>{error}</div>}
      <div>
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
};

export default LoginPage;
