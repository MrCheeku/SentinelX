import React, { useMemo, useState } from 'react';
import { Activity, AlertTriangle, Bot, CheckCircle2, Copy, EyeOff, KeyRound, LockKeyhole, RefreshCw, ScanSearch, Shield, ShieldAlert, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react';

type Credential = { id: string; title: string; website: string; username: string; password: string; updatedAt: string };

const DEMO: Credential[] = [
  { id:'1', title:'GitHub', website:'github.com', username:'demo-user', password:'Password123', updatedAt:'2026-05-20' },
  { id:'2', title:'Google', website:'google.com', username:'demo@example.com', password:'Password123', updatedAt:'2026-08-04' },
  { id:'3', title:'Discord', website:'discord.com', username:'cheeku-demo', password:'7hF!p9Q2#Lz@4xKm', updatedAt:'2026-08-28' },
  { id:'4', title:'Netflix', website:'netflix.com', username:'demo@example.com', password:'netflix2024', updatedAt:'2026-01-11' },
];

function scoreFor(items: Credential[]) {
  let score = 100;
  const weak = items.filter(c => c.password.length < 12 || !/[A-Z]/.test(c.password) || !/[a-z]/.test(c.password) || !/\d/.test(c.password));
  const groups = new Map<string, number>();
  items.forEach(c => groups.set(c.password, (groups.get(c.password) || 0) + 1));
  const reused = items.filter(c => (groups.get(c.password) || 0) > 1);
  const stale = items.filter(c => (Date.now() - new Date(c.updatedAt).getTime()) / 86400000 > 90);
  score -= weak.length * 10; score -= new Set(reused.map(c=>c.password)).size * 12; score -= stale.length * 6;
  score = Math.max(0, Math.min(100, score));
  return { score, weak, reused, stale };
}

export default function App() {
  const [items, setItems] = useState<Credential[]>(DEMO);
  const [tab, setTab] = useState('Dashboard');
  const [showSecrets, setShowSecrets] = useState(false);
  const [ai, setAi] = useState<any>(null);
  const [chat, setChat] = useState('');
  const [chatReply, setChatReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');
  const metrics = useMemo(() => scoreFor(items), [items]);

  const scanPayload = useMemo(() => ({ securityScore: metrics.score, totalCredentials: items.length, weakCount: metrics.weak.length, reusedCount: new Set(metrics.reused.map(x => x.password)).size, staleCredentialCount: metrics.stale.length, riskCategories: [...new Set([...metrics.weak.map(()=> 'weak_passwords'), ...metrics.reused.map(()=> 'password_reuse'), ...metrics.stale.map(()=> 'stale_credentials')])] }), [items, metrics]);

  const generate = () => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
    const buf = new Uint32Array(20); crypto.getRandomValues(buf);
    return Array.from(buf, n => alphabet[n % alphabet.length]).join('');
  };

  const fix = (id: string) => setItems(xs => xs.map(x => x.id === id ? { ...x, password: generate(), updatedAt: new Date().toISOString().slice(0,10) } : x));

  const runAI = async () => {
    setLoading(true); setAi(null);
    try {
      const r = await fetch('/api/security/analyze', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ metadata: scanPayload }) });
      const d = await r.json(); setAi(d.report || { summary:'No report returned.' });
    } catch { setAi({ summary:'Local analysis is active. Nebius inference is unavailable or the backend is not configured.' }); }
    finally { setLoading(false); }
  };

  const askAI = async () => {
    if (!chat.trim()) return; setLoading(true); setChatReply('');
    try {
      const r = await fetch('/api/security/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message:chat, sanitizedContext:scanPayload, conversationHistory:[] }) });
      const d = await r.json(); setChatReply(d.reply || 'No reply returned.');
    } catch { setChatReply('Local Sentinel engine: prioritize reused and weak credentials, then rotate stale accounts and enable MFA.'); }
    finally { setLoading(false); }
  };

  const tabs = [
    ['Dashboard', Shield], ['Security Scan', ScanSearch], ['Generator', WandSparkles], ['Sentinel AI', Bot], ['Vault', KeyRound]
  ] as const;

  return <div className="app">
    <div className="demo-banner"><AlertTriangle size={14}/> DEMO MODE — SYNTHETIC DATA ONLY <span>Secrets stay local.</span></div>
    <header><div className="brand"><div className="brand-icon"><Shield size={20}/></div><div><b>SENTINEL<span>X</span></b><small>Your Personal AI Security Copilot</small></div></div><div className="header-actions"><button className="privacy" onClick={()=>setShowSecrets(v=>!v)}><EyeOff size={15}/> {showSecrets ? 'Mask Secrets' : 'Privacy First'}</button><div className="score-pill">{metrics.score}/100</div></div></header>
    <div className="body">
      <aside>{tabs.map(([name, Icon]) => <button key={name} className={tab===name?'nav active':'nav'} onClick={()=>setTab(name as string)}><Icon size={17}/><span>{name}</span></button>)}<div className="side-card"><div><LockKeyhole size={15}/> AI Boundary</div><p>Only sanitized metadata crosses to the AI layer.</p></div></aside>
      <main>
        {tab==='Dashboard' && <><section className="hero"><div><div className="eyebrow"><Sparkles size={14}/> PRIVACY-FIRST SECURITY</div><h1>Know your risk.<br/><span>Fix it immediately.</span></h1><p>SENTINELX measures your credential posture locally, then uses AI to explain what matters most.</p><div className="hero-actions"><button onClick={()=>setTab('Security Scan')} className="primary"><ScanSearch size={16}/> Run Security Scan</button><button onClick={runAI} className="secondary"><Bot size={16}/> {loading?'Analyzing…':'Generate AI Insight'}</button></div></div><div className="score-card"><div className="score-ring"><span>{metrics.score}</span><small>/ 100</small></div><div><b>Security posture</b><p>{metrics.score >=80 ? 'Strong' : metrics.score >=60 ? 'Needs attention' : 'High risk'}</p></div></div></section>
          <div className="grid"><Metric icon={ShieldAlert} label="Weak" value={metrics.weak.length}/><Metric icon={RefreshCw} label="Reused" value={new Set(metrics.reused.map(x=>x.password)).size}/><Metric icon={Activity} label="Stale" value={metrics.stale.length}/><Metric icon={CheckCircle2} label="Accounts" value={items.length}/></div>
          {ai && <AIReport report={ai}/>}<section className="card"><div className="card-head"><div><b>Recommended next step</b><p>Start with the highest-impact risk.</p></div><button className="ghost" onClick={()=>setTab('Security Scan')}>View Scan →</button></div><div className="recommend"><div className="recommend-icon"><ShieldAlert size={20}/></div><div><b>{metrics.reused.length ? 'Eliminate password reuse' : metrics.weak.length ? 'Upgrade weak passwords' : 'Keep your posture strong'}</b><p>{metrics.reused.length ? 'Generate unique credentials for every duplicated service.' : metrics.weak.length ? 'Use 16+ character high-entropy credentials.' : 'Keep MFA enabled and maintain encrypted backups.'}</p></div></div></section></>}

        {tab==='Security Scan' && <section><div className="section-title"><div><div className="eyebrow"><ScanSearch size={14}/> DETERMINISTIC LOCAL ENGINE</div><h2>Security Scan</h2><p>Measured locally. Nothing sensitive is sent to AI.</p></div><button className="primary" onClick={runAI}><Bot size={16}/> {loading?'Analyzing…':'Analyze with AI'}</button></div><div className="grid"><Metric icon={ShieldCheck} label="Score" value={`${metrics.score}/100`}/><Metric icon={ShieldAlert} label="Weak" value={metrics.weak.length}/><Metric icon={RefreshCw} label="Reused" value={new Set(metrics.reused.map(x=>x.password)).size}/><Metric icon={Activity} label="Stale" value={metrics.stale.length}/></div><section className="card"><div className="card-head"><div><b>Findings</b><p>Concrete risks detected from the local vault state.</p></div></div>{[...metrics.reused.map(x=>({x, type:'critical', label:'Password reuse'})), ...metrics.weak.map(x=>({x, type:'high', label:'Weak password'})), ...metrics.stale.map(x=>({x, type:'medium', label:'Stale credential'}))].map((r,i)=><div className="finding" key={r.x.id+'-'+i}><div className={'severity '+r.type}>{r.type}</div><div className="finding-main"><b>{r.label} — {r.x.title}</b><p>{r.type==='critical'?'The same credential is used across multiple services.':r.type==='high'?'This credential is below the recommended strength baseline.':'This credential has not been rotated in more than 90 days.'}</p></div><button className="ghost" onClick={()=>fix(r.x.id)}>Fix risk</button></div>)}{!metrics.reused.length&&!metrics.weak.length&&!metrics.stale.length&&<div className="empty"><CheckCircle2 size={30}/> No current findings.</div>}</section>{ai&&<AIReport report={ai}/>}</section>}

        {tab==='Generator' && <Generator onSave={(password)=>setItems(xs=>[{id:crypto.randomUUID(),title:'New Service',website:'',username:'',password,updatedAt:new Date().toISOString().slice(0,10)},...xs])} generate={generate}/>} 
        {tab==='Sentinel AI' && <section><div className="section-title"><div><div className="eyebrow"><Bot size={14}/> SENTINEL AI</div><h2>Your Security Copilot</h2><p>Ask about your current posture using sanitized context only.</p></div></div><section className="card chat"><div className="chat-bubble ai"><b>Sentinel AI</b><p>Ask me what to fix first, why a risk matters, or how to improve your security.</p></div>{chatReply&&<div className="chat-bubble ai"><b>Sentinel AI</b><p>{chatReply}</p></div>}<div className="chat-input"><input value={chat} onChange={e=>setChat(e.target.value)} onKeyDown={e=>e.key==='Enter'&&askAI()} placeholder="What should I fix first?"/><button onClick={askAI} className="primary">Ask</button></div></section></section>}
        {tab==='Vault' && <section><div className="section-title"><div><div className="eyebrow"><KeyRound size={14}/> LOCAL VAULT</div><h2>Credential Vault</h2><p>Masked secrets remain on this device in demo mode.</p></div></div><section className="card">{items.map(x=><div className="vault-row" key={x.id}><div className="vault-icon"><KeyRound size={17}/></div><div className="vault-main"><b>{x.title}</b><span>{x.username||'No username'} • {x.website}</span></div><code>{showSecrets?x.password:'••••••••••••'}</code><button title="Copy" className="icon-btn" onClick={()=>{navigator.clipboard.writeText(x.password);setCopied(x.id);setTimeout(()=>setCopied(''),1000)}}>{copied===x.id?<CheckCircle2 size={16}/>:<Copy size={16}/>}</button><button className="ghost" onClick={()=>fix(x.id)}>Rotate</button></div>)}</section></section>}
      </main>
    </div>
  </div>
}

function Metric({icon:Icon,label,value}:{icon:any;label:string;value:any}){return <div className="metric"><div className="metric-icon"><Icon size={17}/></div><div><span>{label}</span><b>{value}</b></div></div>}
function AIReport({report}:{report:any}){return <section className="card ai-report"><div className="card-head"><div><div className="eyebrow"><Bot size={13}/> AI SECURITY REPORT</div><b>{report.topRisk||'Security posture summary'}</b></div><span className="ai-badge">Nebius / NVIDIA</span></div><p>{report.summary||'AI report generated from sanitized security metadata.'}</p>{Array.isArray(report.priorityActions)&&<div className="actions-list">{report.priorityActions.slice(0,4).map((a:any)=><div className="action" key={a.id||a.title}><b>{a.title}</b><span>{a.priority}</span><p>{a.action||a.reason}</p></div>)}</div>}</section>}
function Generator({generate,onSave}:{generate:()=>string;onSave:(p:string)=>void}){const [p,setP]=useState(generate());return <section><div className="section-title"><div><div className="eyebrow"><WandSparkles size={14}/> SECURE GENERATOR</div><h2>Create high-entropy credentials</h2><p>Uses the browser Web Crypto API locally.</p></div><button className="primary" onClick={()=>setP(generate())}><RefreshCw size={15}/> Regenerate</button></div><section className="card generator"><div className="generated"><code>{p}</code><button className="icon-btn" onClick={()=>navigator.clipboard.writeText(p)}><Copy size={18}/></button></div><div className="generator-meta"><span>20 characters</span><span>Cryptographic randomness</span><span>Upper / lower / numbers / symbols</span></div><button className="primary" onClick={()=>{onSave(p);alert('Generated credential saved to the local demo vault.')}}><CheckCircle2 size={16}/> Save to Vault</button></section></section>}
