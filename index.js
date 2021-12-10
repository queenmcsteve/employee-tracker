let mysql = require("mysql2");

let connection = mysql
  .createConnection(
    {
      host: "localhost",
      user: "root",
      password: "rootpass",
      database: "employee_db",
    },
    console.log("connected to the employee_db server.")
  )
  .promise();
