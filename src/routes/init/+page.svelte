<script lang="ts">
    import { goto } from "$app/navigation";
    import { Loading } from "$lib/Utils";
    import { onMount } from "svelte";


    onMount(async () => {
        Loading.start();
        await new Promise((res) => setTimeout(res, 1000));
        goto("/game");
    })
</script>

<div class="loading hidden">
</div>