<script lang="ts">
    import type { Alert } from "$lib/Alerts";
    import { createEventDispatcher } from "svelte";
    import { fade, fly } from "svelte/transition";

    export let alert: Alert;
    let dragging: boolean = false;
    let elem: HTMLDivElement;
    let dragStart: { x: number; y: number } = { x: 0, y: 0 };
    let dragOffset: { x: number; y: number } = { x: 0, y: 0 };

    const dispatch = createEventDispatcher();

    function dragStartHandler(e: MouseEvent) {
        
        dragging = true;
        dragStart = { x: e.clientX, y: e.clientY };
        dragOffset = { x: 0, y: 0 };
    }

    function dragHandler(e: MouseEvent) {
        
        if (!dragging) return;
        dragOffset = {
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        };
    }

    async function dragEndHandler(e: MouseEvent) {
        
        dragging = false;

        if(should_delete()) {
            dispatch("delete");
          
        } 
            requestAnimationFrame(bounce_back)
    }

    function should_delete():boolean {
        return Math.abs(dragOffset.x) > elem.clientWidth * 0.5;
    }

    function bounce_back() {
        if (dragOffset.x === 0) return;
        // the further away from the center, the faster it goes back
        const speed = Math.abs(dragOffset.x) * 0.5;
        const direction = dragOffset.x > 0 ? -1 : 1;
        dragOffset.x += speed * direction;
        elem.style.setProperty("--x", `${dragOffset.x}px`);
        if (Math.abs(dragOffset.x) > 1) {
            requestAnimationFrame(bounce_back);
        } else {
            elem.style.setProperty("--x", `0px`);
        }
    }


</script>

<div 
bind:this={elem} 
class="alert alert-{alert.type}"
 style="--x:{dragOffset.x}px; --y:0px"
  in:fly={{x:'-100%', duration: 300}}
   out:fade={{duration: 300}}
    on:pointerdown={dragStartHandler}
    on:pointerup={dragEndHandler}
    on:pointermove={dragHandler}
    role="alert"
   >
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

<style lang="scss">
    
    
    .alert {
        @apply bg-base-100 rounded-md shadow-md p-4 flex gap-4 items-center;
        pointer-events: all;
        max-width: 500px;
        width: 100%;
        @apply bg-opacity-60;

        touch-action: none;

        // dragging
        pointer-events: all;
        transform: translate(var(--x), var(--y));

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