import { Server as SocketIoServer } from 'socket.io';
import Message from './models/MessagesModal.js'

const setUpSoket = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true

        }
    })

    const userSoketMap = new Map()

    const disconnect = (socket) => {
        console.log(`Clint discon ${socket.id}`);
        for (const [userId, socketId] of userSoketMap.entries()) {
            if (socketId === socket.id) {
                userSoketMap.delete(userId)
                console.log(`Socket ID ${socket.id} removed from connected users.`);
                break;
            }
        }
    }

    const sendMessage = async (message) => {
        const senderSocketId = userSoketMap.get(message.sender)
        const recipientSocketId = userSoketMap.get(message.recipient)

        const createMessage = await Message.create(message)

        const messageData = await Message.findById(createMessage._id).populate("sender", "id email username image").populate("recipient", "id email username image")

        if(recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messageData)
            
        }
        if(senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData)

        }
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId

        if (userId) {
            userSoketMap.set(userId, socket.id)
            console.log(`user connected ${userId} with soket id ${socket.id}`);

        } else {
            console.log("user id not foind io");

        }

        socket.on("sendMessage", sendMessage)
        socket.on("disconnect", () => disconnect(socket))
    })
}

export default setUpSoket