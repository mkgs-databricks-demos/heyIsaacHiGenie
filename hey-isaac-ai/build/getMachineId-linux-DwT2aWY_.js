import { __commonJS, __require } from "./chunk-BMwS5_Mx.js";
import { require_src$1 as require_src } from "./src-CCymvmrM.js";

//#region node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-linux.js
var require_getMachineId_linux = __commonJS({ "node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId-linux.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getMachineId = void 0;
	const fs_1 = __require("fs");
	const api_1 = require_src();
	async function getMachineId() {
		const paths = ["/etc/machine-id", "/var/lib/dbus/machine-id"];
		for (const path of paths) try {
			const result = await fs_1.promises.readFile(path, { encoding: "utf8" });
			return result.trim();
		} catch (e) {
			api_1.diag.debug(`error reading machine id: ${e}`);
		}
		return void 0;
	}
	exports.getMachineId = getMachineId;
} });

//#endregion
export default require_getMachineId_linux();
