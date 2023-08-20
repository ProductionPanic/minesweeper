<script lang="ts">
    import { goto } from "$app/navigation";
    import { MinesweeperInstance } from "$lib/Game/Game";
    import { Loading } from "$lib/Utils";
    import { lastGameId } from "$lib/data/LastGame";
    import { SettingsHandler, settings } from "$lib/data/settings";
    import { tick } from "svelte";

    async function quickgame(e: any) {
        Loading.start();
        const difficulty = $settings.lastDifficulty;
        await MinesweeperInstance.create(difficulty);
        await tick();
        goto("/game");
    }
</script>
<div class="flex w-inherit justify-between flex-col">
    <div class="flex flex-col gap-2 mt-6 p-4 justify-center items-center">
        <h1 class="text-4xl font-bold">Minesweeper</h1>
        <p class="text-center">
            A simple but beautifull version of the classic game.
        </p>
    </div>
    
    <div class="grid grid-cols-2 gap-2 p-4">
        {#if $lastGameId > 0}
        <a href="/game" class="btn-secondary btn col-span-2">
            Continue last game
        </a>
    {/if}
    <button class="btn btn-primary btn-block" on:click={quickgame}>
        Quick game
    </button>
    <a
        class="btn btn-secondary btn-block"
        href="/new-game"
    >
        New game
    </a>
    <a class="btn btn-neutral btn-block col-span-2" href="/settings"> Settings </a>
    </div></div>

<style>
    .w-inherit {
        width: inherit;
    }
</style>