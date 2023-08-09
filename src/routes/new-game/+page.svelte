<script lang="ts">
    import { goto } from "$app/navigation";
    import { Games } from "$lib/Games";

    function start(e: any) {
        const difficulty = e.target.difficulty.value;
        const parsed = difficulty ? parseInt(difficulty) : 0;

        const game = Games.create_game(parsed);

        Games.set_current_game(game.id);
        goto("/game");
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
        <h1>Choose your difficulty</h1>
        <div />
    </div>

    <form class="selection" on:submit|preventDefault={start}>
        <div class="choices px-4">
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text">Easy</span>
                    <input
                        type="radio"
                        name="difficulty"
                        class="radio checked:bg-lime-500"
                        checked
                        value="0"
                    />
                </label>
            </div>
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text">Medium</span>
                    <input
                        type="radio"
                        name="difficulty"
                        class="radio checked:bg-amber-500"
                        value="1"
                    />
                </label>
            </div>
            <div class="form-controol">
                <label class="label cursor-pointer">
                    <span class="label-text">Hard</span>
                    <input
                        type="radio"
                        name="difficulty"
                        class="radio checked:bg-red-500"
                        value="2"
                    />
                </label>
            </div>
        </div>
        <div class="buttons grid grid-cols-2 gap-4 w-full p-4">
            <button class="btn btn-accent" type="submit">Start</button>
            <a class="btn btn-accent btn-outline" href="/">Cancel</a>
        </div>
    </form>
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

    .selection {
        @apply flex flex-col justify-center items-center gap-4 w-full;

        .choices {
            @apply w-full;
            span {
                @apply text-2xl;
            }
        }
    }
</style>
