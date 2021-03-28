const mysql = require('mysql')
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  timezone : 'UTC+0',
  charset: 'utf8mb4_unicode_ci',
})

connection.connect(error => {
  if (error) {
      console.log(error)
  }
  console.log("🟢 MYSQL connected")
})
module.exports = connection;