import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { joinMeetingSchema } from "@/lib/validations";
import { Constants } from "@/lib/Constants";
import { MeetingStatus } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { meetLink, userId } = joinMeetingSchema.parse(body);

        const meeting = await prisma.meeting.create({
            data: {
                meetLink,
                userId,
                status: Constants.MEETING_STATUS.PENDING as MeetingStatus,
            },
        });

        const jobData = {
            meetingId: meeting.id,
            meetLink,
            userId,
        };

        await redis.lpush(Constants.REDIS_QUEUE_KEY, JSON.stringify(jobData));

        return NextResponse.json({
            success: true,
            message: "Bot is joining the meeting",
            meetingId: meeting.id,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            );
        }

        console.error("Join Meeting Error:", error);
        return NextResponse.json(
            { error: "Failed to join meeting" },
            { status: 500 }
        );
    }
}
