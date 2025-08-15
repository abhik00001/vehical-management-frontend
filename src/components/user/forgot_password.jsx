import Button from "react-bootstrap/esm/Button";
import { Link, useNavigate } from "react-router";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import api from "../../Api";
export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const response = await api.post('api/users/passwordForgot/', {email})
            alert(response.data.message)
        } catch(error){
            alert(error.response.message)
        }
    }
    return (
        <div style={containerStyle} >
            <Form style={passwordForm} onSubmit={handleSubmit}>
                <h2 style={{ textAlign: "center", color: "#333333", }}>Forgot Password</h2>
                <hr />
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={label}>Email address</Form.Label>
                    <Form.Control style={Input} type="email" placeholder="Enter email" onChange={(e)=> setEmail(e.target.value)}/>
                </Form.Group>
                <br />
                <Button className='mb-3' variant="primary" type="submit" style={button}>
                    Submit
                </Button>

                <p style={{ textAlign: "center" }}><Link to={"/login_page"}>Back</Link></p>
            </Form>
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

