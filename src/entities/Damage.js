/* @flow */

import { DamageDuration, TileSize } from '../shared/constants'
import { Thing } from './Thing'
import { inCubic } from '../shared/easing'

import { printf, setColor, setFont } from '../engine'

const colors = ['#fff', '#d72744', '#79c834']

type Props = {
  x: number,
  y: number,
  color?: number,
  damage: number,
}

export class Damage extends Thing {
  color: number
  damage: number
  timer: number

  constructor (props: Props) {
    super({
      x: props.x,
      y: props.y
    })

    this.color = props.color ?? 0
    this.damage = props.damage
    this.timer = 0
  }

  render () {
    const y = inCubic(
      this.timer,
      this.y,
      -0.5 * TileSize,
      DamageDuration
    )

    setColor(colors[this.color])
    setFont(8)
    // todo center
    printf(String(this.damage), this.x, y)
  }

  update (dt: number) {
    this.timer += dt
    if (this.timer >= DamageDuration) this.isDestroyed = true
  }
}
