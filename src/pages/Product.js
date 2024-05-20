import React, { useState, useEffect } from "react";
import { Button, IconButton, InputAdornment, TextField, Snackbar } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import fetchData from "../hooks/fetchData";
import GenericTable from "../components/GenericTable";
import GenericModal from "../components/GenericModal";

const backendUrl = 'http://localhost:8080/api/product';

export const Product = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ id: '', name: '', price: ''});
    const [mode, setMode] = useState('CREATE');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const loginState = JSON.parse(sessionStorage.getItem('loginState'));
    const userSession = loginState ? loginState.user : null;

    const handleAddProduct = async () => {
        try {
            await fetchData(`${backendUrl}`, { method: 'POST', body: JSON.stringify(newProduct) });
            setShowModal(false);
            await fetchProducts();
            showSnackbar('Product added successfully.');
        } catch (error) {
            console.error('Error adding product:', error);
            showSnackbar('Failed to add product.');
        }
    };

    const handleDelete = async (productId) => {
        try {
            await fetchData(`${backendUrl}/${productId}`, { method: 'DELETE'});
            setProducts(products.filter(product => product.productId !== productId));
            showSnackbar('Product deleted successfully.');
        } catch (error) {
            console.error('Error deleting product:', error);
            showSnackbar('Failed to delete product.');
        }
    };

    const handleEdit = (product) => {
        setNewProduct(product);
        setMode('EDIT');
        setShowModal(true);
    };

    const fetchProducts = async () => {
        try {
            const data = await fetchData(`${backendUrl}/all/${userSession.userId}`, { method: 'GET' });
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSearch = async () => {
        try {
            if (searchTerm === '') {
                await fetchProducts();
                return;
            }
            const data = await fetchData(`${backendUrl}/search?name=${searchTerm}`, { method: 'GET' });
            setProducts(data);
        } catch (error) {
            console.error('Error searching products:', error);
        }
    };

    const handleUpdateProduct = async () => {
        try {
            await fetchData(`${backendUrl}`, { method: 'PUT', body: JSON.stringify(newProduct) });
            setShowModal(false);
            await fetchProducts();
            showSnackbar('Product updated successfully.');
        } catch (error) {
            console.error('Error updating product:', error);
            showSnackbar('Failed to update product.');
        }
    };

    const handleSubmit = async () => {
        if (mode === 'CREATE') await handleAddProduct();
        else if (mode === 'EDIT') await handleUpdateProduct();
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const productColumns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'price', header: 'Price' },
        {
            key: 'delete',
            header: 'Delete',
            render: (product) => (
                <Button variant="contained" color="error" onClick={() => handleDelete(product.productId)}>
                    <DeleteIcon />
                </Button>
            )
        },
        {
            key: 'edit',
            header: 'Edit',
            render: (product) => (
                <Button variant="contained" color="primary" onClick={() => handleEdit(product)}>
                    <EditIcon />
                </Button>
            )
        }
    ];

    const productFields = [
        { id: 'id', label: 'ID', type: 'text' },
        { id: 'name', label: 'Name', type: 'text' },
        { id: 'price', label: 'Price', type: 'number' },
    ];

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div style={{ textAlign: 'center', margin: '50px auto', maxWidth: '800px' }}>
            <h1 className="mb-4">Products</h1>
            <div className="input-group mb-3">
                <TextField
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleSearch}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto', margin: '20px auto' }}>
                <GenericTable data={products} columns={productColumns} uniqueKey={'productId'} />
            </div>
            <Button variant="contained" color="success" onClick={() => {
                setShowModal(true);
                setMode('CREATE');
                setNewProduct({ id: '', name: '', price: '', productId: '' });
            }}>
                <AddIcon /> Add Product
            </Button>

            <GenericModal
                showModal={showModal}
                setShowModal={setShowModal}
                mode={mode}
                handleSubmit={handleSubmit}
                formData={newProduct}
                setFormData={setNewProduct}
                title={mode === 'CREATE' ? 'Add Product' : 'Edit Product'}
                fields={productFields}
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
