import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import api from "../../Api";
import { RefreshAccessToken } from "../../authentication/auth";
import { useNavigate, useParams } from "react-router";

export default function AddDriver() {
    const { userEmail } = useParams()
    const navigate = useNavigate()
    const [details, setDetails] = useState({})
    const [license, setLicense] = useState('')
    const [vehicles, setVehicles] = useState([])
    const handleInput = (e) => {
        if (e.target.type === "file") {
            setLicense(e.target.files[0])
        }
        else {
            setDetails((prev) => ({
                ...prev, [e.target.name]: e.target.value
            }))
        }
    }

    const fetchVehicles = async () => {
        const access = localStorage.getItem('access')
        try {
            const response = await api.get('api/vehicles', {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            })
            setVehicles(response.data.data)
        } catch (error) {
            if (error.response?.status === 401) {
                const refreshToken = await RefreshAccessToken()
                if (refreshToken) {
                    const response = await api.get('api/vehicles', {
                        headers: {
                            'Authorization': `Bearer ${access}`
                        }
                    })
                    setVehicles(response.data.data)
                } else {
                    console.log('Refresh token failed')
                    navigate('/')
                }
            } else {
                console.log('Failed to fetch vehicles')
                console.log(error);

            }
        }
    }

    useEffect(() => {
        fetchVehicles()
    }, [userEmail])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const access = localStorage.getItem('access')
        const formData = new FormData()
        formData.append('user', userEmail)
        formData.append('vehicle_assigned', details.vehicle_id ? details.vehicle_id : '')
        formData.append('license_expiry_date', details.expiry)
        formData.append('driver_experience', details.experience)
        formData.append('driver_address', details.address)
        if (license) {
            formData.append('driving_license', license)
        }

        try {
            const response = await api.post(`api/drivers/`, formData, {
                headers: {
                    'Authorization': `Bearer ${access}`,
                }
            })
            alert('Driver Added Successfully')
            navigate('/home/drivers')
        } catch (error) {
            if (error.response?.status === 401) {
                const refreshToken = await RefreshAccessToken()
                if (refreshToken) {
                    const response = await api.post('api/drivers/', formData, {
                        headers: {
                            'Authorization': `Bearer ${access}`,
                        }
                    })
                    alert('Driver Added Successfully')
                    navigate('/home/drivers')
                } else {
                    console.log('Refresh token failed')
                    navigate('/')
                }
            } else {
                console.log('Failed to add driver')
                console.log(error)
            }
        }
    }

    
    return (
        <div style={containerStyle} >
            <Form style={loginForm} onSubmit={handleSubmit}>
                <h2 style={{ textAlign: "center", color: "#333333", }}>Add Driver</h2>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3" style={{ marginTop: "auto" }}>
                        <Form.Label style={label}>Assign Vehicle</Form.Label>
                        <Form.Select size="sm" name="vehicle_id" onChange={handleInput}>
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
                        <Form.Control style={Input} accept=".pdf,.jpeg,.jpg" type="file" name='license' onChange={handleInput} required />
                    </Form.Group>

                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>License Expiry date</Form.Label>
                        <Form.Control style={Input} type="date" name='expiry' onChange={handleInput} required />
                    </Form.Group>
                    <Form.Group className="mb-3"  >
                        <Form.Label style={label}>Experience</Form.Label>
                        <Form.Control style={Input} type="number" name='experience' placeholder="Enter experience" onChange={handleInput} required />
                    </Form.Group>
                </div>
                <Form.Group className="mb-3">
                    <Form.Label style={label}>Address</Form.Label>
                    <Form.Control style={Input} type="text" placeholder="Enter Address" name='address' onChange={handleInput} required />
                </Form.Group>
                {/* <p style={{ color: 'red' }}>{error}</p> */}
                <hr />
                <Button className='mb-3' variant="primary" type="submit" style={button}>
                    Submit
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
