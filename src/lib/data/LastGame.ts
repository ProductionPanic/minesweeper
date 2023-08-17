import { Preferences } from "@capacitor/preferences";
import { writable } from "svelte/store";

export const lastGameId = getGameIdStore();

function getGameIdStore() {
    const { subscribe, set } = writable(-1);
    return {
        subscribe,
        set: (game: number) => {
            set(game);
            setLastGame(game);
        }
    }
}

export async function getLastGame(): Promise<number> {
    const lastGame = await Preferences.get({ key: "lastGame" });
    const val = lastGame.value || "0";
    return parseInt(val) || 0;
}

export async function setLastGame(game: number) {
    await Preferences.set({ key: "lastGame", value: game.toString() });
}

