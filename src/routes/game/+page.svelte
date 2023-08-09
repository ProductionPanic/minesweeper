<script lang="ts">
    import { Games, type Game } from "$lib/Games";
    import { onMount } from "svelte";
    import Tile from "./Tile.svelte";
    import TopBar from "./TopBar.svelte";
    import { goto } from "$app/navigation";

    const block_width = 32;

    let row_count = 0;
    let col_count = 0;

    let game: Game;

    let time = 0;
    let time_interval: NodeJS.Timeout;

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

        const max_height = window.innerHeight - 100;
        const max_width = window.innerWidth - 100;

        row_count = Math.floor(max_height / block_width);
        col_count = Math.floor(max_width / block_width);

        field.style.width = `${col_count * block_width}px`;
        field.style.height = `${row_count * block_width}px`;
        field.style.gridTemplateColumns = `repeat(${col_count}, 1fr)`;
        field.style.gridTemplateRows = `repeat(${row_count}, 1fr)`;

        const totalTileCount = row_count * col_count;

        console.log("totalTileCount", totalTileCount);

        for (let i = 0; i < totalTileCount; i++) {
            tiles.push({
                x: i % col_count,
                y: Math.floor(i / col_count),
                bomb: false,
                flagged: false,
                revealed: false,
                bombCount: 0,
            });
        }

        tiles = [...tiles];

        time_interval = setInterval(() => {
            time++;
        }, 1000);
    });

    function pause_and_quit() {
        goto("/");
    }
</script>

<div class="field-container">
    <TopBar bind:time on:leave={pause_and_quit} />
    <div class="field" bind:this={field}>
        {#each tiles as tile}
            <Tile {...tile} size={block_width} />
        {/each}
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
