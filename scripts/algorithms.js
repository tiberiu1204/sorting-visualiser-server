export function bubbleSort(arr, cmp) {
    let sorted = false;
    while(!sorted) {
        sorted = true;
        for(let i = 1; i < arr.length; ++i) {
            if(!cmp(arr[i-1], arr[i])) {
                sorted = false;
                [arr[i-1], arr[i]] = [arr[i], arr[i-1]];
            }
        }
    }
    return arr;
}

//cmp is a callback for all sorting funcitons
//returns TRUE if a <= b and FALSE if a > b
