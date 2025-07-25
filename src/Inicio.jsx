import { useNavigate, Navigate } from "react-router-dom" // Importar para redirigir y tener el nav
import { useState, useEffect, useContext } from "react" // Importar contexto
import Context from "./Contexto.jsx" // Importar contexto
import Navegacion from "./Navegacion.jsx" // Importar nav
import "./index.css" // Importar css

export default function Inicio() {

    let navigate = useNavigate() // Redirigir
    let { token, setToken, user, setUser } = useContext(Context) // Necesitamos el token
    if (token == "") {
        return <Navigate to="/login" /> // Sin token redirigimos al login
    } else {
        return <>
            <Navegacion />
            <main>
                <article className="Article">
                    <h2>Bienvenid@ a Film<span style={{ color: "#455bd8" }}>Tap</span></h2>
                    <p>Cada película merece una opinión. La tuya también.</p>
                    <div className="Article-wrapper">
                        <img src="/lalaland-film.webp" alt="Película Lalaland" className="Article-img" />
                        <img src="/avatar-film.webp" alt="Película Avatar" className="Article-img" />
                        <img src="/endgame-film.webp" alt="Película Endgame" className="Article-img" />
                    </div>
                </article>
                <article className="Article-cta">
                    <h3>Tu propio rincón cinéfilo</h3>
                    <p>FilmTap no es una red social, es un espacio privado donde puedes expresar lo que una película te hizo sentir. Una libreta digital de cine hecha solo para ti.</p>
                    <h4>¿Ya has visto una peli?</h4>
                    {/* useNavigate para redirigir */}
                    <button className="Article-btn" onClick={() => navigate("/new")} >Escribe tu reseña</button>
                </article>
            </main>
            {/* Footer */}
            <footer className="Footer">
                <p className="Footer-copy">&copy; 2025 Maria Rubio</p>
            </footer>
        </>
    }
}