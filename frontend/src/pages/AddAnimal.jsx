import React, { use, useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
const AddAnimal = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [speciesId, setSpeciesId] = useState("");
    const [typeId, setTypeId] = useState("");
    const [enclosureId, setEnclosureId] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [weight, setWeight] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [imageURL, setImageUrl] = useState("");

    const [speciesList, setSpeciesList] = useState([]);
    const [types, setTypes] = useState([]);
    const [enclosures, setEnclosures] = useState([]);

    const [message, setMessage] = useState("");

    useEffect(() => {
        const getAnimalsDatas = async () => {
            try {
                const [speciesRes, typeRes, enclosureRes] = await Promise.all([
                    api.get("/species"),
                    api.get("/animaltypes"),
                    api.get("/enclosure"),
                ])
                setSpeciesList(speciesRes.data)
                setTypes(typeRes.data)
                setEnclosures(enclosureRes.data)

            } catch (err) {
                setMessage("Nem sikerült betölteni az adatokat!.")
            }
        };
        getAnimalsDatas();
    }, []);

    const handleAnimalCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/animals", { name, speciesId, typeId, enclosureId, birthDate, weight, isActive, imageURL });
            setMessage("Állat sikeresen létrehozva!");
            navigate("/animals")
        } catch (err) {
            setMessage("Hiba történt az állat létrehozásakor!");
        }

    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h4 className="card-title">Új Állat létrehozása</h4>
                    {message && <div className="alert alert-info">{message}</div>}
                    <form onSubmit={handleAnimalCreate}>
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
                            <label className="form-label">Faj</label>
                            <select
                                className="form-select"
                                value={speciesId}
                                onChange={(e) => setSpeciesId(e.target.value)}
                                required
                            >
                                <option value="">-- Válassz Fajt --</option>
                                {speciesList.map((s) => (
                                    <option key={s.id} value={s.id}>{s.latinName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Típus</label>
                            <select
                                className="form-select"
                                value={typeId}
                                onChange={(e) => setTypeId(e.target.value)}
                                required
                            >
                                <option value="">-- Válassz Típust --</option>
                                {types.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Kifutó</label>
                            <select
                                className="form-select"
                                value={enclosureId}
                                onChange={(e) => setEnclosureId(e.target.value)}
                                required
                            >
                                <option value="">-- Válassz kifutót --</option>

                                {enclosures.map((e) => (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                ))}
                            </select>
                        </div>


                        <div className="mb-3">
                            <label className="form-label">Születési dátum</label>
                            <input
                                type="date"
                                className="form-control"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Súly(kg)</label>
                            <input
                                type="number"
                                className="form-control"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-check mb-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="activeCheck"
                                value={isActive}
                                onChange={(e) => setIsActive(e.target.value)}
                                required
                            />
                            <label htmlFor="activeCheck" className="form-check-label"> Aktív</label>
                        </div>


                        <div className="mb-3">
                            <label className="form-label">Kép URL</label>
                            <input
                                type="url"
                                className="form-control"
                                value={imageURL}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Mentés
                        </button>
                    </form>
                </div>
            </div>
        </div>


    );
}

export default AddAnimal;