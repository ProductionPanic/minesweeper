<script lang="ts">
    import { Games, type Game } from "$lib/Games";
    import { onDestroy, onMount } from "svelte";
    import TileElement from "./Tile.svelte";
    import TopBar from "./TopBar.svelte";
    import { goto } from "$app/navigation";

    import {
        Board,
        GameState,
        Tile,
        curBoardTiles,
        difficultyMap,
        gameTimer,
    } from "$lib/Board";
    import { Vibrate } from "$lib/Vibrate";
    import StateDisplay from "./StateDisplay.svelte";
    import { mineFieldGame, mineField, mineFieldTiles } from "$lib/Game/Field";
    import {
        TILE_SIZE,
        set_last_as_current_game,
        type TileData,
    } from "$lib/Game";
    let field: HTMLDivElement;

    onMount(() => {
        const game = $mineFieldGame;
        if (!game) {
            set_last_as_current_game();
            goto("/");
            return;
        }

        field.style.width = `${game.width * TILE_SIZE}px`;
        field.style.height = `${game.height * TILE_SIZE}px`;
        field.style.gridTemplateColumns = `repeat(${game.width}, 1fr)`;
        field.style.gridTemplateRows = `repeat(${game.height}, 1fr)`;
    });

    function pause_and_quit() {
        goto("/");
    }

    function flag(tile: TileData) {
        $mineField?.flag(tile);
        Vibrate.medium();
    }

    function reveal(tile: TileData) {
        $mineField?.reveal(tile);
        Vibrate.small();
    }

    onDestroy(() => {
        $mineField?.pause_and_save();
    });
</script>

<div class="field-container">
    <TopBar bind:time={$gameTimer} on:leave={pause_and_quit} />
    <div class="field" bind:this={field}>
        {#if $mineField}
            {#each $mineFieldTiles as tile}
                <TileElement
                    flagged={tile.isFlagged}
                    bomb={tile.isMine}
                    number={$mineField.get_neighbour_mines(tile)}
                    revealed={tile.isRevealed}
                    on:flag={() => flag(tile)}
                    on:reveal={() => reveal(tile)}
                    size={TILE_SIZE}
                    exploded={tile.isExploded}
                />
            {/each}
        {/if}
    </div>
</div>

<StateDisplay />

<style lang="scss">
    .field {
        display: grid;
    }

    .field-container {
        @apply min-h-screen flex flex-col;
        display: flex;
        align-items: center;
    }
</style>
