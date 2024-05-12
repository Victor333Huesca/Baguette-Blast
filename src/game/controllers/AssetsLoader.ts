import { AbstractMesh, AssetsManager, InstancedMesh, Mesh, MeshBuilder, Scene, Vector3 } from '@babylonjs/core';
import WallController from '../../wall/controllers/WallController';
import WallModel from '../../wall/models/WallModel';
import WallView from '../../wall/view/WallView';
import Game from '../Game';

class AssetsLoader {
    // Scene
    private readonly _scene: Scene;

    // Dictionaries of meshes
    private readonly _dictModels: Map<string, Mesh>;

    // Instance counters
    private _instancesCounters: Map<string, number>;

    // Constants
    private readonly _modelPathRepertory = 'models/'; // from public folder
    private readonly _modelExtension = '.obj';
    private readonly _modelNames = [
        'Scene',
        'BonusTime',
        'BonusHourglass',
        'BonusScore',
        'BallonBronze',
        'BallonSilver',
        'BallonGold',
        'Bullet',
    ];

    /////////////////
    // Constructor //
    /////////////////

    public constructor() {
        this._scene = Game.instance.scene;
        this._dictModels = new Map();
        this._instancesCounters = new Map();
    }

    public async initialize(): Promise<void> {
        await this._loadAssets();
        this._generateColliders();
    }

    private async _loadAssets(): Promise<void> {
        // Create an asset manager to handle the loading of the models
        const assetManager = new AssetsManager(this._scene);

        // For each model, define a task to load it
        this._modelNames.forEach((name) => {
            // Define the task to load the mesh
            const task = assetManager.addMeshTask(name, '', this._modelPathRepertory, `${name}${this._modelExtension}`);

            // Define the callback for when the mesh is loaded successfully
            task.onSuccess = (task) => {
                this._postProcessMesh(name, task.loadedMeshes[0] as Mesh);
            };

            // Define the callback for when the mesh fails to load
            task.onError = (task, message, exception) => console.error(`Failed to load ${name}: ${message}`, exception);
        });

        // Start the asset manager loading the models
        return new Promise((resolve, reject) => {
            assetManager.onFinish = () => resolve();
            assetManager.onTaskError = (task) => reject(new Error(`Failed loading ${task.name}`));
            assetManager.load();
        });
    }

    private _postProcessMesh(name: string, mesh: Mesh): void {
        // Re-scale bonus meshes
        if (name.startsWith('Bonus')) {
            mesh.scaling.scaleInPlace(0.5);
        }

        // Re-scale bullet mesh
        if (name === 'Bullet') {
            mesh.scaling.scaleInPlace(0.05);
        }

        // Hide all meshes except the scene
        if (name !== 'Scene') {
            mesh.setAbsolutePosition(new Vector3(0, -20, 0));
            mesh.setEnabled(false);
        }

        // Add the mesh to the mesh dictionary
        this._dictModels.set(name, mesh);
    }

    private _generateColliders(): void {
        Game.instance.scene.meshes.forEach((mesh) => {
            if (mesh.name.toLowerCase().includes('collider')) {
                mesh.isVisible = false;

                const wallController = new WallController(new WallView(), new WallModel(mesh));
                Game.instance.collisionManager.addCollider(wallController);
            }
        });
    }

    ///////////////
    // Factories //
    ///////////////

    public getBonusTimeInstance(): InstancedMesh {
        return this._createInstance('BonusTime');
    }

    public getBonusHourglassInstance(): InstancedMesh {
        return this._createInstance('BonusHourglass');
    }

    public getBonusScoreInstance(): InstancedMesh {
        return this._createInstance('BonusScore');
    }

    public getBalloonBronzeInstance(): InstancedMesh {
        return this._createInstance('BallonBronze');
    }

    public getBalloonSilverInstance(): InstancedMesh {
        return this._createInstance('BallonSilver');
    }

    public getBalloonGoldInstance(): InstancedMesh {
        return this._createInstance('BallonGold');
    }

    public getBulletInstance(): InstancedMesh {
        return this._createInstance('Bullet');
    }

    /////////////////
    // Hitbox API //
    /////////////////

    public createHitbox(mesh: AbstractMesh, padding: number): AbstractMesh {
        // Get the bounding box of the mesh
        const boundingBox = mesh.getBoundingInfo().boundingBox;

        // Create a box mesh to represent the hitbox
        const hitbox = MeshBuilder.CreateBox(
            'hitbox',
            {
                width: boundingBox.maximum.x - boundingBox.minimum.x - padding,
                height: boundingBox.maximum.y - boundingBox.minimum.y - padding,
                depth: boundingBox.maximum.z - boundingBox.minimum.z - padding,
            },
            Game.instance.scene
        );
        hitbox.position = boundingBox.center;
        hitbox.parent = mesh;
        hitbox.showBoundingBox = true;
        hitbox.isVisible = false;

        return hitbox;
    }

    /////////////////
    // Private API //
    /////////////////

    private _createInstance(meshName: string): InstancedMesh {
        const mesh = this._dictModels.get(meshName);

        // Build the instance name
        const count = this._getInstancesCount(meshName);
        const instanceName = `${meshName}_${count}`;

        // Create the instance
        return this._createInstanceRecursive(mesh, instanceName);
    }

    private _createInstanceRecursive(mesh: Mesh, name: string, parent?: InstancedMesh): InstancedMesh {
        const instance = mesh.createInstance(`${name}$`);
        instance.isVisible = true;
        instance.parent = parent;
        mesh.getChildMeshes().forEach((child) => {
            if (child instanceof Mesh) {
                this._createInstanceRecursive(child, name + '_child', instance);
            }
        });
        return instance;
    }

    private _getInstancesCount(name: string): number {
        if (!this._instancesCounters.has(name)) {
            // Initialize the counter if it does not exist
            this._instancesCounters.set(name, 0);
        } else {
            // Increment the counter if it already exists
            this._instancesCounters.set(name, this._instancesCounters.get(name) + 1);
        }

        return this._instancesCounters.get(name);
    }
}

export default AssetsLoader;
