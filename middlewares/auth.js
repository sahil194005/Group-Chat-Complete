const jwt = require('jsonwebtoken');
async function authorization (req,res,next){
    try {
        
        let token =req.header('authorization');
        let {userId,userName} = await  jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId = userId;
        req.body.userName = userName;
          next();
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = authorization;