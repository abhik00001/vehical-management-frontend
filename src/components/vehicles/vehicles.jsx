import { useEffect, useState } from "react"
import { Button, Dropdown, Form, Modal, Pagination, Table } from "react-bootstrap"
import api, { myBaseURL } from "../../Api"
import { RefreshAccessToken } from "../../authentication/auth"
import { useNavigate } from "react-router"

export default function Vehicle() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [search, setSearch] = useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [vehicleId, setVehicleId] = useState('')
    const [hoveredUser, setHoverUser] = useState(false)
    const [hoveredType, setHoverType] = useState(false)
    const [createdby, setCreatedby] = useState(null)
    const [status, setStatus] = useState(null)
    const [vehicletype, setVehicleType] = useState(null)

    const fetchVehicles = async () => {
        const access = localStorage.getItem('access')
        try {
            const response = await api.get('api/vehicles/', {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            })


            setVehicles(response.data.data)
            setUsers(response.data.users)
        } catch (error) {
            if (error.response?.status === 401) {
                const newAccess = await RefreshAccessToken()
                if (newAccess) {
                    const response = await api.get('api/vehicles/', {
                        headers: {
                            'Authorization': `Bearer ${access}`
                        }
                    })

                    setVehicles(response.data.data)
                    setUsers(response.data.users)
                } else {
                    console.log('Failed to refresh token')
                    navigate('/')
                }
            }
        }
    }
    useEffect(() => {
        setLoading(true)
        fetchVehicles()
        setLoading(false)
    }, [])

    const handleDelete = async (id) => {
        const access = localStorage.getItem('access')
        try {
            const response = await api.delete(`api/vehicles/${id}`, {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            })
            fetchVehicles()
        } catch (error) {
            if (error.response?.status === 401) {
                const newAccess = await RefreshAccessToken()
                if (newAccess) {
                    const response = await api.delete(`api/vehicles/${id}/`, {
                        headers: {
                            'Authorization': `Bearer ${access}`
                        }
                    })
                    fetchVehicles()
                } else {
                    console.log('Failed to refresh token')
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
            const response = await api.patch(`api/vehicles/${id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            })
            fetchVehicles()
        } catch (error) {
            if (error.response?.status === 401) {
                const newAccess = await RefreshAccessToken()
                if (newAccess) {
                    const response = await api.patch(`api/vehicles/${id}`, {}, {
                        headers: {
                            'Authorization': `Bearer ${access}`
                        }
                    })
                    fetchVehicles()
                } else {
                    console.log('Failed to refresh token')
                    navigate('/')
                }
            } else {
                console.log(error)
            }
        }
    }

    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const SearchedVehciles = vehicles.filter(vehicle =>
        (

            `${vehicle.vehicle_name}`.toLowerCase().includes(search.toLowerCase()) ||
            `${vehicle.vehicle_model}`.toLowerCase().includes(search.toLowerCase()) ||
            `${vehicle.chassi_number}`.toLowerCase().includes(search.toLowerCase()) ||
            `${vehicle.registration_number}`.toLowerCase().includes(search.toLowerCase()) ||
            `${vehicle.registration_number}`.toLowerCase().includes(search.toLowerCase()) ||
            `${vehicle.vehicle_description}`.toLowerCase().includes(search.toLowerCase())
        )
        && (createdby === null || vehicle.created_by === createdby)
        && (status === null || vehicle.status === status)
        && (vehicletype === null || vehicle.vehicle_type === vehicletype)

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

    const allusers = users.filter(user => user.role === 'admin' || user.role === 'manager')
    const handleEdit = (id) => {
        navigate(`/home/vehicles/${id}`)
    }

    // Pagination

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 4

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = SearchedVehciles.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(SearchedVehciles.length / itemsPerPage)

    let pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
    }

    useEffect(() => {
        setCurrentPage(1);
    }, [search, createdby, status]);

    return (
        loading ? <p>Loading...</p> :
            <div style={containerStyle}>
                <div style={head}>
                    <Button style={{ height: '60%', margin: "auto 0" }} type="primary" onClick={() => navigate('/home/add_vehicle')}>Add Vehicle</Button>
                    <h1 >Vehicles List</h1>
                    <div className="d-flex" style={{ height: '60%', margin: "auto 0" }}  >
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {/* <Button style={{ height: '60%', margin: "auto 0" }} variant="outline-success" onClick={(e) => e.preventDefault()}>Search</Button> */}
                        <Dropdown>
                            <div style={{ display: 'flex' }}>

                                <Dropdown.Toggle variant="outline-success" id="dropdown-basic">Filter </Dropdown.Toggle>
                            </div>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setStatus(true)}>Active</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStatus(false)}>Inactive</Dropdown.Item>
                                <Dropdown.Header style={{ color: "black" }} onMouseEnter={() => setHoverUser(true)} onMouseLeave={() => setHoverUser(false)}>Created By
                                    {/* <FontAwesomeIcon icon="fa-solid fa-caret-down" /> */}
                                    {
                                        hoveredUser && (
                                            <>
                                                {
                                                    allusers.map((user, index) => {
                                                        return (
                                                            <Dropdown.Item key={index} onClick={() => setCreatedby(user.id)}>{user.first_name} {user.last_name}</Dropdown.Item>
                                                        )
                                                    })
                                                }
                                            </>
                                        )
                                    }
                                </Dropdown.Header>
                                <Dropdown.Header style={{ color: "black" }} onMouseEnter={() => setHoverType(true)} onMouseLeave={() => setHoverType(false)}>Vehicle Type
                                    {
                                        hoveredType && (
                                            <>
                                                <Dropdown.Item onClick={() => setVehicleType('LTV')}>LTV</Dropdown.Item>
                                                <Dropdown.Item onClick={() => setVehicleType('HTV')}>HTV</Dropdown.Item>
                                            </>
                                        )
                                    }
                                </Dropdown.Header>
                            </Dropdown.Menu>
                        </Dropdown>
                        <span style={{ color: 'white', width: '30%', textAlign: 'center', borderRadius: '30px', cursor: 'pointer', fontSize: '10px', margin: 'auto', textDecoration: 'underline' }} onClick={() => { setCreatedby(null); setStatus(null); setVehicleType(null) }}>{
                            (status === true || status === false) ? ("Clear Filter") :
                                (createdby) ? ("Clear Filter") :
                                    (vehicletype) ? ("Clear Filter") : null
                        }</span>
                    </div>
                </div>
                <hr />

                <Modal show={deleteModal} onHide={() => setDeleteModal(false)} centered>
                    <Modal.Header >
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this driver?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => {
                            handleDelete(vehicleId)
                            setDeleteModal(false)
                        }}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>

                <div style={content}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Sr.No.</th>
                                <th onClick={() => handleSort('vehicle_img')}>Image</th>
                                <th onClick={() => handleSort('vehicle_type')}>Type</th>
                                <th onClick={() => handleSort('vehicle_name')}>Name</th>
                                <th onClick={() => handleSort('vehicle_model')}>Model</th>
                                <th onClick={() => handleSort('vehicle_year')}>Year</th>
                                <th onClick={() => handleSort('chassi_number')}>Chassi Number</th>
                                <th onClick={() => handleSort('registration_number')}>Registration Number</th>
                                <th onClick={() => handleSort('vehicle_description')}>Description</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                                <th onClick={() => handleSort('status')}>Active/Inactive</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentItems.length > 0 ? (
                                    currentItems.map((vehicle, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td><img src={myBaseURL + vehicle.vehicle_img} width={90} height={60} /></td>
                                                <td>{vehicle.vehicle_type}</td>
                                                <td>{vehicle.vehicle_name}</td>
                                                <td>{vehicle.vehicle_model}</td>
                                                <td>{vehicle.vehicle_year}</td>
                                                <td>{vehicle.chassi_number}</td>
                                                <td>{vehicle.registration_number}</td>
                                                <td>{vehicle.vehicle_description}</td>
                                                <td style={{ width: '15%' }} >
                                                    <Button variant="warning" style={{ marginRight: '10px' }} onClick={() => handleEdit(vehicle.id)}>Edit</Button>
                                                    <Button variant="danger" onClick={() => {
                                                        setVehicleId(vehicle.id)
                                                        setDeleteModal(true)
                                                    }}>Delete</Button>
                                                </td>
                                                <td>
                                                    {
                                                        vehicle.status ? <Button variant="success" onClick={() => handleStatus(vehicle.id)}>Active</Button>
                                                            : <Button variant="danger" onClick={() => handleStatus(vehicle.id)}>InActive</Button>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr><td colSpan="11" style={{ textAlign: 'center' }}>No Data Found</td></tr>
                                )

                            }

                            {/* {

                                (vehicles.length === 0) && <tr><td colSpan="11" style={{ textAlign: 'center' }}>No Data Found</td></tr>
                            } */}


                        </tbody>
                    </Table>

                </div>
                <div className="d-flex justify-content-center mt-3">
                    <Pagination>
                        <Pagination.Item className="mx-1" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</Pagination.Item>
                        {
                            pageNumbers.map((page) => {
                                return (
                                    <Pagination.Item className="mx-1" key={page} active={currentPage === page} onClick={() => setCurrentPage(page)} >{page}</Pagination.Item>
                                )
                            })
                        }
                        <Pagination.Item className="mx-1" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</Pagination.Item>
                    </Pagination>
                </div>
            </div>

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