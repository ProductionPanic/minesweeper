<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";

    const dispatch = createEventDispatcher();

    export let time: number = 0;
    let interval: NodeJS.Timeout;
    let formattedTime: string = "00:00";
    $: formattedTime = new Date(time * 1000)
        .toISOString()
        .substr(11, 8)
        .replace(/^0(?:0:0?)?/, "");
</script>

<div class="navbar bg-base-100 mb-4">
    <div class="flex-none">
        <button
            class="btn btn-square btn-ghost"
            on:click={() => dispatch("leave")}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-5 h-5 stroke-current"
            >
                <!-- back button -->
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
                />
            </svg>
        </button>
    </div>
    <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl">
            {formattedTime}
        </a>
    </div>
    <div class="flex-none">
        <button class="btn btn-square btn-ghost">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-5 h-5 stroke-current"
                ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                /></svg
            >
        </button>
    </div>
</div>
