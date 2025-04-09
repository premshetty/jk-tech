import { openDB } from "idb";
import { extractTextFromFile } from "./extractTextFromFile";

export const getDB = () =>
  openDB("UploadDB", 1, {
    upgrade(db) {
      db.createObjectStore("files", { keyPath: "name" });
    },
  });


export const saveFile = async (file: File) => {
  const db = await getDB();
  const content = await extractTextFromFile(file);
  await db.put("files", { name: file.name, file, content }); // ✅ storing content too
};

export const getAllFiles = async () => {
  const db = await getDB();
  return db.getAll("files");
};

export const deleteFile = async (name: string) => {
  const db = await getDB();
  return db.delete("files", name);
};
