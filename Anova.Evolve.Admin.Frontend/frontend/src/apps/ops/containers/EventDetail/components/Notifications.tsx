import Box from '@material-ui/core/Box';
import { EventRosterDetailInfo } from 'api/admin/api';
import FormatDateTime from 'components/FormatDateTime';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import PageSubHeader from 'components/PageSubHeader';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableBodyRow from 'components/tables/components/TableBodyRow';
import TableCell from 'components/tables/components/TableCell';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import TableHeadRow from 'components/tables/components/TableHeadRow';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface NotificationsProps {
  rosterInfo?: EventRosterDetailInfo[];
}

export const Notifications = ({ rosterInfo }: NotificationsProps) => {
  const { t } = useTranslation();
  return (
    <Box>
      <PageSubHeader>
        {t('ui.events.notifications', 'Notifications')}
      </PageSubHeader>

      {!rosterInfo?.length ? (
        <MessageBlock>
          <Box m={2}>
            <SearchCloudIcon />
          </Box>
          <LargeBoldDarkText>
            {t(
              'ui.events.eventDetails.noNotificationsFound',
              'No notifications found'
            )}
          </LargeBoldDarkText>
        </MessageBlock>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableHeadRow>
                <TableHeadCell>
                  {t('ui.common.timestamp', 'Timestamp')}
                </TableHeadCell>
                <TableHeadCell>
                  {t('ui.events.rostername', 'Roster Name')}
                </TableHeadCell>
                <TableHeadCell>{t('ui.common.user', 'User')}</TableHeadCell>
                <TableHeadCell>
                  {t('ui.events.emailaddress', 'Email Address')}
                </TableHeadCell>
                <TableHeadCell>
                  {t('ui.events.smsaddress', 'SMS Address')}
                </TableHeadCell>
                <TableHeadCell>
                  {t('ui.events.sentsuccess', 'Sent Successfully')}
                </TableHeadCell>
              </TableHeadRow>
            </TableHead>
            <TableBody>
              {rosterInfo?.map((item) => (
                <TableBodyRow>
                  <TableCell aria-label="Created on">
                    <FormatDateTime date={item.createdDate} />
                  </TableCell>
                  <TableCell aria-label="Roster name">
                    {item.rosterName}
                  </TableCell>
                  <TableCell aria-label="Username">{item.userName}</TableCell>
                  <TableCell aria-label="Email address">
                    {item.emailAddress}
                  </TableCell>
                  <TableCell aria-label="SMS address">
                    {item.emailToSMSAddress}
                  </TableCell>
                  <TableCell aria-label="Send successfully">
                    {item.isSentSuccess
                      ? t('ui.common.yes', 'Yes')
                      : t('ui.common.failed', 'Failed')}
                  </TableCell>
                </TableBodyRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
