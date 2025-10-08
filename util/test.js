import CustomFunctions from "./functions.js";
import fs from 'fs';
var json = {
    data: [
        {
            a: 1,
            b: 2,
            c: 3,
        },
        {
            a: 4,
            b: 5,
            c: 6,
        },
        {
            a: 7,
            b: 8,
            c: 9,
        },
    ]
};
fs.writeFileSync('output.csv', '\uFEFF' + CustomFunctions.jsonToCsv(json).map(function (line) { return line.join(';'); }).join('\r\n'), 'utf-8');
