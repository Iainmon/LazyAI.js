let brain = require('brain.js');

class Classifier {
    constructor(threshold, preLoadedTrainingData) {
        this.trainedNet;
        this.isTrained;
        this.trainingData = (!!preLoadedTrainingData) ? preLoadedTrainingData : [] ;
        this.threshold = (!!threshold) ? threshold : 0.70 ;
    }
    static encode(arg) {
        return arg.split('').map(x => (x.charCodeAt(0) / 256));
    }
    
    processTrainingData(data) {
        return data.map(d => {
            return {
                input: Classifier.encode(d.input),
                output: d.output
            }
        });
    }

    addTrainingData(input, item) {//  (DataType, String)
        var data = {
               input: input,
               output: { [item] : 1 }
         };
        this.trainingData.push(data);
    }

    train(debug = false) {

        if (debug) console.log('Processing training data...');
        let processedTrainignData = this.processTrainingData(this.trainingData);

        if (debug) console.log('Instantiating neural net...');
        let net = new brain.NeuralNetwork();

        if (debug) console.log('Training...');
        net.train(processedTrainignData);

        if (debug) console.log('Creating function...');
        this.trainedNet = net.toFunction();

        if (debug) console.log('Done training.');
    };
    
    ask(input, debug = false) {

        let results = this.trainedNet(Classifier.encode(input));
        this.threshold = 0.60;

        if (debug) console.log(results);
        let output;
        let brokeThreshold;

        let result = Object.values(results);
        let greatestCertainty = Math.max(...result);
        let greatestCertaintyKey;
        //debugLog(results);
        
        Object.entries(results).forEach(([key, value]) => {
            if (value == greatestCertainty) {
                greatestCertaintyKey = key;
            }
        });

        if (greatestCertainty < this.threshold || !!!greatestCertainty) {
            if (debug) console.log('Certainty did not break threshold!');
            return {
                item: greatestCertaintyKey,
                certainty: greatestCertainty,
                brokeThreshold: false,
                rawOutput: results
            };
        }
        if (debug) console.log(`I am ${ Math.round(greatestCertainty * 100000) / 1000 }% sure that "${ greatestCertaintyKey }" is the item coresponding with "${ input }"`);
        return {
            item: greatestCertaintyKey,
            certainty: greatestCertainty,
            brokeThreshold: true,
            rawOutput: results
        };
    }
}


module.exports = {
    Classifier: Classifier
};