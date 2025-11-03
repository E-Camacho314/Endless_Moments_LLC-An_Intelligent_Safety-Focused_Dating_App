'use client';
import { useEffect } from 'react';
import lottie from 'lottie-web';
export default function Match(){
  useEffect(()=>{
    const container = document.getElementById('lottie')!;
    const anim = lottie.loadAnimation({container,renderer:'svg',loop:false,autoplay:true,animationData:{"v":"5.7.4","fr":60,"ip":0,"op":60,"w":200,"h":200,"nm":"match","ddd":0,"assets":[],"layers":[]}});
    const audio = new Audio('/match-chime.mp3'); audio.play().catch(()=>{});
    return ()=>{ anim.destroy(); };
  },[]);
  return <div style={{display:'grid',placeItems:'center',height:'80vh'}}>
    <div id="lottie" style={{width:240,height:240}} />
    <p>It’s a Match! 🎉</p>
  </div>
}
