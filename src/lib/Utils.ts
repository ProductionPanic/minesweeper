import type { Writable } from "svelte/store";

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