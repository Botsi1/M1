const axios = require("axios")
const { Router } = require('express');
const router = Router();
const {Tipo} = require("../db.js")

router.get('/types', async (req, res) => {
    const typesApi = await axios.get("https://pokeapi.co/api/v2/type");
    const types = typesApi.data.results;
  
    types.forEach( el => {
      Tipo.findOrCreate({
        where: {name: el.name}
      })
    })
  
    const allTypes = await Tipo.findAll();
    return res.send(allTypes);
  })

  module.exports = router