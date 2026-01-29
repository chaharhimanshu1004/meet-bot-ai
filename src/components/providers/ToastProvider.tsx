"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                style: {
                    background: "#1e1e2e",
                    color: "#fff",
                    border: "1px solid #333",
                },
                success: {
                    iconTheme: {
                        primary: "#667eea",
                        secondary: "#fff",
                    },
                },
            }}
        />
    );
}
