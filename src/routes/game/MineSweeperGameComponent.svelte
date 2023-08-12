<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import TileElement from "./Tile.svelte";
    import TopBar from "./TopBar.svelte";
    import { goto } from "$app/navigation";

    import { Vibrate } from "$lib/Vibrate";
    import StateDisplay from "./StateDisplay.svelte";
    import { mineFieldGame,  mineFieldTiles, timer, Timer, mineFieldState, MineField } from "$lib/Game/Field";
    import {
        TILE_SIZE,
        set_last_as_current_game,
        type TileData,
    } from "$lib/Game";
    let field: HTMLDivElement;
    export let mineField: MineField;
    let tiles:TileData[] =[];

    $:tiles = mineField.game.tiles;

    onMount(async () => {          
        if($timer > 0) {
            Timer.resume();
        }

        field.style.width = `${$mineFieldGame!.width * TILE_SIZE}px`;
        field.style.height = `${$mineFieldGame!.height * TILE_SIZE}px`;
        field.style.gridTemplateColumns = `repeat(${$mineFieldGame!.width}, 1fr)`;
        field.style.gridTemplateRows = `repeat(${$mineFieldGame!.height}, 1fr)`;

        mineField.on_click(() => sound());
    });

    function pause_and_quit() {
        mineField.pause_and_save();
        goto("/");
    }

    function flag(tile: TileData) {
        mineField.flag(tile);
        Vibrate.medium();
        sound();
    }

    function reveal(tile: TileData) {
        mineField.reveal(tile);
        Vibrate.small();
        sound();
    }

    let sounds = [
        // "/sounds/pop3.mp3",
        // "/sounds/pop2.mp3",
        "/sounds/pop1.mp3",
    ]

    function sound() {
        const audio = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
        audio.play();
    }
</script>

<div class="field-container">
    <TopBar bind:time={$timer} on:leave={pause_and_quit} />
    <div class="field" bind:this={field}>
            {#each tiles as tile}
                <TileElement
                    tile={tile}
                    on:flag={() => flag(tile)}
                    on:reveal={() => reveal(tile)}
                    size={TILE_SIZE}
                />
            {/each}
    </div>
</div>

<StateDisplay />

<style lang="scss">
    .field {
        display: grid;
        user-select: none;
    }

    .field-container {
        @apply min-h-screen flex flex-col;
        display: flex;
        align-items: center;
    }
</style>
