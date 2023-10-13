import { useRef, useState, useEffect } from "react";

const useElementOnScreen = (options?: {
  root: any;
  rootMargin: string;
  threshold: number;
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const defaultOptions = {
    root: null,
    rootMargin: "0px 0px 0px 0px",
    threshold: 1,
  };
  const callbackFunction = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry) {
      setIsVisible(entry.isIntersecting);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      callbackFunction,
      options ?? defaultOptions,
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [containerRef, options]);

  return {
    containerRef,
    isVisible,
  };
};

export default useElementOnScreen;
