import React from "react";
import { Image, View } from "react-native";
import { styles } from "./styles";

export const CricketBackground = ()=>{
    return(
        <View style={styles.imageContainer}>
        <Image source={require('../../Assets/cricketBackground.png')} style={styles.backImage} resizeMode="cover"/>
    </View>
    )
 
}