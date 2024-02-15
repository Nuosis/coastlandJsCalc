import {getState} from './state.js'
import {renderChart} from './charts.js'

const state = getState()

export function transformData(responseData) {
    // Check if responseData is in the expected format
    if (!responseData || !Array.isArray(responseData.response.data)) {
        console.error('Invalid responseData: Expected responseData.data to be an array');
        return []; // or throw new Error('Invalid format');
    }

    // Map over the data array and extract fieldData from each item
    const transformedData = responseData.response.data.map(item => {
        // Assuming fieldData is an object that you want directly
        // If fieldData is not structured as expected, you might need additional checks or transformations here
        return item.fieldData;
    });

    return transformedData
}

function groupByKey(stateData, stateGroupBy) {
    console.log('groupBy Called')
    console.log('groupBy Prop', stateGroupBy)
    console.log('groupBy Data', JSON.stringify(stateData))
    
    let dataArray;

    // Check if stateData is directly an array
    if (Array.isArray(stateData)) {
        dataArray = stateData;
    }
    // If neither is true, log an error and return
    else {
        console.error('Invalid stateData: Expected an array either as stateData or within stateData.response.data');
        return {}; // Depending on your needs, you might throw an error instead
    }
    
    // Function to create the group key based on the specified fields
    const createGroupKey = (item) => {
        console.log("Item fields:", stateGroupBy.map(field => `${field}: ${item[field]}`));    
        return stateGroupBy.map(field => item[field]).join(' - ');
    };
    

    // Use a custom grouping logic as Object.groupBy() may not be standard
    const groupedData = dataArray.reduce((acc, item) => {
        const groupKey = createGroupKey(item);
        console.log("groupKey: ",groupKey)
        // Initialize the group array if it doesn't exist
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        // Push the current item into the group array
        acc[groupKey].push(item);
        return acc;
    }, {});

    return groupedData;
}

function filterByKeyValue(stateData, filterState) {
    if (!filterState || filterState.length === 0) {
        return stateData;
    }
    // const dataItems = stateData.map(item => item.fieldData);

    // Filter function based on the filterState criteria
    const applyFilter = (item) => {
        // Check if the item satisfies all conditions in the filterState
        return filterState.every(filter => item[filter.key] === filter.value);
    };

    // Apply the filter to the data items
    const filteredData = stateData.filter(applyFilter);

    return filteredData;
}

export function processState() {
    console.log('Process State Called')
    console.log('current state:', state)
    const newState = {};

    // Iterating over each key in the state object
    for (const key in state) {
        if (Object.prototype.hasOwnProperty.call(state, key)) {
            const dataKey = key; // e.g., 'newEmployeeData'
            const baseKey = dataKey.replace(/Data$/, '')
            //console.log('baseKey', baseKey)
            //console.log('dataKey', dataKey)
            if (dataKey === baseKey) {
                //console.log(`${key} is not significant`);
                continue; // Skip to the next key
            }
            const filterStateKey = baseKey + 'FilterState'; // e.g., 'newEmployeeFilterState'
            const groupStateKey = baseKey + 'GroupState'; // e.g., 'newEmployeeGroupState'
            //console.log('state keys', baseKey, dataKey, filterStateKey, groupStateKey)

            // Check if the data object is not empty
            if (Object.keys(state[dataKey]).length !== 0) {
                //console.log(`${state[dataKey]} Exists`)
                // Apply filterByKeyValue and groupByKey functions
                const filteredData = filterByKeyValue(state[dataKey], state[filterStateKey]);
                console.log('filteredData ', filteredData)
                const groupedData = groupByKey(filteredData, state[groupStateKey]);
                console.log('groupedData ', groupedData)

                // Store the result back into the new state
                newState[baseKey] = groupedData;
                // Get the selected value from the corresponding DOM element
                const reportSelectionElement = document.getElementById(baseKey + 'ReportSelection');
                if (reportSelectionElement) {
                    newState[baseKey].reportSelection = reportSelectionElement.value;
                }
            }
        }
    }
    console.log('newState Object',newState)

    for (const key in newState) {
        if (Object.prototype.hasOwnProperty.call(newState, key)) {
            // Get the chart type from reportSelection (e.g., 'pie')
            const chartType = newState[key].reportSelection;
            if (!chartType || chartType.length === 0){
                // no chart type was indicated. exit out
                console.log("no chart type selected")
                alert ("no chart type selected")
                return newState
            }
    
            // Create a new object with all properties from newState[key] except reportSelection
            const { reportSelection, ...chartData } = newState[key];
            //console.log("reportSelection: ", reportSelection)
    
            // Extract the canvas ID for the chart
            const canvasId = `${key}ChartCanvas`;
            //console.log("canvasId: ", canvasId)
            //console.log("key: ", key)
            //console.log("chartType: ", chartType)
            //console.log("chartData: ", JSON.stringify(chartData))
    
            // Render the chart
            renderChart(chartData, chartType, key, canvasId);
        }
    }

    return newState;
}


/*
const processedState = processState(State);
console.log(processedState);
*/