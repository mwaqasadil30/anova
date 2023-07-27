import BackIconButton from 'components/buttons/BackIconButton';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  ErrorRecordResponseModel,
  HornerRtuAnalogInputChannelDTO,
  ReasonCodeEnum,
} from 'api/admin/api';
import { useQueryClient } from 'react-query';
import { APIQueryKey } from 'api/react-query/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSaveSuccessSnackbar } from 'redux-app/modules/app/actions';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import routes from 'apps/admin/routes';
import { generatePath, useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import FormErrorAlert from 'components/FormErrorAlert';
import EditPageContainer from './components/EditPageContainer';
import useHornerRtuAnalogInputChannels from '../RTUEditor/components/ConfigurationTab/hooks/useHornerRtuAnalogInputChannels';
import RtuAiChannelsTable from './components/RtuAiChannelsTable';
import useSaveHornerRtuAiChannels from './hooks/useSaveHornerRtuAiChannels';
import useRtuAiChannelsEditorSchema from './hooks/useRtuAiChannelsEditorSchema';
import TemplateListAreaContainer from './components/TemplateListAreaContainer';
import ChannelsNewTemplateModal from './components/ChannelsNewTemplateModal';
import useSaveNewTemplate from './hooks/useSaveNewTemplate';
import AddRemoveChannelArea from './components/AddRemoveChannelArea';

type RtuAiChannelsEditorRouteProps = {
  rtuDeviceId: string;
};
class HornerRtuAnalogInputChannelDTOWithRowSelect extends HornerRtuAnalogInputChannelDTO {
  constructor(isDisplayed: boolean) {
    super();
    this.isDisplayed = isDisplayed;
  }
  isRowSelected?: boolean;
  id?: string;
}
const Wrapper = styled(({ topOffset, ...props }) => <div {...props} />)`
  ${(props) =>
    props.topOffset &&
    `
    display: flex;
    flex-direction: column;
    height: 100%
  `};
`;
const isValueNullFieldType = (val?: string | null) =>
  val === 'ReadingTime' || val === 'Unused' || val?.startsWith('Space');

const RtuAiChannelsEditor = () => {
  const { t } = useTranslation();

  const endOfPageRef = useRef<HTMLDivElement>(null);

  const [templateListTemplateId, setTemplateListTemplateId] = useState<number>(
    -1
  );

  const [
    editableTableTemplateId,
    setEditableTableTemplateId,
  ] = useState<number>(-1);

  const [
    isChannelsNewTemplateModalOpen,
    setIsChannelsNewTemplateModalOpen,
  ] = useState(false);

  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const queryClient = useQueryClient();
  const { mutate: saveNewTemplate } = useSaveNewTemplate();
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams<RtuAiChannelsEditorRouteProps>();
  const topOffset = useSelector(selectTopOffset);
  const [saveTemplateError, setSaveTemplateError] = useState<string>('');
  const [saveTableError, setSaveTableError] = useState<string[]>([]);
  const [saveTableRowsError, setSaveTableRowsError] = useState<
    Record<string, string>[]
  >([]);

  const {
    data,
    isSuccess,
    isLoading,
    isError,
  } = useHornerRtuAnalogInputChannels(
    params.rtuDeviceId,
    editableTableTemplateId
  );

  const { fieldTypeList, hornerRtuAnalogInputChannels, unitOfMeasureList } =
    data || {};

  const [currentAiChannelList, setCurrentAiChannelList] = useState<
    HornerRtuAnalogInputChannelDTOWithRowSelect[]
  >(
    hornerRtuAnalogInputChannels as HornerRtuAnalogInputChannelDTOWithRowSelect[]
  );

  useEffect(() => {
    if (hornerRtuAnalogInputChannels) {
      const mappedResult = hornerRtuAnalogInputChannels.map((item) => {
        return {
          ...item,
          toJSON: item.toJSON,
          init: item.init,
          isRowSelected: false,
        };
      });
      setCurrentAiChannelList(mappedResult);
    }
  }, [hornerRtuAnalogInputChannels]);

  const unitOfMeasureListMemo = useMemo(() => {
    return unitOfMeasureList?.map((item) => ({ label: item, value: item }));
  }, [unitOfMeasureList]);

  const fieldTypeListMemo = useMemo(() => {
    return fieldTypeList?.map((item) => ({
      ...item,
      label: item.fieldName,
      value: item.fieldType,
    }));
  }, [fieldTypeList]);

  const saveHornerRtuAiChannels = useSaveHornerRtuAiChannels();

  const rtuAiChannelsEditorSchema = useRtuAiChannelsEditorSchema();

  const hornerRtuAnalogInputChannelsMapped = currentAiChannelList?.map(
    (item) => {
      return {
        ...item,
        rawMinimumValue: isValueNullFieldType(item.fieldType)
          ? null
          : item.rawMinimumValue,
        rawMaximumValue: isValueNullFieldType(item.fieldType)
          ? null
          : item.rawMaximumValue,
        scaledMinimumValue: isValueNullFieldType(item.fieldType)
          ? null
          : item.scaledMinimumValue,
        scaledMaximumValue: isValueNullFieldType(item.fieldType)
          ? null
          : item.scaledMaximumValue,
        unitOfMeasure: isValueNullFieldType(item.fieldType)
          ? null
          : item.unitOfMeasure,
        decimalPlaces: isValueNullFieldType(item.fieldType)
          ? null
          : item.decimalPlaces,
        init: item.init,
        toJSON: item.toJSON,
        isRowSelected: item.isRowSelected || false,
      };
    }
  );
  const removeSelectedRows = (
    values: HornerRtuAnalogInputChannelDTOWithRowSelect[]
  ) => {
    const nonselectedRows =
      values?.filter((item) => {
        return item.isRowSelected !== true;
      }) || [];
    setCurrentAiChannelList(nonselectedRows);
  };

  const addNewRow = (values: HornerRtuAnalogInputChannelDTOWithRowSelect[]) => {
    const newRow = new HornerRtuAnalogInputChannelDTOWithRowSelect(true);

    if (currentAiChannelList) setCurrentAiChannelList([...values, newRow]);
    else setCurrentAiChannelList([newRow]);

    setTimeout(() => {
      endOfPageRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }, 100);
  };
  const handleErrorsOnSave = (errors: ErrorRecordResponseModel[]) => {
    const tableErrors: string[] = [];

    for (let i = 0; i < errors?.length; i++) {
      if (!errors[i]?.recordId) {
        tableErrors.push(errors?.[i].errorMessage || '');
      } else {
        const rowId = parseInt(errors[i]?.recordId || '-1', 10);
        const currentRowErrors = saveTableRowsError[rowId] || [];
        currentRowErrors[errors[i]?.propertyName!] =
          errors?.[i].errorMessage || '';
        saveTableRowsError[rowId] = currentRowErrors;
        const temp = saveTableRowsError;
        setSaveTableRowsError(temp);
      }
    }
    const isRepeatedChannelNumber = errors?.find(
      (d) =>
        d.reasonCodeTypeId === ReasonCodeEnum.RecordAlreadyExists &&
        d.propertyName === 'ChannelNumber'
    );
    if (isRepeatedChannelNumber) {
      tableErrors.push(
        t(
          'validate.hornermessagetemplate.uniquechannelnumber',
          'There is already another Field with the same Channel Number.'
        )
      );
    }
    setSaveTableError(tableErrors);
  };

  if (isLoading && editableTableTemplateId === -1)
    return (
      <Wrapper topOffset={topOffset}>
        <Box mt={3} style={{ height: '300px' }}>
          <TransitionLoadingSpinner in />
        </Box>
      </Wrapper>
    );

  if (isError)
    return (
      <Wrapper topOffset={topOffset}>
        <Box mt={3} style={{ height: '300px' }}>
          <TransitionErrorMessage in />
        </Box>
      </Wrapper>
    );
  return (
    <>
      {(isSuccess || editableTableTemplateId !== -1) && (
        <Formik
          initialValues={{
            channels: hornerRtuAnalogInputChannelsMapped || [],
          }}
          onSubmit={(
            values,
            {
              setSubmitting,
            }: FormikHelpers<{
              channels: HornerRtuAnalogInputChannelDTOWithRowSelect[];
            }>
          ) => {
            setSubmitting(true);
            saveHornerRtuAiChannels.mutate(
              {
                deviceId: params.rtuDeviceId,
                analogInputChannels: values.channels,
              },
              {
                onSuccess: () => {
                  setSubmitting(false);
                  dispatch(enqueueSaveSuccessSnackbar(t));
                  queryClient.invalidateQueries([
                    APIQueryKey.retrieveHornerAnalogInputChannels,
                    params.rtuDeviceId,
                  ]);
                },
              }
            );
          }}
          validationSchema={rtuAiChannelsEditorSchema}
          validateOnMount
          validateOnChange
          enableReinitialize
        >
          {({
            values,
            handleSubmit,
            handleChange,
            errors,
            isSubmitting,
            setSubmitting,
            resetForm,
          }) => (
            <EditPageContainer
              title={`${t(
                'ui.datachannel.editdetailchannels',
                'Edit Detail Channels'
              )} - ${params.rtuDeviceId.toUpperCase()}`}
              isSubmitting={isSubmitting}
              showSaveButton
              headerNavButton={<BackIconButton />}
              topOffset={topOffset + 10}
              cancel={() => {
                setEditableTableTemplateId(-1);
                setTemplateListTemplateId(-1);
                setCurrentAiChannelList(
                  hornerRtuAnalogInputChannels as HornerRtuAnalogInputChannelDTOWithRowSelect[]
                );
                setSaveTableError([]);
                setSaveTableRowsError([]);
                resetForm();
              }}
              onSave={() => {
                setSubmitting(true);
                setSaveTableError([]);
                setSaveTableRowsError([]);
                saveHornerRtuAiChannels.mutate(
                  {
                    deviceId: params.rtuDeviceId,
                    analogInputChannels: values.channels,
                  },
                  {
                    onSuccess: () => {
                      setSubmitting(false);
                      dispatch(enqueueSaveSuccessSnackbar(t));
                      queryClient.invalidateQueries([
                        APIQueryKey.retrieveHornerAnalogInputChannels,
                        params.rtuDeviceId,
                      ]);
                    },
                    onError: (saveErrors: any) => {
                      handleErrorsOnSave(saveErrors);
                      setSubmitting(false);
                    },
                  }
                );
              }}
              onSaveAndExit={() => {
                setSubmitting(true);
                setSaveTableError([]);
                setSaveTableRowsError([]);
                saveHornerRtuAiChannels.mutate(
                  {
                    deviceId: params.rtuDeviceId,
                    analogInputChannels: values.channels,
                  },
                  {
                    onSuccess: () => {
                      setSubmitting(false);
                      dispatch(enqueueSaveSuccessSnackbar(t));
                      queryClient.invalidateQueries([
                        APIQueryKey.retrieveHornerAnalogInputChannels,
                        params.rtuDeviceId,
                      ]);
                      const path = generatePath(routes.rtuManager.edit, {
                        rtuDeviceId: params.rtuDeviceId,
                        tabName: 'configuration',
                      });
                      history.push(path);
                    },
                    onError: (saveErrors: any) => {
                      handleErrorsOnSave(saveErrors);
                      setSubmitting(false);
                    },
                  }
                );
              }}
            >
              <TemplateListAreaContainer
                currentTemplateId={templateListTemplateId}
                onApply={(selectedTemplateId) => {
                  setEditableTableTemplateId(selectedTemplateId);
                  setTemplateListTemplateId(selectedTemplateId);
                }}
                onSaveAsNewTemplate={() => {
                  setIsChannelsNewTemplateModalOpen(true);
                }}
              />

              <Fade
                in={
                  !isSubmitting &&
                  (saveTableError?.length > 0 || saveTableRowsError?.length > 0)
                }
                unmountOnExit
              >
                <FormErrorAlert>
                  {t('ui.common.unableToSave', 'Unable to save')}
                </FormErrorAlert>
              </Fade>

              <AddRemoveChannelArea
                onAddRow={() => addNewRow(values.channels)}
                onDeleteRows={() => removeSelectedRows(values.channels)}
                channelCount={values.channels?.length}
                channelType="AICHANNEL"
              />
              <Form
                onSubmit={handleSubmit}
                style={{ height: '100%', minHeight: '1px' }}
              >
                <FieldArray name="channels">
                  {() => {
                    if (isLoading)
                      return (
                        <Wrapper topOffset={topOffset}>
                          <Box mt={3} style={{ height: '300px' }}>
                            <TransitionLoadingSpinner in />
                          </Box>
                        </Wrapper>
                      );

                    if (isSuccess && values.channels?.length > 0)
                      return (
                        <RtuAiChannelsTable
                          aiChannels={values.channels}
                          name="channels"
                          handleChange={(event) => {
                            handleChange(event);
                            setTemplateListTemplateId(-1);
                          }}
                          uomList={unitOfMeasureListMemo || []}
                          fieldTypeList={fieldTypeListMemo || []}
                          errors={errors}
                          rowServerErrors={saveTableRowsError}
                          onTableDataChanged={(orderedData) => {
                            setCurrentAiChannelList(
                              orderedData as HornerRtuAnalogInputChannelDTOWithRowSelect[]
                            );
                          }}
                        />
                      );
                    if (isSuccess && !(values.channels?.length > 0))
                      return (
                        <div
                          style={{
                            display: 'block',
                            textAlign: 'center',
                            marginTop: '2rem',
                          }}
                        >
                          <Typography variant="h5">
                            {t(
                              'ui.hornermessagetemplate.hasnofields',
                              'This Message Template has no fields.'
                            )}
                          </Typography>
                        </div>
                      );
                    return null;
                  }}
                </FieldArray>
              </Form>
              <ChannelsNewTemplateModal
                isOpen={isChannelsNewTemplateModalOpen}
                handleClose={() => {
                  setIsChannelsNewTemplateModalOpen(false);
                  setSaveTemplateError('');
                }}
                description={newTemplateDescription}
                setDescription={setNewTemplateDescription}
                onSaveTemplate={() => {
                  saveNewTemplate(
                    {
                      templateName: newTemplateDescription,
                      channels: values.channels,
                    },
                    {
                      onSuccess: (newTemplateId) => {
                        setIsChannelsNewTemplateModalOpen(false);
                        setNewTemplateDescription('');
                        dispatch(enqueueSaveSuccessSnackbar(t));
                        queryClient
                          .invalidateQueries([
                            APIQueryKey.getHornerTemplateList,
                            'ANALOG_INPUT',
                          ])
                          .then(() => {
                            setEditableTableTemplateId(newTemplateId || -1);
                            setTemplateListTemplateId(newTemplateId || -1);
                          });
                      },
                      onError: (error: any) => {
                        if (
                          error?.[0].reasonCodeTypeId ===
                          ReasonCodeEnum.NotUnique
                        ) {
                          setSaveTemplateError(
                            t(
                              'ui.rtuhorner.errorcreatingmessagetemplateNotUnique',
                              'Unable to create New Message Template: Description provided is not unique'
                            )
                          );
                        }
                      },
                    }
                  );
                }}
                error={saveTemplateError}
              />
            </EditPageContainer>
          )}
        </Formik>
      )}
      <div
        ref={endOfPageRef}
        style={{ display: 'block', width: '1px', height: '10px' }}
      />
    </>
  );
};
export default RtuAiChannelsEditor;
