<script lang="ts">
    import { animePromise, sleep } from "$lib/Utils";
    import anime from "animejs";
    import { onMount, setContext, tick } from "svelte";
    import { MineSweeperGame } from "$lib/v2/MineSweeperGame";

    let field_container: HTMLElement;
    let canvas: HTMLCanvasElement;
    onMount(async () => {
        const instance = await MineSweeperGame(field_container);
        console.log(instance);
    });
</script>

<div class="field-container" bind:this={field_container} />

<style lang="scss">
    .field-container {
        @apply flex-1 h-full;

        display: flex;
        justify-content: center;
        align-items: center;
        touch-action: none;

        canvas {
            @apply h-full w-full;
        }
    }
</style>
