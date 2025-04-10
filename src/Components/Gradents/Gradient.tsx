import React, { ReactNode } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

interface GradientViewProps {
  children?: ReactNode; // Content inside the gradient view
  colors: string[]; // Gradient colors
  style?: StyleProp<ViewStyle>; // Additional styles
  start?: { x: number; y: number }; // Gradient start point
  end?: { x: number; y: number }; // Gradient end point
  locations?: number[] | null; // Gradient stops (optional)
  shadow?: boolean; // Toggle shadow effect
}

const GradientView: React.FC<GradientViewProps> = ({
  children,
  colors,
  style,
  start = { x: 0, y: 0 }, // Default start point
  end = { x: 1, y: 1 },   // Default end point
  locations = null,        // Default no gradient stops
  shadow = false,          // Default no shadow
}) => {
  return (
    <View style={[shadow && styles.shadowEffect, style]}>
      <LinearGradient
        colors={colors}
        style={[ style]}
        start={start}
        end={end}
        locations={locations || undefined}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({

  shadowEffect: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, // For Android
  },
});

export default GradientView;
