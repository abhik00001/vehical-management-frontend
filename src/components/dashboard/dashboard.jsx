import axios from "axios"
import { useEffect, useState } from "react"
import "../../css/main.css"
import api from "../../Api"
import { RefreshAccessToken } from "../../authentication/auth"
import { useNavigate } from "react-router"

export default function Dashboard() {
    document.title = "dashboard"
    const navigate = useNavigate()
    const [userData, setUserData] = useState([])

    const fetchData = async () => {
        const access = localStorage.getItem('access')
        try {
            const response = await api.get('api/users/dashboard', {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            })
            setUserData(response.data)
        } catch (error) {
            if (error.response?.status === 401) {
                const NewAccess = await RefreshAccessToken()
                if (NewAccess) {
                    const response = await api.get('api/users/dashboard', {
                        headers: {
                            'Authorization': `Bearer ${access}`
                        }
                    })
                    setUserData(response.data)
                } else {
                    console.log('Failed to refresh token')
                    navigate('/')
                }
            } else {
                console.log(error);
            }
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    const role = userData.user?.role
    
    return (
        <>
            <div style={styles}>

                <h2 style={{ textAlign: "center", color: 'black' }}>Dashboard</h2>
                <h2 style={{ color: 'black', textTransform: 'capitalize' }}>Hello ! {userData.user?.first_name}</h2>
                <hr />

                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                }}>
                    {(role == "admin" || role == "manager") && (
                        <div style={total_container}>
                            <span>Total Users : {userData?.total_users}</span>
                            <span>Total Admins : {userData?.total_admins}</span>
                            <span>Total Managers : {userData?.total_managers}</span>
                            <span>Total Drivers : {userData?.total_drivers}</span>
                            <span>Total Vehicles : {userData?.total_vehicles}</span>

                        </div>


                    )}

                    {
                        (role == "driver") && (
                            <div style={total_container}>
                                <span>Vehicle Assigned : {
                                    userData?.driver_profile ?
                                        <div>
                                            <span style={{ color:"blue", width: '30', height: '90px', margin: '20px 0 0 20px', }} > {userData.driver_profile?.vehicle_img.split('/').pop()}</span>
                                            <div style={{ width: 'fit-content', display: 'flex', justifyContent: 'space-evenly', margin: '30px', flexWrap: 'wrap' }}>
                                                <span style={{ padding: '0 0 0 20px' }}>Vehicle Name: {userData?.driver_profile?.vehicle_name}</span>
                                                <span style={{ padding: '0 0 0 20px' }}>Vehicle Model: {userData?.driver_profile?.vehicle_model}</span>
                                                <span style={{ padding: '0 0 0 20px' }}>Vehicle Registration: {userData?.driver_profile?.registration_number}</span>
                                            </div>
                                        </div>
                                        : "No Vehicle Assigned"
                                }</span>
                            </div>
                        )
                    }

                </div>

                {(role == "admin" || role == "manager") && (
                    <>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", }}>
                            <div style={total_container}>
                                {
                                    <>
                                        <span>Total Drivers : {userData?.total_drivers}</span>
                                        <br />
                                        <span>Assigned Drivers : {userData?.assigned_drivers}</span>
                                        <span>Unassigned Drivers : {userData?.unassigned_drivers}</span>
                                        <span>Total Drivers Added : {userData?.userAdded_drivers}</span>
                                    </>
                                }
                            </div>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", }}>
                            <div style={total_container}>
                                {
                                    <>
                                        <span>Total Vehicles : {userData?.total_vehicles}</span>
                                        <br />
                                        <span>Assigned Vehicles : {userData?.assigned_vehicle}</span>
                                        <br />
                                        <span>UnAssigned Vehicles : {userData?.unassigned_vehicle}</span>
                                        <br />
                                        <span>Total Vehicles Added : {userData?.userAdded_vehicles}</span>
                                    </>
                                }
                            </div>
                        </div>

                        {
                            (role == 'admin') && (

                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", }}>
                                    <div style={total_container}>
                                        {
                                            <>
                                                <span>Total Managers : {userData?.total_managers}</span>
                                                <br />
                                                <span>Active Managers : {userData?.active_managers}</span>
                                                <br />
                                                <span>Inactive Managers : {userData?.unactive_managers}</span>
                                                <br />

                                                <span>Managers Added By User : {userData?.userAdded_managers}</span>
                                            </>
                                        }
                                    </div>
                                </div>
                            )
                        }

                    </>
                )}
            </div >
        </>
    )
}

const total_container = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    margin: "30px",
    boxShadow: "inset rgba(0, 0, 0, 0.1) 11px -5px 14px 3px",
    padding: "15px",
    borderRadius: "15px",
    flexWrap: "wrap"
}

const styles = {
    width: "80%",
    // border:"2px solid green",

    margin: "20px auto",
    padding: "20px",
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
}