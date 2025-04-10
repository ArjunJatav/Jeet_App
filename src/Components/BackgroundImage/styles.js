import {StyleSheet} from 'react-native';
import {colors} from '../Colors';

export const styles = StyleSheet.create({
  imageContainer: {
    ...StyleSheet.absoluteFillObject, // Makes the container fill the entire screen
    zIndex: -1,
    backgroundColor: colors.modalOpacity,
  },
  backImage: {
     height: '100%',
    width: '100%',
    //flex:1,
    // opacity:0.6
  },
});
