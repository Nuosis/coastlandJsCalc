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

    const filterDiv = document.getElementById('leavingEmployeeFilter');

    // Create select element
    const filterInput = document.createElement('select');
    filterInput.id = 'leavingEmployeeFilterInput';
    filterInput.className = 'select';
    filterInput.onchange = setLeavingEmployeeFilterState; // Assuming this function is defined elsewhere

    // Create the default 'Select Value' option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Value';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    filterInput.appendChild(defaultOption);

    const fieldData = state.leavingEmployeeData.response.data;

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
    
    let button = document.getElementById('leavingEmployeeFilterStateButton');
    if (!button) {
        filterDiv.appendChild(filterInput);
    } else {
        filterDiv.insertBefore(filterInput, button);
    }
}

export function setLeavingEmployeeFilterState(event) {
    // Get the selected value
    const selectedValue = event.target.value;
    const filterElement = document.getElementById('leavingEmployeeFilterSelection');
    const filterKey = filterElement ? filterElement.value : '';
    console.log(filterKey)
    const filterObject = {filterKey, selectedValue}


    // Set the selected value to state (assuming setState is available in the scope)
    setState('leavingEmployeeFilterState', 'Update',  filterObject);

    // Check for the button, create it if it doesn't exist
    let button = document.getElementById('leavingEmployeeFilterStateButton');
    if (!button) {
        button = document.createElement('button');
        button.id = 'leavingEmployeeFilterStateButton';
        button.textContent = 'clear selection';
        button.className = 'button sm';
        button.onclick = clearLeavingEmployeeFilterState;

        const filterDiv = document.getElementById('leavingEmployeeFilter');
        if (filterDiv) {
            filterDiv.appendChild(button);
        }
    }

    // Call renderGroupBy (assuming it's defined)
    renderFilterBy();
}

function renderFilterBy() {
    const state = getState();
    const values = state.leavingEmployeeFilterState;
    console.log('renderFilter values', values);

    let filterByDiv = document.getElementById('leavingEmployeeFilterState');

    if (!filterByDiv) {
        filterByDiv = document.createElement('div');
        filterByDiv.id = 'leavingEmployeeFilterState';
        filterByDiv.className = 'chitDiv';

        const filterDiv = document.getElementById('leavingEmployeeFilter');
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
    const selectElement = document.getElementById('leavingEmployeeFilterSelection');
    if (selectElement) {
        selectElement.value = '';
    }
    // Remove the value element
    const filterInputElement = document.getElementById('leavingEmployeeFilterInput');
    if (filterInputElement) {
        filterInputElement.remove();
    }
}

function clearLeavingEmployeeFilterState() {
    setState('leavingEmployeeFilterState', 'Replace', [])
    renderFilterBy()
    // Remove the button element
    const filterButtonElement = document.getElementById('leavingEmployeeFilterStateButton');
    if (filterButtonElement) {
        filterButtonElement.remove();
    }
}


/**
 * 
 * GROUP BY FUNCTIONS
 */

export function setLeavingEmployeeGroupState(event) {
    // Get the selected value
    const selectedValue = event.target.value;
    console.log('eventValue', selectedValue)

    // Set the selected value to state (assuming setState is available in the scope)
    setState('leavingEmployeeGroupState', 'Update',  selectedValue);
    let currentState = getState()
    console.log('state after leavingEmployeeGroupState Update', currentState)

    // Check for the button, create it if it doesn't exist
    let button = document.getElementById('leavingEmployeeGroupStateButton');
    if (!button) {
        button = document.createElement('button');
        button.id = 'leavingEmployeeGroupStateButton';
        button.className = 'button sm';
        button.textContent = 'Clear selection';
        button.onclick = clearLeavingEmployeeGroupState;

        const groupDiv = document.getElementById('leavingEmployeeGroup');
        if (groupDiv) {
            groupDiv.appendChild(button);
        }
    }

    // Call renderGroupBy (assuming it's defined)
    renderGroupBy();
}

function renderGroupBy() {
    const state = getState();
    const values = state.leavingEmployeeGroupState;
    console.log('renderGroup values', values);

    let groupByDiv = document.getElementById('leavingEmployeeGroupState');

    if (!groupByDiv) {
        groupByDiv = document.createElement('div');
        groupByDiv.id = 'leavingEmployeeGroupState';
        groupByDiv.className = 'chitDiv';

        const groupDiv = document.getElementById('leavingEmployeeGroup');
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
    const selectElement = document.getElementById('leavingEmployeeGroupSelection');
    if (selectElement) {
        selectElement.value = '';
    }
}

function clearLeavingEmployeeGroupState() {
    setState('leavingEmployeeGroupState', 'Replace', [])
    renderGroupBy()
    // Remove the button element
    const groupButtonElement = document.getElementById('leavingEmployeeGroupStateButton');
    if (groupButtonElement) {
        groupButtonElement.remove();
    }
}