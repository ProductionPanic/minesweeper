<div 
bind:this={canvas_container} 
class="bg-canvas"
></div>

<style lang="scss">
    .bg-canvas {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
    }
</style>

<script lang="ts">
    import type p5 from "p5";
    import { onMount } from "svelte";

    let canvas_container: HTMLElement;
    let p5Instance: p5;
    
    onMount(async () => {
        const {
            default: p5,
        } = await import("p5");
        p5Instance = new p5((p) => {
            let cols: number;
            let rows: number;
            p.setup = () => {
                p.createCanvas(globalThis.window.innerWidth, globalThis.window.innerHeight);
                p.background(30);
                const col_row_width = 32;

                cols = Math.ceil(p.width / col_row_width);
                rows = Math.ceil(p.height / col_row_width);                
            };

            p.draw = () => {

p.background(30);
                // draw grid
                p.stroke(255);
                p.strokeWeight(1);
                p.noFill();
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        p.rect(i * 32, j * 32, 32, 32);
                    }
                }
            };
        }, canvas_container);
    });
</script>