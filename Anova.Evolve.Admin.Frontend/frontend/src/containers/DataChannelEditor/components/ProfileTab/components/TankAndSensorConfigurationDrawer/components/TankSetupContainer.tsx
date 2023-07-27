/* eslint-disable indent, react/jsx-indent */
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {
  DataChannelReportDTO,
  DataChannelCategory,
  ProductNameInfoDto,
  TankDimensionInfoDto,
  TankSetupInfoDTO,
  UnitConversionModeEnum,
  UserPermissionType,
} from 'api/admin/api';
import CloseButtonIcon from 'components/buttons/CloseIconButton';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EditorBox from 'components/EditorBox';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import ProductAutocomplete from 'components/forms/form-fields/ProductAutocomplete';
import TankDimensionAutocomplete from 'components/forms/form-fields/TankDimensionAutocomplete';
import ProductLabelWithEditorButtons from 'components/forms/labels/LabelWithEditorButtons/ProductLabelWithEditorButtons';
import TankDimensionLabelWithEditorButtons from 'components/forms/labels/LabelWithEditorButtons/TankDimensionLabelWithEditorButtons';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import PageSubHeader from 'components/PageSubHeader';
import ProductEditor from 'containers/ProductEditor';
import TankDimensionEditor from 'containers/TankDimensionEditor';
import { Field } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import { EMPTY_GUID } from 'utils/api/constants';
import { StyledFieldLabelText, StyledValueText } from '../../../styles';
import { Values } from '../types';

interface Props {
  values: Values;
  dataChannelDetails?: DataChannelReportDTO | null;
  isTotalizedDataChannel: boolean;
  isLevelDataChannel: boolean;
  tankSetupInfo?: TankSetupInfoDTO | null;
  tankTypeOptions: {
    label: any;
    value: number;
  }[];
  unitConversionModeTextMapping: Record<UnitConversionModeEnum, string>;
  allUnitConversionModeEnumOptions?: {
    label: string;
    value: UnitConversionModeEnum;
  }[];
}

const TankSetupContainer = ({
  values,
  dataChannelDetails,
  isTotalizedDataChannel,
  isLevelDataChannel,
  tankSetupInfo,
  tankTypeOptions,
  unitConversionModeTextMapping,
}: Props) => {
  const { t } = useTranslation();

  const isPressureDataChannel =
    dataChannelDetails?.dataChannelTypeId === DataChannelCategory.Pressure;

  const hasPermission = useSelector(selectHasPermission);

  const canCreateProduct = hasPermission(
    UserPermissionType.ProductAccess,
    AccessType.Create
  );
  const canUpdateProduct = hasPermission(
    UserPermissionType.ProductAccess,
    AccessType.Update
  );
  const showDefaultProductAutocomplete = !canCreateProduct && !canUpdateProduct;

  const canCreateTankDimension = hasPermission(
    UserPermissionType.TankDimensionAccess,
    AccessType.Create
  );
  const canUpdateTankDimension = hasPermission(
    UserPermissionType.TankDimensionAccess,
    AccessType.Update
  );

  const showDefaultTankDimensionAutocomplete =
    !canCreateTankDimension && !canUpdateTankDimension;

  const isVolumetricTank =
    values.unitConversionModeId === UnitConversionModeEnum.Volumetric;

  // Product Autocomplete with add / edit buttons
  const initialSelectedProduct = dataChannelDetails?.tankSetupInfo?.productId
    ? ProductNameInfoDto.fromJS({
        productId: dataChannelDetails?.tankSetupInfo.productId,
        name: dataChannelDetails?.tankSetupInfo.productName,
      })
    : null;
  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState<ProductNameInfoDto | null>(initialSelectedProduct);
  const [editingProductId, setEditingProductId] = useState<string | null>();
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);

  // Product Drawer
  const toggleProductDrawer = (open: boolean, options?: any) => (
    event?: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setIsProductDrawerOpen(open);

    if (open && options) {
      setEditingProductId(options?.productId);
    }
  };

  // Tank Dimensions Autocomplete with add / edit buttons
  const initialSelectedTankDimensionId = dataChannelDetails?.tankSetupInfo
    ?.tankTypeInfo?.tankDimensionId
    ? TankDimensionInfoDto.fromJS({
        id: dataChannelDetails?.tankSetupInfo?.tankTypeInfo?.tankDimensionId,
        description:
          dataChannelDetails?.tankSetupInfo?.tankTypeInfo
            ?.tankDimensionDescription,
      })
    : null;
  const [selectedTankDimension, setSelectedTankDimension] = useState<
    TankDimensionInfoDto | null | undefined
  >(initialSelectedTankDimensionId);
  const [editingTankDimensionId, setEditingTankDimensionId] = useState<
    string | null
  >();
  const [isTankDimensionDrawerOpen, setIsTankDimensionDrawerOpen] = useState(
    false
  );

  // Tank Dimensions Drawer
  const toggleTankDimensionDrawer = (open: boolean, options?: any) => (
    event?: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setIsTankDimensionDrawerOpen(open);

    if (open && options) {
      setEditingTankDimensionId(options?.tankDimensionId);
    }
  };

  const formattedPageSubheader = isPressureDataChannel
    ? t('ui.common.product', 'Product')
    : t('ui.dataChannel.tankSetup', 'Tank Setup');

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <PageSubHeader dense>{formattedPageSubheader}</PageSubHeader>
      </Grid>
      <Grid item xs={12}>
        <EditorBox>
          <Grid container spacing={2} alignItems="center">
            {/* 
              NOTE: Oct 12, 2021 
              Temporarily removing the ability to edit unit conversion mode
              So it is a read-only label for now
             */}
            {!isPressureDataChannel && (
              <>
                <Grid item xs={4}>
                  <StyledFieldLabelText>
                    {t(
                      'ui.dataChannel.unitsConversionMode',
                      'Units Conversion Mode'
                    )}
                  </StyledFieldLabelText>
                </Grid>
                <Grid item xs={8}>
                  <StyledValueText>
                    {
                      unitConversionModeTextMapping[
                        values.unitConversionModeId as UnitConversionModeEnum
                      ]
                    }
                  </StyledValueText>
                </Grid>
              </>
            )}

            {/* {isTotalizedDataChannel ? (
              <>
                <Grid item xs={4}>
                  <StyledFieldLabelText>
                    {t(
                      'ui.dataChannel.unitsConversionMode',
                      'Units Conversion Mode'
                    )}
                  </StyledFieldLabelText>
                </Grid>
                <Grid item xs={8}>
                  <StyledValueText>
                    {
                      unitConversionModeTextMapping[
                        values.unitConversionModeId as UnitConversionModeEnum
                      ]
                    }
                  </StyledValueText>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={4}>
                  <StyledFieldLabelText>
                    {t(
                      'ui.dataChannel.unitsConversionMode',
                      'Units Conversion Mode'
                    )}
                  </StyledFieldLabelText>
                </Grid>
                <Grid item xs={8}>
                  <Field
                    id="unitConversionModeId-input"
                    name="unitConversionModeId"
                    component={CustomTextField}
                    select
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value="" disabled>
                      <SelectItem />
                    </MenuItem>
                    {allUnitConversionModeEnumOptions?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
              </>
            )} */}

            {isLevelDataChannel && (
              <>
                <Grid item xs={4}>
                  <StyledFieldLabelText
                    style={{
                      marginTop:
                        showDefaultTankDimensionAutocomplete && isVolumetricTank
                          ? 'initial'
                          : '24px',
                    }}
                  >
                    {isVolumetricTank
                      ? t('ui.tankSetup.tankProfile', 'Tank Profile')
                      : t('ui.datachannel.tanktype', 'Tank Type')}
                  </StyledFieldLabelText>
                </Grid>
                <Grid item xs={8}>
                  {isVolumetricTank ? (
                    <>
                      {showDefaultTankDimensionAutocomplete ? (
                        <Field
                          id="tankDimensionId-input"
                          name="tankDimensionId"
                          component={TankDimensionAutocomplete}
                          selectedOption={selectedTankDimension}
                          onChange={setSelectedTankDimension}
                          textFieldProps={{
                            placeholder: t(
                              'ui.common.enterSearchCriteria',
                              'Enter Search Criteria...'
                            ),
                          }}
                        />
                      ) : (
                        <>
                          <Drawer
                            anchor="right"
                            open={isTankDimensionDrawerOpen}
                            // @ts-ignore
                            onClose={toggleTankDimensionDrawer(false)}
                            variant="temporary"
                            disableBackdropClick
                          >
                            <DrawerContent>
                              <TankDimensionEditor
                                editingObjectId={editingTankDimensionId}
                                isInlineForm
                                headerNavButton={
                                  <CloseButtonIcon
                                    onClick={toggleTankDimensionDrawer(false)}
                                  />
                                }
                                saveCallback={(response: any) => {
                                  const tankDimension =
                                    response?.saveTankDimensionResult
                                      ?.editObject;

                                  setSelectedTankDimension(
                                    TankDimensionInfoDto.fromJS({
                                      id:
                                        response?.saveTankDimensionResult
                                          ?.editObject.tankDimensionId,
                                      description:
                                        response?.saveTankDimensionResult
                                          ?.editObject.description,
                                    })
                                  );
                                  setEditingTankDimensionId(
                                    tankDimension?.tankDimensionId
                                  );
                                }}
                                saveAndExitCallback={(response: any) => {
                                  const tankDimension =
                                    response?.saveTankDimensionResult
                                      ?.editObject;

                                  setSelectedTankDimension(
                                    TankDimensionInfoDto.fromJS({
                                      id:
                                        response?.saveTankDimensionResult
                                          ?.editObject.tankDimensionId,
                                      description:
                                        response?.saveTankDimensionResult
                                          ?.editObject.description,
                                    })
                                  );
                                  setEditingTankDimensionId(
                                    tankDimension?.tankDimensionId
                                  );
                                  toggleTankDimensionDrawer(false)();
                                }}
                              />
                            </DrawerContent>
                          </Drawer>
                          <Field
                            id="tankDimensionId-input"
                            name="tankDimensionId"
                            component={TankDimensionAutocomplete}
                            selectedOption={selectedTankDimension}
                            textFieldProps={{
                              label: (
                                <TankDimensionLabelWithEditorButtons
                                  hideLabelText
                                  isEditButtonDisabled={
                                    !values.tankDimensionId ||
                                    values.tankDimensionId === EMPTY_GUID
                                  }
                                  onClickEdit={toggleTankDimensionDrawer(true, {
                                    tankDimensionId: values.tankDimensionId,
                                  })}
                                  onClickAdd={toggleTankDimensionDrawer(true, {
                                    tankDimensionId: null,
                                  })}
                                />
                              ),
                              placeholder: t(
                                'ui.common.enterSearchCriteria',
                                'Enter Search Criteria...'
                              ),
                            }}
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <Field
                      id="tankTypeId-input"
                      name="tankTypeId"
                      component={CustomTextField}
                      select
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="" disabled>
                        <SelectItem />
                      </MenuItem>

                      {tankTypeOptions?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  )}
                </Grid>
              </>
            )}

            {/*
              (Read-only label)
              Totalized level data channel types only show a tank type,
              back-end will always send back its a totalized level
            */}
            {isTotalizedDataChannel && (
              <>
                <Grid item xs={4}>
                  <StyledFieldLabelText>
                    {t('ui.datachannel.tanktype', 'Tank Type')}
                  </StyledFieldLabelText>
                </Grid>
                <Grid item xs={8}>
                  <StyledValueText>
                    {tankSetupInfo?.tankTypeInfo?.tankTypeAsText}
                  </StyledValueText>
                </Grid>
              </>
            )}

            <Grid item xs={4}>
              <StyledFieldLabelText
                style={{
                  marginTop: showDefaultProductAutocomplete
                    ? 'initial'
                    : '24px',
                }}
              >
                {t('ui.common.product', 'Product')}
              </StyledFieldLabelText>
            </Grid>
            {showDefaultProductAutocomplete ? (
              <Grid item xs={8}>
                <Field
                  id="productId-input"
                  name="productId"
                  component={ProductAutocomplete}
                  selectedOption={selectedProduct}
                  onChange={setSelectedProduct}
                  textFieldProps={{
                    placeholder: t(
                      'ui.common.enterSearchCriteria',
                      'Enter Search Criteria...'
                    ),
                  }}
                />
              </Grid>
            ) : (
              <Grid item xs={8}>
                <Drawer
                  anchor="right"
                  open={isProductDrawerOpen}
                  // @ts-ignore
                  onClose={toggleProductDrawer(false)}
                  variant="temporary"
                  disableBackdropClick
                >
                  <DrawerContent>
                    <ProductEditor
                      editingObjectId={editingProductId}
                      isInlineForm
                      headerNavButton={
                        <CloseButtonIcon onClick={toggleProductDrawer(false)} />
                      }
                      saveCallback={(response: any) => {
                        const product = response?.saveProductResult?.editObject;

                        const selectedProductForAutocomplete = ProductNameInfoDto.fromJS(
                          {
                            ...product,
                            productId: product?.id,
                            name: product?.name,
                          }
                        );

                        setSelectedProduct(selectedProductForAutocomplete);
                        setEditingProductId(product?.id);
                      }}
                      saveAndExitCallback={(response: any) => {
                        const product = response?.saveProductResult?.editObject;

                        const selectedProductForAutocomplete = ProductNameInfoDto.fromJS(
                          {
                            ...product,
                            productId: product?.id,
                            name: product?.name,
                          }
                        );

                        setSelectedProduct(selectedProductForAutocomplete);
                        setEditingProductId(product?.id);
                        toggleProductDrawer(false)();
                      }}
                    />
                  </DrawerContent>
                </Drawer>
                <Field
                  id="productId-input"
                  name="productId"
                  component={ProductAutocomplete}
                  selectedOption={selectedProduct}
                  textFieldProps={{
                    placeholder: t(
                      'ui.common.enterSearchCriteria',
                      'Enter Search Criteria...'
                    ),
                    label: (
                      <ProductLabelWithEditorButtons
                        hideLabelText
                        isEditButtonDisabled={
                          !values.productId || values.productId === EMPTY_GUID
                        }
                        onClickEdit={toggleProductDrawer(true, {
                          productId: values.productId,
                        })}
                        onClickAdd={toggleProductDrawer(true, {
                          productId: null,
                        })}
                      />
                    ),
                  }}
                />
              </Grid>
            )}
          </Grid>
        </EditorBox>
      </Grid>
    </Grid>
  );
};

export default TankSetupContainer;
