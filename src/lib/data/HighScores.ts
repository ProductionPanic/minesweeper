import { liveQuery } from "dexie";
import { db, type MinesweeperHighscore } from "./db";

export class highscores {
    private static instance: highscores;
    private highScores: MinesweeperHighscore[] = [];

    private constructor() {
        const obs = liveQuery(() => {
            return db.highscores.toArray();
        });

        obs.subscribe((highscores) => {
            this.highScores = highscores;
        });
    }

    public static get(): highscores {
        if (!highscores.instance) {
            highscores.instance = new highscores();
        }

        return highscores.instance;
    }

    public getHighScores(count: number = 1): MinesweeperHighscore[] {
        return this.highScores;
    }

    public getHighScoreForDifficulty(difficulty: number, count: number = 1): MinesweeperHighscore[] {
        return this.highScores.filter((hs) => hs.difficulty === difficulty).slice(0, count);
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
