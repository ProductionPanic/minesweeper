<script lang="ts">
    import EmojiBackground from "$lib/components/EmojiBackground.svelte";
    import LoadingElement from "$lib/components/LoadingComponent.svelte";
    import { page } from "$app/stores";
    import Alerts from "$lib/components/Alerts.svelte";
    import { SettingsHandler, is_first_time } from "$lib/data/settings";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { addAlert } from "$lib/Alerts";
    import { Loading } from "$lib/Utils";

    let showEmojiRain = true;

    const loading = Loading.store;

    const blacklist = new RegExp("^(\\/game|\\/play)");
    $: showEmojiRain = !blacklist.test($page.url.pathname);

    async function loaded() {
        if (!browser) return;
        // wait for sessionstorage to be available
        if (!window || !window.sessionStorage) return;
        if (!window.sessionStorage.getItem("firstTime")) {
            window.sessionStorage.setItem("firstTime", "true");
        }

        SettingsHandler.init();

        if (await is_first_time()) {
            addAlert(
                {
                    title: "Welcome to my first app",
                    message:
                        "Thanks for playing and any feedback is appreciated",
                    type: "info",
                },
                10000
            );
        }
    }
    let lastpath: string | null = null;

    $: if ($page.url) {
        if (lastpath == null) {
            lastpath = $page.url.pathname;
        }
        if (lastpath != $page.url.pathname) {
            lastpath = $page.url.pathname;
            Loading.stop();
        }
    }

    onMount(loaded);
</script>

<Alerts />

{#if showEmojiRain}
    <EmojiBackground>
        <div class="app-container">
            <slot />
        </div>
    </EmojiBackground>
{:else}
    <div class="app-container">
        <slot />
    </div>
{/if}

<LoadingElement />

<style lang="scss">
    .app-container {
        max-width: 1200px;
        width: 100%;
        min-height: 100vh;
        display: flex;
    }
</style>
