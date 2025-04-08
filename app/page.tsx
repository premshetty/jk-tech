'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIngestion } from '@/lib/context/IngestionContext';
import { deleteFile, getAllFiles, saveFile } from '@/lib/db';
import { FileIcon, LogOut, Upload } from "lucide-react";
import { useEffect, useState } from 'react';
type StoredFile = {
  name: string;
  file: File;
};

export default function UploadPage() {
  const [selected, setSelected] = useState<File | null>(null);
  const [files, setFiles] = useState<StoredFile[]>([]);
  const { progress, setProgress, status, setStatus } = useIngestion();

  const loadFiles = async () => {
    const all = await getAllFiles();
    setFiles(all);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDelete = async (name: string) => {
    await deleteFile(name);
    loadFiles();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelected(file);
  };

  const handleUpload = async () => {
    if (!selected) return;
    setStatus('uploading');
    await saveFile(selected);
    setStatus('ingesting');

    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStatus('done');
        setProgress(100);
        setSelected(null); // reset selected
        loadFiles(); // refresh file list
      }
    }, 300);
  };

  return (
    <div>



      <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
        <div className='flex justify-between items-center w-full'>
          <div>
          </div>
          <Button variant='ghost' className="flex items-center gap-2">
            <LogOut className="h-4 w-4 ml-2 shrink-0" />
            Log out
          </Button>
        </div>

      </header>
      <div className="flex  flex-col gap-4 p-4 h-[80vh] justify-between items-center">
        <Card className="w-full max-w-5xl  mx-auto ">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Upload Document</CardTitle>
            <CardDescription>Upload your documents for processing</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Upload UI */}
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <div className="relative">
                  <Input
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

            {/* Progress UI */}
            {status !== "idle" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Status: {status}</p>
                  <p className="text-sm">{progress}%</p>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* File List */}
            <div>
              <h3 className="text-lg font-medium mb-2">Uploaded Files</h3>
              <ScrollArea className="h-[40%] rounded-md border p-2">
                {files.length > 0 ? (
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between gap-2 text-sm p-1 rounded hover:bg-muted"
                      >
                        <div className="flex items-center gap-2">
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <Button
                          variant="outline"
                          className="text-red-500 hover:text-red-700  p-1"
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



    </div>
  );
}
