let mysql = require("mysql");

let dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  port: 3306,
  multipleStatements: true,
};

class Database {
  constructor() {
    let that = this;

    that.executeSelectQuery = function (qry, op) {
      return new Promise((resolve, reject) => {
        getConnection(dbConfig, function (err, conn) {
          if (err) {
            reject(err);
          } else {
            conn.query(qry, function (err, rows) {
              if (err) reject(err);
              else resolve(rows);

              conn.end();
            });
          }
        });
      });
    };

    let getConnection = function (config, cb) {
      let connection = mysql.createConnection(config);
      connection.connect(function (err) {
        cb(err, connection);
      });
    };
  }
}

module.exports = new Database();
