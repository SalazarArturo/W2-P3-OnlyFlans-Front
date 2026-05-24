import { useState, useRef } from "react";

function FollowerDonationsView() {

    const [donations, setDonations] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const creatorNameRef = useRef(null);

    const handleSearch = async (event) => {
        event.preventDefault();
        setLoading(true);

        const params = new URLSearchParams();
        if (startDateRef.current.value) params.append('startDate', startDateRef.current.value);
        if (endDateRef.current.value) params.append('endDate', endDateRef.current.value);
        if (creatorNameRef.current.value) params.append('creatorName', creatorNameRef.current.value);

        const response = await fetch(`http://localhost:3000/followers/donations/history?${params.toString()}`, {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            setDonations(data);
        }
        setSearched(true);
        setLoading(false);
    };

    const totalFlanes = donations.reduce((sum, d) => sum + d.flanCount, 0);

    return (
        <div style={{ maxWidth: '700px' }}>
            <h4 className="fw-bold mb-4">Historial de Donaciones</h4>

            {/* Filtros */}
            <div className="card p-3 mb-4 shadow-sm">
                <h6 className="fw-semibold mb-3">Filtros</h6>
                <form onSubmit={handleSearch}>
                    <div className="row g-2 mb-2">
                        <div className="col-sm-4">
                            <label className="form-label" style={{ fontSize: '13px' }}>Desde</label>
                            <input type="date" className="form-control form-control-sm" ref={startDateRef} />
                        </div>
                        <div className="col-sm-4">
                            <label className="form-label" style={{ fontSize: '13px' }}>Hasta</label>
                            <input type="date" className="form-control form-control-sm" ref={endDateRef} />
                        </div>
                        <div className="col-sm-4">
                            <label className="form-label" style={{ fontSize: '13px' }}>Creador</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Nombre del creador"
                                ref={creatorNameRef}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm">Buscar</button>
                </form>
            </div>

            {loading && <p>Cargando...</p>}

            {/* Resultados */}
            {searched && !loading && (
                <div>
                    {donations.length > 0 && (
                        <div className="alert alert-primary fw-semibold mb-3">
                            Total donado: 🍮 {totalFlanes} flanes
                        </div>
                    )}

                    {donations.length === 0 && (
                        <p className="text-muted">No se encontraron donaciones con esos filtros.</p>
                    )}

                    {donations.map((donation) => (
                        <div key={donation.donationId} className="card mb-2 shadow-sm">
                            <div className="card-body py-2 d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="fw-semibold">{donation.creator.name}</span>
                                    {donation.message && (
                                        <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>
                                            "{donation.message}"
                                        </p>
                                    )}
                                </div>
                                <div className="text-end">
                                    <span className="fw-bold text-primary">🍮 {donation.flanCount}</span>
                                    <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>
                                        {new Date(donation.created_at).toLocaleDateString('es-BO', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FollowerDonationsView;
