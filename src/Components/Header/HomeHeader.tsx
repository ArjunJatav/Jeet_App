import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {headerStyle} from './styles';
//@ts-ignore
import Icon from 'react-native-vector-icons/FontAwesome5';
import {colors} from '../Colors';
//@ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/Ionicons'; //@ts-ignore
import Fontisto from 'react-native-vector-icons/Fontisto';
import { imageBaseUrl } from '../../ConstantFiles/Api';

interface HeaderWithBackButtonProps {
  title: string;
  onProfileClick: () => void;
  onNotificationClick: () => void;
  onWalletClick: () => void;
}

export default function HomeHeader({
  title,
  onProfileClick,
  onNotificationClick,
  onWalletClick,
}: HeaderWithBackButtonProps) {
  return (
    <View style={headerStyle.headerHomeContainer}>
      <TouchableOpacity
        style={headerStyle.ProfileContainer}
        activeOpacity={0.8}
        onPress={onProfileClick}>
        <Icon name="user-circle" size={25} color={colors.black} />
      </TouchableOpacity>

      <View style={headerStyle.HometitleContainer}>
        <Image
          source={{
            uri: imageBaseUrl+"fantasy-image/logo.jpg",
          }}
          style={headerStyle.Homelogo}
        />
        <Text style={headerStyle.Hometitle}>{title}</Text>
      </View>
      <View style={headerStyle.HomeNotification}>
        <Fontisto
          name={'bell'}
          size={25}
          color={colors.black}
          style={headerStyle.Homelogo}
          onPress={onNotificationClick}
          activeOpacity={0.8}
        />
        <SimpleLineIcons
          name={'wallet-outline'}
          size={25}
          color={colors.black}
          style={headerStyle.Homelogo}
          onPress={onWalletClick}
          activeOpacity={0.8}
        />
      </View>
    </View>
  );
}
