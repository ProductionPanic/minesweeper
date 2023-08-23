import Dexie, { type Table } from 'dexie';

export type json = string;

export interface MineSweeperTile {
    x: number;
    y: number;
    bomb: boolean;
    flag: boolean;
    open: boolean;
    adjacent: number;
    exploded: boolean;
};

export interface MinesweeperGame {
    id?: number;
    name: string;
    tiles: MineSweeperTile[];
    width: number;
    height: number;
    time: number;
    status: number;
    created: number;
    updated: number;
    difficulty?: number;
}

export interface Option {
    key: string;
    value: string;
    created: number;
    updated: number;
}


export interface MinesweeperHighscore {
    id?: number;
    name: string;
    time: number;
    difficulty: number;
    created: number;
}

export class MinesweeperDatabase extends Dexie {
    games!: Table<MinesweeperGame>;
    highscores!: Table<MinesweeperHighscore>;
    options!: Table<Option>;

    constructor() {
        super('MinesweeperDatabase');
        this.version(5).stores({
            games: '++id, name, tiles, width, height, time, status, created, updated, difficulty',
            highscores: '++id, name, time, created, difficulty',
            options: 'key, value, created, updated',
        });
    }
}

export const db = new MinesweeperDatabase();

