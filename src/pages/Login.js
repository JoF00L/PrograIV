import React, { useState, useEffect } from 'react';
import fetchData from "../hooks/fetchData";

const backendUrl = 'http://localhost:8080/api/login';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        checkUserToLogin();
    }, []);

    const checkUserToLogin = async () => {
        try {
            const request = new Request(`${backendUrl}/current-user`, {method: 'GET', credentials: "include"});
            const response = await fetch(request);

            if (response.ok) {
                const currentUser = await response.json();
                let loginState = { logged: true, user: currentUser };
                sessionStorage.setItem('loginState', JSON.stringify(loginState));

                if (currentUser.role === 'PRO') {
                    window.location.href = '/billing';
                } else {
                    window.location.href = '/supplier';
                }
            } else {
                console.log("No se pudo verificar al usuario para iniciar sesión.");
            }
        } catch (error) {
            console.error("Error al verificar al usuario para iniciar sesión:", error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!name.trim() || !password.trim()) {
            setError('Por favor, ingrese su nombre de usuario y contraseña');
            return;
        }

        setLoading(true);
        setError('');

        const user = { name, password };

        try {
            const response = await fetch(`${backendUrl}/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                const userDB = await response.json();
                let loginState = { logged: true, user: userDB };
                sessionStorage.setItem('loginState', JSON.stringify(loginState));

                if (userDB.role === 'PRO') {
                    window.location.href = '/billing';
                } else {
                    window.location.href = '/supplier';
                }
            } else {
                throw new Error(`La solicitud no fue exitosa. Código de estado: ${response.status}`);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            setError('Ha ocurrido un error. Inténtelo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light d-flex justify-content-center align-items-center vh-100">
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Login</h2>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
