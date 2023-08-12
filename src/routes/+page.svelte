<script lang="ts">
    import { reset_all } from "$lib/Game/Field";
    import { db } from "$lib/db";
    import { liveQuery, type Observable } from "dexie";
    import { onMount } from "svelte";
  
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
                <a class="btn btn-primary btn-block" href="/new-game">
                    New game
                </a>
                <a class="btn btn-primary btn-outline btn-block" href="/game">
                    Continue last game
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
