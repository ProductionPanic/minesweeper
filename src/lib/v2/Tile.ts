import type p5 from "p5";
import type { GameContext } from "./MineSweeperGame";
import { sleep } from "$lib/Utils";

export type TileColor = [number, number, number] | [number, number, number, number] | string;



export class Entity {
    public context: GameContext;

    position: p5.Vector;
    size: p5.Vector;
    color: [number, number, number] = [255, 255, 255];
    opacity: number = 255;

    scale: number = 1;
    rotation: number = 0;

    borderColors: [number, number, number] = [0, 0, 0];
    borderOpacity: number = 255;
    tick: number = 0;

    events: {
        [key: string]: Function[];
    } = {};


    emitEvent(event: string, ...args: any[]) {
        if (!this.events[event]) return;
        this.events[event].forEach((callback) => callback(...args));
    }

    private transformations: {
        end: number;
        property: string;
        step: number;
    }[] = [];

    public on(event: string, callback: Function) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback.bind(this));
    }


    constructor(context: GameContext) {
        this.position = context.P5.createVector(0, 0);
        this.size = context.P5.createVector(0, 0);
        this.context = context;
    }

    private update() {
        for (let i = this.tickTransitions.length - 1; i >= 0; i--) {
            const transition = this.tickTransitions[i];
            if (this.tick >= transition.endTick) {
                // @ts-ignore
                this[transition.property] = transition.endValue;
                this.tickTransitions.splice(i, 1);
            } else {
                const progress = (this.tick - transition.startTick) / (transition.endTick - transition.startTick);
                const diff = transition.endValue - transition.startValue;
                // @ts-ignore
                this[transition.property] = transition.startValue + diff * progress;
            }
        }
        this.tick++;
    }

    draw() {
        this.update();

        const { position, color, opacity, borderColors, borderOpacity } = this;

        const { P5 } = this.context;

        P5.fill(...color, opacity);
        // P5.stroke(...borderColors, borderOpacity);

        
        // P5.translate(position.x, position.y);
        if (this.scale !== 1) {
            const size = this.size.copy().mult(this.scale);
            P5.rect(
                position.x - size.x / 2,
                position.y - size.y / 2,
                size.x,
                size.y
            );
        } else {
            P5.rect(this.position.x, this.position.y, this.size.x, this.size.y);
        }


    }

    private tween(property: keyof typeof this, target: number, duration: number) {
        // check if there is already a tween for this property if so, remove it
        for (const [index, transformation] of this.transformations.entries()) {
            const propMatch = transformation.property === property;
            const targetMatch = transformation.step > 0 ? transformation.end < target : transformation.end > target;
            if (propMatch && targetMatch) {
                console.log("removing");
            }
        }
        const val = this[property] as any;
        const amountOfFrames = duration / 1000 * this.context.P5.frameRate();
        const diff = target - val as number;
        const step = diff / amountOfFrames;
        this.transformations.push({
            end: this.tick + amountOfFrames,
            property: property as string,
            step,
        });
    }

    private tickTransitions: {
        startValue: number;
        endValue: number;
        property: string;
        endTick: number;
        startTick: number;
    }[] = [];

    public async transition(map: {
        [key: string]: number;
    }, duration: number = 1000) {
        const amountOfFrames = duration / 1000 * this.context.P5.frameRate();
        const endTick = this.tick + amountOfFrames + 1;
        for (const [key, value] of Object.entries(map)) {
            // @ts-ignore
            const val = this[key] as any;
            this.tickTransitions.push({
                endTick,
                property: key,
                startTick: this.tick,
                startValue: val,
                endValue: value,
            });
        }
        await sleep(duration);
    }

    fade(target: number, duration: number = 1000) {
        target = Math.max(0, Math.min(255, target));
        this.tween("opacity", target, duration);
    }

    fadeIn(duration: number = 1000) {
        this.fade(255, duration);
    }

    fadeOut(duration: number = 1000) {
        this.fade(0, duration);
    }

    borderFade(target: number, duration: number = 1000) {
        target = Math.max(0, Math.min(255, target));
        this.tween("borderOpacity", target, duration);
    }

    borderFadeIn(duration: number = 1000) {
        this.borderFade(255, duration);
    }

    borderFadeOut(duration: number = 1000) {
        this.borderFade(0, duration);
    }

    setColor(color: TileColor) {
        if (typeof color === "string") {
            const _color = this.context.P5.color(color).toString().replaceAll(
                /(rgba|\(|\))/g,
                ""
            );
            const [r, g, b, a] = _color.split(",").map((v) => parseInt(v));
            this.color = [r, g, b];
            if (a) this.opacity = a;
        } else {
            this.color = color.slice(0, 3) as [number, number, number];
            if (color.length === 4) this.opacity = color[3];
        }
    }

    setBorderColor(color: TileColor) {
        if (typeof color === "string") {
            const _color = this.context.P5.color(color).toString().replaceAll(
                /(rgba|\(|\))/g,
                ""
            );
            const [r, g, b, a] = _color.split(",").map((v) => parseInt(v));
            this.borderColors = [r, g, b];
            if (a) this.borderOpacity = a;
        } else {
            this.borderColors = color.slice(0, 3) as [number, number, number];
            if (color.length === 4) this.borderOpacity = color[3];
        }
    }
}