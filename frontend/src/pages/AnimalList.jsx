import React, { useState, useContext, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";


const AnimalList = () => {
    const [animals, setAnimals] = useState([]);

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
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Állatok listája</h2>
            <div className="row">
                {
                    animals.map((animal) => (
                        <div className="col-md-4 mb-4" key={animal.id}>
                            <div className="card shadow-sm h-100">
                                {
                                    animal.imageURL && (
                                        <img src={animal.imageURL} alt={animal.name} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />
                                    )
                                }
                                <div className="card-body">
                                    <h5 className="card-title">{animal.name}</h5>
                                    <p className="card-text">
                                        Faj: {animal.species?.latinName} <br />
                                        Típus: {animal.type?.name}
                                    </p>
                                    <Link to={`/animals/${animal.id}`} className="btn btn-outline-primary btn-sm">
                                    Részletek
                                    </Link>
                                </div>
                                <div className="card-footer test-muted">
                                    {animal.isActive ? "✅ Aktív" : "❌ Inaktív"}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>

    )
};

export default AnimalList;