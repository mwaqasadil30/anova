import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const ShowMoreButton = styled(Button)`
  align-self: end;
  height: 30px;
  font-size: 0.8125rem;
  color: #767676;
`;
const ShowMoreBox = styled(Box)`
  background-color: rgba(255, 255, 255, 0.6);
  width: 100%;
  height: 80px;
  margin-top: -50px;
  position: relative;
  display: flex;
  justify-content: center;
`;

type showMoreProps = {
  rowsToDisplay: number;
  totalCount: number;
  onClick: (rowsToDisplay: number) => void;
};

const ShowMore = ({ rowsToDisplay, totalCount, onClick }: showMoreProps) => {
  const { t } = useTranslation();

  if (totalCount > rowsToDisplay) {
    return (
      <ShowMoreBox>
        <ShowMoreButton
          variant="text"
          onClick={() => onClick(totalCount)}
          startIcon={<KeyboardArrowDownIcon htmlColor="#FFB800" />}
        >
          {t('ui.common.showmore', 'Show More')}
        </ShowMoreButton>
      </ShowMoreBox>
    );
  }

  return null;
};
export default ShowMore;
