
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import App from './App.tsx'
import './index.css'

// Get the root element and render the App
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');
const root = createRoot(rootElement);

// Wrap the App in BrowserRouter here instead of inside App.tsx
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
