import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
function Chip({label, active}:{label:string, active:boolean}){
  return <View style={{flexDirection:'row',alignItems:'center',paddingVertical:6,paddingHorizontal:10,borderRadius:999,borderWidth:1,borderColor:active?'#16a34a':'#4b5563',backgroundColor:active?'#064e3b':'#111827',marginRight:8, marginBottom:8}}>
    <Text style={{marginRight:6, color:'#fff'}}>{active?'✅':'⭕'}</Text>
    <Text style={{color:'#fff'}}>{label}</Text>
  </View>
}
export default function ProfileBadgesScreen(){
  const [badges,setBadges]=useState<any>(null);
  useEffect(()=>{
    const base = process.env.EXPO_PUBLIC_API_BASE || 'http://10.0.2.2:8000';
    fetch(base + '/safety/badges/1').then(r=>r.json()).then(setBadges);
  },[]);
  return <ScrollView contentContainerStyle={{padding:16, backgroundColor:'#0b0b0e'}}>
    <Text style={{fontSize:22, fontWeight:'700', color:'#fff'}}>My Safety Badges</Text>
    <View style={{marginTop:16, flexDirection:'row', flexWrap:'wrap'}}>
      {badges && (<>
        <Chip label="ID Verified" active={!!badges.verified_id} />
        <Chip label="Video Verified" active={!!badges.verified_video} />
        <Chip label="Event Attended" active={!!badges.attended_event} />
      </>)}
    </View>
  </ScrollView>;
}
