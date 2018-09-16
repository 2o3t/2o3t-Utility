const utility = require('../');
const path = require('path');

// console.log(utility.readJSONSync(path.join(process.cwd(), 'package.json')));
// console.log(utility.MAX_SAFE_INTEGER_STR)
// console.log(utility.splitAlwaysOptimized())

const files = utility.mapDirsBreadth(path.join(process.cwd(), 'test'), true);
console.log(files);

