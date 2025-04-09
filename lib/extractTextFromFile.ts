export const extractTextFromFile = async (file: File): Promise<string> => {
  const text = await file.text(); // works for .txt, .md, .json etc.
  return text;
};
