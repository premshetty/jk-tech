import { StoredFile } from "@/app/page"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { ScrollArea } from "./ui/scroll-area"

 const FileViewer = ({ activeChatFile }: { activeChatFile: StoredFile }) => {
    const getLanguage = (filename: string) => {
        const ext = filename.split(".").pop()
        switch (ext) {
            case "js":
            case "ts":
            case "tsx":
            case "jsx":
            case "mjs":
                return "tsx"
            case "json":
                return "json"
            case "html":
                return "html"
            case "css":
                return "css"
            case "md":
                return "markdown"
            case "py":
                return "python"
            case "sh":
                return "bash"
            case "java":
                return "java"
            case "c":
                return "c"
            case "cpp":
                return "cpp"
        
            case "txt":
            default:
                return "text"
        }
    }

    return (
        <ScrollArea
            className={`${activeChatFile ? "hidden md:block" : "block"
                } rounded-md border w-[30%] max-w-[70%] flex-1 p-0 bg-muted text-sm max-h-full  relative`}
        >
            <div className="sticky top-0 z-10 bg-muted p-4 border-b">
                <h4 className="font-semibold">
                    <code>{activeChatFile.name}</code>
                </h4>
            </div>

            <div className="p-4">
                <SyntaxHighlighter
                    language={getLanguage(activeChatFile.name)}
                    style={atomDark}
                    wrapLongLines
                    customStyle={{
                        backgroundColor: "transparent",
                        padding: "0",
                        fontSize: "0.85rem",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        margin: 0,
                    }}
                >
                    {activeChatFile.content}
                </SyntaxHighlighter>
            </div>
        </ScrollArea>
    )
}

export default FileViewer