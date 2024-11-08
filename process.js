const fs = require('fs');
const path = require('path');

const hanzijson = path.join(__dirname, 'data', 'hanzi.json');
const hanzi = JSON.parse(fs.readFileSync(hanzijson, 'utf-8'));

function myCustomSplit(str, ...separators) {
    // Join the separators into a regular expression pattern
    const regex = new RegExp(`[${separators.join('')}]`);
    return str.split(regex).map(item => item.trim());
}


hanzi.forEach(
    char => {
        char['english'] = char['english2'];
        delete char['english2']
    }
);

fs.writeFileSync(hanzijson, JSON.stringify(hanzi, null, 4));