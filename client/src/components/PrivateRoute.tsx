import React, { ReactNode } from 'react';
import { Navigate, Route } from 'react-router-dom';

import { useAuth } from '../contexts/Auth';

type Props = {
	children: ReactNode,
};

const PrivateRoute = ({ children }: Props) => {
	const { user } = useAuth();

	if (!user) {
		return <Navigate to='/' />;
	}
	return children;

};

export default PrivateRoute;