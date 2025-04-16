import * as React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function RenameBinderModal({ show, handleClose, binderName, setBinderName }) {
  const [newBinderName, setNewBinderName] = useState(binderName);

  const handleRenameBinder = () => {
    // Use default name if no name is provided
    const finalBinderName = newBinderName.trim() || 'Binder';
    setBinderName(finalBinderName);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Rename Binder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="binderName">
            <Form.Label>Binder Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Default Name Binder"
              value={newBinderName}
              onChange={(e) => setNewBinderName(e.target.value)}
              autoFocus
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleRenameBinder}>
          Rename
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RenameBinderModal;