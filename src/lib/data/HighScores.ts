import { liveQuery, type Observable } from "dexie";
import { db, type MinesweeperHighscore } from "./db";

export class highscores {
    private static instance: highscores;

    public static get(): highscores {
        if (!highscores.instance) {
            highscores.instance = new highscores();
        }

        return highscores.instance;
    }

    public getHighScore(difficulty: number):Observable<MinesweeperHighscore[]> {
        return liveQuery(() => db.highscores.where("difficulty").equals(difficulty).toArray())
    }

    public async addHighScore(highscore: MinesweeperHighscore): Promise<any> {
        const result = await db.highscores.add(highscore);
        return result;
    }

    public clearHighScores(): void {
        db.highscores.clear();
    }

    public clearHighScoresForDifficulty(difficulty: number): void {
        db.highscores
            .where("difficulty")
            .equals(difficulty)
            .delete();
    }

    public changeNameForHighScore(id: number, name: string): void {
        db.highscores
            .where("id")
            .equals(id)
            .modify({ name });
    }




}
