
"use client"
import { ChatPanel } from "@/components/chat-ui"
import FileViewer from "@/components/file-viewer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIngestion } from "@/lib/context/IngestionContext"
import { deleteFile, getAllFiles, saveFile } from "@/lib/db"
import { FileIcon, Upload } from "lucide-react"

import { useEffect, useState } from "react"
export type StoredFile = {
  name: string
  file: File
  content: string
}
type Message = {
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function UploadPage() {
  const [selected, setSelected] = useState<File | null>(null)
  const [files, setFiles] = useState<StoredFile[]>([])
  const { progress, setProgress, status, setStatus } = useIngestion()


  const [activeChatFile, setActiveChatFile] = useState<StoredFile | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const loadFiles = async () => {
    const all = await getAllFiles()
    setFiles(all)
  }

  useEffect(() => {
    loadFiles()
  }, [])



  const handleDelete = async (name: string) => {
    await deleteFile(name)
    if (activeChatFile?.name === name) {
      setActiveChatFile(null)
    }
    loadFiles()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelected(file)
  }

  const handleUpload = async () => {
    if (!selected) return
    setStatus("uploading")
    await saveFile(selected)
    setStatus("ingesting")

    let p = 0
    const interval = setInterval(() => {
      p += 10
      setProgress(p)
      if (p >= 100) {
        clearInterval(interval)
        setStatus("done")
        setProgress(100)
        setSelected(null)
        loadFiles()
      }
    }, 300)
  }
  const handleFileClick = (file: StoredFile) => {
    setActiveChatFile(file)
    if (!messages[file.name]) {
      setMessages((prev) => ({
        ...prev,
        [file.name]: [
          {
            content: `Hello! I'm here to help you with your document "${file.name}". What would you like to know about it?`,
            role: "assistant",
            timestamp: new Date(),
          },
        ],
      }))
    }
  }
  return (
    <>
      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 p-4 ${activeChatFile ? "hidden md:block" : "block"}`}>
          <Card className="w-full max-w-5xl mx-auto h-full">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Upload Document</CardTitle>
              <CardDescription>Upload your documents for processing</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                  <div className="relative">
                    <Input
                      accept=".txt,.md,.json,.csv,.tsv ,.css,.html,.js,.jsx,.ts,.tsx,.py,.java,.c,.cpp"
                      type="file"
                      id="file-upload"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={handleFileChange}
                    />
                    <Button variant="outline" className="w-full flex justify-between items-center" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="truncate">{selected ? selected.name : "Choose file..."}</span>
                        <Upload className="h-4 w-4 ml-2 shrink-0" />
                      </label>
                    </Button>
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={!selected || status === "uploading" || status === "ingesting"}
                    className="whitespace-nowrap"
                  >
                    Start Upload
                  </Button>
                </div>
              </div>

              {status !== "idle" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Status: {status}</p>
                    <p className="text-sm">{progress}%</p>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium mb-2">Uploaded Files</h3>
                <ScrollArea className="h-[35vh] rounded-md border p-2">
                  {files.length > 0 ? (
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between gap-2 text-sm p-1 rounded hover:bg-muted"
                        >
                          <div
                            className="flex items-center gap-2 flex-1 cursor-pointer"
                            onClick={() => handleFileClick(file)}
                          >
                            <FileIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <Button
                            variant="outline"
                            className="text-red-500 hover:text-red-700 p-1"
                            onClick={() => handleDelete(file.name)}
                          >
                            Delete
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground p-1">No files uploaded yet.</p>
                  )}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>

        {activeChatFile && (<div className="flex my-4 gap-2 w-full">
          <FileViewer activeChatFile={activeChatFile} />
          <ChatPanel messages={messages} setMessages={setMessages}
            file={activeChatFile} onClose={() => setActiveChatFile(null)} />
        </div>
        )}
      </div>
    </>
  )
}
