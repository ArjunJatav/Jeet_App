import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {headerStyle} from './styles';
import {AntDesign, FontAwesome5, Octicons} from '../ReactIcons/ReactIcon';
import { colors } from '../Colors';

interface HeaderWithBackButtonProps {
  title: string;
  filterIcon?: boolean;
  onBackButton: () => void;
  onfilterIconButton?: () => void;
}

export default function HeaderWithBackButton({
  title,
  filterIcon,
  onBackButton,
  onfilterIconButton,
}: HeaderWithBackButtonProps) {
  return (
    <View style={headerStyle.headerWthBackButtonContainer}>
      <TouchableOpacity
        style={headerStyle.backButtonContainer}
        onPress={onBackButton}>
        <FontAwesome5 name="arrow-left" size={20} color={colors.black} />
      </TouchableOpacity>

      <View style={headerStyle.titleContainer}>
        <Text style={headerStyle.title}>{title}</Text>
      </View>
      {filterIcon && (
        <TouchableOpacity
          style={headerStyle.backButtonContainer}
          onPress={onfilterIconButton}>
          <Octicons name="filter" size={20} color={colors.black} />
        </TouchableOpacity>
      )}
    </View>
  );
}
