import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col } from 'react-bootstrap';
import { db } from '../models/db.js';
import IdeaEditor from './IdeaEditor';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { useLiveQuery } from 'dexie-react-hooks';
import './IdeaList.css'; // Import the CSS file

function IdeaList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState(null);
  const [filterType, setFilterType] = useState(''); // State for filtering by ideatype
  const [ideaTypes, setIdeaTypes] = useState([]); // State to store unique ideatypes

  const ideas = useLiveQuery(
    () => db.ideas.toArray(),
    []
  );

  useEffect(() => {
    if (ideas) {
      setFilteredIdeas(ideas);
      fetchIdeaTypes();
    }
  }, [ideas]);

  const fetchIdeaTypes = () => {
    const uniqueTypesWithContent = [
      ...new Set(
        ideas
          .filter((idea) => idea.content && idea.content.trim() !== '') // Ensure the idea has content
          .map((idea) => idea.ideatype)
          .filter((type) => type && type.trim() !== '') // Ensure the ideatype is not empty
      ),
    ];
    setIdeaTypes(uniqueTypesWithContent);
  };

  const handleSearch = () => {
    if (ideas) {
      const searchedIdeas = ideas.filter((idea) => {
        const matchesSearchTerm = idea.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilterType = filterType ? idea.ideatype === filterType : true;
        return matchesSearchTerm && matchesFilterType;
      });
      setFilteredIdeas(searchedIdeas);
    }
  };

  const handleEditIdea = (id) => {
    setSelectedIdeaId(id);
  };

  const handleDeleteIdea = async () => {
    if (ideaToDelete) {
      await db.ideas.delete(ideaToDelete);
      setFilteredIdeas(filteredIdeas.filter((idea) => idea.id !== ideaToDelete));
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
    <div className="idea-list-container">
      {!selectedIdeaId ? (
        <>
          <h1>Menu</h1>
          <Form>
            <Form.Group className="mb-3" controlId="search">
              <Form.Control
                type="text"
                placeholder="Search by title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="filterType">
              <Form.Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Types</option>
                {ideaTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
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
                      <Card.Text><strong>Status:</strong> {idea.status}</Card.Text> {/* Display the status */}
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
          <div className="back-to-main">
            <Link to="/" className="btn btn-secondary">
              Back to Main Page
            </Link>
          </div>
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