import { NextRequest,NextResponse } from "next/server";
import { db,userTable } from "@/utils/drizzle";
import { eq } from "drizzle-orm";


export async function GET(request:NextRequest){
    try{
        const data = await db.select().from(userTable)
        return NextResponse.json({data:data})
    }catch(error){
        return NextResponse.json({error:(error as {message:string}).message})
    }
}

export async function POST(request:NextRequest) {
    const {name,email,city} = await request.json();

    if(!name || !email || !city)
    {
        return NextResponse.json({data:"Email is missing",status:false})
    }
    try{
        if(name || email || city){
            const data = await db.select().from(userTable).where(eq(userTable.email,email))
            if(data.length){
                return NextResponse.json({data:"Email already exists",status:'exists'})
            }
            else{
                const newUser = await db.insert(userTable).values({name,email,city})
                if (newUser){
                    return NextResponse.json({data:"User added to database",status:true})
                }
            }
        }
    }catch(error){
        return NextResponse.json({error:(error as {message:string}).message})
    }

}

export async function PATCH(request:NextRequest){
    const {id,field,value} = await request.json();
    try{
        if(!id || !field || !value){
            return NextResponse.json({'message':"Fields are missing"})
        }

        if(field === 'name'){
            const data = await db.update(userTable).set({name:value}).where(eq(userTable.id,id));
        }
        else if(field === 'email'){
            const data = await db.update(userTable).set({email:value}).where(eq(userTable.id,id));
        }
        else if(field === 'city'){
            const data = await db.update(userTable).set({city:value}).where(eq(userTable.id,id));
        }
        return NextResponse.json({data:`User ${field} updated`,status:'updated'});

    }catch(error){
        return NextResponse.json({error:(error as {message:string}).message})
    }
}

export async function DELETE(request:NextRequest){
    const data = request.nextUrl;
    const string_id = data.searchParams.get('id')
    const id = Number(string_id);
    try{
        if(!id){
            return NextResponse.json({message:"Id is missing"})
        }

        const data = await db.delete(userTable).where(eq(userTable.id,id)).returning();
        return NextResponse.json({message:"User deleted",status:"deleted"})
    }catch(error){
        return NextResponse.json({error:(error as {message:string}).message})
    }
    
}