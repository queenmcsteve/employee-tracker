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
        await viewDeptsAsync();
        break;
      case "view all roles":
        await viewRoles();
        break;
      case "view all employees":
        await viewEmployees();
        break;
      case "add a department":
        await addDept();
        break;
      case "add a role":
        await addRole();
        break;
      case "add an employee":
        await addEmployee();
        break;
      case "update an employee":
        await updateEmployee();
        break;
      case "exit":
        await connection.end();
        return;
    }
  } catch (err) {
    console.log(err);
  }
  homeStart();
};

// function to view departments
// function viewDepts() {
//   console.log("View Departments");
//   let query = "SELECT * FROM department";
//   connection
//     .query(query)
//     .then((res) => {
//       console.table(res[0]);
//       homeStart();
//     })
//     .catch((err) => {
//       throw err;
//     });
// }

async function viewDeptsAsync() {
  try {
    console.log("View Departments");
    let query = "SELECT * FROM department";
    const res = await connection.query(query);
    console.table(res[0]);
  } catch (err) {
    throw err;
  }
}
// function to view all roles
const viewRoles = async () => {
  try {
    console.log("View Roles");
    let query = "SELECT * FROM role;";
    const res = await connection.query(query);
    console.table(res[0]);
  } catch (err) {
    throw err;
  }
};

// function to view all employees
const viewEmployees = async () => {
  try {
    console.log("View Employees");
    let query = "SELECT * FROM employee;";
    const res = await connection.query(query);
    console.table(res[0]);
  } catch (err) {
    throw err;
  }
};

// function to add a dept
const addDept = async () => {
  let answer = await inquirer.prompt({
    type: "input",
    message: "enter the name of the new department:",
    name: "newDept",
  });
  let newDepartment = answer.newDept;
  try {
    let query = `INSERT INTO department (name) VALUES ("${newDepartment}")`;
    const ins = await connection.query(query);
    let display = "SELECT * FROM department";
    const res = await connection.query(display);
    console.table(res[0]);
  } catch (err) {
    throw err;
  }
};

// function to add a role
const addRole = async () => {
  let depts = `SELECT name, id FROM department`;
  let deptList = await connection.query(depts);
  console.log(deptList[0]);
  let answer = await inquirer.prompt([
    {
      type: "input",
      message: "enter a name for the new role:",
      name: "title",
    },
    {
      type: "input",
      message: "enter the salary for the new role:",
      name: "salary",
    },
    {
      type: "list",
      message: "select the department for the new role:",
      name: "department_name",
      choices: deptList[0],
    },
  ]);
  let getDeptId = `SELECT id FROM department WHERE name = "${answer.department_name}"`;
  let deptID = await connection.query(getDeptId);
  try {
    let query = `INSERT INTO role (title, salary, department_id) VALUES ("${answer.title}", "${answer.salary}", "${deptID[0][0]["id"]}")`;
    const ins = await connection.query(query);
    let display = "SELECT * FROM role";
    const res = await connection.query(display);
    console.table(res[0]);
  } catch (err) {
    throw err;
  }
};

// function to add an employee
const addEmployee = async () => {
  console.log("Add an Employee");
};

// function to update an employee
const updateEmployee = async () => {
  console.log("Update an Employee");
};

homeStart();
