import { useState, useEffect, useRef } from "react";

function CreatorPageView({ user }) {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postError, setPostError] = useState('');

    const textRef = useRef(null);
    const imageRef = useRef(null);

    const loadPage = async () => {
        const response = await fetch('http://localhost:3000/creators/me/page', {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            setPosts(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadPage();
    }, []);

    const handleCreatePost = async (event) => {
        event.preventDefault();
        setPostError('');

        const text = textRef.current.value.trim();
        if (!text) {
            setPostError('El texto del post no puede estar vacío');
            return;
        }

        
        const formData = new FormData();
        formData.append('text', text);
        if (imageRef.current.files[0]) {
            formData.append('image', imageRef.current.files[0]);
        }

        const response = await fetch('http://localhost:3000/creators/me/posts', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (response.ok) {
            textRef.current.value = '';
            imageRef.current.value = '';
            loadPage();
        } else {
            const data = await response.json();
            setPostError(data.error || 'Error al publicar');
        }
    };

    const handleDeletePost = async (postId) => {
        const response = await fetch(`http://localhost:3000/creators/me/posts/${postId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) loadPage();
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div>
            <h4 className="fw-bold mb-4">Mi Página</h4>

            {/* Formulario nuevo post */}
            <div className="card p-3 mb-4 shadow-sm">
                <h6 className="fw-semibold mb-3">Nueva publicación</h6>
                <form onSubmit={handleCreatePost}>
                    <div className="mb-2">
                        <textarea
                            className="form-control"
                            placeholder="¿Qué quieres compartir?"
                            rows={3}
                            ref={textRef}
                        />
                    </div>
                    <div className="mb-2">
                        <input type="file" className="form-control" accept="image/*" ref={imageRef} />
                    </div>
                    {postError && <div className="alert alert-danger py-2 mb-2">{postError}</div>}
                    <button type="submit" className="btn btn-primary btn-sm">Publicar</button>
                </form>
            </div>

            {/* Lista de posts */}
            {posts.length === 0 && <p className="text-muted">No tienes publicaciones aún.</p>}

            {posts.map((post) => (
                <div key={post.postId} className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                            <p className="mb-2">{post.text}</p>
                            <button
                                className="btn btn-outline-danger btn-sm ms-2"
                                onClick={() => handleDeletePost(post.postId)}
                            >
                                Eliminar
                            </button>
                        </div>

                        {post.imageUrl && (
                            <img
                                src={`http://localhost:3000/${post.imageUrl}`}
                                alt="imagen del post"
                                className="img-fluid rounded mb-2"
                                style={{ maxHeight: '300px', objectFit: 'cover' }}
                            />
                        )}

                        <small className="text-muted">
                            {new Date(post.created_at).toLocaleDateString('es-BO', {
                                day: '2-digit', month: 'short', year: 'numeric'
                            })}
                        </small>

                        {/* Comentarios */}
                        {post.comments && post.comments.length > 0 && (
                            <div className="mt-3">
                                <p className="fw-semibold mb-2" style={{ fontSize: '14px' }}>
                                    Comentarios ({post.comments.length})
                                </p>
                                {post.comments.map((comment) => (
                                    <div key={comment.commentId} className="bg-light rounded p-2 mb-2">
                                        <span className="fw-semibold" style={{ fontSize: '13px' }}>
                                            {comment.follower.name}
                                        </span>
                                        <p className="mb-0" style={{ fontSize: '13px' }}>{comment.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {post.comments && post.comments.length === 0 && (
                            <p className="text-muted mt-2" style={{ fontSize: '13px' }}>Sin comentarios aún.</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CreatorPageView;
