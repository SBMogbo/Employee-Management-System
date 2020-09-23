
var fs=require("fs");
const inquirer=require("inquirer");
const { async } = require("rxjs");
const util=require("util");
const generateMarkdown=require("./utils/generateMarkdown")
const writeFileAsync=util.promisify(fs.writeFile);


inquirer.prompt([
  // array of questions for user
  {
    type: "input",
    message: "What is your Full Name?",
    name: "FullName"
    //Enter Full Name
  },
  {
    type: "input",
    message: "What year is it?",
    name: "year"
    //Enter Full year
  },
  {
    type: "input",
    message: "What is your email address?",
    name: "email"
    //Enter Full email
  },
  {
    type: "input",
    message: "What is your Github username?",
    name: "Github"
    //Enter Github username

  },
  {
    type: "input",
    message: "What is your Github profile link?",
    name: "link"
    //Enter profile link
  },
 
  {
    //Enter project name
    type: "input",
    message: "What is your project's name",
    name: "projectName"
  },
  {
    //Enter project description
    type: "input",
    message: "What is your project description",
    name: "description"
  },
  {
    //Enter project install info
    type: "input",
    message: "What is your project installation infomation",
    name: "installation"
  },
  {
    //Enter project usage
    type: "input",
    message: "How do you use your project ",
    name: "usage"
  },
  {
    //Enter project license
    type: "input",
    message: "What kind of license should your project have",
    name: "license"
  },
 
  {
    //Enter project contributors
    type: "input",
    message: "What does the user need to know about contributing to the repo ",
    name: "contributing"
  },
  {
    //Enter project test details
    type: "input",
    message: "What kind of test should be done",
    name: "test"
  },

]).then(function (response) {
  fs = require('fs');
  const markDown=generateMarkdown(response)
  fs.writeFile("./README.md", markDown, function (err) {
    if (err) {
      console.log("Error:", error);
    } else {
      console.log("saved new readme!");
    }
    if (err) {
      throw err;
    }
    
  });
  
  
  
});


