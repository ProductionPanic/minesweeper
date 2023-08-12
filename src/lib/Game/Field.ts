import { writable } from "svelte/store";
import { GameState, save_minesweeper_game, type MineSweeperData, type TileData } from ".";

export const mineFieldTiles = writable<TileData[]>([]);
export const mineFieldGame = writable<null | MineSweeperData>(null);
export const mineField = writable<null | MineField>(null);
export const mineFieldState = writable<GameState|null>(null);

export const timer = writable<number>(0);

export function reset_all() {
    mineFieldTiles.set([]);
    mineFieldGame.set(null);
    mineField.set(null);
    mineFieldState.set(null);
    timer.set(0);
}

export class Timer {
    private static interval: NodeJS.Timeout | null = null;

    public static start() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(() => {
            timer.update(t => t + 1);
        }, 1000);
    }

    public static running() {
        return this.interval !== null;
    }

    public static stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }

        this.reset();
    }

    public static reset() {
        timer.set(0);
    }

    public static pause() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    public static resume() {
        this.start();
    }


}

export class MineField {
    public game: MineSweeperData;
    private _won: boolean = false;
    
    public on_click(cb: () => void) {
        window.addEventListener("mineclick", (e) => {
            cb();
        });
    }

    constructor(game: MineSweeperData) {        
        this.game = game;
        this.update_stores();
    }

    public init() {
        
    }

    public static destroy() {
        mineField.set(null);
    }

    private update_stores() {
        if(!this.game) return;
        mineFieldTiles.set(this.game.tiles);
        mineFieldGame.set(this.game);
        mineFieldState.set(this.game.state);
        mineField.set(this);
        
        !this._won && this.checkIfWon();
    }

    public get_neighbours(tile: TileData, radius: number = 1) {
        const neighbours: TileData[] = [];
        const { x, y } = tile;

        for (let i = x - radius; i <= x + radius; i++) {
            for (let j = y - radius; j <= y + radius; j++) {
                if (i === x && j === y) continue;
                const neighbour = this.game.tiles.find(tile => tile.x === i && tile.y === j);
                if (neighbour) neighbours.push(neighbour);
            }
        }

        return neighbours;
    }

    public get_neighbour_mines(tile: TileData) {
        return this.get_neighbours(tile).filter(tile => tile.isMine).length;
    }

    public async reveal(tile: TileData) {
        tile.isRevealed = true;
        if (tile.isMine) {
            this.game.state = GameState.Lost;
            await this.explode(tile);
        } else {
            if (this.get_neighbour_mines(tile) === 0) {
                const neighbours = this.get_neighbours(tile);
                for (const neighbour of neighbours) {
                    await new Promise(resolve => setTimeout(resolve, 10));
                    this.update_stores();
                    if (!neighbour.isRevealed) {
                        this.reveal(neighbour);
                    }
                }
            }
        }
        this.update_stores();
        this.save();
        if(!Timer.running()) Timer.start();
        window.dispatchEvent(new CustomEvent("mineclick"));
    }

    public flag(tile: TileData) {
        tile.isFlagged = !tile.isFlagged;
        this.update_stores();
        this.save();
        if(!Timer.running()) Timer.start();
        window.dispatchEvent(new CustomEvent("mineclick"));
    }

    public async explode(tile: TileData) {
        if(Timer.running()) Timer.pause();
        let r = 1;
        window.dispatchEvent(new CustomEvent("mineclick"));
        let not_revealed = this.game.tiles.filter(tile => !tile.isRevealed).length;
        while (not_revealed > 0) {
            const neighbours = this.get_neighbours(tile, r);
            if (neighbours.length === 0) break;
            for (const neighbour of neighbours) {
                if(!neighbour.isRevealed) not_revealed--;
                neighbour.isRevealed = true;
                neighbour.isExploded = true;
            }
            r++;
            this.update_stores();
            window.dispatchEvent(new CustomEvent("mineclick"));
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.game.state = GameState.Lost;
        this.update_stores();
    }

    public async reveal_all() {
        for (const tile of this.game.tiles) {
            tile.isRevealed = true;
            this.update_stores();
        }
    }

    public async checkIfWon() {
        const non_bombs_check = this.game.tiles.filter(tile => !tile.isMine).every(tile => tile.isRevealed);
        const bomb_check = this.game.tiles.filter(tile => tile.isMine).every(tile => tile.isFlagged);
        if (non_bombs_check && bomb_check) {
            this.game.state = GameState.Won;
            this._won = true;
            this.update_stores();

        }
        
    }

    public async pause_and_save() {
        this.game.state = GameState.Paused;
        Timer.pause();
        save_minesweeper_game(this.game);
    }

    public save() {
        save_minesweeper_game(this.game);
    }

    public static reset() {
        console.log("resetting");
        
        mineFieldTiles.set([]);
        mineFieldGame.set(null);
        mineFieldState.set(GameState.Initialising);
        mineField.set(null);
        timer.set(0);
    }
}