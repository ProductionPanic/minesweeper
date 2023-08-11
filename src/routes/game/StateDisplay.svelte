<script lang="ts">
    import  { GameState, clear_current_game,  } from "$lib/Game";
    import { Timer, mineFieldState, timer } from "$lib/Game/Field";
    import { onMount } from "svelte";

    let _state: GameState;
    let dialog: HTMLDialogElement;

    $: if (_state !== $mineFieldState && dialog && $mineFieldState) {
        dialog.showModal();
        _state = $mineFieldState;
        Timer.pause();
        clear_current_game();
    }
</script>

{#if $mineFieldState === GameState.Won}
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
{#if $mineFieldState === GameState.Lost}
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
