const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const keys = require('./.gitignore/config/keys'); //make sure .gitignore works
const port = process.env.PORT || 3000; //listen to the value in process.env.PORT, if it doesn't exist, use 3000
const dbFunctions = require('./Db_related/dbFunctions');
const mysql = require('mysql');
const dbConfig = require('./.gitignore/config/config');
const apiData = require('./Db_related/getApiData');

//EJS
app.set('view engine', 'ejs'); //initizing view engine that will be used for the project

//integrating body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));//handles encoded json and urlencoded data, parses it 

//CSS & JS
app.use('/static', express.static(path.join(__dirname, 'public')));

//updating database 
let newData = apiData() //if new data exists, update the database. Otherwise, ignore it 
    .then((result) => {
        if(result) {
            dbFunctions.updateDb(result.quotes)
        }        
    });

//home route 
app.get('/', async (req,res) => { 
    let to, from, val, statement, convertedValue, dbInfo;
    await dbFunctions.getDbInfo().then((result) => { dbInfo = result }) //waiting for names and exchange rates of currencies from database
    if(Object.keys(req.query).length === 3) { //all 3 keys in query
        to = req.query.to;
        from = req.query.from;
        val = req.query.value || 1; //default is 1 if no value is entered
        await dbFunctions.conversion(to, from, val).then((result) => {  //waiting for converted exchange rate value to return
            convertedValue = result
        })
        statement = val+" "+from.substring(3,6)+" to "+to.substring(3,6)+" = "+convertedValue+" "+to.substring(3,6)
    } 
    res.render("home", {
        title: "Currency Converter",
        names: dbInfo.map(value => value.Name), 
        rates: dbInfo.map(value => value.Rate), 
        info: {
            input: to,
            output: from,
            value: val,
            exchan: convertedValue,
            result: statement,
            lastUpdated: new Date(keys.apiTimeStamp * 1000).toLocaleString("en-US") //calculate last updated time using time stamp from API
         }
    }); 
})


//listening to port
app.listen(port, () => {console.log("Listening to the server on http://localhost:3000")});



