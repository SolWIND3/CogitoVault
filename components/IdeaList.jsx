import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col } from 'react-bootstrap';
import { db } from '../models/db.js';
import IdeaEditor from './IdeaEditor';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import './IdeaList.css';

function IdeaList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [allIdeas, setAllIdeas] = useState([]); // Store all ideas
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState(null);
  const [filterType, setFilterType] = useState(''); // State for filtering by ideatype
  const [ideaTypes, setIdeaTypes] = useState([]); // State to store unique ideatypes
  const [sortOrder, setSortOrder] = useState(''); // State for sorting order

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = () => {
    db.ideas
      .toArray()
      .then((ideas) => {
        setAllIdeas(ideas);
        setFilteredIdeas(ideas);
        fetchIdeaTypes(ideas);
      })
      .catch((error) => {
        console.error('Error fetching ideas:', error);
      });
  };

  const fetchIdeaTypes = (ideas) => {
    const uniqueTypes = [
      ...new Set(
        ideas
          .map((idea) => idea.ideatype)
          .filter((type) => type && type.trim() !== '') // Ensure the ideatype is not empty
      ),
    ];
    setIdeaTypes(uniqueTypes);
  };

  const handleSearch = () => {
    let searchedIdeas = allIdeas.filter((idea) => {
      const matchesSearchTerm = idea.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilterType = filterType ? idea.ideatype === filterType : true;
      return matchesSearchTerm && matchesFilterType;
    });

    // Apply sorting by creation date
    if (sortOrder === 'newest') {
      searchedIdeas = searchedIdeas.sort((a, b) => new Date(b.creationdate) - new Date(a.creationdate));
    } else if (sortOrder === 'oldest') {
      searchedIdeas = searchedIdeas.sort((a, b) => new Date(a.creationdate) - new Date(b.creationdate));
    }

    setFilteredIdeas(searchedIdeas);
  };

  const handleEditIdea = (id) => {
    setSelectedIdeaId(id);
  };

  const handleDeleteIdea = () => {
    if (ideaToDelete) {
      db.ideas
        .delete(ideaToDelete)
        .then(() => {
          fetchIdeas(); // Refresh the list after deletion
          setShowDeleteModal(false);
          setIdeaToDelete(null);
        })
        .catch((error) => {
          console.error('Error deleting idea:', error);
        });
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
            <Form.Group className="mb-3" controlId="sortOrder">
              <Form.Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="oldest">Oldest to Newest</option>
                <option value="newest">Newest to Oldest</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" onClick={handleSearch}>
              Search
            </Button>
            <Button variant="secondary" onClick={fetchIdeas} className="ml-2">
              Refresh List
            </Button>
          </Form>
          <Container>
            <Row>
              {filteredIdeas.length > 0 ? (
                filteredIdeas.map((idea) => (
                  <Col key={idea.id} md={6} lg={4}>
                    <Card className="mb-3">
                      <Card.Body>
                        <Card.Title>{idea.title}</Card.Title>
                        <Card.Text><strong>Creation Date:</strong> {new Date(idea.creationdate).toLocaleString()}</Card.Text>
                        <Card.Text><strong>Last Edited:</strong> {new Date(idea.lastedited).toLocaleString()}</Card.Text>
                        <Card.Text><strong>Type:</strong> {idea.ideatype}</Card.Text>
                        <Card.Text><strong>Status:</strong> {idea.status}</Card.Text>
                        <Button variant="warning" onClick={() => handleEditIdea(idea.id)}>
                          Open
                        </Button>
                        <Button variant="danger" onClick={() => handleShowDeleteModal(idea.id)} className="ml-2">
                          Delete
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col>
                  <p className="text-center mt-5">
                    Ain't Nobody here but us chickens! (Create a new idea by pressing the "New Idea" Button or import a Binder!)
                  </p>
                </Col>
              )}
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
      <footer className="footer">
        Made with <span className="heart">❤️</span> By{' '}
        <a
          href="https://github.com/SolWIND3"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          SolWIND3
        </a>
        <br />
        <span>© {new Date().getFullYear()} CogitoVault. All rights reserved.</span>
        <br />
        <span>Disclaimer: All user data saved on CogitoVault are locally stored within the browser.</span>
      </footer>
    </div>
  );
}

export default IdeaList;