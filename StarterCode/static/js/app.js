const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// premise pending
const dataPromise = d3.json(url);
// console the data
console.log("Data Promise:", dataPromise);

// initiation function

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json(url).then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

// Initialize the dashboard
init();
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    

}
// Demographics Panel 
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        // Use d3 to select the panel with id of `#sample-metadata`
        var PANEL = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        PANEL.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        })

    })
};

//   building chart

function buildCharts(id) {

    d3.json(url).then((data) => {
        var samples = data.samples
        var sample_array = samples.filter(sample => sample.id == id)
        var sample_result = sample_array[0]
        console.log(sample_result)


        var metadata = data.metadata;
        console.log(metadata);

        var resultArray = metadata.filter(sampleObj => sampleObj.id == id);
        var result = resultArray[0];
        var washfreq = result.washfreq;

        var sample = data.samples
        var sampleResult = sample.filter(sampleObj => sampleObj.id == id)[0];
        console.log(sampleResult)
        var otu_ids = sampleResult.otu_ids;
        var otu_labels = sampleResult.otu_labels;
        var sample_values = sampleResult.sample_values;
        var yticks = otu_ids.slice(0, 10).reverse().map(otuid => `OTU ID ${otuid}`)

        // create the bar plot section

        var barPlot = [{

            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            type: 'bar',
            automargin:true,
            text: otu_labels,
            orientation: 'h'
        }];
        // create the layout section
        var Layout = {
            title: "Top 10 OTUs found in this individuals",
            xaxis: { title: "sample_values" },
            automargin:true,
            yaxis: { title: "OTUs IDs" }
        }
/
        Plotly.newPlot('bar', barPlot, Layout);

        // create the trace for the bubble chart

                var bubble_otu_ids = sample_result.otu_ids
                    // log it to the console
                console.log(bubble_otu_ids)
        
                // Fetch sample_values for the y values.
               
                var bubble_sample_values = sample_result.sample_values
                    // log it to the console
                console.log(bubble_sample_values)
                    // Fetch otu_labels for the text values.
                var bubble_otu_labels = sample_result.otu_labels
        
                // create a bubble chart 
                var plotBubble = [{
                    x: bubble_otu_ids,
                    y: bubble_sample_values,
                    mode: 'markers',
                    marker: {
                        size: bubble_sample_values,
                        color: bubble_sample_values,
                        colorscale: 'Earth',
                    },
                    text: bubble_otu_labels
                }];
        
                // plotting the layout
                var bubbleLayout = {
                    xaxis: { title: 'OTU ID' },
                    // automatic magin for the y axis
                    automargin: true,
                    // yaxis: { title: 'Sample Values' },
                    hovermode: 'closest',
                };
        
                // shows the bubble chart, the layout at the 'bubble' id in the index.html (DOM)
                Plotly.newPlot('bubble', plotBubble, bubbleLayout);
        
            //  })

            
    })
}