import {z} from "zod"

export const messageSchema = z.object({
    username: z.string().min(2, "Username must be at least 2 characters").max(20, "Username must be at most 20 characters"),
    content: z
        .string()
        .min(1, "Message must be at least 1 character")
        .max(1000, "Message must be at most 1000 characters")
})