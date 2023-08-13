<script lang="ts">
    import { goto } from "$app/navigation";
    import { GameTimer } from "$lib/Game/GameTimer";
    import { onMount } from "svelte";
    import MineSweeperTile from "./MineSweeperTile.svelte";
    import TopBar from "./TopBar.svelte";
    import StateDisplay from "./StateDisplay.svelte";
    import { TILE_SIZE } from "$lib/Game";
    import {
        tilesStore,
        type MinesweeperInstance,
        gameOver,
    } from "$lib/Game/Game";

    export let instance: MinesweeperInstance;
    let field: HTMLDivElement;
    let timer = GameTimer.timer;
    let started = false;

    onMount(() => {
        if (GameTimer.time > 0) {
            GameTimer.start(instance.time);
            started = true;
        } else {
            GameTimer.stop();
            timer.set(0);
        }
    });

    $: if (instance && field) {
        field.style.gridTemplateColumns = `repeat(${instance.width}, ${TILE_SIZE}px)`;
        field.style.gridTemplateRows = `repeat(${instance.height}, ${TILE_SIZE}px)`;
    }

    function flag(tile: MineSweeperTile) {
        if ($gameOver) return;
        if (!started) {
            GameTimer.start();
            started = true;
        }
        instance.flag(tile as any);
    }

    function reveal(tile: MineSweeperTile) {
        if ($gameOver) return;
        if (!started) {
            GameTimer.start();
            started = true;
        }
        instance.reveal(tile as any);
    }

    function pause_and_quit() {
        GameTimer.pause();
        goto("/");
    }
</script>

{#if instance && $tilesStore}
    <div class="field-container">
        <TopBar bind:time={$timer} on:leave={pause_and_quit} />
        <div class="field" bind:this={field}>
            {#each $tilesStore as tile}
                <MineSweeperTile
                    size={TILE_SIZE}
                    on:flag={() => flag(tile)}
                    on:reveal={() => reveal(tile)}
                    {tile}
                />
            {/each}
        </div>
    </div>

    <StateDisplay />
{/if}

<style lang="scss">
    .field {
        display: grid;
        user-select: none;
        @apply bg-gray-900 shadow-xl;
    }

    .field-container {
        @apply min-h-screen flex flex-col;
        display: flex;
        align-items: center;
    }
</style>
