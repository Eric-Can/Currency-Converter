module.exports = async function(){
   const express = require('express');
   const fetch = require('node-fetch');
   const fs = require('fs');
   const app = express();
   const keys = require('../.gitignore/config/keys.json'); 
   
   //initializing required keys
   const apiURL = keys.apiURL;
   const apiTimeStamp = keys.apiTimeStamp;

   //calculating the last time the api information was called
   const threeDaysInSec = 259200;
   let currentTimeInSeconds = new Date().getTime()/1000 - apiTimeStamp;
   let result = null
   if(currentTimeInSeconds > threeDaysInSec) { //only call API if it hasn't been called in over 3 days
      //accessing currencyLayer API 
      const currencyData = await fetch(apiURL)
         .then((res) => res.json())
         .then((json) => { 
            keys.apiTimeStamp = json.timestamp;
            fs.writeFile("./.gitignore/config/keys.json", JSON.stringify(keys), function(err) { //update timestamp value in json file
               if (err) throw err;
               })
            result = json 
         });
   }
   return result; //returns null if the api was called less than 3 days
}
