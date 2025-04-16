import * as React from 'react';
import { useState } from 'react';
import { db } from '../models/db.js';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert'; // Import Alert for error messages

function AddNewIdea({ show, handleClose }) {
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaType, setIdeaType] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const handleAddIdea = async () => {
    if (!ideaTitle.trim() || !ideaType.trim() || !ideaDescription.trim()) {
      setErrorMessage('All fields are required. Please fill in the missing information.');
      return;
    }

    await db.ideas.add({
      title: ideaTitle,
      ideatype: ideaType,
      description: ideaDescription,
      status: 'On Going',
      creationdate: new Date(),
      lastedited: new Date(),
    });

    // Reset fields and close modal
    setIdeaTitle('');
    setIdeaType('');
    setIdeaDescription('');
    setErrorMessage(''); // Clear error message
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Idea</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>} {/* Display error message */}
        <Form>
          <Form.Group className="mb-3" controlId="ideaTitle">
            <Form.Label>Idea Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Idea Title"
              value={ideaTitle}
              onChange={(e) => setIdeaTitle(e.target.value)}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="ideaDescription">
            <Form.Label>Idea Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Idea Description"
              value={ideaDescription}
              onChange={(e) => setIdeaDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="ideaType">
            <Form.Label>Idea Type</Form.Label>
            <Form.Control
              type="text"
              placeholder="Idea Type"
              value={ideaType}
              onChange={(e) => setIdeaType(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddIdea}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddNewIdea;