import * as I from 'immutable'
import React, {PureComponent} from 'react'

function pathToString(path) {
  return path.join('/') || '/'
}

class RenderRouteNode extends PureComponent {
  render() {
    const {wrap, routeDef, routeState, setRouteState, path, leafTags, partialState, children} = this.props

    const RouteComponent = wrap ? routeDef.containerComponent : routeDef.component
    if (!RouteComponent) {
      throw new Error(`Route missing ${wrap ? 'wrap ': ''}component: ${pathToString(path)}`)
    }

    return (
      <RouteComponent
        routeProps={routeState.props.toJS()}
        routeState={routeDef.initialState.merge(routeState.state).toJS()}
        routeSelected={routeState.selected}
        routePath={path}
        routeLeafTags={leafTags && leafTags.toJS()}
        setRouteState={partialState => setRouteState(path, partialState)}
      >{children}</RouteComponent>
    )
  }
}

function _RenderRoute({routeDef, routeState, setRouteState, path}): React$Element {
  path = path || I.List()

  if (!routeDef) {
    throw new Error(`Undefined route: ${pathToString(path)}`)
  } else if (!routeState) {
    throw new Error(`Missing route state: ${pathToString(path)}`)
  }

  const selected = routeState.selected
  if (selected === null) {
    return {
      component: (
        <RenderRouteNode
          routeDef={routeDef}
          routeState={routeState}
          path={path}
          setRouteState={setRouteState}
        />
      ),
      leafTags: routeDef.tags,
    }
  } else {
    let childDef = routeDef.children.get(selected)
    if (typeof childDef === 'function') {
      childDef = childDef()
    }
    const childState = routeState.children.get(selected)
    const childPath = path.push(selected)
    const childRender = _RenderRoute({routeDef: childDef, routeState: childState, path: childPath, setRouteState})

    let nextComponent
    if (!routeDef.containerComponent) {
      nextComponent = childRender.component
    } else {
      nextComponent = (
        <RenderRouteNode
          wrap={true}
          routeDef={routeDef}
          routeState={routeState}
          path={path}
          setRouteState={setRouteState}
          leafTags={childRender.leafTags}
        >
          {childRender.component}
        </RenderRouteNode>
      )
    }

    return {
      component: nextComponent,
      leafTags: childRender.leafTags,
    }
  }
}

export default class RenderRoute extends PureComponent {
  render() {
    return _RenderRoute(this.props).component
  }
}