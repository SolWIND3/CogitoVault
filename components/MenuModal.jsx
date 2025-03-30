import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { db } from '../models/db.js';
import IdeaEditor from './IdeaEditor';

const Menu = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useImperativeHandle(ref, () => ({
    handleShow
  }));

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    const allIdeas = await db.ideas.toArray();
    setIdeas(allIdeas);
  };

  const handleSearch = async () => {
    const searchedIdeas = await db.ideas
      .filter(idea => idea.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .toArray();
    setIdeas(searchedIdeas);
  };

  const handleEditIdea = (id) => {
    setSelectedIdeaId(id);
    handleClose();
  };

  return (
    <>
      <Modal
        {...props}
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        fullscreen
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Ideas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="search">
              <Form.Control
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSearch}>
              Search
            </Button>
          </Form>
          <ul>
            {ideas.map((idea) => (
              <li key={idea.id}>
                {idea.title}
                <Button variant="warning" onClick={() => handleEditIdea(idea.id)}>
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {selectedIdeaId && (
        <IdeaEditor selectedIdeaId={selectedIdeaId} onClose={() => setSelectedIdeaId(null)} />
      )}
    </>
  );
});

export default Menu;