'use client';
import { useEffect, useState } from 'react';
export default function Events(){
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const [events,setEvents]=useState<any[]>([]);
  useEffect(()=>{ fetch(base+'/events').then(r=>r.json()).then(d=>setEvents(d.events||[])); },[]);
  return <div style={{maxWidth:800,margin:'40px auto'}}>
    <h1>Upcoming Events</h1>
    <ul>
      {events.map(e => <li key={e.id}>
        <strong>{e.title}</strong> — {new Date(e.starts_at).toLocaleString()} @ {e.location} ({e.circle})
      </li>)}
    </ul>
  </div>
}
