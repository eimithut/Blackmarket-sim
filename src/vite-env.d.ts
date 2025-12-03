declare var process: {
  env: {
    API_KEY: string;
  }
};

declare module '@google/genai' {
  export class GoogleGenAI {
    constructor(config: { apiKey: string });
    chats: {
      create(config: any): Chat;
    };
  }

  export interface Chat {
    sendMessage(params: { message: string }): Promise<{ text: string }>;
  }
}