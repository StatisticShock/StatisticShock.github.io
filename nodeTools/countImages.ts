import * as fs from 'fs';
import { imageSize as sizeOf} from 'image-size';

const filePath: string = '../images/headers/';

fs.readdir(filePath, (err, files) => {
    if (err) {
        console.error(err);
    } else {
        let arr: Array<string> = [];

        files.forEach((fileName) => {
            if (fileName !== 'headers.json') { //Ignore the JSON itself
                let dimensions = sizeOf(filePath + fileName);
                let aspectRatio: number = dimensions.width / dimensions.height;

                if (aspectRatio >= 5) {
                    arr.push(fileName);
                } else {
                    fs.unlink(filePath + fileName, (err) => {
                        if (err) {
                            console.error(`An error ocurred: ${err}.`)
                        };
                    });
                };
            };
        });

        let string: string = `[${String.fromCharCode(10)}`;

        for (let i = 0; i < arr.length; i++) {
            if (i < arr.length - 1) {
                string = `${string}"${arr[i]}",${String.fromCharCode(10)}`;
            } else {
                string = `${string}"${arr[i]}"${String.fromCharCode(10)}`;
            };
        };

        string = string + ']'

        fs.writeFileSync(`${filePath}headers.json`, string);
    };
});