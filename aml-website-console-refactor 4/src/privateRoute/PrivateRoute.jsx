import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  return children 
};

export default PrivateRoute;
