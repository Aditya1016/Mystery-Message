import { auth } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/user.models"

export async function POST(req: Request) {
    await dbConnect()

    const session = await auth()

    if (!session) {
        return Response.json({
            success: false,
            message: "Session not found"
        }, {
            status: 404
        })
    }

    const user = session?.user

    if (!user) {
        return Response.json({
            success: false,
            message: "User not found"
        }, {
            status: 404
        })
    }

    const userId = user.id
    const { acceptMessages } = await req.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user"
            }, {
                status: 401
            })
        }

        return Response.json({
            success: true,
            message: "Messages acceptance status updated successfully",
            updatedUser
        },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: "Error while accepting messages"
        }, {
            status: 500
        })
    }

}

export async function GET() {
    await dbConnect()

    const session = await auth()

    if (!session) {
        return Response.json({
            success: false,
            message: "Session not found"
        }, {
            status: 404
        })
    }

    const user = session?.user

    if (!user) {
        return Response.json({
            success: false,
            message: "User not found"
        }, {
            status: 404
        })
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }

        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage
        },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: "Error while accepting messages"
        }, {
            status: 500
        })
    }
}