<script lang="ts">
    import BgAnimation from "$lib/components/BgAnimation.svelte";
    import LoadingElement from "$lib/components/LoadingComponent.svelte";
    import { page } from "$app/stores";
    import Alerts from "$lib/components/Alerts.svelte";
    import { SettingsHandler, is_first_time } from "$lib/data/settings";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { addAlert } from "$lib/Alerts";
    import { Loading } from "$lib/Utils";
    const loading = Loading.store;
    let ready = false;
    async function loaded() {
        if (!browser) return;
        // wait for sessionstorage to be available
        if (!window || !window.sessionStorage) return;
        if (!window.sessionStorage.getItem("firstTime")) {
            window.sessionStorage.setItem("firstTime", "true");
        }

        ready = true;

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

    let showAnimation = true;

    $: showAnimation = $page.url.pathname != "/game";

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
{#if ready && showAnimation}
    <BgAnimation />
{/if}
<div class="app-container">
    <slot />
</div>

<LoadingElement />

<style lang="scss">
    .app-container {
        width: 100%;
        min-height: 100vh;
        display: flex;
    }
</style>
