import { useState, useEffect, useRef } from "react";

function CreatorProfileView({ user }) {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bioSuccess, setBioSuccess] = useState('');
    const [photoSuccess, setPhotoSuccess] = useState('');
    const [bannerSuccess, setBannerSuccess] = useState('');

    const bioRef = useRef(null);
    const photoRef = useRef(null);
    const bannerRef = useRef(null);

    const loadProfile = async () => {
        const response = await fetch('http://localhost:3000/creators/me/profile', {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            setProfile(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleUpdateBio = async (event) => {
        event.preventDefault();
        setBioSuccess('');

        const response = await fetch('http://localhost:3000/creators/me/profile', {
            method: 'PUT',
            headers: { "Content-type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({ bio: bioRef.current.value })
        });

        if (response.ok) {
            setBioSuccess('Biografía actualizada correctamente');
            loadProfile();
        }
    };

    const handleUploadPhoto = async (event) => {
        event.preventDefault();
        setPhotoSuccess('');

        if (!photoRef.current.files[0]) return;

        const formData = new FormData();
        formData.append('profilePhoto', photoRef.current.files[0]);

        const response = await fetch('http://localhost:3000/creators/me/profile/photo', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (response.ok) {
            setPhotoSuccess('Foto de perfil actualizada');
            photoRef.current.value = '';
            loadProfile();
        }
    };

    const handleUploadBanner = async (event) => {
        event.preventDefault();
        setBannerSuccess('');

        if (!bannerRef.current.files[0]) return;

        const formData = new FormData();
        formData.append('bannerPhoto', bannerRef.current.files[0]);

        const response = await fetch('http://localhost:3000/creators/me/profile/banner', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (response.ok) {
            setBannerSuccess('Banner actualizado');
            bannerRef.current.value = '';
            loadProfile();
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div style={{ maxWidth: '600px' }}>
            <h4 className="fw-bold mb-4">Mi Perfil</h4>

            {/* Banner */}
            {profile?.bannerPhoto && (
                <img
                    src={`http://localhost:3000/${profile.bannerPhoto}`}
                    alt="banner"
                    className="img-fluid rounded mb-3 w-100"
                    style={{ maxHeight: '180px', objectFit: 'cover' }}
                />
            )}

            {/* Foto de perfil */}
            <div className="d-flex align-items-center gap-3 mb-4">
                {profile?.profilePhoto ? (
                    <img
                        src={`http://localhost:3000/${profile.profilePhoto}`}
                        alt="foto de perfil"
                        className="rounded-circle"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                ) : (
                    <div
                        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: '80px', height: '80px', fontSize: '28px' }}
                    >
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <p className="fw-bold mb-0">{user.name}</p>
                    <p className="text-muted mb-0" style={{ fontSize: '13px' }}>{profile?.user?.email}</p>
                </div>
            </div>

            {/* Editar bio */}
            <div className="card p-3 mb-3 shadow-sm">
                <h6 className="fw-semibold mb-3">Biografía</h6>
                <form onSubmit={handleUpdateBio}>
                    <textarea
                        className="form-control mb-2"
                        rows={3}
                        placeholder="Cuéntale a tus seguidores sobre ti..."
                        ref={bioRef}
                        defaultValue={profile?.bio || ''}
                    />
                    {bioSuccess && <div className="alert alert-success py-1 mb-2" style={{ fontSize: '13px' }}>{bioSuccess}</div>}
                    <button type="submit" className="btn btn-primary btn-sm">Guardar bio</button>
                </form>
            </div>

            {/* Subir foto */}
            <div className="card p-3 mb-3 shadow-sm">
                <h6 className="fw-semibold mb-3">Foto de perfil</h6>
                <form onSubmit={handleUploadPhoto}>
                    <input type="file" className="form-control mb-2" accept="image/*" ref={photoRef} />
                    {photoSuccess && <div className="alert alert-success py-1 mb-2" style={{ fontSize: '13px' }}>{photoSuccess}</div>}
                    <button type="submit" className="btn btn-primary btn-sm">Subir foto</button>
                </form>
            </div>

            {/* Subir banner */}
            <div className="card p-3 shadow-sm">
                <h6 className="fw-semibold mb-3">Banner</h6>
                <form onSubmit={handleUploadBanner}>
                    <input type="file" className="form-control mb-2" accept="image/*" ref={bannerRef} />
                    {bannerSuccess && <div className="alert alert-success py-1 mb-2" style={{ fontSize: '13px' }}>{bannerSuccess}</div>}
                    <button type="submit" className="btn btn-primary btn-sm">Subir banner</button>
                </form>
            </div>
        </div>
    );
}

export default CreatorProfileView;
