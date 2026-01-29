import "../styles/globals.css"

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
            <body>{children}</body>
        </html>
    )
}
