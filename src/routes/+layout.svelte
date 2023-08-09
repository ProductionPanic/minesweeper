<script lang="ts">
    import EmojiBackground from "$lib/components/EmojiBackground.svelte";
    import { page } from "$app/stores";

    let showEmojiRain = true;
    $: showEmojiRain = $page.url.pathname !== "/game";
</script>

{#if showEmojiRain}
    <EmojiBackground>
        <slot />
    </EmojiBackground>
{:else}
    <slot />
{/if}
