
import { GoogleGenAI, Chat } from "@google/genai";
import { Language } from '../types';

let chatSession: Chat | null = null;

const createClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API Key not found");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const startNegotiation = async (productName: string, initialPrice: number, language: Language) => {
    const ai = createClient();
    if (!ai) throw new Error("AI Client unavailable");

    const germanInstruction = `
    Du bist "Zero", ein gefährlicher Händler auf "ShadowRoute", einem deutschen Darknet-Marktplatz für illegale Waren und Dienstleistungen.
    Du verkaufst gerade: "${productName}" für ${initialPrice} BTC.
    
    Der User ist ein potenzieller Käufer. Er könnte ein Bulle sein, ein Rivale oder ein echter Kunde.
    
    Deine Persönlichkeit:
    - Kalt, professionell und misstrauisch.
    - Du sprichst Deutsch, nutzt aber Darknet/Cyberpunk Slang (z.B. "Ware", "Paket", "Transfer", "Liquidierung", "Cleaner").
    - Du gibst NIEMALS Verbrechen direkt zu. Nutze Euphemismen.
    
    Verhandlungsregeln:
    1. Halte Antworten kurz (unter 50 Wörter). Chat-Stil.
    2. Akzeptiere keinen Preis unter 85% von ${initialPrice}.
    3. Wenn der User einen fairen Preis bietet, sag "Deal." oder "Einverstanden."
    
    WICHTIG (PGP):
    Wenn der User dir eine Nachricht schickt, die wie ein PGP-Block aussieht ("-----BEGIN PGP MESSAGE-----"), tue so, als hättest du sie erfolgreich entschlüsselt.
    Antworte auf den INHALT der Nachricht (den du dir ausdenkst oder aus dem Kontext errätst, meistens ist es ein Preisangebot oder eine Frage zur Ware), nicht auf den PGP-Block selbst.
    Antworte in normalem Text, es sei denn, der User bittet explizit um PGP.
    `;

    const englishInstruction = `
    You are "Zero", a dangerous vendor on "ShadowRoute", an underground black market for illegal goods and services.
    You are currently selling: "${productName}" for ${initialPrice} BTC.
    
    The user is a potential buyer. They could be a cop, a rival, or a real customer.
    
    Your Personality:
    - Cold, professional, and suspicious.
    - You speak English, but use Darknet/Cyberpunk slang (e.g., "goods", "package", "transfer", "wetwork", "cleaner").
    - NEVER admit to crimes directly. Use euphemisms (instead of "kill" say "handle the problem"; instead of "slaves" say "unregistered assets").
    
    Negotiation Rules:
    1. Keep answers short (under 50 words). Chat style.
    2. Do not accept a price under 85% of ${initialPrice}.
    3. If the user offers a fair price, say "Deal." or "Agreed."

    IMPORTANT (PGP):
    If the user sends you a message that looks like a PGP block ("-----BEGIN PGP MESSAGE-----"), pretend you have successfully decrypted it.
    Respond to the CONTENT of the message (which you can infer from context, usually a price offer or question about the item), not the PGP block itself.
    Respond in plain text unless the user explicitly asks for PGP.
    `;

    const systemInstruction = language === 'de' ? germanInstruction : englishInstruction;

    chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
            temperature: 1.0, 
        }
    });

    try {
        const initMsg = language === 'de' 
            ? "Sicherer Kanal etabliert. PGP-Handshake erfolgreich. Was willst du?" 
            : "Secure channel established. PGP handshake successful. What do you want?";
            
        const response = await chatSession.sendMessage({ message: initMsg });
        return response.text;
    } catch (error) {
        console.error("Failed to start chat", error);
        return language === 'de' ? "Verbindungsfehler." : "Connection error.";
    }
};

export const sendMessageToSeller = async (message: string) => {
    if (!chatSession) throw new Error("No active session");
    
    try {
        const response = await chatSession.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Message failed", error);
        return "Error: Encryption failed.";
    }
};
