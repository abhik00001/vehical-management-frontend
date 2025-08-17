
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import api, { myBaseURL } from "../../Api";
import { useNavigate } from "react-router";

export default function MyProfile() {
    const navigate = useNavigate()
    const [user, setUser] = useState([])
    const [loading, setLoading] = useState(false)

    async function fetchDetail() {
        const access = localStorage.getItem('access')
        try {
            const response = await api.get(`/api/users/profileData`, {
                headers: {
                    'Authorization': `Bearer ${access}`,
                }
            })
            setUser(response.data)
        } catch (error) {
            if (error.response?.status === 401) {
                const newAccess = await RefreshAccessToken()
                if (newAccess) {
                    const response = await api.get(`/api/users/profileData`, {
                        headers: {
                            'Authorization': `Bearer ${access}`,
                        }

                    })
                    setUser(response.data)
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

    const handleButton = () => {
        navigate('/home/updateProfile')
    }

    return (
        <>
            {
                loading ? <div>Loading...</div> :
                    <div style={styles}>

                        <h2 style={{ textAlign: "center", color: 'black' }}>My Profile</h2>
                        <hr />

                        {/* {
                    updateBox? <MyProfileUpdate /> : 
                    
                } */}
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", }}>
                            <div style={detail}>
                                {/* <span ><img src={`${myBaseURL}${user.profile_image}`} /></span> */}
                                <span className="badge badge-primary" >{user.profile_image?.split('/').pop()}</span>

                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-evenly",
                                }}>
                                    <span >First Name : {user.first_name}</span>
                                    <br />
                                    <span >Last Name : {user.last_name}</span>
                                    <br />
                                    <span >Email : {user.email}</span>
                                    <br />
                                    <span >Date of Birth : {user.date_of_birth}</span>
                                    <br />
                                </div>

                            </div>

                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '20px' }}>
                            <Button variant="primary" onClick={handleButton}>Update Profile</Button>

                        </div>
                    </div>
            }
        </>
    )
}

const detail = {
    width: "100%",
    display: "flex",
    // flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    margin: "20px",
    // border:".5px solid black",
    boxShadow: "inset rgba(0, 0, 0, 0.2) -5px -3px 18px 0rem",

}

const styles = {
    width: "80%",
    // border:"2px solid green",
    margin: "20px auto",
    padding: "20px",
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
}

