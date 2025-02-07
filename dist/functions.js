var CustomFunctions = /** @class */ (function () {
    function CustomFunctions() {
    }
    CustomFunctions.shuffle = function (arr) {
        var j, x, index;
        for (index = arr.length - 1; index > 0; index--) {
            j = Math.floor(Math.random() * (index + 1));
            x = arr[index];
            arr[index] = arr[j];
            arr[j] = x;
        }
        ;
        return arr;
    };
    ;
    CustomFunctions.isParent = function (element, parent) {
        return parent.contains(element);
    };
    ;
    CustomFunctions.randomIntFromInterval = function (min, max) {
        if (min > max) {
            console.error('Tá chapado?');
            return -1;
        }
        else if (min == max) {
            return max;
        }
        else
            return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return CustomFunctions;
}());
export default CustomFunctions;
