// @flow
import {RouteDefNode} from './route-tree'
import loginRoutes from './login/routes'
import devicesRoutes from './devices/routes'
import foldersRoutes from './folders/routes'
import profileRoutes from './profile/routes'
import searchRoutes from './search/routes'
import settingsRoutes from './settings/routes'
import Nav from './nav'
import {
  mainTab,
  loginTab,
  profileTab,
  folderTab,
  devicesTab,
  searchTab,
  settingsTab,
} from './constants/tabs'

const routeTree = new RouteDefNode({
  defaultSelected: loginTab,
  children: {
    [loginTab]: loginRoutes,
    [mainTab]: {
      defaultSelected: devicesTab,
      containerComponent: Nav,
      children: {
        [folderTab]: foldersRoutes,
        [devicesTab]: devicesRoutes,
        [profileTab]: profileRoutes,
        [searchTab]: searchRoutes,
        [settingsTab]: settingsRoutes,
      },
    },
  },
})

export default routeTree
