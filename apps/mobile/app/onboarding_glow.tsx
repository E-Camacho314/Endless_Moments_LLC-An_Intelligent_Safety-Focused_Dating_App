import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
export default function OnboardingGlow(){
  const bioLength = 80; const photos = 3;
  const glow = useMemo(()=> Math.min(100, bioLength + photos*10), [bioLength, photos]);
  return <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#0b0b0e'}}>
    <Text style={{color:'#fff', fontSize:22, fontWeight:'700'}}>Profile Glow</Text>
    <Text style={{color:'#9ca3af', marginTop:8}}>Higher glow → better first impressions</Text>
    <View style={{marginTop:20, width:'70%', height:20, backgroundColor:'#111827', borderRadius:12, overflow:'hidden'}}>
      <View style={{width: glow+'%', height:'100%', backgroundColor:'#22c55e'}} />
    </View>
    <Text style={{color:'#a7f3d0', marginTop:12}}>{glow}%</Text>
  </View>;
}
