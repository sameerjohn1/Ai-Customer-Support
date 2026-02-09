import connectedDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        const {ownerId,businessName,supportEmail,knowledge}=await req.json()
        if(!ownerId){
            return NextResponse.json({message:"ownerId is required"},{status:400})
        }

        await connectedDb()
        const settings=await Settings.findOneAndUpdate(
            {ownerId},
            {businessName,supportEmail,knowledge},
            {new:true,upsert:true}
        )

        return NextResponse.json({message:"Settings updated successfully",settings},{status:200})
    } catch (error) {
          return NextResponse.json({message:`Settings Error ${error}`},{status:500})
    }
}


