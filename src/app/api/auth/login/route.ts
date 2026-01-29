import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { loginSchema } from "@/lib/validations"
import { ZodError } from "zod"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate request body with Zod
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

        return NextResponse.json(
            {
                message: "Login successful",
                user: { id: user.id, email: user.email, name: user.name },
            },
            { status: 200 }
        )
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
