import { NextRequest, NextResponse} from 'next/server';

const CAT_API_URL = process.env.CAT_API_URL;
const CAT_API_KEY = process.env.CAT_API_KEY;

export async function GET(
    request: NextRequest,
    {params}: {params: {id: string}}
){
    const {id} = params;

    if(!id || id.trim() === ""){
        return NextResponse.json(
            {success: false, message: "ID invalido"},
            {status: 400}
        );
    }

    try{
        const response = await fetch(`${CAT_API_URL}/images/${id}`, {
            headers: {"x-api-key": CAT_API_KEY ?? ""},
        });

    if(response.status === 404){
        return NextResponse.json(
            {success: false, message: `gato con ID "${id}" no encontrado`},
            {status: 404}
        );
    }

if (!response.ok) {
      throw new Error(`TheCatAPI error: ${response.status}`);
    }

    const cat = await response.json();

    return NextResponse.json({ success: true, cat });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
