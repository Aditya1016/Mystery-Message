import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function generateOTP() {
    return crypto.randomInt(100000, 999999);
}
export async function POST(req: NextRequest){
    await dbConnect();

    try {
        const {username, email, password} = await req.json();

        const existingUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUserByUsername){
            return NextResponse.json({
                success: false,
                message: "Username already exists"
            }, {
                status: 400
            })
        }

        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = generateOTP().toString();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return NextResponse.json({
                    success: false,
                    message: "Email already exists"
                }, {
                    status: 400
                })
            }
            else {
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if(!emailResponse.success){
            return NextResponse.json({
                success: false,
                message: "Something went wrong while sending verification email"
            }, {
                status: 500
            })
        }

        return NextResponse.json({    
            success: true,
            message: "User registered successfully"
        }, {
            status: 200
        })

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while registering user"
            },
            {
                status: 500
            }
        )
    }

}