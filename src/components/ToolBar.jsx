import React from "react";

const backend ='http://localhost:8080/api/login';

export const Toolbar = () => {
    const loginState = JSON.parse(sessionStorage.getItem('loginState'));
    const userSession = loginState ? loginState.user : null;

    const logout = async () => {
        try {
            const response = await fetch(`${backend}/logout`, { method: 'POST', credentials: 'include' });
            if (!response.ok) {
                throw new Error(`Logout failed: ${response.status}`);
            }
            let loginState = { logged: false, user: null }
            sessionStorage.setItem('loginState', JSON.stringify(loginState));
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout failed, please try again.');
        }
    };

    const login = () => {
        window.location.href = '/login';
    };

    const perfil = () => {
        window.location.href = 'http://localhost:5173/perfil';
    };

    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container-fluid">
                <img src="https://cdn-icons-png.flaticon.com/512/411/411745.png" alt="LOGO" style={{ width: '2.6%' }}/>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">About</a>
                        </li>
                        {userSession && (
                            <>
                            {userSession.role === 'PRO' && (
                                <li className="nav-item">
                                    <a className="nav-link" href="/billing">Billing</a>
                                </li>
                                )}
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button"
                                       data-bs-toggle="dropdown" aria-expanded="false">
                                        Services
                                    </a>
                                    <ul className="dropdown-menu">
                                        {userSession.role === 'PRO' && (
                                            <>
                                                <li><a className="dropdown-item" href="/client">Clients</a></li>
                                                <li><a className="dropdown-item" href="/product">Products</a></li>
                                                <li><a className="dropdown-item" href="/bill">Invoices</a></li>
                                            </>
                                        )}
                                        {userSession.role === 'ADM' && (
                                            <li><a className="dropdown-item" href="/supplier">Suppliers</a></li>
                                        )}
                                    </ul>
                                </li>
                            </>
                        )}
                    </ul>
                    {userSession ? (
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button"
                                    data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                Account
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" style={{ left: 'auto', right: 0 }}>
                                <li><a className="dropdown-item" href="#" onClick={perfil}>Edit</a></li>
                                <li className="dropdown-divider"></li>
                                <li><a className="dropdown-item" href="#" onClick={logout}>Logout</a></li>
                            </ul>
                        </div>
                    ) : (
                        <div>
                            <button id="loginButton" className="btn btn-outline-success" type="button" onClick={login}>
                                Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
