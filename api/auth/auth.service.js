const bcrypt = require('bcrypt');
const userService = require('../user/user.service');
const logger = require('../../services/logger.service');

const saltRounds = 10;

async function login(userName, password) {
    logger.debug(`auth.service - login with userName: ${userName}`);
    if (!userName || !password) throw new Error('userName and password are required!');

    const user = await userService.getByUserName(userName)
    if (!user) return Promise.reject('Invalid userName or password');
    const match = await bcrypt.compare(password, user.password);
    if (!match) return Promise.reject('Invalid userName or password');

    delete user.password;
    return user;
}

async function signup(user) {
    const userName = user.userName;
    logger.debug(`auth.service - signup with userName: ${userName}`);
    if (!userName || !user.password) return Promise.reject('username and password are required!');

    const userExist = await userService.getByUserName(userName);
    if (userExist) return Promise.reject('username already exist!');

    const hash = await bcrypt.hash(user.password, saltRounds);

    delete user.password;
    const userData = {
        ...user,
        password: hash
    };

    return userService.add(userData);
}

module.exports = {
    signup,
    login,
}