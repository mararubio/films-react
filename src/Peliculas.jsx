import { useNavigate, Navigate } from "react-router-dom" // Redigir a otras páginas
import { useState, useEffect, useContext } from "react" // Actualizar estados y contexto global.
import Context from "./Contexto.jsx" // Importar contexto
import Navegacion from "./Navegacion.jsx" // Importar menú nav
import "./index.css" // Importar css


export default function Films() {
    let navigate = useNavigate()
    let [error,setError] = useState(null) // Mensaje de error(null)
    let { token, setToken, user, setUser, films, setFilms, createFilms } = useContext(Context)

    useEffect(() => {
        if (token !== "") { // Solo renderizar si tenemos el token
            fetch("https://api-films-93ur.onrender.com/films", {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
                .then(res => {
                    if (!res.ok) { // gestión de errores
                        if (res.status === 401) {
                            setError("No autorizado. Verifica tu token.");
                        } else if (res.status === 404) {
                            setError("Película no encontrada.");
                        } else if (res.status >= 500) {
                            setError("Error del servidor. Inténtalo más tarde.");
                        } else {
                            setError(`Error HTTP ${res.status}`);
                        }
                    }
                    return res.json()
                })
                .then(films => {
                    setFilms(films)
                })
        }
    }, [])

    if (token == "") { // Sin token redirigir al "/login"
        return <Navigate to="/login" />
    } else {
        return (
            <>
                <Navegacion />
                <ul className="Films-ul">
                    {films.length === 0 ? (
                        <li className="Films-li">¡Vaya! Aún no tienes reseñas</li>
                    ) : (
                        films.map((film) => {
                            let { _id, titulo, reseña, valoracion } = film; // Desestructurar
                            return ( // return del map()
                                <li key={_id} id={_id} className="Films-list" >
                                    <div className="Film">
                                        <div className="Film-tools">
                                            <div className="Film-circle">
                                                <span className="Film-red Film-box"></span>
                                            </div>
                                            <div className="Film-circle">
                                                <span className="Film-yellow Film-box"></span>
                                            </div>
                                            <div className="Film-circle">
                                                <span className="Film-green Film-box"></span>
                                            </div>
                                        </div>
                                        <div className="Card__content">
                                            <h3 className="Titulo">{titulo}</h3>
                                            <p className="Reseña">{reseña}</p>
                                            {/* Añadimos un svg */}
                                            <p className="Valoracion">{valoracion}<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg></p> 
                                        </div>
                                        <div className="Buttons">
                                            {/*// Abrir pestaña para editar */}
                                            <button className="Button" onClick={() => navigate(`/Update/${_id}`)}>
                                                Editar
                                            </button>
                                            <button className="Button"
                                                onClick={() => {
                                                    fetch(`https://api-films-93ur.onrender.com/films/delete/${_id}`, {
                                                        method: "DELETE",
                                                        headers: {
                                                            "Content-type": "application/json",
                                                            Authorization: "Bearer " + token,
                                                        },
                                                    })
                                                        .then(({ status }) => {
                                                            if (status === 204) {
                                                                setFilms((prev) => prev.filter((film) => film._id !== _id));
                                                                // Filtrar las pelis para eliminar 
                                                            }else {// Gestión de errores
                                                                if (res.status == 400) {// Mensaje de error
                                                                    setError("Datos inválidos. Revisa los campos e inténtalo nuevamente.")
                                                                } else if (res.status == 401 || res.status == 403) { // Mensaje de error
                                                                    setError("No tienes permiso para editar esta reseña.")
                                                                } else if (res.status == 500) {// Mensaje de error
                                                                    setError("Error del servidor. Inténtalo más tarde.")
                            
                                                                } else {
                                                                    setError("Error inesperado. Código: " + res.status)// Mensaje de error
                                                                }
                                                            } 
                                                        });
                                                }}
                                            >
                                                Eliminar
                                            </button>

                                        </div>
                                    </div>
                                </li>
                            );
                        })
                    )}
                </ul>
            </>
        );
    }
}
