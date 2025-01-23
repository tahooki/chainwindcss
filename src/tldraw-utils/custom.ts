import { exportToBlob, TLExportType, TLShapeId } from "tldraw";

export const handleExportBase64 = async (
  editor: any,
  ids: string[],
  format: TLExportType = "png"
): Promise<string> => {
  const blob = await exportToBlob({
    editor,
    format: format as TLExportType,
    ids: ids as TLShapeId[],
    opts: {
      scale: 2,
      background: true,
      quality: 1,
    },
  });

  // Blob을 base64로 변환
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data);
    };
    reader.readAsDataURL(blob!);
  });
};
