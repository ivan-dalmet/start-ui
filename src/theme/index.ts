import { extendTheme } from '@chakra-ui/react';

import * as components from './components';
import * as foundations from './foundations';
import { styles } from './styles';

export default extendTheme({
  styles,
  ...foundations,
  components: { ...(components as any) },
});
