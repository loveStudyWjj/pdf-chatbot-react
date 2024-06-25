import React, { useState, useEffect } from 'react';
import { Col, ListGroup, Spinner } from 'react-bootstrap';

const AvailableDocuments = () => {
    const [documentList, setDocumentList] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch('http://localhost:8000/get_documents/');
                const data = await response.json();
                setDocumentList(data.data);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocuments();
    }, []);

    return (
        <Col xs={12} md={12}>
            <h2 className="mt-5">Available Documents</h2>
            {documentList.length === 0 ? (
                <Spinner animation="border" />
            ) : (
                <ListGroup>
                    {documentList.map((doc, idx) => (
                        <ListGroup.Item key={idx}>{doc}</ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Col>
    );
};

export default AvailableDocuments;
