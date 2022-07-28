const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const Pokemons = require("./Pokemons.js")
const ById = require("./ById.js")
const Types = require("./Types.js")
const Post = require("./Post")

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/pokemons",Pokemons)
router.use("/pokemons",Types)
router.use("/pokemons", ById)
router.use("/pokemons", Post)

module.exports = router;
