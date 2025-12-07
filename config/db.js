var mysql = require('mysql2');

var connectionOptions = {
    host: "localhost",
    user: "root",
    password: "123456",
    database: "gestao-filmes-series",
    dateStrings: true
};

var connection = mysql.createConnection(connectionOptions);

connection.connect((err) => {
    if (err) {
        console.log("Erro ao conectar no banco:", err);
        return;
    }
    console.log("MySQL conectado!");
});

module.exports = connection;