import { useState, useRef } from "react";

function CreatorIncomeView({ user }) {

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    const handleSearch = async (event) => {
        event.preventDefault();
        setLoading(true);

        const params = new URLSearchParams();
        if (startDateRef.current.value) params.append('startDate', startDateRef.current.value);
        if (endDateRef.current.value) params.append('endDate', endDateRef.current.value);

        const response = await fetch(`http://localhost:3000/creators/me/income?${params.toString()}`, {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            setReport(data);
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '700px' }}>
            <h4 className="fw-bold mb-4">Reporte de Ingresos</h4>

            {/* Filtros */}
            <div className="card p-3 mb-4 shadow-sm">
                <h6 className="fw-semibold mb-3">Filtrar por fecha</h6>
                <form onSubmit={handleSearch} className="row g-2 align-items-end">
                    <div className="col-sm-4">
                        <label className="form-label" style={{ fontSize: '13px' }}>Desde</label>
                        <input type="date" className="form-control form-control-sm" ref={startDateRef} />
                    </div>
                    <div className="col-sm-4">
                        <label className="form-label" style={{ fontSize: '13px' }}>Hasta</label>
                        <input type="date" className="form-control form-control-sm" ref={endDateRef} />
                    </div>
                    <div className="col-sm-4">
                        <button type="submit" className="btn btn-primary btn-sm w-100">Consultar</button>
                    </div>
                </form>
            </div>

            {loading && <p>Cargando...</p>}

          
            {report && (
                <div>
                    <div className="alert alert-primary fw-semibold">
                        Total de flanes recibidos: 🍮 {report.totalFlanes}
                    </div>

                    {report.donations.length === 0 && (
                        <p className="text-muted">No hay donaciones en ese período.</p>
                    )}

                    {report.donations.map((donation) => (
                        <div key={donation.donationId} className="card mb-2 shadow-sm">
                            <div className="card-body py-2 d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="fw-semibold">{donation.follower.name}</span>
                                    <span className="text-muted ms-2" style={{ fontSize: '13px' }}>
                                        {donation.follower.email}
                                    </span>
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

export default CreatorIncomeView;
