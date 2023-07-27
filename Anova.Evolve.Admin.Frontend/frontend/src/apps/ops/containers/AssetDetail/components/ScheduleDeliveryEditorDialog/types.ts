export interface TimeDropdownOption {
  fullDate: string;
  time: string;
  amountToFill: number;
  unit: string;
  fullFormattedStringForOption: string;
}

export interface Values {
  date?: Date | null;
  deliveryScheduleId?: string;
  dataChannelId?: string;
  scheduledTime?: string;
  timeCompleted?: Date | null;
  isAutoFill?: boolean;
  deliveryAmount?: number | null;
  lateGracePeriodInMinutes?: number | null;
}
