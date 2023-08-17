<script lang="ts">
    import { MineField, mineField, reset_all } from "$lib/Game/Field";
    import { onDestroy, onMount, tick } from "svelte";
    import { init_game } from "$lib/Game";
    import type { PageData } from "./$types";
    import { MinesweeperInstance, gameStatus } from "$lib/Game/Game";
    import MineSweeper from "./components/MineSweeper.svelte";
    import { beforeNavigate } from "$app/navigation";
    import { lastGameId, setLastGame } from "$lib/data/LastGame";
    import { GameTimer } from "$lib/Game/GameTimer";

    export let data: PageData;

    let loaded = false;
    let field: MinesweeperInstance | null = null;
    onMount(async () => {
        if ($lastGameId <= 0) {
            await init_game();
        }
        field = await MinesweeperInstance.latest();
        GameTimer.time = field.time;
        loaded = true;
    });

    beforeNavigate(() => {
        if (field?.status === 0 && field.id) {
            lastGameId.set(field.id);
        } else if (field?.status !== 0) {
            lastGameId.set(0);
        }
    });
</script>

{#if loaded && field}
    <MineSweeper instance={field} />
{/if}

<style>
    :root {
        @apply bg-base-200;
    }
</style>
