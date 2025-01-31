/* @flow */

import type { Entity } from './Entity'

import { Enemy } from './Enemy'
import { Obstacle } from './Obstacle'
import { Thing } from './Thing'
import { TileSize } from '../shared/constants'

import { line, setColor } from '../engine'

type Props = {
  x: number,
  y: number,
  dx: number,
  dy: number,

  damage: number,
  size?: number
}

export class Projectile extends Thing {
  startX: number
  startY: number

  damage: number

  constructor (props: Props) {
    super({
      x: props.x,
      y: props.y,
      width: props.size ?? 1,
      height: props.size ?? 1,

      isCollidable: true,
      isSolid: false
    })

    this.dx = props.dx
    this.dy = props.dy
    this.startX = props.x
    this.startY = props.y

    this.damage = props.damage
  }

  render () {
    setColor('red')
    line(this.startX, this.startY, this.x, this.y)
  }

  update (dt: number) {
    super.update(dt)

    const d = Math.max(
      Math.abs(this.startX - this.x),
      Math.abs(this.startY - this.y)
    )

    if (d >= 3 * TileSize) {
      this.isDestroyed = true
    }
  }

  /* helpers */

  collided (entity: Entity) {
    if (entity instanceof Enemy) {
      entity.takeDamage(this.damage, this.x, this.y, 2)
    }

    if (entity instanceof Obstacle) {
      this.isDestroyed = true
    }
  }
}
