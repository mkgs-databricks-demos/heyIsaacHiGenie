import { __commonJS, __require } from "./chunk-BMwS5_Mx.js";
import { require_src$1 as require_src } from "./src-CCymvmrM.js";
import { require_execAsync } from "./execAsync-CW0ImCQn.js";

//#region node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-win.js
var require_getMachineId_win = __commonJS({ "node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-win.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getMachineId = void 0;
	const process = __require("process");
	const execAsync_1 = require_execAsync();
	const api_1 = require_src();
	async function getMachineId() {
		const args = "QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography /v MachineGuid";
		let command = "%windir%\\System32\\REG.exe";
		if (process.arch === "ia32" && "PROCESSOR_ARCHITEW6432" in process.env) command = "%windir%\\sysnative\\cmd.exe /c " + command;
		try {
			const result = await (0, execAsync_1.execAsync)(`${command} ${args}`);
			const parts = result.stdout.split("REG_SZ");
			if (parts.length === 2) return parts[1].trim();
		} catch (e) {
			api_1.diag.debug(`error reading machine id: ${e}`);
		}
		return void 0;
	}
	exports.getMachineId = getMachineId;
} });

//#endregion
export default require_getMachineId_win();
