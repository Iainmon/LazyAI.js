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
                input: this.encode(d.input),
                output: d.output
            }
        });
    }

    addTrainingData(input, item) {//  (DataType, String)
        var data = {
               input: input,
               output: { [item] : 1 }
         }
        this.trainingData.push(data);
    }

    train() {
        console.log('Training...');

        let net = new brain.NeuralNetwork();
        net.train(this.processTrainingData(this.trainingData));
        this.trainedNet = net.toFunction();

        console.log('Done training.');
    };
    
    ask(input) {

        let results = this.trainedNet(this.encode(input));
        this.threshold = 0.60;

        console.log(results);
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
            console.log('Certainty did not break threshold!');
            return {
                item: greatestCertaintyKey,
                certainty: greatestCertainty,
                brokeThreshold: false,
                rawOutput: results
            };
        }
        console.log(`I am ${ Math.round(greatestCertainty * 100000) / 1000 }% sure that "${ greatestCertaintyKey }" is the item coresponding with "${ input }"`);
        return {
            item: greatestCertaintyKey,
            certainty: greatestCertainty,
            brokeThreshold: true,
            rawOutput: results
        };
    }
}