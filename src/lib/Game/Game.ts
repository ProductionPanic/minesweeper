import { db } from "$lib/data/db"


export class Game {
    public static async create(difficulty: number) {
        const game = db.games.add({
            name: new Date().toLocaleString(),
            tiles: [],
            width: 0,
            height: 0,
            time: 0,
            status: 0,
            created: Date.now(),
            updated: Date.now()
        })

        console.log(game)

        return game
    }
}