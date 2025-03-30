import { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NavbarComponent from '../components/NavbarComponent';
import IdeaList from '../components/IdeaList';

function App() {
  return (
    <Router>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<IdeaList />} />
        {/* Add other routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;