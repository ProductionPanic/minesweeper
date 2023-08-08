<script lang="ts">
    //EmojiRain.svelte

    import { onMount, tick } from "svelte";

    export let emojis = "💣 💀 🧠 💥 🧨 📍 🏴".split(" ");
    export let amount = 100;

    let drops: {
        emoji: string;
        x: number;
        y: number;
        rotation: number;
        rotation_direction: number;
        size: number;
        speed: number;
    }[] = [];

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let loaded = false;

    onMount(async () => {
        loaded = true;

        await tick();

        init();
    });

    function init() {
        // initialize canvas
        ctx = canvas.getContext("2d")!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // create drops
        for (let i = 0; i < amount; i++) {
            drops.push({
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                rotation: Math.random() * 360,
                rotation_direction: Math.random() > 0.5 ? 1 : -1,
                size: Math.random() * 20 + 10,
                speed: Math.random() * 1 + 5,
            });
        }

        // start animation
        requestAnimationFrame(animate);
    }

    function animate() {
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw drops
        for (let i = 0; i < drops.length; i++) {
            const drop = drops[i];

            // draw drop
            ctx.save();
            ctx.font = `${drop.size}px serif`;
            ctx.translate(drop.x, drop.y);
            ctx.rotate((drop.rotation * Math.PI) / 180);
            ctx.fillText(drop.emoji, 0, 0);
            ctx.restore();

            // update drop
            drop.y += drop.speed;
            drop.rotation += (drop.speed / 10) * drop.rotation_direction;

            // reset drop
            if (drop.y > canvas.height) {
                drop.y = -drop.size;
                drop.x = Math.random() * canvas.width;
                drop.rotation = Math.random() * 360;
                drop.rotation_direction = Math.random() > 0.5 ? 1 : -1;
            }
        }

        // loop animation
        requestAnimationFrame(animate);
    }
</script>

{#if loaded}
    <canvas bind:this={canvas} />
{/if}

<style>
    canvas {
        z-index: -1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
