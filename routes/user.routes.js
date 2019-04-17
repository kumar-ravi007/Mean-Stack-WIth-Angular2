const UsersController = require("../controllers/users.controller");


module.exports = (router) => {

	//register user
	router.post('/register', UsersController.registerUser);

	//check user email
	router.get('/checkUserEmail/:email', UsersController.checkUserEmail);

	//login user
	router.post('/login', UsersController.loginUser);


	return router;
}