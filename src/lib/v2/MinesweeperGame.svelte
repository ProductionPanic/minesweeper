<script lang="ts">
    import { animePromise, sleep } from "$lib/Utils";
    import anime from "animejs";
    import { onMount, tick } from "svelte";

    enum TileType {
        Empty,
        Bomb,
        Number,
    }

    enum TileState {
        Hidden,
        Flagged,
        Revealed,
        exploded,
    }

    interface Tile {
        element: HTMLDivElement | null;
        x: number;
        y: number;
        type: TileType;
        state: TileState;
        number: number;
        distanceFromExplosion?: number;
        tick?: number;
    }

    const tile_size = 32;
    let field_container: HTMLDivElement;
    let cols: number;
    let rows: number;
    let tiles: Tile[] = [];

    onMount(() => {
        const width = field_container.clientWidth;
        const height = field_container.clientHeight;

        cols = Math.floor(width / tile_size);
        rows = Math.floor(height / tile_size);

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                tiles.push({
                    element: null,
                    x,
                    y,
                    type: TileType.Empty,
                    state: TileState.Hidden,
                    number: 0,
                });
            }
        }

        tiles = [...tiles];
    });

    async function explode(tile: HTMLElement | number | Tile) {
        let index = -1;
        if (typeof tile === "number") {
            index = tile;
        } else if (tile instanceof HTMLElement) {
            index = tiles.findIndex((t) => t.element === tile);
        } else {
            index = tiles.findIndex((t) => t === tile);
        }

        if (index === -1) return;

        field_container.style.setProperty(
            "--explosion-source-x",
            `${tiles[index].x * tile_size}px`
        );
        field_container.style.setProperty(
            "--explosion-source-y",
            `${tiles[index].y * tile_size}px`
        );

        tiles = tiles.map((i) => {
            const distance = Math.sqrt(
                Math.pow(i.x - tiles[index].x, 2) +
                    Math.pow(i.y - tiles[index].y, 2)
            );
            i.distanceFromExplosion = distance;
            i.state = TileState.exploded;
            i.tick = i.tick ? i.tick + 1 : 1;
            return i;
        });
    }

    async function tileClick(tile: Tile) {
        await explode(tile);
    }
</script>

<div class="field-container" bind:this={field_container}>
    <div
        class="field-tiles-wrapper"
        style="
            --width: {cols * tile_size}px;
            --height: {rows * tile_size}px;
            --cols: {cols};
            --rows: {rows};
        "
    >
        {#each tiles as tile}
            {#key tile.tick}
                <div
                    role="button"
                    tabindex="0"
                    on:keyup={() => {}}
                    on:click={() => tileClick(tile)}
                    class="field-tile"
                    style="
                    --x: {tile.x * tile_size}px;
                    --y: {tile.y * tile_size}px;
                    --distance: {tile.distanceFromExplosion ?? 0};
                    --size: {tile_size}px;
                "
                    bind:this={tile.element}
                    class:exploded={tile.state === TileState.exploded}
                >
                    {#if tile.state == TileState.Revealed}
                        {#if tile.type == TileType.Bomb}
                            <div class="field-tile-bomb">
                                <div class="field-tile-bomb-inner" />
                            </div>
                        {:else if tile.type == TileType.Number}
                            <div class="field-tile-number">{tile.number}</div>
                        {/if}
                    {/if}
                </div>
            {/key}
        {/each}
    </div>
</div>

<style lang="scss">
    .field-container {
        @apply w-full h-full flex-1;

        display: flex;
        justify-content: center;
        align-items: center;

        .field-tiles-wrapper {
            @apply relative;
            width: var(--width);
            height: var(--height);

            .field-tile {
                @apply absolute;
                left: var(--x);
                top: var(--y);
                width: var(--size);
                height: var(--size);
                background-color: theme("colors.base-content");
                border: 1px solid #aaa;
                display: flex;
                justify-content: center;
                align-items: center;

                .field-tile-bomb {
                    @apply relative;
                    width: 80%;
                    height: 80%;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .field-tile-bomb-inner {
                        @apply absolute;
                        width: 50%;
                        height: 50%;
                        background-color: #f00;
                        border-radius: 50%;
                    }
                }

                .field-tile-number {
                    @apply text-center;
                }

                &.exploded {
                    animation-delay: calc(var(--distance) * 0.05s);
                    animation-name: explode;
                    animation-duration: 0.5s;
                    animation-fill-mode: forwards;
                    animation-timing-function: ease-out;
                    animation-iteration-count: 1;
                }
            }
        }
    }

    @keyframes explode {
        0% {
            transform: scale(1);
            background-color: theme("colors.error");
        }
        5% {
            transform: scale(0.8);
        }
        10% {
            transform: scale(1);
            background-color: theme("colors.error");
        }
        50% {
            transform: scale(2);
        }
    }
</style>
