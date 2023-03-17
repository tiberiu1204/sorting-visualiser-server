const sticksContainer = document.querySelector(".sticks-container");
const N = 50;
const arr = initSticks(N);
const speed = 100;

await quickSort(0, arr.length - 1);

function initSticks(n) {
    let arr = initArray(n);
    const stickWidth = sticksContainer.clientWidth / n + "px";
    const height = sticksContainer.clientHeight;
    for(let i = 0; i < arr.length; ++i) {
        const stick = document.createElement("div");
        stick.style.width = stickWidth;
        stick.style.height = height * (arr[i] / n) + "px";
        stick.classList.add("stick");
        sticksContainer.appendChild(stick);
    }
    return arr;
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
    stick.style.height = arr[sn-1] * (sticksContainer.clientHeight / N) + "px";
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
    const pivotStick = document.querySelector(`.stick:nth-child(${pivot + 1})`);
    pivotStick.classList.add("green");
    
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

    pivotStick.classList.remove("green");
    await quickSort(left, j - 1);
    await quickSort(j + 1, right);
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

function wait(ms) {
    return new Promise(res => setTimeout(res, ms));
}