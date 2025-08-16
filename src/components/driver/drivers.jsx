import React from 'react';
import { useEffect, useState } from "react"
import { Button, Dropdown, DropdownItemText, Form, Modal, Pagination, Table } from "react-bootstrap"
import api, { myBaseURL } from "../../Api"
import { RefreshAccessToken } from "../../authentication/auth"
import { useNavigate } from "react-router"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { fas } from '@fortawesome/free-solid-svg-icons'

export default function DriversList() {
    const navigate = useNavigate()
    const [drivers, setDrivers] = useState([])
    const [driversDetails, setDriversDetails] = useState([])
    const [vehicleDetail, setVehicleDetail] = useState([])
    const [search, setSearch] = useState('')
    const [show, setShow] = useState(false)
    const [driverId, setDriverId] = useState('')
    const [users, setUsers] = useState([])
    const [status, setStatus] = useState(null)
    const [createdby, setCreatedby] = useState(null)



    const fetchDrivers = async () => {
        const access = localStorage.getItem('access')
        try {

            if (access) {
                const response = await api.get('api/drivers/', {
                    headers: {
                        'Authorization': `Bearer ${access}`
                    }
                })
                setDrivers(response.data.driverUsers)
                setDriversDetails(response.data.driverDetail)
                setVehicleDetail(response.data.vehicles)
                setUsers(response.data.allusers)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                const newAccess = await RefreshAccessToken()
                if (newAccess) {
                    const response = await api.get('api/drivers/', {
                        headers: {
                            'Authorization': `Bearer ${newAccess}`
                        }
                    })
                    setDrivers(response.data)
                    setDriversDetails(response.data.driverDetail)
                    setVehicleDetail(response.data.vehicles)
                    setUsers(response.data.allusers)
                } else {
                    console.log("Access token is invalid")
                    localStorage.removeItem('access')
                    navigate('/')
                }
            } else {
                console.log(error)
            }
        }
    }
    useEffect(() => {
        fetchDrivers()
    }, [])

    const handleDelete = async (value) => {

        try {
            const access = localStorage.getItem('access')
            const response = await api.delete(`api/drivers/${value}`, {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            })
            alert('Driver deleted successfully')
            fetchDrivers()
        } catch (error) {
            if (error.response?.status === 401) {
                const newAccess = await RefreshAccessToken()
                if (newAccess) {
                    const response = await api.delete(`api/drivers/${value}`, {})
                    alert('Driver deleted successfully')
                    fetchDrivers()
                } else {
                    console.log("Access token is invalid")
                    localStorage.removeItem('access')
                    navigate('/')
                }
            } else {
                console.log(error)
            }
        }
    }

    const handleStatus = async (id) => {
        const access = localStorage.getItem('access')
        try {
            const response = await api.patch(`api/drivers/${id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            })
            fetchDrivers()
        } catch (error) {
            if (error.response?.status === 401) {
                const newAccess = await RefreshAccessToken()
                if (newAccess) {
                    const response = await api.patch(`api/drivers/${id}`, {}, {
                        headers: {
                            'Authorization': `Bearer ${newAccess}`
                        }
                    })
                    fetchDrivers()
                } else {
                    console.log("Access token is invalid")
                    localStorage.removeItem('access')
                    navigate('/')
                }
            } else {
                console.log(error)
            }
        }
    }

    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const fliteredDrivers = drivers.filter(driver =>
        (
            `${driver.first_name}`.toLowerCase().includes(search.toLowerCase()) ||
            `${driver.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
            driver.email.toLowerCase().includes(search.toLowerCase()) ||
            driver.date_of_birth.includes(search.toLowerCase())
        ) &&
        (status === null || driver.is_active === status)
        &&
        (createdby === null || driver.created_by === createdby)

    ).sort((a, b) => {
        if (!sortField) return 0;

        const aVal = a[sortField];
        const bVal = b[sortField];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortOrder === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }

        return sortOrder === 'asc'
            ? aVal - bVal
            : bVal - aVal;
    });


    const handleSort = (field) => {
        if (sortField === field) {
            // Toggle sort order if clicking the same column
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new sort field
            setSortField(field);
            setSortOrder('asc');
        }
    };

    useEffect(() => {

    }, [search, createdby,])

    // paggination
    
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 4
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = fliteredDrivers.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(fliteredDrivers.length / itemsPerPage);

    const [hovered, setHovered] = useState(false)
    const AllUser = users.filter(user => user.role === 'manager' || user.role === 'admin')

    useEffect(() => {
        setCurrentPage(1);
    }, [search, createdby, status]);

    const handleMouseEnter = () => {
        setHovered(true)
    }


    const handleMouseLeave = () => {
        setHovered(false)
    }

    const handleEdit = (id) => {
        navigate(`/home/drivers/${id}`)
    }



    return (
        <div style={containerStyle}>
            <div style={head}>
                <Button style={{ height: '60%', margin: "auto 0" }} type="primary" onClick={() => { navigate('/home/register_user') }}>Add Driver</Button>
                <h1 >Drivers List</h1>
                <div className="d-flex" style={{ height: '60%', margin: "auto 0", justifyContent: 'space-between' }} >
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {/* <Button style={{ height: '60%', margin: "auto 0" }} variant="outline-success">filters</Button> */}
                    <Dropdown>
                        <div style={{ display: 'flex' }}>

                            <Dropdown.Toggle variant="outline-success" id="dropdown-basic">Filter </Dropdown.Toggle>
                        </div>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setStatus(true)}>Active</Dropdown.Item>
                            <Dropdown.Item onClick={() => setStatus(false)}>Inactive</Dropdown.Item>
                            <Dropdown.Header style={{ color: "black" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Created By
                                {/* <FontAwesomeIcon icon="fa-solid fa-caret-down" /> */}
                                {
                                    hovered && (
                                        <>
                                            {
                                                AllUser.map((user, index) => {
                                                    return (
                                                        <Dropdown.Item key={index} onClick={() => setCreatedby(user.id)}>{user.first_name} {user.last_name}</Dropdown.Item>
                                                    )
                                                })
                                            }
                                        </>
                                    )
                                }
                            </Dropdown.Header>
                        </Dropdown.Menu>
                    </Dropdown>
                    <span style={{ color: 'white', width: '30%', textAlign: 'center', borderRadius: '30px', cursor: 'pointer', fontSize: '10px', margin: 'auto', textDecoration: 'underline' }} onClick={() => { setCreatedby(null); setStatus(null); }}>{
                        (status === true || status === false) ? ("Clear Filter") :
                            (createdby) ? ("Clear Filter") : null
                    }</span>
                </div>
            </div>
            <hr />
            <div style={content}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Sr.No.</th>
                            <th >Profile Image</th>
                            <th onClick={() => handleSort('first_name')}>First Name</th>
                            <th onClick={() => handleSort('last_name')}>Last Name</th>
                            <th onClick={() => handleSort('email')}>Email</th>
                            <th onClick={() => handleSort('date_of_birth')}>Date Of Birth</th>
                            <th onClick={() => handleSort('driver_address')}>Address</th>
                            <th onClick={() => handleSort('driver_experience')}>Exp</th>
                            <th onClick={() => handleSort('vehicle_assigned')}>Vehicle Assigned</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                            <th onClick={() => handleSort('is_active')}>Active/Inactive</th>
                        </tr>
                    </thead>
                    <tbody>
                        <Modal show={show} onHide={() => setShow(false)} centered>
                            <Modal.Header >
                                <Modal.Title>Confirm Delete</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Are you sure you want to delete this driver?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShow(false)}>
                                    Close
                                </Button>
                                <Button variant="danger" onClick={() => {
                                    handleDelete(driverId)
                                    setShow(false)
                                }}>Confirm</Button>
                            </Modal.Footer>
                        </Modal>
                        {
                            (currentItems.length > 0) ?
                                (currentItems.map((driver, index) => {
                                    const driverDetail = driversDetails.find(detail => detail ? driver.id === detail.user : "not defined")
                                    const vehicle = vehicleDetail.find(detail => driverDetail ? detail.id === driverDetail.vehicle_assigned : "not defined")

                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td><img src={myBaseURL + driver.profile_image} width={90} height={60} /></td>
                                            <td style={{ textTransform: 'capitalize' }}>{driver.first_name}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{driver.last_name}</td>
                                            <td>{driver.email}</td>
                                            <td>{driver.date_of_birth}</td>
                                            {
                                                (driverDetail) && (
                                                    <>
                                                        <td >{driverDetail.driver_address}</td>
                                                        <td>{driverDetail.driver_experience}</td>
                                                        {
                                                            vehicle ?
                                                                <td>{vehicle.vehicle_name}</td> : <td>No Vehicle Assigned</td>
                                                        }
                                                    </>
                                                )
                                            }
                                            <td >
                                                <Button variant="warning" onClick={() => handleEdit(driverDetail.id)} >Edit</Button>
                                                <Button variant="danger" onClick={() => {
                                                    setDriverId(driver.id)
                                                    setShow(true)
                                                }}>Delete</Button>
                                            </td>
                                            <td>
                                                {
                                                    driver.is_active ? <Button variant="success" onClick={() => handleStatus(driver.id)}>Active</Button>
                                                        : <Button variant="danger" onClick={() => handleStatus(driver.id)} >InActive</Button>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })) : (<tr><td colSpan="11" style={{ textAlign: 'center' }}>No Data Found</td></tr>)
                        }
                        {/* {
                            (drivers.length === 0) && <tr><td colSpan="11" style={{ textAlign: 'center' }}>No Data Found</td></tr>
                        } */}


                    </tbody>
                </Table>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <Button
                    variant="secondary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    style={{ marginRight: '10px' }}
                >
                    Previous
                </Button>

                {[...Array(totalPages).keys()].map(page => (
                    <Button
                        key={page}
                        variant={currentPage === page + 1 ? "primary" : "outline-primary"}
                        onClick={() => setCurrentPage(page + 1)}
                        className="mx-1"
                    >
                        {page + 1}
                    </Button>
                ))}

                <Button
                    variant="secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    style={{ marginLeft: '10px' }}
                >
                    Next
                </Button>
            </div>

        </div >

    )
}
const containerStyle = {
    margin: '10px'
}

const content = {
    margin: '10px'
}

const head = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: "0 20px 0 20px",
}
