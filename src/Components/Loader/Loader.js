import React from 'react';
import {ActivityIndicator, Modal, View} from 'react-native';
import {colors} from '../Colors';
import { loaderStyle } from './styles';

export const Loader = ({visible}) => {
  return (
    <Modal visible={visible} transparent>
      <View style={loaderStyle.loaderContainer}>
        <ActivityIndicator color={colors.darkBlue} size={'large'} />
      </View>
    </Modal>
  );
};
