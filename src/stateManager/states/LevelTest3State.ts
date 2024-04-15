import { Mesh, MeshBuilder, Vector3 } from '@babylonjs/core';
import Game from '../../Game';
import gameLevels from '../../GameLevelConfig';
import EnemyController from '../../enemy/controllers/EnemyController';
import Buttons from '../../menu/buttons';
import PlayerController from '../../player/controllers/PlayerController';
import State from '../EnumState';
import CollisionManager from './CollisionManager';
import EnemyInitializer from './EnemyInitializer';
import PlayerInitializer from './PlayerInitializer';
import StateInterface from './StateInterface';

class LevelTest3State implements StateInterface {
    private _cubeMenu: Mesh;

    // Arrays to store models and views
    private _ennemiesControllers: EnemyController[] = [];

    // Player
    private _playerController: PlayerController;

    private _collisionManager = new CollisionManager();

    /**
     * Initializes the level test state with the given scene.
     * @param {Scene} scene - The Babylon.js scene where the level elements will be set up.
     * @returns {Promise<void>} A promise that resolves when initialization is complete.
     */
    public async init(): Promise<void> {
        // Add a cube to go back to the menu
        this._cubeMenu = MeshBuilder.CreateBox('cubeMenu', { size: 1 }, Game.instance.scene);
        this._cubeMenu.position = new Vector3(0, -2, 0);
        Buttons.clickable(Game.instance.scene, this._cubeMenu, () => {
            Game.instance.stateManager.changeState(State.Menu);
        });

        // Get the current level configuration
        const currentLevelNumber = 1;
        const currentLevelConfig = gameLevels.find((level) => level.level === currentLevelNumber);

        // Initialize enemies
        this._ennemiesControllers = new EnemyInitializer(Game.instance.scene).initEnemies(currentLevelConfig);

        this._ennemiesControllers.forEach((enemyController) => {
            this._collisionManager.addCollider(enemyController);
        });

        // Initialize player components
        this._playerController = new PlayerInitializer().initPlayer(currentLevelConfig);

        return Promise.resolve();
    }

    /**
     * Disposes of resources used by the level test state.
     */
    public dispose(): void {
        this._cubeMenu.dispose();
    }

    /**
     * Animates the level test state elements. (Empty implementation if no animation is required)
     */
    public animate(deltaTime: number): void {
        deltaTime;

        // Update enemies
        this._ennemiesControllers.forEach((ennemyControllers) => {
            ennemyControllers.update(deltaTime);
        });

        // Update player
        this._playerController.update(deltaTime);

        // Check for collisions
        this._collisionManager.checkForCollisions(this._playerController.weaponRight);
    }
}

export default LevelTest3State;
