import React from 'react';
import { View, Text, Image, useWindowDimensions, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolate, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function BlindGesture(){
  const progress = useSharedValue(0);
  const { width } = useWindowDimensions();

  const onReveal = async () => {
    await Haptics.selectionAsync();
    try {
      const { sound } = await Audio.Sound.createAsync(require('../assets/click.mp3'));
      await sound.replayAsync(); setTimeout(()=>sound.unloadAsync(), 1000);
    } catch {}
  };

  const pan = Gesture.Pan()
    .onChange((e)=>{
      const delta = e.translationY * -1;
      const next = Math.min(1, Math.max(0, progress.value + delta/300));
      progress.value = next;
    })
    .onEnd(()=>{
      const snap = progress.value > 0.6 ? 1 : 0;
      if (snap === 1) runOnJS(onReveal)();
      progress.value = withSpring(snap, { damping: 18, stiffness: 140 });
    });

  const blurStyle = useAnimatedStyle(()=>{
    return { opacity: 1, transform: [{ scale: interpolate(1-progress.value,[0,1],[1,1.02]) }]} as any;
  });
  const hintStyle = useAnimatedStyle(()=>({ opacity: interpolate(progress.value, [0,0.9,1],[1,0.3,0]) }));

  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#0b0b0e'}}>
      <GestureDetector gesture={pan}>
        <View style={{width: width*0.8, height: width*1.05, borderRadius:16, overflow:'hidden', position:'relative'}}>
          <Image source={{uri:'https://picsum.photos/600/800'}} style={{width:'100%', height:'100%'}} />
          <Animated.View style={[StyleSheet.absoluteFillObject, blurStyle]}>
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFillObject} />
          </Animated.View>
        </View>
      </GestureDetector>
      <Animated.Text style={[{color:'#e5e7eb', marginTop:14}, hintStyle]}>Swipe up to reveal</Animated.Text>
    </View>
  );
}
