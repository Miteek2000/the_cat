import { NextRequest, NextResponse } from "next/server";

const CAT_API_URL = process.env.CAT_API_URL;
const CAT_API_KEY = process.env.CAT_API_KEY;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit    = searchParams.get("limit") ?? "12";
        const breedIds = searchParams.get("breed_ids");

        if (!breedIds) {
            return NextResponse.json(
                { success: false, message: "El parámetro breed_ids es requerido" },
                { status: 400 }
            );
        }

        const query = new URLSearchParams({ limit, breed_ids: breedIds });

        const response = await fetch(
            `${CAT_API_URL}/images/search?${query.toString()}`,
            {
                headers: { "x-api-key": CAT_API_KEY ?? "" },
                next: { revalidate: 60 },
            }
        );

        if (!response.ok) {
            throw new Error(`TheCatAPI error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            breed: breedIds,
            count: data.length,
            cats: data,
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Error al conectar con TheCatAPI" },
            { status: 500 }
        );
    }
}
