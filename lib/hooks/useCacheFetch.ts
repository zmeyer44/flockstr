"use client";
import { cache, useEffect, useState } from "react";

type DefaultReturnType = {
  contentType: string;
};
type ReturnType =
  | (DefaultReturnType &
      (
        | {
            data: string;
            type: "image";
          }
        | {
            data: { image: string; title: string; description: string };
            type: "link";
          }
        | {
            type: "unknown";
            data: unknown;
          }
      ))
  | null;

// export const fetchContent: (url: string) => Promise<ReturnType> = cache(
//   async (url: string) => {
//     try {
//       console.log("Calling", url);
//       const response = await fetch(
//         "https://www.youtube.com/watch?si=O-IuZ94H1UwyYfl0&v=giaZnIr-faM&feature=youtu.be",
//       ).catch((err) => console.log("Fetch error in content fetch", err));
//       console.log("RESPONSE", response);
//       if (!response) {
//         return null;
//       }
//       const contentType = response.headers.get("content-type");
//       if (contentType?.startsWith("text/html")) {
//         const data = await response.json();
//         return {
//           data: data,
//           contentType: contentType,
//           type: "link",
//         };
//       } else if (contentType?.startsWith("image")) {
//         const imageData = (await response.blob().then(
//           (blob) =>
//             new Promise((resolve, reject) => {
//               const reader = new FileReader();
//               reader.onloadend = () => resolve(reader.result as string);
//               reader.onerror = reject;
//               reader.readAsDataURL(blob);
//             }),
//         )) as string;
//         return {
//           contentType,
//           data: imageData,
//           type: "image",
//         };
//       }
//       return null;
//     } catch (err) {
//       console.log("Content fetch failed", err);
//       return null;
//     }
//   },
// );
export const fetchContent: (url: string) => Promise<ReturnType> = async (
  url: string,
) => {
  try {
    console.log("Calling", url);
    const response = await fetch(url).catch((err) =>
      console.log("Fetch error"),
    );
    // console.log("RESPONSE", response);
    if (!response) {
      return null;
    }
    const contentType = response.headers.get("content-type");
    if (contentType?.startsWith("image")) {
      const imageData = (await response.blob().then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }),
      )) as string;
      return {
        contentType,
        data: imageData,
        type: "image",
      };
    }
    return null;
  } catch (err) {
    console.log("Content fetch failed", err);
    return null;
  }
};

const useCacheFetch = ({ url }: { url: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ReturnType | null>(null);

  async function handleFetch() {
    setIsLoading(true);
    const response = await fetchContent(url);

    setData(response);
    setIsLoading(false);
  }
  useEffect(() => {
    void handleFetch();
  }, [url]);

  return {
    isLoading,
    data,
  };
};

export default useCacheFetch;
