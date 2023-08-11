import {
    CapacitorSQLite, SQLiteDBConnection, SQLiteConnection
} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

export class DatabaseHelper {
    public static getConnection() {
        return new SQLiteConnection(CapacitorSQLite);
    }

    public static async getDbConnection(): Promise<SQLiteDBConnection> {
        return await this.getConnection()
            .createConnection("db", false, "no-encryption", 1, false);
    }

    public static async createTables() {
        const conn = await this.getDbConnection();
        await conn.open();
        // instances
        await conn.execute(`
            CREATE TABLE IF NOT EXISTS gameInstances (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                state TEXT NOT NULL,
                board TEXT NOT NULL,
                time INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        `);
        // highscores
        await conn.execute(`
            CREATE TABLE IF NOT EXISTS highscores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                time INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        `);

        await conn.close();

        return true;
    }

    public static async dropTables() {
        const conn = await this.getDbConnection();
        await conn.open();
        await conn.execute(`DROP TABLE IF EXISTS gameInstances`);
        await conn.execute(`DROP TABLE IF EXISTS highscores`);
        await conn.close();

        return true;
    }

    public static async clearTables() {
        const conn = await this.getDbConnection();
        await conn.open();
        await conn.execute(`DELETE FROM gameInstances`);
        await conn.execute(`DELETE FROM highscores`);
        await conn.close();

        return true;
    }
}


export class GameInstance {
    public id: number;
    public state: string;
    public board: string;
    public time: number;
    public created_at: string;
    public updated_at: string;

    constructor(id: number, state: string, board: string, time: number, created_at: string, updated_at: string) {
        this.id = id;
        this.state = state;
        this.board = board;
        this.time = time;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    public static async create(state: any, board: any, time: number) {
        state = JSON.stringify(state);
        board = JSON.stringify(board);

        const conn = await DatabaseHelper.getDbConnection();
        await conn.open();
        const now = new Date().toISOString();
        const res = await conn.execute(`
            INSERT INTO gameInstances (state, board, time, created_at, updated_at)
            VALUES (${state}, ${board}, ${time}, ${now}, ${now})
        `);
        await conn.close();
        return new GameInstance(res.changes!.lastId!, state, board, time, now, now);
    }

    private static parseResult(res: any) {
        return new GameInstance(
            res.id,
            JSON.parse(res.state),
            JSON.parse(res.board),
            res.time,
            res.created_at,
            res.updated_at
        );
    }

    public static async find(id: number) {
        const conn = await DatabaseHelper.getDbConnection();
        await conn.open();
        const res = await conn.query(`
            SELECT * FROM gameInstances WHERE id = ${id}
        `);
        await conn.close();
        if (res!.values!.length === 0) {
            return null;
        }
        return this.parseResult(res!.values![0]);
    }

    public static async all() {
        const conn = await DatabaseHelper.getDbConnection();
        await conn.open();
        const res = await conn.query(`
            SELECT * FROM gameInstances
        `);
        await conn.close();
        return res!.values!.map((r: any) => this.parseResult(r));
    }

    public async update() {
        const conn = await DatabaseHelper.getDbConnection();
        await conn.open();
        const now = new Date().toISOString();
        await conn.execute(`
            UPDATE gameInstances
            SET state = ${JSON.stringify(this.state)},
                board = ${JSON.stringify(this.board)},
                time = ${this.time},
                updated_at = ${now}
            WHERE id = ${this.id}
        `);
        await conn.close();
        this.updated_at = now;
    }

    public async delete() {
        const conn = await DatabaseHelper.getDbConnection();
        await conn.open();
        await conn.execute(`
            DELETE FROM gameInstances WHERE id = ${this.id}
        `);
        await conn.close();
    }

    public async save() {
        if (this.id) {
            await this.update();
        } else {
            const res = await GameInstance.create(this.state, this.board, this.time);
            this.id = res.id;
            this.created_at = res.created_at;
            this.updated_at = res.updated_at;
        }
    }
}