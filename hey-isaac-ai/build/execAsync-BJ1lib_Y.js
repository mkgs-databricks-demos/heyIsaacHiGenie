import { __commonJS, __require } from "./chunk-BMwS5_Mx.js";

//#region node_modules/@opentelemetry/sdk-trace-base/node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/execAsync.js
var require_execAsync = __commonJS({ "node_modules/@opentelemetry/sdk-trace-base/node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/execAsync.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.execAsync = void 0;
	const child_process = __require("child_process");
	const util = __require("util");
	exports.execAsync = util.promisify(child_process.exec);
} });

//#endregion
export { require_execAsync as require_execAsync$1 };