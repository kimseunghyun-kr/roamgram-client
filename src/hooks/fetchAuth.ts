interface RequestOptions extends RequestInit {
    // Add any custom options you need
  }
  
  const getRequestOptions = (): RequestOptions => {
    console.log("token deleteTravelPlan {},",localStorage.getItem('token'))
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    const requestOptions: RequestOptions = {
      headers,
      credentials: 'include',
    };
    return requestOptions;
  };
  
  export default getRequestOptions;
  