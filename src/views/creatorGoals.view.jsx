import { useState, useEffect, useRef } from "react";

function CreatorGoalsView({ user }) {

    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState('');

    const titleRef = useRef(null);
    const descriptionRef = useRef(null);

    const loadGoals = async () => {
        const response = await fetch('http://localhost:3000/creators/me/goals', {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            setGoals(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadGoals();
    }, []);

    const handleCreateGoal = async (event) => {
        event.preventDefault();
        setFormError('');

        const title = titleRef.current.value.trim();
        const description = descriptionRef.current.value.trim();

        if (!title || !description) {
            setFormError('Todos los campos son requeridos');
            return;
        }

        const response = await fetch('http://localhost:3000/creators/me/goals', {
            method: 'POST',
            headers: { "Content-type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            titleRef.current.value = '';
            descriptionRef.current.value = '';
            loadGoals();
        } else {
            const data = await response.json();
            setFormError(data.error || 'Error al crear la meta');
        }
    };

    const handleDeleteGoal = async (goalId) => {
        const response = await fetch(`http://localhost:3000/creators/me/goals/${goalId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) loadGoals();
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div style={{ maxWidth: '600px' }}>
            <h4 className="fw-bold mb-4">Metas de Apoyo</h4>

            {/* Formulario nueva meta */}
            <div className="card p-3 mb-4 shadow-sm">
                <h6 className="fw-semibold mb-3">Nueva meta</h6>
                <form onSubmit={handleCreateGoal}>
                    <div className="mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Título de la meta"
                            ref={titleRef}
                        />
                    </div>
                    <div className="mb-2">
                        <textarea
                            className="form-control"
                            placeholder="Descripción de la meta"
                            rows={2}
                            ref={descriptionRef}
                        />
                    </div>
                    {formError && <div className="alert alert-danger py-1 mb-2" style={{ fontSize: '13px' }}>{formError}</div>}
                    <button type="submit" className="btn btn-primary btn-sm">Agregar meta</button>
                </form>
            </div>

            {/* Lista de metas */}
            {goals.length === 0 && <p className="text-muted">No tienes metas creadas aún.</p>}

            {goals.map((goal) => (
                <div key={goal.goalId} className="card mb-3 shadow-sm">
                    <div className="card-body d-flex justify-content-between align-items-start">
                        <div>
                            <p className="fw-semibold mb-1">{goal.title}</p>
                            <p className="text-muted mb-0" style={{ fontSize: '14px' }}>{goal.description}</p>
                        </div>
                        <button
                            className="btn btn-outline-danger btn-sm ms-3"
                            onClick={() => handleDeleteGoal(goal.goalId)}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CreatorGoalsView;
