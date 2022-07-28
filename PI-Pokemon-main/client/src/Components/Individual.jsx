import React from "react";


export default function Individual(props){

    return(
        <div>
        <div> <h1>{props.name}</h1></div>
        <div>{props.attack}</div>
        <div><img src={props.image} alt="otro" /></div>




        </div>
    )
}