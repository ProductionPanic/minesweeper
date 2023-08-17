
import { browser } from "$app/environment";
import { onMount } from "svelte";
import "../app.scss"
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from '@capacitor/app';
import { ScreenOrientation } from '@capacitor/screen-orientation';

export const prerender = true;

(async () => {
    if (!browser) return;
    const platform = Capacitor.getPlatform();
    const allowed = ["android", "ios"];
    if (!allowed.includes(platform)) return;
    await fixes();

    setInterval(async () => {
        await fixes();
    }, 5000);
})();

async function fixes() {

    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.hide();
    await ScreenOrientation.lock({
        orientation: 'portrait'
    })

    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
            CapacitorApp.exitApp();
        } else {
            history.back();
        }
    });
}