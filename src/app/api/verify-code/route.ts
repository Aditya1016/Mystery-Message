import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(req: Request) {
    await dbConnect()

    try {
        const { username, code } = await req.json()

        const decodedUsername = decodeURIComponent(username)

        const result = verifySchema.safeParse({
            username,
            code
        })

        if (!result.success) {
            return Response.json({
                success: false,
                message: "Invalid username or code"
            },
                {
                    status: 400
                }
            )
        }

        const user = await UserModel.findOne({
            username: decodedUsername
        })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                {
                    status: 404
                }
            )
        }

        const isCodeValid = user.verifyCode === code

        if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "Invalid code"
            },
                {
                    status: 400
                }
            )
        }

        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Code has expired"
            },
                {
                    status: 400
                }
            )
        }

        user.isVerified = true
        await user.save()

        return Response.json({
            success: true,
            message: "Code verified successfully"
        }, {
            status: 200
        })

    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: "Error verifying code"
        },
            {
                status: 500
            }
        )
    }
}
