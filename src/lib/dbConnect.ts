import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('Using existing connection')
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '', {})
        console.log('Using new connection')
        connection.isConnected = db.connections[0].readyState

    } catch (error) {
        console.log(error)
        throw new Error("Error connecting to database")
    }
}

export default dbConnect