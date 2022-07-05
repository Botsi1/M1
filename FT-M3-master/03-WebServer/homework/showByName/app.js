var fs  = require("fs")
var http  = require("http")

// Escribí acá tu servidor
function readFile(filename){
    return new Promise((res,rej)=>{
        fs.readFile('./images/'+filename, function(err,data){
            if(err){
                rej({
                    data:'<h1>Not found</h1>',
                    contentType:'text/html',
                    status:404,
                });

                } else{
                    res({
                        data:data,
                        contentType:'image/jpeg',
                        status: 200,
                    })
                }
        })


    })
}

http.createServer(function(req,res){
    readFile(req.url.split(('/',2).pop()))
    .then(function(data){
        res.writeHead(data.status,{'Content-Type': data.contentType})
        return res.end(data.data)
    })
    .catch((err)=>{
        res.writeHead(err.data,{'Content-Type': err.contentType })
        return res.end(err.data)})
    })
    .listen(1337,"127.0.0.1");