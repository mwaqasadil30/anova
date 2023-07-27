/* eslint-disable indent */
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { tableHeaderColor } from 'styles/colours';
import CustomBox from '../CustomBox';

export const StyledCustomBoxTitle = styled(CustomBox)`
  background-color: ${(props) =>
    props.theme.palette.type === 'light' ? '#EBEBEB' : tableHeaderColor};
  border-color: ${(props) =>
    props.theme.palette.type === 'light' ? '#EBEBEB' : tableHeaderColor};
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Work Sans', sans-serif;
  color: ${(props) =>
    props.theme.palette.type === 'light'
      ? props.theme.palette.text.secondary
      : '#FFFFFF'};
  && {
    min-height: 24px;
  }
`;

export const StyledCustomBoxTitleAsButton = styled(Button)`
  background-color: ${(props) =>
    props.theme.palette.type === 'light' ? '#EBEBEB' : tableHeaderColor};
  border-color: ${(props) =>
    props.theme.palette.type === 'light' ? '#EBEBEB' : tableHeaderColor};
  border-radius: 0;
  text-align: center;
  padding: 4px;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Work Sans', sans-serif;
  color: ${(props) =>
    props.theme.palette.type === 'light'
      ? props.theme.palette.text.secondary
      : '#FFFFFF'};
  && {
    min-height: 24px;
  }
  &&:hover {
    background-color: ${(props) =>
      props.theme.palette.type === 'light' ? '#D3D3D3' : tableHeaderColor};
    border-color: ${tableHeaderColor};
  }
`;
