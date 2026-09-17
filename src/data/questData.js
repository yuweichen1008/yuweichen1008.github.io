// Level 33 Quest — Sep 17 → Nov 11, 2026. Toggle `done` as objectives are cleared.
const quest = {
  name: 'The Level 33 Quest',
  start: '2026-09-17',
  end: '2026-11-11',
  birthday: '1993-10-08',
  checkpoints: [
    { date: '2026-10-08', label: 'Level up · Turning 33', icon: '🎂' },
    { date: '2026-11-11', label: '1 year since leaving the US', icon: '🏁' },
  ],
  objectives: [
    { id: 'q1', icon: '🤖', text: 'Ship one production-grade AI integration end to end', done: false },
    { id: 'q2', icon: '🧪', text: 'Publish an LLM evaluation playbook with verification-style coverage', done: false },
    { id: 'q3', icon: '🌏', text: 'Advance global opportunities — Japan · UK · Netherlands · Canada', done: false },
    { id: 'q4', icon: '🇯🇵', text: 'Close the 9-point JLPT N2 gap: grammar + listening daily', done: false },
    { id: 'q5', icon: '💪', text: 'Train consistently — best shape yet by Nov 11', done: false },
  ],
}

module.exports = quest
