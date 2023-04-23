import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../contexts/Auth';

const PrivateRoute = () => {
	const { user } = useAuth();

	return user ? <Outlet /> : <Navigate to='/signup' />;

};

export default PrivateRoute;