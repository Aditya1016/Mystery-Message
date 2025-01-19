import dbConnect from "@/lib/dbConnect";
import { auth } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user.models";

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

    const userId = user._id;
    try {
        const fetchedUser = await UserModel.aggregate([
            {
                $match: {
                    id: userId
                }
            },
            {
                $unwind: "$messages"
            },
            {
                $sort: {
                    'messages.createdAt': -1
                }
            },
            {
                $group: {
                    _id: '$_id',
                    messages: {
                        $push: '$messages'
                    }
                }
            }
        ])

        if (!fetchedUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            }
            )
        }

        return Response.json({
                success: true,
                message: "Fetched successfully"
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