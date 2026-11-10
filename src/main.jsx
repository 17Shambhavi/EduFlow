import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import "./Theme.css";
import App from './App.jsx'

// Send all old localhost:8080 API calls to the deployed backend
const LOCAL_API = 'http://localhost:8080'
const API_URL = import.meta.env.VITE_API_URL || LOCAL_API

axios.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith(LOCAL_API)) {
    config.url = API_URL + config.url.slice(LOCAL_API.length)
  }
  return config
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
