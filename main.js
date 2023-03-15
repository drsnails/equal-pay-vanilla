'use strict'
navigator.serviceWorker.register('./sw.js')

var gNextId = genNextId()


let gUsersMap = {}
// console.log('gUsers:', gUsers)

function onInit() {
    gUsersMap = createUsersMap()
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
    const elForm = document.querySelector('.form')
    let strHTML = ''
    for (const userId in gUsersMap) {
        const user = gUsersMap[userId]
        strHTML += `
        <div class="fieldset" onclick="evs(event)">
            <section>
                <input value="${user.name}" oninput="onInput(event, '${userId}', 'name')" type="text" name="name" id="" placeholder="Name">
                <input value="${user.amount}" oninput="onInput(event, '${userId}', 'amount')" type="number" name="amount" id="" placeholder="Amount">
            </section>
            <button onclick="onRemoveInput('${userId}', event)">X</button>
        </div>
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


function onRemoveInput(userId, ev) {
    console.log('userId:', userId)
    console.log('ev:', ev)
    ev.stopPropagation()
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
    elResults.innerHTML = `<h4>Average: ${Math.round(getFormattedNum(avg))}</h4>` + transHTML
    // togglePage()
    showResPage()
}

/*TEST START*/

function getTransHTMl(trans) {
    let transHTML = trans.map(trans => {
        return `
        <section class="trans-preview">
            <span class="from">${trans.from}</span>
            <span data-amount="${Math.round(getFormattedNum(trans.amount))}" class="span-img"><img src="right-arrow.svg" alt=""></span>
            <span class="to">${trans.to}</span>
        </section>
        `
    }).join('')

    return transHTML
}

/*TEST END*/



/*ORIGINAL START*/

/*
function getTransHTMl(trans) {
    let transHTML = trans.map(trans => {
        return `
        <section class="trans-preview">
            <span class="from">${trans.from}</span>
            <span data-amount="${getFormattedNum(trans.amount)}" class="span-img"><img src="right-arrow.svg" alt=""></span>
            <span class="to">${trans.to}</span>
            <span class="amount">${getFormattedNum(trans.amount)}</span>
        </section>
        `
    }).join('')

    return transHTML
}
*/

/*ORIGINAL END*/



function getNextId() {
    return gNextId.next().value
}


function togglePage() {
    const elInputContainer = document.querySelector('.input-container')
    const elResContainer = document.querySelector('.res-container')
    elInputContainer.classList.toggle('hide')
    elResContainer.classList.toggle('hide')

}

function showResPage() {
    const elWarpContainer = document.querySelector('.wrap-container')
    elWarpContainer.style.translate = '-50%'
    const elResContainer = document.querySelector('.res-container')
    elResContainer.classList.remove('hide')
    setTimeout(() => {
        const elInputContainer = document.querySelector('.input-container')
        elInputContainer.classList.add('hide')
    }, 300);
}

function showHomePage() {
    const elWarpContainer = document.querySelector('.wrap-container')
    elWarpContainer.style.translate = '0%'
    const elInputContainer = document.querySelector('.input-container')
    elInputContainer.classList.remove('hide')
    setTimeout(() => {
        const elResContainer = document.querySelector('.res-container')
        elResContainer.classList.add('hide')
    }, 300)
}

function evs(ev) {
    ev.preventDefault()
    ev.stopPropagation()
}