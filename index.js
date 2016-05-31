var sql = require('mssql')

var conn = "mssql://cafe4it_SQLLogin_1:rziqf3lvwu@thegioiquatran.mssql.somee.com/thegioiquatran"

sql.connect(conn).then(function() {
    new sql.Request().query('SELECT Distinct TABLE_NAME FROM information_schema.TABLES').then(function(recordset) {
        console.dir(recordset);
    }).catch(function(err) {
        console.error(err);
    })
})