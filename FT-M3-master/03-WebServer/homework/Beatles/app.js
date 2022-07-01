var http = require('http');
var fs   = require('fs');

var beatles=[{
  name: "John Lennon",
  birthdate: "09/10/1940",
  profilePic:"https://blogs.correiobraziliense.com.br/trilhasonora/wp-content/uploads/sites/39/2020/10/CBNFOT081020100047-550x549.jpg"
},
{
  name: "Paul McCartney",
  birthdate: "18/06/1942",
  profilePic:"http://gazettereview.com/wp-content/uploads/2016/06/paul-mccartney.jpg"
},
{
  name: "George Harrison",
  birthdate: "25/02/1946",
  profilePic:"https://canaldosbeatles.files.wordpress.com/2012/02/george-george-harrison-8321345-438-600.jpg"
},
{
  name: "Richard Starkey",
  birthdate: "07/08/1940",
  profilePic:"http://cp91279.biography.com/BIO_Bio-Shorts_0_Ringo-Starr_SF_HD_768x432-16x9.jpg"
}
]


function readFile(filename){
  return new Promise((resolve,reject)=>{
    fs.readFile(filename,),'utf-8', (err, data)=>{
      if(err) reject(err);
      else resolve(data)
    }  })
}

http.createServer(function(req,res){
  if (req.url==="/"){
    return readFile("./index.html").then((html)=>{
      res.writeHead(200,{"Conten-Type": "application/json"});
      return res.end(html);
    })

  }
  if(req.url==="/api"){
    res.writeHead(200,{"Content-Type": "application/json"});
    return res.end(JSON.stringify(beatles))
  }

  // str = "pablito"   str.substring(0,2) pab
  if(req.url.substring(0,5)==="/api/"){
     // localhost:1337/A/B/C   req.url /A/B/John%20Lennon  ["A","B","C"]  "C"
     const search = req.url.split+("/").pop()
     const beatle = beatles.find((b)=>encodeURI(b.name)=== search)
     if(beatle){
      res.writeHead(200,{"Conten-Type" : "application/json"});
      return res.end(JSON.stringify(beatle))
     }
  }
  if(req.url[0]==="/" && req.url.length > 1){
    console.log("entrando al aca")
    const search= req.url.split("/").pop()
    const beatle= beatles.find((b)=>encodeURI(b.name)=== search)
    console.log("1----->", beatle)
    return readFile("./beatle.html")
          .then((html)=>{
            console.log("2------>", beatle)
            html= html.replace("{name}",beatle.name)
            html= html.replace("{cumple}",beatle.birthdate)
            hmtl = html.replace("{img}", beatle.profilePic)
            res.writeHead(200,{"Conten-Type": "text/hmtl;charset=UFT-8"});
            res.end(hmtl);
          })

  }
})