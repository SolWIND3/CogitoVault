import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import { FaLightbulb } from 'react-icons/fa'; // Import an icon from react-icons
import NavbarComponent from '../components/NavbarComponent';
import IdeaList from '../components/IdeaList';
import Icon from '/AltIcon.png'; // Corrected path

function App() {
  return (
    <Router>
      <NavbarComponent />
      <Routes>
        {/* Main page with a button */}
        <Route
          path="/"
          element={
            <div className="main-page">
              <img src={Icon} alt="App Icon" className="app-icon" />
              <div className="glowing-text">"Cogito, Ergo Sum"</div> {/* Glowing text */}
              <Link to="/ideas" className="menu-button">
                <FaLightbulb size={24} style={{ marginRight: '8px' }} />
                Open Menu
              </Link>
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
                <span> Disclaimer: All user data Saved on CogitoVault are all locally stored within the browser. </span>
              </footer>
            </div>
          }
        />
        {/* Route for the IdeaList */}
        <Route path="/ideas" element={<><IdeaList /></>} />
      </Routes>
    </Router>
  );
}

export default App;