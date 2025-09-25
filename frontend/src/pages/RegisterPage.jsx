import React, { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";


const RegisterPage = () => {
    const { login } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/register", { name, email, password })
            login(res.data.token, res.data);
            navigate("/animals")
        } catch (err) {
            setMessage("Hiba történt a regisztráció során!")
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-3">Bejelentkezés</h3>
                {message && <div className="alert alert-danger">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Név</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Adj meg egy nevet!"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

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
                        Regisztráció
                    </button>
                    <div className="text-center mt-3">
                        <small>
                            Már van fiókod? <Link to="/login">Jelentkezz be itt</Link>
                        </small>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default RegisterPage;