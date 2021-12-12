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
        await viewDepts();
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

// function to view all depts
async function viewDepts() {
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
    let query =
      "SELECT role.id, role.title, department.name as department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;";
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
    let query =
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;";
    const res = await connection.query(query);
    console.table(res[0]);
  } catch (err) {
    throw err;
  }
};

// function to add a dept
const addDept = async () => {
  console.log("Add Department");
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
  console.log("Add Role");
  let depts = `SELECT name, id FROM department`;
  let deptList = await connection.query(depts);
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
  let roles = await connection.query(`SELECT * FROM role`);
  let managers = await connection.query(`SELECT * FROM employee`);
  let answer = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "enter their first name:",
    },
    {
      type: "input",
      name: "last_name",
      message: "enter their surname:",
    },
    {
      type: "list",
      name: "role",
      message: "select their role:",
      choices: roles[0].map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      }),
    },
    {
      type: "list",
      name: "manager",
      message: "select their manager:",
      choices: managers[0].map((manager) => {
        return {
          name: manager.first_name + " " + manager.last_name,
          value: manager.id,
        };
      }),
    },
  ]);
  try {
    let query = await connection.query("INSERT INTO employee SET ?", {
      first_name: answer.first_name,
      last_name: answer.last_name,
      role_id: answer.role,
      manager_id: answer.manager,
    });
    let display = "SELECT * FROM employee";
    const res = await connection.query(display);
    console.table(res[0]);
  } catch (err) {
    throw err;
  }
};

// function to update an employee
const updateEmployee = async () => {
  try {
    console.log("Update Employee");
    let employees = await connection.query("SELECT * FROM employee");
    let employeeSelect = await inquirer.prompt([
      {
        name: "employee",
        type: "list",
        message: "select an employee to update:",
        choices: employees[0].map((employeeName) => {
          return {
            name: employeeName.first_name + " " + employeeName.last_name,
            value: employeeName.id,
          };
        }),
      },
    ]);
    let roles = await connection.query("SELECT * FROM role");
    let roleSelect = await inquirer.prompt([
      {
        name: "role",
        type: "list",
        message: "select the new role for the employee:",
        choices: roles[0].map((roleName) => {
          return {
            name: roleName.title,
            value: roleName.id,
          };
        }),
      },
    ]);

    let ins = await connection.query(`UPDATE employee SET ? WHERE ?`, [
      { role_id: roleSelect.role },
      { id: employeeSelect.employee },
    ]);
  } catch (err) {
    throw err;
  }
};

homeStart();
