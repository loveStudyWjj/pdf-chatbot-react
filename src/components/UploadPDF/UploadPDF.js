import React from 'react';
import { Col, Form } from 'react-bootstrap';
import axios from 'axios';

const UploadPDF = () => {
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/upload_pdf/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("File uploaded successfully.");
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <Col xs={12} md={12}>
            <h1 className="mt-5">Upload PDF</h1>
            <Form>
                <Form.Group>
                    <Form.Control
                        type="file"
                        onChange={handleFileUpload}
                    />
                </Form.Group>
            </Form>
        </Col>
    );
};

export default UploadPDF;
