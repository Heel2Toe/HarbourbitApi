import jwt from 'jsonwebtoken';

export const generateAccessToken = async (username) => {
    return jwt.sign({username},process.env.JWT_SECRET, {expiresIn: '300s'});
};

export const generateRefreshToken = async (username) => {
    return jwt.sign({username}, process.env.REFRESH_SECRET, {expiresIn: '7d'});
}

export const authorizeAccess = async (req, res, next) => {

    const accessToken = req.headers['x-access-token'];

    if(!accessToken) return res.status(401).send('No access token');
    
    try {
        jwt.verify(accessToken, process.env.JWT_SECRET);
        next();
    } 
    catch (error) {
        if(error.name == 'TokenExpiredError'){
            return res.status(401).send("Token Expired");
        }
        else{
            return res.status(401).send("Invalid Token");
        }
    }
}