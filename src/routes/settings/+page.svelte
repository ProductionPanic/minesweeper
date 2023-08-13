<script lang="ts">
    import {
        type Settings,
        SettingsHandler,
        settings,
    } from "$lib/data/settings";
    import { onMount } from "svelte";
    import { Vibrate } from "$lib/Vibrate";
    import { goto } from "$app/navigation";
    import { db } from "$lib/data/db";
    import { addAlert } from "$lib/Alerts";
    import { Loading, timestamp } from "$lib/Utils";
    import { highscores } from "$lib/data/HighScores";

    let set: Settings;

    onMount(async () => {
        set = await SettingsHandler.get();
    });

    async function save() {
        Loading.start();
        settings.set(set);
        await SettingsHandler.update(set);
        await Vibrate.small();
        addAlert({
            title: "Settings saved",
            type: "success",
        });
        Loading.stop();
    }

    function change() {
        Vibrate.small();
    }

    let deleteAllDialog: HTMLDialogElement;
    function reset_all() {
        deleteAllDialog.showModal();
    }

    function delete_all_response(e: SubmitEvent) {
        Loading.start();
        deleteAllDialog.close();
        const submitter = e.submitter as HTMLButtonElement;
        if (submitter.value === "y") {
            db.games.clear();
            db.highscores.clear();
            db.options.clear();
            if (
                globalThis &&
                globalThis.window &&
                globalThis.window.localStorage
            ) {
                window.localStorage.clear();
            }
            addAlert(
                {
                    title: "All data deleted",
                    type: "success",
                },
                3000,
                true
            );
            window.location.reload();
        }
    }

    // get capacitor platform
    let platform: string;
    if (globalThis && globalThis.window && globalThis.window.Capacitor) {
        platform = window.Capacitor.getPlatform();
    }
</script>

<div class="flex-1 flex flex-col justify-between w-full">
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
                {#if platform && platform === "web"}
                    <div class="form-control w-full">
                        <button
                            on:click={() =>
                                highscores.get().addHighScore({
                                    name: "test",
                                    created: timestamp(),
                                    time: 40,
                                    difficulty: 0,
                                })}
                            class="btn btn-primary">Add test highscore</button
                        >
                    </div>
                {/if}

                <div class="form-control w-full">
                    <label class="cursor-pointer label">
                        <span class="label-text">Use vibrations</span>
                        <input
                            type="checkbox"
                            class="toggle toggle-primary"
                            bind:checked={set.vibration}
                            on:change={change}
                        />
                    </label>
                </div>
                <div class="form-control w-full">
                    <label class="cursor-pointer label">
                        <span class="label-text">Use sound</span>
                        <input
                            type="checkbox"
                            class="toggle toggle-primary"
                            bind:checked={set.useSound}
                            on:change={change}
                        />
                    </label>
                </div>
                <div class="form-control w-full">
                    <label class="cursor-pointer label">
                        <span class="label-text">Show emoji rain</span>
                        <input
                            type="checkbox"
                            class="toggle toggle-primary"
                            bind:checked={set.emojirain}
                            on:change={change}
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
                            max="75"
                            step="5"
                            bind:value={set.emojirainCount}
                            on:change={change}
                            class="range range-primary"
                        />
                    </label>
                {/if}
                <button
                    class="btn btn-error btn-outline btn-sm"
                    on:click={reset_all}
                >
                    Erease all data
                </button>
            </div>

            <div class="buttons grid grid-cols-2 gap-4 w-full p-4">
                <button class="btn btn-primary" on:click={save}>Save</button>
                <a class="btn btn-primary btn-outline" href="/">back</a>
            </div>
        </div>
    {/if}
</div>

<dialog class="modal" bind:this={deleteAllDialog}>
    <form
        method="dialog"
        class="modal-box"
        on:submit|preventDefault={delete_all_response}
    >
        <h3 class="font-bold text-lg">Wait a minute!</h3>
        <p class="py-4">
            Are you sure you want to delete all your data? This action can't be
            undone.
        </p>
        <div class="modal-action">
            <button class="btn btn-primary" type="submit" value="y">Yes</button>
            <button class="btn btn-primary btn-outline" type="submit" value="n"
                >No</button
            >
        </div>
    </form>
</dialog>

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
