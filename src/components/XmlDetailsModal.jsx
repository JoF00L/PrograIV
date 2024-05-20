import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";


const XmlDetailsModal = ({showModal, setShowModal, xmlContent}) => {
    
    const parser = new DOMParser();
    const xmlData = parser.parseFromString(xmlContent, 'application/xml');

    return(
        <Modal open={showModal} onClose={() => setShowModal(false)}>
            <Box sx={{ p: 4, bgcolor: '#333', color: 'white', margin: '20px auto', maxWidth: 600, borderRadius: 2, boxShadow: 24 }}> 
                <Typography variant="h5" component="h2" gutterBottom>Invoice details Xml</Typography>
                <iframe name="xmlFrame" src={xmlContent}>

                </iframe>
                <Button variant="contained" color="secondary" onClick={() => setShowModal(false)} sx={{ mt: 2 }}>Close</Button>
            </Box>
        </Modal>
    );
};

export default XmlDetailsModal;