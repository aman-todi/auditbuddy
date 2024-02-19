import React from 'react';
import * as MaterialUI from './components/MaterialUI';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from './pages/home';
import LoginPage from './pages/login';
// audit and subpages
import AuditPage from './pages/audit';
import UploadPage from './pages/audit-upload';
import ResultsPage from './pages/audit-results';
import AdvancedResultsPage from './pages/audit-results-advanced';
import AdminPage from './pages/admin-console';
import { AdminCheck } from './components/Admin';

function App() {
  return (
    <React.Fragment>
      <AdminCheck>
      <BrowserRouter>
        <MaterialUI.NavBar></MaterialUI.NavBar>
        <Routes>
          <Route exact path="/" element={<HomePage />}></Route>
          <Route exact path="/login" element={<LoginPage />}></Route>
          <Route exact path="/audit" element={<AuditPage />}></Route>
          <Route path="/audit/upload" element={<UploadPage />}></Route>
          <Route path="/audit/results" element={<ResultsPage />}></Route>
          <Route path="/audit/admin-console" element={<AdminPage />}></Route>
          <Route path="/audit/results/:brandName/:dealershipName/:department/:submission" element={<AdvancedResultsPage />} />
        </Routes>
      </BrowserRouter>
      </AdminCheck>
    </React.Fragment>
  );
}

export default App;