import connectedDb from "@/lib/db"
import Settings from "@/model/settings.model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest){
    try {
        const {ownerId}=await req.json()
        if(!ownerId){
            return NextResponse.json({message:"ownerId is required"},{status:400})
        }
        await connectedDb()
        const settings=await Settings.findOne({ownerId})
        return NextResponse.json({message:"Settings fetched successfully",settings},{status:200})
    } catch (error) {
          return NextResponse.json({message:`Get Settings Error ${error}`},{status:500})
    }
}