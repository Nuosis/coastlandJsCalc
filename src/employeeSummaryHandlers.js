import {setState, getState} from './state.js'

const state = getState()

/**
 * 
 * FILTER BY FUNCTIONS
 */

export function renderFilterValueInput(event) {
    console.log('renderFilterValueInput');
    // Get the selected value
    const valueKey = event.target.value;

    const filterDiv = document.getElementById('employeeSummaryFilter');

    // Create select element
    const filterInput = document.createElement('select');
    filterInput.id = 'employeeSummaryFilterInput';
    filterInput.className = 'select';
    filterInput.onchange = setEmployeeSummaryFilterState; // Assuming this function is defined elsewhere

    // Create the default 'Select Value' option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Value';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    filterInput.appendChild(defaultOption);

    const fieldData = state.employeeSummaryData;

    // Create a set to store unique values
    const uniqueValues = new Set();
    
    fieldData.forEach(record => {
        if (record[valueKey]) {
            uniqueValues.add(record[valueKey]);
        }
    });
    
    // Now create options from the unique values
    uniqueValues.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.className = 'option';
        option.textContent = value;
        filterInput.appendChild(option);
    });
    
    let button = document.getElementById('employeeSummaryFilterStateButton');
    if (!button) {
        filterDiv.appendChild(filterInput);
    } else {
        filterDiv.insertBefore(filterInput, button);
    }
}

export function setEmployeeSummaryFilterState(event) {
    // Get the selected value
    const selectedValue = event.target.value;
    const filterElement = document.getElementById('employeeSummaryFilterSelection');
    const filterKey = filterElement ? filterElement.value : '';
    console.log(filterKey)
    const filterObject = {filterKey, selectedValue}


    // Set the selected value to state (assuming setState is available in the scope)
    setState('employeeSummaryFilterState', 'Update',  filterObject);

    // Check for the button, create it if it doesn't exist
    let button = document.getElementById('employeeSummaryFilterStateButton');
    if (!button) {
        button = document.createElement('button');
        button.id = 'employeeSummaryFilterStateButton';
        button.textContent = 'clear selection';
        button.className = 'button sm';
        button.onclick = clearEmployeeSummaryFilterState;

        const filterDiv = document.getElementById('employeeSummaryFilter');
        if (filterDiv) {
            filterDiv.appendChild(button);
        }
    }

    // Call renderGroupBy (assuming it's defined)
    renderFilterBy();
}

function renderFilterBy() {
    const state = getState();
    const values = state.employeeSummaryFilterState;
    console.log('renderFilter values', values);

    let filterByDiv = document.getElementById('employeeSummaryFilterState');

    if (!filterByDiv) {
        filterByDiv = document.createElement('div');
        filterByDiv.id = 'employeeSummaryFilterState';
        filterByDiv.className = 'chitDiv';

        const filterDiv = document.getElementById('employeeSummaryFilter');
        if (filterDiv) {
            filterDiv.prepend(filterByDiv);
        } else {
            // Handle case where groupDiv does not exist
            console.error('filterDiv not found in the DOM');
            return;
        }
    } else {
        // Clear inner HTML
        filterByDiv.innerHTML = '';
    }

    // Check that values is not empty
    if (values && values.length > 0) {
        // Create and append the label element
        const label = document.createElement('label');
        label.className = 'chitLabel';
        label.textContent = 'Get records where:';
        filterByDiv.appendChild(label);

        // Filter out duplicate values
        const uniqueValues = [...new Set(values.map(JSON.stringify))].map(JSON.parse);

        // Create and append the chitValues element
        const chitValues = document.createElement('div');
        chitValues.className = 'chitValues';

        // Transform each object into a string representation
        chitValues.innerHTML = uniqueValues.map((value) => {
            return `${value.filterKey} is ${value.selectedValue}`;
        }).join(' & ');
        
        filterByDiv.appendChild(chitValues);
    }

    // Reset the key element
    const selectElement = document.getElementById('employeeSummaryFilterSelection');
    if (selectElement) {
        selectElement.value = '';
    }
    // Remove the value element
    const filterInputElement = document.getElementById('employeeSummaryFilterInput');
    if (filterInputElement) {
        filterInputElement.remove();
    }
}

function clearEmployeeSummaryFilterState() {
    setState('employeeSummaryFilterState', 'Replace', [])
    renderFilterBy()
    // Remove the button element
    const filterButtonElement = document.getElementById('employeeSummaryFilterStateButton');
    if (filterButtonElement) {
        filterButtonElement.remove();
    }
}


/**
 * 
 * GROUP BY FUNCTIONS
 */

export function setEmployeeSummaryGroupState(event) {
    // Get the selected value
    const selectedValue = event.target.value;
    console.log('eventValue', selectedValue)

    // Set the selected value to state (assuming setState is available in the scope)
    setState('employeeSummaryGroupState', 'Update',  selectedValue);
    let currentState = getState()
    console.log('state after employeeSummaryGroupState Update', currentState)

    // Check for the button, create it if it doesn't exist
    let button = document.getElementById('employeeSummaryGroupStateButton');
    if (!button) {
        button = document.createElement('button');
        button.id = 'employeeSummaryGroupStateButton';
        button.className = 'button sm';
        button.textContent = 'Clear selection';
        button.onclick = clearEmployeeSummaryGroupState;

        const groupDiv = document.getElementById('employeeSummaryGroup');
        if (groupDiv) {
            groupDiv.appendChild(button);
        }
    }

    // Call renderGroupBy (assuming it's defined)
    renderGroupBy();
}

function renderGroupBy() {
    const state = getState();
    const values = state.employeeSummaryGroupState;
    console.log('renderGroup values', values);

    let groupByDiv = document.getElementById('employeeSummaryGroupState');

    if (!groupByDiv) {
        groupByDiv = document.createElement('div');
        groupByDiv.id = 'employeeSummaryGroupState';
        groupByDiv.className = 'chitDiv';

        const groupDiv = document.getElementById('employeeSummaryGroup');
        if (groupDiv) {
            groupDiv.prepend(groupByDiv);
        } else {
            // Handle case where groupDiv does not exist
            console.error('groupDiv not found in the DOM');
            return;
        }
    } else {
        // Clear inner HTML
        groupByDiv.innerHTML = '';
    }

    // Check that values is not empty
    if (values && values.length > 0) {
        // Create and append the label element
        const label = document.createElement('label');
        label.className = 'chitLabel';
        label.textContent = 'Group By:';
        groupByDiv.appendChild(label);

        // Create and append the chitValues element
        const chitValues = document.createElement('div');
        chitValues.className = 'chitValues';
        chitValues.innerHTML = values.map((value, index) => {
            return index < values.length - 1 ? value + ', ' : value;
        }).join('');
        groupByDiv.appendChild(chitValues);
    }

    // Reset the select element
    const selectElement = document.getElementById('employeeSummaryGroupSelection');
    if (selectElement) {
        selectElement.value = '';
    }
}

function clearEmployeeSummaryGroupState() {
    setState('employeeSummaryGroupState', 'Replace', [])
    renderGroupBy()
    // Remove the button element
    const groupButtonElement = document.getElementById('employeeSummaryGroupStateButton');
    if (groupButtonElement) {
        groupButtonElement.remove();
    }
}