// console.log(require.cache);
const {add, subtract, multiply} = require("./utils/math");
const capitalize = require("./utils/strings");


    //Math
console.log(add(1,3));
console.log(subtract(1,3));
console.log(multiply(1,3));

    //String
console.log(capitalize("gor"));


console.log(require.cache);     // --> Քանի որ առաջին անգամ է require call եղել իր մեջ չի ունենա cache արված օբյեկտները, միայն լինելու է index.js-ի module-ը, 
// բայց կանչից անմիջապես հետո տեսնելու է որ cache արված չի այն ինչը ուզեցել ենք ստանանք այլ module-ից, execute-ից հետո cache-ավորելու է,
//  որը տեսնում ենք արդեն console.log անելուց, այսինքն եթե մինչ require-ի կանչը փորձենք տպել require.cache-ը, տեսնելու ենք որ դատարկ է այն(cache-ավորված ոչինիչ չունենք):