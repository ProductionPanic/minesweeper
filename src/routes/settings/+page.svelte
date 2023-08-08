<script lang="ts">
    import { settings, updateSettings, type Settings } from "$lib/settings";
    import { onMount } from "svelte";

    let set: Settings;

    onMount(() => {
        settings.subscribe((value) => {
            set = value;
        });
    });

    function save() {
        updateSettings(set);
    }
</script>

<div
    class="flex-1 flex flex-col justify-between backdrop-blur-sm bg-base-200 bg-opacity-50 w-full"
>
    <div class="top-bar">
        <a class="back-icon" href="/">
            <svg class="w-10 h-10" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
                />
            </svg>
        </a>
        <h1>Settings</h1>
        <div />
    </div>

    {#if set}
        <div class="settings-part">
            <div class="inputs">
                <div class="form-control w-full">
                    <label class="cursor-pointer label">
                        <span class="label-text">Show emoji rain</span>
                        <input
                            type="checkbox"
                            class="toggle toggle-primary"
                            bind:checked={set.emojirain}
                        />
                    </label>
                </div>
                {#if set.emojirain}
                    <label
                        class="cursor-pointer label flex-col flex items-start w-full gap-2"
                    >
                        <span class="label-text">
                            Amount of emojis in the rain
                        </span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            bind:value={set.emojirainCount}
                            class="range range-secondary"
                        />
                    </label>
                {/if}
            </div>

            <div class="buttons grid grid-cols-2 gap-4 w-full p-4">
                <button class="btn btn-secondary" on:click={save}>Save</button>
                <a class="btn btn-secondary btn-outline" href="/">Cancel</a>
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .top-bar {
        @apply flex justify-between items-center h-16;
        h1 {
            @apply text-2xl font-bold;
        }
        .back-icon {
            @apply w-8 h-8 flex justify-center items-center rounded-full cursor-pointer;
            &:hover {
                @apply bg-base-300;
            }
        }
    }

    .settings-part {
        @apply flex flex-col justify-center items-center gap-4 w-full;

        .inputs {
            @apply w-full px-4 flex flex-col gap-4;
        }
    }
</style>
