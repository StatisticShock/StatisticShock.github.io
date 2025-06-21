import { on } from "events";

export default class CustomFunctions {
    static shuffle (arr: Array<any>): Array<any> { //Intended to shuffle any array
        let j, x, index;
        for (index = arr.length - 1; index > 0; index--) {
            j = Math.floor(Math.random() * (index + 1));
            x = arr[index];
            arr[index] = arr[j];
            arr[j] = x;
        };
        return arr;
    };

    static isParent (element: HTMLElement, parent: HTMLElement): boolean {
        return parent.contains(element);
    };

    static randomIntFromInterval(min: number, max: number) { // min and max included
        if (min > max) {
            console.error('Tá chapado?');
            return -1;
        } else if (min == max) {
            return max;
        } else return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static doesItCollide (oneElement: HTMLElement, twoElement: HTMLElement): boolean {
        const oneRect: DOMRect = oneElement.getBoundingClientRect();
        const twoRect: DOMRect = twoElement.getBoundingClientRect();

        if (oneRect.x + oneRect.width > twoRect.x &&
            twoRect.x + twoRect.width > oneRect.x &&
            oneRect.y + oneRect.height > twoRect.y &&
            twoRect.y + twoRect.height > oneRect.y) return true
        else return false;
    };
}