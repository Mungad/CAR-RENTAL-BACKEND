import jwt from "jsonwebtoken"
import "dotenv/config"
import { Request, Response, NextFunction } from "express";

// Impelementing a middleware to check user roles
export const checkRoles = (requiredRole: "admin" | "user" | "both") => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);  //jwt.verify returns the payload
            (req as any).user = decoded;

            // check for roles
            if (
                typeof decoded === "object" && // Ensure decoded is an object
                decoded !== null && //Ensure decoded is not null 
                "role" in decoded //Ensure the decoded token has a role property
            ) {
                if (requiredRole === "both") { // if the required role is both, then allow access to admin and user
                    if (decoded.role === "admin" || decoded.role === "user") { // if the decoded role is admin or user, then allow access
                        next(); //allowed access proceed to route handler
                        return;
                    }
                } 
                else if (decoded.role === requiredRole) { //executes if required role is not both i.e specifically admin or user
                    next();
                    return;
                }
                res.status(401).json({ message: "Unauthorized" });
                return;
            } else { //happens when the decoded token is not an object or does not have a role property
                res.status(401).json({ message: "Invalid Token Payload" })
                return
            }

        } catch (error) {
            res.status(401).json({ message: "Invalid Token" });
            return
        }

    }
}

export const adminRoleAuth = checkRoles("admin")
export const userRoleAuth = checkRoles("user")
export const bothRoleAuth = checkRoles("both")