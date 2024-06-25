import React from 'react';
import Chat from './components/Chat';
import { Container, Row, Col } from 'react-bootstrap';
import UploadPDF from './components/UploadPDF';
import AvailableDocuments from './components/AvailableDocuments';
const App = () => {


  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={4}>
          <UploadPDF />
          <AvailableDocuments />
        </Col>
        <Col xs={12} md={8}>
          <Chat />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
