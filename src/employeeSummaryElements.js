import {getState, setState} from './state.js'
import {setEmployeeSummaryGroupState, renderFilterValueInput} from './employeeSummaryHandlers.js'
import {processState} from './dataProcessing.js'
import {clearSpinner} from './loadAnimations.js'
import {performFilemakerScript} from './filemaker.js'

const state = getState()

// const state = getState()

export function employeeSummary(data) {
    let employeeSummaryDiv = document.getElementById('employeeSummary');

    // Create the div if it doesn't exist
    if (!employeeSummaryDiv) {
        employeeSummaryDiv = document.createElement('div');
        employeeSummaryDiv.id = 'employeeSummary';
        employeeSummaryDiv.className = 'display';
        const headerDiv = document.getElementById('header');
        headerDiv.appendChild(employeeSummaryDiv);

        // Create the initial button
        const button = document.createElement('button');
        button.textContent = 'Get employee summary data';
        button.className = 'button';
        button.onclick = () => performFilemakerScript('employeeSummary','getEmployeeSummaryData');
        employeeSummaryDiv.appendChild(button);
    } else if (document.querySelector('#employeeSummary .button')) {
        // If the button exists, clear the div
        employeeSummaryDiv.innerHTML = '';

        // Create and append the H3 element
        const h3 = document.createElement('h3');
        h3.textContent = 'Active Employee Summary';
        h3.style.margin = '5px';
        employeeSummaryDiv.appendChild(h3);
    }

    // Create a dropdown if data is provided
    if (data) {
        clearSpinner(state.spinnerDivId)
        setState('spinnerDivId', 'Replace', '');
        setState('employeeSummaryData', 'Replace', data);

        /**
         * GROUP DIV
         */
        // Check if the group div exists, create it if not
        let groupDiv = document.getElementById('employeeSummaryGroup');
        if (!groupDiv) {
            groupDiv = document.createElement('div');
            groupDiv.id = 'employeeSummaryGroup';
            groupDiv.className = 'group';
            employeeSummaryDiv.appendChild(groupDiv);
        } 

        // create the dropdown
        const select = document.createElement('select');
            select.id = 'employeeSummaryGroupSelection';
            select.className = 'select';
            select.onchange = setEmployeeSummaryGroupState;

            // Create the default 'drop down' options
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Group By';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            select.appendChild(defaultOption);

            // Create an option for each key in the fieldData object
            Object.keys(data.response.data[0].fieldData).forEach(key => {
                const option = document.createElement('option');
                option.value = key;
                option.className = 'option';
                option.textContent = key;
                select.appendChild(option);
            });
        groupDiv.appendChild(select);

        /**
         * FILTER DIV
         */
        // Check if the group div exists, create it if not
        let filterDiv = document.getElementById('employeeSummaryFilter');
        if (!filterDiv) {
            filterDiv = document.createElement('div');
            filterDiv.id = 'employeeSummaryFilter';
            filterDiv.className = 'filter';
            employeeSummaryDiv.appendChild(filterDiv);
        } 

        // create the dropdown
        const filter = document.createElement('select');
        filter.id = 'employeeSummaryFilterSelection';
        filter.className = 'select';
        filter.onchange = renderFilterValueInput;

        // Create the default 'drop down' options
        const filterOption = document.createElement('option');
        filterOption.value = '';
        filterOption.textContent = 'Filter By';
        filterOption.disabled = true;
        filterOption.selected = true;
        filter.appendChild(filterOption);

        // Create an option for each key in the fieldData object
        Object.keys(data.response.data[0].fieldData).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.className = 'option';
            option.textContent = key;
            filter.appendChild(option);
        });
        filterDiv.appendChild(filter);

        /**
         * DISPLAY DIV
         */
        // Check if the group div exists, create it if not
        let reportTypeDiv = document.getElementById('employeeSummaryReportType');
        if (!reportTypeDiv) {
            reportTypeDiv = document.createElement('div');
            reportTypeDiv.id = 'employeeSummaryReportType';
            reportTypeDiv.className = 'group';
            employeeSummaryDiv.appendChild(reportTypeDiv);
        } 

        // create the dropdown
        const reportType = document.createElement('select');
        reportType.id = 'employeeSummaryReportSelection';
        reportType.className = 'select';

        // Create the default 'drop down' options
        const reportTypeOption = document.createElement('option');
        reportTypeOption.value = '';
        reportTypeOption.textContent = 'Report Type';
        reportTypeOption.disabled = true;
        reportTypeOption.selected = true;
        reportType.appendChild(reportTypeOption);       
        
        // Create an option for each key provided
        Object.values(['accordian','pie','bar','line']).forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.className = 'option';
            option.textContent = value;
            reportType.appendChild(option);
        });

        reportTypeDiv.appendChild(reportType);

        /**
         * PRESENT OPTIONS DIV
         */

        /**
         * SUBMIT DIV (if not already created)
         */
        // Check and create submitDiv if it does not exist
        let submitDiv = document.getElementById('submit');
        if (!submitDiv) {
            submitDiv = document.createElement('div');
            submitDiv.id = 'submit';

            const reportDiv = document.getElementById('report');

            // Create the 'Generate Report' button
            const reportButton = document.createElement('button');
            reportButton.textContent = 'Generate Report';
            reportButton.className = 'button';
            reportButton.onclick = processState;

            submitDiv.appendChild(reportButton);
            reportDiv.appendChild(submitDiv);
        }

        let chartDiv = document.getElementById('charts');
        if (!chartDiv) {
            const reportDiv = document.getElementById('report');
            chartDiv = document.createElement('div');
            chartDiv.id = 'charts';
            reportDiv.appendChild(chartDiv);
        }
    }

}
