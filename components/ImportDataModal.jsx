import * as React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import { db } from '../models/db.js';
import ErrorModal from './ErrorModal';
import './IdeaList.css'; // Corrected path

function ImportDataModal({ show, handleClose, importedData, handleConfirmImportData }) {
  const [conflicts, setConflicts] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (importedData) {
      checkConflicts();
    }
  }, [importedData]);

  const checkConflicts = async () => {
    if (!importedData.ideas || importedData.ideas.length === 0) {
      setErrorMessage('The imported binder has no data.');
      setShowErrorModal(true);
      return;
    }

    const existingIdeas = await db.ideas.toArray();
    const conflicts = importedData.ideas.map((idea) => {
      const conflict = existingIdeas.find(
        (existingIdea) => existingIdea.id === idea.id || existingIdea.title === idea.title
      );
      return conflict ? { ...idea, conflict: true } : { ...idea, conflict: false };
    });
    setConflicts(conflicts);
  };

  const handleResolveConflict = (idea, action) => {
    if (action === 'overwrite' || action === 'newId') {
      const existingIds = conflicts.map((i) => i.id);
      let newId = 1;
      while (existingIds.includes(newId)) {
        newId++;
      }
      setConflicts((prevConflicts) =>
        prevConflicts.map((i) =>
          i.id === idea.id ? { ...i, id: newId, conflict: false } : i
        )
      );
    }
  };

  const handleImport = () => {
    const ideasToImport = conflicts.filter((idea) => !idea.conflict);
    handleConfirmImportData(ideasToImport);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Ideas to be imported from binder:</h5>
          <ListGroup>
            {conflicts.map((idea) => (
              <ListGroup.Item key={idea.id} className="custom-list-item">
                <h6>{idea.title}</h6>
                <p><strong>Content:</strong> {idea.content}</p>
                <p><strong>Status:</strong> {idea.status}</p>
                <p><strong>Type:</strong> {idea.ideatype}</p>
                <p><strong>Creation Date:</strong> {new Date(idea.creationdate).toLocaleString()}</p>
                <p><strong>Last Edited:</strong> {new Date(idea.lastedited).toLocaleString()}</p>
                {idea.conflict && (
                  <div>
                    <p style={{ color: 'red' }}>Conflict detected!</p>
                    <Button variant="danger" onClick={() => handleResolveConflict(idea, 'overwrite')}>
                      Add Anyway
                    </Button>
                  </div>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleImport}>
            Confirm Import
          </Button>
        </Modal.Footer>
      </Modal>
      <ErrorModal
        show={showErrorModal}
        handleClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
      />
    </>
  );
}

export default ImportDataModal;