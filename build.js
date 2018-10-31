// const Classifier = require('./js/Classifier.js').Classifier;
// const Trainer = require('./js/scripts.js');
//
// nameAI = new Classifier(0.70);
// nameAI = Trainer.addData(nameAI);
//
// nameAI.train(true);
// nameAI.ask("These are breathtaking. Thanks to everyone posting their #shotoniphone photos!", true);


const brain = require('brain.js');

var net = new brain.recurrent.RNN();

net.train([
    {input: [0, 2], output: ['hello']},
    {input: [0, 1], output: ['bye']},
    {input: [1, 0], output: ['bye']},
    {input: [2, 0], output: ['hello']}
    ]);

var output = [''];
output.push(net.run([0, 0]).toString()); // [0]
output.push(net.run([0, 1]).toString()); // [1]
output.push(net.run([1, 0]).toString()); // [1]
output.push(net.run([2, 2]).toString()); // [0]
console.log(output);