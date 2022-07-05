'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise(executor){
    if(typeof executor !== "function") throw new TypeError("Is not a function")
    this._state = "pending"
    this._handleGroups =[]

    executor(this._internalreject.bind(this),this._internalreject.bind(this))
}
$Promise.prototype._internalresolve = function(value){
  if(this_state === "pending"){
    this_state = "fulfilled"
    this._value = value
    this.callHandlers()
  }

}


$Promise.prototype._internalreject = function(value){
    if(this_state === "pending"){
        this_state = "rejected"
        this._value = value
        this.callHandlers()
      }
    
}

$Promise.prototype.then = function(successCb,errorCb){
    if(typeof successCb !== "function") successCb = false
    if(typeof errorCb!=="function") errorCb = false
    const downstreamPromise = new $Promise(function(){})
    this._handleGroups.push({successCb,errorCb,downstreamPromise})
    if(this_state !=="pending") this.callHandlers()
    return downstreamPromise;

}

$Promise.prototype.callHandlers = function(){
  while(this._handleGroups>0){
    //[{sH1,eH1},{sH2,eH2}]
    let current = this._handleGroups.shift(); 
    if(this._state ==="fulfilled"){
      if(!current.successCb){
        current.downstreamPromise._internalresolve(this._value)
      }else{
        try {
          const result = current.successCb(this._value)
          // result = promise Z
          if(result instanceof $Promise){
            result.then(value => current.downstreamPromise._internalresolve(value),
            err => current.downstreamPromise._internalreject(err))
          }else{
            current.downstreamPromise._internalresolve(result);
          }
          
        } catch (e){

          current.downstreamPromise._internalreject(e);
          
        }
       
      }
      // current.successCb && current.successCb(this._value)
    }

    if(this._state ==="rejected"){
      if(!current.errorCb){
        current.downstreamPromise._internalreject(this._value)
      }else{
        try {
          const result = current.errorCb(this._value)
          if(result instanceof $Promise){
            result.then(value => current.downstreamPromise._internalresolve(value),
            err => current.downstreamPromise._internalreject(err))
          }
          else{
            current.downstreamPromise._internalresolve(result)
          }
        } catch (error) {
          current.downstreamPromise._internalreject(e);
          
        }
      }

      // current.errorCb && current.errorCb(this._value)
    }

  }
}

$Promise.prototype.catch = function(errorCb){
  return this.then(null,errorCb);

};

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
