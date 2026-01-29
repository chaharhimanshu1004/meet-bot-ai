import "../styles/globals.css"
import ToastProvider from "@/components/providers/ToastProvider"

export const metadata = {
    title: "MeetBot AI - Intelligent Meeting Recording",
    description: "AI-powered meeting recording bot for Google Meet",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <ToastProvider />
                {children}
            </body>
        </html>
    )
}
