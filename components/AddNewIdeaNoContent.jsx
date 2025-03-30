import * as React from 'react';
import { useState } from 'react';
import { db } from '../models/db.js';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function AddNewIdea({ show, handleClose }) {
  const [ideaTitle, setIdeaTitle] = useState('');

  const handleAddIdea = async () => {
    if (ideaTitle.trim()) {
      await db.idea.add({
        title: ideaTitle,
        status: 'On Going',
        creationdate: new Date(),
        lastedited: new Date()
      });
      setIdeaTitle('');
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Idea</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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