import UploadPage from "@/app/page";
import { IngestionProvider } from "@/lib/context/IngestionContext";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import fs from "fs";
import path from "path";


// Mock  database functions

jest.mock("@/lib/db", () => {
    const files: File[] = [];

    return {
        saveFile: jest.fn(async (file: File) => {
            files.push(file);
        }),
        getAllFiles: jest.fn(async () => {
            return files.map((f) => ({
                name: f.name,
                type: f.type,
                lastModified: f.lastModified,
            }));
        }),
        deleteFile: jest.fn(async (name: string) => {
            const index = files.findIndex((f) => f.name === name);
            if (index > -1) files.splice(index, 1);
        }),
    };
});


// Mock  components
jest.mock("@/components/file-viewer", () => {
    const MockFileViewer = () => <div>File Viewer</div>;
    MockFileViewer.displayName = "FileViewer";
    return MockFileViewer;
});

jest.mock("@/components/chat-ui", () => ({
    ChatPanel: () => <div>Chat Panel</div>,
}));


const loadFileFromFixture = (filePath: string) => {
    const fileContent = fs.readFileSync(path.resolve(__dirname, filePath), "utf-8");
    return new File([fileContent], "sample.txt", { type: "text/plain" });
};

describe("UploadPage", () => {
    beforeEach(async () => {
        await act(async () => {
            render(
                <IngestionProvider>

                    <UploadPage />
                </IngestionProvider>
            );
        });
    });

    it("renders the upload input and button", () => {
        expect(screen.getByText(/Choose file.../)).toBeInTheDocument();
        expect(screen.getByText(/Start Upload/)).toBeInTheDocument();
    });

    it("handles file selection and upload progress", async () => {
        const file = loadFileFromFixture("./fixtures/sample.txt");
        const fileInput = screen.getByLabelText(/Choose file.../) as HTMLInputElement;
        await act(async () => {
            fireEvent.change(fileInput, { target: { files: [file] } });
        });
        expect(screen.getByText(file.name)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Start Upload/));
        fireEvent.click(screen.getByText(/Start Upload/));
        await waitFor(() => expect(screen.getByText("Status: uploading")).toBeInTheDocument());
        expect(screen.getByText("Status: ingesting")).toBeInTheDocument();
    });

    it("handles file deletion", async () => {
        fireEvent.click(screen.getByText("Delete"));
    });


});
