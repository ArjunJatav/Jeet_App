import React from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {profileStyle} from './styles';
//@ts-ignore
import Icon from 'react-native-vector-icons/FontAwesome5';
//@ts-ignore
import Iconn from 'react-native-vector-icons/FontAwesome';

interface NameInputProps {
  placeholder: string;
  iconName: string;
  nameValue: string;
  onChangeOfText: (text: string) => void;
}

interface emailInputProps {
  placeholder: string;
  iconName: string;
  nameValue: string;
  onChangeOfText: (text: string) => void;
}

interface passwordInputProps {
  placeholder: string;
  iconName: string;
  secureText: boolean;
  toggleSecureText: () => void;
  nameValue: string;
  onChangeOfText: (text: string) => void;
}
///////////////////////input with icon of FontAwesome5///////////////////////
export const NameInput: React.FC<NameInputProps> = ({
  placeholder,
  iconName,
  nameValue,
  onChangeOfText,
}) => {
  return (
    <View style={profileStyle.nameInputContainer}>
      <Icon
        name={iconName}
        size={20}
        color="#ccc"
        style={profileStyle.Profileicon}
      />
      <TextInput
        style={profileStyle.textInput}
        defaultValue={nameValue}
        onChangeText={onChangeOfText}
        placeholder={placeholder} // Use the prop here
        placeholderTextColor="#aaa"
      />
    </View>
  );
};

///////////////////////input with icon of FontAwesome///////////////////////
export const EmailInput: React.FC<emailInputProps> = ({
  placeholder,
  iconName,
  nameValue,
  onChangeOfText,
}) => {
  return (
    <View style={profileStyle.nameInputContainer}>
      <Iconn
        name={iconName}
        size={20}
        color="#ccc"
        style={profileStyle.Profileicon}
      />
      <TextInput
        style={profileStyle.textInput}
        defaultValue={nameValue}
        onChangeText={onChangeOfText}
        placeholder={placeholder} // Use the prop here
        placeholderTextColor="#aaa"
      />
    </View>
  );
};

///////////////////////input with 2 icon ///////////////////////
export const PasswordInput: React.FC<passwordInputProps> = ({
  placeholder,
  iconName,
  secureText,
  toggleSecureText,
  nameValue,
  onChangeOfText,
}) => {
  return (
    <View style={profileStyle.nameInputContainer}>
      <Icon
        name={iconName}
        size={20}
        color="#ccc"
        style={profileStyle.Profileicon}
      />
      <TextInput
        style={profileStyle.textInput}
        defaultValue={nameValue}
        onChangeText={onChangeOfText}
        secureTextEntry={secureText}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity onPress={toggleSecureText}>
        <Icon
          name={secureText ? 'eye-slash' : 'eye'}
          size={20}
          color="#ccc"
          style={profileStyle.Profileicon}
        />
      </TouchableOpacity>
    </View>
  );
};
