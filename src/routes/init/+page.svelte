<script lang="ts">
    import { goto } from "$app/navigation";
    import { Loading, sleep } from "$lib/Utils";
    import { onMount } from "svelte";


    onMount(async () => {
        await sleep(10);
        Loading.start();
        await sleep(1000);
        goto("/game");

    })
</script>

<div class="loading hidden">
</div>