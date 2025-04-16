import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function UnsavedChangesModal({ show, handleClose, handleSave, handleDiscard }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Unsaved Changes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You have unsaved changes. Do you want to save them before leaving?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleDiscard}>
          Discard Changes
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UnsavedChangesModal;