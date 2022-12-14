'use strict'
const STORAGE_KEY = 'USERS'


function saveUsersToStorage(val) {
    const str = JSON.stringify(val)
    localStorage.setItem(STORAGE_KEY, str)
}

function loadUsersFromStorage() {
    const str = localStorage.getItem(STORAGE_KEY)
    return JSON.parse(str)
}


