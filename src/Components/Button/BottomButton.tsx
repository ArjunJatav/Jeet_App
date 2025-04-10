import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../Colors';
import { Octicons } from '../ReactIcons/ReactIcon';

const { width: windowWidth } = Dimensions.get('window');

const BottomButton = ({ title, onPress, leftButton = null, rightButton = null } :any) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {leftButton && rightButton ? (
        // Dual Button Layout
        <View style={[styles.dualContainer, { width: windowWidth, gap:10, paddingHorizontal:16 }]}>
          {/* Left Button (Preview) */}
          <TouchableOpacity style={[styles.button,{ backgroundColor: colors.spotScarletRed }]} onPress={leftButton.onPress}>
            {leftButton.icon && <Octicons name={leftButton.icon} size={18} color={colors.scarletRed} style={styles.icon} />}
            <Text style={[styles.buttonText,{color :colors.scarletRed}]}>{leftButton.title}</Text>
          </TouchableOpacity>

       

          {/* Right Button (Next) */}
          <TouchableOpacity style={[styles.button,{ backgroundColor:  colors.scarletRed,} ]} onPress={rightButton.onPress}>
            <Text style={styles.buttonText}>{rightButton.title}</Text>
            {rightButton.icon && <Octicons name={rightButton.icon} size={18} color={colors.white} style={styles.icon} />}
          </TouchableOpacity>
        </View>
      ) : (
        // Single Button Layout
        <TouchableOpacity style={styles.singleButton} onPress={onPress}>
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  singleButton: {
    backgroundColor: colors.scarletRed,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: '90%',
    alignItems: 'center',
  },
  dualContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: "50%",
    height: 40,
    borderRadius:10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
   
  },
  leftButton: {
    borderBottomStartRadius: 10,
    borderTopStartRadius: 10,
  },
 
  icon: {
    height: 18,
    width: 18,
    marginHorizontal: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default BottomButton;
