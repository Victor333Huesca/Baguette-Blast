import { AbstractMesh } from '@babylonjs/core';
import Game from '../../game/Game';
import BalloonView from './BalloonView';

class CopperBalloonView extends BalloonView {
    public constructor() {
        super();
    }

    protected _createMesh(): AbstractMesh {
        return Game.instance.assetManager.getBalloonBronzeInstance();
    }
}
export default CopperBalloonView;
