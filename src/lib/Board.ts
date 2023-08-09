import { writable } from "svelte/store";
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const difficultyMap = {
    0: {
        bombRatio: 0.1,
    },
    1: {
        bombRatio: 0.2,
    },
    2: {
        bombRatio: 0.3,
    },
}

export enum GameState {
    Initialising,
    Playing,
    Won,
    Lost,
    Error,
    unknown,
}

const block_width = 32;

export const curBoardTiles = writable<Tile[]>([]);
export const gameTimer = writable<number>(0);

class Timer {
    private static time: number = 0;
    private static interval: NodeJS.Timeout;

    static start() {
        this.interval = setInterval(() => {
            this.time++;
            gameTimer.set(this.time);
        }, 1000);
    }

    static stop() {
        clearInterval(this.interval);
    }

    static reset() {
        this.stop();
        this.time = 0;
        this.start();
    }

    static pause() {
        this.stop();
    }

    static resume() {
        this.start();
    }
}

export class Board {
    public tiles: Tile[] = [];
    public difficulty: keyof typeof difficultyMap;
    public state: GameState;
    public rowCount: number;
    public columnCount: number;
    public paddingX: number = 25;
    public paddingY: number = 100;

    constructor(difficulty: keyof typeof difficultyMap, bombs: string[] = [], revealed: string[] = [], flagged: string[] = []) {
        this.difficulty = difficulty;
        this.state = GameState.Initialising;

        this.rowCount = Math.floor((window.innerHeight - this.paddingY) / block_width);
        this.columnCount = Math.floor((window.innerWidth - this.paddingX) / block_width);

        if (bombs.length === 0) {
            bombs = this.insert_bombs();
        }

        this.generate_tiles(bombs, revealed, flagged);
        this.add_counts();

        curBoardTiles.set(this.tiles);

        Timer.reset();
    }

    private insert_bombs() {
        const total_amount = this.rowCount * this.columnCount;
        const bomb_amount = Math.floor(total_amount * difficultyMap[this.difficulty].bombRatio);
        const bombs: string[] = [];
        for (let i = 0; i < bomb_amount; i++) {
            const x = Math.floor(Math.random() * this.columnCount);
            const y = Math.floor(Math.random() * this.rowCount);
            const coords = `${x},${y}`;
            if (bombs.includes(coords)) {
                i--;
                continue;
            }
            bombs.push(coords);
        }
        return bombs;
    }

    private generate_tiles(bombs: string[], revealed: string[], flagged: string[]) {
        const total_amount = this.rowCount * this.columnCount;
        for (let i = 0; i < total_amount; i++) {
            const x = i % this.columnCount;
            const y = Math.floor(i / this.columnCount);
            const coords = `${x},${y}`
            const is_bomb = bombs.includes(coords);
            const is_revealed = revealed.includes(coords);
            const is_flagged = flagged.includes(coords);
            const tile = new Tile(x, y, is_bomb, is_flagged, is_revealed);
            this.tiles.push(tile);
        }
    }

    private add_counts() {
        this.tiles.forEach((tile) => {
            const adjacent_tiles = this.get_adjacent_tiles(tile.x, tile.y);
            const adjacent_bombs = adjacent_tiles.filter((t) => t.bomb).length;
            tile.number = adjacent_bombs;
        });
    }

    public get_tile(x: number, y: number) {
        const index = this.coord_to_index(x, y);
        return this.tiles[index];
    }

    public get_adjacent_tiles(x: number, y: number) {
        const adjacent_tiles: Tile[] = [];
        const adjacent_coords = [
            [x - 1, y - 1],
            [x, y - 1],
            [x + 1, y - 1],

            [x - 1, y],
            [x + 1, y],

            [x - 1, y + 1],
            [x, y + 1],
            [x + 1, y + 1],
        ];

        adjacent_coords.forEach(([x, y]) => {
            if (x < 0 || x >= this.columnCount) {
                return;
            }
            if (y < 0 || y >= this.rowCount) {
                return;
            }
            const tile = this.get_tile(x, y);
            adjacent_tiles.push(tile);
        });

        return adjacent_tiles;
    }

    private coord_to_index(x: number, y: number) {
        return x + (y * this.columnCount);
    }


    flag(tile: Tile) {
        if (tile.revealed) return;
        tile.flagged = !tile.flagged;
        this.checkWon();
        this.updateStore();
    }

    reveal(tile: Tile) {
        if (tile.flagged) {
            return;
        }
        if (tile.revealed) {
            return;
        }
        tile.revealed = true;
        if (tile.bomb) {
            this.state = GameState.Lost;
            Timer.pause();
            tile.exploded = true;

            this.explode(tile);
            return;
        }
        if (tile.number === 0) {
            const adjacent_tiles = this.get_adjacent_tiles(tile.x, tile.y);
            adjacent_tiles.forEach((t) => !t.revealed && this.reveal(t));
        }
        this.checkWon();
        this.updateStore();
    }

    getTilesInRadius(tile: Tile, radius: number) {
        const tiles: Tile[] = [];
        for (let x = tile.x - radius; x <= tile.x + radius; x++) {
            for (let y = tile.y - radius; y <= tile.y + radius; y++) {
                if (x < 0 || x >= this.columnCount) {
                    continue;
                }
                if (y < 0 || y >= this.rowCount) {
                    continue;
                }
                const t = this.get_tile(x, y);
                tiles.push(t);
            }
        }
        return tiles;
    }

    async explode(causer: Tile) {
        let r = 1;
        let tiles_left = this.columnCount * this.rowCount - 1;
        while (tiles_left > 0) {
            // console.log(r);
            const tiles = this.getTilesInRadius(causer, r);
            console.log(tiles.length);

            tiles.forEach((t) => {
                if (!t.exploded) {
                    tiles_left--;
                    if (t.bomb) {
                        Haptics.impact({ style: ImpactStyle.Heavy });
                    }
                }
                t.exploded = true;
                t.revealed = true;
                // this.reveal(t);
            });
            this.tiles = [...this.tiles];
            this.updateStore();
            await this.sleep(200);
            r++;
        }
    }

    async sleep(time: number) {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    checkWon() {
        const unflagged_bombs = this.tiles.filter((t) => t.bomb && !t.flagged).length;
        const unflagged_tiles = this.tiles.filter((t) => !t.revealed).length;
        if (unflagged_bombs === 0 && unflagged_tiles === 0) {
            this.state = GameState.Won;
            Timer.pause();
        }

        this.updateStore();
    }

    updateStore() {
        curBoardTiles.set(this.tiles);
    }
}

export class Tile {
    public x: number;
    public y: number;
    public bomb: boolean = false;
    public flagged: boolean = false;
    public revealed: boolean = false;
    public number: number | null = null;
    public exploded: boolean = false;

    constructor(x: number, y: number, bomb: boolean = false, flagged: boolean = false, revealed: boolean = false, adjacent_bombs: number | null = null) {
        this.x = x;
        this.y = y;
        this.bomb = bomb;
        this.flagged = flagged;
        this.revealed = revealed;
        this.number = adjacent_bombs;
    }

    public static from_json(json: any) {
        const tile = new Tile(json.x, json.y, json.bomb, json.flagged, json.revealed, json.adjacent_bombs);
        return tile;
    }
}


