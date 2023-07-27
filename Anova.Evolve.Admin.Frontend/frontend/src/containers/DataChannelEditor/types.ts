export enum DataChannelEditorTab {
  Profile = 'Profile',
  History = 'History',
}

export interface DataChannelEditorLocationState {
  tab?: DataChannelEditorTab;
}
