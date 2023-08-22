import { writable, type Writable } from "svelte/store";
import { Preferences } from '@capacitor/preferences';


export const Themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "pastel",
    "fantasy",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "acid",
    "night",
    "coffee",
    "winter",
];

export const darkThemes = [
    "dark",
    "synthwave",
    "halloween",
    "forest",
    "luxury",
    "dracula",
    "night",
    "coffee",
];

export const lightThemes = [
    "light",
    "cupcake",
    "bumblebee",
    "emerald",
    "retro",
    "valentine",
    "pastel",
    "fantasy",
]

export type Theme = typeof Themes[number];

const themeStore = writable<Theme>("dark");

export const currentTheme: Writable<Theme> = (() => {
    return {
        subscribe: themeStore.subscribe,
        set: () => { },
        update: () => { }
    }
})();

export function setTheme(theme: Theme) {
    themeStore.set(theme);
    Preferences.set({ key: "theme", value: theme });
}

export async function getTheme() {
    const { value } = await Preferences.get({ key: "theme" });
    if (value) {
        themeStore.set(value as Theme);
    }
    return value as Theme | null;
}

