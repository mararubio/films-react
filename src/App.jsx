// Fichero principal.
import { useState } from "react" // Lo necesito para el token y reconocer al usuario.
import { createBrowserRouter,RouterProvider } from "react-router-dom" // Router de las páginas.
import Context from "./Contexto.jsx" // Importamos contexto global.

// Importamos todas las páginas
import Login from "./Login.jsx"
import Peliculas from "./Peliculas.jsx"
import Crear from "./Crear.jsx"
import Inicio from "./Inicio.jsx"
import Editar from "./Editar.jsx"

const router = createBrowserRouter([ //Array de las rutas
    {
        path : "/",
        element : <Inicio />
    },
    {
        path : "/films",
        element : <Peliculas />
    },
    {
        path : "/new",
        element : <Crear />
    },
    {
        path : "/update/:id",
        element : <Editar />
    },
    {
        path : "/login",
        element : <Login />
    }
])

export default function App(){

    // Necesito todo esto en el context
    let [token,setToken] = useState("") 
    let [user,setUser] = useState(null) 
    let [films,setFilms] = useState([])


    function createFilm(film){
        setFilms([...films,film])
    }

    return <Context.Provider value={{token,setToken,user,setUser,films,setFilms,createFilm}}> 
            <RouterProvider router={router} />
        </Context.Provider>
}