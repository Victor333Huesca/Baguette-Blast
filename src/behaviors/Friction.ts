import { AbstractMesh, Vector3 } from '@babylonjs/core';
import BehaviorsInterface from './BehaviorsInterface';

class Friction implements BehaviorsInterface {
    private _friction: number;

    constructor(friction: number) {
        this._friction = friction;
    }

    public getForceVector(deltaTime: number, mesh: AbstractMesh, currentForce: Vector3): Vector3 {
        const friction = currentForce.clone();
        friction.normalize();
        friction.scaleInPlace(-this._friction * deltaTime);

        return friction;
    }
}

export default Friction;
