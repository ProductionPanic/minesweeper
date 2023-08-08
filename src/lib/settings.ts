import { writable, type Writable } from "svelte/store";

export interface Settings {
    emojirain: boolean;
    emojirainCount: number;
}

const defaultSettings: Settings = {
    emojirain: true,
    emojirainCount: 100,
};

function settingsStore(): Writable<Settings> {
    if (!globalThis.localStorage) {
        return writable(defaultSettings);
    }

    if (localStorage.getItem('settings')) {
        const raw_settings = localStorage.getItem('settings');
        if (raw_settings) {
            const parsed_settings = JSON.parse(raw_settings);
            return writable(parsed_settings);
        }
    }

    return writable(defaultSettings);
}
export const settings = settingsStore();

export function updateSettings(toChange: Partial<Settings>) {
    settings.update((current) => {
        const newSettings = { ...current, ...toChange };
        localStorage.setItem('settings', JSON.stringify(newSettings));
        return newSettings;
    });
}
