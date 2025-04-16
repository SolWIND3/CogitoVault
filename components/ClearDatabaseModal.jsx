import * as React from 'react';
import { useState } from 'react';
import { db } from '../models/db.js';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ClearDatabaseModal({ show, handleClose }) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleClearDatabase = async () => {
    await db.ideas.clear();
    setShowConfirmationModal(true);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Clear Database</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to clear all your data? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClearDatabase}>
            Clear Database
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Database Cleared</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>All database information has been cleared.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseConfirmationModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ClearDatabaseModal;