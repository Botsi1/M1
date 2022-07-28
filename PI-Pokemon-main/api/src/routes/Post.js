const {Pokemon,Tipo} = require("../db.js")
const { Router } = require('express');
const router = Router();






router.post('/', async (req, res) => {
    const { 
          name, 
          types, 
          hp, 
          attack, 
          defense, 
          speed, 
          height, 
          weight, 
          img,
         createdInDb 
      } = req.body;
  
    const pokemonCreated = await Pokemon.create({
      name, 
      hp, 
      attack, 
      defense, 
      speed, 
      height, 
      weight, 
      img,
      createdInDb 
    })
  
    const pokemonTypes = await Tipo.findAll({
      where: { name: types }
    })
  
    pokemonCreated.addTipo(pokemonTypes)
    return res.send('Pokemon created successfuly')
  })

  module.exports=router