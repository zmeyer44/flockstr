"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function useQueryParams<T>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams?.toString());

  //   function setQueryParams(params: Partial<T>) {
  //     Object.entries(params).forEach(([key, value]) => {
  //       if (value === undefined || value === null) {
  //         urlSearchParams.delete(key);
  //       } else {
  //         urlSearchParams.set(key, String(value));
  //       }
  //     });

  //     const search = urlSearchParams.toString();
  //     const query = search ? `?${search}` : "";
  //     // replace since we don't want to build a history
  //     router.replace(`${pathname}${query}`);
  //   }

  function setQueryParams(
    props:
      | ((
          current: URLSearchParams,
          obj: Record<string, string | string[]>
        ) => Partial<T>)
      | Partial<T>
  ) {
    let params = props;
    if (typeof params === "function") {
      params = params(urlSearchParams, Object.fromEntries(urlSearchParams));
    }
    console.log("Params", params);
    Object.entries(params).forEach(([key, value]) => {
      console.log("Value", value);
      if (value === undefined || value === null) {
        urlSearchParams.delete(key);
      } else if (Array.isArray(value)) {
        // clear
        urlSearchParams.delete(key);
        for (const val of value) {
          console.log("Setting", val);
          urlSearchParams.append(key, String(val));
        }
      } else {
        urlSearchParams.set(key, String(value));
      }
    });

    const search = urlSearchParams.toString();
    const query = search ? `?${search}` : "";
    // replace since we don't want to build a history
    router.replace(`${pathname}${query}`);
  }

  return { queryParams: searchParams, setQueryParams };
}
