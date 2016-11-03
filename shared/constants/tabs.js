// @flow
export const mainTab = 'tabs:mainTab'
type ChatTab = 'tabs:chatTab'
export const chatTab = 'tabs:chatTab'
type LoginTab = 'tabs:loginTab'
export const loginTab = 'tabs:loginTab'

type ProfileTab = 'tabs:profile'
export const profileTab = 'tabs:profile'
type PeopleTab = 'tabs:peopleTab'
export const peopleTab = 'tabs:peopleTab'
type DevicesTab = 'tabs:devicesTab'
export const devicesTab = 'tabs:devicesTab'
type FolderTab = 'tabs:folderTab'
export const folderTab = 'tabs:folderTab'
type SearchTab = 'tabs:searchTab'
export const searchTab = 'tabs:searchTab'
type SettingsTab = 'tabs:settingsTab'
export const settingsTab = 'tabs:settingsTab'

const prettyNames = {
  [folderTab]: 'Folders',
  [chatTab]: 'Chat',
  [peopleTab]: 'People',
  [devicesTab]: 'Devices',
  [settingsTab]: 'Settings',
  [loginTab]: 'Login',
  [profileTab]: 'Profile',
}

export type VisibleTab = ProfileTab
| SearchTab
| PeopleTab
| FolderTab
| DevicesTab
| SettingsTab

export type Tabs = VisibleTab
| ChatTab
| LoginTab

export function prettify (tabName: string) {
  //TODO: cleanup?
  return prettyNames[tabName] || 'You have found a bug'
}

