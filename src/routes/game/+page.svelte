<script lang="ts">
    import MinesweeperGame from "$lib/v2/MinesweeperGame.svelte";
</script>

<div class="wrapper">
    <MinesweeperGame />
</div>

<style lang="scss">
    .wrapper {
        @apply w-full h-screen flex justify-center items-center mx-auto;
    }
</style>
