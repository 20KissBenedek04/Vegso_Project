import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/animals">ZooApplication</Link> {" | "}
            </div>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/animals">Állatok</Link>
                    </li>
                    {user && user.role === "admin" && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin">Admin</Link>
                        </li>
                    )}
                    {user && user.role === "vet" && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/vet">Állatorvosi felület</Link>
                        </li>
                    )}
                    {user && (user.role === "admin" || user.role == "employee") && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/add-animal">Új állat létrehozása</Link>
                        </li>
                    )}
                </ul>
                <ul className="navbar-nav">
                    {user ? (
                        <>
                            <li className="nav-item">
                                <span className="navbar-text me-3">
                                    {user.name} ({user.role})
                                </span>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-outline-light btn-sm" onClick={logout}>
                                    Kijelentkezés
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Bejelentkezés</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">Regisztráció</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );

}

export default Navbar;