<script lang="ts">
    export let bomb: boolean = false;
    export let flag: boolean = false;
    export let number: number = 0;
    export let revealed: boolean = false;
    export const x: number = 0;
    export const y: number = 0;
    export let size: number = 32;
</script>

<div class="tile" style="--size:{size}">
    <div class="tile-content">
        {#if revealed}
            {#if bomb}
                <div class="bomb">
                    <svg class="w-10 h-10" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M12 2L2 12h3v8h14v-8h3L12 2zm0 3.5l5 5.5h-3v5h-4v-5H7l5-5.5zM12 8a1 1 0 110 2 1 1 0 010-2z"
                        />
                    </svg>
                </div>
            {:else if number > 0}
                <div class="number">{number}</div>
            {/if}
        {:else if flag}
            <div class="flag">
                <svg class="w-10 h-10" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M12 2L2 12h3v8h14v-8h3L12 2zm0 3.5l5 5.5h-3v5h-4v-5H7l5-5.5zM12 8a1 1 0 110 2 1 1 0 010-2z"
                    />
                </svg>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    .tile {
        @apply flex items-center justify-center rounded-md;
        @apply bg-gray-700;
        @apply border border-gray-800;
        @apply cursor-pointer;
        @apply transition-all;
        @apply relative;
        @apply overflow-hidden;
        @apply shadow;

        width: var(--size);
        height: var(--size);
    }

    .tile-content {
        @apply flex items-center justify-center;
        @apply w-full h-full;
    }

    .tile:hover {
        @apply bg-gray-800;
    }

    .tile:active {
        @apply bg-gray-900;
    }

    .tile .bomb {
        @apply flex items-center justify-center;
        @apply w-full h-full;
    }

    .tile .number {
        @apply flex items-center justify-center;
        @apply w-full h-full;
        @apply text-2xl;
    }

    .tile .flag {
        @apply flex items-center justify-center;
        @apply w-full h-full;
    }

    .tile .flag svg {
        @apply text-red-500;
    }
</style>
