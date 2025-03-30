import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ConfirmSaveModal({ show, handleClose, handleConfirm }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Save</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to save the changes to the description?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmSaveModal;