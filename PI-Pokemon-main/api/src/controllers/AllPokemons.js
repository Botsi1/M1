const axios = require("axios")
const {Pokemon,Tipo} = require("../db")




const getAllPokemonsApi= async () =>{
    try {
    const apiUrl = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20");
    const results = apiUrl.data.results
    
 

    const pokemonInfo = []
    
    
    for(let i = 0 ; i < results.length ; i++){
      const pokes = await axios.get(results[i].url);
      const data = pokes.data;
      

    pokemonInfo.push({
      id: data.id,
      name: data.name,
      speed:data.stats[5].base_stat,
      hp:data.stats[0].base_stat,
      defense:data.stats[2].base_stat,
      types: data.types.map((t) => t.type.name),
      img: data.sprites.other['official-artwork'].front_default,
      attack: data.stats[1].base_stat,
      weight: data.weight,
      height: data.height})
     }
    
    return pokemonInfo;
    } catch (error) {
      return error
    }
      
    }
    function other(){ 
      // try {
      //   const apiUrl = await axios.get("https://pokeapi.co/api/v2/pokemon%27")
      //   const apiUrl2 = await axios.get(apiUrl.data.next)
      //   const apiFinal = apiUrl.data.results.concat(apiUrl2.data.results)
      //   if(apiFinal){
      //     const pokemon= await Promise.all(
      //       await apiFinal.map(async (poke)=>{
      //         let el = await axios(poke.url)
      //         return{
      //           id:el.data.id,
      //           name:el.data.name,
      //           img:el.data.sprites.front_default,
      //           types:el.data.types.map(t => t.type.name),
      //           hp:el.data.stats[0].base_stat,
      //           attack:el.data.stats[1].base_stat,
      //           defense:el.data.stats[2].base_stat,
      //           speed:el.data.stats[5].base_stat,
      //           height:el.data.height,
      //           weight:el.data.weight
      //         }
      //       })
      //     )
      //     res.send(pokemon)
      //      console.log('acaaaaaaaaaaa', apiFinal)
      //   }
      //   else{
      //     res.json({message: "hay un error"})
      //   }
      // } catch (error) {
      //   next(error)
      // 
    }
   
    const getDbInfo = async () => {
      const data = (await Pokemon.findAll({  // Obtener todos los pokemones de la base de datos
        include: {
          model: Tipo,
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
      const apiInfo = await getAllPokemonsApi(); // Obtener informacion de los pokemones de la api
      const dbInfo = await getDbInfo(); // Obtener informacion de los pokemones de la base de datos
      const infoTotal = [...dbInfo,...apiInfo];  // Unir las dos informaciones
      // console.log(infoTotal)
  
      return infoTotal;
  }



  module.exports ={
    getAllPokemons,
    getDbInfo,
    getAllPokemonsApi,
    
  }