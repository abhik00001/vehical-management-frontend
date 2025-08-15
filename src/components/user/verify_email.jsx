import { useState } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router";
import api from "../../Api";


export default function VerifyEmail() {
    const [loading, setLoading] = useState(false)
    const { email } = useParams();
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const access = localStorage.getItem('access')
        setLoading(true)
        try {
            if (password === confirmpassword) {
                const response = await api.post('api/users/verify-email/', { email, password })
                setMessage(response.data.message)
                if (response.data.data?.role === 'driver') {
                    alert('Driver Added Successfully. Add More Details of Driver')
                    navigate(`/login_page`)
                }
                else {
                    alert('User Added Successfully')
                    navigate('/login_page')
                }
            } else {
                setMessage('Passwords do not match')
            }
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    return (
        <div style={containerStyle} onSubmit={handleSubmit} >
            {
                loading ? (<div>Loading...</div>) :
                    (<Form style={passwordForm}>
                        <h2 style={{ textAlign: "center", color: "#333333", }}>Set Password </h2>
                        <hr />
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label style={label}>Password</Form.Label>
                            <Form.Control style={Input} type="password" name='password' placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label style={label}>Confirm Password</Form.Label>
                            <Form.Control style={Input} type="password" name='ConfirmPassword' placeholder="Password" onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </Form.Group>
                        <p style={{ color: 'red' }}>{
                            message ? message : undefined
                        }</p>
                        <Button className='mb-3' variant="primary" type="submit" style={button}>
                            Submit
                        </Button>

                        <p style={{ textAlign: "center" }}><Link to={"/login_page"}>Back</Link></p>
                    </Form>)
            }
        </div>
    );
}

const containerStyle = {
    display: "grid",
    placeItems: "center",
    height: "100vh",
}
const passwordForm = {
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

