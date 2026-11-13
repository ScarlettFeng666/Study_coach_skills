/* Behavioral tests for the actual offline app script, not a browser/layout test.
 * No dependencies. The source is read without modifying the template; one
 * in-memory hook exposes its lexical functions immediately before final render.
 * Run: node qa/test_app.cjs [optional-template-path]
 */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const templatePath = process.argv[2] || path.join(__dirname, '..', 'exam-study-coach-en', 'assets', 'study-template.html');
const html = fs.readFileSync(templatePath, 'utf8');
const opening = '<script>\n';
const scriptStart = html.indexOf(opening);
const scriptEnd = html.indexOf('</script>', scriptStart + opening.length);
assert(scriptStart >= 0 && scriptEnd > scriptStart, 'actual executable script must be present');
let script = html.slice(scriptStart + opening.length, scriptEnd);
const finalRender = script.lastIndexOf('render();timerId=setInterval(updateTimer,1000);');
assert(finalRender >= 0, 'test hook needs the final render/interval anchor');
const hook = `globalThis.__APP__ = {
  pack, qmap, fp, storageKey, practiceIds, mockIds,
  state:()=>state, replaceState:value=>{state=value;},
  validatePack, validateProgress, scoreChoice, topicStats, mistakeMap,
  render, renderPractice, renderMock, renderFive, selfGrade, setPracticeFilter,
  startMock, activeMock, submitMock, mockScore, updateTimer, save,
  backup, mergeProgress, importFile, fiveMarkdown, learningReport, reportJSON
};\n`;
script = script.slice(0, finalRender) + hook + script.slice(finalRender);

class FakeNode {
  constructor(tag) {
    this.tagName = tag.toUpperCase(); this.children = []; this.parentNode = null;
    this.events = new Map(); this.style = {}; this.attributes = {}; this.className = '';
    this._text = ''; this.id = ''; this.disabled = false; this.hidden = false;
    this.value = ''; this.checked = false;
    const write = values => { this.className = [...values].join(' '); };
    const values = () => new Set(this.className.split(/\s+/).filter(Boolean));
    this.classList = {
      add: (...items) => { const set = values(); items.forEach(x => set.add(x)); write(set); },
      remove: (...items) => { const set = values(); items.forEach(x => set.delete(x)); write(set); },
      contains: item => values().has(item),
      toggle: (item, force) => { const set = values(); const yes = force === undefined ? !set.has(item) : force; if (yes) set.add(item); else set.delete(item); write(set); return yes; }
    };
  }
  set textContent(value) { this._text = String(value); this.children.forEach(x => {x.parentNode = null;}); this.children = []; }
  get textContent() { return this._text + this.children.map(x => x.textContent).join(''); }
  append(...children) {
    for (let child of children) {
      if (typeof child !== 'object') { const n = new FakeNode('#text'); n.textContent = child; child = n; }
      if (child.parentNode) child.remove(); child.parentNode = this; this.children.push(child);
    }
  }
  replaceChildren(...children) { this._text = ''; this.children.forEach(x => {x.parentNode = null;}); this.children = []; this.append(...children); }
  remove() { if (this.parentNode) { const p = this.parentNode; p.children = p.children.filter(x => x !== this); this.parentNode = null; } }
  addEventListener(type, fn) { if (!this.events.has(type)) this.events.set(type, []); this.events.get(type).push(fn); }
  setAttribute(name, value) { this.attributes[name] = String(value); if (name === 'id') this.id = String(value); }
  getAttribute(name) { return this.attributes[name]; }
  emit(type) { for (const fn of this.events.get(type) || []) fn({target:this, preventDefault(){}}); }
  click() { if (!this.disabled) this.emit('click'); }
  focus() {}
  matches(selector) {
    if (selector.startsWith('#')) return this.id === selector.slice(1);
    if (selector.startsWith('.')) return this.classList.contains(selector.slice(1));
    return this.tagName.toLowerCase() === selector.toLowerCase();
  }
  querySelectorAll(selector) {
    // Only basic selectors are used by assertions. The app's optional complex
    // badge update can safely see no match; its timer/state logic still runs.
    if (/[\s>+]/.test(selector)) return [];
    const result = []; const visit = node => { for (const child of node.children) { if (child.matches(selector)) result.push(child); visit(child); } }; visit(this); return result;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
}

const clone = value => JSON.parse(JSON.stringify(value));
const BASE_NOW = Date.UTC(2026, 9, 23, 1, 0, 0);
function fixture() {
  const source = {id:'source', label:'Test fixture', status:'general', detail:'Synthetic test data, no course claims.'};
  const topic = {id:'topic', title:'Fixture topic', summary:'Fixture rule.', pitfalls:['Fixture distinction.'], recall_prompt:'Recall the fixture rule.', quick_tip:'Check the fixture rule.', source_ids:['source']};
  const question = (id, type, pool) => ({id, topic_id:'topic', type, pool, prompt:id,
    options:type==='short'?[]:['A','B','C','D'], answer:type==='short'?[]:type==='multiple'?[0,2]:[1],
    explanation:'Fixture explanation.', option_explanations:type==='short'?[]:['A reason','B reason','C reason','D reason'],
    reference_answer:type==='short'?'Explain the rule.':'', rubric:type==='short'?['States the rule.']:[],
    difficulty:'medium', estimated_seconds:60, source_ids:['source'], origin:'generated'});
  return {schema_version:1,pack_id:'behavior-fixture',title:'Behavior Fixture',subtitle:'Pure VM test',language:'en',notice:'Synthetic fixture.',
    plan:{total_minutes:20,practice_minutes:8,mock_minutes:2,review_minutes:5,rationale:'Fixture budget.'},sources:[source],topics:[topic],questions:[
      question('single','single','practice'),question('multi','multiple','practice'),question('short','short','practice'),
      question('mock-single','single','mock'),question('mock-multi','multiple','mock'),question('mock-short','short','mock'),question('mock-blank-short','short','mock')
    ]};
}

function load(pack=fixture(), {storage=new Map(), now=BASE_NOW}={}) {
  let clock = now; const body = new FakeNode('body'); const elements = {};
  const ids = ['study-data','pack-title','main','pack-subtitle','pack-notice','storage-warning','metrics','main-nav','live-message','export-progress','import-progress','import-file','export-report','export-report-json','print-sheet','reset-progress'];
  ids.forEach(id => { const n = new FakeNode(id==='main'?'main':id==='study-data'?'script':'div'); n.id=id; elements[id]=n; body.append(n); });
  elements['study-data'].textContent=JSON.stringify(pack);
  const document = {body,hidden:false,title:'',createElement:tag=>new FakeNode(tag),getElementById:id=>id==='body'?body:(body.querySelector('#'+id)),addEventListener(){}};
  const window = {addEventListener(){},print(){}};
  class FakeDate extends Date { constructor(...args) { super(...(args.length?args:[clock])); } static now() { return clock; } }
  const confirms = [];
  const context = vm.createContext({document,window,Date:FakeDate,console,
    localStorage:{getItem:key=>storage.has(key)?storage.get(key):null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},
    confirm:message=>{confirms.push(message);return true;},setInterval:()=>1,clearInterval(){},setTimeout:()=>1,
    Blob:globalThis.Blob,URL:{createObjectURL:()=> 'blob:vm-test',revokeObjectURL(){}}});
  vm.runInContext(script,context,{filename:templatePath,timeout:10000});
  assert(context.__APP__, 'fixture must load successfully: '+elements.main.textContent);
  return {app:context.__APP__,document,body,storage,confirms,setNow:value=>{clock=value;},get now(){return clock;},message:()=>elements['live-message'].textContent};
}
function buttonIn(root,label) { const found=root.querySelectorAll('button').find(x=>x.textContent===label); assert(found,'button not found: '+label); return found; }
function main(h) { return h.document.getElementById('main'); }
function showPractice(h,qid) { const s=h.app.state(); s.practice.questionIds=[qid];s.practice.index=0;s.practice.filter='q:'+qid;s.view='practice';h.app.render(); }
function inputAnswer(h,qid,value) {
  const q=h.app.qmap.get(qid); const root=main(h);
  if(q.type==='short') {const input=root.querySelector('textarea');assert(input);input.value=value;input.emit('input');}
  else {const inputs=root.querySelectorAll('input');for(const index of value){assert(inputs[index]);inputs[index].checked=true;inputs[index].emit('change');}}
}
function answerPractice(h,qid,value,{repeat=false}={}) {
  showPractice(h,qid);
  if(repeat)buttonIn(main(h),'Try again').click();
  inputAnswer(h,qid,value);const submit=buttonIn(main(h),'Check answer');submit.click();return submit;
}
async function importBackup(h,value) {const text=JSON.stringify(value);await h.app.importFile({size:Buffer.byteLength(text),text:async()=>text});}

let passed=0,failed=0;
async function test(name,fn) {try{await fn();passed++;console.log('PASS '+name);}catch(error){failed++;console.error('FAIL '+name+'\n'+error.stack);}}

(async()=>{
  await test('multiple choice exact matching via real scoreChoice and actual option/submit callbacks',()=>{
    const h=load(),q=h.app.qmap.get('multi');
    assert.equal(h.app.scoreChoice(q,[2,0]),true);
    for(const answer of [[0],[2],[0,1,2],[1,3],[]]) assert.equal(h.app.scoreChoice(q,answer),false,JSON.stringify(answer));
    answerPractice(h,'multi',[0]);assert.equal(h.app.state().attempts[0].correct,false);
    answerPractice(h,'multi',[0,2],{repeat:true});assert.equal(h.app.state().attempts[1].correct,true);
    h.app.validateProgress(h.app.state());
  });
  await test('practice submitted guard prevents stale button double clicks and reload duplicates',()=>{
    const h=load();const submit=answerPractice(h,'single',[1]);const id=h.app.state().attempts[0].id;
    submit.emit('click');submit.emit('click');assert.equal(h.app.state().attempts.length,1);
    const reloaded=load(fixture(),{storage:h.storage,now:h.now+1000});assert.equal(reloaded.app.state().attempts.length,1);
    assert.equal(reloaded.app.state().attempts[0].id,id);reloaded.app.render();assert.equal(reloaded.app.state().attempts.length,1);
    assert(!main(reloaded).querySelectorAll('button').some(b=>b.textContent==='Check answer'));
  });
  await test('short answer stays pending, self-grades once, and is excluded from objective metrics',()=>{
    const h=load();answerPractice(h,'single',[1]);answerPractice(h,'short','My rule.');
    const a=h.app.state().attempts[1];assert.equal(a.correct,null);assert.equal(a.selfGraded,false);
    let stats=h.app.topicStats()[0];assert.equal(stats.attempts,1);assert.equal(stats.tested,1);assert.equal(stats.pending,1);assert.equal(stats.selfAttempts,0);
    const grade=buttonIn(main(h),'Self-assess: needs work');grade.click();grade.emit('click');
    assert.equal(a.correct,false);assert.equal(a.selfGraded,true);assert.equal(h.app.state().attempts.length,2);
    stats=h.app.topicStats()[0];assert.equal(stats.attempts,1);assert.equal(stats.misses,0);assert.equal(stats.selfAttempts,1);assert.equal(stats.selfMisses,1);assert.equal(stats.pending,0);
    h.app.validateProgress(h.app.state());
  });
  await test('wrong -> one correct -> two correct resolves; another wrong reopens and preserves history',()=>{
    const h=load();answerPractice(h,'multi',[0]);let m=h.app.mistakeMap().get('multi');assert.equal(m.streak,0);assert.equal(m.misses,1);
    answerPractice(h,'multi',[0,2],{repeat:true});m=h.app.mistakeMap().get('multi');assert.equal(m.streak,1);
    answerPractice(h,'multi',[0,2],{repeat:true});m=h.app.mistakeMap().get('multi');assert.equal(m.streak,2);assert.equal(m.misses,1);
    answerPractice(h,'multi',[0,1,2],{repeat:true});m=h.app.mistakeMap().get('multi');assert.equal(m.streak,0);assert.equal(m.misses,2);
    assert.equal(h.app.state().attempts.length,4);assert.equal(new Set(h.app.state().attempts.map(a=>a.id)).size,4);h.app.validateProgress(h.app.state());
  });
  await test('fixed mock deadline survives reload; expiry submits blanks and pending short exactly once',()=>{
    const h=load();h.app.startMock(4);const mock=h.app.activeMock();const deadline=mock.deadline;
    assert.equal(deadline,h.now+fixture().plan.mock_minutes*60000);
    mock.index=mock.questionIds.indexOf('mock-single');h.app.render();inputAnswer(h,'mock-single',[1]);
    mock.index=mock.questionIds.indexOf('mock-short');h.app.render();inputAnswer(h,'mock-short','A written response.');
    h.app.save();const r=load(fixture(),{storage:h.storage,now:h.now+30000});
    assert.equal(r.app.activeMock().deadline,deadline);assert.equal(r.app.activeMock().id,mock.id);assert.equal(r.app.state().view,'mock');
    assert.equal(r.document.getElementById('export-report').disabled,true);
    r.setNow(deadline+1000);r.app.updateTimer();const completed=r.app.state().mocks[0];
    assert.equal(completed.status,'submitted');assert.equal(completed.submittedAt,deadline);assert.equal(r.app.state().attempts.length,4);
    const records=new Map(r.app.state().attempts.map(a=>[a.qid,a]));
    assert.equal(records.get('mock-single').correct,true);
    assert.equal(records.get('mock-multi').correct,false);assert.deepEqual(clone(records.get('mock-multi').answer),[]);
    assert.equal(records.get('mock-short').correct,null);assert.equal(records.get('mock-short').selfGraded,false);
    assert.equal(records.get('mock-blank-short').correct,false);assert.equal(records.get('mock-blank-short').selfGraded,false);assert.equal(records.get('mock-blank-short').answer,'');
    const score=r.app.mockScore(completed);assert.equal(score.objective.length,2);assert.equal(score.short.length,2);
    r.app.updateTimer();r.app.submitMock(completed,true);assert.equal(r.app.state().attempts.length,4);r.app.validateProgress(r.app.state());
    const expiredReload=load(fixture(),{storage:h.storage,now:deadline+2000});assert.equal(expiredReload.app.state().attempts.length,4);
    assert.equal(expiredReload.app.state().mocks[0].deadline,deadline);
  });
  await test('backup/import same pack merges existing histories, is idempotent, and round-trips',async()=>{
    const origin=load();answerPractice(origin,'single',[1]);const incoming=clone(origin.app.backup());
    assert.equal(incoming.fingerprint,origin.app.fp);assert.equal(incoming.pack_id,fixture().pack_id);
    const current=load();answerPractice(current,'multi',[0]);const existingId=current.app.state().attempts[0].id;
    await importBackup(current,incoming);assert.equal(current.app.state().attempts.length,2);assert(current.app.state().attempts.some(a=>a.id===existingId));assert(current.message().includes('merged'));
    await importBackup(current,incoming);assert.equal(current.app.state().attempts.length,2);assert.equal(current.app.mistakeMap().get('multi').misses,1);
    current.app.validateProgress(current.app.state());const roundTrip=load();await importBackup(roundTrip,clone(current.app.backup()));
    assert.deepEqual(clone(roundTrip.app.state()),clone(current.app.state()));
  });
  await test('wrong fingerprint and fabricated score are rejected without changing existing progress',async()=>{
    const h=load();answerPractice(h,'multi',[0]);const valid=clone(h.app.backup()),before=clone(h.app.state());
    const fingerprint=clone(valid);fingerprint.fingerprint='wrong-content-version';await importBackup(h,fingerprint);
    assert(h.message().includes('Restore failed'));assert.deepEqual(clone(h.app.state()),before);
    const badScore=clone(valid);badScore.progress.attempts[0].correct=true;
    assert.throws(()=>h.app.validateProgress(badScore.progress),/score does not match the answer/);
    await importBackup(h,badScore);assert(h.message().includes('Restore failed'));assert.deepEqual(clone(h.app.state()),before);
    const unknown=clone(valid);unknown.progress.attempts[0].qid='unknown-question';
    assert.throws(()=>h.app.validateProgress(unknown.progress));
  });
  await test('learning reports include actual responses, expected answers, explanations, source status, and separate self-grading',async()=>{
    const pack=fixture();pack.sources[0]={id:'source',label:'Unverified fixture source',status:'unverified',detail:'Synthetic source: L4, physical PDF page 7; not a real attachment.'};
    const q=pack.questions.find(x=>x.id==='multi');q.prompt='REPORT-MULTI: select fixture values';q.options=['Alpha','Beta','Gamma','Delta'];q.option_explanations=['Alpha reason','Beta misconception','Gamma reason','Delta misconception'];q.explanation='Require both Alpha and Gamma, with no extras.';
    const short=pack.questions.find(x=>x.id==='short');short.prompt='REPORT-SHORT: explain fixture rule';short.reference_answer='Reference marker: explain the fixture condition.';short.rubric=['Rubric marker: name the required condition.'];
    const h=load(pack);answerPractice(h,'multi',[0]);answerPractice(h,'multi',[0,2],{repeat:true});answerPractice(h,'short','Student marker: I forgot the condition.');buttonIn(main(h),'Self-assess: needs work').click();
    const markdown=h.app.learningReport();
    for(const required of [pack.pack_id,h.app.fp,q.prompt,'Alpha','Beta','Gamma','Delta','A. Alpha; C. Gamma','Student answer: A. Alpha',q.explanation,...q.option_explanations,short.prompt,short.reference_answer,...short.rubric,'Student marker: I forgot the condition.',pack.sources[0].label,pack.sources[0].detail,'Unverified','student self-assessment; excluded from objective score']) assert(markdown.includes(required),'Markdown report missing: '+required);
    assert.equal(markdown.split('### multi · ').length-1,2,'both first and repeat attempts remain visible');
    const report=clone(h.app.reportJSON());assert.equal(report.format,'exam-study-report');assert.equal(report.fingerprint,h.app.fp);assert.equal(report.attempts.length,3);assert.equal(report.questions.length,2);
    const reportQuestions=new Map(report.questions.map(item=>[item.id,item]));
    assert.deepEqual(reportQuestions.get('multi').answer,[0,2]);assert.deepEqual(report.attempts.filter(a=>a.qid==='multi').map(a=>a.answer),[[0],[0,2]]);
    assert.deepEqual(reportQuestions.get('multi').source_ids,['source']);assert.equal(report.sources[0].status,'unverified');
    assert.equal(report.attempts.find(a=>a.qid==='short').selfGraded,true);assert.equal(report.topics[0].attempts,2);assert.equal(report.topics[0].selfAttempts,1);assert.equal(report.topics[0].misses,1);
    assert.equal(report.mistakes.find(item=>item.qid==='multi').resolved,false,'one correct redo does not resolve');
    const before=clone(h.app.state());await importBackup(h,report);assert(h.message().includes('Restore failed'));assert.deepEqual(clone(h.app.state()),before,'analysis report is not accepted as a progress backup');
  });
  await test('cram-only pack with zero questions and zero mock time loads, renders, and backs up',async()=>{
    const pack=fixture();pack.pack_id='cram-fixture';pack.questions=[];pack.plan={total_minutes:4,practice_minutes:0,mock_minutes:0,review_minutes:4,rationale:'Only quick review.'};
    const h=load(pack);assert.equal(h.app.state().view,'five');assert.equal(h.app.mockIds.length,0);assert.equal(h.app.practiceIds.length,0);
    const nav=h.document.getElementById('main-nav');assert.equal(buttonIn(nav,'01 Practice').disabled,true);assert.equal(buttonIn(nav,'03 Timed mock exam').disabled,true);
    assert(main(h).textContent.includes('Final 5 minutes'));assert(h.app.fiveMarkdown().includes('Fixture topic'));
    h.app.validateProgress(h.app.state());const target=load(pack);await importBackup(target,clone(h.app.backup()));assert.equal(target.app.state().attempts.length,0);assert.equal(target.app.state().view,'five');
  });
  console.log(`\n${passed} passed, ${failed} failed. Limited Node VM state/handler tests; no browser rendering, file-protocol, or layout verification.`);
  process.exitCode=failed?1:0;
})();
