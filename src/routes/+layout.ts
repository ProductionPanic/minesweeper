
import { browser } from "$app/environment";
import { onMount } from "svelte";
import "../app.scss"
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from "@capacitor/core";

export const prerender = true;

(async () => {
    if(!browser) return;
    const platform = Capacitor.getPlatform();
    const allowed= ["android", "ios"];
    console.log(platform);
    if(!allowed.includes(platform)) return;
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.hide();
    
})();