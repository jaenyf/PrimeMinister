import { name, version } from '../../package.json';
import { initialize } from "../ui/dom.js";
import { createGraphState } from './state.js';

export function createApp(ui) {
    const app = {
        name: name,
        version: version,
        debug: false,
        ui: ui,
        graphState: createGraphState()
    };
    initialize(app);
    return app;
}