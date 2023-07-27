export interface LabelWithEditorButtonsProps {
  label: React.ReactNode;
  isAddButtonDisabled?: boolean;
  isEditButtonDisabled?: boolean;
  showAddButton?: boolean;
  showEditButton?: boolean;
  onClickEdit: () => void;
  onClickAdd: () => void;
}

export interface LabelWithEditorButtonsHelperProps
  extends Omit<LabelWithEditorButtonsProps, 'label'> {
  label?: LabelWithEditorButtonsProps['label'];
  hideLabelText?: boolean;
}
