import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { joinMeetingSchema } from "@/lib/validations";
import { Constants } from "@/lib/Constants";
import { MeetingStatus } from "@prisma/client";
import { lpushWithRetry } from "@/lib/helpers";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { meetLink, userId } = joinMeetingSchema.parse(body);
        const existingMeeting = await prisma.meeting.findFirst({
            where: {
                meetLink,
                userId,
                status: {
                    in: [Constants.MEETING_STATUS.PENDING as MeetingStatus, Constants.MEETING_STATUS.PROCESSING as MeetingStatus]
                }
            },
        });

        if (existingMeeting) {
            return NextResponse.json({
                success: true,
                message: "Meeting link already exists and is being processed",
                meetingId: existingMeeting.id,
                existing: true
            });
        }

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

        try {
            await lpushWithRetry(Constants.REDIS_QUEUE_KEY, JSON.stringify(jobData));
        } catch (error) {
            console.error("Failed to push to Redis after retries:", error);
            await prisma.meeting.delete({
                where: { id: meeting.id },
            });

            return NextResponse.json(
                { error: "System busy, please try again later" },
                { status: 503 }
            );
        }

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
