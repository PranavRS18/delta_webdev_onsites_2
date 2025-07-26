# Orbit Fall

Orbit Fall is a canvas-based gravity platformer game built using JavaScript and HTML5 Canvas. The player is launched between planets, leveraging orbital gravity and skillful timing to survive and score higher.

## Gameplay

- The player begins falling through space.
- Red planets act as gravity sources. When the mouse is pressed near one, the player orbits it.
- Releasing the mouse launches the player outward based on their current momentum and angle.
- The goal is to fall as far as possible while staying within horizontal bounds.
- A red line shows the current gravitational pull direction.
- A yellow trail marks the player’s movement history.

## Controls

- **Mouse Down:** Orbit the nearest planet within range.
- **Mouse Up / Release:** Launch from orbit in the current direction.

## Features

- Procedurally generated planets
- Orbital physics
- Dynamic camera via `global_player_y`
- Vertical parallax background using canvas shapes
- Smooth direction-based trajectory rendering
- Live score tracking
- Game over detection when player hits a planet or drifts out of horizontal bounds

## File Structure

- `index.html` — HTML container for canvas and UI
- `style.css` — Responsive layout and overlay styles
- `script.js` — Game loop, rendering logic, input handling, physics
- `LICENSE` - MIT License
- `README.md` — Game documentation

## Customization

You can adjust the following in `script.js`:

- `player_speed` — Affects movement and orbit velocity
- `planet_radius` — Controls planet size and collision
- `player_radius` — Sets player size

## Development Notes

- Canvas width is constrained between 0.2 and 0.8 of full width to create a central play zone.
- `follow_points` stores the full path trail and is rendered with `draw_path()`.
- Parallax background scrolls vertically based on `global_player_y`, and is rendered using basic shapes (circles, squares, rectangles).

## License

MIT
