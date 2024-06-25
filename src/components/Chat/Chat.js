import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    // const [document, setDocument] = useState([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:8000/ws/chat');
        setSocket(newSocket);

        newSocket.onmessage = (event) => {
            handleSocketMessage(event.data);
        };

        newSocket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            newSocket.close();
        };
    }, []);

    const handleSocketMessage = (data) => {
        const parsedData = JSON.parse(data);

        if (parsedData.event_type === 'document') {
            // setDocument(parsedData.data);
        } else if (parsedData.event_type === 'answer') {
            let answer = parsedData.data;
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                const loadingMessageIndex = updatedMessages.findIndex(msg => msg.role === 'assistant' && msg.message === 'loading...');
                if (loadingMessageIndex !== -1) {
                    updatedMessages[loadingMessageIndex] = { role: 'assistant', message: answer };
                    return updatedMessages;
                } else {
                    const lastMessage = prevMessages[prevMessages.length - 1];
                    if (lastMessage && lastMessage.role === 'assistant') {
                        const updatedMessage = { ...lastMessage, message: lastMessage.message + answer };
                        return [...prevMessages.slice(0, -1), updatedMessage];
                    } else {
                        return [...prevMessages, { role: 'assistant', message: answer }];
                    }
                }

            });
        }


    };

    const sendMessage = () => {
        if (socket && input.trim()) {
            setMessages(prevMessages => [...prevMessages, { role: 'user', message: input }]);
            setMessages(prevMessages => [...prevMessages, { role: 'assistant', message: 'loading...' }]);
            socket.send(input);
            setInput('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Container data-bs-theme="dark">
            <Row className="justify-content-md-center">
                <Col xs={12} md={12}>
                    <h1 className="mt-5">PDF Chatbot</h1>
                    <div className="chat-window rounded" style={{ border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'scroll' }}>

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-message ${msg.role}`}>
                                <strong>{msg.role === 'user' ? 'You: ' : 'Assistant: '}</strong>
                                <ReactMarkdown>{msg.message}</ReactMarkdown>
                            </div>
                        ))}

                        <div ref={messagesEndRef} />
                    </div>
                    <Form onSubmit={handleSubmit} className="mt-3">
                        <InputGroup>
                            <FormControl
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <Button type="submit" variant="primary">Send</Button>
                        </InputGroup>
                    </Form>
                    {/* <div>
                        {document.map((item, idx) => (
                            <div key={idx} >
                                <strong>{item.toString()}</strong>
                            </div>
                        ))}
                    </div> */}
                </Col>
            </Row>
        </Container>
    );
};

export default Chat;
