import {setState, getState} from './state.js'
import {setNewEmployeeGroupState, renderFilterValueInput} from './newEmployeeHandlers.js'

const state = getState()

export function newEmployee(data) {
    let newEmployeeDiv = document.getElementById('newEmployee');

    // Create the div if it doesn't exist
    if (!newEmployeeDiv) {
        newEmployeeDiv = document.createElement('div');
        newEmployeeDiv.id = 'newEmployee';
        newEmployeeDiv.className = 'display';

        const rootDiv = document.getElementById('root');
        rootDiv.appendChild(newEmployeeDiv);

        // Create the initial button
        const button = document.createElement('button');
        button.textContent = 'Get new employee data';
        button.className = 'button';
        button.onclick = function() {
            FileMaker.PerformScript('* Employee Report * JScallback', '{"path":"getNewEmployeeData"}');
        };
        newEmployeeDiv.appendChild(button);
    } else if (document.querySelector('#newEmployee .button')) {
        // If the button exists, clear the div
        newEmployeeDiv.innerHTML = '';

        // Create and append the H3 element
        const h3 = document.createElement('h3');
        h3.textContent = 'New Employee';
        h3.style.margin = '5px';
        newEmployeeDiv.appendChild(h3);
    }

    // Create a dropdown if data is provided
    if (data) {
        setState('newEmployeeData', 'Replace', data);

        /**
         * GROUP DIV
         */
        // Check if the group div exists, create it if not
        let groupDiv = document.getElementById('newEmployeeGroup');
        if (!groupDiv) {
            groupDiv = document.createElement('div');
            groupDiv.id = 'newEmployeeGroup';
            groupDiv.className = 'group';
            newEmployeeDiv.appendChild(groupDiv);
        } 

        // create the dropdown
        const select = document.createElement('select');
            select.id = 'newEmployeeGroupSelection';
            select.className = 'select';
            select.onchange = setNewEmployeeGroupState;

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
        let filterDiv = document.getElementById('newEmployeeFilter');
        if (!filterDiv) {
            filterDiv = document.createElement('div');
            filterDiv.id = 'newEmployeeFilter';
            filterDiv.className = 'filter';
            newEmployeeDiv.appendChild(filterDiv);
        } 

        // create the dropdown
        const filter = document.createElement('select');
        filter.id = 'newEmployeeFilterSelection';
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
         * SUBMIT DIV (if not already created)
         */
        // Check and create submitDiv if it does not exist
        let submitDiv = document.getElementById('submit');
        if (!submitDiv) {
            submitDiv = document.createElement('div');
            submitDiv.id = 'submit';

            const rootDiv = document.getElementById('root');

            // Create the 'Generate Report' button
            const reportButton = document.createElement('button');
            reportButton.textContent = 'Generate Report';
            reportButton.className = 'button';
            reportButton.onclick = function() {
                FileMaker.PerformScript('* Employee Report * JScallback', '{"path":"submitReportData"}');
            };

            submitDiv.appendChild(reportButton);
            rootDiv.appendChild(submitDiv);
        }
    }

}
