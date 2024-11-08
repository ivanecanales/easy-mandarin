const element = id => document.getElementById(id);
const start = 60;
const end = 70;
const delay = 3000; //higher for study, lower for playing
fetch('data/hanzi.json').then(
    response => response.json()
).then(
    data => startGame(data.slice(start, end))
);
let [items, current, used] = [[], 0, []];
const startGame = data => {items = data; shownextcard()};
const [hanzi, english, audio, pinyin, user, result] = [
    'hanzi', 'english', 'audio', 'pinyin', 'user', 'result'
].map(id => element(id));
const shownextcard = () => {
    if(used.length === items.length){
        result.textContent = "you've completed all hanzi!";
        [hanzi, english, pinyin].forEach(
            element => {element.style.display = 'none'}
        );
        return;
    }
    do{
        current = Math.floor(Math.random() * items.length)
    }while(used.includes(current));
    hanzi.textContent = items[current].hanzi;
    english.textContent = items[current].english.join(', ');
    audio.src = `data/audio/${String(start + current + 1).padStart(4, '0')}.mp3`;
    user.value = '';
    result.textContent = '';
}
const submit = () => {
    const answer = user.value.trim();
    if(answer == items[current].pinyin){
        result.textContent = "correct!";
        used.push(current);
        setTimeout(shownextcard, delay);
    }else{
        result.textContent = `incorrect! ${items[current].pinyin}`;
        setTimeout(shownextcard, delay);
    };
};
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
user.addEventListener(
  'input',
  () => {
    let read = user.value.toLowerCase();
    source.forEach(
      (char, index) => {
        if(read.includes(char)){
            read = read.replace(
              new RegExp(char, 'g'),
              target[index]
            )
        };
      }
    );
    user.value = read;
    if(user.value == items[current].pinyin){
      user.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    };
  }
);
user.addEventListener(
    'keydown',
    event => {
        if(event.key === 'Enter') {
            submit();
        }
    }
);
hanzi.addEventListener(
  'click',
  () => {
    audio.play();
  }
);