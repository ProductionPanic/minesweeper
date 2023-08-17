import { sleep, timestamp } from "$lib/Utils"
import { db, type MinesweeperGame, type MineSweeperTile } from "$lib/data/db"
import { writable, type Writable } from "svelte/store"
import { TILE_SIZE, type Difficulty, GameState } from "."
import { GameTimer } from "./GameTimer"
import { Sounds } from "$lib/Sounds"
import { addAlert } from "$lib/Alerts"
import { highscores } from "$lib/data/HighScores"

export const tilesStore: Writable<MineSweeperTile[]> = writable([])
export const gameOver: Writable<boolean> = writable(false)
export const gameStatus: Writable<GameState> = writable(0)
export const gameDifficulty: Writable<Difficulty> = writable(0)

export class MinesweeperInstance {
    public id?: number
    public name: string
    public tiles: MineSweeperTile[]
    public width: number
    public height: number
    public time: number
    public status: number
    public created: number
    public updated: number
    public difficulty: number

    constructor(game: MinesweeperGame) {
        if (game.id) this.id = game.id
        this.name = game.name
        this.tiles = game.tiles
        this.width = game.width
        this.height = game.height
        this.time = game.time
        this.status = game.status
        this.created = game.created
        this.updated = game.updated
        this.difficulty = game.difficulty || -1
        gameOver.set(false);
        this.update()
    }

    private update() {
        tilesStore.set(this.tiles);
        // save state to db
        db.games.update(this.id, {
            tiles: this.tiles,
            width: this.width,
            height: this.height,
            time: GameTimer.time,
            status: this.status,
            updated: timestamp(),
        })

        if (this.status === GameState.Won || this.status === GameState.Lost) {
            gameOver.set(true);
        }
        gameStatus.set(this.status)
        gameDifficulty.set(this.difficulty)

    }

    public init(difficulty: Difficulty) {
        const needs_init = this.tiles.length === 0;
        if (!needs_init) return;
        const max_width = window.innerWidth - 20;
        const max_height = window.innerHeight - 100;
        const tile_size = TILE_SIZE;
        const width = Math.floor(max_width / tile_size);
        const height = Math.floor(max_height / tile_size);

        this.width = width;
        this.height = height;
        this.tiles = [];
        for (let i = 0; i < width * height; i++) {
            this.tiles.push({
                x: i % width,
                y: Math.floor(i / width),
                bomb: false,
                flag: false,
                open: false,
                adjacent: 0,
                exploded: false,
            })
        }

        let bomb_ratio = 0.1;
        switch (+difficulty) {
            case 3: // super easy
                bomb_ratio = 0.05;
            case 0: // easy
                bomb_ratio = 0.1;
                break;
            case 1: // medium
                bomb_ratio = 0.15;
                break;
            case 2: // hard
                bomb_ratio = 0.25;
                break;
            case 4: // super hard
                bomb_ratio = 0.35;
            default:
                break;
        }


        let total_bomb_count = Math.floor(this.tiles.length * bomb_ratio);
        while (total_bomb_count > 0) {
            const index = Math.floor(Math.random() * this.tiles.length);
            if (!this.tiles[index].bomb) {
                this.tiles[index].bomb = true;
                total_bomb_count--;
            }
        }

        // calculate adjacent bombs
        for (let i = 0; i < this.tiles.length; i++) {
            const tile = this.tiles[i];
            if (tile.bomb) continue;
            let adjacent = 0;
            for (let x = tile.x - 1; x <= tile.x + 1; x++) {
                for (let y = tile.y - 1; y <= tile.y + 1; y++) {
                    if (x === tile.x && y === tile.y) continue;
                    if (x < 0 || x >= width) continue;
                    if (y < 0 || y >= height) continue;
                    const index = x + y * width;
                    if (this.tiles[index].bomb) adjacent++;
                }
            }
            tile.adjacent = adjacent;
        }

        this.time = 0;
    }



    public static async create(difficulty: Difficulty) {

        const _game = new MinesweeperInstance({
            name: new Date().toLocaleString(),
            tiles: [],
            width: 0,
            height: 0,
            time: 0,
            status: 0,
            created: timestamp(),
            updated: timestamp(),
            difficulty
        })
        _game.init(difficulty)
        const game = await db.games.add(_game)
        return new MinesweeperInstance(game as MinesweeperGame)
    }

    public static async get(id: number) {
        const game = await db.games.get(id)
        return new MinesweeperInstance(game as MinesweeperGame)
    }

    public static async latest() {
        const game = await db.games.orderBy('created').last()
        return new MinesweeperInstance(game as MinesweeperGame)
    }

    public async reveal(tile: MineSweeperTile) {
        if (tile.open || tile.flag) return;
        Sounds.pop();
        tile.open = true;
        if (tile.bomb) {
            this.status = 2;
            this.explodeAnimation(tile);
            GameTimer.pause()
            this.status = GameState.Lost;
            return;
        }
        if (tile.adjacent === 0) {
            for (let x = tile.x - 1; x <= tile.x + 1; x++) {
                await sleep(10);
                for (let y = tile.y - 1; y <= tile.y + 1; y++) {
                    if (x === tile.x && y === tile.y) continue;
                    if (x < 0 || x >= this.width) continue;
                    if (y < 0 || y >= this.height) continue;
                    const index = x + y * this.width;
                    this.reveal(this.tiles[index]);
                }
            }
        }
        this.checkWin();
        this.update();
    }

    public async flag(tile: MineSweeperTile) {
        if (tile.open) return;
        Sounds.pop();
        tile.flag = !tile.flag;
        this.checkWin();
        this.update();
    }

    public async checkWin() {
        const bombs_check = this.tiles.filter(tile => tile.bomb).every(tile => tile.flag);
        const other_check = this.tiles.filter(tile => !tile.bomb).every(tile => tile.open);
        if (bombs_check && other_check) {
            this.status = GameState.Won;
            GameTimer.pause();
            this.update();
            this.saveHighscore();
        }
    }

    private getNeighbours(tile: MineSweeperTile) {
        const neighbours = [];
        for (let x = tile.x - 1; x <= tile.x + 1; x++) {
            for (let y = tile.y - 1; y <= tile.y + 1; y++) {
                if (x === tile.x && y === tile.y) continue;
                if (x < 0 || x >= this.width) continue;
                if (y < 0 || y >= this.height) continue;
                const index = x + y * this.width;
                neighbours.push(this.tiles[index]);
            }
        }
        return neighbours;
    }

    private getDirectNeighbours(tile: MineSweeperTile) {
        const neighbours = [];
        for (let x = tile.x - 1; x <= tile.x + 1; x++) {
            for (let y = tile.y - 1; y <= tile.y + 1; y++) {
                if (x === tile.x && y === tile.y) continue;
                if (x < 0 || x >= this.width) continue;
                if (y < 0 || y >= this.height) continue;
                if (x !== tile.x && y !== tile.y) continue;
                const index = x + y * this.width;
                neighbours.push(this.tiles[index]);
            }
        }
        return neighbours;
    }

    public async explode(tile: MineSweeperTile) {
        const index = this.tiles.indexOf(tile);
        if (index === -1) return;
        tile.exploded = true;
        tile.open = true;
        this.update();
        await sleep(5);
        if (tile.bomb) {
            Sounds.explosion("small");
        }
        tile = this.tiles[index];
        const neighbours = this.getDirectNeighbours(tile);
        const o = [];
        for (let i = 0; i < neighbours.length; i++) {
            const neighbour = neighbours[i];
            if (neighbour.exploded) continue;
            o.push(neighbour);
        }
        await Promise.all(o.map(async (neighbour) => {
            await this.explode(neighbour);
        }));
    }

    public async explodeAnimation(startTile: MineSweeperTile) {
        GameTimer.pause();
        Sounds.explosion("big");
        await sleep(400);
        await this.explode(startTile);
    }

    public async saveHighscore() {
        const idk = await highscores.get().addHighScore({
            name: this.name,
            time: GameTimer.time,
            difficulty: this.difficulty,
            created: timestamp()
        })
        console.log(idk);


        addAlert({
            title: "Saved your result!",
            message: `You finished the game in ${GameTimer.time} seconds!`,
            type: "success"
        })
    }
}