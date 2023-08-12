<script lang="ts">
    import { MineField, mineField, reset_all } from "$lib/Game/Field";
    import { onMount, tick } from "svelte";
    import { init_game } from "$lib/Game";
    import type { PageData } from "./$types";
    import { MinesweeperInstance } from "$lib/Game/Game";
    import MineSweeper from "./components/MineSweeper.svelte";

    export let data: PageData;

    let loaded = false;
    let field: MinesweeperInstance | null = null;
    onMount(async () => {
        await init_game();
        loaded = true;

        field = await MinesweeperInstance.latest();
    });
</script>

{#if loaded && field}
    <MineSweeper instance={field} />
{/if}

<style>
    :root {
        @apply bg-gray-900;
    }
</style>