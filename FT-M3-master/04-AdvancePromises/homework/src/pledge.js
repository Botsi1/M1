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
  }

}


$Promise.prototype._internalreject = function(value){
    if(this_state === "pending"){
        this_state = "rejected"
        this._value = value
      }
    
}

$Promise.prototype._internalreject = function(value){
    if(this_state === "pending"){
        this_state = "rejected"
        this._value = value
      }
    
}
$Promise.prototype.then = function(successCb,errorCb){
    if(typeof successCb !== "function") successCb = false
    if(typeof errorCb!=="function") errorCb = false
    this._handleGroups.push({successCb,errorCb})


}



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
