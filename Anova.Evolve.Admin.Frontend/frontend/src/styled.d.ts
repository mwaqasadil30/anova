// Styled-components docs on overriding the theme:
// https://styled-components.com/docs/api#create-a-declarations-file

// import original module declarations
import 'styled-components';
import { Theme } from '@material-ui/core/styles';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
