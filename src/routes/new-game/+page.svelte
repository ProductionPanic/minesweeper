<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import { GameState, new_minesweeper_game } from "$lib/Game";
    import {
        MineField,
        mineField,
        mineFieldState,
        mineFieldTiles,
        reset_all,
    } from "$lib/Game/Field";
    import { MinesweeperInstance } from "$lib/Game/Game";
    import { Sounds } from "$lib/Sounds";
    import { Loading } from "$lib/Utils";
    import { Vibrate } from "$lib/Vibrate";
    import { SettingsHandler, settings } from "$lib/data/settings";
    import { onMount, tick } from "svelte";

    async function start(e: any) {
        Loading.start();
        const difficulty = e.target.difficulty.value;
        SettingsHandler.update({
            lastDifficulty: difficulty,
        });
        await MinesweeperInstance.create(difficulty);
        goto("/init");
    }
    $: console.log($settings.lastDifficulty);
    function change() {
        Sounds.pop();
    }

    const difficulties = [
        {
            value: 3,
            label: "Super Easy",
            color: "checked:bg-cyan-500",
        },
        {
            value: 0,
            label: "Easy",
            color: "checked:bg-lime-500",
        },
        {
            value: 1,
            label: "Medium",
            color: "checked:bg-amber-500",
        },
        {
            value: 2,
            label: "Hard",
            color: "checked:bg-red-500",
        },
        {
            value: 4,
            label: "Super Hard",
            color: "checked:bg-green-800",
        },
    ];
</script>

<div class="flex-1 flex flex-col justify-between w-full">
    <div class="top-bar">
        <a class="back-icon" href="/">
            <svg class="w-10 h-10" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
                />
            </svg>
        </a>
        <h1>Choose your difficulty</h1>
        <div />
    </div>

    <form class="selection" on:submit|preventDefault={start}>
        <div class="choices px-4">
            {#each difficulties as d}
                <div class="form-control">
                    <label class="label cursor-pointer">
                        <span class="label-text">{d.label}</span>
                        <input
                            type="radio"
                            name="difficulty"
                            class="radio {d.color}"
                            checked={$settings.lastDifficulty == d.value}
                            value={d.value}
                            on:change={change}
                        />
                    </label>
                </div>
            {/each}
        </div>
        <div class="buttons grid grid-cols-2 gap-4 w-full p-4">
            <button class="btn btn-accent" type="submit">Start</button>
            <a class="btn btn-accent btn-outline" href="/">Cancel</a>
        </div>
    </form>
</div>

<style lang="scss">
    .top-bar {
        @apply flex justify-between items-center h-16;
        h1 {
            @apply text-2xl font-bold;
        }
        .back-icon {
            @apply w-8 h-8 flex justify-center items-center rounded-full cursor-pointer;
            &:hover {
                @apply bg-base-300;
            }
        }
    }

    .selection {
        @apply flex flex-col justify-center items-center gap-4 w-full;

        .choices {
            @apply w-full;
            span {
                @apply text-2xl;
            }
        }
    }
</style>
