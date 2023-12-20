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

    const filterDiv = document.getElementById('employeeActivityFilter');

    // Create select element
    const filterInput = document.createElement('select');
    filterInput.id = 'employeeActivityFilterInput';
    filterInput.className = 'select';
    filterInput.onchange = setEmployeeActivityFilterState; // Assuming this function is defined elsewhere

    // Create the default 'Select Value' option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Value';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    filterInput.appendChild(defaultOption);

    const fieldData = state.employeeActivityData.response.data;

    // Create a set to store unique values
    const uniqueValues = new Set();
    
    fieldData.forEach(record => {
        if (record.fieldData[valueKey]) {
            uniqueValues.add(record.fieldData[valueKey]);
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
    
    let button = document.getElementById('employeeActivityFilterStateButton');
    if (!button) {
        filterDiv.appendChild(filterInput);
    } else {
        filterDiv.insertBefore(filterInput, button);
    }
}

export function setEmployeeActivityFilterState(event) {
    // Get the selected value
    const selectedValue = event.target.value;
    const filterElement = document.getElementById('employeeActivityFilterSelection');
    const filterKey = filterElement ? filterElement.value : '';
    console.log(filterKey)
    const filterObject = {filterKey, selectedValue}


    // Set the selected value to state (assuming setState is available in the scope)
    setState('employeeActivityFilterState', 'Update',  filterObject);

    // Check for the button, create it if it doesn't exist
    let button = document.getElementById('employeeActivityFilterStateButton');
    if (!button) {
        button = document.createElement('button');
        button.id = 'employeeActivityFilterStateButton';
        button.textContent = 'clear selection';
        button.className = 'button sm';
        button.onclick = clearEmployeeActivityFilterState;

        const filterDiv = document.getElementById('employeeActivityFilter');
        if (filterDiv) {
            filterDiv.appendChild(button);
        }
    }

    // Call renderGroupBy (assuming it's defined)
    renderFilterBy();
}

function renderFilterBy() {
    const state = getState();
    const values = state.employeeActivityFilterState;
    console.log('renderFilter values', values);

    let filterByDiv = document.getElementById('employeeActivityFilterState');

    if (!filterByDiv) {
        filterByDiv = document.createElement('div');
        filterByDiv.id = 'employeeActivityFilterState';
        filterByDiv.className = 'chitDiv';

        const filterDiv = document.getElementById('employeeActivityFilter');
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
    const selectElement = document.getElementById('employeeActivityFilterSelection');
    if (selectElement) {
        selectElement.value = '';
    }
    // Remove the value element
    const filterInputElement = document.getElementById('employeeActivityFilterInput');
    if (filterInputElement) {
        filterInputElement.remove();
    }
}

function clearEmployeeActivityFilterState() {
    setState('employeeActivityFilterState', 'Replace', [])
    renderFilterBy()
    // Remove the button element
    const filterButtonElement = document.getElementById('employeeActivityFilterStateButton');
    if (filterButtonElement) {
        filterButtonElement.remove();
    }
}


/**
 * 
 * GROUP BY FUNCTIONS
 */

export function setEmployeeActivityGroupState(event) {
    // Get the selected value
    const selectedValue = event.target.value;
    console.log('eventValue', selectedValue)

    // Set the selected value to state (assuming setState is available in the scope)
    setState('employeeActivityGroupState', 'Update',  selectedValue);
    let currentState = getState()
    console.log('state after employeeActivityGroupState Update', currentState)

    // Check for the button, create it if it doesn't exist
    let button = document.getElementById('employeeActivityGroupStateButton');
    if (!button) {
        button = document.createElement('button');
        button.id = 'employeeActivityGroupStateButton';
        button.className = 'button sm';
        button.textContent = 'Clear selection';
        button.onclick = clearEmployeeActivityGroupState;

        const groupDiv = document.getElementById('employeeActivityGroup');
        if (groupDiv) {
            groupDiv.appendChild(button);
        }
    }

    // Call renderGroupBy (assuming it's defined)
    renderGroupBy();
}

function renderGroupBy() {
    const state = getState();
    const values = state.employeeActivityGroupState;
    console.log('renderGroup values', values);

    let groupByDiv = document.getElementById('employeeActivityGroupState');

    if (!groupByDiv) {
        groupByDiv = document.createElement('div');
        groupByDiv.id = 'employeeActivityGroupState';
        groupByDiv.className = 'chitDiv';

        const groupDiv = document.getElementById('employeeActivityGroup');
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
    const selectElement = document.getElementById('employeeActivityGroupSelection');
    if (selectElement) {
        selectElement.value = '';
    }
}

function clearEmployeeActivityGroupState() {
    setState('employeeActivityGroupState', 'Replace', [])
    renderGroupBy()
    // Remove the button element
    const groupButtonElement = document.getElementById('employeeActivityGroupStateButton');
    if (groupButtonElement) {
        groupButtonElement.remove();
    }
}