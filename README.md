# CraftDraw V2

CraftDraw V2 is a lightweight, distraction-free browser-based drawing application built with vanilla web technologies. It features a modern glassmorphism UI and a robust set of digital painting tools designed for quick sketching and creative expression directly in your browser.

## Features
- **Fullscreen Canvas:** Automatically adapts to your viewport size and intelligently preserves your artwork using `getImageData()` when resizing the browser window.
- **Classic & Modern Tools:**
  - **Pencil:** Smooth, rounded continuous strokes for precise line work.
  - **Spray Can:** Textured airbrush effects with randomized particle density.
  - **Highlighter:** Built with a special `multiply` blend mode and partial transparency so that any text underneath remains perfectly readable and visible.
  - **Eraser:** Cleans up unwanted strokes easily.
  - **Text Tool:** Interactive click-to-type text input that lets you write directly onto the canvas with scaling typography.
- **Colors & Customization:** Quick-select color swatches, a custom HTML color picker, and a dynamic slider for adjusting brush sizes on the fly.
- **Clear Canvas:** One-click reset button to clear the workspace whenever needed.

## File Structure
- `index.html`: Contains the main markup, canvas element, and the floating toolbar interface.
- `style.css`: Provides the styling, layout, dark-mode theme, and glassmorphism visual effects.
- `script.js`: Handles all the drawing logic, tool switching, event listeners, and text rendering.

## Getting Started
To run CraftDraw V2 locally on your machine:
1. Place all three files (`index.html`, `style.css`, and `script.js`) into the same directory.
2. Open `index.html` in any modern web browser.
3. Select a tool, pick your color, adjust the size, and start drawing!
