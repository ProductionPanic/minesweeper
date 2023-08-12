<script lang="ts">
    import { goto } from "$app/navigation";
    import { MinesweeperInstance } from "$lib/Game/Game";
    import { SettingsHandler, settings } from "$lib/data/settings";
    import { tick } from "svelte";

    
    async function quickgame(e:any) {        
        const difficulty = $settings.lastDifficulty;
        SettingsHandler.update({
            lastDifficulty: difficulty,
        })
        await MinesweeperInstance.create(difficulty);
        await tick();
        goto("/game");
    }
</script>

<div class="hero mx-4 rounded-md mt-8">
    <div class="hero-content text-center">
        <div class="max-w-md">
            <h1 class="text-5xl font-bold">Minesweeper</h1>
            <p class="py-6">
                A simple but beautifull version of the classic game.
            </p>
        </div>
    </div>
</div>

<div class="hero mx-4 rounded-md">
    <div class="hero-content text-center w-full">
        <div class="max-w-md full-width-buttons">
            <div class="grid grid-cols-2 gap-4">
                <button class="btn btn-primary btn-block" on:click={quickgame}>
                   Quick game
                </button>
                <a class="btn btn-primary btn-outline btn-block" href="/new-game">
                New game
                </a> 
            </div>
            <a class="btn btn-neutral btn-block" href="/settings"> Settings </a>
        </div>
    </div>
</div>

<style lang="scss">
    .full-width-buttons {
        @apply flex flex-col justify-between w-full gap-4;
    }
</style>
