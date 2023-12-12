const mysql = require("mysql");

const pool = mysql.createPool({
    connectionLimit: 10,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

let db = {};

db.getUser = (id) => {
    return new Promise((resolve, reject)=> {
        pool.query('SELECT * FROM User WHERE id= ?', [id], (error, user) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(user);
            }
        });
    });
};

db.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM User WHERE email = ?', [email], (error, user) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(user[0]);
            }
        });
    });
};

db.insertUser = (email, password) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO User (email, password) VALUES (?, ?)', [email, password], (error, result) => {
            if(error) {
                return reject(error);
            } else {
                return resolve(result.insertId);
            }
        });
    });
};


module.exports = db;
