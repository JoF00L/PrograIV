import React, { useState, useEffect } from "react";
import { Button, IconButton, InputAdornment, SvgIcon, TextField } from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon, Search as SearchIcon, PictureAsPdf } from "@mui/icons-material";
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import fetchData from "../hooks/fetchData";
import GenericTable from "../components/GenericTable";
import ProductDetailsModal from "../components/ProductDetailsModal"; // Importa el nuevo modal
import XmlDetailsModal from "../components/XmlDetailsModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCode } from '@fortawesome/free-solid-svg-icons';

const backendUrl = 'http://localhost:8080/api/invoice';

export const Bill = () => {
    const [bills, setBills] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductModal, setShowProductModal] = useState(false);
    const [showProductDetailsModal, setShowProductDetailsModal] = useState(false); 
    const [showXmlDetailsModal, setShowXmlDetailsModal] = useState(false);
    const [newBill, setNewBill] = useState({ id: '', customerId: '', details: [] });
    const [productDetails, setProductDetails] = useState([]); 
    const [xmlDetails, setXmlDetails] = useState([]);
    const [mode, setMode] = useState('CREATE');

    const loginState = JSON.parse(sessionStorage.getItem('loginState'));
    const userSession = loginState ? loginState.user : null;

    const handleAddBill = async () => {
        try {
            await fetchData(`${backendUrl}`, { method: 'POST', body: JSON.stringify(newBill) });
            setShowProductModal(false);
            await fetchBills();
        } catch (error) {
            console.error('Error adding bill:', error);
        }
    };

    const handleDelete = async (billId) => {
        try {
            await fetchData(`${backendUrl}/${billId}`, { method: 'DELETE' });
            setBills(bills.filter(bill => bill.invoiceId !== billId));
        } catch (error) {
            console.error('Error deleting bill:', error);
        }
    };

    const handleShowDetails = async (bill) => {
        try {
            const details = await fetchData(`${backendUrl}/details/${bill.invoiceId}`, { method: 'GET' });
            setProductDetails(details);
            setShowProductDetailsModal(true);
        } catch (error) {
            console.error('Error fetching bill details:', error);
        }
    };

    const fetchBills = async () => {
        try {
            const data = await fetchData(`${backendUrl}`, { method: 'GET' });
            setBills(data);
        } catch (error) {
            console.error('Error fetching bills:', error);
        }
    };

    const handleSearch = async () => {
        try {
            if (searchTerm === '') {
                await fetchBills();
                return;
            }
            const data = await fetchData(`${backendUrl}/search?clientId=${searchTerm}`, { method: 'GET' });
            setBills(data);
        } catch (error) {
            console.error('Error searching bills:', error);
        }
    };

    const handleUpdateBill = async () => {
        try {
            await fetchData(`${backendUrl}`, { method: 'PUT', body: JSON.stringify(newBill) });
            setShowProductModal(false);
            await fetchBills();
        } catch (error) {
            console.error('Error updating bill:', error);
        }
    };

    const handleSubmit = async () => {
        if (mode === 'CREATE') await handleAddBill();
        else if (mode === 'EDIT') await handleUpdateBill();
    };

    const handlePdf = async (bill) => {
        try {
            const response = await fetchData(`${backendUrl}/pdf/${bill.invoiceId}`, { method: 'GET' });
    
            if (response.ok) {
                
                const url = window.URL.createObjectURL(response);
                const link = document.createElement('a');
                link.href = url;
                link.click();
    
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Failed to generate PDF:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating PDF:', error);
        }
    };

    const handleXml = async (bill) => { 
        const details = await fetchData(`${backendUrl}/details/${bill.invoiceId}`, { method: 'GET' });
        let xmlResult = `<?xml version="1.0" encoding="UTF-8"?>
            <Invoice>
                <date>${bill.date}</date>    
                <total>${bill.total}</total>
                <invoice_id>${bill.invoiceId}</invoice_id>
                <Client>
                    <client_name>${bill.clientByClientId.name}</client_name>
                    <client_id>${bill.clientByClientId.clientId}</client_id>
                </Client>
            `;
        details.map((detail) => {
            xmlResult += `
                <Product>
                    <product_id>${detail.productByProductId.id}</product_id>
                    <product_name>${detail.productByProductId.name}</product_name>
                    <price>${detail.price.toFixed(2)}</price>
                    <quantity>${detail.quantity}</quantity>
                </Product>
            `
        });
        xmlResult += `</Invoice>`;
        setXmlDetails("data:text/xml," + xmlResult);        
        setShowXmlDetailsModal(true);
    };

    useEffect(() => {
        fetchBills();
    }, []);

    const billColumns = [
        { key: 'invoiceId', header: 'ID' },
        {
            key: 'id',
            header: 'Customer ID',
            render: (bill) => bill.clientByClientId.clientId
        },
        {
            key: 'name',
            header: 'Customer Name',
            render: (bill) => bill.clientByClientId.name
        },
        {
            key: 'date',
            header: 'Date',
            render: (bill) => new Date(bill.date).toLocaleDateString()
        },
        {
            key: 'total',
            header: 'Total',
            render: (bill) => `$ ${bill.total.toFixed(2)}`
        },
        {
            key: 'details',
            header: 'Details',
            render: (bill) => (
                <Button variant="contained" color="primary" onClick={() => handleShowDetails(bill)}>
                    <TroubleshootIcon />
                </Button>
            )
        },
        {
            key: 'pdf',
            header: 'PDF',
            render: (bill) => (
                <a href={`${backendUrl}/pdf/${bill.invoiceId}`} target="_blank">
                <Button variant="contained" color="secondary">
                    <PictureAsPdf />
                </Button>
                </a>
            )
        },
        {
            key: 'xml',
            header: 'XML',
            render: (bill) => (
                <Button variant="contained" color="success" size="large" onClick={() => handleXml(bill)}>
                    <FontAwesomeIcon icon={faFileCode} />
                </Button>
            )
        },
        {
            key: 'delete',
            header: 'Delete',
            render: (bill) => (
                <Button variant="contained" color="error" onClick={() => handleDelete(bill.invoiceId)}>
                    <DeleteIcon />
                </Button>
            )
        }
    ];

    const billFields = [
        { id: 'id', label: 'ID', type: 'text' },
        { id: 'customerId', label: 'Customer ID', type: 'text' },
        // Add fields for details if needed
    ];

    return (
        <div style={{ textAlign: 'center', margin: '50px auto', maxWidth: '800px' }}>
            <h1 className="mb-4">Bills</h1>
            <div className="input-group mb-3">
                <TextField
                    type="text"
                    className="form-control"
                    placeholder="Search by Customer ID..."
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
                <GenericTable data={bills} columns={billColumns} uniqueKey={'invoiceId'} />
            </div>
            
            <ProductDetailsModal
                showModal={showProductDetailsModal}
                setShowModal={setShowProductDetailsModal}
                invoiceDetails={productDetails}
            />

            <XmlDetailsModal
                showModal={showXmlDetailsModal}
                setShowModal={setShowXmlDetailsModal}
                xmlContent={xmlDetails}
            />
        </div>
    );
};
