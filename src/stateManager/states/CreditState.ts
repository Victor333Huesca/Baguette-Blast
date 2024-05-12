import Game from '../../game/Game';
import State from '../EnumState';
import BaseState from './BaseState';
import CustomUI from '../../UI/CustomUI';

class CreditState extends BaseState {

    public async init(): Promise<void> {
        this._scene = Game.instance.scene;
        this._setupCamera();
        this._setupGUI();
        return Promise.resolve();
    }

    private _setupCamera(): void {
        // const camera = Game.instance.cameraManager.playerCamera;
        // camera.position = new Vector3(-1.5, 3, 4);
        // camera.setTarget(new Vector3(-1.5, 3, 5));
    }

    private _setupGUI(): void {
        if (!this._scene) {
            console.error('Scene not initialized');
            return;
        }

        const panel = CustomUI.addPanel(1, 1);
        CustomUI.createTextZone([
            'Credit, team Baguette Blast:', 
            'Made by Clément Q., Rémi C., Benjamin M.',
            'Games on Web 2024 - Sophia Antipolis',
            '', 
            'Thanks for playing!',
            '', 
            'Special thanks to our teachers and sponsors!',
            'CGI, Univ. Côte d\'Azur, Aix-Marseille, Toulon',
        ], CustomUI.panelTextCenter, 6, 2);
        CustomUI.addButton('Back', State.Home, panel, true);
    }

    public update(deltaTime: number): void { deltaTime; }
}

export default CreditState;