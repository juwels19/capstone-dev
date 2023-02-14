import { ComponentMultiStyleConfig } from '@chakra-ui/react'; // Multi component style config type

// Checkbox styles
const Checkbox = {
  parts: ['control', 'icon'],
  baseStyle: {
    icon: {
        fontSize: "40px",
    },
    control: {
      height: '40px',
      width: '40px',
      iconSize: '4rem'
    },
  },
  defaultProps: {
    size: null,
  },
};

export default Checkbox;
