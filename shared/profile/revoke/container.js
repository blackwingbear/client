// @flow
import React, {Component} from 'react'
import Revoke from './index'
import {TypedConnector} from '../../util/typed-connect'
import {submitRevokeProof, finishRevoking, dropPgp} from '../../actions/profile'

import type {PlatformsExpandedType} from '../../constants/types/more'
import type {Props} from './index'
import type {TypedState} from '../../constants/reducer'
import type {TypedDispatch} from '../../constants/types/flux'

type OwnProps = {
  platform: PlatformsExpandedType,
  proofId: string,
  platformHandle: string,
}

class RevokeContainer extends Component<void, Props, void> {
  static parseRoute (currentPath, uri) {
    return {
      componentAtTop: {
        title: 'Revoke Proof',
        props: {
          platform: currentPath.get('platform'),
          proofId: currentPath.get('proofId'),
          platformHandle: currentPath.get('platformHandle'),
        },
      },
    }
  }

  render () {
    return <Revoke {...this.props} />
  }
}

const connector: TypedConnector<TypedState, TypedDispatch<{}>, OwnProps, Props> = new TypedConnector()

export default connector.connect(
  (state, dispatch, ownProps) => ({
    isWaiting: state.profile.revoke.waiting,
    errorMessage: state.profile.revoke.error,
    onCancel: () => { dispatch(finishRevoking()) },
    onRevoke: () => {
      if (ownProps.platform === 'pgp') {
        dispatch(dropPgp(ownProps.proofId))
      } else {
        dispatch(submitRevokeProof(ownProps.proofId))
      }
    },
    platform: ownProps.platform,
    platformHandle: ownProps.platformHandle,
  })
)(RevokeContainer)
