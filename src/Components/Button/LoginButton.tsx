import {Text, TouchableOpacity, View} from 'react-native';
import {profileButtonStyle} from './styles';
import {Octicons} from '../ReactIcons/ReactIcon';
import {colors} from '../Colors';

interface loginButtonProps {
  buttonText: string;
  buttonClick: () => void;
}

export const LoginButton: React.FC<loginButtonProps> = ({
  buttonText,
  buttonClick,
}) => {
  return (
    <TouchableOpacity
      style={profileButtonStyle.signUpbuttonContainer}
      onPress={buttonClick}>
      <Text style={profileButtonStyle.signUpbuttonText}>{buttonText}</Text>
      <Octicons
        name={'arrow-right'}
        size={18}
        color={colors.white}
        style={{height: 18, width: 18, marginHorizontal: 5}}
      />
    </TouchableOpacity>
  );
};
