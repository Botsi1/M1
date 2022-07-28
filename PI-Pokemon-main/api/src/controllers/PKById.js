const axios = require('axios')




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
    //   console.log(pokemonInfo)
  
      return pokemonInfo;
    } catch (e) {
      console.error(e);
      if (e.status === 404) return null;
    }
  }

  module.exports = {getPokeInfo}