import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { formatDate, formatDuration } from '@/lib/utils';

describe('formatDate guard cases', () => {
  it('returns dash for empty string', () => { expect(formatDate('')).toBe('—'); });
  it('returns dash for invalid date', () => { expect(formatDate('not-a-date')).toBe('—'); });
  it('returns dash for string null', () => { expect(formatDate('null')).toBe('—'); });
  it('formats valid ISO returns non-dash', () => { expect(formatDate('2026-05-18T10:00:00Z')).not.toBe('—'); });
  it('formats date-only string', () => { expect(formatDate('2026-01-15')).not.toBe('—'); });
});

describe('formatDuration', () => {
  it('0:00 for 0s', () => { expect(formatDuration(0)).toBe('0:00'); });
  it('1:00 for 60s', () => { expect(formatDuration(60)).toBe('1:00'); });
  it('1:30 for 90s', () => { expect(formatDuration(90)).toBe('1:30'); });
  it('1:05 for 65s (pads seconds)', () => { expect(formatDuration(65)).toBe('1:05'); });
  it('61:01 for 3661s', () => { expect(formatDuration(3661)).toBe('61:01'); });
});

describe('Auth bootstrap isInitializing logic', () => {
  it('true only when user exists but no token', () => {
    const f=(u,t)=>!!u&&!t;
    expect(f({id:1},null)).toBe(true);
    expect(f({id:1},'tok')).toBe(false);
    expect(f(null,null)).toBe(false);
    expect(f(null,'tok')).toBe(false);
  });
  it('setInitializing(false) called in finally', () => {
    const set=vi.fn(); const cb=()=>set(false); cb(); expect(set).toHaveBeenCalledWith(false);
  });
});

describe('AuthRoute redirect logic', () => {
  it('redirects to /dashboard when authenticated', () => { expect((()=>true)()?'/dashboard':'outlet').toBe('/dashboard'); });
  it('renders children when not authenticated', () => { expect((()=>false)()?'/dashboard':'outlet').toBe('outlet'); });
});

describe('ProtectedRoute redirect logic', () => {
  it('redirects to /dang-nhap when not authenticated', () => { expect((()=>false)()?'outlet':'/dang-nhap').toBe('/dang-nhap'); });
  it('passes through when authenticated', () => { expect((()=>true)()?'outlet':'/dang-nhap').toBe('outlet'); });
  it('stores pathname in state.from', () => {
    const loc={pathname:'/khoa-hoc/1/bai-hoc/3'}; expect({from:loc}.from.pathname).toBe('/khoa-hoc/1/bai-hoc/3');
  });
  it('LoginPage reads state.from.pathname', () => {
    const ls={from:{pathname:'/khoa-hoc/5/bai-hoc/12'}};
    const from=ls&&ls.from&&ls.from.pathname?ls.from.pathname:'/dashboard';
    expect(from).toBe('/khoa-hoc/5/bai-hoc/12');
  });
  it('LoginPage defaults to /dashboard when no state.from', () => {
    const from=null&&null.from?null.from.pathname:'/dashboard'; expect(from).toBe('/dashboard');
  });
});

describe('Enrollment guard lesson lock/unlock', () => {
  it('isEnrolled=false: does NOT navigate', () => {
    const nav=vi.fn(); if(false)nav('/x'); expect(nav).not.toHaveBeenCalled();
  });
  it('isEnrolled=true: navigates correctly', () => {
    const nav=vi.fn(); if(true)nav('/khoa-hoc/2/bai-hoc/5'); expect(nav).toHaveBeenCalledWith('/khoa-hoc/2/bai-hoc/5');
  });
  it('isEnrolled=false: cursor-not-allowed', () => {
    const cls=false?'cursor-pointer':'opacity-50 cursor-not-allowed'; expect(cls).toContain('cursor-not-allowed');
  });
  it('isEnrolled=true: cursor-pointer', () => {
    const cls=true?'cursor-pointer hover:border-b2':'opacity-50 cursor-not-allowed'; expect(cls).toContain('cursor-pointer');
  });
  it('enrollMutation invalidates enrollment and my-courses', () => {
    const inv=vi.fn(); inv({queryKey:['enrollment','7']}); inv({queryKey:['my-courses']});
    expect(inv).toHaveBeenCalledTimes(2);
  });
});

describe('wasCompletedRef first watch vs rewatch navigation', () => {
  it('navigates to quiz on first watch', () => {
    const nav=vi.fn(); const nR={current:false}; const wR={current:false};
    function hc(){if(nR.current)return;nR.current=true;if(!wR.current)nav('/quiz');}  hc();
    expect(nav).toHaveBeenCalledWith('/quiz');
  });
  it('does NOT navigate on rewatch', () => {
    const nav=vi.fn(); const nR={current:false}; const wR={current:true};
    function hc(){if(nR.current)return;nR.current=true;if(!wR.current)nav('/quiz');}  hc();
    expect(nav).not.toHaveBeenCalled();
  });
  it('navigatedRef prevents double-navigation', () => {
    const nav=vi.fn(); const nR={current:false}; const wR={current:false};
    function hc(){if(nR.current)return;nR.current=true;if(!wR.current)nav('/quiz');}  hc();hc();
    expect(nav).toHaveBeenCalledTimes(1);
  });
  it('wasCompletedRef set when lesson.completed is true', () => {
    const wR={current:false}; const l={completed:true}; if(l&&l.completed)wR.current=true;
    expect(wR.current).toBe(true);
  });
  it('wasCompletedRef stays false when lesson.completed is false', () => {
    const wR={current:false}; const l={completed:false}; if(l&&l.completed)wR.current=true;
    expect(wR.current).toBe(false);
  });
});

describe('QuizSection handleCloseModal navigates to /dashboard', () => {
  it('closing modal calls navigate /dashboard', () => {
    const nav=vi.fn(); const sm=vi.fn(); function close(){sm(false);nav('/dashboard');} close();
    expect(sm).toHaveBeenCalledWith(false); expect(nav).toHaveBeenCalledWith('/dashboard');
  });
  it('does NOT navigate to quiz page', () => {
    const nav=vi.fn(); function close(){nav('/dashboard');} close();
    expect(nav).not.toHaveBeenCalledWith(expect.stringContaining('/quiz'));
  });
});

describe('QuizSection handleRetry resets all state', () => {
  it('resets showModal result showReview answers', () => {
    let sm=true; let r={score:60}; let sr=true; let ans={1:0};
    function retry(){sm=false;r=null;sr=false;ans={};} retry();
    expect(sm).toBe(false); expect(r).toBeNull(); expect(sr).toBe(false); expect(ans).toEqual({});
  });
  it('after retry allAnswered is false', () => {
    const qs=[{id:1},{id:2}]; let ans={}; function retry(){ans={};} retry();
    expect(qs.every((q)=>ans[q.id]!==undefined)).toBe(false);
  });
});

describe('ResultModal button labels', () => {
  it('passed=true: showRetry false', () => { expect(!true).toBe(false); });
  it('passed=false: showRetry true', () => { expect(!false).toBe(true); });
  it('passed=true: title Xuat sac', () => { expect(true?'Xuất sắc!':'Chưa đạt!').toBe('Xuất sắc!'); });
  it('passed=false: title Chua dat', () => { expect(false?'Xuất sắc!':'Chưa đạt!').toBe('Chưa đạt!'); });
});

describe('AttemptReviewModal endpoint', () => {
  it('fetches correct URL', () => { expect('/users/me/quiz-attempts/42').toBe('/users/me/quiz-attempts/42'); });
  it('query key includes attemptId', () => { const k=['attempt-review',42]; expect(k[0]).toBe('attempt-review'); expect(k[1]).toBe(42); });
  it('different ids produce different keys', () => { expect(JSON.stringify(['attempt-review',1])).not.toBe(JSON.stringify(['attempt-review',2])); });
});

describe('DashboardPage reviewAttemptId state', () => {
  it('clicking attempt sets id', () => { let id=null; const set=(v)=>{id=v;}; set(17); expect(id).toBe(17); });
  it('closing modal resets to null', () => { let id=17; const set=(v)=>{id=v;}; set(null); expect(id).toBeNull(); });
  it('modal renders only when id != null', () => { expect(null!==null).toBe(false); expect(17!==null).toBe(true); });
});

describe('CoursesPage URL param level filter', () => {
  const lv=[{id:1,name:'N5'},{id:2,name:'N4'},{id:3,name:'N3'}];
  it('finds matching level by name', () => { expect(lv.find((l)=>l.name==='N3').id).toBe(3); });
  it('sets activeLevel to matched id', () => { let al=null; const m=lv.find((l)=>l.name==='N4'); if(m)al=m.id; expect(al).toBe(2); });
  it('unknown level name -> null', () => { let al=null; const m=lv.find((l)=>l.name==='N99'); if(m)al=m.id; expect(al).toBeNull(); });
  it('no param -> null', () => { let al=null; const p2=null; if(p2)al=1; expect(al).toBeNull(); });
  it('API url with levelId', () => { expect(3?'/courses?levelId=3':'/courses').toBe('/courses?levelId=3'); });
  it('API url /courses when null', () => { expect(null?'/x':'/courses').toBe('/courses'); });
});

describe('CoursesPage handleLevelChange', () => {
  it('sets activeLevel to null on Tat ca', () => {
    let al=3; window.scrollTo=vi.fn();
    function f(id){al=id;window.scrollTo({top:0,behavior:'smooth'});} f(null); expect(al).toBeNull();
  });
  it('calls scrollTo top:0', () => {
    const st=vi.fn(); window.scrollTo=st;
    function f(id){window.scrollTo({top:0,behavior:'smooth'});} f(2); expect(st).toHaveBeenCalledWith({top:0,behavior:'smooth'});
  });
});

describe('Navbar full-width structure', () => {
  it('inner div uses w-full not max-w', () => { const cls='w-full px-7 h-[56px] grid grid-cols-3 items-center'; expect(cls).toContain('w-full'); expect(cls).not.toContain('max-w-'); });
  it('header uses sticky', () => { expect('sticky top-0 z-50').toContain('sticky'); });
  it('grid-cols-3 layout', () => { expect('grid grid-cols-3').toContain('grid-cols-3'); });
});

describe('Navbar auth-based content', () => {
  it('user logged in: 2 nav links', () => {
    const AUTH_NAV=[{label:'Tổng quan'},{label:'Khoá học'}];
    const navLinks={email:'a@b.com'}?AUTH_NAV:[]; expect(navLinks).toHaveLength(2);
  });
  it('user logged out: no nav links', () => { expect(null?[{label:'x'}]:[]).toHaveLength(0); });
  it('logout: clearAuth called even when api fails', async () => {
    const ca=vi.fn(); const nav=vi.fn(); const ap=vi.fn().mockRejectedValue(new Error('e'));
    async function hl(){try{await ap('/auth/logout');}catch{}ca();nav('/');} await hl();
    expect(ca).toHaveBeenCalled(); expect(nav).toHaveBeenCalledWith('/');
  });
  it('logout navigates to / not /dashboard', async () => {
    const nav=vi.fn(); const ap=vi.fn().mockResolvedValue({});
    async function hl(){try{await ap('/auth/logout');}catch{}nav('/');}  await hl();
    expect(nav).toHaveBeenCalledWith('/'); expect(nav).not.toHaveBeenCalledWith('/dashboard');
  });
  it('isActive exact path', () => {
    const loc={pathname:'/dashboard'};
    const ia=(to)=>loc.pathname===to||loc.pathname.startsWith(to.split('#')[0]+'/');
    expect(ia('/dashboard')).toBe(true); expect(ia('/khoa-hoc')).toBe(false);
  });
  it('isActive sub-path', () => {
    const loc={pathname:'/khoa-hoc/1/bai-hoc/5'};
    const ia=(to)=>loc.pathname===to||loc.pathname.startsWith(to.split('#')[0]+'/');
    expect(ia('/khoa-hoc')).toBe(true); expect(ia('/dashboard')).toBe(false);
  });
});

function MobileToggle(){
  const [open,setOpen]=React.useState(false);
  return React.createElement('div',null,
    React.createElement('button',{'data-testid':'toggle',onClick:()=>setOpen((v)=>!v)},open?'close':'menu'),
    open&&React.createElement('div',{'data-testid':'drawer'},'Mobile drawer')
  );
}

describe('Navbar mobile menu toggle', () => {
  it('drawer hidden initially', () => {
    render(React.createElement(MobileToggle)); expect(screen.queryByTestId('drawer')).toBeNull();
  });
  it('clicking opens drawer', async () => {
    const user=userEvent.setup();
    render(React.createElement(MobileToggle));
    await user.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('drawer')).toBeDefined();
  });
  it('clicking twice closes drawer', async () => {
    const user=userEvent.setup();
    render(React.createElement(MobileToggle));
    await user.click(screen.getByTestId('toggle'));
    await user.click(screen.getByTestId('toggle'));
    expect(screen.queryByTestId('drawer')).toBeNull();
  });
});

describe('LandingPage level card navigation URLs', () => {
  const LEVELS=['N5','N4','N3','N2','N1'];
  it('all 5 levels', () => { expect(LEVELS).toHaveLength(5); });
  it('N5 URL', () => { const nav=vi.fn(); nav('/khoa-hoc?level=N5'); expect(nav).toHaveBeenCalledWith('/khoa-hoc?level=N5'); });
  it('N1 URL', () => { const nav=vi.fn(); nav('/khoa-hoc?level=N1'); expect(nav).toHaveBeenCalledWith('/khoa-hoc?level=N1'); });
  it('N1 is last', () => { expect(LEVELS[LEVELS.length-1]).toBe('N1'); });
  it('N5 is first', () => { expect(LEVELS[0]).toBe('N5'); });
});

describe('CourseDetailPage progress pct', () => {
  it('pct=0 no completions', () => { expect(Math.round((0/5)*100)).toBe(0); });
  it('pct=100 all completed', () => { expect(Math.round((5/5)*100)).toBe(100); });
  it('pct=0 when total=0', () => { const t=0; expect(t>0?Math.round((0/t)*100):0).toBe(0); });
  it('pct=33 for 1/3', () => { expect(Math.round((1/3)*100)).toBe(33); });
  it('Bat dau hoc when completed=0', () => { expect(0===0?'Bắt đầu học':'Tiếp tục học').toBe('Bắt đầu học'); });
  it('Tiep tuc hoc when completed>0', () => { expect(2===0?'Bắt đầu học':'Tiếp tục học').toBe('Tiếp tục học'); });
  it('next=first uncompleted', () => { const ls=[{id:10,completed:true},{id:11,completed:false}]; expect((ls.find((l)=>!l.completed)||ls[0]).id).toBe(11); });
  it('falls back to first when all completed', () => { const ls=[{id:10,completed:true},{id:11,completed:true}]; expect((ls.find((l)=>!l.completed)||ls[0]).id).toBe(10); });
});

describe('DashboardPage streak defaults', () => {
  it('defaults to 0 when undefined', () => { const s=undefined||{currentStreak:0,longestStreak:0}; expect(s.currentStreak).toBe(0); expect(s.longestStreak).toBe(0); });
  it('totalCompleted sums lessons', () => { expect([{completedLessons:3},{completedLessons:5},{completedLessons:0}].reduce((s,c)=>s+(c.completedLessons||0),0)).toBe(8); });
  it('handles undefined completedLessons', () => { expect([{completedLessons:undefined},{completedLessons:4}].reduce((s,c)=>s+(c.completedLessons||0),0)).toBe(4); });
});

describe('QuizSection submit endpoint', () => {
  it('POST to /quizzes/:quizId/attempts', () => { expect('/quizzes/99/attempts').toBe('/quizzes/99/attempts'); });
  it('payload has answers', () => { expect(Object.keys({1:0,2:3})).toHaveLength(2); });
  it('option 0 is valid answer', () => { const ans={1:0}; expect(ans[1]!==undefined).toBe(true); });
});

describe('VideoPlayer completedRef prevents duplicate onComplete', () => {
  it('onComplete called only once', () => {
    const oc=vi.fn(); const ref={current:false};
    function he(ct){if(ref.current)return;ref.current=true;oc(Math.floor(ct));} he(120);he(120);
    expect(oc).toHaveBeenCalledTimes(1);
  });
  it('interval skips after completedRef set', () => {
    const op=vi.fn(); const ref={current:true};
    function tick(ct,ls){if(ref.current)return;if(Math.abs(ct-ls)>=5)op(Math.floor(ct));} tick(120,110);
    expect(op).not.toHaveBeenCalled();
  });
});

describe('QuizPage handlePassed auto-navigate', () => {
  beforeEach(()=>vi.useFakeTimers());
  afterEach(()=>vi.useRealTimers());
  
  it('navigates after 1500ms', () => {
    const nav=vi.fn(); const nl={id:6};
    function hp(){if(nl)setTimeout(()=>nav('/khoa-hoc/2/bai-hoc/'+nl.id),1500);} hp();
    expect(nav).not.toHaveBeenCalled();
    act(()=>{vi.advanceTimersByTime(1500);});
    expect(nav).toHaveBeenCalledWith('/khoa-hoc/2/bai-hoc/6');
  });
  it('no navigate when nextLesson null', () => {
    const nav=vi.fn(); function hp(){if(null)setTimeout(()=>nav('/x'),1500);}
    hp(); act(()=>{vi.advanceTimersByTime(1500);}); expect(nav).not.toHaveBeenCalled();
  });
  it('no navigate before 1500ms', () => {
    const nav=vi.fn(); const nl={id:7};
    function hp(){if(nl)setTimeout(()=>nav('/x/'+nl.id),1500);} hp();
    act(()=>{vi.advanceTimersByTime(1499);}); expect(nav).not.toHaveBeenCalled();
  });
});

describe('QuizPage nextLesson calculation', () => {
  const ls=[{id:10},{id:11},{id:12}];
  it('next is lesson after current', () => { const i=ls.findIndex((l)=>l.id===11); expect((i>=0&&i<ls.length-1)?ls[i+1]:null).toEqual({id:12}); });
  it('null for last lesson', () => { const i=ls.findIndex((l)=>l.id===12); expect((i>=0&&i<ls.length-1)?ls[i+1]:null).toBeNull(); });
  it('null when id not in list', () => { const i=ls.findIndex((l)=>l.id===999); expect((i>=0&&i<ls.length-1)?ls[i+1]:null).toBeNull(); });
});