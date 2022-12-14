'use strict'
var gNextId = genNextId()


let gUsersMap = {}
// console.log('gUsers:', gUsers)

function onInit() {
    gUsersMap = createUsersMap()
    console.log('gUsersMap:', gUsersMap)
    renderInputs()
}


function createUsersMap() {
    let usersMap = loadUsersFromStorage()
    if (!usersMap) {
        usersMap = {}
        createUser(usersMap)
        createUser(usersMap)
        saveUsersToStorage(usersMap)
    }
    return usersMap

}

function createUser(usersMap) {
    const nextId = getRandomId()
    usersMap[nextId] = {
        id: nextId,
        name: '',
        amount: ''
    }
}

function renderInputs() {
    const elForm = document.querySelector('form')
    let strHTML = ''
    for (const userId in gUsersMap) {
        console.log('userId:', userId)
        const user = gUsersMap[userId]
        strHTML += `
        <fieldset>
            <section>
                <input value="${user.name}" oninput="onInput(event, '${userId}', 'name')" type="text" name="name" id="" placeholder="Name">
                <input value="${user.amount}" oninput="onInput(event, '${userId}', 'amount')" type="number" name="amount" id="" placeholder="Amount">
            </section>
            <button onclick=onRemoveInput('${userId}')>X</button>
        </fieldset>
        `
    }
    elForm.innerHTML = strHTML
}

function onInput(ev, userId, field) {
    // console.log('ev:', ev)
    console.log('userId:', userId)
    const val = ev.target.value
    gUsersMap[userId][field] = ev.target.type === 'number' ? +val : val
    saveUsersToStorage(gUsersMap)

}

function onAddInput() {
    createUser(gUsersMap)
    saveUsersToStorage(gUsersMap)
    renderInputs()

}


function onRemoveInput(userId) {
    // if (Object.keys(gUsersMap).length <= 2) return
    delete gUsersMap[userId]
    saveUsersToStorage(gUsersMap)
    renderInputs()

}

function onClearAll() {
    gUsersMap = {}
    createUser(gUsersMap)
    createUser(gUsersMap)
    renderInputs()
    saveUsersToStorage(gUsersMap)


}


function onCalculatePay(ev) {
    ev.preventDefault()
    const { results: trans, avg } = getPaymentTrans(Object.values(gUsersMap))
    if (!trans.length) return
    const transHTML = getTransHTMl(trans)
    const elResults = document.querySelector('.results')
    elResults.innerHTML = `<h5>Average: ${avg}</h5>` + transHTML
    togglePage()
}

function getTransHTMl(trans) {
    let transHTML = trans.map(trans => {
        return `
        <section class="trans-preview">
            <span class="from">${trans.from}</span>
            <img src="right-arrow.svg" alt="">
            <span class="to">${trans.to}</span>
            <span class="amount">${trans.amount.toFixed(2)}</span>
        </section>
        `
    }).join('')

    return transHTML
}

function* genNextId() {
    let id = 101
    while (true) {
        yield 'p' + id++
    }
}


function getRandomId() {
    const randomNumber = Math.floor(Math.random() * 10000000) + 1;

    return 'ID-' + randomNumber;
}

function getNextId() {
    return gNextId.next().value
}


function getPaymentTrans(users) {
    users = structuredClone(users)
    console.log('users:', users)
    users.sort((user1, user2) => user2.amount - user1.amount)
    const sum = users.reduce((acc, user) => acc += user.amount, 0)
    const avg = sum / users.length
    const underAvgUsers = users.filter(user => user.amount < avg)
    const overAvgUsers = users.filter(user => user.amount >= avg)
    const results = []
    for (let underAvgUser of underAvgUsers) {
        const amountToPay = avg - underAvgUser.amount
        for (let overAvgUser of overAvgUsers) {
            const amountToReceive = overAvgUser.amount - avg
            if (!amountToReceive) continue
            if (amountToReceive >= amountToPay) {
                underAvgUser.amount += amountToPay
                overAvgUser.amount -= amountToPay
                const transaction = createTransaction(underAvgUser.name, overAvgUser.name, amountToPay)
                results.push(transaction)
                break
            }
            underAvgUser.amount += amountToReceive
            overAvgUser.amount -= amountToReceive
            const transaction = createTransaction(underAvgUser.name, overAvgUser.name, amountToReceive)
            results.push(transaction)
        }
    }
    console.log('results:', results)
    return { results, avg }
}

function togglePage() {
    const elInputContainer = document.querySelector('.input-container')
    const elResContainer = document.querySelector('.res-container')
    elInputContainer.classList.toggle('hide')
    elResContainer.classList.toggle('hide')
}


function createTransaction(from, to, amount) {
    return {
        from,
        to,
        amount
    }
}