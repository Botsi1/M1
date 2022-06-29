const commands = require("./commands")

const print = function(outpout){
  process.stdout.write(outpout)
  process.stdout.write('\npromt > ');
}

process.stdout.write("prompt > ")

process.stdin.on('data',function(data){
  var args = data.toString().trim().split(" ")
  let cmd = args.shift()
  if(commands[cmd]){
    commands[cmd](args,print)
  }
  else{
    print("cmd not")
  }
  
})

