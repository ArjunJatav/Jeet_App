import { StyleSheet } from "react-native";
import { colors } from "../Colors";

export const profileStyle = StyleSheet.create({
    nameInputContainer: {
        height: 45,
        backgroundColor: colors.white,
        marginHorizontal: 10,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth:1,borderRadius:5,
        borderColor:colors.newGray
      },
      Profileicon:{
        marginHorizontal: 10, 
      },
      textInput: {
        flex: 1,
        fontSize: 14,
        color: colors.black,
        fontWeight:"400"
      },
})