const difficultyMap = {
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

export class Board {
    public width: number;
    public height: number;
    public tiles: Tile[];
    public bombs: Tile[];
    public revealed: Tile[];
    public flagged: Tile[];
    public state: GameState;
    public time: number;
    public difficulty: keyof typeof difficultyMap;
    public id: string;

    constructor(difficulty: keyof typeof difficultyMap) {
        const { width, height } = Board.calculate_dimensions();
        this.width = width;
        this.height = height;
        this.tiles = [];
        this.bombs = [];
        this.revealed = [];
        this.flagged = [];
        this.state = GameState.Initialising;
        this.time = 0;
        this.difficulty = difficulty;
        this.id = Board.uuidv4();

        this.generate_tiles();
        this.pick_bombs();
    }

    private generate_tiles() {
        const total_tiles = this.width * this.height;
        for (let i = 0; i < total_tiles; i++) {
            const x = i % this.width;
            const y = Math.floor(i / this.width);
            const tile = new Tile(x, y);
            this.tiles.push(tile);
        }
    }

    private pick_bombs() {
        const { bombRatio } = difficultyMap[this.difficulty];
        const total_bombs = Math.floor(this.tiles.length * bombRatio);
        const bomb_tiles = this.tiles.sort(() => Math.random() - Math.random()).slice(0, total_bombs);
        bomb_tiles.forEach((tile) => {

    public static uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        }

    public static calculate_dimensions() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            const block_width = 32;

            const width_blocks = Math.floor(width / block_width);
            const height_blocks = Math.floor(height / block_width);

            return {
                width: width_blocks,
                height: height_blocks,
            }
        }
}

export class Tile {
    public x: number;
    public y: number;
    public bomb: boolean = false;
    public flagged: boolean = false;
    public revealed: boolean = false;
    public adjacent_bombs: number | null = null;

    constructor(x: number, y: number, bomb: boolean = false, flagged: boolean = false, revealed: boolean = false, adjacent_bombs: number | null = null) {
        this.x = x;
        this.y = y;
    }

    public static from_json(json: any) {
        const tile = new Tile(json.x, json.y, json.bomb, json.flagged, json.revealed, json.adjacent_bombs);
        return tile;
    }
}


