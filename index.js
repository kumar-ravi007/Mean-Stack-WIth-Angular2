/*
Import Node Modules
*/
const express = require("express"); 
const app = new express(); //Initialise express
const router = express.Router();  //Initialise express router
const port = process.env.port || 8080; //Port number
const mongoose = require("mongoose"); //Tool for mongodb
const config = require("./config/database"); //Database config file
const path = require("path"); //NodeJS package for file paths
const bodyParser = require("body-parser"); //initialising for parsing post requests body data
const cors = require("cors");
//Import Routes
const userRoutes = require("./routes/user.routes")(router);

//enabling cross origin request
app.use( cors({
	origin: "http://localhost:4200"
}));

//making connection with mongoose database
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, { useNewUrlParser:true }, (err)=> {
	if(err)
		console.log("Not connected to database: "+ err);
	else
		console.log("Successfully connected to database: "+ config.db);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//use routes
app.use("/api", userRoutes);

//providing static path to frontend folder
app.use(express.static(__dirname+"/client/dist"));
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname+"/client/dist/index.html"));
});




//listen on port
app.listen(port, () => {
	console.log("Listening on port: " + port);
});