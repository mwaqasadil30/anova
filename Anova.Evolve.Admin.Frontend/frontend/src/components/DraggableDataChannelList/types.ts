export interface CustomDraggableItem {
  id: string | number;
  content: React.ReactNode;
  description?: string | null;
  rtuDeviceId?: string | null;
  channelNumber?: string | null;
}
