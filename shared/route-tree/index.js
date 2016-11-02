// @flow
import * as I from 'immutable'
import {Component} from 'react'

import type {ConnectedComponent} from 'react-redux'
import type {ConnectedComponent as TypedConnectedComponent} from '../util/typed-connect'

type LeafTagsParams = {
  modal: boolean,
}

export const LeafTags: (spec?: LeafTagsParams) => LeafTagsParams & I.Record<LeafTagsParams> = I.Record({
  modal: false,
})

const _RouteDefNode = I.Record({
  defaultSelected: null,
  component: null,
  containerComponent: null,
  tags: LeafTags(),
  initialState: I.Map(),
  children: I.Map(),
})

type RouteDefParams<P> = {
  defaultSelected?: string,
  tags?: LeafTags,
  initialState?: {},
  children: {},
} & (
  { component?: Component<*, P, *> | Class<ConnectedComponent<P, *, *, *>> | Class<TypedConnectedComponent<P>> }
  | { containerComponent: Component<*, P, *> }
)

export class RouteDefNode extends _RouteDefNode {
  constructor ({defaultSelected, component, containerComponent, tags, initialState, children}: RouteDefParams<*>) {
    super({
      defaultSelected: defaultSelected || null,
      component,
      containerComponent,
      tags: LeafTags(tags),
      initialState: I.Map(initialState),
      props: I.Map(),
      state: I.Map(),
      children: I.Seq(children)
        .map(params => params instanceof RouteDefNode || typeof params === 'function' ? params : new RouteDefNode(params))
        .toMap(),
    })
  }

  getChild (name: string): ?RouteDefNode {
    const childDef = this.children.get(name)
    if (!childDef) {
      return
    }
    if (typeof childDef === 'function') {
      return childDef()
    }
    return childDef
  }
}

type RouteStateParams = {
  selected: string | null,
  props?: I.Map<string, any>,
  state?: I.Map<string, any>,
}

const _RouteStateNode = I.Record({
  selected: null,
  props: I.Map(),
  state: I.Map(),
  children: I.Map(),
})

export class RouteStateNode extends _RouteStateNode {
  constructor (data: RouteStateParams) {
    super(data)
  }

  getChild (name: string): RouteStateNode {
    return this.children.get(name)
  }

  updateChild (name: string, op: (node: RouteStateNode) => ?RouteStateNode): RouteStateNode {
    return this.updateIn(['children', name], op)
  }
}

export class InvalidRouteError extends Error {}

// Explicit list of iterable types to accept. We don't want to allow strings
// since navigateTo('foo') instead of navigateTo(['foo']) is an easy mistake to
// make.
type PathIterable<X> = I.IndexedSeq<X> | I.List<X> | Array<X>
export type Path = PathIterable<string>
export type PathLike = [] | Path | PathIterable<string | {selected: string | null}>
export type PropsPath = I.IndexedIterable<{type: 'next' | 'navigate', next: string | null, props?: {}}>

function _routeSet (routeDef: RouteDefNode, routeState: ?RouteStateNode, path: PropsPath): RouteStateNode {
  const pathHead = path && path.first()

  let newRouteState = routeState || new RouteStateNode({selected: routeDef.defaultSelected})
  if (pathHead && pathHead.type === 'navigate') {
    newRouteState = newRouteState.set('selected', pathHead.next)
  }

  const childName = pathHead && pathHead.type === 'next' ? pathHead.next : newRouteState.selected
  if (childName !== null) {
    const childDef = routeDef.getChild(childName)
    if (!childDef) {
      throw new InvalidRouteError(`Invalid route child: ${childName}`)
    }

    newRouteState = newRouteState.updateChild(childName, childState => {
      let newChild = _routeSet(childDef, childState, path.skip(1))
      if (pathHead && pathHead.hasOwnProperty('props')) {
        newChild = newChild.set('props', I.fromJS(pathHead.props))
      }
      return newChild
    })
  }

  return newRouteState
}

export function routeSetProps (routeDef: RouteDefNode, routeState: ?RouteStateNode, pathProps: PathLike, parentPath: ?Path): RouteStateNode {
  const pathSeq = I.Seq(pathProps).map(item => {
    if (typeof item === 'string') {
      return {type: 'navigate', next: item}
    } else {
      const {selected, ...props} = item
      return {type: 'navigate', next: selected, props}
    }
  })
  const parentPathSeq = I.Seq(parentPath || []).map(item => {
    return {type: 'next', next: item}
  })
  return _routeSet(routeDef, routeState, parentPathSeq.concat(pathSeq))
}

export function routeNavigate (routeDef: RouteDefNode, routeState: ?RouteStateNode, pathProps: PathLike, parentPath: ?Path): RouteStateNode {
  return routeSetProps(routeDef, routeState, I.List(pathProps).push({selected: null}), parentPath)
}

export function routeSetState (routeDef: RouteDefNode, routeState: RouteStateNode, path: Path, partialState: {}): RouteStateNode {
  const pathSeq = I.Seq(path)
  if (!pathSeq.size) {
    return routeState.update('state', state => state.merge(partialState))
  }
  return routeState.updateChild(pathSeq.first(),
    childState => routeSetState(routeDef, childState, pathSeq.skip(1), partialState)
  )
}

export function routeClear (routeState: ?RouteStateNode, path: Path): ?RouteStateNode {
  if (!routeState) {
    return null
  }
  const pathSeq = I.Seq(path)
  if (!pathSeq.size) {
    return null
  }
  return routeState.updateChild(pathSeq.first(),
    childState => routeClear(childState, pathSeq.skip(1))
  )
}

export function checkRouteState (routeDef: RouteDefNode, routeState: ?RouteStateNode): ?string {
  if (!routeDef) {
    return
  }

  let path = []
  let curDef = routeDef
  let curState = routeState
  while (curState && curState.selected !== null) {
    path.push(curState.selected)
    curDef = curDef.getChild(curState.selected)
    curState = curState.getChild(curState.selected)
    if (!curDef) {
      return `Missing route def: ${pathToString(path)}`
    }
  }
  if (!curState) {
    return `Route missing state: ${pathToString(path)}`
  }
  if (!curDef.component) {
    return `Route missing component: ${pathToString(path)}`
  }
}

export function getPath (routeState: RouteStateNode, parentPath?: Path): I.List<string> {
  const path = []
  let curState = routeState

  if (parentPath) {
    I.Seq(parentPath).forEach(next => {
      curState = curState.getChild(next)
      path.push(next)
    })
  }

  while (curState && curState.selected !== null) {
    path.push(curState.selected)
    curState = curState.getChild(curState.selected)
  }
  return I.List(path)
}

export function pathToString (path: Array<string> | I.IndexedIterable<string>): string {
  return '/' + path.join('/')
}
