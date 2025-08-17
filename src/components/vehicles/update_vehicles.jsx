import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import api from "../../Api";
import { RefreshAccessToken } from "../../authentication/auth";

export default function VehicleUpdate() {
    const navigate = useNavigate()
    const { vehicleId } = useParams()
    

    const [data, setData] = useState({})
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        const access = localStorage.getItem('access')
        try {
            const response = await api.get(`api/vehicles/${vehicleId}`, {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            })
            setData(response.data)
        } catch (error) {
            if (error.response?.status === 401) {
                const refreshToken = await RefreshAccessToken()
                if (refreshToken) {
                    const response = await api.get(`api/vehicles/${vehicleId}`, {
                        headers: {
                            'Authorization': `Bearer ${refreshToken}`
                        }
                    })
                    setData(response.data)
                } else {
                    console.log('Refresh token failed')

                }
            } else {
                console.log('Error fetching data')
                console.log(error);
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        fetchData()
        setLoading(false)
    }, [vehicleId])

    const handleInput = (e) => {
        if (e.target.name === 'image') {
            setImage(e.target.files[0])
        }
        else {
            setData({ ...data, [e.target.name]: e.target.value })
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append('vehicle_type', data.vehicle_type )
        formData.append('vehicle_name', data.vehicle_name )
        formData.append('vehicle_model', data.vehicle_model )
        formData.append('vehicle_year', data.vehicle_year )
        formData.append('chassi_number', data.chassi_number )
        formData.append('registration_number', data.registration_number )
        formData.append('vehicle_description', data.vehicle_description )
        if (image) {
            formData.append('vehicle_img', image)
        }
        const access = localStorage.getItem('access')
        try {
            const response = await api.put(`api/vehicles/${vehicleId}`, formData,{
                headers: {
                    Authorization: `Bearer ${access}`,
                }
            })
            alert('Data updated successfully')
            navigate('/home/vehicles')
        }
        catch (error) {
            console.log(error)
        }

    }

    return (
        <div style={containerStyle} >
            <Form style={loginForm}  encType="multipart/form-data" onSubmit={handleSubmit} >
                <h2 style={{ textAlign: "center", color: "#333333", }}>Update Vehicle</h2>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3" style={{ marginTop: "auto" }}>
                        <Form.Label style={label}>Type</Form.Label>
                        <select name='type' value={data.vehicle_type || ''} onChange={handleInput} required >
                            <option value="">Select type</option>
                            <option value="LTV">LTV</option>
                            <option value="HTV">HTV</option>
                        </select>
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Vehicle Name</Form.Label>
                        <Form.Control style={Input} type="text" placeholder="Enter Vehicle Name" name='vehicle_name' value={data.vehicle_name || ''} onChange={handleInput} required />
                    </Form.Group>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Image</Form.Label>
                        <Form.Control style={Input} accept=".jpeg,.jpg,.png" type="file" name='image' onChange={handleInput} />
                        <p style={{ color: 'blue' }}>{
                            image? image.name:
                            data.vehicle_img?.split('/').pop()

                        }</p>
                    </Form.Group>

                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Vehicle Model</Form.Label>
                        <Form.Control style={Input} type="text" placeholder="Enter Model" name='vehicle_model' value={data.vehicle_model || ''} onChange={handleInput} required />
                    </Form.Group>
                    <Form.Group className="mb-3"  >
                        <Form.Label style={label}>Vehicle Year</Form.Label>
                        <Form.Control style={Input} type="number" name='vehicle_year' placeholder="Enter Year" value={data.vehicle_year || ''} onChange={handleInput} required />
                    </Form.Group>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3"  >
                        <Form.Label style={label}>Chassi Number</Form.Label>
                        <Form.Control style={Input} type="text" name='chassi_number' placeholder="Enter Chassi Number" value={data.chassi_number || ''} onChange={handleInput} required />
                    </Form.Group>
                    <Form.Group className="mb-3"  >
                        <Form.Label style={label}>Registration Number</Form.Label>
                        <Form.Control style={Input} type="text" name='registration_number' placeholder="Enter Registration Number" value={data.registration_number || ''} onChange={handleInput} required />
                    </Form.Group>
                </div>

                <Form.Group className="mb-3"  >
                    <Form.Label style={label}>Description</Form.Label>
                    <Form.Control style={Input} as={'textarea'} rows={3} placeholder="Enter Description of Vehicle" name='vehicle_description' value={data.vehicle_description || ''} onChange={handleInput} required />

                </Form.Group>
                {/* <p style={{ color: 'red' }}>{error}</p> */}
                <hr />
                <Button className='mb-3' variant="primary" type="submit" style={button}>
                    Submit
                </Button>
                <Button className='mb-3' variant="danger" type="button" onClick={()=>navigate('/home/vehicles')}>
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
