<script>
    import { Loading } from "$lib/Utils";
    import { fade } from "svelte/transition";

    let loading = Loading.store;
</script>
{#if $loading}
<div class="loading-overlay" 
transition:fade={{duration:200}}
>
    <div class="loading-content">
        <span class="loading loading-infinity"></span>
    </div>
</div>
{/if}

<style lang=scss>
    .loading-overlay {
        @apply w-screen h-screen fixed top-0 left-0;
        @apply bg-gray-900 bg-opacity-50;
        @apply flex justify-center items-center;

        z-index: 1000;

        .loading-content {
            @apply flex flex-col justify-center items-center;
            @apply text-white;

            .loading {
                width: 5rem;
            }
        }
    }
</style>