import { Link } from 'expo-router';
import { View, Text } from 'react-native';
export default function Home(){
  return <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:16, backgroundColor:'#0b0b0e'}}>
    <Text style={{color:'#fff', fontSize:22, fontWeight:'700'}}>Lyra — Student Launch (FIX1)</Text>
    <Link href="/profile_badges"><Text style={{marginTop:12, color:'#60a5fa'}}>My Safety Badges</Text></Link>
    <Link href="/blind/123"><Text style={{marginTop:12, color:'#60a5fa'}}>Blind Mode Demo</Text></Link>
    <Link href="/onboarding_glow"><Text style={{marginTop:12, color:'#60a5fa'}}>Onboarding Glow</Text></Link>
  </View>;
}
