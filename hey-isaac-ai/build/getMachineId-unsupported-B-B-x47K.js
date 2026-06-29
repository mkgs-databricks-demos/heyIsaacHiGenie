import { __commonJS } from "./chunk-B_1218FY.js";
import { require_src$1 as require_src } from "./src-DdDLEO9m.js";

//#region node_modules/@opentelemetry/sdk-trace-base/node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-unsupported.js
var require_getMachineId_unsupported = __commonJS({ "node_modules/@opentelemetry/sdk-trace-base/node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-unsupported.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getMachineId = void 0;
	const api_1 = require_src();
	async function getMachineId() {
		api_1.diag.debug("could not read machine-id: unsupported platform");
		return void 0;
	}
	exports.getMachineId = getMachineId;
} });

//#endregion
export default require_getMachineId_unsupported();
