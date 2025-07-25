import { Link } from "react-router-dom" // Enlaces del menu nav
import { useState } from "react" // El estado para el modo responsive
import "./index.css" // Importamos css


export default function Navegacion(){

    let [isOpen,setIsOpen] = useState(false) // Boolean para controlar el menú responsive

    return <>
    <header className="Header">
        <h1>
            <img src="/logo-filmtap.webp" alt="Logo FilmTap" className="Header-logo" />
        </h1>
        {/* Desplegar el menu en modo responsive (toogle) */}
        <button className="Header-btn" onClick={() => setIsOpen(!isOpen)} >&#9776;</button>
        <nav className={ `Header-nav ${isOpen ? 'open' : ""}`}>
            <ul className="Header-ul">
                <li className="Header-li" ><Link to="/">HOME</Link></li>
                <li className="Header-li" ><Link to="/films">MIS PELÍCULAS</Link></li>
                <li className="Header-li" ><Link to="/new">CREAR RESEÑA</Link></li>
                <li className="Header-li" ><Link to="/login">CERRAR SESIÓN</Link></li>
            </ul>
        </nav>
    </header>
    </>
}