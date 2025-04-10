import { StyleSheet } from "react-native";
import { colors } from "../Colors";

export const alertStyle = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      alertContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxWidth: 350,
        alignItems: 'center',
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
      },
      buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
      button: {
        padding: 10,
        borderRadius: 5,
        width: '48%',
      },
      cancelButton: {
        backgroundColor: colors.spotScarletRed,
      },
      confirmButton: {
        backgroundColor: colors.scarletRed,
      },
      buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
      },
      mainImage:{
        height:40,width:40,marginBottom:20
      }
})