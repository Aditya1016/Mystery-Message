import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";
import { Message } from "@/model/user.models";
import {messageSchema} from "@/schemas/messageSchema";

export async function POST(req: Request) {
    await dbConnect();
    const {username, content} = await req.json();

    const result = messageSchema.safeParse({username, content});

    if(!result.success){
        return Response.json({
            success: false,
            message: "Invalid username or content"
        },{
            status: 400
        })
    }

    try {
        const user = await UserModel.findOne({
            username
        });
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },
            {
                status: 404
            }
        )
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            },{
                status: 400
            }
        )
        }

        const newMessage = {
            content,
            createdAt: new Date()
        }

        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message: "Message sent successfully"
        },{
            status: 200
        })
    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Error sending message"
        },
        {
            status: 500
        }
        )
    }
}