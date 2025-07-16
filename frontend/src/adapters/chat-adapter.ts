import api from "./api-communicator";

const sendMessageAdapter = (message: string) => {
    return api.post("/chat/new", { message });
};

export default {
    sendMessageAdapter
};
