import { getContext, setContext } from "svelte";
import type p5 from 'p5';
import type { Vector } from "p5";
import { sleep } from "$lib/Utils";
import { Entity } from "./Tile";

export interface GameContext {
    P5: p5;
    container: HTMLElement;
    tiles: Tile[];
    cols: number;
    rows: number;
    padding: { x: number, y: number };
    tileSize: number;
}

export let store: GameContext;

class FrameCheckpoint {
    start: number;

    constructor() {
        this.start = store.P5.frameCount;
    }

    framesPassed() {
        return store.P5.frameCount - this.start;
    }

    msPassed() {
        return this.framesPassed() * 1000 / store.P5.frameRate();
    }

    reset() {
        this.start = store.P5.frameCount;
    }

    afterFrames(frames: number) {
        return this.framesPassed() >= frames;
    }

    afterMs(ms: number) {
        return this.msPassed() >= ms;
    }

    static get() {
        return new FrameCheckpoint();
    }
}

let container_el: HTMLElement;

export async function MineSweeperGame(_container: HTMLElement) {
    const P5 = (await import("p5")).default as any;
    container_el = _container;
    // create p5 instance
    const p5Instance: p5 = new P5(startGame, container_el);

    return {
        destroy() {
            p5Instance.remove();
        },
    }
}

class Tile extends Entity {
    index!: number;

    exploded: boolean = false;


    constructor(context: GameContext) {
        super(context);
    }

    setup() {
        this.index = this.context.tiles.indexOf(this);
        const _x = this.index % this.context.cols;
        const _y = Math.floor(this.index / this.context.cols);
        const actualX = _x * this.context.tileSize + this.context.padding.x;
        const actualY = _y * this.context.tileSize + this.context.padding.y;
        this.position = this.context.P5.createVector(actualX, actualY);
        this.size = this.context.P5.createVector(this.context.tileSize, this.context.tileSize);

        this.color = [255, 255, 255];
        this.borderColors = [40, 40, 40];

        this.on("tile:click", this.onClick);
    }

    private getNeighbors(type: "direct" | "diagonal" | "all" = "all") {
        const direct = [this.index - 1, this.index + 1, this.index - this.context.cols, this.index + this.context.cols];
        const diagonal = [this.index - this.context.cols - 1, this.index - this.context.cols + 1, this.index + this.context.cols - 1, this.index + this.context.cols + 1];
        const check = type === "direct" ? direct : type === "diagonal" ? diagonal : direct.concat(diagonal);

        return check.filter((index) => {
            const boundsCheck = index >= 0 && index < this.context.tiles.length;
            const xCheck = Math.abs(index % this.context.cols - this.index % this.context.cols) <= 1;
            const yCheck = Math.abs(Math.floor(index / this.context.cols) - Math.floor(this.index / this.context.cols)) <= 1;
            return boundsCheck && xCheck && yCheck;
        }).map((index) => {
            return this.context.tiles[index];
        });
    }

    async onClick() {
        this.explode();
    }

    async explode(after: number = 0) {
        after && await sleep(after);
        if (this.exploded) return;
        this.exploded = true;
        const dur = 200;
        await this.transition({
            scale: 0.5,
        }, 2 * dur);
        await this.transition({
            scale: 0.8,
        }, 1 * dur)
        for (const tile of this.getNeighbors("all")) {
            tile.explode();
        }
        await this.transition({
            scale: 1.6,
        }, 10 * dur)
        await this.transition({
            scale: 1.8,
        }, 2 * dur)
        await this.transition({
            scale: 1,
            rotation: 180
        }, 20 * dur)
        await sleep(dur)
        this.exploded = false;
        this.opacity = 255;
        this.scale = 1;
    }
}

function startGame(p: p5) {
    store = {
        P5: p,
        container: container_el,
        tiles: [],
        cols: 0,
        rows: 0,
        padding: { x: 50, y: 100 },
        tileSize: 32,
    }

    const { P5, container, padding, tileSize } = store;

    P5.setup = () => {
        P5.createCanvas(container.offsetWidth, container.offsetHeight);
        store.cols = Math.floor((P5.width - padding.x * 2) / tileSize);
        store.rows = Math.floor((P5.height - padding.y * 2) / tileSize);
        P5.frameRate(60);

        for (let y = 0; y < store.rows; y++) {
            for (let x = 0; x < store.cols; x++) {
                store.tiles.push(new Tile(store));
                store.tiles[store.tiles.length - 1].setup();
            }
        }
    }

    P5.draw = () => {
        P5.background(0);
        for (const tile of store.tiles) {
            tile.draw();
        }
    }

    P5.mouseClicked = async () => {
        const relX = P5.mouseX - padding.x;
        const relY = P5.mouseY - padding.y;
        const x = Math.floor(relX / tileSize);
        const y = Math.floor(relY / tileSize);
        const index = x + y * store.cols;

        if (index < 0 || index >= store.tiles.length) return;

        const tile = store.tiles[index];
        tile && tile.emitEvent("tile:click");
        // tile.scale = 0.5
    }
}