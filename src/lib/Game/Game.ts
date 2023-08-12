import { db, type MinesweeperGame, type MineSweeperTile } from "$lib/data/db"
import { TILE_SIZE, type Difficulty } from "."


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

    constructor(game: MinesweeperGame) {
        if(game.id) this.id = game.id
        this.name = game.name
        this.tiles = game.tiles
        this.width = game.width
        this.height = game.height
        this.time = game.time
        this.status = game.status
        this.created = game.created
        this.updated = game.updated


    }

    public init(difficulty: Difficulty) {
        const needs_init = this.tiles.length === 0;
        if(!needs_init) return;
        const max_width = window.innerWidth - 50;
        const max_height = window.innerHeight - 100;
        const tile_size = TILE_SIZE;
        const width = Math.floor(max_width / tile_size);
        const height = Math.floor(max_height / tile_size);

        this.width = width;
        this.height = height;
        this.tiles = [];
        for(let i = 0; i < width * height; i++) {
            this.tiles.push({
                x: i % width,
                y: Math.floor(i / width),
                bomb: false,
                flag: false,
                open: false,
                adjacent: 0
            })
        }

        let bomb_ratio = 0.1;
        switch(difficulty) {
            case 0: // easy
                bomb_ratio = 0.1;
                break;
            case 1: // medium
                bomb_ratio = 0.2;
                break;
            case 2: // hard
                bomb_ratio = 0.3;
                break;     
                default:
                    break;
        }
            
        let total_bomb_count = Math.floor(this.tiles.length * bomb_ratio);
        while(total_bomb_count > 0) {
            const index = Math.floor(Math.random() * this.tiles.length);
            if(!this.tiles[index].bomb) {
                this.tiles[index].bomb = true;
                total_bomb_count--;
            }
        }

        // calculate adjacent bombs
        for(let i = 0; i < this.tiles.length; i++) {
            const tile = this.tiles[i];
            if(tile.bomb) continue;
            let adjacent = 0;
            for(let x = tile.x - 1; x <= tile.x + 1; x++) {
                for(let y = tile.y - 1; y <= tile.y + 1; y++) {
                    if(x === tile.x && y === tile.y) continue;
                    if(x < 0 || x >= width) continue;
                    if(y < 0 || y >= height) continue;
                    const index = x + y * width;
                    if(this.tiles[index].bomb) adjacent++;
                }
            }
            tile.adjacent = adjacent;
        }

        this.time = 0;
        this.created = Date.now();
        this.updated = Date.now();
    }   



    public static async create(difficulty: Difficulty) {
        const _game = new MinesweeperInstance({
            name: new Date().toLocaleString(),
            tiles: [],
            width: 0,
            height: 0,
            time: 0,
            status: 0,
            created: Date.now(),
            updated: Date.now()
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

    
}