import { useEffect } from "react";

const useScroll = <T extends HTMLElement> (
  callback: (element: T) => void, 
  element: T | null
) => {
  useEffect(() => {
    if (element) {
      element.addEventListener("scroll", () => {
        callback(element);
      });
    }
  }, [callback]);
};

export default useScroll;