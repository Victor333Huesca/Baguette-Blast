interface WeaponData {
    type: WeaponType;
    projectile: ProjectileType;
    force: number;
    durability: number;
    cooldown: number;
}

enum WeaponType {
    Hand = 'hand',
    Gun = 'gun',
    GatlingGun = 'gatlingGun',
}

enum ProjectileType {
    Ball = 'ball',
    Laser = 'laser',
}

interface PlayerData {
    left_hand: WeaponData;
    right_hand: WeaponData;
    health: number;
    position: {
        x: number;
        y: number;
        z: number;
    };
}

interface BonusData {
    type: BonusType;
    value: number;
}

enum BonusType {
    Score = 'score',
    Time = 'time',
}

enum BehaviourType {
    AttractEnemy = 'attractEnemy',
    AvoidMesh = 'avoidMesh',
    Floating = 'floating',
    Gravity = 'gravity',
    MoveAtoB = 'moveAtoB',
    MoveFreelyInCube = 'moveFreelyInCube',
}

interface BehaviourData {
    type: BehaviourType;
}

interface AttractEnemyProperties extends BehaviourData {
    type: BehaviourType.AttractEnemy;
    force: number;
    radius: number;
}

interface AvoidMeshMeshProperties extends BehaviourData {
    type: BehaviourType.AvoidMesh;
    force: number;
    radius: number;
}

interface FloatingProperties extends BehaviourData {
    type: BehaviourType.Floating;
    force: number;
    oscillationFreq: number;
}

interface GravityProperties extends BehaviourData {
    type: BehaviourType.Gravity;
    force: number;
}

interface MoveAtoBProperties extends BehaviourData {
    type: BehaviourType.MoveAtoB;
    force: number;
    radius: number;
    pointA: {
        x: number;
        y: number;
        z: number;
    };
    pointB: {
        x: number;
        y: number;
        z: number;
    };
}

interface MoveFreelyInCubeProperties {
    type: BehaviourType.MoveFreelyInCube;
    force: number;
    radius: number;
    minPosition: { x: number; y: number; z: number; };
    maxPosition: { x: number; y: number; z: number; };
}

interface EnemyData {
    type: EnemyType;
    health: number;
    position: {
        x: number;
        y: number;
        z: number;
    };
    bonus: BonusData;
    behaviours: BehaviourData[];
    score: number;
}

enum EnemyType {
    Copper = 'copper',
    Silver = 'silver',
    Gold = 'gold',
    Pigeon = 'pigeon',
}

interface GameData {
    time: number;
    score: number;
}

interface Wave {
    waveNumber: number; // Optionally added for clearer wave tracking
    enemies: EnemyData[];
}

interface LevelData {
    player: PlayerData;
    waves: Wave[];
    game: GameData;
}

export {
    AttractEnemyProperties,
    AvoidMeshMeshProperties, BehaviourData, BehaviourType, BonusData,
    BonusType,
    EnemyData,
    EnemyType, FloatingProperties, GameData, GravityProperties, LevelData, MoveAtoBProperties, 
    MoveFreelyInCubeProperties,
    ProjectileType, 
    WeaponData,
    WeaponType
};

