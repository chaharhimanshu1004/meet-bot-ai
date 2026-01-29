"use client"

import { useState } from "react"

export default function Home() {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup"
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                setMessage(data.message)
                setFormData({ email: "", password: "", name: "" })
            } else {
                setMessage(data.error || data.message)
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="min-h-screen px-8">
            <main className="flex flex-col items-center justify-center min-h-screen py-16">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold mb-4 tracking-tight">
                        MeetBot{" "}
                        <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                            AI
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Your intelligent meeting assistant. Join any Google
                        Meet, record, transcribe, and analyze.
                    </p>
                </div>

                <div className="w-full max-w-md mx-auto mb-16">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-10 shadow-2xl">
                        <div className="flex gap-2 mb-8 bg-white/5 rounded-xl p-2">
                            <button
                                className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                                    isLogin
                                        ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white"
                                        : "text-gray-400"
                                }`}
                                onClick={() => setIsLogin(true)}
                            >
                                Login
                            </button>
                            <button
                                className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                                    !isLogin
                                        ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white"
                                        : "text-gray-400"
                                }`}
                                onClick={() => setIsLogin(false)}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5"
                        >
                            {!isLogin && (
                                <div className="flex flex-col">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="p-4 bg-white/8 border border-white/10 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-[#667eea] focus:bg-white/10 placeholder:text-gray-500"
                                    />
                                </div>
                            )}

                            <div className="flex flex-col">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="p-4 bg-white/8 border border-white/10 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-[#667eea] focus:bg-white/10 placeholder:text-gray-500"
                                />
                            </div>

                            <div className="flex flex-col">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="p-4 bg-white/8 border border-white/10 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-[#667eea] focus:bg-white/10 placeholder:text-gray-500"
                                />
                            </div>

                            {message && (
                                <div className="p-3 bg-[#667eea]/20 border border-[#667eea]/30 rounded-lg text-sm text-center text-blue-300">
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="p-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#667eea]/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-2"
                                disabled={loading}
                            >
                                {loading
                                    ? "Processing..."
                                    : isLogin
                                      ? "Login"
                                      : "Sign Up"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
                    <div className="text-center p-8 bg-white/3 border border-white/8 rounded-2xl transition-transform duration-300 hover:-translate-y-2">
                        <h3 className="text-2xl mb-2">🤖 AI-Powered</h3>
                        <p className="text-gray-400 text-sm">
                            Automatically join and record your meetings
                        </p>
                    </div>
                    <div className="text-center p-8 bg-white/3 border border-white/8 rounded-2xl transition-transform duration-300 hover:-translate-y-2">
                        <h3 className="text-2xl mb-2">📝 Transcription</h3>
                        <p className="text-gray-400 text-sm">
                            Get accurate transcripts of every conversation
                        </p>
                    </div>
                    <div className="text-center p-8 bg-white/3 border border-white/8 rounded-2xl transition-transform duration-300 hover:-translate-y-2">
                        <h3 className="text-2xl mb-2">🔒 Secure</h3>
                        <p className="text-gray-400 text-sm">
                            Your data is encrypted and protected
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
