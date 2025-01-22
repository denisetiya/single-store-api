import isError from '../../utils/error.handler';
import jwt from 'jsonwebtoken';
import { iUser } from '../../types/auth';
import prisma from '../../config/prisma.config';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export default class AuthService {
    static async createNewUser (userData : iUser) {
        try {
            const newUser = await prisma.user.create({
                data: {
                    email: userData.email,
                    password: await bcrypt.hash(userData.password, 10),
                    userDetails : {
                        create : {
                            username: userData.userDetail.username,
                            fullName: userData.userDetail.fullName,
                            phoneNumber: userData.userDetail.phoneNumber,
                            profileImage: userData.userDetail.profileImage
                        }
                    }
                }, include: {
                    userDetails: true
                }
            })

            return {
                status: 200,
                message : "succes",
                data :newUser
            }
        } catch (error : unknown) {
            console.log(error)
            isError(error)
        }
    }

    static async loginUser (email : string, password : string) {
        try {
            const validUser = await prisma.user.findUnique({
                where: {
                    email: email
                }, include: {
                    userDetails: true
                }
            })

            if (!validUser) {
                return {
                    status: 401,
                    message: "Your email or password is incorrect"
                }
            } else {
                const validPassword = await bcrypt.compare(password, validUser.password)
                if (!validPassword) {
                    return {
                        status: 401,
                        message: "Your email or password is incorrect"
                    }
                } else {
                    const tokens = await generateTokens(validUser.id, validUser.email)

                    if (!tokens.refresh) {
                        return {
                            status: 401,
                            message: "Your email or password is incorrect"
                        }
                    } else {
                        await prisma.token.upsert({
                            where: { userId: validUser.id },
                            update: { refreshToken: tokens.refresh },
                            create: { userId: validUser.id, refreshToken: tokens.refresh }
                        })
                    }

                    return {
                        status: 200,
                        message: "success",
                        data : validUser,
                        meta : tokens
                    }
                }
            }
        } catch (error: unknown) {
            isError(error)
        }
    }
}


const generateTokens = async (userId: string, email: string) => {
    try {
        // Generate access and refresh tokens
        const accessToken = jwt.sign({ id: userId, email }, ACCESS_TOKEN_SECRET, { expiresIn: "3h" });
        const refreshToken = jwt.sign({ id: userId, email }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        // Check if the user exists in the database
        const user = await prisma.user.findUnique({ where: { id: userId } });

        // If user doesn't exist, create a new user and store refreshToken
        if (!user) {
            return {
                message : "User not found"
            };
        }

        return {
            access : accessToken, 
            refresh : refreshToken
         };

    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new Error("Error generating tokens");
    }
};
