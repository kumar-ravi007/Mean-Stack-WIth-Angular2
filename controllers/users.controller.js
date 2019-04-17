const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/database");


exports.registerUser = function(req, res) {

		//initialize user model
		if(!req.body.email){

			res.json({ status: false, message: "Email is required"});

		}else if(!req.body.name){

			res.json({ status: false, message: "User name is required"});			

		}else if(!req.body.password){

			res.json({ status: false, message: "Password is required"});			
			
		}else{

			const user = new User;
			user.email = req.body.email.toLowerCase();
			user.name =  req.body.name;
			user.password = req.body.password	
			user.save((err) => {
				if(err){
					if(err.code == 11000){
						res.json( { status: false, message:"Email already exist." });						
					}else{
						if(err.errors){
							if(err.errors.email){
								res.json( { status: false, message: err.errors.email.message });							
							}else{
								if(err.errors.name){
									res.json( { status: false, message: err.errors.name.message });								
								} else {		
									if(err.errors.password){
										res.json( { status: false, message: err.errors.password.message });	
									}else{
										res.json( { status: false, message:" User not saved "+ err });
									}

								}
							}	
						}
						else{
							res.json( { status: false, message:" User not saved "+ err });	
						}						
					}
				}else{
					res.json( { status: true, message:" User registered successfully" });
				}
			})
		}

		


}


exports.checkUserEmail = function(req, res){	
	if(!req.params.email){
		res.json({ status: false, message: "Email was not provided"});
	}else{
		User.findOne( { email: req.params.email }, (err, user) => {
			if(err){
				res.json({ status: false, message: err });
			}else{
				if(user){
					res.json({ status: false, message: "Email is already taken!"});
				}else{
					res.json({ status: true, message: "Email is available."});
				}
				
			}
		});
	}
}


exports.loginUser = function(req, res){
	if(!req.body.email){
		res.json({ status: false, message: "Email not provided" });
	}else{
		if(!req.body.password){
			res.json({ status: false, message: "Password not provided" });
		}else{
			User.findOne( { email: req.body.email }, (err, user) => {
				if(err){
					res.json({ status: false, message: err });
				}else{
					console.log(user);
					if(!user){
						res.json({ status: false, message: "User not found" });
					}else{
						const validatePasssword = user.comparePassword(req.body.password);
						if(!validatePasssword){
							res.json({ status: false, message: "Password not matched!" });
						}else{
							//setting jwt token with user info
							const token = jwt.sign({ userID: user._id }, config.secret, {expiresIn: "24h"});
							res.json( { status: true, message: "Login Successful!", token: token, user: { userName: user.name }});
						}
					}
				}
			});
		}
	}


}