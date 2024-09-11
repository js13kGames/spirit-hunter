/* @flow */

import type { Entity } from './Entity'

import { BlasterAimState } from '../states/weapons/BlasterAimState'
import { BlasterCooldownState } from '../states/weapons/BlasterCooldownState'
import { BlasterFireState } from '../states/weapons/BlasterFireState'
import { Character } from './Character'
import { Enemy } from './Enemy'
import { PlayerIdleState } from '../states/entities/PlayerIdleState'
import { PlayerWalkState } from '../states/entities/PlayerWalkState'
import { CharacterDeathState } from '../states/entities/CharacterDeathState'
import { CharacterStunnedState } from '../states/entities/CharacterStunnedState'
import { StateMachine } from '../states/StateMachine'

type BlasterState =
  | 'aim'
  | 'cooldown'
  | 'fire'

export class Player extends Character {
  blasterWeapon: StateMachine<BlasterState>

  constructor (x?: number, y?: number) {
    super({
      x,
      y,
      height: 14,
      width: 10,

      isCollidable: true,
      isSolid: true,

      tileOX: -3,
      tileOY: -2,

      character: 'player'
    })

    this.state = new StateMachine({
      death: () => new CharacterDeathState(this),
      idle: () => new PlayerIdleState(this),
      stunned: () => new CharacterStunnedState(this),
      walk: () => new PlayerWalkState(this)
    })
    this.state.change('idle')

    this.blasterWeapon = new StateMachine({
      aim: () => new BlasterAimState(this),
      cooldown: () => new BlasterCooldownState(this),
      fire: () => new BlasterFireState(this)
    })
    this.blasterWeapon.change('aim')
  }

  update (dt: number) {
    this.blasterWeapon.update(dt)
    // handle state & position update
    super.update(dt)
  }

  /* helpers */

  collided (entity: Entity) {
    if (entity instanceof Enemy) {
      // handle impact
    }
  }
}
