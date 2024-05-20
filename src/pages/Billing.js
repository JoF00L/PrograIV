import React, { useState, useEffect } from "react";
import { Box, Button, Select, MenuItem, TextField, FormControl, InputLabel, List, ListItem, ListItemText, Checkbox, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import fetchData from "../hooks/fetchData";

export const Billing = () => {
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productQuantities, setProductQuantities] = useState({});
    const [total, setTotal] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const fetchClients = async () => {
        try {
            const loginState = JSON.parse(sessionStorage.getItem('loginState'));
            const userSession = loginState ? loginState.user : null;
            const data = await fetchData(`http://localhost:8080/api/client/all/${userSession.userId}`, {
                method: 'GET',
                credentials: 'include'
            });
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const loginState = JSON.parse(sessionStorage.getItem('loginState'));
            const userSession = loginState ? loginState.user : null;
            const data = await fetchData(`http://localhost:8080/api/product/all/${userSession.userId}`, {
                method: 'GET',
                credentials: 'include'
            });
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSelectClient = (event) => {
        setSelectedClient(event.target.value);
    };

    const handleToggleProduct = (productId) => {
        const currentIndex = selectedProducts.indexOf(productId);
        const newSelectedProducts = [...selectedProducts];

        if (currentIndex === -1) {
            newSelectedProducts.push(productId);
            setProductQuantities({ ...productQuantities, [productId]: 1 });
        } else {
            newSelectedProducts.splice(currentIndex, 1);
            const { [productId]: _, ...newQuantities } = productQuantities;
            setProductQuantities(newQuantities);
        }

        setSelectedProducts(newSelectedProducts);
        updateTotal(newSelectedProducts, productQuantities);
    };

    const handleQuantityChange = (productId, quantity) => {
        const newQuantities = { ...productQuantities, [productId]: quantity };
        setProductQuantities(newQuantities);
        updateTotal(selectedProducts, newQuantities);
    };

    const updateTotal = (selectedProducts, quantities) => {
        const totalAmount = selectedProducts.reduce((sum, productId) => {
            const product = products.find(p => p.productId === productId);
            const quantity = quantities[productId] || 1;
            return sum + (product ? parseFloat(product.price) * quantity : 0);
        }, 0);
        setTotal(totalAmount);
    };

    const handleCreateInvoice = async () => {
        if (!selectedClient) {
            setSnackbarMessage('Please select a client.');
            setOpenSnackbar(true);
            return;
        }

        if (selectedProducts.length === 0) {
            setSnackbarMessage('Please select at least one product.');
            setOpenSnackbar(true);
            return;
        }

        const invoiceDetails = selectedProducts.map(productId => ({
            price: products.find(p => p.productId === productId).price,
            productByProductId: { productId },
            quantity: productQuantities[productId] || 1
        }));

        const invoiceData = {
            date: new Date().toISOString().split('T')[0],
            total,
            clientByClientId: { clientId: selectedClient },
            invoiceDetailsByInvoiceId: invoiceDetails
        };

        try {
            const response = await fetch('http://localhost:8080/api/invoice', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceData)
            });

            if (response.ok) {
                console.log('Invoice created successfully');
                setOpenSnackbar(true);
                setSnackbarMessage('Invoice created successfully.');

                // Clear form after successful creation
                setSelectedClient('');
                setSelectedProducts([]);
                setProductQuantities({});
                setTotal(0);
            } else {
                console.error('Failed to create invoice');
                setOpenSnackbar(true);
                setSnackbarMessage('Failed to create invoice.');
            }
        } catch (error) {
            console.error('Error creating invoice:', error);
            setOpenSnackbar(true);
            setSnackbarMessage('Error creating invoice.');
        }
    };

    useEffect(() => {
        fetchClients();
        fetchProducts();
    }, []);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box
            sx={{
                textAlign: 'center',
                margin: '50px auto',
                maxWidth: '800px',
                padding: '20px',
                boxShadow: 3,
                borderRadius: 8,
                bgcolor: 'background.paper',
                color: 'text.primary'
            }}
        >
            <h1 className="mb-4">Billing</h1>
            <FormControl fullWidth className="mb-4">
                <InputLabel id="client-select-label">Select Client</InputLabel>
                <Select
                    labelId="client-select-label"
                    value={selectedClient}
                    onChange={handleSelectClient}
                >
                    {clients.map(client => (
                        <MenuItem key={client.clientId} value={client.clientId}>
                            {client.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <h2 className="mb-4">Select Products</h2>
            <List>
                {products.map(product => (
                    <ListItem key={product.productId} button>
                        <Checkbox
                            checked={selectedProducts.indexOf(product.productId) !== -1}
                            onClick={() => handleToggleProduct(product.productId)}
                            tabIndex={-1}
                            disableRipple
                        />
                        <ListItemText primary={`${product.name} - $${product.price}`} />
                        {selectedProducts.indexOf(product.productId) !== -1 && (
                            <TextField
                                type="number"
                                label="Quantity"
                                value={productQuantities[product.productId]}
                                onChange={(e) => handleQuantityChange(product.productId, parseInt(e.target.value, 10))}
                                inputProps={{ min: 1 }}
                                style={{ width: '100px', marginLeft: '10px' }}
                            />
                        )}
                    </ListItem>
                ))}
            </List>

            <h2 className="mt-4">Total: ${total.toFixed(2)}</h2>

            <Button variant="contained" color="primary" className="mt-4" onClick={handleCreateInvoice}>
                Create Invoice
            </Button>

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
        </Box>
    );
};
