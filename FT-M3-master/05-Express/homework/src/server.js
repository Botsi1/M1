// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());
//SI TRABAJAMOS CON req.body, activar el middleware de json
const PATH = '/post'
let id = 1
// TODO: your code to handle requests
server.posts(PATH,(req,res) =>{
    const{ author, tittle,contens} =req.body
    if(!author || !tittle || !contens){
        return res.status(STATUS_USER_ERROR).json({error:"No se reicibieron los parametros necesarios para crear el post"})
    }
    const post = {
        author, tittle,contens, id: id++
    
    }
    posts.push(post)
    res.status(200).json(post)

});

server.post(`${PATH}/author/:author`, (req,res)=> {
    let { author}= req.params
    let {tittle, contens} = req.body
    if(!author|| !tittle || !contens){
        return res.status(STATUS_USER_ERROR).json({error:"No se reicibieron los parametros necesarios para crear el post"})
    }
    const post = {
        author, tittle,contens, id: id++
    
    }
    posts.push(post)
    res.status(200).json(post)
})

server.get(PATH,(req,res)=>{
    let {term} = req.query
    if (term){
        const termpost = posts.filter(p => p.tittle.include(term) || p.contens.includes(term))
        return res.json(termpost)
    }
    res.json(posts)
    
})
server.get(`${PATH}/:author`,(req,res)=>{
    let {author} = req.params
    const postauthor = posts.filter(p => p.author === author)
    if(postauthor.length >0){
        res.json(postauthor)
    }else{
        return res.status(STATUS_USER_ERROR).json({error:"No se reicibieron los parametros necesarios para crear el post"})
    }
})

server.get(`${PATH}/author/titlle`,(req,res)=>{
    let{author,title} = req.params
    if(author&& title){ const newpost = posts.filter(p => p.author ===author && p.title ===title)
        if(newpost.length >0){
            res.json(newpost)
        }else{
            return res.status(STATUS_USER_ERROR).json({error:"No se reicibieron los parametros necesarios para crear el post"})
        }
    }else{ return res.status(STATUS_USER_ERROR).json({error:"No se reicibieron los parametros necesarios para crear el post"})}
   
})
module.exports = { posts, server };
