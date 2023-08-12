<script lang="ts">
    import EmojiBackground from "$lib/components/EmojiBackground.svelte";
    import { page } from "$app/stores";
    import Alerts from "$lib/components/Alerts.svelte"
    import { SettingsHandler, is_first_time } from "$lib/data/settings";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { addAlert } from "$lib/Alerts";

    let showEmojiRain = true;


    const blacklist = new RegExp("^(\\/game|\\/play)");
    $: showEmojiRain = !blacklist.test($page.url.pathname);

    async function loaded() {
        if(!browser) return;
        // wait for sessionstorage to be available
        if(!window || !window.sessionStorage) return;
        if(!window.sessionStorage.getItem("firstTime")) {
            window.sessionStorage.setItem("firstTime", "true");
        }

        SettingsHandler.init();
        
        if(await is_first_time()) {
            addAlert({
                title: "Welcome to my first app",
                message: "Thanks for playing and any feedback is appreciated",
                type: "info"
            }, 10000);
        }
        
        
        
    }

    onMount(loaded);
</script>

<Alerts />

{#if showEmojiRain}
    <EmojiBackground >
        <slot />
    </EmojiBackground>
{:else}
    <slot />
{/if}
