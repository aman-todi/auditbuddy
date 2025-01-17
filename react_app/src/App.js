import React, { useState, useEffect } from 'react';
import * as MaterialUI from './components/MaterialUI';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from './pages/home';
import LoginPage from './pages/login';
import { AllResultsProvider } from './components/AllResultsContext';
// audit and subpages
import SettingsPage from './pages/settings';
import ContactPage from './pages/contact';
import AuditPage from './pages/audit';
import UploadPage from './pages/audit-upload';
import ProfilePage from './pages/profile';
import ResultsPage from './pages/audit-results';
import AdvancedResultsPage from './pages/audit-results-advanced';
import AdminUserPage from './pages/admin-users';
import DealershipsPage from './pages/audit-dealerships';

// for checking admin users
import { AdminCheck } from './components/Admin';

// for light/dark mode
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "../node_modules/@mui/material/CssBaseline";

// for notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {


  const savedDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
  const [darkMode, setDarkMode] = useState(savedDarkMode);


  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    // Store the dark mode preference in localStorage
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };


  useEffect(() => {
    console.log("Dark mode:", darkMode);
  }, [darkMode]);


  const darkT = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (


    <ThemeProvider theme={darkT}>
      <CssBaseline />
      <React.Fragment>
        <div>
          <ToastContainer position="bottom-right" />

          <AdminCheck>
            <BrowserRouter>
              <MaterialUI.NavBar></MaterialUI.NavBar>
              <AllResultsProvider>
              <Routes>
                <Route exact path="/" element={<HomePage />}></Route>
                <Route exact path="/login" element={<LoginPage />}></Route>
                <Route exact path="/audit/dashboard" element={<AuditPage />}></Route>
                <Route path="/audit/upload" element={<UploadPage />}></Route>
                <Route path="/audit/results" element={<ResultsPage />}></Route>
                <Route path="/audit/upload" element={<UploadPage />}></Route>
                <Route path="/audit/results" element={<ResultsPage />}></Route>
                <Route path="/audit/profile" element={<ProfilePage />} />
                <Route path="/audit/contact" element={<ContactPage />}></Route>
                <Route path="/audit/settings" element={<SettingsPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
                <Route path="/audit/users" element={<AdminUserPage />}></Route>
                <Route path="/audit/dealerships" element={<DealershipsPage />}></Route>

                <Route path="/audit/results/advanced-results" element={<AdvancedResultsPage />} />
              </Routes>
              </AllResultsProvider>
            </BrowserRouter>
          </AdminCheck>
        </div>
      </React.Fragment>
    </ThemeProvider>
  );
}


export default App;