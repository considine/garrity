var order = ['bump', 'main', 's1', 's2', 'th', 'th'];
    // if there is none of an item simply make this that ite

    var transition = {};


    for (var i=order.length-1; i>0; i--) {
      transition[order[i-1]] = order[i];
    }
console.log(JSON.stringify(transition));
