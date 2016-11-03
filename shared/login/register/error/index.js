// @flow
import React, {Component} from 'react'
import RenderError from './index.render'
import type {Props} from './index.render'
import {connect} from 'react-redux'

export default connect(
  (state, {routeProps}) => routeProps,
)(RenderError)
