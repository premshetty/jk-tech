"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileIcon, X } from "lucide-react"
import { useRef, useState, useEffect } from "react"

type StoredFile = {
    name: string
    file: File
    content: string
}

type Message = {
    content: string
    role: "user" | "assistant"
    timestamp: Date
}

type ChatPanelProps = {
    file: StoredFile
    messages: Record<string, Message[]>
    setMessages: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>
    onClose: () => void
}

export function ChatPanel({ file, messages, setMessages, onClose }: ChatPanelProps) {
    const [currentMessage, setCurrentMessage] = useState("")
    const [thinking, setThinking] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, file, thinking])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentMessage.trim()) return

        const userMessage: Message = {
            content: currentMessage,
            role: "user",
            timestamp: new Date(),
        }

        setMessages((prev) => ({
            ...prev,
            [file.name]: [...(prev[file.name] || []), userMessage],
        }))
        setCurrentMessage("")
        setThinking(true)

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: userMessage.content,
                    fileText: file.content,
                }),
            })

            const data = await res.json()
            const aiResponse: Message = {
                content: data.answer || "Sorry, I couldn't generate a response.",
                role: "assistant",
                timestamp: new Date(),
            }

            setMessages((prev) => ({
                ...prev,
                [file.name]: [...(prev[file.name] || []), aiResponse],
            }))
        } catch (err) {
            console.error("Error:", err)
            setMessages((prev) => ({
                ...prev,
                [file.name]: [
                    ...(prev[file.name] || []),
                    {
                        content: "There was an error processing your request. Please try again.",
                        role: "assistant",
                        timestamp: new Date(),
                    },
                ],
            }))
        } finally {
            setThinking(false)
        }
    }

    return (
        <div className="flex-1 border-l md:max-w-md flex  flex-col h-full">
            <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4" />
                    <h3 className="font-medium truncate max-w-72">{file.name}</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close chat</span>
                </Button>
            </div>

            <ScrollArea className="flex-1 p-4 h-[70vh]">
                <div className="space-y-4">
                    {messages[file.name]?.map((message, i) => (
                        <div key={i} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                                key={i}
                                data-testid={message.role === "assistant" && !thinking  ? "assistant-message" : undefined}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >

                                <p className="wrap-break-word">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))}

                    {/* Optional thinking bubble */}
                    {thinking && (
                        <div className="flex justify-start">
                            <div className="max-w-[80%] rounded-lg p-3 bg-muted text-sm opacity-70 italic">
                                Thinking...
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                    <Input
                        placeholder="Type your message..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        className="flex-1"
                        disabled={thinking}
                    />
                    <Button type="submit" disabled={thinking}>
                        {thinking ? "..." : "Send"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
