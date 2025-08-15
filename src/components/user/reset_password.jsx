import { useState } from "react";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router";
import api from "../../Api";
export default function ResetPassword() {
    const navigate = useNavigate()
    const { uid } = useParams()
    const { token } = useParams()
    const [passwords, setPasswords] = useState({
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
        if (passwords.confirm !== passwords.new) {
            setError(" New and Confirm Password do not match")
            setLoading(false)
            return
        }
        try {
            const response = await api.post(`/api/users/resetPassword/${uid}/${token}/`, {new_password:passwords.new})
            alert(response.data.message)
            navigate('/login_page')

        } catch (error) {
            setError(error.response.data.message)
        }
        setLoading(false)
    }

    return (
        <div style={containerStyle} >
            {
                loading ? <p>Loading...</p> :

                    <Form style={passwordForm} onSubmit={handleSubmit} >
                        <h2 style={{ textAlign: "center", color: "#333333", }}>Reset Password</h2>
                        <hr />

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
