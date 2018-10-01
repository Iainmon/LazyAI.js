class Classifier {
    constructor(threshold, inputTrainingData) {
        this.trainedNet;
        this.threshold = threshold;
        if (inputTrainingData) {
            this.trainingData = inputTrainingData;
        } else {
            this.trainingData = new Array();
        }
        // this.things = new Array();
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
        })
    }

    train(data) {
        let net = new brain.NeuralNetwork();
        net.train(this.processTrainingData(data));
        this.trainedNet = net.toFunction();
    };

    ask(input) {
        let results = this.trainedNet(this.encode(input));
        this.threshold = 60;

        debugLog(results);
        let output;
        let certainty;
        let brokeThreshold;

        let result = Object.values(results);
        let answer = Math.max(...result);
        debugLog(results);
        
        var item = new Array;
        Object.entries(results).forEach(([key, value]) => {
            if (value == answer) {
                item.push(key);
                item.push(value);
            }
            });

        if (answer >= this.threshold) {
            debugLog("Certainty did not break threshold!");
            return {
                item: null,
                certainty: item[1],
                brokeThreshold: false,
                rawOutput: results
            };
        }
        debugLog("I am " + (answer*100) + "% sure that " + item[0] + " is the item coresponding with: " + input);
        return {
            item: item[0],
            certainty: item[1],
            brokeThreshold: true,
            rawOutput: results
        };
        
        
    }

    learn() {
        debugLog("Training...");
        this.train(this.trainingData);
        debugLog("Done training.");
    }

    addTrainingData(input, item) {//  (DataType, String)
     var data = {
            input: input,
            output: { [item] : 1 }
      }
      this.trainingData.push(data);
    }
}
var debugMode = true;

function debugLog(output) {
  if (debugMode) {
    console.log(output);
    return true;
  } else {
    return false;
  }
}
//------------------------------------------------------------

// const TrainingDat = [
//     {
//         input: "hello",
//         output: {bill: 1}
//     },
//     {
//         input: "wampy",
//         output: {melina: 1}
//     },
//     {
//         input: "hello",
//         output: {bill: 1}
//     },
//     {
//         input: "wampy",
//         output: {melina: 1}
//     },
// ]
//var ai = new Classifier(0.70, TrainingDat);
var ai = new Classifier(0.70);
// ai.learn();