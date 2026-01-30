
import { NextResponse } from "next/server";
import { MeetingService } from "@/services/meeting.service";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json(
            { error: "User ID is required" },
            { status: 400 }
        );
    }

    try {
        const meetings = await MeetingService.getUserMeetings(userId);
        return NextResponse.json(meetings);
    } catch (error) {
        console.error("Error in meetings GET handler:", error);
        return NextResponse.json(
            { error: "Failed to fetch meetings" },
            { status: 500 }
        );
    }
}
