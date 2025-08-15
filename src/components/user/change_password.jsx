import { useState } from "react";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { RefreshAccessToken } from "../../authentication/auth";
import api from "../../Api";
export default function PasswordChange() {
    const navigate = useNavigate()
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const handleInput = (e) => {
        setPasswords((prev) => ({
            ...prev, [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const access = localStorage.getItem('access')
        try {
            const response = await api.post('api/users/passwordChange/', passwords, {
                headers: {
                    'Authorization': `Bearer ${access}`,
                }
            })
            alert('Password Changed Successfully')
            navigate("/home")
        } catch (error) {
            if (error.response?.status === 401) {
                const newAccess = await RefreshAccessToken()
                if (newAccess) {
                    const response = await api.post('api/users/passwordChange/', passwords, {
                        headers: {
                            'Authorization': `Bearer ${newAccess}`,
                        }
                    })
                    alert('Password Changed Successfully')
                    navigate("/home")
                } else {
                    console.log('Failed to refresh token')
                    localStorage.removeItem('access')
                    navigate("/")

                }
            } else {
                setError(error.response?.data.message)
                console.log(error.response?.data.message)
            }
        }
        setLoading(false)
    }

    return (
        <div style={containerStyle} >
            {
                loading ? <p>Loading...</p> :

                    <Form style={passwordForm} onSubmit={handleSubmit} >
                        <h2 style={{ textAlign: "center", color: "#333333", }}>Change Password</h2>
                        <hr />
                        <Form.Group className="mb-3" >
                            <Form.Label style={label}>Current Password</Form.Label>
                            <Form.Control style={Input} type="password" placeholder="Enter Current Password" onChange={handleInput} name="current" autoComplete="current-password" required />

                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label style={label}>New Password</Form.Label>
                            <Form.Control style={Input} type="password" placeholder="Enter New Password" name="new" onChange={handleInput} autoComplete="new-password" required />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label style={label}>Confirm New Password</Form.Label>
                            <Form.Control style={Input} type="password" placeholder="Confirm Password" name="confirm" onChange={handleInput} autoComplete="new-password" required />
                        </Form.Group>
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <Button className='mb-3' variant="primary" type="submit" style={button}>
                            Submit
                        </Button>

                        <p style={{ textAlign: "center" }}><Link to={"/home"}>Back</Link></p>
                    </Form>
            }
        </div>
    );
}

const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
}
const passwordForm = {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    width: "30%"
}

const label = {
    fontWeight: "bold",
    color: "#555555",
}

const Input =
{
    width: "100%",
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
