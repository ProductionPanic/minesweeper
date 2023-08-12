import { tick } from "svelte";
import { MineField, mineField } from "./Field";

export interface MineSweeperData {
    tiles: TileData[];
    width: number;
    height: number;
    state: GameState;
}

export interface TileData {
    x: number,
    y: number,
    isMine: boolean,
    isFlagged: boolean,
    isRevealed: boolean,
    isExploded: boolean,
}

export enum GameState {
    None,
    Initialising,
    Playing,
    Paused,
    Won,
    Lost,
}

export enum Difficulty {
    Easy = 0,
    Medium = 1,
    Hard = 2
}

export const TILE_SIZE = 32;

class MineSweeperHandler {
    private static instance: MineSweeperHandler;

    private game: MineSweeperData | null = null;
    private field: MineField | null = null;

    private constructor() { }

    private async init() {

        await tick();
        this.game = MineSweeperHandler.getCurrentGameData();
        const field = new MineField(this.game!);
        mineField.set(field);
        await tick();
        field.init();
        await tick();

    }

    private async reset() {
        this.game = null;
        this.field = null;
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    public static async newGame() {
        if (this.instance) {
            await this.instance.reset();
        }

        if (!this.instance) {
            this.instance = new MineSweeperHandler();
        }

        await this.instance.init();
    }

    static getCurrentGameData(): MineSweeperData | null {
        if (localStorage.getItem('current_game') === null) {
            return null;
        }

        return JSON.parse(localStorage.getItem('current_game') as string);
    }

    static setCurrentGameData(game: MineSweeperData) {
        localStorage.setItem('current_game', JSON.stringify(game));
    }

    static clearCurrentGameData() {
        localStorage.removeItem('current_game');
    }



}

export async function new_minesweeper_game(difficulty: Difficulty) {
    mineField.set(null);

    MineSweeperHandler.clearCurrentGameData();
    let mineRatio = 0;
    switch (difficulty) {
        case Difficulty.Easy:
            mineRatio = 0.1;
            break;
        case Difficulty.Medium:
            mineRatio = 0.2;
            break;
        case Difficulty.Hard:
            mineRatio = 0.3;
            break;
        default:
            mineRatio = 0.1;
            break;
    }

    const max_width = window.innerWidth - 50;
    const max_height = window.innerHeight - 100;

    const width = Math.floor(max_width / TILE_SIZE);
    const height = Math.floor(max_height / TILE_SIZE);

    const tiles: TileData[] = Array(width * height).fill(0).map((_, i) => {
        return {
            x: i % width,
            y: Math.floor(i / width),
            isMine: false,
            isFlagged: false,
            isRevealed: false,
            isExploded: false,
        }
    });

    // add {mineRatio}% mines

    const mineCount = Math.floor(tiles.length * mineRatio);
    for (let i = 0; i < mineCount; i++) {
        let tile = tiles[Math.floor(Math.random() * tiles.length)];
        if (tile.isMine) {
            i--;
            continue;
        }

        tile.isMine = true;
    }

    const game: MineSweeperData = {
        tiles,
        width,
        height,
        state: GameState.Initialising
    }

    MineSweeperHandler.setCurrentGameData(game);

    await MineSweeperHandler.newGame();

    return MineSweeperHandler.getCurrentGameData();
}

export function save_minesweeper_game(game: MineSweeperData) {
    MineSweeperHandler.setCurrentGameData(game);
}

export async function init_game() {
    await MineSweeperHandler.newGame();
}

export function set_last_as_current_game() {
    const game = MineSweeperHandler.getCurrentGameData();

    if (game && game.state !== GameState.Lost || game && game.state !== GameState.Won) {
        MineSweeperHandler.setCurrentGameData(game);
    }
}

export function clear_current_game() {
    MineSweeperHandler.clearCurrentGameData();
}