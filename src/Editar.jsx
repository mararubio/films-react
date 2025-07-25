import { Navigate, useNavigate, useParams } from "react-router-dom" // Importar para reedirigir y coger el id 
import { useState, useEffect, useContext } from "react" // Importar para contexto global y estados
import Context from "./Contexto.jsx" // Importar contexto
import Navegacion from "./Navegacion.jsx" // Importar menú nav
import "./index.css" // Importar css

export default function Editar() {
    let navigate = useNavigate()
    let { id } = useParams(); // Coger el id
    let { token, setToken, user, setUser, films, setFilms, createFilms } = useContext(Context) // Token + films
    let [titulo, setTitulo] = useState("") // Estado del input
    let [reseña, setReseña] = useState("") // Estado del input
    let [valoracion, setValoracion] = useState("") // Estado del input
    let [error, setError] = useState(null) // Mensaje de error (en lugar de boolean, null)

    useEffect(() => {
        let film = films.find(f => f._id == id) // Buscar película concreta que hay que editar
        if (film) { // Actualizar el estado de los inputs para poder modificarlos.
            setTitulo(film.titulo) 
            setReseña(film.reseña)
            setValoracion(film.valoracion)
        } else {
            fetch(`https://api-films-93ur.onrender.com/films/${id}`, { // Fetch a la película en concreto
                headers: {
                    "Content-type": "application/json",
                    Authorization: "Bearer " + token
                }
            })
                .then(res => {
                    if (!res.ok) { // Gestión de errores con setError
                        if (res.status == 401) {
                            setError("No autorizado. Verifica tu token.");
                        } else if (res.status == 404) {
                            setError("Película no encontrada.");
                        } else if (res.status >= 500) {
                            setError("Error del servidor. Inténtalo más tarde.");
                        } else {
                            setError(`Error HTTP ${res.status}`);
                        }
                    }
                    return res.json()
                })
                .then(data => { // Sale bien y actualizamos el estado de los inputs.
                    setTitulo(data.titulo)
                    setReseña(data.reseña)
                    setValoracion(data.valoracion)
                })
                .catch(error => setError("Error al obtener la película")) // Posible error
        }
    }, [id, films, token]) // Se renderiza cuando cambie alguno de estos 3.

    if (token == "") {
        return <Navigate to="/login" /> // Sin token redirigimos al "/login"
    } else {
        return <> 
        {/* Menú nav */}
            <Navegacion /> 
            <section className="Section">
                <h2>¿Has cambiado de opinión?</h2>
                <form onSubmit={event => {
                    event.preventDefault()
                    {/* Asegurar que no hay error con null*/}
                    setError(null) 
                    {/* Validar que los campos no estén vacíos*/}
                    if (titulo.trim() != "" && reseña.trim() != "" && valoracion.trim() != "") {
                        fetch(`https://api-films-93ur.onrender.com/films/update/${id}`, {
                            method: "PUT",
                            body: JSON.stringify({
                                titulo,
                                reseña,
                                valoracion
                            }),
                            headers: {
                                "Content-type": "application/json",
                                Authorization: "Bearer " + token
                            }
                        })
                            .then(res => { 
                                if (res.status == 204) {
                                    setFilms(prev =>
                                        prev.map(film =>
                                            film._id == id ? { ...film, titulo, reseña, valoracion } : film
                                        ) // Hacer un map de las películas antes de actualizar, en la que coincida el ID, acualizar datos.
                                    )
                                    navigate("/films") // Redirigir a a las películas.
                                } else {// Gestión de errores
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
                            })
                            .catch(error => setError("No se pudo enviar la reseña. Inténtalo más tarde.")) // Mensaje de error
                    } else {
                        setError("Completa todos los campos correctamente") // Hay campos vacíos.
                    }

                }}>
                    {/* Input título */}
                    <input type="text" className="Form-input" value={titulo} placeholder="Título de la película" onChange={event => setTitulo(event.target.value)} /> 
                    {/* textarea */}
                    <textarea className="Form-input" placeholder="Escribe tu reseña" value={reseña} onChange={event => setReseña(event.target.value)}></textarea>
                    {/* Input valoración */}
                    <input type="number" className="Form-input" max="5" min="0" value={valoracion} onChange={event => setValoracion(event.target.value)} />
                    {/* submit enviar form */}
                    <input type="submit" className="Form-btn Save" value="Guardar" />
                    {/* type="button" para que no confunda con submit */}
                    <button type="button" className="Form-btn" onClick={() => navigate("/films")}>Cancelar</button>
                </form>
                {/* El mensaje de error prsonalizado */}
                {error && <p className="Error">{error}</p>}
            </section>
            {/* Footer */}
            <footer className="Footer">
                <p className="Footer-copy">&copy; 2025 Maria Rubio</p>
            </footer>
        </>
    }

}