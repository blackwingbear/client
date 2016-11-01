// @flow
import {RouteDefNode} from '../route-tree'
import pgpRoutes from './pgp/routes'
import Profile from './container'
import EditProfile from './edit-profile'
import EditAvatar from './edit-avatar-container'
import ProveEnterUsername from './prove-enter-username-container'
import ProveWebsiteChoice from './prove-website-choice-container'
import RevokeContainer from './revoke/container'
import PostProof from './post-proof-container'
import ConfirmOrPending from './confirm-or-pending-container'

export const profileRoutes = new RouteDefNode({
  component: Profile,
  title: 'Profile',
  initialState: {currentFriendshipsTab: 'Followers'},
  children: {
    profile: () => profileRoutes,
  },
})

const routeTree = new RouteDefNode({
  ...profileRoutes.toJS(),
  children: {
    profile: () => profileRoutes,
    editProfile: {
      title: 'Edit profile',
      component: EditProfile,
    },
    editAvatar: {
      component: EditAvatar,
    },
    proveEnterUsername: {
      component: ProveEnterUsername,
    },
    proveWebsiteChoice: {
      component: ProveWebsiteChoice,
    },
    revoke: {
      component: RevokeContainer,
    },
    postProof: {
      component: PostProof,
    },
    confirmOrPending: {
      component: ConfirmOrPending,
    },
    pgp: pgpRoutes,
  }
})

export default routeTree
