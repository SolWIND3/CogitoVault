import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import RenameBinderModal from './RenameBinderModal';
import AddNewIdea from './AddNewIdea';
import ClearDatabaseModal from './ClearDatabaseModal';
import ImportDataModal from './ImportDataModal';
import ImportConfirmationModal from './ImportConfirmationModal';
import ExportConfirmationModal from './ExportConfirmationModal'; // Import the new modal
import { useState } from 'react';
import { db } from '../models/db';
import download from 'downloadjs';

function NavbarComponent() {
  const [showRenameBinderModal, setShowRenameBinderModal] = useState(false);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [showClearDBModal, setShowClearDBModal] = useState(false);
  const [showImportDataModal, setShowImportDataModal] = useState(false);
  const [showImportConfirmationModal, setShowImportConfirmationModal] = useState(false);
  const [showExportConfirmationModal, setShowExportConfirmationModal] = useState(false); // State for export confirmation modal
  const [importedData, setImportedData] = useState(null);
  const [binderName, setBinderName] = useState('Binder.json');

  const handleShowRenameBinderModal = () => setShowRenameBinderModal(true);
  const handleCloseRenameBinderModal = () => setShowRenameBinderModal(false);

  const handleShowIdeaModal = () => setShowIdeaModal(true);
  const handleCloseIdeaModal = () => setShowIdeaModal(false);

  const handleShowClearDBModal = () => setShowClearDBModal(true);
  const handleCloseClearDBModal = () => setShowClearDBModal(false);

  const handleShowImportDataModal = () => setShowImportDataModal(true);
  const handleCloseImportDataModal = () => setShowImportDataModal(false);

  const handleShowImportConfirmationModal = () => setShowImportConfirmationModal(true);
  const handleCloseImportConfirmationModal = () => setShowImportConfirmationModal(false);

  const handleShowExportConfirmationModal = () => setShowExportConfirmationModal(true);
  const handleCloseExportConfirmationModal = () => setShowExportConfirmationModal(false);

  const handleExportData = async () => {
    const ideas = await db.ideas.toArray();
    const data = { ideas };
    const json = JSON.stringify(data, null, 2);
    download(json, binderName, 'application/json');
    handleCloseExportConfirmationModal(); // Close the modal after exporting
  };

  const handleImportData = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const json = e.target.result;
        const data = JSON.parse(json);
        setImportedData(data);
        handleShowImportDataModal();
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmImportData = async (ideasToImport) => {
    await db.ideas.bulkAdd(ideasToImport);
    handleCloseImportDataModal();
    handleShowImportConfirmationModal();
  };

  return (
    <>
      <Navbar expand="lg" style={{ backgroundColor: '#181818' }} variant="dark">
        <Container>
          <Navbar.Brand>CogitoVault🧠</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Button onClick={handleShowIdeaModal}>New Idea</Button>
              <NavDropdown title="My Binder" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => document.getElementById('import-data-input').click()}>Import Binder</NavDropdown.Item>
                <NavDropdown.Item onClick={handleShowExportConfirmationModal}>Export Binder</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleShowRenameBinderModal}>Rename Binder</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleShowClearDBModal}>Clear All Data</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <input
        type="file"
        id="import-data-input"
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleImportData}
      />
      <RenameBinderModal
        show={showRenameBinderModal}
        handleClose={handleCloseRenameBinderModal}
        binderName={binderName}
        setBinderName={setBinderName}
      />
      <AddNewIdea show={showIdeaModal} handleClose={handleCloseIdeaModal} />
      <ClearDatabaseModal show={showClearDBModal} handleClose={handleCloseClearDBModal} />
      <ImportDataModal
        show={showImportDataModal}
        handleClose={handleCloseImportDataModal}
        importedData={importedData}
        handleConfirmImportData={handleConfirmImportData}
      />
      <ImportConfirmationModal
        show={showImportConfirmationModal}
        handleClose={handleCloseImportConfirmationModal}
      />
      <ExportConfirmationModal
        show={showExportConfirmationModal}
        handleClose={handleCloseExportConfirmationModal}
        handleConfirm={handleExportData}
      />
    </>
  );
}

export default NavbarComponent;