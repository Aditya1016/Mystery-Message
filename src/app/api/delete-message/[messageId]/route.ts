import dbConnect from "@/lib/dbConnect";
import { auth } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/user.models";

export async function DELETE(req: Request, {params}: {params: {messageId: string}}) {
    const messageId = params.messageId

    if (!messageId) {
        return Response.json({
            success: false,
            message: "Message id not found"
        }, {
            status: 404
        })
    }

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

    try {
        const updateResult = await UserModel.updateOne({
            _id: user._id,
        },
        {
            $pull: {
                messages: {
                    _id:  messageId
                }
            }
        })

        if(updateResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found"
            }, {
                status: 404
            })
        }

        return Response.json({
                success: true,
                message: "Message deleted"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: error
        }, {
            status: 500
        })
    }
}