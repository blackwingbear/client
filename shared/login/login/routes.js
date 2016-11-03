// @flow
import {RouteDefNode} from '../../route-tree'
import Login from './'
import UsernameOrEmail from '../register/username-or-email'
import SelectOtherDevice from '../register/select-other-device'
import GPGSign from '../register/gpg-sign'
import Passphrase from '../register/passphrase'
import PaperKey from '../register/paper-key'
import CodePage from '../register/code-page'
import SetPublicName from '../register/set-public-name'
import Success from '../signup/success'
import Error from '../register/error'

const routeTree = new RouteDefNode({
  defaultSelected: 'login',
  children: {
    login: {
      component: Login,
    },
    error: {
      component: Error,
    },
    usernameOrEmail: {
      component: UsernameOrEmail,
    },
    selectOtherDevice: {
      component: SelectOtherDevice,
    },
    gpgSign: {
      component: GPGSign,
    },
    passphrase: {
      component: Passphrase,
    },
    paperkey: {
      component: PaperKey,
    },
    codePage: {
      component: CodePage,
    },
    setPublicName: {
      //FIXME title: '',
      //FIXME leftButtonTitle: '',
      component: SetPublicName,
    },
    success: {
      component: Success,
    },
  },
})

export default routeTree
