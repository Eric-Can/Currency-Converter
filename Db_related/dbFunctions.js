const db = require('./db')
let inputRate, outputRate

module.exports = {
    conversion: (To, From, value) => {
        return new Promise((resolve, reject) => {
            let sql = "SELECT Rate FROM Rates WHERE Name=? OR Name=?"
            const conn = db.connectDb();
            db.sqlQuery(sql, [To, From], (err, result) => {
                db.endConnection(conn)
                if(err) throw err 
                else {
                    if(result.length === 2) {   
                        outputRate = result[1].Rate;
                        inputRate = result[0].Rate;
                    } else if(result.length === 1) {
                        outputRate = inputRate = result[0].Rate; //input Rate is the same as output rate
                    }
                    return resolve((inputRate / outputRate * value).toFixed(2)) //returning the conversion between the exchange rates
                }
            }, conn)
        });
    },
    getDbInfo: (retValue) => {
        return new Promise((resolve, reject) => {
            const conn = db.connectDb();
            db.sqlQuery("SELECT Name, Rate FROM Rates", null, (err, result) => {
                db.endConnection(conn)
                if(err) throw err
                if(retValue === "n") return resolve(result.map(value => value.Name))
                else if (retValue === "r") return resolve(result.map(value => value.Rate))
                return resolve(result)
            }, conn)
        })
    },  
    updateDb: (data) => {
        const conn = db.connectDb();
        console.log("running DB update");
        const sql = "UPDATE rates SET rate = ? WHERE name = ?";
        for(var key of Object.keys(data)) { //iterating through key/value pairs and updating the database
            db.sqlQuery(sql, [data[key], key], function(err) { }, conn);
        }
        db.endConnection(conn);
    }
}
