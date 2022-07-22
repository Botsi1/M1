const axios = require("axios")


const getAllPokemons= async (req,res,next) =>{
    try {
      const apiUrl = await axios.get("https://pokeapi.co/api/v2/pokemon%27")
      const apiUrl2 = await axios.get(apiUrl.data.next)
      const apiFinal = apiUrl.data.results.concat(apiUrl2.data.results)
      if(apiFinal){
        const pokemon= await Promise.all(
          await apiFinal.map(async (poke)=>{
            let el = await axios(poke.url)
            return{
              id:el.data.id,
              name:el.data.name,
              img:el.data.sprites.front_default,
              types:el.data.types.map(t => t.type.name),
              hp:el.data.stats[0].base_stat,
              attack:el.data.stats[1].base_stat,
              defense:el.data.stats[2].base_stat,
              speed:el.data.stats[5].base_stat,
              height:el.data.height,
              weight:el.data.weight
            }
          })
        )
        res.send(pokemon)
         console.log('acaaaaaaaaaaa', apiFinal)
      }
      else{
        res.json({message: "hay un error"})
      }
    } catch (error) {
      next(error)
    }
  }