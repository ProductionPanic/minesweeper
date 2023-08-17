<script lang="ts">
    import EmojiRain from "$lib/components/EmojiRain.svelte";
    import { page } from "$app/stores";
    import { fly } from "svelte/transition";
    import { settings } from "$lib/data/settings";
</script>

<div class="page-content">
    {#if $settings.emojirain}
        {#key $settings.emojirainCount}
            <EmojiRain amount={$settings.emojirainCount} />
        {/key}
    {/if}
    {#key $page.url}
        <div
            class="content-inner"
            in:fly={{ x: "-100%", duration: 300, delay: 300 }}
            out:fly={{ x: "100%", duration: 300 }}
        >
            <slot />
        </div>
    {/key}
</div>

<style lang="scss">
    .page-content {
        @apply relative;

        &:before {
            content: "";
            @apply absolute inset-0 bg-base-300 bg-opacity-50;
            z-index: 1;
        }
    }
    .content-inner {
        @apply min-h-screen w-screen overflow-x-hidden flex flex-col justify-between items-center;
        @apply relative z-10;
    }
</style>
