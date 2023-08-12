import { writable, type Writable } from "svelte/store";


export class GameTimer {
    public static time: number = 0;
    protected static interval: any;
    public static timer: Writable<number> = writable<number>(0);

    public static start(at: number = 0) {
        this.time = at;
        this.timer.set(this.time);
        this.interval = setInterval(() => {
            this.time++;
            this.update();
        }, 1000);
    }

    private static update() {
        this.timer.set(this.time);
    }

    public static stop() {
        clearInterval(this.interval);
        this.time = 0;
        this.update();
    }

    public static pause() {
        clearInterval(this.interval);
    }

    public static resume() {
        this.interval = setInterval(() => {
            this.time++;
            this.update();
        }, 1000);
    }

}