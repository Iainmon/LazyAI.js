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



const TrainingDat = [
    {
        input: "By 2035, Africa will have the largest workforce in the world. Investing in young people’s health and education is the best way to make the most of this opportunity.",
        output: {bill: 1}
    },
    {
        input: "Selase Kove-Seyram traveled the route that tomatoes take from farm to table. Along the way, he learned how food — and untapped human potential — could hold the key to his country’s success",
        output: {bill: 1}
    },
    {
        input: "hello",
        output: {bill: 1}
    },
    {
        input: "wampy",
        output: {melina: 1}
    },
]
const BillGatesTraingData = [
    "Selase Kove-Seyram traveled the route that tomatoes take from farm to table. Along the way, he learned how food — and untapped human potential — could hold the key to his country’s success",
    "By 2035, Africa will have the largest workforce in the world. Investing in young people’s health and education is the best way to make the most of this opportunity.",
    "Can’t wait to catch up with @Trevornoah on @TheDailyShow tonight.",
    "We need energy breakthroughs that don’t contribute to climate change. Fellow innovators and investors: let’s do this.",
    "Young people like #Goalkeepers18 winners @NadiaMuradBasee, @AmikaGeorge, and Dysmus Kisilu aren’t just the leaders of tomorrow, they’re the leaders of today. I’m optimistic that global progress will continue—as long as we invest in young people.",
    "What’s in the #Goalkeepers18 report? More eye-popping charts like this one"
];
const TimCookTrainingData = [
    "Women’s voices are changing the world. We are inspired by the remarkable women our team met this week at Grace Hopper and we are proud to support GHC and its mission.",
    "iOS + @Salesforce = powerful tools and customer experiences right on iPhone and iPad. Changing the way business is done!",
    "These are breathtaking. Thanks to everyone posting their #shotoniphone photos!",
    "Stunning photos #shotoniphone this weekend by new iPhone XS and iPhone XS Max users!",
    "Thrilled to get these new Apple products into the hands (and onto the wrists) of so many customers around the world. Can’t wait to hear what you think!",
    "Thanks Apple Soho and to our team around the world for the hard work you’re doing this week and all year round! Can’t wait for Friday."
]