declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}

declare module '@google/genai' {
  export class GoogleGenAI {
    constructor(config: { apiKey: string });
    chats: {
      create(config: { model: string; config?: any }): Chat;
    };
  }

  export interface Chat {
    sendMessage(params: { message: string }): Promise<GenerateContentResponse>;
  }

  export interface GenerateContentResponse {
    text: string;
  }
}