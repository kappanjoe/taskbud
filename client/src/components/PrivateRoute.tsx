import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../contexts/Auth';

const PrivateRoute = () => {
	const { session, isLoading } = useAuth();

	return !isLoading
		? (session ? <Outlet /> : <Navigate to='/welcome' />)
		: null;

};

export default PrivateRoute;