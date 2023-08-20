<script lang="ts">
    import { alerts, check } from "./Alerts";
    import { onMount } from "svelte";
    import Alert from "./Alert.svelte";

    function deleteAction(alert: any) {
        alerts.update((a) => a.filter((x) => x !== alert));
    }

    onMount(() => {
        check();
    });
</script>

<div class="global-alerts">
    {#each $alerts as alert}
        <Alert bind:alert on:delete={() => deleteAction(alert)} />
    {/each}
</div>

<style lang="scss">
    .global-alerts {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
    }
</style>
