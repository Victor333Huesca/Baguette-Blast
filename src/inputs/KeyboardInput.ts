import InputManager from './InputManager';

/**
 * Class representing the input system for the keyboard.
 * It sets up event listeners for keyboard events and updates the input manager based on the key states.
 */
class KeyboardInput extends InputManager {
    /**
     * Initializes a new instance of the KeyboardInput class.
     */
    public constructor() {
        super();
        this._initializeKeyboardInput();
    }

    /**
     * Sets up listeners for keydown and keyup events.
     */
    private _initializeKeyboardInput(): void {
        window.addEventListener('keydown', (event) => {
            this._updateInputDownActions(event);
        });

        window.addEventListener('keyup', (event) => {
            this._updateInputUpActions(event);
        });
    }

    /**
     * Updates the input manager based on the key down states.
     * @param event The keyboard event.
     */
    private _updateInputDownActions(event: KeyboardEvent): void {
        // Handling 'w', 'a', 's', 'd' for left thumbstick
        let x = 0,
            y = 0;
        if (event.key === 'w') x = 1;
        if (event.key === 's') x = -1;
        if (event.key === 'a') y = -1;
        if (event.key === 'd') y = 1;
        if (x !== 0 || y !== 0) this.setThumbstick('left', true, x, y);

        // Handling Arrow keys for right thumbstick
        x = 0;
        y = 0;
        if (event.key === 'ArrowUp') y = 1;
        if (event.key === 'ArrowDown') y = -1;
        if (event.key === 'ArrowLeft') x = -1;
        if (event.key === 'ArrowRight') x = 1;
        if (x !== 0 || y !== 0) this.setThumbstick('right', true, x, y);

        // Handling other keys
        if (event.key === ' ') this.setPrimary('left', true);

        if (event.key === 'Enter') this.setPrimary('right', true);
        if (event.key === 'Shift') this.setSecondary('left', true);

        if (event.key === 'Control') this.setSecondary('right', true);
        if (event.key === 'q') this.setGrip('left', true, 1);
        if (event.key === 'e') this.setGrip('right', true, 1);
        if (event.key === 'z') this.setTrigger('left', true, 1);
        if (event.key === 'c') this.setTrigger('right', true, 1);
    }

    /**
     * Updates the input manager based on the key up states.
     * @param event The keyboard event.
     */
    private _updateInputUpActions(event: KeyboardEvent): void {
        // Handling 'w', 'a', 's', 'd' for left thumbstick
        if (event.key === 'w' || event.key === 's' || event.key === 'a' || event.key === 'd') {
            this.setThumbstick('left', false, 0, 0);
        }

        // Handling Arrow keys for right thumbstick
        if (
            event.key === 'ArrowUp' ||
            event.key === 'ArrowDown' ||
            event.key === 'ArrowLeft' ||
            event.key === 'ArrowRight'
        ) {
            this.setThumbstick('right', false, 0, 0);
        }

        // Handling other keys
        if (event.key === ' ') this.setPrimary('left', false);

        if (event.key === 'Enter') this.setPrimary('right', false);
        if (event.key === 'Shift') this.setSecondary('left', false);

        if (event.key === 'Control') this.setSecondary('right', false);
        if (event.key === 'q') this.setGrip('left', false, 0);
        if (event.key === 'e') this.setGrip('right', false, 0);
        if (event.key === 'z') this.setTrigger('left', false, 0);
        if (event.key === 'c') this.setTrigger('right', false, 0);
    }
}

export default KeyboardInput;