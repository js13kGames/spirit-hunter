/* @flow */

import type { EntityDefinitionType } from '../definitions/entityDefinitions'
import { Animation } from './Animation'
import { Direction } from '../constants'
import { StateMachine } from '../states/StateMachine'
import { EntityIdleState } from '../states/entities/EntityIdleState'
import { EntityWalkState } from '../states/entities/EntityWalkState'
import { entityDefinitions } from '../definitions/entityDefinitions'
import { draw } from '../engine'

export class Entity {
  animations: $ReadOnlyArray<Animation>
  currentAnimation: Animation

  direction: number
  state: StateMachine

  x: number
  y: number
  width: number
  height: number

  collidable: boolean
  remove: boolean

  constructor (entityName: string) {
    this.animations = this.genAnimations(
      entityDefinitions[entityName].frames,
      entityDefinitions[entityName].frameTime
    )
    this.currentAnimation = this.animations[2]

    this.direction = Direction.Bottom
    this.state = new StateMachine({
      idle: () => new EntityIdleState(this),
      walk: () => new EntityWalkState(this)
    })
    this.state.change('idle')

    this.x = 0
    this.y = 0
    this.width = 16
    this.height = 16

    this.collidable = true
    this.remove = false
  }

  changeAnimation (animation: number) {
    this.currentAnimation = this.animations[animation]
  }

  changeState (stateName: string) {
    this.state.change(stateName)
  }

  genAnimations (
    animations: EntityDefinitionType['frames'],
    frameTime: number
  ): $ReadOnlyArray<Animation> {
    return animations.map(frames => new Animation(frames, frameTime))
  }

  render () {
    draw(
      gTextures.tiles[this.currentAnimation.getCurrentFrame()],
      this.x,
      this.y
    )

    this.state.render()
  }

  update (dt: number) {
    this.currentAnimation.update(dt)
    this.state.update(dt)
  }
}
