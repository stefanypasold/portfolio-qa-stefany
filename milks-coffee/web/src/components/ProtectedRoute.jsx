import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, roleRequired }) {
    const userRole = localStorage.getItem('userRole');

    // Se não tiver nada no storage ou o papel for diferente do exigido, volta pro login
    if (!userRole || (roleRequired && userRole !== roleRequired)) {
        return <Navigate to="/" replace />;
    }

    return children;
}