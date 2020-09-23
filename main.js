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
  database: "employee_trackerDB"
});
connection.connect(function (err) {
  if (err) throw err;
  //start prompt
  promptUser();

});

function promptUser() {
  const options = ["View All Employees",//0
  "View All Employees by Department", //1
  "View All Employees by Managemnt", //2
  "Add employee", //3
  "Remove employee", //4
  "Update Employee Role", //5
  "Update Employee Manager", //6
  "view all roles",//7
  "add a department",//8
  "add a role",//9
  "exit"];//9
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
      ViewAllEmployeesDepartment();
    } else if (response.choice == options[2]) {
      employeesbyManagemnt();
    } else if (response.choice == options[3]) {
      addEmployee();
    } else if (response.choice == options[4]) {
      deleteEmployee();
    } else if (response.choice == options[5]) {
      updateRole();
    } else if (response.choice == options[6]) {
      updateEmployeeManager();
    } else if (response.choice == options[7]) {
      viewAllRoles();
    }else if (response.choice == options[8]) {
      addDepartment();
    }else if (response.choice == options[9]) {
      addRole();
    }else if (response.choice == options[10]) {
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
      //start prompt
      promptUser();
    }
  });
}
//View All Employees by department
function ViewAllEmployeesDepartment() {
  connection.query("select * from department", (error, listofDepartments) => {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      const departmentNames = listofDepartments.map((department) => department.name);
      inquirer.prompt([
        // prompt user for department to view
        {
          type: "list",
          message: "Which department would you like to view?",
          choices: departmentNames,
          name: "departmentName"
        },
      ]).then((response) => {
        
        connection.query(`select employee.id, employee.first_name, employee.last_name, role.title from employee 
                          inner join role on role.id = employee.role_id 
                          inner join department on department.id = role.department_id
                        where ?`, { name: response.departmentName }, (error, results) => {
          console.log("\n");
          // show results for user
          console.table(results);
          console.log("\n");
          promptUser();
        });
      });
    }
  });
}
function employeesbyManagemnt() {
  connection.query("select * from role", (error, listofDepartments) => {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      const managerName = listofDepartments.map((role) => role.name);
      inquirer.prompt([
        // prompt user for department to view
        {
          type: "list",
          message: "Which manager would you like to view?",
          choices: managerName,
          name: "managerName"
        },
      ]).then((response) => {
       
        connection.query(`select employee.id, employee.first_name, employee.last_name, role.title from employee 
                          inner join role on manager_id = employee.manager_id 
                          inner join department on manager_id = role.manager_id
                        WHERE ?`, { name: response.managerName }, (error, results) => {
          console.log("\n");
          // DISPLAY results for user
          console.table(results);
          console.log("\n");
          promptUser();
        });
      });
    }
  });
}



// VIEW ALL ROLES
function viewAllRoles() {
  
  connection.query(`SELECT role.id, role.title, department.name AS department, role.salary FROM role 
                          inner join department ON department.id = role.department_id`, function (error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      console.log("\n");
      //  results for user
      console.table(results);
      console.log("\n");
      promptUser();
    }
  });
}


// add new Department
function addDepartment() {
  // PROMPT USER FOR name OF NEW DEPARTMENT
  inquirer.prompt([
    {
      type: "input",
      message: "What department would you like to add?",
      name: "newDepartmentName",
    },
  ]).then((response) => {
    // add department into department table
    connection.query(`insert into department SET ?`, { name: response.newDepartmentName }, (error, results) => {
      console.log("\n");
      console.log(`Added ${response.newDepartmentName} to the Department database`)
      console.log("\n");
      promptUser();
    });
  });
}


// add new ROLE
function addRole() {
  
  connection.query("SELECT * FROM department", (error, listOfDepartments) => {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      // create an array of the department names
      const departmentNames = listOfDepartments.map((department) => department.name);

      inquirer.prompt([
        // prompt user for department that will house new role
        {
          type: "list",
          message: "To which department should the new role belong?",
          choices: departmentNames,
          name: "departmentName"
        },
        // prompt user for title of new role
        {
          type: "input",
          message: "What is the title for this role?",
          name: "newRoleTitle",
        },
        // prompt user for salary of new role
        {
          type: "input",
          message: "What is the salary for this role?",
          name: "newRoleSalary",
        },
      ]).then((response) => {
        //find department_id that matches user's department choice
        const department = listOfDepartments.find((department) => department.name == response.departmentName);

        // add new role into role table
        connection.query(`INSERT INTO role SET ?`, { title: response.newRoleTitle, salary: response.newRoleSalary, department_id: department.id }, (error, results) => {
          console.log("\n");
          console.log(`Added ${response.newRoleTitle} to the ${department.name} department`)
          console.log("\n");
          promptUser();
        });
      });
    }
  });
}

// new Employee
function addEmployee() {
  
  connection.query("SELECT * FROM role", (error, listOfRoles) => {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      // create an array of the role titles
      const roleTitles = listOfRoles.map((role) => role.title);

      inquirer.prompt([
        // prompt user for employee first name
        {
          type: "input",
          message: "Enter the employee's first name",
          name: "employeeFirst"
        },
        // prompt user for employee last name
        {
          type: "input",
          message: "Enter the employee's last name",
          name: "employeeLast"
        },
        // prompt user for employee title
        {
          type: "list",
          message: "What is the title for this employee?",
          choices: roleTitles,
          name: "employeeRole",
        },
      ]).then((response) => {
        //find role that matches user's title choice
        const role = listOfRoles.find((role) => role.title == response.employeeRole);
        // Iadd employee into employee table
        connection.query(`insert into employee set ?`, { first_name: response.employeeFirst, last_name: response.employeeLast, role_id: role.id }, (error, results) => {
          console.log("\n");
          console.log(`Added ${response.employeeFirst} ${response.employeeLast} to the database`)
          console.log("\n");
          promptUser();
        });
      });
    }
  });
}

function updateRole() {
  connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role_id, role.title, department.name AS department FROM employee	
                      inner join role on role.id = employee.role_id 
                      inner join department on department.id = role.department_id;`, function (error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      // show results for user
      console.table(results);

      inquirer.prompt([
        {
          type: "input",
          message: "Enter id number for the employee you would like to update.",
          name: "employeeID"
        },
        {
          type: "input",
          message: "Enter role_id number for the employee's NEW role",
          name: "roleID"
        },
      ]).then((response) => {
        connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [response.roleID, response.employeeID], function (error, results) {
          if (error) {
            console.log(error);
            connection.end();
          } else {
            console.log("\n");
            console.log("The employee role has been updated");
            console.log("\n");
            promptUser();
          }
        })
      })
    }
  });
}

function updateEmployeeManager() {
  connection.query(`select employee.id, employee.first_name, employee.last_name, role_id, role.title, department.name AS department FROM employee	
                      inner join role ON role.id = employee.role_id 
                      inner join department on department.id = role.department_id;`, function (error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      // showvresults for user
      console.table(results);

      inquirer.prompt([
        {
          type: "input",
          message: "Enter id number for the employee you would like to update.",
          name: "employeeID"
        },
        {
          type: "input",
          message: "Enter role_id number for the employee's new role",
          name: "roleID"
        },
      ]).then((response) => {
        connection.query(`update employee set role_id = ? where id = ?`, [response.roleID, response.employeeID], function (error, results) {
          if (error) {
            console.log(error);
            connection.end();
          } else {
            console.log("\n");
            console.log("The employee role has been updated");
            console.log("\n");
            promptUser();
          }
        })
      })
    }
  });

}

// delete Employee
function deleteEmployee() {
  // 
  connection.query(`SELECT employee.id, employee.first_name, employee.last_name FROM employee`, function (error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      // show results for user
      console.table(results);

      inquirer.prompt([
        // prompt user for ID number of employee to delete
        {
          type: "input",
          message: "Enter id number for the employee you would like to delete.",
          name: "employeeID"
        },
      ]).then((response) => {
        // remover employee FROM employee table
        connection.query(`DELETE FROM employee WHERE ?`, { id: response.employeeID }, function (error, results) {
          if (error) {
            console.log(error);
            connection.end();
          } else {
            console.log("\n");
            console.log(`Deleted employee from the database`);
            console.log("\n");
            promptUser();
          }
        })
      })
    }
  });
}



