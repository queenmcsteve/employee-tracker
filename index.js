let mysql = require("mysql2");
let inquirer = require("inquirer");
let consoleTable = require("console.table");

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

console.log("\n----------EMPLOYEE TRACKER----------\n");

const homeStart = async () => {
  try {
    let answer = await inquirer.prompt({
      name: "action",
      type: "list",
      message: "Select an option from the following:",
      choices: [
        "view departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee",
        "exit",
      ],
    });
    switch (answer.action) {
      case "view departments":
        viewDepts();
        break;
      case "view all roles":
        viewRoles();
        break;
      case "view all employees":
        viewEmployees();
        break;
      case "add a department":
        addDept();
        break;
      case "add a role":
        addRole();
        break;
      case "add an employee":
        addEmployee();
        break;
      case "update an employee":
        updateEmployee();
        break;
      case "exit":
        connection.end();
        break;
    }
  } catch (err) {
    console.log(err);
    homeStart();
  }
};

// function to view departments
const viewDepts = async () => {};

// function to view all roles
const viewRoles = async () => {};

// function to view all employees
const viewEmployees = async () => {};

// function to add a dept
const addDept = async () => {};

// function to add a role
const addRole = async () => {};

// function to add an employee
const addEmployee = async () => {};

// function to update an employee
const updateEmployee = async () => {};

homeStart();
