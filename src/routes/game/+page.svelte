<script lang="ts">
    import { Games, type Game } from "$lib/Games";
    import { onMount } from "svelte";
    import TileElement from "./Tile.svelte";
    import TopBar from "./TopBar.svelte";
    import { goto } from "$app/navigation";
    import { Haptics, ImpactStyle } from "@capacitor/haptics";

    import {
        Board,
        GameState,
        Tile,
        curBoardTiles,
        difficultyMap,
        gameTimer,
    } from "$lib/Board";

    const block_width = 32;

    let row_count = 0;
    let col_count = 0;

    let board: Board;
    let game: Game;

    let field: HTMLDivElement;
    let tiles: {
        x: number;
        y: number;
        bomb: boolean;
        flagged: boolean;
        revealed: boolean;
        bombCount: number;
    }[] = [];

    onMount(() => {
        game = Games.get_current_game();
        if (!game) {
            goto("/");
            return;
        }
        board = new Board(
            game.difficulty as keyof typeof difficultyMap,
            game.bombs,
            game.revealed,
            game.flagged
        );

        field.style.width = `${board.columnCount * block_width}px`;
        field.style.height = `${board.rowCount * block_width}px`;
        field.style.gridTemplateColumns = `repeat(${board.columnCount}, 1fr)`;
        field.style.gridTemplateRows = `repeat(${board.rowCount}, 1fr)`;
    });

    function pause_and_quit() {
        goto("/");
    }

    function flag(tile: Tile) {
        board.flag(tile);
        board.tiles = [...board.tiles];
        Haptics.impact({ style: ImpactStyle.Medium });
    }

    function reveal(tile: Tile) {
        board.reveal(tile);
        board.tiles = [...board.tiles];
        Haptics.impact({ style: ImpactStyle.Light });
    }
</script>

<div class="field-container">
    <TopBar bind:time={$gameTimer} on:leave={pause_and_quit} />
    <div class="field" bind:this={field}>
        {#if board}
            {#each $curBoardTiles as tile}
                <TileElement
                    flagged={tile.flagged}
                    bomb={tile.bomb}
                    number={tile.number ?? 0}
                    revealed={tile.revealed}
                    on:flag={() => flag(tile)}
                    on:reveal={() => reveal(tile)}
                    size={block_width}
                    exploded={tile.exploded}
                />
            {/each}
        {/if}
    </div>
</div>

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
