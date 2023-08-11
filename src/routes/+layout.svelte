<script lang="ts">
    import EmojiBackground from "$lib/components/EmojiBackground.svelte";
    import { page } from "$app/stores";
    import { SettingsHandler } from "$lib/settings";

    let showEmojiRain = true;

    const blacklist = new RegExp("^(\\/game|\\/play)");
    $: showEmojiRain = !blacklist.test($page.url.pathname);

    function loaded() {
        SettingsHandler.init();
    }
</script>

<svelte:body on:load={loaded} />

{#if showEmojiRain}
    <EmojiBackground>
        <slot />
    </EmojiBackground>
{:else}
    <slot />
{/if}
