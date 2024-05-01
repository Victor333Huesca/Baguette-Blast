import { Vector3 } from '@babylonjs/core';
import BaseBonusController from '../../bonus/controllers/BaseBonusController';
import ProjectileController from '../../projectile/controllers/ProjectileController';
import BaseEnemyModel from '../models/BaseEnemyModel';
import BaseEnemyView from '../views/BaseEnemyView';

class EnemyController implements ICollider{
    private _model: BaseEnemyModel; 
    private _view: BaseEnemyView; 
    private _bonusController: BaseBonusController;

    constructor(model: BaseEnemyModel, view: BaseEnemyView) {
        this._model = model;
        this._view = view;
    }

    collidesWith(other: ICollider): boolean {
        if (other instanceof ProjectileController) {
            console.log('collidesWith');
            return true;
        }
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onCollision(other: ICollider): void {
        return;
    }

    dispose(): void {
        this._view.onKill();
        this.view.dispose(); 
        if (this._bonusController) {
            this._bonusController.dispose();
        }
    }

    update(deltaTime: number): void {
        this._model.update(deltaTime);
        this._view.update();
    }

    public get model(): BaseEnemyModel {
        return this._model;
    }

    public get view(): BaseEnemyView {
        return this._view;
    }

    public get score(): number {
        return this._model.score;
    }

    public set score(value: number) {
        this._model.score = value;
    }

    public get position(): Vector3 {
        return this._model.position;
    }

    public set bonusController(controller: BaseBonusController) {
        this._bonusController = controller;
        // set the bonus view for the enemy view
        this._view.bonusView = controller.view;
    }
}

export default EnemyController;