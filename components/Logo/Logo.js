import React, { Component } from 'react'
import cs from 'classnames'

import { FinContext } from '../FinContext'

import styles from './styles.module.css'

export class Logo extends Component {
  render() {
    const {
      className,
      style = { },
      ...rest
    } = this.props

    return (
      <FinContext.Consumer>
        {deployment => (
          deployment.project.saas.logo ? (
            <img
              className={cs(styles.logo, className)}
              src={deployment.project.saas.logo}
              alt={`${deployment.project.saas.name} Logo`}
              style={{
                maxWidth: '3em',
                ...style
              }}
              {...rest}
            />
          ) : (
            <div
              className={cs(styles.logo, className)}
              style={style}
              {...rest}
            >
              {deployment.project.saas.name}
            </div>
          )
        )}
      </FinContext.Consumer>
    )
  }
}
