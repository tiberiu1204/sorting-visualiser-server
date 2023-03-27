const sticksContainer = document.querySelector(".sticks-container");
const sortBtn = document.querySelector("#sort");
const shuffleBtn = document.querySelector("#shuffle");
const stopBtn = document.querySelector("#stop");
const sizeSlider = document.querySelector("#size");
const speedSlider = document.querySelector("#speed");
const algorithmSelector = document.querySelector("#algorithm-select");

let selectedAlgorithm;
let N = sizeSlider.value * 20;
let arr = initSticks(N);
let speed = 0;
let isSorting = false;

setup();

function setup() {

    getSpeed();
    getSelectedAlgorithm();

    algorithmSelector.addEventListener("change", getSelectedAlgorithm);

    sortBtn.addEventListener("click", () => {
        beginSort(selectedAlgorithm);
    });

    shuffleBtn.addEventListener("click", () => {
        if(isSorting) return;
        arr = shuffle(arr);
        for(let i = 0; i < arr.length; ++i) {
            updateStick(i+1);
        }
    });

    sizeSlider.addEventListener("input", () => {
        N = sizeSlider.value * 20;
        clearSticks();
        arr = initSticks(N);
    });

    speedSlider.addEventListener("input", getSpeed);

    function getSelectedAlgorithm() {
        selectedAlgorithm = algorithmSelector.value;
    }
}

function initSticks(n) {
    let arr = initArray(n);
    const stickWidth = (100 / n) + "%";
    const height = sticksContainer.clientHeight;
    for(let i = 0; i < arr.length; ++i) {
        const stick = document.createElement("div");
        stick.style.width = stickWidth;
        stick.style.height = 100 * (arr[i] / n) + "%";
        stick.classList.add("stick");
        sticksContainer.appendChild(stick);
    }
    return arr;
}

function clearSticks() {
    while(sticksContainer.firstChild) {
        sticksContainer.removeChild(sticksContainer.lastChild);
    }
}

function initArray(n) {
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

function updateStick(sn) {
    const stick = document.querySelector(`.stick:nth-child(${sn})`);
    stick.style.height = 100 * (arr[sn-1] / N) + "%";
}

function rand(num) {
    return Math.floor(Math.random() * num);
}

async function bubbleSort(arr) {
    let sorted = false;
    let count = 0;
    while(!sorted) {
        sorted = true;
        for(let i = 1; i < arr.length - count; ++i) {
            activate(i, i+1, true);
            if(arr[i-1] > arr[i]) {
                sorted = false;
                [arr[i-1], arr[i]] = [arr[i], arr[i-1]];
                updateStick(i);
                updateStick(i+1);   
            }
            await wait(speed);
            activate(i, i+1, false);
        }
        count++;
    }
    return arr;
}

async function quickSort(left, right) {
    if(left >= right) return;
    
    const pivot = right;
    highlight(pivot + 1, true);
    
    let i = left, j = left;
    while(i < pivot) {
        let a = i + 1, b = j + 1;
        activate(a, b, true);
        await wait(speed);
        if(arr[i] < arr[pivot]) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            updateStick(a);
            updateStick(b);
            j++;
        }
        activate(a, b, false);
        i++;
    }
    [arr[j], arr[pivot]] = [arr[pivot], arr[j]];
    updateStick(j+1);
    updateStick(pivot+1);

    highlight(pivot + 1, false);
    await quickSort(left, j - 1);
    await quickSort(j + 1, right);
}   

async function mergeSort(left, right) {
    if(left == right) {
        return new Promise(resolve => {resolve([arr[left]])});
    }

    const middle = Math.floor((left + right) / 2);
    
    let arr1, arr2;
    await mergeSort(left, middle).then(val => {arr1 = val});
    await mergeSort(middle + 1, right).then(val => arr2 = val);
    const res = [];

    let i = 0, j = 0;
    while(i < arr1.length && j < arr2.length) {
        let a = i + 1 + left, b = j + 2 + middle;
        activate(a, b, true);
        await wait(speed);
        if(arr1[i] < arr2[j]) {
            res.push(arr1[i++]);
        } else {
            res.push(arr2[j++]);
        }
        activate(a, b, false);
    }

    while(arr1.length > i) {
        activateSingle(i+1 + left, true);
        await wait(speed);
        res.push(arr1[i++]);
        activateSingle(i + left, false);
    }
    while(arr2.length > j) {
        activateSingle(j+1 + middle, false);
        await wait(speed);
        res.push(arr2[j++]);
        activateSingle(j + middle, false);
    }

    j = 0;
    for(i = left; i <= right; ++i) {
        arr[i] = res[j++];
        activateSingle(i+1, true);
        updateStick(i+1);
        await wait(speed);
        activateSingle(i+1, false);
    }
    return new Promise(resolve => {resolve(res)});
}

async function selectSort() {
    for(let i = 0; i < arr.length; ++i) {
        let minPosition = i;
        highlight(i + 1, true);   
        for(let j = i + 1; j < arr.length; ++j) {
            activateSingle(j + 1, true);
            await wait(speed);
            if(arr[minPosition] > arr[j]) {
                highlight(minPosition + 1, false);
                highlight(j + 1, true);    
                minPosition = j;
            }
            activateSingle(j + 1, false);
        }
        [arr[minPosition], arr[i]] = [arr[i], arr[minPosition]];
        updateStick(minPosition + 1);
        updateStick(i + 1);
        highlight(minPosition + 1, false);
    }
}

async function insertionSort() {
    for(let i = 0; i < arr.length; ++i) {
        highlight(i + 1, true);
        for(let j = i; j >= 1; --j) {
            activate(j, j+1, true);
            await wait(speed);
            if(arr[j] < arr[j - 1]) {
                [arr[j-1], arr[j]] = [arr[j], arr[j-1]];
                updateStick(j + 1);
                updateStick(j);
            } else {
                activate(j, j+1, false);
                break;
            }
            activate(j, j+1, false);
        }
        highlight(i + 1, false);
    }
    console.log(arr);
}

function highlight(n, isHighlighted) {
    const stick = document.querySelector(`.stick:nth-child(${n})`);
    if(isHighlighted) {
        stick.classList.add("green");
    } else {
        stick.classList.remove("green");
    }
}

function activate(a, b, isActive) {
    const stick1 = document.querySelector(`.stick:nth-child(${a})`);
    const stick2 = document.querySelector(`.stick:nth-child(${b})`);
    if(isActive) {
        stick1.classList.add("active");
        stick2.classList.add("active");
    } else {
        stick1.classList.remove("active");
        stick2.classList.remove("active");
    }
}

function activateSingle(a, isActive) {
    const stick = document.querySelector(`.stick:nth-child(${a})`);
    if(isActive) {
        stick.classList.add("active");
    } else {
        stick.classList.remove("active");
    }
}

function wait(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function beginSort(sortId) {
    disableButtons();

    if(isSorting) return;
    isSorting = true;
    if(sortId == 1) {
        bubbleSort(arr).then(resolve);
    }
    if(sortId == 2) {
        quickSort(0, arr.length - 1).then(resolve);
    }
    if(sortId == 3) {
        mergeSort(0, arr.length - 1).then(resolve);
    }
    if(sortId == 4) {
        selectSort().then(resolve);
    }
    if(sortId == 5) {
        insertionSort().then(resolve);
    }

    function resolve() {
        isSorting = false;
        sizeSlider.removeAttribute("disabled");
        shuffleBtn.removeAttribute("disabled", "");
        sortBtn.removeAttribute("disabled", "");
        algorithmSelector.removeAttribute("disabled", "");
    }
    
    function disableButtons() {
        sizeSlider.setAttribute("disabled", "");
        shuffleBtn.setAttribute("disabled", "");
        sortBtn.setAttribute("disabled", "");
        algorithmSelector.setAttribute("disabled", "");
    }
}

function getSpeed() {
    switch(speedSlider.value) {
        case "3":
            speed = 0;
            break;
        case "2":
            speed = 100;
            break;
        case "1":
            speed = 1000;
            break;
    }
}
