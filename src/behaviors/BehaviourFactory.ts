import { Vector3 } from '@babylonjs/core';
import {
    AttractEnemyProperties,
    AvoidMeshMeshProperties,
    BehaviorType,
    BehaviourData,
    FloatingProperties,
    GravityProperties,
    MoveAtoBProperties,
} from '../game/models/LevelData';
import LevelState from '../stateManager/states/LevelState';
import AttractEnemy from './AttractEnemy';
import AvoidMeshs from './AvoidMeshs';
import Floating from './Floating';
import Gravity from './Gravity';
import IBehaviour from './IBehaviour';
import MoveAtoB from './MoveAtoB';

class BehaviourFactory {
    public static createBehaviour(behaviorData: BehaviourData): IBehaviour {
        switch (behaviorData.type) {
            case BehaviorType.AttractEnemy:
                return BehaviourFactory._createAttractEnemy(behaviorData as AttractEnemyProperties);
            case BehaviorType.AvoidMesh:
                return BehaviourFactory._createAvoidMesh(behaviorData as AvoidMeshMeshProperties);
            case BehaviorType.Floating:
                return BehaviourFactory._createFloating(behaviorData as FloatingProperties);
            case BehaviorType.Gravity:
                return BehaviourFactory._createGravity(behaviorData as GravityProperties);
            case BehaviorType.MoveAtoB:
                return BehaviourFactory._createMoveAtoB(behaviorData as MoveAtoBProperties);
            default:
                throw new Error(`Unsupported behaviour type: ${behaviorData.type}`);
        }
    }

    private static _createAttractEnemy(properties: AttractEnemyProperties): IBehaviour {
        return new AttractEnemy(LevelState._enemiesController, properties.force, properties.radius);
    }

    private static _createAvoidMesh(properties: AvoidMeshMeshProperties): IBehaviour {
        return new AvoidMeshs(properties.force, properties.radius);
    }

    private static _createFloating(properties: FloatingProperties): IBehaviour {
        return new Floating(properties.force, properties.oscillationFreq);
    }

    private static _createGravity(properties: GravityProperties): IBehaviour {
        return new Gravity(properties.force);
    }

    private static _createMoveAtoB(properties: MoveAtoBProperties): IBehaviour {
        return new MoveAtoB(
            properties.force,
            properties.radius,
            new Vector3(properties.pointA.x, properties.pointA.y, properties.pointA.z),
            new Vector3(properties.pointB.x, properties.pointB.y, properties.pointB.z)
        );
    }
}

export default BehaviourFactory;