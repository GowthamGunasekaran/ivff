import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AppProvider } from './AppContext'

// The ! is typical in TS, but in JSX it's technically invalid syntax in standard JSX
// unless using TS tooling (which Vite handles seamlessly anyway), but we'll remove it 
// just to be pure JSX.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)
