<script lang="ts">
    import { GameState, clear_current_game } from "$lib/Game";
    import { Timer, mineFieldState } from "$lib/Game/Field";
    import {
        MinesweeperInstance,
        gameOver,
        gameStatus,
        tilesStore,
    } from "$lib/Game/Game";
    import { GameTimer } from "$lib/Game/GameTimer";
    import { sleep } from "$lib/Utils";
    import { SettingsHandler, settings } from "$lib/data/settings";
    import { onMount, tick } from "svelte";

    let _state: GameState;
    let dialog: HTMLDialogElement;

    let timer = GameTimer.timer;

    let lost: boolean;
    $: lost = $tilesStore.every((i) => i.exploded);

    let won: boolean;
    $: won =
        $tilesStore.filter((i) => i.bomb).every((i) => i.flag) &&
        $tilesStore.filter((i) => !i.bomb).every((i) => i.open);

    $: if ($gameOver && (won || lost)) {
        gameoover();
    }

    async function gameoover() {
        await sleep(1000);
        dialog.showModal();
    }

    async function restart() {
        const difficulty = $settings.lastDifficulty;
        await MinesweeperInstance.create(difficulty);
        await tick();
        window.location.reload();
    }
</script>

{#if $gameStatus === GameState.Won || $gameStatus === GameState.Lost}
    <dialog class="modal" bind:this={dialog}>
        <form method="dialog" class="modal-box">
            {#if $gameStatus === GameState.Won}
                <h3 class="font-bold text-lg">Nice job!</h3>
                <p class="py-4">
                    You've won the game! And it only took you {$timer} seconds!
                </p>
            {:else if $gameStatus === GameState.Lost}
                <h3 class="font-bold text-lg">Oh no!</h3>
                <p class="py-4">
                    You've lost the game! But don't worry, you can try again.
                </p>
            {/if}
            <div class="modal-action">
                <button class="btn-accent btn" on:click={restart}>
                    Try again?
                </button>

                <a href="/" class="btn-accent btn btn-outline">
                    Back to home
                </a>
            </div>
        </form>
    </dialog>
{/if}
