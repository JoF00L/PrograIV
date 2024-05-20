import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ProductDetailsModal = ({ showModal, setShowModal, invoiceDetails }) => {
    return (
        <Modal open={showModal} onClose={() => setShowModal(false)}>
            <Box sx={{ p: 4, bgcolor: '#333', color: 'white', margin: '20px auto', maxWidth: 600, borderRadius: 2, boxShadow: 24 }}>
                <Typography variant="h6" component="h2" gutterBottom>Product Details</Typography>
                <table className="table table-dark table-striped" style={{ color: 'white' }}>
                    <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoiceDetails.map((detail) => (
                        <tr key={detail.invoiceDetailId}>
                            <td>{detail.productByProductId.id}</td>
                            <td>{detail.productByProductId.name}</td>
                            <td>{detail.price.toFixed(2)}</td>
                            <td>{detail.quantity}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Button variant="contained" color="primary" onClick={() => setShowModal(false)} sx={{ mt: 2 }}>Close</Button>
            </Box>
        </Modal>
    );
};

export default ProductDetailsModal;
