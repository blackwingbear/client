// @flow
import React, {Component} from 'react'
import Render from './render'
import {connect} from 'react-redux'
import {editProfile} from '../../actions/profile'
import {maxProfileBioChars} from '../../constants/profile'
import {navigateUp} from '../../actions/route-tree'

import type {Props} from './render'

class EditProfile extends Component<void, Props, State> {
  onSubmit () {
    this.props.onEditProfile()
  }

  render () {
    const bioMaxChars = maxProfileBioChars
    const bioLengthLeft = bioMaxChars - this.props.bio.length
    return <Render
      bio={this.props.bio}
      bioLengthLeft={bioLengthLeft}
      fullname={this.props.fullname}
      location={this.props.location}
      onBack={this.props.onBack}
      onBioChange={bio => this.props.onChangeBio(bio)}
      onCancel={this.props.onBack}
      onEditProfile={this.props.onEditProfile}
      onFullnameChange={fullname => this.props.onChangeFullname(fullname)}
      onLocationChange={location => this.props.onChangeLocation(location)}
      onSubmit={() => this.onSubmit()}
    />
  }
}

// $FlowIssue type this connector
export default connect(
  (state, {routeState}) => {
    const userInfo = state.tracker.trackers[state.config.username].userInfo
    return ({
      bio: routeState.bio || userInfo.bio,
      fullname: routeState.fullname || userInfo.fullname,
      location: routeState.location || userInfo.location,
    })
  },
  (dispatch, {routeState, setRouteState}) => {
    return {
      onBack: () => dispatch(navigateUp()),
      onChangeBio: bio => { setRouteState({bio}) },
      onChangeFullname: fullname => { setRouteState({fullname}) },
      onChangeLocation: location => { setRouteState({location}) },
      onEditProfile: () => dispatch(editProfile(routeState.bio, routeState.fullname, routeState.location)),
    }
  }
)(EditProfile)
