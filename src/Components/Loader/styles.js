import { StyleSheet } from "react-native";
import { colors } from "../Colors";

export const loaderStyle = StyleSheet.create({
    loaderContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.modalOpacity,
    }
})