import {loadSpinner, clearSpinner} from './loadAnimations.js'
import {setState} from './state.js'
// const state = getState()


export function performFilemakerScript(divId, path) {
    setState('spinnerDivId','Replace', divId)
    clearSpinner(divId)
    loadSpinner(divId)
    FileMaker.PerformScript('* Employee Report * JScallback', `{"path":"${path}"}`);
}
