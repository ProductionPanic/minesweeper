<script lang="ts">
    import { browser } from "$app/environment";
    import { animePromise, sleep, wait_for_anime } from "$lib/Utils";
    import { onDestroy, onMount, tick } from "svelte";
    import { tweened } from "svelte/motion";
    import type { Writable } from "svelte/store";
    import anime from "animejs";
    import { check } from "$lib/Alerts";
    import { page } from "$app/stores";

    let rows: number;
    let cols: number;

    interface Block {
        element?: HTMLElement;
    }
    let blocks: Block[] = [];

    let running = true;

    const bomb_svg: string = `<svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 512 512"
                        ><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                            d="M459.1 52.4L442.6 6.5C440.7 2.6 436.5 0 432.1 0s-8.5 2.6-10.4 6.5L405.2 52.4l-46 16.8c-4.3 1.6-7.3 5.9-7.2 10.4c0 4.5 3 8.7 7.2 10.2l45.7 16.8 16.8 45.8c1.5 4.4 5.8 7.5 10.4 7.5s8.9-3.1 10.4-7.5l16.5-45.8 45.7-16.8c4.2-1.5 7.2-5.7 7.2-10.2c0-4.6-3-8.9-7.2-10.4L459.1 52.4zm-132.4 53c-12.5-12.5-32.8-12.5-45.3 0l-2.9 2.9C256.5 100.3 232.7 96 208 96C93.1 96 0 189.1 0 304S93.1 512 208 512s208-93.1 208-208c0-24.7-4.3-48.5-12.2-70.5l2.9-2.9c12.5-12.5 12.5-32.8 0-45.3l-80-80zM200 192c-57.4 0-104 46.6-104 104v8c0 8.8-7.2 16-16 16s-16-7.2-16-16v-8c0-75.1 60.9-136 136-136h8c8.8 0 16 7.2 16 16s-7.2 16-16 16h-8z"
                        /></svg
                    >`;

    const preferredSize = 32;
    onMount(async () => {
        if (!browser) return;
        const { width, height } = document.body.getBoundingClientRect();
        cols = Math.ceil(width / preferredSize);
        rows = Math.ceil(height / preferredSize);

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                blocks.push({});
            }
        }

        blocks = [...blocks];

        await tick();

        animate();
    });

    onDestroy(() => {
        running = false;
    });

    $: if ($page.url.pathname == "/game") {
        running = false;
    }

    async function animate() {
        while (running) {
            const random_block_index = Math.floor(
                Math.random() * blocks.length
            );
            await explosion(random_block_index);
        }
    }

    function hslToHex(h: number, s: number, l: number) {
        l /= 100;
        const a = (s * Math.min(l, 1 - l)) / 100;
        const f = (n) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color)
                .toString(16)
                .padStart(2, "0"); // convert to Hex and prefix "0" if needed
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    function hslStringToHex(hsl: string) {
        const test = /\d+%?\s/g;

        if (!test.test(hsl)) {
            return null;
        }

        let matches = hsl.match(test);

        if (matches?.length !== 3) {
            return null;
        }

        matches = matches.map((i) => i.replaceAll(/[^\d]/gim, ""));

        const [h, s, l] = matches;

        return hslToHex(+h, +s, +l);
    }

    function colors(el: HTMLElement): { default: string; boom: string } {
        const styles = getComputedStyle(el);
        const boomColorHsl = styles.getPropertyValue("--boom-color");
        const blockColorHsl = styles.getPropertyValue("--block-color");

        return {
            default: hslStringToHex(blockColorHsl) ?? "#000",
            boom: hslStringToHex(boomColorHsl) ?? "#fff",
        };
    }

    async function explosion(startIndex: number) {
        const grid = [cols, rows];

        const item = blocks[startIndex].element as HTMLElement;

        item.style.zIndex = "1000";
        item.innerHTML = bomb_svg;
        // rumble
        await animePromise({
            targets: [item],
            keyframes: [
                { rotate: 0, scale: 0 },
                { rotate: 5 },
                { rotate: -5 },
                { rotate: 7 },
                { rotate: -7, scale: 1 },
                { rotate: 10 },
                { rotate: -10 },
                { rotate: 15 },
                { rotate: -15 },
                { rotate: 0 },
            ],
            loop: false,
            duration: 1000,
        });

        // rumble
        await animePromise({
            targets: [item],
            keyframes: [
                { rotate: 0 },
                { rotate: 5 },
                { rotate: -5 },
                { rotate: 7 },
                { rotate: -7 },
                { rotate: 10 },
                { rotate: -10 },
                { rotate: 15 },
                { rotate: -15 },
                { rotate: 0 },
            ],
            loop: false,
            duration: 1000,
        });

        await animePromise({
            targets: [item],
            scale: 2,
            loop: false,
            duration: 500,
        });
        item.innerHTML = "";

        animePromise({
            targets: [item],
            scale: 0.2,
            loop: false,
            duration: 200,
        });

        const _colors = colors(item);
        let animation = anime({
            targets: blocks.map((b) => b.element),
            keyframes: [
                {
                    scale: 0.2,
                    backgroundColor: _colors.boom,
                },
                {
                    scale: 1.5,
                },
                {
                    scale: 0.9,
                },
                {
                    scale: 1,
                    backgroundColor: _colors.default,
                },
            ],
            delay: anime.stagger(30, { grid: [cols, rows], from: startIndex }),
            loop: false,
        });

        await wait_for_anime(animation);

        await animePromise({
            targets: [item],
            scale: 1,
            loop: false,
            duration: 200,
        });

        item.style.zIndex = "inherit";
        item.innerHTML = "";
    }
</script>

<div
    class="bg-container"
    style="--cols: {cols}; --rows: {rows}; --size:{preferredSize}px"
>
    <div class="bg-animation">
        {#each blocks as block}
            <div class="bg-block" bind:this={block.element} />
        {/each}
    </div>
</div>

<style lang="scss">
    :root {
        --block-color: theme("colors.base-100");
        --boom-color: theme("colors.error");
    }

    .bg-container {
        position: fixed;
        left: calc((100vw - (var(--cols) * var(--size))) / 2);
        top: calc((100vh - (var(--rows) * var(--size))) / 2);
        width: 100%;
        height: 100%;
        pointer-events: none;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: -1;
    }

    .bg-animation {
        display: grid;
        grid-template-columns: repeat(var(--cols), 1fr);
        grid-template-rows: repeat(var(--rows), 1fr);
        width: 100%;
        height: 100%;
    }

    .bg-block {
        box-sizing: border-box;
        border: 1px solid theme("colors.base-300");
        background-color: var(--block-color);
        width: var(--size);
        height: var(--size);
        transform: scale(var(--scale));

        @apply flex justify-center items-center fill-error;
    }
</style>
