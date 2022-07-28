const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const {getAllPokemons,getDbInfo} =require("../controllers/AllPokemons")
const {getPokeInfoxName} = require("../controllers/PKByName.js")


const router = Router();

router.get("/",async(req,res,next)=>{
    const name = req.query.name; // Obtener el nombre del pokemon

  if (name) {
    const pokemonName = await getPokeInfoxName(name.toLowerCase()); // Obtener informacion del pokemon de la api
    

    if (pokemonName) {
      return res.status(200).send([pokemonName]); // Enviar la informacion del pokemon
    } else {
      const pokemonsDB = await getDbInfo(); // Obtener informacion de los pokemones de la base de datos
      const pokemonNAM = pokemonsDB.filter( // Filtrar los pokemones de la base de datos por el nombre del pokemon
        el => el.name.toLowerCase() == name.toLowerCase() // Comparar el nombre del pokemon con el nombre de la base de datos
      );

      return pokemonNAM.length
        ? res.status(200).send(pokemonNAM) // Enviar la informacion del pokemon de la base de datos
        : res.status(404).send("Pokemon not found"); // Enviar mensaje de error
    }
  } else {
    const pokemonsTotal = await getAllPokemons(); // Obtener informacion de todos los pokemones de la api y la base de datos

    return res.status(200).send(pokemonsTotal); // Enviar la informacion de todos los pokemones
  }
    

})

module.exports = router