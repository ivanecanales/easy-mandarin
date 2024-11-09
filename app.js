const element = id => document.getElementById(id);
const delay = 500; //higher for study, lower for playing
const [
    start, end, play, game, hanzi, english, audio,
    pinyin, user, result, toggle
] = [
    'start', 'end', 'play', 'game', 'hanzi', 'english', 'audio',
    'pinyin', 'user', 'result', 'toggle'
].map(id => element(id));
let [items, current, used] = [[], 0, []];
play.addEventListener(
    'click',
    () => {

        if(start.value && end.value){
            [hanzi, english, pinyin].forEach(
                element => {
                    element.style.display = 'flex';
                    [items, current, used] = [[], 0, []]
                }
            );
            fetch(
                'https://ivanecanales.cl/mandarin/data/hanzi.json'
            ).then(
                response => response.json()
            ).then(
                data => startGame(data.slice(Number(start.value), Number(end.value)))
            );
            const startGame = data => {
                items = data; shownextcard()
            };
            game.max = Number(end.value) - Number(start.value);
        };
    }
);
const shownextcard = () => {
    if(used.length === items.length){
        game.value = Number(end.value);
        result.textContent = "you've completed all hanzi!";
        [hanzi, english, pinyin].forEach(
            element => {element.style.display = 'none'}
        );
        return;
    }
    do{
        current = Math.floor(Math.random() * items.length)
    }while(used.includes(current));
    game.value = used.length;
    hanzi.textContent = items[current].hanzi;
    english.textContent = items[current].english.join(', ');
    const baseurl = 'https://ivanecanales.cl/mandarin/data/audio/';
    const index = Number(start.value) + current + 1;
    const audiofile = `${String(index).padStart(4, '0')}.mp3`;
    audio.src = baseurl + audiofile;
    if(!toggle.checked){
        audio.play();    
    };
    user.value = '';
    result.textContent = '';
}
const submit = () => {
    const answer = user.value.trim();
    if(answer == items[current].pinyin){
        result.textContent = "correct!";
        used.push(current);
        game.style.accentColor = 'teal';
        setTimeout(shownextcard, delay);
    }else{
        result.textContent = `incorrect! ${items[current].pinyin}`;
        game.style.accentColor = 'crimson';
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