<script lang="ts">
    import { animePromise, sleep } from "$lib/Utils";
    import anime from "animejs";
    import { onMount, setContext, tick } from "svelte";
    import { MineSweeperGame } from "$lib/v2/MineSweeperGame";

    let field_container: HTMLElement;
    onMount(async () => {
        const instance = await MineSweeperGame(field_container);
        console.log(instance);
    });
</script>

<div class="field-container" bind:this={field_container} />

<style lang="scss">
    .field-container {
        @apply w-full h-full flex-1;

        display: flex;
        justify-content: center;
        align-items: center;
        touch-action: none;
    }
</style>
