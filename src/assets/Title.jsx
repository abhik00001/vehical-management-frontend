import { useEffect } from "react"
import { useLocation } from "react-router"

const urlTitle = {
    '/login_page': 'Login',
    '/forgot_password': 'Forgot Password',
    '/reset-password': 'Reset Password',
    '/verify_email': 'Verify Email',
    '/home': 'Dashboard',
    '/home/register_user': 'Register User',
    '/home/vehicles': 'Vehicles',
    '/home/add_vehicle': 'Add Vehicle',
    '/home/drivers': 'Drivers',
    '/home/managers': 'Managers',
    '/home/passwordChange': 'Change Password',
    '/home/myprofile': 'My Profile',
};
export default function TitleUpdate() {

    const location = useLocation()
    useEffect(() => {
        const title = urlTitle[location.pathname] || "Vehcile Management"
        document.title = `${title}`

    }, [location.pathname])
    return null
}