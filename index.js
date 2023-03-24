//Library wo print data in the terminal as a table
const cTable = require("console.table");
//Library to work with mySQL workbench
const mysql = require("mysql2");
//Library to ask questions and revice answers in the terminal
const inquirer = require("inquirer");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "JerseyDev911!",
  database: "company",
});

//Function that asks the inital question in the terminal and calls a function bases off the users answer
function start() {
  console.log("\n");
  const initialPrompts = [
    {
      type: "list",
      name: "initialPrompt",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit",
      ],
    },
  ];

  inquirer.prompt(initialPrompts).then((answer) => {
    //console.log(answer.initialPrompt);

    switch (answer.initialPrompt) {
      case "View All Employees":
        getEmployees();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee Role":
        updateEmployee();
        break;
      case "View All Roles":
        viewRoles();
        break;
      case "Add Role":
        addRole();
        break;
      case "View All Departments":
        viewDepartments();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Quit":
        process.exit();
    }
  });
}

start();

//Function called when user selects "View All Employees"
async function getEmployees() {
  try {
    const [rows] = await connection.promise()
      .query(`SELECT E.ID, E.FIRST_NAME, E.LAST_NAME, R.TITLE, D.NAME AS DEPARTMENT, R.SALARY, 
    (SELECT CONCAT(E2.FIRST_NAME, ' ', E2.LAST_NAME) FROM EMPLOYEE E2 WHERE E2.ID = E.MANAGER_ID) AS MANAGER_NAME 
    FROM EMPLOYEE E 
    JOIN ROLE R ON E.ROLE_ID = R.ID 
    JOIN DEPARTMENT D ON R.DEPARTMENT = D.ID;`);
    console.table(rows);
  } catch (error) {
    console.error(error);
  }
  start();
}

//Function called when user wants to add an employee to the database.
async function addEmployee() {
  try {
    const questions = [
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
    ];

    const { firstName, lastName } = await inquirer.prompt(questions);

    const roleId = await getRole();

    const managerId = await getManager("Select a manager for this employee");

    await connection
      .promise()
      .query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`,
        [firstName, lastName, roleId, managerId]
      );
    console.log("Sucessfully added employee:");
    start();
  } catch (error) {
    console.log("Error adding employee: ", error);
  }
}

//Function to update an employee role
async function updateEmployee() {
  try {
    const updateEmployee = await getManager(
      "Which employee do you want to update?"
    );
    const updateRole = await getRole();

    await connection
      .promise()
      .query(`UPDATE employee SET ROLE_ID = ? WHERE ID = ?;`, [
        updateRole,
        updateEmployee,
      ]);
    console.log("Sucessfully updated employee:");
    start();
  } catch (error) {
    console.log(`Error updating employee :`, error);
  }
}

async function viewRoles() {
  try {
    const [rows] = await connection.promise()
      .query(`SELECT R.ID, R.TITLE, D.NAME, R.SALARY 
      FROM ROLE R 
      JOIN DEPARTMENT D
      ON R.DEPARTMENT =  D.ID;`);
    console.table(rows);
  } catch (error) {
    console.error(error);
  }
  start();
}

//This function is used to add a new role to the database after the user enters data in the terminal
async function addRole() {
  try {
    const questions = [
      {
        type: "input",
        name: "role",
        message: "What is the name of the new role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this role?",
      },
    ];

    const { role, salary } = await inquirer.prompt(questions);

    const department = await getDepartment();

    await connection
      .promise()
      .query(`INSERT INTO role (title, salary, department) VALUES (?, ?, ?);`, [
        role,
        salary,
        department,
      ]);

    start();
  } catch (error) {
    console.log("Error adding role: ", error);
  }
}

//This function is called to display current departments
async function viewDepartments() {
  try {
    const [rows] = await connection
      .promise()
      .query(`select * from department as department;`);
    console.table(rows);
  } catch (error) {
    console.error(error);
  }
  start();
}

//This function is used to add a new department
async function addDepartment() {
  try {
    const question = [
      {
        type: "input",
        name: "newDepartment",
        message: "What is the department name you want to add?",
      },
    ];

    const { newDepartment } = await inquirer.prompt(question);

    await connection
      .promise()
      .query(`INSERT INTO DEPARTMENT (name) VALUES (?);`, newDepartment);
    console.log("Sucessfully added department:");
    start();
  } catch (error) {
    console.log("Error adding department: ", error);
  }
}

// call this funcion with await to get a list of roles and have an inquirer propmt to get the user to select a role.
async function getRole() {
  const [roles] = await connection
    .promise()
    .query(`SELECT id, title FROM ROLE;`);

  const roleChoices = roles.map(({ title, id }) => ({
    name: title,
    value: id,
  }));

  const { roleId } = await inquirer.prompt([
    {
      type: "list",
      name: "roleId",
      message: "Select a role:",
      choices: roleChoices,
    },
  ]);
  return roleId;
}

async function getDepartment() {
  const [departments] = await connection
    .promise()
    .query(`SELECT id, title FROM ROLE;`);

  const departmentsChoices = departments.map(({ title, id }) => ({
    name: title,
    value: id,
  }));

  const { deptId } = await inquirer.prompt([
    {
      type: "list",
      name: "deptId",
      message: "Select a role:",
      choices: departmentsChoices,
    },
  ]);
  return deptId;
}

// call this function with await to get a list of managers and have an inquirer propmt to get the user to select a manager.
async function getManager(displaymessage) {
  const [managers] = await connection
    .promise()
    .query(
      `SELECT id, CONCAT(FIRST_NAME, ' ', LAST_NAME) AS employee FROM EMPLOYEE`
    );

  const managerChoices = managers.map(({ employee, id }) => ({
    name: employee,
    value: id,
  }));

  const { managerId } = await inquirer.prompt([
    {
      type: "list",
      name: "managerId",
      message: displaymessage,
      choices: managerChoices,
    },
  ]);
  return managerId;
}
