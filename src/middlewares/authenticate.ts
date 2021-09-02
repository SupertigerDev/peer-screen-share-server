import { NextFunction, Request, Response } from "express";
import users from "../database/users";
import jwt from 'jsonwebtoken';

interface AuthArgs {
    createUser?: boolean
}

export default (options: AuthArgs) => (req: Request, res: Response, next: NextFunction) => {

    const token: string | undefined = req.headers.authorization?.trim();
    const username: string | undefined = req.body.username?.trim();

    if (!token && !username && options.createUser) {
        return res.status(403).send("Username or token is missing!")
    }
    if (!token && !options.createUser) {
        return res.status(403).send("Token is missing!")
    }

    if (options.createUser && username && !token) {
        createUserAndToken(username, req);
        return next();
    }
    if (token) {
        const goNext = checkToken(token, username, req, res, options)
        if (goNext) next()
    }
};


function createUserAndToken(username: string, req: Request) {
    const user = users.add({ name: username });
    req.token = jwt.sign(user.id, "JWT_SECRET_CHANGE_ME_PLS");
    req.user = user;
    return true;
}

function checkToken(token: string, username: string | undefined, req: Request, res: Response, options: AuthArgs) {
    let userId: string | undefined = undefined;
    try {
        userId = jwt.verify(token, "JWT_SECRET_CHANGE_ME_PLS") as string;
    } catch {
        userId = undefined;
    }
    if (userId) {
        req.user = users.get(userId);
    }
    if (!req.user && !username) {
        res.status(403).send("Invalid Token.")
        return false;
    }
    if (!req.user && username) {
        if (!options.createUser) {
            res.status(403).send("Invalid Token.")
            return false;
        }
        return createUserAndToken(username, req);
    }
    return true;
}


