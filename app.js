import {PROV,REG} from './wilayah.js';
import { REFLECTIONS } from './reflections.js';
const $=(s,e=document)=>e.querySelector(s),LS=k=>localStorage.getItem(k);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=()=>fmt(new Date()),addDays=(s,n)=>{const d=new Date(s+'T00:00');d.setDate(d.getDate()+n);return fmt(d)};
const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
const STORES={work:['tasks','projects','reminders'],personal:['tasks','routines','logs','wins','shop','wish','habits','habitLogs','moods','reminders','prayerLogs','prefs','reflectionFavorites','listGroups','prayerSchedules']},dbs={};
const open=sp=>dbs[sp]??=new Promise((res,rej)=>{const r=indexedDB.open('fleureve-'+sp,6);r.onupgradeneeded=()=>STORES[sp].forEach(s=>r.result.objectStoreNames.contains(s)||r.result.createObjectStore(s,{keyPath:'id'}));r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const tx=async(sp,st,mode,fn)=>{const db=await open(sp);return new Promise((res,rej)=>{const t=db.transaction(st,mode);const q=fn(t.objectStore(st));t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error)})};
const all=(sp,st)=>tx(sp,st,'readonly',s=>s.getAll()),del=(sp,st,id)=>tx(sp,st,'readwrite',s=>s.delete(id)),clr=(sp,st)=>tx(sp,st,'readwrite',s=>s.clear());
const stamp=o=>{o.updatedAt=Date.now();o.createdAt??=o.updatedAt;o.schema=1;return o};
const put=(sp,st,o)=>tx(sp,st,'readwrite',s=>s.put(stamp(o)));

// Run related writes together with the records they depend on.
async function changeRecords(space,query,apply){
 const db=await open(space),names=Object.keys(query);
 return new Promise((resolve,reject)=>{
  const tr=db.transaction(names,'readwrite');
  const stores=Object.fromEntries(names.map(name=>[name,tr.objectStore(name)]));
  const data={};let waiting=names.length,failure,result;
  tr.oncomplete=()=>resolve(result);
  tr.onabort=()=>reject(failure??tr.error??new Error('Update was cancelled.'));
  for(const name of names){
   const request=query[name]===null?stores[name].getAll():stores[name].get(query[name]);
   request.onsuccess=()=>{
    data[name]=request.result;
    if(--waiting===0){try{result=apply(data,stores)}catch(err){failure=err;tr.abort()}}
   };
  }
 });
}
const THEMES={strawberry:['🍓','Strawberry Matcha Coquette','Dusty rose & soft matcha',['#F0DCE1','#8F5165','#DCE4D2','#F2E7CE']],cherry:['🎀','Cherry Blue Ribbon','French stationery',['#F6CAD6','#A83E57','#C8DCEB','#FFE9AE']],lavender:['🩰','Lavender Lace Ballet','Dreamy & delicate',['#E9DDF5','#9777B7','#CFE5DA','#F5C5D5']],vintage:['🕰️','Vintage Diary','Antique & nostalgic',['#E9D9C8','#8A3F52','#BBC6A8','#D0B16E']],patisserie:['🍰','Retro Patisserie','Whimsical bakery',['#F7E8C8','#BF667A','#BBD1D9','#F4D98F']]};
const NOTES=["Pink bows, big dreams, tiny steps.", "Dear diary, we're romanticizing our responsibilities.", "Your to-do list missed you. Unfortunately.", "Plot twist: we're actually getting things done today.", "One task at a time, Your Majesty.", "The tasks are tasking, but so are you.", "Another page, another little possibility.", "Your responsibilities have entered the chat. Unfortunately.", "Tiny progress looks beautiful on you.", "A little planning, a little daydreaming.", "Today's forecast: 90% chance of being adorable.", "Main character energy, with a side of procrastination.", "Soft start, gentle finish.", "Progress over perfection, always.", "Even slow days are still moving forward.", "Three small things beat one big worry.", "You don't have to do it all. Just the next little thing.", "Tea first, tasks second. Or both at once.", "Be proud of the quiet wins too.", "Plans can be rewritten. So can days.", "Darling, the calendar is rooting for you.", "A little progress, a little ribbon, a little magic.", "Your future self sent a thank-you note.", "Today is a fresh page, not a final exam.", "Ballet flats on, responsibilities on mute. Briefly.", "The agenda is dressed better than my plans.", "Cherries on top of a surprisingly productive day.", "The little wins deserve their own confetti.", "Soft life, strong boundaries, organized notes.", "You may reschedule. The universe won't file a complaint.", "Being gentle with yourself is allowed in every season.", "The deadline has opinions. You have a planner.", "Not every day needs a grand finale.", "A sweet little task deserves a sweet little checkmark.", "You can't spell fabulous without a little planning. Probably.", "Dear diary, today we tried. How chic.", "The ribbon is optional; the rest is negotiable.", "A tiny goal wearing a very fancy hat.", "The to-do list can wait while you drink water.", "Consider this your daily permission to begin again.", "Good things happen one tiny checkbox at a time.", "Your best effort today can look different from yesterday.", "A thoughtful plan is a love letter to future you.", "Give your plans room to breathe.", "The world can wait a minute; your tea is getting cold.", "This is your sign to make the easy thing easier.", "A little structure, a lot of sparkle.", "Not behind, just on your own lovely timeline.", "Let's make room for the little joys.", "One decision at a time, sweetheart.", "The cherry on top is you actually starting.", "Tiny tasks, grand entrance.", "Every finished thing once lived on a list.", "No dramatic montage needed. Just begin.", "The day is young. Your coffee is doing its best.", "Your plans are welcome to change their minds.", "Not a race, darling. More like a scenic stroll.", "A gentle reminder from the stationery department: you can do this.", "Your notebook would like to applaud politely.", "A small win has entered the ballroom.", "Fresh flowers, fresh tabs, fresh possibilities.", "Even the most elegant diaries have messy pages.", "Today's mission: be kind and cross off something.", "The stars say: maybe start with that one email.", "A soft little reset looks good on you.", "You deserve a planner that forgives Mondays.", "Slightly chaotic, highly charming, still making progress.", "This list has no authority over your worth.", "Say hello to a plan that actually fits today.", "The future called. It loved your tiny steps.", "A five-minute task can still be a victory.", "If motivation is late, begin without her.", "Make it cozy. Make it possible.", "Today we are collecting moments, not perfection.", "The queen of sensible little steps has arrived.", "A pink pen is not required, but encouraged.", "This planner believes in second chances.", "Start small enough that starting feels easy.", "The first checkbox is always a little dramatic.", "One nice thing for yourself belongs on the list.", "Messy beginnings are a valid aesthetic.", "You can do hard things and take cute breaks.", "Tomorrow has its own page; this one is yours.", "A list is a guide, not a judge.", "Organized enough to find the snacks.", "Today's aesthetic: capable with a touch of whimsy.", "The deadline is real. So is your need for lunch.", "A cherry-sized victory is still a victory.", "Be the plot twist your backlog never saw coming.", "Another little day, another tiny promise kept.", "Tend to your plans like you tend to flowers.", "Your progress doesn't need an audience.", "A ribbon for showing up. An extra ribbon for resting.", "No guilt. Just a little gentle nudge.", "Some days, opening the planner is the achievement.", "Kindness first; then the next practical step.", "May your tasks be short and your snacks delightful.", "Let's give this one a beautiful beginning.", "Your future plans deserve a little patience.", "One page can hold a thousand fresh starts.", "Do what you can. Decorate the rest.", "Little by little is still a direction.", "A dreamy day can have practical plans.", "You don't need a perfect routine to begin.", "Even the moon takes its time.", "A small, finished task feels like a tiny bow.", "Let the day surprise you pleasantly.", "Not everything urgent is important. Choose gently.", "Fewer tabs, more breathing room.", "Cross it off with flourish, darling.", "The sweetest schedule leaves space for living.", "Yesterday's unchecked box can stay in yesterday.", "A little bravery looks very pretty on you.", "Your day isn't ruined by a slow morning.", "You have permission to pick the easier first step.", "Let's call that progress and put a bow on it.", "The diary's verdict: lovingly imperfect.", "This is a planning app, not a guilt machine.", "There is charm in doing one thing well.", "A productive day can also be a peaceful one.", "The best stationery accessory is a realistic plan.", "Your attention is precious. Spend it kindly.", "A little planning, then back to being iconic.", "Buttercream dreams and sensible priorities.", "The checkmark fairy is rooting for you.", "No need to earn your rest, sweetheart.", "Today's tiny task is tomorrow's little relief.", "Every gentle restart counts.", "You'll get there in your own delightful way.", "A plan is just a possibility with a date.", "You're allowed to leave room for wonder.", "A beautiful day doesn't require a perfect list."];
let sp=LS('space'),tab=null,D={},seg='shop',cal={m:new Date(),sel:today()};
const workCal={m:new Date(),sel:today()};
let renderVersion=0;
const toast=m=>{const t=$('#toast');t.textContent=m;t.className='on';clearTimeout(toast.h);toast.h=setTimeout(()=>t.className='',2400)};
function note(next){let h=JSON.parse(LS('noteHist')||'[]'),cur=LS('note');if(cur===null||next){const pool=NOTES.map((_,i)=>i).filter(i=>!h.includes(i));const i=pool[Math.floor(Math.random()*pool.length)];h=[...h,i].slice(-8);localStorage.setItem('noteHist',JSON.stringify(h));localStorage.setItem('note',i);cur=i}return NOTES[cur]||NOTES[0]}
const TABS=()=>sp==='work'?['Today','Tasks','Projects','Calendar','Timeline','Done','Settings']:['Home','Calendar','Lists','Routines','Track','Prayer','Settings'];
const navIcons={Today:'☀️',Tasks:'📋',Projects:'📁',Calendar:'🗓️',Timeline:'📈',Done:'✓',Settings:'⚙',Home:'🏡',Lists:'🧺',Routines:'🎀',Track:'🌷',Prayer:'🌿'};
async function render(){
 const version=++renderVersion,space=sp;
 const th=LS('theme')||'strawberry';document.documentElement.dataset.theme=th;
 if(!sp){document.documentElement.dataset.theme=th;return $('#app').innerHTML=`<div class="welcome"><h1>Welcome to Fleureve ♡</h1><p class="muted">How would you like to organize your little world?</p><button data-act="space" data-s="work"><h3>💻 Work Space</h3>For plans, projects & productivity.</button><button data-act="space" data-s="personal"><h3>🎀 Personal Space</h3>For everyday moments & little dreams.</button></div>`}
 if(!TABS().includes(tab))tab=TABS()[0];
 await ensureReminderLinks(space);
 const records=await Promise.all(STORES[space].map(async s=>[s,await all(space,s)]));
 if(version!==renderVersion)return;
 D=Object.fromEntries(records);
 if(sp==='personal'&&tab==='Prayer')document.documentElement.dataset.theme='sage';
 const v={Today:workToday,Tasks:workTasks,Done:doneLog,Projects:projectsView,Timeline:timeline,Track:track,Settings:settings,Home:home,Calendar:sp==='work'?workCalendar:calView,Lists:lists,Routines:routines,Prayer:prayer}[tab]();
 $('#app').innerHTML=`<div class="shell"><nav class="nav" aria-label="${sp==='work'?'Work':'Personal'} Space"><div class="nav-brand"><span aria-hidden="true">🎀</span><strong>Fleureve</strong><small>${sp==='work'?'Work Space':'Personal Space'}</small></div>${TABS().map(t=>`<button data-act="tab" data-t="${t}" ${t===tab?'class="on" aria-current="page"':''}><span class="nav-icon" aria-hidden="true">${navIcons[t]}</span><span>${t}</span></button>`).join('')}</nav><main data-page="${tab}">${v}</main></div>`}
const taskRow=t=>{const s=t.subs||[],dn=s.filter(x=>x.d).length;return `<li class="task ${t.status==='done'?'done':''}" data-id="${esc(t.id)}"><button class="chk" data-act="tog" aria-label="${t.status==='done'?'Reopen':'Complete'} ${esc(t.title)}">${t.status==='done'?'✓':''}</button><div class="tb"><b>${esc(t.title)}</b><small>${[projName(t)&&'📁 '+projName(t),sp==='work'&&taskPhase(t)?.name,t.priority!=='normal'&&t.priority,t.plannedDate&&'🗓 '+t.plannedDate,t.deadline&&'⏳ '+t.deadline,t.status==='done'&&t.doneDate&&'✅ '+t.doneDate,s.length&&dn+'/'+s.length+' steps',(t.deps||[]).map(i=>D.tasks.find(x=>x.id===i)).filter(x=>x&&x.status!=='done').length&&'⛓ waiting on '+(t.deps||[]).map(i=>D.tasks.find(x=>x.id===i)).filter(x=>x&&x.status!=='done').map(x=>x.title).join(', ')].filter(Boolean).map(esc).join(' · ')}</small>${s.map((x,i)=>`<label class="sub"><input type="checkbox" style="width:auto" data-act="sub" data-i="${i}" ${x.d?'checked':''}> ${esc(x.t)}</label>`).join('')}</div><div class="acts"><button data-act="edit">Edit</button>${t.status==='done'?'':`<button data-act="tom">Tomorrow</button>${t.plannedDate?'<button data-act="bl">Backlog</button>':''}`}</div></li>`};
const qa=(f,ph='+ Quick add — type and press Enter',withButton=false)=>`<form class="qa ${withButton?'qa-add':''}" data-f="${esc(f)}"><input name="t" placeholder="${esc(ph)}" aria-label="${esc(ph)}" autocomplete="off" maxlength="200">${withButton?'<button type="submit" class="pri">+ Add</button>':''}</form>`;
const list=(a,empty)=>a.length?`<ul>${a.map(taskRow).join('')}</ul>`:`<p class="muted">${empty}</p>`;
const pend=()=>D.tasks.filter(t=>!['done','cancelled'].includes(t.status));
function focus(){const td=new Date(today());const auto=pend().filter(t=>t.status!=='waiting'&&t.status!=='hold').map(t=>{let s={high:3,normal:1,low:0}[t.priority]||0,r=t.priority==='high'?'High priority':'';if(t.deadline){const d=(new Date(t.deadline)-td)/864e5;if(d<=3){s+=4;r=d<0?'Past its deadline — worth a look':'Deadline approaching'}else if(d<=7){s+=2;r=r||'Deadline this week'}}if(t.plannedDate===today()){s+=2;r=r||'Scheduled for today'}return{t,s,r:r||'A gentle next step'}}).filter(x=>x.s>=2).sort((a,b)=>b.s-a.s);const pin=pend().filter(t=>t.focusRank!=null).sort((a,b)=>a.focusRank-b.focusRank).map(t=>({t,r:'Chosen by you',pin:1})),ids=new Set(pin.map(x=>x.t.id));return [...pin,...auto.filter(x=>!ids.has(x.t.id))].slice(0,3)}
function weekDone(){const a=addDays(today(),-6);return D.tasks.filter(t=>t.status==='done'&&t.doneDate>=a).length}
function plannerCover(title){
 return `<header class="hero planner-cover"><div class="cover-mark" aria-hidden="true">♡ ❦ ♡</div><p class="cover-date">${new Date().toLocaleDateString('en',{weekday:'long',month:'long',day:'numeric'})}</p><h1>${esc(title)}</h1><p>${esc(note())}</p><button class="ghost" data-act="note">Another Little Note ↻</button></header>`;
}
function workToday(){return workHome()}
function workTodayOld(){const td=today(),F=focus(),t=pend().filter(x=>x.plannedDate===td),old=pend().filter(x=>x.plannedDate&&x.plannedDate<td),dl=pend().filter(x=>x.deadline&&x.deadline>=td&&x.deadline<=addDays(td,14)).sort((a,b)=>a.deadline<b.deadline?-1:1),done=D.tasks.filter(x=>x.doneDate===td);
return `${plannerCover('Work Space ♡')}${qa('work-today','Quick add for today',true)}
${activeProjectsView()}
<div class="card"><h2>My Focus Today ♡</h2>${F.length?F.map((x,i)=>`<div class="focus" data-id="${x.t.id}"><b>Priority ${i+1} — ${esc(x.t.title)}</b><small>${esc(x.r)}</small><div class="row"><button class="ghost" data-act="fup">▲</button><button class="ghost" data-act="fdn">▼</button>${x.pin?'<button class="ghost" data-act="funpin">Unpin</button>':''}</div></div>`).join(''):'<p class="muted">Nothing urgent. Pick what feels right.</p>'}<small class="muted">Rule-based and local. You decide what counts.</small></div>
<div class="cols"><div class="card"><h2>Today's Tasks</h2>${list(t,'Nothing planned for today.')}</div><div class="card"><h2>Waiting for a new date</h2>${list(old,'All caught up.')}</div></div>
<div class="cols"><div class="card"><h2>Upcoming Deadlines</h2>${list(dl,'No deadlines in the next 2 weeks.')}</div><div class="card"><h2>Weekly Progress</h2><p><span class="badge">${weekDone()} done in the last 7 days</span></p><p class="muted">In progress: ${D.tasks.filter(x=>x.status==='doing').length} · Waiting: ${D.tasks.filter(x=>x.status==='waiting').length}</p><h2>Recently Completed</h2>${list(done,'Nothing yet today — tiny steps count.')}</div></div>`}
function workTasks(){const q=(LS('q')||'').toLowerCase(),a=pend().filter(t=>!q||[t.title,projName(t),taskPhase(t)?.name].some(text=>(text||'').toLowerCase().includes(q))),o={high:0,normal:1,low:2};a.sort((x,y)=>(x.deadline||'9').localeCompare(y.deadline||'9')||o[x.priority]-o[y.priority]);
return `<div class="hero"><h1>My Tasks</h1></div>${qa('work-inbox','Quick add to Inbox',true)}<div class="row project-tools"><button class="pri" data-act="tasknew">+ New task</button><button class="ghost" data-act="wa">📥 Import My Notes</button></div><input data-f="q" aria-label="Search tasks, projects or phases" placeholder="Search tasks, projects or phases" value="${esc(LS('q')||'')}"><div class="card">${list(a,'No tasks match.')}</div>`}
function doneLog(){const a=D.tasks.filter(t=>t.status==='done').sort((x,y)=>y.doneDate<x.doneDate?-1:1);return `<div class="hero"><h1>My Accomplishments ♡</h1></div><div class="card">${list(a,'Your completed tasks will live here.')}</div>`}
function home(){return personalHome()}
function homeOld(){const td=today(),t=pend().filter(x=>x.plannedDate===td),old=pend().filter(x=>x.plannedDate&&x.plannedDate<td),bl=pend().filter(x=>!x.plannedDate);
const rs=routines.due().slice(0,3);
return `${plannerCover('My Little Everyday ♡')}${qa('p-today','Add a task for today',true)}<div class="card"><h2>Today's Plans</h2>${list(t,'A blank page. Lovely.')}</div>${old.length?`<div class="card"><h2>Waiting for a new date</h2>${list(old,'')}</div>`:''}${bl.length?`<div class="card"><h2>Backlog</h2>${list(bl,'')}</div>`:''}<div class="cols"><div class="card"><h2>Gentle Routines</h2>${rs.length?rs.map(r=>`<p>${esc(r.icon)} ${esc(r.name)} <span class="muted">— ${esc(r.hint)}</span></p>`).join(''):'<p class="muted">Nothing calling today.</p>'}</div><div class="card"><h2>Shopping Reminder</h2><p>${D.shop.filter(x=>!x.done).length} items in your basket.</p><h2>Next Prayer</h2><p class="muted">Open Prayer Corner for details.</p></div></div>`}
const events=ds=>{const e=[];for(const t of D.tasks){if(t.status==='done'){if(t.doneDate===ds)e.push({k:'done',i:'🎀',t:t.title})}else{if(t.plannedDate===ds)e.push({k:'plan',i:'🗓',t:t.title});if(t.deadline===ds)e.push({k:'plan',i:'⏳',t:'Deadline: '+t.title})}}
for(const l of D.habitLogs){const h=D.habits.find(x=>x.id===l.habitId);if(l.date===ds&&h)e.push({k:'done',i:h.icon,t:h.name})}for(const m of D.moods)if(m.date===ds)e.push({k:'done',i:(MOODS.find(y=>y[1]===m.mood)||['🌷'])[0],t:'Mood: '+m.mood});for(const l of (D.prayerLogs||[])){if(l.date===ds&&LS('pcal')==='1')e.push({k:'done',i:'🌿',t:l.name})}for(const l of D.logs){const r=D.routines.find(x=>x.id===l.routineId);if(l.date===ds&&r&&r.showCal!==false&&!e.some(x=>x.routineId===l.routineId))e.push({k:'done',i:r.icon,t:r.name,routineId:l.routineId})}
for(const w of D.wins)if(w.date===ds)e.push({k:'done',i:w.icon||'🎀',t:w.title});for(const w of D.wish)if(w.purchasedDate===ds)e.push({k:'done',i:'🎁',t:'Bought: '+w.name});
return e.sort((a,b)=>(a.k==='done'?0:1)-(b.k==='done'?0:1))};
function calMonth(){const m=cal.m,y=m.getFullYear(),mo=m.getMonth(),f=new Date(y,mo,1).getDay(),n=new Date(y,mo+1,0).getDate();let c='';for(let i=0;i<f;i++)c+='<i></i>';
for(let d=1;d<=n;d++){const ds=fmt(new Date(y,mo,d)),ev=events(ds);c+=`<button class="day ${ds===today()?'tdy':''} ${ds===cal.sel?'sel':''}" data-act="day" data-d="${ds}"><span>${d}</span><div class="st">${ev.slice(0,3).map(e=>`<em class="${e.k}">${esc(e.i)}</em>`).join('')}${ev.length>3?`<b>+${ev.length-3}</b>`:''}</div></button>`}
const ev=events(cal.sel);return `<div class="hero"><h1>${m.toLocaleString('en',{month:'long',year:'numeric'})}</h1><div class="row"><button class="ghost" data-act="cal" data-n="-1">‹ Prev</button><button class="ghost" data-act="cal" data-n="0">Today</button><button class="ghost" data-act="cal" data-n="1">Next ›</button></div></div><div class="card"><div class="grid">${'SMTWTFS'.split('').map(x=>`<b>${x}</b>`).join('')}${c}</div><p class="muted">Full color = actually done · faded = planned.</p></div>
<div class="card"><h2>${esc(cal.sel)}</h2>${ev.length?ev.map(e=>`<p class="${e.k}">${esc(e.i)} ${esc(e.t)} ${e.k==='done'?'<span class="badge">done</span>':'<span class="muted">planned</span>'}</p>`).join(''):'<p class="muted">Nothing here yet.</p>'}${qa('p-date','Plan a task for this date',true)}<button class="ghost" data-act="win" data-d="${cal.sel}">🎀 Log a little win for this day</button></div>`}
const DEFAULT_GROUP={shop:'default-shop',wish:'default-wish'};
const groupItems=k=>{
 const groups=(D.listGroups||[]).filter(g=>g.kind===k),id=DEFAULT_GROUP[k];
 const saved=k==='shop'?groups.find(g=>g.id===id):null;
 return [{name:k==='shop'?'Everyday Basket':'My Dreams',icon:k==='shop'?'🛍️':'🎁',...saved,id,kind:k,default:true},...groups.filter(g=>g.id!==id)];
};
function activeGroup(k){const groups=groupItems(k),selected=LS('fl-group-'+k);return groups.find(g=>g.id===selected)||groups[0]}
const groupOf=(x,k)=>x.listId||DEFAULT_GROUP[k];
const isShopping=group=>group.listType!=='general'; // Existing baskets retain their shopping fields.
const orderedItems=(items,id)=>items.filter(x=>groupOf(x,'shop')===id).sort((a,b)=>(a.position??-1)-(b.position??-1));
const nextItemPosition=(items,id)=>orderedItems(items,id).reduce((max,item)=>Math.max(max,item.position??-1),-1)+1;

function editDailyList(group){
 const values=group?{...group,listType:isShopping(group)?'shopping':'general'}:{listType:'general',icon:'☑️'};
 dlg(group?'Edit list':'New daily list',[['name','List name','text'],['icon','List emoji (optional)','text'],
  ['listType','List type','choice',[['general','General Checklist'],['shopping','Shopping List']]],['date','Date (optional)','date'],['notes','Notes (optional)','area']],values,async v=>{
  const name=v.name.trim();
  if(!name)throw 'Please give your list a name.';
  if(groupItems('shop').some(g=>g.id!==group?.id&&g.name.toLowerCase()===name.toLowerCase()))throw 'A list with that name already exists.';
  const id=group?.id||uid();
  const record={...group};delete record.default;
  await put('personal','listGroups',{...record,id,kind:'shop',name,icon:v.icon.trim()||(v.listType==='shopping'?'🛍️':'☑️'),listType:v.listType,date:v.date||null,notes:v.notes.trim()});
  localStorage.setItem('fl-group-shop',id);
 });
}

function moveDailyItem(listId,id,step){
 return changeRecords('personal',{shop:null},({shop},stores)=>{
  const items=orderedItems(shop,listId),from=items.findIndex(item=>item.id===id),to=from+step;
  if(from<0||to<0||to>=items.length)return;
  [items[from],items[to]]=[items[to],items[from]];
  items.forEach((item,position)=>{if(item.position!==position)stores.shop.put(stamp({...item,position}))});
 });
}

function dailyListBody(active,items){
 const shopping=isShopping(active),checked=items.filter(x=>x.done).length;
 const rows=items.map((x,i)=>{
  const status=x.done?(shopping?'Mark not bought':'Mark not done'):(shopping?'Mark bought':'Mark done');
  const details=[Number(x.qty)>1?'×'+x.qty:'',x.price?'~'+x.price:'',x.store].filter(Boolean).join(' · ');
  return `<li class="task ${x.done?'done':''}" data-id="${esc(x.id)}"><button class="chk" data-act="shoptog" aria-label="${status}: ${esc(x.name)}" aria-pressed="${!!x.done}">${x.done?'✓':''}</button><div class="tb"><b>${esc(x.name)}</b>${shopping&&details?`<small>${esc(details)}</small>`:''}</div><div class="acts"><button data-act="shopmove" data-step="-1" aria-label="Move ${esc(x.name)} up" ${i===0?'disabled':''}>↑</button><button data-act="shopmove" data-step="1" aria-label="Move ${esc(x.name)} down" ${i===items.length-1?'disabled':''}>↓</button><button data-act="shopedit">Edit</button></div></li>`;
 });
 const total=shopping?items.filter(x=>!x.done).reduce((s,x)=>s+(+x.price||0)*(+x.qty||1),0):0;
 return `<div class="card"><h2>${esc(active.icon||'☑️')} ${esc(active.name)}</h2>${active.date?`<p class="muted"><time datetime="${esc(active.date)}">${esc(active.date)}</time></p>`:''}${active.notes?`<p style="overflow-wrap:anywhere">${esc(active.notes).replace(/\n/g,'<br>')}</p>`:''}<ul>${rows.join('')}</ul>${rows.length?'':'<p class="muted">Nothing on this list yet. Tap + Add to save your first item ♡</p>'}<span class="bar"><i style="width:${items.length?Math.round(checked/items.length*100):0}%"></i></span><small class="muted">${checked}/${items.length} checked</small> <button class="ghost" data-act="lreset">Reset checklist</button>${shopping?`<p>Estimated total: <b>${total.toLocaleString('id-ID')}</b></p>${checked?'<button class="ghost" data-act="shopclear">Remove bought items from this list</button>':''}`:''}</div>`;
}
function lists(){
 const b=`<div class="seg row"><button data-act="seg" data-s="shop" class="${seg==='shop'?'on':''}">☑️ Daily Lists</button><button data-act="seg" data-s="wish" class="${seg==='wish'?'on':''}">🎁 My Dream List</button></div>`;
 const groups=groupItems(seg),active=activeGroup(seg),items=(seg==='shop'?D.shop:D.wish).filter(x=>groupOf(x,seg)===active.id);
 const strip=`<section class="card list-picker"><h2>${seg==='shop'?'My Daily Lists ♡':'My Dream List ♡'}</h2><div class="group-strip" aria-label="Choose a list">${groups.map(g=>`<button type="button" class="group-pill ${g.id===active.id?'selected':''}" data-act="groupselect" data-k="${esc(seg)}" data-g="${esc(g.id)}">${esc(g.icon||'🎀')} ${esc(g.name)} <small>${(seg==='shop'?D.shop:D.wish).filter(x=>groupOf(x,seg)===g.id).length}</small></button>`).join('')}<button type="button" class="group-pill group-new" data-act="groupnew">＋ New list</button></div><div class="group-meta"><span>Currently viewing: <strong>${esc(active.name)}</strong>${seg==='shop'?` · ${isShopping(active)?'Shopping List':'General Checklist'}`:''}</span>${seg==='shop'||!active.default?`<span class="row"><button class="ghost" data-act="groupedit">Edit list</button>${active.default?'':'<button class="ghost" data-act="groupdel">Delete list</button>'}</span>`:''}</div></section>`;
 if(seg==='shop'){
  return `<div class="hero"><h1>Daily Lists ♡</h1><p>Little lists, lovely little finds.</p></div>${b}${strip}${qa('shop','Add to '+active.name,true)}${dailyListBody(active,orderedItems(items,active.id))}`;
 }
 return `<div class="hero"><h1>My Dream List ♡</h1><p>Some dreams don't need a deadline.</p></div>${b}${strip}${qa('wish','Add a dream to '+active.name,true)}<div class="card"><h2>${esc(active.icon||'🎁')} ${esc(active.name)}</h2><ul>${items.map(x=>`<li class="task ${x.status==='purchased'?'done':''}" data-id="${x.id}"><div class="tb"><b>${esc(x.name)}</b><small>${esc(x.status)}${x.target?' · target '+esc(x.target):''}${x.price?' · ~'+esc(x.price):''}${x.purchasedDate?' · 🎁 '+esc(x.purchasedDate):''}</small></div><div class="acts">${x.status!=='purchased'?'<button data-act="buy">🎁 Purchased</button>':''}<button data-act="wedit">Edit</button></div></li>`).join('')||'<p class="muted">No dreams saved yet. Tap + Add to save one ♡</p>'}</ul></div>`;
}
function lastLog(r){return D.logs.filter(l=>l.routineId===r.id).map(l=>l.date).sort().pop()}
const routines=()=>`<div class="hero"><h1>Gentle Routines ♡</h1><p>This is self-care, not homework, darling.</p></div><button class="pri" data-act="radd">+ New routine</button><br><br>${D.routines.map(r=>{const l=lastLog(r),nx=l?addDays(l,r.every):null,h=D.logs.filter(x=>x.routineId===r.id).map(x=>x.date).sort().reverse().slice(0,5);return `<div class="card" data-id="${r.id}"><h2>${esc(r.icon)} ${esc(r.name)} Diary ♡</h2><p class="muted">Last done: ${l||'—'} · Next suggested: ${nx||'whenever you like'} (every ${r.every} day${r.every>1?'s':''})</p><div class="row"><button class="ghost" data-act="maybe">🌷 Maybe Today</button><button class="ghost" data-act="not">💗 Not Today</button><button class="pri" data-act="done">🎀 Done!</button></div><div class="row"><input type="date" style="width:auto" max="${today()}"><button class="ghost" data-act="logdate">Log on that date</button><button class="ghost" data-act="redit">Edit</button></div><p class="muted">History: ${h.join(', ')||'none yet'}</p></div>`}).join('')||''}<div class="card"><h2>My Little Wins ♡</h2><button class="ghost" data-act="win" data-d="${today()}">+ Add a little win</button><ul>${D.wins.sort((a,b)=>a.date<b.date?1:-1).map(w=>`<li class="task" data-id="${w.id}"><div class="tb"><b>${esc(w.icon||'🎀')} ${esc(w.title)}</b><small>${esc(w.date)}${w.note?' · '+esc(w.note):''}</small></div><div class="acts"><button data-act="wnedit">Edit</button></div></li>`).join('')}</ul></div>`;
routines.due=()=>D.routines.filter(r=>r.hide!==today()).map(r=>{const l=lastLog(r),nx=l?addDays(l,r.every):today();return{...r,nx,hint:l?'around '+nx:'whenever you like'}}).filter(r=>r.nx<=today());
function settings(){const th=LS('theme')||'strawberry';return `<div class="hero"><h1>Settings</h1></div><div class="card"><h2>Choose Your Aesthetic ♡</h2><div class="themes">${Object.entries(THEMES).map(([k,v])=>`<div class="card"><b>${v[0]} ${v[1]}</b><div class="muted">${v[2]}</div><div class="sw">${v[3].map(c=>`<i style="background:${c}"></i>`).join('')}</div><button class="${k===th?'ghost':'pri'}" data-act="theme" data-k="${k}">${k===th?'Applied ✓':'Apply Theme'}</button></div>`).join('')}</div></div>
<div class="card"><h2>Space</h2><p class="muted">Currently: ${sp}. Switching never merges or deletes data.</p><button class="ghost" data-act="space" data-s="${sp==='work'?'personal':'work'}">Switch to ${sp==='work'?'Personal':'Work'} Space</button></div>
<div class="card"><h2>Backup & Restore</h2><p class="muted">Data lives only on this device. Back up regularly.</p><div class="row"><button class="pri" data-act="export">Export JSON backup</button><button class="ghost" data-act="import">Import JSON backup</button><button class="ghost" data-act="ics2">Export dated tasks (.ics)</button></div><input type="file" id="file" accept="application/json" hidden><p class="muted">.ics: import into your calendar app; you may need to confirm, and it does not create app-style snooze.</p></div>
${sp==='personal'?`<div class="card"><h2>Calendar</h2><label class="sub"><input type="checkbox" style="width:auto" data-act="pcal" ${LS('pcal')==='1'?'checked':''}> Show prayer checklist on the calendar</label></div>`:''}${remCard()}<div class="card"><h2>Privacy</h2><p class="muted">No login, no cloud, no analytics. Everything stays in this browser's storage and can be lost if you clear site data or uninstall the app.</p></div>`}
function dlg(title,fields,v,save,rm){
 const d=$('#dlg');
 d.innerHTML=`<form><h3 id="dialog-title">${esc(title)}</h3>${fields.map(([k,l,t,o])=>`<label data-field="${k}">${l}${t==='select'||t==='choice'?`<select name="${k}">${o.map(item=>{const [x,y]=t==='choice'?item:[item,item];return `<option value="${esc(x)}" ${v[k]===x?'selected':''}>${esc(y)}</option>`}).join('')}</select>`:t==='multi'?`<select name="${k}" multiple size="5">${o.map(([x,y])=>`<option value="${esc(x)}" ${(v[k]||[]).includes(x)?'selected':''}>${esc(y)}</option>`).join('')}</select>`:t==='area'?`<textarea name="${k}" rows="3">${esc(v[k]||'')}</textarea>`:`<input name="${k}" type="${t}" ${t==='number'?'step="any"':''} value="${esc(v[k]??'')}">`}</label>`).join('')}<div class="row form-actions"><button class="pri" type="submit">Save</button><button type="button" class="ghost" id="dx">Cancel</button>${rm?'<button type="button" class="ghost" id="dd">Delete</button>':''}</div></form>`;
 const form=$('form',d),submit=$('[type=submit]',form);
 const error=document.createElement('p');
 error.className='form-error';error.hidden=true;error.setAttribute('role','alert');
 $('.form-actions',form).before(error);
 form.onsubmit=async e=>{
  e.preventDefault();
  if(submit.disabled)return;
  const fd=new FormData(form),o=Object.fromEntries(fd);
  form.querySelectorAll('select[multiple]').forEach(x=>o[x.name]=fd.getAll(x.name));
  submit.disabled=true;error.hidden=true;
  try{await save(o)}catch(err){error.textContent=typeof err==='string'?err:'Could not save. Please check your entries and try again.';error.hidden=false;error.scrollIntoView({block:'nearest'});submit.disabled=false;return}
  d.close();render();
 };
 $('#dx',d).onclick=()=>d.close();
 if(rm)$('#dd',d).onclick=async()=>{if(confirm('Delete this?')){try{await rm();d.close();render()}catch{toast('Could not delete. Please try again.')}}};
 if(d.open)d.close();d.showModal();
 return form;
}
const TASK_DATE_FIELDS={'deadline':'deadline','start date':'startDate','planned date':'plannedDate'};
const TASK_OFFSETS=['30','21','14','7','3','1','0'];
const MILESTONE_OFFSETS=[['0','On the day (Hari H)'],['1','H-1'],['3','H-3'],['7','H-7']];
const dateTimeValue=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const dateValue=/^\d{4}-\d{2}-\d{2}$/;
const clockValue=/^(?:[01]\d|2[0-3]):[0-5]\d$/;
const validDate=date=>dateValue.test(date||'')&&fmt(new Date(date+'T12:00'))===date;

function readReminderLink(reminder){
 if(!reminder.taskId||reminder.relativeBase||reminder.kind==='task')return reminder;
 // V9d generated these IDs for offset reminders. Its older “Deadline reminders”
 // dialog always used the deadline, regardless of the selector in that dialog.
 const prefix='ro-'+reminder.taskId+'-';
 const key=reminder.id.startsWith(prefix)&&reminder.id.slice(prefix.length).match(/^(deadline|start date|planned date)-(\d+)$/);
 const suffix=String(reminder.title??'').match(/ — (?:deadline today|H-(\d+))$/);
 if(!key&&!suffix)return reminder;
 return {...reminder,kind:'offset',relativeBase:key?TASK_DATE_FIELDS[key[1]]:'deadline',offsetDays:Number(key?key[2]:suffix[1]||0),
  clock:reminder.at?.slice(11,16)||'09:00',scheduledAt:reminder.at||null};
}

function reminderKey(r){
 if(r.milestoneId)return JSON.stringify(['milestone',r.projectId,r.milestoneId]);
 if(r.taskId&&r.relativeBase)return JSON.stringify(['task',r.taskId,r.relativeBase,Number(r.offsetDays)]);
 if(r.taskId&&r.kind==='task')return JSON.stringify(['task',r.taskId,'absolute']);
 return null;
}

function setReminderSchedule(r,scheduledAt){
 const unchanged=(r.scheduledAt??r.at??null)===scheduledAt;
 return {...r,scheduledAt,at:scheduledAt&&unchanged?r.at:scheduledAt,fired:unchanged?!!r.fired:false};
}

function linkedSchedule(r,task,project){
 if(r.taskId&&!task)return null;
 const milestone=r.milestoneId&&project?.milestones?.find(m=>m.id===r.milestoneId);
 if(r.milestoneId&&!milestone)return null;
 if(!task&&!milestone)return r;
 const title=task?.title??milestone.t;
 if(!r.relativeBase)return {...setReminderSchedule(r,r.scheduledAt??r.at??null),title};
 const date=task?task[r.relativeBase]:milestone.date;
 const offset=Number(r.offsetDays),clock=r.clock;
 const schedule=validDate(date)&&clockValue.test(clock||'')&&Number.isInteger(offset)&&offset>=0?addDays(date,-offset)+'T'+clock:null;
 const base=task?Object.keys(TASK_DATE_FIELDS).find(key=>TASK_DATE_FIELDS[key]===r.relativeBase):'milestone';
 return {...setReminderSchedule(r,schedule),title:title+(offset?' — H-'+offset+' ('+base+')':' — On the day ('+base+')')};
}

function uniqueReminders(records){
 const seen=new Set();
 return records.map(readReminderLink).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0)).filter(r=>{
  const key=reminderKey(r);
  if(!key)return true;
  if(seen.has(key))return false;
  seen.add(key);return true;
 });
}

function storeReminderChanges(store,before,after){
 const remaining=new Map(before.map(r=>[r.id,r]));
 for(const next of after.filter(Boolean)){
  const old=remaining.get(next.id);
  remaining.delete(next.id);
  if(JSON.stringify(old)!==JSON.stringify(next))store.put(stamp(next));
 }
 for(const id of remaining.keys())store.delete(id);
}

function upsertReminder(records,values,oldId){
 const key=reminderKey(values);
 const same=records.find(r=>key&&reminderKey(r)===key);
 const previous=same||records.find(r=>r.id===oldId);
 records=records.filter(r=>r.id!==oldId&&(!key||reminderKey(r)!==key));
 const record={...previous,...values,id:previous?.id||uid()};
 if(previous&&reminderKey(previous)!==key){record.at=null;record.scheduledAt=null;record.fired=false;}
 return [...records,record];
}

const initializedLinks={};
function ensureReminderLinks(space){
 return initializedLinks[space]??=reconcileReminders(space).catch(err=>{delete initializedLinks[space];throw err});
}
function reconcileReminders(space){
 const query={tasks:null,reminders:null};
 if(space==='work')query.projects=null;
 return changeRecords(space,query,(data,stores)=>{
  storeReminderChanges(stores.reminders,data.reminders,normalizedReminders(data));
 });
}

function normalizedReminders(data){
 const tasks=new Map(data.tasks.map(t=>[t.id,t])),projects=new Map((data.projects||[]).map(p=>[p.id,p]));
 return uniqueReminders(data.reminders).map(r=>linkedSchedule(r,tasks.get(r.taskId),projects.get(r.projectId))).filter(Boolean);
}

function checkTaskRelative(task,base,offset,clock,previous){
 if(!Object.values(TASK_DATE_FIELDS).includes(base)||!TASK_OFFSETS.includes(String(offset))||!clockValue.test(clock))throw 'Choose a valid date reference, number of days and time.';
 if(!validDate(task[base])&&previous?.relativeBase!==base)throw 'Set the '+Object.keys(TASK_DATE_FIELDS).find(key=>TASK_DATE_FIELDS[key]===base)+' first.';
}

function editTaskRules(task,records,edits){
 const selected=new Set(edits.map(e=>e.oldId).filter(Boolean));
 const result=records.filter(r=>!selected.has(r.id));
 let order=Math.max(Date.now(),...records.map(r=>r.ruleOrder||r.createdAt||0));
 for(const e of edits){
  const previous=e.oldId&&records.find(r=>r.id===e.oldId&&r.relativeBase);
  if(e.oldId&&!previous)throw 'A reminder changed in another window. Open the task again.';
  if(e.remove)continue;
  checkTaskRelative(task,e.base,e.offset,e.clock,previous);
  const rule={...previous,id:previous?.id||uid(),kind:'offset',taskId:task.id,relativeBase:e.base,offsetDays:e.offset,clock:e.clock,ruleOrder:previous?.ruleOrder||previous?.createdAt||++order};
  if(result.some(r=>reminderKey(r)===reminderKey(rule)))throw 'Two reminders use the same date reference and offset. Choose a different offset or remove one.';
  result.push(rule);
 }
 return result;
}

function updateTask(space,id,update,{absolute,relative,relativeRules}={}){
 return changeRecords(space,{tasks:id,reminders:null},({tasks,reminders},stores)=>{
  const task=update(tasks);
  const before=reminders.filter(r=>r.taskId===id);
  let next=uniqueReminders(before);
  if(task){
   if(absolute!==undefined){
    if(absolute&&!dateTimeValue.test(absolute))throw 'Choose a valid reminder date and time.';
    if(absolute){
     const current=next.find(r=>r.kind==='task');
     const values=setReminderSchedule({...current,kind:'task',taskId:id},absolute);
     next=upsertReminder(next,values);
    }else next=next.filter(r=>r.kind!=='task');
   }
   if(relative){
    const {base,offset,clock,oldId}=relative;
    const same=next.find(r=>r.id===oldId||(!oldId&&r.relativeBase===base&&Number(r.offsetDays)===offset));
    next=editTaskRules(task,next,[{...relative,oldId:oldId||same?.id}]);
   }
   if(relativeRules)next=editTaskRules(task,next,relativeRules);
   if(task!==tasks)stores.tasks.put(stamp(task));
  }else stores.tasks.delete(id);
  storeReminderChanges(stores.reminders,before,task?next.map(r=>linkedSchedule(r,task)):[]);
 });
}

function taskWithPlan(task,to){
 if((task.plannedDate||null)===to)return task;
 return {...task,plannedDate:to,history:[...(task.history||[]),{from:task.plannedDate||null,to,at:today()}]};
}

function resched(t,to,space=sp){return updateTask(space,t.id,current=>current?taskWithPlan(current,to):null)}
const getT=e=>{const li=e.closest('[data-id]');return li&&li.dataset.id};
const FREQ=['1','2','3','7','14','30'];
async function add(f,t){const base={id:uid(),title:t,status:'todo',priority:'normal'};if(f.startsWith('proj:'))return put(sp,'tasks',{...base,projectId:f.slice(5)});
 if(f==='work-today'||f==='p-today')await put(sp,'tasks',{...base,plannedDate:today()});else if(f==='p-date'||f==='work-date')await put(sp,'tasks',{...base,plannedDate:f==='work-date'?workCal.sel:cal.sel});else if(f.startsWith('work'))await put(sp,'tasks',{...base,status:'todo',inbox:true});
 else if(f==='shop'){
  const listId=activeGroup('shop').id;
  await changeRecords('personal',{shop:null},({shop},stores)=>stores.shop.put(stamp({id:uid(),name:t,listId,position:nextItemPosition(shop,listId),done:false})));
 }else if(f==='wish')await put(sp,'wish',{id:uid(),name:t,listId:activeGroup('wish').id,status:'someday'})}
document.addEventListener('submit',async e=>{const f=e.target.dataset.f;if(!f)return;e.preventDefault();const input=e.target.elements.namedItem('t');if(!input)return;const value=input.value.trim();if(!value)return;const button=e.target.querySelector('button[type=submit]');if(button)button.disabled=true;try{await add(f,value);input.value='';toast('Saved to your list ♡');await render()}catch(err){console.error('Could not save Fleureve item',err);toast('Could not save. Please try again.');if(button)button.disabled=false}});
document.addEventListener('input',e=>{if(e.target.dataset.f==='q'){localStorage.setItem('q',e.target.value);const p=e.target.selectionStart;render().then(()=>{const n=$('[data-f=q]');n&&(n.focus(),n.setSelectionRange(p,p))})}});
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,id=getT(b),S=(st)=>D[st].find(x=>x.id===id);
 // These actions are owned by the separate Prayer/Reflection handlers below.
 if(['plog','gps','locadd','locdel','prem','pcal','rnext','reflist','rsave'].includes(a))return;
 if(a==='space'){localStorage.setItem('space',sp=b.dataset.s);tab=null}
 else if(a==='tab'){
  tab=b.dataset.t;
  await render();
  window.scrollTo(0,0);
  $('[aria-current=page]')?.focus({preventScroll:true});
  return;
 }else if(a==='note')note(1);else if(a==='theme'){localStorage.setItem('theme',b.dataset.k);toast('Theme applied ♡')}
 else if(a==='seg')seg=b.dataset.s;
 else if(a==='groupselect'){localStorage.setItem('fl-group-'+seg,b.dataset.g)}
 else if(seg==='shop'&&(a==='groupnew'||a==='groupedit')){editDailyList(a==='groupedit'?activeGroup('shop'):null);return}
 else if(a==='groupnew'){dlg('New '+(seg==='shop'?'shopping':'dream')+' list',[['name','List name','text'],['icon','List emoji (optional)','text']],{name:'',icon:seg==='shop'?'🛍️':'🎁'},async v=>{const name=v.name.trim();if(!name)throw 'Please give your list a name.';if(groupItems(seg).some(g=>g.name.toLowerCase()===name.toLowerCase()))throw 'A list with that name already exists.';const id=uid();await put(sp,'listGroups',{id,kind:seg,name,icon:v.icon.trim()||'🎀'});localStorage.setItem('fl-group-'+seg,id)});return}
 else if(a==='groupedit'){const g=activeGroup(seg);if(g.default)return;dlg('Edit list',[['name','List name','text'],['icon','List emoji','text']],g,async v=>{const name=v.name.trim();if(!name)throw 'Please enter a list name.';await put(sp,'listGroups',{...g,name,icon:v.icon.trim()||'🎀'})});return}
 else if(a==='groupdel'){const g=activeGroup(seg);if(g.default)return;const objects=D[seg==='shop'?'shop':'wish'].filter(x=>groupOf(x,seg)===g.id);if(!confirm('Delete the list “'+g.name+'”? Its '+objects.length+' item(s) will be moved to the default list, not deleted.'))return;
  if(seg==='shop')await changeRecords('personal',{shop:null,listGroups:g.id},({shop},stores)=>{
   let position=nextItemPosition(shop,DEFAULT_GROUP.shop);
   for(const item of orderedItems(shop,g.id))stores.shop.put(stamp({...item,listId:DEFAULT_GROUP.shop,position:position++}));
   stores.listGroups.delete(g.id);
  });else{for(const item of objects){item.listId=DEFAULT_GROUP[seg];await put(sp,seg,item)}await del(sp,'listGroups',g.id)}
  localStorage.setItem('fl-group-'+seg,DEFAULT_GROUP[seg]);toast('List removed, items kept ♡')}
 else if(a==='day')cal.sel=b.dataset.d;else if(a==='cal'){const n=+b.dataset.n;cal.m=n?new Date(cal.m.getFullYear(),cal.m.getMonth()+n,1):new Date();if(!n)cal.sel=today()}
 else if(a==='workday'){
  workCal.sel=b.dataset.d;
  await render();
  $('[data-act=workday][aria-pressed=true]')?.focus({preventScroll:true});
  return;
 }
 else if(a==='workmonth'){
  const offset=+b.dataset.n,month=workCal.m;
  workCal.m=offset?new Date(month.getFullYear(),month.getMonth()+offset,1):new Date();
  const current=today();
  workCal.sel=fmt(workCal.m).slice(0,7)===current.slice(0,7)?current:fmt(workCal.m);
  await render();
  $(`[data-act=workmonth][data-n="${offset}"]`)?.focus({preventScroll:true});
  return;
 }
 else if(a==='pmonth'){cal.m=new Date(cal.m.getFullYear(),cal.m.getMonth()+ +b.dataset.n,1)}
 else if(a==='hday'){workCal.sel=b.dataset.d;workCal.m=new Date(b.dataset.d+'T00:00');tab='Calendar'}
 else if(a==='pday'){cal.sel=b.dataset.d;cal.m=new Date(b.dataset.d+'T00:00');tab='Calendar'}
 else if(a==='cmode')calMode=b.dataset.m
 else if(a==='cyear'){const c=sp==='work'?workCal:cal;c.m=new Date(c.m.getFullYear()+ +b.dataset.n,c.m.getMonth(),1)}
 else if(a==='cpick'){const c=sp==='work'?workCal:cal;c.m=new Date(c.m.getFullYear(),+b.dataset.mo,1);calMode='month'}
 else if(a==='openlist'){seg=b.dataset.s;tab='Lists'}
 else if(a==='lreset'){if(!confirm('Uncheck every item on this list? Items are kept.'))return;for(const x of D.shop.filter(x=>x.done&&groupOf(x,'shop')===activeGroup('shop').id)){x.done=false;await put(sp,'shop',x)}toast('Checklist reset ♡')}
 else if(a==='rtog'){const d=b.dataset.d,ex=D.logs.find(x=>x.routineId===id&&x.date===d);if(ex){if(!confirm('Remove this record for '+d+'?'))return;await del(sp,'logs',ex.id)}else{if(d>today()&&!confirm('That date is in the future. Record it anyway?'))return;await put(sp,'logs',{id:'rl-'+id+'-'+d,routineId:id,date:d});toast('Sticker added ♡')}}
 else if(a==='tog'){const t=S('tasks'),dn=t.status==='done';t.status=dn?'todo':'done';t.doneDate=dn?null:today();await put(sp,'tasks',t);if(!dn){const k=D.tasks.filter(x=>x.doneDate===today()).length+1;toast(k>1?'Two little wins. They still count.':'Look at you, making things happen! ♡')}}
 else if(a==='sub'){const t=S('tasks');t.subs[+b.dataset.i].d=b.checked;await put(sp,'tasks',t)}
 else if(a==='tom'){await resched(S('tasks'),addDays(today(),1));toast("Plans can change, darling. That's okay.")}
 else if(a==='bl'){await resched(S('tasks'),null);toast('Kept safely in your backlog.')}
 else if(a==='edit'||a==='tasknew'){editTask(a==='edit'?S('tasks'):null,b.dataset.project,b.dataset.phase,b.dataset.date);return}
 else if(a==='shoptog'){const x=S('shop');x.done=!x.done;await put(sp,'shop',x)}
 else if(a==='shopclear'){for(const x of D.shop.filter(x=>x.done&&groupOf(x,'shop')===activeGroup('shop').id))await del(sp,'shop',x.id)}
 else if(a==='shopmove'){
  const step=Number(b.dataset.step);
  if(step!==-1&&step!==1)return;
  try{await moveDailyItem(activeGroup('shop').id,id,step);await render();
   const row=[...document.querySelectorAll('[data-act=shopmove]:not(:disabled)')].filter(button=>getT(button)===id);
   (row.find(button=>Number(button.dataset.step)===step)||row[0])?.focus({preventScroll:true});
  }catch{toast('Could not move the item. Try again.')}
  return;
 }
 else if(a==='shopedit'){
  const x=S('shop'),fields=[['name','Item','text']];
  if(isShopping(activeGroup('shop')))fields.push(['qty','Quantity (optional)','number'],['price','Estimated price (optional)','number'],['store','Store (optional)','text']);
  dlg('Edit item',fields,x,v=>put(sp,'shop',{...x,...v,name:v.name.trim()||x.name}),()=>del(sp,'shop',x.id));return;
 }
 else if(a==='buy'){const x=S('wish');x.status='purchased';x.purchasedDate=today();await put(sp,'wish',x);toast('🎁 Enjoy it, darling!')}
 else if(a==='wedit'){const x=S('wish');dlg('Edit dream',[['name','Name','text'],['price','Estimated price','number'],['link','Product link','text'],['target','Target (blank, a year like 2028, or a date)','text'],['status','Status','select',['someday','saving','ready','purchased']],['purchasedDate','Purchased on','date'],['notes','Notes','area']],x,v=>{if(v.target&&!/^\d{4}(-\d{2}-\d{2})?$/.test(v.target.trim())){toast('Target: use a year or YYYY-MM-DD');throw 'Target must be a year or YYYY-MM-DD.'}if(v.status==='purchased'&&!v.purchasedDate)v.purchasedDate=today();return put(sp,'wish',{...x,...v,name:v.name.trim()||x.name,target:v.target.trim()})},()=>del(sp,'wish',x.id));return}
 else if(a==='radd'||a==='redit'){const r=a==='redit'?S('routines'):null;dlg(r?'Edit routine':'New routine',[['name','Name','text'],['icon','Sticker (emoji)','text'],['every','Suggest every (days)','select',FREQ],['showCal','Show on calendar','select',['yes','no']]],r?{...r,every:String(r.every),showCal:r.showCal===false?'no':'yes'}:{icon:'🌷',every:'2'},v=>put(sp,'routines',{...(r||{id:uid()}),name:v.name.trim()||'Routine',icon:v.icon||'🌷',every:+v.every,showCal:v.showCal!=='no'}),r&&(async()=>{del(sp,'routines',r.id);for(const l of D.logs.filter(l=>l.routineId===r.id))await del(sp,'logs',l.id)}));return}
 else if(a==='done'){const d=today();if(D.logs.some(x=>x.routineId===id&&x.date===d))toast('Already saved for today ♡');else{await put(sp,'logs',{id:'rl-'+id+'-'+d,routineId:id,date:d});toast('This is self-care, not homework — well done, darling ♡')}}
 else if(a==='logdate'){const v=b.parentElement.querySelector('input').value;if(!v)return toast('Pick the date you did it');if(D.logs.some(x=>x.routineId===id&&x.date===v))return toast('Already recorded on '+v);await put(sp,'logs',{id:'rl-'+id+'-'+v,routineId:id,date:v});toast('Logged on '+v)}
 else if(a==='maybe')toast('No pressure at all 🌷');else if(a==='not'){const r=S('routines');r.hide=today();await put(sp,'routines',r)}
 else if(a==='win'||a==='wnedit'){const w=a==='wnedit'?S('wins'):null;dlg('Little win',[['title','What did you do?','text'],['icon','Sticker (emoji)','text'],['date','Date','date'],['note','Note','area']],w||{icon:'🎀',date:b.dataset.d},v=>put(sp,'wins',{...(w||{id:uid()}),...v,title:v.title.trim()||'A little win'}),w&&(()=>del(sp,'wins',w.id)));return}
 else if(a==='export'){const data={};for(const s of STORES[sp])data[s]=await all(sp,s);dl(`fleureve-${sp}-backup-${today()}.json`,JSON.stringify({app:'fleureve-planner',space:sp,format:4,dbVersion:6,schema:4,appVersion:'RELEASE',exportedAt:new Date().toISOString(),data}),'application/json');return}
 else if(a==='ics2'){icsDlg();return}
 else if(a==='ics'){const z=s=>s.replace(/[-:]|\.\d+/g,'');dl(`fleureve-${sp}-plans.ics`,'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Fleureve Planner//EN\r\n'+D.tasks.filter(t=>t.plannedDate&&t.status!=='done').map(t=>`BEGIN:VEVENT\r\nUID:${t.id}@fleureve\r\nDTSTAMP:${z(new Date().toISOString())}\r\nDTSTART;VALUE=DATE:${t.plannedDate.replace(/-/g,'')}\r\nSUMMARY:${t.title.replace(/[,;\\\r\n]/g,' ')}\r\nEND:VEVENT\r\n`).join('')+(D.reminders||[]).filter(r=>r.at&&!r.fired).map(r=>`BEGIN:VEVENT\r\nUID:${r.id}@fleureve\r\nDTSTAMP:${z(new Date().toISOString())}\r\nDTSTART:${r.at.replace(/[-:]/g,'')}00\r\nSUMMARY:${r.title.replace(/[,;\\\r\n]/g,' ')}\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:${r.title.replace(/[,;\\\r\n]/g,' ')}\r\nTRIGGER:PT0S\r\nEND:VALARM\r\nEND:VEVENT\r\n`).join('')+'END:VCALENDAR\r\n','text/calendar');return}
 else if(a==='padd'||a==='pedit'){editProject(a==='pedit'?S('projects'):null);return}
 else if(a==='ms'){
  const p=S('projects'),index=Number(b.dataset.i),checked=b.checked;
  await updateProject(p.id,current=>({...current,milestones:current.milestones.map((m,i)=>i===milestoneIndex(current,p.milestones[index],index)?{...m,d:checked}:m)}));
 }
 else if(a==='milestoneedit'){editMilestone(S('projects'),Number(b.dataset.i));return}
 else if(a==='pfilter')localStorage.setItem('pf',LS('pf')===id?'':id)
 else if(a==='projectopen'){localStorage.setItem('pf',id);tab='Projects';await render();document.getElementById('project-'+id)?.scrollIntoView({block:'start'});return}
 else if(a==='wa'){waDlg();return}
 else if(a==='radd2'||a==='remedit'){editReminder(a==='remedit'?S('reminders'):null);return}
 else if(a==='mood'){const id2='mood-'+today(),o=D.moods.find(x=>x.id===id2)||{id:id2,date:today()};o.mood=b.dataset.m;await put(sp,'moods',o)}
 else if(a==='mnote'){const o=D.moods.find(x=>x.date===today());if(!o)return toast('Pick a mood first');const n=prompt('A little note (private)',o.note||'');if(n===null)return;o.note=n;await put(sp,'moods',o)}
 else if(a==='hlog'){const lid='hl-'+id+'-'+today(),ex=D.habitLogs.find(x=>x.id===lid);if(ex)await del(sp,'habitLogs',lid);else{await put(sp,'habitLogs',{id:lid,habitId:id,date:today()});toast('Lovely ♡')}}
 else if(a==='hadd'||a==='hedit'){const h=a==='hedit'?S('habits'):null;dlg('Habit',[['name','Name','text'],['icon','Sticker (emoji)','text'],['freq','Frequency','select',['daily','few times a week','weekly','flexible']],['streak','Show streak (optional)','select',['off','on']]],h?{...h,streak:h.streak?'on':'off'}:{icon:'💧',freq:'daily',streak:'off'},v=>put(sp,'habits',{...(h||{id:uid()}),name:v.name.trim()||'Habit',icon:v.icon||'💧',freq:v.freq,streak:v.streak==='on'}),h&&(async()=>{for(const l of D.habitLogs.filter(l=>l.habitId===h.id))await del(sp,'habitLogs',l.id);await del(sp,'habits',h.id)}));return}
 else if(a==='fup'||a==='fdn'){const F=focus().map(x=>x.t),i=F.findIndex(t=>t.id===id),j=a==='fup'?i-1:i+1;if(j<0||j>=F.length)return;[F[i],F[j]]=[F[j],F[i]];for(let k=0;k<F.length;k++){F[k].focusRank=k;await put(sp,'tasks',F[k])}}
 else if(a==='funpin'){const t=S('tasks');delete t.focusRank;await put(sp,'tasks',t)}
 else if(a==='tr')localStorage.setItem('tr',b.dataset.m)
 else if(a==='import'){$('#file').click();return}
 render()});
const dl=(n,t,m)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:m}));a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)};
// Atomic restore: either all object stores commit or none do. Safe with legacy backups.
function restoreBackup(j,mode){
 const names=STORES[sp],replace=mode==='replace';
 return changeRecords(sp,Object.fromEntries(names.map(name=>[name,null])),(data,stores)=>{
  const merged={};
  for(const name of names){
   const old=new Map(data[name].map(item=>[item.id,item]));
   const records=replace?new Map():new Map(old);
   const incoming=Array.isArray(j.data[name])?j.data[name]:[];
   for(const item of incoming){
    const current=records.get(item.id);
    if(replace||!current||(Number(item.updatedAt)||0)>(Number(current.updatedAt)||0))records.set(item.id,item);
   }
   merged[name]=[...records.values()];
   if(name==='reminders')continue;
   if(replace)stores[name].clear();
   for(const [id,item] of records)if(replace||old.get(id)!==item)stores[name].put(item);
  }
  const normalized=normalizedReminders(merged);
  const before=merged.reminders;
  if(replace)stores.reminders.clear();
  const existing=new Map((replace?[]:data.reminders).map(r=>[r.id,r]));
  const imported=new Map(before.map(r=>[r.id,r]));
  for(const r of normalized){
   const previous=existing.get(r.id);
   existing.delete(r.id);
   if(JSON.stringify(r)===JSON.stringify(previous))continue;
   stores.reminders.put(JSON.stringify(r)===JSON.stringify(imported.get(r.id))?r:stamp(r));
  }
  for(const id of existing.keys())stores.reminders.delete(id);
 });
}
function previewRestore(j){
 const d=$('#dlg');const counts=STORES[sp].map(n=>({n,c:Array.isArray(j.data[n])?j.data[n].length:0}));
 d.innerHTML=`<div><h2>Restore backup ♡</h2><p class="muted">${esc(sp)} Space · ${esc(j.exportedAt||'Unknown export date')} · database v${esc(j.dbVersion||'legacy')}</p><div class="restore-grid">${counts.map(x=>`<span>${esc(x.n)}</span><b>${x.c}</b>`).join('')}</div><p><b>Merge</b> keeps existing records. Matching IDs are updated only when the backup record is newer.</p><p><b>Replace</b> deletes ALL data in ${esc(sp)} Space, then restores the file. A backup from an older version may leave new features empty.</p><div class="row"><button class="pri" id="rmerge">Merge</button><button class="ghost" id="rreplace">Replace…</button><button class="ghost" id="rcancel">Cancel</button></div><div id="rconfirm" hidden><p class="muted">Type REPLACE to confirm deletion of all ${esc(sp)} Space data:</p><input id="rword" autocomplete="off" placeholder="REPLACE"><button class="pri" id="rdo">Confirm Replace</button></div></div>`;
 const complete=async mode=>{
  for(const x of d.querySelectorAll('button'))x.disabled=true;
  try{await restoreBackup(j,mode);d.close();toast('Restore complete ♡');await render()}
  catch(err){toast('Restore failed. Your previous data should be unchanged.');d.querySelectorAll('button').forEach(x=>x.disabled=false);console.error('Fleureve restore error',err)}
 };
 $('#rmerge',d).onclick=()=>complete('merge');
 $('#rreplace',d).onclick=()=>{$('#rconfirm',d).hidden=false;$('#rword',d).focus()};
 $('#rdo',d).onclick=()=>{if($('#rword',d).value==='REPLACE')complete('replace');else toast('Type REPLACE exactly.')};
 $('#rcancel',d).onclick=()=>d.close();
 if(d.open)d.close();d.showModal();
}
document.addEventListener('change',async e=>{
 if(e.target.dataset.k==='ta'||e.target.dataset.k==='tz'){localStorage.setItem(e.target.dataset.k,e.target.value);return render()}
 if(e.target.id!=='file')return;
 const f=e.target.files?.[0];if(!f)return;
 try{
  const j=JSON.parse(await f.text());
  if(j.app!=='fleureve-planner'||!j.data||typeof j.data!=='object'||Array.isArray(j.data))throw 'This is not a Fleureve backup file.';
  if((j.format||1)>4||(j.dbVersion||1)>6)throw 'Backup comes from a newer app version.';
  if(j.space!==sp)throw `This is for ${j.space} Space. Switch spaces first.`;
  const names=STORES[sp].filter(n=>Array.isArray(j.data[n]));
  if(!names.length||Object.keys(j.data).some(n=>!STORES[sp].includes(n)))throw 'Backup stores do not match this space.';
  if(names.some(n=>j.data[n].some(o=>!o||typeof o!=='object'||typeof o.id!=='string'||!o.id||o.id.length>250)))throw 'Backup records are not valid.';
  previewRestore(j);
 }catch(err){toast(typeof err==='string'?err:'Could not read backup file.')}finally{e.target.value=''}
});
render();if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});

const projName=t=>((D.projects||[]).find(p=>p.id===t.projectId)||{}).name||t.project||'';
const MOODS=[['😊','Happy'],['🌿','Calm'],['🤩','Excited'],['😴','Tired'],['😰','Anxious'],['😢','Sad']];
function projectPhases(project){
 // Keep v5's string labels in backups. New phase IDs survive renaming and reordering.
 const seen=new Set();
 return (project?.phases||[]).flatMap((label,index)=>{
  if(typeof label!=='string'||!label.trim()||seen.has(label))return [];
  seen.add(label);
  return [{name:label,id:project.phaseIds?.[index]||'legacy:'+label}];
 });
}

function taskPhase(task,project=(D.projects||[]).find(p=>p.id===task.projectId)){
 return projectPhases(project).find(phase=>phase.id===task.phaseId);
}

function editTask(existing,projectId,phaseId,plannedDate){
 const isWork=sp==='work',space=sp;
 const task=existing||{id:uid(),title:'',status:'todo',priority:'normal',projectId,phaseId,plannedDate};
 const projects=isWork?D.projects:[];
 const fields=[['title','Title','text'],['notes','Notes','area']];
 if(isWork)fields.push(['projectId','Project','choice',[['','No project'],...projects.map(p=>[p.id,p.name])]],['phaseId','Phase (optional)','choice',[['','No phase']]]);
 const statuses=['todo','doing','waiting','hold','done'];
 if(task.status==='cancelled')statuses.push('cancelled');
 fields.push(['priority','Priority','select',['low','normal','high']],['status','Status','select',statuses],['startDate','Start date','date'],['plannedDate','Planned date','date'],['deadline','Deadline','date']);
 const taskRules=(D.reminders||[]).filter(r=>r.taskId===task.id&&r.relativeBase).sort((a,b)=>(a.ruleOrder||a.createdAt||0)-(b.ruleOrder||b.createdAt||0)||a.id.localeCompare(b.id));
 const entries=[taskRules[0],...taskRules.slice(1)];
 const ruleValues=r=>({roff:r?String(r.offsetDays):'none',rbase:Object.keys(TASK_DATE_FIELDS).find(key=>TASK_DATE_FIELDS[key]===r?.relativeBase)||'deadline',rtime:r?.clock||'09:00'});
 fields.push(['deps','Depends on','multi',D.tasks.filter(t=>t.id!==task.id&&t.status!=='cancelled').map(t=>[t.id,t.title])],['focus','My Focus Today','select',['auto','pinned']],['remind','Reminder (optional, fixed date & time)','datetime-local'],['roff','Relative reminder (H-)','select',['none',...TASK_OFFSETS]],['rbase','…counted from','select',Object.keys(TASK_DATE_FIELDS)],['rtime','Reminder time','time'],['subs','Steps (one per line)','area']);
 const absolute=(D.reminders||[]).find(r=>r.taskId===task.id&&r.kind==='task');
 const values={...task,...ruleValues(entries[0]),remind:absolute?.scheduledAt||absolute?.at||'',focus:task.focusRank!=null?'pinned':'auto',subs:(task.subs||[]).map(s=>s.t).join('\n')};
 const form=dlg(existing?'Edit task':'New task',fields,values,async v=>{
  if(!v.title.trim())throw 'Enter a task title.';
  const deps=(v.deps||[]).filter(id=>id!==task.id);
  const reachesTask=(id,seen=new Set())=>{
   if(id===task.id)return true;
   if(seen.has(id))return false;
   seen.add(id);
   return (D.tasks.find(t=>t.id===id)?.deps||[]).some(dep=>reachesTask(dep,seen));
  };
  if(deps.some(id=>reachesTask(id)))throw 'That would create a circular dependency.';
  const oldSteps=new Map((task.subs||[]).map(s=>[s.t,s.d]));
  const updated={...task,title:v.title.trim(),notes:v.notes,priority:v.priority,status:v.status,
   startDate:v.startDate||null,deadline:v.deadline||null,deps,
   subs:v.subs.split('\n').map(s=>s.trim()).filter(Boolean).map(t=>({t,d:!!oldSteps.get(t)})),
   doneDate:v.status==='done'?task.doneDate||today():null};
  if(v.focus==='pinned')updated.focusRank??=50;
  else delete updated.focusRank;
  if(isWork){
   const project=projects.find(p=>p.id===v.projectId);
   updated.projectId=project?.id;
   updated.phaseId=projectPhases(project).find(phase=>phase.id===v.phaseId)?.id;
   if(task.projectId||v.projectId)delete updated.project;
  }
  const planned=v.plannedDate||null;
  const relativeRules=entries.flatMap((r,i)=>{
   const suffix=i?'-'+i:'',offset=v['roff'+suffix];
   if(offset==='none'||offset===undefined)return r?[{oldId:r.id,remove:true}]:[];
   return [{oldId:r?.id,base:TASK_DATE_FIELDS[v['rbase'+suffix]],offset:Number(offset),clock:v['rtime'+suffix]||'09:00'}];
  });
  await updateTask(space,task.id,current=>{
   if(existing&&!current)throw 'This task was removed.';
   const saved={...updated,history:current?.history??updated.history,plannedDate:current?.plannedDate??null};
   return existing?taskWithPlan(saved,planned):{...saved,plannedDate:planned};
  },{absolute:v.remind||'',relativeRules});
 },existing&&(()=>updateTask(space,task.id,()=>null)));
 const reminderPanel=document.createElement('div');
 const baseChoices=Object.keys(TASK_DATE_FIELDS),options=(items,value)=>items.map(o=>`<option value="${esc(o)}" ${o===value?'selected':''}>${esc(o)}</option>`).join('');
 if(entries[0]&&!entries[0].scheduledAt)reminderPanel.innerHTML='<p class="muted">This reminder is inactive until its reference date is set.</p>';
 const extraRows=document.createElement('div');reminderPanel.append(extraRows);
 function addRuleForm(r,i){
  const value=ruleValues(r),row=document.createElement('fieldset');row.className='phase-editor';
  row.innerHTML=`<legend>Relative reminder ${i+1}</legend><label>Days before (H-)<select name="roff-${i}">${options(['none',...TASK_OFFSETS],value.roff)}</select></label><label>Counted from<select name="rbase-${i}">${options(baseChoices,value.rbase)}</select></label><label>Reminder time<input name="rtime-${i}" type="time" value="${esc(value.rtime)}"></label>${r&&!r.scheduledAt?'<small class="muted">Inactive until its reference date is set.</small>':''}`;
  extraRows.append(row);
 }
 entries.slice(1).forEach((r,i)=>addRuleForm(r,i+1));
 const another=document.createElement('button');another.type='button';another.className='ghost';another.textContent='Add another relative reminder';
 another.onclick=()=>{const i=entries.length;entries.push(undefined);addRuleForm(undefined,i);form.elements.namedItem('roff-'+i)?.focus()};
 reminderPanel.append(another);$('[data-field=subs]',form).before(reminderPanel);
 if(isWork){
  const projectSelect=form.elements.namedItem('projectId'),phaseSelect=form.elements.namedItem('phaseId');
  const refreshPhases=selected=>{
   const choices=projectPhases(projects.find(p=>p.id===projectSelect.value));
   phaseSelect.replaceChildren(new Option('No phase',''),...choices.map(p=>new Option(p.name,p.id)));
   phaseSelect.disabled=!choices.length;
   phaseSelect.closest('label').hidden=!choices.length;
   if(choices.some(p=>p.id===selected))phaseSelect.value=selected;
  };
  refreshPhases(task.phaseId);
  projectSelect.addEventListener('change',()=>refreshPhases(projectSelect.value===task.projectId?task.phaseId:null));
 }
 if(!existing)return;
 const actions=$('.form-actions',form);
 const action=(title,onclick)=>{
  const b=document.createElement('button');
  b.type='button';b.className='ghost';b.textContent=title;b.onclick=onclick;
  actions.append(b);
 };
 action('Duplicate',async()=>{
  await put(space,'tasks',{...task,id:uid(),createdAt:undefined,status:'todo',doneDate:null,history:[]});
  $('#dlg').close();render();
 });
}

function editTaskOffset(space,task,reminder){
 const bases=Object.keys(TASK_DATE_FIELDS);
 const base=(reminder?bases.find(key=>TASK_DATE_FIELDS[key]===reminder.relativeBase):bases.find(key=>task[TASK_DATE_FIELDS[key]]))||'deadline';
 dlg('Task reminder',[['base','Counted from','select',bases],['n','Days before (H-)','select',TASK_OFFSETS],['tm','Time','time']],
  {base,n:String(reminder?.offsetDays??7),tm:reminder?.clock||'09:00'},v=>updateTask(space,task.id,current=>{
   if(!current)throw 'This task was removed.';
   return current;
  },{relative:{base:TASK_DATE_FIELDS[v.base],offset:Number(v.n),clock:v.tm||'09:00',oldId:reminder?.id}}),
  reminder&&(()=>del(space,'reminders',reminder.id)));
}

function editReminder(r){
 const space=sp;
 if(r?.milestoneId){
  const project=D.projects.find(p=>p.id===r.projectId);
  const index=project?.milestones.findIndex(m=>m.id===r.milestoneId);
  if(index>=0)editMilestone(project,index);
  return;
 }
 if(r?.taskId&&r.relativeBase){
  const task=D.tasks.find(t=>t.id===r.taskId);
  if(task)editTaskOffset(space,task,r);
  return;
 }
 dlg('Reminder',[['title','What for?','text'],['at','Date & time','datetime-local']],r?{...r,at:r.scheduledAt||r.at}:{},v=>{
  if(!dateTimeValue.test(v.at))throw 'Choose a date and time.';
  return put(space,'reminders',{...setReminderSchedule(r||{id:uid()},v.at),title:v.title.trim()||'Reminder'});
 },r&&(()=>del(space,'reminders',r.id)));
}

function milestoneIndex(project,milestone,index){
 return milestone.id?project.milestones.findIndex(m=>m.id===milestone.id):
  project.milestones.findIndex((m,i)=>i===index&&!m.id&&m.t===milestone.t&&m.date===milestone.date);
}

function updateProject(id,update,alarm){
 return changeRecords('work',{projects:id,reminders:null},({projects,reminders},stores)=>{
  const project=update(projects);
  const before=reminders.filter(r=>r.projectId===id&&r.milestoneId);
  let next=uniqueReminders(before);
  if(alarm){
   const current=next.find(r=>r.milestoneId===alarm.milestoneId);
   const {mode,at,clock,milestoneId}=alarm;
   if(mode==='none')next=next.filter(r=>r.milestoneId!==milestoneId);
   else{
    const values={kind:'milestone',projectId:id,milestoneId,relativeBase:null,offsetDays:null,clock:null};
    if(mode==='custom'){
     if(!dateTimeValue.test(at))throw 'Choose a custom date and time.';
     Object.assign(values,setReminderSchedule({...current,...values},at));
    }else{
     if(!MILESTONE_OFFSETS.some(([offset])=>offset===mode)||!clockValue.test(clock))throw 'Choose a valid reminder time.';
     const milestone=project.milestones.find(m=>m.id===milestoneId);
    if(!validDate(milestone.date)&&!current?.relativeBase)throw 'Set a milestone date for a relative reminder.';
     Object.assign(values,{relativeBase:'milestoneDate',offsetDays:Number(mode),clock});
    }
    next=upsertReminder(next,values);
   }
  }
  stores.projects.put(stamp(project));
  storeReminderChanges(stores.reminders,before,next.map(r=>linkedSchedule(r,null,project)));
 });
}

function removeProject(project){
 return changeRecords('work',{projects:project.id,tasks:null,reminders:null},({tasks,reminders},stores)=>{
  for(const task of tasks.filter(t=>t.projectId===project.id)){
   const detached={...task};delete detached.projectId;delete detached.phaseId;
   stores.tasks.put(stamp(detached));
  }
  for(const r of reminders.filter(r=>r.projectId===project.id&&r.milestoneId))stores.reminders.delete(r.id);
  stores.projects.delete(project.id);
 });
}

function editMilestone(project,index){
 const milestone=project.milestones?.[index];
 if(!milestone)return;
 const id=milestone.id||uid();
 const reminder=D.reminders.find(r=>r.projectId===project.id&&r.milestoneId===id);
 const values={...milestone,mode:reminder?(reminder.relativeBase?String(reminder.offsetDays):'custom'):'none',clock:reminder?.clock||'09:00',at:reminder?.scheduledAt||reminder?.at||''};
 function change(v){
  const alarm=v&&{milestoneId:id,mode:v.mode,at:v.at,clock:v.clock||'09:00'};
  return updateProject(project.id,current=>{
   if(!current)throw 'This project was removed.';
   const i=milestoneIndex(current,milestone,index);
   if(i<0)throw 'This milestone was removed.';
   const milestones=[...current.milestones];
   if(v){
    const t=v.t.trim();
    if(!t)throw 'Enter a milestone title.';
    milestones[i]={...milestones[i],id,t,date:v.date||''};
   }else milestones.splice(i,1);
   return {...current,milestones};
  },alarm);
 }
 const form=dlg('Edit milestone',[['t','Title','text'],['date','Date (optional)','date'],
  ['mode','Reminder','choice',[['none','No Reminder'],...MILESTONE_OFFSETS,['custom','Custom Date & Time']]],
  ['clock','Reminder time','time'],['at','Custom date and time','datetime-local']],values,change,()=>change(null));
 const mode=form.elements.namedItem('mode');
 const showTime=()=>{
  $('[data-field=clock]',form).hidden=mode.value==='none'||mode.value==='custom';
  $('[data-field=at]',form).hidden=mode.value!=='custom';
 };
 mode.addEventListener('change',showTime);showTime();
}

function readMilestoneLines(text,existing){
 const lines=text.split('\n').map(line=>line.split('|').map(piece=>piece.trim())).filter(([title])=>title);
 const used=new Set();
 // Match exact rows first so reordering or duplicate titles cannot swap reminders.
 const matches=lines.map(([title,date=''])=>{
  const i=existing.findIndex((m,index)=>!used.has(index)&&m.t===title&&m.date===date);
  if(i>=0)used.add(i);return i;
 });
 const matchRemaining=predicate=>lines.forEach(([t,date=''],index)=>{
  if(matches[index]>=0)return;
  const candidates=existing.flatMap((m,i)=>!used.has(i)&&predicate(m,t,date)?[i]:[]);
  if(candidates.length===1){matches[index]=candidates[0];used.add(candidates[0]);}
 });
 matchRemaining((m,title)=>m.t===title);
 matchRemaining((m,_title,date)=>date&&m.date===date);
 return lines.map(([t,date=''],index)=>{
  const old=existing[matches[index]];
  return {...old,id:old?.id||uid(),t,date,d:!!old?.d};
 });
}

function editProject(project){
 const phases=projectPhases(project);
 const milestones=project?.milestones||[];
 const values={status:'active',...project,ms:milestones.map(m=>m.t+' | '+(m.date||'')).join('\n')};
 const form=dlg(project?'Edit project':'New project',[
  ['name','Name','text'],['start','Start date','date'],['deadline','Deadline','date'],
  ['status','Status','select',['active','paused','done']],['ms','Milestones (optional, title | YYYY-MM-DD per line)','area']
 ],values,v=>{
  const name=v.name.trim();
  if(!name)throw 'Enter a project name.';
  const rows=[...form.querySelectorAll('[data-phase-id]')].map(row=>({id:row.dataset.phaseId,name:$('input',row).value.trim()})).filter(row=>row.name);
  if(new Set(rows.map(row=>row.name.toLowerCase())).size!==rows.length)throw 'Give each phase a different name.';
  const id=project?.id||uid();
  return updateProject(id,current=>{
   if(project&&!current)throw 'This project was removed.';
   return {...current,id,name,start:v.start||null,deadline:v.deadline||null,status:v.status,
    phases:rows.map(row=>row.name),phaseIds:rows.map(row=>row.id),milestones:readMilestoneLines(v.ms,current?.milestones||[])};
  });
 },project&&(()=>removeProject(project)));
 const phaseEditor=document.createElement('fieldset');
 phaseEditor.className='phase-editor';
 phaseEditor.innerHTML='<legend>Phases (optional)</legend><div class="phase-inputs"></div><button type="button" class="ghost">+ Add phase</button><small class="muted">Removing a phase keeps its tasks in No phase.</small>';
 $('[data-field=ms]',form).before(phaseEditor);
 function addRow(phase={id:uid(),name:''},focus=false){
  const row=document.createElement('div');
  row.className='phase-input';
  row.dataset.phaseId=phase.id;
  row.innerHTML=`<input aria-label="Phase name" placeholder="Phase name" maxlength="120" value="${esc(phase.name)}"><button type="button" class="ghost" aria-label="Remove phase">Remove</button>`;
  $('.phase-inputs',phaseEditor).append(row);
  $('button',row).onclick=()=>{row.remove();addButton.focus()};
  if(focus)$('input',row).focus();
 }
 const addButton=$('.phase-inputs + button',phaseEditor);
 addButton.onclick=()=>addRow(undefined,true);
 phases.forEach(phase=>addRow(phase));
}

const projectTasks=p=>D.tasks.filter(t=>t.projectId===p.id&&t.status!=='cancelled');
const doneCount=tasks=>tasks.filter(t=>t.status==='done').length;
function phaseGroups(project,tasks){
 const groups=projectPhases(project).map(phase=>({...phase,tasks:[]}));
 if(!groups.length)return [];
 const byPhase=new Map(groups.map(group=>[group.id,group]));
 const others={id:'',name:'No phase',tasks:[]};
 tasks.forEach(task=>(byPhase.get(task.phaseId)||others).tasks.push(task));
 return others.tasks.length?[...groups,others]:groups;
}

function progressView(tasks,label){
 const done=doneCount(tasks);
 return `<div class="progress-row"><progress aria-label="${esc(label)}" value="${done}" max="${tasks.length||1}"></progress><span>${done}/${tasks.length} done</span></div>`;
}

function activeProjectsView(){
 const projects=D.projects.filter(p=>!p.status||p.status==='active');
 return `<section class="card active-projects"><h2>Active Projects</h2>${projects.length?projects.map(p=>{
  const tasks=projectTasks(p),remaining=tasks.length-doneCount(tasks);
  const groups=phaseGroups(p,tasks);
  const nearest=[p.deadline,...tasks.filter(t=>t.status!=='done').map(t=>t.deadline)].filter(Boolean).sort();
  const deadline=nearest.find(date=>date>=today())||nearest[nearest.length-1];
  const openTasks=items=>{
   const open=items.filter(t=>t.status!=='done');
   return open.length?`<ul class="project-todo">${open.map(t=>`<li data-id="${esc(t.id)}"><button type="button" data-act="edit">${esc(t.title)}</button>${t.deadline?`<small>${esc(t.deadline)}</small>`:''}</li>`).join('')}</ul>`:'<p class="muted">No unfinished tasks.</p>';
  };
  return `<article class="today-project" data-id="${esc(p.id)}"><div class="section-head"><h3>${esc(p.name)}</h3><button class="ghost" data-act="projectopen">View project</button></div><p class="project-meta">${remaining} unfinished${deadline?` · ${deadline<today()?'Past deadline':'Next deadline'} ${esc(deadline)}`:''}</p>${progressView(tasks,'Project progress')}${groups.length?`<div class="phase-grid">${groups.map(g=>`<section class="phase-mini"><h4>${esc(g.name)}</h4>${progressView(g.tasks,'Progress for '+g.name)}${openTasks(g.tasks)}</section>`).join('')}</div>`:openTasks(tasks)}</article>`;
 }).join(''):'<p class="muted">No active projects yet.</p>'}</section>`;
}

function milestoneRow(project,m,i){
 const alarm=D.reminders.find(r=>r.projectId===project.id&&r.milestoneId===m.id);
 const label=alarm?.at?'Edit reminder':alarm?'Inactive reminder':'Set reminder';
 return `<div class="row"><label class="sub"><input type="checkbox" style="width:auto" data-act="ms" data-i="${i}" ${m.d?'checked':''}> 🚩 ${esc(m.t)} <span class="muted">${esc(m.date)}</span></label><button class="ghost" data-act="milestoneedit" data-i="${i}" aria-label="${label} for ${esc(m.t)}">${label}</button></div>`;
}

function projectsView(){
 return `<div class="hero"><h1>Projects ♡</h1></div><div class="row project-tools"><button class="pri" data-act="padd">+ New project</button><button class="ghost" data-act="wa">📥 Import My Notes</button></div>${D.projects.map(p=>{
  const tasks=projectTasks(p),groups=phaseGroups(p,tasks),open=LS('pf')===p.id,id=esc(p.id);
  const deadlines=[p.start&&'Starts '+p.start,p.deadline&&'Due '+p.deadline].filter(Boolean);
  const grouped=groups.length?groups.map(g=>`<section class="phase-group"><div class="section-head"><h3>${esc(g.name)}</h3><button class="ghost" data-act="tasknew" data-project="${id}" data-phase="${esc(g.id)}">+ Add task</button></div>${progressView(g.tasks,'Progress for '+g.name)}${list(g.tasks,'No tasks yet.')}</section>`).join(''):list(tasks,'No tasks yet.');
  return `<section class="card project-card" data-id="${id}" id="project-${id}"><div class="section-head"><h2>📁 ${esc(p.name)}</h2><span class="badge">${esc(p.status||'active')}</span></div>${deadlines.length?`<p class="muted project-meta">${esc(deadlines.join(' · '))}</p>`:''}${progressView(tasks,'Project progress')}${(p.milestones||[]).map((m,i)=>milestoneRow(p,m,i)).join('')}<div class="row project-tools"><button class="ghost" data-act="pedit">Edit project</button><button class="ghost" data-act="pfilter" aria-expanded="${open}">${open?'Hide':'Show'} tasks</button><button class="pri" data-act="tasknew" data-project="${id}">+ New task</button></div>${open?qa('proj:'+p.id,'Quick add to '+p.name,true)+grouped:''}</section>`;
 }).join('')||'<div class="card"><p class="muted">No projects yet.</p></div>'}`;
}

const dateTitle=(date,options)=>new Date(date+'T12:00').toLocaleDateString('en',options);
function workCalendarEvents(){
 const days=new Map();
 function addEntry(date,entry,label){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date||''))return;
  if(!days.has(date))days.set(date,new Map());
  const entries=days.get(date);
  if(!entries.has(entry.key))entries.set(entry.key,{...entry,labels:[]});
  entries.get(entry.key).labels.push(label);
 }
 for(const task of D.tasks){
  if(task.status==='cancelled')continue;
  const entry={key:'task:'+task.id,id:task.id,title:task.title,project:projName(task),completed:task.status==='done',action:'edit'};
  addEntry(task.startDate,entry,'Start');
  addEntry(task.plannedDate,entry,'Planned');
  addEntry(task.deadline,entry,'Deadline');
 }
 for(const project of D.projects){
  const entry={key:'project:'+project.id,id:project.id,title:project.name,completed:project.status==='done',action:'projectopen'};
  addEntry(project.start,entry,'Project start');
  addEntry(project.deadline,entry,'Project deadline');
  (project.milestones||[]).forEach((m,i)=>addEntry(m.date,{...entry,key:entry.key+':milestone:'+i,title:m.t,project:project.name,completed:m.d},'Milestone'));
 }
 return days;
}

function workCalMonth(){
 const {m,sel}=workCal,year=m.getFullYear(),month=m.getMonth(),current=today();
 const offset=new Date(year,month,1).getDay(),length=new Date(year,month+1,0).getDate();
 const monthName=m.toLocaleDateString('en',{month:'long',year:'numeric'});
 const days=workCalendarEvents();
 const cells=Array.from({length},(_,i)=>{
  const day=i+1,date=fmt(new Date(year,month,day)),count=days.get(date)?.size||0;
  const label=dateTitle(date,{month:'long',day:'numeric',year:'numeric'})+(count?`, ${count} ${count===1?'entry':'entries'}`:'');
  return `<button class="day work-day ${date===current?'tdy':''} ${date===sel?'sel':''}" data-act="workday" data-d="${date}" aria-label="${esc(label)}" aria-pressed="${date===sel}" ${date===current?'aria-current="date"':''}><span>${day}</span>${count?`<small class="day-count" aria-hidden="true">${count}</small>`:''}</button>`;
 }).join('');
 const agenda=[...(days.get(sel)?.values()||[])];
 const items=agenda.map(entry=>`<li class="task agenda-item" data-id="${esc(entry.id)}"><div class="tb"><button class="agenda-title" data-act="${entry.action}">${esc(entry.title)}</button>${entry.project?`<small>${esc(entry.project)}</small>`:''}<div class="row">${entry.labels.map(label=>`<span class="badge ${label.toLowerCase().includes('deadline')?'due-label':''}">${label}</span>`).join('')}${entry.completed?'<span class="badge status-done">Done</span>':''}</div></div></li>`).join('');
 return `<header class="hero"><h1>Work Calendar ♡</h1><p>Planned work, deadlines &amp; milestones</p></header><div class="work-calendar-layout"><section class="card calendar-page"><div class="section-head"><h2>${esc(monthName)}</h2><button class="ghost" data-act="workmonth" data-n="0">Today</button></div><div class="grid work-grid" aria-label="${esc(monthName)}">${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>`<b>${d}</b>`).join('')}${'<span aria-hidden="true"></span>'.repeat(offset)}${cells}</div><div class="row calendar-nav"><button class="ghost" data-act="workmonth" data-n="-1">Previous month</button><button class="ghost" data-act="workmonth" data-n="1">Next month</button></div></section><section class="card calendar-agenda"><h2>${esc(dateTitle(sel,{weekday:'long',month:'long',day:'numeric'}))}</h2>${items?`<ul>${items}</ul>`:'<p class="muted">No work scheduled for this date.</p>'}${qa('work-date','Plan a task for this date',true)}<button class="ghost" data-act="tasknew" data-date="${esc(sel)}">+ Task with details</button></section></div>`;
}
function remCard(){const a=[...(D.reminders||[])].sort((x,y)=>(x.at||'~').localeCompare(y.at||'~'));return `<div class="card"><h2>Reminders</h2><p class="muted">In-app alerts only appear while Fleureve is open. For alerts when it is closed, export .ics and import it into your calendar app, then confirm it there.</p><button class="pri" data-act="radd2">+ Reminder</button><ul>${a.map(r=>`<li class="task" data-id="${esc(r.id)}"><div class="tb"><b>${esc(r.title)}</b><small>${r.at?esc(r.at.replace('T',' ')):'Inactive · set the reference date'}${r.fired?' · shown':''}</small></div><div class="acts"><button data-act="remedit">Edit</button></div></li>`).join('')}</ul></div>`}
function track(){const td=today(),m=D.moods.find(x=>x.date===td);return `<div class="hero"><h1>Little Trackers ♡</h1></div><div class="card"><h2>How are you today?</h2><div class="row">${MOODS.map(([i,n])=>`<button class="${m&&m.mood===n?'pri':'ghost'}" data-act="mood" data-m="${n}">${i} ${n}</button>`).join('')}</div><button class="ghost" data-act="mnote">Add a note</button>${m&&m.note?`<p>${esc(m.note)}</p>`:''}<p class="muted">Recent: ${[...D.moods].sort((a,b)=>a.date<b.date?1:-1).slice(0,10).map(x=>x.date.slice(5)+' '+MOODS.find(y=>y[1]===x.mood)[0]).join(' · ')||'none yet'}</p></div><div class="card"><h2>Habits</h2><button class="pri" data-act="hadd">+ New habit</button>${D.habits.map(h=>{const ls=D.habitLogs.filter(l=>l.habitId===h.id).map(l=>l.date),c=ls.filter(d=>d>=addDays(td,-29)).length;let st=0;if(h.streak){let d=ls.includes(td)?td:addDays(td,-1);while(ls.includes(d)){st++;d=addDays(d,-1)}}return `<div class="task" data-id="${h.id}"><button class="chk" data-act="hlog">${ls.includes(td)?'✓':''}</button><div class="tb"><b>${esc(h.icon)} ${esc(h.name)}</b><small>${esc(h.freq)} · ${c} times in the last 30 days${h.streak?' · streak '+st:''}</small></div><div class="acts"><button data-act="hedit">Edit</button></div></div>`}).join('')}</div>`}
function waParse(x){const seen=new Set(D.tasks.map(t=>t.title.toLowerCase()));return x.split(/\r?\n/).map(l=>l.replace(/^\u200e?\[?\d{1,2}[\/.]\d{1,2}[\/.]\d{2,4},?\s+\d{1,2}[.:]\d{2}(?::\d{2})?\s*(?:[APap][Mm])?\]?\s*(?:-\s*)?(?:[^:]{1,40}:\s)?/,'').trim()).filter(l=>l&&!/^<.*omitted>$/i.test(l)).filter((l,i,a)=>a.indexOf(l)===i).map(l=>({t:l,dup:seen.has(l.toLowerCase())}))}
function waDlg(){const d=$('#dlg');d.innerHTML=`<form><h3>Import My Notes</h3><textarea name="x" rows="6" placeholder="Paste WhatsApp or plain text, one task per line"></textarea><button type="button" class="ghost" id="wp">Preview</button><div id="pv"></div><label>Project<select name="pj"><option value="">(none)</option>${D.projects.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label><label>Priority<select name="pr"><option>normal</option><option>low</option><option>high</option></select></label><label>Planned date<input type="date" name="dt"></label><div class="row"><button class="pri">Import selected</button><button type="button" class="ghost" id="dx">Cancel</button></div></form>`;
$('#wp').onclick=()=>{$('#pv').innerHTML=waParse($('textarea',d).value).map(x=>`<label class="sub"><input type="checkbox" style="width:auto" ${x.dup?'':'checked'}><input value="${esc(x.t)}" maxlength="200">${x.dup?'<small class="muted">possible duplicate</small>':''}</label>`).join('')||'<p class="muted">No task lines found.</p>'};
$('form',d).onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);let n=0;for(const l of d.querySelectorAll('#pv label')){const v=l.children[1].value.trim();if(l.children[0].checked&&v){await put(sp,'tasks',{id:uid(),title:v,status:'todo',inbox:true,priority:f.get('pr'),projectId:f.get('pj')||undefined,plannedDate:f.get('dt')||null});n++}}d.close();toast(n+' added to your inbox ♡');render()};$('#dx').onclick=()=>d.close();if(d.open)d.close();d.showModal()}
const localTimestamp=date=>fmt(date)+'T'+String(date.getHours()).padStart(2,'0')+':'+String(date.getMinutes()).padStart(2,'0');
let checkingReminder=false;
async function checkReminders(){
 const space=sp,d=$('#dlg');
 if(!space||d.open||checkingReminder)return;
 checkingReminder=true;
 try{
  await ensureReminderLinks(space);
  const r=await changeRecords(space,{reminders:null},({reminders},stores)=>{
   if(space!==sp||d.open)return;
   const now=localTimestamp(new Date());
   const due=reminders.filter(r=>!r.fired&&r.at&&r.at<=now).sort((a,b)=>a.at.localeCompare(b.at))[0];
   if(!due)return;
   stores.reminders.put(stamp({...due,fired:true}));
   return due;
  });
  if(!r)return;
  if(space===sp&&!d.open)remAlert(r,space);
  else await rescheduleAlert(space,r,r.at);
 }finally{checkingReminder=false}
}

function rescheduleAlert(space,shown,at){
 return changeRecords(space,{reminders:shown.id},({reminders:r},stores)=>{
  if(r?.fired&&r.at===shown.at&&r.scheduledAt===shown.scheduledAt)stores.reminders.put(stamp({...r,at,fired:false}));
 });
}
setInterval(()=>checkReminders().catch(err=>console.error('Could not check reminders',err)),20000);

function timeline(){const td=today(),m=LS('tr')||'week';let a=td,z=td;if(m==='week')z=addDays(td,6);if(m==='month')z=addDays(td,29);if(m==='custom'){a=LS('ta')||td;z=LS('tz')||addDays(a,13);if(z<a)z=a}
const days=Math.min(120,Math.round((new Date(z)-new Date(a))/864e5)+1),pos=d=>Math.round((new Date(d)-new Date(a))/864e5),end=t=>t.deadline||t.plannedDate||t.startDate,st=t=>t.startDate||t.plannedDate||t.deadline;
const rows=D.tasks.filter(t=>t.status!=='cancelled'&&st(t)).map(t=>({t,s:st(t),e:end(t)<st(t)?st(t):end(t)})).filter(x=>x.e>=a&&x.s<=z).sort((x,y)=>x.s<y.s?-1:1);
const bar=(s,e,c)=>{const l=Math.max(0,pos(s)),r=Math.min(days-1,pos(e));return `left:${l/days*100}%;width:${(r-l+1)/days*100}%`};
const warn=t=>(t.deps||[]).map(i=>D.tasks.find(x=>x.id===i)).filter(Boolean).map(d=>{let m='after “'+d.title+'”'+(d.status==='done'?' ✓':'');if(d.status!=='done'&&end(d)&&st(t)&&st(t)<end(d))m+=' ⚠ starts before it ends';return `<small class="muted">↳ ${esc(m)}</small>`}).join('');
const ms=D.projects.flatMap(p=>(p.milestones||[]).filter(x=>x.date>=a&&x.date<=z).map(x=>({p,x})));
return `<div class="hero"><h1>Timeline ♡</h1><p>Start date, work day, and deadline are separate. Tap a bar to change them.</p></div><div class="seg row">${['today','week','month','custom'].map(k=>`<button data-act="tr" data-m="${k}" class="${(m===k)?'on':''}">${{today:'Today',week:'This Week',month:'This Month',custom:'Custom'}[k]}</button>`).join('')}</div>${m==='custom'?`<div class="row"><input type="date" data-k="ta" value="${a}" style="width:auto"><input type="date" data-k="tz" value="${z}" style="width:auto"></div>`:''}
<div class="card" style="overflow-x:auto"><div style="min-width:640px"><p class="muted">${a} → ${z}</p>${rows.map(({t,s,e})=>`<div data-id="${t.id}"><small><b>${esc(t.title)}</b> ${projName(t)?'· '+esc(projName(t)):''}${t.deadline?' · ⏳ '+t.deadline:''}</small><div class="gt" data-act="edit"><div class="bar ${t.status==='done'?'d':''}" style="${bar(s,e)}"></div></div>${warn(t)}</div>`).join('')||'<p class="muted">No dated tasks in this range.</p>'}${ms.map(({p,x})=>`<p>🚩 ${esc(x.t)} <span class="muted">${esc(p.name)} · ${x.date}${x.d?' ✓':''}</span></p>`).join('')}</div></div>`}
NOTES.push("Brb, romanticizing my inbox.","Soft girl, strong deadlines.","Little steps still leave footprints.","Today's menu: one task, one tea, one tiny victory.","You're allowed to start small and sparkly.","Not behind. Just blooming on your own schedule.","Today we bloom, tomorrow we bloom again.","Cute and slightly overbooked. A classic.","Stir in a little courage, bake until done.","Be the muse and the manager.","A ribbon on every to-do, please.","Today's agenda: be kind to yourself, then to the deadline.","Yes, the laundry can wait while you finish the page.","Chapter one: the day begins. Chapter two: you handle it.","Dust off the stationery, dust off the plans.","Strawberries in the morning, progress by noon.","The list is long but so is your grace.","A bow-tied day awaits.","Pour tea. Pick one thing. Begin.","Breathe in, check one box, breathe out.","Even Paris wasn't planned in a day.","Your future self sends a tiny thank-you note.","Plot twist: the small thing was the big thing.","Sweet things come to those who schedule them.","Let's make today suspiciously productive.","If it's not today, it's still on the page.","You're the heroine and the editor.","Light a candle for the unfinished things. They're safe here.","Every checkmark is a tiny flower.","Keep calm and carry a pretty pen.","Rest is also on the schedule.","Be gentle. Be steady. Be you.","Oops, the day got busy. Plans are bendy.","A to-do list is just a love letter to your future.","Soft focus, sharp pencil.","Good things come in tiny pastel packages.","Teacup half full, plans half done. Lovely.","Dear self, you're doing better than you think.","Ta-da! Something got done, and you did it.","The tiniest win still deserves a bow.","Make it pretty, make it doable.","Dreamy start, sensible finish.","You are the plot and the plot twist.","A little glitter on the Monday blues.","Open the diary, close the worry.","Fresh page, fresh air, fresh start.","Your pace is a perfectly good pace.","Whisper it: you've got this.","One cozy step at a time.","Be the kind of busy that feels like blooming.","Frosting on the to-do list, please.","Tonight's ending: a quiet checklist and a happy sigh.","Nobody said productive couldn't be pretty.","Small joys, small tasks, big heart.","The calendar is just a garden with dates.","You've already done more than you'll remember.","Sparkle first, schedule second.","Today's mantra: gentle but determined.","Some days are for doing. Some are for gathering strength.","Wear the bow. Finish the thing.","Warm cocoa, cold hard deadlines, cozy you.","Take the scenic route to done.","Choose the next small thing. That's the whole plan.","Handwritten kindness, digital reminders.","Fashionably late is still on time to bloom.","Progress has a pretty face and it's yours.","Stay curious, stay soft, stay on schedule-ish.","Today's accessory: a little patience.","Let the little wins pile up like petals.","Soft launch of a very good day.","Add a pinch of delight to every plan.","Tick, tock, tea o'clock.","Vintage heart, modern to-do list.","Be proud, be playful, be present.","You're not late. You're just writing a great entry.","Gold star for showing up.","Go on, make future you smile.","Polka dots and priorities.","The rest of the list can wait its turn.","Little reminder: you are enough, even unfinished.","Charming chaos, gracefully handled.","Collect small wins like pressed flowers.","The end of a task is the start of a nap. Probably.");

// Today's Reflection is an offline curated dataset. Never generate religious content.
function pickReflection(){
 const day=pctx().cd, key='fleureve-reflection-day', stored=LS(key);
 let idx=Number(LS('fleureve-reflection-index'));
 if(stored!==day||!Number.isInteger(idx)||idx<0||idx>=REFLECTIONS.length){
  idx=(Number(day.replace(/-/g,''))+day.charCodeAt(5))%REFLECTIONS.length;
  localStorage.setItem(key,day);localStorage.setItem('fleureve-reflection-index',String(idx));
 }
 return REFLECTIONS[idx];
}
function reflectionSnippet(r){
 const saved=(D.reflectionFavorites||[]).some(x=>x.id===r.id);
 return `<article class="verse"><div class="row"><span class="badge">${esc(r.type)}</span><span class="muted">${esc(r.reference)}</span></div>${r.arabic?`<p class="arabic" dir="rtl" lang="ar">${esc(r.arabic)}</p>`:''}<p class="reflection-text">${esc(r.text)}</p><small class="muted">${esc(r.publisher)} · ${r.type.includes('kutipan')?'Kutipan sebagian hadis.':'Terjemahan sesuai sumber.'}</small><div class="row" style="margin-top:12px"><button class="ghost" data-act="rsave" data-r="${esc(r.id)}">${saved?'♥ Saved':'♡ Save to Favorites'}</button><a class="source-link" href="${esc(r.source)}" target="_blank" rel="noopener noreferrer">View Source ↗</a></div></article>`;
}
function reflectionCard(){
 const fav=(LS('reflection-list')==='1'),items=(D.reflectionFavorites||[]).map(x=>REFLECTIONS.find(r=>r.id===x.id)).filter(Boolean),r=pickReflection();
 return `<div class="card"><h2>A Little Reminder for the Heart ♡</h2><p class="muted">Only short excerpts checked against linked sources — no generated verses or hadith.</p><div class="row"><button class="${fav?'ghost':'pri'}" data-act="reflist" data-v="0">Today's Reflection</button><button class="${fav?'pri':'ghost'}" data-act="reflist" data-v="1">♥ Favorites (${items.length})</button></div>${fav?(items.length?items.map(reflectionSnippet).join(''):'<p class="muted">Your saved reflections will appear here. ♡</p>'):`${reflectionSnippet(r)}<button class="ghost" data-act="rnext" style="margin-top:12px">Another Reflection ↻</button>`}</div>`;
}
const CITIES={Jakarta:[-6.2088,106.8456,7],Bandung:[-6.9175,107.6191,7],Yogyakarta:[-7.7956,110.3695,7],Surabaya:[-7.2575,112.7521,7],Medan:[3.5952,98.6722,7],Makassar:[-5.1477,119.4327,8],Denpasar:[-8.6705,115.2126,8],Manokwari:[-0.8615,134.062,9],Sorong:[-0.8762,131.2558,9],Waisai:[-0.42108,130.82295,9],'Misool Island (approx.)':[-1.86667,130.16667,9],Jayapura:[-2.5337,140.7181,9],Ambon:[-3.6954,128.1814,9]},PN=['Subuh','Zuhur','Asar','Magrib','Isya'];
function ptimes(date,lat,lng,tz){const r=Math.PI/180,S=x=>Math.sin(x*r),C=x=>Math.cos(x*r),[y,m,d]=date.split('-').map(Number),fa=a=>((a%360)+360)%360,fh=h=>((h%24)+24)%24;
const D=Date.UTC(y,m-1,d,12-tz)/864e5+2440587.5-2451545,g=fa(357.529+.98560028*D),q=fa(280.459+.98564736*D),L=fa(q+1.915*S(g)+.02*S(2*g)),e=23.439-3.6e-7*D,RA=fh(Math.atan2(C(e)*S(L),C(L))/r/15),eq=((q/15-RA+12)%24+24)%24-12,dec=Math.asin(S(e)*S(L))/r;
const noon=12+tz-lng/15-eq,ang=a=>Math.acos((-S(a)-S(lat)*S(dec))/(C(lat)*C(dec)))/r/15,asrA=-Math.atan(1/(1+Math.tan(Math.abs(lat-dec)*r)))/r;
return [noon-ang(20),noon,noon+ang(asrA),noon+ang(.833),noon+ang(18)].map(h=>fh(h+3/60))}
const hm=h=>{if(isNaN(h))return '--:--';const t=Math.round(h*60);return String(Math.floor(t/60)%24).padStart(2,'0')+':'+String(t%60).padStart(2,'0')};
const pref=()=>(D.prefs||[]).find(x=>x.id==='prayer')||{id:'prayer',city:'Jakarta',remind:false};
const validCoordinates=(lat,lng)=>Number.isFinite(lat)&&Number.isFinite(lng)&&Math.abs(lat)<=90&&Math.abs(lng)<=180;
function pctx(p=pref(),now=Date.now()){
 const saved=(p.saved||[]).find(x=>'s:'+x.id===p.city);
 const code=p.city.startsWith('r:')?p.city.slice(2):null;
 const region=code&&p.rcoords?.[code];
 const [lat,lng,offset]=saved?[saved.lat,saved.lng,saved.tz]:code?[region?.lat,region?.lng,regTz(code)]:
  p.city==='GPS'?[p.lat,p.lng,p.tz]:CITIES[p.city]||[];
 const tz=[7,8,9].includes(Number(offset))?Number(offset):null;
 const c=validCoordinates(lat,lng)&&tz?[lat,lng,tz]:[NaN,NaN,tz];
 const cd=tz?new Date(now+tz*36e5).toISOString().slice(0,10):fmt(new Date(now));
 return {p,c,tz,cd};
}
const prayerEventAt=(d,h,tz)=>new Date(d+'T00:00:00Z').getTime()+(Math.round(h*60)-tz*60)*60000;
function pnext(now=Date.now()){
 const ctx=pctx(pref(),now);
 if(!ctx.tz)return {n:'',ms:NaN};
 for(const day of [ctx.cd,addDays(ctx.cd,1)]){
  const {t:times,src}=ptSrc(day,ctx);
  for(let i=0;i<PN.length;i++){
   const at=prayerEventAt(day,times[i],ctx.tz);
   if(at>now)return {n:PN[i],ms:at-now,src};
  }
 }
 return {n:'',ms:NaN};
}
const cdText=()=>{const x=pnext();if(isNaN(x.ms))return 'No times for this region yet';const s=Math.floor(x.ms/1e3);return `${x.n} in ${Math.floor(s/3600)}h ${String(Math.floor(s%3600/60)).padStart(2,'0')}m ${String(s%60).padStart(2,'0')}s`};
function prayer(){const{p,c,tz,cd}=pctx(),ts=ptSrc(cd).t,L=D.prayerLogs,hist=[0,1,2,3,4,5,6].map(i=>addDays(cd,-i));
return `<div class="hero"><h1>My Peaceful Moments 🌿</h1><p id="cd">${cdText()}</p></div><div class="card"><h2>${esc(locName(p))} · ${cd} · ${tz?'UTC+'+tz:'Time zone unavailable'}</h2><div class="row"><select id="city" style="width:auto">${Object.keys(CITIES).map(k=>`<option ${k===p.city?'selected':''}>${k}</option>`).join('')}${p.city==='GPS'?'<option selected value="GPS">Your location</option>':''}${p.city.startsWith('r:')?`<option selected value="${esc(p.city)}">${esc(locName(p))}</option>`:''}${(p.saved||[]).map(x=>`<option value="s:${x.id}" ${'s:'+x.id===p.city?'selected':''}>💗 ${esc(x.name)}</option>`).join('')}</select><button class="ghost" data-act="gps">📍 Use my location</button><button class="ghost" data-act="locadd">+ Saved location</button>${(p.saved||[]).some(x=>'s:'+x.id===p.city)?'<button class="ghost" data-act="locdel">Remove this saved location</button>':''}</div><h3 class="ptitle">Fleureve Prayer Times <small class="muted">used for countdown and alarms</small></h3>${PN.map((n,i)=>{const lg=L.find(x=>x.id==='pl-'+cd+'-'+n);return `<div class="task"><button class="chk" data-act="plog" data-n="${n}">${lg?'✓':''}</button><div class="tb"><b>${n}</b><small>${lg&&lg.time?'recorded at '+lg.time:''}</small></div><b>${hm(ts[i])}</b></div>`}).join('')}${srcNote(cd)}</div>
${sihatCard()}<div class="card"><h2>Reminder</h2><label class="sub"><input type="checkbox" style="width:auto" data-act="prem" ${p.remind?'checked':''}> Remind me at prayer time</label><div class="row">${PN.map(n=>`<label class="sub"><input type="checkbox" style="width:auto" data-act="poff" data-n="${n}" ${(p.off||[]).includes(n)?'':'checked'}> ${n}</label>`).join('')}</div><p class="muted">In-app reminder only while Fleureve is running. iPhone may pause timers or block audio; don't rely on this as your only prayer alert.</p></div>
<div class="card"><h2>History</h2>${hist.map(d=>`<p>${d}: ${L.filter(x=>x.date===d).length}/5 ${PN.map(n=>L.find(x=>x.id==='pl-'+d+'-'+n)?'🌿':'·').join('')}</p>`).join('')}<small class="muted">Only what you tick is recorded.</small></div>
${reflectionCard()}`}
document.addEventListener('click',async e=>{
 const b=e.target.closest('[data-act]');if(!b||sp!=='personal')return;
 const a=b.dataset.act;
 if(a==='rnext'){
  const cur=pickReflection();const i=REFLECTIONS.findIndex(x=>x.id===cur.id);
  localStorage.setItem('fleureve-reflection-index',String((i+1)%REFLECTIONS.length));await render();
 } else if(a==='reflist'){localStorage.setItem('reflection-list',b.dataset.v);await render()}
 else if(a==='rsave'){
  const id=b.dataset.r;
  if(!REFLECTIONS.some(r=>r.id===id))return;
  const has=(D.reflectionFavorites||[]).some(x=>x.id===id);
  if(has)await del('personal','reflectionFavorites',id);
  else await put('personal','reflectionFavorites',{id,savedAt:new Date().toISOString()});
  toast(has?'Removed from Favorites':'Saved with love ♡');await render();
 }
});
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b||sp!=='personal')return;const a=b.dataset.act,sv=async o=>{await updatePrayerPrefs(o);await render()};
 if(a==='plog'){const{cd,tz}=pctx(),id='pl-'+cd+'-'+b.dataset.n,ex=D.prayerLogs.find(x=>x.id===id);if(ex)await del(sp,'prayerLogs',id);else{const w=new Date();await put(sp,'prayerLogs',{id,date:cd,name:b.dataset.n,time:tz?new Date(w.getTime()+tz*36e5).toISOString().slice(11,16):null,recordedAt:w.toISOString(),zoneOffset:tz})}render()}
 else if(a==='gps'){if(!navigator.geolocation)return toast('Location is not available here');navigator.geolocation.getCurrentPosition(g=>{
 const lat=g.coords.latitude,lng=g.coords.longitude;
 // Longitude only gives a rough hint, not authoritative administrative time zone.
 // Require explicit user confirmation rather than silently using the device's zone.
 const guess=lng<115?'7':lng<126?'8':'9';
 dlg('Confirm GPS time zone',[['tz','Time zone: 7=WIB · 8=WITA · 9=WIT (please confirm)','select',['7','8','9']]],{tz:guess},v=>sv({city:'GPS',lat,lng,tz:Number(v.tz)}));
 },()=>toast('Location permission denied — choose a city instead'))}
 else if(a==='locadd'){dlg('Saved location',[['name','Name (e.g. Waisai)','text'],['lat','Latitude (e.g. -0.43)','number'],['lng','Longitude (e.g. 130.83)','number'],['tz','Time zone','select',['7','8','9']]],{tz:'9'},v=>{const la=parseFloat(v.lat),lo=parseFloat(v.lng);if(!(la>=-90&&la<=90&&lo>=-180&&lo<=180)){toast('Enter valid coordinates');throw 'Please enter coordinates between -90/90 and -180/180.'}const id=uid();return updatePrayerPrefs(p=>({saved:[...(p.saved||[]),{id,name:v.name.trim()||'My place',lat:la,lng:lo,tz:+v.tz}],city:'s:'+id}));});return}
 else if(a==='locdel'){const city=pref().city;await sv(p=>({saved:(p.saved||[]).filter(x=>'s:'+x.id!==city),city:'Jakarta'}));}
 else if(a==='poff'){await sv(p=>{const o=new Set(p.off||[]);b.checked?o.delete(b.dataset.n):o.add(b.dataset.n);return {off:[...o]}})}
 else if(a==='wsave'){
  const city=pref().city,entry=$('#wurl').value.trim(),url=sihatURL(entry,city);
  if(entry&&!url)return toast('Use the official SIHAT widget link for this location.');
  await sv(p=>({widgets:{...p.widgets,[city]:url||''}}));
 }
 else if(a==='pimp'){pimport();return}
 else if(a==='ptpl'){dl('fleureve-prayer-template.csv','Date,Subuh,Zuhur,Asar,Magrib,Isya\r\nYYYY-MM-DD,HH:MM,HH:MM,HH:MM,HH:MM,HH:MM\r\n','text/csv');return}
 else if(a==='pdelsched'){
  const ctx=pctx();
  if(confirm('Delete imported schedules for '+locName(ctx.p)+'?')){
   await changeRecords('personal',{prayerSchedules:null},({prayerSchedules},stores)=>{
    for(const r of prayerSchedules.filter(r=>scheduleBelongs(r,ctx)))stores.prayerSchedules.delete(r.id);
   });
   await render();
  }
  return;
 }
 else if(a==='rcoord'){const code=pref().city.slice(2),cur=(pref().rcoords||{})[code]||{};dlg('Coordinates for '+regName(code),[['lat','Latitude','number'],['lng','Longitude','number']],cur,v=>{const la=parseFloat(v.lat),lo=parseFloat(v.lng);if(!(la>=-90&&la<=90&&lo>=-180&&lo<=180)){toast('Enter valid coordinates');throw 0}return updatePrayerPrefs(p=>({rcoords:{...p.rcoords,[code]:{lat:la,lng:lo}}}))});return}
 else if(a==='prem')sv({remind:b.checked});else if(a==='pcal'){localStorage.setItem('pcal',b.checked?'1':'0');render()}});
document.addEventListener('change',async e=>{if(e.target.id==='city'&&sp==='personal'){await updatePrayerPrefs({city:e.target.value});await render()}});
let lastPrayerDay='';setInterval(()=>{const c=$('#cd');if(c){c.textContent=cdText();const nowDay=pctx().cd;if(lastPrayerDay&&lastPrayerDay!==nowDay){render()}lastPrayerDay=nowDay}},1000);

function getPrayerSnooze(){try{return JSON.parse(LS('psnooze')||'null')}catch{return null}}
const prayerLocationKey=ctx=>[ctx.p.city,ctx.p.city==='GPS'?ctx.c.slice(0,2).join(','):'',ctx.tz].join(':');
const prayerSnoozeKey=(ctx,source,day,index)=>JSON.stringify([prayerLocationKey(ctx),ctx.c,source.src,day,Math.round(source.t[index]*60)]);

async function updatePrayerPrefs(update){
 const {previous,next}=await changeRecords('personal',{prefs:'prayer'},({prefs},stores)=>{
  const previous=prefs||{id:'prayer',city:'Jakarta',remind:false};
  const next={...previous,...(typeof update==='function'?update(previous):update)};
  if(next.city==='GPS'&&validCoordinates(previous.lat,previous.lng)&&[next.lat,next.lng,next.tz].some((value,index)=>value!==[previous.lat,previous.lng,previous.tz][index]))next.gpsChanged=true;
  stores.prefs.put(stamp(next));return {previous,next};
 });
 const snooze=getPrayerSnooze();
 if(snooze&&(!next.remind||(next.off||[]).includes(snooze.n)||prayerLocationKey(pctx(previous))!==prayerLocationKey(pctx(next))))localStorage.removeItem('psnooze');
}

let checkingPrayer=false;
async function checkPrayerReminder(now=Date.now()){
 if(sp!=='personal'||$('#dlg').open||checkingPrayer)return;
 checkingPrayer=true;
 const view=renderVersion;
 try{
  const pf=await tx('personal','prefs','readonly',s=>s.get('prayer'));
  if(!pf?.remind)return;
  const [schedules,logs]=await Promise.all([all('personal','prayerSchedules'),all('personal','prayerLogs')]);
  if(sp!=='personal'||$('#dlg').open||view!==renderVersion||JSON.stringify(pref())!==JSON.stringify(pf))return;
  const ctx=pctx(pf,now),{cd,tz}=ctx;
  if(!tz)return;
  const wasLogged=(day,name)=>logs.some(r=>r.id==='pl-'+day+'-'+name);
  const snooze=getPrayerSnooze();
  if(snooze){
   const i=PN.indexOf(snooze.n),source=validDate(snooze.day)&&ptSrc(snooze.day,ctx,schedules);
   if(i<0||!source||source.src==='none'||snooze.key!==prayerSnoozeKey(ctx,source,snooze.day,i)||(pf.off||[]).includes(snooze.n)||wasLogged(snooze.day,snooze.n))localStorage.removeItem('psnooze');
   else if(snooze.at<=now&&prayAlert(snooze.n,snooze.day,snooze.key)){localStorage.removeItem('psnooze');return;}
  }
  const source=ptSrc(cd,ctx,schedules);
  if(source.src==='none')return;
  for(let i=0;i<PN.length;i++){
   const name=PN[i],at=prayerEventAt(cd,source.t[i],tz),key='pn-release-'+prayerLocationKey(ctx)+'-'+cd+'-'+name;
   const oldKey='pn-'+[pf.city,...ctx.c.slice(0,2),tz,source.src].join(':')+'-'+cd+'-'+name;
   if((pf.off||[]).includes(name)||wasLogged(cd,name)||now<at||now-at>=6e5||LS(key)||LS(oldKey))continue;
   if(prayAlert(name,cd,prayerSnoozeKey(ctx,source,cd,i)))localStorage.setItem(key,'1');
   break;
  }
 }finally{checkingPrayer=false;}
}
setInterval(()=>checkPrayerReminder().catch(err=>console.error('Could not check prayer reminders',err)),5000);

const locName=p=>p.city.startsWith('r:')?regName(p.city.slice(2)):p.city==='GPS'?'Your location':p.city.startsWith('s:')?((p.saved||[]).find(x=>'s:'+x.id===p.city)||{}).name||'Saved location':p.city;
function chime(){const el=$('#snd');try{const A=new (window.AudioContext||window.webkitAudioContext)();A.resume().then(()=>{if(A.state!=='running'){el.textContent='Your browser blocked the sound.';return}[523,659,784].forEach((f,i)=>{const t=A.currentTime+i*.25,o=A.createOscillator(),g=A.createGain();o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.15,t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+.5);o.connect(g);g.connect(A.destination);o.start(t);o.stop(t+.6)});el.textContent='Soft chime sent to your speaker (it will be silent if your device is muted).'}).catch(()=>{el.textContent='Your browser blocked the sound.'})}catch(e){el.textContent='Sound is not available here.'}}
function prayAlert(name,day,key){const d=$('#dlg');if(d.open)return false;document.documentElement.dataset.theme='sage';d.innerHTML=`<div style="text-align:center"><h2>🌿 It's time for ${esc(name)} ♡</h2><p class="muted" id="snd"></p><div class="row" style="justify-content:center">${[5,10,15,30].map(m=>`<button class="ghost" data-sn="${m}">Snooze ${m} min</button>`).join('')}</div><label>Custom minutes<input type="number" id="cm" min="1" max="720"></label><div class="row" style="justify-content:center"><button class="ghost" data-sn="c">Snooze custom</button><button class="pri" data-sn="0">Dismiss</button></div></div>`;d.onclick=e=>{const b=e.target.closest('[data-sn]');if(!b)return;const m=b.dataset.sn==='c'?+$('#cm',d).value:+b.dataset.sn;if(b.dataset.sn==='c'&&(!Number.isFinite(m)||m<1||m>720))return;if(m>0)localStorage.setItem('psnooze',JSON.stringify({n:name,at:Date.now()+m*6e4,day,key}));d.close();d.onclick=null;toast(m>0?'Snoozed for '+m+' min':'Seen ♡');render()};d.showModal();chime();return true}

const dleft=d=>Math.round((new Date(d)-new Date(today()))/864e5),pcOf=a=>a.length?Math.round(a.filter(t=>t.status==='done').length/a.length*100):0;
const W=(c,t,b,x='')=>`<section class="w ${c}"><i class="bow" aria-hidden="true"></i>${t?`<h2>${t} <span class="orn" aria-hidden="true">♡</span></h2>`:''}${b}${x}</section>`;
function miniCal(m,sel,act,evf){const y=m.getFullYear(),mo=m.getMonth(),f=new Date(y,mo,1).getDay(),n=new Date(y,mo+1,0).getDate();let c='';for(let i=0;i<f;i++)c+='<i></i>';for(let d=1;d<=n;d++){const ds=fmt(new Date(y,mo,d));c+=`<button class="mc ${ds===today()?'tdy':''} ${ds===sel?'sel':''}" data-act="${act}" data-d="${ds}" aria-label="${ds}"><span>${d}</span>${evf(ds)}</button>`}return `<div class="mgrid">${['Su','Mo','Tu','We','Th','Fr','Sa'].map(x=>`<b>${x}</b>`).join('')}${c}</div>`}
function workHome(){const td=today(),F=focus(),pl=pend().filter(x=>x.plannedDate===td),dn=D.tasks.filter(x=>x.doneDate===td),pc=pcOf([...pl,...dn]),days=workCalendarEvents(),act=D.projects.filter(p=>p.status!=='done'),P=act.find(p=>projectPhases(p).length),m=workCal.m;
const dl=[...pend().filter(x=>x.deadline&&x.deadline>=td).map(x=>({d:x.deadline,t:x.title,id:x.id,a:'edit'})),...act.filter(p=>p.deadline&&p.deadline>=td).map(p=>({d:p.deadline,t:p.name,id:p.id,a:'projectopen'})),...D.projects.flatMap(p=>(p.milestones||[]).filter(x=>!x.d&&x.date>=td).map(x=>({d:x.date,t:'🚩 '+x.t,id:p.id,a:'projectopen'})))].sort((a,b)=>a.d<b.d?-1:1).slice(0,4);
const near=dl[0];
return `<div class="wk"><header class="w head"><div><h1>Work Space <span class="orn">♡</span></h1><p>${new Date().toLocaleDateString('en',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p></div><button class="pri" data-act="tasknew">+ Quick Add</button></header>
<section class="w note"><i class="seal" aria-hidden="true">✿</i><h2>Today's Work Note</h2><p class="hand">${esc(note())}</p><button class="ghost" data-act="note">Another Little Note ↻</button></section>
<div class="tags"><div class="tag t1"><b>${pl.length}</b><small>to do today</small></div><div class="tag t2"><b>${dn.length}</b><small>done today</small></div><div class="tag t3"><b>${pc}%</b><small>today's progress</small></div><div class="tag t4"><b id="clk">${new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'})}</b><small>${near?'next due in '+dleft(near.d)+'d':'no deadline ahead'}</small></div></div>
${W('cal paper','Calendar',`<div class="row"><button class="ghost" data-act="workmonth" data-n="-1" aria-label="Previous month">‹</button><b>${m.toLocaleDateString('en',{month:'long',year:'numeric'})}</b><button class="ghost" data-act="workmonth" data-n="1" aria-label="Next month">›</button></div>`+miniCal(m,workCal.sel,'hday',ds=>[...(days.get(ds)?.values()||[])].slice(0,2).map(e=>`<small class="ev ${e.completed?'ok':''}">${esc(e.title)}</small>`).join('')))}
${W('proj frame','Current Projects',act.slice(0,4).map(p=>{const ts=D.tasks.filter(t=>t.projectId===p.id&&t.status!=='cancelled'),pc=pcOf(ts),d=ts.filter(t=>t.status==='done').length;return `<button class="pr" data-act="projectopen" data-id="${esc(p.id)}"><b>📁 ${esc(p.name)}</b><span class="bar"><i style="width:${pc}%"></i></span><small>${pc}% · ${d} done · ${ts.length-d} open${p.deadline?' · DL '+esc(p.deadline):''}</small></button>`}).join('')||'<p class="muted">No active projects.</p>','<button class="pri" data-act="padd">+ New Project</button>')}
${W('focus notebook','My Focus Today',F.map((x,i)=>`<div class="fr" data-id="${esc(x.t.id)}"><button class="chk" data-act="tog" aria-label="Complete">${x.t.status==='done'?'✓':''}</button><button class="lnk" data-act="edit">${esc(x.t.title)}</button><span class="ud"><button data-act="fup" aria-label="Move up">▲</button><button data-act="fdn" aria-label="Move down">▼</button></span></div>`).join('')||'<p class="muted">Nothing urgent. Pick what feels right.</p>')}
${W('prog scallop',P?'Project Progress ('+esc(P.name)+')':'Project Progress',P?projectPhases(P).map(ph=>{const ts=D.tasks.filter(t=>t.projectId===P.id&&taskPhase(t)?.id===ph.id&&t.status!=='cancelled'),d=ts.filter(t=>t.status==='done').length;return `<button class="pr" data-act="projectopen" data-id="${esc(P.id)}"><b>${esc(ph.name)} <em>${d}/${ts.length}</em></b><span class="bar"><i style="width:${pcOf(ts)}%"></i></span></button>`}).join(''):act.slice(0,3).map(p=>`<p>${esc(p.name)}: ${pcOf(D.tasks.filter(t=>t.projectId===p.id))}%</p>`).join('')||'<p class="muted">Projects without phases show overall progress here.</p>')}
${W('agenda paper',"Today's Agenda",pl.map(t=>`<div class="fr" data-id="${esc(t.id)}"><button class="chk" data-act="tog" aria-label="Complete"></button><button class="lnk" data-act="edit">${esc(t.title)}</button></div>`).join('')||'<p class="muted">Nothing planned for today.</p>')}
${W('dead tagcard','Upcoming Deadlines',dl.map(x=>`<button class="pr dl" data-act="${x.a}" data-id="${esc(x.id)}"><b>${esc(x.t)}</b><span class="badge">${esc(x.d.slice(5))} · D-${dleft(x.d)}</span></button>`).join('')||'<p class="muted">No deadlines ahead.</p>')}
<nav class="w qa-row" aria-label="Quick actions"><span class="label">Quick Actions</span><button data-act="padd">📁<small>New Project</small></button><button data-act="tasknew">✓<small>Add Task</small></button><button data-act="tab" data-t="Calendar">🗓<small>Calendar</small></button><button data-act="tab" data-t="Timeline">📈<small>Timeline</small></button><button data-act="tab" data-t="Tasks">☰<small>Review Tasks</small></button></nav></div>`}
function personalHome(){const td=today(),pl=pend().filter(x=>x.plannedDate===td),mood=D.moods.find(x=>x.date===td),m=cal.m,rm=(D.reminders||[]).filter(r=>!r.fired&&r.at).sort((a,b)=>a.at<b.at?-1:1).slice(0,3),px=pnext(),wins=[...D.wins].sort((a,b)=>a.date<b.date?1:-1).slice(0,3);
return `<div class="pk"><section class="w greet"><h1>My Little Everyday <span class="orn">♡</span></h1><p>${new Date().toLocaleDateString('en',{weekday:'long',day:'numeric',month:'long'})}</p></section>
${W('cal paper','Calendar',`<div class="row"><button class="ghost" data-act="pmonth" data-n="-1" aria-label="Previous month">‹</button><b>${m.toLocaleDateString('en',{month:'long',year:'numeric'})}</b><button class="ghost" data-act="pmonth" data-n="1" aria-label="Next month">›</button></div>`+miniCal(m,cal.sel,'pday',ds=>{const e=events(ds);return e.length?`<span class="stk">${e.slice(0,2).map(x=>`<em class="${x.k}">${esc(x.i)}</em>`).join('')}${e.length>2?'<b>+'+(e.length-2)+'</b>':''}</span>`:''}))}
${W('plans notebook',"Today's Little Plans",pl.map(t=>`<div class="fr" data-id="${esc(t.id)}"><button class="chk" data-act="tog" aria-label="Complete"></button><button class="lnk" data-act="edit">${esc(t.title)}</button></div>`).join('')||'<p class="muted">A blank page. Lovely.</p>','<button class="ghost" data-act="tasknew" data-date="'+td+'">+ Add</button>')}
${W('rout scallop','Gentle Routines','<div class="ricons">'+D.routines.map(r=>{const dn=D.logs.some(l=>l.routineId===r.id&&l.date===td);return `<button class="ri ${dn?'on':''}" ${dn?'aria-pressed="true"':`data-act="done" data-id="${esc(r.id)}"`}><span>${esc(r.icon)}</span><small>${esc(r.name)}</small></button>`}).join('')+'<button class="ri" data-act="radd"><span>＋</span><small>Add</small></button></div>')}
${W('mood tagcard',"Today's Mood",`<div class="moods">${MOODS.map(([i,n])=>`<button class="${mood&&mood.mood===n?'on':''}" data-act="mood" data-m="${n}" aria-label="${n}">${i}</button>`).join('')}</div>`)}
${W('wins frame','My Little Wins',wins.map(w=>`<p>${esc(w.icon||'🎀')} ${esc(w.title)}</p>`).join('')||'<p class="muted">Your wins will live here.</p>','<button class="ghost" data-act="win" data-d="'+td+'">+ Add win</button>')}
${W('pray oval','Prayer Corner',`<button class="pr" data-act="tab" data-t="Prayer"><b>${esc(locName(pref()))}</b><small id="cd">${cdText()}</small><small class="muted">${px.src==='imported'?'Imported · user provided':px.src==='local'?'Local calculation · not official':'No internal schedule available'}</small></button>`)}
${W('rem tagcard','Upcoming Reminders',rm.map(r=>`<p>🔔 ${esc(r.title)} <small>${esc(r.at.replace('T',' '))}</small></p>`).join('')||'<p class="muted">No reminders set.</p>','<button class="ghost" data-act="tab" data-t="Settings">Manage</button>')}
<section class="w note"><i class="seal" aria-hidden="true">✿</i><h2>Daily Little Note</h2><button class="lnk hand" data-act="note">${esc(note())} ↻</button></section>
<nav class="w qa-row" aria-label="Quick actions"><span class="label">Quick Actions</span><button data-act="tasknew">✓<small>Task</small></button><button data-act="radd">🎀<small>Routine</small></button><button data-act="openlist" data-s="shop">☑️<small>Daily Lists</small></button><button data-act="openlist" data-s="wish">🎁<small>Dream List</small></button><button data-act="win" data-d="${td}">⭐<small>Little win</small></button></nav></div>`}
setInterval(()=>{const c=$('#clk');if(c)c.textContent=new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'})},1000);

let calMode='month';
const calToggle=()=>`<div class="seg row" role="group" aria-label="Calendar view"><button data-act="cmode" data-m="month" class="${calMode==='month'?'on':''}">Month</button><button data-act="cmode" data-m="year" class="${calMode==='year'?'on':''}">Year</button></div>`;
function calView(){return calToggle()+(calMode==='year'?yearView(false):calMonth()+rPanel())}
function workCalendar(){return calToggle()+(calMode==='year'?yearView(true):workCalMonth())}
function rPanel(){const ds=cal.sel,rs=D.routines.filter(r=>r.showCal!==false);if(!rs.length)return '';return `<div class="card"><h2>My Little Routines ♡</h2><p class="muted">Tap an icon to record it on ${esc(ds)}. Tap again to undo. Faded = a gentle suggestion.</p><div class="ricons">${rs.map(r=>{const dn=D.logs.some(l=>l.routineId===r.id&&l.date===ds),l=lastLog(r),sug=!dn&&(!l||addDays(l,r.every)<=ds);return `<button class="ri ${dn?'on':''}" style="${sug?'opacity:.6':''}" data-act="rtog" data-id="${esc(r.id)}" data-d="${ds}" aria-pressed="${dn}"><span>${esc(r.icon)}</span><small>${esc(r.name)}</small></button>`}).join('')}</div></div>`}
function yearView(isWork){const y=(isWork?workCal:cal).m.getFullYear(),wd=isWork?workCalendarEvents():null,has=ds=>isWork?wd.has(ds):events(ds).length>0,ok=ds=>isWork?[...(wd.get(ds)?.values()||[])].some(e=>e.completed):events(ds).some(e=>e.k==='done');
return `<div class="row year-head"><button class="ghost" data-act="cyear" data-n="-1">‹ ${y-1}</button><h2>${y}</h2><button class="ghost" data-act="cyear" data-n="1">${y+1} ›</button></div><div class="year-grid">${Array.from({length:12},(_,mo)=>{const f=new Date(y,mo,1).getDay(),n=new Date(y,mo+1,0).getDate();let c='';for(let i=0;i<f;i++)c+='<i></i>';for(let d=1;d<=n;d++){const ds=fmt(new Date(y,mo,d));c+=`<i class="yd ${has(ds)?'has':''} ${ok(ds)?'ok':''} ${ds===today()?'tdy':''}">${d}</i>`}return `<button class="ym" data-act="cpick" data-mo="${mo}"><b>${new Date(y,mo,1).toLocaleString('en',{month:'long'})}</b><div class="ymg">${c}</div></button>`}).join('')}</div><p class="muted">Tinted days have plans or deadlines; green days have something completed. Tap a month to open it.</p>`}

// Each of these public widget URLs was opened and its location title checked.
const SIHAT_CODES=Object.freeze({'r:9671':'9671','r:9601':'9601','r:9603':'9603','r:9202':'9202','r:7371':'7371','r:3171':'3171'});
const SIHAT_ORIGIN='https://sihat.kemenag.go.id';
const SIHAT_WIDGET=SIHAT_ORIGIN+'/widget/jadwal';
function sihatURL(input,city){
 if(!input)return '';
 try{
  const url=new URL(input),codes=url.searchParams.getAll('wilayah'),code=codes[0];
  if(url.origin!==SIHAT_ORIGIN||url.pathname!=='/widget/jadwal'||url.username||url.password||codes.length!==1||!/^\d{2,10}$/.test(code))return '';
  const verified=SIHAT_CODES[city];
  if(verified&&!code.startsWith(verified))return '';
  const choices=Object.values(SIHAT_CODES);
  if(city.startsWith('r:')&&!verified&&choices.some(known=>code.startsWith(known)))return '';
  return url.href;
 }catch{return '';}
}

const gpsScheduleKey=ctx=>ctx.p.city==='GPS'&&Number.isFinite(ctx.c[0])?ctx.c.join(','):'';
function scheduleBelongs(record,ctx){
 if(record.locKey!==ctx.p.city||Number(record.tz)!==ctx.tz)return false;
 if(ctx.p.city!=='GPS')return true;
 const key=gpsScheduleKey(ctx);
 return !!key&&(record.gpsKey?record.gpsKey===key:!ctx.p.gpsChanged);
}
const validPrayerTimes=times=>Array.isArray(times)&&times.length===PN.length&&times.every((h,i)=>Number.isFinite(h)&&h>=0&&h<24&&(!i||h>times[i-1]));
function ptSrc(d,ctx=pctx(),schedules=D.prayerSchedules||[]){
 const {c,tz}=ctx;
 const rec=schedules.filter(record=>scheduleBelongs(record,ctx)&&validPrayerTimes(record.rows?.[d])).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0))[0];
 if(rec)return {t:rec.rows[d],src:'imported',rec};
 if(tz&&validCoordinates(c[0],c[1])){
  const t=ptimes(d,c[0],c[1],tz);
  if(validPrayerTimes(t))return {t,src:'local'};
 }
 return {t:PN.map(()=>NaN),src:'none'};
}
function srcNote(d){
 const ctx=pctx(),x=ptSrc(d,ctx),own=[...new Set((D.prayerSchedules||[]).filter(r=>scheduleBelongs(r,ctx)).map(r=>r.month))].sort();
 const inventory=own.length?`<p class="muted">Imported months: ${esc(own.join(', '))}. <button class="ghost" data-act="pdelsched">Delete imported</button></p>`:'';
 if(x.src==='none')return '<p class="muted"><b>No prayer times available for this location and date.</b> Add local coordinates or import a CSV for this location.</p>'+inventory;
 if(x.src==='imported')return `<p class="muted"><b>Source: Imported Schedule — User Provided.</b> ${esc(x.rec.source)}${x.rec.ref?' ('+esc(x.rec.ref)+')':''}${x.rec.importedAt?' · imported '+esc(x.rec.importedAt.slice(0,10)):''}. Countdown and alarms use these times.</p>`+inventory;
 return '<p class="muted"><b>Source: Local Calculation — Not Official Kemenag Schedule.</b> Computed on this device using the current location.</p>'+inventory;
}
function sihatCard(){
 const pf=pref(),ctx=pctx(),code=pf.city.startsWith('r:')?pf.city.slice(2):null;
 const active=code&&REG.find(g=>g[0]===code),rp=pf.regProv??active?.[1]??'';
 const manual=sihatURL(pf.widgets?.[pf.city],pf.city),verified=SIHAT_CODES[pf.city];
 const official=manual||(verified?SIHAT_WIDGET+'?wilayah='+verified:'');
 const sourceLink=official?`<a data-sihat-live href="${esc(official)}" target="_blank" rel="noopener">Open official schedule for ${esc(locName(pf))} on SIHAT</a>`:'';
 // The public widget currently sends X-Frame-Options: SAMEORIGIN. Keep the
 // region-specific widget link usable from the planner's separate origin.
 const canEmbed=official&&navigator.onLine&&location.origin===SIHAT_ORIGIN;
 const frame=canEmbed?`<iframe src="${esc(official)}" title="Official prayer schedule for ${esc(locName(pf))} — Kemenag SIHAT" loading="lazy" referrerpolicy="no-referrer-when-downgrade" sandbox="allow-scripts allow-same-origin" style="width:100%;height:400px;border:0;display:block"></iframe>`:'';
 const status=official?(navigator.onLine?(canEmbed?'Official widget by Kemenag.':'SIHAT currently opens this widget on its own site. The link below goes straight to this location.'):'You are offline. The official widget cannot load.'):'Automatic mapping has not been verified for this location. Save the official widget link for this location once.';
 const regionRows=REG.filter(g=>g[1]===rp);
 return `<div class="card"><h2>Official Live Schedule — Kemenag SIHAT ♡</h2><div class="row"><select id="rprov" aria-label="Province"><option value="">Provinsi…</option>${PROV.map(([i,n])=>`<option value="${i}" ${i===rp?'selected':''}>${esc(n)}</option>`).join('')}</select><select id="rreg" aria-label="Kabupaten/Kota" ${rp?'':'disabled'}><option value="">Kabupaten/Kota…</option>${regionRows.map(([id,,name])=>`<option value="${id}" ${id===code?'selected':''}>${esc(name)}</option>`).join('')}</select></div>${active?`<p class="muted">Region: <b>${esc(active[2])}</b> · code ${esc(code)} · UTC+${ctx.tz}.</p><button class="ghost" data-act="rcoord">${validCoordinates(...ctx.c)?'Edit coordinates':'Add coordinates for local calculation'}</button>`:''}${frame}<p class="muted">${status} ${manual?'Saved link for this location. Check that the widget names the correct region. ':''}The online widget does not set Fleureve’s countdown, alarms, or offline times. ${sourceLink}</p><div class="row"><input id="wurl" aria-label="Official widget URL for this location" placeholder="https://sihat.kemenag.go.id/widget/jadwal?wilayah=…" value="${esc(manual)}"><button class="ghost" data-act="wsave">Save</button></div><a href="https://sihat.kemenag.go.id/widget" target="_blank" rel="noopener">Choose region on SIHAT ↗</a><div class="row"><button class="ghost" data-act="pimp">Import schedule (CSV)</button><button class="ghost" data-act="ptpl">CSV template</button></div></div>`;
}
function parsePrayerCSV(input){
 const lines=input.trim().replace(/^\uFEFF/,'').split(/\r?\n/);
 const columns=line=>line.split(/[,;\t]/).map(col=>col.trim());
 const expected=['date',...PN.map(name=>name.toLowerCase())];
 if(columns(lines[0]).map(col=>col.toLowerCase()).join(',')!==expected.join(','))throw 'Header must be Date,Subuh,Zuhur,Asar,Magrib,Isya.';
 const rows={};
 for(const [index,line] of lines.slice(1).entries()){
  if(!line.trim())continue;
  const [day,...fields]=columns(line),prefix='Row '+(index+2)+': ';
  if(!validDate(day))throw prefix+'invalid date (use YYYY-MM-DD).';
  if(rows[day])throw prefix+'duplicate date.';
  if(fields.length!==PN.length||fields.some(t=>!clockValue.test(t)))throw prefix+'use five times in HH:MM format.';
  const times=fields.map(t=>Number(t.slice(0,2))+Number(t.slice(3,5))/60);
  if(!validPrayerTimes(times))throw prefix+'prayer times must be in order.';
  rows[day]=times;
 }
 if(!Object.keys(rows).length)throw 'No valid schedule rows to import.';
 return rows;
}

function pimport(){
 const ctx=pctx(),{p,tz}=ctx,place=locName(p);
 const form=dlg('Import schedule for '+place,[['csv','CSV: Date,Subuh,Zuhur,Asar,Magrib,Isya (24h, YYYY-MM-DD)','area'],['source','Source name','text'],['ref','Source link or reference','text']],{},async v=>{
  if(!tz)throw 'Choose a location with a valid time zone first.';
  const rows=parsePrayerCSV(v.csv),days=Object.keys(rows).sort();
  const months={};for(const day of days)(months[day.slice(0,7)]??=[]).push(day);
  const existing=(await all('personal','prayerSchedules')).filter(r=>scheduleBelongs(r,ctx)&&Object.hasOwn(months,r.month));
  const replace=existing.length?'\nReplace existing months: '+[...new Set(existing.map(r=>r.month))].join(', ')+'.':'';
  const preview=days.slice(0,3).map(day=>day+' · '+rows[day].map(hm).join(' · ')).join('\n');
  if(!confirm(`Import ${days.length} day(s) for ${place} (UTC+${tz})?\n${days[0]} to ${days.at(-1)}\n${preview}${replace}\nSource label: Imported Schedule — User Provided.`))throw 'Import cancelled. Nothing was saved.';
  await changeRecords('personal',{prayerSchedules:null},({prayerSchedules},stores)=>{
   const current=prayerSchedules.filter(r=>scheduleBelongs(r,ctx)&&Object.hasOwn(months,r.month));
   if(current.length!==existing.length||current.some(r=>!existing.some(old=>old.id===r.id&&old.updatedAt===r.updatedAt)))throw 'A schedule changed. Open Import again to review it.';
   for(const [month,dates] of Object.entries(months)){
    const matches=current.filter(r=>r.month===month),old=matches[0];
    const record={...old,id:old?.id||'ps-'+uid(),locKey:p.city,locName:place,tz,month,rows:Object.fromEntries(dates.map(day=>[day,rows[day]])),
     source:v.source.trim()||'Unnamed source',ref:v.ref.trim(),importedAt:new Date().toISOString()};
    if(p.city==='GPS')record.gpsKey=gpsScheduleKey(ctx);
    stores.prayerSchedules.put(stamp(record));
    for(const duplicate of matches.slice(1))stores.prayerSchedules.delete(duplicate.id);
   }
  });
  toast('Schedule imported ♡');
 });
 const label=document.createElement('label');
 label.innerHTML='Choose a CSV file (optional)<input type="file" accept=".csv,text/csv">';
 $('[data-field=csv]',form).before(label);
 $('input',label).addEventListener('change',async e=>{
  const file=e.target.files?.[0];if(!file)return;
  if(file.size>1000000){toast('Choose a CSV file smaller than 1 MB.');return;}
  try{form.elements.namedItem('csv').value=await file.text();}catch{toast('Could not read the CSV file.');}
 });
}
function remAlert(r,space){const d=$('#dlg');d.innerHTML=`<div style="text-align:center"><h2>🔔 ${esc(r.title)}</h2><p class="muted">${esc(r.at.replace('T',' '))}</p><p class="muted" id="snd"></p><div class="row" style="justify-content:center">${[5,10,15,30].map(m=>`<button class="ghost" data-sn="${m}">Snooze ${m} min</button>`).join('')}</div><label>Custom minutes<input type="number" id="cm" min="1" max="1440"></label><div class="row" style="justify-content:center"><button class="ghost" data-sn="c">Snooze custom</button><button class="pri" data-sn="0">Dismiss</button></div></div>`;d.onclick=async e=>{const b=e.target.closest('[data-sn]');if(!b||b.disabled)return;const m=b.dataset.sn==='c'?+$('#cm',d).value:+b.dataset.sn;if(b.dataset.sn==='c'&&(!Number.isFinite(m)||m<1||m>1440))return;b.disabled=true;if(m>0)await rescheduleAlert(space,r,localTimestamp(new Date(Date.now()+m*6e4)));d.close();d.onclick=null;toast(m>0?'Snoozed '+m+' min':'Dismissed');render()};d.showModal();chime()}

const regName=c=>(REG.find(g=>g[0]===c)||[0,0,'Unknown region'])[2];
const regTz=c=>{const p=c.slice(0,2);return ['51','52','53','63','64','65'].includes(p)||/^7[1-6]$/.test(p)?8:(['81','82'].includes(p)||/^9[1-9]$/.test(p))?9:7};
document.addEventListener('change',async e=>{
 if(sp!=='personal')return;
 const field=e.target;
 if(field.id==='rprov'){
  await updatePrayerPrefs({regProv:field.value});await render();
 }else if(field.id==='rreg'){
  const region=REG.find(([id,province])=>id===field.value&&province===$('#rprov').value);
  if(region){await updatePrayerPrefs({city:'r:'+region[0],regProv:region[1]});toast('Region set: '+region[2]);await render();}
 }
});
for(const state of ['online','offline'])window.addEventListener(state,()=>{if(sp==='personal'&&tab==='Prayer')render()});

const ZN={7:['Asia/Jakarta','+0700','WIB'],8:['Asia/Makassar','+0800','WITA'],9:['Asia/Jayapura','+0900','WIT']};
function icsDlg(){const dates=[];for(const t of D.tasks.filter(t=>t.status!=='done'&&t.status!=='cancelled'))[['plannedDate','planned'],['startDate','start'],['deadline','deadline']].forEach(([k,l])=>t[k]&&dates.push({id:t.id+k,t:t.title+' ('+l+')',d:t[k]}));(D.projects||[]).forEach(p=>(p.milestones||[]).filter(m=>m.date&&!m.d).forEach((m,i)=>dates.push({id:p.id+'m'+i,t:'🚩 '+m.t+' — '+p.name,d:m.date})));
const rem=(D.reminders||[]).filter(r=>r.at&&!r.fired),pr=sp==='personal',d=$('#dlg');
d.innerHTML=`<form><h3>Export to device calendar (.ics)</h3><p class="muted">One-way file. Import it into your calendar app and confirm; alarms follow that app's rules. Later changes in Fleureve do not update events you already imported, and Fleureve's snooze does not exist there.</p><h4>Dates</h4>${dates.map(x=>`<label class="sub"><input type="checkbox" style="width:auto" name="d" value="${esc(x.id)}"> ${esc(x.d)} · ${esc(x.t)}</label>`).join('')||'<p class="muted">No dated items.</p>'}<h4>Reminders (with alarm)</h4>${rem.map(x=>`<label class="sub"><input type="checkbox" style="width:auto" name="r" value="${esc(x.id)}"> ${esc(x.at.replace('T',' '))} · ${esc(x.title)}</label>`).join('')||'<p class="muted">No reminders.</p>'}${pr?`<h4>Prayer times (${esc(locName(pref()))})</h4><label>Days from today<select name="days"><option>0</option><option>7</option><option>14</option><option>30</option></select></label>${PN.map(n=>`<label class="sub"><input type="checkbox" style="width:auto" name="p" value="${n}" checked> ${n}</label>`).join('')}<label>Alarm<select name="al"><option value="-1">none</option><option value="0">at the time</option><option value="5">5 min before</option><option value="10">10 min before</option></select></label><p class="muted">Times use the source shown in Prayer Corner (not official unless imported/verified by you).</p>`:''}<div class="row"><button class="pri">Download .ics</button><button type="button" class="ghost" id="dx">Cancel</button></div></form>`;
$('#dx').onclick=()=>d.close();$('form',d).onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),z=n=>String(n).padStart(2,'0'),st=new Date().toISOString().replace(/[-:]|\.\d+/g,''),ev=[],tx=x=>String(x).replace(/[,;\\\r\n]/g,' '),seen=new Set(),add=(u,b)=>{if(!seen.has(u)){seen.add(u);ev.push(`BEGIN:VEVENT\r\nUID:${u}@fleureve\r\nDTSTAMP:${st}\r\n${b}END:VEVENT\r\n`)}};
for(const id of f.getAll('d')){const x=dates.find(y=>y.id===id);add(id,`DTSTART;VALUE=DATE:${x.d.replace(/-/g,'')}\r\nSUMMARY:${tx(x.t)}\r\n`)}
for(const id of f.getAll('r')){const x=rem.find(y=>y.id===id);add('rem-'+id,`DTSTART:${x.at.replace(/[-:]/g,'')}00\r\nDURATION:PT15M\r\nSUMMARY:${tx(x.title)}\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:${tx(x.title)}\r\nTRIGGER:PT0S\r\nEND:VALARM\r\n`)}
let tzb='',requestedPrayer=false;
if(pr&&f.getAll('p').length&&[7,14,30].includes(Number(f.get('days')))){
 requestedPrayer=true;
 const ctx=pctx(),{tz,p,cd}=ctx,chosen=new Set(f.getAll('p')),al=Number(f.get('al'));
 const zone=ZN[tz];
 if(zone){
  const eventsBefore=ev.length;
  for(let i=0;i<Number(f.get('days'));i++){
   const day=addDays(cd,i),times=ptSrc(day,ctx).t;
   PN.forEach((n,k)=>{
    if(!chosen.has(n)||!Number.isFinite(times[k]))return;
    const m=Math.round(times[k]*60),trigger=al===0?'PT0S':'-PT'+al+'M';
    add('pray-'+p.city+'-'+day+'-'+n,`DTSTART;TZID=${zone[0]}:${day.replace(/-/g,'')}T${z(Math.floor(m/60))}${z(m%60)}00\r\nDURATION:PT10M\r\nSUMMARY:${n} (${tx(locName(p))})\r\n${[0,5,10].includes(al)?`BEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:${n}\r\nTRIGGER:${trigger}\r\nEND:VALARM\r\n`:''}`);
   });
  }
  if(ev.length>eventsBefore)tzb=`BEGIN:VTIMEZONE\r\nTZID:${zone[0]}\r\nBEGIN:STANDARD\r\nDTSTART:19700101T000000\r\nTZOFFSETFROM:${zone[1]}\r\nTZOFFSETTO:${zone[1]}\r\nTZNAME:${zone[2]}\r\nEND:STANDARD\r\nEND:VTIMEZONE\r\n`;
 }
}
if(requestedPrayer&&!tzb)toast('No prayer times available in this range.');
if(!ev.length){if(!requestedPrayer)toast('Select something to export');return}dl(`fleureve-${sp}-export.ics`,'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Fleureve Planner//EN\r\nCALSCALE:GREGORIAN\r\n'+tzb+ev.join('')+'END:VCALENDAR\r\n','text/calendar');d.close()};d.showModal()}
