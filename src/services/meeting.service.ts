import prisma from "@/lib/prisma";
import { Meeting } from "@prisma/client";

export class MeetingService {
    static async getUserMeetings(userId: string): Promise<Meeting[]> {
        try {
            const meetings = await prisma.meeting.findMany({
                where: {
                    userId: userId,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            return meetings;
        } catch (error) {
            console.error("Error fetching user meetings:", error);
            throw new Error("Failed to fetch meetings");
        }
    }

    static async getMeetingById(meetingId: string): Promise<Meeting | null> {
        try {
            const meeting = await prisma.meeting.findUnique({
                where: {
                    id: meetingId,
                },
            });
            return meeting;
        } catch (error) {
            console.error("Error fetching meeting details:", error);
            throw new Error("Failed to fetch meeting details");
        }
    }
}
