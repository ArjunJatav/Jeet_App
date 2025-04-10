import React from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {Entypo} from '../../Components/ReactIcons/ReactIcon';
import {commonModalStyle} from './styles';
import {colors} from '../../Components/Colors';

export const SetProfileImageModal = (props: any) => {
  return (
    <Modal
      style={commonModalStyle.modal}
      animationType="slide"
      visible={props.visible}
      transparent={true}
      onRequestClose={() => {
        props.onRequestClose;
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(52, 52, 52, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={[
            commonModalStyle.modal_view,
            {height:  180},
          ]}>
          <Text
            style={{
              alignSelf: 'flex-start',
              fontSize: 20,
              paddingHorizontal: 10,
              marginTop: 10,
              color: colors.black,
              fontWeight: '500',
            }}>
            {'Choose Image'}
          </Text>
          <TouchableOpacity
            style={commonModalStyle.cancel_button}
            onPress={props.cancel}>
            <Entypo
              name="cross"
              size={20}
              color={colors.scarletRed}
              style={{height: 20, width: 20}}
            />
          </TouchableOpacity>
          <View
            style={{
              marginVertical: 20,
              flexDirection: 'row',
              paddingHorizontal: 10,
              gap:10,
            //   justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={commonModalStyle.upload_button}
              onPress={props.select}>
              <Entypo
                name="image"
                size={30}
                color={colors.scarletRed}
                style={{height: 30, width: 30}}
              />
              <Text
                style={commonModalStyle.Upload_buttonText}
                numberOfLines={1}>
                {'Choose from Gallery'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={commonModalStyle.upload_button}
              onPress={props.Camera}>
              <Entypo
                name="camera"
                size={30}
                color={colors.scarletRed}
                style={{height: 30, width: 30}}
              />
              <Text style={commonModalStyle.Upload_buttonText}>
                {'Take a Photo'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
