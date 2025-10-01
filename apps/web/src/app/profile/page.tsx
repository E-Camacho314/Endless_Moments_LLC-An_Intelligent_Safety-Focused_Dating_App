'use client';
import { useEffect, useState } from 'react';
function Badge({label, active}:{label:string, active:boolean}){
  return <span style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 10px',borderRadius:999,border:'1px solid '+(active?'#16a34a':'#4b5563'),background:active?'#064e3b':'#111827',color:active?'#a7f3d0':'#9ca3af',marginRight:8}}>
    <span>{active?'✅':'⭕'}</span>{label}
  </span>
}
export default function Profile(){
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const [badges,setBadges]=useState<any>(null);
  useEffect(()=>{ fetch(base+'/safety/badges/1').then(r=>r.json()).then(setBadges); },[]);
  return <div style={{maxWidth:800,margin:'40px auto'}}>
    <h1>My Safety Badges</h1>
    <div style={{marginTop:16}}>
      {badges && (<>
        <Badge label="ID Verified" active={!!badges.verified_id} />
        <Badge label="Video Verified" active={!!badges.verified_video} />
        <Badge label="Event Attended" active={!!badges.attended_event} />
      </>)}
    </div>
  </div>
}
