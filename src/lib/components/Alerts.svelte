<script lang="ts">
    import { addAlert, alerts } from "$lib/Alerts";
    import { onMount } from "svelte";
    import { fly, slide } from "svelte/transition";

</script>

<div class="global-alerts">
    {#each $alerts as alert}
        <div class="alert alert-{alert.type}" in:fly={{x:'-100%', duration: 300}} out:fly={{x:'100%', duration:500}}>
            {#if alert.type === "info"}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>

            {:else if alert.type === "warning"}
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>

            {:else if alert.type === "error"}
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>

            {:else if alert.type === "success"}
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>

            {/if}
            <div>
                <h3 class="font-bold">
                    {alert.title}
                </h3>
                {#if alert.message}
                <p class="text-xs">
                    {alert.message}
                </p>
                {/if}
            </div>

            {#if alert.buttons} 
            <div>
                {#each alert.buttons as button}
                <button class="btn {button.className}" on:click={button.action}>
                    {button.text}
                </button>
                {/each}
            </div>
            {/if}
            
        </div>
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

    
    .alert {
        @apply bg-base-100 rounded-md shadow-md p-4 flex gap-4 items-center;
        pointer-events: all;
        max-width: 500px;
        width: 100%;
        @apply bg-opacity-60;

        &-info {
            @apply bg-blue-600 text-white;
        }

        &-warning {
            @apply bg-yellow-600 text-white;
        }

        &-error {
            @apply bg-red-600 text-white;
        }

        &-success {
            @apply bg-green-600 text-white;
        }

        h3 {
            @apply font-bold;
        }

        p {
            @apply text-xs;
        }

        button {
            @apply btn btn-sm;
        }
    }
</style>