import React from "react";
import Individual from "./Individual"
import { useEffect } from "react";
import {useDispatch,useSelector} from "react-redux"
import {getAllcharacters} from "../redux/actions"

export default function Cards(){


    const dispatch = useDispatch()
    const personajes = useSelector(state => state.characters)

    useEffect(()=>{
        console.log("por entrar")
        dispatch(getAllcharacters())
        console.log("personajes",personajes)


    },[dispatch])

    return(
        <div>
         <h1>Pokemon</h1>
         <h4>{personajes.lenght?personajes.map(P=>
            <Individual name={P.name} attack={P.attack} image={P.image}/>
         ):"No hay pokemones"}</h4>
        </div>
    )
}