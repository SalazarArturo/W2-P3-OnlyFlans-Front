import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import LoginForm from './pages/login.jsx';
import RegisterUserForm from './pages/registerUserForm.jsx';
import WelcomePage from './pages/welcomePage.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/register" element={<RegisterUserForm />} />
                <Route path="/welcome" element={<WelcomePage />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
