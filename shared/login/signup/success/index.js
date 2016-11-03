// @flow
import React, {Component} from 'react'
import RenderSuccess from './index.render'
import {connect} from 'react-redux'
import {sawPaperKey} from '../../../actions/signup'

export default connect(
  (state, {routeProps}) => routeProps
)(RenderSuccess)
