const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

//express static used for folder/collection of files
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/e28305d45a"

    const options = {
        method: "POST",
        auth: "eric:59258ff5051db1089807aea654308a36-us14"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})


//if post fails, redirects users to root page
app.post("/failure", function(req, res) {
    res.redirect("/")
})

//process.env.PORT = dynamic port assigned by Heroku 
app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
})

//API Key
// 59258ff5051db1089807aea654308a36-us14

// List Id
// e28305d45a