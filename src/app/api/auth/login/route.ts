import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { loginSchema } from "@/lib/validations"
import { signToken } from "@/lib/auth"
import { ZodError } from "zod"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const validatedData = loginSchema.parse(body)
        const { email, password } = validatedData

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            )
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            )
        }

        const token = signToken({
            userId: user.id,
            email: user.email,
            name: user.name || "",
        })

        const response = NextResponse.json(
            {
                message: "Login successful",
                user: { id: user.id, email: user.email, name: user.name },
            },
            { status: 200 }
        )

        response.cookies.set({
            name: "auth-token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        })

        return response
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: error.issues,
                },
                { status: 400 }
            )
        }
        console.error("Login error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
