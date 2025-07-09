import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  return isLoggedIn ? <Navigate to="/admin-dashboard" replace /> : children;
};

export default PublicRoute;
