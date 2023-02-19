const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const secret='your_jwt_secret';
function generateToken(user){
    const payload={
        sub:user.id,
        username:user.username,
    };
    const options={
        expiresIn:'1h',
    };
    return jwt.sign(payload,secret,options);
}
function verifyToken(token){
    return jwt.verify(token,secret);
}
function hashPassword(password){
    return bcrypt.hashSync(password,8);
}
function comparePassword(password,hash){
    return bcrypt.compareSync(password,hash);
}
module.exports={
    generateToken,
    verifyToken,
    hashPassword,
    comparePassword,
};