import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router';
import api from '../../Api';


export default function LoginPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleInput = (e) => {
        setFormData((prev) => ({
            ...prev, [e.target.name]: e.target.value
        }))
    }
    const SubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await api.post('api/users/login/', formData)
            const expiryTime = Date.now() + 30 * 60 * 1000  
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('access_expiry', expiryTime.toString());
            localStorage.setItem('refresh', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/home')
        } catch (err) {
            setError(err.response.data.message)
            console.log(err);
        }
        setLoading(false)
    }
    return (
        <div style={containerStyle}>
            {
                loading ? <p>Loading...</p> :

                    <Form style={loginForm} onSubmit={SubmitForm} >
                        <h2 style={{ textAlign: "center", color: "#333333", }}>LOGIN</h2>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label style={label}>Email address</Form.Label>
                            <Form.Control style={Input} type="email" name='email' placeholder="Enter email" onChange={handleInput} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label style={label}>Password</Form.Label>
                            <Form.Control style={Input} type="password" name='password' placeholder="Password" onChange={handleInput} required />
                        </Form.Group>
                        <p style={{ color: "red" }}>{error}</p>
                        <Button className='mb-3' variant="primary" type="submit" style={button}>
                            Submit
                        </Button>
                        <p style={{ textAlign: "center" }}><Link to={'/forgot_password'} >Forgot Password?</Link></p>
                    </Form>
            }
        </div>
    );
}

const containerStyle = {
    display: "grid",
    placeItems: "center",   // shorthand for align-items and justify-content
    height: "100vh",
}
const loginForm = {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    width: '30%'
}

const label = {
    fontWeight: "bold",
    color: "#555555",
}

const Input =
{
    width: "90%",
    padding: "10px",
    border: "1px solid #cccccc",
    borderRadius: "5px",
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