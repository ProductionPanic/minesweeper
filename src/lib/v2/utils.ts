
import { tick } from "svelte";
import { writable, type Writable } from "svelte/store";
import { store } from "./MineSweeperGame";

export interface AsyncWritable<T> extends Writable<T> {
    get: () => Promise<T>;
}

export function asyncWritable<T>(value: T | undefined = undefined): AsyncWritable<T> {
    const { subscribe, set, update } = writable(value);
    return {
        subscribe,
        set,
        update,
        get: async () => new Promise<T>((resolve) => {
            const unsub = subscribe(async (value) => {
                await tick();
                unsub();
                resolve(value);
            });
        })
    }
}