import api from "./api-communicator";

const sendMessageAdapter = (message: string) => {
    return api.post("/chat/new", { message });
};

const getAllChatsAdapter = () => {
    return api.get("/chat/all-chats");
};

export default {
    sendMessageAdapter,
    getAllChatsAdapter
};
