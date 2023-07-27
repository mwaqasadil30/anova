/* eslint-disable indent */
import { useEffect } from 'react';
import { connect } from 'formik';
import {
  TransferAssetTargetDomainEventRuleGroupInfo,
  TransferAssetDataChannelEventRuleInfo,
  TransferAssetInfo,
} from 'api/admin/api';

interface CustomEventRuleGroup
  extends Omit<TransferAssetInfo, 'init' | 'toJSON'> {
  uniqueEventRules: (
    | TransferAssetDataChannelEventRuleInfo
    | null
    | undefined
  )[];
}

interface Props {
  formik?: any;
  eventRuleGroups: CustomEventRuleGroup[] | undefined;
  transferEventRuleGroups?:
    | TransferAssetTargetDomainEventRuleGroupInfo[]
    | null;
}

function CustomFormEffect({
  formik,
  eventRuleGroups,
  transferEventRuleGroups,
}: Props) {
  const values = formik?.values;

  useEffect(() => {
    Object.keys(values.eventRuleGroupMappings || {}).forEach(
      (eventRuleQuoteId) => {
        const sourceEventRuleGroupId = eventRuleQuoteId.replace(/\D/g, '');
        const targetEventRuleGroupId =
          values.eventRuleGroupMappings[eventRuleQuoteId];

        const sourceEventRuleGroup = eventRuleGroups?.find(
          (ruleGroup) =>
            ruleGroup?.eventRuleGroupId === Number(sourceEventRuleGroupId)
        );
        const targetEventRuleGroup = transferEventRuleGroups?.find(
          (targetGroup) =>
            targetGroup.eventRuleGroupId === targetEventRuleGroupId
        );

        sourceEventRuleGroup?.uniqueEventRules.forEach((eventRule) => {
          const sourceDescription = eventRule?.description;
          const associatedEventRule = targetEventRuleGroup?.eventRules?.find(
            (transferEventRule) =>
              transferEventRule?.description === sourceDescription
          );
          const selectedRuleValue = associatedEventRule
            ? associatedEventRule.eventRuleId
            : targetEventRuleGroupId === 0
            ? undefined
            : 0;

          formik.setFieldValue(
            `eventRuleMappings.'${eventRule?.eventRuleId}'`,
            selectedRuleValue
          );
        });
      }
    );
  }, [values.eventRuleGroupMappings]);

  return null;
}

const ConnectedCustomFormEffect = connect(CustomFormEffect);

export default ConnectedCustomFormEffect;
