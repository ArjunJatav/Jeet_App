import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {alertStyle} from './styles';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText: string;
  cancelText?: string;
  alertType: string;
  numberOfButtons: number;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  alertType,
  numberOfButtons
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel || (() => {})}>
      <View style={alertStyle.overlay}>
       
        <View style={alertStyle.alertContainer}>
        {alertType == 'validation' ? (
          <Image
            source={require('../../Assets/validationFailed.png')}
            style={alertStyle.mainImage}
            resizeMode="contain"
          />
        ) : alertType == 'success' ? (
          <Image
          source={require('../../Assets/success.png')}
          style={alertStyle.mainImage}
          resizeMode="contain"/>
        ) :(
            <Image
            source={require('../../Assets/error.png')}
            style={alertStyle.mainImage}
            resizeMode="contain"
          />
        )}
          <Text style={alertStyle.title}>{title}</Text>
          <Text style={alertStyle.message}>{message}</Text>

          <View style={alertStyle.buttonsContainer}>
            {numberOfButtons == 2 ? <>
                <TouchableOpacity
              style={[alertStyle.button, alertStyle.cancelButton]}
              onPress={onCancel}>
              <Text style={alertStyle.buttonText}>
                {cancelText || 'Cancel'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[alertStyle.button, alertStyle.confirmButton]}
              onPress={onConfirm}>
              <Text style={alertStyle.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
            </> : <>
            <TouchableOpacity
              style={[alertStyle.button, alertStyle.confirmButton,{width:"100%"}]}
              onPress={onConfirm}>
              <Text style={alertStyle.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
            </>}
            
          </View>
        </View>
      </View>
    </Modal>
  );
};
