import React, { useState } from 'react';
import { login, getGoogleAuthUrl, setAuthToken } from '../components/login/AuthService';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(username, password);
      const token = localStorage.getItem('token');
      if (token) setAuthToken(token);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleGoogleLogin = async () => {
      const authUrl = getGoogleAuthUrl();
      window.location.href = authUrl
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
    </div>
  );
};

export default LoginPage;
