import { __commonJS } from "./chunk-BMwS5_Mx.js";
import { require_src$1 as require_src } from "./src-CCymvmrM.js";
import { require_execAsync } from "./execAsync-CW0ImCQn.js";

//#region node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-darwin.js
var require_getMachineId_darwin = __commonJS({ "node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-darwin.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getMachineId = void 0;
	const execAsync_1 = require_execAsync();
	const api_1 = require_src();
	async function getMachineId() {
		try {
			const result = await (0, execAsync_1.execAsync)("ioreg -rd1 -c \"IOPlatformExpertDevice\"");
			const idLine = result.stdout.split("\n").find((line) => line.includes("IOPlatformUUID"));
			if (!idLine) return void 0;
			const parts = idLine.split("\" = \"");
			if (parts.length === 2) return parts[1].slice(0, -1);
		} catch (e) {
			api_1.diag.debug(`error reading machine id: ${e}`);
		}
		return void 0;
	}
	exports.getMachineId = getMachineId;
} });

//#endregion
export default require_getMachineId_darwin();
