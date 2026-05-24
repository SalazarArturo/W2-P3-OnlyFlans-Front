import { useState, useEffect, useRef } from "react";

function FollowerCreatorProfileView({ creatorId, followerId, onBack }) {

    const [creator, setCreator] = useState(null);
    const [posts, setPosts] = useState(null); // null = no cargados, [] = cargados pero vacíos
    const [hasDonated, setHasDonated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [donateError, setDonateError] = useState('');
    const [donateSuccess, setDonateSuccess] = useState('');
    const [favoriteMsg, setFavoriteMsg] = useState('');
    const [commentTexts, setCommentTexts] = useState({}); // postId -> text
    const [commentErrors, setCommentErrors] = useState({});

    const flanCountRef = useRef(null);
    const messageRef = useRef(null);

    const loadCreatorProfile = async () => {
        const response = await fetch(`http://localhost:3000/followers/${creatorId}/public`, {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            setCreator(data);
        }
    };

    const loadPosts = async () => {
        const response = await fetch(`http://localhost:3000/followers/creators/${creatorId}/posts`, {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            // solo guardamos text, postId, imageUrl, created_at (sin comentarios - el backend los incluye pero la consigna dice que solo el creador los ve)
            const cleanPosts = data.map(p => ({
                postId: p.postId,
                text: p.text,
                imageUrl: p.imageUrl,
                created_at: p.created_at
            }));
            setPosts(cleanPosts);
            setHasDonated(true);
        } else if (response.status === 403) {
            setHasDonated(false);
            setPosts(null);
        }
    };

    useEffect(() => {
        const init = async () => {
            await loadCreatorProfile();
            await loadPosts();
            setLoading(false);
        };
        init();
    }, [creatorId]);

    const handleDonate = async (event) => {
        event.preventDefault();
        setDonateError('');
        setDonateSuccess('');

        const flanCount = parseInt(flanCountRef.current.value);
        if (!flanCount || flanCount < 1) {
            setDonateError('Ingresa al menos 1 flan');
            return;
        }

        const response = await fetch(`http://localhost:3000/followers/creators/${creatorId}/donate`, {
            method: 'POST',
            headers: { "Content-type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({
                flanCount,
                message: messageRef.current.value || null
            })
        });

        if (response.ok) {
            setDonateSuccess(`¡Donaste ${flanCount} flan(es) exitosamente!`);
            flanCountRef.current.value = '';
            messageRef.current.value = '';
            // recargamos los posts porque ahora sí debería poder verlos
            await loadPosts();
        } else {
            const data = await response.json();
            setDonateError(data.error || 'Error al donar');
        }
    };

    const handleAddFavorite = async () => {
        setFavoriteMsg('');
        const response = await fetch(`http://localhost:3000/followers/favorites/${creatorId}`, {
            method: 'POST',
            credentials: 'include'
        });
        const data = await response.json();
        setFavoriteMsg(data.message || data.error);
    };

    const handleRemoveFavorite = async () => {
        setFavoriteMsg('');
        const response = await fetch(`http://localhost:3000/followers/favorites/${creatorId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        const data = await response.json();
        setFavoriteMsg(data.message || data.error);
    };

    const handleComment = async (postId) => {
        setCommentErrors(prev => ({ ...prev, [postId]: '' }));
        const text = commentTexts[postId] || '';

        if (!text.trim()) {
            setCommentErrors(prev => ({ ...prev, [postId]: 'El comentario no puede estar vacío' }));
            return;
        }

        const response = await fetch(
            `http://localhost:3000/followers/creators/${creatorId}/posts/${postId}/comments`,
            {
                method: 'POST',
                headers: { "Content-type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ text })
            }
        );

        if (response.ok) {
            setCommentTexts(prev => ({ ...prev, [postId]: '' }));
        } else {
            const data = await response.json();
            setCommentErrors(prev => ({ ...prev, [postId]: data.error || 'Error al comentar' }));
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (!creator) return <p>Creador no encontrado.</p>;

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>

            {/* Botón volver */}
            <button className="btn btn-outline-secondary btn-sm mb-3" onClick={onBack}>
                ← Volver a Creadores
            </button>

            {/* Banner */}
            {creator.creatorProfile?.bannerPhoto && (
                <img
                    src={`http://localhost:3000/${creator.creatorProfile.bannerPhoto}`}
                    alt="banner"
                    className="img-fluid rounded mb-3 w-100"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
            )}

            {/* Header del perfil */}
            <div className="d-flex align-items-center gap-3 mb-3">
                {creator.creatorProfile?.profilePhoto ? (
                    <img
                        src={`http://localhost:3000/${creator.creatorProfile.profilePhoto}`}
                        alt="foto"
                        className="rounded-circle"
                        style={{ width: '72px', height: '72px', objectFit: 'cover' }}
                    />
                ) : (
                    <div
                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: '72px', height: '72px', fontSize: '26px', flexShrink: 0 }}
                    >
                        {creator.name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <h5 className="fw-bold mb-0">{creator.name}</h5>
                    {creator.creatorProfile?.bio && (
                        <p className="text-muted mb-0" style={{ fontSize: '14px' }}>{creator.creatorProfile.bio}</p>
                    )}
                </div>
            </div>

            {/* Botones favorito */}
            <div className="d-flex gap-2 mb-3">
                <button className="btn btn-outline-warning btn-sm" onClick={handleAddFavorite}>
                    ★ Agregar a favoritos
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={handleRemoveFavorite}>
                    Quitar de favoritos
                </button>
            </div>
            {favoriteMsg && <p className="text-muted" style={{ fontSize: '13px' }}>{favoriteMsg}</p>}

            {/* Metas */}
            {creator.goals && creator.goals.length > 0 && (
                <div className="card p-3 mb-4 shadow-sm">
                    <h6 className="fw-semibold mb-2">Metas de apoyo</h6>
                    {creator.goals.map((goal) => (
                        <div key={goal.goalId} className="mb-2">
                            <p className="fw-semibold mb-0" style={{ fontSize: '14px' }}>{goal.title}</p>
                            <p className="text-muted mb-0" style={{ fontSize: '13px' }}>{goal.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Donación */}
            <div className="card p-3 mb-4 shadow-sm">
                <h6 className="fw-semibold mb-3">
                    🍮 Enviar flanes — Bs. {creator.creatorProfile?.flanPrice} c/u
                </h6>
                <form onSubmit={handleDonate}>
                    <div className="row g-2">
                        <div className="col-sm-4">
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="Cantidad de flanes"
                                min={1}
                                ref={flanCountRef}
                            />
                        </div>
                        <div className="col-sm-8">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Mensaje opcional"
                                ref={messageRef}
                            />
                        </div>
                    </div>
                    {donateError && <div className="alert alert-danger py-1 mt-2" style={{ fontSize: '13px' }}>{donateError}</div>}
                    {donateSuccess && <div className="alert alert-success py-1 mt-2" style={{ fontSize: '13px' }}>{donateSuccess}</div>}
                    <button type="submit" className="btn btn-warning btn-sm mt-2 fw-semibold">
                        Donar
                    </button>
                </form>
            </div>

            {/* Posts */}
            <h6 className="fw-semibold mb-3">Publicaciones</h6>

            {!hasDonated && (
                <div className="alert alert-info">
                    Dona al menos 1 flan para ver las publicaciones de {creator.name}.
                </div>
            )}

            {hasDonated && posts && posts.length === 0 && (
                <p className="text-muted">Este creador no tiene publicaciones aún.</p>
            )}

            {hasDonated && posts && posts.map((post) => (
                <div key={post.postId} className="card mb-3 shadow-sm">
                    <div className="card-body">
                        <p className="mb-2">{post.text}</p>
                        {post.imageUrl && (
                            <img
                                src={`http://localhost:3000/${post.imageUrl}`}
                                alt="imagen"
                                className="img-fluid rounded mb-2 w-100"
                                style={{ maxHeight: '300px', objectFit: 'cover' }}
                            />
                        )}
                        <small className="text-muted d-block mb-3">
                            {new Date(post.created_at).toLocaleDateString('es-BO', {
                                day: '2-digit', month: 'short', year: 'numeric'
                            })}
                        </small>

                        {/* Comentar */}
                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Escribe un comentario..."
                                value={commentTexts[post.postId] || ''}
                                onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.postId]: e.target.value }))}
                            />
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleComment(post.postId)}
                            >
                                Comentar
                            </button>
                        </div>
                        {commentErrors[post.postId] && (
                            <p className="text-danger mt-1 mb-0" style={{ fontSize: '12px' }}>
                                {commentErrors[post.postId]}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FollowerCreatorProfileView;
