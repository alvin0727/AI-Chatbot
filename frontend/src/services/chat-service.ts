import ChatAdapter from "../adapters/chat-adapter";

const sendMessage = async (message: string) => {
    try {
        const response = await ChatAdapter.sendMessageAdapter(message);
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}

const getAllChats = async () => {
    try {
        const response = await ChatAdapter.getAllChatsAdapter();
        return response.data;
    } catch (error) {
        console.error("Error fetching all chats:", error);
        throw error;
    }
}

const deleteAllChats = async () => {
    try {
        const response = await ChatAdapter.deleteAllChatsAdapter();
        return response.data;
    } catch (error) {
        console.error("Error deleting all chats:", error);
        throw error;
    }
}

export default {
    sendMessage,
    getAllChats,
    deleteAllChats
};