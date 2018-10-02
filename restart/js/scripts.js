class Classifier {
    constructor(threshold, preLoadedTrainingData) {
        this.trainedNet;
        this.isTrained;
        this.trainingData = (!!preLoadedTrainingData) ? preLoadedTrainingData : [] ;
        this.threshold = (!!threshold) ? threshold : 0.70 ;
    }
    encode(arg) {
        return arg.split('').map(x => (x.charCodeAt(0) / 256));
    }
    
    processTrainingData(data) {
        return data.map(d => {
            return {
                input: encode(d.input),
                output: d.output
            }
        })
    }
    
    train(data) {
        let net = new brain.NeuralNetwork();
        net.train(processTrainingData(data));
        this.trainedNet = net.toFunction();
    };

    learn() {
        console.log('Training...');
        this.train(this.trainingData);
        console.log('Done training.');
    };
    
    execute(input) {
        let results = this.trainedNet(encode(input));
        console.log(results);
        let output;
        let certainty;
        if (results.trump > results.kardashian) {
            output = 'Donald Trump'
            certainty = Math.floor(results.trump * 100)
        } else { 
            output = 'Kim Kardashian'
            certainty = Math.floor(results.kardashian * 100)
        }
    
        return "I'm " + certainty + "% sure that tweet was written by " + output;
    }
}


var ai = new Classifier(0.70, trainingData);







//legacy
let trainedNet;

function encode(arg) {
    return arg.split('').map(x => (x.charCodeAt(0) / 256));
}

function processTrainingData(data) {
    return data.map(d => {
        return {
            input: encode(d.input),
            output: d.output
        }
    })
}

function train(data) {
    let net = new brain.NeuralNetwork();
    net.train(processTrainingData(data));
    trainedNet = net.toFunction();
};

function execute(input) {
    let results = trainedNet(encode(input));
    console.log(results)
    let output;
    let certainty;
    if (results.trump > results.kardashian) {
        output = 'Donald Trump'
        certainty = Math.floor(results.trump * 100)
    } else { 
        output = 'Kim Kardashian'
        certainty = Math.floor(results.kardashian * 100)
    }

    return "I'm " + certainty + "% sure that tweet was written by " + output;
}

train(trainingData);
console.log(execute("Paste your tweet here"));
