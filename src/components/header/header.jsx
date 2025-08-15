import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Dropdown } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router';

export default function Header() {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        navigate('/')
    }
    const user = JSON.parse(localStorage.getItem('user'))
    const role = user.role

    return (
        <>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                    <Navbar.Brand href="/">Navbar</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/">Dashboard</Nav.Link>
                        {
                            (role === 'admin' || role === 'manager') && (

                                <>
                                    <Nav.Link  as={Link} to="vehicles">Vehicles</Nav.Link>
                                    <Nav.Link as={Link} to="drivers">Drivers</Nav.Link>
                                </>
                            )
                        }
                        {
                            role === 'admin' && (
                                <Nav.Link as={Link} to="managers">Managers</Nav.Link>
                            )
                        }
                    </Nav>
                    <Nav className="me">
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-basic">
                                <img style={{ width: "32px" }} src="https://img.icons8.com/?size=100&id=bzanxGcmX3R8&format=png&color=000000" alt="no img.." />
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ left: "-25px " }}>
                                <p style={{ paddingLeft: '18px', textTransform: 'uppercase', margin: 0, color: 'darkgray' }} aria-disabled>{user.first_name} {user.last_name}</p>
                            <hr style={{ margin: 2 }} />
                                <Dropdown.Item  onClick={()=> navigate('/home/myprofile')}>My Profile</Dropdown.Item>
                                <Dropdown.Item  onClick={()=> navigate('/home/passwordChange')} >Change Password</Dropdown.Item>
                                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Container>
            </Navbar>
            <Outlet />
        </>
    );
}



