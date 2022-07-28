const axios = require("axios")


const getPokeInfoxName = async (name) => {
    try {
      const apiPokeUrl = await axios.get(
        "https://pokeapi.co/api/v2/pokemon/" + name
      );
      const results = apiPokeUrl.data;
  
      const pokemonInfo = {
        id: results.id,
        name: results.name,
        types: results.types.map((t) => t.type.name),
        img: results.sprites.other["official-artwork"].front_default,
        weight: results.weight,
        height: results.height,
      };
      console.log(pokemonInfo);
  
      return pokemonInfo;
    } catch (e) {
      if (e.status === 404) return null;
    }
  };

  module.exports = {getPokeInfoxName}