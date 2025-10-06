import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* CORRECTED: Added basename to fix routing on GitHub Pages */}
    <BrowserRouter basename="/Varsha-Raksha/">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
