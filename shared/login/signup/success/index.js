// @flow
import RenderSuccess from './index.render'
import {connect} from 'react-redux'

export default connect(
  (state, {routeProps}) => routeProps
)(RenderSuccess)
