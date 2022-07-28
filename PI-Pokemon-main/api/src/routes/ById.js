const { Router } = require('express');
const { getPokeInfo} = require("../controllers/PKById.js")
const {getDbInfo} = require("../controllers/AllPokemons.js")
const {Pokemon} = require("../db.js")

// Importar todos los routers;im
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

router.get('/:idPokemon', async (req, res) => {
    const { idPokemon } = req.params
    
    let pokemonInfo;
    if(idPokemon >= 1 && idPokemon <= 898 || idPokemon >= 10001 && idPokemon <= 10220){
      const pokemonInfo = await getPokeInfo(idPokemon)
      
      return pokemonInfo ?
      res.status(200).send([pokemonInfo]) :
      res.status(404).send('Pokemon not found')
    }
  
    const pokemonsTotal = await getDbInfo()
  
    if(!pokemonInfo && idPokemon){
      const pokemonId = pokemonsTotal.filter( el => el.id == idPokemon )
  
      return pokemonId.length ?
      res.status(200).send(pokemonId) :
      res.status(404).send('Pokemon not found')
    }
  })

module.exports= router