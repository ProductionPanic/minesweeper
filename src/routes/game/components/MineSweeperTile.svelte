<script lang="ts">
    import type { TileData } from "$lib/Game";
    import { mineField } from "$lib/Game/Field";
    import type { MineSweeperTile } from "$lib/data/db";
    import { createEventDispatcher } from "svelte";

    export let size: number = 32;
    export let tile: MineSweeperTile;

    const dispatch = createEventDispatcher();

    let _mousedown = false;
    let _mousedown_timeout: NodeJS.Timeout;
    let boom = false;

    function mousedown() {
        _mousedown = true;
        _mousedown_timeout = setTimeout(() => {
            if (!_mousedown) return;
            _mousedown = false;
            !tile.open && dispatch("flag");
        }, 500);
    }

    function mouseup() {
        if (_mousedown && !tile.flag) {
            dispatch("reveal");
            if (tile.bomb) {
                boom = true;
            }
        }
        _mousedown = false;
    }
</script>

<button
    class="tile number-{tile.adjacent}"
    style="--size:{size}px"
    on:pointerdown={mousedown}
    on:pointerup={mouseup}
    on:contextmenu={(e) => e.preventDefault()}
    class:revealed={tile.open}
    class:flagged={tile.flag}
    class:bomb={tile.bomb}
    class:exploded={tile.exploded && !boom}
    class:boom
>
    <div class="tile-content">
        {#if tile.open}
            {#if tile.bomb}
                <div class="bomb">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 512 512"
                        ><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                            d="M459.1 52.4L442.6 6.5C440.7 2.6 436.5 0 432.1 0s-8.5 2.6-10.4 6.5L405.2 52.4l-46 16.8c-4.3 1.6-7.3 5.9-7.2 10.4c0 4.5 3 8.7 7.2 10.2l45.7 16.8 16.8 45.8c1.5 4.4 5.8 7.5 10.4 7.5s8.9-3.1 10.4-7.5l16.5-45.8 45.7-16.8c4.2-1.5 7.2-5.7 7.2-10.2c0-4.6-3-8.9-7.2-10.4L459.1 52.4zm-132.4 53c-12.5-12.5-32.8-12.5-45.3 0l-2.9 2.9C256.5 100.3 232.7 96 208 96C93.1 96 0 189.1 0 304S93.1 512 208 512s208-93.1 208-208c0-24.7-4.3-48.5-12.2-70.5l2.9-2.9c12.5-12.5 12.5-32.8 0-45.3l-80-80zM200 192c-57.4 0-104 46.6-104 104v8c0 8.8-7.2 16-16 16s-16-7.2-16-16v-8c0-75.1 60.9-136 136-136h8c8.8 0 16 7.2 16 16s-7.2 16-16 16h-8z"
                        /></svg
                    >
                </div>
            {:else if tile.adjacent > 0}
                <div class="number">{tile.adjacent}</div>
            {/if}
        {:else if tile.flag}
            <div class="flag">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 448 512"
                    ><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                        d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z"
                    /></svg
                >
            </div>
        {/if}
    </div>
</button>

<style lang="scss">
    .tile {
        @apply flex items-center justify-center rounded-md;
        @apply bg-gray-800;
        @apply border border-gray-900;
        @apply cursor-pointer;
        @apply transition-all;
        @apply relative;
        @apply overflow-hidden;
        @apply shadow;

        width: var(--size);
        height: var(--size);

        &.revealed {
            @apply bg-gray-900;

            &.number-1 {
                @apply text-blue-500;
            }
            &.number-2 {
                @apply text-green-500;
            }
            &.number-3 {
                @apply text-red-500;
            }
            &.number-4 {
                @apply text-purple-500;
            }
            &.number-5 {
                @apply text-yellow-500;
            }
            &.number-6 {
                @apply text-pink-500;
            }
            &.number-7 {
                @apply text-gray-500;
            }
            &.number-8 {
                @apply text-gray-300;
            }
        }
        &.revealed.bomb {
            svg {
                fill: theme("colors.red.600");
            }
        }
        &.exploded {
            &:not(.bomb) {
                animation: bomb 0.5s ease-in-out;
            }
            &.bomb {
                animation: bomb_boom 0.5s ease-in-out;
            }
        }
        &.flagged {
            @apply bg-gray-600;
        }
    }

    .tile-content {
        @apply flex items-center justify-center;
        @apply w-full h-full;
    }
    .tile .bomb {
        @apply flex items-center justify-center;
        @apply w-full h-full;
    }

    .tile .number {
        @apply flex items-center justify-center;
        @apply w-full h-full;
        @apply text-2xl;
    }

    .tile .flag {
        @apply flex items-center justify-center;
        @apply w-full h-full;
    }

    .tile .flag svg {
        fill: theme("colors.white");
    }

    @keyframes bomb {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.5);
        }
        100% {
            transform: scale(1);
        }
    }
    @keyframes bomb_boom {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(2);
        }
        100% {
            transform: scale(1);
        }
    }

    .tile.boom {
        animation: chargeupboom 0.5s ease-in-out;
    }

    @keyframes chargeupboom {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.8);
        }
        55% {
            transform: scale(2.5);
        }
        100% {
            transform: scale(1);
        }
    }
</style>
