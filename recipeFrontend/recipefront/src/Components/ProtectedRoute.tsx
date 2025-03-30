import React, { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeAuthState } from '../Slices/authverify';
import LoadingSpinner from './LoadingSpinner'; 
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const dispatch = useDispatch();
  const { isAuthenticated, authInitialized } = useSelector(
    (state: any) => state.authverify
  ); 

  useEffect(() => {
    dispatch(initializeAuthState());
  }, [dispatch]);
  if (!authInitialized) {
    return <LoadingSpinner />;
  } 
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
