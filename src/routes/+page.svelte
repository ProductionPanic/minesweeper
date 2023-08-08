<script>
    import { fly, slide } from "svelte/transition";

    let state = {
        val1: 0,
        val2: 0,
        operator:'',
        first_filled:false,
        second_filled: false,
        period:false,
    }

    const clear_state = {
        val1: 0,
        val2: 0,
        operator:'',
        first_filled:false,
        second_filled: false,
        period:false
    }

    let output = 0;

    $:if(!state.first_filled) {
        output = state.val1;
    } else if (state.first_filled && !state.second_filled) {
        output = state.val2;
    } else {
        switch(state.operator) {
            case '+':
                output = state.val1 + state.val2
                break;
            case '-':
                output = state.val1 - state.val2
                break;
            case '/':
                output = state.val1 / state.val2
                break;
            case '*':
                output = state.val1 * state.val2
                break;
        }
    }

    function clear() {
        state = clear_state;
        output=0;
    }

    function numclick(e) {
        const is_first = !state.first_filled;
        const is_second = !state.second_filled && state.first_filled;
        const period = state.period?'.':'';
        if(is_first) {
            state.val1 = parseFloat(state.val1.toString() + period + e.target.textContent)
        } else if (is_second) {
            state.val2 = parseFloat(state.val2.toString() + period + e.target.textContent)
        }
        if(state.period) {
            state.period = false;
        }
    }

    function opclick(e) {
        if(state.second_filled) {
            const _o = output.toString();
            clear();
            state.val1=parseFloat(_o);
            state.val2=0;
            state.period=false;
            state.first_filled=true;
            state.second_filled=false;
            state.operator = e.target.textContent;
            return;
        }
        if(e.target.textContent !== '=') {      
            state.operator = e.target.textContent;   
            state.first_filled =true;   
        } else {
            state.second_filled = true;
        }
    }
    
    function period() {
        state.period=true;
    }

  

</script>

<div class="calculator-container">
    <div class="calculator">
        <div class="screen">
            {#key output}
            <div class="output" in:fly={{duration:300, y: -50}} out:fly={{duration:300, y: 50}} >
                {output}
            </div>
            {/key}
        </div>
        <div class="num">
            <button on:click={numclick}>7</button>
            <button on:click={numclick}>8</button>
            <button on:click={numclick}>9</button>
            <button on:click={clear}>C</button>
            <button on:click={numclick}>4</button>
            <button on:click={numclick}>5</button>
            <button on:click={numclick}>6</button>
            <button on:click={opclick}>+</button>
            <button on:click={numclick}>1</button>
            <button on:click={numclick}>2</button>
            <button on:click={numclick}>3</button>
            <button on:click={opclick}>-</button>
            <button class="col-span-2" on:click={numclick}>0</button>
            <button on:click={period}>.</button>
            <button on:click={opclick}>*</button>
            <button class="col-span-3" on:click={opclick}>=</button>
            <button on:click={opclick}>/</button>
        </div>
    </div>
</div>

<style lang="scss">
    $width:50px;
    .calculator-container {
        @apply w-screen h-screen flex justify-center items-center;
        .calculator {
            @apply bg-teal-800 p-2 rounded-xl shadow-2xl;

            .num {
                @apply grid grid-cols-4 gap-1;

                button {
                    @apply bg-teal-900 transition-all;
                    min-width: $width;
                    min-height: $width;
                    &:hover {
                        @apply bg-teal-950;
                    }
                }
            }
        }

        .screen {
            @apply bg-slate-900 rounded-xl mb-2 text-white p-2 flex items-center justify-end;
            height:$width;
            @apply relative;
            width: 100%;
                overflow: hidden;
            .output {
                text-align:right;
                color: white;
                font-size: 24px;

                @apply absolute top-0 right-0 h-full flex items-center p-2;
            }

        }
    }
</style>