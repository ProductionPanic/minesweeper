import { writable, type Writable } from "svelte/store";

export function storeToPromise<T>(store: Writable<T>) {
    return new Promise<T>((resolve) => {
        const unsubscribe = store.subscribe((val: any) => {
            unsubscribe();
            resolve(val as T);
        })
    })
}

export function timestamp(): number {
    return new Date().getTime();
}

export async function sleep(ms: number = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const loading: Writable<boolean> = writable(false);

export class Loading {
    public static store: Writable<boolean> = loading;
    public static async start() {
        loading.set(true);
    }
    public static async stop() {
        loading.set(false);
    }
}

