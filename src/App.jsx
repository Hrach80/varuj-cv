import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout/Layout.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; 


function App() {
  return (
    <LanguageProvider>
      <AuthProvider> 
        <BrowserRouter>
          <Layout />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider> 
    </LanguageProvider>
  );
}

export default App;