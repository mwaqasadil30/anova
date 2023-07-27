import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as CheckmarkIcon } from 'assets/icons/checkmark.svg';
import ChineseFlag from 'assets/icons/chinese-flag.png';
import EnglishFlag from 'assets/icons/english-flag.png';
import FrenchFlag from 'assets/icons/french-flag.png';
import GermanFlag from 'assets/icons/german-flag.png';
import SpanishFlag from 'assets/icons/spanish-flag.png';
import ThailandFlag from 'assets/icons/thailand-flag.png';
import Button from 'components/Button';
import WorldMapImage from 'components/images/WorldMapImage';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import PageHeader from 'components/PageHeader';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { Language as LanguageChoice } from 'types';

const StyledLanguageLabel = styled(Typography)`
  font-size: 18px;
`;
const StyledEnglishLabel = styled(Typography)`
  font-size: 18px;
  color: ${(props) => props.theme.palette.text.secondary};
`;
const FlagImage = styled.img`
  width: 24px;
  vertical-align: text-bottom;
`;
const StyledWorldMapImage = styled(WorldMapImage)`
  width: 100%;
`;

const Language = () => {
  const { t, i18n } = useTranslation();
  const topOffset = useSelector(selectTopOffset);

  const iconMapping = {
    [LanguageChoice.English]: EnglishFlag,
    [LanguageChoice.German]: GermanFlag,
    [LanguageChoice.Spanish]: SpanishFlag,
    [LanguageChoice.French]: FrenchFlag,
    [LanguageChoice.Thai]: ThailandFlag,
    [LanguageChoice.ChineseSimplified]: ChineseFlag,
    [LanguageChoice.ChineseTraditional]: ChineseFlag,
  };

  const handleLanguageClick = (selectedLanguage: LanguageChoice) => () => {
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <div>
      <PageIntroWrapper sticky topOffset={topOffset}>
        <PageHeader dense>{t('ui.main.language', 'Language')}</PageHeader>
      </PageIntroWrapper>

      <Box mt={8}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            {[
              {
                label: 'English',
                englishLabel: '',
                value: LanguageChoice.English,
              },
              {
                label: 'Deutsch',
                englishLabel: 'German',
                value: LanguageChoice.German,
              },
              {
                label: 'Español',
                englishLabel: 'Spanish',
                value: LanguageChoice.Spanish,
              },
              {
                label: 'Français',
                englishLabel: 'French',
                value: LanguageChoice.French,
              },
              {
                label: 'ไทย',
                englishLabel: 'Thai',
                value: LanguageChoice.Thai,
              },
              {
                label: '中文 (繁体)',
                englishLabel: 'Chinese (Simplified)',
                value: LanguageChoice.ChineseSimplified,
              },
              {
                label: '中文 (繁體)',
                englishLabel: 'Chinese (Traditional)',
                value: LanguageChoice.ChineseTraditional,
              },
            ].map((languageOption, index, languageList) => {
              const imgSource = iconMapping[languageOption.value];

              const isLast = index === languageList.length - 1;
              return (
                <Fragment key={languageOption.value}>
                  <Button
                    variant="text"
                    fullWidth
                    onClick={handleLanguageClick(languageOption.value)}
                    endIcon={
                      i18n.language === languageOption.value ? (
                        <CheckmarkIcon />
                      ) : null
                    }
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <FlagImage src={imgSource} alt="flag" />
                      </Grid>
                      <Grid item>
                        <StyledLanguageLabel display="inline">
                          {languageOption.label}
                        </StyledLanguageLabel>
                      </Grid>
                      <Grid item>
                        <StyledEnglishLabel display="inline">
                          {languageOption.englishLabel}
                        </StyledEnglishLabel>
                      </Grid>
                    </Grid>
                  </Button>
                  {!isLast && <Divider />}
                </Fragment>
              );
            })}
          </Grid>
          <Grid item xs={12} md={6} style={{ textAlign: 'center' }}>
            <StyledWorldMapImage />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Language;
