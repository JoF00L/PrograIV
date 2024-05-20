import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import GenericTable from "../components/GenericTable";
import GenericModal from "../components/GenericModal";
import fetchData from "../hooks/fetchData";
import { Snackbar, IconButton } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const url_api_client = 'http://localhost:8080/api/client';

export const Client = () => {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newClient, setNewClient] = useState({ id: '', name: '', email: '', phone: '', userId: '', clientId: '' });
    const [mode, setMode] = useState('CREATE');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const loginState = JSON.parse(sessionStorage.getItem('loginState'));
    const userSession = loginState ? loginState.user : null;

    const handleOpenSnackbar = (message) => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleAddClient = async () => {
        try {
            await fetchData(`${url_api_client}`, { method: 'POST', body: JSON.stringify(newClient) });
            setShowModal(false);
            await fetchClients();
            handleOpenSnackbar('Client added successfully.');
        } catch (error) {
            console.error('Error adding client:', error);
            handleOpenSnackbar('Error adding client.');
        }
    };

    const handleDelete = async (clientId) => {
        try {
            await fetchData(`${url_api_client}/${clientId}`, { method: 'DELETE'});
            setClients(clients.filter(client => client.clientId !== clientId));
            handleOpenSnackbar('Client deleted successfully.');
        } catch (error) {
            console.error('Error deleting client:', error);
            handleOpenSnackbar('Error deleting client.');
        }
    };

    const handleEdit = (client) => {
        setNewClient(client);
        setMode('EDIT');
        setShowModal(true);
    };

    const fetchClients = async () => {
        try {
            const data = await fetchData(`${url_api_client}/all/${userSession.userId}`, { method: 'GET' });
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleSearch = async () => {
        try {
            if (searchTerm === '') {
                await fetchClients();
                return;
            }
            const data = await fetchData(`${url_api_client}/search?name=${searchTerm}`, { method: 'GET' });
            setClients(data);
        } catch (error) {
            console.error('Error searching clients:', error);
        }
    };

    const handleUpdateClient = async () => {
        try {
            await fetchData(`${url_api_client}`, { method: 'PUT', body: JSON.stringify(newClient) });
            setShowModal(false);
            await fetchClients();
            handleOpenSnackbar('Client updated successfully.');
        } catch (error) {
            console.error('Error updating client:', error);
            handleOpenSnackbar('Error updating client.');
        }
    };

    const handleSubmit = async () => {
        if (mode === 'CREATE') await handleAddClient();
        else if (mode === 'EDIT') await handleUpdateClient();
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const clientColumns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
        {
            key: 'delete',
            header: 'Delete',
            render: (client) => (
                <IconButton aria-label="delete" onClick={() => handleDelete(client.clientId)}>
                    <DeleteIcon />
                </IconButton>
            )
        },
        {
            key: 'edit',
            header: 'Edit',
            render: (client) => (
                <IconButton aria-label="edit" onClick={() => handleEdit(client)}>
                    <EditIcon />
                </IconButton>
            )
        }
    ];

    const clientFields = [
        { id: 'id', label: 'ID', type: 'text' },
        { id: 'name', label: 'Name', type: 'text' },
        { id: 'email', label: 'Email', type: 'email' },
        { id: 'phone', label: 'Phone', type: 'text' }
    ];

    return (
        <div style={{ textAlign: 'center', margin: '50px auto', maxWidth: '800px' }}>
            <h1 className="mb-4">Clients</h1>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>Search</button>
            </div>
            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto', margin: '20px auto' }}>
                <GenericTable data={clients} columns={clientColumns} uniqueKey={'clientId'} />
            </div>
            <button className="btn btn-success" onClick={() => {
                setShowModal(true);
                setMode('CREATE');
                setNewClient({ id: '', name: '', email: '', phone: '', userId: '', clientId: '' });
            }}>Add Client
            </button>

            <GenericModal
                showModal={showModal}
                setShowModal={setShowModal}
                mode={mode}
                handleSubmit={handleSubmit}
                formData={newClient}
                setFormData={setNewClient}
                title={mode === 'CREATE' ? 'Add Client' : 'Edit Client'}
                fields={clientFields}
            />

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="success">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};
