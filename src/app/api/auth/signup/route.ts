import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signupSchema } from "@/lib/validations"
import { ZodError } from "zod"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate request body with Zod
        const validatedData = signupSchema.parse(body)
        const { email, password, name } = validatedData

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })

        return NextResponse.json(
            {
                message: "User created successfully",
                user: { id: user.id, email: user.email, name: user.name },
            },
            { status: 201 }
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
        console.error("Signup error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
