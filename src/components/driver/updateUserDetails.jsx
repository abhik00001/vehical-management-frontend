import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import api from "../../Api";
import { RefreshAccessToken } from "../../authentication/auth";

export default function DriverUpdate() {
    const navigate = useNavigate()
    // const user = JSON.parse(localStorage.getItem('user'))
    // const userRole = user.role
    const { userId } = useParams()

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null)

    const fetchData = async () => {
        setLoading(true)
        const access = localStorage.getItem('access')
        try {
            const response = await api.get(`api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            setData(response.data)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchData()
    }, [userId])

    const handleInput = (e)=>{
        if (e.target.name === 'profile_image'){
            setImage(e.target.files[0])
        }
        setData({...data, [e.target.name]:e.target.value})
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const access = localStorage.getItem('access')
        const formData = new FormData()
        formData.append('role', data.role)
        formData.append('email', data.email)
        formData.append('first_name', data.first_name)
        formData.append('last_name', data.last_name)
        formData.append('date_of_birth', data.date_of_birth)

        if (image) {
        formData.append('profile_image', image)
        }
        try {
            const response = await api.put(`api/users/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${access}`,
                }
            })
            alert('updated successfully')
            navigate('/home/drivers')
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }
    
    return (
        <div style={containerStyle} >
            <Form style={loginForm} encType="multipart/form-data" onSubmit={handleSubmit}   >
                <h2 style={{ textAlign: "center", color: "#333333", }}>Update Driver</h2>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3" style={{ marginTop: "auto" }}>
                        <Form.Label style={label}>Role</Form.Label>
                        <select name='role' value={data.role || ''} onChange={handleInput} disabled >
                            <option value="">Select type</option>
                            {/* {
                                (userRole === "admin") && (
                                    <option value="admin">Admin</option>
                                )
                            }
                            <option value="manager">Manager</option> */}
                            <option value="driver">Driver</option>
                        </select>
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>First Name</Form.Label>
                        <Form.Control style={Input} type="text" placeholder="Enter First Name" name='first_name' value={data.first_name || ''} onChange={handleInput} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Last Name</Form.Label>
                        <Form.Control style={Input} type="text" placeholder="Enter Last Name" name='last_name' value={data.last_name || ''} onChange={handleInput} required />
                    </Form.Group>

                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Image</Form.Label>
                        <Form.Control style={Input} accept=".jpeg,.jpg,.png" type="file" name='profile_image' onChange={handleInput} />
                        <p style={{ color: 'blue' }}>
                            {
                                image ? image.name :
                                    data.profile_image?.split('/').pop()
                            }
                        </p>
                    </Form.Group>

                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3"  >
                        <Form.Label style={label}>Email</Form.Label>
                        <Form.Control style={Input} type="email" name='email' placeholder="Enter your email" value={data.email || ''} onChange={handleInput} required />
                    </Form.Group>

                    <Form.Group className="mb-3"  >
                        <Form.Label style={label}>Date Of Birth</Form.Label>
                        <Form.Control style={Input} type="date" name='date_of_birth' value={data.date_of_birth || ''} onChange={handleInput} required />
                    </Form.Group>


                </div>

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
