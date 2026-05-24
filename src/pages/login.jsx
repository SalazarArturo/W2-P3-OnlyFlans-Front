import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router";
import loginSchema from "../validators/login.schema.js";

function LoginForm() {

    // useRef para no re-renderizar con cada tecla, el valor se lee solo al hacer submit
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [errors, setErrors] = useState({});
    const [responseError, setResponseError] = useState('');

    const navigate = useNavigate();

    const formSubmit = async (event) => {
        event.preventDefault();

        const inputValues = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        };

        const { error } = loginSchema.validate(inputValues, { abortEarly: false });

        if (error) {
            const newErrors = {};
            error.details.forEach((detail) => {
                newErrors[detail.path[0]] = detail.message;
            });
            setErrors(newErrors);
            return;
        }
        setErrors({});

        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { "Content-type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(inputValues)
        });

        if (response.ok) {
            navigate('/welcome');
        } else {
            const nakedResponse = await response.json();
            setResponseError(nakedResponse.message || nakedResponse.error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }}>

                <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">OnlyFlans</h2>
                    <p className="text-muted">Ingresa tus credenciales para continuar</p>
                </div>

                <form onSubmit={formSubmit} noValidate>

                    <div className="mb-3">
                        <label className="form-label fw-semibold" style={{ fontSize: '14px' }}>
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="ejemplo@correo.com"
                            ref={emailRef}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold mb-0" style={{ fontSize: '14px' }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            placeholder="password"
                            ref={passwordRef}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    {responseError && <div className="alert alert-danger py-2 mb-3" role="alert">{responseError}</div>}

                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
                        Ingresar
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                        ¿No tienes cuenta? <Link to="/register" className="text-decoration-none fw-semibold">Regístrate</Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default LoginForm;
