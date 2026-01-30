export class Constants {
    static readonly REDIS_QUEUE_KEY = "meeting-jobs";
    static readonly MEETING_STATUS = {
        PENDING: "PENDING",
        PROCESSING: "PROCESSING",
        COMPLETED: "COMPLETED",
        FAILED: "FAILED",
    };
}