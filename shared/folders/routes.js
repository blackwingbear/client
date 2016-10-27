// @flow
import {Routes} from '../route-tree'
import {PrivateFolders, PublicFolders} from './'
import Files from './files'
import PaperKey from './files/paperkey'

const filesSubTree = {
  files: {
    component: Files,
    children: {
      paperkey: {
        component: PaperKey,
      },
    },
  },
}

const routeTree = Routes({
  defaultSelected: 'private',
  children: {
    private: {
      component: PrivateFolders,
      initialState: {showingIgnored: false},
      children: filesSubTree,
    },
    public: {
      component: PublicFolders,
      initialState: {showingIgnored: false},
      children: filesSubTree,
    },
  }
})

export default routeTree