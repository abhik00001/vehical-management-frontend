import { BrowserRouter, Navigate, Route, Routes } from "react-router"

import LoginPage from "./components/user/loginPage"
import ForgotPassword from "./components/user/forgot_password"
import Header from "./components/header/header"
import { ProtectedRoute } from "./authentication/protected_route"
import { isAuthenticated } from "./authentication/auth"
import Dashboard from "./components/dashboard/dashboard"
import VerifyEmail from "./components/user/verify_email"
import RegisterUser from "./components/user/register_user"
import DriversList from "./components/driver/drivers"
import Managers from "./components/manager/managers"
import Vehicle from "./components/vehicles/vehicles"
import AddVehicle from "./components/vehicles/addvehicle"
import AddDriver from "./components/driver/Add_driver"
import PasswordChange from "./components/user/change_password"
import ResetPassword from "./components/user/reset_password"
import MyProfile from "./components/user/myprofile"
import MyProfileUpdate from "./components/user/myprofileUpdate"
import VehicleUpdate from "./components/vehicles/update_vehicles"
import ManagerUpdate from "./components/manager/updateManager"
import UpdateDriver from "./components/driver/update_driver"
import DriverUpdate from "./components/driver/updateUserDetails"
import TitleUpdate from "./assets/Title"


function App() {
    return (
        <>
            <BrowserRouter >
                <TitleUpdate />
                <Routes>
                    <Route path="/" element={
                        isAuthenticated() ? <Navigate to="/home" replace /> : <Navigate to="/login_page" replace />
                    } />
                    <Route path="/login_page" element={<LoginPage />} />
                    <Route path="/forgot_password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
                    <Route path="/verify_email/:email" element={<VerifyEmail />} />
                    <Route path="/home" element={
                        <ProtectedRoute>
                            <Header />
                        </ProtectedRoute>
                    }>
                        <Route path="" element={<Dashboard />} />
                        <Route path="register_user" element={<RegisterUser />} />
                        <Route path="vehicles" element={<Vehicle />} />
                        <Route path="add_vehicle" element={<AddVehicle />} />
                        <Route path="drivers" element={<DriversList />} />
                        <Route path="AddDriver/:userEmail" element={<AddDriver />} />
                        <Route path="managers" element={<Managers />} />
                        <Route path="passwordChange" element={<PasswordChange />} />
                        <Route path="myprofile" element={<MyProfile />} />
                        <Route path="updateProfile" element={<MyProfileUpdate />} />

                        <Route path="vehicles/:vehicleId" element={<VehicleUpdate />} />
                        <Route path="managers/:managerId" element={<ManagerUpdate />} />
                        <Route path="drivers/:driverId" element={<UpdateDriver />} />
                        <Route path="drivers/:driverId/updateUser/:userId" element={<DriverUpdate />} />
                    </Route>
                </Routes>
            </BrowserRouter >
        </>
    )
}

export default App
