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

    static revertArray (arr: Array<any>): Array<any> {
        let output: Array<any> = [];

        for (let i: number = arr.length - 1; i >= 0; i--) { //Loops from the last item to the first
            output.push(arr[i]);                        //Pushes everything back to the output
        }

        return output;
    };

    static isParent (element: HTMLElement, parent: HTMLElement): boolean {
        return parent.contains(element);
    };
}