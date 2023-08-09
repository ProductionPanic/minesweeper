<script lang="ts">
    //EmojiRain.svelte

    import { onDestroy, onMount, tick } from "svelte";
    import { browser } from "$app/environment";
    import type { p5 } from "p5";
    export let emojis: string[] = "💣 💀 🧠 💥 🧨 📍 🏴".split(" ");
    export let amount: number = 100;
    export const bg = "#191E24";

    let drops: {
        emoji: string;
        x: number;
        y: number;
        rotation: number;
        rotation_direction: number;
        size: number;
        speed: number;
    }[] = [];

    let canvasContainer: HTMLDivElement;

    onMount(async () => {
        if (!browser) return;
        const p5imoprt = await import("p5");
        const p5 = p5imoprt.default;
        new p5((p: p5) => {
            p.setup = () => {
                p.createCanvas(
                    canvasContainer.clientWidth,
                    canvasContainer.clientHeight
                ).parent(canvasContainer);
                p.background(bg);
                p.noStroke();
                p.textSize(32);
                p.textAlign(p.CENTER, p.CENTER);
                p.textFont("Arial");
                for (let i = 0; i < amount; i++) {
                    drops.push({
                        emoji: emojis[
                            Math.floor(Math.random() * emojis.length)
                        ],
                        x: Math.random() * p.width,
                        y: Math.random() * p.height,
                        rotation: Math.random() * 360,
                        rotation_direction: Math.random() > 0.5 ? 1 : -1,
                        size: Math.random() * 32 + 16,
                        speed: Math.random() * 10 + 5,
                    });
                }
            };

            p.draw = () => {
                p.background(bg);
                for (let i = 0; i < drops.length; i++) {
                    const drop = drops[i];
                    p.push();
                    p.translate(drop.x, drop.y);
                    p.rotate((drop.rotation * p.PI) / 240);
                    p.text(drop.emoji, 0, 0);
                    p.pop();
                    drop.y += drop.speed;
                    drop.rotation += drop.rotation_direction * drop.speed;
                    if (drop.y > p.height) {
                        drop.y = -drop.size;
                        drop.x = Math.random() * p.width;
                    }
                }
            };
        }, canvasContainer);
    });

    onDestroy(() => {
        drops = [];
        canvasContainer && (canvasContainer.innerHTML = "");
    });
</script>

<div class="canvas-container" bind:this={canvasContainer} />

<style>
    .canvas-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
