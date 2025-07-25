import { useState, useContext, Navigate } from "react" // Importar contexto global y estado.
import { useNavigate } from "react-router-dom" // Para redirigir a "/"
import Context from "./Contexto.jsx" // Importar el contexto
import "./index.css" // Importar el css

export default function Login() {

    let navigate = useNavigate() // Redirigir a "/"
    let { setToken } = useContext(Context) // Necesitamos el token
    let [inputUser, setInputUser] = useState("") // El valor del input de user
    let [inputPassword, setInputPassword] = useState("") // El valor del input del password
    let [error, setError] = useState(null) // Mensaje de error para el usuario
    
        return <>
            <section className="Section-login">
                <img src="./logo-filmtap.webp" alt="Logo de FilmTap" className="Logo" />
                <h1> Film<span style={{ color: "#455bd8" }}>Tap</span>:<br />Reseñas sin filtros
                </h1>
                <p>Entra, comenta y puntúa tus pelis favoritas </p>
            </section>
            <form onSubmit={event => { // Formulario con 3 campos (user + password, submit)
                event.preventDefault() // Lo enviamos con fetch
                setError(null)
                if (inputUser.trim() != "" && inputPassword.trim() != "") { // Validar que no estén vacíos.
                    fetch("https://api-films-93ur.onrender.com/login", {
                        method: "POST",
                        body: JSON.stringify({
                            user: inputUser,
                            password: inputPassword
                        }),
                        headers: {
                            "Content-type": "application/json"
                        }
                    })
                        .then(res => {
                            if (res.status == 200) {
                                return res.json()
                                    .then(({ token }) => { // token
                                        setToken(token) // Actualizar estado del token
                                        navigate("/") // Redirigir a "/"
                                    })
                            } else if (res.status == 401) { // Aquí puede pasar el error (mensajes personalizados)
                                setError("Usuario o contraseña incorrectos")
                            } else if (res.status == 403) {
                                setError("No tienes acceso")

                            } else {
                                setError("Error inesperado. Código: " + res.status)
                            }
                        })
                } else {
                    setError("Rellena todos los campos del formulario para iniciar sesión")
                }
            }}>
                <input type="text" placeholder="Usuario" value={inputUser} onChange={event => setInputUser(event.target.value)} />
                <input type="password" placeholder="Contraseña" value={inputPassword} onChange={event => setInputPassword(event.target.value)} />
                <input type="submit" className="Login-btn"
                    value="iniciar sesión" />
            </form>
            {error && <p className="Error">{error}</p>}
            {/* Si no es null, es visible el Error */}

            <footer className="Footer">
                <p className="Footer-copy">&copy; 2025 Maria Rubio</p>
            </footer>
        </>
    
}
