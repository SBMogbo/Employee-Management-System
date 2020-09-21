//dependicies
var mysql = require("mysql");
const inquirer=require("inquirer");

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
      //getArtistsByName();
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
    }else if (response.choice == options[6]) {
      //getSongByName();
    }else if (response.choice == options[7]) {
      connection.end();
    }
  })
}

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
connection.connect(function(err) {
  if (err) throw err;
  
  promptUser();

});