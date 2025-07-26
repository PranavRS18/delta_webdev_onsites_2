// DOM
const world = document.querySelector(".world")
const ctx = world.getContext("2d");

world.width = world.clientWidth;
world.height = world.clientHeight;

const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
const display_score = document.querySelector(".display_score");
const high_score = document.querySelector(".high_score");
const score = document.querySelector(".score");
const overlay = document.querySelector(".overlay");
const button = document.querySelector("button");

let curr_score, view_high_score = null;
let isGameOver = false;
let player_x = world.width / 2;
let player_y = world.height;
let global_player_y = world.height;
const player_radius = 1.5 * remInPx;
const player_speed = 0.75 * remInPx;
let player_direction = Math.PI / 2
let follow_points = [];

let planets = [];
const planet_radius = 2 * remInPx;
let rotation = null;

function draw_city() {
    ctx.fillStyle = "#444";
    ctx.fillRect(0.2 * world.width, 0, 0.6 * world.width, world.height);

    const background_height = world.height;
    const repeat_count = 2;
    const x_start = 0.2 * world.width;
    const x_width = 0.6 * world.width;
    const offset_y = global_player_y % background_height;

    const shapes = [
        { type: "circle", x: 0.95, y: 0.1, size: 80 },
        { type: "circle", x: 0.25, y: 0.1, size: 120 },
        { type: "square", x: 0.5, y: 0.3, size: 80 },
        { type: "rect", x: 0.35, y: 0.6, width: 100, height: 50 },
        { type: "rect", x: 0.55, y: 0.6, width: 50, height: 100 },
        { type: "circle", x: 0.65, y: 0.8, size: 45 },
        { type: "square", x: 0.75, y: 0.5, size: 55 }
    ];

    for (let r = -1; r < repeat_count; r++) {
        for (let shape of shapes) {
            const x = x_start + shape.x * x_width;
            const y = shape.y * background_height + r * background_height - offset_y;

            ctx.beginPath();
            ctx.fillStyle = "#aaa";

            if (shape.type === "circle") {
                ctx.arc(x, y, shape.size / 2, 0, Math.PI * 2);
            } else if (shape.type === "square") {
                ctx.rect(x - shape.size / 2, y - shape.size / 2, shape.size, shape.size);
            } else if (shape.type === "rect") {
                ctx.rect(x - shape.width / 2, y - shape.height / 2, shape.width, shape.height);
            }

            ctx.fill();
            ctx.closePath();
        }
    }
}

function distance_from_planet(planet) {
    return (planet[0] - player_x) ** 2 + (planet[1] - global_player_y - player_y) ** 2
}

function generate_planets() {
    const planet_x = 0.25 * world.width + Math.random() * 0.55 * world.width;
    const planet_y = global_player_y - world.height - Math.random() * 0.5 * world.height;

    planets.push([planet_x, planet_y]);
}

function draw_planets() {
    planets.forEach(planet => {
        const distance = distance_from_planet(planet);
        const local_planet_y = planet[1] - global_player_y
        if (distance < (player_radius + planet_radius) ** 2) isGameOver = true;
        else if (distance_from_planet(gravity_planet) > distance && !isMouseDown) gravity_planet = planet;

        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(planet[0], local_planet_y, planet_radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
    })
}

function draw_player() {
    ctx.beginPath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.arc(player_x, player_y, player_radius,
        -1 * player_direction - Math.PI / 2,
        -1 * player_direction + Math.PI / 2, false);
    ctx.fill();
    ctx.closePath();
}

function planet_gravity() {
    const distance_x = player_x - gravity_planet[0];
    const distance_y = player_y - (gravity_planet[1] - global_player_y);
    const radius = Math.hypot(distance_x, distance_y);
    const orbit_speed = player_speed / radius;

    if (rotation === null) {
        const is_top = player_direction > 0 && player_direction <= Math.PI;
        if (is_top) {
            rotation = (distance_x > 0 === distance_y < 0) ? 1 : -1;
        } else {
            rotation = (distance_x > 0 === distance_y < 0) ? -1 : 1;
        }
    }

    const orbit_angle = Math.atan2(distance_y, distance_x) + orbit_speed * rotation;

    player_x = gravity_planet[0] + radius * Math.cos(orbit_angle);
    player_y = (gravity_planet[1] - global_player_y) + radius * Math.sin(orbit_angle);

    player_direction = Math.PI / 2 * rotation * -1 - orbit_angle;
}

function draw_path() {
    ctx.beginPath();
    ctx.moveTo(follow_points[0][0], follow_points[0][1]);

    for (let i = 1; i < follow_points.length; i++) {
        const [x, y] = follow_points[i];
        ctx.lineTo(x, y - global_player_y);
    }

    ctx.strokeStyle = "yellow";
    ctx.stroke();
    ctx.closePath();

}

function game() {
    ctx.clearRect(0, 0, world.width, world.height);
    player_direction = (player_direction % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const final_planet_y = planets[planets.length - 1][1]
    if (Math.floor(final_planet_y / 0.5 / world.height) * 0.5 * world.height > global_player_y - world.height) generate_planets()

    const local_planet_y = gravity_planet[1] - global_player_y
    if (isMouseDown && local_planet_y > 0 && local_planet_y < world.height) planet_gravity();
    else {
        rotation = null;
        if (player_y > world.height * 3 / 4 && global_player_y < world.height / 2) {
            player_y += player_speed * Math.sin(player_direction);
            global_player_y += player_speed * Math.sin(player_direction);
        }
        else player_y -= player_speed * Math.sin(player_direction);
        player_x += player_speed * Math.cos(player_direction);
    }
    if (player_y < world.height / 2 && player_y <= world.height * 3 / 4) {
        global_player_y -= world.height / 2 - player_y
        player_y = world.height / 2;
    } else if (player_y > world.height * 3 / 4) {
        global_player_y += player_y - world.height * 3 / 4;
        player_y = world.height * 3 / 4;
    }

    draw_city();
    draw_planets();
    draw_player();

    follow_points.push([player_x, player_y + global_player_y]);
    draw_path();

    if (local_planet_y > 0 && local_planet_y < world.height) {
        ctx.beginPath();
        if (!isMouseDown) ctx.setLineDash([10, 10]);
        ctx.moveTo(player_x, player_y);
        ctx.lineTo(gravity_planet[0], gravity_planet[1] - global_player_y);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.closePath();
    }

    curr_score = Math.floor((global_player_y - world.height) / world.height / 0.25) * -1
    display_score.innerText = `SCORE : ${curr_score}`
    score.innerText = `SCORE : ${curr_score}`
    if ((player_x < 0.2 * world.width + player_radius || player_x > 0.8 * world.width - player_radius) && !isMouseDown) isGameOver = true;
    if (!isGameOver) requestAnimationFrame(game);
    else {
        if (!view_high_score) view_high_score = curr_score
        if(view_high_score < curr_score) view_high_score = curr_score
        high_score.innerText = `HIGH SCORE : ${view_high_score}`
        display_score.classList.add('over')
        score.classList.add('over')
        overlay.classList.add('over')
    }
}

generate_planets()
let gravity_planet = planets[0]
requestAnimationFrame(game);

let isMouseDown = false;
world.addEventListener('mousedown', () => {
    isMouseDown = true;
});

world.addEventListener('mouseup', () => {
    isMouseDown = false;
});

world.addEventListener('mouseleave', () => {
    isMouseDown = false;
});

button.addEventListener('click', () => {
    isGameOver = false;
    player_x = world.width / 2;
    player_y = world.height;
    global_player_y = world.height;
    player_direction = Math.PI / 2
    follow_points = [];
    planets = [];
    rotation = null;

    display_score.classList.remove('over')
    score.classList.remove('over')
    overlay.classList.remove('over')

    generate_planets()
    gravity_planet = planets[0]
    requestAnimationFrame(game);
})