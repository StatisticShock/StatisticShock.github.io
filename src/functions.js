export default class CustomFunctions {
    static shuffle(arr) {
        let j, x, index;
        for (index = arr.length - 1; index > 0; index--) {
            j = Math.floor(Math.random() * (index + 1));
            x = arr[index];
            arr[index] = arr[j];
            arr[j] = x;
        }
        ;
        return arr;
    }
    ;
    static revertArray(arr) {
        const newArr = [];
        for (let i = arr.length - 1; i >= 0; i--) {
            newArr.push(arr[i]);
        }
        ;
        return newArr;
    }
    static isParent(element, parent) {
        return parent.contains(element);
    }
    ;
    static randomIntFromInterval(min, max) {
        if (min > max) {
            console.error('Tá chapado?');
            return -1;
        }
        else if (min == max) {
            return max;
        }
        else
            return Math.floor(Math.random() * (max - min + 1) + min);
    }
    ;
    static doesItCollide(oneElement, twoElement) {
        const oneRect = oneElement.getBoundingClientRect();
        const twoRect = twoElement.getBoundingClientRect();
        if (oneRect.x + oneRect.width > twoRect.x &&
            twoRect.x + twoRect.width > oneRect.x &&
            oneRect.y + oneRect.height > twoRect.y &&
            twoRect.y + twoRect.height > oneRect.y)
            return true;
        else
            return false;
    }
    ;
    static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    ;
    static normalize(string) {
        return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replaceAll(' ', '-').toLowerCase().trim();
    }
    ;
    static vlookup(key, array, end, start) {
        const startKey = start ?? 1;
        const endKey = end;
        const row = array.filter((row) => row[startKey - 1] === key);
        return row.length > 0 ? row[0][endKey - 1] : `There is no such key "${key}" (${typeof key}) at position #${startKey}.`;
    }
    ;
}
;
