import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {jsPDF} from 'jspdf'

Chart.register(ChartDataLabels);

const chartTypes=['bar','pie','line']

function camelCaseToTitleCase(camelCase) {
    if (camelCase === null || camelCase === '') {
        return camelCase;
    }

    camelCase = camelCase.trim();
    var newText = "";
    for (var i = 0; i < camelCase.length; i++) {
        if (/[A-Z]/.test(camelCase[i]) && i !== 0 && /[a-z]/.test(camelCase[i-1])) {
            newText += " ";
        }
        newText += camelCase[i];
    }

    return newText.replace(/^\w/, c => c.toUpperCase()); // Capitalize the first letter
}

function prepData(data, title, type) {
    const chartColours = [
        { name: "Dusty Blue", rgb: "rgb(108, 142, 191)" },
        { name: "Sea Green", rgb: "rgb(95, 158, 160)" },
        { name: "Warm Yellow", rgb: "rgb(204, 173, 96)" },
        { name: "Muted Orange", rgb: "rgb(204, 136, 99)" },
        { name: "Soft Red", rgb: "rgb(188, 95, 95)" },
        { name: "Blush Pink", rgb: "rgb(217, 160, 163)" },
        { name: "Sky Blue", rgb: "rgb(135, 206, 235)" },        
        { name: "Taupe", rgb: "rgb(139, 125, 107)" },
        { name: "Soft Green", rgb: "rgb(106, 163, 137)" },
        { name: "Lavender", rgb: "rgb(150, 122, 182)" },
        { name: "Slate Gray", rgb: "rgb(112, 128, 144)" },
        { name: "Mauve", rgb: "rgb(153, 102, 153)" },
    ];
    const labels = [];
    const dataPoints = [];
    const backgroundColors = [];

    let i = 0;
    for (const key in data) {
        // Use call to safely access hasOwnProperty
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            labels.push(key);
            dataPoints.push(data[key].length); // Assuming you want the count of items in the array

            // Use chartColours, cycle back to start if there are more data points than colors
            backgroundColors.push(chartColours[i % chartColours.length].rgb);

            i++;
        }
    }

    let dataSet, options;

    // Dataset configuration
    if (type === 'bar' || type === 'pie') {
        dataSet = {
            label: 'chart data',
            labels: labels,
            datasets: [{
                data: dataPoints,
                backgroundColor: backgroundColors
            }]
        };
    } else if (type === 'line') {
        dataSet = {
            labels: labels,
            datasets: [{
                label: 'line chart data',
                data: dataPoints,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: backgroundColors
            }]
        };
    }

    // Options
    if (type == 'bar') {
        options = {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: camelCaseToTitleCase(title),
                    font: {
                        size: 24 // Set the title font size to 24px
                    }
                }
            }
        };
    } else if (type == 'pie') {
        options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: camelCaseToTitleCase(title),
                    font: {
                        size: 24 // Set the title font size to 24px
                    }
                },
                datalabels: {
                    display: true,
                    color: '#fff', // Set the color of the label text
                    formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map(data => {
                            sum += data;
                        });
                        let percentage = (value*100 / sum).toFixed(2)+"%";
                        return percentage;
                    }
                }
            }
        };
    } else if (type == 'line') {
        options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                title: {
                    display: true,
                    text: camelCaseToTitleCase(title),
                    font: {
                        size: 24 // Set the title font size to 24px
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            elements: {
                line: {
                    tension: 0.4 // This makes the line curved. Set to 0 for no curve.
                },
                point: {
                    radius: 5 // Adjust the size of the point markers.
                }
            },
            animation: {
                duration: 2000, // The number of milliseconds an animation takes.
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
        };
    }        

    // Construct the final object
    if (!dataSet || !options) {
        console.error('Missing dataSet or options for chart type:', type);
        return null; // Handle the error appropriately.
    }

    const obj = { dataSet, options };
    return obj;
}

function addPrintButton(chartDiv, chartCanvas) {
    let printButton = document.getElementById('button'+chartCanvas.id)
    if(!printButton){
    let printButton = document.createElement('button');
    printButton.innerText = 'Print Chart';
    printButton.className = 'button m';
    printButton.id = 'button'+chartCanvas.id;
    printButton.onclick = function () {
        getChartBase64(chartCanvas.id);
    };
    chartDiv.appendChild(printButton);
}
}

function printChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas not found:', canvasId);
        return;
    }

    // Create a jsPDF instance in portrait orientation
    // 'p' stands for portrait, 'mm' is the unit, and 'a4' is the format
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    // Calculate the width and height to fit the chart within the A4 size
    // A4 dimensions in mm are approximately 210mm x 297mm
    // Adjusting the chart size to fit within the PDF, maintaining aspect ratio
    let imgWidth = 190; // width in mm; 210mm full width minus margins
    let imgHeight = canvas.height * imgWidth / canvas.width;

    // Ensure the image height doesn't exceed the PDF page size
    const pageHeight = 280; // slightly less than 297mm to account for margins
    if (imgHeight > pageHeight) {
        imgHeight = pageHeight;
        imgWidth = imgHeight * canvas.width / canvas.height;
    }

    // Convert the canvas to a data URL and add it to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight); // 10mm margin from the left and top edges

    // Save the PDF
    pdf.save(`${canvasId}.pdf`);
}

function getChartBase64(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas not found:', canvasId);
        return null;
    }
    // Convert the canvas to a data URL (base64 encoded PNG image)
    const base64Image = canvas.toDataURL('image/png');
    FileMaker.PerformScript('* Employee Report * JScallback', JSON.stringify({"path":"base64", image:base64Image}));
}

// Function to render a chart
export function renderChart(data, type, title, canvasId) {
    console.log('render charts called')
    //console.log('chart props:', data, type, title, canvasId)

    // check against chartTypes enabled
    if (!chartTypes.includes(type)) {
        const error = `Chart type '${type}' is not enabled.`;
        console.error(error);
        return error;
    }

    // Prep Canvas
    let canvas = document.getElementById(canvasId);
    let chartDiv = document.getElementById('charts');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = canvasId;
        canvas.width = 500;
        canvas.className = 'canvas-' + type; // This will create a class like 'canvas-bar' or 'canvas-line'
        canvas.style.maxWidth = '500px'; 
        canvas.style.maxHeight = '500px'; 
        let chartDiv = document.getElementById('charts');
        if (chartDiv) {
            chartDiv.appendChild(canvas);
        } else {
            console.error('No div with ID "canvas" found.');
            return;
        }
    }


    addPrintButton(chartDiv, canvas);

    // Clear previous chart if it exists
    if (canvas.chartInstance) {
        canvas.chartInstance.destroy();
    }


    // prep data for chart type
    const {dataSet, options} = prepData(data, title, type)
    //console.log('chart dataSet:', dataSet)
    //console.log('chart options:', options)

    // Now create the chart from prepped data
    if (!dataSet || !options) {
        // Handle the error case where prepData did not return a valid object
        return `Missing dataSet or options for chart ${type}`;
    } 
    const chart = new Chart(canvas.getContext('2d'), {
        type: type,
        data: dataSet,
        options: options
    });

    // Store the chart instance for potential future use
    canvas.chartInstance = chart;
}

// Example usage:
// renderChart(data, 'bar', 'reportCanvas');
