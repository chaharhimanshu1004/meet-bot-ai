"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Video, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { Meeting } from "@prisma/client";

export default function DashboardPage() {
    const router = useRouter();
    const { user, logout, isAuthenticated } = useAuthStore();
    const [meetLink, setMeetLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loadingMeetings, setLoadingMeetings] = useState(true);

    const fetchMeetings = async () => {
        if (!user?.id) return;
        try {
            const res = await fetch(`/api/meetings?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setMeetings(data);
            }
        } catch (error) {
            console.error("Failed to fetch meetings:", error);
            toast.error("Failed to load meetings");
        } finally {
            setLoadingMeetings(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!useAuthStore.getState().isAuthenticated) {
                router.push("/");
            } else {
                fetchMeetings();
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [router, user?.id]);

    const handleJoinMeeting = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!meetLink || !user) return;

        setLoading(true);
        try {
            const res = await fetch("/api/meetings/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ meetLink, userId: user.id }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to join meeting");
            }

            toast.success(data.message);
            setMeetLink("");
            fetchMeetings();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            logout();
            router.push("/");
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center mb-12"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-gray-400 mt-1">
                        Welcome back, <span className="text-[#667eea] font-medium">{user.name}</span>
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </button>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <motion.section
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2"
                >
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 backdrop-blur-xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-lg shadow-[#667eea]/20">
                                <Video className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Join a Meeting</h2>
                                <p className="text-gray-400 text-sm">Paste your Google Meet link to start recording</p>
                            </div>
                        </div>

                        <form onSubmit={handleJoinMeeting} className="flex gap-4">
                            <input
                                type="text"
                                placeholder="https://meet.google.com/abc-defg-hij"
                                value={meetLink}
                                onChange={(e) => setMeetLink(e.target.value)}
                                className="flex-1 p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#667eea] transition-colors"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                            >
                                {loading ? "Joining..." : "Join Meeting"}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 min-h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Recent Meetings</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search transcripts..."
                                    className="pl-9 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#667eea]"
                                />
                            </div>
                        </div>

                        {loadingMeetings ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin h-8 w-8 border-4 border-[#667eea] border-t-transparent rounded-full"></div>
                            </div>
                        ) : meetings.length > 0 ? (
                            <div className="space-y-4">
                                {meetings.map((meeting) => (
                                    <div key={meeting.id} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-white mb-1 truncate max-w-[200px] sm:max-w-md" title={meeting.meetLink}>
                                                    {meeting.meetLink}
                                                </h4>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(meeting.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                                ${meeting.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                                                    meeting.status === 'FAILED' ? 'bg-red-500/20 text-red-400' :
                                                        meeting.status === 'PROCESSING' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-yellow-500/20 text-yellow-400'}`}>
                                                {meeting.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] text-center border-2 border-dashed border-white/5 rounded-xl">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <Video className="w-8 h-8 text-gray-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-300">No meetings recorded yet</h3>
                                <p className="text-gray-500 max-w-xs mt-2 text-sm">
                                    Paste a meeting link above to create your first meeting summary.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 border border-[#667eea]/20 rounded-2xl p-6">
                        <h3 className="font-bold text-[#667eea] mb-2">Pro Tip</h3>
                        <p className="text-sm text-gray-300 mb-4">
                            You can also invite the bot directly from your calendar invite by adding
                            <code className="bg-black/30 px-1 py-0.5 rounded mx-1 text-white">bot@meetbot.ai</code>
                            to the guest list.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="font-bold mb-4">Usage Stats</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Minutes Recorded</span>
                                    <span className="font-medium">0m</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#667eea] w-0"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Active Meetings</span>
                                    <span className="font-medium">0</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#667eea] w-0"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
