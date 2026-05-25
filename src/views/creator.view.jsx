import { useState } from "react";
import { useNavigate } from "react-router";

import CreatorPageView from "./creatorPage.view.jsx";
import CreatorProfileView from "./creatorProfile.view.jsx";
import CreatorGoalsView from "./creatorGoals.view.jsx";
import CreatorIncomeView from "./creatorIncome.view.jsx";

function CreatorView({ user }) {

    const [activeSection, setActiveSection] = useState('page');
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        await fetch('http://localhost:3000/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        navigate('/');
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
                <span className="navbar-brand fw-bold">OnlyFlans</span>

                <div className="d-flex gap-2 ms-auto align-items-center">
                    <span className="text-white me-3" style={{ fontSize: '14px' }}>Hola, {user.name}</span>

                    <button
                        className={`btn btn-sm ${activeSection === 'page' ? 'btn-light' : 'btn-outline-light'}`}
                        onClick={() => setActiveSection('page')}
                    >
                        Mi Página
                    </button>
                    <button
                        className={`btn btn-sm ${activeSection === 'profile' ? 'btn-light' : 'btn-outline-light'}`}
                        onClick={() => setActiveSection('profile')}
                    >
                        Mi Perfil
                    </button>
                    <button
                        className={`btn btn-sm ${activeSection === 'goals' ? 'btn-light' : 'btn-outline-light'}`}
                        onClick={() => setActiveSection('goals')}
                    >
                        Metas
                    </button>
                    <button
                        className={`btn btn-sm ${activeSection === 'income' ? 'btn-light' : 'btn-outline-light'}`}
                        onClick={() => setActiveSection('income')}
                    >
                        Ingresos
                    </button>
                    <button className="btn btn-sm btn-danger ms-2" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            <div className="container mt-4">
                {activeSection === 'page' && <CreatorPageView user={user} />}
                {activeSection === 'profile' && <CreatorProfileView user={user} />}
                {activeSection === 'goals' && <CreatorGoalsView user={user} />}
                {activeSection === 'income' && <CreatorIncomeView user={user} />}
            </div>
        </div>
    );
}

export default CreatorView;
