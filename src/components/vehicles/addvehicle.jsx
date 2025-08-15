import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import api from "../../Api";
import { RefreshAccessToken } from "../../authentication/auth";
import { Navigate, useNavigate } from "react-router";

export default function AddVehicle() {
    const navigate  = useNavigate()
    const [error, setError] = useState('')
    const [vehicle, setVehicle] = useState({
        type : '',
        vehicle_name : '',
        vehicle_model : '',
        vehicle_year : 0,
        chassi_number : '',
        registration_number : '',
        description:'',
    })
    const [image,setImage] = useState('')

    const handleInput = (e)=>{
        if (e.target.name === 'image'){
            setImage(e.target.files[0])
        }
        setVehicle((prev)=>({
            ...prev, [e.target.name] : e.target.value
        }))
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const access = localStorage.getItem('access')
        const formData = new FormData();
        formData.append('vehicle_type',vehicle.type)
        formData.append('vehicle_name',vehicle.vehicle_name)
        formData.append('vehicle_model',vehicle.vehicle_model)
        formData.append('vehicle_year',vehicle.vehicle_year)
        formData.append('chassi_number',vehicle.chassi_number)
        formData.append('registration_number',vehicle.registration_number)
        formData.append('vehicle_description',vehicle.description)
        if (image){
            formData.append('vehicle_img',image)
        }
        try{
            const response = await api.post('api/vehicles/', formData,{
                headers:{
                    'Authorization': `Bearer ${access}`
                }
            })
            navigate('/home/vehicles')
        } catch(error){
            if (error.response?.status === 401){
                const newAccess = await RefreshAccessToken()
                if (newAccess){
                    const response = await api.post('api/vehicles/', formData,{
                        headers:{
                            'Authorization': `Bearer ${newAccess}`
                        }
                    })
                    navigate('/home/vehicles')
                } else {
                    console.log('Failed to refresh access token')
                    navigate('/')
                }
            }else{
                setError(error.response.data.error)
                console.log(error)
            }
        }
    }
    // console.log(vehicle);
    
    return (
        <div style={containerStyle} >
            <Form style={loginForm} onSubmit={handleSubmit} >
                <h2 style={{ textAlign: "center", color: "#333333", }}>Add Vehicle</h2>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3" style={{ marginTop: "auto" }}>
                        <Form.Label style={label}>Type</Form.Label>
                        <select name='type' onChange={handleInput} required >
                            <option value="">Select type</option>
                            <option value="LTV">LTV</option>
                            <option value="HTV">HTV</option>
                        </select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Image</Form.Label>
                        <Form.Control style={Input} accept=".jpeg,.jpg,.png" type="file" name='image' onChange={handleInput} required />
                    </Form.Group>

                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Vehicle Name</Form.Label>
                        <Form.Control style={Input} type="text" placeholder="Enter Vehicle Name" name='vehicle_name' onChange={handleInput} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Vehicle Model</Form.Label>
                        <Form.Control style={Input} type="text" placeholder="Enter Model" name='vehicle_model' onChange={handleInput} required />
                    </Form.Group>
                    <Form.Group className="mb-3"  > 
                        <Form.Label style={label}>Vehicle Year</Form.Label>
                        <Form.Control style={Input} type="number" name='vehicle_year' placeholder="Enter Year" onChange={handleInput} required />
                    </Form.Group>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3"  >
                        <Form.Label style={label}>Chassi Number</Form.Label>
                        <Form.Control style={Input} type="text" name='chassi_number' placeholder="Enter Chassi Number" onChange={handleInput} required />
                    </Form.Group>
                    <Form.Group className="mb-3"  >
                        <Form.Label style={label}>Registration Number</Form.Label>
                        <Form.Control style={Input} type="text" name='registration_number' placeholder="Enter Registration Number" onChange={handleInput} required />
                    </Form.Group>
                </div>
                
                <Form.Group className="mb-3"  >
                    <Form.Label style={label}>Description</Form.Label>
                    <Form.Control style={Input} as={'textarea'} rows={3} placeholder="Enter Description of Vehicle" name='description' onChange={handleInput} required />

                </Form.Group>
                <p style={{ color: 'red' }}>{error}</p>
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
