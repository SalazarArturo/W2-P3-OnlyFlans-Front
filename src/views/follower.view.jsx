import { useState } from "react";
import { useNavigate } from "react-router";

import FollowerFeedView from "./followerFeed.view.jsx";
import FollowerCreatorsView from "./followerCreators.view.jsx";
import FollowerCreatorProfileView from "./followerCreatorProfile.view.jsx";
import FollowerFavoritesView from "./followerFavorites.view.jsx";
import FollowerDonationsView from "./followerDonations.view.jsx";

function FollowerView({ user }) {

    const [activeSection, setActiveSection] = useState('feed');
    const [selectedCreatorId, setSelectedCreatorId] = useState(null);

    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch('http://localhost:3000/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        navigate('/');
    };

    const handleSelectCreator = (creatorId) => {
        
        setSelectedCreatorId(creatorId);
        setActiveSection('creatorProfile');
    };

    const handleBackToCreators = () => {
        setSelectedCreatorId(null);
        setActiveSection('creators');
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
                <span className="navbar-brand fw-bold">OnlyFlans</span>

                <div className="d-flex gap-2 ms-auto align-items-center">
                    <span className="text-white me-3" style={{ fontSize: '14px' }}>Hola, {user.name}</span>

                    <button
                        className={`btn btn-sm ${activeSection === 'feed' ? 'btn-light' : 'btn-outline-light'}`}
                        onClick={() => setActiveSection('feed')}
                    >
                        Feed
                    </button>
                    <button
                        className={`btn btn-sm ${activeSection === 'creators' || activeSection === 'creatorProfile' ? 'btn-light' : 'btn-outline-light'}`}
                        onClick={() => { setSelectedCreatorId(null); setActiveSection('creators'); }}
                    >
                        Creadores
                    </button>
                    <button
                        className={`btn btn-sm ${activeSection === 'favorites' ? 'btn-light' : 'btn-outline-light'}`}
                        onClick={() => setActiveSection('favorites')}
                    >
                        Favoritos
                    </button>
                    <button
                        className={`btn btn-sm ${activeSection === 'donations' ? 'btn-light' : 'btn-outline-light'}`}
                        onClick={() => setActiveSection('donations')}
                    >
                        Mis Donaciones
                    </button>
                    <button className="btn btn-sm btn-danger ms-2" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            <div className="container mt-4">
                {activeSection === 'feed' && <FollowerFeedView user={user} onSelectCreator={handleSelectCreator} />}
                {activeSection === 'creators' && <FollowerCreatorsView onSelectCreator={handleSelectCreator} />}
                {activeSection === 'creatorProfile' && selectedCreatorId && (
                    <FollowerCreatorProfileView
                        creatorId={selectedCreatorId}
                        followerId={user.userId}
                        onBack={handleBackToCreators}
                    />
                )}
                {activeSection === 'favorites' && <FollowerFavoritesView onSelectCreator={handleSelectCreator} />}
                {activeSection === 'donations' && <FollowerDonationsView />}
            </div>
        </div>
    );
}

export default FollowerView;
