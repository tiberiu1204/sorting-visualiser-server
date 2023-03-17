const sticksContainer = document.querySelector(".sticks-container");
const N = 50;
const arr = initSticks(N);
const speed = 100;

bubbleSort(arr);

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

function updateStick(sn, n) {
    const stick = document.querySelector(`.stick:nth-child(${sn})`);
    stick.style.height = arr[sn-1] * (sticksContainer.clientHeight / n) + "px";
}

function rand(num) {
    return Math.floor(Math.random() * num);
}
async function bubbleSort(arr) {
    let sorted = false;
    while(!sorted) {
        sorted = true;
        for(let i = 1; i < arr.length; ++i) {
            activate(i, i+1, true);
            await wait(speed);
            if(arr[i-1] > arr[i]) {
                sorted = false;
                [arr[i-1], arr[i]] = [arr[i], arr[i-1]];
                updateStick(i, N);
                updateStick(i+1, N);   
            }
            activate(i, i+1, false);
        }
    }
    return arr;
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