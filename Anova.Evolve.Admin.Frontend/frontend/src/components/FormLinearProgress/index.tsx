import React from 'react';
import styled from 'styled-components';
import Fade from '@material-ui/core/Fade';
import LinearProgress from 'components/LinearProgress';

const RelativeWrapper = styled.div`
  min-height: 20px;
  position: relative;
  width: 100%;
`;

const AbsoluteWrapper = styled.div`
  position: absolute;
  width: 100%;
`;

interface Props {
  in: boolean;
}

const FormLinearProgress = (props: Props) => {
  const { in: isIn } = props;
  return (
    <RelativeWrapper>
      <AbsoluteWrapper>
        <Fade in={isIn}>
          <LinearProgress />
        </Fade>
      </AbsoluteWrapper>
    </RelativeWrapper>
  );
};

export default FormLinearProgress;
