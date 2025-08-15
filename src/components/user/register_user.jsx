import { useEffect, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router';
import api from '../../Api';
import { RefreshAccessToken } from '../../authentication/auth';

export default function RegisterUser() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const userRole = user.role
    // const [uid, setUid] = useState('')
    const [error, setError] = useState('')
    const [data, setData] = useState({
        role: '',
        email: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
    })
    const [image, setImage] = useState('')

    const handleInput = (e) => {
        setData((prev) => ({
            ...prev, [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
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
            const response = await api.post('api/users/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${access}`
                }
            })
            // setUid(response.data.uid)
            alert('Email has been sent to the user')
            if (response.data.data?.role === 'driver') {
                navigate(`/home/AddDriver/${response.data.uid}`)
            }
            else if (response.data.data?.role === 'manager') {
                navigate('/home/managers')
            }
            else {
                navigate('/')
            }
        } catch (error) {
            if (error.response?.status === 401) {
                const newAccess = await RefreshAccessToken()
                if (newAccess) {
                    const response = await api.post('api/users/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${newAccess}`
                        }
                    })
                    setUid(response.data.uid)
                    alert('Email has been sent to the user')
                    if (response.data.data?.role === 'driver') {
                        navigate(`/home/AddDriver/${uid}`)
                    }
                    else if (response.data.data?.role === 'manager') {
                        navigate('/home/managers')
                    }
                    else {
                        navigate('/')
                    }
                } else {
                    alert('Failed to refresh token')

                }
            } else {
                alert('Failed to send email')
                console.log(error);
                setError(error.response.data.error)
            }
        }
    }

    return (
        <div style={containerStyle} >
            <Form style={loginForm} onSubmit={handleSubmit}  >
                <h2 style={{ textAlign: "center", color: "#333333", }}>Add User</h2>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3" style={{ marginTop: "auto" }}>
                        <Form.Label style={label}>Role</Form.Label>
                        <select name='role' value={data.role} onChange={handleInput} required >
                            <option value="">Select Role</option>
                            {
                                userRole === 'admin' ? <option value="admin">Admin</option> : null
                            }
                            <option value="manager">Manager</option>
                            <option value="driver">Driver</option>
                        </select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label style={label}>Email address</Form.Label>
                        <Form.Control style={Input} type="email" name='email' placeholder="Enter email" value={data.email} onChange={handleInput} required />
                    </Form.Group>

                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>First Name</Form.Label>
                        <Form.Control style={Input} type="text" placeholder="Enter First Name" name='first_name' value={data.first_name} onChange={handleInput} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Last Name</Form.Label>
                        <Form.Control style={Input} type="text" placeholder="Enter Last Name" name='last_name' value={data.last_name} onChange={handleInput} required />
                    </Form.Group>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3"  >
                        <Form.Label style={label}>Date of Birth</Form.Label>
                        <Form.Control style={Input} type="date" name='date_of_birth' value={data.date_of_birth} onChange={handleInput} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Image</Form.Label>
                        <Form.Control style={Input} accept='.jpeg,.jpg,.png' name='image' type="file" onChange={(e) => setImage(e.target.files[0])} required />
                    </Form.Group>
                </div>
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
