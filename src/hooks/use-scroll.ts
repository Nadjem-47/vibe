import { useEffect, useState } from "react";

/**
 * useScroll hook
 * Returns: [scrollY, ref]
 * Attach ref to a scrollable element to track its scroll position
 */
export function useScroll(threshold = 10) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setIsScrolled(window.scrollY > threshold);
        window.addEventListener("scroll", handler);
        handler();

        return () => {
            window.removeEventListener("scroll", handler!);
        };
    }, [threshold]);

    return isScrolled;
}
