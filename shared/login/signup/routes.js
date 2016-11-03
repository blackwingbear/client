// @flow
import {RouteDefNode} from '../../route-tree'
import InviteCode from './invite-code'
import RequestInvite from './request-invite'
import RequestInviteSuccess from './request-invite-success'
import UsernameEmailForm from './username-email-form'
import PassphraseSignup from './passphrase'
import DeviceName from './device-name'
import Success from './success'
import SignupError from './error'

const routeTree = new RouteDefNode({
  defaultSelected: 'signup',
  children: {
    signup: {
      component: InviteCode,
    },
    requestInvite: {
      component: RequestInvite,
    },
    requestInviteSuccess: {
      component: RequestInviteSuccess,
    },
    usernameAndEmail: {
      component: UsernameEmailForm,
    },
    passphraseSignup: {
      component: PassphraseSignup,
    },
    deviceName: {
      component: DeviceName,
    },
    success: {
      component: Success,
    },
    signupError: {
      component: SignupError,
    },
  }
})

export default routeTree
