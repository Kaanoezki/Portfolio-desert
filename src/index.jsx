
import ReactDOM from 'react-dom/client';// display render
import './index.css'; // Optional: Import von globalen CSS
import App from './App'; // Import des Haupt-Components

// Erstellen einer "Root" und dann das Rendern
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
