const mysql = require('mysql');
const dbConfig = require('../.gitignore/config/config');

module.exports = {
    connectDb: () => {
        const connection = mysql.createConnection(dbConfig);
        connection.connect((err) => {
            if(err) throw err;
            console.log('connected!');
        })
        return connection
    },
    sqlQuery: (sql, values, next, connection) => { //execute DB query
        connection.query(sql, values, function(err) {
            if(err) throw err
            next.apply(this, arguments); // Execute the callback to apply inputted arguments
        })
    },
    endConnection: (conn) => {
        conn.end((err) => {
            // The connection is terminated gracefully
            // Ensures all remaining queries are executed
            // Then sends a quit packet to the MySQL server.
        });         
    }
}
