fetch('data/hanzi.json')
  .then(response => response.json())
  .then(data => startGame(data.slice(0, 50)))
let items = [];
let currentItemIndex = 0;
let usedIndices = [];
function startGame(data) {
  items = data;
  displayRandomHint();
}
const audio = document.getElementById('audio');
function displayRandomHint() {
  if (usedIndices.length === items.length) {
    document.getElementById('result').textContent = "You've completed all the items!";
    document.getElementById('hanzi').textContent = "";
    document.getElementById('english').textContent = "";
    document.getElementById('user').value = "";
    return;
  }
  do {
    currentItemIndex = Math.floor(Math.random() * items.length);
  } while (usedIndices.includes(currentItemIndex));
  document.getElementById('hanzi').textContent = items[currentItemIndex].hanzi;
  document.getElementById('user').value = '';
  document.getElementById('english').textContent = items[currentItemIndex].english.join(', ');
  document.getElementById('audio').src = `data/audio/${String(currentItemIndex + 1).padStart(4, '0')}.mp3`;
  document.getElementById('result').textContent = '';
}
function submitAnswer() {
  const userAnswer = document.getElementById('user').value.trim();
  if (userAnswer.toLowerCase() === items[currentItemIndex].pinyin.toLowerCase()) {
    document.getElementById('result').textContent = "correct!";
    usedIndices.push(currentItemIndex);
    setTimeout(displayRandomHint, 2000);
  } else {
    document.getElementById('result').textContent = `Incorrect! Answer is ${items[currentItemIndex].pinyin}`;
    setTimeout(displayRandomHint, 2000);
  }
}
const user = document.getElementById('user');
const source = [
  '-a', '-e', '-i', '-o', '-u',
  '.a', '.e', '.i', '.o', '.u',
  ',a', ',e', ',i', ',o', ',u',
  'aa', 'ee', 'ii', 'oo', 'uu',
  'ña', 'ñe', 'ñi', 'ño', 'ñu'
];
const target = [
    'ā', 'ē', 'ī', 'ō', 'ū',
    'ǎ', 'ě', 'ǐ', 'ǒ', 'ǔ',
    'à', 'è', 'ì', 'ò', 'ù',
    'ā', 'ē', 'ī', 'ō', 'ū',
    'á', 'é', 'í', 'ó', 'ú'
];
document.getElementById('user').addEventListener(
  'input',
  () => {
    user.value = user.value.toLowerCase();
    source.forEach(
      (char, index) => {
        if(user.value.includes(char)){
            user.value = user.value.replace(
              new RegExp(char, 'g'),
              target[index]
            )
        };
      }
    );
  }
)
document.getElementById('user').addEventListener(
    'keydown',
    event => {
        if(event.key === 'Enter') {
            submitAnswer();
        }
    }
);
document.getElementById('hanzi').addEventListener(
  'click',
  () => {
    audio.play();
  }
);