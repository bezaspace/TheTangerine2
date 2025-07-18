import React, { useState, useEffect } from 'react';
import { Text, Animated, View, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface TypingEffectProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  style?: any;
}

export const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  speed = 50,
  onComplete,
  style,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const cursorOpacity = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    // Cursor blinking animation
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    blinkAnimation.start();
    return () => blinkAnimation.stop();
  }, [cursorOpacity]);

  return (
    <View style={styles.container}>
      <Text style={style}>
        {displayedText}
      </Text>
      {currentIndex < text.length && (
        <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>
          |
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  cursor: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 2,
  },
});