import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req: Request) {
    await dbConnect();

    try {
        const {searchParams} = new URL(req.url)
        const queryParam = {
            username: searchParams.get("username")
        }

        const result = UsernameQuerySchema.safeParse(queryParam)

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json(
                {
                    success: false,
                    message: usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid username"
                },
                {
                    status: 400
                }
            )
        }

        const {username} = result.data

        const user = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(user){
            return Response.json(
                {
                    success: false,
                    message: "Username already exists"    
                },
                {
                    status: 400
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Username is unique"
            },
            {
                status: 200
            }
        )
    } catch (error: any) {
        console.error(error)
        return Response.json(
            {
                success: false,
                message: error
            },
            {
                status: 500
            }
        )
    }
}