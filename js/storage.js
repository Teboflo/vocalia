const KEY = "vocalia_progress_v1";

const defaults = {
  xp: 0, level: 1, streak: 0, streakFreeze: 2,
  lastPractice: null,
  completed: [],
  missionProgress: {warmup:0, tuning:0, xp:0},
  achievements: []
};

export function loadProgress(){
  try{
    const saved = JSON.parse(localStorage.getItem(KEY));
    return {...defaults, ...(saved || {})};
  }catch{return {...defaults}}
}
export function saveProgress(progress){localStorage.setItem(KEY, JSON.stringify(progress))}
export function addXP(progress, amount){
  progress.xp += amount;
  progress.level = Math.floor(progress.xp / 100) + 1;
  progress.missionProgress.xp += amount;
  return progress;
}
export function practiceToday(progress){
  const today = new Date().toISOString().slice(0,10);
  if(progress.lastPractice === today) return false;
  if(progress.lastPractice){
    const last = new Date(progress.lastPractice);
    const now = new Date(today);
    const diff = Math.round((now-last)/86400000);
    if(diff === 1) progress.streak += 1;
    else if(diff > 1) progress.streak = 1;
  } else progress.streak = 1;
  progress.lastPractice = today;
  return true;
}