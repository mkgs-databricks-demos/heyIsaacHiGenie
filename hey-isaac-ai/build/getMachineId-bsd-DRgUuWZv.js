import { __commonJS, __require } from "./chunk-B_1218FY.js";
import { require_src$1 as require_src } from "./src-DdDLEO9m.js";
import { require_execAsync } from "./execAsync-B2c5IY_l.js";

//#region node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-bsd.js
var require_getMachineId_bsd = __commonJS({ "node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-bsd.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getMachineId = void 0;
	const fs_1 = __require("fs");
	const execAsync_1 = require_execAsync();
	const api_1 = require_src();
	async function getMachineId() {
		try {
			const result = await fs_1.promises.readFile("/etc/hostid", { encoding: "utf8" });
			return result.trim();
		} catch (e) {
			api_1.diag.debug(`error reading machine id: ${e}`);
		}
		try {
			const result = await (0, execAsync_1.execAsync)("kenv -q smbios.system.uuid");
			return result.stdout.trim();
		} catch (e) {
			api_1.diag.debug(`error reading machine id: ${e}`);
		}
		return void 0;
	}
	exports.getMachineId = getMachineId;
} });

//#endregion
export default require_getMachineId_bsd();
