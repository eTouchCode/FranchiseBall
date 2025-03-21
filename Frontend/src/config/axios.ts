import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '../store/auth.store';

const { token, logOut } = useAuthStore.getState() as { token: string, logOut: () => void };

export const Axios = axios.create({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

Axios.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    if (response && response.status === 401) {
      delete Axios.defaults.headers.common['Authorization'];
      logOut();
      window.location.href = '/auth/signin';
      toast.error("Your session has expired. Please log in again.");
    }
    return Promise.reject(error);
  }
);

export default Axios;
