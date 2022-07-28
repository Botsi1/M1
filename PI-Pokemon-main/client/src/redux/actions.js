import axios from "axios"
export const GET_ALL_CHARACTERS = "GET_ALL_CHARACTERS"


export const getAllcharacters = () =>{
    return async function pedido(dispatch){
        console.log("estoy")
        let info = await axios.get("http://localhost:3001/pokemons")
        console.log(info.data)
        return dispatch({
            type:GET_ALL_CHARACTERS,
            payload:info.data
        })
    }
}