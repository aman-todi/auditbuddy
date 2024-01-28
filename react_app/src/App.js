import React from 'react';
import * as MaterialUI from './components/MaterialUI';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import HomePage from './pages/home';
import LoginPage from './pages/login';
import AuditPage from './pages/audit';

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
      <MaterialUI.NavBar></MaterialUI.NavBar>
        <Routes>
          <Route exact path="/" element={<HomePage/>}></Route>
          <Route exact path="/login" element={<LoginPage/>}></Route>
          <Route exact path="/audit" element={<AuditPage/>}></Route>

        </Routes>
    </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
