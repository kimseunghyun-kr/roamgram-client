// AuthService.ts
export const login = async (username: string, password: string) => {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
  };
  
  export const getGoogleAuthUrl = () => {
    return 'http://localhost:8080/oauth2/authorization/google';
  };
  
  export const setAuthToken = (token: string) => {
    localStorage.setItem('token', token);
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
  };
  