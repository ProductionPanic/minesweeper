import type { Writable } from "svelte/store";

export function storeToPromise<T>(store:Writable<T>) {
    return new Promise<T>((resolve) => {
        const unsubscribe = store.subscribe((val:any) => {
            unsubscribe();
            resolve(val as T);
        })
    })
}