// @flow
import * as I from 'immutable'
import * as Constants from '../constants/route-tree'
import {
  InvalidRouteError,
  getPath,
  routeSetProps,
  routeNavigate,
  routeSetState,
  routeClear,
  checkRouteState,
} from '../route-tree'

export const State = I.Record({
  routeDef: null,
  routeState: null,
})

const initialState = State()

function routeDefReducer (routeDef, action) {
  switch (action.type) {
    case Constants.setRouteDef:
      return action.payload.routeDef

    default:
      return routeDef
  }
}

function routeStateReducer (routeDef, routeState, action) {
  switch (action.type) {
    case Constants.setRouteDef:
      // If no routeState (app startup), set state to default routes.
      if (!routeState) {
        return routeSetProps(action.payload.routeDef, null, [])
      }

      // If a state exists, try to navigate it with the new defs (if possible),
      // falling back to default routes.
      let newRouteState
      try {
        newRouteState = routeNavigate(action.payload.routeDef, routeState, getPath(routeState))
      } catch (err) {
        if (err instanceof InvalidRouteError) {
          console.warn('New route tree mismatches current state. Resetting route state.')
          newRouteState = routeSetProps(action.payload.routeDef, null, [])
        } else {
          throw err
        }
      }
      return newRouteState

    case Constants.switchTo:
      return routeSetProps(routeDef, routeState, action.payload.path, action.payload.parentPath)

    case Constants.navigateTo:
      return routeNavigate(routeDef, routeState, action.payload.path, action.payload.parentPath)

    case Constants.navigateAppend: {
      const path = getPath(routeState, action.payload.parentPath)
      return routeNavigate(routeDef, routeState, action.payload.path, path)
    }

    case Constants.navigateUp: {
      const path = getPath(routeState)
      const newRouteState = routeClear(routeState, path)
      return routeNavigate(routeDef, newRouteState, path.skipLast(1))
    }

    case Constants.setRouteState:
      return routeSetState(routeDef, routeState, action.payload.path, action.payload.partialState)

    case Constants.resetRoute:
      return routeClear(routeState, action.payload.path)

    default:
      return routeState
  }
}

export default function routeTreeReducer (state: State = initialState, action: any): State {
  let {routeDef, routeState} = state

  const newRouteDef = routeDefReducer(routeDef, action)
  const newRouteState = routeStateReducer(routeDef, routeState, action)

  const routeError = checkRouteState(newRouteDef, newRouteState)
  if (routeError) {
    console.error(`Attempt to perform ${action.type} would result in invalid routeTree state: "${routeError}". Aborting.`)
    return state
  }

  return state.merge({
    routeDef: newRouteDef,
    routeState: newRouteState,
  })
}
