import { useState, useEffect, useRef } from "react";

function FollowerCreatorsView({ onSelectCreator }) {

    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);

    const searchRef = useRef(null);

    const loadCreators = async (query = '') => {
        const params = new URLSearchParams();
        if (query) params.append('q', query);

        const response = await fetch(`http://localhost:3000/followers/search?${params.toString()}`, {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            setCreators(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadCreators();
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        setLoading(true);
        loadCreators(searchRef.current.value.trim());
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div>
            <h4 className="fw-bold mb-4">Creadores</h4>

           
            <form onSubmit={handleSearch} className="d-flex gap-2 mb-4" style={{ maxWidth: '400px' }}>
                <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Buscar por nombre..."
                    ref={searchRef}
                />
                <button type="submit" className="btn btn-primary btn-sm">Buscar</button>
                <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => { searchRef.current.value = ''; loadCreators(); }}
                >
                    Ver todos
                </button>
            </form>

            {creators.length === 0 && <p className="text-muted">No se encontraron creadores.</p>}

            <div className="row g-3">
                {creators.map((creator) => (
                    <div key={creator.userId} className="col-sm-6 col-md-4">
                        <div
                            className="card shadow-sm h-100"
                            style={{ cursor: 'pointer' }}
                            onClick={() => onSelectCreator(creator.userId)}
                        >
                            {creator.creatorProfile?.bannerPhoto && (
                                <img
                                    src={`http://localhost:3000/${creator.creatorProfile.bannerPhoto}`}
                                    alt="banner"
                                    style={{ height: '80px', objectFit: 'cover' }}
                                    className="card-img-top"
                                />
                            )}
                            <div className="card-body d-flex align-items-center gap-3">
                                {creator.creatorProfile?.profilePhoto ? (
                                    <img
                                        src={`http://localhost:3000/${creator.creatorProfile.profilePhoto}`}
                                        alt="foto"
                                        className="rounded-circle"
                                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                                        style={{ width: '48px', height: '48px', fontSize: '18px', flexShrink: 0 }}
                                    >
                                        {creator.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="fw-semibold mb-0">{creator.name}</p>
                                    {creator.creatorProfile?.bio && (
                                        <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                                            {creator.creatorProfile.bio.slice(0, 60)}{creator.creatorProfile.bio.length > 60 ? '...' : ''}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FollowerCreatorsView;
