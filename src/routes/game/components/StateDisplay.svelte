<script lang="ts">
    import { GameState, clear_current_game } from "$lib/Game";
    import { Timer, mineFieldState } from "$lib/Game/Field";
    import { gameOver, gameStatus, tilesStore } from "$lib/Game/Game";
    import { GameTimer } from "$lib/Game/GameTimer";
    import { sleep } from "$lib/Utils";
    import { onMount, tick } from "svelte";

    let _state: GameState;
    let dialog: HTMLDialogElement;

    let timer = GameTimer.timer;

    let lost:boolean;
    $:lost = $tilesStore.every(i=>i.exploded);

    let won:boolean;
    $:won = $tilesStore.filter(i=>i.bomb).every(i=>i.flag) && $tilesStore.filter(i=>!i.bomb).every(i=>i.open);

    $: if ($gameOver && (won||lost)) {
        gameoover();
    }

    async function gameoover() {
        await sleep(1000);
        dialog.showModal();
    }
</script>

{#if $gameStatus === GameState.Won}
    <dialog class="modal" bind:this={dialog}>
        <form method="dialog" class="modal-box">
            <h3 class="font-bold text-lg">Nice job!</h3>
            <p class="py-4">
                You've won the game! And it only took you {$timer} seconds!
            </p>
            <div class="modal-action">
                <!-- if there is a button in form, it will close the modal -->
                <a class="btn-accent btn" href="/new-game"> Try again? </a>

                <a href="/" class="btn-accent btn btn-outline">
                    Back to home
                </a>
            </div>
        </form>
    </dialog>
{/if}
{#if $gameStatus === GameState.Lost}
    <dialog class="modal" bind:this={dialog}>
        <form method="dialog" class="modal-box">
            <h3 class="font-bold text-lg">Oh no!</h3>
            <p class="py-4">
                You've lost the game! But don't worry, you can try again.
            </p>
            <div class="modal-action">
                <a class="btn-accent btn" href="/new-game"> Try again? </a>
                <a href="/" class="btn-accent btn btn-outline">
                    Back to home
                </a>
            </div>
        </form>
    </dialog>
{/if}
