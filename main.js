//dependicies
var mysql = require("mysql");
const inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "employee_maker"
});
connection.connect(function (err) {
  if (err) throw err;
  //start prompt
  promptUser();

});

function promptUser() {
  const options = ["View All Employees", "View All Employees by Department", "View All Employees by Managemnt", "Add employee", "Remove employee", "Update Employee Role", "Update Employee Manager", "exit"];
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: options,
      name: "choice"
    }
  ]).then(response => {
    if (response.choice == options[0]) {
      allEmployees();
    } else if (response.choice == options[1]) {
      //getTop5000Artists();
    } else if (response.choice == options[2]) {
      //getDataInRange();
    } else if (response.choice == options[3]) {
      // getSongByName();
    } else if (response.choice == options[4]) {
      getSongByName();
    } else if (response.choice == options[5]) {
      //getSongByName();
    } else if (response.choice == options[6]) {
      //getSongByName();
    } else if (response.choice == options[7]) {
      connection.end();
    }
  })
}
// function to see bring up all the employees
function allEmployees() {
  connection.query(`select employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
                        concat (E2.first_name, ' ', E2.last_name) AS manager_name from employee	
                        inner join role on role.id = employee.role_id 
                        inner join department on department.id = role.department_id
                        left join employee as E2 ON E2.id = employee.manager_id;`, function (error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      console.log("\n");
      // LOG RESULTS TO THE CONSOLE
      console.table(results);
      console.log("\n");
      // RETURN TO START; PROMPT USER FOR ACTION TO BE EXECUTED
      promptUser();
    }
  });
}

