<script lang="ts">
    import { mineFieldTiles } from "$lib/Game/Field";
    import { gameDifficulty, tilesStore } from "$lib/Game/Game";
    import { highscores } from "$lib/data/HighScores";
    import type { MinesweeperHighscore } from "$lib/data/db";
    import type { Observable } from "dexie";
    import { createEventDispatcher, onMount } from "svelte";

    const dispatch = createEventDispatcher();

    export let time: number = 0;
    let interval: NodeJS.Timeout;
    let formattedTime: string = "00:00";
    $: formattedTime = new Date(time * 1000)
        .toISOString()
        .substr(11, 8)
        .replace(/^0(?:0:0?)?/, "");

    let totalMineCount: number = 0;
    let totalFlaggedCount: number = 0;

    $: totalMineCount = (
        $tilesStore ? $tilesStore.filter((tile) => tile.bomb) : []
    ).length;
    $: totalFlaggedCount = (
        $tilesStore ? $tilesStore.filter((tile) => tile.flag) : []
    ).length;

    let _highscores: Observable<MinesweeperHighscore[]>;
    let highscore: MinesweeperHighscore;

    $: if (_highscores && _highscores.length > 0) {
        highscore = _highscores[0];
    }

    $: if ($gameDifficulty) {
        _highscores = highscores.get().getHighScore($gameDifficulty);
    }
</script>

<div class="navbar bg-base-100 mb-4">
    <div class="flex-none">
        <button
            class="btn btn-square btn-ghost"
            on:click={() => dispatch("leave")}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-5 h-5 stroke-current"
            >
                <!-- back button -->
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
                />
            </svg>
        </button>
    </div>
    <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl">
            {formattedTime}
        </a>

        {#if highscore}
            <a
                class="btn btn-ghost normal-case text-xl"
                href={`https://www.google.com/search?q=${highscore.name}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                {highscore.name}
            </a>
        {/if}
    </div>
    <div class="flex-none">
        <div class="stat text-center">
            <div class="stat-title">Total flagged</div>
            <div class="stat-value text-primary">
                {totalFlaggedCount}/{totalMineCount}
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .stat {
        padding: 0;
        .stat-title {
            font-size: 0.75rem;
            line-height: 1;
            color: var(--base-300);
        }
        .stat-value {
            font-size: 1.5rem;
            line-height: 1;
        }
    }
</style>
