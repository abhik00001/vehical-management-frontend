import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import api, { myBaseURL } from "../../Api";
import { RefreshAccessToken } from "../../authentication/auth";


export default function MyProfileUpdate() {
    const [userDetail, setUserDetail] = useState([])
    const navigate = useNavigate()
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleInput = (e) => {
        setUserDetail({ ...userDetail, [e.target.name]: e.target.value })
    }

    async function fetchDetail() {
        const access = localStorage.getItem('access')
        try {
            const response = await api.get(`/api/users/profileData`, {
                headers: {
                    'Authorization': `Bearer ${access}`,
                }
            })
            setUserDetail(response.data)
        } catch (error) {
            if (error.response?.status === 401) {
                const newAccess = await RefreshAccessToken()
                if (newAccess) {
                    const response = await api.get(`/api/users/profileData`, {
                        headers: {
                            'Authorization': `Bearer ${access}`,
                        }

                    })
                    setUserDetail(response.data)
                } else {
                    console.log('failed to refresh token');
                    localStorage.removeItem('access')
                    navigate('/')

                }
            } else {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        setLoading(true)
        fetchDetail()
        setLoading(false)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append('first_name', userDetail.first_name)
        formData.append('last_name', userDetail.last_name)
        formData.append('email', userDetail.email)
        formData.append('date_of_birth', userDetail.date_of_birth)
        if (image) {
            formData.append('profile_image', image)
        }
        try {
            let access = localStorage.getItem('access')
            const response = await api.put(`/api/users/profileData`, formData, {
                headers: {
                    'Authorization': `Bearer ${access}`,
                }
            })
            // console.log(response.data)
            alert('Profile Updated .')
            navigate('/home/myprofile')
            
        } catch (error) {
            if (error.response?.status === 401) {
                const newAccess = await RefreshAccessToken()
                if (newAccess) {
                    const response = await api.put(`/api/users/profileData`, formData, {
                        headers: {
                            'Authorization': `Bearer ${access}`,
                        }
                    })
                    alert('Profile Updated .')
                    navigate('/home/myprofile')
                } else {
                    console.log('failed to refresh token');
                    localStorage.removeItem('access')
                    navigate('/')
                }
            } else {
                console.log(error)
            }
        }
        setLoading(false)
    }

    // console.log(userDetail);


    const handleCancel = () => {
        navigate('/home/MyProfile')
    }



    return (
        <div style={styles}>
            {
                loading ? <p>Loading ... </p> :
                    (
                        <>
                            <h2 style={{ textAlign: "center", color: 'black' }}>My Profile</h2>
                            <hr />
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Form style={loginForm} onSubmit={handleSubmit} >
                                    <Form.Label style={label}> Profile Image :</Form.Label>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <img style={{ marginBottom: "4px", width: '40%', height: "50%" }} src={`${myBaseURL}${userDetail.profile_image}`} alt="No profile Image" />
                                        <Form.Group className="mb-3">
                                            <Form.Control style={Input} type="file" accept=".jpeg,.jpg" onChange={(e) => setImage(e.target.files[0])} />
                                            <p style={{ margin: '8px', color: 'blue' }}>
                                                {
                                                    image ? image.name :
                                                        userDetail.profile_image ? (userDetail.profile_image).split('/').pop()
                                                            : 'No Image'
                                                }</p>
                                        </Form.Group>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={label}> First Name</Form.Label>
                                            <Form.Control style={Input} type="text" placeholder="Enter your first name" value={userDetail.first_name || ''} name="first_name" onChange={handleInput} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={label}> Last Name</Form.Label>
                                            <Form.Control style={Input} type="text" placeholder="Enter your last name" value={userDetail.last_name || ''} name="last_name" onChange={handleInput} />
                                        </Form.Group>


                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={label}> Email </Form.Label>
                                            <Form.Control style={Input} type="text" placeholder="Enter your email" value={userDetail.email || ''} name="email" onChange={handleInput} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={label}> Date OF Birth</Form.Label>
                                            <Form.Control style={Input} type="date" value={userDetail.date_of_birth || ''} name="date_of_birth" onChange={handleInput} />
                                        </Form.Group>


                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '20px' }}>
                                        <Button className='mb-3' variant="primary" type="submit" >
                                            Submit
                                        </Button>
                                        <Button className='mb-3' variant="danger" type="button" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </>
                    )
            }
        </div>
    );
}



const loginForm = {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    width: "50%",
    marginTop: "auto",
    alignItems: 'center'
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

// const button = {
//     width: "100%",
//     padding: "10px",
//     backgroundColor: "#007bff",
//     border: "none",
//     borderRadius: "5px",
//     color: "#ffffff",
//     fontSize: "16px",
//     cursor: "pointer",
// }
const styles = {
    width: "80%",
    // border:"2px solid green",
    margin: "20px auto",
    padding: "20px",
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
}
