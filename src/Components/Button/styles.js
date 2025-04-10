import {Dimensions, StyleSheet} from 'react-native';
import { colors } from '../Colors';
// Get window width dynamically
const windowWidth = Dimensions.get('window').width;
export const profileButtonStyle = StyleSheet.create({
  signUpbuttonContainer: {
    backgroundColor: colors.scarletRed,
    alignSelf: 'center',
    marginTop: 20,
    height: 45,
    justifyContent: 'center',
  
   width: windowWidth - 20,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'transparent',
    flexDirection:"row",
   
  },
  signUpbuttonText:{
    color:"#fff",
    fontSize:18,
fontWeight:"600"
  },
  signUpButtonIcon:{
    marginLeft:10
  }
});
