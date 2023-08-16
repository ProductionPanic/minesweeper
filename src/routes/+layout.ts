
import { browser } from "$app/environment";
import { onMount } from "svelte";
import "../app.scss"
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from "@capacitor/core";

export const prerender = true;

(async () => {
    if (!browser) return;
    const platform = Capacitor.getPlatform();
    const allowed = ["android", "ios"];
    console.log(platform);
    if (!allowed.includes(platform)) return;

    const is_android = platform === "android";

    if (is_android) {
        await StatusBar.setOverlaysWebView({ overlay: true });
    }

    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.hide();

})();