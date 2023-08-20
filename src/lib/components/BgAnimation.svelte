<canvas 
bind:this={canvas} 
class="bg-canvas"
></canvas>

<style lang="scss">
    .bg-canvas {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        opacity: .3;
    }
</style>

<script lang="ts">
    import { onMount } from "svelte";

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let width: number;
    let height: number;
    
    let numberTrails: {
        x: number;
        y: number;
        direction: number;
        speed: number;  
        chars: string[];
    }[] = [];
    
    let charPool = "0123456789";
    let bg:string;
    onMount(() => {
        ctx = canvas.getContext("2d")!;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const styles= getComputedStyle(canvas);
        const color = styles.getPropertyValue("--color-accent");
        const _bg = color

        bg = _bg || "#000000";

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);



        ctx.fillStyle = color;
        ctx.font = "20px monospace";

        for (let i = 0; i < 100; i++) {
        let dir = Math.floor(Math.random() * 4)
        if(dir == 0) dir = 0;
        else if (dir == 1) dir = 90;
        else if (dir == 2) dir = 180;
        else if (dir == 3) dir = 270;
        else if( dir == 4) dir = 0;
            numberTrails.push({
                x: Math.random() * width,
                y: Math.random() * height,
                direction: dir,
                speed: Math.random() * 5 + 1,
                chars: get_chars()
            });
        }

        requestAnimationFrame(draw);

        

    });

    function get_chars() {
        // 10 random chars
        const chars = [];
        for (let i = 0; i < 10; i++) {
            chars.push(charPool[Math.floor(Math.random() * charPool.length)]);
        }
        // repeat each char 10 times
        return chars.flatMap((char) => Array(30).fill(char));
    }

    function draw() {
        let lessOpacityBg = bg.replace("1)", "0");
        // draw background
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        // single char at the given position
        const fontColor = getComputedStyle(canvas).getPropertyValue("--color-accent-content");
        for (let i = 0; i < numberTrails.length; i++) {
            const trail = numberTrails[i];
            const { x, y, direction, speed, chars } = trail;
            const char = chars.shift();
            chars.push(char!);

            let charColor;
            switch(char) {
                case "0":
                    charColor = "#333";
                    break;
                case "1":
                    charColor = "#30f";
                    break;
                case "2": 
                    charColor = "#0f0";
                    break;
                case "3":
                    charColor = "#f00";
                    break;
                case "4":
                    charColor = "#f0f";
                    break;
                case "5":
                    charColor = "#ff0";
                    break;
                case "6":
                    charColor = "#0ff";
                    break;
                case "7":
                    charColor = "#fff";
                    break;
                case "8":
                    charColor = "#ccc";
                    break;
                case "9":
                    charColor = "#999";
                    break;
                default:
                    charColor = fontColor;


            }
            ctx.fillStyle = charColor;
            ctx.fillText(char!, x, y);

            trail.x += Math.cos(direction) * speed;
            trail.y += Math.sin(direction) * speed;

            if (trail.x < 0) {
                trail.x = width;
            } else if (trail.x > width) {
                trail.x = 0;
            }

            if (trail.y < 0) {
                trail.y = height;
            } else if (trail.y > height) {
                trail.y = 0;
            }
        }

        requestAnimationFrame(draw);
    }
</script>