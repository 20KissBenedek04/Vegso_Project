import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom";
import api from "../api/axios"

const AnimalDetails = () => {
    const { id } = useParams()
    const [animal, setAnimal] = useState(null);
    const [error, setError] = useState("");


    useEffect(() => {
        const getAnimals = async () => {
            try {
                const res = await api.get(`/animals/${id}`);
                setAnimal(res.data);
            } catch (err) {
                setError("Hiba az állat adatainak betöltésekor.")
            }
        }
        getAnimals();
    }, [id])
if (error) return <div className="alert alert-danger mt-4">{error}</div>
if (!animal) return <div className="text-center mt-4">Betöltés...</div>
    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                {
                    animal.imageURL && (
                        <img src={animal.imageURL} alt={animal.name} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />
                    )
                }
                <div className="card-body">
                    <h5 className="card-title">{animal.name}</h5>
                    <p className="card-text">
                        Faj: {animal.species?.latinName} <br />
                        Típus: {animal.type?.name} <br />
                        Kifutó: {animal.enclosure?.name} <br />
                        Súly: {animal.weight} <br />
                        Születési dátum: {animal.birthDate} <br />
                    </p>
                    <Link to="/animals" className="btn btn-outline-secondary">
                        Vissza a listához
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AnimalDetails;