import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {
  AssetGroupSearchCriteria,
  EditAssetGroup,
  EvolveAssetGroupCriteriaOptionInfo,
  RetrieveAssetGroupEditComponentsResult,
} from 'api/admin/api';
import { ReactComponent as ClearRow } from 'assets/icons/cancel.svg';
import Alert from 'components/Alert';
import Button from 'components/Button';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import EditorBox from 'components/EditorBox';
import FormLinearProgress from 'components/FormLinearProgress';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SwitchWithLabel from 'components/forms/form-fields/SwitchWithLabel';
import FormikEffect from 'components/forms/FormikEffect';
import DisplayOnlyValue, {
  DisplayOnlyField,
} from 'components/forms/styled-fields/DisplayOnlyValue';
import PageSubHeader from 'components/PageSubHeader';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableFooterCell from 'components/tables/components/TableFooterCell';
import TableHead from 'components/tables/components/TableHead';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectActiveDomainId } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { gray100 } from 'styles/colours';
import { fieldMaxLength } from 'utils/forms/errors';
import * as Yup from 'yup';
import { ObjectSchemaDefinition } from 'yup';
import {
  Comparator,
  convertSearchCriteriaToSelection,
  convertSelectionToPartialSearchCriteria,
  CustomSizedSpan,
  CustomSizedTableBorderlessCells,
  getClearCriteria,
  Options,
  PaddedHeadCell,
  prepareValueOptions,
  PropertyPath,
  ResponsePayload,
  SelectionCriteria,
  TopAlignedPaddedCell,
} from '../constants';
import DomainTable from './DomainTable';
import FormSelect from './FormSelect';
import SelectedAssets from './SelectedAssets';
import UserTable from './UserTable';
import ValueField from './ValueField';

const ActionCell = styled(TableCell)`
  text-align: center;
  width: 150px;
  padding: 0;
`;

const StyledButtonText = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
`;

interface FieldSchema {
  tests: any[];
  transforms: (() => any)[];
  type: string;
  required: (msg: string) => any;
}

const buildValidationSchema = (t: TFunction) => {
  const { object, string } = Yup;
  const fieldRequiredText = (field: string) =>
    t('validate.common.isrequired', '{{field}} is required.', {
      field,
    });
  const stringTypeCheck = (fieldLabel: string) =>
    string().typeError(fieldRequiredText(fieldLabel));
  const copy = {
    description: t('ui.common.description', 'Description'),
    filter: t('ui.assetgrouplist.firstparameter', 'First Parameter'),
    comparator: t('report.assetgrouplist.logic', 'Logic'),
    value: t('ui.assetgrouplist.secondparameter', 'Second Parameter'),
    operator: t('ui.common.andor', 'And/Or'),
  };

  const checks = {
    filter: (index: number) => {
      const stringCheck = stringTypeCheck(copy.filter);

      return stringCheck.test(
        'validating-filter',
        fieldRequiredText(copy.filter), // error message
        /* eslint-disable-next-line func-names */
        function () {
          const filterValue = this.parent[`filter${index}`];
          const comparatorValue = this.parent[`comparator${index}`];
          const selectedValue = this.parent[`value${index}`];
          const previousOperator = this.parent[`operator${index - 1}`];
          const filter2Value = this.parent.filter2;
          const filter3Value = this.parent.filter3;
          const filter4Value = this.parent.filter4;

          // If this is the first row of criteria, and there's at least one
          // other filter set, except for the first one, mark the filter as
          // required
          if (
            index === 1 &&
            !filterValue &&
            (!!filter2Value || !!filter3Value || !!filter4Value)
          ) {
            return false;
          }

          // If the previous operator is set, but there is no filter value,
          // mark it as required
          if (previousOperator && !filterValue) {
            return false;
          }

          // If theres no filter value, but the comparator or selected value is
          // set, then mark it as required
          if (!filterValue && (!!comparatorValue || !!selectedValue)) {
            return false;
          }

          return true;
        }
      );
    },
    comparator: (index: number) => {
      return stringTypeCheck(copy.comparator).test(
        'validating-comparator',
        fieldRequiredText(copy.comparator), // error message
        /* eslint-disable-next-line func-names */
        function () {
          const filterValue = this.parent[`filter${index}`];
          const comparatorValue = this.parent[`comparator${index}`];
          const selectedValue = this.parent[`value${index}`];
          const previousOperator = this.parent[`operator${index - 1}`];
          const filter2Value = this.parent.filter2;
          const filter3Value = this.parent.filter3;
          const filter4Value = this.parent.filter4;

          // If this is the first row of criteria, and there's at least one
          // other filter set, except for the first one, mark the comparator as
          // required
          if (
            index === 1 &&
            !comparatorValue &&
            (!!filter2Value || !!filter3Value || !!filter4Value)
          ) {
            return false;
          }

          // If the previous operator is set, but there is no comparator value,
          // mark it as required
          if (previousOperator && !comparatorValue) {
            return false;
          }

          // If theres no comparator value, but the filter or selected value is
          // set, then mark this comparator as required
          if (!comparatorValue && (!!filterValue || !!selectedValue)) {
            return false;
          }
          return true;
        }
      );
    },
    value: (index: number) => {
      return stringTypeCheck(copy.value).test(
        'validating-value',
        fieldRequiredText(copy.value), // error message
        /* eslint-disable-next-line func-names */
        function () {
          const filterValue = this.parent[`filter${index}`];
          const comparatorValue = this.parent[`comparator${index}`];
          const selectedValue = this.parent[`value${index}`];
          const previousOperator = this.parent[`operator${index - 1}`];
          const filter2Value = this.parent.filter2;
          const filter3Value = this.parent.filter3;
          const filter4Value = this.parent.filter4;

          // If the current comparator is empty, then the value is not required
          if (comparatorValue === Comparator.EMPTY) {
            return true;
          }

          // If this is the first row of criteria, and there's at least one
          // other filter set, except for the first one, mark the value as
          // required
          if (
            index === 1 &&
            !selectedValue &&
            (!!filter2Value || !!filter3Value || !!filter4Value)
          ) {
            return false;
          }

          // If the previous operator is set, but there is no selected value,
          // mark it as required
          if (previousOperator && !selectedValue) {
            return false;
          }

          // If theres no selected value, but the filter or comparator value is
          // set, then mark this selected value as required
          if (!selectedValue && (!!filterValue || !!comparatorValue)) {
            return false;
          }
          return true;
        }
      );
    },
    operator: (index: number) => {
      return stringTypeCheck(copy.operator).test(
        'validating-operator',
        fieldRequiredText(copy.operator), // error message
        /* eslint-disable-next-line func-names */
        function () {
          const operatorValue = this.parent[`operator${index}`];

          const nextFilter = this.parent[`filter${index + 1}`];
          const nextComparator = this.parent[`comparator${index + 1}`];
          const nextValue = this.parent[`value${index + 1}`];

          // If there's no current operator value, but the next filter,
          // comparator or value is set, then mark this operator as required
          if (
            !operatorValue &&
            (!!nextFilter || !!nextComparator || !!nextValue)
          ) {
            return false;
          }

          return true;
        }
      );
    },
    name: stringTypeCheck(copy.description)
      .trim()
      .required(fieldRequiredText(copy.description))
      .max(120, fieldMaxLength(t)),
  };

  return object({
    assetGroupSearchCriteria: object({
      filter1: checks.filter(1),
      comparator1: checks.comparator(1),
      value1: checks.value(1),
      operator1: checks.operator(1),

      filter2: checks.filter(2),
      comparator2: checks.comparator(2),
      value2: checks.value(2),
      operator2: checks.operator(2),

      filter3: checks.filter(3),
      comparator3: checks.comparator(3),
      value3: checks.value(3),
      operator3: checks.operator(3),

      filter4: checks.filter(4),
      comparator4: checks.comparator(4),
      value4: checks.value(4),
    } as ObjectSchemaDefinition<Partial<AssetGroupSearchCriteria>>),
    retrieveAssetGroupEditComponentsByIdResult: object({
      editObject: object({
        name: checks.name,
      } as ObjectSchemaDefinition<Partial<EditAssetGroup>>),
    } as ObjectSchemaDefinition<Partial<RetrieveAssetGroupEditComponentsResult>>),
  } as ObjectSchemaDefinition<Partial<ResponsePayload>>);
};

const defaultInitialValues = {} as RetrieveAssetGroupEditComponentsResult;

const prepareData = (payload: ResponsePayload) =>
  Array.from({ length: 4 }, (_, i) =>
    convertSearchCriteriaToSelection(
      payload.assetGroupSearchCriteria,
      (i + 1) as 1 | 2 | 3 | 4
    )
  );

const EditForm = ({
  submissionError,
  formik,
}: {
  formik: FormikProps<ResponsePayload>;
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
}) => {
  const { isSubmitting, values } = formik;
  const domainId = useSelector(selectActiveDomainId);

  // TODO: Remove/replace with "published" flag if/when available
  const isAssetSelectionPublishedAndViewOnly =
    domainId !==
    values.retrieveAssetGroupEditComponentsByIdResult?.editObject?.domainId;

  const { t } = useTranslation();
  const data = prepareData(values);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const valueOptions = prepareValueOptions(data);

  const handleClear = (index: number) => {
    formik.setFieldValue('assetGroupSearchCriteria', {
      ...values.assetGroupSearchCriteria,
      ...convertSelectionToPartialSearchCriteria(getClearCriteria(), index + 1),
    });
  };

  const mainTitle = t('ui.assetgroup.selectedassets', 'Selected Assets');

  if (!values.assetGroupSearchCriteria) {
    return null;
  }
  return (
    <Form>
      <Grid container spacing={2}>
        <Fade in={!!submissionError} unmountOnExit>
          <Grid item xs={12}>
            <Alert severity="error">
              {t('ui.assetgroup.saveError', 'Unable to save Asset Group')}
            </Alert>
          </Grid>
        </Fade>
        <Grid item xs={12}>
          <FormLinearProgress in={isSubmitting} />
        </Grid>
        <Grid item xs={12}>
          <EditorBox>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={5}>
                {!isAssetSelectionPublishedAndViewOnly ? (
                  <Field
                    id="description-input"
                    component={CustomTextField}
                    name="retrieveAssetGroupEditComponentsByIdResult.editObject.name"
                    label={t('ui.common.description', 'Description')}
                    required
                  />
                ) : (
                  <DisplayOnlyField
                    fieldName={t('ui.common.description', 'Description')}
                    fieldValue={
                      values.retrieveAssetGroupEditComponentsByIdResult
                        ?.editObject?.name
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6} lg={7}>
                <Field
                  id="display-in-tree-input"
                  disabled={isAssetSelectionPublishedAndViewOnly}
                  name="retrieveAssetGroupEditComponentsByIdResult.editObject.isDisplay"
                  component={SwitchWithLabel}
                  type="checkbox"
                  label={t('ui.assetgroup.displayInTree', 'Display In Tree')}
                />
              </Grid>
            </Grid>
          </EditorBox>
        </Grid>

        <Grid item xs={12}>
          <PageSubHeader dense>
            {t(
              'ui.assetgroup.assetSelectionCriteria',
              'Asset Selection Criteria'
            )}
          </PageSubHeader>
        </Grid>
        {!isAssetSelectionPublishedAndViewOnly ? (
          <Grid item xs={12}>
            <TableContainer>
              <CustomSizedTableBorderlessCells
                aria-label="asset selection criteria table"
                style={{ background: gray100 }}
              >
                <TableHead>
                  <TableRow>
                    <PaddedHeadCell>
                      <CustomSizedSpan width={286}>
                        {t(
                          'ui.assetgrouplist.firstparameter',
                          'First Parameter'
                        )}
                      </CustomSizedSpan>
                    </PaddedHeadCell>
                    <PaddedHeadCell>
                      <CustomSizedSpan width={150}>
                        {t('report.assetgrouplist.logic', 'Logic')}
                      </CustomSizedSpan>
                    </PaddedHeadCell>
                    <PaddedHeadCell>
                      <CustomSizedSpan width={286}>
                        {t(
                          'ui.assetgrouplist.secondparameter',
                          'Second Parameter'
                        )}
                      </CustomSizedSpan>
                    </PaddedHeadCell>
                    <PaddedHeadCell>
                      <CustomSizedSpan width={150}>
                        {t('ui.common.andor', 'And/Or')}
                      </CustomSizedSpan>
                    </PaddedHeadCell>
                    <PaddedHeadCell>
                      <CustomSizedSpan width={120}>
                        {t('ui.common.clear', 'Clear')}
                      </CustomSizedSpan>
                    </PaddedHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((criteria, index) => (
                    <TableRow key={index} style={{ height: 50 }}>
                      <TopAlignedPaddedCell>
                        <FormSelect
                          options={Options.filter(
                            values.assetGroupCriteriaOptions
                          )}
                          fieldName={PropertyPath.filter(index)}
                        />
                      </TopAlignedPaddedCell>
                      <TopAlignedPaddedCell>
                        <FormSelect
                          options={Options.comparator}
                          fieldName={PropertyPath.comparator(index)}
                        />
                      </TopAlignedPaddedCell>
                      <TopAlignedPaddedCell key={index}>
                        <ValueField
                          formik={formik}
                          valueOptions={valueOptions}
                          index={index}
                        />
                      </TopAlignedPaddedCell>
                      <TopAlignedPaddedCell>
                        {index !== data.length - 1 && (
                          <FormSelect
                            options={Options.operator}
                            fieldName={PropertyPath.operator(index)}
                          />
                        )}
                      </TopAlignedPaddedCell>
                      <ActionCell>
                        {!SelectionCriteria.equals(
                          criteria,
                          getClearCriteria()
                        ) && (
                          <Button
                            variant="text"
                            startIcon={<ClearRow />}
                            onClick={() => handleClear(index)}
                          >
                            {t('ui.common.clear', 'Clear')}
                          </Button>
                        )}
                      </ActionCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableFooterCell variant="footer" colSpan={5}>
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs>
                            <StyledButtonText align="left">
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  setIsModalOpen(true);
                                }}
                              >
                                {t(
                                  'ui.assetgroup.viewassets',
                                  'View selected assets'
                                )}
                              </Button>
                            </StyledButtonText>

                            <UpdatedConfirmationDialog
                              open={isModalOpen}
                              maxWidth="lg"
                              isMdOrLarger
                              disableBackdropClick
                              disableEscapeKeyDown
                              mainTitle={mainTitle}
                              content={
                                <>
                                  <SelectedAssets values={values} />
                                </>
                              }
                              onConfirm={() => setIsModalOpen(false)}
                              hideCancelButton
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </TableFooterCell>
                  </TableRow>
                </TableFooter>
              </CustomSizedTableBorderlessCells>
            </TableContainer>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <EditorBox p={2} pb={8}>
              {data.map(
                (criteria, index) =>
                  !!criteria.filter && (
                    <span key={index}>
                      <DisplayOnlyValue
                        textValue={
                          values.assetGroupCriteriaOptions?.find(
                            (opt: EvolveAssetGroupCriteriaOptionInfo) =>
                              opt.fieldName === criteria.filter
                          )?.displayName
                        }
                      />
                      {criteria.comparator && (
                        <DisplayOnlyValue textValue={criteria.comparator} />
                      )}
                      {criteria.value && (
                        <DisplayOnlyValue textValue={`"${criteria.value}"`} />
                      )}
                      {criteria.operator && (
                        <em>
                          <DisplayOnlyValue textValue={criteria.operator} />
                        </em>
                      )}
                    </span>
                  )
              )}
            </EditorBox>
          </Grid>
        )}

        <Grid item xs={12}>
          <PageSubHeader dense>{t('ui.common.users', 'Users')}</PageSubHeader>
        </Grid>
        <Grid item xs={12}>
          <UserTable formik={formik} />
        </Grid>
        {!isAssetSelectionPublishedAndViewOnly && (
          <>
            <Grid item xs={12}>
              <PageSubHeader dense>
                {t('ui.assetgroup.publishassetgroup', 'Publish Asset Group')}
              </PageSubHeader>
            </Grid>
            <Grid item xs={12}>
              <DomainTable formik={formik} />
            </Grid>
          </>
        )}
      </Grid>
    </Form>
  );
};

function EditFormWrapper({
  initialValues,
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  onSubmit,
  submissionError,
}: {
  initialValues?: ResponsePayload | null;
  restoreInitialValues?: any;
  handleFormChange: (formik: FormikProps<ResponsePayload>) => void;
  restoreTouchedFields?: any;
  onSubmit: (
    values: ResponsePayload,
    formikBag: FormikHelpers<ResponsePayload>
  ) => void;
  submissionError?: any;
}) {
  const { t } = useTranslation();

  const safeInitialValues = initialValues || defaultInitialValues;

  const validationSchema = buildValidationSchema(t);

  return (
    <Formik
      initialValues={safeInitialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formikProps) => (
        <>
          <FormikEffect
            onChange={handleFormChange}
            isValid={formikProps.isValid}
            restoreTouchedFields={restoreTouchedFields}
            restoreInitialValues={restoreInitialValues}
          />
          <EditForm
            formik={formikProps}
            restoreInitialValues={restoreInitialValues}
            restoreTouchedFields={restoreTouchedFields}
            submissionError={submissionError}
          />
        </>
      )}
    </Formik>
  );
}

export default EditFormWrapper;
