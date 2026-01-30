import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Name is required").optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>

export const joinMeetingSchema = z.object({
    meetLink: z
        .string()
        .regex(
            /^https?:\/\/(meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}|meet\.google\.com\/[a-z0-9-]+)$/,
            "Invalid Google Meet URL"
        ),
    userId: z.string().cuid("Invalid User ID"),
})

export type JoinMeetingInput = z.infer<typeof joinMeetingSchema>
