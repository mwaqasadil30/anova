/* eslint-disable indent */
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as CaretIcon } from 'assets/icons/caret.svg';
import { ReactComponent as GreenCircle } from 'assets/icons/green-circle.svg';
import { ReactComponent as EditIcon } from 'assets/icons/white-pencil-edit.svg';
import styled from 'styled-components';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from 'components/AccordionSummary';
import Button from 'components/Button';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import { AdditionalPropertiesAccordionSummary } from '../../../../DataChannelEditor/styles';
import { DomainThemeColor } from '../../../../../styles/colours';

export const StyledEventTypeText = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
`;

export const StyledNoneText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-style: italic;
`;

export const StyledGreenCircle = styled(GreenCircle)`
  height: 8px;
  width: 6px;
`;

export const StyledFieldLabelText = styled(Typography)`
  font-weight: 500;
  font-size: ${(props) => props.theme.custom.fontSize?.tableCells};
  line-height: ${(props) => props.theme.custom.fontSize?.commonLineHeight};
`;

export const StyledValueText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.tableCells};
`;

export const StyledEditIcon = styled(EditIcon)`
  color: ${(props) =>
    // Logic below is not great, but we have to use this colour for only these areas.
    // (see also: StyledExpandCaret below).
    props.theme.palette.type === 'light' &&
    props.theme.custom.domainColor === DomainThemeColor.Yellow
      ? '#FFB800'
      : props.theme.palette.type === 'light' &&
        props.theme.custom.domainColor !== DomainThemeColor.Yellow
      ? props.theme.custom.domainSecondaryColor
      : props.theme.custom.domainColor};
`;

export const StyledAccordionButtonText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
`;

export const StyledEditButton = styled(Button)`
  padding: 7px 5px;
  min-width: 36px;
`;

export const StyledExpandCaret = styled(CaretIcon)`
  color: ${(props) =>
    // Logic below is not great, but we have to use this colour for only these areas.
    props.theme.palette.type === 'light' &&
    props.theme.custom.domainColor === DomainThemeColor.Yellow
      ? '#FFB800'
      : props.theme.palette.type === 'light' &&
        props.theme.custom.domainColor !== DomainThemeColor.Yellow
      ? props.theme.custom.domainSecondaryColor
      : props.theme.custom.domainColor};
  height: 8px;
  width: 12px;
`;

export const StyledAccordionSummary = styled(AccordionSummary)`
  &.MuiAccordionSummary-root {
    background: ${(props) =>
      props.theme.palette.type === 'light' ? '#FFFFFF' : '#333333'};
    border-bottom: 1px solid ${(props) => props.theme.palette.divider};
  }
`;

export const StyledAdditionalDetailsAccordionSummary = styled(
  AdditionalPropertiesAccordionSummary
)`
  & .MuiAccordionSummary-content {
    justify-content: flex-end;
    margin: 0;
  }
  && {
    min-height: 20px;
  }
  padding: 0 8px;
`;

export const BoxTitle = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
`;

export const StyledBoxTitle = styled(BoxTitle)`
  padding: ${(props) => props.theme.spacing(1)}px;
`;

// #region Table-related styled components for events
// Remove the top left and right border-radius in the table
export const StyledTableContainer = styled(TableContainer)`
  && {
    border-radius: 10px;
  }
  border: ${(props) =>
    props.theme.palette.type === 'light'
      ? '1px solid #e9e9e9'
      : '1px solid #7e7e7e'};
`;

// Remove the top left and right border-radius in the table
export const CustomTable = styled(Table)`
  // TODO:
  // The code below removes a part of the gray top left and top right border.
  // Not sure why it still appears, need to look into it.
  & thead,
  & .MuiTableHead-root {
    border-top-left-radius: 0px;
    border-top-left-radius: 0px;
  }

  & thead > tr > th:first-of-type,
  & .MuiTableHead-root > .MuiTableRow-head > .MuiTableCell-head:first-of-type {
    border-top-left-radius: 0px;
  }

  & thead > tr > th:last-of-type,
  & .MuiTableHead-root > .MuiTableRow-head > .MuiTableCell-head:last-of-type {
    border-top-right-radius: 0px;
  }
`;

export const StyledTableHead = styled(TableHead)`
  & > tr > th:not(:last-child),
  && > .MuiTableRow-root > .MuiTableCell-head {
    color: ${(props) => props.theme.palette.text.primary};
  }
  & > .MuiTableRow-root > .MuiTableCell-head:not(:last-child) {
    border-right: ${(props) =>
      props.theme.palette.type === 'light'
        ? '1px solid #e9e9e9'
        : '1px solid #7e7e7e'};
  }
`;

export const StyledTableBody = styled(TableBody)`
  & > tr:not(:last-child) > td,
  & .MuiTableRow-root:not(:last-child) > .MuiTableCell-body {
    border-bottom: ${(props) =>
      props.theme.palette.type === 'light'
        ? '1px solid #e9e9e9'
        : '1px solid #7e7e7e'};
  }
`;

export const StyledTableRow = styled(TableRow)<{ $isFaded?: boolean }>`
  ${(props) =>
    props.$isFaded &&
    `
    & > td {
      color: ${props.theme.palette.text.secondary};
    }
    & > td svg.custom-importance-icon > path {
      fill: ${
        props.theme.palette.type === 'light'
          ? 'rgba(216, 216, 216)'
          : 'rgba(119, 119, 119)'
      }
    }
    & > td svg.roster-circle-icon > circle {
      fill: ${
        props.theme.palette.type === 'light'
          ? 'rgba(216, 216, 216)'
          : 'rgba(119, 119, 119)'
      }
    }
  `}
  height: 42px;
`;

export const PaddedHeadCell = styled(TableHeadCell)`
  padding: 9px 16px;
  width: 50%;
  background-color: ${(props) =>
    props.theme.palette.type === 'light' ? '#F4F4F4' : '#686868'};
`;

export const PaddedCell = styled(TableCell)`
  padding: 4px 16px;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};

  &.drawer-mapped-table {
    padding: 0px;
  }

  // TODO: use proper css accessors
  &&&:not(:last-child) {
    border-right: ${(props) =>
      props.theme.palette.type === 'light'
        ? '1px solid #e9e9e9'
        : '1px solid #7e7e7e'};
  }
`;

export const PaddedEventEditorCell = styled(TableCell)`
  padding: 10px 16px;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};

  &.drawer-mapped-table {
    padding: 0px;
  }

  // TODO: use proper css accessors
  &&&:not(:last-child) {
    border-right: ${(props) =>
      props.theme.palette.type === 'light'
        ? '1px solid #e9e9e9'
        : '1px solid #7e7e7e'};
  }
`;

export const StyledPaddedCell = styled(PaddedCell)`
  text-align: center;
`;
export const AccordionDetails = styled(MuiAccordionDetails)`
  padding: ${(props) => props.theme.spacing(2)}px;
`;

export const AccordionDetailsNoPaddings = styled(MuiAccordionDetails)`
  padding: ${(props) => props.theme.spacing(0)}px;
`;
// #endregion Table-related styled components for events
