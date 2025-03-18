import React, { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeAuthState } from '../Slices/authverify';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: any) => state.authverify?.isAuthenticated); 

  useEffect(() => {
    dispatch(initializeAuthState());
  }, [dispatch]);

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
