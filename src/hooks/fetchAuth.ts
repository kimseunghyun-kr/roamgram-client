interface RequestOptions extends RequestInit {
    // Add any custom options you need
  }
  
  const getRequestOptions = (): RequestOptions => {
    console.log("token taken from storage {},",localStorage.getItem('accessToken'))
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, // Include the access token in the Authorization header
    };
    const requestOptions: RequestOptions = {
      headers,
      credentials: 'include',
    };
    return requestOptions;
  };


  const refreshToken = async () => {
    const response = await fetch('/api/refresh-token', {
        method: 'POST',
        credentials: 'include', // Send cookies
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
    } else {
        // Handle refresh token expiration or failure
        window.location.href = '/login';
    }
};

  
export { getRequestOptions, refreshToken };