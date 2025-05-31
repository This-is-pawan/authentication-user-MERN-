both are use
```js
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired      
      localStorage.removeItem('token');
      toast.error('Session expired. Please log in again.');
      window.location.href = '/login'; // or use navigate('/login') in React Router
    }
    return Promise.reject(error);
  }
);
```
  ```js
import jwtDecode from 'jwt-decode';

const token = localStorage.getItem('token');
if (token) {
  const { exp } = jwtDecode(token);
  const expirationTime = exp * 1000 - Date.now();

  setTimeout(() => {
    localStorage.removeItem('token');
    toast.info('Session expired. Please log in again.');
    window.location.href = '/login';
  }, expirationTime);
}

    ```
