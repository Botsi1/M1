const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require('axios')
const { Pokemon, Type } = require('../db.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
const random = (arrlength) => {
  let number = Math.floor(Math.random() * arrlength); // Genera un numero aleatorio entre 0 y el largo del arreglo
  return number // Retorna el numero aleatorio

}

const arreglo = (arr) => {
  let results = []

  if(arr[0] && arr[0].hasOwnProperty('move')){
    const one = arr[random(arr.length)]; // Obtener un pokemon aleatorio
    const two = arr[random(arr.length)]; // Obtener un pokemon aleatorio
    const three = arr[random(arr.length)];

    results.push(one.move.name, two.move.name, three.move.name)
  } else{
    if(arr.length > 1){
      const one = arr[random(arr.length)]['location_area'].name;
      const two = arr[random(arr.length)]['location_area'].name;

      one !== two ? results.push(one, two) : results.push(one)
    } else{
      arr[0] ? results.push(arr[0]['location_area'].name) : results
    }
  }
  return results
 } 

const evolution = async (evol) => {
  try {
    let evoChain = [];
    let evoData = evol.chain;

    do {
      let evoDetails = evoData['evolution_details'][0];
      const apiPokeUrl = await axios.get(
        "https://pokeapi.co/api/v2/pokemon/" + evoData.species.name
      );

      let result = {
        name: evoData.species.name,
        img: apiPokeUrl.data.sprites.other["official-artwork"].front_default,
      }
    //no entendi
      if(evoDetails){
        for(prop in evoDetails){
          if(evoDetails[prop]){
            if(typeof evoDetails[prop] === 'object'){
              result[prop] = evoDetails[prop].name
            } else{
              result[prop] = evoDetails[prop]
            }
          }
          if(prop === 'held_item' && evoDetails[prop]){
            let item = await axios.get(evoDetails[prop].url)
            result.itemimg = item.data.sprites.default
          }
        }
      }
      evoChain.push(result)

      evoData = evoData['evolves_to'][0];
    } while (evoData && evoData.hasOwnProperty('evolves_to'));

    return evoChain

  } catch (e) {
    console.error(e)
  }
} 


const getApiInfo = async () => {
    const apiUrl = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100");
    const results = apiUrl.data.results

    const pokemonInfo = []
    
    for(let i = 0 ; i < results.length ; i++){
      const pokes = await axios.get(results[i].url);
      const pokeInfo = pokes.data;

      pokemonInfo.push({
        id: pokeInfo.id,
        name: pokeInfo.name,
        types: pokeInfo.types.map((t) => t.type.name),
        img: pokeInfo.sprites.other['official-artwork'].front_default,
        attack: pokeInfo.stats[1].base_stat,
        weight: pokeInfo.weight,
        height: pokeInfo.height
      });
    }
    
    return pokemonInfo;
}

const getDbInfo = async () => {
	const data = (await Pokemon.findAll({  // Obtener todos los pokemones de la base de datos
    include: {
      model: Type,
      attributes: ['name'],
      through: {
        attributes: [],
      }
    }
  })).map(pokemon => {
    const json = pokemon.toJSON();
    return{
      ...json,
      types: json.types.map( type => type.name)
    }
  });
  
  return data
}

const getAllPokemons = async () => {
    const apiInfo = await getApiInfo(); // Obtener informacion de los pokemones de la api
    const dbInfo = await getDbInfo(); // Obtener informacion de los pokemones de la base de datos
    const infoTotal = [...apiInfo, ...dbInfo];  // Unir las dos informaciones
    // console.log(infoTotal)

    return infoTotal;
}

const getPokeInfo = async (id) => {
  try {
    const apiPokeUrl = await axios.get("https://pokeapi.co/api/v2/pokemon/" + id); // Obtener informacion de un pokemon de la api
    const results = apiPokeUrl.data
    const apiPokeSpecie = await axios.get(results.species.url) // Obtener informacion de la especie de un pokemon de la api
    const speciesresult = apiPokeSpecie.data // Guardar la informacion de la especie en una variable
    const pokeEvolution = await axios.get(speciesresult['evolution_chain'].url) // Obtener informacion de la evolucion de un pokemon de la api

    const allDescriptions = speciesresult["flavor_text_entries"].filter( el => el.language.name === 'en')
    const speciespok = speciesresult.genera.filter( el => el.language.name === 'en')
    const locations = await axios.get(results['location_area_encounters'])
    const moves = results.moves
  // alldescriptions = [...]
  // alldescritpion[]
    const pokemonInfo = {
      // ABOUT
      abilities: results.abilities ? results.abilities.map( a => a.ability.name) : null,
      growth: speciesresult['growth_rate'] ? speciesresult['growth_rate'].name : null,
      habitat: speciesresult.habitat ? speciesresult.habitat.name : null,
      description: allDescriptions[random(allDescriptions.length)]['flavor_text'].replace('POKéMON', 'Pokémon'),
      species: speciespok[0].genus ? speciespok[0].genus : null,
      locations: arreglo(locations.data),
      moves: arreglo(moves),

      // STATS
      id: results.id,
      name: results.name,
      types: results.types.map((t) => t.type.name),
      img: results.sprites.other['official-artwork'].front_default,
      hp: results.stats[0].base_stat,
      attack: results.stats[1].base_stat,
      defense: results.stats[2].base_stat,
      speed: results.stats[5].base_stat,
      weight: results.weight,
      height: results.height,
      happiness: speciesresult['base_happiness'],
      capture: speciesresult['capture_rate'],

      //EVOLUTION
      evolution: await evolution(pokeEvolution.data)
    }
    console.log(pokemonInfo)

    return pokemonInfo;
  } catch (e) {
    console.error(e);
    if (e.status === 404) return null;
  }
}

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


router.get("/pokemons", async (req, res) => {
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
});

router.get('/types', async (req, res) => {
  const typesApi = await axios.get("https://pokeapi.co/api/v2/type");
  const types = typesApi.data.results;

  types.forEach( el => {
    Type.findOrCreate({
      where: {name: el.name}
    })
  })

  const allTypes = await Type.findAll();
  return res.send(allTypes);
})

router.post('/pokemons', async (req, res) => {
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

  const pokemonTypes = await Type.findAll({
    where: { name: types }
  })

  pokemonCreated.addType(pokemonTypes)
  return res.send('Pokemon created successfuly')
})

router.get('/pokemons/:idPokemon', async (req, res) => {
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

module.exports = router;