
import { NextResponse } from "next/server";
import { MeetingService } from "@/services/meeting.service";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const userMeetingId = (await context.params).id;

    if (!userMeetingId) {
        return NextResponse.json(
            { error: "Meeting ID is required" },
            { status: 400 }
        );
    }

    try {
        const meeting = await MeetingService.getMeetingById(userMeetingId);

        if (!meeting) {
            return NextResponse.json(
                { error: "Meeting not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(meeting);
    } catch (error) {
        console.error("Error in meeting details GET handler:", error);
        return NextResponse.json(
            { error: "Failed to fetch meeting details" },
            { status: 500 }
        );
    }
}
