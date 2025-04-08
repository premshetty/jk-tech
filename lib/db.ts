
import { openDB } from "idb";

export const getDB = () =>
  openDB("UploadDB", 1, {
    upgrade(db) {
      db.createObjectStore("files", { keyPath: "name" });
    },
  });

export const saveFile = async (file: File) => {
  const db = await getDB();
  await db.put("files", { name: file.name, file });
};

export const getAllFiles = async () => {
  const db = await getDB();
  return db.getAll("files");
};

export const deleteFile = async (name: string) => {
  const db = await getDB();
  return db.delete("files", name);
};

