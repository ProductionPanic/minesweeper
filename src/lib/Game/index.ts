import { MineField } from "./Field";

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
    isExploded?: boolean,
}

export enum GameState {
    None,
    Initialising,
    Playing,
    Paused,
    Won,
    Lost
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

    private init() {
        this.game = MineSweeperHandler.getCurrentGameData();
        this.field = new MineField(this.game!);
        this.field.init();
    }

    private static newGame() {
        if (!this.instance) {
            this.instance = new MineSweeperHandler();
        }

        this.instance.init();
    }

    static getCurrentGameData(): MineSweeperData | null {
        if (localStorage.getItem('current_game') === null) {
            return null;
        }

        return JSON.parse(localStorage.getItem('current_game') as string);
    }

    static setCurrentGameData(game: MineSweeperData) {
        localStorage.setItem('current_game', JSON.stringify(game));
        this.newGame();
    }

    static clearCurrentGameData() {
        localStorage.removeItem('current_game');
    }



}

export function new_minesweeper_game(difficulty: Difficulty) {
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
            isRevealed: false
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

    return game;
}

export function save_minesweeper_game(game: MineSweeperData) {
    MineSweeperHandler.setCurrentGameData(game);
}

export function set_last_as_current_game() {
    const game = MineSweeperHandler.getCurrentGameData();
    if (game) {
        MineSweeperHandler.setCurrentGameData(game);
    }
}