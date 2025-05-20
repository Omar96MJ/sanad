
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { SettingsProvider } from './hooks/useSettings.tsx'

// Get the root element and render the App
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');
const root = createRoot(rootElement);
root.render(
  <SettingsProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SettingsProvider>
);
