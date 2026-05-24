import { useState, useEffect } from "react";

function FollowerFavoritesView({ onSelectCreator }) {

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadFavorites = async () => {
        const response = await fetch('http://localhost:3000/followers/favorites', {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            setFavorites(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadFavorites();
    }, []);

    const handleRemoveFavorite = async (creatorId) => {
        const response = await fetch(`http://localhost:3000/followers/favorites/${creatorId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) loadFavorites();
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div>
            <h4 className="fw-bold mb-4">Mis Favoritos</h4>

            {favorites.length === 0 && (
                <p className="text-muted">No tienes creadores favoritos aún.</p>
            )}

            <div className="row g-3">
                {favorites.map((creator) => (
                    <div key={creator.userId} className="col-sm-6 col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body d-flex align-items-center gap-3">
                                {creator.creatorProfile?.profilePhoto ? (
                                    <img
                                        src={`http://localhost:3000/${creator.creatorProfile.profilePhoto}`}
                                        alt="foto"
                                        className="rounded-circle"
                                        style={{ width: '48px', height: '48px', objectFit: 'cover', flexShrink: 0 }}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                                        style={{ width: '48px', height: '48px', fontSize: '18px', flexShrink: 0 }}
                                    >
                                        {creator.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-grow-1">
                                    <p
                                        className="fw-semibold mb-0 text-primary"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => onSelectCreator(creator.userId)}
                                    >
                                        {creator.name}
                                    </p>
                                    {creator.creatorProfile?.bio && (
                                        <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                                            {creator.creatorProfile.bio.slice(0, 50)}{creator.creatorProfile.bio.length > 50 ? '...' : ''}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="card-footer bg-transparent border-0 pt-0">
                                <button
                                    className="btn btn-outline-danger btn-sm w-100"
                                    onClick={() => handleRemoveFavorite(creator.userId)}
                                >
                                    Quitar de favoritos
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FollowerFavoritesView;
