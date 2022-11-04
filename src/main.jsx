import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from "react-router-dom";
import './scss/styles.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrapping App in BrowserRouter allows the innards of App to control the URL in the URL bar. */}
    <BrowserRouter><App /></BrowserRouter>
  </React.StrictMode>
)
