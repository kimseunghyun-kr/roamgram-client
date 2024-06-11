import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const AuthSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext(); // Add setIsAuthenticated to context if not already present

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setIsAuthenticated(true); // Update authentication state
      navigate('/travelPlans');
    } else {
      console.error('Tokens not found in URL');
      navigate('/login');
    }
  }, [location, navigate, setIsAuthenticated]);

  return <div>Loading...</div>;
};

export default AuthSuccess;
