import React, { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";


const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ message, setMessage ] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { email, password })
            login(res.data.token, res.data);
            navigate("/animals")
        } catch (err) {
            setMessage("Hibás email vagy a jelszó!")
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-3">Bejelentkezés</h3>
                {message && <div className="alert alert-danger">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email cím</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Adj meg egy emailt!"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Jelszó</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Adj meg egy jelszót!"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Belépés
                    </button>
                    <div className="text-center mt-3">
                        <small>
                            Nincs fiókod? <Link to="/register">Regisztrálj itt</Link>
                        </small>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default LoginPage;