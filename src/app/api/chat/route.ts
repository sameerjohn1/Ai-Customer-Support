import connectedDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        const {message,ownerId}=await req.json();
        if(!message || !ownerId){
            return NextResponse.json(JSON.stringify({message:"Message and ownerId are required"}),{status:400})
        }


        await connectedDb()

        const settings=await Settings.findOne({ownerId})
        if(!settings){
            return NextResponse.json(JSON.stringify({message:"Chatbot is not configured yet"}),{status:400})
        }

        const KNOWLEDGE=`
        business name- ${settings.businessName || 'not provided'}
        support email- ${settings.supportEmail || 'not provided'}
        knowledge- ${settings.knowledge || 'not provided'}
        `

        const prompt=`
        Your are a professional customer support assistant for this business.
        
        Use ONLY the information provided below to answer the customer's question.
        You may rephrase, summarize, or interpret the information if needed.
        Do NOT invent new policies, prices, or promises.
        
        If the customer's question is completely unrelated to the information,
        or cannot be reasonably answered from it, reply exactly with:
        "Please contact support."
        
        --------------------
        BUSINESS INFORMATION
        --------------------
        ${KNOWLEDGE}

        --------------------
        CUSTOMER QUESTION
        --------------------
        ${message}

        --------------------
        ANSWER
        --------------------
        `;

        const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

          const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const response= NextResponse.json(res.text)
  response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
    
    } catch (error) {
const response= NextResponse.json({ message: `Chat error ${error}` }, { status: 500 });
  response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;

    }
}

export  const OPTIONS=async()=>{
    return NextResponse.json(null,{
    status:201,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    }    
    })

}