"use client";
import { useState, ReactNode, useRef } from "react";
import { z } from "zod";
import { createZodFetcher } from "zod-fetch";

const fetchWithZod = createZodFetcher();

const PresignedPostSchema = z.object({
  url: z.string(),
  fileName: z.string(),
});

const useImageUpload = (folderName?: string) => {
  const [status, setStatus] = useState<
    "empty" | "uploading" | "success" | "error"
  >("empty");
  const [imageUrl, setImageUrl] = useState<string | null>();
  const [imagePreview, setImagePreview] = useState<string | null>();

  const uploadImage = async (file: File, folderName?: string) => {
    if (!file) return;
    try {
      const presignedPost = await fetchWithZod(
        // The schema you want to validate with
        PresignedPostSchema,
        // Any parameters you would usually pass to fetch
        "/api/upload",
        {
          method: "POST",
          body: JSON.stringify({ folderName, fileType: file.type }),
        },
      );

      const { url, fileName } = presignedPost;

      if (!url) return;

      const result = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (result.ok) {
        setStatus("success");
        const imageUrl = `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${fileName}`;
        setImageUrl(imageUrl);
        setImagePreview(imageUrl);
        return imageUrl;
      }
      return;
    } catch (err) {
      setStatus("error");
      console.log("ERROR", err);
    }
  };

  const onImageChange = (e: React.FormEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    setStatus("uploading");
    uploadImage(file, folderName);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (readerEvent) => {
      setImagePreview(readerEvent?.target?.result as string);
    };
  };

  const ImageUploadButton = ({ children }: { children: ReactNode }) => {
    const inputFileRef = useRef<HTMLInputElement>(null);
    function onButtonClick() {
      if (inputFileRef.current) {
        inputFileRef.current!.click();
      }
    }
    return (
      <>
        <button type="button" onClick={onButtonClick}>
          {children}
        </button>
        <input
          type="file"
          accept="image/png, image/jpeg"
          hidden
          onChange={onImageChange}
          ref={inputFileRef}
        />
      </>
    );
  };

  const clear = () => {
    setStatus("empty");
    setImageUrl(null);
    setImagePreview(null);
  };

  return {
    imagePreview,
    status,
    imageUrl,
    ImageUploadButton,
    clear,
  };
};

export default useImageUpload;
