import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    console.log("token1, {}",token)
    if (token) {
        console.log("token2, {}",token)
      localStorage.setItem('token', token); // or use cookies if preferred
      // Redirect to the desired page after storing the token
      console.log("token3 {},",localStorage.getItem('token'))
      navigate('/travelPlans');
    } else {
      console.error('Token not found in URL');
      // Redirect to login page or show an error
      navigate('/login');
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
};

export default AuthSuccess;