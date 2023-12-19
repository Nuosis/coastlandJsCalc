let appState = {
    newEmployeeData: {},
    newEmployeeGroupState: [],
    newEmployeeFilterState: [],
    leavingEmployeeData: {},
    leavingEmployeeGroupState: [],
    leavingEmployeeFilterState: [],
    employeeActivity: {},
    employeeActivityGroupState: [],
    employeeActivityFilterState: [],
    employeeSummary: {},
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
            // If the state variable is an array, push the value
            if (Array.isArray(appState[stateVar])) {
                appState[stateVar].push(value);
            } else if (typeof appState[stateVar] === 'object' && appState[stateVar] !== null) {
                // If it's an object, spread the new value into it
                appState[stateVar] = {...appState[stateVar], ...value};
            } else {
                // For primitive types, just update the value
                appState[stateVar] = value;
            }
            break;
        case "Replace":
            // Replace the entire state variable with the new value
            appState[stateVar] = value;
            break;
        default:
            console.error(`Invalid state method '${stateMethod}'`);
    }
    console.log('setState finished', appState)
}

export function getState() {
    return appState;
}
