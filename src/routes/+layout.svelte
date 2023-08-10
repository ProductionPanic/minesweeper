<script lang="ts">
    import EmojiBackground from "$lib/components/EmojiBackground.svelte";
    import { page } from "$app/stores";

    let showEmojiRain = true;

    const blacklist = new RegExp("^(\\/game|\\/play)");
    $: showEmojiRain = !blacklist.test($page.url.pathname);
</script>

{#if showEmojiRain}
    <EmojiBackground>
        <slot />
    </EmojiBackground>
{:else}
    <slot />
{/if}
