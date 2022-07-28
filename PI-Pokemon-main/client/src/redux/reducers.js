import { GET_ALL_CHARACTERS } from "./actions.js"


const initialState = {
    characters: [],
    details:{}
}

const rootReducer = (state = initialState,action)=>{
    switch(action.type){
        case GET_ALL_CHARACTERS:
            console.log("entrnado al reucer");
            return{
                ...state,
                characters: action.payload
            }
        default: return {...state}
    }
}
 export default rootReducer;