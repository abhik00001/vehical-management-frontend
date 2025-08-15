import { isAuthenticated } from "./auth"
import {Navigate } from 'react-router'

export const ProtectedRoute = ({children}) => {
    const auth = isAuthenticated()
    if (!auth) {
        console.log('false');
        return <Navigate to="/login_page" replace />
    }
    return children
}