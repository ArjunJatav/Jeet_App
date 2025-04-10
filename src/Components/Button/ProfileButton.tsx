import {Text, TouchableOpacity, View} from 'react-native';
import {profileButtonStyle} from './styles';
//@ts-ignore
import Icon from 'react-native-vector-icons/FontAwesome5';
//@ts-ignore
import Iconn from 'react-native-vector-icons/FontAwesome';

interface signUpButtonProps {
  buttonText: string;
  iconFrom?: string;
  iconName?: string;
  buttonClick: () => void;
}

export const SignUpButton: React.FC<signUpButtonProps> = ({
  buttonText,
  iconFrom ,
  iconName,
  buttonClick,
}) => {
  return (
    <TouchableOpacity
      style={profileButtonStyle.signUpbuttonContainer}
      onPress={buttonClick}>
      <Text style={profileButtonStyle.signUpbuttonText}>{buttonText}</Text>
      {iconFrom == 'fontawesome' ? (
        <Iconn
          name={iconName}
          size={20}
          color="#ccc"
          style={profileButtonStyle.signUpButtonIcon}
        />
      ) : (
        <Icon />
      )}
    </TouchableOpacity>
  );
};
