



export function clearSpinner(id) {
    const spinnerDiv = document.getElementById(id);
    const spinnerId = id+'-spinner'
    let spinner = document.getElementById(spinnerId);
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = spinnerId;
        spinner.className = 'loader';

        // Append the spinner to the body or a specific container
        spinnerDiv.appendChild(spinner); 
    }
    spinner.style.display = 'none'; // Also hide the spinner
}

export function loadSpinner(id) {
    const spinnerDiv = document.getElementById(id);
    console.log(spinnerDiv);
    const spinnerId = id+'-spinner'
    let spinner = document.getElementById(spinnerId);
    // If the spinner doesn't exist, create it
    if (!spinnerDiv) {
        const error = `${id} does not exist on DOM`
        console.error(error);
        return error
    } else if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = spinnerId;
        spinner.className = 'loader';

        // Append the spinner to the body or a specific container
        spinnerDiv.appendChild(spinner); // or replace `document.body` with your specific container element
    }

    // Show the spinner
    console.log('Loading spinner...');
    spinner.style.display = 'block';
}

