import React, { useEffect, useState } from "react";
import api from "../api/axios";

const AdminDashboard = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("employee");

    const [logs, setLogs] = useState([]);

    const [message, setMessage] = useState("");

    useEffect(() => {
        const getAdminLogs = async () => {
            try {
                const res = await api.get("/logs");
                console.log(`Ezek responsok: ${res.data}`)
                setLogs(res.data);
                console.log(`Ezek logok: ${logs}`)
            } catch (err) {
                console.error("Hiba a logok betöltésekor", err);
            }
        };
        getAdminLogs();
    }, []);

    const handleUserCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/admin/users", { name, email, password, role });
            setMessage("Felhasználó sikeresen létrehozva!");
            setName("");
            setEmail("");
            setPassword("");
            setRole("employee");
        } catch (err) {
            console.error("Hiba a felhasználó létrehozáskor", err);
            setMessage("Hiba történt a felhasználó létrehozásakor!");
        }

    };

    return (
        <div className="container mt-4">
            <h2>Admin felület</h2>
            <div className="row">
                <div className="col-md-6">
                    {message && <div className="alert alert-info">{message}</div>}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h4 className="card-title">Új felhasználó létrehozása</h4>
                            <form onSubmit={handleUserCreate}>
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
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Adj meg egy emailt"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>


                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Adj meg egy egy jelszót!"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Szerepkör</label>
                                    <select
                                        className="form-select"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required>
                                        <option value="employee">Dolgozó</option>
                                        <option value="vet">Állatorvos</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    Felhasználó létrehozása
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4 className="card-title">Legutóbbi</h4>
                            <ul className="list-group">
                                {logs.length > 0 ? (
                                    logs.map((log) => (
                                        <li key={log.id} className="list-group-item">
                                            <strong>{log.action}</strong> - {log.targetType} - #{log.targetId}
                                            <br />
                                            <small>
                                                UserID: {log.userId} - {log.timestamp}
                                            </small>
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item">Nincs elérhető log.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;