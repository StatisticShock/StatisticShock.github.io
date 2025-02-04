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
    CustomFunctions.revertArray = function (arr) {
        var output = [];
        for (var i = arr.length - 1; i >= 0; i--) { //Loops from the last item to the first
            output.push(arr[i]); //Pushes everything back to the output
        }
        return output;
    };
    ;
    CustomFunctions.isParent = function (element, parent) {
        return parent.contains(element);
    };
    ;
    return CustomFunctions;
}());
export default CustomFunctions;
