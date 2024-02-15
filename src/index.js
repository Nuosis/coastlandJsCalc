import {newEmployee} from './newEmployeeElements'
import {leavingEmployee} from './leavingEmployeeElements'
import {employeeSummary} from './employeeSummaryElements'
import {employeeActivity} from './employeeActivityElements'

//INCLUDE ALL FUNCTIONS CALLABLE BY FILEMAKER
window.summarizeKey = (data) => {
    // Parse the input data
    const obj = JSON.parse(data);
    const jsonData = obj.jsonData.response.data;
    const summaryKey = obj.summaryKey; // 'Site'
    const subSummaries = obj.subSummaries; // ['Status']
    const path = obj.path;
    const recordCount = obj.jsonData.response.dataInfo.foundCount;
    const summary = { path,recordCount };

    // Iterate through each item in the JSON array
    jsonData.forEach(item => {
        let summaryValue = item.fieldData[summaryKey] || "Unset"; // Site value or 'Unset'

        // Initialize the summary key if not already present
        if (!summary[summaryValue]) {
            summary[summaryValue] = {};
            if (subSummaries && Array.isArray(subSummaries)) {
                subSummaries.forEach(subKey => {
                    summary[summaryValue][subKey] = { count: 0, records: [] };
                });
            }
        }

        // Check if subSummaries is defined and is an array
        if (subSummaries && Array.isArray(subSummaries)) {
            // Update counts and records for each subSummary key
            subSummaries.forEach(subKey => {
                let subValue = item.fieldData[subKey];
                subValue = subValue ? subValue : "Unset"; // Use "Unset" if subValue is empty
                if (!summary[summaryValue][subValue]) {
                    summary[summaryValue][subValue] = { count: 0, records: [] };
                }
                summary[summaryValue][subValue].count++;
                summary[summaryValue][subValue].records.push(item.fieldData);
            });
        } else {
            // Increment the count for the summaryValue if no subSummaries
            if (typeof summary[summaryValue] === 'number') {
                summary[summaryValue]++;
            }
        }
    });

    console.log(JSON.stringify(summary));
    FileMaker.PerformScript("* Employee Report * JScallback", JSON.stringify(summary));
    return summary;
}

window.newEmployeeData = (data) => {
    // Parse the input data from fileMaker
    const obj = JSON.parse(data);
    console.log(obj)
    // Send to elements generation function
    newEmployee(obj)

}

window.leavingEmployeeData = (data) => {
    // Parse the input data from fileMaker
    const obj = JSON.parse(data);
    console.log(obj)
    // Send to elements generation function
    leavingEmployee(obj)

}

window.employeeActivityData = (data) => {
    // Parse the input data from fileMaker
    const obj = JSON.parse(data);
    console.log(obj)
    // Send to elements generation function
    employeeActivity(obj)

}

window.employeeSummaryData = (data) => {
    // Parse the input data from fileMaker
    const obj = JSON.parse(data);
    console.log(obj)
    // Send to elements generation function
    employeeSummary(obj)

}


//BUILD OUT INIT UI
//|------------------new employee section------------------|
//get/build components in newEmpoyeeElemnts.js
//get all handle/submit functions newEmployeeHandlers.js

//Expose function to load newEmployee Data
newEmployee()
leavingEmployee()
employeeActivity()
employeeSummary()

console.log('version 1.0.2')






