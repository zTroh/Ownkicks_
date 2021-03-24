import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  headerHeight: 44,
  headerIconWidth: 49,
  headerIconHeight: 44,
  headerFontSize: 26,
  isSmallDevice: width < 375,
};
