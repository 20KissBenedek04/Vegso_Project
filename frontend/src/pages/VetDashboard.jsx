import React, { useEffect, useState } from "react";
import api from "../api/axios";

const VetDashboard = () => {
    const [animals, setAnimals] = useState([]);
    const [selectedAnimal, setSelectedAnimal] = useState([]);
    const [records, setRecords] = useState([]);
    const [description, setDescription] = useState("");
    const [weight, setWeight] = useState("");
    const [enclosures, setEnclosures] = useState([]);
    const [selectedEnclosure, setSelectedEnclosure] = useState("");

    const [message, setMessage] = useState("");

    useEffect(() => {
        const getAnimals = async () => {
            try {
                const res = await api.get("/animals");
                setAnimals(res.data);
            } catch (err) {
                console.log("Hiba az állatok lekérdezésekor", err);
            }
        }
        getAnimals();
    }, [])


    useEffect(() => {
        const getEnclosures = async () => {
            try {
                const res = await api.get("/enclosure")
                setEnclosures(res.data)

            } catch (err) {
                setMessage("Nem sikerült betölteni a kifutókat!.")
            }
        };
        getEnclosures();
    }, []);

    const getRecords = async (animalId) => {
        try {
            const res = await api.get(`/animals/${animalId}/records`)
            setRecords(res.data || [])

        } catch (err) {
            setMessage("Nem sikerült betölteni a orvosi bejegyzéseket!.")
        }
    };

    const handleSelectAnimal = (animal) => {
        setSelectedAnimal(animal)
        getRecords(animal.id)
    }

    const handleRecordCreate = async (e) => {
        e.preventDefault();
        if (!selectedAnimal) return;


        try {
            const res = await api.post(`/animals/${selectedAnimal.id}/records`, {
                description,
                weight: weight ? Number(weight) : undefined,
                enclosure: selectedEnclosure || undefined
            });
            setMessage("Új orvosi bejegyzés sikeresen hozzáadva!");
            setDescription("");
            setWeight("");
            setSelectedEnclosure("");
            records.push(res.data)
            setRecords(records)
        } catch (err) {
            console.error("Hiba a orvosi bejegyzés létrehozáskor", err);
            setMessage("Hiba történt a orvosi bejegyzés létrehozásakor!");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Állatorvosi felület</h2>
            {message && <div className="alert alert-info">{message}</div>}

            <div className="row">
                <div className="col-md-4">
                    <h4>Állatok listája</h4>
                    <ul className="list-group">
                        {animals.map((a) => (
                            <li
                                key={a.id}
                                className={`list-group-item ${selectedAnimal?.id === a.id ? "active" : ""}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleSelectAnimal(a)}
                            >
                                {a.name} ({a.species?.latinName})
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="col-md-8">
                    {selectedAnimal ? (
                        <div>
                            <h4>{selectedAnimal.name} - Orvosi bejegyzések</h4>
                            <ul className="list-group mb-3">
                                {records.length > 0 ? (
                                    records.map((r) => (
                                        <li key={r.id} className="list-group-item">
                                            <strong>{r.createdAt.substring(0,10)}</strong> {" "}
                                            {r.description} {" "}
                                            {r.weight && <span>- Súly: {r.weight} kg</span>}{" "}
                                            {r.enclosure && (
                                                <span>
                                                    {" "}
                                                    - Kifutó: {" "}
                                                    {
                                                        enclosures.find((e) => e.id === r.enclosure)?.name || r.enclosure
                                                    }
                                                </span>
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item">Nincs még bejegyzés</li>
                                )}
                            </ul>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5>Új orvosi bejegyzés</h5>

                                    <form onSubmit={handleRecordCreate}>
                                        <div className="mb-3">
                                            <label className="form-label">Leírás</label>
                                            <textarea className="form-control"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Súly (kg)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={weight}
                                                onChange={(e) => setWeight(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Kifutó</label>
                                            <select
                                                className="form-select"
                                                value={selectedEnclosure}
                                                onChange={(e) => setSelectedEnclosure(e.target.value)}
                                            >
                                                <option value="">-- Válassz kifutót --</option>
                                                {enclosures.map((enc) => (
                                                    <option key={enc.id} value={enc.id}>
                                                        {enc.name} ({enc.description})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100"
                                        >
                                            Bejegyzés hozzáadása
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Vállasz ki egy állatot a listából!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VetDashboard;