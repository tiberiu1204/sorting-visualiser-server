import * as alg from "./algorithms.js"

let arr = init(100);

function init(n) {
    let arr = [];
    for(let i = 1; i <= n; ++i) {
        arr.push(i);
    }
    return shuffle(arr);
}

function shuffle(arr) {
    for(let i = 0; i < arr.length * 2; ++i) {
        let a = rand(arr.length), b = rand(arr.length);
        [arr[a], arr[b]] = [arr[b], arr[a]];
    }
    return arr;
}

function rand(num) {
    return Math.floor(Math.random() * num);
}

function cmp(a, b) {
    return a <= b;
}