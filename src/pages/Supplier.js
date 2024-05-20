import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import GenericTable from "../components/GenericTable";
import GenericSearch from "../components/GenericSearch";
import GenericModal from "../components/GenericModal";
import fetchData from "../hooks/fetchData";

const url_api_user = 'http://localhost:8080/api/user';

export const Supplier = () => {
    const [providers, setProviders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newSupplier, setNewSupplier] = useState({ id: '', name: '', role: 'PRO', password: '', userId: '', state: '0' });
    const [mode, setMode] = useState('CREATE');

    const handleDelete = async (userId) => {
        try {
            await fetchData(`${url_api_user}/${userId}`, { method: 'DELETE'});
            setProviders(providers.filter(provider => provider.userId !== userId));
        } catch (error) {
            console.error('Error deleting provider:', error);
        }
    };

    const handleEdit = (supplier) => {
        setNewSupplier(supplier);
        setMode('EDIT');
        setShowModal(true);
    };

    const handleChangeState = async (userId, state) => {
        try {
            const newState = state === 0 ? 'activate' : 'deactivate';
            await fetchData(`${url_api_user}/${newState}/${userId}`, { method: 'PUT'});
            await fetchProviders();
        } catch (error) {
            console.error('Error changing state of provider:', error);
        }
    };

    const fetchProviders = async () => {
        try {
            const data = await fetchData(`${url_api_user}`, { method: 'GET'});
            setProviders(data);
        } catch (error) {
            console.error('Error fetching providers:', error);
        }
    };

    const handleSearch = async () => {
        try {
            if (searchTerm === '') {
                await fetchProviders();
                return;
            }
            const data = await fetchData(`${url_api_user}/search?name=${searchTerm}`, { method: 'GET'});
            setProviders(data);
        } catch (error) {
            console.error('Error searching providers:', error);
        }
    };

    const handleAddProvider = async () => {
        try {
            await fetchData(`${url_api_user}`, { method: 'POST', body: JSON.stringify(newSupplier)});
            setShowModal(false);
            await fetchProviders();
        } catch (error) {
            console.error('Error adding provider:', error);
        }
    };

    const handleUpdateProvider = async () => {
        try {
            await fetchData(`${url_api_user}`, { method: 'PUT', body: JSON.stringify(newSupplier)});
            setShowModal(false);
            await fetchProviders();
        } catch (error) {
            console.error('Error updating provider:', error);
        }
    };

    const handleSubmit = async () => {
        if (mode === 'CREATE') await handleAddProvider();
        else if (mode === 'EDIT') await handleUpdateProvider();
    };

    useEffect(() => {
        fetchProviders();
    }, []);
    const supplierColumns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'role', header: 'Role' },
        { key: 'state', header: 'State' },
        {
            key: 'delete',
            header: 'Delete',
            render: (supplier) => (
                <button className="btn btn-danger mx-1"
                        onClick={() => handleDelete(supplier.userId)}>Delete</button>
            )
        },
        {
            key: 'edit',
            header: 'Edit',
            render: (provider) => (
                <button className="btn btn-primary mx-1"
                        onClick={() => handleEdit(provider)}>Edit</button>
            )
        },
        {
            key: 'activate',
            header: 'Activate',
            render: (provider) => (
                <button className={`btn mx-1 ${provider.state === '1' ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleChangeState(provider.userId, provider.state)}>
                    {provider.state === 1 ? 'Suspend' : 'Activate'}
                </button>
            )
        }
    ];
    const supplierFields = [
        { id: 'id', label: 'ID', type: 'text' },
        { id: 'name', label: 'Name', type: 'text' },
        { id: 'password', label: 'Password', type: 'password' }
    ];
    return (
        <div style={{ textAlign: 'center', margin: '50px auto', maxWidth: '1200px' }}>
            <h1 className="mb-4">Supplier</h1>
            <div>
                <GenericSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleSearch={handleSearch}
                    placeholder="Search providers..."
                />
            </div>
            <div>
                <GenericTable data={providers} columns={supplierColumns} uniqueKey={'userId'}/>
            </div>

            <button className="btn btn-success" onClick={() => {
                setShowModal(true);
                setMode('CREATE');
                const s = {id: '', name: '', role: 'PRO', password: '', userId: '', state: '0' };
                setNewSupplier(s); }}>Add Supplier
            </button>

            <GenericModal
                showModal={showModal}
                setShowModal={setShowModal}
                mode={mode}
                handleSubmit={handleSubmit}
                formData={newSupplier}
                setFormData={setNewSupplier}
                title={mode === 'CREATE' ? 'Add Supplier' : 'Edit Supplier'}
                fields={supplierFields}
            />
        </div>
    );
};
