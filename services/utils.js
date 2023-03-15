function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}



function getFormattedNum(num) {
    num = +num
    if (num % 1 !== 0) {
        num = num.toFixed(1)
    }
    return num
}


function roundNthNum(num, nthNum) {
    const tempNum = num / nthNum
    return Math.round(tempNum) * nthNum
}


function getRandomId() {
    const randomNumber = Math.floor(Math.random() * 10000000) + 1;

    return 'ID-' + randomNumber;
}



function* genNextId() {
    let id = 101
    while (true) {
        yield 'p' + id++
    }
}