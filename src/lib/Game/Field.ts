import { writable } from "svelte/store";
import { GameState, save_minesweeper_game, type MineSweeperData, type TileData } from ".";

export const mineFieldTiles = writable<TileData[]>([]);
export const mineFieldGame = writable<null | MineSweeperData>(null);
export const mineField = writable<null | MineField>(null);

export class MineField {
    private game: MineSweeperData;

    constructor(game: MineSweeperData) {
        this.game = game;
    }

    public init() {
        this.update_stores();
    }

    private update_stores() {
        console.log(this.game)
        if (!this.game) return;
        mineFieldTiles.set(this.game.tiles);
        mineFieldGame.set(this.game);
        mineField.set(this);
        this.checkIfWon();
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
                this.get_neighbours(tile).forEach(neighbour => {
                    if (!neighbour.isRevealed) {
                        this.reveal(neighbour);
                    }
                });
            }
        }
        this.update_stores();
    }

    public flag(tile: TileData) {
        tile.isFlagged = !tile.isFlagged;
        this.update_stores();
    }

    public async explode(tile: TileData) {
        const max_dimension = Math.max(this.game.width, this.game.height);
        let r = 1;
        while (true) {
            const neighbours = this.get_neighbours(tile, r);
            if (neighbours.length === 0) break;
            for (const neighbour of neighbours) {
                neighbour.isRevealed = true;
            }
            r++;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    public async reveal_all() {
        for (const tile of this.game.tiles) {
            tile.isRevealed = true;
            this.update_stores();
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

    public async checkIfWon() {
        const non_bombs_check = this.game.tiles.filter(tile => !tile.isMine).every(tile => tile.isRevealed);
        const bomb_check = this.game.tiles.filter(tile => tile.isMine).every(tile => tile.isFlagged);
        if (non_bombs_check && bomb_check) {
            this.game.state = GameState.Won;
            await this.reveal_all();
        }
    }

    public async pause_and_save() {
        this.game.state = GameState.Paused;
        save_minesweeper_game(this.game);
    }
}