import OpenAI from "openai";
import { config } from "../config/config";

const createOpenAI = () => {
    return new OpenAI({
        apiKey: config.OPENAI_API_KEY,
        organization: config.OPENAI_ORGANIZATION_ID
    });
};

export default {
    createOpenAI
};