import { Mesh, MeshBuilder, Vector3 } from '@babylonjs/core';
import IBehaviour from '../../behaviors/IBehaviour';
// import Gravity from '../../behaviors/Gravity';
import AttractEnemy from '../../behaviors/AttractEnemy';
import Gravity from '../../behaviors/Gravity';
import EnemyFactory from '../../enemy/EnemyFactory';
import EnemyController from '../../enemy/controllers/EnemyController';
import Game from '../../game/Game';
import CollisionManager from '../../game/controllers/CollisionManager';
import GameManager from '../../game/controllers/GameManager';
import { LevelData } from '../../game/models/LevelData';
import Buttons from '../../menu/buttons';
import PlayerController from '../../player/controllers/PlayerController';
import PlayerModel from '../../player/models/PlayerModels';
import PlayerView from '../../player/views/PlayerViews';
import ProjectileController from '../../projectile/controllers/ProjectileController';
import ProjectileView from '../../projectile/views/ProjectileView';
import GunController from '../../weapon/controllers/GunController';
import GunModel from '../../weapon/models/GunModel';
import GunView from '../../weapon/views/GunView';
import State from '../EnumState';
import StateInterface from './StateInterface';

class LevelState implements StateInterface {
    private _levelNumber: number;
    private _levelData?: LevelData;
    private _collisionManager: CollisionManager;
    private _playerController: PlayerController;
    private _enemiesController: EnemyController[] = [];
    private _cubeMenu: Mesh;
    private _score: number;

    constructor(levelNumber: number) {
        this._setLevelNumber(levelNumber);
        this._returnLevelByNumber(levelNumber)
            .then((levelData) => {
                // Use the level data here
                this._levelData = levelData;
            })
            .catch((error) => {
                // Handle errors here
                console.error('Cannot load level data:', error);
            });
        this._collisionManager = new CollisionManager();
    }

    private _returnLevelByNumber(levelNumber: number): Promise<LevelData> {
        const url = `../../levels/level${levelNumber}.json`;
        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch level ${levelNumber}: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // Assuming LevelData is an interface representing your JSON data structure
                return data as LevelData;
            })
            .catch((error) => {
                console.error('Error loading level data:', error);
                throw error;
            });
    }

    private _setLevelNumber(levelNumber: number): void {
        if (levelNumber <= 0) {
            throw new Error('Please set a positive number as the level number.');
        }
        this._levelNumber = levelNumber;
    }

    private _initInterface(): void {
        this._cubeMenu = MeshBuilder.CreateBox('cubeMenu', { size: 1 }, Game.instance.scene);
        const playerPosition = new Vector3(
            this._levelData?.player?.position.x,
            this._levelData?.player?.position.y,
            this._levelData?.player?.position.z
        );
        this._cubeMenu.position = playerPosition.add(new Vector3(0, 0, 5));
        Buttons.clickable(Game.instance.scene, this._cubeMenu, () => {
            Game.instance.stateManager.changeState(State.MenuHome);
        });
    }

    private _initPlayerController(): void {
        this._playerController = new PlayerController(new PlayerModel(), new PlayerView());
        this._playerController.resetHealth(this._levelData?.player?.health || 100);
        this._playerController.teleport(
            new Vector3(
                this._levelData?.player?.position.x,
                this._levelData?.player?.position.y,
                this._levelData?.player?.position.z
            )
        );

        // TODO : Add behavior in json file /////////////////////////////////////////////////
        const behaviors: IBehaviour[] = [];
        behaviors.push(new Gravity(25));
        behaviors.push(new AttractEnemy(this._enemiesController, 5, 10));
        // behaviors.push(new MoveAtoB(1, new Vector3(0, 0, 0), new Vector3(0, 0, 10), 5));
        //////////////////////////////////////////////////////////////////////////////////////

        const projectile = new ProjectileController(new ProjectileView(), behaviors);

        const weaponView = new GunView();
        const weaponModel = new GunModel(
            // const weaponView = new HandView();
            // const weaponModel = new HandModel(
            this._levelData?.player?.left_hand?.power || 10
        );
        // const weaponController = new HandController(weaponModel, weaponView);
        const weaponController = new GunController(weaponModel, weaponView);
        weaponController.projectile = projectile;

        this._playerController.giveWeapon('right', weaponController);
    }

    public async init(): Promise<void> {
        try {
            GameManager.getInstance(this._levelData?.game?.time || 30).resetChrono();
            this._initInterface();
            this._initializeLevelData();
            Game.instance.audioManager.switchTrackSmoothly('level' + this._levelNumber);
        } catch (error) {
            console.error('Error during game initialization:', error);
        }
    }

    private _initializeLevelData(): void {
        if (this._levelData?.player) {
            this._initPlayerController();
            this._collisionManager.addCollider(this._playerController);
            Game.instance.player = this._playerController;
        }

        // Init score
        this._score = 0;

        if (this._levelData?.enemies) {
            this._enemiesController.push(...this._levelData.enemies.map((enemy) => EnemyFactory.createEnemy(enemy)));
            this._enemiesController.forEach((enemyController) => {
                this._collisionManager.addCollider(enemyController);
            });
        } else {
            console.log('No enemies found in the level data.');
        }
    }

    public dispose(): void {
        this._cubeMenu.dispose();
        this._enemiesController.forEach((enemy) => enemy.dispose());
        this._enemiesController = [];
        this._playerController.weaponRight.getProjectiles().forEach((projectile) => projectile.dispose());
        this._playerController.dispose();
        Game.instance.audioManager.switchTrackSmoothly('theme');
        Game.instance.player = null;
    }

    public update(deltaTime: number): void {
        // Assuming playerController has a method to get current health
        const playerHealth = this._playerController.health;

        GameManager.getInstance().update(deltaTime, playerHealth, this._enemiesController);

        // Update enemies
        this._enemiesController.forEach((enemyController) => {
            enemyController.update(deltaTime);
        });

        // Update player
        this._playerController.update(deltaTime);

        // let elimination = null;
        // Check for collisions
        // elimination = this._collisionManager.checkForCollisions(this._playerController.weaponRight);
        // if (elimination) {
        //     // Remove the enemy from the list
        //     const index = this._enemiesController.indexOf(elimination);
        //     if (index > -1) {
        //         this._score += this._enemiesController[index].score;
        //         Game.score = this._score;
        //         this._enemiesController.splice(index, 1);
        //     }
        //     elimination.dispose();
        // }
        this._collisionManager.checkCollisions();
    }
}

export default LevelState;
