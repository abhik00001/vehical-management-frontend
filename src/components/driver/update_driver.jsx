import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import api, { myBaseURL } from "../../Api";
import { RefreshAccessToken } from "../../authentication/auth";
import { Link, useNavigate, useParams } from "react-router";

export default function UpdateDriver() {
    const { driverId } = useParams()
    const navigate = useNavigate()
    const [vehicles, setVehicles] = useState([])
    const [users, setUsers] = useState([])
    const [driver, setDriver] = useState({})
    const [license, setLicense] = useState(null)
    const [error, setError] = useState('')

    const fetchVehicles = async () => {
        let access = localStorage.getItem('access')
        try {
            const response = await api.get('api/vehicles', {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            })
            setVehicles(response.data.data)
            setUsers(response.data.users)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchDetails = async () => {
        let access = localStorage.getItem('access')
        try {
            const response = await api.get(`api/drivers/${driverId}`, {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            })
            setDriver(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchVehicles()
        fetchDetails()
    }, [driverId])

    const handleInput = (e) => {
        if (e.target.name === "driving_license") {
            setLicense(e.target.files[0])
        }
        else {
            setDriver({ ...driver, [e.target.name]: e.target.value })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let access = localStorage.getItem('access')
        const formData = new FormData()
        // formData.append('user', driver.user?.id)
        formData.append('vehicle_assigned', driver.vehicle_assigned)
        formData.append('driver_address', driver.driver_address)
        formData.append('driver_experience', driver.driver_experience)
        formData.append('license_expiry_date', driver.license_expiry_date)
        if (license) {
            formData.append('driving_license', license)
        }
        try {
            const response = await api.put(`api/drivers/${driverId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${access}`,
                }
            })
            alert('Driver Update successfully.')
            navigate('/home/drivers')
        } catch (error) {
            setError(error.response?.data.non_field_errors)
            // console.log(error.response?.data.non_field_errors)
        }

    }

    // console.log(driver);
    const userDetail = users.find(user => user.id === driver.user)

    return (
        <div style={containerStyle} >
            <Form style={loginForm} encType="multipart/form-data" onSubmit={handleSubmit} >
                <h2 style={{ textAlign: "center", color: "#333333", }}>Update Driver Details</h2>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>


                    {/* <span color="blue">{userDetail?.profile_image.split('/').pop()}</span> */}
                    {/* <img style={{ width: "25%" }} src={myBaseURL+userDetail?.profile_image} /> */}


                    <Form.Group className="mb-3">
                        <Form.Label style={label}>First Name</Form.Label>
                        <Form.Control style={Input} type="text" name='first_name' value={userDetail?.first_name || ''} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Last Name</Form.Label>
                        <Form.Control style={Input} type="text" name='last_name' value={userDetail?.last_name || ''} disabled />
                    </Form.Group>
                    <div style={{ width: '25%', alignItems: 'center', marginTop: "2rem" }}>
                        <Link to={`updateUser/${userDetail?.id}`}>
                            <Button variant="outline-success">Update User</Button>
                        </Link>
                    </div>
                </div>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Assigned Vehicle</Form.Label>
                        <Form.Select size="sm" name="vehicle_assigned" value={driver.vehicle_assigned || ''} onChange={handleInput}>
                            <option value="">Select vehicle</option>
                            {
                                vehicles.map((vehicle, index) => {
                                    return (
                                        <option key={index} value={vehicle.id}>{vehicle.vehicle_name}</option>
                                    )
                                })
                            }
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>License</Form.Label>
                        <Form.Control style={Input} accept=".pdf,.jpeg,.jpg" type="file" name='driving_license' onChange={handleInput} />
                        <p style={{ color: 'blue' }}>
                            {
                                license ? (license.name) :
                                    driver.driving_license?.split('/').pop()
                            }
                        </p>
                    </Form.Group>
                </div>


                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>License Expiry date</Form.Label>
                        <Form.Control style={Input} type="date" name='license_expiry_date' value={driver.license_expiry_date || ''} onChange={handleInput} required />
                    </Form.Group>
                    <Form.Group className="mb-3"  >
                        <Form.Label style={label}>Experience</Form.Label>
                        <Form.Control style={Input} type="number" name='driver_experience' placeholder="Enter experience" value={driver.driver_experience || ''} onChange={handleInput} required />
                    </Form.Group>
                </div>
                <Form.Group className="mb-3">
                    <Form.Label style={label}>Address</Form.Label>
                    <Form.Control style={Input} type="text" placeholder="Enter Address" name='driver_address' value={driver.driver_address || ''} onChange={handleInput} required />
                </Form.Group>
                <p style={{ color: 'red' }}>{error}</p>
                <hr />
                <Button className='mb-3' variant="primary" type="submit" style={button}>
                    Submit
                </Button>
                <Button className='mb-3' variant="danger" type="button" onClick={() => navigate('/home/drivers')}>
                    Cancel
                </Button>
            </Form>
        </div>
    );
}

const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}
const loginForm = {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    width: "50%",
    marginTop: "20px"
}

const label = {
    fontWeight: "bold",
    color: "#555555",
}

const Input =
{
    width: "100%",
    padding: "10px",
    border: "1px solid #918383ff",
    borderRadius: "5px",
    color: "#171111ff",
}

const button = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
}
