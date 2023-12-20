let appState = {
    spinnerDivId: '',
    newEmployeeData: {},
    newEmployeeGroupState: [],
    newEmployeeFilterState: [],
    leavingEmployeeData: {},
    leavingEmployeeGroupState: [],
    leavingEmployeeFilterState: [],
    employeeActivityData: {},
    employeeActivityGroupState: [],
    employeeActivityFilterState: [],
    employeeSummaryData: {},
    employeeSummaryGroupState: [],
    employeeSummaryFilterState: [],
};

export function setState(stateVar, stateMethod, value) {
    console.log('setState called')
    console.log('setState Params', stateVar, stateMethod, value)
    // Ensure appState is a valid object
    if (typeof appState !== 'object' || appState === null) {
        console.error('appState is not an object');
        return;
    }

    // Check if the state variable exists in appState using a safer approach
    if (!Object.prototype.hasOwnProperty.call(appState, stateVar)) {
        console.error(`State variable '${stateVar}' does not exist in appState.`);
        return;
    }

    // Set the default method to 'Update' if stateMethod is not provided or invalid
    const useMethod = ["Update", "Replace"].includes(stateMethod) ? stateMethod : "Update";

    // Handle different stateMethods
    switch (useMethod) {
        case "Update":
            if (Array.isArray(appState[stateVar])) {
                appState[stateVar].push(value);
            } else if (typeof appState[stateVar] === 'object' && appState[stateVar] !== null && !Array.isArray(value) && typeof value !== 'string') {
                // Ensure value is an object before using spread syntax
                appState[stateVar] = {...appState[stateVar], ...value};
            } else {
                appState[stateVar] = value;
            }
            break;
        case "Replace":
            appState[stateVar] = value;
            break;
        // ...
    }
    console.log('setState finished', appState)
}

export function getState() {
    return appState;
}
