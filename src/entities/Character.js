/* @flow */

import type { CharacterType } from '../definitions'
import type { EntityProps } from './Entity'

import { Animation } from './Animation'
import { Characters, CharacterStat } from '../definitions'
import { CharacterIdleState } from '../states/entities/CharacterIdleState'
import { CharacterDeathState } from '../states/entities/CharacterDeathState'
import { CharacterStunnedState } from '../states/entities/CharacterStunnedState'
import { CharacterWalkState } from '../states/entities/CharacterWalkState'
import { Damage } from './Damage'
import { Entity } from './Entity'
import { StateMachine } from '../states/StateMachine'

import { setColor } from '../engine'
import { random } from '../util'

export type CharacterState =
  | 'death'
  | 'idle'
  | 'stunned'
  | 'walk'

export type CharacterProps = $ReadOnly<{
  ...EntityProps,
  character: string,
  level?: number
}>

export class Character extends Entity {
  animations: $ReadOnlyArray<Animation>
  currentAnimation: Animation
  direction: number
  entities: Array<Entity>
  state: StateMachine<CharacterState>

  exp: number
  level: number
  expToLevel: number
  stats: Array<number>

  constructor (props: CharacterProps) {
    // $FlowFixMe[prop-missing]
    super({
      height: 14,
      width: 10,

      tileOX: -3,
      tileOY: -2,

      ...props
    })

    const char = Characters[props.character]
    this.animations = this.genAnimations(char)
    this.currentAnimation = this.animations[6]
    this.direction = 2

    this.state = new StateMachine({
      death: () => new CharacterDeathState(this),
      idle: () => new CharacterIdleState(this),
      stunned: () => new CharacterStunnedState(this),
      walk: () => new CharacterWalkState(this)
    })
    this.state.change('idle')

    this.exp = 0
    this.level = props.level ?? 1
    this.expToLevel = this.level * this.level * 5 * 0.75

    this.stats = char.stats.slice()

    for (let j = 1; j < this.level; j++) this.levelUp()
  }

  render () {
    if (this.state.current instanceof CharacterDeathState) {
      setColor('#fff', 0.5)
      super.render()
      setColor('#fff')
      return
    }

    super.render()
  }

  update (dt: number) {
    // update frame
    this.currentAnimation?.update(dt)
    this.tileID = this.currentAnimation?.getCurrentFrame()
    // handle i/o
    this.state.update(dt)
    // update position
    super.update(dt)
  }

  /* helpers */

  changeAnimation (animationID: number) {
    this.currentAnimation = this.animations[animationID]
  }

  changeState (stateName: CharacterState, input: mixed) {
    this.state.change(stateName, input)
  }

  genAnimations (characterDef: CharacterType): $ReadOnlyArray<Animation> {
    return characterDef.frames.map(frames =>
      new Animation(frames, characterDef.frameInterval))
  }

  getExp (exp: number) {
    this.exp += exp

    if (this.exp >= this.expToLevel) {
      this.levelUp()
      this.level++
      this.expToLevel = this.level * this.level * 5 * 0.75
    }
  }

  levelUp () {
    for (let t = 1; t < this.stats.length; t += 2) {
      const dc = this.stats[t + 1]

      for (let k = 0; k < 3; k++) {
        if (random(6) < dc) {
          this.stats[t]++
        }
      }
    }
  }

  takeDamage (damage: number, x: number, y: number, color?: number) {
    this.stats[CharacterStat.Hp] -= damage

    if (this.stats[CharacterStat.Hp] <= 0) {
      this.changeState('death')
    }

    this.entities.push(
      new Damage({ x, y, color, damage })
    )
  }
}
