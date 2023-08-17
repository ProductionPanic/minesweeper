<script lang="ts">
    export let open: boolean = false;
    let dialog: HTMLDialogElement = undefined;

    $: if (dialog && open) {
        dialog.showModal();
    } else if (dialog) {
        dialog.close();
    }

    function showModal() {
        open = true;
    }

    function closeModal() {
        open = false;
    }
</script>

<dialog bind:this={dialog} class="modal">
    <form method="dialog" class="modal-box">
        <slot />
    </form>
</dialog>
