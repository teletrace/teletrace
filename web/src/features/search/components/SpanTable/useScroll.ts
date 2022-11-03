import { useEffect } from "react"

export const useScroll = (callback: () => void) => {
    useEffect(() => {
        window.addEventListener('scroll', () => {
            callback();
        })
    }, [callback]);
}