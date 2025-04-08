"use client"

import { AlertCircle, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AlertDestructive({ text }: { text: string }) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 5000)

        return () => clearTimeout(timer)
    }, [])

    if (!isVisible) return null

    return (
        <div className="fixed top-4 right-4 z-50 max-w-md transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
            <Alert variant="destructive" className="pr-8 shadow-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{text}</AlertDescription>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-800 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </Alert>
        </div>
    )
}
