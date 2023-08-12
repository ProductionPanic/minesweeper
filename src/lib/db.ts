import Dexie, { type Table } from 'dexie';

export type json = string;

export interface MinesweeperGame {
    id?: number;
    name: string;
    tiles: {
        x: number;
        y: number;
        bomb: boolean;
        flag: boolean;
        open: boolean;
    }[];
    width: number;
    height: number;
    time: number;
    status: number;
    created: number;
    updated: number;
}


export interface MinesweeperHighscore {
    id?: number;
    name: string;
    time: number;
    created: number;
}

export class MinesweeperDatabase extends Dexie {
    games!: Table<MinesweeperGame>;
    highscores!: Table<MinesweeperHighscore>;

    constructor() {
        super('MinesweeperDatabase');
        this.version(1).stores({
            games: '++id, name, tiles, width, height, time, status, created, updated',
            highscores: '++id, name, time, created'
        });
    }
}

export const db = new MinesweeperDatabase();
