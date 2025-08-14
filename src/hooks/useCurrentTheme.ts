'use client'

import { useTheme } from "next-themes"

export const useCurrentTheme = () => {
    const {theme, systemTheme, setTheme}  = useTheme()


    if (theme === "dark" || theme === "light") {
        return {theme, setTheme}
    }

    return {theme: systemTheme, setTheme}
}
