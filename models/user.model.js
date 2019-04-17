const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");


//email length check
let emailLengthChecker = (email) => {
	if(!email){
		return false;
	}else{
		if(email.length<5){
			return false;
		}else{
			return true;
		}
	}
}

let validEmailChecker = (email) => {
	if(!email){
		return false;
	}else{
		const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
		return regExp.test(email);
	}
}


const emailValidators = [
	{
		validator: emailLengthChecker, message: "Email must be atleast 5 character long"
	},
	{
		validator: validEmailChecker, message: "Email is not valid"
	}
];

//email length check
let userLengthChecker = (name) => {
	if(!name){
		return false;
	}else{
		if(name.length<3 || name.length>15){
			return false;
		}else{
			return true;
		}
	}
}

let validUserName = (name) => {
	if(!name){
		return false;
	}else{
		const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
		return regExp.test(name);
	}
}

const nameValidators = [
	{
		validator: userLengthChecker, message: "Name must be atleast 3 character and max 15 character long"
	},
	{
		validator: validUserName, message: "Name is not valid"
	}
];


let passwordLengthValidator = (password) => {
	if(!password)
	{
		return false;
	}else{
		if(password.length<5 || password.length>20){
			return false
		}else{
			return true;
		}
	}
}

const passwordValidators = [
	{
		validator: passwordLengthValidator, message: "password must be atleast 5 character and max 20 characters long"
	}
];


//defining schema for user with different fields and its types
const userSchema = new Schema({
	email: { type:String, required:true, unique:true, lowercase:true, validate: emailValidators },
	name: { type:String, required:true, validate: nameValidators },
	password: { type:String, required:true, validate: passwordValidators }
});


//hashing password before saving user
userSchema.pre("save", function(next){
	if(!this.isModified("password"))
		return next();

	bcrypt.hash(this.password, null, null, (err, hash) => {
		if(err) return next(err);
		this.password = hash;
		return next();
	});
});

//comparing user password on login
userSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password, this.password);
}




module.exports = mongoose.model('User', userSchema);