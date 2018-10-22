const express = require('express');
const app = new express();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');


app.use(express.static(__dirname+'/client/dist/'));


mongoose.Promise = global.Promise;
mongoose.connect(config.uri,{ useNewUrlParser: true},(err)=>{
	if(err){
		console.log("Could not connect to database."+ err);
	}else{
		console.log("Connected to batabase "+ config.db);
	}
});


app.get('*',(req,res)=>{
	res.sendFile(path.join(__dirname + '/client/dist/index.html'));
})

app.listen(8080,()=>{
	console.log("listening 8080 port");
})