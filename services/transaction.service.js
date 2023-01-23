'use strict'

function getPaymentTrans(users) {
    users = structuredClone(users)
    users.sort((user1, user2) => user2.amount - user1.amount)
    const sum = users.reduce((acc, user) => acc += user.amount, 0)
    const avg = sum / users.length
    const underAvgUsers = users.filter(user => user.amount < avg)
    const overAvgUsers = users.filter(user => user.amount >= avg)
    const results = []
    for (let underAvgUser of underAvgUsers) {
        // console.log('underAvgUser:', underAvgUser)
        let amountToPay = avg - underAvgUser.amount
        // console.log('amountToPay:', amountToPay)
        for (let overAvgUser of overAvgUsers) {
            const amountToReceive = overAvgUser.amount - avg
            if (!amountToReceive) continue
            if (amountToReceive >= amountToPay) {
                underAvgUser.amount += amountToPay
                overAvgUser.amount -= amountToPay
                const transaction = createTransaction(underAvgUser.name, overAvgUser.name, amountToPay)
                results.push(transaction)
                // console.log('transaction1:', transaction)
                break
            }
            underAvgUser.amount += amountToReceive
            overAvgUser.amount -= amountToReceive
            const transaction = createTransaction(underAvgUser.name, overAvgUser.name, amountToReceive)
            // console.log('transaction2:', transaction)
            results.push(transaction)
            amountToPay -= amountToReceive
        }
    }
    // console.log('results:', results)
    // console.log('checkResults(users, avg):', checkResults(users, avg))
    return { results, avg }
}



function createTransaction(from, to, amount) {
    return {
        from,
        to,
        amount
    }
}



function checkResults(users, avg) {
    console.log('avg:', avg)
    console.log('users:', users)
    return users.every(user => {
        return user.amount.toFixed(2) === avg.toFixed(2)
    })
}