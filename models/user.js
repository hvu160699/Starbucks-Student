const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
	name: String,
	email: { type: String, unique: true },
	hashed_password: String,
	created_at: String,
	temp_password: String,
	temp_password_time: String
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('User', userSchema);        