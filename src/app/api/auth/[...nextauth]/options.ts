import NextAuth from 'next-auth'
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                identifier: {
                    label: "Username/Email",
                    type: "text",
                },
                password:{
                    label: "Password",
                    type: "password"
                }
            },
            async authorize(credentials: any):Promise<any>{
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    console.log("User: ",user)

                    if(!user){
                        throw new Error("User not found")
                    }

                    if(!user.isVerified){
                        throw new Error("User is not verified")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(!isPasswordCorrect){
                        throw new Error("Password is incorrect")
                    }

                    return user 
                } catch (err: any) {
                    console.log(err)
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks:{
        async jwt({token, user}) {
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }
            console.log(user)
            return token
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }
            console.log(session)
            return session
        }
    },
    pages:{
        signIn: '/sign-in'
    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.AUTH_SECRET
})