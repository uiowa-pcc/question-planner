const STORAGE_KEY = "uiowaCareerValuesProfile_v1";

const GOALS = [
  { id:"day", title:"Understand the day-to-day", desc:"What the work actually looks and feels like" },
  { id:"fit", title:"Decide whether this could fit me", desc:"What people tend to enjoy, dislike, or find challenging" },
  { id:"path", title:"Learn how people get into this work", desc:"Education, experiences, decisions, and career paths" },
  { id:"skills", title:"Figure out what I should build", desc:"Skills, experiences, courses, or preparation that matter" },
  { id:"workplace", title:"Understand the workplace", desc:"Culture, supervision, collaboration, pace, and expectations" },
  { id:"search", title:"Prepare for an internship or job search", desc:"How people find opportunities and become strong candidates" },
  { id:"future", title:"See where this path can lead", desc:"Advancement, related roles, and changes in the field" },
  { id:"connections", title:"Learn what to do next", desc:"Resources, people, or experiences that could help me keep exploring" }
];

const INTERVIEW_GOALS = [
  { id:"success", title:"Understand what success looks like", desc:"Priorities, expectations, and what strong performance looks like" },
  { id:"day", title:"Understand the day-to-day", desc:"Responsibilities, priorities, and how the role actually spends its time" },
  { id:"team", title:"Learn about the team and manager", desc:"Collaboration, communication, supervision, and support" },
  { id:"workplace", title:"Understand the workplace", desc:"Culture, pace, decision-making, and how people work together" },
  { id:"growth", title:"Learn about training and growth", desc:"Onboarding, feedback, skill development, and future opportunities" },
  { id:"roleclarity", title:"Clarify something about the role", desc:"Go beyond the posting or something mentioned during the interview" },
  { id:"fit", title:"Evaluate whether the opportunity fits me", desc:"Learn what the experience is really like without asking generic culture questions" },
  { id:"nextsteps", title:"Understand what happens next", desc:"Hiring timeline, next steps, and anything else they need from you" }
];

const DEFAULT_VALUES = [
  "Work-life balance",
  "Flexible schedule",
  "Helping other people",
  "A sense of purpose",
  "Working independently",
  "Working as part of a team",
  "Creativity",
  "Solving hard problems",
  "Learning and growth",
  "Supportive supervision",
  "Mental health and well-being",
  "Compensation and benefits"
];

const state = {
  step:1,
  experience:"",
  otherExperience:"",
  goals:[],
  customGoal:"",
  personRole:"",
  organization:"",
  interest:"",
  knownInfo:"",
  importedProfile:null,
  useImported:true,
  values:[],
  customValues:[],
  questions:[]
};

function esc(s=""){
  return String(s).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
}

function showStep(n){
  state.step=n;
  document.querySelectorAll(".step").forEach(s=>s.classList.toggle("active",+s.dataset.step===n));
  const names=["","Your experience","What you want to learn","Add context","Your priorities","Your question plan"];
  document.getElementById("progressLabel").textContent=`Step ${n} of 5`;
  document.getElementById("progressName").textContent=names[n];
  document.getElementById("progressBar").style.width=`${n*20}%`;
  window.scrollTo({top:0,behavior:"smooth"});
}

document.querySelectorAll("[data-back]").forEach(b=>b.addEventListener("click",()=>showStep(+b.dataset.back)));

function experienceLabel(){
  const labels={
    info:"informational interview",
    shadow:"job shadow or site visit",
    professional:"career conversation",
    internship:"internship conversation",
    interview:"job or internship interview",
    other:state.otherExperience.trim()||"career experience"
  };
  return labels[state.experience]||"career experience";
}

function rolePhrase(){
  return state.personRole.trim() ? ` as a ${state.personRole.trim()}` : "";
}
function orgPhrase(){
  return state.organization.trim() ? ` at ${state.organization.trim()}` : "";
}
function roleOrg(){
  const role=state.personRole.trim();
  const org=state.organization.trim();
  if(role&&org) return `${role} at ${org}`;
  return role||org||"this work";
}

// STEP 1
const expButtons=[...document.querySelectorAll("[data-experience]")];
expButtons.forEach(btn=>btn.addEventListener("click",()=>{
  state.experience=btn.dataset.experience;
  expButtons.forEach(b=>b.classList.toggle("selected",b===btn));
  document.getElementById("otherExperienceWrap").classList.toggle("hidden",state.experience!=="other");
  document.getElementById("toStep2").disabled=false;
}));
document.getElementById("otherExperience").addEventListener("input",e=>state.otherExperience=e.target.value);
document.getElementById("toStep2").addEventListener("click",()=>{renderGoals();showStep(2)});

// STEP 2
function renderGoals(){
  const wrap=document.getElementById("goalChoices");
  const goals=state.experience==="interview"?INTERVIEW_GOALS:GOALS;
  state.goals=state.goals.filter(id=>goals.some(g=>g.id===id));
  document.querySelector('[data-step="2"] h2').textContent=state.experience==="interview"?"What do you want your questions to help you learn?":"What would make this experience useful?";
  document.querySelector('[data-step="2"] > .panel > p').innerHTML=state.experience==="interview"?"Choose up to <strong>3 goals</strong>. Your question plan will focus on what you still need to learn before deciding whether the opportunity fits.":"Choose up to <strong>3 goals</strong>. Your questions will be built around these.";
  document.getElementById("customGoal").placeholder=state.experience==="interview"?"Example: I want to understand how much independence a new person has after training.":"Example: I want to understand how much of the job is direct client work versus documentation.";
  wrap.innerHTML=goals.map(g=>`<button type="button" class="select-card ${state.goals.includes(g.id)?"selected":""}" data-goal="${g.id}"><strong>${esc(g.title)}</strong><span>${esc(g.desc)}</span></button>`).join("");
  wrap.querySelectorAll("[data-goal]").forEach(btn=>btn.addEventListener("click",()=>{
    const id=btn.dataset.goal;
    if(state.goals.includes(id)) state.goals=state.goals.filter(x=>x!==id);
    else if(state.goals.length<3) state.goals.push(id);
    btn.classList.toggle("selected",state.goals.includes(id));
    document.getElementById("goalWarn").classList.add("hidden");
  }));
}
document.getElementById("customGoal").addEventListener("input",e=>state.customGoal=e.target.value);
document.getElementById("toStep3").addEventListener("click",()=>{
  if(!state.goals.length && !state.customGoal.trim()){
    document.getElementById("goalWarn").classList.remove("hidden");
    return;
  }
  const interview=state.experience==="interview";
  document.querySelector('[data-step="3"] h2').textContent=interview?"What do you already know about the opportunity?":"Who are you talking with?";
  document.querySelector('[data-step="3"] > .panel > p').textContent=interview?"Use the posting and what you have already learned in the interview so your questions add something new.":"A little context helps turn general questions into questions that fit this person and experience.";
  document.querySelector('label[for="personRole"] strong').textContent=interview?"Role you're interviewing for":"Their role or connection";
  document.getElementById("personRole").placeholder=interview?"Example: Academic Advisor, Marketing Intern":"Example: school counselor, former intern, HR specialist";
  document.querySelector('label[for="interest"] strong').textContent=interview?"What do you still want to understand?":"What are you especially curious about?";
  document.getElementById("interest").placeholder=interview?"Example: I want to understand how priorities are set when several projects are moving at once.":"Example: I am interested in pediatric work, but I am unsure how emotionally demanding the day-to-day work feels.";
  document.querySelector('label[for="knownInfo"] strong').textContent=interview?"What has already been answered?":"What do you already know?";
  document.getElementById("knownInfo").placeholder=interview?"Example: They already explained the hybrid schedule and basic responsibilities, so I do not need to ask about those again.":"Example: I already know the role requires a master's degree, so I do not need to ask about basic education requirements.";
  showStep(3);
});

// STEP 3
["personRole","organization","interest","knownInfo"].forEach(id=>document.getElementById(id).addEventListener("input",e=>state[id]=e.target.value));
document.getElementById("toStep4").addEventListener("click",()=>{
  loadImportedValues();
  renderValues();
  showStep(4);
});

function loadImportedValues(){
  if(state.importedProfile!==null) return;
  try{
    const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
    if(parsed && Array.isArray(parsed.priorities) && parsed.priorities.length){
      state.importedProfile=parsed;
      const recommended=(parsed.strongest?.length?parsed.strongest:parsed.priorities).slice(0,4);
      state.values=[...recommended];
    }else state.importedProfile=false;
  }catch(e){ state.importedProfile=false; }
}

function importedValues(){
  if(!state.importedProfile || !state.useImported) return [];
  const p=state.importedProfile;
  const ordered=[...(p.strongest||[]),...(p.mustHave||[]),...(p.priorities||[]),...(p.preferences||[])];
  return [...new Set(ordered)].slice(0,10);
}

function valueMeaning(value){
  const p=state.importedProfile;
  if(!p) return "";
  const chunks=[];
  const selected=p.meanings?.[value];
  if(Array.isArray(selected)) chunks.push(...selected);
  else if(typeof selected==="string" && selected.trim()) chunks.push(selected.trim());
  const other=p.meaningOther?.[value];
  if(typeof other==="string" && other.trim()) chunks.push(other.trim());
  return chunks.filter(Boolean).join("; ");
}

function renderValues(){
  const box=document.getElementById("savedValuesBox");
  if(state.importedProfile && state.useImported){
    box.classList.remove("hidden");
    const p=state.importedProfile;
    const names=(p.strongest?.length?p.strongest:p.priorities||[]).slice(0,4);
    document.getElementById("savedValuesSummary").textContent=names.length?`Your strongest saved priorities include ${names.join(", ")}. Choose the ones you want to investigate in this experience.`:"Choose any saved values you want to investigate.";
    document.getElementById("valuesIntro").textContent="Your saved values are included below. Choose the ones you want to learn more about in this experience, or add another work factor.";
  }else{
    box.classList.add("hidden");
    document.getElementById("valuesIntro").textContent="Choose any values or work factors you want to learn more about. This step is optional.";
  }

  const items=[...importedValues(),...DEFAULT_VALUES,...state.customValues];
  const unique=[...new Set(items)];
  const wrap=document.getElementById("valueChoices");
  wrap.innerHTML=unique.map(v=>{
    const imported=importedValues().includes(v);
    const meaning=valueMeaning(v);
    return `<button type="button" class="select-card ${state.values.includes(v)?"selected":""} ${imported?"imported":""}" data-value="${esc(v)}"><strong>${esc(v)}</strong>${meaning?`<span>For you: ${esc(meaning)}</span>`:""}</button>`;
  }).join("");
  wrap.querySelectorAll("[data-value]").forEach(btn=>btn.addEventListener("click",()=>{
    const v=btn.dataset.value;
    if(state.values.includes(v)) state.values=state.values.filter(x=>x!==v);
    else if(state.values.length<5) state.values.push(v);
    btn.classList.toggle("selected",state.values.includes(v));
  }));
}

document.getElementById("clearImportedValues").addEventListener("click",()=>{
  const prior=importedValues();
  state.values=state.values.filter(v=>!prior.includes(v));
  state.useImported=false;
  renderValues();
});
document.getElementById("addCustomValue").addEventListener("click",()=>{
  const input=document.getElementById("customValue");
  const v=input.value.trim();
  if(!v) return;
  if(!state.customValues.includes(v)) state.customValues.push(v);
  if(state.values.length<5 && !state.values.includes(v)) state.values.push(v);
  input.value="";
  renderValues();
});
document.getElementById("toStep5").addEventListener("click",()=>{
  buildQuestions();
  // Show the results step before sizing editable question fields.
  // Hidden textareas report a scrollHeight of 0 in some browsers/embeds.
  showStep(5);
  renderQuestions();
  renderReminders();
  requestAnimationFrame(()=>{
    document.querySelectorAll(".question-text").forEach(autoGrow);
  });
});

function q(text,section,tag="Tailored",selected=true){
  return {id:`q_${Math.random().toString(36).slice(2,9)}`,text,section,tag,selected};
}

function goalQuestions(goal){
  const who=roleOrg();
  const org=state.organization.trim();
  const role=state.personRole.trim();
  const exp=state.experience;
  if(exp==="interview"){
    const interviewBank={
      success:[
        q(`What would you hope the person in this role accomplishes in the first few months?`,"Role expectations","Interview"),
        q(`What tends to distinguish someone who does especially well in this role?`,"Role expectations","Interview")
      ],
      day:[
        q(`How are priorities typically divided across a normal week in this role?`,"Day-to-day work","Interview"),
        q(`What part of the role tends to require the most judgment or problem-solving?`,"Day-to-day work","Interview")
      ],
      team:[
        q(`Who would I work with most closely, and how does the team typically communicate and coordinate work?`,"Team + manager","Interview"),
        q(`How does the manager typically provide direction and feedback to someone in this role?`,"Team + manager","Interview")
      ],
      workplace:[
        q(`When the team is especially busy, how are priorities and workload usually handled?`,"Workplace","Interview"),
        q(`Can you give me an example of how people on this team collaborate when a problem crosses roles or departments?`,"Workplace","Interview")
      ],
      growth:[
        q(`What does onboarding look like, and what support is available while someone is getting up to speed?`,"Growth + support","Interview"),
        q(`What opportunities are there to build new skills or take on additional responsibility over time?`,"Growth + support","Interview")
      ],
      roleclarity:[
        q(`What is something about this role that is important but hard to capture in the job posting?`,"Clarify the role","Interview"),
        q(`Based on what we have discussed today, is there an aspect of the role you think would be especially useful for me to understand more fully?`,"Clarify the role","Interview")
      ],
      fit:[
        q(`What do people on this team tend to find most rewarding about the work, and what tends to be the biggest adjustment?`,"Evaluate fit","Interview"),
        q(`What kinds of working styles tend to be most successful on this team?`,"Evaluate fit","Interview")
      ],
      nextsteps:[
        q(`What are the next steps in the hiring process, and what timeline should candidates expect?`,"Next steps","Interview"),
        q(`Is there anything else I can provide that would be helpful as you continue the process?`,"Next steps","Interview")
      ]
    };
    return interviewBank[goal]||[];
  }
  const bank={
    day: [
      q(`What does a typical day or week look like for you${rolePhrase()}?`,"Start with the work","PCC"),
      q(`What parts of ${who} take up more time than people might expect?`,"Dig deeper","Tailored"),
      q(`What kinds of problems or decisions come up most often in your work?`,"Dig deeper","PCC")
    ],
    fit: [
      q(`What do you find most satisfying about ${who}, and what tends to be most challenging?`,"Dig deeper","PCC"),
      q(`What do people sometimes misunderstand about this work before they experience it firsthand?`,"Dig deeper","Tailored")
    ],
    path: [
      q(`What experiences or decisions were most important in getting you to your current role?`,"Learn from their path","PCC"),
      q(`Looking back, is there anything you would have done differently while preparing for this field?`,"Learn from their path","PCC")
    ],
    skills: [
      q(`What skills matter most in ${role||"this kind of work"}, and how can a student tell whether they are building them?`,"Prepare yourself","PCC"),
      q(`What experiences would you recommend for a student who wants to become a stronger candidate for this kind of work?`,"Prepare yourself","PCC")
    ],
    workplace: [
      q(`How would you describe the way people work together${org?` at ${org}`:" in this workplace"}?`,"Understand the workplace","Tailored"),
      q(`What does good support or supervision look like here, especially for someone new?`,"Understand the workplace","Tailored")
    ],
    search: [
      q(`How did you find this opportunity, and what helped you stand out in the process?`,"Prepare yourself","PCC"),
      q(`What would you recommend a student pay attention to when looking for similar opportunities?`,"Prepare yourself","Tailored")
    ],
    future: [
      q(`What are some directions people can move after gaining experience in ${role||"this kind of role"}?`,"Look ahead","PCC"),
      q(`What changes are you seeing in this field that students entering it should know about?`,"Look ahead","PCC")
    ],
    connections: [
      q(`What is one next step you would recommend for someone who wants to keep exploring this field?`,"Wrap up","Tailored"),
      q(`Is there anyone else you would suggest I learn from, or another perspective I should seek out?`,"Wrap up","PCC")
    ]
  };
  const arr=bank[goal]||[];
  if(exp==="shadow" && goal==="day"){
    arr.unshift(q(`As I observe today, what should I pay attention to that might not be obvious from the outside?`,"Before or during the shadow","Shadow"));
  }
  if(exp==="internship" && goal==="search"){
    arr.push(q(`What was the interview or selection process like for this internship?`,"Prepare yourself","PCC"));
  }
  return arr;
}

function valueQuestion(value){
  const lower=value.toLowerCase();
  const meaning=valueMeaning(value);
  const specific=meaning ? ` For me, that includes ${meaning}.` : "";
  let text;

  if(state.experience==="interview"){
    const meaningLower=meaning.toLowerCase();
    if(lower.includes("flexible") || lower.includes("schedule")){
      if(/remote|hybrid|home/.test(meaningLower))
        text=`How does the team decide which work is best done in person versus remotely?`;
      else if(/start|end|appointment|responsibilit|hours/.test(meaningLower))
        text=`How much flexibility do team members typically have around start and end times or occasional schedule adjustments?`;
      else
        text=`How does flexibility typically work for someone in this role once they are fully trained?`;
    }
    else if(lower.includes("work-life") || lower.includes("family") || lower.includes("time off") || lower.includes("outside of work"))
      text=`What does a typical busy period look like for this team, and how do people usually manage workload during those times?`;
    else if(lower.includes("mental health") || lower.includes("well-being") || lower.includes("calm") || lower.includes("healthy and safe"))
      text=`What practices or supports help the team manage demanding periods and keep the workload sustainable?`;
    else if(lower.includes("independent"))
      text=`Once someone is trained, how much independence do they typically have in deciding how to approach their work?`;
    else if(lower.includes("team") || lower.includes("connected"))
      text=`How does this team typically collaborate, and what does good communication look like here?`;
    else if(lower.includes("helping") || lower.includes("purpose") || lower.includes("service"))
      text=`How does this role connect to the people or outcomes the organization is trying to serve?`;
    else if(lower.includes("creative"))
      text=`Where does someone in this role have room to bring new ideas or shape how the work gets done?`;
    else if(lower.includes("solving") || lower.includes("problem"))
      text=`What kinds of problems would you expect the person in this role to solve independently?`;
    else if(lower.includes("learning") || lower.includes("education") || lower.includes("training") || lower.includes("mentor"))
      text=`After onboarding, how do people on this team continue learning and developing their skills?`;
    else if(lower.includes("supervision") || lower.includes("manager") || lower.includes("direction") || lower.includes("feedback"))
      text=`How does the manager typically communicate expectations and give feedback?`;
    else if(lower.includes("money") || lower.includes("compensation") || lower.includes("benefit"))
      text=`Could you tell me more about the compensation and benefits structure for this role?`;
    else if(lower.includes("remote") || lower.includes("home"))
      text=`How does the team decide which work is best done in person versus remotely?`;
    else if(lower.includes("fast") || lower.includes("competitive") || lower.includes("routine"))
      text=`How predictable is the workload from week to week, and what tends to create the busiest periods?`;
    else if(lower.includes("leadership") || lower.includes("boss"))
      text=`What opportunities are there for someone in this role to take ownership or grow into greater responsibility?`;
    else if(lower.includes("outdoor") || lower.includes("active") || lower.includes("hands"))
      text=`How much of a typical week is spent doing hands-on or active work versus desk-based work?`;
    else if(lower.includes("travel") || lower.includes("relocation"))
      text=`How much travel is typical for this role, and how is it usually scheduled?`;
    else
      text=`One thing I am hoping to understand is how ${value.toLowerCase()} shows up in this role or on this team. Could you give me an example?`;
    return q(text,"Questions about your priorities","Values",true);
  }

  if(lower.includes("flexible") || lower.includes("schedule"))
    text=`How much flexibility do people typically have in when, where, or how they get their work done${orgPhrase()}?${specific}`;
  else if(lower.includes("work-life") || lower.includes("family") || lower.includes("time off") || lower.includes("outside of work"))
    text=`What does work-life balance look like in practice for people doing ${roleOrg()}?${specific}`;
  else if(lower.includes("mental health") || lower.includes("well-being") || lower.includes("calm") || lower.includes("healthy and safe"))
    text=`What parts of this work tend to be most draining, and what helps make the workload sustainable?${specific}`;
  else if(lower.includes("independent"))
    text=`How much of the work is done independently versus with other people?${specific}`;
  else if(lower.includes("team") || lower.includes("connected"))
    text=`Who do you work with most often, and what does collaboration actually look like day to day?${specific}`;
  else if(lower.includes("helping") || lower.includes("purpose") || lower.includes("service"))
    text=`Where do you see the impact of your work most clearly?${specific}`;
  else if(lower.includes("creative"))
    text=`Where do you get to be creative or make your own decisions in this work?${specific}`;
  else if(lower.includes("solving") || lower.includes("problem"))
    text=`What kinds of problems are you trusted to solve, and how much variety is there in those problems?${specific}`;
  else if(lower.includes("learning") || lower.includes("education") || lower.includes("training") || lower.includes("mentor"))
    text=`What opportunities do people have to keep learning, get feedback, or grow once they are in this role?${specific}`;
  else if(lower.includes("supervision") || lower.includes("manager") || lower.includes("direction") || lower.includes("feedback"))
    text=`How are expectations, feedback, and support typically handled for someone in this role?${specific}`;
  else if(lower.includes("money") || lower.includes("compensation") || lower.includes("benefit"))
    text=`What should someone entering this field understand about compensation, benefits, or how those change with experience?${specific}`;
  else if(lower.includes("remote") || lower.includes("home"))
    text=`How common is remote or hybrid work in this field, and what parts of the job affect that flexibility?${specific}`;
  else if(lower.includes("fast") || lower.includes("competitive") || lower.includes("routine"))
    text=`How would you describe the pace and predictability of the work from week to week?${specific}`;
  else if(lower.includes("leadership") || lower.includes("boss"))
    text=`What opportunities are there to take ownership or grow into leadership in this field?${specific}`;
  else if(lower.includes("outdoor") || lower.includes("active") || lower.includes("hands"))
    text=`How much of the work is active, hands-on, or away from a desk?${specific}`;
  else if(lower.includes("travel") || lower.includes("relocation"))
    text=`How much travel or geographic flexibility is typical in this kind of work?${specific}`;
  else
    text=`One thing that matters to me is ${value.toLowerCase()}. What does that look like in this role or workplace?${specific}`;

  return q(text,"Questions about your priorities","Values",true);
}

function buildQuestions(){
  let questions=[];
  state.goals.forEach(g=>questions.push(...goalQuestions(g)));

  if(state.customGoal.trim()){
    const clean=state.customGoal.trim().replace(/[.?]+$/,'');
    const text=state.experience==="interview"
      ? `I am hoping to understand ${clean.charAt(0).toLowerCase()+clean.slice(1)}. Could you tell me more about how that works in this role?`
      : `I am especially trying to understand ${clean}. What would you want someone in my position to know about that?`;
    questions.push(q(text,state.experience==="interview"?"Clarify what matters to you":"Dig deeper","Your goal",true));
  }

  if(state.interest.trim()){
    const clean=state.interest.trim().replace(/[.?]+$/,'');
    const text=state.experience==="interview"
      ? `One thing I would still like to understand is ${clean.charAt(0).toLowerCase()+clean.slice(1)}. Could you tell me more about that?`
      : `I am especially curious about ${clean.charAt(0).toLowerCase()+clean.slice(1)}. What has your experience been?`;
    questions.push(q(text,state.experience==="interview"?"Follow up on what you still need to know":"Questions based on what you're curious about","Your note",true));
  }

  if(state.knownInfo.trim()){
    const known=state.knownInfo.trim().replace(/[.?]+$/,'');
    const lower=known.toLowerCase();
    let follow;
    if(state.experience==="interview"){
      follow=`We have already covered ${known.charAt(0).toLowerCase()+known.slice(1)}. What is one aspect of the role or team that candidates often do not think to ask about?`;
    }else{
      follow=`I already know that ${known.charAt(0).toLowerCase()+known.slice(1)}. What is something important about this work that I would not learn from basic research?`;
    }
    if(state.experience!=="interview" && /degree|education|master|bachelor|license|credential|certif/.test(lower)){
      follow=`I already know that ${known.charAt(0).toLowerCase()+known.slice(1)}. Beyond the basic requirements, what preparation or experience tends to make the biggest difference?`;
    }else if(state.experience!=="interview" && /salary|pay|compensation|wage/.test(lower)){
      follow=`I already have some basic information about ${known.charAt(0).toLowerCase()+known.slice(1)}. What tends to affect compensation or advancement once someone is actually in the field?`;
    }else if(state.experience!=="interview" && /day|duties|responsibilit|task/.test(lower)){
      follow=`I already know that ${known.charAt(0).toLowerCase()+known.slice(1)}. What part of the day-to-day work is easiest to miss from a job description?`;
    }
    questions.push(q(follow,"Go beyond basic research","Your research",true));
  }

  state.values.slice(0,5).forEach(v=>questions.push(valueQuestion(v)));

  if(state.experience==="shadow"){
    questions.push(q(`After seeing part of the work firsthand, what should I ask you about that students often miss?`,"After observing","Shadow",true));
    questions.push(q(`What did I see today that is especially representative of the job — and what was unusual?`,"After observing","Shadow",true));
  }

  if(state.experience!=="interview" && !state.goals.includes("connections")){
    questions.push(q(`What is one thing you would recommend I do next if I want to keep learning about this field?`,"Wrap up","PCC",true));
  }
  if(state.experience==="interview" && !state.goals.includes("nextsteps")){
    questions.push(q(`What are the next steps in the hiring process, and what timeline should candidates expect?`,"Next steps","Interview",false));
  }

  // Remove near-duplicates while preserving order.
  const seen=new Set();
  state.questions=questions.filter(item=>{
    const key=item.text.toLowerCase().replace(/[^a-z0-9]+/g," ").slice(0,90);
    if(seen.has(key)) return false;
    seen.add(key); return true;
  });

  // Keep the initial plan focused. Interviews start with fewer selected questions; extras remain available as backups.
  const selectionLimit=state.experience==="interview"?6:8;
  let selectedCount=0;
  state.questions.forEach(item=>{
    if(!item.selected) return;
    selectedCount++;
    if(selectedCount>selectionLimit) item.selected=false;
  });
}

function renderQuestions(){
  const wrap=document.getElementById("questionSections");
  const sections=[...new Set(state.questions.map(x=>x.section))];
  wrap.innerHTML=sections.map(section=>{
    const qs=state.questions.filter(x=>x.section===section);
    return `<div class="question-section"><div class="section-head"><h3>${esc(section)}</h3><span>${qs.length} question${qs.length===1?"":"s"}</span></div>${qs.map(item=>questionCard(item)).join("")}</div>`;
  }).join("");
  bindQuestionEvents();

  const selected=state.questions.filter(x=>x.selected).length;
  document.getElementById("resultIntro").textContent=state.experience==="interview"
    ? `I selected ${selected} questions as a starting plan. Bring a few strong questions, listen for what gets answered during the interview, and skip anything that would repeat information you already received.`
    : `I selected ${selected} questions as a starting plan. Check or uncheck questions, and edit the wording so it sounds natural to you.`;
  const tip=document.getElementById("planTip");
  tip.innerHTML=state.experience==="interview"
    ? `<strong>For an employer interview:</strong> prepare about 4–6 questions, but expect to ask fewer. Prioritize questions that help you understand the role and team and that build naturally from the conversation.`
    : `<strong>For a 20–30 minute conversation:</strong> aim for about 6–8 questions, with a few backups. You may ask fewer if the conversation naturally goes deeper.`;
}

function questionCard(item){
  return `<div class="question-card ${item.selected?"selected":""}" data-id="${item.id}">
    <input type="checkbox" ${item.selected?"checked":""} aria-label="Include this question" />
    <textarea class="question-text" rows="1">${esc(item.text)}</textarea>
    <span class="source-tag">${esc(item.tag)}</span>
  </div>`;
}
function bindQuestionEvents(){
  document.querySelectorAll(".question-card").forEach(card=>{
    const item=state.questions.find(x=>x.id===card.dataset.id);
    const check=card.querySelector("input[type=checkbox]");
    const textArea=card.querySelector("textarea");
    check.addEventListener("change",()=>{item.selected=check.checked;card.classList.toggle("selected",item.selected)});
    textArea.addEventListener("input",()=>{item.text=textArea.value;autoGrow(textArea)});
    autoGrow(textArea);
  });
}
function autoGrow(el){
  el.style.height="auto";
  const measured=el.scrollHeight;
  el.style.height=`${Math.max(measured,36)}px`;
}

document.getElementById("addOwnQuestion").addEventListener("click",()=>{
  const input=document.getElementById("ownQuestion");
  const text=input.value.trim(); if(!text)return;
  state.questions.push(q(text,"Your own questions","You",true));
  input.value="";renderQuestions();
});

function renderReminders(){
  const items=[];
  if(state.experience==="interview"){
    items.push(["Listen before asking","Cross off questions the employer already answered during the interview. A good follow-up is stronger than repeating your list."]);
    items.push(["Go beyond the website","Avoid questions with easy answers in the posting or employer website. Ask about examples, expectations, team practices, or what the work is like in practice."]);
    items.push(["Use your questions to evaluate fit","Your questions are not only a chance to impress the employer. Use them to gather information you need to decide whether the role and workplace fit you."]);
  }else if(state.experience==="info" || state.experience==="professional" || state.experience==="internship"){
    items.push(["Keep the purpose clear","You are there to learn, not to turn the conversation into a job request."]);
    items.push(["Plan for the time you requested","For an informational interview, 20–30 minutes is a useful target unless the person offers more time."]);
    items.push(["Follow up","Send a brief thank-you after the conversation and note any next steps or new questions."]);
  }else if(state.experience==="shadow"){
    items.push(["Observe first","Some of your best questions will come from noticing what people actually do, use, and talk about."]);
    items.push(["Ask at a good time","Save longer questions for pauses or a planned debrief if asking during the work would interrupt someone."]);
    items.push(["Reflect afterward","Write down what surprised you, what fit, what did not, and what you still want to learn."]);
  }else{
    items.push(["Use questions as a guide","Do not worry about getting through the entire list."]);
    items.push(["Listen for follow-ups","A specific follow-up is often more useful than moving to the next prepared question."]);
    items.push(["Reflect afterward","Capture what you learned and any new questions while the experience is fresh."]);
  }
  document.getElementById("reminders").innerHTML=items.map(([h,b])=>`<div class="reminder"><strong>${esc(h)}</strong><span>${esc(b)}</span></div>`).join("");
}

function copyText(text){
  if(navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();return Promise.resolve();
}
function planText(selectedOnly){
  const qs=state.questions.filter(x=>!selectedOnly||x.selected);
  const grouped=[];
  [...new Set(qs.map(x=>x.section))].forEach(section=>{
    grouped.push(section.toUpperCase());
    qs.filter(x=>x.section===section).forEach(x=>grouped.push(`• ${x.text.trim()}`));
    grouped.push("");
  });
  return `QUESTION PLAN — ${experienceLabel().toUpperCase()}\n\n${grouped.join("\n").trim()}`;
}
function handleCopy(selectedOnly){
  const text=planText(selectedOnly);
  if(!text.trim()) return;
  copyText(text).then(()=>{
    const status=document.getElementById("copyStatus");
    status.textContent=selectedOnly?"Selected questions copied.":"All questions copied.";
    setTimeout(()=>status.textContent="",1800);
  });
}
document.getElementById("copySelected").addEventListener("click",()=>handleCopy(true));
document.getElementById("copyAll").addEventListener("click",()=>handleCopy(false));
document.getElementById("editPlan").addEventListener("click",()=>showStep(4));
document.getElementById("restart").addEventListener("click",()=>location.reload());
