"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Video, Loader2, FileText, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { Meeting } from "@prisma/client";
import { Constants } from "@/lib/Constants";

export default function MeetingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const { user, isAuthenticated } = useAuthStore();
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [loading, setLoading] = useState(true);

    const meetingId = resolvedParams.id;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!useAuthStore.getState().isAuthenticated) {
                router.push("/");
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [router]);

    useEffect(() => {
        const fetchMeetingDetails = async () => {
            if (!meetingId) return;

            try {
                const res = await fetch(`/api/meetings/${meetingId}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch meeting details");
                }
                const data = await res.json();
                setMeeting(data);
            } catch (error) {
                console.error("Error fetching meeting:", error);
                toast.error("Could not load meeting details");
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchMeetingDetails();
        }
    }, [meetingId, isAuthenticated]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#667eea]" />
            </div>
        );
    }

    if (!meeting) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Meeting not found</h2>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center text-[#667eea] hover:underline"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const isCompleted = meeting.status === "COMPLETED";

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center mb-8"
            >
                <button
                    onClick={() => router.push("/dashboard")}
                    className="mr-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Meeting Details</h1>
                    <p className="text-sm text-gray-400 mt-1">{meeting.meetLink}</p>
                </div>
                <div className="ml-auto">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full 
                        ${meeting.status === Constants.MEETING_STATUS.COMPLETED ? 'bg-green-500/20 text-green-400' :
                            meeting.status === Constants.MEETING_STATUS.FAILED ? 'bg-red-500/20 text-red-400' :
                                meeting.status === Constants.MEETING_STATUS.PROCESSING ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-yellow-500/20 text-yellow-400'}`}>
                        {meeting.status}
                    </span>
                </div>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[600px]">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden aspect-video flex items-center justify-center relative"
                    >
                        {isCompleted && meeting.recordingUrl ? (
                            <video
                                src={meeting.recordingUrl}
                                controls
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="text-center p-6">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                    <Video className="w-8 h-8 text-gray-500" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-300 mb-2">
                                    {meeting.status === Constants.MEETING_STATUS.PENDING && Constants.DISPLAY_MESSAGES.PENDING}
                                    {meeting.status === Constants.MEETING_STATUS.JOINING && Constants.DISPLAY_MESSAGES.JOINING}
                                    {meeting.status === Constants.MEETING_STATUS.IN_PROGRESS && Constants.DISPLAY_MESSAGES.IN_PROGRESS}
                                    {meeting.status === Constants.MEETING_STATUS.PROCESSING && Constants.DISPLAY_MESSAGES.PROCESSING}
                                    {meeting.status === Constants.MEETING_STATUS.FAILED && Constants.DISPLAY_MESSAGES.FAILED}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {meeting.status === Constants.MEETING_STATUS.FAILED
                                        ? "Please try again."
                                        : "Please check back later for the recording and summary."}
                                </p>
                            </div>
                        )}
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-[#667eea]" />
                            <h2 className="text-lg font-bold">Summary</h2>
                        </div>

                        {isCompleted && meeting.summary ? (
                            <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {meeting.summary}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 italic">
                                {meeting.status === Constants.MEETING_STATUS.FAILED
                                    ? Constants.SUMMARY_PLACEHOLDER.UNAVAILABLE
                                    : Constants.SUMMARY_PLACEHOLDER.WAITING}
                            </div>
                        )}
                    </motion.section>
                </div>

                <motion.section
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-full max-h-[calc(100vh-120px)] lg:sticky lg:top-8"
                >
                    <div className="flex items-center gap-2 mb-4 shrink-0">
                        <MessageSquare className="w-5 h-5 text-[#667eea]" />
                        <h2 className="text-lg font-bold">Transcript</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {isCompleted && meeting.transcript ? (
                            <div className="space-y-4">
                                <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono">
                                    {JSON.stringify(meeting.transcript, null, 2)}
                                </pre>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 italic">
                                {meeting.status === 'FAILED' ? 'Transcript unavailable.' : 'Transcript will be generated shortly.'}
                            </div>
                        )}
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
