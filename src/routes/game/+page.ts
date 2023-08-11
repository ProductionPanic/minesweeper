import { browser } from "$app/environment";

export async function load() {
    if (!browser) {
        return {
            game: 'game',
        }
    }
    return {
        game: null,

    }
}