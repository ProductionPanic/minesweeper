export type GameSection = any[][];

export interface Game {
    difficulty: number;
    id: string;
    bombs: GameSection;
    revealed: GameSection;
    flagged: GameSection;
    started: boolean;
    ended: boolean;
    won: boolean;
    time: number;
}


export class Games {
    private static get_game_ids() {
        const val = localStorage.getItem('gameids');
        if (!val) {
            return [];
        }

        const split = val.split(',');

        return split.filter(Boolean)
    }

    private static set_game_ids(ids: string[]) {
        localStorage.setItem('gameids', ids.join(','));
    }

    public static add_game_id(id: string) {
        const ids = this.get_game_ids();
        ids.push(id);
        this.set_game_ids(ids);
    }

    public static remove_game_id(id: string) {
        const ids = this.get_game_ids();
        const new_ids = ids.filter((i) => i !== id);
        localStorage.removeItem(id);
        this.set_game_ids(new_ids);
    }

    public static get_game(id: string) {
        const val = localStorage.getItem(id);
        if (!val) {
            return null;
        }

        return JSON.parse(val);
    }

    private static uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }


    public static create_game(difficulty: number) {
        const id = this.uuidv4();
        const game = {
            difficulty,
            id,
            bombs: [],
            revealed: [],
            flagged: [],
            started: false,
            ended: false,
            won: false,
            time: 0,
        };

        localStorage.setItem(id, JSON.stringify(game));
        this.add_game_id(id);

        return game;
    }

    public static update_game(id: string, data: Partial<Game>) {
        const game = this.get_game(id);
        if (!game) {
            return null;
        }

        const new_game = { ...game, ...data };
        localStorage.setItem(id, JSON.stringify(new_game));

        return new_game;
    }
}
