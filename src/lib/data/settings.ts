import { browser } from "$app/environment";
import { writable } from "svelte/store";
import { db } from "./db";

export interface Settings {
    emojirain: boolean;
    emojirainCount: number;
    vibration: boolean;
    visited: boolean|undefined;
    lastDifficulty: number;
    useSound: boolean;
}

const defaultSettings: Settings = {
    emojirain: true,
    emojirainCount: 30,
    vibration: true,
    lastDifficulty: 0,
    visited: undefined,
    useSound: true,
};

export const settings = writable<Settings>(defaultSettings);

export async function is_first_time() {
    const val = await db.options.get('visited');
    if (val) {
        return false;
    }
    await db.options.add({
        key: 'visited',
        value: 'true',
        created: Date.now(),
        updated: Date.now(),
    });
    return true;
}

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
        const output = await db.options.toArray();
        const settings: Partial<Settings> = {};
        for (const key in defaultSettings) {
            const value = output.find((o) => o.key === key);
            if (value && value.value) {
                const resp = JSON.parse(value.value);
                // @ts-ignore
                settings[key] = resp;
            } else {
                // @ts-ignore
                settings[key] = defaultSettings[key];
            }
        }
        
        return settings as Settings;
    }



    private async update(toChange: Partial<Settings>) {
        this._settings = { ...this._settings, ...toChange };
        for (const [key, value] of Object.entries(toChange)) {
            const encodedValue = JSON.stringify(value);
            const existing = await db.options.get(key);
            if (existing) {
                existing.value = encodedValue;
                existing.updated = Date.now();
                await db.options.update(key, existing);
            }
            else {
                await db.options.add({
                    key,
                    value: encodedValue,
                    created: Date.now(),
                    updated: Date.now(),
                });
            }
        }

        settings.set(this._settings);
        return this._settings;
    }
}