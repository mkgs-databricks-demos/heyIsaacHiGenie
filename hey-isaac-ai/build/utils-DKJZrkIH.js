import { __commonJS, __toESM } from "./chunk-BMwS5_Mx.js";
import { import_src$1 as import_src } from "./src-CCymvmrM.js";
import { import_picocolors } from "./picocolors-BtD5UNhW.js";
import { AsyncLocalStorage } from "node:async_hooks";
import { format, formatWithOptions, inspect } from "node:util";
import { isatty } from "node:tty";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";

//#region node_modules/@databricks/appkit/dist/utils/path-exclusions.js
/**
* Paths and patterns to exclude from tracing and logging.
* Requests matching these will not create spans or WideEvents.
*/
const EXCLUDED_PATH_PREFIXES = [
	"/@fs/",
	"/@vite/",
	"/@id/",
	"/@react-refresh",
	"/src/",
	"/node_modules/",
	"/favicon.ico",
	"/_next/",
	"/static/",
	"/health",
	"/metrics"
];
/**
* File extensions to exclude from tracing.
* These are typically static assets that don't need tracing.
*/
const EXCLUDED_EXTENSIONS = [
	".svg",
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".ico",
	".css",
	".woff",
	".woff2",
	".ttf",
	".eot",
	".map",
	".js"
];
/**
* Check if a request should be ignored for tracing.
* This is the primary filter used by HttpInstrumentation.
*/
function shouldIgnoreRequest(request) {
	const url = request.url;
	if (!url) return false;
	const path$1 = url.split("?")[0];
	return shouldExcludePath(path$1);
}
/**
* Check if a path should be excluded from tracing/logging.
* Returns true if path should be excluded, false otherwise.
*/
function shouldExcludePath(path$1) {
	if (typeof path$1 !== "string") return false;
	const cleanPath = path$1.split("?")[0];
	const lowerPath = cleanPath.toLowerCase();
	for (const prefix of EXCLUDED_PATH_PREFIXES) if (cleanPath.includes(prefix)) return true;
	if (!cleanPath.startsWith("/api/")) {
		for (const ext of EXCLUDED_EXTENSIONS) if (lowerPath.endsWith(ext)) return true;
	}
	return false;
}

//#endregion
//#region node_modules/@databricks/appkit/dist/logging/sampling.js
/**
* Get sample rate from environment variable or default to 1.0 (100%)
*/
function getSampleRate() {
	const envRate = process.env.APPKIT_SAMPLE_RATE;
	if (envRate) {
		const parsed = parseFloat(envRate);
		if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 1) return parsed;
	}
	return 1;
}
/**
* Default sampling configuration
*/
const DEFAULT_SAMPLING_CONFIG = {
	alwaysSampleIf: {
		hasErrors: true,
		statusCodeGte: 400,
		durationGte: 5e3,
		hasCacheInfo: true
	},
	sampleRate: getSampleRate()
};
/**
* Simple hash function for deterministic sampling
*/
function hashString(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return Math.abs(hash);
}
/**
* Determine if a WideEvent should be sampled based on configuration.
* Uses shared path exclusions from utils/path-exclusions.ts.
*/
function shouldSample(event, config = DEFAULT_SAMPLING_CONFIG) {
	if (shouldExcludePath(event.path)) return false;
	if (config.alwaysSampleIf.hasErrors && event.error) return true;
	if (config.alwaysSampleIf.statusCodeGte && event.status_code && event.status_code >= config.alwaysSampleIf.statusCodeGte) return true;
	if (config.alwaysSampleIf.durationGte && event.duration_ms && event.duration_ms >= config.alwaysSampleIf.durationGte) return true;
	if (config.alwaysSampleIf.hasCacheInfo && event.execution?.cache_hit !== void 0) return true;
	if (config.sampleRate >= 1) return true;
	if (config.sampleRate <= 0) return false;
	return hashString(event.request_id) % 100 < config.sampleRate * 100;
}

//#endregion
//#region node_modules/@databricks/appkit/dist/logging/wide-event.js
/**
* WideEvent
* - Represents a single event for a request
* - Fields are camelCase to match OpenTelemetry
*/
var WideEvent = class {
	data;
	startTime;
	constructor(requestId) {
		this.startTime = Date.now();
		this.data = {
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			request_id: requestId,
			service: {
				name: "appkit",
				version: process.env.npm_package_version || "unknown",
				region: process.env.REGION,
				deployment_id: process.env.DEPLOYMENT_ID,
				node_env: process.env.NODE_ENV
			},
			logs: [],
			context: {}
		};
	}
	/**
	* Set a value in the event
	* @param key - The key to set
	* @param value - The value to set
	* @returns The event
	*/
	set(key, value) {
		if (typeof value === "object" && value !== null && !Array.isArray(value)) this.data[key] = {
			...this.data[key],
			...value
		};
		else this.data[key] = value;
		return this;
	}
	/**
	* Set the component name and operation.
	* Component can be a plugin, connector, or service.
	* @param name - The name of the component (e.g., "analytics", "sql-warehouse", "cache-manager")
	* @param operation - The operation being performed (e.g., "query", "getOrExecute")
	* @returns The event
	*/
	setComponent(name, operation) {
		this.data.component = {
			name,
			operation
		};
		return this;
	}
	/**
	* Set the user context
	* @param user - The user context
	* @returns The event
	*/
	setUser(user) {
		this.data.user = {
			...this.data.user,
			...user
		};
		return this;
	}
	/**
	* Set the execution context
	* @param execution - The execution context
	* @returns The event
	*/
	setExecution(execution) {
		this.data.execution = {
			...this.data.execution,
			...execution
		};
		return this;
	}
	/**
	* Set the stream context
	* @param stream - The stream context
	* @returns The event
	*/
	setStream(stream) {
		this.data.stream = {
			...this.data.stream,
			...stream
		};
		return this;
	}
	/**
	* Set the error context
	* @param error - The error context
	* @returns The event
	*/
	setError(error) {
		const isAppKitError = "code" in error && "statusCode" in error;
		const errorCause = error.cause;
		this.data.error = {
			type: error.name,
			code: isAppKitError ? error.code : "UNKNOWN_ERROR",
			message: error.message,
			retriable: isAppKitError ? error.isRetryable : false,
			cause: errorCause ? String(errorCause) : void 0
		};
		return this;
	}
	/**
	* Add scoped context to the event
	* @param scope - The scope name (plugin, connector, or service name)
	* @param ctx - Context data to merge
	* @example
	* event.setContext("analytics", { query_key: "apps_list", rows_returned: 100 });
	* event.setContext("sql-warehouse", { warehouse_id: "1234567890" });
	*/
	setContext(scope, ctx) {
		if (!this.data.context) this.data.context = {};
		this.data.context[scope] = {
			...this.data.context[scope],
			...ctx
		};
		return this;
	}
	/**
	* Add a log to the event
	* @param level - The level of the log
	* @param message - The message of the log
	* @param context - The context of the log
	* @returns The event
	*/
	addLog(level, message, context) {
		if (!this.data.logs) this.data.logs = [];
		this.data.logs.push({
			level,
			message,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			context
		});
		if (this.data.logs.length > 50) this.data.logs = this.data.logs.slice(-50);
		return this;
	}
	/**
	* Finalize the event
	* @param statusCode - The status code of the response
	* @returns The event data
	*/
	finalize(statusCode) {
		this.data.status_code = statusCode;
		this.data.duration_ms = this.getDurationMs();
		return this.data;
	}
	/**
	* Get the duration of the event in milliseconds
	* @returns The duration of the event in milliseconds
	*/
	getDurationMs() {
		return this.data.duration_ms || Date.now() - this.startTime;
	}
	/**
	* Convert the event to a JSON object
	* @returns The event data as a JSON object
	*/
	toJSON() {
		return this.data;
	}
};

//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/types/LogRecord.js
var require_LogRecord = __commonJS({ "node_modules/@opentelemetry/api-logs/build/src/types/LogRecord.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SeverityNumber = void 0;
	var SeverityNumber;
	(function(SeverityNumber$1) {
		SeverityNumber$1[SeverityNumber$1["UNSPECIFIED"] = 0] = "UNSPECIFIED";
		SeverityNumber$1[SeverityNumber$1["TRACE"] = 1] = "TRACE";
		SeverityNumber$1[SeverityNumber$1["TRACE2"] = 2] = "TRACE2";
		SeverityNumber$1[SeverityNumber$1["TRACE3"] = 3] = "TRACE3";
		SeverityNumber$1[SeverityNumber$1["TRACE4"] = 4] = "TRACE4";
		SeverityNumber$1[SeverityNumber$1["DEBUG"] = 5] = "DEBUG";
		SeverityNumber$1[SeverityNumber$1["DEBUG2"] = 6] = "DEBUG2";
		SeverityNumber$1[SeverityNumber$1["DEBUG3"] = 7] = "DEBUG3";
		SeverityNumber$1[SeverityNumber$1["DEBUG4"] = 8] = "DEBUG4";
		SeverityNumber$1[SeverityNumber$1["INFO"] = 9] = "INFO";
		SeverityNumber$1[SeverityNumber$1["INFO2"] = 10] = "INFO2";
		SeverityNumber$1[SeverityNumber$1["INFO3"] = 11] = "INFO3";
		SeverityNumber$1[SeverityNumber$1["INFO4"] = 12] = "INFO4";
		SeverityNumber$1[SeverityNumber$1["WARN"] = 13] = "WARN";
		SeverityNumber$1[SeverityNumber$1["WARN2"] = 14] = "WARN2";
		SeverityNumber$1[SeverityNumber$1["WARN3"] = 15] = "WARN3";
		SeverityNumber$1[SeverityNumber$1["WARN4"] = 16] = "WARN4";
		SeverityNumber$1[SeverityNumber$1["ERROR"] = 17] = "ERROR";
		SeverityNumber$1[SeverityNumber$1["ERROR2"] = 18] = "ERROR2";
		SeverityNumber$1[SeverityNumber$1["ERROR3"] = 19] = "ERROR3";
		SeverityNumber$1[SeverityNumber$1["ERROR4"] = 20] = "ERROR4";
		SeverityNumber$1[SeverityNumber$1["FATAL"] = 21] = "FATAL";
		SeverityNumber$1[SeverityNumber$1["FATAL2"] = 22] = "FATAL2";
		SeverityNumber$1[SeverityNumber$1["FATAL3"] = 23] = "FATAL3";
		SeverityNumber$1[SeverityNumber$1["FATAL4"] = 24] = "FATAL4";
	})(SeverityNumber = exports.SeverityNumber || (exports.SeverityNumber = {}));
} });

//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/NoopLogger.js
var require_NoopLogger = __commonJS({ "node_modules/@opentelemetry/api-logs/build/src/NoopLogger.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.NOOP_LOGGER = exports.NoopLogger = void 0;
	var NoopLogger = class {
		emit(_logRecord) {}
	};
	exports.NoopLogger = NoopLogger;
	exports.NOOP_LOGGER = new NoopLogger();
} });

//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/NoopLoggerProvider.js
var require_NoopLoggerProvider = __commonJS({ "node_modules/@opentelemetry/api-logs/build/src/NoopLoggerProvider.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.NOOP_LOGGER_PROVIDER = exports.NoopLoggerProvider = void 0;
	const NoopLogger_1$2 = require_NoopLogger();
	var NoopLoggerProvider = class {
		getLogger(_name, _version, _options) {
			return new NoopLogger_1$2.NoopLogger();
		}
	};
	exports.NoopLoggerProvider = NoopLoggerProvider;
	exports.NOOP_LOGGER_PROVIDER = new NoopLoggerProvider();
} });

//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/ProxyLogger.js
var require_ProxyLogger = __commonJS({ "node_modules/@opentelemetry/api-logs/build/src/ProxyLogger.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProxyLogger = void 0;
	const NoopLogger_1$1 = require_NoopLogger();
	var ProxyLogger = class {
		constructor(_provider, name, version, options) {
			this._provider = _provider;
			this.name = name;
			this.version = version;
			this.options = options;
		}
		/**
		* Emit a log record. This method should only be used by log appenders.
		*
		* @param logRecord
		*/
		emit(logRecord) {
			this._getLogger().emit(logRecord);
		}
		/**
		* Try to get a logger from the proxy logger provider.
		* If the proxy logger provider has no delegate, return a noop logger.
		*/
		_getLogger() {
			if (this._delegate) return this._delegate;
			const logger = this._provider._getDelegateLogger(this.name, this.version, this.options);
			if (!logger) return NoopLogger_1$1.NOOP_LOGGER;
			this._delegate = logger;
			return this._delegate;
		}
	};
	exports.ProxyLogger = ProxyLogger;
} });

//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/ProxyLoggerProvider.js
var require_ProxyLoggerProvider = __commonJS({ "node_modules/@opentelemetry/api-logs/build/src/ProxyLoggerProvider.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProxyLoggerProvider = void 0;
	const NoopLoggerProvider_1$1 = require_NoopLoggerProvider();
	const ProxyLogger_1 = require_ProxyLogger();
	var ProxyLoggerProvider = class {
		getLogger(name, version, options) {
			var _a;
			return (_a = this._getDelegateLogger(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyLogger_1.ProxyLogger(this, name, version, options);
		}
		/**
		* Get the delegate logger provider.
		* Used by tests only.
		* @internal
		*/
		_getDelegate() {
			var _a;
			return (_a = this._delegate) !== null && _a !== void 0 ? _a : NoopLoggerProvider_1$1.NOOP_LOGGER_PROVIDER;
		}
		/**
		* Set the delegate logger provider
		* @internal
		*/
		_setDelegate(delegate) {
			this._delegate = delegate;
		}
		/**
		* @internal
		*/
		_getDelegateLogger(name, version, options) {
			var _a;
			return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getLogger(name, version, options);
		}
	};
	exports.ProxyLoggerProvider = ProxyLoggerProvider;
} });

//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/platform/node/globalThis.js
var require_globalThis = __commonJS({ "node_modules/@opentelemetry/api-logs/build/src/platform/node/globalThis.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports._globalThis = void 0;
	/** only globals that common to node and browsers are allowed */
	exports._globalThis = typeof globalThis === "object" ? globalThis : global;
} });

//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/platform/node/index.js
var require_node = __commonJS({ "node_modules/@opentelemetry/api-logs/build/src/platform/node/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports._globalThis = void 0;
	var globalThis_1 = require_globalThis();
	Object.defineProperty(exports, "_globalThis", {
		enumerable: true,
		get: function() {
			return globalThis_1._globalThis;
		}
	});
} });

//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/platform/index.js
var require_platform = __commonJS({ "node_modules/@opentelemetry/api-logs/build/src/platform/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports._globalThis = void 0;
	var node_1 = require_node();
	Object.defineProperty(exports, "_globalThis", {
		enumerable: true,
		get: function() {
			return node_1._globalThis;
		}
	});
} });

//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/internal/global-utils.js
var require_global_utils = __commonJS({ "node_modules/@opentelemetry/api-logs/build/src/internal/global-utils.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.API_BACKWARDS_COMPATIBILITY_VERSION = exports.makeGetter = exports._global = exports.GLOBAL_LOGS_API_KEY = void 0;
	const platform_1 = require_platform();
	exports.GLOBAL_LOGS_API_KEY = Symbol.for("io.opentelemetry.js.api.logs");
	exports._global = platform_1._globalThis;
	/**
	* Make a function which accepts a version integer and returns the instance of an API if the version
	* is compatible, or a fallback version (usually NOOP) if it is not.
	*
	* @param requiredVersion Backwards compatibility version which is required to return the instance
	* @param instance Instance which should be returned if the required version is compatible
	* @param fallback Fallback instance, usually NOOP, which will be returned if the required version is not compatible
	*/
	function makeGetter(requiredVersion, instance, fallback) {
		return (version) => version === requiredVersion ? instance : fallback;
	}
	exports.makeGetter = makeGetter;
	/**
	* A number which should be incremented each time a backwards incompatible
	* change is made to the API. This number is used when an API package
	* attempts to access the global API to ensure it is getting a compatible
	* version. If the global API is not compatible with the API package
	* attempting to get it, a NOOP API implementation will be returned.
	*/
	exports.API_BACKWARDS_COMPATIBILITY_VERSION = 1;
} });

//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/api/logs.js
var require_logs = __commonJS({ "node_modules/@opentelemetry/api-logs/build/src/api/logs.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LogsAPI = void 0;
	const global_utils_1 = require_global_utils();
	const NoopLoggerProvider_1 = require_NoopLoggerProvider();
	const ProxyLoggerProvider_1$1 = require_ProxyLoggerProvider();
	var LogsAPI = class LogsAPI {
		constructor() {
			this._proxyLoggerProvider = new ProxyLoggerProvider_1$1.ProxyLoggerProvider();
		}
		static getInstance() {
			if (!this._instance) this._instance = new LogsAPI();
			return this._instance;
		}
		setGlobalLoggerProvider(provider) {
			if (global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY]) return this.getLoggerProvider();
			global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY] = (0, global_utils_1.makeGetter)(global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION, provider, NoopLoggerProvider_1.NOOP_LOGGER_PROVIDER);
			this._proxyLoggerProvider._setDelegate(provider);
			return provider;
		}
		/**
		* Returns the global logger provider.
		*
		* @returns LoggerProvider
		*/
		getLoggerProvider() {
			var _a, _b;
			return (_b = (_a = global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY]) === null || _a === void 0 ? void 0 : _a.call(global_utils_1._global, global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && _b !== void 0 ? _b : this._proxyLoggerProvider;
		}
		/**
		* Returns a logger from the global logger provider.
		*
		* @returns Logger
		*/
		getLogger(name, version, options) {
			return this.getLoggerProvider().getLogger(name, version, options);
		}
		/** Remove the global logger provider */
		disable() {
			delete global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY];
			this._proxyLoggerProvider = new ProxyLoggerProvider_1$1.ProxyLoggerProvider();
		}
	};
	exports.LogsAPI = LogsAPI;
} });

//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/index.js
var require_src$1 = __commonJS({ "node_modules/@opentelemetry/api-logs/build/src/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.logs = exports.ProxyLoggerProvider = exports.NoopLogger = exports.NOOP_LOGGER = exports.SeverityNumber = void 0;
	var LogRecord_1 = require_LogRecord();
	Object.defineProperty(exports, "SeverityNumber", {
		enumerable: true,
		get: function() {
			return LogRecord_1.SeverityNumber;
		}
	});
	var NoopLogger_1 = require_NoopLogger();
	Object.defineProperty(exports, "NOOP_LOGGER", {
		enumerable: true,
		get: function() {
			return NoopLogger_1.NOOP_LOGGER;
		}
	});
	Object.defineProperty(exports, "NoopLogger", {
		enumerable: true,
		get: function() {
			return NoopLogger_1.NoopLogger;
		}
	});
	var ProxyLoggerProvider_1 = require_ProxyLoggerProvider();
	Object.defineProperty(exports, "ProxyLoggerProvider", {
		enumerable: true,
		get: function() {
			return ProxyLoggerProvider_1.ProxyLoggerProvider;
		}
	});
	const logs_1 = require_logs();
	exports.logs = logs_1.LogsAPI.getInstance();
} });
var import_src$1 = __toESM(require_src$1(), 1);

//#endregion
//#region node_modules/@databricks/appkit/dist/logging/wide-event-emitter.js
/**
* Emits WideEvents to OpenTelemetry as structured logs
*/
var WideEventEmitter = class {
	logger = import_src$1.logs.getLogger("appkit", "1.0.0");
	/**
	* Emit a WideEvent to OpenTelemetry.
	* Fails silently to avoid crashing the application due to observability issues.
	*/
	emit(event) {
		try {
			const logRecord = {
				timestamp: Date.parse(event.timestamp),
				severityNumber: this.getSeverityNumber(event),
				severityText: this.getSeverityText(event),
				body: this.createLogBody(event),
				attributes: this.createAttributes(event)
			};
			this.logger.emit(logRecord);
		} catch {}
	}
	/**
	* Get OpenTelemetry severity number based on event data
	*/
	getSeverityNumber(event) {
		if (event.error) return import_src$1.SeverityNumber.ERROR;
		if (event.status_code) {
			if (event.status_code >= 500) return import_src$1.SeverityNumber.ERROR;
			if (event.status_code >= 400) return import_src$1.SeverityNumber.WARN;
		}
		if (event.logs) {
			if (event.logs.some((log$1) => log$1.level === "error")) return import_src$1.SeverityNumber.ERROR;
			if (event.logs.some((log$1) => log$1.level === "warn")) return import_src$1.SeverityNumber.WARN;
		}
		return import_src$1.SeverityNumber.INFO;
	}
	/**
	* Get severity text based on severity number
	*/
	getSeverityText(event) {
		const severityNumber = this.getSeverityNumber(event);
		if (severityNumber >= import_src$1.SeverityNumber.ERROR) return "ERROR";
		if (severityNumber >= import_src$1.SeverityNumber.WARN) return "WARN";
		if (severityNumber >= import_src$1.SeverityNumber.INFO) return "INFO";
		return "DEBUG";
	}
	/**
	* Create log body from event data
	*/
	createLogBody(event) {
		const parts = [];
		if (event.method && event.path) parts.push(`${event.method} ${event.path}`);
		if (event.status_code) parts.push(`→ ${event.status_code}`);
		if (event.duration_ms) parts.push(`(${event.duration_ms}ms)`);
		if (event.component) {
			const componentStr = event.component.operation ? `${event.component.name}.${event.component.operation}` : event.component.name;
			parts.push(`[${componentStr}]`);
		}
		if (event.error) parts.push(`ERROR: ${event.error.message}`);
		return parts.join(" ");
	}
	/**
	* Create OpenTelemetry attributes from event data
	*/
	createAttributes(event) {
		const attributes = {
			request_id: event.request_id,
			trace_id: event.trace_id,
			"http.method": event.method,
			"http.route": event.path,
			"http.status_code": event.status_code,
			"http.request.duration_ms": event.duration_ms,
			"service.name": event.service?.name,
			"service.version": event.service?.version,
			"service.region": event.service?.region,
			"service.deployment_id": event.service?.deployment_id,
			"service.node_env": event.service?.node_env,
			"component.name": event.component?.name,
			"component.operation": event.component?.operation,
			"user.id": event.user?.id,
			"error.type": event.error?.type,
			"error.code": event.error?.code,
			"error.message": event.error?.message,
			"error.retriable": event.error?.retriable,
			"execution.timeout_ms": event.execution?.timeout_ms,
			"execution.retry_attempts": event.execution?.retry_attempts,
			"execution.cache_hit": event.execution?.cache_hit,
			"execution.cache_key": event.execution?.cache_key,
			"execution.cache_deduplication": event.execution?.cache_deduplication,
			"stream.id": event.stream?.stream_id,
			"stream.events_sent": event.stream?.events_sent,
			log_count: event.logs?.length
		};
		if (event.context) {
			for (const [scope, scopeData] of Object.entries(event.context)) for (const [key, value] of Object.entries(scopeData)) if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") attributes[`${scope}.${key}`] = value;
		}
		return Object.fromEntries(Object.entries(attributes).filter(([_, value]) => value !== void 0));
	}
};

//#endregion
//#region node_modules/obug/dist/core.js
function coerce(value) {
	if (value instanceof Error) return value.stack || value.message;
	return value;
}
function selectColor(colors$1, namespace) {
	let hash = 0;
	for (let i = 0; i < namespace.length; i++) {
		hash = (hash << 5) - hash + namespace.charCodeAt(i);
		hash |= 0;
	}
	return colors$1[Math.abs(hash) % colors$1.length];
}
function matchesTemplate(search, template) {
	let searchIndex = 0;
	let templateIndex = 0;
	let starIndex = -1;
	let matchIndex = 0;
	while (searchIndex < search.length) if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) if (template[templateIndex] === "*") {
		starIndex = templateIndex;
		matchIndex = searchIndex;
		templateIndex++;
	} else {
		searchIndex++;
		templateIndex++;
	}
	else if (starIndex !== -1) {
		templateIndex = starIndex + 1;
		matchIndex++;
		searchIndex = matchIndex;
	} else return false;
	while (templateIndex < template.length && template[templateIndex] === "*") templateIndex++;
	return templateIndex === template.length;
}
function humanize(value) {
	if (value >= 1e3) return `${(value / 1e3).toFixed(1)}s`;
	return `${value}ms`;
}
let globalNamespaces = "";
function createDebug$1(namespace, options) {
	let prevTime;
	let enableOverride;
	let namespacesCache;
	let enabledCache;
	const debug = (...args) => {
		if (!debug.enabled) return;
		const curr = Date.now();
		const diff = curr - (prevTime || curr);
		prevTime = curr;
		args[0] = coerce(args[0]);
		if (typeof args[0] !== "string") args.unshift("%O");
		let index = 0;
		args[0] = args[0].replace(/%([a-z%])/gi, (match, format$1) => {
			if (match === "%%") return "%";
			index++;
			const formatter = options.formatters[format$1];
			if (typeof formatter === "function") {
				const value = args[index];
				match = formatter.call(debug, value);
				args.splice(index, 1);
				index--;
			}
			return match;
		});
		options.formatArgs.call(debug, diff, args);
		debug.log(...args);
	};
	debug.extend = function(namespace$1, delimiter = ":") {
		return createDebug$1(this.namespace + delimiter + namespace$1, {
			useColors: this.useColors,
			color: this.color,
			formatArgs: this.formatArgs,
			formatters: this.formatters,
			inspectOpts: this.inspectOpts,
			log: this.log,
			humanize: this.humanize
		});
	};
	Object.assign(debug, options);
	debug.namespace = namespace;
	Object.defineProperty(debug, "enabled", {
		enumerable: true,
		configurable: false,
		get: () => {
			if (enableOverride != null) return enableOverride;
			if (namespacesCache !== globalNamespaces) {
				namespacesCache = globalNamespaces;
				enabledCache = enabled(namespace);
			}
			return enabledCache;
		},
		set: (v) => {
			enableOverride = v;
		}
	});
	return debug;
}
let names = [];
let skips = [];
function enable(namespaces$1) {
	globalNamespaces = namespaces$1;
	names = [];
	skips = [];
	const split = globalNamespaces.trim().replace(/\s+/g, ",").split(",").filter(Boolean);
	for (const ns of split) if (ns[0] === "-") skips.push(ns.slice(1));
	else names.push(ns);
}
function enabled(name) {
	for (const skip of skips) if (matchesTemplate(name, skip)) return false;
	for (const ns of names) if (matchesTemplate(name, ns)) return true;
	return false;
}

//#endregion
//#region node_modules/obug/dist/node.js
const colors = process.stderr.getColorDepth && process.stderr.getColorDepth() > 2 ? [
	20,
	21,
	26,
	27,
	32,
	33,
	38,
	39,
	40,
	41,
	42,
	43,
	44,
	45,
	56,
	57,
	62,
	63,
	68,
	69,
	74,
	75,
	76,
	77,
	78,
	79,
	80,
	81,
	92,
	93,
	98,
	99,
	112,
	113,
	128,
	129,
	134,
	135,
	148,
	149,
	160,
	161,
	162,
	163,
	164,
	165,
	166,
	167,
	168,
	169,
	170,
	171,
	172,
	173,
	178,
	179,
	184,
	185,
	196,
	197,
	198,
	199,
	200,
	201,
	202,
	203,
	204,
	205,
	206,
	207,
	208,
	209,
	214,
	215,
	220,
	221
] : [
	6,
	2,
	3,
	4,
	5,
	1
];
const inspectOpts = Object.keys(process.env).filter((key) => /^debug_/i.test(key)).reduce((obj, key) => {
	const prop = key.slice(6).toLowerCase().replace(/_([a-z])/g, (_, k) => k.toUpperCase());
	let value = process.env[key];
	const lowerCase = typeof value === "string" && value.toLowerCase();
	if (value === "null") value = null;
	else if (lowerCase === "yes" || lowerCase === "on" || lowerCase === "true" || lowerCase === "enabled") value = true;
	else if (lowerCase === "no" || lowerCase === "off" || lowerCase === "false" || lowerCase === "disabled") value = false;
	else value = Number(value);
	obj[prop] = value;
	return obj;
}, {});
function useColors() {
	return "colors" in inspectOpts ? Boolean(inspectOpts.colors) : isatty(process.stderr.fd);
}
function getDate() {
	if (inspectOpts.hideDate) return "";
	return `${(/* @__PURE__ */ new Date()).toISOString()} `;
}
function formatArgs(diff, args) {
	const { namespace: name, useColors: useColors$1 } = this;
	if (useColors$1) {
		const c = this.color;
		const colorCode = `\u001B[3${c < 8 ? c : `8;5;${c}`}`;
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;
		args[0] = prefix + args[0].split("\n").join(`\n${prefix}`);
		args.push(`${colorCode}m+${this.humanize(diff)}\u001B[0m`);
	} else args[0] = `${getDate()}${name} ${args[0]}`;
}
function log(...args) {
	process.stderr.write(`${formatWithOptions(this.inspectOpts, ...args)}\n`);
}
const defaultOptions = {
	useColors: useColors(),
	formatArgs,
	formatters: {
		o(v) {
			this.inspectOpts.colors = this.useColors;
			return inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
		},
		O(v) {
			this.inspectOpts.colors = this.useColors;
			return inspect(v, this.inspectOpts);
		}
	},
	inspectOpts,
	log,
	humanize
};
function createDebug(namespace, options) {
	var _ref;
	const color = (_ref = options && options.color) !== null && _ref !== void 0 ? _ref : selectColor(colors, namespace);
	return createDebug$1(namespace, Object.assign(defaultOptions, { color }, options));
}
enable(process.env.DEBUG || "");

//#endregion
//#region node_modules/@databricks/appkit/dist/logging/logger.js
const eventStorage = new AsyncLocalStorage();
const eventsByRequest = /* @__PURE__ */ new WeakMap();
const emitter = new WideEventEmitter();
const MAX_REQUEST_ID_LENGTH = 128;
/**
* Sanitize a request ID from user headers
*/
function sanitizeRequestId(id) {
	return id.replace(/[^a-zA-Z0-9_.-]/g, "").slice(0, MAX_REQUEST_ID_LENGTH);
}
/**
* Generate a request ID from the request
*/
function generateRequestId(req) {
	const existingId = req.headers["x-request-id"] || req.headers["x-correlation-id"] || req.headers["x-amzn-trace-id"];
	if (existingId && typeof existingId === "string" && existingId.length > 0) {
		const sanitized = sanitizeRequestId(existingId);
		if (sanitized.length > 0) return sanitized;
	}
	return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
/**
* Create a WideEvent for a request
*/
function createEventForRequest(req) {
	const requestId = generateRequestId(req);
	const wideEvent = new WideEvent(requestId);
	const path$1 = (req.path || req.url || req.originalUrl)?.split("?")[0];
	wideEvent.set("method", req.method).set("path", path$1);
	const rawUserId = req.headers["x-forwarded-user"];
	if (rawUserId && typeof rawUserId === "string" && rawUserId.length > 0) {
		const userId = rawUserId.replace(/[^a-zA-Z0-9_@.-]/g, "").slice(0, 128);
		if (userId.length > 0) wideEvent.setUser({ id: userId });
	}
	const spanContext = import_src.trace.getActiveSpan()?.spanContext();
	if (spanContext?.traceId) {
		wideEvent.set("trace_id", spanContext.traceId);
		createDebug("appkit:logger:event", { useColors: true })("WideEvent created: %s %s (reqId: %s, traceId: %s)", req.method, path$1, requestId.substring(0, 8), spanContext.traceId.substring(0, 8));
	}
	if (wideEvent.data.service) wideEvent.data.service = {
		...wideEvent.data.service,
		name: "appkit"
	};
	return wideEvent;
}
/**
* Setup response lifecycle handlers for WideEvent finalization
*/
function setupResponseHandlers(req, wideEvent) {
	const res = req.res;
	if (!res) return;
	res.once("finish", () => {
		const finalizedData = wideEvent.finalize(res.statusCode || 200);
		if (shouldSample(finalizedData, DEFAULT_SAMPLING_CONFIG)) emitter.emit(finalizedData);
		eventsByRequest.delete(req);
	});
	res.once("close", () => {
		if (!res.writableFinished) eventsByRequest.delete(req);
	});
}
/**
* Get or create a WideEvent for the given request.
* If called within wideEventMiddleware context, returns the event from AsyncLocalStorage.
* Otherwise creates a new event for the request.
*/
function getOrCreateEvent(req) {
	let wideEvent = eventsByRequest.get(req);
	if (!wideEvent) {
		const alsEvent = eventStorage.getStore();
		if (alsEvent) {
			eventsByRequest.set(req, alsEvent);
			return alsEvent;
		}
		wideEvent = createEventForRequest(req);
		eventsByRequest.set(req, wideEvent);
		setupResponseHandlers(req, wideEvent);
	}
	return wideEvent;
}
/**
* Get current WideEvent from AsyncLocalStorage or request
*/
function getCurrentEvent(req) {
	if (req) return getOrCreateEvent(req);
	return eventStorage.getStore();
}
/**
* Check if the first argument is an Express Request
*/
function isRequest(arg) {
	return typeof arg === "object" && arg !== null && "method" in arg && "path" in arg && typeof arg.method === "string";
}
/**
* Create a logger instance for a specific scope
* @param scope - The scope identifier (e.g., "connectors:lakebase")
* @returns Logger instance with debug, info, warn, and error methods
*
* @example
* ```typescript
* const logger = createLogger("connectors:lakebase");
*
* // Regular logging (no request tracking)
* logger.debug("Connection established with pool size: %d", poolSize);
* logger.info("Server started on port %d", port);
*
* // Request-scoped logging (tracks in WideEvent)
* logger.debug(req, "Processing query: %s", queryId);
* logger.error(req, "Query failed: %O", error);
*
* // Get WideEvent - works in route handlers (with req) or interceptors (from context)
* const event = logger.event(req);  // In route handler
* const event = logger.event();     // In interceptor (gets from AsyncLocalStorage)
* event?.setComponent("analytics", "executeQuery");
* ```
*/
function createLogger(scope) {
	const debug = createDebug(`appkit:${scope}`, { useColors: true });
	const prefix = `[appkit:${scope}]`;
	function debugLog(reqOrMessage, ...args) {
		if (isRequest(reqOrMessage)) {
			const req = reqOrMessage;
			const message = args[0];
			const logArgs = args.slice(1);
			const formatted = format(message, ...logArgs);
			debug(message, ...logArgs);
			getOrCreateEvent(req).addLog("debug", formatted);
		} else debug(reqOrMessage, ...args);
	}
	function infoLog(reqOrMessage, ...args) {
		if (isRequest(reqOrMessage)) {
			const req = reqOrMessage;
			const message = args[0];
			const formatted = format(message, ...args.slice(1));
			console.log(prefix, formatted);
			getOrCreateEvent(req).addLog("info", formatted);
		} else console.log(prefix, format(reqOrMessage, ...args));
	}
	function warnLog(reqOrMessage, ...args) {
		if (isRequest(reqOrMessage)) {
			const req = reqOrMessage;
			const message = args[0];
			const formatted = format(message, ...args.slice(1));
			console.warn(prefix, formatted);
			getOrCreateEvent(req).addLog("warn", formatted);
		} else console.warn(prefix, format(reqOrMessage, ...args));
	}
	function errorLog(reqOrMessage, ...args) {
		if (isRequest(reqOrMessage)) {
			const req = reqOrMessage;
			const message = args[0];
			const formatted = format(message, ...args.slice(1));
			console.error(prefix, formatted);
			getOrCreateEvent(req).addLog("error", formatted);
		} else console.error(prefix, format(reqOrMessage, ...args));
	}
	function event(req) {
		return getCurrentEvent(req);
	}
	return {
		debug: debugLog,
		info: infoLog,
		warn: warnLog,
		error: errorLog,
		event
	};
}

//#endregion
//#region node_modules/@databricks/appkit/dist/plugins/server/remote-tunnel/gate.js
/** Assets prefixes that are served through the remote tunnel */
const REMOTE_TUNNEL_ASSET_PREFIXES = [
	"/@vite/",
	"/@fs/",
	"/node_modules/.vite/deps/",
	"/node_modules/vite/",
	"/src/",
	"/@react-refresh"
];
/**
* Check if the server is running in local development mode
* - NODE_ENV is set to "development"
* @param env - the environment variables
* @returns true if the server is running in local development mode
*/
function isLocalDev(env = process.env) {
	return env.NODE_ENV === "development";
}
/**
* Check if the environment allows the remote tunnel
* - not in local development mode
* - DISABLE_REMOTE_SERVING is not set to "true"
* - DATABRICKS_CLIENT_SECRET is set
* @param env - the environment variables
* @returns true if the environment allows the remote tunnel
*/
function isRemoteTunnelAllowedByEnv(env = process.env) {
	return !isLocalDev(env) && env.DISABLE_REMOTE_SERVING !== "true" && Boolean(env.DATABRICKS_CLIENT_SECRET);
}
/**
* Check if the request has a dev query parameter
* @param req - the request
* @returns true if the request has a dev query parameter
*/
function hasDevQuery(req) {
	return "dev" in req.query;
}
/**
* Check if the request is an asset request
* @param req - the request
* @returns true if the request is an asset request
*/
function isRemoteTunnelAssetRequest(req) {
	const path$1 = req.originalUrl;
	return REMOTE_TUNNEL_ASSET_PREFIXES.some((prefix) => path$1.startsWith(prefix));
}

//#endregion
//#region node_modules/@databricks/appkit/dist/plugins/server/utils.js
function parseCookies(req) {
	const cookieHeader = req.headers.cookie;
	if (!cookieHeader) return {};
	if (cookieHeader.indexOf(";") === -1) {
		const eqIndex = cookieHeader.indexOf("=");
		if (eqIndex === -1) return {};
		return { [cookieHeader.slice(0, eqIndex).trim()]: cookieHeader.slice(eqIndex + 1) };
	}
	const cookies = {};
	const parts = cookieHeader.split(";");
	for (let i = 0; i < parts.length; i++) {
		const eqIndex = parts[i].indexOf("=");
		if (eqIndex !== -1) {
			const key = parts[i].slice(0, eqIndex).trim();
			cookies[key] = parts[i].slice(eqIndex + 1);
		}
	}
	return cookies;
}
function generateTunnelIdFromEmail(email) {
	if (!email) return void 0;
	return crypto.createHash("sha256").update(email).digest("base64url").slice(0, 8);
}
function getRoutes(stack, basePath = "") {
	const routes = [];
	stack.forEach((layer) => {
		if (layer.route) {
			const path$1 = basePath + layer.route.path;
			const methods = Object.keys(layer.route.methods).map((m) => m.toUpperCase());
			routes.push({
				path: path$1,
				methods
			});
		} else if (layer.name === "router" && layer.handle.stack) {
			const nestedBase = basePath + layer.regexp.source.replace("^\\", "").replace("\\/?(?=\\/|$)", "").replace(/\\\//g, "/").replace(/\$$/, "") || "";
			routes.push(...getRoutes(layer.handle.stack, nestedBase));
		}
	});
	return routes;
}
const METHOD_COLORS = {
	GET: import_picocolors.default.green,
	POST: import_picocolors.default.blue,
	PUT: import_picocolors.default.yellow,
	PATCH: import_picocolors.default.yellow,
	DELETE: import_picocolors.default.red,
	HEAD: import_picocolors.default.magenta,
	OPTIONS: import_picocolors.default.magenta
};
function printRoutes(routes) {
	if (routes.length === 0) return;
	const rows = routes.flatMap((r) => r.methods.map((m) => ({
		method: m,
		path: r.path
	}))).sort((a, b) => a.method.localeCompare(b.method) || a.path.localeCompare(b.path));
	const maxMethodLen = Math.max(...rows.map((r) => r.method.length));
	const separator = import_picocolors.default.dim("─".repeat(50));
	const colorizeParams = (p) => p.replace(/(:[a-zA-Z_]\w*)/g, (match) => import_picocolors.default.cyan(match));
	console.log("");
	console.log(`  ${import_picocolors.default.bold("Registered Routes")} ${import_picocolors.default.dim(`(${rows.length})`)}`);
	console.log(`  ${separator}`);
	for (const { method, path: path$1 } of rows) {
		const methodStr = (METHOD_COLORS[method] || import_picocolors.default.white)(import_picocolors.default.bold(method.padEnd(maxMethodLen)));
		console.log(`  ${methodStr}  ${colorizeParams(path$1)}`);
	}
	console.log(`  ${separator}`);
	console.log("");
}
function getQueries(configFolder) {
	const queriesFolder = path.join(configFolder, "queries");
	if (!fs.existsSync(queriesFolder)) return {};
	return Object.fromEntries(fs.readdirSync(queriesFolder).filter((f) => path.extname(f) === ".sql").map((f) => [path.basename(f, ".sql"), path.basename(f, ".sql")]));
}
const APPKIT_CONFIG_SCRIPT_ID = "__appkit__";
const EMPTY_RUNTIME_CONFIG_JSON = JSON.stringify({
	appName: "",
	queries: {},
	endpoints: {},
	plugins: {}
});
const JSON_SCRIPT_ESCAPE_MAP = {
	"<": "\\u003c",
	">": "\\u003e",
	"&": "\\u0026",
	"\u2028": "\\u2028",
	"\u2029": "\\u2029"
};
function getRuntimeConfig(endpoints = {}, pluginConfigs = {}) {
	const configFolder = path.join(process.cwd(), "config");
	return {
		appName: process.env.DATABRICKS_APP_NAME || "",
		queries: getQueries(configFolder),
		endpoints,
		plugins: pluginConfigs
	};
}
function getConfigScript(endpoints = {}, pluginConfigs = {}) {
	return `
    <script id="${APPKIT_CONFIG_SCRIPT_ID}" type="application/json">
      ${serializeRuntimeConfig(getRuntimeConfig(endpoints, pluginConfigs))}
    <\/script>
    <script>
      window.__appkit__ = JSON.parse(
        document.getElementById("${APPKIT_CONFIG_SCRIPT_ID}")?.textContent ||
          '${EMPTY_RUNTIME_CONFIG_JSON}',
      );
    <\/script>
  `;
}
function serializeRuntimeConfig(config) {
	return JSON.stringify(config).replace(/[<>&\u2028\u2029]/g, (char) => JSON_SCRIPT_ESCAPE_MAP[char] ?? char);
}

//#endregion
export { REMOTE_TUNNEL_ASSET_PREFIXES, createLogger, generateTunnelIdFromEmail, getConfigScript, getRoutes, hasDevQuery, import_src$1 as import_src, isLocalDev, isRemoteTunnelAllowedByEnv, isRemoteTunnelAssetRequest, parseCookies, printRoutes, require_src$1 as require_src, shouldExcludePath, shouldIgnoreRequest };