import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest){

    const {pathname} = request.nextUrl

    if (!pathname.startsWith("/api")){
        return NextResponse.next();
    }

const origin = request.headers.get("origin") ?? "";
const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? "").split(",");

    if (origin && !allowedOrigins.includes(origin)){
        return NextResponse.json(
            { success: false, message: "Origen no permitido" },
            { status: 403 }
        );
    }

const apiKey = request.headers.get("x-secret-key");

    if(apiKey !== process.env.API_SECRET_KEY){
        return NextResponse.json(
            {success: false, message: "API key invalida"},
            {status: 401}
        );
    }

const response = NextResponse.next();
response.headers.set("X-API-Version", "1.0");
response.headers.set("X-Powered-By", "The Cat");
return response;
}

export const config = {
    matcher: "/api/:path*",
}