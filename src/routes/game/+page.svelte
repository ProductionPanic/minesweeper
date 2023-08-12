<script lang="ts">
    import Game from "./Game.svelte";
    import { MineField, mineField, reset_all } from "$lib/Game/Field";
    import { onMount, tick } from "svelte";
    import { init_game } from "$lib/Game";
    import type { PageData } from "./$types";
    import { MinesweeperInstance } from "$lib/Game/Game";

    export let data: PageData;

    $: console.log(data);

    let loaded = false;
    let unsub;
    onMount(async () => {
        await init_game();
        loaded = true;
        unsub = mineField.subscribe((val) => {
            _mineField = val;
        });

        const test = await MinesweeperInstance.latest();
        console.log('latest');
        console.log(test);

    });

    let _mineField: MineField | null = null;
</script>

{#key mineField}
    {#if loaded && _mineField}
        <Game mineField={_mineField} />
    {/if}
{/key}
