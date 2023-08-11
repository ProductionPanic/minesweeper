import { browser } from "$app/environment";
import { Preferences } from "@capacitor/preferences";
import { writable, type Writable } from "svelte/store";

export interface Settings {
    emojirain: boolean;
    emojirainCount: number;
    vibration: boolean;
}

const defaultSettings: Settings = {
    emojirain: true,
    emojirainCount: 75,
    vibration: true,
};

export class SettingsHandler {
    private _settings!: Settings;
    private constructor() {
    }

    public static async get(): Promise<Settings> {
        const handler = new SettingsHandler();
        handler._settings = await handler.getSettings();
        return handler._settings;
    }

    public static async init() {
        if (!browser) return;
        const set = await SettingsHandler.get();
        settings.set(set);
    }

    public static async update(toChange: Partial<Settings>) {
        const handler = new SettingsHandler();
        handler._settings = await handler.getSettings();
        handler.update(toChange);
        return handler._settings;
    }

    private async getSettings(): Promise<Settings> {
        const output: any = {};

        for (const key in defaultSettings) {
            const value = await Preferences.get({ key });
            if (value) {
                const typeOfSetting = typeof defaultSettings[key as keyof Settings];
                switch (typeOfSetting) {
                    case 'boolean':
                        // @ts-ignore
                        output[key] = value.value === 'true';
                        break;
                    case 'number':
                        // @ts-ignore
                        output[key] = parseInt(value.value);
                        break;
                    default:
                        // @ts-ignore
                        output[key] = value.value;
                        break;
                }

            } else {
                // @ts-ignore
                output[key] = defaultSettings[key]
            }
        }

        return output;
    }

    private update(toChange: Partial<Settings>) {
        this._settings = { ...this._settings, ...toChange };
        for (const key in toChange) {
            const value = toChange[key as keyof Settings];
            if (value === undefined) continue;
            Preferences.set({ key, value: value.toString() });
        }
    }
}

export const settings = writable(defaultSettings);