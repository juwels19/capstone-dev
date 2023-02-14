import typography from '@styles/typography'; // Theme typography
import textStyles from '@styles/text-styles'; // Text styles

import { extendTheme } from '@chakra-ui/react';

// Component styles
import Table from '@styles/table'; // Table styles
import Checkbox from '@styles/checkbox'; // Table styles


const theme = extendTheme({
  ...typography,
  components: { Table, Checkbox },
  textStyles,
});

export default theme;