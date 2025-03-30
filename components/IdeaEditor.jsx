import React, { useEffect, useState } from 'react';
import { Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';
import { db } from '../models/db.js';
import SuccessModal from './SuccessModal';
import ConfirmSaveModal from './ConfirmSaveModal';

function IdeaEditor({ selectedIdeaId, onClose }) {
  const [idea, setIdea] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editType, setEditType] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [showConfirmSaveModal, setShowConfirmSaveModal] = useState(false);

  useEffect(() => {
    const fetchIdea = async () => {
      const ideaData = await db.ideas.get(selectedIdeaId);
      setIdea(ideaData);
      setEditTitle(ideaData.title);
      setEditStatus(ideaData.status);
      setEditType(ideaData.ideatype);
    };
    if (selectedIdeaId) {
      fetchIdea();
    }
  }, [selectedIdeaId]);

  const handleUpdateIdea = async () => {
    if (idea) {
      await db.ideas.update(idea.id, { ...idea, lastedited: new Date() });
      setSuccessMessage('Idea saved successfully');
      setShowSuccessModal(true);
      setIsEditingDescription(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIdea((prevIdea) => ({ ...prevIdea, [name]: value }));
  };

  const handleEditTitleStatus = async () => {
    if (idea) {
      await db.ideas.update(idea.id, { title: editTitle, status: editStatus, ideatype: editType, lastedited: new Date() });
      setIdea((prevIdea) => ({ ...prevIdea, title: editTitle, status: editStatus, ideatype: editType }));
      setShowEditModal(false);
      setSuccessMessage('Idea Information updated successfully');
      setShowSuccessModal(true);
    }
  };

  const handleSaveDescription = () => {
    setShowConfirmSaveModal(true);
  };

  const handleConfirmSaveDescription = () => {
    setShowConfirmSaveModal(false);
    handleUpdateIdea();
  };

  if (!idea) {
    return null;
  }

  return (
    <Container>
      <Row>
        <Col>
          <h2>{idea.title}</h2>
          <p><strong>Creation Date:</strong> {new Date(idea.creationdate).toLocaleString()}</p>
          <p><strong>Last Edited:</strong> {new Date(idea.lastedited).toLocaleString()}</p>
          <p><strong>Type:</strong> {idea.ideatype}</p>
          <Button variant="warning" onClick={() => setShowEditModal(true)}>
            Edit Idea Information
          </Button>
          <Form className="mt-3">
            <Form.Group controlId="formIdeaDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={idea.description}
                onChange={handleChange}
                readOnly={!isEditingDescription}
              />
            </Form.Group>
            {!isEditingDescription ? (
              <Button variant="primary" onClick={() => setIsEditingDescription(true)}>
                Edit Description
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSaveDescription}>
                Save Description
              </Button>
            )}
            <Button variant="secondary" onClick={onClose} className="ml-2">
              Close
            </Button>
          </Form>
        </Col>
      </Row>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Title, Status, and Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEditTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEditStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="ongoing">Ongoing</option>
                <option value="complete">Complete</option>
                <option value="on hold">On Hold</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formEditType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditTitleStatus}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <SuccessModal
        show={showSuccessModal}
        handleClose={() => setShowSuccessModal(false)}
        successMessage={successMessage}
      />
      <ConfirmSaveModal
        show={showConfirmSaveModal}
        handleClose={() => setShowConfirmSaveModal(false)}
        handleConfirm={handleConfirmSaveDescription}
      />
    </Container>
  );
}

export default IdeaEditor;