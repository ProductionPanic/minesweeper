<script>
    import { browser } from "$app/environment";
    import { LottiePlayer } from "@lottiefiles/svelte-lottie-player";
</script>

<div class="animation">
    {#if browser}
        <LottiePlayer
            src="/hurray.json"
            autoplay={true}
            loop={true}
            renderer="svg"
            background="transparent"
            controls={false}
            width={200}
            height={200}
        />
    {/if}
</div>

<style>
    .animation {
        position: absolute;
        top: 0;
        right: 0;
    }
</style>
