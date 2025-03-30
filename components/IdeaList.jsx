import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col } from 'react-bootstrap';
import { db } from '../models/db.js';
import IdeaEditor from './IdeaEditor';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { useLiveQuery } from 'dexie-react-hooks';

function IdeaList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState(null);

  const ideas = useLiveQuery(
    () => db.ideas.toArray(),
    []
  );

  useEffect(() => {
    if (ideas) {
      setFilteredIdeas(ideas);
    }
  }, [ideas]);

  const handleSearch = () => {
    if (ideas) {
      const searchedIdeas = ideas.filter(idea =>
        idea.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredIdeas(searchedIdeas);
    }
  };

  const handleEditIdea = (id) => {
    setSelectedIdeaId(id);
  };

  const handleDeleteIdea = async () => {
    if (ideaToDelete) {
      await db.ideas.delete(ideaToDelete);
      setFilteredIdeas(filteredIdeas.filter(idea => idea.id !== ideaToDelete));
      setShowDeleteModal(false);
      setIdeaToDelete(null);
    }
  };

  const handleShowDeleteModal = (id) => {
    setIdeaToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setIdeaToDelete(null);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div>
      {!selectedIdeaId ? (
        <>
          <h1>Ideas</h1>
          <Form>
            <Form.Group className="mb-3" controlId="search">
              <Form.Control
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSearch}>
              Search
            </Button>
          </Form>
          <Container>
            <Row>
              {filteredIdeas?.map((idea) => (
                <Col key={idea.id} md={6} lg={4}>
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title>{idea.title}</Card.Title>
                      <Card.Text><strong>Creation Date:</strong> {new Date(idea.creationdate).toLocaleString()}</Card.Text>
                      <Card.Text><strong>Last Edited:</strong> {new Date(idea.lastedited).toLocaleString()}</Card.Text>
                      <Card.Text><strong>Type:</strong> {idea.ideatype}</Card.Text>
                      <Button variant="warning" onClick={() => handleEditIdea(idea.id)}>
                        Open
                      </Button>
                      <Button variant="danger" onClick={() => handleShowDeleteModal(idea.id)} className="ml-2">
                        Delete
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </>
      ) : (
        <IdeaEditor selectedIdeaId={selectedIdeaId} onClose={() => setSelectedIdeaId(null)} />
      )}
      <ConfirmDeleteModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleConfirm={handleDeleteIdea}
      />
    </div>
  );
}

export default IdeaList;