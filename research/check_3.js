const friendList = ['Gripp03', 'Gripp04', 'Villentretermert', 'Attomorphlin' ]

array = {
    arr : [ { 
        name: 'Gripp03'
    }, 
    {
        name: 'Steve'
    },
    {
        name: 'Attomorphlin'
    },
    {
        name: 'Max'
    }]
}

const ratFactor = 100 - array.arr.filter((el) => friendList.includes(el.name)).length * (100/friendList.length)
console.log(ratFactor)
console.log(friendList[friendList.length-1])

const check = () => {
    return [ ['somethiong', 'aga'], ['onemore', 'haha'] ]
}

const [wow, sus] = check()
console.log(wow)

const fullList = friendList.push('name')
console.log(fullList, friendList)