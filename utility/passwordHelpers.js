const crypto = require("crypto");

module.exports.encryptPassword = (password) => {
    let salt = crypto.randomBytes(32).toString("hex");
    let hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString("hex");
    return {
        salt,
        hash
    }
}   

module.exports.validatePassword = (password, hash, salt) => {
    let inputtedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString("hex");
    return hash === inputtedHash; 
}   