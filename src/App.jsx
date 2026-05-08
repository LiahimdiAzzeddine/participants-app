import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ParticipantDetail from './pages/ParticipantDetail';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/participant/:id" element={<ParticipantDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
