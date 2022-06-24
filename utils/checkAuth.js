import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
}