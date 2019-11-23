const fs = require("fs")
const axios = require("axios")
const inquirer = require("inquirer")

// let command = process.argv[2]
// let search = process.argv.slice(3);

function runProgram() {

    inquirer
    .prompt([
        {
            type: "list",
            message: "What would you like search for?",
            choices: [
                "show",
                "actor",
            ],
            name: "command"
        },
        {
            input: "input",
            message: "Please enter your query",
            name: "query"
        }
    ]).then(function(data) {

        console.log(data)

        switch (data.command) {

            case "show":
                getShow(data.query)
                break;
            case "actor":
                getActor(data.query)
                break;
        }
    })
}

function getShow(show) {
    console.log("the getshow function is connected")
      
    let query = show
    if (query === "") query = "Heroes"

    let divider = "\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--\n\n"

    axios
        .get("http://api.tvmaze.com/singlesearch/shows?q=" + query)
        .then(function(data) {
            let showData = data.data

            console.log("-=-=-=-=-=-=-=-=-=-=-=-")
            console.log(`Show Name: ${showData.name}`)
            console.log("")
            console.log(`Genre: ${showData.genres}`)
            console.log("")
            console.log(`Rating: ${showData.rating.average}`)
            console.log("")
            console.log(`Network: ${showData.network.name}`)
            console.log("")
            console.log(`Summary: ${showData.summary}`)

            console.log("")

            fs.appendFile("log.txt", showData.name + "\n" + showData.genres + "\n" + showData.rating.average + "\n" + showData.network.name + "\n" + showData.summary + divider, function(err) {
                if (err) throw err;
            })
        restart()
        }).catch(function(error) {
            console.log("Error — Please try again")
            restart()
        })

}

function getActor(actor) {
    console.log("the getActor function is connected")    
    
    let query = actor
    if (query === "") query = "masi+oka"

    axios
        .get("http://api.tvmaze.com/search/people?q=" + query)
        .then(function(data) {

            let actorData = data.data[0].person

            let divider = "\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--\n\n"

            console.log(actorData)
            console.log(
            `-=-=-=-=-=-=-=-=-=-=-=-
            Name: ${actorData.name}
            
            Birthday: ${actorData.birthday}
            
            Gender: ${actorData.gender}
            
            Country: ${actorData.country.name}
            
            URL: ${actorData.url}`            
            )

            console.log("") 
        fs.appendFile("log.txt", actorData.name + "\n" + actorData.birthday + "\n" + actorData.gender + "\n" + actorData.country.name + "\n" + actorData.url + divider, function(err) {
            if (err) throw err;
            });
        restart()
        }).catch(function(error) {
            console.log("Error — Please try again")
            restart()
        })
}

function restart() {
    console.log("*************************************")  
    inquirer
        .prompt([
          {
            type: "confirm",
            message: "Would you like to do another search?",
            name: "confirm",
            default: true
          }
        ])
        .then(function(response) {
          if (response.confirm) {
            runProgram()
          }
        })
}


runProgram()