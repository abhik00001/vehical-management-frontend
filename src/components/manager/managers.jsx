import { useEffect, useState } from "react"
import { Button, Dropdown, Form, Modal, Table } from "react-bootstrap"
import api, { myBaseURL } from "../../Api"
import { RefreshAccessToken } from "../../authentication/auth"
import { useNavigate } from "react-router"
export default function Managers() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    // const [managers, setManagers] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [managerId, setManagerId] = useState('')
    const [status, setStatus] = useState(null)
    const [createdby, setCreatedby] = useState(null)


    const fetchManagers = async () => {
        const access = localStorage.getItem('access')
        const response = await api.get('api/managers', {
            headers: {
                'Authorization': `Bearer ${access}`
            }
        })
        setUsers(response.data)
    }
    useEffect(() => {
        setLoading(true)
        fetchManagers()
        setLoading(false)
    }, [])

    const handleDelete = async (id) => {
        const access = localStorage.getItem('access')
        try {

            const response = await api.delete(`api/managers/${id}`, {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            })
            fetchManagers()
        } catch (error) {
            if (error.response.status === 401) {
                const access = await RefreshAccessToken()
                if (access) {
                    const response = await api.delete(`api/managers/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${access}`
                        }
                    })
                    fetchManagers()
                } else {
                    console.log('Access token is invalid')
                    navigate('/')
                }
            } else {
                console.log('Error deleting manager')

            }
        }
    }

    const handleStatus = async (id) => {
        const access = localStorage.getItem('access')
        try {
            const response = await api.patch(`api/managers/${id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            })
            fetchManagers()
        } catch (error) {
            if (error.response.status === 401) {
                const access = await RefreshAccessToken()
                if (access) {
                    const response = await api.patch(`api/managers/${id}`, {}, {
                        headers: {
                            'Authorization': `Bearer ${access}`
                        }
                    })
                    fetchManagers()
                } else {
                    console.log('Access token is invalid')
                    navigate('/')
                }
            } else {
                console.log('Error updating status')
                console.log(error);

            }
        }
    }


    const managers = (users.filter(user => user.role === 'manager'))
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const filteredManagers = managers.filter(manager =>
        (
            manager.first_name.toLowerCase().includes(search.toLowerCase()) ||
            manager.email.toLowerCase().includes(search.toLowerCase()) ||
            manager.date_of_birth.toLowerCase().includes(search.toLowerCase()) ||
            manager.last_name.toLowerCase().includes(search.toLowerCase())
        ) && (status === null || manager.is_active === status)
        && (createdby === null || manager.created_by === createdby)
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


    const admins = users.filter(user => user.role === 'admin')

    const [hovered, setHover] = useState(false)

    const handleMouseEnter = () => {
        setHover(true)
    }
    const handleMouseLeave = () => {
        setHover(false)
    }


    const handleEdit = (id) => {
        navigate(`/home/managers/${id}`)
    }

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 4

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredManagers.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredManagers.length / itemsPerPage)

    useEffect(() => {
        setCurrentPage(1);
    }, [search, createdby, status]);

    return (
        loading ? <p>Loading...</p> :
            <div style={containerStyle}>
                <div style={head}>
                    <Button style={{ height: '60%', margin: "auto 0" }} type="primary" onClick={() => navigate('/home/register_user')}>Add Manager</Button>
                    <h1 >Managers List</h1>
                    <div className="d-flex" style={{ height: '60%', margin: "auto 0" }} >
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {/* <Button style={{ height: '60%', margin: "auto 0" }} variant="outline-success">Search</Button> */}
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-success" id="dropdown-basic">filters</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setStatus(true)}>Active</Dropdown.Item>
                                <Dropdown.Item onClick={() => setStatus(false)}>Inactive</Dropdown.Item>
                                <Dropdown.Header style={{ color: "black" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Created By
                                    {
                                        hovered &&
                                        (
                                            <>
                                                {
                                                    admins.map((admin, index) => {
                                                        return (
                                                            <Dropdown.Item key={index} onClick={() => setCreatedby(admin.id)}>{admin.first_name} {admin.last_name}</Dropdown.Item>
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
                                <th>Profile Image</th>
                                <th onClick={() => handleSort('first_name')}>First Name</th>
                                <th onClick={() => handleSort('last_name')}>Last Name</th>
                                <th onClick={() => handleSort('email')}>Email</th>
                                <th onClick={() => handleSort('date_of_birth')}>Date Of Birth</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                                <th>Active/Inactive</th>
                            </tr>
                        </thead>
                        <tbody>
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
                                        handleDelete(managerId)
                                        setDeleteModal(false)
                                    }}>
                                        Delete
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            {
                                (currentItems.length > 0) &&
                                currentItems.map((manager, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td><img src={manager.profile_image} width={90} height={60} /></td>
                                            <td>{manager.first_name}</td>
                                            <td>{manager.last_name}</td>
                                            <td>{manager.email}</td>
                                            <td>{manager.date_of_birth}</td>
                                            <td>
                                                <Button variant="warning" style={{ marginRight: '10px' }} onClick={() => handleEdit(manager.id)}>Edit</Button>
                                                <Button variant="danger" onClick={() => {
                                                    setManagerId(manager.id)
                                                    setDeleteModal(true)
                                                }} >Delete</Button>
                                            </td>
                                            <td>
                                                {
                                                    manager.is_active ? <Button variant="success" onClick={() => handleStatus(manager.id)}>Active</Button>
                                                        : <Button variant="danger" onClick={() => handleStatus(manager.id)}>InActive</Button>
                                                }
                                            </td>
                                        </tr>
                                    )
                                }) || <tr><td colSpan="10" style={{ textAlign: 'center' }}>No Data Found</td></tr>

                            }
                            {/* {

                                (managers.length === 0) && <tr><td colSpan="10" style={{ textAlign: 'center' }}>No Data Found</td></tr>
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