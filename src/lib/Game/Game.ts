import { GameInstance } from "$lib/db";

export class Game {
    public static async create(difficulty: number) {
        const game = await GameInstance.create({
            difficulty: difficulty,
            status: "created"
        }, [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }], 0)

        console.log(game)

        return game
    }
}