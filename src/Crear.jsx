import { Navigate, Link, useNavigate } from "react-router-dom" // Importar para redirigir
import { useState, useEffect, useContext } from "react" // Importar para estados de los inputs
import Context from "./Contexto.jsx" // Importar contexto global
import Navegacion from "./Navegacion.jsx" // Importar el nav
import "./index.css" // Importar css

export default function Create() {

    let navigate = useNavigate() // Redirigir
    let { token, setToken, user, setUser, films, setFilms, createFilms } = useContext(Context)
    let [titulo, setTitulo] = useState("") // Estado título
    let [reseña, setReseña] = useState("") // Estado reseña
    let [valoracion, setValoracion] = useState("") // Estado valoración
    let [error, setError] = useState(null) // Mensaje de error para el usuario

    // Sin el token redirección al login.
    if (token == "") {
        return <Navigate to="/login" />
    } else {
        return <>
            <Navegacion />
            <section className="Section">
                <h2>¿Acabas de ver una peli?</h2>
                <p>🍿 Cuéntanos TODOS los detalles 🍿</p>
                <form className="Form-reseña" onSubmit={event => { // Formulario con 3 campos (input text (título peli) textarea (reseña peli) input number (valoración))
                    event.preventDefault() // Enviar con fetch
                    setError(null) //Error null de momento
                    if (titulo.trim() != "" && reseña.trim() != "" && valoracion.trim() != "" && valoracion >= 0 && valoracion <= 5) { // Validar que no están vacíos
                        fetch("https://api-films-93ur.onrender.com/films/new", {
                            method: "POST",
                            body: JSON.stringify({
                                titulo: titulo,
                                reseña: reseña,
                                valoracion: valoracion
                            }),
                            headers: {
                                "Content-type": "application/json",
                                Authorization: "Bearer " + token
                            }
                        })
                            .then(res => {
                                if (res.status == 201) { // Res exitosa
                                    return res.json()
                                        .then(() => {
                                            alert("Reseña enviada correctamente") // Mensaje de reseña enviada
                                            setError(null) // No hay error
                                            navigate("/films") // Redirección
                                        })
                                } else {// Gestión de errores
                                    if (res.status == 400) {// Mensaje de error
                                        setError("Datos inválidos. Revisa los campos e inténtalo nuevamente.")
                                    } else if (res.status == 401 || res.status == 403) { // Mensaje de error
                                        setError("No tienes permiso para enviar esta reseña.")
                                    } else if (res.status == 500) {// Mensaje de error
                                        setError("Error del servidor. Intenta más tarde.")

                                    } else {
                                        setError("Error inesperado. Código: " + res.status)// Mensaje de error
                                    }
                                }
                            })
                            .catch(err => setError("No se pudo enviar la reseña. Inténtalo más tarde.")) // Mensaje de error
                    } else {
                        setError("Completa todos los campos correctamente") // Mensaje de error
                    }
                }}>
                    {/* setError(null) para corregir el error en tiempo real */}
                    <input type="text" className="Form-input" value={titulo} placeholder="Título de la película" onChange={event => {
                        setTitulo(event.target.value)
                        setError(null)
                    }} />
                    <textarea className="Form-input" placeholder="Escribe tu reseña" value={reseña} onChange={event => {
                        setReseña(event.target.value)
                        setError(null)
                    }}></textarea>
                    <input className="Form-input" type="number" max="5" min="0" placeholder="Puntúa del 0 al 5" value={valoracion} onChange={event => {
                        setValoracion(event.target.value)
                        setError(null)
                    }} />
                    <input className="Form-btn" type="submit" value="Enviar reseña" />
                </form>
                {error && <p className="Error">{error}</p>}
                {/* Data de la reseña */}
                <p className="Data">{new Date().toLocaleDateString()}</p>
            </section>
            {/* footer */}
            <footer className="Footer">
                <p className="Footer-copy">&copy; 2025 Maria Rubio</p>
            </footer>
        </>
    }
}