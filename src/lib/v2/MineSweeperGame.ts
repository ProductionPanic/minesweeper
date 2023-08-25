
import "./Styling.scss"

async function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export interface MineSweeperGameOptions {
    tileSize: number;
    paddingX: number;
    paddingY: number;
    difficulty: 'super easy' | 'easy' | 'medium' | 'hard' | 'super hard';
    cols: number;
    rows: number;
}


interface AnimationItem {
    animate: {
        opacity?: number[];
        rotation?: number[];
        scale?: number[];
        color?: number[][];
    }
    duration: number;
    startTime?: number;
}



const tiles: {
    x: number;
    y: number;
    state: "hidden" | "flagged" | "revealed";
    type: 'bomb' | 'number';
    number: number;
    style: {
        [key: string]: any;
    },
    animations: AnimationItem[]
}[] = [];
let field: HTMLDivElement;
let opts: MineSweeperGameOptions;


function getDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


const difficultyMap = {
    'super easy': 0.1,
    'easy': 0.2,
    'medium': 0.3,
    'hard': 0.4,
    'super hard': 0.5,
}

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

export async function MineSweeperGame(container: HTMLElement, options: Partial<MineSweeperGameOptions> = {}) {
    field = document.createElement('div');
    field.classList.add('field');
    container.appendChild(field);

    opts = {
        tileSize: 24,
        paddingX: 0,
        paddingY: 0,
        difficulty: 'easy',
        cols: 0,
        rows: 0,
        ...options,
    }

    const max_width = container.clientWidth - opts.paddingX * 2;
    const max_height = container.clientHeight - opts.paddingY * 2;

    opts.cols = Math.ceil(max_width / opts.tileSize);
    opts.rows = Math.ceil(max_height / opts.tileSize);

    const newPaddingX = (container.clientWidth - opts.cols * opts.tileSize) / 2;
    const newPaddingY = (container.clientHeight - opts.rows * opts.tileSize) / 2;
    opts.paddingX = newPaddingX;
    opts.paddingY = newPaddingY;

    canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    field.appendChild(canvas);

    ctx = canvas.getContext('2d')!;

    for (let y = 0; y < opts.rows; y++) {
        for (let x = 0; x < opts.cols; x++) {
            const tile = {
                x: opts.paddingX + x * opts.tileSize,
                y: opts.paddingY + y * opts.tileSize,
                state: "hidden",
                type: 'number',
                number: 0,
                style: {
                    opacity: 1,
                    rotation: 0,
                    scale: 1,
                    color: 'rgba(255, 255, 255, 0.5)',
                },
                animations: []
            };
            // @ts-ignore
            tiles.push(tile);
        }
    }

    animate();

    canvas.addEventListener('click', async (e) => {
        const x = e.clientX;
        const y = e.clientY;

        const tile = tiles.find((tile) => {
            return (
                x > tile.x &&
                x < tile.x + opts.tileSize &&
                y > tile.y &&
                y < tile.y + opts.tileSize
            );
        });

        if (tile) {
            tile.style.scale = 1;
            await animateTile(tile, [
                {
                    animate: {
                        scale: [1, 0.9],
                        rotation: [0, 45],
                    },
                    duration: 300,
                },
                {
                    animate: {
                        scale: [0.9, 1],
                        rotation: [45, 0],
                    },
                    duration: 100,
                },
            ]);
            await explode(tile);
            const r = Math.floor(Math.random() * 30) + 1;
            for (let i = 0; i < r; i++) {
                await explodeNeighbours(tile, i, true);
            }
        }
    });
}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fieldStart = {
        x: opts.paddingX,
        y: opts.paddingY,
    };

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.strokeStyle = 'rgba(40, 40, 40, 0.5)';
    ctx.lineWidth = 2;


    for (const tile of tiles) {

        for (const animation of tile.animations) {
            const progress = (Date.now() - animation.startTime!) / animation.duration;


            if (animation.animate.opacity) {
                if (animation.animate.opacity.length === 1) {
                    animation.animate.opacity = [tile.style.opacity, animation.animate.opacity[0]];
                }
                tile.style.opacity = animation.animate.opacity[0] + (animation.animate.opacity[1] - animation.animate.opacity[0]) * progress;
            }
            if (animation.animate.rotation) {
                if (animation.animate.rotation.length === 1) {
                    animation.animate.rotation = [tile.style.rotation, animation.animate.rotation[0]];
                }
                tile.style.rotation = animation.animate.rotation[0] + (animation.animate.rotation[1] - animation.animate.rotation[0]) * progress;
            }
            if (animation.animate.scale) {
                if (animation.animate.scale.length === 1) {
                    animation.animate.scale = [tile.style.scale, animation.animate.scale[0]];
                }
                tile.style.scale = animation.animate.scale[0] + (animation.animate.scale[1] - animation.animate.scale[0]) * progress;
            }
            if (animation.animate.color) {
                if (animation.animate.color.length === 1) {
                    animation.animate.color = [tile.style.color, animation.animate.color[0]];
                }
                tile.style.color = `rgba(${animation.animate.color[0][0] + (animation.animate.color[1][0] - animation.animate.color[0][0]) * progress}, ${animation.animate.color[0][1] + (animation.animate.color[1][1] - animation.animate.color[0][1]) * progress}, ${animation.animate.color[0][2] + (animation.animate.color[1][2] - animation.animate.color[0][2]) * progress}, ${animation.animate.color[0][3] + (animation.animate.color[1][3] - animation.animate.color[0][3]) * progress})`;
            }
            if (progress > 1) {
                tile.style.opacity = animation.animate.opacity ? animation.animate.opacity[1] : tile.style.opacity;
                tile.style.rotation = animation.animate.rotation ? animation.animate.rotation[1] : tile.style.rotation;
                tile.style.scale = animation.animate.scale ? animation.animate.scale[1] : tile.style.scale;
                tile.style.color = animation.animate.color ? `rgba(${animation.animate.color[1][0]}, ${animation.animate.color[1][1]}, ${animation.animate.color[1][2]}, ${animation.animate.color[1][3]})` : tile.style.color;
                tile.animations.splice(tile.animations.indexOf(animation), 1);
                continue;
            }
        }


        ctx.save();
        ctx.translate(tile.x + opts.tileSize / 2, tile.y + opts.tileSize / 2);
        ctx.rotate(tile.style.rotation);
        ctx.scale(tile.style.scale, tile.style.scale);
        ctx.translate(-(tile.x + opts.tileSize / 2), -(tile.y + opts.tileSize / 2));

        ctx.fillStyle = tile.style.color;
        ctx.strokeStyle = tile.style.color;
        ctx.globalAlpha = tile.style.opacity;

        drawTile(tile);

        ctx.restore();


    }

    requestAnimationFrame(animate);


}

function drawTile(tile: any) {
    ctx.fillRect(tile.x, tile.y, opts.tileSize, opts.tileSize);
}

function getTileNeighbours(
    tile: any,
    radius: number = 1,
    onlyEdges: boolean = false,
) {
    const neighbours: any[] = [];
    for (const neighbour of tiles) {
        if (neighbour === tile) {
            continue;
        }

        const distance = getDistance(
            tile.x,
            tile.y,
            neighbour.x,
            neighbour.y,
        );

        if (distance < opts.tileSize * radius && (!onlyEdges || distance >= opts.tileSize * (radius - 1))) {
            neighbours.push(neighbour);
        }
    }

    return neighbours;
}

function animateTile(tile: any, animations: AnimationItem[] | AnimationItem) {
    if (!Array.isArray(animations)) {
        animations = [animations];
    }

    let add = 0;
    for (const animation of animations) {
        animation.startTime = Date.now() + add + 1;
        add += animation.duration;
        tile.animations = [
            animation,
            ...tile.animations,
        ]
    }

    return sleep(add);
}
let yee = true;


async function explode(tile: any) {
    animateTile(tile, [
        {
            animate: {
                color: [
                    [255, 255, 255, 0.5],
                    [255, 0, 20, 1],
                ]
            },
            duration: 150,
        },
        {
            animate: {
                opacity: [0.5, 1],
                scale: [1, 0.5],
            },
            duration: 150,
        },
        {
            animate: {
                color: [
                    [255, 0, 20, 1],
                    [255, 255, 255, 0.5]
                ],
            },
            duration: 500,
        },
        {
            animate: {
                scale: [0.5, 0.9],
            },
            duration: 200,
        }, {
            animate: {
                scale: [0.9, 1],
            },
            duration: 100,
        }
    ])


    yee = !yee;

    return sleep(20)
}

function explodeNeighbours(tile: any, r: number, onlyEdges: boolean = false) {
    return Promise.all(getTileNeighbours(tile, r, onlyEdges).map((neighbour) => {
        return explode(neighbour);
    }));
}