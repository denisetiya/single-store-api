import  { Router,Request, Response } from "express";
import response from "../../utils/response.api";
import admin from "../../config/firbase-admin.conf";
import AuthService from "./auth.service";
import { iLogin, loginSchema, UserSchema } from "../../types/auth";
import { iUser } from "../../types/auth";
import handleValidationError from "../../utils/validation.handler";

const auth: Router = Router();

//  auth with firebase

// auth.post("/auth", async(req: Request, res: Response) => {
//     const tokenFirebase = req.headers.authorization;

//     if (!tokenFirebase) {
//         return response(res, 401, "Unauthorized", "Token not found");
//     }
//     const token = tokenFirebase?.split(" ")[1];
    
//     try {
//         const user = await admin.auth().verifyIdToken(token as string);
//         const tokens = await generateTokens(user.uid, user.email as string);

//         return response(res, 200, "Success",null, tokens);

//     } catch (error) {
//         return response(res, 401, "Unauthorized", error);
//     }



// });



auth.post("/auth/register", async(req: Request, res: Response) => {
    const userData : iUser = req.body;

    const validateData = UserSchema.safeParse(userData);

    if (!validateData.success) {
        return handleValidationError(validateData, res);
    }
    
    try {
        const result = await AuthService.createNewUser(userData);
    
        if (!result?.data) {
            return response(res , result?.status || 400, "error", result?.message);
        }
    
        return response(res, result.status, result.message, null, result.data, {
            guide : "next you need verfiy your email , chek your email and send code to /auth/verify/:email/:code"
        });
        
    } catch (error : any) {
        return response(res, error.status, error.message, 'failed login');
    }

})

auth.post('/auth/login', async(req: Request, res: Response) => {
    const userData: iLogin = req.body;

    const validateData = loginSchema.safeParse(userData);

    if (!validateData.success) {
        return handleValidationError(validateData, res);
    }
    
    try {
        const result = await AuthService.loginUser(userData.email, userData.password);
    
        if (!result?.data) {
            return response(res , result?.status || 400, "error", result?.message);
        } else {

            res.cookie('accessToken', result.meta.access, {
                httpOnly: true,
                maxAge: 3 * 60 * 60 * 1000,
                secure: true,               
            })
    
            res.cookie('refreshToken', result.meta.refresh, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: true,               
            })
            
            return response(res, 200, "Success" , null, result.data, result.meta);
        }
        


        
    } catch (error : any) {
        return response(res, error.status, error.message, error.errors);
    }



})

export default auth