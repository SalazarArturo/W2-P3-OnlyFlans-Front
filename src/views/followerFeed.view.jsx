import { useState, useEffect } from "react";

function FollowerFeedView({ user, onSelectCreator }) {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeed = async () => {
            const response = await fetch('http://localhost:3000/followers/feed', {
                credentials: 'include'
            });
            if (response.ok) { //esto en el back deberia estar validado como respuesta correcta no es un error que el array de posts este vacio, es un comportamiento valido
                const data = await response.json();
                setPosts(data);
            }
            setLoading(false);
        };
        loadFeed();
    }, []);

    if (loading) return <p>Cargando...</p>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h4 className="fw-bold mb-4">Feed</h4>

            {posts.length === 0 && (
                <div className="text-center text-muted mt-5">
                    <p>Tu feed está vacío.</p>
                    <p style={{ fontSize: '14px' }}>Dona a un creador para ver sus publicaciones acá.</p>
                </div>
            )}

            {posts.map((post) => (
                <div key={post.postId} className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <div
                                className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                                style={{ width: '36px', height: '36px', fontSize: '14px', flexShrink: 0 }}
                            >
                                {post.creator.name.charAt(0).toUpperCase()}
                            </div>
                            <span
                                className="fw-semibold text-primary"
                                style={{ cursor: 'pointer', fontSize: '14px' }}
                                onClick={() => onSelectCreator(post.creator.userId)}
                            >
                                {post.creator.name}
                            </span>
                        </div>

                        <p className="mb-2">{post.text}</p>

                        {post.imageUrl && (
                            <img
                                src={`http://localhost:3000/${post.imageUrl}`}
                                alt="imagen del post"
                                className="img-fluid rounded mb-2 w-100"
                                style={{ maxHeight: '300px', objectFit: 'cover' }}
                            />
                        )}

                        <small className="text-muted">
                            {new Date(post.created_at).toLocaleDateString('es-BO', {
                                day: '2-digit', month: 'short', year: 'numeric'
                            })}
                        </small>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FollowerFeedView;
