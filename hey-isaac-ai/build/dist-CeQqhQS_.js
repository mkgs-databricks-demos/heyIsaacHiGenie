import { __commonJS, __toESM } from "./chunk-B_1218FY.js";
import { createRequire } from "node:module";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { Worker, isMainThread } from "node:worker_threads";

//#region node_modules/@databricks/appkit/node_modules/rolldown/dist/shared/parse-ast-index-D2PcAmXE.mjs
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function() {
	return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS$1 = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (all) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i$1 = 0, n$2 = keys.length, key; i$1 < n$2; i$1++) {
		key = keys[i$1];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __require = /* @__PURE__ */ createRequire(import.meta.url);
function getPostMessage(options) {
	return typeof (options === null || options === void 0 ? void 0 : options.postMessage) === "function" ? options.postMessage : typeof postMessage === "function" ? postMessage : void 0;
}
function serizeErrorToBuffer(sab, code$1, error$1) {
	var i32array = new Int32Array(sab);
	Atomics.store(i32array, 0, code$1);
	if (code$1 > 1 && error$1) {
		var name_1 = error$1.name;
		var message = error$1.message;
		var stack = error$1.stack;
		var nameBuffer = new TextEncoder().encode(name_1);
		var messageBuffer = new TextEncoder().encode(message);
		var stackBuffer = new TextEncoder().encode(stack);
		Atomics.store(i32array, 1, nameBuffer.length);
		Atomics.store(i32array, 2, messageBuffer.length);
		Atomics.store(i32array, 3, stackBuffer.length);
		var buffer = new Uint8Array(sab);
		buffer.set(nameBuffer, 16);
		buffer.set(messageBuffer, 16 + nameBuffer.length);
		buffer.set(stackBuffer, 16 + nameBuffer.length + messageBuffer.length);
	}
}
function deserizeErrorFromBuffer(sab) {
	var _a, _b;
	var i32array = new Int32Array(sab);
	if (Atomics.load(i32array, 0) <= 1) return null;
	var nameLength = Atomics.load(i32array, 1);
	var messageLength = Atomics.load(i32array, 2);
	var stackLength = Atomics.load(i32array, 3);
	var buffer = new Uint8Array(sab);
	var nameBuffer = buffer.slice(16, 16 + nameLength);
	var messageBuffer = buffer.slice(16 + nameLength, 16 + nameLength + messageLength);
	var stackBuffer = buffer.slice(16 + nameLength + messageLength, 16 + nameLength + messageLength + stackLength);
	var name = new TextDecoder().decode(nameBuffer);
	var message = new TextDecoder().decode(messageBuffer);
	var stack = new TextDecoder().decode(stackBuffer);
	var error$1 = new ((_a = globalThis[name]) !== null && _a !== void 0 ? _a : name === "RuntimeError" ? (_b = _WebAssembly$2.RuntimeError) !== null && _b !== void 0 ? _b : Error : Error)(message);
	Object.defineProperty(error$1, "stack", {
		value: stack,
		writable: true,
		enumerable: false,
		configurable: true
	});
	return error$1;
}
/** @public */
function isSharedArrayBuffer(value) {
	return typeof SharedArrayBuffer === "function" && value instanceof SharedArrayBuffer || Object.prototype.toString.call(value) === "[object SharedArrayBuffer]";
}
/** @public */
function isTrapError(e$2) {
	try {
		return e$2 instanceof _WebAssembly$2.RuntimeError;
	} catch (_) {
		return false;
	}
}
function createMessage(type, payload) {
	return { __emnapi__: {
		type,
		payload
	} };
}
function checkSharedWasmMemory(wasmMemory) {
	if (wasmMemory) {
		if (!isSharedArrayBuffer(wasmMemory.buffer)) throw new Error("Multithread features require shared wasm memory. Try to compile with `-matomics -mbulk-memory` and use `--import-memory --shared-memory` during linking, then create WebAssembly.Memory with `shared: true` option");
	} else if (typeof SharedArrayBuffer === "undefined") throw new Error("Current environment does not support SharedArrayBuffer, threads are not available!");
}
function getReuseWorker(value) {
	var _a;
	if (typeof value === "boolean") return value ? {
		size: 0,
		strict: false
	} : false;
	if (typeof value === "number") {
		if (!(value >= 0)) throw new RangeError("reuseWorker: size must be a non-negative integer");
		return {
			size: value,
			strict: false
		};
	}
	if (!value) return false;
	var size = (_a = Number(value.size)) !== null && _a !== void 0 ? _a : 0;
	var strict = Boolean(value.strict);
	if (!(size > 0) && strict) throw new RangeError("reuseWorker: size must be set to positive integer if strict is set to true");
	return {
		size,
		strict
	};
}
/** @public */
function createInstanceProxy(instance$1, memory) {
	if (instance$1[kIsProxy]) return instance$1;
	var originalExports = instance$1.exports;
	var createHandler = function(target) {
		var handlers = [
			"apply",
			"construct",
			"defineProperty",
			"deleteProperty",
			"get",
			"getOwnPropertyDescriptor",
			"getPrototypeOf",
			"has",
			"isExtensible",
			"ownKeys",
			"preventExtensions",
			"set",
			"setPrototypeOf"
		];
		var handler$1 = {};
		var _loop_1 = function(i$1$1) {
			var name_1 = handlers[i$1$1];
			handler$1[name_1] = function() {
				var args$1 = Array.prototype.slice.call(arguments, 1);
				args$1.unshift(target);
				return Reflect[name_1].apply(Reflect, args$1);
			};
		};
		for (var i$1 = 0; i$1 < handlers.length; i$1++) _loop_1(i$1);
		return handler$1;
	};
	var handler = createHandler(originalExports);
	var _initialize = function() {};
	var _start = function() {
		return 0;
	};
	handler.get = function(_target, p$1, receiver) {
		var _a;
		if (p$1 === "memory") return (_a = typeof memory === "function" ? memory() : memory) !== null && _a !== void 0 ? _a : Reflect.get(originalExports, p$1, receiver);
		if (p$1 === "_initialize") return p$1 in originalExports ? _initialize : void 0;
		if (p$1 === "_start") return p$1 in originalExports ? _start : void 0;
		return Reflect.get(originalExports, p$1, receiver);
	};
	handler.has = function(_target, p$1) {
		if (p$1 === "memory") return true;
		return Reflect.has(originalExports, p$1);
	};
	var exportsProxy = new Proxy(Object.create(null), handler);
	return new Proxy(instance$1, { get: function(target, p$1, receiver) {
		if (p$1 === "exports") return exportsProxy;
		if (p$1 === kIsProxy) return true;
		return Reflect.get(target, p$1, receiver);
	} });
}
function patchWasiInstance(wasiThreads, wasi) {
	var patched = patchedWasiInstances.get(wasiThreads);
	if (patched.has(wasi)) return;
	var _this = wasiThreads;
	var wasiImport = wasi.wasiImport;
	if (wasiImport) {
		var proc_exit_1 = wasiImport.proc_exit;
		wasiImport.proc_exit = function(code$1) {
			_this.terminateAllThreads();
			return proc_exit_1.call(this, code$1);
		};
	}
	if (!_this.childThread) {
		var start_1 = wasi.start;
		if (typeof start_1 === "function") wasi.start = function(instance$1) {
			try {
				return start_1.call(this, instance$1);
			} catch (err) {
				if (isTrapError(err)) _this.terminateAllThreads();
				throw err;
			}
		};
	}
	patched.add(wasi);
}
function getWasiSymbol(wasi, description$1) {
	var symbols = Object.getOwnPropertySymbols(wasi);
	var selectDescription = function(description$1$1) {
		return function(s$1) {
			if (s$1.description) return s$1.description === description$1$1;
			return s$1.toString() === "Symbol(".concat(description$1$1, ")");
		};
	};
	if (Array.isArray(description$1)) return description$1.map(function(d$1) {
		return symbols.filter(selectDescription(d$1))[0];
	});
	return symbols.filter(selectDescription(description$1))[0];
}
function setupInstance(wasi, instance$1) {
	var _a = getWasiSymbol(wasi, ["kInstance", "kSetMemory"]), kInstance$1 = _a[0], kSetMemory$1 = _a[1];
	wasi[kInstance$1] = instance$1;
	wasi[kSetMemory$1](instance$1.exports.memory);
}
function notifyPthreadCreateResult(sab, result, error$1) {
	if (sab) {
		serizeErrorToBuffer(sab.buffer, result, error$1);
		Atomics.notify(sab, 0);
	}
}
var _WebAssembly$2, ENVIRONMENT_IS_NODE, WASI_THREADS_MAX_TID, nextWorkerID, ThreadManager, kIsProxy, patchedWasiInstances, WASIThreads, ThreadMessageHandler;
var init_wasi_threads_esm_bundler = __esm({ "../../node_modules/.pnpm/@emnapi+wasi-threads@1.1.0/node_modules/@emnapi/wasi-threads/dist/wasi-threads.esm-bundler.js": () => {
	_WebAssembly$2 = typeof WebAssembly !== "undefined" ? WebAssembly : typeof WXWebAssembly !== "undefined" ? WXWebAssembly : void 0;
	ENVIRONMENT_IS_NODE = typeof process === "object" && process !== null && typeof process.versions === "object" && process.versions !== null && typeof process.versions.node === "string";
	WASI_THREADS_MAX_TID = 536870911;
	nextWorkerID = 0;
	ThreadManager = /* @__PURE__ */ function() {
		function ThreadManager$1(options) {
			var _a;
			this.unusedWorkers = [];
			this.runningWorkers = [];
			this.pthreads = Object.create(null);
			this.wasmModule = null;
			this.wasmMemory = null;
			this.messageEvents = /* @__PURE__ */ new WeakMap();
			if (!options) throw new TypeError("ThreadManager(): options is not provided");
			if ("childThread" in options) this._childThread = Boolean(options.childThread);
			else this._childThread = false;
			if (this._childThread) {
				this._onCreateWorker = void 0;
				this._reuseWorker = false;
				this._beforeLoad = void 0;
			} else {
				this._onCreateWorker = options.onCreateWorker;
				this._reuseWorker = getReuseWorker(options.reuseWorker);
				this._beforeLoad = options.beforeLoad;
			}
			this.printErr = (_a = options.printErr) !== null && _a !== void 0 ? _a : console.error.bind(console);
		}
		Object.defineProperty(ThreadManager$1.prototype, "nextWorkerID", {
			get: function() {
				return nextWorkerID;
			},
			enumerable: false,
			configurable: true
		});
		ThreadManager$1.prototype.init = function() {
			if (!this._childThread) this.initMainThread();
		};
		ThreadManager$1.prototype.initMainThread = function() {
			this.preparePool();
		};
		ThreadManager$1.prototype.preparePool = function() {
			if (this._reuseWorker) {
				if (this._reuseWorker.size) {
					var pthreadPoolSize = this._reuseWorker.size;
					while (pthreadPoolSize--) {
						var worker = this.allocateUnusedWorker();
						if (ENVIRONMENT_IS_NODE) {
							worker.once("message", function() {});
							worker.unref();
						}
					}
				}
			}
		};
		ThreadManager$1.prototype.shouldPreloadWorkers = function() {
			return !this._childThread && this._reuseWorker && this._reuseWorker.size > 0;
		};
		ThreadManager$1.prototype.loadWasmModuleToAllWorkers = function() {
			var _this_1 = this;
			var promises = Array(this.unusedWorkers.length);
			var _loop_1 = function(i$1$1) {
				var worker = this_1.unusedWorkers[i$1$1];
				if (ENVIRONMENT_IS_NODE) worker.ref();
				promises[i$1$1] = this_1.loadWasmModuleToWorker(worker).then(function(w$1) {
					if (ENVIRONMENT_IS_NODE) worker.unref();
					return w$1;
				}, function(e$2) {
					if (ENVIRONMENT_IS_NODE) worker.unref();
					throw e$2;
				});
			};
			var this_1 = this;
			for (var i$1 = 0; i$1 < this.unusedWorkers.length; ++i$1) _loop_1(i$1);
			return Promise.all(promises).catch(function(err) {
				_this_1.terminateAllThreads();
				throw err;
			});
		};
		ThreadManager$1.prototype.preloadWorkers = function() {
			if (this.shouldPreloadWorkers()) return this.loadWasmModuleToAllWorkers();
			return Promise.resolve([]);
		};
		ThreadManager$1.prototype.setup = function(wasmModule, wasmMemory) {
			this.wasmModule = wasmModule;
			this.wasmMemory = wasmMemory;
		};
		ThreadManager$1.prototype.markId = function(worker) {
			if (worker.__emnapi_tid) return worker.__emnapi_tid;
			var tid = nextWorkerID + 43;
			nextWorkerID = (nextWorkerID + 1) % (WASI_THREADS_MAX_TID - 42);
			this.pthreads[tid] = worker;
			worker.__emnapi_tid = tid;
			return tid;
		};
		ThreadManager$1.prototype.returnWorkerToPool = function(worker) {
			var tid = worker.__emnapi_tid;
			if (tid !== void 0) delete this.pthreads[tid];
			this.unusedWorkers.push(worker);
			this.runningWorkers.splice(this.runningWorkers.indexOf(worker), 1);
			delete worker.__emnapi_tid;
			if (ENVIRONMENT_IS_NODE) worker.unref();
		};
		ThreadManager$1.prototype.loadWasmModuleToWorker = function(worker, sab) {
			var _this_1 = this;
			if (worker.whenLoaded) return worker.whenLoaded;
			var err = this.printErr;
			var beforeLoad = this._beforeLoad;
			var _this = this;
			worker.whenLoaded = new Promise(function(resolve$1$1, reject) {
				var handleError$1 = function(e$2) {
					var message = "worker sent an error!";
					if (worker.__emnapi_tid !== void 0) message = "worker (tid = " + worker.__emnapi_tid + ") sent an error!";
					if ("message" in e$2) {
						err(message + " " + e$2.message);
						if (e$2.message.indexOf("RuntimeError") !== -1 || e$2.message.indexOf("unreachable") !== -1) try {
							_this.terminateAllThreads();
						} catch (_) {}
					} else err(message);
					reject(e$2);
					throw e$2;
				};
				var handleMessage = function(data) {
					if (data.__emnapi__) {
						var type = data.__emnapi__.type;
						var payload = data.__emnapi__.payload;
						if (type === "loaded") {
							worker.loaded = true;
							if (ENVIRONMENT_IS_NODE && !worker.__emnapi_tid) worker.unref();
							resolve$1$1(worker);
						} else if (type === "cleanup-thread") {
							if (payload.tid in _this_1.pthreads) _this_1.cleanThread(worker, payload.tid);
						}
					}
				};
				worker.onmessage = function(e$2) {
					handleMessage(e$2.data);
					_this_1.fireMessageEvent(worker, e$2);
				};
				worker.onerror = handleError$1;
				if (ENVIRONMENT_IS_NODE) {
					worker.on("message", function(data) {
						var _a, _b;
						(_b = (_a = worker).onmessage) === null || _b === void 0 || _b.call(_a, { data });
					});
					worker.on("error", function(e$2) {
						var _a, _b;
						(_b = (_a = worker).onerror) === null || _b === void 0 || _b.call(_a, e$2);
					});
					worker.on("detachedExit", function() {});
				}
				if (typeof beforeLoad === "function") beforeLoad(worker);
				try {
					worker.postMessage(createMessage("load", {
						wasmModule: _this_1.wasmModule,
						wasmMemory: _this_1.wasmMemory,
						sab
					}));
				} catch (err$1) {
					checkSharedWasmMemory(_this_1.wasmMemory);
					throw err$1;
				}
			});
			return worker.whenLoaded;
		};
		ThreadManager$1.prototype.allocateUnusedWorker = function() {
			var _onCreateWorker = this._onCreateWorker;
			if (typeof _onCreateWorker !== "function") throw new TypeError("`options.onCreateWorker` is not provided");
			var worker = _onCreateWorker({
				type: "thread",
				name: "emnapi-pthread"
			});
			this.unusedWorkers.push(worker);
			return worker;
		};
		ThreadManager$1.prototype.getNewWorker = function(sab) {
			if (this._reuseWorker) {
				if (this.unusedWorkers.length === 0) {
					if (this._reuseWorker.strict) {
						if (!ENVIRONMENT_IS_NODE) {
							var err = this.printErr;
							err("Tried to spawn a new thread, but the thread pool is exhausted.\nThis might result in a deadlock unless some threads eventually exit or the code explicitly breaks out to the event loop.");
							return;
						}
					}
					var worker_1 = this.allocateUnusedWorker();
					this.loadWasmModuleToWorker(worker_1, sab);
				}
				return this.unusedWorkers.pop();
			}
			var worker = this.allocateUnusedWorker();
			this.loadWasmModuleToWorker(worker, sab);
			return this.unusedWorkers.pop();
		};
		ThreadManager$1.prototype.cleanThread = function(worker, tid, force) {
			if (!force && this._reuseWorker) this.returnWorkerToPool(worker);
			else {
				delete this.pthreads[tid];
				var index = this.runningWorkers.indexOf(worker);
				if (index !== -1) this.runningWorkers.splice(index, 1);
				this.terminateWorker(worker);
				delete worker.__emnapi_tid;
			}
		};
		ThreadManager$1.prototype.terminateWorker = function(worker) {
			var _this_1 = this;
			var _a;
			var tid = worker.__emnapi_tid;
			worker.terminate();
			(_a = this.messageEvents.get(worker)) === null || _a === void 0 || _a.clear();
			this.messageEvents.delete(worker);
			worker.onmessage = function(e$2) {
				if (e$2.data.__emnapi__) {
					var err = _this_1.printErr;
					err("received \"" + e$2.data.__emnapi__.type + "\" command from terminated worker: " + tid);
				}
			};
		};
		ThreadManager$1.prototype.terminateAllThreads = function() {
			for (var i$1 = 0; i$1 < this.runningWorkers.length; ++i$1) this.terminateWorker(this.runningWorkers[i$1]);
			for (var i$1 = 0; i$1 < this.unusedWorkers.length; ++i$1) this.terminateWorker(this.unusedWorkers[i$1]);
			this.unusedWorkers = [];
			this.runningWorkers = [];
			this.pthreads = Object.create(null);
			this.preparePool();
		};
		ThreadManager$1.prototype.addMessageEventListener = function(worker, onMessage) {
			var listeners = this.messageEvents.get(worker);
			if (!listeners) {
				listeners = /* @__PURE__ */ new Set();
				this.messageEvents.set(worker, listeners);
			}
			listeners.add(onMessage);
			return function() {
				listeners === null || listeners === void 0 || listeners.delete(onMessage);
			};
		};
		ThreadManager$1.prototype.fireMessageEvent = function(worker, e$2) {
			var listeners = this.messageEvents.get(worker);
			if (!listeners) return;
			var err = this.printErr;
			listeners.forEach(function(listener) {
				try {
					listener(e$2);
				} catch (e$1$1) {
					err(e$1$1.stack);
				}
			});
		};
		return ThreadManager$1;
	}();
	kIsProxy = Symbol("kIsProxy");
	patchedWasiInstances = /* @__PURE__ */ new WeakMap();
	WASIThreads = /* @__PURE__ */ function() {
		function WASIThreads$1(options) {
			var _this_1 = this;
			if (!options) throw new TypeError("WASIThreads(): options is not provided");
			if (!options.wasi) throw new TypeError("WASIThreads(): options.wasi is not provided");
			patchedWasiInstances.set(this, /* @__PURE__ */ new WeakSet());
			var wasi = options.wasi;
			patchWasiInstance(this, wasi);
			this.wasi = wasi;
			if ("childThread" in options) this.childThread = Boolean(options.childThread);
			else this.childThread = false;
			this.PThread = void 0;
			if ("threadManager" in options) if (typeof options.threadManager === "function") this.PThread = options.threadManager();
			else this.PThread = options.threadManager;
			else if (!this.childThread) {
				this.PThread = new ThreadManager(options);
				this.PThread.init();
			}
			var waitThreadStart = false;
			if ("waitThreadStart" in options) waitThreadStart = typeof options.waitThreadStart === "number" ? options.waitThreadStart : Boolean(options.waitThreadStart);
			var postMessage$1 = getPostMessage(options);
			if (this.childThread && typeof postMessage$1 !== "function") throw new TypeError("options.postMessage is not a function");
			this.postMessage = postMessage$1;
			var wasm64 = Boolean(options.wasm64);
			var onMessage = function(e$2) {
				if (e$2.data.__emnapi__) {
					var type = e$2.data.__emnapi__.type;
					var payload = e$2.data.__emnapi__.payload;
					if (type === "spawn-thread") threadSpawn(payload.startArg, payload.errorOrTid);
					else if (type === "terminate-all-threads") _this_1.terminateAllThreads();
				}
			};
			var threadSpawn = function(startArg, errorOrTid) {
				var _a;
				var EAGAIN = 6;
				var isNewABI = errorOrTid !== void 0;
				try {
					checkSharedWasmMemory(_this_1.wasmMemory);
				} catch (err) {
					(_a = _this_1.PThread) === null || _a === void 0 || _a.printErr(err.stack);
					if (isNewABI) {
						var struct_1 = new Int32Array(_this_1.wasmMemory.buffer, errorOrTid, 2);
						Atomics.store(struct_1, 0, 1);
						Atomics.store(struct_1, 1, EAGAIN);
						Atomics.notify(struct_1, 1);
						return 1;
					} else return -EAGAIN;
				}
				if (!isNewABI) {
					var malloc = _this_1.wasmInstance.exports.malloc;
					errorOrTid = wasm64 ? Number(malloc(BigInt(8))) : malloc(8);
					if (!errorOrTid) return -48;
				}
				var _free = _this_1.wasmInstance.exports.free;
				var free = wasm64 ? function(ptr) {
					_free(BigInt(ptr));
				} : _free;
				var struct = new Int32Array(_this_1.wasmMemory.buffer, errorOrTid, 2);
				Atomics.store(struct, 0, 0);
				Atomics.store(struct, 1, 0);
				if (_this_1.childThread) {
					postMessage$1(createMessage("spawn-thread", {
						startArg,
						errorOrTid
					}));
					Atomics.wait(struct, 1, 0);
					var isError = Atomics.load(struct, 0);
					var result = Atomics.load(struct, 1);
					if (isNewABI) return isError;
					free(errorOrTid);
					return isError ? -result : result;
				}
				var shouldWait = waitThreadStart || waitThreadStart === 0;
				var sab;
				if (shouldWait) {
					sab = new Int32Array(new SharedArrayBuffer(8208));
					Atomics.store(sab, 0, 0);
				}
				var worker;
				var tid;
				var PThread = _this_1.PThread;
				try {
					worker = PThread.getNewWorker(sab);
					if (!worker) throw new Error("failed to get new worker");
					PThread.addMessageEventListener(worker, onMessage);
					tid = PThread.markId(worker);
					if (ENVIRONMENT_IS_NODE) worker.ref();
					worker.postMessage(createMessage("start", {
						tid,
						arg: startArg,
						sab
					}));
					if (shouldWait) {
						if (typeof waitThreadStart === "number") {
							if (Atomics.wait(sab, 0, 0, waitThreadStart) === "timed-out") {
								try {
									PThread.cleanThread(worker, tid, true);
								} catch (_) {}
								throw new Error("Spawning thread timed out. Please check if the worker is created successfully and if message is handled properly in the worker.");
							}
						} else Atomics.wait(sab, 0, 0);
						if (Atomics.load(sab, 0) > 1) {
							try {
								PThread.cleanThread(worker, tid, true);
							} catch (_) {}
							throw deserizeErrorFromBuffer(sab.buffer);
						}
					}
				} catch (e$2) {
					Atomics.store(struct, 0, 1);
					Atomics.store(struct, 1, EAGAIN);
					Atomics.notify(struct, 1);
					PThread === null || PThread === void 0 || PThread.printErr(e$2.stack);
					if (isNewABI) return 1;
					free(errorOrTid);
					return -EAGAIN;
				}
				Atomics.store(struct, 0, 0);
				Atomics.store(struct, 1, tid);
				Atomics.notify(struct, 1);
				PThread.runningWorkers.push(worker);
				if (!shouldWait) worker.whenLoaded.catch(function(err) {
					delete worker.whenLoaded;
					PThread.cleanThread(worker, tid, true);
					throw err;
				});
				if (isNewABI) return 0;
				free(errorOrTid);
				return tid;
			};
			this.threadSpawn = threadSpawn;
		}
		WASIThreads$1.prototype.getImportObject = function() {
			return { wasi: { "thread-spawn": this.threadSpawn } };
		};
		WASIThreads$1.prototype.setup = function(wasmInstance, wasmModule, wasmMemory) {
			wasmMemory !== null && wasmMemory !== void 0 || (wasmMemory = wasmInstance.exports.memory);
			this.wasmInstance = wasmInstance;
			this.wasmMemory = wasmMemory;
			if (this.PThread) this.PThread.setup(wasmModule, wasmMemory);
		};
		WASIThreads$1.prototype.preloadWorkers = function() {
			if (this.PThread) return this.PThread.preloadWorkers();
			return Promise.resolve([]);
		};
		/**
		* It's ok to call this method to a WASI command module.
		*
		* in child thread, must call this method instead of {@link WASIThreads.start} even if it's a WASI command module
		*
		* @returns A proxied WebAssembly instance if in child thread, other wise the original instance
		*/
		WASIThreads$1.prototype.initialize = function(instance$1, module$1, memory) {
			var exports$1 = instance$1.exports;
			memory !== null && memory !== void 0 || (memory = exports$1.memory);
			if (this.childThread) instance$1 = createInstanceProxy(instance$1, memory);
			this.setup(instance$1, module$1, memory);
			var wasi = this.wasi;
			if ("_start" in exports$1 && typeof exports$1._start === "function") if (this.childThread) {
				wasi.start(instance$1);
				try {
					var kStarted$1 = getWasiSymbol(wasi, "kStarted");
					wasi[kStarted$1] = false;
				} catch (_) {}
			} else setupInstance(wasi, instance$1);
			else wasi.initialize(instance$1);
			return instance$1;
		};
		/**
		* Equivalent to calling {@link WASIThreads.initialize} and then calling {@link WASIInstance.start}
		* ```js
		* this.initialize(instance, module, memory)
		* this.wasi.start(instance)
		* ```
		*/
		WASIThreads$1.prototype.start = function(instance$1, module$1, memory) {
			var exports$1 = instance$1.exports;
			memory !== null && memory !== void 0 || (memory = exports$1.memory);
			if (this.childThread) instance$1 = createInstanceProxy(instance$1, memory);
			this.setup(instance$1, module$1, memory);
			return {
				exitCode: this.wasi.start(instance$1),
				instance: instance$1
			};
		};
		WASIThreads$1.prototype.terminateAllThreads = function() {
			var _a;
			if (!this.childThread) (_a = this.PThread) === null || _a === void 0 || _a.terminateAllThreads();
			else this.postMessage(createMessage("terminate-all-threads", {}));
		};
		return WASIThreads$1;
	}();
	ThreadMessageHandler = /* @__PURE__ */ function() {
		function ThreadMessageHandler$1(options) {
			var postMsg = getPostMessage(options);
			if (typeof postMsg !== "function") throw new TypeError("options.postMessage is not a function");
			this.postMessage = postMsg;
			this.onLoad = options === null || options === void 0 ? void 0 : options.onLoad;
			this.onError = typeof (options === null || options === void 0 ? void 0 : options.onError) === "function" ? options.onError : function(_type, err) {
				throw err;
			};
			this.instance = void 0;
			this.messagesBeforeLoad = [];
		}
		/** @virtual */
		ThreadMessageHandler$1.prototype.instantiate = function(data) {
			if (typeof this.onLoad === "function") return this.onLoad(data);
			throw new Error("ThreadMessageHandler.prototype.instantiate is not implemented");
		};
		/** @virtual */
		ThreadMessageHandler$1.prototype.handle = function(e$2) {
			var _this = this;
			var _a;
			if ((_a = e$2 === null || e$2 === void 0 ? void 0 : e$2.data) === null || _a === void 0 ? void 0 : _a.__emnapi__) {
				var type = e$2.data.__emnapi__.type;
				var payload_1 = e$2.data.__emnapi__.payload;
				try {
					if (type === "load") this._load(payload_1);
					else if (type === "start") this.handleAfterLoad(e$2, function() {
						_this._start(payload_1);
					});
				} catch (err) {
					this.onError(err, type);
				}
			}
		};
		ThreadMessageHandler$1.prototype._load = function(payload) {
			var _this = this;
			if (this.instance !== void 0) return;
			var source;
			try {
				source = this.instantiate(payload);
			} catch (err) {
				this._loaded(err, null, payload);
				return;
			}
			var then = source && "then" in source ? source.then : void 0;
			if (typeof then === "function") then.call(source, function(source$1) {
				_this._loaded(null, source$1, payload);
			}, function(err) {
				_this._loaded(err, null, payload);
			});
			else this._loaded(null, source, payload);
		};
		ThreadMessageHandler$1.prototype._start = function(payload) {
			var wasi_thread_start = this.instance.exports.wasi_thread_start;
			if (typeof wasi_thread_start !== "function") {
				var err = /* @__PURE__ */ new TypeError("wasi_thread_start is not exported");
				notifyPthreadCreateResult(payload.sab, 2, err);
				throw err;
			}
			var postMessage$1 = this.postMessage;
			var tid = payload.tid;
			var startArg = payload.arg;
			notifyPthreadCreateResult(payload.sab, 1);
			try {
				wasi_thread_start(tid, startArg);
			} catch (err$1) {
				if (err$1 !== "unwind") throw err$1;
				else return;
			}
			postMessage$1(createMessage("cleanup-thread", { tid }));
		};
		ThreadMessageHandler$1.prototype._loaded = function(err, source, payload) {
			if (err) {
				notifyPthreadCreateResult(payload.sab, 2, err);
				throw err;
			}
			if (source == null) {
				var err_1 = /* @__PURE__ */ new TypeError("onLoad should return an object");
				notifyPthreadCreateResult(payload.sab, 2, err_1);
				throw err_1;
			}
			var instance$1 = source.instance;
			if (!instance$1) {
				var err_2 = /* @__PURE__ */ new TypeError("onLoad should return an object which includes \"instance\"");
				notifyPthreadCreateResult(payload.sab, 2, err_2);
				throw err_2;
			}
			this.instance = instance$1;
			var postMessage$1 = this.postMessage;
			postMessage$1(createMessage("loaded", {}));
			var messages = this.messagesBeforeLoad;
			this.messagesBeforeLoad = [];
			for (var i$1 = 0; i$1 < messages.length; i$1++) {
				var data = messages[i$1];
				this.handle({ data });
			}
		};
		ThreadMessageHandler$1.prototype.handleAfterLoad = function(e$2, f$1) {
			if (this.instance !== void 0) f$1.call(this, e$2);
			else this.messagesBeforeLoad.push(e$2.data);
		};
		return ThreadMessageHandler$1;
	}();
} });
function __extends(d$1, b$1) {
	if (typeof b$1 !== "function" && b$1 !== null) throw new TypeError("Class extends value " + String(b$1) + " is not a constructor or null");
	extendStatics(d$1, b$1);
	function __() {
		this.constructor = d$1;
	}
	d$1.prototype = b$1 === null ? Object.create(b$1) : (__.prototype = b$1.prototype, new __());
}
var extendStatics, __assign;
var init_tslib_es6 = __esm({ "../../node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs": () => {
	extendStatics = function(d$1, b$1) {
		extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1$1, b$1$1) {
			d$1$1.__proto__ = b$1$1;
		} || function(d$1$1, b$1$1) {
			for (var p$1 in b$1$1) if (Object.prototype.hasOwnProperty.call(b$1$1, p$1)) d$1$1[p$1] = b$1$1[p$1];
		};
		return extendStatics(d$1, b$1);
	};
	__assign = function() {
		__assign = Object.assign || function __assign$1(t$3) {
			for (var s$1, i$1 = 1, n$2 = arguments.length; i$1 < n$2; i$1++) {
				s$1 = arguments[i$1];
				for (var p$1 in s$1) if (Object.prototype.hasOwnProperty.call(s$1, p$1)) t$3[p$1] = s$1[p$1];
			}
			return t$3;
		};
		return __assign.apply(this, arguments);
	};
} });
var emnapi_core_esm_bundler_exports = /* @__PURE__ */ __export({
	MessageHandler: () => MessageHandler$1,
	ThreadManager: () => ThreadManager,
	ThreadMessageHandler: () => ThreadMessageHandler,
	WASIThreads: () => WASIThreads,
	createInstanceProxy: () => createInstanceProxy,
	createNapiModule: () => createNapiModule,
	instantiateNapiModule: () => instantiateNapiModule$1,
	instantiateNapiModuleSync: () => instantiateNapiModuleSync$1,
	isSharedArrayBuffer: () => isSharedArrayBuffer,
	isTrapError: () => isTrapError,
	loadNapiModule: () => loadNapiModule,
	loadNapiModuleSync: () => loadNapiModuleSync,
	version: () => version$2
});
function validateImports$1(imports) {
	if (imports && typeof imports !== "object") throw new TypeError("imports must be an object or undefined");
	return true;
}
function load$1(wasmInput, imports) {
	if (!wasmInput) throw new TypeError("Invalid wasm source");
	validateImports$1(imports);
	imports = imports !== null && imports !== void 0 ? imports : {};
	try {
		var then = typeof wasmInput === "object" && wasmInput !== null && "then" in wasmInput ? wasmInput.then : void 0;
		if (typeof then === "function") return then.call(wasmInput, function(input) {
			return load$1(input, imports);
		});
	} catch (_) {}
	if (wasmInput instanceof ArrayBuffer || ArrayBuffer.isView(wasmInput)) return _WebAssembly$1.instantiate(wasmInput, imports);
	if (wasmInput instanceof _WebAssembly$1.Module) return _WebAssembly$1.instantiate(wasmInput, imports).then(function(instance$1) {
		return {
			instance: instance$1,
			module: wasmInput
		};
	});
	if (typeof Response !== "undefined" && wasmInput instanceof Response) return wasmInput.arrayBuffer().then(function(buffer) {
		return _WebAssembly$1.instantiate(buffer, imports);
	});
	var inputIsString = typeof wasmInput === "string";
	if (inputIsString || typeof URL !== "undefined" && wasmInput instanceof URL) {
		if (inputIsString && typeof wx !== "undefined" && typeof __wxConfig !== "undefined") return _WebAssembly$1.instantiate(wasmInput, imports);
		if (typeof fetch !== "function") throw new TypeError("wasm source can not be a string or URL in this environment");
		if (typeof _WebAssembly$1.instantiateStreaming === "function") try {
			return _WebAssembly$1.instantiateStreaming(fetch(wasmInput), imports).catch(function() {
				return load$1(fetch(wasmInput), imports);
			});
		} catch (_) {
			return load$1(fetch(wasmInput), imports);
		}
		else return load$1(fetch(wasmInput), imports);
	}
	throw new TypeError("Invalid wasm source");
}
function loadSync$1(wasmInput, imports) {
	if (!wasmInput) throw new TypeError("Invalid wasm source");
	validateImports$1(imports);
	imports = imports !== null && imports !== void 0 ? imports : {};
	var module$1;
	if (wasmInput instanceof ArrayBuffer || ArrayBuffer.isView(wasmInput)) module$1 = new _WebAssembly$1.Module(wasmInput);
	else if (wasmInput instanceof WebAssembly.Module) module$1 = wasmInput;
	else throw new TypeError("Invalid wasm source");
	return {
		instance: new _WebAssembly$1.Instance(module$1, imports),
		module: module$1
	};
}
function createNapiModule(options) {
	return function() {
		var ENVIRONMENT_IS_NODE$1 = typeof process === "object" && process !== null && typeof process.versions === "object" && process.versions !== null && typeof process.versions.node === "string";
		var ENVIRONMENT_IS_PTHREAD = Boolean(options.childThread);
		var waitThreadStart = typeof options.waitThreadStart === "number" ? options.waitThreadStart : Boolean(options.waitThreadStart);
		var wasmInstance;
		var wasmMemory;
		var wasmTable;
		var _malloc;
		var _free;
		function abort(msg) {
			if (typeof _WebAssembly$1.RuntimeError === "function") throw new _WebAssembly$1.RuntimeError(msg);
			throw Error(msg);
		}
		var napiModule = {
			imports: {
				env: {},
				napi: {},
				emnapi: {}
			},
			exports: {},
			emnapi: {},
			loaded: false,
			filename: "",
			childThread: ENVIRONMENT_IS_PTHREAD,
			initWorker: void 0,
			executeAsyncWork: void 0,
			waitThreadStart,
			PThread: void 0,
			init: function(options$1) {
				if (napiModule.loaded) return napiModule.exports;
				if (!options$1) throw new TypeError("Invalid napi init options");
				var instance$1 = options$1.instance;
				if (!(instance$1 === null || instance$1 === void 0 ? void 0 : instance$1.exports)) throw new TypeError("Invalid wasm instance");
				wasmInstance = instance$1;
				var exports$1 = instance$1.exports;
				var module$1 = options$1.module;
				var memory = options$1.memory || exports$1.memory;
				var table = options$1.table || exports$1.__indirect_function_table;
				if (!(module$1 instanceof _WebAssembly$1.Module)) throw new TypeError("Invalid wasm module");
				if (!(memory instanceof _WebAssembly$1.Memory)) throw new TypeError("Invalid wasm memory");
				if (!(table instanceof _WebAssembly$1.Table)) throw new TypeError("Invalid wasm table");
				wasmMemory = memory;
				wasmTable = table;
				if (typeof exports$1.malloc !== "function") throw new TypeError("malloc is not exported");
				if (typeof exports$1.free !== "function") throw new TypeError("free is not exported");
				_malloc = exports$1.malloc;
				_free = exports$1.free;
				if (!napiModule.childThread) {
					var moduleApiVersion = 8;
					var node_api_module_get_api_version_v1 = instance$1.exports.node_api_module_get_api_version_v1;
					if (typeof node_api_module_get_api_version_v1 === "function") moduleApiVersion = node_api_module_get_api_version_v1();
					var envObject = napiModule.envObject || (napiModule.envObject = emnapiCtx.createEnv(napiModule.filename, moduleApiVersion, function(cb) {
						return wasmTable.get(cb);
					}, function(cb) {
						return wasmTable.get(cb);
					}, abort, emnapiNodeBinding));
					var scope_1 = emnapiCtx.openScope(envObject);
					try {
						envObject.callIntoModule(function(_envObject) {
							var exports$2 = napiModule.exports;
							var exportsHandle = scope_1.add(exports$2);
							var napi_register_wasm_v1 = instance$1.exports.napi_register_wasm_v1;
							var napiValue = napi_register_wasm_v1(_envObject.id, exportsHandle.id);
							napiModule.exports = !napiValue ? exports$2 : emnapiCtx.handleStore.get(napiValue).value;
						});
					} catch (e$2) {
						if (e$2 !== "unwind") throw e$2;
					} finally {
						emnapiCtx.closeScope(envObject, scope_1);
					}
					napiModule.loaded = true;
					delete napiModule.envObject;
					return napiModule.exports;
				}
			}
		};
		var emnapiCtx;
		var emnapiNodeBinding;
		var onCreateWorker = void 0;
		var err;
		if (!ENVIRONMENT_IS_PTHREAD) {
			var context = options.context;
			if (typeof context !== "object" || context === null) throw new TypeError("Invalid `options.context`. Use `import { getDefaultContext } from '@emnapi/runtime'`");
			emnapiCtx = context;
		} else {
			emnapiCtx = options === null || options === void 0 ? void 0 : options.context;
			var postMsg = typeof options.postMessage === "function" ? options.postMessage : typeof postMessage === "function" ? postMessage : void 0;
			if (typeof postMsg !== "function") throw new TypeError("No postMessage found");
			napiModule.postMessage = postMsg;
		}
		if (typeof options.filename === "string") napiModule.filename = options.filename;
		if (typeof options.onCreateWorker === "function") onCreateWorker = options.onCreateWorker;
		if (typeof options.print === "function") options.print;
		else console.log.bind(console);
		if (typeof options.printErr === "function") err = options.printErr;
		else err = console.warn.bind(console);
		if ("nodeBinding" in options) {
			var nodeBinding = options.nodeBinding;
			if (typeof nodeBinding !== "object" || nodeBinding === null) throw new TypeError("Invalid `options.nodeBinding`. Use @emnapi/node-binding package");
			emnapiNodeBinding = nodeBinding;
		}
		var emnapiAsyncWorkPoolSize = 0;
		if ("asyncWorkPoolSize" in options) {
			if (typeof options.asyncWorkPoolSize !== "number") throw new TypeError("options.asyncWorkPoolSize must be a integer");
			emnapiAsyncWorkPoolSize = options.asyncWorkPoolSize >> 0;
			if (emnapiAsyncWorkPoolSize > 1024) emnapiAsyncWorkPoolSize = 1024;
			else if (emnapiAsyncWorkPoolSize < -1024) emnapiAsyncWorkPoolSize = -1024;
		}
		var singleThreadAsyncWork = ENVIRONMENT_IS_PTHREAD ? false : emnapiAsyncWorkPoolSize <= 0;
		function _emnapi_async_work_pool_size() {
			return Math.abs(emnapiAsyncWorkPoolSize);
		}
		napiModule.imports.env._emnapi_async_work_pool_size = _emnapi_async_work_pool_size;
		function emnapiAddSendListener(worker) {
			if (!worker) return false;
			if (worker._emnapiSendListener) return true;
			var handler = function(e$2) {
				var __emnapi__ = (ENVIRONMENT_IS_NODE$1 ? e$2 : e$2.data).__emnapi__;
				if (__emnapi__ && __emnapi__.type === "async-send") if (ENVIRONMENT_IS_PTHREAD) {
					var postMessage_1 = napiModule.postMessage;
					postMessage_1({ __emnapi__ });
				} else {
					var callback = __emnapi__.payload.callback;
					wasmTable.get(callback)(__emnapi__.payload.data);
				}
			};
			var dispose = function() {
				if (ENVIRONMENT_IS_NODE$1) worker.off("message", handler);
				else worker.removeEventListener("message", handler, false);
				delete worker._emnapiSendListener;
			};
			worker._emnapiSendListener = {
				handler,
				dispose
			};
			if (ENVIRONMENT_IS_NODE$1) worker.on("message", handler);
			else worker.addEventListener("message", handler, false);
			return true;
		}
		napiModule.emnapi.addSendListener = emnapiAddSendListener;
		var PThread = new ThreadManager(ENVIRONMENT_IS_PTHREAD ? {
			printErr: err,
			childThread: true
		} : {
			printErr: err,
			beforeLoad: function(worker) {
				emnapiAddSendListener(worker);
			},
			reuseWorker: options.reuseWorker,
			onCreateWorker
		});
		napiModule.PThread = PThread;
		/**
		* @__sig ipiip
		*/
		function napi_set_last_error(env, error_code, engine_error_code, engine_reserved) {
			return emnapiCtx.envStore.get(env).setLastError(error_code, engine_error_code, engine_reserved);
		}
		/**
		* @__sig ip
		*/
		function napi_clear_last_error(env) {
			return emnapiCtx.envStore.get(env).clearLastError();
		}
		/**
		* @__sig vppp
		*/
		function _emnapi_get_node_version(major, minor, patch) {
			var versions = typeof process === "object" && process !== null && typeof process.versions === "object" && process.versions !== null && typeof process.versions.node === "string" ? process.versions.node.split(".").map(function(n$2) {
				return Number(n$2);
			}) : [
				0,
				0,
				0
			];
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			HEAP_DATA_VIEW.setUint32(major, versions[0], true);
			HEAP_DATA_VIEW.setUint32(minor, versions[1], true);
			HEAP_DATA_VIEW.setUint32(patch, versions[2], true);
		}
		/**
		* @__sig v
		* @__deps $runtimeKeepalivePush
		*/
		function _emnapi_runtime_keepalive_push() {}
		/**
		* @__sig v
		* @__deps $runtimeKeepalivePop
		*/
		function _emnapi_runtime_keepalive_pop() {}
		/**
		* @__sig vpp
		*/
		function _emnapi_set_immediate(callback, data) {
			emnapiCtx.feature.setImmediate(function() {
				wasmTable.get(callback)(data);
			});
		}
		/**
		* @__sig vpp
		*/
		function _emnapi_next_tick(callback, data) {
			Promise.resolve().then(function() {
				wasmTable.get(callback)(data);
			});
		}
		/**
		* @__sig vipppi
		*/
		function _emnapi_callback_into_module(forceUncaught, env, callback, data, close_scope_if_throw) {
			var envObject = emnapiCtx.envStore.get(env);
			var scope = emnapiCtx.openScope(envObject);
			try {
				envObject.callbackIntoModule(Boolean(forceUncaught), function() {
					wasmTable.get(callback)(env, data);
				});
			} catch (err$1) {
				emnapiCtx.closeScope(envObject, scope);
				if (close_scope_if_throw) emnapiCtx.closeScope(envObject);
				throw err$1;
			}
			emnapiCtx.closeScope(envObject, scope);
		}
		/**
		* @__sig vipppp
		*/
		function _emnapi_call_finalizer(forceUncaught, env, callback, data, hint) {
			emnapiCtx.envStore.get(env).callFinalizerInternal(forceUncaught, callback, data, hint);
		}
		/**
		* @__sig v
		*/
		function _emnapi_ctx_increase_waiting_request_counter() {
			emnapiCtx.increaseWaitingRequestCounter();
		}
		/**
		* @__sig v
		*/
		function _emnapi_ctx_decrease_waiting_request_counter() {
			emnapiCtx.decreaseWaitingRequestCounter();
		}
		/**
		* @__sig i
		*/
		function _emnapi_is_main_runtime_thread() {
			return ENVIRONMENT_IS_PTHREAD ? 0 : 1;
		}
		/**
		* @__sig i
		*/
		function _emnapi_is_main_browser_thread() {
			return typeof window !== "undefined" && typeof document !== "undefined" && !ENVIRONMENT_IS_NODE$1 ? 1 : 0;
		}
		/**
		* @__sig v
		*/
		function _emnapi_unwind() {
			throw "unwind";
		}
		/**
		* @__sig d
		*/
		function _emnapi_get_now() {
			return performance.timeOrigin + performance.now();
		}
		function $emnapiSetValueI64(result, numberValue) {
			var tempDouble;
			var tempI64 = [numberValue >>> 0, (tempDouble = numberValue, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			HEAP_DATA_VIEW.setInt32(result, tempI64[0], true);
			HEAP_DATA_VIEW.setInt32(result + 4, tempI64[1], true);
		}
		/**
		* @__deps $emnapiCtx
		* @__sig p
		*/
		function _emnapi_open_handle_scope() {
			return emnapiCtx.openScope().id;
		}
		/**
		* @__deps $emnapiCtx
		* @__sig vp
		*/
		function _emnapi_close_handle_scope(_scope) {
			return emnapiCtx.closeScope();
		}
		var utilMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			$emnapiSetValueI64,
			_emnapi_call_finalizer,
			_emnapi_callback_into_module,
			_emnapi_close_handle_scope,
			_emnapi_ctx_decrease_waiting_request_counter,
			_emnapi_ctx_increase_waiting_request_counter,
			_emnapi_get_node_version,
			_emnapi_get_now,
			_emnapi_is_main_browser_thread,
			_emnapi_is_main_runtime_thread,
			_emnapi_next_tick,
			_emnapi_open_handle_scope,
			_emnapi_runtime_keepalive_pop,
			_emnapi_runtime_keepalive_push,
			_emnapi_set_immediate,
			_emnapi_unwind,
			napi_clear_last_error,
			napi_set_last_error
		});
		function emnapiGetWorkerByPthreadPtr(pthreadPtr) {
			var tid = new DataView(wasmMemory.buffer).getInt32(pthreadPtr + 20, true);
			return PThread.pthreads[tid];
		}
		/** @__sig vp */
		function _emnapi_worker_unref(pthreadPtr) {
			if (ENVIRONMENT_IS_PTHREAD) return;
			var worker = emnapiGetWorkerByPthreadPtr(pthreadPtr);
			if (worker && typeof worker.unref === "function") worker.unref();
		}
		/** @__sig vipp */
		function _emnapi_async_send_js(type, callback, data) {
			if (ENVIRONMENT_IS_PTHREAD) {
				var postMessage_1 = napiModule.postMessage;
				postMessage_1({ __emnapi__: {
					type: "async-send",
					payload: {
						callback,
						data
					}
				} });
			} else switch (type) {
				case 0:
					_emnapi_set_immediate(callback, data);
					break;
				case 1:
					_emnapi_next_tick(callback, data);
					break;
			}
		}
		var uvThreadpoolReadyResolve;
		var uvThreadpoolReady = new Promise(function(resolve$1$1) {
			uvThreadpoolReadyResolve = function() {
				uvThreadpoolReady.ready = true;
				resolve$1$1();
			};
		});
		uvThreadpoolReady.ready = false;
		/** @__sig vppi */
		function _emnapi_after_uvthreadpool_ready(callback, q, type) {
			if (uvThreadpoolReady.ready) wasmTable.get(callback)(q, type);
			else uvThreadpoolReady.then(function() {
				wasmTable.get(callback)(q, type);
			});
		}
		/** @__sig vpi */
		function _emnapi_tell_js_uvthreadpool(threads, size) {
			var p$1 = [];
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			var _loop_1 = function(i$1$1) {
				var pthreadPtr = HEAP_DATA_VIEW.getUint32(threads + i$1$1 * 4, true);
				var worker = emnapiGetWorkerByPthreadPtr(pthreadPtr);
				p$1.push(new Promise(function(resolve$1$1) {
					var handler = function(e$2) {
						var __emnapi__ = (ENVIRONMENT_IS_NODE$1 ? e$2 : e$2.data).__emnapi__;
						if (__emnapi__ && __emnapi__.type === "async-thread-ready") {
							resolve$1$1();
							if (worker && typeof worker.unref === "function") worker.unref();
							if (ENVIRONMENT_IS_NODE$1) worker.off("message", handler);
							else worker.removeEventListener("message", handler);
						}
					};
					if (ENVIRONMENT_IS_NODE$1) worker.on("message", handler);
					else worker.addEventListener("message", handler);
				}));
			};
			for (var i$1 = 0; i$1 < size; i$1++) _loop_1(i$1);
			Promise.all(p$1).then(uvThreadpoolReadyResolve);
		}
		/** @__sig v */
		function _emnapi_emit_async_thread_ready() {
			if (!ENVIRONMENT_IS_PTHREAD) return;
			var postMessage$1 = napiModule.postMessage;
			postMessage$1({ __emnapi__: {
				type: "async-thread-ready",
				payload: {}
			} });
		}
		var asyncMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			_emnapi_after_uvthreadpool_ready,
			_emnapi_async_send_js,
			_emnapi_emit_async_thread_ready,
			_emnapi_tell_js_uvthreadpool,
			_emnapi_worker_unref
		});
		/** @__sig ipjp */
		function napi_adjust_external_memory(env, change_in_bytes, adjusted_value) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			if (!adjusted_value) return envObject.setLastError(1);
			var change_in_bytes_number = Number(change_in_bytes);
			if (change_in_bytes_number < 0) return envObject.setLastError(1);
			var old_size = wasmMemory.buffer.byteLength;
			var new_size = old_size + change_in_bytes_number;
			new_size = new_size + (65536 - new_size % 65536) % 65536;
			if (wasmMemory.grow(new_size - old_size + 65535 >> 16) === -1) return envObject.setLastError(9);
			if (emnapiCtx.feature.supportBigInt) new DataView(wasmMemory.buffer).setBigInt64(adjusted_value, BigInt(wasmMemory.buffer.byteLength), true);
			else $emnapiSetValueI64(adjusted_value, wasmMemory.buffer.byteLength);
			return envObject.clearLastError();
		}
		var memoryMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			napi_adjust_external_memory
		});
		/**
		* @__postset
		* ```
		* emnapiAWST.init();
		* ```
		*/
		var emnapiAWST = {
			idGen: {},
			values: [void 0],
			queued: /* @__PURE__ */ new Set(),
			pending: [],
			init: function() {
				var idGen = {
					nextId: 1,
					list: [],
					generate: function() {
						var id$1;
						if (idGen.list.length) id$1 = idGen.list.shift();
						else {
							id$1 = idGen.nextId;
							idGen.nextId++;
						}
						return id$1;
					},
					reuse: function(id$1) {
						idGen.list.push(id$1);
					}
				};
				emnapiAWST.idGen = idGen;
				emnapiAWST.values = [void 0];
				emnapiAWST.queued = /* @__PURE__ */ new Set();
				emnapiAWST.pending = [];
			},
			create: function(env, resource, resourceName, execute, complete, data) {
				var asyncId = 0;
				var triggerAsyncId = 0;
				if (emnapiNodeBinding) {
					var asyncContext = emnapiNodeBinding.node.emitAsyncInit(resource, resourceName, -1);
					asyncId = asyncContext.asyncId;
					triggerAsyncId = asyncContext.triggerAsyncId;
				}
				var id$1 = emnapiAWST.idGen.generate();
				emnapiAWST.values[id$1] = {
					env,
					id: id$1,
					resource,
					asyncId,
					triggerAsyncId,
					status: 0,
					execute,
					complete,
					data
				};
				return id$1;
			},
			callComplete: function(work, status) {
				var complete = work.complete;
				var env = work.env;
				var data = work.data;
				var callback = function() {
					if (!complete) return;
					var envObject = emnapiCtx.envStore.get(env);
					var scope = emnapiCtx.openScope(envObject);
					try {
						envObject.callbackIntoModule(true, function() {
							wasmTable.get(complete)(env, status, data);
						});
					} finally {
						emnapiCtx.closeScope(envObject, scope);
					}
				};
				if (emnapiNodeBinding) emnapiNodeBinding.node.makeCallback(work.resource, callback, [], {
					asyncId: work.asyncId,
					triggerAsyncId: work.triggerAsyncId
				});
				else callback();
			},
			queue: function(id$1) {
				var work = emnapiAWST.values[id$1];
				if (!work) return;
				if (work.status === 0) {
					work.status = 1;
					if (emnapiAWST.queued.size >= (Math.abs(emnapiAsyncWorkPoolSize) || 4)) {
						emnapiAWST.pending.push(id$1);
						return;
					}
					emnapiAWST.queued.add(id$1);
					var env_1 = work.env;
					var data_1 = work.data;
					var execute = work.execute;
					work.status = 2;
					emnapiCtx.feature.setImmediate(function() {
						wasmTable.get(execute)(env_1, data_1);
						emnapiAWST.queued.delete(id$1);
						work.status = 3;
						emnapiCtx.feature.setImmediate(function() {
							emnapiAWST.callComplete(work, 0);
						});
						if (emnapiAWST.pending.length > 0) {
							var nextWorkId = emnapiAWST.pending.shift();
							emnapiAWST.values[nextWorkId].status = 0;
							emnapiAWST.queue(nextWorkId);
						}
					});
				}
			},
			cancel: function(id$1) {
				var index = emnapiAWST.pending.indexOf(id$1);
				if (index !== -1) {
					var work_1 = emnapiAWST.values[id$1];
					if (work_1 && work_1.status === 1) {
						work_1.status = 4;
						emnapiAWST.pending.splice(index, 1);
						emnapiCtx.feature.setImmediate(function() {
							emnapiAWST.callComplete(work_1, 11);
						});
						return 0;
					} else return 9;
				}
				return 9;
			},
			remove: function(id$1) {
				var work = emnapiAWST.values[id$1];
				if (!work) return;
				if (emnapiNodeBinding) emnapiNodeBinding.node.emitAsyncDestroy({
					asyncId: work.asyncId,
					triggerAsyncId: work.triggerAsyncId
				});
				emnapiAWST.values[id$1] = void 0;
				emnapiAWST.idGen.reuse(id$1);
			}
		};
		/** @__sig vppdp */
		function _emnapi_node_emit_async_init(async_resource, async_resource_name, trigger_async_id, result) {
			if (!emnapiNodeBinding) return;
			var resource = emnapiCtx.handleStore.get(async_resource).value;
			var resource_name = emnapiCtx.handleStore.get(async_resource_name).value;
			var asyncContext = emnapiNodeBinding.node.emitAsyncInit(resource, resource_name, trigger_async_id);
			var asyncId = asyncContext.asyncId;
			var triggerAsyncId = asyncContext.triggerAsyncId;
			if (result) {
				var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
				HEAP_DATA_VIEW.setFloat64(result, asyncId, true);
				HEAP_DATA_VIEW.setFloat64(result + 8, triggerAsyncId, true);
			}
		}
		/** @__sig vdd */
		function _emnapi_node_emit_async_destroy(async_id, trigger_async_id) {
			if (!emnapiNodeBinding) return;
			emnapiNodeBinding.node.emitAsyncDestroy({
				asyncId: async_id,
				triggerAsyncId: trigger_async_id
			});
		}
		/** @__sig ipppppddp */
		function _emnapi_node_make_callback(env, async_resource, cb, argv, size, async_id, trigger_async_id, result) {
			var i$1 = 0;
			var v;
			if (!emnapiNodeBinding) return;
			var resource = emnapiCtx.handleStore.get(async_resource).value;
			var callback = emnapiCtx.handleStore.get(cb).value;
			size = size >>> 0;
			var arr = Array(size);
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			for (; i$1 < size; i$1++) {
				var argVal = HEAP_DATA_VIEW.getUint32(argv + i$1 * 4, true);
				arr[i$1] = emnapiCtx.handleStore.get(argVal).value;
			}
			var ret = emnapiNodeBinding.node.makeCallback(resource, callback, arr, {
				asyncId: async_id,
				triggerAsyncId: trigger_async_id
			});
			if (result) {
				v = emnapiCtx.envStore.get(env).ensureHandleId(ret);
				HEAP_DATA_VIEW.setUint32(result, v, true);
			}
		}
		/** @__sig ippp */
		function _emnapi_async_init_js(async_resource, async_resource_name, result) {
			if (!emnapiNodeBinding) return 9;
			var resource;
			if (async_resource) resource = Object(emnapiCtx.handleStore.get(async_resource).value);
			var name = emnapiCtx.handleStore.get(async_resource_name).value;
			var ret = emnapiNodeBinding.napi.asyncInit(resource, name);
			if (ret.status !== 0) return ret.status;
			var numberValue = ret.value;
			if (!(numberValue >= BigInt(-1) * (BigInt(1) << BigInt(63)) && numberValue < BigInt(1) << BigInt(63))) {
				numberValue = numberValue & (BigInt(1) << BigInt(64)) - BigInt(1);
				if (numberValue >= BigInt(1) << BigInt(63)) numberValue = numberValue - (BigInt(1) << BigInt(64));
			}
			var low = Number(numberValue & BigInt(4294967295));
			var high = Number(numberValue >> BigInt(32));
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			HEAP_DATA_VIEW.setInt32(result, low, true);
			HEAP_DATA_VIEW.setInt32(result + 4, high, true);
			return 0;
		}
		/** @__sig ip */
		function _emnapi_async_destroy_js(async_context) {
			if (!emnapiNodeBinding) return 9;
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			var low = HEAP_DATA_VIEW.getInt32(async_context, true);
			var high = HEAP_DATA_VIEW.getInt32(async_context + 4, true);
			var pointer = BigInt(low >>> 0) | BigInt(high) << BigInt(32);
			var ret = emnapiNodeBinding.napi.asyncDestroy(pointer);
			if (ret.status !== 0) return ret.status;
			return 0;
		}
		/** @__sig ipppp */
		function napi_open_callback_scope(env, ignored, async_context_handle, result) {
			throw new Error("napi_open_callback_scope has not been implemented yet");
		}
		/** @__sig ipp */
		function napi_close_callback_scope(env, scope) {
			throw new Error("napi_close_callback_scope has not been implemented yet");
		}
		/** @__sig ippppppp */
		function napi_make_callback(env, async_context, recv, func, argc, argv, result) {
			var i$1 = 0;
			var v;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!emnapiNodeBinding) return envObject.setLastError(9);
				if (!recv) return envObject.setLastError(1);
				if (argc > 0) {
					if (!argv) return envObject.setLastError(1);
				}
				var v8recv = Object(emnapiCtx.handleStore.get(recv).value);
				var v8func = emnapiCtx.handleStore.get(func).value;
				if (typeof v8func !== "function") return envObject.setLastError(1);
				var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
				var low = HEAP_DATA_VIEW.getInt32(async_context, true);
				var high = HEAP_DATA_VIEW.getInt32(async_context + 4, true);
				var ctx = BigInt(low >>> 0) | BigInt(high) << BigInt(32);
				argc = argc >>> 0;
				var arr = Array(argc);
				for (; i$1 < argc; i$1++) {
					var argVal = HEAP_DATA_VIEW.getUint32(argv + i$1 * 4, true);
					arr[i$1] = emnapiCtx.handleStore.get(argVal).value;
				}
				var ret = emnapiNodeBinding.napi.makeCallback(ctx, v8recv, v8func, arr);
				if (ret.error) throw ret.error;
				if (ret.status !== 0) return envObject.setLastError(ret.status);
				if (result) {
					v = envObject.ensureHandleId(ret.value);
					HEAP_DATA_VIEW.setUint32(result, v, true);
				}
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig vp */
		function _emnapi_env_check_gc_access(env) {
			emnapiCtx.envStore.get(env).checkGCAccess();
		}
		var nodeMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			_emnapi_async_destroy_js,
			_emnapi_async_init_js,
			_emnapi_env_check_gc_access,
			_emnapi_node_emit_async_destroy,
			_emnapi_node_emit_async_init,
			_emnapi_node_make_callback,
			napi_close_callback_scope,
			napi_make_callback,
			napi_open_callback_scope
		});
		/**
		* @__deps malloc
		* @__deps free
		* @__postset
		* ```
		* emnapiTSFN.init();
		* ```
		*/
		var emnapiTSFN = {
			offset: {
				resource: 0,
				async_id: 8,
				trigger_async_id: 16,
				queue_size: 24,
				queue: 28,
				thread_count: 32,
				is_closing: 36,
				dispatch_state: 40,
				context: 44,
				max_queue_size: 48,
				ref: 52,
				env: 56,
				finalize_data: 60,
				finalize_cb: 64,
				call_js_cb: 68,
				handles_closing: 72,
				async_ref: 76,
				mutex: 80,
				cond: 84,
				end: 88
			},
			init: function() {
				if (typeof PThread !== "undefined") {
					PThread.unusedWorkers.forEach(emnapiTSFN.addListener);
					PThread.runningWorkers.forEach(emnapiTSFN.addListener);
					var __original_getNewWorker_1 = PThread.getNewWorker;
					PThread.getNewWorker = function() {
						var r$1 = __original_getNewWorker_1.apply(this, arguments);
						emnapiTSFN.addListener(r$1);
						return r$1;
					};
				}
			},
			addListener: function(worker) {
				if (!worker) return false;
				if (worker._emnapiTSFNListener) return true;
				var handler = function(e$2) {
					var __emnapi__ = (ENVIRONMENT_IS_NODE$1 ? e$2 : e$2.data).__emnapi__;
					if (__emnapi__) {
						var type = __emnapi__.type;
						var payload = __emnapi__.payload;
						if (type === "tsfn-send") emnapiTSFN.dispatch(payload.tsfn);
					}
				};
				var dispose = function() {
					if (ENVIRONMENT_IS_NODE$1) worker.off("message", handler);
					else worker.removeEventListener("message", handler, false);
					delete worker._emnapiTSFNListener;
				};
				worker._emnapiTSFNListener = {
					handler,
					dispose
				};
				if (ENVIRONMENT_IS_NODE$1) worker.on("message", handler);
				else worker.addEventListener("message", handler, false);
				return true;
			},
			initQueue: function(func) {
				var size = 8;
				var queue = _malloc(size);
				if (!queue) return false;
				new Uint8Array(wasmMemory.buffer, queue, size).fill(0);
				emnapiTSFN.storeSizeTypeValue(func + emnapiTSFN.offset.queue, queue, false);
				return true;
			},
			destroyQueue: function(func) {
				var queue = emnapiTSFN.loadSizeTypeValue(func + emnapiTSFN.offset.queue, false);
				if (queue) _free(queue);
			},
			pushQueue: function(func, data) {
				var queue = emnapiTSFN.loadSizeTypeValue(func + emnapiTSFN.offset.queue, false);
				var head = emnapiTSFN.loadSizeTypeValue(queue, false);
				var tail = emnapiTSFN.loadSizeTypeValue(queue + 4, false);
				var node = _malloc(8);
				if (!node) throw new Error("OOM");
				emnapiTSFN.storeSizeTypeValue(node, data, false);
				emnapiTSFN.storeSizeTypeValue(node + 4, 0, false);
				if (head === 0 && tail === 0) {
					emnapiTSFN.storeSizeTypeValue(queue, node, false);
					emnapiTSFN.storeSizeTypeValue(queue + 4, node, false);
				} else {
					emnapiTSFN.storeSizeTypeValue(tail + 4, node, false);
					emnapiTSFN.storeSizeTypeValue(queue + 4, node, false);
				}
				emnapiTSFN.addQueueSize(func);
			},
			shiftQueue: function(func) {
				var queue = emnapiTSFN.loadSizeTypeValue(func + emnapiTSFN.offset.queue, false);
				var head = emnapiTSFN.loadSizeTypeValue(queue, false);
				if (head === 0) return 0;
				var node = head;
				var next = emnapiTSFN.loadSizeTypeValue(head + 4, false);
				emnapiTSFN.storeSizeTypeValue(queue, next, false);
				if (next === 0) emnapiTSFN.storeSizeTypeValue(queue + 4, 0, false);
				emnapiTSFN.storeSizeTypeValue(node + 4, 0, false);
				var value = emnapiTSFN.loadSizeTypeValue(node, false);
				_free(node);
				emnapiTSFN.subQueueSize(func);
				return value;
			},
			push: function(func, data, mode) {
				var mutex = emnapiTSFN.getMutex(func);
				var cond = emnapiTSFN.getCond(func);
				var waitCondition = function() {
					var queueSize = emnapiTSFN.getQueueSize(func);
					var maxSize = emnapiTSFN.getMaxQueueSize(func);
					var isClosing = emnapiTSFN.getIsClosing(func);
					return queueSize >= maxSize && maxSize > 0 && !isClosing;
				};
				var isBrowserMain = typeof window !== "undefined" && typeof document !== "undefined" && !ENVIRONMENT_IS_NODE$1;
				return mutex.execute(function() {
					while (waitCondition()) {
						if (mode === 0) return 15;
						/**
						* Browser JS main thread can not use `Atomics.wait`
						*
						* Related:
						* https://github.com/nodejs/node/pull/32689
						* https://github.com/nodejs/node/pull/33453
						*/
						if (isBrowserMain) return 21;
						cond.wait();
					}
					if (emnapiTSFN.getIsClosing(func)) if (emnapiTSFN.getThreadCount(func) === 0) return 1;
					else {
						emnapiTSFN.subThreadCount(func);
						return 16;
					}
					else {
						emnapiTSFN.pushQueue(func, data);
						emnapiTSFN.send(func);
						return 0;
					}
				});
			},
			getMutex: function(func) {
				var index = func + emnapiTSFN.offset.mutex;
				var mutex = {
					lock: function() {
						var isBrowserMain = typeof window !== "undefined" && typeof document !== "undefined" && !ENVIRONMENT_IS_NODE$1;
						var i32a = new Int32Array(wasmMemory.buffer, index, 1);
						if (isBrowserMain) while (true) {
							var oldValue = Atomics.compareExchange(i32a, 0, 0, 1);
							if (oldValue === 0) return;
						}
						else while (true) {
							var oldValue = Atomics.compareExchange(i32a, 0, 0, 1);
							if (oldValue === 0) return;
							Atomics.wait(i32a, 0, 1);
						}
					},
					unlock: function() {
						var i32a = new Int32Array(wasmMemory.buffer, index, 1);
						if (Atomics.compareExchange(i32a, 0, 1, 0) !== 1) throw new Error("Tried to unlock while not holding the mutex");
						Atomics.notify(i32a, 0, 1);
					},
					execute: function(fn) {
						mutex.lock();
						try {
							return fn();
						} finally {
							mutex.unlock();
						}
					}
				};
				return mutex;
			},
			getCond: function(func) {
				var index = func + emnapiTSFN.offset.cond;
				var mutex = emnapiTSFN.getMutex(func);
				return {
					wait: function() {
						var i32a = new Int32Array(wasmMemory.buffer, index, 1);
						var value = Atomics.load(i32a, 0);
						mutex.unlock();
						Atomics.wait(i32a, 0, value);
						mutex.lock();
					},
					signal: function() {
						var i32a = new Int32Array(wasmMemory.buffer, index, 1);
						Atomics.add(i32a, 0, 1);
						Atomics.notify(i32a, 0, 1);
					}
				};
			},
			getQueueSize: function(func) {
				return emnapiTSFN.loadSizeTypeValue(func + emnapiTSFN.offset.queue_size, true);
			},
			addQueueSize: function(func) {
				var offset = emnapiTSFN.offset.queue_size;
				var arr = new Uint32Array(wasmMemory.buffer), index = func + offset >> 2;
				Atomics.add(arr, index, 1);
			},
			subQueueSize: function(func) {
				var offset = emnapiTSFN.offset.queue_size;
				var arr = new Uint32Array(wasmMemory.buffer), index = func + offset >> 2;
				Atomics.sub(arr, index, 1);
			},
			getThreadCount: function(func) {
				return emnapiTSFN.loadSizeTypeValue(func + emnapiTSFN.offset.thread_count, true);
			},
			addThreadCount: function(func) {
				var offset = emnapiTSFN.offset.thread_count;
				var arr = new Uint32Array(wasmMemory.buffer), index = func + offset >> 2;
				Atomics.add(arr, index, 1);
			},
			subThreadCount: function(func) {
				var offset = emnapiTSFN.offset.thread_count;
				var arr = new Uint32Array(wasmMemory.buffer), index = func + offset >> 2;
				Atomics.sub(arr, index, 1);
			},
			getIsClosing: function(func) {
				return Atomics.load(new Int32Array(wasmMemory.buffer), func + emnapiTSFN.offset.is_closing >> 2);
			},
			setIsClosing: function(func, value) {
				Atomics.store(new Int32Array(wasmMemory.buffer), func + emnapiTSFN.offset.is_closing >> 2, value);
			},
			getHandlesClosing: function(func) {
				return Atomics.load(new Int32Array(wasmMemory.buffer), func + emnapiTSFN.offset.handles_closing >> 2);
			},
			setHandlesClosing: function(func, value) {
				Atomics.store(new Int32Array(wasmMemory.buffer), func + emnapiTSFN.offset.handles_closing >> 2, value);
			},
			getDispatchState: function(func) {
				return Atomics.load(new Uint32Array(wasmMemory.buffer), func + emnapiTSFN.offset.dispatch_state >> 2);
			},
			getContext: function(func) {
				return emnapiTSFN.loadSizeTypeValue(func + emnapiTSFN.offset.context, false);
			},
			getMaxQueueSize: function(func) {
				return emnapiTSFN.loadSizeTypeValue(func + emnapiTSFN.offset.max_queue_size, true);
			},
			getEnv: function(func) {
				return emnapiTSFN.loadSizeTypeValue(func + emnapiTSFN.offset.env, false);
			},
			getCallJSCb: function(func) {
				return emnapiTSFN.loadSizeTypeValue(func + emnapiTSFN.offset.call_js_cb, false);
			},
			getRef: function(func) {
				return emnapiTSFN.loadSizeTypeValue(func + emnapiTSFN.offset.ref, false);
			},
			getResource: function(func) {
				return emnapiTSFN.loadSizeTypeValue(func + emnapiTSFN.offset.resource, false);
			},
			getFinalizeCb: function(func) {
				return emnapiTSFN.loadSizeTypeValue(func + emnapiTSFN.offset.finalize_cb, false);
			},
			getFinalizeData: function(func) {
				return emnapiTSFN.loadSizeTypeValue(func + emnapiTSFN.offset.finalize_data, false);
			},
			loadSizeTypeValue: function(offset, unsigned) {
				var ret;
				var arr;
				if (unsigned) {
					arr = new Uint32Array(wasmMemory.buffer);
					ret = Atomics.load(arr, offset >> 2);
					return ret;
				} else {
					arr = new Int32Array(wasmMemory.buffer);
					ret = Atomics.load(arr, offset >> 2);
					return ret;
				}
			},
			storeSizeTypeValue: function(offset, value, unsigned) {
				var arr;
				if (unsigned) {
					arr = new Uint32Array(wasmMemory.buffer);
					Atomics.store(arr, offset >> 2, value);
					return;
				} else {
					arr = new Int32Array(wasmMemory.buffer);
					Atomics.store(arr, offset >> 2, value >>> 0);
					return;
				}
			},
			destroy: function(func) {
				emnapiTSFN.destroyQueue(func);
				var env = emnapiTSFN.getEnv(func);
				var envObject = emnapiCtx.envStore.get(env);
				var ref = emnapiTSFN.getRef(func);
				if (ref) emnapiCtx.refStore.get(ref).dispose();
				emnapiCtx.removeCleanupHook(envObject, emnapiTSFN.cleanup, func);
				envObject.unref();
				var asyncRefOffset = func + emnapiTSFN.offset.async_ref >> 2;
				var arr = new Int32Array(wasmMemory.buffer);
				if (Atomics.load(arr, asyncRefOffset)) {
					Atomics.store(arr, asyncRefOffset, 0);
					emnapiCtx.decreaseWaitingRequestCounter();
				}
				var resource = emnapiTSFN.getResource(func);
				emnapiCtx.refStore.get(resource).dispose();
				if (emnapiNodeBinding) {
					var view = new DataView(wasmMemory.buffer);
					var asyncId = view.getFloat64(func + emnapiTSFN.offset.async_id, true);
					var triggerAsyncId = view.getFloat64(func + emnapiTSFN.offset.trigger_async_id, true);
					_emnapi_node_emit_async_destroy(asyncId, triggerAsyncId);
				}
				_free(func);
			},
			emptyQueueAndDelete: function(func) {
				var callJsCb = emnapiTSFN.getCallJSCb(func);
				var context$1 = emnapiTSFN.getContext(func);
				var data;
				while (emnapiTSFN.getQueueSize(func) > 0) {
					data = emnapiTSFN.shiftQueue(func);
					if (callJsCb) wasmTable.get(callJsCb)(0, 0, context$1, data);
				}
				emnapiTSFN.destroy(func);
			},
			finalize: function(func) {
				var env = emnapiTSFN.getEnv(func);
				var envObject = emnapiCtx.envStore.get(env);
				emnapiCtx.openScope(envObject);
				var finalize = emnapiTSFN.getFinalizeCb(func);
				var data = emnapiTSFN.getFinalizeData(func);
				var context$1 = emnapiTSFN.getContext(func);
				var f$1 = function() {
					envObject.callFinalizerInternal(0, finalize, data, context$1);
				};
				try {
					if (finalize) if (emnapiNodeBinding) {
						var resource = emnapiTSFN.getResource(func);
						var resource_value = emnapiCtx.refStore.get(resource).get();
						var resourceObject = emnapiCtx.handleStore.get(resource_value).value;
						var view = new DataView(wasmMemory.buffer);
						var asyncId = view.getFloat64(func + emnapiTSFN.offset.async_id, true);
						var triggerAsyncId = view.getFloat64(func + emnapiTSFN.offset.trigger_async_id, true);
						emnapiNodeBinding.node.makeCallback(resourceObject, f$1, [], {
							asyncId,
							triggerAsyncId
						});
					} else f$1();
					emnapiTSFN.emptyQueueAndDelete(func);
				} finally {
					emnapiCtx.closeScope(envObject);
				}
			},
			cleanup: function(func) {
				emnapiTSFN.closeHandlesAndMaybeDelete(func, 1);
			},
			closeHandlesAndMaybeDelete: function(func, set_closing) {
				var env = emnapiTSFN.getEnv(func);
				var envObject = emnapiCtx.envStore.get(env);
				emnapiCtx.openScope(envObject);
				try {
					if (set_closing) emnapiTSFN.getMutex(func).execute(function() {
						emnapiTSFN.setIsClosing(func, 1);
						if (emnapiTSFN.getMaxQueueSize(func) > 0) emnapiTSFN.getCond(func).signal();
					});
					if (emnapiTSFN.getHandlesClosing(func)) return;
					emnapiTSFN.setHandlesClosing(func, 1);
					emnapiCtx.feature.setImmediate(function() {
						emnapiTSFN.finalize(func);
					});
				} finally {
					emnapiCtx.closeScope(envObject);
				}
			},
			dispatchOne: function(func) {
				var data = 0;
				var popped_value = false;
				var has_more = false;
				var mutex = emnapiTSFN.getMutex(func);
				var cond = emnapiTSFN.getCond(func);
				mutex.execute(function() {
					if (emnapiTSFN.getIsClosing(func)) emnapiTSFN.closeHandlesAndMaybeDelete(func, 0);
					else {
						var size = emnapiTSFN.getQueueSize(func);
						if (size > 0) {
							data = emnapiTSFN.shiftQueue(func);
							popped_value = true;
							var maxQueueSize = emnapiTSFN.getMaxQueueSize(func);
							if (size === maxQueueSize && maxQueueSize > 0) cond.signal();
							size--;
						}
						if (size === 0) {
							if (emnapiTSFN.getThreadCount(func) === 0) {
								emnapiTSFN.setIsClosing(func, 1);
								if (emnapiTSFN.getMaxQueueSize(func) > 0) cond.signal();
								emnapiTSFN.closeHandlesAndMaybeDelete(func, 0);
							}
						} else has_more = true;
					}
				});
				if (popped_value) {
					var env = emnapiTSFN.getEnv(func);
					var envObject_1 = emnapiCtx.envStore.get(env);
					emnapiCtx.openScope(envObject_1);
					var f$1 = function() {
						envObject_1.callbackIntoModule(false, function() {
							var callJsCb = emnapiTSFN.getCallJSCb(func);
							var ref = emnapiTSFN.getRef(func);
							var js_callback = ref ? emnapiCtx.refStore.get(ref).get() : 0;
							if (callJsCb) {
								var context$1 = emnapiTSFN.getContext(func);
								wasmTable.get(callJsCb)(env, js_callback, context$1, data);
							} else {
								var jsCallback = js_callback ? emnapiCtx.handleStore.get(js_callback).value : null;
								if (typeof jsCallback === "function") jsCallback();
							}
						});
					};
					try {
						if (emnapiNodeBinding) {
							var resource = emnapiTSFN.getResource(func);
							var resource_value = emnapiCtx.refStore.get(resource).get();
							var resourceObject = emnapiCtx.handleStore.get(resource_value).value;
							var view = new DataView(wasmMemory.buffer);
							emnapiNodeBinding.node.makeCallback(resourceObject, f$1, [], {
								asyncId: view.getFloat64(func + emnapiTSFN.offset.async_id, true),
								triggerAsyncId: view.getFloat64(func + emnapiTSFN.offset.trigger_async_id, true)
							});
						} else f$1();
					} finally {
						emnapiCtx.closeScope(envObject_1);
					}
				}
				return has_more;
			},
			dispatch: function(func) {
				var has_more = true;
				var iterations_left = 1e3;
				var ui32a = new Uint32Array(wasmMemory.buffer);
				var index = func + emnapiTSFN.offset.dispatch_state >> 2;
				while (has_more && --iterations_left !== 0) {
					Atomics.store(ui32a, index, 1);
					has_more = emnapiTSFN.dispatchOne(func);
					if (Atomics.exchange(ui32a, index, 0) !== 1) has_more = true;
				}
				if (has_more) emnapiTSFN.send(func);
			},
			send: function(func) {
				if ((Atomics.or(new Uint32Array(wasmMemory.buffer), func + emnapiTSFN.offset.dispatch_state >> 2, 2) & 1) === 1) return;
				if (typeof ENVIRONMENT_IS_PTHREAD !== "undefined" && ENVIRONMENT_IS_PTHREAD) postMessage({ __emnapi__: {
					type: "tsfn-send",
					payload: { tsfn: func }
				} });
				else emnapiCtx.feature.setImmediate(function() {
					emnapiTSFN.dispatch(func);
				});
			}
		};
		/** @__sig ippppppppppp */
		function napi_create_threadsafe_function(env, func, async_resource, async_resource_name, max_queue_size, initial_thread_count, thread_finalize_data, thread_finalize_cb, context$1, call_js_cb, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!async_resource_name) return envObject.setLastError(1);
			max_queue_size = max_queue_size >>> 0;
			initial_thread_count = initial_thread_count >>> 0;
			if (initial_thread_count === 0) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var ref = 0;
			if (!func) {
				if (!call_js_cb) return envObject.setLastError(1);
			} else {
				if (typeof emnapiCtx.handleStore.get(func).value !== "function") return envObject.setLastError(1);
				ref = emnapiCtx.createReference(envObject, func, 1, 1).id;
			}
			var asyncResourceObject;
			if (async_resource) {
				asyncResourceObject = emnapiCtx.handleStore.get(async_resource).value;
				if (asyncResourceObject == null) return envObject.setLastError(2);
				asyncResourceObject = Object(asyncResourceObject);
			} else asyncResourceObject = {};
			var resource = envObject.ensureHandleId(asyncResourceObject);
			var asyncResourceName = emnapiCtx.handleStore.get(async_resource_name).value;
			if (typeof asyncResourceName === "symbol") return envObject.setLastError(3);
			asyncResourceName = String(asyncResourceName);
			var resource_name = envObject.ensureHandleId(asyncResourceName);
			var sizeofTSFN = emnapiTSFN.offset.end;
			var tsfn = _malloc(sizeofTSFN);
			if (!tsfn) return envObject.setLastError(9);
			new Uint8Array(wasmMemory.buffer).subarray(tsfn, tsfn + sizeofTSFN).fill(0);
			var resourceRef = emnapiCtx.createReference(envObject, resource, 1, 1);
			var resource_ = resourceRef.id;
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			HEAP_DATA_VIEW.setUint32(tsfn, resource_, true);
			if (!emnapiTSFN.initQueue(tsfn)) {
				_free(tsfn);
				resourceRef.dispose();
				return envObject.setLastError(9);
			}
			_emnapi_node_emit_async_init(resource, resource_name, -1, tsfn + emnapiTSFN.offset.async_id);
			HEAP_DATA_VIEW.setUint32(tsfn + emnapiTSFN.offset.thread_count, initial_thread_count, true);
			HEAP_DATA_VIEW.setUint32(tsfn + emnapiTSFN.offset.context, context$1, true);
			HEAP_DATA_VIEW.setUint32(tsfn + emnapiTSFN.offset.max_queue_size, max_queue_size, true);
			HEAP_DATA_VIEW.setUint32(tsfn + emnapiTSFN.offset.ref, ref, true);
			HEAP_DATA_VIEW.setUint32(tsfn + emnapiTSFN.offset.env, env, true);
			HEAP_DATA_VIEW.setUint32(tsfn + emnapiTSFN.offset.finalize_data, thread_finalize_data, true);
			HEAP_DATA_VIEW.setUint32(tsfn + emnapiTSFN.offset.finalize_cb, thread_finalize_cb, true);
			HEAP_DATA_VIEW.setUint32(tsfn + emnapiTSFN.offset.call_js_cb, call_js_cb, true);
			emnapiCtx.addCleanupHook(envObject, emnapiTSFN.cleanup, tsfn);
			envObject.ref();
			emnapiCtx.increaseWaitingRequestCounter();
			HEAP_DATA_VIEW.setInt32(tsfn + emnapiTSFN.offset.async_ref, 1, true);
			HEAP_DATA_VIEW.setUint32(result, tsfn, true);
			return envObject.clearLastError();
		}
		/** @__sig ipp */
		function napi_get_threadsafe_function_context(func, result) {
			if (!func || !result) {
				abort();
				return 1;
			}
			var context$1 = emnapiTSFN.getContext(func);
			new DataView(wasmMemory.buffer).setUint32(result, context$1, true);
			return 0;
		}
		/** @__sig ippi */
		function napi_call_threadsafe_function(func, data, mode) {
			if (!func) {
				abort();
				return 1;
			}
			return emnapiTSFN.push(func, data, mode);
		}
		/** @__sig ip */
		function napi_acquire_threadsafe_function(func) {
			if (!func) {
				abort();
				return 1;
			}
			return emnapiTSFN.getMutex(func).execute(function() {
				if (emnapiTSFN.getIsClosing(func)) return 16;
				emnapiTSFN.addThreadCount(func);
				return 0;
			});
		}
		/** @__sig ipi */
		function napi_release_threadsafe_function(func, mode) {
			if (!func) {
				abort();
				return 1;
			}
			var mutex = emnapiTSFN.getMutex(func);
			var cond = emnapiTSFN.getCond(func);
			return mutex.execute(function() {
				if (emnapiTSFN.getThreadCount(func) === 0) return 1;
				emnapiTSFN.subThreadCount(func);
				if (emnapiTSFN.getThreadCount(func) === 0 || mode === 1) {
					if (!emnapiTSFN.getIsClosing(func)) {
						var isClosingValue = mode === 1 ? 1 : 0;
						emnapiTSFN.setIsClosing(func, isClosingValue);
						if (isClosingValue && emnapiTSFN.getMaxQueueSize(func) > 0) cond.signal();
						emnapiTSFN.send(func);
					}
				}
				return 0;
			});
		}
		/** @__sig ipp */
		function napi_unref_threadsafe_function(env, func) {
			if (!func) {
				abort();
				return 1;
			}
			var asyncRefOffset = func + emnapiTSFN.offset.async_ref >> 2;
			var arr = new Int32Array(wasmMemory.buffer);
			if (Atomics.load(arr, asyncRefOffset)) {
				Atomics.store(arr, asyncRefOffset, 0);
				emnapiCtx.decreaseWaitingRequestCounter();
			}
			return 0;
		}
		/** @__sig ipp */
		function napi_ref_threadsafe_function(env, func) {
			if (!func) {
				abort();
				return 1;
			}
			var asyncRefOffset = func + emnapiTSFN.offset.async_ref >> 2;
			var arr = new Int32Array(wasmMemory.buffer);
			if (!Atomics.load(arr, asyncRefOffset)) {
				Atomics.store(arr, asyncRefOffset, 1);
				emnapiCtx.increaseWaitingRequestCounter();
			}
			return 0;
		}
		var emnapiAWMT = {
			unusedWorkers: [],
			runningWorkers: [],
			workQueue: [],
			workerReady: null,
			offset: {
				resource: 0,
				async_id: 8,
				trigger_async_id: 16,
				env: 24,
				data: 28,
				execute: 32,
				complete: 36,
				end: 40
			},
			init: function() {
				emnapiAWMT.unusedWorkers = [];
				emnapiAWMT.runningWorkers = [];
				emnapiAWMT.workQueue = [];
				emnapiAWMT.workerReady = null;
			},
			addListener: function(worker) {
				if (!worker) return false;
				if (worker._emnapiAWMTListener) return true;
				var handler = function(e$2) {
					var __emnapi__ = (ENVIRONMENT_IS_NODE$1 ? e$2 : e$2.data).__emnapi__;
					if (__emnapi__) {
						var type = __emnapi__.type;
						var payload = __emnapi__.payload;
						if (type === "async-work-complete") {
							emnapiCtx.decreaseWaitingRequestCounter();
							emnapiAWMT.runningWorkers.splice(emnapiAWMT.runningWorkers.indexOf(worker), 1);
							emnapiAWMT.unusedWorkers.push(worker);
							emnapiAWMT.checkIdleWorker();
							emnapiAWMT.callComplete(payload.work, 0);
						} else if (type === "async-work-queue") emnapiAWMT.scheduleWork(payload.work);
						else if (type === "async-work-cancel") emnapiAWMT.cancelWork(payload.work);
					}
				};
				var dispose = function() {
					if (ENVIRONMENT_IS_NODE$1) worker.off("message", handler);
					else worker.removeEventListener("message", handler, false);
					delete worker._emnapiAWMTListener;
				};
				worker._emnapiAWMTListener = {
					handler,
					dispose
				};
				if (ENVIRONMENT_IS_NODE$1) worker.on("message", handler);
				else worker.addEventListener("message", handler, false);
				return true;
			},
			initWorkers: function(n$2) {
				if (ENVIRONMENT_IS_PTHREAD) return emnapiAWMT.workerReady || (emnapiAWMT.workerReady = Promise.resolve());
				if (emnapiAWMT.workerReady) return emnapiAWMT.workerReady;
				if (typeof onCreateWorker !== "function") throw new TypeError("`options.onCreateWorker` is not a function");
				var promises = [];
				var args$1 = [];
				if (!("emnapi_async_worker_create" in wasmInstance.exports)) throw new TypeError("`emnapi_async_worker_create` is not exported, please try to add `--export=emnapi_async_worker_create` to linker flags");
				for (var i$1 = 0; i$1 < n$2; ++i$1) args$1.push(wasmInstance.exports.emnapi_async_worker_create());
				try {
					var _loop_1 = function(i$1$1) {
						var worker = onCreateWorker({
							type: "async-work",
							name: "emnapi-async-worker"
						});
						var p$1 = PThread.loadWasmModuleToWorker(worker);
						emnapiAWMT.addListener(worker);
						promises.push(p$1.then(function() {
							if (typeof worker.unref === "function") worker.unref();
						}));
						emnapiAWMT.unusedWorkers.push(worker);
						var arg$1 = args$1[i$1$1];
						worker.threadBlockBase = arg$1;
						worker.postMessage({ __emnapi__: {
							type: "async-worker-init",
							payload: { arg: arg$1 }
						} });
					};
					for (var i$1 = 0; i$1 < n$2; ++i$1) _loop_1(i$1);
				} catch (err$1) {
					for (var i$1 = 0; i$1 < n$2; ++i$1) {
						var arg = args$1[i$1];
						_free(arg);
					}
					throw err$1;
				}
				emnapiAWMT.workerReady = Promise.all(promises);
				return emnapiAWMT.workerReady;
			},
			checkIdleWorker: function() {
				if (emnapiAWMT.unusedWorkers.length > 0 && emnapiAWMT.workQueue.length > 0) {
					var worker = emnapiAWMT.unusedWorkers.shift();
					var work = emnapiAWMT.workQueue.shift();
					emnapiAWMT.runningWorkers.push(worker);
					worker.postMessage({ __emnapi__: {
						type: "async-work-execute",
						payload: { work }
					} });
				}
			},
			getResource: function(work) {
				return emnapiTSFN.loadSizeTypeValue(work + emnapiAWMT.offset.resource, false);
			},
			getExecute: function(work) {
				return emnapiTSFN.loadSizeTypeValue(work + emnapiAWMT.offset.execute, false);
			},
			getComplete: function(work) {
				return emnapiTSFN.loadSizeTypeValue(work + emnapiAWMT.offset.complete, false);
			},
			getEnv: function(work) {
				return emnapiTSFN.loadSizeTypeValue(work + emnapiAWMT.offset.env, false);
			},
			getData: function(work) {
				return emnapiTSFN.loadSizeTypeValue(work + emnapiAWMT.offset.data, false);
			},
			scheduleWork: function(work) {
				var _a;
				if (ENVIRONMENT_IS_PTHREAD) {
					var postMessage_1 = napiModule.postMessage;
					postMessage_1({ __emnapi__: {
						type: "async-work-queue",
						payload: { work }
					} });
					return;
				}
				emnapiCtx.increaseWaitingRequestCounter();
				emnapiAWMT.workQueue.push(work);
				if ((_a = emnapiAWMT.workerReady) === null || _a === void 0 ? void 0 : _a.ready) emnapiAWMT.checkIdleWorker();
				else {
					var fail = function(err$1) {
						emnapiCtx.decreaseWaitingRequestCounter();
						throw err$1;
					};
					try {
						emnapiAWMT.initWorkers(_emnapi_async_work_pool_size()).then(function() {
							emnapiAWMT.workerReady.ready = true;
							emnapiAWMT.checkIdleWorker();
						}, fail);
					} catch (err$1) {
						fail(err$1);
					}
				}
			},
			cancelWork: function(work) {
				if (ENVIRONMENT_IS_PTHREAD) {
					var postMessage_2 = napiModule.postMessage;
					postMessage_2({ __emnapi__: {
						type: "async-work-cancel",
						payload: { work }
					} });
					return 0;
				}
				var index = emnapiAWMT.workQueue.indexOf(work);
				if (index !== -1) {
					emnapiAWMT.workQueue.splice(index, 1);
					emnapiCtx.feature.setImmediate(function() {
						emnapiCtx.decreaseWaitingRequestCounter();
						emnapiAWMT.checkIdleWorker();
						emnapiAWMT.callComplete(work, 11);
					});
					return 0;
				}
				return 9;
			},
			callComplete: function(work, status) {
				var complete = emnapiAWMT.getComplete(work);
				var env = emnapiAWMT.getEnv(work);
				var data = emnapiAWMT.getData(work);
				var envObject = emnapiCtx.envStore.get(env);
				var scope = emnapiCtx.openScope(envObject);
				var callback = function() {
					if (!complete) return;
					envObject.callbackIntoModule(true, function() {
						wasmTable.get(complete)(env, status, data);
					});
				};
				try {
					if (emnapiNodeBinding) {
						var resource = emnapiAWMT.getResource(work);
						var resource_value = emnapiCtx.refStore.get(resource).get();
						var resourceObject = emnapiCtx.handleStore.get(resource_value).value;
						var view = new DataView(wasmMemory.buffer);
						var asyncId = view.getFloat64(work + emnapiAWMT.offset.async_id, true);
						var triggerAsyncId = view.getFloat64(work + emnapiAWMT.offset.trigger_async_id, true);
						emnapiNodeBinding.node.makeCallback(resourceObject, callback, [], {
							asyncId,
							triggerAsyncId
						});
					} else callback();
				} finally {
					emnapiCtx.closeScope(envObject, scope);
				}
			}
		};
		/** @__sig ippppppp */
		var napi_create_async_work = singleThreadAsyncWork ? function(env, resource, resource_name, execute, complete, data, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!execute) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var resourceObject;
			if (resource) resourceObject = Object(emnapiCtx.handleStore.get(resource).value);
			else resourceObject = {};
			if (!resource_name) return envObject.setLastError(1);
			var resourceName = String(emnapiCtx.handleStore.get(resource_name).value);
			var id$1 = emnapiAWST.create(env, resourceObject, resourceName, execute, complete, data);
			new DataView(wasmMemory.buffer).setUint32(result, id$1, true);
			return envObject.clearLastError();
		} : function(env, resource, resource_name, execute, complete, data, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!execute) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var resourceObject;
			if (resource) resourceObject = Object(emnapiCtx.handleStore.get(resource).value);
			else resourceObject = {};
			if (!resource_name) return envObject.setLastError(1);
			var sizeofAW = emnapiAWMT.offset.end;
			var aw = _malloc(sizeofAW);
			if (!aw) return envObject.setLastError(9);
			new Uint8Array(wasmMemory.buffer).subarray(aw, aw + sizeofAW).fill(0);
			var s$1 = envObject.ensureHandleId(resourceObject);
			var resource_ = emnapiCtx.createReference(envObject, s$1, 1, 1).id;
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			HEAP_DATA_VIEW.setUint32(aw, resource_, true);
			_emnapi_node_emit_async_init(s$1, resource_name, -1, aw + emnapiAWMT.offset.async_id);
			HEAP_DATA_VIEW.setUint32(aw + emnapiAWMT.offset.env, env, true);
			HEAP_DATA_VIEW.setUint32(aw + emnapiAWMT.offset.execute, execute, true);
			HEAP_DATA_VIEW.setUint32(aw + emnapiAWMT.offset.complete, complete, true);
			HEAP_DATA_VIEW.setUint32(aw + emnapiAWMT.offset.data, data, true);
			HEAP_DATA_VIEW.setUint32(result, aw, true);
			return envObject.clearLastError();
		};
		/** @__sig ipp */
		var napi_delete_async_work = singleThreadAsyncWork ? function(env, work) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!work) return envObject.setLastError(1);
			emnapiAWST.remove(work);
			return envObject.clearLastError();
		} : function(env, work) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!work) return envObject.setLastError(1);
			var resource = emnapiAWMT.getResource(work);
			emnapiCtx.refStore.get(resource).dispose();
			if (emnapiNodeBinding) {
				var view = new DataView(wasmMemory.buffer);
				var asyncId = view.getFloat64(work + emnapiAWMT.offset.async_id, true);
				var triggerAsyncId = view.getFloat64(work + emnapiAWMT.offset.trigger_async_id, true);
				_emnapi_node_emit_async_destroy(asyncId, triggerAsyncId);
			}
			_free(work);
			return envObject.clearLastError();
		};
		/** @__sig ipp */
		var napi_queue_async_work = singleThreadAsyncWork ? function(env, work) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			if (!work) return envObject.setLastError(1);
			emnapiAWST.queue(work);
			return envObject.clearLastError();
		} : function(env, work) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			if (!work) return envObject.setLastError(1);
			emnapiAWMT.scheduleWork(work);
			return envObject.clearLastError();
		};
		/** @__sig ipp */
		var napi_cancel_async_work = singleThreadAsyncWork ? function(env, work) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			if (!work) return envObject.setLastError(1);
			var status = emnapiAWST.cancel(work);
			if (status === 0) return envObject.clearLastError();
			return envObject.setLastError(status);
		} : function(env, work) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			if (!work) return envObject.setLastError(1);
			var status = emnapiAWMT.cancelWork(work);
			if (status === 0) return envObject.clearLastError();
			return envObject.setLastError(status);
		};
		function initWorker(startArg) {
			if (napiModule.childThread) {
				if (typeof wasmInstance.exports.emnapi_async_worker_init !== "function") throw new TypeError("`emnapi_async_worker_init` is not exported, please try to add `--export=emnapi_async_worker_init` to linker flags");
				wasmInstance.exports.emnapi_async_worker_init(startArg);
			} else throw new Error("startThread is only available in child threads");
		}
		function executeAsyncWork(work) {
			if (!ENVIRONMENT_IS_PTHREAD) return;
			var execute = emnapiAWMT.getExecute(work);
			var env = emnapiAWMT.getEnv(work);
			var data = emnapiAWMT.getData(work);
			wasmTable.get(execute)(env, data);
			var postMessage$1 = napiModule.postMessage;
			postMessage$1({ __emnapi__: {
				type: "async-work-complete",
				payload: { work }
			} });
		}
		napiModule.initWorker = initWorker;
		napiModule.executeAsyncWork = executeAsyncWork;
		var asyncWorkMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			napi_cancel_async_work,
			napi_create_async_work,
			napi_delete_async_work,
			napi_queue_async_work
		});
		/**
		* @__deps malloc
		* @__deps free
		* @__postset
		* ```
		* emnapiExternalMemory.init();
		* ```
		*/
		var emnapiExternalMemory = {
			registry: typeof FinalizationRegistry === "function" ? new FinalizationRegistry(function(_pointer) {
				_free(_pointer);
			}) : void 0,
			table: /* @__PURE__ */ new WeakMap(),
			wasmMemoryViewTable: /* @__PURE__ */ new WeakMap(),
			init: function() {
				emnapiExternalMemory.registry = typeof FinalizationRegistry === "function" ? new FinalizationRegistry(function(_pointer) {
					_free(_pointer);
				}) : void 0;
				emnapiExternalMemory.table = /* @__PURE__ */ new WeakMap();
				emnapiExternalMemory.wasmMemoryViewTable = /* @__PURE__ */ new WeakMap();
			},
			isDetachedArrayBuffer: function(arrayBuffer) {
				if (arrayBuffer.byteLength === 0) try {
					new Uint8Array(arrayBuffer);
				} catch (_) {
					return true;
				}
				return false;
			},
			getArrayBufferPointer: function(arrayBuffer, shouldCopy) {
				var _a;
				var info = {
					address: 0,
					ownership: 0,
					runtimeAllocated: 0
				};
				if (arrayBuffer === wasmMemory.buffer) return info;
				var isDetached = emnapiExternalMemory.isDetachedArrayBuffer(arrayBuffer);
				if (emnapiExternalMemory.table.has(arrayBuffer)) {
					var cachedInfo = emnapiExternalMemory.table.get(arrayBuffer);
					if (isDetached) {
						cachedInfo.address = 0;
						return cachedInfo;
					}
					if (shouldCopy && cachedInfo.ownership === 0 && cachedInfo.runtimeAllocated === 1) new Uint8Array(wasmMemory.buffer).set(new Uint8Array(arrayBuffer), cachedInfo.address);
					return cachedInfo;
				}
				if (isDetached || arrayBuffer.byteLength === 0) return info;
				if (!shouldCopy) return info;
				var pointer = _malloc(arrayBuffer.byteLength);
				if (!pointer) throw new Error("Out of memory");
				new Uint8Array(wasmMemory.buffer).set(new Uint8Array(arrayBuffer), pointer);
				info.address = pointer;
				info.ownership = emnapiExternalMemory.registry ? 0 : 1;
				info.runtimeAllocated = 1;
				emnapiExternalMemory.table.set(arrayBuffer, info);
				(_a = emnapiExternalMemory.registry) === null || _a === void 0 || _a.register(arrayBuffer, pointer);
				return info;
			},
			getOrUpdateMemoryView: function(view) {
				if (view.buffer === wasmMemory.buffer) {
					if (!emnapiExternalMemory.wasmMemoryViewTable.has(view)) emnapiExternalMemory.wasmMemoryViewTable.set(view, {
						Ctor: view.constructor,
						address: view.byteOffset,
						length: view instanceof DataView ? view.byteLength : view.length,
						ownership: 1,
						runtimeAllocated: 0
					});
					return view;
				}
				if ((emnapiExternalMemory.isDetachedArrayBuffer(view.buffer) || typeof SharedArrayBuffer === "function" && view.buffer instanceof SharedArrayBuffer) && emnapiExternalMemory.wasmMemoryViewTable.has(view)) {
					var info = emnapiExternalMemory.wasmMemoryViewTable.get(view);
					var Ctor = info.Ctor;
					var newView = void 0;
					var Buffer_1 = emnapiCtx.feature.Buffer;
					if (typeof Buffer_1 === "function" && Ctor === Buffer_1) newView = Buffer_1.from(wasmMemory.buffer, info.address, info.length);
					else newView = new Ctor(wasmMemory.buffer, info.address, info.length);
					emnapiExternalMemory.wasmMemoryViewTable.set(newView, info);
					return newView;
				}
				return view;
			},
			getViewPointer: function(view, shouldCopy) {
				view = emnapiExternalMemory.getOrUpdateMemoryView(view);
				if (view.buffer === wasmMemory.buffer) {
					if (emnapiExternalMemory.wasmMemoryViewTable.has(view)) {
						var _a = emnapiExternalMemory.wasmMemoryViewTable.get(view), address_1 = _a.address, ownership_1 = _a.ownership, runtimeAllocated_1 = _a.runtimeAllocated;
						return {
							address: address_1,
							ownership: ownership_1,
							runtimeAllocated: runtimeAllocated_1,
							view
						};
					}
					return {
						address: view.byteOffset,
						ownership: 1,
						runtimeAllocated: 0,
						view
					};
				}
				var _b = emnapiExternalMemory.getArrayBufferPointer(view.buffer, shouldCopy), address = _b.address, ownership = _b.ownership, runtimeAllocated = _b.runtimeAllocated;
				return {
					address: address === 0 ? 0 : address + view.byteOffset,
					ownership,
					runtimeAllocated,
					view
				};
			}
		};
		/**
		* @__postset
		* ```
		* emnapiString.init();
		* ```
		*/
		var emnapiString = {
			utf8Decoder: void 0,
			utf16Decoder: void 0,
			init: function() {
				emnapiString.utf8Decoder = typeof TextDecoder === "function" ? new TextDecoder() : { decode: function(bytes) {
					var inputIndex = 0;
					var pendingSize = Math.min(4096, bytes.length + 1);
					var pending = new Uint16Array(pendingSize);
					var chunks = [];
					var pendingIndex = 0;
					for (;;) {
						var more = inputIndex < bytes.length;
						if (!more || pendingIndex >= pendingSize - 1) {
							var arraylike = pending.subarray(0, pendingIndex);
							chunks.push(String.fromCharCode.apply(null, arraylike));
							if (!more) return chunks.join("");
							bytes = bytes.subarray(inputIndex);
							inputIndex = 0;
							pendingIndex = 0;
						}
						var byte1 = bytes[inputIndex++];
						if ((byte1 & 128) === 0) pending[pendingIndex++] = byte1;
						else if ((byte1 & 224) === 192) {
							var byte2 = bytes[inputIndex++] & 63;
							pending[pendingIndex++] = (byte1 & 31) << 6 | byte2;
						} else if ((byte1 & 240) === 224) {
							var byte2 = bytes[inputIndex++] & 63;
							var byte3 = bytes[inputIndex++] & 63;
							pending[pendingIndex++] = (byte1 & 31) << 12 | byte2 << 6 | byte3;
						} else if ((byte1 & 248) === 240) {
							var byte2 = bytes[inputIndex++] & 63;
							var byte3 = bytes[inputIndex++] & 63;
							var byte4 = bytes[inputIndex++] & 63;
							var codepoint = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
							if (codepoint > 65535) {
								codepoint -= 65536;
								pending[pendingIndex++] = codepoint >>> 10 & 1023 | 55296;
								codepoint = 56320 | codepoint & 1023;
							}
							pending[pendingIndex++] = codepoint;
						}
					}
				} };
				emnapiString.utf16Decoder = typeof TextDecoder === "function" ? new TextDecoder("utf-16le") : { decode: function(input) {
					var bytes = new Uint16Array(input.buffer, input.byteOffset, input.byteLength / 2);
					if (bytes.length <= 4096) return String.fromCharCode.apply(null, bytes);
					var chunks = [];
					var i$1 = 0;
					var len = 0;
					for (; i$1 < bytes.length; i$1 += len) {
						len = Math.min(4096, bytes.length - i$1);
						chunks.push(String.fromCharCode.apply(null, bytes.subarray(i$1, i$1 + len)));
					}
					return chunks.join("");
				} };
			},
			lengthBytesUTF8: function(str) {
				var c$1;
				var len = 0;
				for (var i$1 = 0; i$1 < str.length; ++i$1) {
					c$1 = str.charCodeAt(i$1);
					if (c$1 <= 127) len++;
					else if (c$1 <= 2047) len += 2;
					else if (c$1 >= 55296 && c$1 <= 57343) {
						len += 4;
						++i$1;
					} else len += 3;
				}
				return len;
			},
			UTF8ToString: function(ptr, length) {
				if (!ptr || !length) return "";
				ptr >>>= 0;
				var HEAPU8 = new Uint8Array(wasmMemory.buffer);
				var end = ptr;
				if (length === -1) for (; HEAPU8[end];) ++end;
				else end = ptr + (length >>> 0);
				length = end - ptr;
				if (length <= 16) {
					var idx = ptr;
					var str = "";
					while (idx < end) {
						var u0 = HEAPU8[idx++];
						if (!(u0 & 128)) {
							str += String.fromCharCode(u0);
							continue;
						}
						var u1 = HEAPU8[idx++] & 63;
						if ((u0 & 224) === 192) {
							str += String.fromCharCode((u0 & 31) << 6 | u1);
							continue;
						}
						var u2 = HEAPU8[idx++] & 63;
						if ((u0 & 240) === 224) u0 = (u0 & 15) << 12 | u1 << 6 | u2;
						else u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | HEAPU8[idx++] & 63;
						if (u0 < 65536) str += String.fromCharCode(u0);
						else {
							var ch = u0 - 65536;
							str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
						}
					}
					return str;
				}
				return emnapiString.utf8Decoder.decode(typeof SharedArrayBuffer === "function" && HEAPU8.buffer instanceof SharedArrayBuffer || Object.prototype.toString.call(HEAPU8.buffer) === "[object SharedArrayBuffer]" ? HEAPU8.slice(ptr, end) : HEAPU8.subarray(ptr, end));
			},
			stringToUTF8: function(str, outPtr, maxBytesToWrite) {
				var HEAPU8 = new Uint8Array(wasmMemory.buffer);
				var outIdx = outPtr;
				outIdx >>>= 0;
				if (!(maxBytesToWrite > 0)) return 0;
				var startIdx = outIdx;
				var endIdx = outIdx + maxBytesToWrite - 1;
				for (var i$1 = 0; i$1 < str.length; ++i$1) {
					var u$1 = str.charCodeAt(i$1);
					if (u$1 >= 55296 && u$1 <= 57343) {
						var u1 = str.charCodeAt(++i$1);
						u$1 = 65536 + ((u$1 & 1023) << 10) | u1 & 1023;
					}
					if (u$1 <= 127) {
						if (outIdx >= endIdx) break;
						HEAPU8[outIdx++] = u$1;
					} else if (u$1 <= 2047) {
						if (outIdx + 1 >= endIdx) break;
						HEAPU8[outIdx++] = 192 | u$1 >> 6;
						HEAPU8[outIdx++] = 128 | u$1 & 63;
					} else if (u$1 <= 65535) {
						if (outIdx + 2 >= endIdx) break;
						HEAPU8[outIdx++] = 224 | u$1 >> 12;
						HEAPU8[outIdx++] = 128 | u$1 >> 6 & 63;
						HEAPU8[outIdx++] = 128 | u$1 & 63;
					} else {
						if (outIdx + 3 >= endIdx) break;
						HEAPU8[outIdx++] = 240 | u$1 >> 18;
						HEAPU8[outIdx++] = 128 | u$1 >> 12 & 63;
						HEAPU8[outIdx++] = 128 | u$1 >> 6 & 63;
						HEAPU8[outIdx++] = 128 | u$1 & 63;
					}
				}
				HEAPU8[outIdx] = 0;
				return outIdx - startIdx;
			},
			UTF16ToString: function(ptr, length) {
				if (!ptr || !length) return "";
				ptr >>>= 0;
				var end = ptr;
				if (length === -1) {
					var idx = end >> 1;
					var HEAPU16 = new Uint16Array(wasmMemory.buffer);
					while (HEAPU16[idx]) ++idx;
					end = idx << 1;
				} else end = ptr + (length >>> 0) * 2;
				length = end - ptr;
				if (length <= 32) return String.fromCharCode.apply(null, new Uint16Array(wasmMemory.buffer, ptr, length / 2));
				var HEAPU8 = new Uint8Array(wasmMemory.buffer);
				return emnapiString.utf16Decoder.decode(typeof SharedArrayBuffer === "function" && HEAPU8.buffer instanceof SharedArrayBuffer || Object.prototype.toString.call(HEAPU8.buffer) === "[object SharedArrayBuffer]" ? HEAPU8.slice(ptr, end) : HEAPU8.subarray(ptr, end));
			},
			stringToUTF16: function(str, outPtr, maxBytesToWrite) {
				if (maxBytesToWrite === void 0) maxBytesToWrite = 2147483647;
				if (maxBytesToWrite < 2) return 0;
				maxBytesToWrite -= 2;
				var startPtr = outPtr;
				var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
				var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
				for (var i$1 = 0; i$1 < numCharsToWrite; ++i$1) {
					var codeUnit = str.charCodeAt(i$1);
					HEAP_DATA_VIEW.setInt16(outPtr, codeUnit, true);
					outPtr += 2;
				}
				HEAP_DATA_VIEW.setInt16(outPtr, 0, true);
				return outPtr - startPtr;
			},
			newString: function(env, str, length, result, stringMaker) {
				if (!env) return 1;
				var envObject = emnapiCtx.envStore.get(env);
				envObject.checkGCAccess();
				var autoLength = length === -1;
				var sizelength = length >>> 0;
				if (length !== 0) {
					if (!str) return envObject.setLastError(1);
				}
				if (!result) return envObject.setLastError(1);
				if (!(autoLength || sizelength <= 2147483647)) return envObject.setLastError(1);
				var strValue = stringMaker(str, autoLength, sizelength);
				var value = emnapiCtx.addToCurrentScope(strValue).id;
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				return envObject.clearLastError();
			},
			newExternalString: function(env, str, length, finalize_callback, finalize_hint, result, copied, createApi, stringMaker) {
				if (!env) return 1;
				var envObject = emnapiCtx.envStore.get(env);
				envObject.checkGCAccess();
				var autoLength = length === -1;
				var sizelength = length >>> 0;
				if (length !== 0) {
					if (!str) return envObject.setLastError(1);
				}
				if (!result) return envObject.setLastError(1);
				if (!(autoLength || sizelength <= 2147483647)) return envObject.setLastError(1);
				var status = createApi(env, str, length, result);
				if (status === 0) {
					if (copied) new DataView(wasmMemory.buffer).setInt8(copied, 1, true);
					if (finalize_callback) envObject.callFinalizer(finalize_callback, str, finalize_hint);
				}
				return status;
			}
		};
		/**
		* @__sig ippp
		*/
		function napi_get_array_length(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!value) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				var handle = emnapiCtx.handleStore.get(value);
				if (!handle.isArray()) return envObject.setLastError(8);
				var v = handle.value.length >>> 0;
				new DataView(wasmMemory.buffer).setUint32(result, v, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ipppp
		*/
		function napi_get_arraybuffer_info(env, arraybuffer, data, byte_length) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!arraybuffer) return envObject.setLastError(1);
			var handle = emnapiCtx.handleStore.get(arraybuffer);
			if (!handle.isArrayBuffer()) return envObject.setLastError(1);
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			if (data) {
				var p$1 = emnapiExternalMemory.getArrayBufferPointer(handle.value, true).address;
				HEAP_DATA_VIEW.setUint32(data, p$1, true);
			}
			if (byte_length) HEAP_DATA_VIEW.setUint32(byte_length, handle.value.byteLength, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ippp
		*/
		function napi_get_prototype(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!value) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				var handle = emnapiCtx.handleStore.get(value);
				if (handle.value == null) throw new TypeError("Cannot convert undefined or null to object");
				var v = void 0;
				try {
					v = handle.isObject() || handle.isFunction() ? handle.value : Object(handle.value);
				} catch (_) {
					return envObject.setLastError(2);
				}
				var p$1 = envObject.ensureHandleId(Object.getPrototypeOf(v));
				new DataView(wasmMemory.buffer).setUint32(result, p$1, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ippppppp
		*/
		function napi_get_typedarray_info(env, typedarray, type, length, data, arraybuffer, byte_offset) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!typedarray) return envObject.setLastError(1);
			var handle = emnapiCtx.handleStore.get(typedarray);
			if (!handle.isTypedArray()) return envObject.setLastError(1);
			var v = handle.value;
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			if (type) {
				var t$3 = void 0;
				if (v instanceof Int8Array) t$3 = 0;
				else if (v instanceof Uint8Array) t$3 = 1;
				else if (v instanceof Uint8ClampedArray) t$3 = 2;
				else if (v instanceof Int16Array) t$3 = 3;
				else if (v instanceof Uint16Array) t$3 = 4;
				else if (v instanceof Int32Array) t$3 = 5;
				else if (v instanceof Uint32Array) t$3 = 6;
				else if (v instanceof Float32Array) t$3 = 7;
				else if (v instanceof Float64Array) t$3 = 8;
				else if (v instanceof BigInt64Array) t$3 = 9;
				else if (v instanceof BigUint64Array) t$3 = 10;
				else return envObject.setLastError(9);
				HEAP_DATA_VIEW.setInt32(type, t$3, true);
			}
			if (length) HEAP_DATA_VIEW.setUint32(length, v.length, true);
			var buffer;
			if (data || arraybuffer) {
				buffer = v.buffer;
				if (data) {
					var p$1 = emnapiExternalMemory.getViewPointer(v, true).address;
					HEAP_DATA_VIEW.setUint32(data, p$1, true);
				}
				if (arraybuffer) {
					var ab = envObject.ensureHandleId(buffer);
					HEAP_DATA_VIEW.setUint32(arraybuffer, ab, true);
				}
			}
			if (byte_offset) HEAP_DATA_VIEW.setUint32(byte_offset, v.byteOffset, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ipppp
		*/
		function napi_get_buffer_info(env, buffer, data, length) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!buffer) return envObject.setLastError(1);
			var handle = emnapiCtx.handleStore.get(buffer);
			if (!handle.isBuffer(emnapiCtx.feature.Buffer)) return envObject.setLastError(1);
			if (handle.isDataView()) return napi_get_dataview_info(env, buffer, length, data, 0, 0);
			return napi_get_typedarray_info(env, buffer, 0, length, data, 0, 0);
		}
		/**
		* @__sig ipppppp
		*/
		function napi_get_dataview_info(env, dataview, byte_length, data, arraybuffer, byte_offset) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!dataview) return envObject.setLastError(1);
			var handle = emnapiCtx.handleStore.get(dataview);
			if (!handle.isDataView()) return envObject.setLastError(1);
			var v = handle.value;
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			if (byte_length) HEAP_DATA_VIEW.setUint32(byte_length, v.byteLength, true);
			var buffer;
			if (data || arraybuffer) {
				buffer = v.buffer;
				if (data) {
					var p$1 = emnapiExternalMemory.getViewPointer(v, true).address;
					HEAP_DATA_VIEW.setUint32(data, p$1, true);
				}
				if (arraybuffer) {
					var ab = envObject.ensureHandleId(buffer);
					HEAP_DATA_VIEW.setUint32(arraybuffer, ab, true);
				}
			}
			if (byte_offset) HEAP_DATA_VIEW.setUint32(byte_offset, v.byteOffset, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ippp
		*/
		function napi_get_date_value(env, value, result) {
			var v;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!value) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				var handle = emnapiCtx.handleStore.get(value);
				if (!handle.isDate()) return envObject.setLastError(1);
				v = handle.value.valueOf();
				new DataView(wasmMemory.buffer).setFloat64(result, v, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ippp
		*/
		function napi_get_value_bool(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var handle = emnapiCtx.handleStore.get(value);
			if (typeof handle.value !== "boolean") return envObject.setLastError(7);
			var r$1 = handle.value ? 1 : 0;
			new DataView(wasmMemory.buffer).setInt8(result, r$1, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ippp
		*/
		function napi_get_value_double(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var handle = emnapiCtx.handleStore.get(value);
			if (typeof handle.value !== "number") return envObject.setLastError(6);
			var r$1 = handle.value;
			new DataView(wasmMemory.buffer).setFloat64(result, r$1, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ipppp
		*/
		function napi_get_value_bigint_int64(env, value, result, lossless) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!emnapiCtx.feature.supportBigInt) return envObject.setLastError(9);
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			if (!lossless) return envObject.setLastError(1);
			var numberValue = emnapiCtx.handleStore.get(value).value;
			if (typeof numberValue !== "bigint") return envObject.setLastError(6);
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			if (numberValue >= BigInt(-1) * (BigInt(1) << BigInt(63)) && numberValue < BigInt(1) << BigInt(63)) HEAP_DATA_VIEW.setInt8(lossless, 1, true);
			else {
				HEAP_DATA_VIEW.setInt8(lossless, 0, true);
				numberValue = numberValue & (BigInt(1) << BigInt(64)) - BigInt(1);
				if (numberValue >= BigInt(1) << BigInt(63)) numberValue = numberValue - (BigInt(1) << BigInt(64));
			}
			var low = Number(numberValue & BigInt(4294967295));
			var high = Number(numberValue >> BigInt(32));
			HEAP_DATA_VIEW.setInt32(result, low, true);
			HEAP_DATA_VIEW.setInt32(result + 4, high, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ipppp
		*/
		function napi_get_value_bigint_uint64(env, value, result, lossless) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!emnapiCtx.feature.supportBigInt) return envObject.setLastError(9);
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			if (!lossless) return envObject.setLastError(1);
			var numberValue = emnapiCtx.handleStore.get(value).value;
			if (typeof numberValue !== "bigint") return envObject.setLastError(6);
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			if (numberValue >= BigInt(0) && numberValue < BigInt(1) << BigInt(64)) HEAP_DATA_VIEW.setInt8(lossless, 1, true);
			else {
				HEAP_DATA_VIEW.setInt8(lossless, 0, true);
				numberValue = numberValue & (BigInt(1) << BigInt(64)) - BigInt(1);
			}
			var low = Number(numberValue & BigInt(4294967295));
			var high = Number(numberValue >> BigInt(32));
			HEAP_DATA_VIEW.setUint32(result, low, true);
			HEAP_DATA_VIEW.setUint32(result + 4, high, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ippppp
		*/
		function napi_get_value_bigint_words(env, value, sign_bit, word_count, words) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!emnapiCtx.feature.supportBigInt) return envObject.setLastError(9);
			if (!value) return envObject.setLastError(1);
			if (!word_count) return envObject.setLastError(1);
			var handle = emnapiCtx.handleStore.get(value);
			if (!handle.isBigInt()) return envObject.setLastError(17);
			var isMinus = handle.value < BigInt(0);
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			var word_count_int = HEAP_DATA_VIEW.getUint32(word_count, true);
			var wordCount = 0;
			var bigintValue = isMinus ? handle.value * BigInt(-1) : handle.value;
			while (bigintValue !== BigInt(0)) {
				wordCount++;
				bigintValue = bigintValue >> BigInt(64);
			}
			bigintValue = isMinus ? handle.value * BigInt(-1) : handle.value;
			if (!sign_bit && !words) {
				word_count_int = wordCount;
				HEAP_DATA_VIEW.setUint32(word_count, word_count_int, true);
			} else {
				if (!sign_bit) return envObject.setLastError(1);
				if (!words) return envObject.setLastError(1);
				var wordsArr = [];
				while (bigintValue !== BigInt(0)) {
					var uint64 = bigintValue & (BigInt(1) << BigInt(64)) - BigInt(1);
					wordsArr.push(uint64);
					bigintValue = bigintValue >> BigInt(64);
				}
				var len = Math.min(word_count_int, wordsArr.length);
				for (var i$1 = 0; i$1 < len; i$1++) {
					var low = Number(wordsArr[i$1] & BigInt(4294967295));
					var high = Number(wordsArr[i$1] >> BigInt(32));
					HEAP_DATA_VIEW.setUint32(words + i$1 * 8, low, true);
					HEAP_DATA_VIEW.setUint32(words + (i$1 * 8 + 4), high, true);
				}
				HEAP_DATA_VIEW.setInt32(sign_bit, isMinus ? 1 : 0, true);
				HEAP_DATA_VIEW.setUint32(word_count, len, true);
			}
			return envObject.clearLastError();
		}
		/**
		* @__sig ippp
		*/
		function napi_get_value_external(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var handle = emnapiCtx.handleStore.get(value);
			if (!handle.isExternal()) return envObject.setLastError(1);
			var p$1 = handle.data();
			new DataView(wasmMemory.buffer).setUint32(result, p$1, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ippp
		*/
		function napi_get_value_int32(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var handle = emnapiCtx.handleStore.get(value);
			if (typeof handle.value !== "number") return envObject.setLastError(6);
			var v = new Int32Array([handle.value])[0];
			new DataView(wasmMemory.buffer).setInt32(result, v, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ippp
		*/
		function napi_get_value_int64(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var handle = emnapiCtx.handleStore.get(value);
			if (typeof handle.value !== "number") return envObject.setLastError(6);
			var numberValue = handle.value;
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			if (numberValue === Number.POSITIVE_INFINITY || numberValue === Number.NEGATIVE_INFINITY || isNaN(numberValue)) {
				HEAP_DATA_VIEW.setInt32(result, 0, true);
				HEAP_DATA_VIEW.setInt32(result + 4, 0, true);
			} else if (numberValue < -0x8000000000000000) {
				HEAP_DATA_VIEW.setInt32(result, 0, true);
				HEAP_DATA_VIEW.setInt32(result + 4, 2147483648, true);
			} else if (numberValue >= 0x8000000000000000) {
				HEAP_DATA_VIEW.setUint32(result, 4294967295, true);
				HEAP_DATA_VIEW.setUint32(result + 4, 2147483647, true);
			} else $emnapiSetValueI64(result, Math.trunc(numberValue));
			return envObject.clearLastError();
		}
		/**
		* @__sig ippppp
		*/
		function napi_get_value_string_latin1(env, value, buf, buf_size, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			buf_size = buf_size >>> 0;
			var handle = emnapiCtx.handleStore.get(value);
			if (typeof handle.value !== "string") return envObject.setLastError(3);
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			if (!buf) {
				if (!result) return envObject.setLastError(1);
				HEAP_DATA_VIEW.setUint32(result, handle.value.length, true);
			} else if (buf_size !== 0) {
				var copied = 0;
				var v = void 0;
				for (var i$1 = 0; i$1 < buf_size - 1; ++i$1) {
					v = handle.value.charCodeAt(i$1) & 255;
					HEAP_DATA_VIEW.setUint8(buf + i$1, v, true);
					copied++;
				}
				HEAP_DATA_VIEW.setUint8(buf + copied, 0, true);
				if (result) HEAP_DATA_VIEW.setUint32(result, copied, true);
			} else if (result) HEAP_DATA_VIEW.setUint32(result, 0, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ippppp
		*/
		function napi_get_value_string_utf8(env, value, buf, buf_size, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			buf_size = buf_size >>> 0;
			var handle = emnapiCtx.handleStore.get(value);
			if (typeof handle.value !== "string") return envObject.setLastError(3);
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			if (!buf) {
				if (!result) return envObject.setLastError(1);
				var strLength = emnapiString.lengthBytesUTF8(handle.value);
				HEAP_DATA_VIEW.setUint32(result, strLength, true);
			} else if (buf_size !== 0) {
				var copied = emnapiString.stringToUTF8(handle.value, buf, buf_size);
				if (result) HEAP_DATA_VIEW.setUint32(result, copied, true);
			} else if (result) HEAP_DATA_VIEW.setUint32(result, 0, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ippppp
		*/
		function napi_get_value_string_utf16(env, value, buf, buf_size, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			buf_size = buf_size >>> 0;
			var handle = emnapiCtx.handleStore.get(value);
			if (typeof handle.value !== "string") return envObject.setLastError(3);
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			if (!buf) {
				if (!result) return envObject.setLastError(1);
				HEAP_DATA_VIEW.setUint32(result, handle.value.length, true);
			} else if (buf_size !== 0) {
				var copied = emnapiString.stringToUTF16(handle.value, buf, buf_size * 2);
				if (result) HEAP_DATA_VIEW.setUint32(result, copied / 2, true);
			} else if (result) HEAP_DATA_VIEW.setUint32(result, 0, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ippp
		*/
		function napi_get_value_uint32(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var handle = emnapiCtx.handleStore.get(value);
			if (typeof handle.value !== "number") return envObject.setLastError(6);
			var v = new Uint32Array([handle.value])[0];
			new DataView(wasmMemory.buffer).setUint32(result, v, true);
			return envObject.clearLastError();
		}
		var convert2cMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			napi_get_array_length,
			napi_get_arraybuffer_info,
			napi_get_buffer_info,
			napi_get_dataview_info,
			napi_get_date_value,
			napi_get_prototype,
			napi_get_typedarray_info,
			napi_get_value_bigint_int64,
			napi_get_value_bigint_uint64,
			napi_get_value_bigint_words,
			napi_get_value_bool,
			napi_get_value_double,
			napi_get_value_external,
			napi_get_value_int32,
			napi_get_value_int64,
			napi_get_value_string_latin1,
			napi_get_value_string_utf16,
			napi_get_value_string_utf8,
			napi_get_value_uint32
		});
		/**
		* @__sig ipip
		*/
		function napi_create_int32(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			var v = emnapiCtx.addToCurrentScope(value).id;
			new DataView(wasmMemory.buffer).setUint32(result, v, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ipip
		*/
		function napi_create_uint32(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			var v = emnapiCtx.addToCurrentScope(value >>> 0).id;
			new DataView(wasmMemory.buffer).setUint32(result, v, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ipjp
		*/
		function napi_create_int64(env, low, high, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			var value;
			if (!high) return envObject.setLastError(1);
			value = Number(low);
			var v1 = emnapiCtx.addToCurrentScope(value).id;
			new DataView(wasmMemory.buffer).setUint32(high, v1, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ipdp
		*/
		function napi_create_double(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			var v = emnapiCtx.addToCurrentScope(value).id;
			new DataView(wasmMemory.buffer).setUint32(result, v, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ipppp
		*/
		function napi_create_string_latin1(env, str, length, result) {
			return emnapiString.newString(env, str, length, result, function(str$1, autoLength, sizeLength) {
				var latin1String = "";
				var len = 0;
				var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
				if (autoLength) while (true) {
					var ch = HEAP_DATA_VIEW.getUint8(str$1, true);
					if (!ch) break;
					latin1String += String.fromCharCode(ch);
					str$1++;
				}
				else while (len < sizeLength) {
					var ch = HEAP_DATA_VIEW.getUint8(str$1, true);
					if (!ch) break;
					latin1String += String.fromCharCode(ch);
					len++;
					str$1++;
				}
				return latin1String;
			});
		}
		/**
		* @__sig ipppp
		*/
		function napi_create_string_utf16(env, str, length, result) {
			return emnapiString.newString(env, str, length, result, function(str$1) {
				return emnapiString.UTF16ToString(str$1, length);
			});
		}
		/**
		* @__sig ipppp
		*/
		function napi_create_string_utf8(env, str, length, result) {
			return emnapiString.newString(env, str, length, result, function(str$1) {
				return emnapiString.UTF8ToString(str$1, length);
			});
		}
		/**
		* @__sig ippppppp
		*/
		function node_api_create_external_string_latin1(env, str, length, finalize_callback, finalize_hint, result, copied) {
			return emnapiString.newExternalString(env, str, length, finalize_callback, finalize_hint, result, copied, napi_create_string_latin1, void 0);
		}
		/**
		* @__sig ippppppp
		*/
		function node_api_create_external_string_utf16(env, str, length, finalize_callback, finalize_hint, result, copied) {
			return emnapiString.newExternalString(env, str, length, finalize_callback, finalize_hint, result, copied, napi_create_string_utf16, void 0);
		}
		/**
		* @__sig ipppp
		*/
		function node_api_create_property_key_latin1(env, str, length, result) {
			return napi_create_string_latin1(env, str, length, result);
		}
		/**
		* @__sig ipppp
		*/
		function node_api_create_property_key_utf8(env, str, length, result) {
			return napi_create_string_utf8(env, str, length, result);
		}
		/**
		* @__sig ipppp
		*/
		function node_api_create_property_key_utf16(env, str, length, result) {
			return napi_create_string_utf16(env, str, length, result);
		}
		/**
		* @__sig ipjp
		*/
		function napi_create_bigint_int64(env, low, high, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!emnapiCtx.feature.supportBigInt) return envObject.setLastError(9);
			var value;
			if (!high) return envObject.setLastError(1);
			value = low;
			var v1 = emnapiCtx.addToCurrentScope(value).id;
			new DataView(wasmMemory.buffer).setUint32(high, v1, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ipjp
		*/
		function napi_create_bigint_uint64(env, low, high, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!emnapiCtx.feature.supportBigInt) return envObject.setLastError(9);
			var value;
			if (!high) return envObject.setLastError(1);
			value = low & (BigInt(1) << BigInt(64)) - BigInt(1);
			var v1 = emnapiCtx.addToCurrentScope(value).id;
			new DataView(wasmMemory.buffer).setUint32(high, v1, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ipippp
		*/
		function napi_create_bigint_words(env, sign_bit, word_count, words, result) {
			var v, i$1;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!emnapiCtx.feature.supportBigInt) return envObject.setLastError(9);
				if (!result) return envObject.setLastError(1);
				word_count = word_count >>> 0;
				if (word_count > 2147483647) return envObject.setLastError(1);
				if (word_count > 1024 * 1024 / 32 / 2) throw new RangeError("Maximum BigInt size exceeded");
				var value = BigInt(0);
				var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
				for (i$1 = 0; i$1 < word_count; i$1++) {
					var low = HEAP_DATA_VIEW.getUint32(words + i$1 * 8, true);
					var high = HEAP_DATA_VIEW.getUint32(words + (i$1 * 8 + 4), true);
					var wordi = BigInt(low) | BigInt(high) << BigInt(32);
					value += wordi << BigInt(64 * i$1);
				}
				value *= BigInt(sign_bit) % BigInt(2) === BigInt(0) ? BigInt(1) : BigInt(-1);
				v = emnapiCtx.addToCurrentScope(value).id;
				HEAP_DATA_VIEW.setUint32(result, v, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		var convert2napiMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			napi_create_bigint_int64,
			napi_create_bigint_uint64,
			napi_create_bigint_words,
			napi_create_double,
			napi_create_int32,
			napi_create_int64,
			napi_create_string_latin1,
			napi_create_string_utf16,
			napi_create_string_utf8,
			napi_create_uint32,
			node_api_create_external_string_latin1,
			node_api_create_external_string_utf16,
			node_api_create_property_key_latin1,
			node_api_create_property_key_utf16,
			node_api_create_property_key_utf8
		});
		function emnapiCreateFunction(envObject, utf8name, length, cb, data) {
			var functionName = !utf8name || !length ? "" : emnapiString.UTF8ToString(utf8name, length);
			var f$1;
			var napiCallback = wasmTable.get(cb);
			var callback = function(envObject$1) {
				return napiCallback(envObject$1.id, envObject$1.ctx.scopeStore.currentScope.id);
			};
			var makeFunction = function(envObject$1, callback$1) {
				return function() {
					var scope = envObject$1.ctx.openScope(envObject$1);
					var callbackInfo = scope.callbackInfo;
					callbackInfo.data = data;
					callbackInfo.args = arguments;
					callbackInfo.thiz = this;
					callbackInfo.fn = f$1;
					try {
						var napiValue = envObject$1.callIntoModule(callback$1);
						return !napiValue ? void 0 : envObject$1.ctx.handleStore.get(napiValue).value;
					} finally {
						callbackInfo.data = 0;
						callbackInfo.args = void 0;
						callbackInfo.thiz = void 0;
						callbackInfo.fn = void 0;
						envObject$1.ctx.closeScope(envObject$1, scope);
					}
				};
			};
			if (functionName === "") {
				f$1 = makeFunction(envObject, callback);
				return {
					status: 0,
					f: f$1
				};
			}
			if (!/^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(functionName)) return {
				status: 1,
				f: void 0
			};
			if (emnapiCtx.feature.supportNewFunction) {
				var _ = makeFunction(envObject, callback);
				try {
					f$1 = new Function("_", "return function " + functionName + "(){\"use strict\";return _.apply(this,arguments);};")(_);
				} catch (_err) {
					f$1 = makeFunction(envObject, callback);
					if (emnapiCtx.feature.canSetFunctionName) Object.defineProperty(f$1, "name", { value: functionName });
				}
			} else {
				f$1 = makeFunction(envObject, callback);
				if (emnapiCtx.feature.canSetFunctionName) Object.defineProperty(f$1, "name", { value: functionName });
			}
			return {
				status: 0,
				f: f$1
			};
		}
		function emnapiDefineProperty(envObject, obj, propertyName, method, getter, setter, value, attributes, data) {
			if (getter || setter) {
				var localGetter = void 0;
				var localSetter = void 0;
				if (getter) localGetter = emnapiCreateFunction(envObject, 0, 0, getter, data).f;
				if (setter) localSetter = emnapiCreateFunction(envObject, 0, 0, setter, data).f;
				var desc = {
					configurable: (attributes & 4) !== 0,
					enumerable: (attributes & 2) !== 0,
					get: localGetter,
					set: localSetter
				};
				Object.defineProperty(obj, propertyName, desc);
			} else if (method) {
				var localMethod = emnapiCreateFunction(envObject, 0, 0, method, data).f;
				var desc = {
					configurable: (attributes & 4) !== 0,
					enumerable: (attributes & 2) !== 0,
					writable: (attributes & 1) !== 0,
					value: localMethod
				};
				Object.defineProperty(obj, propertyName, desc);
			} else {
				var desc = {
					configurable: (attributes & 4) !== 0,
					enumerable: (attributes & 2) !== 0,
					writable: (attributes & 1) !== 0,
					value: emnapiCtx.handleStore.get(value).value
				};
				Object.defineProperty(obj, propertyName, desc);
			}
		}
		function emnapiGetHandle(js_object) {
			var handle = emnapiCtx.handleStore.get(js_object);
			if (!(handle.isObject() || handle.isFunction())) return { status: 1 };
			if (typeof emnapiExternalMemory !== "undefined" && ArrayBuffer.isView(handle.value)) {
				if (emnapiExternalMemory.wasmMemoryViewTable.has(handle.value)) handle = emnapiCtx.addToCurrentScope(emnapiExternalMemory.wasmMemoryViewTable.get(handle.value));
			}
			return {
				status: 0,
				handle
			};
		}
		function emnapiWrap(env, js_object, native_object, finalize_cb, finalize_hint, result) {
			var referenceId;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!emnapiCtx.feature.supportFinalizer) {
					if (finalize_cb) throw emnapiCtx.createNotSupportWeakRefError("napi_wrap", "Parameter \"finalize_cb\" must be 0(NULL)");
					if (result) throw emnapiCtx.createNotSupportWeakRefError("napi_wrap", "Parameter \"result\" must be 0(NULL)");
				}
				if (!js_object) return envObject.setLastError(1);
				var handleResult = emnapiGetHandle(js_object);
				if (handleResult.status !== 0) return envObject.setLastError(handleResult.status);
				var handle = handleResult.handle;
				if (envObject.getObjectBinding(handle.value).wrapped !== 0) return envObject.setLastError(1);
				var reference = void 0;
				if (result) {
					if (!finalize_cb) return envObject.setLastError(1);
					reference = emnapiCtx.createReferenceWithFinalizer(envObject, handle.id, 0, 1, finalize_cb, native_object, finalize_hint);
					referenceId = reference.id;
					new DataView(wasmMemory.buffer).setUint32(result, referenceId, true);
				} else if (finalize_cb) reference = emnapiCtx.createReferenceWithFinalizer(envObject, handle.id, 0, 0, finalize_cb, native_object, finalize_hint);
				else reference = emnapiCtx.createReferenceWithData(envObject, handle.id, 0, 0, native_object);
				envObject.getObjectBinding(handle.value).wrapped = reference.id;
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		function emnapiUnwrap(env, js_object, result, action) {
			var data;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!js_object) return envObject.setLastError(1);
				if (action === 0) {
					if (!result) return envObject.setLastError(1);
				}
				var value = emnapiCtx.handleStore.get(js_object);
				if (!(value.isObject() || value.isFunction())) return envObject.setLastError(1);
				var binding = envObject.getObjectBinding(value.value);
				var referenceId = binding.wrapped;
				var ref = emnapiCtx.refStore.get(referenceId);
				if (!ref) return envObject.setLastError(1);
				if (result) {
					data = ref.data();
					new DataView(wasmMemory.buffer).setUint32(result, data, true);
				}
				if (action === 1) {
					binding.wrapped = 0;
					if (ref.ownership() === 1) ref.resetFinalizer();
					else ref.dispose();
				}
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ipppppppp
		*/
		function napi_define_class(env, utf8name, length, constructor, callback_data, property_count, properties, result) {
			var propPtr, valueHandleId, attributes;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!result) return envObject.setLastError(1);
				if (!constructor) return envObject.setLastError(1);
				property_count = property_count >>> 0;
				if (property_count > 0) {
					if (!properties) return envObject.setLastError(1);
				}
				if (length < -1 || length > 2147483647 || !utf8name) return envObject.setLastError(1);
				var fresult = emnapiCreateFunction(envObject, utf8name, length, constructor, callback_data);
				if (fresult.status !== 0) return envObject.setLastError(fresult.status);
				var F = fresult.f;
				var propertyName = void 0;
				var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
				for (var i$1 = 0; i$1 < property_count; i$1++) {
					propPtr = properties + i$1 * 32;
					var utf8Name = HEAP_DATA_VIEW.getUint32(propPtr, true);
					var name_1 = HEAP_DATA_VIEW.getUint32(propPtr + 4, true);
					var method = HEAP_DATA_VIEW.getUint32(propPtr + 8, true);
					var getter = HEAP_DATA_VIEW.getUint32(propPtr + 12, true);
					var setter = HEAP_DATA_VIEW.getUint32(propPtr + 16, true);
					var value = HEAP_DATA_VIEW.getUint32(propPtr + 20, true);
					attributes = HEAP_DATA_VIEW.getInt32(propPtr + 24, true);
					var data = HEAP_DATA_VIEW.getUint32(propPtr + 28, true);
					if (utf8Name) propertyName = emnapiString.UTF8ToString(utf8Name, -1);
					else {
						if (!name_1) return envObject.setLastError(4);
						propertyName = emnapiCtx.handleStore.get(name_1).value;
						if (typeof propertyName !== "string" && typeof propertyName !== "symbol") return envObject.setLastError(4);
					}
					if ((attributes & 1024) !== 0) {
						emnapiDefineProperty(envObject, F, propertyName, method, getter, setter, value, attributes, data);
						continue;
					}
					emnapiDefineProperty(envObject, F.prototype, propertyName, method, getter, setter, value, attributes, data);
				}
				valueHandleId = emnapiCtx.addToCurrentScope(F).id;
				HEAP_DATA_VIEW.setUint32(result, valueHandleId, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ipppppp
		*/
		function napi_wrap(env, js_object, native_object, finalize_cb, finalize_hint, result) {
			return emnapiWrap(env, js_object, native_object, finalize_cb, finalize_hint, result);
		}
		/**
		* @__sig ippp
		*/
		function napi_unwrap(env, js_object, result) {
			return emnapiUnwrap(env, js_object, result, 0);
		}
		/**
		* @__sig ippp
		*/
		function napi_remove_wrap(env, js_object, result) {
			return emnapiUnwrap(env, js_object, result, 1);
		}
		/**
		* @__sig ippp
		*/
		function napi_type_tag_object(env, object$1, type_tag) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!object$1) return envObject.setLastError(envObject.tryCatch.hasCaught() ? 10 : 1);
				var value = emnapiCtx.handleStore.get(object$1);
				if (!(value.isObject() || value.isFunction())) return envObject.setLastError(envObject.tryCatch.hasCaught() ? 10 : 2);
				if (!type_tag) return envObject.setLastError(envObject.tryCatch.hasCaught() ? 10 : 1);
				var binding = envObject.getObjectBinding(value.value);
				if (binding.tag !== null) return envObject.setLastError(envObject.tryCatch.hasCaught() ? 10 : 1);
				var tag = new Uint8Array(16);
				tag.set(new Uint8Array(wasmMemory.buffer, type_tag, 16));
				binding.tag = new Uint32Array(tag.buffer);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ipppp
		*/
		function napi_check_object_type_tag(env, object$1, type_tag, result) {
			var ret = true;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!object$1) return envObject.setLastError(envObject.tryCatch.hasCaught() ? 10 : 1);
				var value = emnapiCtx.handleStore.get(object$1);
				if (!(value.isObject() || value.isFunction())) return envObject.setLastError(envObject.tryCatch.hasCaught() ? 10 : 2);
				if (!type_tag) return envObject.setLastError(envObject.tryCatch.hasCaught() ? 10 : 1);
				if (!result) return envObject.setLastError(envObject.tryCatch.hasCaught() ? 10 : 1);
				var binding = envObject.getObjectBinding(value.value);
				if (binding.tag !== null) {
					var tag = binding.tag;
					var typeTag = new Uint32Array(wasmMemory.buffer, type_tag, 4);
					ret = tag[0] === typeTag[0] && tag[1] === typeTag[1] && tag[2] === typeTag[2] && tag[3] === typeTag[3];
				} else ret = false;
				new DataView(wasmMemory.buffer).setInt8(result, ret ? 1 : 0, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ipppppp
		*/
		function napi_add_finalizer(env, js_object, finalize_data, finalize_cb, finalize_hint, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!emnapiCtx.feature.supportFinalizer) return envObject.setLastError(9);
			if (!js_object) return envObject.setLastError(1);
			if (!finalize_cb) return envObject.setLastError(1);
			var handleResult = emnapiGetHandle(js_object);
			if (handleResult.status !== 0) return envObject.setLastError(handleResult.status);
			var handle = handleResult.handle;
			var ownership = !result ? 0 : 1;
			var reference = emnapiCtx.createReferenceWithFinalizer(envObject, handle.id, 0, ownership, finalize_cb, finalize_data, finalize_hint);
			if (result) {
				var referenceId = reference.id;
				new DataView(wasmMemory.buffer).setUint32(result, referenceId, true);
			}
			return envObject.clearLastError();
		}
		/**
		* @__sig ipppp
		*/
		function node_api_post_finalizer(env, finalize_cb, finalize_data, finalize_hint) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.enqueueFinalizer(emnapiCtx.createTrackedFinalizer(envObject, finalize_cb, finalize_data, finalize_hint));
			return envObject.clearLastError();
		}
		var wrapMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			napi_add_finalizer,
			napi_check_object_type_tag,
			napi_define_class,
			napi_remove_wrap,
			napi_type_tag_object,
			napi_unwrap,
			napi_wrap,
			node_api_post_finalizer
		});
		/**
		* @__sig ipippppp
		*/
		function emnapi_create_memory_view(env, typedarray_type, external_data, byte_length, finalize_cb, finalize_hint, result) {
			var value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!result) return envObject.setLastError(1);
				byte_length = byte_length >>> 0;
				if (!external_data) byte_length = 0;
				if (byte_length > 2147483647) throw new RangeError("Cannot create a memory view larger than 2147483647 bytes");
				if (external_data + byte_length > wasmMemory.buffer.byteLength) throw new RangeError("Memory out of range");
				if (!emnapiCtx.feature.supportFinalizer && finalize_cb) throw emnapiCtx.createNotSupportWeakRefError("emnapi_create_memory_view", "Parameter \"finalize_cb\" must be 0(NULL)");
				var viewDescriptor = void 0;
				switch (typedarray_type) {
					case 0:
						viewDescriptor = {
							Ctor: Int8Array,
							address: external_data,
							length: byte_length,
							ownership: 1,
							runtimeAllocated: 0
						};
						break;
					case 1:
						viewDescriptor = {
							Ctor: Uint8Array,
							address: external_data,
							length: byte_length,
							ownership: 1,
							runtimeAllocated: 0
						};
						break;
					case 2:
						viewDescriptor = {
							Ctor: Uint8ClampedArray,
							address: external_data,
							length: byte_length,
							ownership: 1,
							runtimeAllocated: 0
						};
						break;
					case 3:
						viewDescriptor = {
							Ctor: Int16Array,
							address: external_data,
							length: byte_length >> 1,
							ownership: 1,
							runtimeAllocated: 0
						};
						break;
					case 4:
						viewDescriptor = {
							Ctor: Uint16Array,
							address: external_data,
							length: byte_length >> 1,
							ownership: 1,
							runtimeAllocated: 0
						};
						break;
					case 5:
						viewDescriptor = {
							Ctor: Int32Array,
							address: external_data,
							length: byte_length >> 2,
							ownership: 1,
							runtimeAllocated: 0
						};
						break;
					case 6:
						viewDescriptor = {
							Ctor: Uint32Array,
							address: external_data,
							length: byte_length >> 2,
							ownership: 1,
							runtimeAllocated: 0
						};
						break;
					case 7:
						viewDescriptor = {
							Ctor: Float32Array,
							address: external_data,
							length: byte_length >> 2,
							ownership: 1,
							runtimeAllocated: 0
						};
						break;
					case 8:
						viewDescriptor = {
							Ctor: Float64Array,
							address: external_data,
							length: byte_length >> 3,
							ownership: 1,
							runtimeAllocated: 0
						};
						break;
					case 9:
						viewDescriptor = {
							Ctor: BigInt64Array,
							address: external_data,
							length: byte_length >> 3,
							ownership: 1,
							runtimeAllocated: 0
						};
						break;
					case 10:
						viewDescriptor = {
							Ctor: BigUint64Array,
							address: external_data,
							length: byte_length >> 3,
							ownership: 1,
							runtimeAllocated: 0
						};
						break;
					case -1:
						viewDescriptor = {
							Ctor: DataView,
							address: external_data,
							length: byte_length,
							ownership: 1,
							runtimeAllocated: 0
						};
						break;
					case -2:
						if (!emnapiCtx.feature.Buffer) throw emnapiCtx.createNotSupportBufferError("emnapi_create_memory_view", "");
						viewDescriptor = {
							Ctor: emnapiCtx.feature.Buffer,
							address: external_data,
							length: byte_length,
							ownership: 1,
							runtimeAllocated: 0
						};
						break;
					default: return envObject.setLastError(1);
				}
				var Ctor = viewDescriptor.Ctor;
				var typedArray = typedarray_type === -2 ? emnapiCtx.feature.Buffer.from(wasmMemory.buffer, viewDescriptor.address, viewDescriptor.length) : new Ctor(wasmMemory.buffer, viewDescriptor.address, viewDescriptor.length);
				var handle = emnapiCtx.addToCurrentScope(typedArray);
				emnapiExternalMemory.wasmMemoryViewTable.set(typedArray, viewDescriptor);
				if (finalize_cb) {
					var status_1 = napi_add_finalizer(env, handle.id, external_data, finalize_cb, finalize_hint, 0);
					if (status_1 === 10) {
						var err$1 = envObject.tryCatch.extractException();
						envObject.clearLastError();
						throw err$1;
					} else if (status_1 !== 0) return envObject.setLastError(status_1);
				}
				value = handle.id;
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				return envObject.getReturnStatus();
			} catch (err$2) {
				envObject.tryCatch.setError(err$2);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig i
		*/
		function emnapi_is_support_weakref() {
			return emnapiCtx.feature.supportFinalizer ? 1 : 0;
		}
		/**
		* @__sig i
		*/
		function emnapi_is_support_bigint() {
			return emnapiCtx.feature.supportBigInt ? 1 : 0;
		}
		/**
		* @__sig i
		*/
		function emnapi_is_node_binding_available() {
			return emnapiNodeBinding ? 1 : 0;
		}
		function $emnapiSyncMemory(js_to_wasm, arrayBufferOrView, offset, len) {
			offset = offset !== null && offset !== void 0 ? offset : 0;
			offset = offset >>> 0;
			var view;
			if (arrayBufferOrView instanceof ArrayBuffer) {
				var pointer = emnapiExternalMemory.getArrayBufferPointer(arrayBufferOrView, false).address;
				if (!pointer) throw new Error("Unknown ArrayBuffer address");
				if (typeof len !== "number" || len === -1) len = arrayBufferOrView.byteLength - offset;
				len = len >>> 0;
				if (len === 0) return arrayBufferOrView;
				view = new Uint8Array(arrayBufferOrView, offset, len);
				var wasmMemoryU8 = new Uint8Array(wasmMemory.buffer);
				if (!js_to_wasm) view.set(wasmMemoryU8.subarray(pointer, pointer + len));
				else wasmMemoryU8.set(view, pointer);
				return arrayBufferOrView;
			}
			if (ArrayBuffer.isView(arrayBufferOrView)) {
				var viewPointerInfo = emnapiExternalMemory.getViewPointer(arrayBufferOrView, false);
				var latestView = viewPointerInfo.view;
				var pointer = viewPointerInfo.address;
				if (!pointer) throw new Error("Unknown ArrayBuffer address");
				if (typeof len !== "number" || len === -1) len = latestView.byteLength - offset;
				len = len >>> 0;
				if (len === 0) return latestView;
				view = new Uint8Array(latestView.buffer, latestView.byteOffset + offset, len);
				var wasmMemoryU8 = new Uint8Array(wasmMemory.buffer);
				if (!js_to_wasm) view.set(wasmMemoryU8.subarray(pointer, pointer + len));
				else wasmMemoryU8.set(view, pointer);
				return latestView;
			}
			throw new TypeError("emnapiSyncMemory expect ArrayBuffer or ArrayBufferView as first parameter");
		}
		/**
		* @__sig ipippp
		*/
		function emnapi_sync_memory(env, js_to_wasm, arraybuffer_or_view, offset, len) {
			var v;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!arraybuffer_or_view) return envObject.setLastError(1);
				var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
				var handleId = HEAP_DATA_VIEW.getUint32(arraybuffer_or_view, true);
				var handle = envObject.ctx.handleStore.get(handleId);
				if (!handle.isArrayBuffer() && !handle.isTypedArray() && !handle.isDataView()) return envObject.setLastError(1);
				var ret = $emnapiSyncMemory(Boolean(js_to_wasm), handle.value, offset, len);
				if (handle.value !== ret) {
					v = envObject.ensureHandleId(ret);
					HEAP_DATA_VIEW.setUint32(arraybuffer_or_view, v, true);
				}
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		function $emnapiGetMemoryAddress(arrayBufferOrView) {
			var isArrayBuffer = arrayBufferOrView instanceof ArrayBuffer;
			var isDataView = arrayBufferOrView instanceof DataView;
			if (!isArrayBuffer && !(ArrayBuffer.isView(arrayBufferOrView) && !isDataView) && !isDataView) throw new TypeError("emnapiGetMemoryAddress expect ArrayBuffer or ArrayBufferView as first parameter");
			var info;
			if (isArrayBuffer) info = emnapiExternalMemory.getArrayBufferPointer(arrayBufferOrView, false);
			else info = emnapiExternalMemory.getViewPointer(arrayBufferOrView, false);
			return {
				address: info.address,
				ownership: info.ownership,
				runtimeAllocated: info.runtimeAllocated
			};
		}
		/**
		* @__sig ipppp
		*/
		function emnapi_get_memory_address(env, arraybuffer_or_view, address, ownership, runtime_allocated) {
			var p$1, runtimeAllocated, ownershipOut;
			var info;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!arraybuffer_or_view) return envObject.setLastError(1);
				if (!address && !ownership && !runtime_allocated) return envObject.setLastError(1);
				var handle = envObject.ctx.handleStore.get(arraybuffer_or_view);
				info = $emnapiGetMemoryAddress(handle.value);
				p$1 = info.address;
				var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
				if (address) HEAP_DATA_VIEW.setUint32(address, p$1, true);
				if (ownership) {
					ownershipOut = info.ownership;
					HEAP_DATA_VIEW.setInt32(ownership, ownershipOut, true);
				}
				if (runtime_allocated) {
					runtimeAllocated = info.runtimeAllocated;
					HEAP_DATA_VIEW.setInt8(runtime_allocated, runtimeAllocated, true);
				}
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ipp
		*/
		function emnapi_get_runtime_version(env, version$3) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			if (!version$3) return envObject.setLastError(1);
			var runtimeVersion;
			try {
				runtimeVersion = emnapiCtx.getRuntimeVersions().version;
			} catch (_) {
				return envObject.setLastError(9);
			}
			var versions = runtimeVersion.split(".").map(function(n$2) {
				return Number(n$2);
			});
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			HEAP_DATA_VIEW.setUint32(version$3, versions[0], true);
			HEAP_DATA_VIEW.setUint32(version$3 + 4, versions[1], true);
			HEAP_DATA_VIEW.setUint32(version$3 + 8, versions[2], true);
			return envObject.clearLastError();
		}
		var emnapiMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			$emnapiGetMemoryAddress,
			$emnapiSyncMemory,
			emnapi_create_memory_view,
			emnapi_get_memory_address,
			emnapi_get_runtime_version,
			emnapi_is_node_binding_available,
			emnapi_is_support_bigint,
			emnapi_is_support_weakref,
			emnapi_sync_memory
		});
		/**
		* @__sig ipp
		*/
		function napi_create_array(env, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			var value = emnapiCtx.addToCurrentScope([]).id;
			new DataView(wasmMemory.buffer).setUint32(result, value, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ippp
		*/
		function napi_create_array_with_length(env, length, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			length = length >>> 0;
			var value = emnapiCtx.addToCurrentScope(new Array(length)).id;
			new DataView(wasmMemory.buffer).setUint32(result, value, true);
			return envObject.clearLastError();
		}
		function emnapiCreateArrayBuffer(byte_length, data) {
			byte_length = byte_length >>> 0;
			var arrayBuffer = new ArrayBuffer(byte_length);
			if (data) {
				var p$1 = emnapiExternalMemory.getArrayBufferPointer(arrayBuffer, true).address;
				new DataView(wasmMemory.buffer).setUint32(data, p$1, true);
			}
			return arrayBuffer;
		}
		/**
		* @__sig ipppp
		*/
		function napi_create_arraybuffer(env, byte_length, data, result) {
			var value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!result) return envObject.setLastError(1);
				var arrayBuffer = emnapiCreateArrayBuffer(byte_length, data);
				value = emnapiCtx.addToCurrentScope(arrayBuffer).id;
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ipdp
		*/
		function napi_create_date(env, time, result) {
			var value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!result) return envObject.setLastError(1);
				value = emnapiCtx.addToCurrentScope(new Date(time)).id;
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ippppp
		*/
		function napi_create_external(env, data, finalize_cb, finalize_hint, result) {
			var value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!result) return envObject.setLastError(1);
				if (!emnapiCtx.feature.supportFinalizer && finalize_cb) throw emnapiCtx.createNotSupportWeakRefError("napi_create_external", "Parameter \"finalize_cb\" must be 0(NULL)");
				var externalHandle = emnapiCtx.getCurrentScope().addExternal(data);
				if (finalize_cb) emnapiCtx.createReferenceWithFinalizer(envObject, externalHandle.id, 0, 0, finalize_cb, data, finalize_hint);
				value = externalHandle.id;
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				return envObject.clearLastError();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ipppppp
		*/
		function napi_create_external_arraybuffer(env, external_data, byte_length, finalize_cb, finalize_hint, result) {
			var value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!result) return envObject.setLastError(1);
				byte_length = byte_length >>> 0;
				if (!external_data) byte_length = 0;
				if (external_data + byte_length > wasmMemory.buffer.byteLength) throw new RangeError("Memory out of range");
				if (!emnapiCtx.feature.supportFinalizer && finalize_cb) throw emnapiCtx.createNotSupportWeakRefError("napi_create_external_arraybuffer", "Parameter \"finalize_cb\" must be 0(NULL)");
				var arrayBuffer = new ArrayBuffer(byte_length);
				if (byte_length === 0) try {
					var MessageChannel_1 = emnapiCtx.feature.MessageChannel;
					new MessageChannel_1().port1.postMessage(arrayBuffer, [arrayBuffer]);
				} catch (_) {}
				else {
					new Uint8Array(arrayBuffer).set(new Uint8Array(wasmMemory.buffer).subarray(external_data, external_data + byte_length));
					emnapiExternalMemory.table.set(arrayBuffer, {
						address: external_data,
						ownership: 1,
						runtimeAllocated: 0
					});
				}
				var handle = emnapiCtx.addToCurrentScope(arrayBuffer);
				if (finalize_cb) {
					var status_1 = napi_add_finalizer(env, handle.id, external_data, finalize_cb, finalize_hint, 0);
					if (status_1 === 10) {
						var err$1 = envObject.tryCatch.extractException();
						envObject.clearLastError();
						throw err$1;
					} else if (status_1 !== 0) return envObject.setLastError(status_1);
				}
				value = handle.id;
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				return envObject.getReturnStatus();
			} catch (err$2) {
				envObject.tryCatch.setError(err$2);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ipp
		*/
		function napi_create_object(env, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			var value = emnapiCtx.addToCurrentScope({}).id;
			new DataView(wasmMemory.buffer).setUint32(result, value, true);
			return envObject.clearLastError();
		}
		/**
		* @__sig ippp
		*/
		function napi_create_symbol(env, description$1, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			if (!description$1) {
				var value = emnapiCtx.addToCurrentScope(Symbol()).id;
				HEAP_DATA_VIEW.setUint32(result, value, true);
			} else {
				var desc = emnapiCtx.handleStore.get(description$1).value;
				if (typeof desc !== "string") return envObject.setLastError(3);
				var v = emnapiCtx.addToCurrentScope(Symbol(desc)).id;
				HEAP_DATA_VIEW.setUint32(result, v, true);
			}
			return envObject.clearLastError();
		}
		/**
		* @__sig ipipppp
		*/
		function napi_create_typedarray(env, type, length, arraybuffer, byte_offset, result) {
			var value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!arraybuffer) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				var handle = emnapiCtx.handleStore.get(arraybuffer);
				if (!handle.isArrayBuffer()) return envObject.setLastError(1);
				var buffer = handle.value;
				var createTypedArray = function(envObject$1, Type, size_of_element, buffer$1, byte_offset$1, length$1) {
					var _a;
					byte_offset$1 = byte_offset$1 >>> 0;
					length$1 = length$1 >>> 0;
					if (size_of_element > 1) {
						if (byte_offset$1 % size_of_element !== 0) {
							var err$1 = new RangeError("start offset of ".concat((_a = Type.name) !== null && _a !== void 0 ? _a : "", " should be a multiple of ").concat(size_of_element));
							err$1.code = "ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT";
							envObject$1.tryCatch.setError(err$1);
							return envObject$1.setLastError(9);
						}
					}
					if (length$1 * size_of_element + byte_offset$1 > buffer$1.byteLength) {
						var err$1 = /* @__PURE__ */ new RangeError("Invalid typed array length");
						err$1.code = "ERR_NAPI_INVALID_TYPEDARRAY_LENGTH";
						envObject$1.tryCatch.setError(err$1);
						return envObject$1.setLastError(9);
					}
					var out = new Type(buffer$1, byte_offset$1, length$1);
					if (buffer$1 === wasmMemory.buffer) {
						if (!emnapiExternalMemory.wasmMemoryViewTable.has(out)) emnapiExternalMemory.wasmMemoryViewTable.set(out, {
							Ctor: Type,
							address: byte_offset$1,
							length: length$1,
							ownership: 1,
							runtimeAllocated: 0
						});
					}
					value = emnapiCtx.addToCurrentScope(out).id;
					new DataView(wasmMemory.buffer).setUint32(result, value, true);
					return envObject$1.getReturnStatus();
				};
				switch (type) {
					case 0: return createTypedArray(envObject, Int8Array, 1, buffer, byte_offset, length);
					case 1: return createTypedArray(envObject, Uint8Array, 1, buffer, byte_offset, length);
					case 2: return createTypedArray(envObject, Uint8ClampedArray, 1, buffer, byte_offset, length);
					case 3: return createTypedArray(envObject, Int16Array, 2, buffer, byte_offset, length);
					case 4: return createTypedArray(envObject, Uint16Array, 2, buffer, byte_offset, length);
					case 5: return createTypedArray(envObject, Int32Array, 4, buffer, byte_offset, length);
					case 6: return createTypedArray(envObject, Uint32Array, 4, buffer, byte_offset, length);
					case 7: return createTypedArray(envObject, Float32Array, 4, buffer, byte_offset, length);
					case 8: return createTypedArray(envObject, Float64Array, 8, buffer, byte_offset, length);
					case 9: return createTypedArray(envObject, BigInt64Array, 8, buffer, byte_offset, length);
					case 10: return createTypedArray(envObject, BigUint64Array, 8, buffer, byte_offset, length);
					default: return envObject.setLastError(1);
				}
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__deps malloc
		* @__sig ippp
		*/
		function napi_create_buffer(env, size, data, result) {
			var _a;
			var value, pointer;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!result) return envObject.setLastError(1);
				var Buffer$1 = emnapiCtx.feature.Buffer;
				if (!Buffer$1) throw emnapiCtx.createNotSupportBufferError("napi_create_buffer", "");
				var buffer = void 0;
				size = size >>> 0;
				var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
				if (!data || size === 0) {
					buffer = Buffer$1.alloc(size);
					value = emnapiCtx.addToCurrentScope(buffer).id;
					HEAP_DATA_VIEW.setUint32(result, value, true);
				} else {
					pointer = _malloc(size);
					if (!pointer) throw new Error("Out of memory");
					new Uint8Array(wasmMemory.buffer).subarray(pointer, pointer + size).fill(0);
					var buffer_1 = Buffer$1.from(wasmMemory.buffer, pointer, size);
					var viewDescriptor = {
						Ctor: Buffer$1,
						address: pointer,
						length: size,
						ownership: emnapiExternalMemory.registry ? 0 : 1,
						runtimeAllocated: 1
					};
					emnapiExternalMemory.wasmMemoryViewTable.set(buffer_1, viewDescriptor);
					(_a = emnapiExternalMemory.registry) === null || _a === void 0 || _a.register(viewDescriptor, pointer);
					value = emnapiCtx.addToCurrentScope(buffer_1).id;
					HEAP_DATA_VIEW.setUint32(result, value, true);
					HEAP_DATA_VIEW.setUint32(data, pointer, true);
				}
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ippppp
		*/
		function napi_create_buffer_copy(env, length, data, result_data, result) {
			var value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!result) return envObject.setLastError(1);
				var Buffer$1 = emnapiCtx.feature.Buffer;
				if (!Buffer$1) throw emnapiCtx.createNotSupportBufferError("napi_create_buffer_copy", "");
				var arrayBuffer = emnapiCreateArrayBuffer(length, result_data);
				var buffer = Buffer$1.from(arrayBuffer);
				buffer.set(new Uint8Array(wasmMemory.buffer).subarray(data, data + length));
				value = emnapiCtx.addToCurrentScope(buffer).id;
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ipppppp
		*/
		function napi_create_external_buffer(env, length, data, finalize_cb, finalize_hint, result) {
			return emnapi_create_memory_view(env, -2, data, length, finalize_cb, finalize_hint, result);
		}
		/**
		* @__sig ippppp
		*/
		function node_api_create_buffer_from_arraybuffer(env, arraybuffer, byte_offset, byte_length, result) {
			var value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!arraybuffer) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				byte_offset = byte_offset >>> 0;
				byte_length = byte_length >>> 0;
				var handle = emnapiCtx.handleStore.get(arraybuffer);
				if (!handle.isArrayBuffer()) return envObject.setLastError(1);
				var buffer = handle.value;
				if (byte_length + byte_offset > buffer.byteLength) {
					var err$1 = /* @__PURE__ */ new RangeError("The byte offset + length is out of range");
					err$1.code = "ERR_OUT_OF_RANGE";
					throw err$1;
				}
				var Buffer$1 = emnapiCtx.feature.Buffer;
				if (!Buffer$1) throw emnapiCtx.createNotSupportBufferError("node_api_create_buffer_from_arraybuffer", "");
				var out = Buffer$1.from(buffer, byte_offset, byte_length);
				if (buffer === wasmMemory.buffer) {
					if (!emnapiExternalMemory.wasmMemoryViewTable.has(out)) emnapiExternalMemory.wasmMemoryViewTable.set(out, {
						Ctor: Buffer$1,
						address: byte_offset,
						length: byte_length,
						ownership: 1,
						runtimeAllocated: 0
					});
				}
				value = emnapiCtx.addToCurrentScope(out).id;
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				return envObject.getReturnStatus();
			} catch (err$2) {
				envObject.tryCatch.setError(err$2);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ippppp
		*/
		function napi_create_dataview(env, byte_length, arraybuffer, byte_offset, result) {
			var value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!arraybuffer) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				byte_length = byte_length >>> 0;
				byte_offset = byte_offset >>> 0;
				var handle = emnapiCtx.handleStore.get(arraybuffer);
				if (!handle.isArrayBuffer()) return envObject.setLastError(1);
				var buffer = handle.value;
				if (byte_length + byte_offset > buffer.byteLength) {
					var err$1 = /* @__PURE__ */ new RangeError("byte_offset + byte_length should be less than or equal to the size in bytes of the array passed in");
					err$1.code = "ERR_NAPI_INVALID_DATAVIEW_ARGS";
					throw err$1;
				}
				var dataview = new DataView(buffer, byte_offset, byte_length);
				if (buffer === wasmMemory.buffer) {
					if (!emnapiExternalMemory.wasmMemoryViewTable.has(dataview)) emnapiExternalMemory.wasmMemoryViewTable.set(dataview, {
						Ctor: DataView,
						address: byte_offset,
						length: byte_length,
						ownership: 1,
						runtimeAllocated: 0
					});
				}
				value = emnapiCtx.addToCurrentScope(dataview).id;
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				return envObject.getReturnStatus();
			} catch (err$2) {
				envObject.tryCatch.setError(err$2);
				return envObject.setLastError(10);
			}
		}
		/**
		* @__sig ipppp
		*/
		function node_api_symbol_for(env, utf8description, length, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			var autoLength = length === -1;
			var sizelength = length >>> 0;
			if (length !== 0) {
				if (!utf8description) return envObject.setLastError(1);
			}
			if (!(autoLength || sizelength <= 2147483647)) return envObject.setLastError(1);
			var descriptionString = emnapiString.UTF8ToString(utf8description, length);
			var value = emnapiCtx.addToCurrentScope(Symbol.for(descriptionString)).id;
			new DataView(wasmMemory.buffer).setUint32(result, value, true);
			return envObject.clearLastError();
		}
		var createMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			napi_create_array,
			napi_create_array_with_length,
			napi_create_arraybuffer,
			napi_create_buffer,
			napi_create_buffer_copy,
			napi_create_dataview,
			napi_create_date,
			napi_create_external,
			napi_create_external_arraybuffer,
			napi_create_external_buffer,
			napi_create_object,
			napi_create_symbol,
			napi_create_typedarray,
			node_api_create_buffer_from_arraybuffer,
			node_api_symbol_for
		});
		/** @__sig ipip */
		function napi_get_boolean(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			var v = value === 0 ? 3 : 4;
			new DataView(wasmMemory.buffer).setUint32(result, v, true);
			return envObject.clearLastError();
		}
		/** @__sig ipp */
		function napi_get_global(env, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			new DataView(wasmMemory.buffer).setUint32(result, 5, true);
			return envObject.clearLastError();
		}
		/** @__sig ipp */
		function napi_get_null(env, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			new DataView(wasmMemory.buffer).setUint32(result, 2, true);
			return envObject.clearLastError();
		}
		/** @__sig ipp */
		function napi_get_undefined(env, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			new DataView(wasmMemory.buffer).setUint32(result, 1, true);
			return envObject.clearLastError();
		}
		var globalMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			napi_get_boolean,
			napi_get_global,
			napi_get_null,
			napi_get_undefined
		});
		/** @__sig ipppp */
		function napi_set_instance_data(env, data, finalize_cb, finalize_hint) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.setInstanceData(data, finalize_cb, finalize_hint);
			return envObject.clearLastError();
		}
		/** @__sig ipp */
		function napi_get_instance_data(env, data) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			if (!data) return envObject.setLastError(1);
			var value = envObject.getInstanceData();
			new DataView(wasmMemory.buffer).setUint32(data, value, true);
			return envObject.clearLastError();
		}
		var envMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			napi_get_instance_data,
			napi_set_instance_data
		});
		/** @__sig vpppp */
		function _emnapi_get_last_error_info(env, error_code, engine_error_code, engine_reserved) {
			var lastError = emnapiCtx.envStore.get(env).lastError;
			var errorCode = lastError.errorCode;
			var engineErrorCode = lastError.engineErrorCode >>> 0;
			var engineReserved = lastError.engineReserved;
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			HEAP_DATA_VIEW.setInt32(error_code, errorCode, true);
			HEAP_DATA_VIEW.setUint32(engine_error_code, engineErrorCode, true);
			HEAP_DATA_VIEW.setUint32(engine_reserved, engineReserved, true);
		}
		/** @__sig ipp */
		function napi_throw(env, error$1) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!error$1) return envObject.setLastError(1);
				envObject.tryCatch.setError(emnapiCtx.handleStore.get(error$1).value);
				return envObject.clearLastError();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippp */
		function napi_throw_error(env, code$1, msg) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!msg) return envObject.setLastError(1);
				var error$1 = new Error(emnapiString.UTF8ToString(msg, -1));
				if (code$1) error$1.code = emnapiString.UTF8ToString(code$1, -1);
				envObject.tryCatch.setError(error$1);
				return envObject.clearLastError();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippp */
		function napi_throw_type_error(env, code$1, msg) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!msg) return envObject.setLastError(1);
				var error$1 = new TypeError(emnapiString.UTF8ToString(msg, -1));
				if (code$1) error$1.code = emnapiString.UTF8ToString(code$1, -1);
				envObject.tryCatch.setError(error$1);
				return envObject.clearLastError();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippp */
		function napi_throw_range_error(env, code$1, msg) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!msg) return envObject.setLastError(1);
				var error$1 = new RangeError(emnapiString.UTF8ToString(msg, -1));
				if (code$1) error$1.code = emnapiString.UTF8ToString(code$1, -1);
				envObject.tryCatch.setError(error$1);
				return envObject.clearLastError();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippp */
		function node_api_throw_syntax_error(env, code$1, msg) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!msg) return envObject.setLastError(1);
				var error$1 = new SyntaxError(emnapiString.UTF8ToString(msg, -1));
				if (code$1) error$1.code = emnapiString.UTF8ToString(code$1, -1);
				envObject.tryCatch.setError(error$1);
				return envObject.clearLastError();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ipp */
		function napi_is_exception_pending(env, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			var r$1 = envObject.tryCatch.hasCaught();
			new DataView(wasmMemory.buffer).setInt8(result, r$1 ? 1 : 0, true);
			return envObject.clearLastError();
		}
		/** @__sig ipppp */
		function napi_create_error(env, code$1, msg, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!msg) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var msgValue = emnapiCtx.handleStore.get(msg).value;
			if (typeof msgValue !== "string") return envObject.setLastError(3);
			var error$1 = new Error(msgValue);
			if (code$1) {
				var codeValue = emnapiCtx.handleStore.get(code$1).value;
				if (typeof codeValue !== "string") return envObject.setLastError(3);
				error$1.code = codeValue;
			}
			var value = emnapiCtx.addToCurrentScope(error$1).id;
			new DataView(wasmMemory.buffer).setUint32(result, value, true);
			return envObject.clearLastError();
		}
		/** @__sig ipppp */
		function napi_create_type_error(env, code$1, msg, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!msg) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var msgValue = emnapiCtx.handleStore.get(msg).value;
			if (typeof msgValue !== "string") return envObject.setLastError(3);
			var error$1 = new TypeError(msgValue);
			if (code$1) {
				var codeValue = emnapiCtx.handleStore.get(code$1).value;
				if (typeof codeValue !== "string") return envObject.setLastError(3);
				error$1.code = codeValue;
			}
			var value = emnapiCtx.addToCurrentScope(error$1).id;
			new DataView(wasmMemory.buffer).setUint32(result, value, true);
			return envObject.clearLastError();
		}
		/** @__sig ipppp */
		function napi_create_range_error(env, code$1, msg, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!msg) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var msgValue = emnapiCtx.handleStore.get(msg).value;
			if (typeof msgValue !== "string") return envObject.setLastError(3);
			var error$1 = new RangeError(msgValue);
			if (code$1) {
				var codeValue = emnapiCtx.handleStore.get(code$1).value;
				if (typeof codeValue !== "string") return envObject.setLastError(3);
				error$1.code = codeValue;
			}
			var value = emnapiCtx.addToCurrentScope(error$1).id;
			new DataView(wasmMemory.buffer).setUint32(result, value, true);
			return envObject.clearLastError();
		}
		/** @__sig ipppp */
		function node_api_create_syntax_error(env, code$1, msg, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!msg) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var msgValue = emnapiCtx.handleStore.get(msg).value;
			if (typeof msgValue !== "string") return envObject.setLastError(3);
			var error$1 = new SyntaxError(msgValue);
			if (code$1) {
				var codeValue = emnapiCtx.handleStore.get(code$1).value;
				if (typeof codeValue !== "string") return envObject.setLastError(3);
				error$1.code = codeValue;
			}
			var value = emnapiCtx.addToCurrentScope(error$1).id;
			new DataView(wasmMemory.buffer).setUint32(result, value, true);
			return envObject.clearLastError();
		}
		/** @__sig ipp */
		function napi_get_and_clear_last_exception(env, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			if (!envObject.tryCatch.hasCaught()) {
				HEAP_DATA_VIEW.setUint32(result, 1, true);
				return envObject.clearLastError();
			} else {
				var err$1 = envObject.tryCatch.exception();
				var value = envObject.ensureHandleId(err$1);
				HEAP_DATA_VIEW.setUint32(result, value, true);
				envObject.tryCatch.reset();
			}
			return envObject.clearLastError();
		}
		/** @__sig vpppp */
		function napi_fatal_error(location, location_len, message, message_len) {
			var locationStr = emnapiString.UTF8ToString(location, location_len);
			var messageStr = emnapiString.UTF8ToString(message, message_len);
			if (emnapiNodeBinding) emnapiNodeBinding.napi.fatalError(locationStr, messageStr);
			else abort("FATAL ERROR: " + locationStr + " " + messageStr);
		}
		/** @__sig ipp */
		function napi_fatal_exception(env, err$1) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!err$1) return envObject.setLastError(1);
				var error$1 = envObject.ctx.handleStore.get(err$1);
				try {
					envObject.triggerFatalException(error$1.value);
				} catch (_) {
					return envObject.setLastError(9);
				}
				return envObject.clearLastError();
			} catch (err$2) {
				envObject.tryCatch.setError(err$2);
				return envObject.setLastError(10);
			}
		}
		var errorMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			_emnapi_get_last_error_info,
			napi_create_error,
			napi_create_range_error,
			napi_create_type_error,
			napi_fatal_error,
			napi_fatal_exception,
			napi_get_and_clear_last_exception,
			napi_is_exception_pending,
			napi_throw,
			napi_throw_error,
			napi_throw_range_error,
			napi_throw_type_error,
			node_api_create_syntax_error,
			node_api_throw_syntax_error
		});
		/** @__sig ipppppp */
		function napi_create_function(env, utf8name, length, cb, data, result) {
			var value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!result) return envObject.setLastError(1);
				if (!cb) return envObject.setLastError(1);
				var fresult = emnapiCreateFunction(envObject, utf8name, length, cb, data);
				if (fresult.status !== 0) return envObject.setLastError(fresult.status);
				var f$1 = fresult.f;
				value = emnapiCtx.addToCurrentScope(f$1).id;
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ipppppp */
		function napi_get_cb_info(env, cbinfo, argc, argv, this_arg, data) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			if (!cbinfo) return envObject.setLastError(1);
			var cbinfoValue = emnapiCtx.scopeStore.get(cbinfo).callbackInfo;
			var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
			if (argv) {
				if (!argc) return envObject.setLastError(1);
				var argcValue = HEAP_DATA_VIEW.getUint32(argc, true);
				var len = cbinfoValue.args.length;
				var arrlen = argcValue < len ? argcValue : len;
				var i$1 = 0;
				for (; i$1 < arrlen; i$1++) {
					var argVal = envObject.ensureHandleId(cbinfoValue.args[i$1]);
					HEAP_DATA_VIEW.setUint32(argv + i$1 * 4, argVal, true);
				}
				if (i$1 < argcValue) for (; i$1 < argcValue; i$1++) HEAP_DATA_VIEW.setUint32(argv + i$1 * 4, 1, true);
			}
			if (argc) HEAP_DATA_VIEW.setUint32(argc, cbinfoValue.args.length, true);
			if (this_arg) {
				var v = envObject.ensureHandleId(cbinfoValue.thiz);
				HEAP_DATA_VIEW.setUint32(this_arg, v, true);
			}
			if (data) HEAP_DATA_VIEW.setUint32(data, cbinfoValue.data, true);
			return envObject.clearLastError();
		}
		/** @__sig ipppppp */
		function napi_call_function(env, recv, func, argc, argv, result) {
			var i$1 = 0;
			var v;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!recv) return envObject.setLastError(1);
				argc = argc >>> 0;
				if (argc > 0) {
					if (!argv) return envObject.setLastError(1);
				}
				var v8recv = emnapiCtx.handleStore.get(recv).value;
				if (!func) return envObject.setLastError(1);
				var v8func = emnapiCtx.handleStore.get(func).value;
				if (typeof v8func !== "function") return envObject.setLastError(1);
				var args$1 = [];
				var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
				for (; i$1 < argc; i$1++) {
					var argVal = HEAP_DATA_VIEW.getUint32(argv + i$1 * 4, true);
					args$1.push(emnapiCtx.handleStore.get(argVal).value);
				}
				var ret = v8func.apply(v8recv, args$1);
				if (result) {
					v = envObject.ensureHandleId(ret);
					HEAP_DATA_VIEW.setUint32(result, v, true);
				}
				return envObject.clearLastError();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippppp */
		function napi_new_instance(env, constructor, argc, argv, result) {
			var i$1;
			var v;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!constructor) return envObject.setLastError(1);
				argc = argc >>> 0;
				if (argc > 0) {
					if (!argv) return envObject.setLastError(1);
				}
				if (!result) return envObject.setLastError(1);
				var Ctor = emnapiCtx.handleStore.get(constructor).value;
				if (typeof Ctor !== "function") return envObject.setLastError(1);
				var ret = void 0;
				var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
				if (emnapiCtx.feature.supportReflect) {
					var argList = Array(argc);
					for (i$1 = 0; i$1 < argc; i$1++) {
						var argVal = HEAP_DATA_VIEW.getUint32(argv + i$1 * 4, true);
						argList[i$1] = emnapiCtx.handleStore.get(argVal).value;
					}
					ret = Reflect.construct(Ctor, argList, Ctor);
				} else {
					var args$1 = Array(argc + 1);
					args$1[0] = void 0;
					for (i$1 = 0; i$1 < argc; i$1++) {
						var argVal = HEAP_DATA_VIEW.getUint32(argv + i$1 * 4, true);
						args$1[i$1 + 1] = emnapiCtx.handleStore.get(argVal).value;
					}
					ret = new (Ctor.bind.apply(Ctor, args$1))();
				}
				if (result) {
					v = envObject.ensureHandleId(ret);
					HEAP_DATA_VIEW.setUint32(result, v, true);
				}
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippp */
		function napi_get_new_target(env, cbinfo, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!cbinfo) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var cbinfoValue = emnapiCtx.scopeStore.get(cbinfo).callbackInfo;
			var thiz = cbinfoValue.thiz, fn = cbinfoValue.fn;
			var value = thiz == null || thiz.constructor == null ? 0 : thiz instanceof fn ? envObject.ensureHandleId(thiz.constructor) : 0;
			new DataView(wasmMemory.buffer).setUint32(result, value, true);
			return envObject.clearLastError();
		}
		var functionMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			napi_call_function,
			napi_create_function,
			napi_get_cb_info,
			napi_get_new_target,
			napi_new_instance
		});
		/** @__sig ipp */
		function napi_open_handle_scope(env, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			var scope = emnapiCtx.openScope(envObject);
			new DataView(wasmMemory.buffer).setUint32(result, scope.id, true);
			return envObject.clearLastError();
		}
		/** @__sig ipp */
		function napi_close_handle_scope(env, scope) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!scope) return envObject.setLastError(1);
			if (envObject.openHandleScopes === 0) return 13;
			emnapiCtx.closeScope(envObject);
			return envObject.clearLastError();
		}
		/** @__sig ipp */
		function napi_open_escapable_handle_scope(env, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!result) return envObject.setLastError(1);
			var scope = emnapiCtx.openScope(envObject);
			new DataView(wasmMemory.buffer).setUint32(result, scope.id, true);
			return envObject.clearLastError();
		}
		/** @__sig ipp */
		function napi_close_escapable_handle_scope(env, scope) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!scope) return envObject.setLastError(1);
			if (envObject.openHandleScopes === 0) return 13;
			emnapiCtx.closeScope(envObject);
			return envObject.clearLastError();
		}
		/** @__sig ipppp */
		function napi_escape_handle(env, scope, escapee, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!scope) return envObject.setLastError(1);
			if (!escapee) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var scopeObject = emnapiCtx.scopeStore.get(scope);
			if (!scopeObject.escapeCalled()) {
				var newHandle = scopeObject.escape(escapee);
				var value = newHandle ? newHandle.id : 0;
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				return envObject.clearLastError();
			}
			return envObject.setLastError(12);
		}
		/** @__sig ippip */
		function napi_create_reference(env, value, initial_refcount, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var handle = emnapiCtx.handleStore.get(value);
			if (envObject.moduleApiVersion < 10) {
				if (!(handle.isObject() || handle.isFunction() || handle.isSymbol())) return envObject.setLastError(1);
			}
			var ref = emnapiCtx.createReference(envObject, handle.id, initial_refcount >>> 0, 1);
			new DataView(wasmMemory.buffer).setUint32(result, ref.id, true);
			return envObject.clearLastError();
		}
		/** @__sig ipp */
		function napi_delete_reference(env, ref) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			if (!ref) return envObject.setLastError(1);
			emnapiCtx.refStore.get(ref).dispose();
			return envObject.clearLastError();
		}
		/** @__sig ippp */
		function napi_reference_ref(env, ref, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!ref) return envObject.setLastError(1);
			var count = emnapiCtx.refStore.get(ref).ref();
			if (result) new DataView(wasmMemory.buffer).setUint32(result, count, true);
			return envObject.clearLastError();
		}
		/** @__sig ippp */
		function napi_reference_unref(env, ref, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!ref) return envObject.setLastError(1);
			var reference = emnapiCtx.refStore.get(ref);
			if (reference.refcount() === 0) return envObject.setLastError(9);
			var count = reference.unref();
			if (result) new DataView(wasmMemory.buffer).setUint32(result, count, true);
			return envObject.clearLastError();
		}
		/** @__sig ippp */
		function napi_get_reference_value(env, ref, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!ref) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var handleId = emnapiCtx.refStore.get(ref).get(envObject);
			new DataView(wasmMemory.buffer).setUint32(result, handleId, true);
			return envObject.clearLastError();
		}
		/** @__sig ippp */
		function napi_add_env_cleanup_hook(env, fun, arg) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			if (!fun) return envObject.setLastError(1);
			emnapiCtx.addCleanupHook(envObject, fun, arg);
			return 0;
		}
		/** @__sig ippp */
		function napi_remove_env_cleanup_hook(env, fun, arg) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			if (!fun) return envObject.setLastError(1);
			emnapiCtx.removeCleanupHook(envObject, fun, arg);
			return 0;
		}
		/** @__sig vp */
		function _emnapi_env_ref(env) {
			emnapiCtx.envStore.get(env).ref();
		}
		/** @__sig vp */
		function _emnapi_env_unref(env) {
			emnapiCtx.envStore.get(env).unref();
		}
		var lifeMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			_emnapi_env_ref,
			_emnapi_env_unref,
			napi_add_env_cleanup_hook,
			napi_close_escapable_handle_scope,
			napi_close_handle_scope,
			napi_create_reference,
			napi_delete_reference,
			napi_escape_handle,
			napi_get_reference_value,
			napi_open_escapable_handle_scope,
			napi_open_handle_scope,
			napi_reference_ref,
			napi_reference_unref,
			napi_remove_env_cleanup_hook
		});
		/** @__sig ippi */
		function _emnapi_get_filename(env, buf, len) {
			var filename = emnapiCtx.envStore.get(env).filename;
			if (!buf) return emnapiString.lengthBytesUTF8(filename);
			return emnapiString.stringToUTF8(filename, buf, len);
		}
		var miscellaneousMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			_emnapi_get_filename
		});
		/** @__sig ippp */
		function napi_create_promise(env, deferred, promise$1) {
			var deferredObjectId, value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!deferred) return envObject.setLastError(1);
				if (!promise$1) return envObject.setLastError(1);
				var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
				var p$1 = new Promise(function(resolve$1$1, reject) {
					deferredObjectId = emnapiCtx.createDeferred({
						resolve: resolve$1$1,
						reject
					}).id;
					HEAP_DATA_VIEW.setUint32(deferred, deferredObjectId, true);
				});
				value = emnapiCtx.addToCurrentScope(p$1).id;
				HEAP_DATA_VIEW.setUint32(promise$1, value, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippp */
		function napi_resolve_deferred(env, deferred, resolution) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!deferred) return envObject.setLastError(1);
				if (!resolution) return envObject.setLastError(1);
				emnapiCtx.deferredStore.get(deferred).resolve(emnapiCtx.handleStore.get(resolution).value);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippp */
		function napi_reject_deferred(env, deferred, resolution) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!deferred) return envObject.setLastError(1);
				if (!resolution) return envObject.setLastError(1);
				emnapiCtx.deferredStore.get(deferred).reject(emnapiCtx.handleStore.get(resolution).value);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippp */
		function napi_is_promise(env, value, is_promise) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!is_promise) return envObject.setLastError(1);
			var r$1 = emnapiCtx.handleStore.get(value).isPromise() ? 1 : 0;
			new DataView(wasmMemory.buffer).setInt8(is_promise, r$1, true);
			return envObject.clearLastError();
		}
		var promiseMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			napi_create_promise,
			napi_is_promise,
			napi_reject_deferred,
			napi_resolve_deferred
		});
		/** @__sig ippiiip */
		function napi_get_all_property_names(env, object$1, key_mode, key_filter, key_conversion, result) {
			var value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!result) return envObject.setLastError(1);
				if (!object$1) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				if (h$1.value == null) throw new TypeError("Cannot convert undefined or null to object");
				var obj = void 0;
				try {
					obj = h$1.isObject() || h$1.isFunction() ? h$1.value : Object(h$1.value);
				} catch (_) {
					return envObject.setLastError(2);
				}
				if (key_mode !== 0 && key_mode !== 1) return envObject.setLastError(1);
				if (key_conversion !== 0 && key_conversion !== 1) return envObject.setLastError(1);
				var props = [];
				var names = void 0;
				var symbols = void 0;
				var i$1 = void 0;
				var own = true;
				var integerIndiceRegex = /^(0|[1-9][0-9]*)$/;
				do {
					names = Object.getOwnPropertyNames(obj);
					symbols = Object.getOwnPropertySymbols(obj);
					for (i$1 = 0; i$1 < names.length; i$1++) props.push({
						name: integerIndiceRegex.test(names[i$1]) ? Number(names[i$1]) : names[i$1],
						desc: Object.getOwnPropertyDescriptor(obj, names[i$1]),
						own
					});
					for (i$1 = 0; i$1 < symbols.length; i$1++) props.push({
						name: symbols[i$1],
						desc: Object.getOwnPropertyDescriptor(obj, symbols[i$1]),
						own
					});
					if (key_mode === 1) break;
					obj = Object.getPrototypeOf(obj);
					own = false;
				} while (obj);
				var ret = [];
				var addName = function(ret$1, name, key_filter$1, conversion_mode) {
					if (ret$1.indexOf(name) !== -1) return;
					if (conversion_mode === 0) ret$1.push(name);
					else if (conversion_mode === 1) {
						var realName = typeof name === "number" ? String(name) : name;
						if (typeof realName === "string") {
							if (!(key_filter$1 & 8)) ret$1.push(realName);
						} else ret$1.push(realName);
					}
				};
				for (i$1 = 0; i$1 < props.length; i$1++) {
					var prop = props[i$1];
					var name_1 = prop.name;
					var desc = prop.desc;
					if (key_filter === 0) addName(ret, name_1, key_filter, key_conversion);
					else {
						if (key_filter & 8 && typeof name_1 === "string") continue;
						if (key_filter & 16 && typeof name_1 === "symbol") continue;
						var shouldAdd = true;
						switch (key_filter & 7) {
							case 1:
								shouldAdd = Boolean(desc.writable);
								break;
							case 2:
								shouldAdd = Boolean(desc.enumerable);
								break;
							case 3:
								shouldAdd = Boolean(desc.writable && desc.enumerable);
								break;
							case 4:
								shouldAdd = Boolean(desc.configurable);
								break;
							case 5:
								shouldAdd = Boolean(desc.configurable && desc.writable);
								break;
							case 6:
								shouldAdd = Boolean(desc.configurable && desc.enumerable);
								break;
							case 7:
								shouldAdd = Boolean(desc.configurable && desc.enumerable && desc.writable);
								break;
						}
						if (shouldAdd) addName(ret, name_1, key_filter, key_conversion);
					}
				}
				value = emnapiCtx.addToCurrentScope(ret).id;
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippp */
		function napi_get_property_names(env, object$1, result) {
			return napi_get_all_property_names(env, object$1, 0, 18, 1, result);
		}
		/** @__sig ipppp */
		function napi_set_property(env, object$1, key, value) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!key) return envObject.setLastError(1);
				if (!value) return envObject.setLastError(1);
				if (!object$1) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				if (!(h$1.isObject() || h$1.isFunction())) return envObject.setLastError(2);
				h$1.value[emnapiCtx.handleStore.get(key).value] = emnapiCtx.handleStore.get(value).value;
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ipppp */
		function napi_has_property(env, object$1, key, result) {
			var r$1;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!key) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				if (!object$1) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				if (h$1.value == null) throw new TypeError("Cannot convert undefined or null to object");
				var v = void 0;
				try {
					v = h$1.isObject() || h$1.isFunction() ? h$1.value : Object(h$1.value);
				} catch (_) {
					return envObject.setLastError(2);
				}
				r$1 = emnapiCtx.handleStore.get(key).value in v ? 1 : 0;
				new DataView(wasmMemory.buffer).setInt8(result, r$1, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ipppp */
		function napi_get_property(env, object$1, key, result) {
			var value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!key) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				if (!object$1) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				if (h$1.value == null) throw new TypeError("Cannot convert undefined or null to object");
				var v = void 0;
				try {
					v = h$1.isObject() || h$1.isFunction() ? h$1.value : Object(h$1.value);
				} catch (_) {
					return envObject.setLastError(2);
				}
				value = envObject.ensureHandleId(v[emnapiCtx.handleStore.get(key).value]);
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ipppp */
		function napi_delete_property(env, object$1, key, result) {
			var r$1;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!key) return envObject.setLastError(1);
				if (!object$1) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				if (!(h$1.isObject() || h$1.isFunction())) return envObject.setLastError(2);
				var propertyKey = emnapiCtx.handleStore.get(key).value;
				if (emnapiCtx.feature.supportReflect) r$1 = Reflect.deleteProperty(h$1.value, propertyKey);
				else try {
					r$1 = delete h$1.value[propertyKey];
				} catch (_) {
					r$1 = false;
				}
				if (result) new DataView(wasmMemory.buffer).setInt8(result, r$1 ? 1 : 0, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ipppp */
		function napi_has_own_property(env, object$1, key, result) {
			var r$1;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!key) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				if (!object$1) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				if (h$1.value == null) throw new TypeError("Cannot convert undefined or null to object");
				var v = void 0;
				try {
					v = h$1.isObject() || h$1.isFunction() ? h$1.value : Object(h$1.value);
				} catch (_) {
					return envObject.setLastError(2);
				}
				var prop = emnapiCtx.handleStore.get(key).value;
				if (typeof prop !== "string" && typeof prop !== "symbol") return envObject.setLastError(4);
				r$1 = Object.prototype.hasOwnProperty.call(v, emnapiCtx.handleStore.get(key).value);
				new DataView(wasmMemory.buffer).setInt8(result, r$1 ? 1 : 0, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ipppp */
		function napi_set_named_property(env, object$1, cname, value) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!value) return envObject.setLastError(1);
				if (!object$1) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				if (!(h$1.isObject() || h$1.isFunction())) return envObject.setLastError(2);
				if (!cname) return envObject.setLastError(1);
				emnapiCtx.handleStore.get(object$1).value[emnapiString.UTF8ToString(cname, -1)] = emnapiCtx.handleStore.get(value).value;
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ipppp */
		function napi_has_named_property(env, object$1, utf8name, result) {
			var r$1;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!result) return envObject.setLastError(1);
				if (!object$1) return envObject.setLastError(1);
				if (!utf8name) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				if (h$1.value == null) throw new TypeError("Cannot convert undefined or null to object");
				var v = void 0;
				try {
					v = h$1.isObject() || h$1.isFunction() ? h$1.value : Object(h$1.value);
				} catch (_) {
					return envObject.setLastError(2);
				}
				r$1 = emnapiString.UTF8ToString(utf8name, -1) in v;
				new DataView(wasmMemory.buffer).setInt8(result, r$1 ? 1 : 0, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ipppp */
		function napi_get_named_property(env, object$1, utf8name, result) {
			var value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!result) return envObject.setLastError(1);
				if (!object$1) return envObject.setLastError(1);
				if (!utf8name) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				if (h$1.value == null) throw new TypeError("Cannot convert undefined or null to object");
				var v = void 0;
				try {
					v = h$1.isObject() || h$1.isFunction() ? h$1.value : Object(h$1.value);
				} catch (_) {
					return envObject.setLastError(2);
				}
				value = envObject.ensureHandleId(v[emnapiString.UTF8ToString(utf8name, -1)]);
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippip */
		function napi_set_element(env, object$1, index, value) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!value) return envObject.setLastError(1);
				if (!object$1) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				if (!(h$1.isObject() || h$1.isFunction())) return envObject.setLastError(2);
				h$1.value[index >>> 0] = emnapiCtx.handleStore.get(value).value;
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippip */
		function napi_has_element(env, object$1, index, result) {
			var r$1;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!result) return envObject.setLastError(1);
				if (!object$1) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				if (h$1.value == null) throw new TypeError("Cannot convert undefined or null to object");
				var v = void 0;
				try {
					v = h$1.isObject() || h$1.isFunction() ? h$1.value : Object(h$1.value);
				} catch (_) {
					return envObject.setLastError(2);
				}
				r$1 = index >>> 0 in v ? 1 : 0;
				new DataView(wasmMemory.buffer).setInt8(result, r$1, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippip */
		function napi_get_element(env, object$1, index, result) {
			var value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!result) return envObject.setLastError(1);
				if (!object$1) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				if (h$1.value == null) throw new TypeError("Cannot convert undefined or null to object");
				var v = void 0;
				try {
					v = h$1.isObject() || h$1.isFunction() ? h$1.value : Object(h$1.value);
				} catch (_) {
					return envObject.setLastError(2);
				}
				value = envObject.ensureHandleId(v[index >>> 0]);
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippip */
		function napi_delete_element(env, object$1, index, result) {
			var r$1;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!object$1) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				if (!(h$1.isObject() || h$1.isFunction())) return envObject.setLastError(2);
				if (emnapiCtx.feature.supportReflect) r$1 = Reflect.deleteProperty(h$1.value, index >>> 0);
				else try {
					r$1 = delete h$1.value[index >>> 0];
				} catch (_) {
					r$1 = false;
				}
				if (result) new DataView(wasmMemory.buffer).setInt8(result, r$1 ? 1 : 0, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ipppp */
		function napi_define_properties(env, object$1, property_count, properties) {
			var propPtr, attributes;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				property_count = property_count >>> 0;
				if (property_count > 0) {
					if (!properties) return envObject.setLastError(1);
				}
				if (!object$1) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				var maybeObject = h$1.value;
				if (!(h$1.isObject() || h$1.isFunction())) return envObject.setLastError(2);
				var propertyName = void 0;
				var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
				for (var i$1 = 0; i$1 < property_count; i$1++) {
					propPtr = properties + i$1 * 32;
					var utf8Name = HEAP_DATA_VIEW.getUint32(propPtr, true);
					var name_2 = HEAP_DATA_VIEW.getUint32(propPtr + 4, true);
					var method = HEAP_DATA_VIEW.getUint32(propPtr + 8, true);
					var getter = HEAP_DATA_VIEW.getUint32(propPtr + 12, true);
					var setter = HEAP_DATA_VIEW.getUint32(propPtr + 16, true);
					var value = HEAP_DATA_VIEW.getUint32(propPtr + 20, true);
					attributes = HEAP_DATA_VIEW.getInt32(propPtr + 24, true);
					var data = HEAP_DATA_VIEW.getUint32(propPtr + 28, true);
					if (utf8Name) propertyName = emnapiString.UTF8ToString(utf8Name, -1);
					else {
						if (!name_2) return envObject.setLastError(4);
						propertyName = emnapiCtx.handleStore.get(name_2).value;
						if (typeof propertyName !== "string" && typeof propertyName !== "symbol") return envObject.setLastError(4);
					}
					emnapiDefineProperty(envObject, maybeObject, propertyName, method, getter, setter, value, attributes, data);
				}
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ipp */
		function napi_object_freeze(env, object$1) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!object$1) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				var maybeObject = h$1.value;
				if (!(h$1.isObject() || h$1.isFunction())) return envObject.setLastError(2);
				Object.freeze(maybeObject);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ipp */
		function napi_object_seal(env, object$1) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!object$1) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(object$1);
				var maybeObject = h$1.value;
				if (!(h$1.isObject() || h$1.isFunction())) return envObject.setLastError(2);
				Object.seal(maybeObject);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		var propertyMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			napi_define_properties,
			napi_delete_element,
			napi_delete_property,
			napi_get_all_property_names,
			napi_get_element,
			napi_get_named_property,
			napi_get_property,
			napi_get_property_names,
			napi_has_element,
			napi_has_named_property,
			napi_has_own_property,
			napi_has_property,
			napi_object_freeze,
			napi_object_seal,
			napi_set_element,
			napi_set_named_property,
			napi_set_property
		});
		/** @__sig ippp */
		function napi_run_script(env, script, result) {
			var status;
			var value;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!script) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				var v8Script = emnapiCtx.handleStore.get(script);
				if (!v8Script.isString()) return envObject.setLastError(3);
				var ret = emnapiCtx.handleStore.get(5).value.eval(v8Script.value);
				value = envObject.ensureHandleId(ret);
				new DataView(wasmMemory.buffer).setUint32(result, value, true);
				status = envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
			return status;
		}
		var scriptMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			napi_run_script
		});
		/** @__sig ippp */
		function napi_typeof(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var v = emnapiCtx.handleStore.get(value);
			var r$1;
			if (v.isNumber()) r$1 = 3;
			else if (v.isBigInt()) r$1 = 9;
			else if (v.isString()) r$1 = 4;
			else if (v.isFunction()) r$1 = 7;
			else if (v.isExternal()) r$1 = 8;
			else if (v.isObject()) r$1 = 6;
			else if (v.isBoolean()) r$1 = 2;
			else if (v.isUndefined()) r$1 = 0;
			else if (v.isSymbol()) r$1 = 5;
			else if (v.isNull()) r$1 = 1;
			else return envObject.setLastError(1);
			new DataView(wasmMemory.buffer).setInt32(result, r$1, true);
			return envObject.clearLastError();
		}
		/** @__sig ippp */
		function napi_coerce_to_bool(env, value, result) {
			var v;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!value) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				v = emnapiCtx.handleStore.get(value).value ? 4 : 3;
				new DataView(wasmMemory.buffer).setUint32(result, v, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippp */
		function napi_coerce_to_number(env, value, result) {
			var v;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!value) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				var handle = emnapiCtx.handleStore.get(value);
				if (handle.isBigInt()) throw new TypeError("Cannot convert a BigInt value to a number");
				v = emnapiCtx.addToCurrentScope(Number(handle.value)).id;
				new DataView(wasmMemory.buffer).setUint32(result, v, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippp */
		function napi_coerce_to_object(env, value, result) {
			var v;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!value) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				var handle = emnapiCtx.handleStore.get(value);
				if (handle.value == null) throw new TypeError("Cannot convert undefined or null to object");
				v = envObject.ensureHandleId(Object(handle.value));
				new DataView(wasmMemory.buffer).setUint32(result, v, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippp */
		function napi_coerce_to_string(env, value, result) {
			var v;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!value) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				var handle = emnapiCtx.handleStore.get(value);
				if (handle.isSymbol()) throw new TypeError("Cannot convert a Symbol value to a string");
				v = emnapiCtx.addToCurrentScope(String(handle.value)).id;
				new DataView(wasmMemory.buffer).setUint32(result, v, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ipppp */
		function napi_instanceof(env, object$1, constructor, result) {
			var r$1;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!object$1) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				if (!constructor) return envObject.setLastError(1);
				var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
				HEAP_DATA_VIEW.setInt8(result, 0, true);
				var ctor = emnapiCtx.handleStore.get(constructor);
				if (!ctor.isFunction()) return envObject.setLastError(5);
				r$1 = emnapiCtx.handleStore.get(object$1).value instanceof ctor.value ? 1 : 0;
				HEAP_DATA_VIEW.setInt8(result, r$1, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ippp */
		function napi_is_array(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var r$1 = emnapiCtx.handleStore.get(value).isArray() ? 1 : 0;
			new DataView(wasmMemory.buffer).setInt8(result, r$1, true);
			return envObject.clearLastError();
		}
		/** @__sig ippp */
		function napi_is_arraybuffer(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var r$1 = emnapiCtx.handleStore.get(value).isArrayBuffer() ? 1 : 0;
			new DataView(wasmMemory.buffer).setInt8(result, r$1, true);
			return envObject.clearLastError();
		}
		/** @__sig ippp */
		function napi_is_date(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var r$1 = emnapiCtx.handleStore.get(value).isDate() ? 1 : 0;
			new DataView(wasmMemory.buffer).setInt8(result, r$1, true);
			return envObject.clearLastError();
		}
		/** @__sig ippp */
		function napi_is_error(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var r$1 = emnapiCtx.handleStore.get(value).value instanceof Error ? 1 : 0;
			new DataView(wasmMemory.buffer).setInt8(result, r$1, true);
			return envObject.clearLastError();
		}
		/** @__sig ippp */
		function napi_is_typedarray(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var r$1 = emnapiCtx.handleStore.get(value).isTypedArray() ? 1 : 0;
			new DataView(wasmMemory.buffer).setInt8(result, r$1, true);
			return envObject.clearLastError();
		}
		/** @__sig ippp */
		function napi_is_buffer(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var r$1 = emnapiCtx.handleStore.get(value).isBuffer(emnapiCtx.feature.Buffer) ? 1 : 0;
			new DataView(wasmMemory.buffer).setInt8(result, r$1, true);
			return envObject.clearLastError();
		}
		/** @__sig ippp */
		function napi_is_dataview(env, value, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!value) return envObject.setLastError(1);
			if (!result) return envObject.setLastError(1);
			var r$1 = emnapiCtx.handleStore.get(value).isDataView() ? 1 : 0;
			new DataView(wasmMemory.buffer).setInt8(result, r$1, true);
			return envObject.clearLastError();
		}
		/** @__sig ipppp */
		function napi_strict_equals(env, lhs, rhs, result) {
			var r$1;
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!lhs) return envObject.setLastError(1);
				if (!rhs) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				var lv = emnapiCtx.handleStore.get(lhs).value;
				var rv = emnapiCtx.handleStore.get(rhs).value;
				r$1 = lv === rv ? 1 : 0;
				new DataView(wasmMemory.buffer).setInt8(result, r$1, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		/** @__sig ipp */
		function napi_detach_arraybuffer(env, arraybuffer) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!arraybuffer) return envObject.setLastError(1);
			var value = emnapiCtx.handleStore.get(arraybuffer).value;
			if (!(value instanceof ArrayBuffer)) {
				if (typeof SharedArrayBuffer === "function" && value instanceof SharedArrayBuffer) return envObject.setLastError(20);
				return envObject.setLastError(19);
			}
			try {
				var MessageChannel_1 = emnapiCtx.feature.MessageChannel;
				new MessageChannel_1().port1.postMessage(value, [value]);
			} catch (_) {
				return envObject.setLastError(9);
			}
			return envObject.clearLastError();
		}
		/** @__sig ippp */
		function napi_is_detached_arraybuffer(env, arraybuffer, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			envObject.checkGCAccess();
			if (!envObject.tryCatch.isEmpty()) return envObject.setLastError(10);
			if (!envObject.canCallIntoJs()) return envObject.setLastError(envObject.moduleApiVersion >= 10 ? 23 : 10);
			envObject.clearLastError();
			try {
				if (!arraybuffer) return envObject.setLastError(1);
				if (!result) return envObject.setLastError(1);
				var h$1 = emnapiCtx.handleStore.get(arraybuffer);
				var HEAP_DATA_VIEW = new DataView(wasmMemory.buffer);
				if (h$1.isArrayBuffer() && h$1.value.byteLength === 0) try {
					new Uint8Array(h$1.value);
				} catch (_) {
					HEAP_DATA_VIEW.setInt8(result, 1, true);
					return envObject.getReturnStatus();
				}
				HEAP_DATA_VIEW.setInt8(result, 0, true);
				return envObject.getReturnStatus();
			} catch (err$1) {
				envObject.tryCatch.setError(err$1);
				return envObject.setLastError(10);
			}
		}
		var valueOperationMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			napi_coerce_to_bool,
			napi_coerce_to_number,
			napi_coerce_to_object,
			napi_coerce_to_string,
			napi_detach_arraybuffer,
			napi_instanceof,
			napi_is_array,
			napi_is_arraybuffer,
			napi_is_buffer,
			napi_is_dataview,
			napi_is_date,
			napi_is_detached_arraybuffer,
			napi_is_error,
			napi_is_typedarray,
			napi_strict_equals,
			napi_typeof
		});
		/** @__sig ipp */
		function napi_get_version(env, result) {
			if (!env) return 1;
			var envObject = emnapiCtx.envStore.get(env);
			if (!result) return envObject.setLastError(1);
			new DataView(wasmMemory.buffer).setUint32(result, 10, true);
			return envObject.clearLastError();
		}
		var versionMod = /* @__PURE__ */ Object.freeze({
			__proto__: null,
			napi_get_version
		});
		emnapiAWST.init();
		emnapiExternalMemory.init();
		emnapiString.init();
		emnapiTSFN.init();
		PThread.init();
		napiModule.emnapi.syncMemory = $emnapiSyncMemory;
		napiModule.emnapi.getMemoryAddress = $emnapiGetMemoryAddress;
		function addImports(mod) {
			var keys = Object.keys(mod);
			for (var i$1 = 0; i$1 < keys.length; ++i$1) {
				var k = keys[i$1];
				if (k.indexOf("$") === 0) continue;
				if (k.indexOf("emnapi_") === 0) napiModule.imports.emnapi[k] = mod[k];
				else if (k.indexOf("_emnapi_") === 0 || k === "napi_set_last_error" || k === "napi_clear_last_error") napiModule.imports.env[k] = mod[k];
				else napiModule.imports.napi[k] = mod[k];
			}
		}
		addImports(asyncMod);
		addImports(memoryMod);
		addImports(asyncWorkMod);
		addImports(utilMod);
		addImports(convert2cMod);
		addImports(convert2napiMod);
		addImports(createMod);
		addImports(globalMod);
		addImports(wrapMod);
		addImports(envMod);
		addImports(emnapiMod);
		addImports(errorMod);
		addImports(functionMod);
		addImports(lifeMod);
		addImports(miscellaneousMod);
		addImports(nodeMod);
		addImports(promiseMod);
		addImports(propertyMod);
		addImports(scriptMod);
		addImports(valueOperationMod);
		addImports(versionMod);
		napiModule.imports.napi.napi_create_threadsafe_function = napi_create_threadsafe_function;
		napiModule.imports.napi.napi_get_threadsafe_function_context = napi_get_threadsafe_function_context;
		napiModule.imports.napi.napi_call_threadsafe_function = napi_call_threadsafe_function;
		napiModule.imports.napi.napi_acquire_threadsafe_function = napi_acquire_threadsafe_function;
		napiModule.imports.napi.napi_release_threadsafe_function = napi_release_threadsafe_function;
		napiModule.imports.napi.napi_unref_threadsafe_function = napi_unref_threadsafe_function;
		napiModule.imports.napi.napi_ref_threadsafe_function = napi_ref_threadsafe_function;
		return napiModule;
	}();
}
function loadNapiModuleImpl(loadFn, userNapiModule, wasmInput, options) {
	options = options !== null && options !== void 0 ? options : {};
	var getMemory$1 = options.getMemory;
	var getTable = options.getTable;
	var beforeInit = options.beforeInit;
	if (getMemory$1 != null && typeof getMemory$1 !== "function") throw new TypeError("options.getMemory is not a function");
	if (getTable != null && typeof getTable !== "function") throw new TypeError("options.getTable is not a function");
	if (beforeInit != null && typeof beforeInit !== "function") throw new TypeError("options.beforeInit is not a function");
	var napiModule;
	var isLoad = typeof userNapiModule === "object" && userNapiModule !== null;
	if (isLoad) {
		if (userNapiModule.loaded) throw new Error("napiModule has already loaded");
		napiModule = userNapiModule;
	} else napiModule = createNapiModule(options);
	var wasi = options.wasi;
	var wasiThreads;
	var importObject = {
		env: napiModule.imports.env,
		napi: napiModule.imports.napi,
		emnapi: napiModule.imports.emnapi
	};
	if (wasi) {
		wasiThreads = new WASIThreads(napiModule.childThread ? {
			wasi,
			childThread: true,
			postMessage: napiModule.postMessage
		} : {
			wasi,
			threadManager: napiModule.PThread,
			waitThreadStart: napiModule.waitThreadStart
		});
		Object.assign(importObject, typeof wasi.getImportObject === "function" ? wasi.getImportObject() : { wasi_snapshot_preview1: wasi.wasiImport });
		Object.assign(importObject, wasiThreads.getImportObject());
	}
	var overwriteImports = options.overwriteImports;
	if (typeof overwriteImports === "function") {
		var newImportObject = overwriteImports(importObject);
		if (typeof newImportObject === "object" && newImportObject !== null) importObject = newImportObject;
	}
	return loadFn(wasmInput, importObject, function(err, source) {
		if (err) throw err;
		var originalInstance = source.instance;
		var instance$1 = originalInstance;
		var originalExports = originalInstance.exports;
		var exportMemory = "memory" in originalExports;
		var importMemory = "memory" in importObject.env;
		var memory = getMemory$1 ? getMemory$1(originalExports) : exportMemory ? originalExports.memory : importMemory ? importObject.env.memory : void 0;
		if (!memory) throw new Error("memory is neither exported nor imported");
		var table = getTable ? getTable(originalExports) : originalExports.__indirect_function_table;
		if (wasi && !exportMemory) {
			var exports_1 = Object.create(null);
			Object.assign(exports_1, originalExports, { memory });
			instance$1 = { exports: exports_1 };
		}
		var module$1 = source.module;
		if (wasi) instance$1 = wasiThreads.initialize(instance$1, module$1, memory);
		else napiModule.PThread.setup(module$1, memory);
		var emnapiInit = function() {
			if (beforeInit) beforeInit({
				instance: originalInstance,
				module: module$1
			});
			napiModule.init({
				instance: instance$1,
				module: module$1,
				memory,
				table
			});
			var ret = {
				instance: originalInstance,
				module: module$1,
				usedInstance: instance$1
			};
			if (!isLoad) ret.napiModule = napiModule;
			return ret;
		};
		if (napiModule.PThread.shouldPreloadWorkers()) {
			var poolReady = napiModule.PThread.loadWasmModuleToAllWorkers();
			if (loadFn === loadCallback) return poolReady.then(emnapiInit);
			else throw new Error("Synchronous loading is not supported with worker pool (reuseWorker.size > 0)");
		}
		return emnapiInit();
	});
}
function loadCallback(wasmInput, importObject, callback) {
	return load$1(wasmInput, importObject).then(function(source) {
		return callback(null, source);
	}, function(err) {
		return callback(err);
	});
}
function loadSyncCallback(wasmInput, importObject, callback) {
	var source;
	try {
		source = loadSync$1(wasmInput, importObject);
	} catch (err) {
		return callback(err);
	}
	return callback(null, source);
}
/** @public */
function loadNapiModule(napiModule, wasmInput, options) {
	if (typeof napiModule !== "object" || napiModule === null) throw new TypeError("Invalid napiModule");
	return loadNapiModuleImpl(loadCallback, napiModule, wasmInput, options);
}
/** @public */
function loadNapiModuleSync(napiModule, wasmInput, options) {
	if (typeof napiModule !== "object" || napiModule === null) throw new TypeError("Invalid napiModule");
	return loadNapiModuleImpl(loadSyncCallback, napiModule, wasmInput, options);
}
/** @public */
function instantiateNapiModule$1(wasmInput, options) {
	return loadNapiModuleImpl(loadCallback, void 0, wasmInput, options);
}
/** @public */
function instantiateNapiModuleSync$1(wasmInput, options) {
	return loadNapiModuleImpl(loadSyncCallback, void 0, wasmInput, options);
}
var _WebAssembly$1, MessageHandler$1, version$2;
var init_emnapi_core_esm_bundler = __esm({ "../../node_modules/.pnpm/@emnapi+core@1.5.0/node_modules/@emnapi/core/dist/emnapi-core.esm-bundler.js": () => {
	init_wasi_threads_esm_bundler();
	init_wasi_threads_esm_bundler();
	init_tslib_es6();
	_WebAssembly$1 = typeof WebAssembly !== "undefined" ? WebAssembly : typeof WXWebAssembly !== "undefined" ? WXWebAssembly : void 0;
	MessageHandler$1 = /* @__PURE__ */ function(_super) {
		__extends(MessageHandler$2, _super);
		function MessageHandler$2(options) {
			var _this = this;
			if (typeof options.onLoad !== "function") throw new TypeError("options.onLoad is not a function");
			var userOnError = options.onError;
			_this = _super.call(this, __assign(__assign({}, options), { onError: function(err, type) {
				var _a;
				var emnapi_thread_crashed = (_a = _this.instance) === null || _a === void 0 ? void 0 : _a.exports.emnapi_thread_crashed;
				if (typeof emnapi_thread_crashed === "function") emnapi_thread_crashed();
				if (typeof userOnError === "function") userOnError(err, type);
				else throw err;
			} })) || this;
			_this.napiModule = void 0;
			return _this;
		}
		MessageHandler$2.prototype.instantiate = function(data) {
			var _this = this;
			var source = this.onLoad(data);
			if (typeof source.then === "function") return source.then(function(result) {
				_this.napiModule = result.napiModule;
				return result;
			});
			this.napiModule = source.napiModule;
			return source;
		};
		MessageHandler$2.prototype.handle = function(e$2) {
			var _this = this;
			var _a;
			_super.prototype.handle.call(this, e$2);
			if ((_a = e$2 === null || e$2 === void 0 ? void 0 : e$2.data) === null || _a === void 0 ? void 0 : _a.__emnapi__) {
				var type = e$2.data.__emnapi__.type;
				var payload_1 = e$2.data.__emnapi__.payload;
				try {
					if (type === "async-worker-init") this.handleAfterLoad(e$2, function() {
						_this.napiModule.initWorker(payload_1.arg);
					});
					else if (type === "async-work-execute") this.handleAfterLoad(e$2, function() {
						_this.napiModule.executeAsyncWork(payload_1.work);
					});
				} catch (err) {
					this.onError(err, type);
				}
			}
		};
		return MessageHandler$2;
	}(ThreadMessageHandler);
	version$2 = "1.5.0";
} });
var emnapi_esm_bundler_exports = /* @__PURE__ */ __export({
	ConstHandle: () => ConstHandle,
	Context: () => Context,
	Deferred: () => Deferred,
	EmnapiError: () => EmnapiError,
	Env: () => Env,
	External: () => External,
	Finalizer: () => Finalizer,
	Handle: () => Handle,
	HandleScope: () => HandleScope,
	HandleStore: () => HandleStore,
	NAPI_VERSION_EXPERIMENTAL: () => NAPI_VERSION_EXPERIMENTAL,
	NODE_API_DEFAULT_MODULE_API_VERSION: () => NODE_API_DEFAULT_MODULE_API_VERSION,
	NODE_API_SUPPORTED_VERSION_MAX: () => NODE_API_SUPPORTED_VERSION_MAX,
	NODE_API_SUPPORTED_VERSION_MIN: () => NODE_API_SUPPORTED_VERSION_MIN,
	NodeEnv: () => NodeEnv,
	NotSupportBufferError: () => NotSupportBufferError,
	NotSupportWeakRefError: () => NotSupportWeakRefError,
	Persistent: () => Persistent,
	RefTracker: () => RefTracker,
	Reference: () => Reference,
	ReferenceOwnership: () => ReferenceOwnership,
	ReferenceWithData: () => ReferenceWithData,
	ReferenceWithFinalizer: () => ReferenceWithFinalizer,
	ScopeStore: () => ScopeStore,
	Store: () => Store,
	TrackedFinalizer: () => TrackedFinalizer,
	TryCatch: () => TryCatch,
	createContext: () => createContext,
	getDefaultContext: () => getDefaultContext$1,
	getExternalValue: () => getExternalValue,
	isExternal: () => isExternal,
	isReferenceType: () => isReferenceType,
	version: () => version$1
});
/** @public */
function isExternal(object$1) {
	return externalValue.has(object$1);
}
/** @public */
function getExternalValue(external) {
	if (!isExternal(external)) throw new TypeError("not external");
	return externalValue.get(external);
}
function isReferenceType(v) {
	return typeof v === "object" && v !== null || typeof v === "function";
}
function throwNodeApiVersionError(moduleName, moduleApiVersion) {
	var errorMessage = "".concat(moduleName, " requires Node-API version ").concat(moduleApiVersion, ", but this version of Node.js only supports version ").concat(NODE_API_SUPPORTED_VERSION_MAX, " add-ons.");
	throw new Error(errorMessage);
}
function handleThrow(envObject, value) {
	if (envObject.terminatedOrTerminating()) return;
	throw value;
}
function newEnv(ctx, filename, moduleApiVersion, makeDynCall_vppp, makeDynCall_vp, abort, nodeBinding) {
	moduleApiVersion = typeof moduleApiVersion !== "number" ? NODE_API_DEFAULT_MODULE_API_VERSION : moduleApiVersion;
	if (moduleApiVersion < NODE_API_DEFAULT_MODULE_API_VERSION) moduleApiVersion = NODE_API_DEFAULT_MODULE_API_VERSION;
	else if (moduleApiVersion > NODE_API_SUPPORTED_VERSION_MAX && moduleApiVersion !== NAPI_VERSION_EXPERIMENTAL) throwNodeApiVersionError(filename, moduleApiVersion);
	var env = new NodeEnv(ctx, filename, moduleApiVersion, makeDynCall_vppp, makeDynCall_vp, abort, nodeBinding);
	ctx.envStore.add(env);
	ctx.addCleanupHook(env, function() {
		env.unref();
	}, 0);
	return env;
}
function canBeHeldWeakly(value) {
	return value.isObject() || value.isFunction() || value.isSymbol();
}
function createContext() {
	return new Context();
}
function getDefaultContext$1() {
	if (!defaultContext) defaultContext = createContext();
	return defaultContext;
}
var externalValue, External, supportNewFunction, _global, TryCatch, canSetFunctionName, supportReflect, supportFinalizer, supportWeakSymbol, supportBigInt, _require, _MessageChannel, _setImmediate, _Buffer, version$1, NODE_API_SUPPORTED_VERSION_MIN, NODE_API_SUPPORTED_VERSION_MAX, NAPI_VERSION_EXPERIMENTAL, NODE_API_DEFAULT_MODULE_API_VERSION, Handle, ConstHandle, HandleStore, HandleScope, ScopeStore, RefTracker, Finalizer, TrackedFinalizer, Env, NodeEnv, EmnapiError, NotSupportWeakRefError, NotSupportBufferError, StrongRef, Persistent, ReferenceOwnership, Reference, ReferenceWithData, ReferenceWithFinalizer, Deferred, Store, CleanupHookCallback, CleanupQueue, NodejsWaitingRequestCounter, Context, defaultContext;
var init_emnapi_esm_bundler = __esm({ "../../node_modules/.pnpm/@emnapi+runtime@1.5.0/node_modules/@emnapi/runtime/dist/emnapi.esm-bundler.js": () => {
	init_tslib_es6();
	externalValue = /* @__PURE__ */ new WeakMap();
	External = function() {
		function External$1(value) {
			Object.setPrototypeOf(this, null);
			externalValue.set(this, value);
		}
		External$1.prototype = null;
		return External$1;
	}();
	supportNewFunction = /* @__PURE__ */ function() {
		var f$1;
		try {
			f$1 = new Function();
		} catch (_) {
			return false;
		}
		return typeof f$1 === "function";
	}();
	_global = /* @__PURE__ */ function() {
		if (typeof globalThis !== "undefined") return globalThis;
		var g$1 = function() {
			return this;
		}();
		if (!g$1 && supportNewFunction) try {
			g$1 = new Function("return this")();
		} catch (_) {}
		if (!g$1) {
			if (typeof __webpack_public_path__ === "undefined") {
				if (typeof global !== "undefined") return global;
			}
			if (typeof window !== "undefined") return window;
			if (typeof self !== "undefined") return self;
		}
		return g$1;
	}();
	TryCatch = /* @__PURE__ */ function() {
		function TryCatch$1() {
			this._exception = void 0;
			this._caught = false;
		}
		TryCatch$1.prototype.isEmpty = function() {
			return !this._caught;
		};
		TryCatch$1.prototype.hasCaught = function() {
			return this._caught;
		};
		TryCatch$1.prototype.exception = function() {
			return this._exception;
		};
		TryCatch$1.prototype.setError = function(err) {
			this._caught = true;
			this._exception = err;
		};
		TryCatch$1.prototype.reset = function() {
			this._caught = false;
			this._exception = void 0;
		};
		TryCatch$1.prototype.extractException = function() {
			var e$2 = this._exception;
			this.reset();
			return e$2;
		};
		return TryCatch$1;
	}();
	canSetFunctionName = /* @__PURE__ */ function() {
		var _a;
		try {
			return Boolean((_a = Object.getOwnPropertyDescriptor(Function.prototype, "name")) === null || _a === void 0 ? void 0 : _a.configurable);
		} catch (_) {
			return false;
		}
	}();
	supportReflect = typeof Reflect === "object";
	supportFinalizer = typeof FinalizationRegistry !== "undefined" && typeof WeakRef !== "undefined";
	supportWeakSymbol = /* @__PURE__ */ function() {
		try {
			var sym = Symbol();
			new WeakRef(sym);
			(/* @__PURE__ */ new WeakMap()).set(sym, void 0);
		} catch (_) {
			return false;
		}
		return true;
	}();
	supportBigInt = typeof BigInt !== "undefined";
	_require = /* @__PURE__ */ function() {
		var nativeRequire;
		if (typeof __webpack_public_path__ !== "undefined") nativeRequire = function() {
			return typeof __non_webpack_require__ !== "undefined" ? __non_webpack_require__ : void 0;
		}();
		else nativeRequire = function() {
			return typeof __webpack_public_path__ !== "undefined" ? typeof __non_webpack_require__ !== "undefined" ? __non_webpack_require__ : void 0 : typeof __require !== "undefined" ? __require : void 0;
		}();
		return nativeRequire;
	}();
	_MessageChannel = typeof MessageChannel === "function" ? MessageChannel : /* @__PURE__ */ function() {
		try {
			return _require("worker_threads").MessageChannel;
		} catch (_) {}
	}();
	_setImmediate = typeof setImmediate === "function" ? setImmediate : function(callback) {
		if (typeof callback !== "function") throw new TypeError("The \"callback\" argument must be of type function");
		if (_MessageChannel) {
			var channel_1 = new _MessageChannel();
			channel_1.port1.onmessage = function() {
				channel_1.port1.onmessage = null;
				channel_1 = void 0;
				callback();
			};
			channel_1.port2.postMessage(null);
		} else setTimeout(callback, 0);
	};
	_Buffer = typeof Buffer === "function" ? Buffer : /* @__PURE__ */ function() {
		try {
			return _require("buffer").Buffer;
		} catch (_) {}
	}();
	version$1 = "1.5.0";
	NODE_API_SUPPORTED_VERSION_MIN = 1;
	NODE_API_SUPPORTED_VERSION_MAX = 10;
	NAPI_VERSION_EXPERIMENTAL = 2147483647;
	NODE_API_DEFAULT_MODULE_API_VERSION = 8;
	Handle = /* @__PURE__ */ function() {
		function Handle$1(id$1, value) {
			this.id = id$1;
			this.value = value;
		}
		Handle$1.prototype.data = function() {
			return getExternalValue(this.value);
		};
		Handle$1.prototype.isNumber = function() {
			return typeof this.value === "number";
		};
		Handle$1.prototype.isBigInt = function() {
			return typeof this.value === "bigint";
		};
		Handle$1.prototype.isString = function() {
			return typeof this.value === "string";
		};
		Handle$1.prototype.isFunction = function() {
			return typeof this.value === "function";
		};
		Handle$1.prototype.isExternal = function() {
			return isExternal(this.value);
		};
		Handle$1.prototype.isObject = function() {
			return typeof this.value === "object" && this.value !== null;
		};
		Handle$1.prototype.isArray = function() {
			return Array.isArray(this.value);
		};
		Handle$1.prototype.isArrayBuffer = function() {
			return this.value instanceof ArrayBuffer;
		};
		Handle$1.prototype.isTypedArray = function() {
			return ArrayBuffer.isView(this.value) && !(this.value instanceof DataView);
		};
		Handle$1.prototype.isBuffer = function(BufferConstructor) {
			if (ArrayBuffer.isView(this.value)) return true;
			BufferConstructor !== null && BufferConstructor !== void 0 || (BufferConstructor = _Buffer);
			return typeof BufferConstructor === "function" && BufferConstructor.isBuffer(this.value);
		};
		Handle$1.prototype.isDataView = function() {
			return this.value instanceof DataView;
		};
		Handle$1.prototype.isDate = function() {
			return this.value instanceof Date;
		};
		Handle$1.prototype.isPromise = function() {
			return this.value instanceof Promise;
		};
		Handle$1.prototype.isBoolean = function() {
			return typeof this.value === "boolean";
		};
		Handle$1.prototype.isUndefined = function() {
			return this.value === void 0;
		};
		Handle$1.prototype.isSymbol = function() {
			return typeof this.value === "symbol";
		};
		Handle$1.prototype.isNull = function() {
			return this.value === null;
		};
		Handle$1.prototype.dispose = function() {
			this.value = void 0;
		};
		return Handle$1;
	}();
	ConstHandle = /* @__PURE__ */ function(_super) {
		__extends(ConstHandle$1, _super);
		function ConstHandle$1(id$1, value) {
			return _super.call(this, id$1, value) || this;
		}
		ConstHandle$1.prototype.dispose = function() {};
		return ConstHandle$1;
	}(Handle);
	HandleStore = /* @__PURE__ */ function() {
		function HandleStore$1() {
			this._values = [
				void 0,
				HandleStore$1.UNDEFINED,
				HandleStore$1.NULL,
				HandleStore$1.FALSE,
				HandleStore$1.TRUE,
				HandleStore$1.GLOBAL
			];
			this._next = HandleStore$1.MIN_ID;
		}
		HandleStore$1.prototype.push = function(value) {
			var h$1;
			var next = this._next;
			var values = this._values;
			if (next < values.length) {
				h$1 = values[next];
				h$1.value = value;
			} else {
				h$1 = new Handle(next, value);
				values[next] = h$1;
			}
			this._next++;
			return h$1;
		};
		HandleStore$1.prototype.erase = function(start, end) {
			this._next = start;
			var values = this._values;
			for (var i$1 = start; i$1 < end; ++i$1) values[i$1].dispose();
		};
		HandleStore$1.prototype.get = function(id$1) {
			return this._values[id$1];
		};
		HandleStore$1.prototype.swap = function(a$1, b$1) {
			var values = this._values;
			var h$1 = values[a$1];
			values[a$1] = values[b$1];
			values[a$1].id = Number(a$1);
			values[b$1] = h$1;
			h$1.id = Number(b$1);
		};
		HandleStore$1.prototype.dispose = function() {
			this._values.length = HandleStore$1.MIN_ID;
			this._next = HandleStore$1.MIN_ID;
		};
		HandleStore$1.UNDEFINED = new ConstHandle(1, void 0);
		HandleStore$1.NULL = new ConstHandle(2, null);
		HandleStore$1.FALSE = new ConstHandle(3, false);
		HandleStore$1.TRUE = new ConstHandle(4, true);
		HandleStore$1.GLOBAL = new ConstHandle(5, _global);
		HandleStore$1.MIN_ID = 6;
		return HandleStore$1;
	}();
	HandleScope = /* @__PURE__ */ function() {
		function HandleScope$1(handleStore, id$1, parentScope, start, end) {
			if (end === void 0) end = start;
			this.handleStore = handleStore;
			this.id = id$1;
			this.parent = parentScope;
			this.child = null;
			if (parentScope !== null) parentScope.child = this;
			this.start = start;
			this.end = end;
			this._escapeCalled = false;
			this.callbackInfo = {
				thiz: void 0,
				data: 0,
				args: void 0,
				fn: void 0
			};
		}
		HandleScope$1.prototype.add = function(value) {
			var h$1 = this.handleStore.push(value);
			this.end++;
			return h$1;
		};
		HandleScope$1.prototype.addExternal = function(data) {
			return this.add(new External(data));
		};
		HandleScope$1.prototype.dispose = function() {
			if (this._escapeCalled) this._escapeCalled = false;
			if (this.start === this.end) return;
			this.handleStore.erase(this.start, this.end);
		};
		HandleScope$1.prototype.escape = function(handle) {
			if (this._escapeCalled) return null;
			this._escapeCalled = true;
			if (handle < this.start || handle >= this.end) return null;
			this.handleStore.swap(handle, this.start);
			var h$1 = this.handleStore.get(this.start);
			this.start++;
			this.parent.end++;
			return h$1;
		};
		HandleScope$1.prototype.escapeCalled = function() {
			return this._escapeCalled;
		};
		return HandleScope$1;
	}();
	ScopeStore = /* @__PURE__ */ function() {
		function ScopeStore$1() {
			this._rootScope = new HandleScope(null, 0, null, 1, HandleStore.MIN_ID);
			this.currentScope = this._rootScope;
			this._values = [void 0];
		}
		ScopeStore$1.prototype.get = function(id$1) {
			return this._values[id$1];
		};
		ScopeStore$1.prototype.openScope = function(handleStore) {
			var currentScope = this.currentScope;
			var scope = currentScope.child;
			if (scope !== null) scope.start = scope.end = currentScope.end;
			else {
				var id$1 = currentScope.id + 1;
				scope = new HandleScope(handleStore, id$1, currentScope, currentScope.end);
				this._values[id$1] = scope;
			}
			this.currentScope = scope;
			return scope;
		};
		ScopeStore$1.prototype.closeScope = function() {
			var scope = this.currentScope;
			this.currentScope = scope.parent;
			scope.dispose();
		};
		ScopeStore$1.prototype.dispose = function() {
			this.currentScope = this._rootScope;
			this._values.length = 1;
		};
		return ScopeStore$1;
	}();
	RefTracker = /* @__PURE__ */ function() {
		function RefTracker$1() {
			this._next = null;
			this._prev = null;
		}
		/** @virtual */
		RefTracker$1.prototype.dispose = function() {};
		/** @virtual */
		RefTracker$1.prototype.finalize = function() {};
		RefTracker$1.prototype.link = function(list) {
			this._prev = list;
			this._next = list._next;
			if (this._next !== null) this._next._prev = this;
			list._next = this;
		};
		RefTracker$1.prototype.unlink = function() {
			if (this._prev !== null) this._prev._next = this._next;
			if (this._next !== null) this._next._prev = this._prev;
			this._prev = null;
			this._next = null;
		};
		RefTracker$1.finalizeAll = function(list) {
			while (list._next !== null) list._next.finalize();
		};
		return RefTracker$1;
	}();
	Finalizer = /* @__PURE__ */ function() {
		function Finalizer$1(envObject, _finalizeCallback, _finalizeData, _finalizeHint) {
			if (_finalizeCallback === void 0) _finalizeCallback = 0;
			if (_finalizeData === void 0) _finalizeData = 0;
			if (_finalizeHint === void 0) _finalizeHint = 0;
			this.envObject = envObject;
			this._finalizeCallback = _finalizeCallback;
			this._finalizeData = _finalizeData;
			this._finalizeHint = _finalizeHint;
			this._makeDynCall_vppp = envObject.makeDynCall_vppp;
		}
		Finalizer$1.prototype.callback = function() {
			return this._finalizeCallback;
		};
		Finalizer$1.prototype.data = function() {
			return this._finalizeData;
		};
		Finalizer$1.prototype.hint = function() {
			return this._finalizeHint;
		};
		Finalizer$1.prototype.resetEnv = function() {
			this.envObject = void 0;
		};
		Finalizer$1.prototype.resetFinalizer = function() {
			this._finalizeCallback = 0;
			this._finalizeData = 0;
			this._finalizeHint = 0;
		};
		Finalizer$1.prototype.callFinalizer = function() {
			var finalize_callback = this._finalizeCallback;
			var finalize_data = this._finalizeData;
			var finalize_hint = this._finalizeHint;
			this.resetFinalizer();
			if (!finalize_callback) return;
			var fini = Number(finalize_callback);
			if (!this.envObject) this._makeDynCall_vppp(fini)(0, finalize_data, finalize_hint);
			else this.envObject.callFinalizer(fini, finalize_data, finalize_hint);
		};
		Finalizer$1.prototype.dispose = function() {
			this.envObject = void 0;
			this._makeDynCall_vppp = void 0;
		};
		return Finalizer$1;
	}();
	TrackedFinalizer = /* @__PURE__ */ function(_super) {
		__extends(TrackedFinalizer$1, _super);
		function TrackedFinalizer$1(envObject, finalize_callback, finalize_data, finalize_hint) {
			var _this = _super.call(this) || this;
			_this._finalizer = new Finalizer(envObject, finalize_callback, finalize_data, finalize_hint);
			return _this;
		}
		TrackedFinalizer$1.create = function(envObject, finalize_callback, finalize_data, finalize_hint) {
			var finalizer = new TrackedFinalizer$1(envObject, finalize_callback, finalize_data, finalize_hint);
			finalizer.link(envObject.finalizing_reflist);
			return finalizer;
		};
		TrackedFinalizer$1.prototype.data = function() {
			return this._finalizer.data();
		};
		TrackedFinalizer$1.prototype.dispose = function() {
			if (!this._finalizer) return;
			this.unlink();
			this._finalizer.envObject.dequeueFinalizer(this);
			this._finalizer.dispose();
			this._finalizer = void 0;
			_super.prototype.dispose.call(this);
		};
		TrackedFinalizer$1.prototype.finalize = function() {
			this.unlink();
			var error$1;
			var caught = false;
			try {
				this._finalizer.callFinalizer();
			} catch (err) {
				caught = true;
				error$1 = err;
			}
			this.dispose();
			if (caught) throw error$1;
		};
		return TrackedFinalizer$1;
	}(RefTracker);
	Env = /* @__PURE__ */ function() {
		function Env$1(ctx, moduleApiVersion, makeDynCall_vppp, makeDynCall_vp, abort) {
			this.ctx = ctx;
			this.moduleApiVersion = moduleApiVersion;
			this.makeDynCall_vppp = makeDynCall_vppp;
			this.makeDynCall_vp = makeDynCall_vp;
			this.abort = abort;
			this.openHandleScopes = 0;
			this.instanceData = null;
			this.tryCatch = new TryCatch();
			this.refs = 1;
			this.reflist = new RefTracker();
			this.finalizing_reflist = new RefTracker();
			this.pendingFinalizers = [];
			this.lastError = {
				errorCode: 0,
				engineErrorCode: 0,
				engineReserved: 0
			};
			this.inGcFinalizer = false;
			this._bindingMap = /* @__PURE__ */ new WeakMap();
			this.id = 0;
		}
		/** @virtual */
		Env$1.prototype.canCallIntoJs = function() {
			return true;
		};
		Env$1.prototype.terminatedOrTerminating = function() {
			return !this.canCallIntoJs();
		};
		Env$1.prototype.ref = function() {
			this.refs++;
		};
		Env$1.prototype.unref = function() {
			this.refs--;
			if (this.refs === 0) this.dispose();
		};
		Env$1.prototype.ensureHandle = function(value) {
			return this.ctx.ensureHandle(value);
		};
		Env$1.prototype.ensureHandleId = function(value) {
			return this.ensureHandle(value).id;
		};
		Env$1.prototype.clearLastError = function() {
			var lastError = this.lastError;
			if (lastError.errorCode !== 0) lastError.errorCode = 0;
			if (lastError.engineErrorCode !== 0) lastError.engineErrorCode = 0;
			if (lastError.engineReserved !== 0) lastError.engineReserved = 0;
			return 0;
		};
		Env$1.prototype.setLastError = function(error_code, engine_error_code, engine_reserved) {
			if (engine_error_code === void 0) engine_error_code = 0;
			if (engine_reserved === void 0) engine_reserved = 0;
			var lastError = this.lastError;
			if (lastError.errorCode !== error_code) lastError.errorCode = error_code;
			if (lastError.engineErrorCode !== engine_error_code) lastError.engineErrorCode = engine_error_code;
			if (lastError.engineReserved !== engine_reserved) lastError.engineReserved = engine_reserved;
			return error_code;
		};
		Env$1.prototype.getReturnStatus = function() {
			return !this.tryCatch.hasCaught() ? 0 : this.setLastError(10);
		};
		Env$1.prototype.callIntoModule = function(fn, handleException) {
			if (handleException === void 0) handleException = handleThrow;
			var openHandleScopesBefore = this.openHandleScopes;
			this.clearLastError();
			var r$1 = fn(this);
			if (openHandleScopesBefore !== this.openHandleScopes) this.abort("open_handle_scopes != open_handle_scopes_before");
			if (this.tryCatch.hasCaught()) {
				var err = this.tryCatch.extractException();
				handleException(this, err);
			}
			return r$1;
		};
		Env$1.prototype.invokeFinalizerFromGC = function(finalizer) {
			if (this.moduleApiVersion !== NAPI_VERSION_EXPERIMENTAL) this.enqueueFinalizer(finalizer);
			else {
				var saved = this.inGcFinalizer;
				this.inGcFinalizer = true;
				try {
					finalizer.finalize();
				} finally {
					this.inGcFinalizer = saved;
				}
			}
		};
		Env$1.prototype.checkGCAccess = function() {
			if (this.moduleApiVersion === NAPI_VERSION_EXPERIMENTAL && this.inGcFinalizer) this.abort("Finalizer is calling a function that may affect GC state.\nThe finalizers are run directly from GC and must not affect GC state.\nUse `node_api_post_finalizer` from inside of the finalizer to work around this issue.\nIt schedules the call as a new task in the event loop.");
		};
		/** @virtual */
		Env$1.prototype.enqueueFinalizer = function(finalizer) {
			if (this.pendingFinalizers.indexOf(finalizer) === -1) this.pendingFinalizers.push(finalizer);
		};
		/** @virtual */
		Env$1.prototype.dequeueFinalizer = function(finalizer) {
			var index = this.pendingFinalizers.indexOf(finalizer);
			if (index !== -1) this.pendingFinalizers.splice(index, 1);
		};
		/** @virtual */
		Env$1.prototype.deleteMe = function() {
			RefTracker.finalizeAll(this.finalizing_reflist);
			RefTracker.finalizeAll(this.reflist);
			this.tryCatch.extractException();
			this.ctx.envStore.remove(this.id);
		};
		Env$1.prototype.dispose = function() {
			if (this.id === 0) return;
			this.deleteMe();
			this.finalizing_reflist.dispose();
			this.reflist.dispose();
			this.id = 0;
		};
		Env$1.prototype.initObjectBinding = function(value) {
			var binding = {
				wrapped: 0,
				tag: null
			};
			this._bindingMap.set(value, binding);
			return binding;
		};
		Env$1.prototype.getObjectBinding = function(value) {
			if (this._bindingMap.has(value)) return this._bindingMap.get(value);
			return this.initObjectBinding(value);
		};
		Env$1.prototype.setInstanceData = function(data, finalize_cb, finalize_hint) {
			if (this.instanceData) this.instanceData.dispose();
			this.instanceData = TrackedFinalizer.create(this, finalize_cb, data, finalize_hint);
		};
		Env$1.prototype.getInstanceData = function() {
			return this.instanceData ? this.instanceData.data() : 0;
		};
		return Env$1;
	}();
	NodeEnv = /* @__PURE__ */ function(_super) {
		__extends(NodeEnv$1, _super);
		function NodeEnv$1(ctx, filename, moduleApiVersion, makeDynCall_vppp, makeDynCall_vp, abort, nodeBinding) {
			var _this = _super.call(this, ctx, moduleApiVersion, makeDynCall_vppp, makeDynCall_vp, abort) || this;
			_this.filename = filename;
			_this.nodeBinding = nodeBinding;
			_this.destructing = false;
			_this.finalizationScheduled = false;
			return _this;
		}
		NodeEnv$1.prototype.deleteMe = function() {
			this.destructing = true;
			this.drainFinalizerQueue();
			_super.prototype.deleteMe.call(this);
		};
		NodeEnv$1.prototype.canCallIntoJs = function() {
			return _super.prototype.canCallIntoJs.call(this) && this.ctx.canCallIntoJs();
		};
		NodeEnv$1.prototype.triggerFatalException = function(err) {
			if (this.nodeBinding) this.nodeBinding.napi.fatalException(err);
			else if (typeof process === "object" && process !== null && typeof process._fatalException === "function") {
				if (!process._fatalException(err)) {
					console.error(err);
					process.exit(1);
				}
			} else throw err;
		};
		NodeEnv$1.prototype.callbackIntoModule = function(enforceUncaughtExceptionPolicy, fn) {
			return this.callIntoModule(fn, function(envObject, err) {
				if (envObject.terminatedOrTerminating()) return;
				var hasProcess = typeof process === "object" && process !== null;
				var hasForceFlag = hasProcess ? Boolean(process.execArgv && process.execArgv.indexOf("--force-node-api-uncaught-exceptions-policy") !== -1) : false;
				if (envObject.moduleApiVersion < 10 && !hasForceFlag && !enforceUncaughtExceptionPolicy) {
					(hasProcess && typeof process.emitWarning === "function" ? process.emitWarning : function(warning, type, code$1) {
						if (warning instanceof Error) console.warn(warning.toString());
						else {
							var prefix = code$1 ? "[".concat(code$1, "] ") : "";
							console.warn("".concat(prefix).concat(type || "Warning", ": ").concat(warning));
						}
					})("Uncaught N-API callback exception detected, please run node with option --force-node-api-uncaught-exceptions-policy=true to handle those exceptions properly.", "DeprecationWarning", "DEP0168");
					return;
				}
				envObject.triggerFatalException(err);
			});
		};
		NodeEnv$1.prototype.callFinalizer = function(cb, data, hint) {
			this.callFinalizerInternal(1, cb, data, hint);
		};
		NodeEnv$1.prototype.callFinalizerInternal = function(forceUncaught, cb, data, hint) {
			var f$1 = this.makeDynCall_vppp(cb);
			var env = this.id;
			var scope = this.ctx.openScope(this);
			try {
				this.callbackIntoModule(Boolean(forceUncaught), function() {
					f$1(env, data, hint);
				});
			} finally {
				this.ctx.closeScope(this, scope);
			}
		};
		NodeEnv$1.prototype.enqueueFinalizer = function(finalizer) {
			var _this = this;
			_super.prototype.enqueueFinalizer.call(this, finalizer);
			if (!this.finalizationScheduled && !this.destructing) {
				this.finalizationScheduled = true;
				this.ref();
				_setImmediate(function() {
					_this.finalizationScheduled = false;
					_this.unref();
					_this.drainFinalizerQueue();
				});
			}
		};
		NodeEnv$1.prototype.drainFinalizerQueue = function() {
			while (this.pendingFinalizers.length > 0) this.pendingFinalizers.shift().finalize();
		};
		return NodeEnv$1;
	}(Env);
	EmnapiError = /* @__PURE__ */ function(_super) {
		__extends(EmnapiError$1, _super);
		function EmnapiError$1(message) {
			var _newTarget = this.constructor;
			var _this = _super.call(this, message) || this;
			var ErrorConstructor = _newTarget;
			var proto = ErrorConstructor.prototype;
			if (!(_this instanceof EmnapiError$1)) {
				var setPrototypeOf = Object.setPrototypeOf;
				if (typeof setPrototypeOf === "function") setPrototypeOf.call(Object, _this, proto);
				else _this.__proto__ = proto;
				if (typeof Error.captureStackTrace === "function") Error.captureStackTrace(_this, ErrorConstructor);
			}
			return _this;
		}
		return EmnapiError$1;
	}(Error);
	Object.defineProperty(EmnapiError.prototype, "name", {
		configurable: true,
		writable: true,
		value: "EmnapiError"
	});
	NotSupportWeakRefError = /* @__PURE__ */ function(_super) {
		__extends(NotSupportWeakRefError$1, _super);
		function NotSupportWeakRefError$1(api, message) {
			return _super.call(this, "".concat(api, ": The current runtime does not support \"FinalizationRegistry\" and \"WeakRef\".").concat(message ? " ".concat(message) : "")) || this;
		}
		return NotSupportWeakRefError$1;
	}(EmnapiError);
	Object.defineProperty(NotSupportWeakRefError.prototype, "name", {
		configurable: true,
		writable: true,
		value: "NotSupportWeakRefError"
	});
	NotSupportBufferError = /* @__PURE__ */ function(_super) {
		__extends(NotSupportBufferError$1, _super);
		function NotSupportBufferError$1(api, message) {
			return _super.call(this, "".concat(api, ": The current runtime does not support \"Buffer\". Consider using buffer polyfill to make sure `globalThis.Buffer` is defined.").concat(message ? " ".concat(message) : "")) || this;
		}
		return NotSupportBufferError$1;
	}(EmnapiError);
	Object.defineProperty(NotSupportBufferError.prototype, "name", {
		configurable: true,
		writable: true,
		value: "NotSupportBufferError"
	});
	StrongRef = /* @__PURE__ */ function() {
		function StrongRef$1(value) {
			this._value = value;
		}
		StrongRef$1.prototype.deref = function() {
			return this._value;
		};
		StrongRef$1.prototype.dispose = function() {
			this._value = void 0;
		};
		return StrongRef$1;
	}();
	Persistent = /* @__PURE__ */ function() {
		function Persistent$1(value) {
			this._ref = new StrongRef(value);
		}
		Persistent$1.prototype.setWeak = function(param, callback) {
			if (!supportFinalizer || this._ref === void 0 || this._ref instanceof WeakRef) return;
			var value = this._ref.deref();
			try {
				Persistent$1._registry.register(value, this, this);
				var weakRef = new WeakRef(value);
				this._ref.dispose();
				this._ref = weakRef;
				this._param = param;
				this._callback = callback;
			} catch (err) {
				if (typeof value === "symbol");
				else throw err;
			}
		};
		Persistent$1.prototype.clearWeak = function() {
			if (!supportFinalizer || this._ref === void 0) return;
			if (this._ref instanceof WeakRef) {
				try {
					Persistent$1._registry.unregister(this);
				} catch (_) {}
				this._param = void 0;
				this._callback = void 0;
				var value = this._ref.deref();
				if (value === void 0) this._ref = value;
				else this._ref = new StrongRef(value);
			}
		};
		Persistent$1.prototype.reset = function() {
			if (supportFinalizer) try {
				Persistent$1._registry.unregister(this);
			} catch (_) {}
			this._param = void 0;
			this._callback = void 0;
			if (this._ref instanceof StrongRef) this._ref.dispose();
			this._ref = void 0;
		};
		Persistent$1.prototype.isEmpty = function() {
			return this._ref === void 0;
		};
		Persistent$1.prototype.deref = function() {
			if (this._ref === void 0) return void 0;
			return this._ref.deref();
		};
		Persistent$1._registry = supportFinalizer ? new FinalizationRegistry(function(value) {
			value._ref = void 0;
			var callback = value._callback;
			var param = value._param;
			value._callback = void 0;
			value._param = void 0;
			if (typeof callback === "function") callback(param);
		}) : void 0;
		return Persistent$1;
	}();
	(function(ReferenceOwnership$1) {
		ReferenceOwnership$1[ReferenceOwnership$1["kRuntime"] = 0] = "kRuntime";
		ReferenceOwnership$1[ReferenceOwnership$1["kUserland"] = 1] = "kUserland";
	})(ReferenceOwnership || (ReferenceOwnership = {}));
	Reference = /* @__PURE__ */ function(_super) {
		__extends(Reference$1, _super);
		function Reference$1(envObject, handle_id, initialRefcount, ownership) {
			var _this = _super.call(this) || this;
			_this.envObject = envObject;
			_this._refcount = initialRefcount;
			_this._ownership = ownership;
			var handle = envObject.ctx.handleStore.get(handle_id);
			_this.canBeWeak = canBeHeldWeakly(handle);
			_this.persistent = new Persistent(handle.value);
			_this.id = 0;
			if (initialRefcount === 0) _this._setWeak();
			return _this;
		}
		Reference$1.weakCallback = function(ref) {
			ref.persistent.reset();
			ref.invokeFinalizerFromGC();
		};
		Reference$1.create = function(envObject, handle_id, initialRefcount, ownership, _unused1, _unused2, _unused3) {
			var ref = new Reference$1(envObject, handle_id, initialRefcount, ownership);
			envObject.ctx.refStore.add(ref);
			ref.link(envObject.reflist);
			return ref;
		};
		Reference$1.prototype.ref = function() {
			if (this.persistent.isEmpty()) return 0;
			if (++this._refcount === 1 && this.canBeWeak) this.persistent.clearWeak();
			return this._refcount;
		};
		Reference$1.prototype.unref = function() {
			if (this.persistent.isEmpty() || this._refcount === 0) return 0;
			if (--this._refcount === 0) this._setWeak();
			return this._refcount;
		};
		Reference$1.prototype.get = function(envObject) {
			if (envObject === void 0) envObject = this.envObject;
			if (this.persistent.isEmpty()) return 0;
			var obj = this.persistent.deref();
			return envObject.ensureHandle(obj).id;
		};
		/** @virtual */
		Reference$1.prototype.resetFinalizer = function() {};
		/** @virtual */
		Reference$1.prototype.data = function() {
			return 0;
		};
		Reference$1.prototype.refcount = function() {
			return this._refcount;
		};
		Reference$1.prototype.ownership = function() {
			return this._ownership;
		};
		/** @virtual */
		Reference$1.prototype.callUserFinalizer = function() {};
		/** @virtual */
		Reference$1.prototype.invokeFinalizerFromGC = function() {
			this.finalize();
		};
		Reference$1.prototype._setWeak = function() {
			if (this.canBeWeak) this.persistent.setWeak(this, Reference$1.weakCallback);
			else this.persistent.reset();
		};
		Reference$1.prototype.finalize = function() {
			this.persistent.reset();
			var deleteMe = this._ownership === ReferenceOwnership.kRuntime;
			this.unlink();
			this.callUserFinalizer();
			if (deleteMe) this.dispose();
		};
		Reference$1.prototype.dispose = function() {
			if (this.id === 0) return;
			this.unlink();
			this.persistent.reset();
			this.envObject.ctx.refStore.remove(this.id);
			_super.prototype.dispose.call(this);
			this.envObject = void 0;
			this.id = 0;
		};
		return Reference$1;
	}(RefTracker);
	ReferenceWithData = /* @__PURE__ */ function(_super) {
		__extends(ReferenceWithData$1, _super);
		function ReferenceWithData$1(envObject, value, initialRefcount, ownership, _data) {
			var _this = _super.call(this, envObject, value, initialRefcount, ownership) || this;
			_this._data = _data;
			return _this;
		}
		ReferenceWithData$1.create = function(envObject, value, initialRefcount, ownership, data) {
			var reference = new ReferenceWithData$1(envObject, value, initialRefcount, ownership, data);
			envObject.ctx.refStore.add(reference);
			reference.link(envObject.reflist);
			return reference;
		};
		ReferenceWithData$1.prototype.data = function() {
			return this._data;
		};
		return ReferenceWithData$1;
	}(Reference);
	ReferenceWithFinalizer = /* @__PURE__ */ function(_super) {
		__extends(ReferenceWithFinalizer$1, _super);
		function ReferenceWithFinalizer$1(envObject, value, initialRefcount, ownership, finalize_callback, finalize_data, finalize_hint) {
			var _this = _super.call(this, envObject, value, initialRefcount, ownership) || this;
			_this._finalizer = new Finalizer(envObject, finalize_callback, finalize_data, finalize_hint);
			return _this;
		}
		ReferenceWithFinalizer$1.create = function(envObject, value, initialRefcount, ownership, finalize_callback, finalize_data, finalize_hint) {
			var reference = new ReferenceWithFinalizer$1(envObject, value, initialRefcount, ownership, finalize_callback, finalize_data, finalize_hint);
			envObject.ctx.refStore.add(reference);
			reference.link(envObject.finalizing_reflist);
			return reference;
		};
		ReferenceWithFinalizer$1.prototype.resetFinalizer = function() {
			this._finalizer.resetFinalizer();
		};
		ReferenceWithFinalizer$1.prototype.data = function() {
			return this._finalizer.data();
		};
		ReferenceWithFinalizer$1.prototype.callUserFinalizer = function() {
			this._finalizer.callFinalizer();
		};
		ReferenceWithFinalizer$1.prototype.invokeFinalizerFromGC = function() {
			this._finalizer.envObject.invokeFinalizerFromGC(this);
		};
		ReferenceWithFinalizer$1.prototype.dispose = function() {
			if (!this._finalizer) return;
			this._finalizer.envObject.dequeueFinalizer(this);
			this._finalizer.dispose();
			_super.prototype.dispose.call(this);
			this._finalizer = void 0;
		};
		return ReferenceWithFinalizer$1;
	}(Reference);
	Deferred = /* @__PURE__ */ function() {
		function Deferred$1(ctx, value) {
			this.id = 0;
			this.ctx = ctx;
			this.value = value;
		}
		Deferred$1.create = function(ctx, value) {
			var deferred = new Deferred$1(ctx, value);
			ctx.deferredStore.add(deferred);
			return deferred;
		};
		Deferred$1.prototype.resolve = function(value) {
			this.value.resolve(value);
			this.dispose();
		};
		Deferred$1.prototype.reject = function(reason) {
			this.value.reject(reason);
			this.dispose();
		};
		Deferred$1.prototype.dispose = function() {
			this.ctx.deferredStore.remove(this.id);
			this.id = 0;
			this.value = null;
			this.ctx = null;
		};
		return Deferred$1;
	}();
	Store = /* @__PURE__ */ function() {
		function Store$1() {
			this._values = [void 0];
			this._values.length = 4;
			this._size = 1;
			this._freeList = [];
		}
		Store$1.prototype.add = function(value) {
			var id$1;
			if (this._freeList.length) id$1 = this._freeList.shift();
			else {
				id$1 = this._size;
				this._size++;
				var capacity = this._values.length;
				if (id$1 >= capacity) this._values.length = capacity + (capacity >> 1) + 16;
			}
			value.id = id$1;
			this._values[id$1] = value;
		};
		Store$1.prototype.get = function(id$1) {
			return this._values[id$1];
		};
		Store$1.prototype.has = function(id$1) {
			return this._values[id$1] !== void 0;
		};
		Store$1.prototype.remove = function(id$1) {
			var value = this._values[id$1];
			if (value) {
				value.id = 0;
				this._values[id$1] = void 0;
				this._freeList.push(Number(id$1));
			}
		};
		Store$1.prototype.dispose = function() {
			for (var i$1 = 1; i$1 < this._size; ++i$1) {
				var value = this._values[i$1];
				value === null || value === void 0 || value.dispose();
			}
			this._values = [void 0];
			this._size = 1;
			this._freeList = [];
		};
		return Store$1;
	}();
	CleanupHookCallback = /* @__PURE__ */ function() {
		function CleanupHookCallback$1(envObject, fn, arg, order) {
			this.envObject = envObject;
			this.fn = fn;
			this.arg = arg;
			this.order = order;
		}
		return CleanupHookCallback$1;
	}();
	CleanupQueue = /* @__PURE__ */ function() {
		function CleanupQueue$1() {
			this._cleanupHooks = [];
			this._cleanupHookCounter = 0;
		}
		CleanupQueue$1.prototype.empty = function() {
			return this._cleanupHooks.length === 0;
		};
		CleanupQueue$1.prototype.add = function(envObject, fn, arg) {
			if (this._cleanupHooks.filter(function(hook) {
				return hook.envObject === envObject && hook.fn === fn && hook.arg === arg;
			}).length > 0) throw new Error("Can not add same fn and arg twice");
			this._cleanupHooks.push(new CleanupHookCallback(envObject, fn, arg, this._cleanupHookCounter++));
		};
		CleanupQueue$1.prototype.remove = function(envObject, fn, arg) {
			for (var i$1 = 0; i$1 < this._cleanupHooks.length; ++i$1) {
				var hook = this._cleanupHooks[i$1];
				if (hook.envObject === envObject && hook.fn === fn && hook.arg === arg) {
					this._cleanupHooks.splice(i$1, 1);
					return;
				}
			}
		};
		CleanupQueue$1.prototype.drain = function() {
			var hooks = this._cleanupHooks.slice();
			hooks.sort(function(a$1, b$1) {
				return b$1.order - a$1.order;
			});
			for (var i$1 = 0; i$1 < hooks.length; ++i$1) {
				var cb = hooks[i$1];
				if (typeof cb.fn === "number") cb.envObject.makeDynCall_vp(cb.fn)(cb.arg);
				else cb.fn(cb.arg);
				this._cleanupHooks.splice(this._cleanupHooks.indexOf(cb), 1);
			}
		};
		CleanupQueue$1.prototype.dispose = function() {
			this._cleanupHooks.length = 0;
			this._cleanupHookCounter = 0;
		};
		return CleanupQueue$1;
	}();
	NodejsWaitingRequestCounter = /* @__PURE__ */ function() {
		function NodejsWaitingRequestCounter$1() {
			this.refHandle = new _MessageChannel().port1;
			this.count = 0;
		}
		NodejsWaitingRequestCounter$1.prototype.increase = function() {
			if (this.count === 0) {
				if (this.refHandle.ref) this.refHandle.ref();
			}
			this.count++;
		};
		NodejsWaitingRequestCounter$1.prototype.decrease = function() {
			if (this.count === 0) return;
			if (this.count === 1) {
				if (this.refHandle.unref) this.refHandle.unref();
			}
			this.count--;
		};
		return NodejsWaitingRequestCounter$1;
	}();
	Context = /* @__PURE__ */ function() {
		function Context$1() {
			var _this = this;
			this._isStopping = false;
			this._canCallIntoJs = true;
			this._suppressDestroy = false;
			this.envStore = new Store();
			this.scopeStore = new ScopeStore();
			this.refStore = new Store();
			this.deferredStore = new Store();
			this.handleStore = new HandleStore();
			this.feature = {
				supportReflect,
				supportFinalizer,
				supportWeakSymbol,
				supportBigInt,
				supportNewFunction,
				canSetFunctionName,
				setImmediate: _setImmediate,
				Buffer: _Buffer,
				MessageChannel: _MessageChannel
			};
			this.cleanupQueue = new CleanupQueue();
			if (typeof process === "object" && process !== null && typeof process.once === "function") {
				this.refCounter = new NodejsWaitingRequestCounter();
				process.once("beforeExit", function() {
					if (!_this._suppressDestroy) _this.destroy();
				});
			}
		}
		/**
		* Suppress the destroy on `beforeExit` event in Node.js.
		* Call this method if you want to keep the context and
		* all associated {@link Env | Env} alive,
		* this also means that cleanup hooks will not be called.
		* After call this method, you should call
		* {@link Context.destroy | `Context.prototype.destroy`} method manually.
		*/
		Context$1.prototype.suppressDestroy = function() {
			this._suppressDestroy = true;
		};
		Context$1.prototype.getRuntimeVersions = function() {
			return {
				version: version$1,
				NODE_API_SUPPORTED_VERSION_MAX,
				NAPI_VERSION_EXPERIMENTAL,
				NODE_API_DEFAULT_MODULE_API_VERSION
			};
		};
		Context$1.prototype.createNotSupportWeakRefError = function(api, message) {
			return new NotSupportWeakRefError(api, message);
		};
		Context$1.prototype.createNotSupportBufferError = function(api, message) {
			return new NotSupportBufferError(api, message);
		};
		Context$1.prototype.createReference = function(envObject, handle_id, initialRefcount, ownership) {
			return Reference.create(envObject, handle_id, initialRefcount, ownership);
		};
		Context$1.prototype.createReferenceWithData = function(envObject, handle_id, initialRefcount, ownership, data) {
			return ReferenceWithData.create(envObject, handle_id, initialRefcount, ownership, data);
		};
		Context$1.prototype.createReferenceWithFinalizer = function(envObject, handle_id, initialRefcount, ownership, finalize_callback, finalize_data, finalize_hint) {
			if (finalize_callback === void 0) finalize_callback = 0;
			if (finalize_data === void 0) finalize_data = 0;
			if (finalize_hint === void 0) finalize_hint = 0;
			return ReferenceWithFinalizer.create(envObject, handle_id, initialRefcount, ownership, finalize_callback, finalize_data, finalize_hint);
		};
		Context$1.prototype.createDeferred = function(value) {
			return Deferred.create(this, value);
		};
		Context$1.prototype.createEnv = function(filename, moduleApiVersion, makeDynCall_vppp, makeDynCall_vp, abort, nodeBinding) {
			return newEnv(this, filename, moduleApiVersion, makeDynCall_vppp, makeDynCall_vp, abort, nodeBinding);
		};
		Context$1.prototype.createTrackedFinalizer = function(envObject, finalize_callback, finalize_data, finalize_hint) {
			return TrackedFinalizer.create(envObject, finalize_callback, finalize_data, finalize_hint);
		};
		Context$1.prototype.getCurrentScope = function() {
			return this.scopeStore.currentScope;
		};
		Context$1.prototype.addToCurrentScope = function(value) {
			return this.scopeStore.currentScope.add(value);
		};
		Context$1.prototype.openScope = function(envObject) {
			var scope = this.scopeStore.openScope(this.handleStore);
			if (envObject) envObject.openHandleScopes++;
			return scope;
		};
		Context$1.prototype.closeScope = function(envObject, _scope) {
			if (envObject && envObject.openHandleScopes === 0) return;
			this.scopeStore.closeScope();
			if (envObject) envObject.openHandleScopes--;
		};
		Context$1.prototype.ensureHandle = function(value) {
			switch (value) {
				case void 0: return HandleStore.UNDEFINED;
				case null: return HandleStore.NULL;
				case true: return HandleStore.TRUE;
				case false: return HandleStore.FALSE;
				case _global: return HandleStore.GLOBAL;
			}
			return this.addToCurrentScope(value);
		};
		Context$1.prototype.addCleanupHook = function(envObject, fn, arg) {
			this.cleanupQueue.add(envObject, fn, arg);
		};
		Context$1.prototype.removeCleanupHook = function(envObject, fn, arg) {
			this.cleanupQueue.remove(envObject, fn, arg);
		};
		Context$1.prototype.runCleanup = function() {
			while (!this.cleanupQueue.empty()) this.cleanupQueue.drain();
		};
		Context$1.prototype.increaseWaitingRequestCounter = function() {
			var _a;
			(_a = this.refCounter) === null || _a === void 0 || _a.increase();
		};
		Context$1.prototype.decreaseWaitingRequestCounter = function() {
			var _a;
			(_a = this.refCounter) === null || _a === void 0 || _a.decrease();
		};
		Context$1.prototype.setCanCallIntoJs = function(value) {
			this._canCallIntoJs = value;
		};
		Context$1.prototype.setStopping = function(value) {
			this._isStopping = value;
		};
		Context$1.prototype.canCallIntoJs = function() {
			return this._canCallIntoJs && !this._isStopping;
		};
		/**
		* Destroy the context and call cleanup hooks.
		* Associated {@link Env | Env} will be destroyed.
		*/
		Context$1.prototype.destroy = function() {
			this.setStopping(true);
			this.setCanCallIntoJs(false);
			this.runCleanup();
		};
		return Context$1;
	}();
} });
var wasm_util_esm_bundler_exports = /* @__PURE__ */ __export({
	Asyncify: () => Asyncify,
	Memory: () => Memory,
	WASI: () => WASI$2,
	WebAssemblyMemory: () => WebAssemblyMemory,
	asyncifyLoad: () => asyncifyLoad,
	asyncifyLoadSync: () => asyncifyLoadSync,
	createAsyncWASI: () => createAsyncWASI,
	extendMemory: () => extendMemory,
	load: () => load$2,
	loadSync: () => loadSync,
	wrapAsyncExport: () => wrapAsyncExport,
	wrapAsyncImport: () => wrapAsyncImport,
	wrapExports: () => wrapExports
});
function validateObject(value, name) {
	if (value === null || typeof value !== "object") throw new TypeError(`${name} must be an object. Received ${value === null ? "null" : typeof value}`);
}
function validateArray(value, name) {
	if (!Array.isArray(value)) throw new TypeError(`${name} must be an array. Received ${value === null ? "null" : typeof value}`);
}
function validateBoolean(value, name) {
	if (typeof value !== "boolean") throw new TypeError(`${name} must be a boolean. Received ${value === null ? "null" : typeof value}`);
}
function validateString(value, name) {
	if (typeof value !== "string") throw new TypeError(`${name} must be a string. Received ${value === null ? "null" : typeof value}`);
}
function validateFunction(value, name) {
	if (typeof value !== "function") throw new TypeError(`${name} must be a function. Received ${value === null ? "null" : typeof value}`);
}
function validateUndefined(value, name) {
	if (value !== void 0) throw new TypeError(`${name} must be undefined. Received ${value === null ? "null" : typeof value}`);
}
function isPromiseLike(obj) {
	return !!(obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function");
}
function wrapInstanceExports(exports$1, mapFn) {
	const newExports = Object.create(null);
	Object.keys(exports$1).forEach((name) => {
		const exportValue = exports$1[name];
		Object.defineProperty(newExports, name, {
			enumerable: true,
			value: mapFn(exportValue, name)
		});
	});
	return newExports;
}
function sleepBreakIf(delay, breakIf) {
	const end = Date.now() + delay;
	let ret = false;
	while (Date.now() < end) if (breakIf()) {
		ret = true;
		break;
	}
	return ret;
}
function unsharedSlice(view, start, end) {
	return typeof SharedArrayBuffer === "function" && view.buffer instanceof SharedArrayBuffer || Object.prototype.toString.call(view.buffer.constructor) === "[object SharedArrayBuffer]" ? view.slice(start, end) : view.subarray(start, end);
}
function tryAllocate(instance$1, wasm64, size, mallocName) {
	if (typeof instance$1.exports[mallocName] !== "function" || size <= 0) return {
		wasm64,
		dataPtr: 16,
		start: wasm64 ? 32 : 24,
		end: 1024
	};
	const malloc = instance$1.exports[mallocName];
	const dataPtr = wasm64 ? Number(malloc(BigInt(16) + BigInt(size))) : malloc(8 + size);
	if (dataPtr === 0) throw new Error("Allocate asyncify data failed");
	return wasm64 ? {
		wasm64,
		dataPtr,
		start: dataPtr + 16,
		end: dataPtr + 16 + size
	} : {
		wasm64,
		dataPtr,
		start: dataPtr + 8,
		end: dataPtr + 8 + size
	};
}
function validateImports(imports) {
	if (imports && typeof imports !== "object") throw new TypeError("imports must be an object or undefined");
}
function fetchWasm(urlOrBuffer, imports) {
	if (typeof wx !== "undefined" && typeof __wxConfig !== "undefined") return _WebAssembly.instantiate(urlOrBuffer, imports);
	return fetch(urlOrBuffer).then((response) => response.arrayBuffer()).then((buffer) => _WebAssembly.instantiate(buffer, imports));
}
/** @public */
function load$2(wasmInput, imports) {
	validateImports(imports);
	imports = imports !== null && imports !== void 0 ? imports : {};
	let source;
	if (wasmInput instanceof ArrayBuffer || ArrayBuffer.isView(wasmInput)) return _WebAssembly.instantiate(wasmInput, imports);
	if (wasmInput instanceof _WebAssembly.Module) return _WebAssembly.instantiate(wasmInput, imports).then((instance$1) => {
		return {
			instance: instance$1,
			module: wasmInput
		};
	});
	if (typeof wasmInput !== "string" && !(wasmInput instanceof URL)) throw new TypeError("Invalid source");
	if (typeof _WebAssembly.instantiateStreaming === "function") {
		let responsePromise;
		try {
			responsePromise = fetch(wasmInput);
			source = _WebAssembly.instantiateStreaming(responsePromise, imports).catch(() => {
				return fetchWasm(wasmInput, imports);
			});
		} catch (_) {
			source = fetchWasm(wasmInput, imports);
		}
	} else source = fetchWasm(wasmInput, imports);
	return source;
}
/** @public */
function asyncifyLoad(asyncify, urlOrBuffer, imports) {
	validateImports(imports);
	imports = imports !== null && imports !== void 0 ? imports : {};
	const asyncifyHelper = new Asyncify();
	imports = asyncifyHelper.wrapImports(imports);
	return load$2(urlOrBuffer, imports).then((source) => {
		var _a;
		const memory = source.instance.exports.memory || ((_a = imports.env) === null || _a === void 0 ? void 0 : _a.memory);
		return {
			module: source.module,
			instance: asyncifyHelper.init(memory, source.instance, asyncify)
		};
	});
}
/** @public */
function loadSync(wasmInput, imports) {
	validateImports(imports);
	imports = imports !== null && imports !== void 0 ? imports : {};
	let module$1;
	if (wasmInput instanceof ArrayBuffer || ArrayBuffer.isView(wasmInput)) module$1 = new _WebAssembly.Module(wasmInput);
	else if (wasmInput instanceof WebAssembly.Module) module$1 = wasmInput;
	else throw new TypeError("Invalid source");
	return {
		instance: new _WebAssembly.Instance(module$1, imports),
		module: module$1
	};
}
/** @public */
function asyncifyLoadSync(asyncify, buffer, imports) {
	var _a;
	validateImports(imports);
	imports = imports !== null && imports !== void 0 ? imports : {};
	const asyncifyHelper = new Asyncify();
	imports = asyncifyHelper.wrapImports(imports);
	const source = loadSync(buffer, imports);
	const memory = source.instance.exports.memory || ((_a = imports.env) === null || _a === void 0 ? void 0 : _a.memory);
	return {
		module: source.module,
		instance: asyncifyHelper.init(memory, source.instance, asyncify)
	};
}
function isPosixPathSeparator(code$1) {
	return code$1 === CHAR_FORWARD_SLASH;
}
function normalizeString(path$1, allowAboveRoot, separator, isPathSeparator) {
	let res = "";
	let lastSegmentLength = 0;
	let lastSlash = -1;
	let dots = 0;
	let code$1 = 0;
	for (let i$1 = 0; i$1 <= path$1.length; ++i$1) {
		if (i$1 < path$1.length) code$1 = path$1.charCodeAt(i$1);
		else if (isPathSeparator(code$1)) break;
		else code$1 = CHAR_FORWARD_SLASH;
		if (isPathSeparator(code$1)) {
			if (lastSlash === i$1 - 1 || dots === 1);
			else if (dots === 2) {
				if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
					if (res.length > 2) {
						const lastSlashIndex = res.indexOf(separator);
						if (lastSlashIndex === -1) {
							res = "";
							lastSegmentLength = 0;
						} else {
							res = res.slice(0, lastSlashIndex);
							lastSegmentLength = res.length - 1 - res.indexOf(separator);
						}
						lastSlash = i$1;
						dots = 0;
						continue;
					} else if (res.length !== 0) {
						res = "";
						lastSegmentLength = 0;
						lastSlash = i$1;
						dots = 0;
						continue;
					}
				}
				if (allowAboveRoot) {
					res += res.length > 0 ? `${separator}..` : "..";
					lastSegmentLength = 2;
				}
			} else {
				if (res.length > 0) res += `${separator}${path$1.slice(lastSlash + 1, i$1)}`;
				else res = path$1.slice(lastSlash + 1, i$1);
				lastSegmentLength = i$1 - lastSlash - 1;
			}
			lastSlash = i$1;
			dots = 0;
		} else if (code$1 === CHAR_DOT && dots !== -1) ++dots;
		else dots = -1;
	}
	return res;
}
function resolve$1(...args$1) {
	let resolvedPath = "";
	let resolvedAbsolute = false;
	for (let i$1 = args$1.length - 1; i$1 >= -1 && !resolvedAbsolute; i$1--) {
		const path$1 = i$1 >= 0 ? args$1[i$1] : "/";
		validateString(path$1, "path");
		if (path$1.length === 0) continue;
		resolvedPath = `${path$1}/${resolvedPath}`;
		resolvedAbsolute = path$1.charCodeAt(0) === CHAR_FORWARD_SLASH;
	}
	resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
	if (resolvedAbsolute) return `/${resolvedPath}`;
	return resolvedPath.length > 0 ? resolvedPath : ".";
}
function strerror(errno) {
	switch (errno) {
		case 0: return "Success";
		case 1: return "Argument list too long";
		case 2: return "Permission denied";
		case 3: return "Address in use";
		case 4: return "Address not available";
		case 5: return "Address family not supported by protocol";
		case 6: return "Resource temporarily unavailable";
		case 7: return "Operation already in progress";
		case 8: return "Bad file descriptor";
		case 9: return "Bad message";
		case 10: return "Resource busy";
		case 11: return "Operation canceled";
		case 12: return "No child process";
		case 13: return "Connection aborted";
		case 14: return "Connection refused";
		case 15: return "Connection reset by peer";
		case 16: return "Resource deadlock would occur";
		case 17: return "Destination address required";
		case 18: return "Domain error";
		case 19: return "Quota exceeded";
		case 20: return "File exists";
		case 21: return "Bad address";
		case 22: return "File too large";
		case 23: return "Host is unreachable";
		case 24: return "Identifier removed";
		case 25: return "Illegal byte sequence";
		case 26: return "Operation in progress";
		case 27: return "Interrupted system call";
		case 28: return "Invalid argument";
		case 29: return "I/O error";
		case 30: return "Socket is connected";
		case 31: return "Is a directory";
		case 32: return "Symbolic link loop";
		case 33: return "No file descriptors available";
		case 34: return "Too many links";
		case 35: return "Message too large";
		case 36: return "Multihop attempted";
		case 37: return "Filename too long";
		case 38: return "Network is down";
		case 39: return "Connection reset by network";
		case 40: return "Network unreachable";
		case 41: return "Too many files open in system";
		case 42: return "No buffer space available";
		case 43: return "No such device";
		case 44: return "No such file or directory";
		case 45: return "Exec format error";
		case 46: return "No locks available";
		case 47: return "Link has been severed";
		case 48: return "Out of memory";
		case 49: return "No message of the desired type";
		case 50: return "Protocol not available";
		case 51: return "No space left on device";
		case 52: return "Function not implemented";
		case 53: return "Socket not connected";
		case 54: return "Not a directory";
		case 55: return "Directory not empty";
		case 56: return "State not recoverable";
		case 57: return "Not a socket";
		case 58: return "Not supported";
		case 59: return "Not a tty";
		case 60: return "No such device or address";
		case 61: return "Value too large for data type";
		case 62: return "Previous owner died";
		case 63: return "Operation not permitted";
		case 64: return "Broken pipe";
		case 65: return "Protocol error";
		case 66: return "Protocol not supported";
		case 67: return "Protocol wrong type for socket";
		case 68: return "Result not representable";
		case 69: return "Read-only file system";
		case 70: return "Invalid seek";
		case 71: return "No such process";
		case 72: return "Stale file handle";
		case 73: return "Operation timed out";
		case 74: return "Text file busy";
		case 75: return "Cross-device link";
		case 76: return "Capabilities insufficient";
		default: return "Unknown error";
	}
}
function getRights(stdio, fd, flags, type) {
	const ret = {
		base: BigInt(0),
		inheriting: BigInt(0)
	};
	if (type === 0) throw new WasiError("Unknown file type", 28);
	switch (type) {
		case 4:
			ret.base = REGULAR_FILE_BASE;
			ret.inheriting = REGULAR_FILE_INHERITING;
			break;
		case 3:
			ret.base = DIRECTORY_BASE;
			ret.inheriting = DIRECTORY_INHERITING;
			break;
		case 6:
		case 5:
			ret.base = SOCKET_BASE;
			ret.inheriting = SOCKET_INHERITING;
			break;
		case 2:
			if (stdio.indexOf(fd) !== -1) {
				ret.base = TTY_BASE;
				ret.inheriting = TTY_INHERITING;
			} else {
				ret.base = CHARACTER_DEVICE_BASE;
				ret.inheriting = CHARACTER_DEVICE_INHERITING;
			}
			break;
		case 1:
			ret.base = BLOCK_DEVICE_BASE;
			ret.inheriting = BLOCK_DEVICE_INHERITING;
			break;
		default:
			ret.base = BigInt(0);
			ret.inheriting = BigInt(0);
	}
	const read_or_write_only = flags & 3;
	if (read_or_write_only === 0) ret.base &= ~WasiRights.FD_WRITE;
	else if (read_or_write_only === 1) ret.base &= ~WasiRights.FD_READ;
	return ret;
}
function concatBuffer(buffers, size) {
	let total = 0;
	if (typeof size === "number" && size >= 0) total = size;
	else for (let i$1 = 0; i$1 < buffers.length; i$1++) {
		const buffer = buffers[i$1];
		total += buffer.length;
	}
	let pos = 0;
	const ret = new Uint8Array(total);
	for (let i$1 = 0; i$1 < buffers.length; i$1++) {
		const buffer = buffers[i$1];
		ret.set(buffer, pos);
		pos += buffer.length;
	}
	return ret;
}
function toFileType(stat) {
	if (stat.isBlockDevice()) return 1;
	if (stat.isCharacterDevice()) return 2;
	if (stat.isDirectory()) return 3;
	if (stat.isSocket()) return 6;
	if (stat.isFile()) return 4;
	if (stat.isSymbolicLink()) return 7;
	return 0;
}
function toFileStat(view, buf, stat) {
	view.setBigUint64(buf, stat.dev, true);
	view.setBigUint64(buf + 8, stat.ino, true);
	view.setBigUint64(buf + 16, BigInt(toFileType(stat)), true);
	view.setBigUint64(buf + 24, stat.nlink, true);
	view.setBigUint64(buf + 32, stat.size, true);
	view.setBigUint64(buf + 40, stat.atimeMs * BigInt(1e6), true);
	view.setBigUint64(buf + 48, stat.mtimeMs * BigInt(1e6), true);
	view.setBigUint64(buf + 56, stat.ctimeMs * BigInt(1e6), true);
}
/** @public */
function extendMemory(memory) {
	if (Object.getPrototypeOf(memory) === _WebAssembly.Memory.prototype) Object.setPrototypeOf(memory, Memory.prototype);
	return memory;
}
function checkWebAssemblyFunction() {
	const WebAssemblyFunction = _WebAssembly.Function;
	if (typeof WebAssemblyFunction !== "function") throw new Error("WebAssembly.Function is not supported in this environment. If you are using V8 based browser like Chrome, try to specify --js-flags=\"--wasm-staging --experimental-wasm-stack-switching\"");
	return WebAssemblyFunction;
}
/** @public */
function wrapAsyncImport(f$1, parameterType, returnType) {
	const WebAssemblyFunction = checkWebAssemblyFunction();
	if (typeof f$1 !== "function") throw new TypeError("Function required");
	const parameters = parameterType.slice(0);
	parameters.unshift("externref");
	return new WebAssemblyFunction({
		parameters,
		results: returnType
	}, f$1, { suspending: "first" });
}
/** @public */
function wrapAsyncExport(f$1) {
	const WebAssemblyFunction = checkWebAssemblyFunction();
	if (typeof f$1 !== "function") throw new TypeError("Function required");
	return new WebAssemblyFunction({
		parameters: [...WebAssemblyFunction.type(f$1).parameters.slice(1)],
		results: ["externref"]
	}, f$1, { promising: "first" });
}
/** @public */
function wrapExports(exports$1, needWrap) {
	return wrapInstanceExports(exports$1, (exportValue, name) => {
		let ignore = typeof exportValue !== "function";
		if (Array.isArray(needWrap)) ignore = ignore || needWrap.indexOf(name) === -1;
		return ignore ? exportValue : wrapAsyncExport(exportValue);
	});
}
function copyMemory(targets, src) {
	if (targets.length === 0 || src.length === 0) return 0;
	let copied = 0;
	let left = src.length - copied;
	for (let i$1 = 0; i$1 < targets.length; ++i$1) {
		const target = targets[i$1];
		if (left < target.length) {
			target.set(src.subarray(copied, copied + left), 0);
			copied += left;
			left = 0;
			return copied;
		}
		target.set(src.subarray(copied, copied + target.length), 0);
		copied += target.length;
		left -= target.length;
	}
	return copied;
}
function getMemory(wasi) {
	return _memory.get(wasi);
}
function getFs(wasi) {
	const fs$1 = _fs.get(wasi);
	if (!fs$1) throw new Error("filesystem is unavailable");
	return fs$1;
}
function handleError(err) {
	if (err instanceof WasiError) {
		if (process.env.NODE_ENV !== "production") console.warn(err);
		return err.errno;
	}
	switch (err.code) {
		case "ENOENT": return 44;
		case "EBADF": return 8;
		case "EINVAL": return 28;
		case "EPERM": return 63;
		case "EPROTO": return 65;
		case "EEXIST": return 20;
		case "ENOTDIR": return 54;
		case "EMFILE": return 33;
		case "EACCES": return 2;
		case "EISDIR": return 31;
		case "ENOTEMPTY": return 55;
		case "ENOSYS": return 52;
	}
	throw err;
}
function defineName(name, f$1) {
	Object.defineProperty(f$1, "name", { value: name });
	return f$1;
}
function tryCall(f$1, wasi, args$1) {
	let r$1;
	try {
		r$1 = f$1.apply(wasi, args$1);
	} catch (err) {
		return handleError(err);
	}
	if (isPromiseLike(r$1)) return r$1.then((_) => _, handleError);
	return r$1;
}
function syscallWrap(self$1, name, f$1) {
	let debug = false;
	const NODE_DEBUG_NATIVE = (() => {
		try {
			return process.env.NODE_DEBUG_NATIVE;
		} catch (_) {
			return;
		}
	})();
	if (typeof NODE_DEBUG_NATIVE === "string" && NODE_DEBUG_NATIVE.split(",").includes("wasi")) debug = true;
	return debug ? defineName(name, function() {
		const args$1 = Array.prototype.slice.call(arguments);
		let debugArgs = [`${name}(${Array.from({ length: arguments.length }).map(() => "%d").join(", ")})`];
		debugArgs = debugArgs.concat(args$1);
		console.debug.apply(console, debugArgs);
		return tryCall(f$1, self$1, args$1);
	}) : defineName(name, function() {
		return tryCall(f$1, self$1, arguments);
	});
}
function resolvePathSync(fs$1, fileDescriptor, path$1, flags) {
	let resolvedPath = resolve$1(fileDescriptor.realPath, path$1);
	if ((flags & 1) === 1) try {
		resolvedPath = fs$1.readlinkSync(resolvedPath);
	} catch (err) {
		if (err.code !== "EINVAL" && err.code !== "ENOENT") throw err;
	}
	return resolvedPath;
}
async function resolvePathAsync(fs$1, fileDescriptor, path$1, flags) {
	let resolvedPath = resolve$1(fileDescriptor.realPath, path$1);
	if ((flags & 1) === 1) try {
		resolvedPath = await fs$1.promises.readlink(resolvedPath);
	} catch (err) {
		if (err.code !== "EINVAL" && err.code !== "ENOENT") throw err;
	}
	return resolvedPath;
}
function readStdin() {
	const value = window.prompt();
	if (value === null) return new Uint8Array();
	return new TextEncoder().encode(value + "\n");
}
function validateFstFlagsOrReturn(flags) {
	return Boolean(flags & -16) || (flags & 3) === 3 || (flags & 12) === 12;
}
function validateOptions(options) {
	var _a;
	validateObject(options, "options");
	let _WASI;
	if (options.version !== void 0) {
		validateString(options.version, "options.version");
		switch (options.version) {
			case "unstable":
				_WASI = WASI$1;
				this[kBindingName] = "wasi_unstable";
				break;
			case "preview1":
				_WASI = WASI$1;
				this[kBindingName] = "wasi_snapshot_preview1";
				break;
			default: throw new TypeError(`unsupported WASI version "${options.version}"`);
		}
	} else {
		_WASI = WASI$1;
		this[kBindingName] = "wasi_snapshot_preview1";
	}
	if (options.args !== void 0) validateArray(options.args, "options.args");
	const args$1 = ((_a = options.args) !== null && _a !== void 0 ? _a : []).map(String);
	const env = [];
	if (options.env !== void 0) {
		validateObject(options.env, "options.env");
		Object.entries(options.env).forEach(({ 0: key, 1: value }) => {
			if (value !== void 0) env.push(`${key}=${value}`);
		});
	}
	const preopens = [];
	if (options.preopens !== void 0) {
		validateObject(options.preopens, "options.preopens");
		Object.entries(options.preopens).forEach(({ 0: key, 1: value }) => preopens.push({
			mappedPath: String(key),
			realPath: String(value)
		}));
	}
	if (preopens.length > 0) {
		if (options.fs === void 0) throw new Error("filesystem is disabled, can not preopen directory");
		try {
			validateObject(options.fs, "options.fs");
		} catch (_) {
			throw new TypeError("Node.js fs like implementation is not provided");
		}
	}
	if (options.print !== void 0) validateFunction(options.print, "options.print");
	if (options.printErr !== void 0) validateFunction(options.printErr, "options.printErr");
	if (options.returnOnExit !== void 0) validateBoolean(options.returnOnExit, "options.returnOnExit");
	return {
		args: args$1,
		env,
		preopens,
		stdio: [
			0,
			1,
			2
		],
		_WASI
	};
}
function initWASI(setMemory, wrap$2) {
	this[kSetMemory] = setMemory;
	this.wasiImport = wrap$2;
	this[kStarted] = false;
	this[kExitCode] = 0;
	this[kInstance] = void 0;
}
function wasiReturnOnProcExit(rval) {
	this[kExitCode] = rval;
	throw kExitCode;
}
/** @public */
async function createAsyncWASI(options = kEmptyObject) {
	const _this = Object.create(WASI$2.prototype);
	const { args: args$1, env, preopens, stdio, _WASI } = validateOptions.call(_this, options);
	if (options.asyncify !== void 0) {
		validateObject(options.asyncify, "options.asyncify");
		validateFunction(options.asyncify.wrapImportFunction, "options.asyncify.wrapImportFunction");
	}
	const wrap$2 = await _WASI.createAsync(args$1, env, preopens, stdio, options.fs, options.print, options.printErr, options.asyncify);
	const setMemory = wrap$2._setMemory;
	delete wrap$2._setMemory;
	initWASI.call(_this, setMemory, wrap$2);
	if (options.returnOnExit) wrap$2.proc_exit = wasiReturnOnProcExit.bind(_this);
	return _this;
}
var _WebAssembly, ignoreNames, Asyncify, CHAR_DOT, CHAR_FORWARD_SLASH, FD_DATASYNC, FD_READ, FD_SEEK, FD_FDSTAT_SET_FLAGS, FD_SYNC, FD_TELL, FD_WRITE, FD_ADVISE, FD_ALLOCATE, PATH_CREATE_DIRECTORY, PATH_CREATE_FILE, PATH_LINK_SOURCE, PATH_LINK_TARGET, PATH_OPEN, FD_READDIR, PATH_READLINK, PATH_RENAME_SOURCE, PATH_RENAME_TARGET, PATH_FILESTAT_GET, PATH_FILESTAT_SET_SIZE, PATH_FILESTAT_SET_TIMES, FD_FILESTAT_GET, FD_FILESTAT_SET_SIZE, FD_FILESTAT_SET_TIMES, PATH_SYMLINK, PATH_REMOVE_DIRECTORY, PATH_UNLINK_FILE, POLL_FD_READWRITE, SOCK_SHUTDOWN, SOCK_ACCEPT, WasiRights, WasiError, RIGHTS_ALL, BLOCK_DEVICE_BASE, BLOCK_DEVICE_INHERITING, CHARACTER_DEVICE_BASE, CHARACTER_DEVICE_INHERITING, REGULAR_FILE_BASE, REGULAR_FILE_INHERITING, DIRECTORY_BASE, DIRECTORY_INHERITING, SOCKET_BASE, SOCKET_INHERITING, TTY_BASE, TTY_INHERITING, FileDescriptor, StandardOutput, FileDescriptorTable, SyncTable, AsyncTable, WebAssemblyMemory, Memory, _memory, _wasi, _fs, encoder, decoder, INT64_MAX, WASI$1, kEmptyObject, kExitCode, kSetMemory, kStarted, kInstance, kBindingName, WASI$2;
var init_wasm_util_esm_bundler = __esm({ "../../node_modules/.pnpm/@tybys+wasm-util@0.10.1/node_modules/@tybys/wasm-util/dist/wasm-util.esm-bundler.js": () => {
	_WebAssembly = typeof WebAssembly !== "undefined" ? WebAssembly : typeof WXWebAssembly !== "undefined" ? WXWebAssembly : void 0;
	if (!_WebAssembly) throw new Error("WebAssembly is not supported in this environment");
	ignoreNames = [
		"asyncify_get_state",
		"asyncify_start_rewind",
		"asyncify_start_unwind",
		"asyncify_stop_rewind",
		"asyncify_stop_unwind"
	];
	Asyncify = class {
		constructor() {
			this.value = void 0;
			this.exports = void 0;
			this.dataPtr = 0;
		}
		init(memory, instance$1, options) {
			var _a, _b;
			if (this.exports) throw new Error("Asyncify has been initialized");
			if (!(memory instanceof _WebAssembly.Memory)) throw new TypeError("Require WebAssembly.Memory object");
			const exports$1 = instance$1.exports;
			for (let i$1 = 0; i$1 < ignoreNames.length; ++i$1) if (typeof exports$1[ignoreNames[i$1]] !== "function") throw new TypeError("Invalid asyncify wasm");
			let address;
			const wasm64 = Boolean(options.wasm64);
			if (!options.tryAllocate) address = {
				wasm64,
				dataPtr: 16,
				start: wasm64 ? 32 : 24,
				end: 1024
			};
			else if (options.tryAllocate === true) address = tryAllocate(instance$1, wasm64, 4096, "malloc");
			else address = tryAllocate(instance$1, wasm64, (_a = options.tryAllocate.size) !== null && _a !== void 0 ? _a : 4096, (_b = options.tryAllocate.name) !== null && _b !== void 0 ? _b : "malloc");
			this.dataPtr = address.dataPtr;
			if (wasm64) new BigInt64Array(memory.buffer, this.dataPtr).set([BigInt(address.start), BigInt(address.end)]);
			else new Int32Array(memory.buffer, this.dataPtr).set([address.start, address.end]);
			this.exports = this.wrapExports(exports$1, options.wrapExports);
			const asyncifiedInstance = Object.create(_WebAssembly.Instance.prototype);
			Object.defineProperty(asyncifiedInstance, "exports", { value: this.exports });
			return asyncifiedInstance;
		}
		assertState() {
			if (this.exports.asyncify_get_state() !== 0) throw new Error("Asyncify state error");
		}
		wrapImportFunction(f$1) {
			const _this = this;
			return function() {
				while (_this.exports.asyncify_get_state() === 2) {
					_this.exports.asyncify_stop_rewind();
					return _this.value;
				}
				_this.assertState();
				const v = f$1.apply(this, arguments);
				if (!isPromiseLike(v)) return v;
				_this.exports.asyncify_start_unwind(_this.dataPtr);
				_this.value = v;
			};
		}
		wrapImports(imports) {
			const importObject = {};
			Object.keys(imports).forEach((k) => {
				const mod = imports[k];
				const newModule = {};
				Object.keys(mod).forEach((name) => {
					const importValue = mod[name];
					if (typeof importValue === "function") newModule[name] = this.wrapImportFunction(importValue);
					else newModule[name] = importValue;
				});
				importObject[k] = newModule;
			});
			return importObject;
		}
		wrapExportFunction(f$1) {
			const _this = this;
			return async function() {
				_this.assertState();
				let ret = f$1.apply(this, arguments);
				while (_this.exports.asyncify_get_state() === 1) {
					_this.exports.asyncify_stop_unwind();
					_this.value = await _this.value;
					_this.assertState();
					_this.exports.asyncify_start_rewind(_this.dataPtr);
					ret = f$1.call(this);
				}
				_this.assertState();
				return ret;
			};
		}
		wrapExports(exports$1, needWrap) {
			return wrapInstanceExports(exports$1, (exportValue, name) => {
				let ignore = ignoreNames.indexOf(name) !== -1 || typeof exportValue !== "function";
				if (Array.isArray(needWrap)) ignore = ignore || needWrap.indexOf(name) === -1;
				return ignore ? exportValue : this.wrapExportFunction(exportValue);
			});
		}
	};
	CHAR_DOT = 46;
	CHAR_FORWARD_SLASH = 47;
	FD_DATASYNC = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(0);
	FD_READ = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(1);
	FD_SEEK = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(2);
	FD_FDSTAT_SET_FLAGS = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(3);
	FD_SYNC = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(4);
	FD_TELL = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(5);
	FD_WRITE = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(6);
	FD_ADVISE = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(7);
	FD_ALLOCATE = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(8);
	PATH_CREATE_DIRECTORY = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(9);
	PATH_CREATE_FILE = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(10);
	PATH_LINK_SOURCE = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(11);
	PATH_LINK_TARGET = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(12);
	PATH_OPEN = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(13);
	FD_READDIR = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(14);
	PATH_READLINK = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(15);
	PATH_RENAME_SOURCE = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(16);
	PATH_RENAME_TARGET = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(17);
	PATH_FILESTAT_GET = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(18);
	PATH_FILESTAT_SET_SIZE = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(19);
	PATH_FILESTAT_SET_TIMES = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(20);
	FD_FILESTAT_GET = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(21);
	FD_FILESTAT_SET_SIZE = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(22);
	FD_FILESTAT_SET_TIMES = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(23);
	PATH_SYMLINK = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(24);
	PATH_REMOVE_DIRECTORY = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(25);
	PATH_UNLINK_FILE = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(26);
	POLL_FD_READWRITE = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(27);
	SOCK_SHUTDOWN = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(28);
	SOCK_ACCEPT = /* @__PURE__ */ BigInt(1) << /* @__PURE__ */ BigInt(29);
	WasiRights = {
		FD_DATASYNC,
		FD_READ,
		FD_SEEK,
		FD_FDSTAT_SET_FLAGS,
		FD_SYNC,
		FD_TELL,
		FD_WRITE,
		FD_ADVISE,
		FD_ALLOCATE,
		PATH_CREATE_DIRECTORY,
		PATH_CREATE_FILE,
		PATH_LINK_SOURCE,
		PATH_LINK_TARGET,
		PATH_OPEN,
		FD_READDIR,
		PATH_READLINK,
		PATH_RENAME_SOURCE,
		PATH_RENAME_TARGET,
		PATH_FILESTAT_GET,
		PATH_FILESTAT_SET_SIZE,
		PATH_FILESTAT_SET_TIMES,
		FD_FILESTAT_GET,
		FD_FILESTAT_SET_SIZE,
		FD_FILESTAT_SET_TIMES,
		PATH_SYMLINK,
		PATH_REMOVE_DIRECTORY,
		PATH_UNLINK_FILE,
		POLL_FD_READWRITE,
		SOCK_SHUTDOWN,
		SOCK_ACCEPT
	};
	WasiError = class extends Error {
		constructor(message, errno) {
			super(message);
			this.errno = errno;
		}
		getErrorMessage() {
			return strerror(this.errno);
		}
	};
	Object.defineProperty(WasiError.prototype, "name", {
		configurable: true,
		writable: true,
		value: "WasiError"
	});
	RIGHTS_ALL = WasiRights.FD_DATASYNC | WasiRights.FD_READ | WasiRights.FD_SEEK | WasiRights.FD_FDSTAT_SET_FLAGS | WasiRights.FD_SYNC | WasiRights.FD_TELL | WasiRights.FD_WRITE | WasiRights.FD_ADVISE | WasiRights.FD_ALLOCATE | WasiRights.PATH_CREATE_DIRECTORY | WasiRights.PATH_CREATE_FILE | WasiRights.PATH_LINK_SOURCE | WasiRights.PATH_LINK_TARGET | WasiRights.PATH_OPEN | WasiRights.FD_READDIR | WasiRights.PATH_READLINK | WasiRights.PATH_RENAME_SOURCE | WasiRights.PATH_RENAME_TARGET | WasiRights.PATH_FILESTAT_GET | WasiRights.PATH_FILESTAT_SET_SIZE | WasiRights.PATH_FILESTAT_SET_TIMES | WasiRights.FD_FILESTAT_GET | WasiRights.FD_FILESTAT_SET_TIMES | WasiRights.FD_FILESTAT_SET_SIZE | WasiRights.PATH_SYMLINK | WasiRights.PATH_UNLINK_FILE | WasiRights.PATH_REMOVE_DIRECTORY | WasiRights.POLL_FD_READWRITE | WasiRights.SOCK_SHUTDOWN | WasiRights.SOCK_ACCEPT;
	BLOCK_DEVICE_BASE = RIGHTS_ALL;
	BLOCK_DEVICE_INHERITING = RIGHTS_ALL;
	CHARACTER_DEVICE_BASE = RIGHTS_ALL;
	CHARACTER_DEVICE_INHERITING = RIGHTS_ALL;
	REGULAR_FILE_BASE = WasiRights.FD_DATASYNC | WasiRights.FD_READ | WasiRights.FD_SEEK | WasiRights.FD_FDSTAT_SET_FLAGS | WasiRights.FD_SYNC | WasiRights.FD_TELL | WasiRights.FD_WRITE | WasiRights.FD_ADVISE | WasiRights.FD_ALLOCATE | WasiRights.FD_FILESTAT_GET | WasiRights.FD_FILESTAT_SET_SIZE | WasiRights.FD_FILESTAT_SET_TIMES | WasiRights.POLL_FD_READWRITE;
	REGULAR_FILE_INHERITING = /* @__PURE__ */ BigInt(0);
	DIRECTORY_BASE = WasiRights.FD_FDSTAT_SET_FLAGS | WasiRights.FD_SYNC | WasiRights.FD_ADVISE | WasiRights.PATH_CREATE_DIRECTORY | WasiRights.PATH_CREATE_FILE | WasiRights.PATH_LINK_SOURCE | WasiRights.PATH_LINK_TARGET | WasiRights.PATH_OPEN | WasiRights.FD_READDIR | WasiRights.PATH_READLINK | WasiRights.PATH_RENAME_SOURCE | WasiRights.PATH_RENAME_TARGET | WasiRights.PATH_FILESTAT_GET | WasiRights.PATH_FILESTAT_SET_SIZE | WasiRights.PATH_FILESTAT_SET_TIMES | WasiRights.FD_FILESTAT_GET | WasiRights.FD_FILESTAT_SET_TIMES | WasiRights.PATH_SYMLINK | WasiRights.PATH_UNLINK_FILE | WasiRights.PATH_REMOVE_DIRECTORY | WasiRights.POLL_FD_READWRITE;
	DIRECTORY_INHERITING = DIRECTORY_BASE | REGULAR_FILE_BASE;
	SOCKET_BASE = WasiRights.FD_READ | WasiRights.FD_FDSTAT_SET_FLAGS | WasiRights.FD_WRITE | WasiRights.FD_FILESTAT_GET | WasiRights.POLL_FD_READWRITE | WasiRights.SOCK_SHUTDOWN;
	SOCKET_INHERITING = RIGHTS_ALL;
	TTY_BASE = WasiRights.FD_READ | WasiRights.FD_FDSTAT_SET_FLAGS | WasiRights.FD_WRITE | WasiRights.FD_FILESTAT_GET | WasiRights.POLL_FD_READWRITE;
	TTY_INHERITING = /* @__PURE__ */ BigInt(0);
	FileDescriptor = class {
		constructor(id$1, fd, path$1, realPath, type, rightsBase, rightsInheriting, preopen) {
			this.id = id$1;
			this.fd = fd;
			this.path = path$1;
			this.realPath = realPath;
			this.type = type;
			this.rightsBase = rightsBase;
			this.rightsInheriting = rightsInheriting;
			this.preopen = preopen;
			this.pos = BigInt(0);
			this.size = BigInt(0);
		}
		seek(offset, whence) {
			if (whence === 0) this.pos = BigInt(offset);
			else if (whence === 1) this.pos += BigInt(offset);
			else if (whence === 2) this.pos = BigInt(this.size) - BigInt(offset);
			else throw new WasiError("Unknown whence", 29);
			return this.pos;
		}
	};
	StandardOutput = class extends FileDescriptor {
		constructor(log, id$1, fd, path$1, realPath, type, rightsBase, rightsInheriting, preopen) {
			super(id$1, fd, path$1, realPath, type, rightsBase, rightsInheriting, preopen);
			this._log = log;
			this._buf = null;
		}
		write(buffer) {
			const originalBuffer = buffer;
			if (this._buf) {
				buffer = concatBuffer([this._buf, buffer]);
				this._buf = null;
			}
			if (buffer.indexOf(10) === -1) {
				this._buf = buffer;
				return originalBuffer.byteLength;
			}
			let written = 0;
			let lastBegin = 0;
			let index;
			while ((index = buffer.indexOf(10, written)) !== -1) {
				const str = new TextDecoder().decode(buffer.subarray(lastBegin, index));
				this._log(str);
				written += index - lastBegin + 1;
				lastBegin = index + 1;
			}
			if (written < buffer.length) this._buf = buffer.slice(written);
			return originalBuffer.byteLength;
		}
	};
	FileDescriptorTable = class {
		constructor(options) {
			this.used = 0;
			this.size = options.size;
			this.fds = Array(options.size);
			this.stdio = [
				options.in,
				options.out,
				options.err
			];
			this.print = options.print;
			this.printErr = options.printErr;
			this.insertStdio(options.in, 0, "<stdin>");
			this.insertStdio(options.out, 1, "<stdout>");
			this.insertStdio(options.err, 2, "<stderr>");
		}
		insertStdio(fd, expected, name) {
			const type = 2;
			const { base, inheriting } = getRights(this.stdio, fd, 2, type);
			const wrap$2 = this.insert(fd, name, name, type, base, inheriting, 0);
			if (wrap$2.id !== expected) throw new WasiError(`id: ${wrap$2.id} !== expected: ${expected}`, 8);
			return wrap$2;
		}
		insert(fd, mappedPath, realPath, type, rightsBase, rightsInheriting, preopen) {
			var _a, _b;
			let index = -1;
			if (this.used >= this.size) {
				const newSize = this.size * 2;
				this.fds.length = newSize;
				index = this.size;
				this.size = newSize;
			} else for (let i$1 = 0; i$1 < this.size; ++i$1) if (this.fds[i$1] == null) {
				index = i$1;
				break;
			}
			let entry;
			if (mappedPath === "<stdout>") entry = new StandardOutput((_a = this.print) !== null && _a !== void 0 ? _a : console.log, index, fd, mappedPath, realPath, type, rightsBase, rightsInheriting, preopen);
			else if (mappedPath === "<stderr>") entry = new StandardOutput((_b = this.printErr) !== null && _b !== void 0 ? _b : console.error, index, fd, mappedPath, realPath, type, rightsBase, rightsInheriting, preopen);
			else entry = new FileDescriptor(index, fd, mappedPath, realPath, type, rightsBase, rightsInheriting, preopen);
			this.fds[index] = entry;
			this.used++;
			return entry;
		}
		get(id$1, base, inheriting) {
			if (id$1 >= this.size) throw new WasiError("Invalid fd", 8);
			const entry = this.fds[id$1];
			if (!entry || entry.id !== id$1) throw new WasiError("Bad file descriptor", 8);
			if ((~entry.rightsBase & base) !== BigInt(0) || (~entry.rightsInheriting & inheriting) !== BigInt(0)) throw new WasiError("Capabilities insufficient", 76);
			return entry;
		}
		remove(id$1) {
			if (id$1 >= this.size) throw new WasiError("Invalid fd", 8);
			const entry = this.fds[id$1];
			if (!entry || entry.id !== id$1) throw new WasiError("Bad file descriptor", 8);
			this.fds[id$1] = void 0;
			this.used--;
		}
	};
	SyncTable = class extends FileDescriptorTable {
		constructor(options) {
			super(options);
			this.fs = options.fs;
		}
		getFileTypeByFd(fd) {
			const stats = this.fs.fstatSync(fd, { bigint: true });
			return toFileType(stats);
		}
		insertPreopen(fd, mappedPath, realPath) {
			const type = this.getFileTypeByFd(fd);
			if (type !== 3) throw new WasiError(`Preopen not dir: ["${mappedPath}", "${realPath}"]`, 54);
			const result = getRights(this.stdio, fd, 0, type);
			return this.insert(fd, mappedPath, realPath, type, result.base, result.inheriting, 1);
		}
		renumber(dst, src) {
			if (dst === src) return;
			if (dst >= this.size || src >= this.size) throw new WasiError("Invalid fd", 8);
			const dstEntry = this.fds[dst];
			const srcEntry = this.fds[src];
			if (!dstEntry || !srcEntry || dstEntry.id !== dst || srcEntry.id !== src) throw new WasiError("Invalid fd", 8);
			this.fs.closeSync(dstEntry.fd);
			this.fds[dst] = this.fds[src];
			this.fds[dst].id = dst;
			this.fds[src] = void 0;
			this.used--;
		}
	};
	AsyncTable = class extends FileDescriptorTable {
		constructor(options) {
			super(options);
		}
		async getFileTypeByFd(fd) {
			const stats = await fd.stat({ bigint: true });
			return toFileType(stats);
		}
		async insertPreopen(fd, mappedPath, realPath) {
			const type = await this.getFileTypeByFd(fd);
			if (type !== 3) throw new WasiError(`Preopen not dir: ["${mappedPath}", "${realPath}"]`, 54);
			const result = getRights(this.stdio, fd.fd, 0, type);
			return this.insert(fd, mappedPath, realPath, type, result.base, result.inheriting, 1);
		}
		async renumber(dst, src) {
			if (dst === src) return;
			if (dst >= this.size || src >= this.size) throw new WasiError("Invalid fd", 8);
			const dstEntry = this.fds[dst];
			const srcEntry = this.fds[src];
			if (!dstEntry || !srcEntry || dstEntry.id !== dst || srcEntry.id !== src) throw new WasiError("Invalid fd", 8);
			await dstEntry.fd.close();
			this.fds[dst] = this.fds[src];
			this.fds[dst].id = dst;
			this.fds[src] = void 0;
			this.used--;
		}
	};
	WebAssemblyMemory = /* @__PURE__ */ function() {
		return _WebAssembly.Memory;
	}();
	Memory = class extends WebAssemblyMemory {
		constructor(descriptor) {
			super(descriptor);
		}
		get HEAP8() {
			return new Int8Array(super.buffer);
		}
		get HEAPU8() {
			return new Uint8Array(super.buffer);
		}
		get HEAP16() {
			return new Int16Array(super.buffer);
		}
		get HEAPU16() {
			return new Uint16Array(super.buffer);
		}
		get HEAP32() {
			return new Int32Array(super.buffer);
		}
		get HEAPU32() {
			return new Uint32Array(super.buffer);
		}
		get HEAP64() {
			return new BigInt64Array(super.buffer);
		}
		get HEAPU64() {
			return new BigUint64Array(super.buffer);
		}
		get HEAPF32() {
			return new Float32Array(super.buffer);
		}
		get HEAPF64() {
			return new Float64Array(super.buffer);
		}
		get view() {
			return new DataView(super.buffer);
		}
	};
	_memory = /* @__PURE__ */ new WeakMap();
	_wasi = /* @__PURE__ */ new WeakMap();
	_fs = /* @__PURE__ */ new WeakMap();
	encoder = /* @__PURE__ */ new TextEncoder();
	decoder = /* @__PURE__ */ new TextDecoder();
	INT64_MAX = (BigInt(1) << BigInt(63)) - BigInt(1);
	WASI$1 = class WASI$1$1 {
		constructor(args$1, env, fds, asyncFs, fs$1, asyncify) {
			this.args_get = syscallWrap(this, "args_get", function(argv, argv_buf) {
				argv = Number(argv);
				argv_buf = Number(argv_buf);
				if (argv === 0 || argv_buf === 0) return 28;
				const { HEAPU8, view } = getMemory(this);
				const args$1$1 = _wasi.get(this).args;
				for (let i$1 = 0; i$1 < args$1$1.length; ++i$1) {
					const arg = args$1$1[i$1];
					view.setInt32(argv, argv_buf, true);
					argv += 4;
					const data = encoder.encode(arg + "\0");
					HEAPU8.set(data, argv_buf);
					argv_buf += data.length;
				}
				return 0;
			});
			this.args_sizes_get = syscallWrap(this, "args_sizes_get", function(argc, argv_buf_size) {
				argc = Number(argc);
				argv_buf_size = Number(argv_buf_size);
				if (argc === 0 || argv_buf_size === 0) return 28;
				const { view } = getMemory(this);
				const args$1$1 = _wasi.get(this).args;
				view.setUint32(argc, args$1$1.length, true);
				view.setUint32(argv_buf_size, encoder.encode(args$1$1.join("\0") + "\0").length, true);
				return 0;
			});
			this.environ_get = syscallWrap(this, "environ_get", function(environ, environ_buf) {
				environ = Number(environ);
				environ_buf = Number(environ_buf);
				if (environ === 0 || environ_buf === 0) return 28;
				const { HEAPU8, view } = getMemory(this);
				const env$1 = _wasi.get(this).env;
				for (let i$1 = 0; i$1 < env$1.length; ++i$1) {
					const pair = env$1[i$1];
					view.setInt32(environ, environ_buf, true);
					environ += 4;
					const data = encoder.encode(pair + "\0");
					HEAPU8.set(data, environ_buf);
					environ_buf += data.length;
				}
				return 0;
			});
			this.environ_sizes_get = syscallWrap(this, "environ_sizes_get", function(len, buflen) {
				len = Number(len);
				buflen = Number(buflen);
				if (len === 0 || buflen === 0) return 28;
				const { view } = getMemory(this);
				const wasi = _wasi.get(this);
				view.setUint32(len, wasi.env.length, true);
				view.setUint32(buflen, encoder.encode(wasi.env.join("\0") + "\0").length, true);
				return 0;
			});
			this.clock_res_get = syscallWrap(this, "clock_res_get", function(id$1, resolution) {
				resolution = Number(resolution);
				if (resolution === 0) return 28;
				const { view } = getMemory(this);
				switch (id$1) {
					case 0:
						view.setBigUint64(resolution, BigInt(1e6), true);
						return 0;
					case 1:
					case 2:
					case 3:
						view.setBigUint64(resolution, BigInt(1e3), true);
						return 0;
					default: return 28;
				}
			});
			this.clock_time_get = syscallWrap(this, "clock_time_get", function(id$1, _percision, time) {
				time = Number(time);
				if (time === 0) return 28;
				const { view } = getMemory(this);
				switch (id$1) {
					case 0:
						view.setBigUint64(time, BigInt(Date.now()) * BigInt(1e6), true);
						return 0;
					case 1:
					case 2:
					case 3: {
						const t$3 = performance.now() / 1e3;
						const s$1 = Math.trunc(t$3);
						const ms = Math.floor((t$3 - s$1) * 1e3);
						const result = BigInt(s$1) * BigInt(1e9) + BigInt(ms) * BigInt(1e6);
						view.setBigUint64(time, result, true);
						return 0;
					}
					default: return 28;
				}
			});
			this.fd_advise = syscallWrap(this, "fd_advise", function(_fd, _offset, _len, _advice) {
				return 52;
			});
			this.fd_fdstat_get = syscallWrap(this, "fd_fdstat_get", function(fd, fdstat) {
				fdstat = Number(fdstat);
				if (fdstat === 0) return 28;
				const fileDescriptor = _wasi.get(this).fds.get(fd, BigInt(0), BigInt(0));
				const { view } = getMemory(this);
				view.setUint16(fdstat, fileDescriptor.type, true);
				view.setUint16(fdstat + 2, 0, true);
				view.setBigUint64(fdstat + 8, fileDescriptor.rightsBase, true);
				view.setBigUint64(fdstat + 16, fileDescriptor.rightsInheriting, true);
				return 0;
			});
			this.fd_fdstat_set_flags = syscallWrap(this, "fd_fdstat_set_flags", function(_fd, _flags) {
				return 52;
			});
			this.fd_fdstat_set_rights = syscallWrap(this, "fd_fdstat_set_rights", function(fd, rightsBase, rightsInheriting) {
				const fileDescriptor = _wasi.get(this).fds.get(fd, BigInt(0), BigInt(0));
				if ((rightsBase | fileDescriptor.rightsBase) > fileDescriptor.rightsBase) return 76;
				if ((rightsInheriting | fileDescriptor.rightsInheriting) > fileDescriptor.rightsInheriting) return 76;
				fileDescriptor.rightsBase = rightsBase;
				fileDescriptor.rightsInheriting = rightsInheriting;
				return 0;
			});
			this.fd_prestat_get = syscallWrap(this, "fd_prestat_get", function(fd, prestat) {
				prestat = Number(prestat);
				if (prestat === 0) return 28;
				const wasi = _wasi.get(this);
				let fileDescriptor;
				try {
					fileDescriptor = wasi.fds.get(fd, BigInt(0), BigInt(0));
				} catch (err) {
					if (err instanceof WasiError) return err.errno;
					throw err;
				}
				if (fileDescriptor.preopen !== 1) return 28;
				const { view } = getMemory(this);
				view.setUint32(prestat, 0, true);
				view.setUint32(prestat + 4, encoder.encode(fileDescriptor.path).length, true);
				return 0;
			});
			this.fd_prestat_dir_name = syscallWrap(this, "fd_prestat_dir_name", function(fd, path$1, path_len) {
				path$1 = Number(path$1);
				path_len = Number(path_len);
				if (path$1 === 0) return 28;
				const fileDescriptor = _wasi.get(this).fds.get(fd, BigInt(0), BigInt(0));
				if (fileDescriptor.preopen !== 1) return 8;
				const buffer = encoder.encode(fileDescriptor.path);
				if (buffer.length > path_len) return 42;
				const { HEAPU8 } = getMemory(this);
				HEAPU8.set(buffer, path$1);
				return 0;
			});
			this.fd_seek = syscallWrap(this, "fd_seek", function(fd, offset, whence, newOffset) {
				newOffset = Number(newOffset);
				if (newOffset === 0) return 28;
				if (fd === 0 || fd === 1 || fd === 2) return 0;
				const r$1 = _wasi.get(this).fds.get(fd, WasiRights.FD_SEEK, BigInt(0)).seek(offset, whence);
				const { view } = getMemory(this);
				view.setBigUint64(newOffset, r$1, true);
				return 0;
			});
			this.fd_tell = syscallWrap(this, "fd_tell", function(fd, offset) {
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_TELL, BigInt(0));
				const pos = BigInt(fileDescriptor.pos);
				const { view } = getMemory(this);
				view.setBigUint64(Number(offset), pos, true);
				return 0;
			});
			this.poll_oneoff = syscallWrap(this, "poll_oneoff", function(in_ptr, out_ptr, nsubscriptions, nevents) {
				in_ptr = Number(in_ptr);
				out_ptr = Number(out_ptr);
				nevents = Number(nevents);
				nsubscriptions = Number(nsubscriptions);
				nsubscriptions = nsubscriptions >>> 0;
				if (in_ptr === 0 || out_ptr === 0 || nsubscriptions === 0 || nevents === 0) return 28;
				const { view } = getMemory(this);
				view.setUint32(nevents, 0, true);
				let i$1 = 0;
				let timer_userdata = BigInt(0);
				let cur_timeout = BigInt(0);
				let has_timeout = 0;
				let min_timeout = BigInt(0);
				let sub;
				const subscriptions = Array(nsubscriptions);
				for (i$1 = 0; i$1 < nsubscriptions; i$1++) {
					sub = in_ptr + i$1 * 48;
					const userdata = view.getBigUint64(sub, true);
					const type = view.getUint8(sub + 8);
					const clockIdOrFd = view.getUint32(sub + 16, true);
					const timeout = view.getBigUint64(sub + 24, true);
					const precision = view.getBigUint64(sub + 32, true);
					const flags = view.getUint16(sub + 40, true);
					subscriptions[i$1] = {
						userdata,
						type,
						u: {
							clock: {
								clock_id: clockIdOrFd,
								timeout,
								precision,
								flags
							},
							fd_readwrite: { fd: clockIdOrFd }
						}
					};
				}
				const fdevents = [];
				for (i$1 = 0; i$1 < nsubscriptions; i$1++) {
					sub = subscriptions[i$1];
					switch (sub.type) {
						case 0:
							if (sub.u.clock.flags === 1) {
								const now = BigInt(Date.now()) * BigInt(1e6);
								cur_timeout = sub.u.clock.timeout - now;
							} else cur_timeout = sub.u.clock.timeout;
							if (has_timeout === 0 || cur_timeout < min_timeout) {
								min_timeout = cur_timeout;
								timer_userdata = sub.userdata;
								has_timeout = 1;
							}
							break;
						case 1:
						case 2:
							fdevents.push(sub);
							break;
						default: return 28;
					}
				}
				if (fdevents.length > 0) {
					for (i$1 = 0; i$1 < fdevents.length; i$1++) {
						const fdevent = fdevents[i$1];
						const event = out_ptr + 32 * i$1;
						view.setBigUint64(event, fdevent.userdata, true);
						view.setUint32(event + 8, 52, true);
						view.setUint32(event + 12, fdevent.type, true);
						view.setBigUint64(event + 16, BigInt(0), true);
						view.setUint16(event + 24, 0, true);
						view.setUint32(nevents, 1, true);
					}
					view.setUint32(nevents, fdevents.length, true);
					return 0;
				}
				if (has_timeout) {
					const delay = Number(min_timeout / BigInt(1e6));
					sleepBreakIf(delay, () => false);
					const event = out_ptr;
					view.setBigUint64(event, timer_userdata, true);
					view.setUint32(event + 8, 0, true);
					view.setUint32(event + 12, 0, true);
					view.setUint32(nevents, 1, true);
				}
				return 0;
			});
			this.proc_exit = syscallWrap(this, "proc_exit", function(rval) {
				if (typeof process === "object" && process !== null && typeof process.exit === "function") process.exit(rval);
				return 0;
			});
			this.proc_raise = syscallWrap(this, "proc_raise", function(_sig) {
				return 52;
			});
			this.sched_yield = syscallWrap(this, "sched_yield", function() {
				return 0;
			});
			this.random_get = typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function" ? syscallWrap(this, "random_get", function(buf, buf_len) {
				buf = Number(buf);
				if (buf === 0) return 28;
				buf_len = Number(buf_len);
				const { HEAPU8, view } = getMemory(this);
				if (typeof SharedArrayBuffer === "function" && HEAPU8.buffer instanceof SharedArrayBuffer || Object.prototype.toString.call(HEAPU8.buffer) === "[object SharedArrayBuffer]") {
					for (let i$1 = buf; i$1 < buf + buf_len; ++i$1) view.setUint8(i$1, Math.floor(Math.random() * 256));
					return 0;
				}
				let pos;
				const stride = 65536;
				for (pos = 0; pos + stride < buf_len; pos += stride) crypto.getRandomValues(HEAPU8.subarray(buf + pos, buf + pos + stride));
				crypto.getRandomValues(HEAPU8.subarray(buf + pos, buf + buf_len));
				return 0;
			}) : syscallWrap(this, "random_get", function(buf, buf_len) {
				buf = Number(buf);
				if (buf === 0) return 28;
				buf_len = Number(buf_len);
				const { view } = getMemory(this);
				for (let i$1 = buf; i$1 < buf + buf_len; ++i$1) view.setUint8(i$1, Math.floor(Math.random() * 256));
				return 0;
			});
			this.sock_recv = syscallWrap(this, "sock_recv", function() {
				return 58;
			});
			this.sock_send = syscallWrap(this, "sock_send", function() {
				return 58;
			});
			this.sock_shutdown = syscallWrap(this, "sock_shutdown", function() {
				return 58;
			});
			this.sock_accept = syscallWrap(this, "sock_accept", function() {
				return 58;
			});
			_wasi.set(this, {
				fds,
				args: args$1,
				env
			});
			if (fs$1) _fs.set(this, fs$1);
			const _this = this;
			function defineImport(name, syncVersion, asyncVersion, parameterType, returnType) {
				if (asyncFs) if (asyncify) _this[name] = asyncify.wrapImportFunction(syscallWrap(_this, name, asyncVersion));
				else _this[name] = wrapAsyncImport(syscallWrap(_this, name, asyncVersion), parameterType, returnType);
				else _this[name] = syscallWrap(_this, name, syncVersion);
			}
			defineImport("fd_allocate", function fd_allocate(fd, offset, len) {
				const wasi = _wasi.get(this);
				const fs$2 = getFs(this);
				const fileDescriptor = wasi.fds.get(fd, WasiRights.FD_ALLOCATE, BigInt(0));
				if (fs$2.fstatSync(fileDescriptor.fd, { bigint: true }).size < offset + len) fs$2.ftruncateSync(fileDescriptor.fd, Number(offset + len));
				return 0;
			}, async function fd_allocate(fd, offset, len) {
				const h$1 = _wasi.get(this).fds.get(fd, WasiRights.FD_ALLOCATE, BigInt(0)).fd;
				if ((await h$1.stat({ bigint: true })).size < offset + len) await h$1.truncate(Number(offset + len));
				return 0;
			}, [
				"i32",
				"i64",
				"f64"
			], ["i32"]);
			defineImport("fd_close", function fd_close(fd) {
				const wasi = _wasi.get(this);
				const fileDescriptor = wasi.fds.get(fd, BigInt(0), BigInt(0));
				getFs(this).closeSync(fileDescriptor.fd);
				wasi.fds.remove(fd);
				return 0;
			}, async function fd_close(fd) {
				const wasi = _wasi.get(this);
				await wasi.fds.get(fd, BigInt(0), BigInt(0)).fd.close();
				wasi.fds.remove(fd);
				return 0;
			}, ["i32"], ["i32"]);
			defineImport("fd_datasync", function fd_datasync(fd) {
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_DATASYNC, BigInt(0));
				getFs(this).fdatasyncSync(fileDescriptor.fd);
				return 0;
			}, async function fd_datasync(fd) {
				await _wasi.get(this).fds.get(fd, WasiRights.FD_DATASYNC, BigInt(0)).fd.datasync();
				return 0;
			}, ["i32"], ["i32"]);
			defineImport("fd_filestat_get", function fd_filestat_get(fd, buf) {
				buf = Number(buf);
				if (buf === 0) return 28;
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_FILESTAT_GET, BigInt(0));
				const stat = getFs(this).fstatSync(fileDescriptor.fd, { bigint: true });
				const { view } = getMemory(this);
				toFileStat(view, buf, stat);
				return 0;
			}, async function fd_filestat_get(fd, buf) {
				buf = Number(buf);
				if (buf === 0) return 28;
				const stat = await _wasi.get(this).fds.get(fd, WasiRights.FD_FILESTAT_GET, BigInt(0)).fd.stat({ bigint: true });
				const { view } = getMemory(this);
				toFileStat(view, buf, stat);
				return 0;
			}, ["i32", "i32"], ["i32"]);
			defineImport("fd_filestat_set_size", function fd_filestat_set_size(fd, size) {
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_FILESTAT_SET_SIZE, BigInt(0));
				getFs(this).ftruncateSync(fileDescriptor.fd, Number(size));
				return 0;
			}, async function fd_filestat_set_size(fd, size) {
				await _wasi.get(this).fds.get(fd, WasiRights.FD_FILESTAT_SET_SIZE, BigInt(0)).fd.truncate(Number(size));
				return 0;
			}, ["i32", "i64"], ["i32"]);
			function fdFilestatGetTimes(fd, atim, mtim, flags) {
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_FILESTAT_SET_TIMES, BigInt(0));
				if ((flags & 2) === 2) atim = BigInt(Date.now() * 1e6);
				if ((flags & 8) === 8) mtim = BigInt(Date.now() * 1e6);
				return {
					fileDescriptor,
					atim,
					mtim
				};
			}
			defineImport("fd_filestat_set_times", function fd_filestat_set_times(fd, atim, mtim, flags) {
				if (validateFstFlagsOrReturn(flags)) return 28;
				const { fileDescriptor, atim: atimRes, mtim: mtimRes } = fdFilestatGetTimes.call(this, fd, atim, mtim, flags);
				getFs(this).futimesSync(fileDescriptor.fd, Number(atimRes), Number(mtimRes));
				return 0;
			}, async function fd_filestat_set_times(fd, atim, mtim, flags) {
				if (validateFstFlagsOrReturn(flags)) return 28;
				const { fileDescriptor, atim: atimRes, mtim: mtimRes } = fdFilestatGetTimes.call(this, fd, atim, mtim, flags);
				await fileDescriptor.fd.utimes(Number(atimRes), Number(mtimRes));
				return 0;
			}, [
				"i32",
				"i64",
				"i64",
				"i32"
			], ["i32"]);
			defineImport("fd_pread", function fd_pread(fd, iovs, iovslen, offset, size) {
				iovs = Number(iovs);
				size = Number(size);
				if (iovs === 0 && iovslen || size === 0 || offset > INT64_MAX) return 28;
				const { HEAPU8, view } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_READ | WasiRights.FD_SEEK, BigInt(0));
				if (!iovslen) {
					view.setUint32(size, 0, true);
					return 0;
				}
				let totalSize = 0;
				const ioVecs = Array.from({ length: Number(iovslen) }, (_, i$1) => {
					const offset$1 = iovs + i$1 * 8;
					const buf = view.getInt32(offset$1, true);
					const bufLen = view.getUint32(offset$1 + 4, true);
					totalSize += bufLen;
					return HEAPU8.subarray(buf, buf + bufLen);
				});
				let nread = 0;
				const buffer = (() => {
					try {
						return new Uint8Array(new SharedArrayBuffer(totalSize));
					} catch (_) {
						return new Uint8Array(totalSize);
					}
				})();
				buffer._isBuffer = true;
				const bytesRead = getFs(this).readSync(fileDescriptor.fd, buffer, 0, buffer.length, Number(offset));
				nread = buffer ? copyMemory(ioVecs, buffer.subarray(0, bytesRead)) : 0;
				view.setUint32(size, nread, true);
				return 0;
			}, async function(fd, iovs, iovslen, offset, size) {
				iovs = Number(iovs);
				size = Number(size);
				if (iovs === 0 && iovslen || size === 0 || offset > INT64_MAX) return 28;
				const { HEAPU8, view } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_READ | WasiRights.FD_SEEK, BigInt(0));
				if (!iovslen) {
					view.setUint32(size, 0, true);
					return 0;
				}
				let totalSize = 0;
				const ioVecs = Array.from({ length: Number(iovslen) }, (_, i$1) => {
					const offset$1 = iovs + i$1 * 8;
					const buf = view.getInt32(offset$1, true);
					const bufLen = view.getUint32(offset$1 + 4, true);
					totalSize += bufLen;
					return HEAPU8.subarray(buf, buf + bufLen);
				});
				let nread = 0;
				const buffer = new Uint8Array(totalSize);
				buffer._isBuffer = true;
				const { bytesRead } = await fileDescriptor.fd.read(buffer, 0, buffer.length, Number(offset));
				nread = buffer ? copyMemory(ioVecs, buffer.subarray(0, bytesRead)) : 0;
				view.setUint32(size, nread, true);
				return 0;
			}, [
				"i32",
				"i32",
				"i32",
				"i64",
				"i32"
			], ["i32"]);
			defineImport("fd_pwrite", function fd_pwrite(fd, iovs, iovslen, offset, size) {
				iovs = Number(iovs);
				size = Number(size);
				if (iovs === 0 && iovslen || size === 0 || offset > INT64_MAX) return 28;
				const { HEAPU8, view } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_WRITE | WasiRights.FD_SEEK, BigInt(0));
				if (!iovslen) {
					view.setUint32(size, 0, true);
					return 0;
				}
				const buffer = concatBuffer(Array.from({ length: Number(iovslen) }, (_, i$1) => {
					const offset$1 = iovs + i$1 * 8;
					const buf = view.getInt32(offset$1, true);
					const bufLen = view.getUint32(offset$1 + 4, true);
					return HEAPU8.subarray(buf, buf + bufLen);
				}));
				const nwritten = getFs(this).writeSync(fileDescriptor.fd, buffer, 0, buffer.length, Number(offset));
				view.setUint32(size, nwritten, true);
				return 0;
			}, async function fd_pwrite(fd, iovs, iovslen, offset, size) {
				iovs = Number(iovs);
				size = Number(size);
				if (iovs === 0 && iovslen || size === 0 || offset > INT64_MAX) return 28;
				const { HEAPU8, view } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_WRITE | WasiRights.FD_SEEK, BigInt(0));
				if (!iovslen) {
					view.setUint32(size, 0, true);
					return 0;
				}
				const buffer = concatBuffer(Array.from({ length: Number(iovslen) }, (_, i$1) => {
					const offset$1 = iovs + i$1 * 8;
					const buf = view.getInt32(offset$1, true);
					const bufLen = view.getUint32(offset$1 + 4, true);
					return HEAPU8.subarray(buf, buf + bufLen);
				}));
				const { bytesWritten } = await fileDescriptor.fd.write(buffer, 0, buffer.length, Number(offset));
				view.setUint32(size, bytesWritten, true);
				return 0;
			}, [
				"i32",
				"i32",
				"i32",
				"i64",
				"i32"
			], ["i32"]);
			defineImport("fd_read", function fd_read(fd, iovs, iovslen, size) {
				iovs = Number(iovs);
				size = Number(size);
				if (iovs === 0 && iovslen || size === 0) return 28;
				const { HEAPU8, view } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_READ, BigInt(0));
				if (!iovslen) {
					view.setUint32(size, 0, true);
					return 0;
				}
				let totalSize = 0;
				const ioVecs = Array.from({ length: Number(iovslen) }, (_, i$1) => {
					const offset = iovs + i$1 * 8;
					const buf = view.getInt32(offset, true);
					const bufLen = view.getUint32(offset + 4, true);
					totalSize += bufLen;
					return HEAPU8.subarray(buf, buf + bufLen);
				});
				let buffer;
				let nread = 0;
				if (fd === 0) {
					if (typeof window === "undefined" || typeof window.prompt !== "function") return 58;
					buffer = readStdin();
					nread = buffer ? copyMemory(ioVecs, buffer) : 0;
				} else {
					buffer = (() => {
						try {
							return new Uint8Array(new SharedArrayBuffer(totalSize));
						} catch (_) {
							return new Uint8Array(totalSize);
						}
					})();
					buffer._isBuffer = true;
					const bytesRead = getFs(this).readSync(fileDescriptor.fd, buffer, 0, buffer.length, Number(fileDescriptor.pos));
					nread = buffer ? copyMemory(ioVecs, buffer.subarray(0, bytesRead)) : 0;
					fileDescriptor.pos += BigInt(nread);
				}
				view.setUint32(size, nread, true);
				return 0;
			}, async function fd_read(fd, iovs, iovslen, size) {
				iovs = Number(iovs);
				size = Number(size);
				if (iovs === 0 && iovslen || size === 0) return 28;
				const { HEAPU8, view } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_READ, BigInt(0));
				if (!iovslen) {
					view.setUint32(size, 0, true);
					return 0;
				}
				let totalSize = 0;
				const ioVecs = Array.from({ length: Number(iovslen) }, (_, i$1) => {
					const offset = iovs + i$1 * 8;
					const buf = view.getInt32(offset, true);
					const bufLen = view.getUint32(offset + 4, true);
					totalSize += bufLen;
					return HEAPU8.subarray(buf, buf + bufLen);
				});
				let buffer;
				let nread = 0;
				if (fd === 0) {
					if (typeof window === "undefined" || typeof window.prompt !== "function") return 58;
					buffer = readStdin();
					nread = buffer ? copyMemory(ioVecs, buffer) : 0;
				} else {
					buffer = new Uint8Array(totalSize);
					buffer._isBuffer = true;
					const { bytesRead } = await fileDescriptor.fd.read(buffer, 0, buffer.length, Number(fileDescriptor.pos));
					nread = buffer ? copyMemory(ioVecs, buffer.subarray(0, bytesRead)) : 0;
					fileDescriptor.pos += BigInt(nread);
				}
				view.setUint32(size, nread, true);
				return 0;
			}, [
				"i32",
				"i32",
				"i32",
				"i32"
			], ["i32"]);
			defineImport("fd_readdir", function fd_readdir(fd, buf, buf_len, cookie, bufused) {
				buf = Number(buf);
				buf_len = Number(buf_len);
				bufused = Number(bufused);
				if (buf === 0 || bufused === 0) return 0;
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_READDIR, BigInt(0));
				const fs$2 = getFs(this);
				const entries = fs$2.readdirSync(fileDescriptor.realPath, { withFileTypes: true });
				const { HEAPU8, view } = getMemory(this);
				let bufferUsed = 0;
				for (let i$1 = Number(cookie); i$1 < entries.length; i$1++) {
					const nameData = encoder.encode(entries[i$1].name);
					const entryInfo = fs$2.statSync(resolve$1(fileDescriptor.realPath, entries[i$1].name), { bigint: true });
					const entryData = new Uint8Array(24 + nameData.byteLength);
					const entryView = new DataView(entryData.buffer);
					entryView.setBigUint64(0, BigInt(i$1 + 1), true);
					entryView.setBigUint64(8, BigInt(entryInfo.ino ? entryInfo.ino : 0), true);
					entryView.setUint32(16, nameData.byteLength, true);
					let type;
					if (entries[i$1].isFile()) type = 4;
					else if (entries[i$1].isDirectory()) type = 3;
					else if (entries[i$1].isSymbolicLink()) type = 7;
					else if (entries[i$1].isCharacterDevice()) type = 2;
					else if (entries[i$1].isBlockDevice()) type = 1;
					else if (entries[i$1].isSocket()) type = 6;
					else type = 0;
					entryView.setUint8(20, type);
					entryData.set(nameData, 24);
					const data = entryData.slice(0, Math.min(entryData.length, buf_len - bufferUsed));
					HEAPU8.set(data, buf + bufferUsed);
					bufferUsed += data.byteLength;
				}
				view.setUint32(bufused, bufferUsed, true);
				return 0;
			}, async function fd_readdir(fd, buf, buf_len, cookie, bufused) {
				buf = Number(buf);
				buf_len = Number(buf_len);
				bufused = Number(bufused);
				if (buf === 0 || bufused === 0) return 0;
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_READDIR, BigInt(0));
				const fs$2 = getFs(this);
				const entries = await fs$2.promises.readdir(fileDescriptor.realPath, { withFileTypes: true });
				const { HEAPU8, view } = getMemory(this);
				let bufferUsed = 0;
				for (let i$1 = Number(cookie); i$1 < entries.length; i$1++) {
					const nameData = encoder.encode(entries[i$1].name);
					const entryInfo = await fs$2.promises.stat(resolve$1(fileDescriptor.realPath, entries[i$1].name), { bigint: true });
					const entryData = new Uint8Array(24 + nameData.byteLength);
					const entryView = new DataView(entryData.buffer);
					entryView.setBigUint64(0, BigInt(i$1 + 1), true);
					entryView.setBigUint64(8, BigInt(entryInfo.ino ? entryInfo.ino : 0), true);
					entryView.setUint32(16, nameData.byteLength, true);
					let type;
					if (entries[i$1].isFile()) type = 4;
					else if (entries[i$1].isDirectory()) type = 3;
					else if (entries[i$1].isSymbolicLink()) type = 7;
					else if (entries[i$1].isCharacterDevice()) type = 2;
					else if (entries[i$1].isBlockDevice()) type = 1;
					else if (entries[i$1].isSocket()) type = 6;
					else type = 0;
					entryView.setUint8(20, type);
					entryData.set(nameData, 24);
					const data = entryData.slice(0, Math.min(entryData.length, buf_len - bufferUsed));
					HEAPU8.set(data, buf + bufferUsed);
					bufferUsed += data.byteLength;
				}
				view.setUint32(bufused, bufferUsed, true);
				return 0;
			}, [
				"i32",
				"i32",
				"i32",
				"i64",
				"i32"
			], ["i32"]);
			defineImport("fd_renumber", function fd_renumber(from, to) {
				_wasi.get(this).fds.renumber(to, from);
				return 0;
			}, async function fd_renumber(from, to) {
				await _wasi.get(this).fds.renumber(to, from);
				return 0;
			}, ["i32", "i32"], ["i32"]);
			defineImport("fd_sync", function fd_sync(fd) {
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_SYNC, BigInt(0));
				getFs(this).fsyncSync(fileDescriptor.fd);
				return 0;
			}, async function fd_sync(fd) {
				await _wasi.get(this).fds.get(fd, WasiRights.FD_SYNC, BigInt(0)).fd.sync();
				return 0;
			}, ["i32"], ["i32"]);
			defineImport("fd_write", function fd_write(fd, iovs, iovslen, size) {
				iovs = Number(iovs);
				size = Number(size);
				if (iovs === 0 && iovslen || size === 0) return 28;
				const { HEAPU8, view } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_WRITE, BigInt(0));
				if (!iovslen) {
					view.setUint32(size, 0, true);
					return 0;
				}
				const buffer = concatBuffer(Array.from({ length: Number(iovslen) }, (_, i$1) => {
					const offset = iovs + i$1 * 8;
					const buf = view.getInt32(offset, true);
					const bufLen = view.getUint32(offset + 4, true);
					return HEAPU8.subarray(buf, buf + bufLen);
				}));
				let nwritten;
				if (fd === 1 || fd === 2) nwritten = fileDescriptor.write(buffer);
				else {
					nwritten = getFs(this).writeSync(fileDescriptor.fd, buffer, 0, buffer.length, Number(fileDescriptor.pos));
					fileDescriptor.pos += BigInt(nwritten);
				}
				view.setUint32(size, nwritten, true);
				return 0;
			}, async function fd_write(fd, iovs, iovslen, size) {
				iovs = Number(iovs);
				size = Number(size);
				if (iovs === 0 && iovslen || size === 0) return 28;
				const { HEAPU8, view } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.FD_WRITE, BigInt(0));
				if (!iovslen) {
					view.setUint32(size, 0, true);
					return 0;
				}
				const buffer = concatBuffer(Array.from({ length: Number(iovslen) }, (_, i$1) => {
					const offset = iovs + i$1 * 8;
					const buf = view.getInt32(offset, true);
					const bufLen = view.getUint32(offset + 4, true);
					return HEAPU8.subarray(buf, buf + bufLen);
				}));
				let nwritten;
				if (fd === 1 || fd === 2) nwritten = fileDescriptor.write(buffer);
				else {
					nwritten = await (await fileDescriptor.fd.write(buffer, 0, buffer.length, Number(fileDescriptor.pos))).bytesWritten;
					fileDescriptor.pos += BigInt(nwritten);
				}
				view.setUint32(size, nwritten, true);
				return 0;
			}, [
				"i32",
				"i32",
				"i32",
				"i32"
			], ["i32"]);
			defineImport("path_create_directory", function path_create_directory(fd, path$1, path_len) {
				path$1 = Number(path$1);
				path_len = Number(path_len);
				if (path$1 === 0) return 28;
				const { HEAPU8 } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.PATH_CREATE_DIRECTORY, BigInt(0));
				let pathString = decoder.decode(unsharedSlice(HEAPU8, path$1, path$1 + path_len));
				pathString = resolve$1(fileDescriptor.realPath, pathString);
				getFs(this).mkdirSync(pathString);
				return 0;
			}, async function path_create_directory(fd, path$1, path_len) {
				path$1 = Number(path$1);
				path_len = Number(path_len);
				if (path$1 === 0) return 28;
				const { HEAPU8 } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.PATH_CREATE_DIRECTORY, BigInt(0));
				let pathString = decoder.decode(unsharedSlice(HEAPU8, path$1, path$1 + path_len));
				pathString = resolve$1(fileDescriptor.realPath, pathString);
				await getFs(this).promises.mkdir(pathString);
				return 0;
			}, [
				"i32",
				"i32",
				"i32"
			], ["i32"]);
			defineImport("path_filestat_get", function path_filestat_get(fd, flags, path$1, path_len, filestat) {
				path$1 = Number(path$1);
				path_len = Number(path_len);
				filestat = Number(filestat);
				if (path$1 === 0 || filestat === 0) return 28;
				const { HEAPU8, view } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.PATH_FILESTAT_GET, BigInt(0));
				let pathString = decoder.decode(unsharedSlice(HEAPU8, path$1, path$1 + path_len));
				const fs$2 = getFs(this);
				pathString = resolve$1(fileDescriptor.realPath, pathString);
				let stat;
				if ((flags & 1) === 1) stat = fs$2.statSync(pathString, { bigint: true });
				else stat = fs$2.lstatSync(pathString, { bigint: true });
				toFileStat(view, filestat, stat);
				return 0;
			}, async function path_filestat_get(fd, flags, path$1, path_len, filestat) {
				path$1 = Number(path$1);
				path_len = Number(path_len);
				filestat = Number(filestat);
				if (path$1 === 0 || filestat === 0) return 28;
				const { HEAPU8, view } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.PATH_FILESTAT_GET, BigInt(0));
				let pathString = decoder.decode(unsharedSlice(HEAPU8, path$1, path$1 + path_len));
				const fs$2 = getFs(this);
				pathString = resolve$1(fileDescriptor.realPath, pathString);
				let stat;
				if ((flags & 1) === 1) stat = await fs$2.promises.stat(pathString, { bigint: true });
				else stat = await fs$2.promises.lstat(pathString, { bigint: true });
				toFileStat(view, filestat, stat);
				return 0;
			}, [
				"i32",
				"i32",
				"i32",
				"i32",
				"i32"
			], ["i32"]);
			defineImport("path_filestat_set_times", function path_filestat_set_times(fd, flags, path$1, path_len, atim, mtim, fst_flags) {
				path$1 = Number(path$1);
				path_len = Number(path_len);
				if (path$1 === 0) return 28;
				const { HEAPU8 } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.PATH_FILESTAT_SET_TIMES, BigInt(0));
				if (validateFstFlagsOrReturn(fst_flags)) return 28;
				const fs$2 = getFs(this);
				const resolvedPath = resolvePathSync(fs$2, fileDescriptor, decoder.decode(unsharedSlice(HEAPU8, path$1, path$1 + path_len)), flags);
				if ((fst_flags & 2) === 2) atim = BigInt(Date.now() * 1e6);
				if ((fst_flags & 8) === 8) mtim = BigInt(Date.now() * 1e6);
				fs$2.utimesSync(resolvedPath, Number(atim), Number(mtim));
				return 0;
			}, async function path_filestat_set_times(fd, flags, path$1, path_len, atim, mtim, fst_flags) {
				path$1 = Number(path$1);
				path_len = Number(path_len);
				if (path$1 === 0) return 28;
				const { HEAPU8 } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.PATH_FILESTAT_SET_TIMES, BigInt(0));
				if (validateFstFlagsOrReturn(fst_flags)) return 28;
				const fs$2 = getFs(this);
				const resolvedPath = await resolvePathAsync(fs$2, fileDescriptor, decoder.decode(unsharedSlice(HEAPU8, path$1, path$1 + path_len)), flags);
				if ((fst_flags & 2) === 2) atim = BigInt(Date.now() * 1e6);
				if ((fst_flags & 8) === 8) mtim = BigInt(Date.now() * 1e6);
				await fs$2.promises.utimes(resolvedPath, Number(atim), Number(mtim));
				return 0;
			}, [
				"i32",
				"i32",
				"i32",
				"i32",
				"i64",
				"i64",
				"i32"
			], ["i32"]);
			defineImport("path_link", function path_link(old_fd, old_flags, old_path, old_path_len, new_fd, new_path, new_path_len) {
				old_path = Number(old_path);
				old_path_len = Number(old_path_len);
				new_path = Number(new_path);
				new_path_len = Number(new_path_len);
				if (old_path === 0 || new_path === 0) return 28;
				const wasi = _wasi.get(this);
				let oldWrap;
				let newWrap;
				if (old_fd === new_fd) oldWrap = newWrap = wasi.fds.get(old_fd, WasiRights.PATH_LINK_SOURCE | WasiRights.PATH_LINK_TARGET, BigInt(0));
				else {
					oldWrap = wasi.fds.get(old_fd, WasiRights.PATH_LINK_SOURCE, BigInt(0));
					newWrap = wasi.fds.get(new_fd, WasiRights.PATH_LINK_TARGET, BigInt(0));
				}
				const { HEAPU8 } = getMemory(this);
				const fs$2 = getFs(this);
				const resolvedOldPath = resolvePathSync(fs$2, oldWrap, decoder.decode(unsharedSlice(HEAPU8, old_path, old_path + old_path_len)), old_flags);
				const resolvedNewPath = resolve$1(newWrap.realPath, decoder.decode(unsharedSlice(HEAPU8, new_path, new_path + new_path_len)));
				fs$2.linkSync(resolvedOldPath, resolvedNewPath);
				return 0;
			}, async function path_link(old_fd, old_flags, old_path, old_path_len, new_fd, new_path, new_path_len) {
				old_path = Number(old_path);
				old_path_len = Number(old_path_len);
				new_path = Number(new_path);
				new_path_len = Number(new_path_len);
				if (old_path === 0 || new_path === 0) return 28;
				const wasi = _wasi.get(this);
				let oldWrap;
				let newWrap;
				if (old_fd === new_fd) oldWrap = newWrap = wasi.fds.get(old_fd, WasiRights.PATH_LINK_SOURCE | WasiRights.PATH_LINK_TARGET, BigInt(0));
				else {
					oldWrap = wasi.fds.get(old_fd, WasiRights.PATH_LINK_SOURCE, BigInt(0));
					newWrap = wasi.fds.get(new_fd, WasiRights.PATH_LINK_TARGET, BigInt(0));
				}
				const { HEAPU8 } = getMemory(this);
				const fs$2 = getFs(this);
				const resolvedOldPath = await resolvePathAsync(fs$2, oldWrap, decoder.decode(unsharedSlice(HEAPU8, old_path, old_path + old_path_len)), old_flags);
				const resolvedNewPath = resolve$1(newWrap.realPath, decoder.decode(unsharedSlice(HEAPU8, new_path, new_path + new_path_len)));
				await fs$2.promises.link(resolvedOldPath, resolvedNewPath);
				return 0;
			}, [
				"i32",
				"i32",
				"i32",
				"i32",
				"i32",
				"i32",
				"i32"
			], ["i32"]);
			function pathOpen(o_flags, fs_rights_base, fs_rights_inheriting, fs_flags) {
				const read = (fs_rights_base & (WasiRights.FD_READ | WasiRights.FD_READDIR)) !== BigInt(0);
				const write = (fs_rights_base & (WasiRights.FD_DATASYNC | WasiRights.FD_WRITE | WasiRights.FD_ALLOCATE | WasiRights.FD_FILESTAT_SET_SIZE)) !== BigInt(0);
				let flags = write ? read ? 2 : 1 : 0;
				let needed_base = WasiRights.PATH_OPEN;
				let needed_inheriting = fs_rights_base | fs_rights_inheriting;
				if ((o_flags & 1) !== 0) {
					flags |= 64;
					needed_base |= WasiRights.PATH_CREATE_FILE;
				}
				if ((o_flags & 2) !== 0) flags |= 65536;
				if ((o_flags & 4) !== 0) flags |= 128;
				if ((o_flags & 8) !== 0) {
					flags |= 512;
					needed_base |= WasiRights.PATH_FILESTAT_SET_SIZE;
				}
				if ((fs_flags & 1) !== 0) flags |= 1024;
				if ((fs_flags & 2) !== 0) needed_inheriting |= WasiRights.FD_DATASYNC;
				if ((fs_flags & 4) !== 0) flags |= 2048;
				if ((fs_flags & 8) !== 0) {
					flags |= 1052672;
					needed_inheriting |= WasiRights.FD_SYNC;
				}
				if ((fs_flags & 16) !== 0) {
					flags |= 1052672;
					needed_inheriting |= WasiRights.FD_SYNC;
				}
				if (write && (flags & 1536) === 0) needed_inheriting |= WasiRights.FD_SEEK;
				return {
					flags,
					needed_base,
					needed_inheriting
				};
			}
			defineImport("path_open", function path_open(dirfd, dirflags, path$1, path_len, o_flags, fs_rights_base, fs_rights_inheriting, fs_flags, fd) {
				path$1 = Number(path$1);
				fd = Number(fd);
				if (path$1 === 0 || fd === 0) return 28;
				path_len = Number(path_len);
				fs_rights_base = BigInt(fs_rights_base);
				fs_rights_inheriting = BigInt(fs_rights_inheriting);
				const { flags: flagsRes, needed_base: neededBase, needed_inheriting: neededInheriting } = pathOpen(o_flags, fs_rights_base, fs_rights_inheriting, fs_flags);
				const wasi = _wasi.get(this);
				const fileDescriptor = wasi.fds.get(dirfd, neededBase, neededInheriting);
				const memory = getMemory(this);
				const HEAPU8 = memory.HEAPU8;
				const pathString = decoder.decode(unsharedSlice(HEAPU8, path$1, path$1 + path_len));
				const fs$2 = getFs(this);
				const resolved_path = resolvePathSync(fs$2, fileDescriptor, pathString, dirflags);
				const r$1 = fs$2.openSync(resolved_path, flagsRes, 438);
				const filetype = wasi.fds.getFileTypeByFd(r$1);
				if (filetype !== 3 && ((o_flags & 2) !== 0 || resolved_path.endsWith("/"))) return 54;
				const { base: max_base, inheriting: max_inheriting } = getRights(wasi.fds.stdio, r$1, flagsRes, filetype);
				const wrap$2 = wasi.fds.insert(r$1, resolved_path, resolved_path, filetype, fs_rights_base & max_base, fs_rights_inheriting & max_inheriting, 0);
				const stat = fs$2.fstatSync(r$1, { bigint: true });
				if (stat.isFile()) {
					wrap$2.size = stat.size;
					if ((flagsRes & 1024) !== 0) wrap$2.pos = stat.size;
				}
				memory.view.setInt32(fd, wrap$2.id, true);
				return 0;
			}, async function path_open(dirfd, dirflags, path$1, path_len, o_flags, fs_rights_base, fs_rights_inheriting, fs_flags, fd) {
				path$1 = Number(path$1);
				fd = Number(fd);
				if (path$1 === 0 || fd === 0) return 28;
				path_len = Number(path_len);
				fs_rights_base = BigInt(fs_rights_base);
				fs_rights_inheriting = BigInt(fs_rights_inheriting);
				const { flags: flagsRes, needed_base: neededBase, needed_inheriting: neededInheriting } = pathOpen(o_flags, fs_rights_base, fs_rights_inheriting, fs_flags);
				const wasi = _wasi.get(this);
				const fileDescriptor = wasi.fds.get(dirfd, neededBase, neededInheriting);
				const memory = getMemory(this);
				const HEAPU8 = memory.HEAPU8;
				const pathString = decoder.decode(unsharedSlice(HEAPU8, path$1, path$1 + path_len));
				const fs$2 = getFs(this);
				const resolved_path = await resolvePathAsync(fs$2, fileDescriptor, pathString, dirflags);
				const r$1 = await fs$2.promises.open(resolved_path, flagsRes, 438);
				const filetype = await wasi.fds.getFileTypeByFd(r$1);
				if ((o_flags & 2) !== 0 && filetype !== 3) return 54;
				const { base: max_base, inheriting: max_inheriting } = getRights(wasi.fds.stdio, r$1.fd, flagsRes, filetype);
				const wrap$2 = wasi.fds.insert(r$1, resolved_path, resolved_path, filetype, fs_rights_base & max_base, fs_rights_inheriting & max_inheriting, 0);
				const stat = await r$1.stat({ bigint: true });
				if (stat.isFile()) {
					wrap$2.size = stat.size;
					if ((flagsRes & 1024) !== 0) wrap$2.pos = stat.size;
				}
				memory.view.setInt32(fd, wrap$2.id, true);
				return 0;
			}, [
				"i32",
				"i32",
				"i32",
				"i32",
				"i32",
				"i64",
				"i64",
				"i32",
				"i32"
			], ["i32"]);
			defineImport("path_readlink", function path_readlink(fd, path$1, path_len, buf, buf_len, bufused) {
				path$1 = Number(path$1);
				path_len = Number(path_len);
				buf = Number(buf);
				buf_len = Number(buf_len);
				bufused = Number(bufused);
				if (path$1 === 0 || buf === 0 || bufused === 0) return 28;
				const { HEAPU8, view } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.PATH_READLINK, BigInt(0));
				let pathString = decoder.decode(unsharedSlice(HEAPU8, path$1, path$1 + path_len));
				pathString = resolve$1(fileDescriptor.realPath, pathString);
				const link = getFs(this).readlinkSync(pathString);
				const linkData = encoder.encode(link);
				const len = Math.min(linkData.length, buf_len);
				if (len >= buf_len) return 42;
				HEAPU8.set(linkData.subarray(0, len), buf);
				HEAPU8[buf + len] = 0;
				view.setUint32(bufused, len, true);
				return 0;
			}, async function path_readlink(fd, path$1, path_len, buf, buf_len, bufused) {
				path$1 = Number(path$1);
				path_len = Number(path_len);
				buf = Number(buf);
				buf_len = Number(buf_len);
				bufused = Number(bufused);
				if (path$1 === 0 || buf === 0 || bufused === 0) return 28;
				const { HEAPU8, view } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.PATH_READLINK, BigInt(0));
				let pathString = decoder.decode(unsharedSlice(HEAPU8, path$1, path$1 + path_len));
				pathString = resolve$1(fileDescriptor.realPath, pathString);
				const link = await getFs(this).promises.readlink(pathString);
				const linkData = encoder.encode(link);
				const len = Math.min(linkData.length, buf_len);
				if (len >= buf_len) return 42;
				HEAPU8.set(linkData.subarray(0, len), buf);
				HEAPU8[buf + len] = 0;
				view.setUint32(bufused, len, true);
				return 0;
			}, [
				"i32",
				"i32",
				"i32",
				"i32",
				"i32",
				"i32"
			], ["i32"]);
			defineImport("path_remove_directory", function path_remove_directory(fd, path$1, path_len) {
				path$1 = Number(path$1);
				path_len = Number(path_len);
				if (path$1 === 0) return 28;
				const { HEAPU8 } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.PATH_REMOVE_DIRECTORY, BigInt(0));
				let pathString = decoder.decode(unsharedSlice(HEAPU8, path$1, path$1 + path_len));
				pathString = resolve$1(fileDescriptor.realPath, pathString);
				getFs(this).rmdirSync(pathString);
				return 0;
			}, async function path_remove_directory(fd, path$1, path_len) {
				path$1 = Number(path$1);
				path_len = Number(path_len);
				if (path$1 === 0) return 28;
				const { HEAPU8 } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.PATH_REMOVE_DIRECTORY, BigInt(0));
				let pathString = decoder.decode(unsharedSlice(HEAPU8, path$1, path$1 + path_len));
				pathString = resolve$1(fileDescriptor.realPath, pathString);
				await getFs(this).promises.rmdir(pathString);
				return 0;
			}, [
				"i32",
				"i32",
				"i32"
			], ["i32"]);
			defineImport("path_rename", function path_rename(old_fd, old_path, old_path_len, new_fd, new_path, new_path_len) {
				old_path = Number(old_path);
				old_path_len = Number(old_path_len);
				new_path = Number(new_path);
				new_path_len = Number(new_path_len);
				if (old_path === 0 || new_path === 0) return 28;
				const wasi = _wasi.get(this);
				let oldWrap;
				let newWrap;
				if (old_fd === new_fd) oldWrap = newWrap = wasi.fds.get(old_fd, WasiRights.PATH_RENAME_SOURCE | WasiRights.PATH_RENAME_TARGET, BigInt(0));
				else {
					oldWrap = wasi.fds.get(old_fd, WasiRights.PATH_RENAME_SOURCE, BigInt(0));
					newWrap = wasi.fds.get(new_fd, WasiRights.PATH_RENAME_TARGET, BigInt(0));
				}
				const { HEAPU8 } = getMemory(this);
				const resolvedOldPath = resolve$1(oldWrap.realPath, decoder.decode(unsharedSlice(HEAPU8, old_path, old_path + old_path_len)));
				const resolvedNewPath = resolve$1(newWrap.realPath, decoder.decode(unsharedSlice(HEAPU8, new_path, new_path + new_path_len)));
				getFs(this).renameSync(resolvedOldPath, resolvedNewPath);
				return 0;
			}, async function path_rename(old_fd, old_path, old_path_len, new_fd, new_path, new_path_len) {
				old_path = Number(old_path);
				old_path_len = Number(old_path_len);
				new_path = Number(new_path);
				new_path_len = Number(new_path_len);
				if (old_path === 0 || new_path === 0) return 28;
				const wasi = _wasi.get(this);
				let oldWrap;
				let newWrap;
				if (old_fd === new_fd) oldWrap = newWrap = wasi.fds.get(old_fd, WasiRights.PATH_RENAME_SOURCE | WasiRights.PATH_RENAME_TARGET, BigInt(0));
				else {
					oldWrap = wasi.fds.get(old_fd, WasiRights.PATH_RENAME_SOURCE, BigInt(0));
					newWrap = wasi.fds.get(new_fd, WasiRights.PATH_RENAME_TARGET, BigInt(0));
				}
				const { HEAPU8 } = getMemory(this);
				const resolvedOldPath = resolve$1(oldWrap.realPath, decoder.decode(unsharedSlice(HEAPU8, old_path, old_path + old_path_len)));
				const resolvedNewPath = resolve$1(newWrap.realPath, decoder.decode(unsharedSlice(HEAPU8, new_path, new_path + new_path_len)));
				await getFs(this).promises.rename(resolvedOldPath, resolvedNewPath);
				return 0;
			}, [
				"i32",
				"i32",
				"i32",
				"i32",
				"i32",
				"i32"
			], ["i32"]);
			defineImport("path_symlink", function path_symlink(old_path, old_path_len, fd, new_path, new_path_len) {
				old_path = Number(old_path);
				old_path_len = Number(old_path_len);
				new_path = Number(new_path);
				new_path_len = Number(new_path_len);
				if (old_path === 0 || new_path === 0) return 28;
				const { HEAPU8 } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.PATH_SYMLINK, BigInt(0));
				const oldPath = decoder.decode(unsharedSlice(HEAPU8, old_path, old_path + old_path_len));
				if (oldPath.length > 0 && oldPath[0] === "/") return 63;
				let newPath = decoder.decode(unsharedSlice(HEAPU8, new_path, new_path + new_path_len));
				newPath = resolve$1(fileDescriptor.realPath, newPath);
				getFs(this).symlinkSync(oldPath, newPath);
				return 0;
			}, async function path_symlink(old_path, old_path_len, fd, new_path, new_path_len) {
				old_path = Number(old_path);
				old_path_len = Number(old_path_len);
				new_path = Number(new_path);
				new_path_len = Number(new_path_len);
				if (old_path === 0 || new_path === 0) return 28;
				const { HEAPU8 } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.PATH_SYMLINK, BigInt(0));
				const oldPath = decoder.decode(unsharedSlice(HEAPU8, old_path, old_path + old_path_len));
				let newPath = decoder.decode(unsharedSlice(HEAPU8, new_path, new_path + new_path_len));
				newPath = resolve$1(fileDescriptor.realPath, newPath);
				await getFs(this).promises.symlink(oldPath, newPath);
				return 0;
			}, [
				"i32",
				"i32",
				"i32",
				"i32",
				"i32"
			], ["i32"]);
			defineImport("path_unlink_file", function path_unlink_file(fd, path$1, path_len) {
				path$1 = Number(path$1);
				path_len = Number(path_len);
				if (path$1 === 0) return 28;
				const { HEAPU8 } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.PATH_UNLINK_FILE, BigInt(0));
				let pathString = decoder.decode(unsharedSlice(HEAPU8, path$1, path$1 + path_len));
				pathString = resolve$1(fileDescriptor.realPath, pathString);
				getFs(this).unlinkSync(pathString);
				return 0;
			}, async function path_unlink_file(fd, path$1, path_len) {
				path$1 = Number(path$1);
				path_len = Number(path_len);
				if (path$1 === 0) return 28;
				const { HEAPU8 } = getMemory(this);
				const fileDescriptor = _wasi.get(this).fds.get(fd, WasiRights.PATH_UNLINK_FILE, BigInt(0));
				let pathString = decoder.decode(unsharedSlice(HEAPU8, path$1, path$1 + path_len));
				pathString = resolve$1(fileDescriptor.realPath, pathString);
				await getFs(this).promises.unlink(pathString);
				return 0;
			}, [
				"i32",
				"i32",
				"i32"
			], ["i32"]);
			this._setMemory = function setMemory(m$1) {
				if (!(m$1 instanceof _WebAssembly.Memory)) throw new TypeError("\"instance.exports.memory\" property must be a WebAssembly.Memory");
				_memory.set(_this, extendMemory(m$1));
			};
		}
		static createSync(args$1, env, preopens, stdio, fs$1, print, printErr) {
			const fds = new SyncTable({
				size: 3,
				in: stdio[0],
				out: stdio[1],
				err: stdio[2],
				fs: fs$1,
				print,
				printErr
			});
			const _this = new WASI$1$1(args$1, env, fds, false, fs$1);
			if (preopens.length > 0) for (let i$1 = 0; i$1 < preopens.length; ++i$1) {
				const realPath = fs$1.realpathSync(preopens[i$1].realPath, "utf8");
				const fd = fs$1.openSync(realPath, "r", 438);
				fds.insertPreopen(fd, preopens[i$1].mappedPath, realPath);
			}
			return _this;
		}
		static async createAsync(args$1, env, preopens, stdio, fs$1, print, printErr, asyncify) {
			const fds = new AsyncTable({
				size: 3,
				in: stdio[0],
				out: stdio[1],
				err: stdio[2],
				print,
				printErr
			});
			const _this = new WASI$1$1(args$1, env, fds, true, fs$1, asyncify);
			if (preopens.length > 0) for (let i$1 = 0; i$1 < preopens.length; ++i$1) {
				const entry = preopens[i$1];
				const realPath = await fs$1.promises.realpath(entry.realPath);
				const fd = await fs$1.promises.open(realPath, "r", 438);
				await fds.insertPreopen(fd, entry.mappedPath, realPath);
			}
			return _this;
		}
	};
	kEmptyObject = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null));
	kExitCode = Symbol("kExitCode");
	kSetMemory = Symbol("kSetMemory");
	kStarted = Symbol("kStarted");
	kInstance = Symbol("kInstance");
	kBindingName = Symbol("kBindingName");
	WASI$2 = class {
		constructor(options = kEmptyObject) {
			const { args: args$1, env, preopens, stdio, _WASI } = validateOptions.call(this, options);
			const wrap$2 = _WASI.createSync(args$1, env, preopens, stdio, options.fs, options.print, options.printErr);
			const setMemory = wrap$2._setMemory;
			delete wrap$2._setMemory;
			initWASI.call(this, setMemory, wrap$2);
			if (options.returnOnExit) wrap$2.proc_exit = wasiReturnOnProcExit.bind(this);
		}
		finalizeBindings(instance$1, _a) {
			var _b;
			var { memory = (_b = instance$1 === null || instance$1 === void 0 ? void 0 : instance$1.exports) === null || _b === void 0 ? void 0 : _b.memory } = _a === void 0 ? {} : _a;
			if (this[kStarted]) throw new Error("WASI instance has already started");
			validateObject(instance$1, "instance");
			validateObject(instance$1.exports, "instance.exports");
			this[kSetMemory](memory);
			this[kInstance] = instance$1;
			this[kStarted] = true;
		}
		start(instance$1) {
			this.finalizeBindings(instance$1);
			const { _start, _initialize } = this[kInstance].exports;
			validateFunction(_start, "instance.exports._start");
			validateUndefined(_initialize, "instance.exports._initialize");
			let ret;
			try {
				ret = _start();
			} catch (err) {
				if (err !== kExitCode) throw err;
			}
			if (ret instanceof Promise) return ret.then(() => this[kExitCode], (err) => {
				if (err !== kExitCode) throw err;
				return this[kExitCode];
			});
			return this[kExitCode];
		}
		initialize(instance$1) {
			this.finalizeBindings(instance$1);
			const { _start, _initialize } = this[kInstance].exports;
			validateUndefined(_start, "instance.exports._start");
			if (_initialize !== void 0) {
				validateFunction(_initialize, "instance.exports._initialize");
				return _initialize();
			}
		}
		getImportObject() {
			return { [this[kBindingName]]: this.wasiImport };
		}
	};
} });
var require_fs_proxy = /* @__PURE__ */ __commonJS$1({ "../../node_modules/.pnpm/@napi-rs+wasm-runtime@1.0.5/node_modules/@napi-rs/wasm-runtime/dist/fs-proxy.cjs": (exports) => {
	/**
	* @param {unknown} value
	*/
	const getType = (value) => {
		if (value === void 0) return 0;
		if (value === null) return 1;
		const t$3 = typeof value;
		if (t$3 === "boolean") return 2;
		if (t$3 === "number") return 3;
		if (t$3 === "string") return 4;
		if (t$3 === "object") return 6;
		if (t$3 === "bigint") return 9;
		return -1;
	};
	/**
	* @param {import('memfs').IFs} memfs
	* @param {any} value
	* @param {ReturnType<typeof getType>} type
	* @returns {Uint8Array}
	*/
	const encodeValue = (memfs, value, type) => {
		switch (type) {
			case 0:
			case 1: return new Uint8Array(0);
			case 2: {
				const view = new Int32Array(1);
				view[0] = value ? 1 : 0;
				return new Uint8Array(view.buffer);
			}
			case 3: {
				const view = new Float64Array(1);
				view[0] = value;
				return new Uint8Array(view.buffer);
			}
			case 4: return new TextEncoder().encode(value);
			case 6: {
				function storeConstructor(obj, memfs$1, processed = /* @__PURE__ */ new WeakSet()) {
					if (!obj || typeof obj !== "object") return;
					if (processed.has(obj)) return;
					processed.add(obj);
					const [entry] = Object.entries(memfs$1).filter(([_, v]) => v === obj.constructor)[0] ?? [];
					if (entry) Object.defineProperty(obj, "__constructor__", {
						configurable: true,
						writable: true,
						enumerable: true,
						value: entry
					});
					for (const value$1 of Object.values(obj)) storeConstructor(value$1, memfs$1, processed);
				}
				storeConstructor(value, memfs);
				const json = JSON.stringify(value, (_, value$1) => {
					if (typeof value$1 === "bigint") return `BigInt(${String(value$1)})`;
					if (value$1 instanceof Error) return {
						...value$1,
						message: value$1.message,
						stack: value$1.stack,
						__error__: value$1.constructor.name
					};
					return value$1;
				});
				return new TextEncoder().encode(json);
			}
			case 9: {
				const view = new BigInt64Array(1);
				view[0] = value;
				return new Uint8Array(view.buffer);
			}
			case -1:
			default: throw new Error("unsupported data");
		}
	};
	/**
	* @param {typeof import('memfs')} memfs
	* @param {Uint8Array} payload
	* @param {number} type
	* @returns {any}
	*/
	const decodeValue = (memfs, payload, type) => {
		if (type === 0) return void 0;
		if (type === 1) return null;
		if (type === 2) return Boolean(new Int32Array(payload.buffer, payload.byteOffset, 1)[0]);
		if (type === 3) return new Float64Array(payload.buffer, payload.byteOffset, 1)[0];
		if (type === 4) return new TextDecoder().decode(payload.slice());
		if (type === 6) {
			const obj = JSON.parse(new TextDecoder().decode(payload.slice()), (_key, value) => {
				if (typeof value === "string") {
					const matched = value.match(/^BigInt\((-?\d+)\)$/);
					if (matched && matched[1]) return BigInt(matched[1]);
				}
				return value;
			});
			function loadConstructor(obj$1, memfs$1, processed = /* @__PURE__ */ new WeakSet()) {
				if (!obj$1 || typeof obj$1 !== "object") return;
				if (processed.has(obj$1)) return;
				processed.add(obj$1);
				if (obj$1.__constructor__) {
					const ctor = obj$1.__constructor__;
					delete obj$1.__constructor__;
					Object.setPrototypeOf(obj$1, memfs$1[ctor].prototype);
				}
				for (const value of Object.values(obj$1)) loadConstructor(value, memfs$1, processed);
			}
			loadConstructor(obj, memfs);
			if (obj.__error__) {
				const name = obj.__error__;
				const ErrorConstructor = globalThis[name] || Error;
				delete obj.__error__;
				const err = new ErrorConstructor(obj.message);
				Object.defineProperty(err, "stack", {
					configurable: true,
					enumerable: false,
					writable: true,
					value: err.stack
				});
				Object.defineProperty(err, Symbol.toStringTag, {
					configurable: true,
					enumerable: false,
					writable: true,
					value: name
				});
				for (const [k, v] of Object.entries(obj)) {
					if (k === "message" || k === "stack") continue;
					err[k] = v;
				}
				return err;
			}
			return obj;
		}
		if (type === 9) return new BigInt64Array(payload.buffer, payload.byteOffset, 1)[0];
		throw new Error("unsupported data");
	};
	/**
	* @param {import('memfs').IFs} fs
	* @returns {(e: { data: { __fs__: { sab: Int32Array, type: keyof import('memfs').IFs, payload: any[] } } }) => void}
	*/
	const createOnMessage$1 = (fs$1) => function onMessage(e$2) {
		if (e$2.data.__fs__) {
			/**
			* 0..4                    status(int32_t):        21(waiting) 0(success) 1(error)
			* 5..8                    type(napi_valuetype):   0(undefined) 1(null) 2(boolean) 3(number) 4(string) 6(jsonstring) 9(bigint) -1(unsupported)
			* 9..16                   payload_size(uint32_t)  <= 1024
			* 16..16 + payload_size   payload_content
			*/
			const { sab, type, payload } = e$2.data.__fs__;
			const fn = fs$1[type];
			try {
				const ret = fn.apply(fs$1, payload);
				const t$3 = getType(ret);
				Atomics.store(sab, 1, t$3);
				const v = encodeValue(fs$1, ret, t$3);
				Atomics.store(sab, 2, v.length);
				new Uint8Array(sab.buffer).set(v, 16);
				Atomics.store(sab, 0, 0);
			} catch (err) {
				const t$3 = getType(err);
				Atomics.store(sab, 1, t$3);
				const v = encodeValue(fs$1, err, t$3);
				Atomics.store(sab, 2, v.length);
				new Uint8Array(sab.buffer).set(v, 16);
				Atomics.store(sab, 0, 1);
			} finally {
				Atomics.notify(sab, 0);
			}
		}
	};
	/**
	* @param {typeof import('memfs')} memfs
	*/
	const createFsProxy$1 = (memfs) => new Proxy({}, { get(_target, p$1, _receiver) {
		/**
		* @param {any[]} args
		*/
		return function(...args$1) {
			const sab = new SharedArrayBuffer(10256);
			const i32arr = new Int32Array(sab);
			Atomics.store(i32arr, 0, 21);
			postMessage({ __fs__: {
				sab: i32arr,
				type: p$1,
				payload: args$1
			} });
			Atomics.wait(i32arr, 0, 21);
			const status = Atomics.load(i32arr, 0);
			const type = Atomics.load(i32arr, 1);
			const size = Atomics.load(i32arr, 2);
			const content = new Uint8Array(sab, 16, size);
			const value = decodeValue(memfs, content, type);
			if (status === 1) throw value;
			return value;
		};
	} });
	exports.createFsProxy = createFsProxy$1;
	exports.createOnMessage = createOnMessage$1;
} });
var require_runtime = /* @__PURE__ */ __commonJS$1({ "../../node_modules/.pnpm/@napi-rs+wasm-runtime@1.0.5/node_modules/@napi-rs/wasm-runtime/runtime.cjs": (exports, module$1) => {
	const { MessageHandler, instantiateNapiModuleSync, instantiateNapiModule } = (init_emnapi_core_esm_bundler(), __toCommonJS(emnapi_core_esm_bundler_exports));
	const { getDefaultContext } = (init_emnapi_esm_bundler(), __toCommonJS(emnapi_esm_bundler_exports));
	const { WASI } = (init_wasm_util_esm_bundler(), __toCommonJS(wasm_util_esm_bundler_exports));
	const { createFsProxy, createOnMessage } = require_fs_proxy();
	module$1.exports = {
		MessageHandler,
		instantiateNapiModule,
		instantiateNapiModuleSync,
		getDefaultContext,
		WASI,
		createFsProxy,
		createOnMessage
	};
} });
var require_rolldown_binding_wasi = /* @__PURE__ */ __commonJS$1({ "src/rolldown-binding.wasi.cjs": (exports, module$1) => {
	const __nodeFs = __require("node:fs");
	const __nodePath = __require("node:path");
	const { WASI: __nodeWASI } = __require("node:wasi");
	const { Worker: Worker$1 } = __require("node:worker_threads");
	const { createOnMessage: __wasmCreateOnMessageForFsProxy, getDefaultContext: __emnapiGetDefaultContext, instantiateNapiModuleSync: __emnapiInstantiateNapiModuleSync } = require_runtime();
	const __rootDir = __nodePath.parse(process.cwd()).root;
	const __wasi = new __nodeWASI({
		version: "preview1",
		env: process.env,
		preopens: { [__rootDir]: __rootDir }
	});
	const __emnapiContext = __emnapiGetDefaultContext();
	const __sharedMemory = new WebAssembly.Memory({
		initial: 16384,
		maximum: 65536,
		shared: true
	});
	let __wasmFilePath = __nodePath.join(__dirname, "rolldown-binding.wasm32-wasi.wasm");
	const __wasmDebugFilePath = __nodePath.join(__dirname, "rolldown-binding.wasm32-wasi.debug.wasm");
	if (__nodeFs.existsSync(__wasmDebugFilePath)) __wasmFilePath = __wasmDebugFilePath;
	else if (!__nodeFs.existsSync(__wasmFilePath)) try {
		__wasmFilePath = __nodePath.resolve("@rolldown/binding-wasm32-wasi");
	} catch {
		throw new Error("Cannot find rolldown-binding.wasm32-wasi.wasm file, and @rolldown/binding-wasm32-wasi package is not installed.");
	}
	const { instance: __napiInstance, module: __wasiModule, napiModule: __napiModule } = __emnapiInstantiateNapiModuleSync(__nodeFs.readFileSync(__wasmFilePath), {
		context: __emnapiContext,
		asyncWorkPoolSize: function() {
			const threadsSizeFromEnv = Number(process.env.NAPI_RS_ASYNC_WORK_POOL_SIZE ?? process.env.UV_THREADPOOL_SIZE);
			if (threadsSizeFromEnv > 0) return threadsSizeFromEnv;
			else return 4;
		}(),
		reuseWorker: true,
		wasi: __wasi,
		onCreateWorker() {
			const worker = new Worker$1(__nodePath.join(__dirname, "wasi-worker.mjs"), { env: process.env });
			worker.onmessage = ({ data }) => {
				__wasmCreateOnMessageForFsProxy(__nodeFs)(data);
			};
			{
				const kPublicPort = Object.getOwnPropertySymbols(worker).find((s$1) => s$1.toString().includes("kPublicPort"));
				if (kPublicPort) worker[kPublicPort].ref = () => {};
				const kHandle = Object.getOwnPropertySymbols(worker).find((s$1) => s$1.toString().includes("kHandle"));
				if (kHandle) worker[kHandle].ref = () => {};
				worker.unref();
			}
			return worker;
		},
		overwriteImports(importObject) {
			importObject.env = {
				...importObject.env,
				...importObject.napi,
				...importObject.emnapi,
				memory: __sharedMemory
			};
			return importObject;
		},
		beforeInit({ instance: instance$1 }) {
			for (const name of Object.keys(instance$1.exports)) if (name.startsWith("__napi_register__")) instance$1.exports[name]();
		}
	});
	module$1.exports = __napiModule.exports;
	module$1.exports.minify = __napiModule.exports.minify;
	module$1.exports.Severity = __napiModule.exports.Severity;
	module$1.exports.ParseResult = __napiModule.exports.ParseResult;
	module$1.exports.ExportExportNameKind = __napiModule.exports.ExportExportNameKind;
	module$1.exports.ExportImportNameKind = __napiModule.exports.ExportImportNameKind;
	module$1.exports.ExportLocalNameKind = __napiModule.exports.ExportLocalNameKind;
	module$1.exports.ImportNameKind = __napiModule.exports.ImportNameKind;
	module$1.exports.parseAsync = __napiModule.exports.parseAsync;
	module$1.exports.parseSync = __napiModule.exports.parseSync;
	module$1.exports.rawTransferSupported = __napiModule.exports.rawTransferSupported;
	module$1.exports.ResolverFactory = __napiModule.exports.ResolverFactory;
	module$1.exports.EnforceExtension = __napiModule.exports.EnforceExtension;
	module$1.exports.ModuleType = __napiModule.exports.ModuleType;
	module$1.exports.sync = __napiModule.exports.sync;
	module$1.exports.HelperMode = __napiModule.exports.HelperMode;
	module$1.exports.isolatedDeclaration = __napiModule.exports.isolatedDeclaration;
	module$1.exports.moduleRunnerTransform = __napiModule.exports.moduleRunnerTransform;
	module$1.exports.transform = __napiModule.exports.transform;
	module$1.exports.transformAsync = __napiModule.exports.transformAsync;
	module$1.exports.BindingBundleEndEventData = __napiModule.exports.BindingBundleEndEventData;
	module$1.exports.BindingBundleErrorEventData = __napiModule.exports.BindingBundleErrorEventData;
	module$1.exports.BindingBundler = __napiModule.exports.BindingBundler;
	module$1.exports.BindingBundlerImpl = __napiModule.exports.BindingBundlerImpl;
	module$1.exports.BindingCallableBuiltinPlugin = __napiModule.exports.BindingCallableBuiltinPlugin;
	module$1.exports.BindingChunkingContext = __napiModule.exports.BindingChunkingContext;
	module$1.exports.BindingClientHmrUpdate = __napiModule.exports.BindingClientHmrUpdate;
	module$1.exports.BindingDevEngine = __napiModule.exports.BindingDevEngine;
	module$1.exports.BindingHmrOutput = __napiModule.exports.BindingHmrOutput;
	module$1.exports.BindingMagicString = __napiModule.exports.BindingMagicString;
	module$1.exports.BindingModuleInfo = __napiModule.exports.BindingModuleInfo;
	module$1.exports.BindingNormalizedOptions = __napiModule.exports.BindingNormalizedOptions;
	module$1.exports.BindingOutputAsset = __napiModule.exports.BindingOutputAsset;
	module$1.exports.BindingOutputChunk = __napiModule.exports.BindingOutputChunk;
	module$1.exports.BindingOutputs = __napiModule.exports.BindingOutputs;
	module$1.exports.BindingPluginContext = __napiModule.exports.BindingPluginContext;
	module$1.exports.BindingRenderedChunk = __napiModule.exports.BindingRenderedChunk;
	module$1.exports.BindingRenderedChunkMeta = __napiModule.exports.BindingRenderedChunkMeta;
	module$1.exports.BindingRenderedModule = __napiModule.exports.BindingRenderedModule;
	module$1.exports.BindingTransformPluginContext = __napiModule.exports.BindingTransformPluginContext;
	module$1.exports.BindingWatcher = __napiModule.exports.BindingWatcher;
	module$1.exports.BindingWatcherChangeData = __napiModule.exports.BindingWatcherChangeData;
	module$1.exports.BindingWatcherEvent = __napiModule.exports.BindingWatcherEvent;
	module$1.exports.ParallelJsPluginRegistry = __napiModule.exports.ParallelJsPluginRegistry;
	module$1.exports.ScheduledBuild = __napiModule.exports.ScheduledBuild;
	module$1.exports.TraceSubscriberGuard = __napiModule.exports.TraceSubscriberGuard;
	module$1.exports.BindingAttachDebugInfo = __napiModule.exports.BindingAttachDebugInfo;
	module$1.exports.BindingBuiltinPluginName = __napiModule.exports.BindingBuiltinPluginName;
	module$1.exports.BindingChunkModuleOrderBy = __napiModule.exports.BindingChunkModuleOrderBy;
	module$1.exports.BindingJsx = __napiModule.exports.BindingJsx;
	module$1.exports.BindingLogLevel = __napiModule.exports.BindingLogLevel;
	module$1.exports.BindingPluginOrder = __napiModule.exports.BindingPluginOrder;
	module$1.exports.BindingPropertyReadSideEffects = __napiModule.exports.BindingPropertyReadSideEffects;
	module$1.exports.BindingPropertyWriteSideEffects = __napiModule.exports.BindingPropertyWriteSideEffects;
	module$1.exports.FilterTokenKind = __napiModule.exports.FilterTokenKind;
	module$1.exports.initTraceSubscriber = __napiModule.exports.initTraceSubscriber;
	module$1.exports.registerPlugins = __napiModule.exports.registerPlugins;
	module$1.exports.shutdownAsyncRuntime = __napiModule.exports.shutdownAsyncRuntime;
	module$1.exports.startAsyncRuntime = __napiModule.exports.startAsyncRuntime;
	module$1.exports.JsWatcher = __napiModule.exports.JsWatcher;
} });
var require_webcontainer_fallback = /* @__PURE__ */ __commonJS$1({ "src/webcontainer-fallback.cjs": (exports, module$1) => {
	const fs$1 = __require("node:fs");
	const childProcess = __require("node:child_process");
	const version$3 = JSON.parse(fs$1.readFileSync(__require.resolve("rolldown/package.json"), "utf-8")).version;
	const baseDir = `/tmp/rolldown-${version$3}`;
	const bindingEntry = `${baseDir}/node_modules/@rolldown/binding-wasm32-wasi/rolldown-binding.wasi.cjs`;
	if (!fs$1.existsSync(bindingEntry)) {
		const bindingPkg = `@rolldown/binding-wasm32-wasi@${version$3}`;
		fs$1.rmSync(baseDir, {
			recursive: true,
			force: true
		});
		fs$1.mkdirSync(baseDir, { recursive: true });
		console.log(`[rolldown] Downloading ${bindingPkg} on WebContainer...`);
		childProcess.execFileSync("pnpm", ["i", bindingPkg], {
			cwd: baseDir,
			stdio: "inherit"
		});
	}
	module$1.exports = __require(bindingEntry);
} });
new URL(".", import.meta.url).pathname;
const { readFileSync } = __require("node:fs");
let nativeBinding = null;
const loadErrors = [];
const isMusl = () => {
	let musl = false;
	if (process.platform === "linux") {
		musl = isMuslFromFilesystem();
		if (musl === null) musl = isMuslFromReport();
		if (musl === null) musl = isMuslFromChildProcess();
	}
	return musl;
};
const isFileMusl = (f$1) => f$1.includes("libc.musl-") || f$1.includes("ld-musl-");
const isMuslFromFilesystem = () => {
	try {
		return readFileSync("/usr/bin/ldd", "utf-8").includes("musl");
	} catch {
		return null;
	}
};
const isMuslFromReport = () => {
	let report = null;
	if (typeof process.report?.getReport === "function") {
		process.report.excludeNetwork = true;
		report = process.report.getReport();
	}
	if (!report) return null;
	if (report.header && report.header.glibcVersionRuntime) return false;
	if (Array.isArray(report.sharedObjects)) {
		if (report.sharedObjects.some(isFileMusl)) return true;
	}
	return false;
};
const isMuslFromChildProcess = () => {
	try {
		return __require("child_process").execSync("ldd --version", { encoding: "utf8" }).includes("musl");
	} catch (e$2) {
		return false;
	}
};
function requireNative() {
	if (process.env.NAPI_RS_NATIVE_LIBRARY_PATH) try {
		return __require(process.env.NAPI_RS_NATIVE_LIBRARY_PATH);
	} catch (err) {
		loadErrors.push(err);
	}
	else if (process.platform === "android") if (process.arch === "arm64") {
		try {
			return __require("../rolldown-binding.android-arm64.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-android-arm64");
			const bindingPackageVersion = __require("@rolldown/binding-android-arm64/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else if (process.arch === "arm") {
		try {
			return __require("../rolldown-binding.android-arm-eabi.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-android-arm-eabi");
			const bindingPackageVersion = __require("@rolldown/binding-android-arm-eabi/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on Android ${process.arch}`));
	else if (process.platform === "win32") if (process.arch === "x64") {
		try {
			return __require("../rolldown-binding.win32-x64-msvc.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-win32-x64-msvc");
			const bindingPackageVersion = __require("@rolldown/binding-win32-x64-msvc/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else if (process.arch === "ia32") {
		try {
			return __require("../rolldown-binding.win32-ia32-msvc.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-win32-ia32-msvc");
			const bindingPackageVersion = __require("@rolldown/binding-win32-ia32-msvc/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else if (process.arch === "arm64") {
		try {
			return __require("../rolldown-binding.win32-arm64-msvc.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-win32-arm64-msvc");
			const bindingPackageVersion = __require("@rolldown/binding-win32-arm64-msvc/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on Windows: ${process.arch}`));
	else if (process.platform === "darwin") {
		try {
			return __require("../rolldown-binding.darwin-universal.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-darwin-universal");
			const bindingPackageVersion = __require("@rolldown/binding-darwin-universal/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		if (process.arch === "x64") {
			try {
				return __require("../rolldown-binding.darwin-x64.node");
			} catch (e$2) {
				loadErrors.push(e$2);
			}
			try {
				const binding = __require("@rolldown/binding-darwin-x64");
				const bindingPackageVersion = __require("@rolldown/binding-darwin-x64/package.json").version;
				if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
				return binding;
			} catch (e$2) {
				loadErrors.push(e$2);
			}
		} else if (process.arch === "arm64") {
			try {
				return __require("../rolldown-binding.darwin-arm64.node");
			} catch (e$2) {
				loadErrors.push(e$2);
			}
			try {
				const binding = __require("@rolldown/binding-darwin-arm64");
				const bindingPackageVersion = __require("@rolldown/binding-darwin-arm64/package.json").version;
				if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
				return binding;
			} catch (e$2) {
				loadErrors.push(e$2);
			}
		} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on macOS: ${process.arch}`));
	} else if (process.platform === "freebsd") if (process.arch === "x64") {
		try {
			return __require("../rolldown-binding.freebsd-x64.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-freebsd-x64");
			const bindingPackageVersion = __require("@rolldown/binding-freebsd-x64/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else if (process.arch === "arm64") {
		try {
			return __require("../rolldown-binding.freebsd-arm64.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-freebsd-arm64");
			const bindingPackageVersion = __require("@rolldown/binding-freebsd-arm64/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on FreeBSD: ${process.arch}`));
	else if (process.platform === "linux") if (process.arch === "x64") if (isMusl()) {
		try {
			return __require("../rolldown-binding.linux-x64-musl.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-linux-x64-musl");
			const bindingPackageVersion = __require("@rolldown/binding-linux-x64-musl/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else {
		try {
			return __require("../rolldown-binding.linux-x64-gnu.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-linux-x64-gnu");
			const bindingPackageVersion = __require("@rolldown/binding-linux-x64-gnu/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	}
	else if (process.arch === "arm64") if (isMusl()) {
		try {
			return __require("../rolldown-binding.linux-arm64-musl.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-linux-arm64-musl");
			const bindingPackageVersion = __require("@rolldown/binding-linux-arm64-musl/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else {
		try {
			return __require("../rolldown-binding.linux-arm64-gnu.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-linux-arm64-gnu");
			const bindingPackageVersion = __require("@rolldown/binding-linux-arm64-gnu/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	}
	else if (process.arch === "arm") if (isMusl()) {
		try {
			return __require("../rolldown-binding.linux-arm-musleabihf.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-linux-arm-musleabihf");
			const bindingPackageVersion = __require("@rolldown/binding-linux-arm-musleabihf/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else {
		try {
			return __require("../rolldown-binding.linux-arm-gnueabihf.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-linux-arm-gnueabihf");
			const bindingPackageVersion = __require("@rolldown/binding-linux-arm-gnueabihf/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	}
	else if (process.arch === "loong64") if (isMusl()) {
		try {
			return __require("../rolldown-binding.linux-loong64-musl.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-linux-loong64-musl");
			const bindingPackageVersion = __require("@rolldown/binding-linux-loong64-musl/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else {
		try {
			return __require("../rolldown-binding.linux-loong64-gnu.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-linux-loong64-gnu");
			const bindingPackageVersion = __require("@rolldown/binding-linux-loong64-gnu/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	}
	else if (process.arch === "riscv64") if (isMusl()) {
		try {
			return __require("../rolldown-binding.linux-riscv64-musl.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-linux-riscv64-musl");
			const bindingPackageVersion = __require("@rolldown/binding-linux-riscv64-musl/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else {
		try {
			return __require("../rolldown-binding.linux-riscv64-gnu.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-linux-riscv64-gnu");
			const bindingPackageVersion = __require("@rolldown/binding-linux-riscv64-gnu/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	}
	else if (process.arch === "ppc64") {
		try {
			return __require("../rolldown-binding.linux-ppc64-gnu.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-linux-ppc64-gnu");
			const bindingPackageVersion = __require("@rolldown/binding-linux-ppc64-gnu/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else if (process.arch === "s390x") {
		try {
			return __require("../rolldown-binding.linux-s390x-gnu.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-linux-s390x-gnu");
			const bindingPackageVersion = __require("@rolldown/binding-linux-s390x-gnu/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on Linux: ${process.arch}`));
	else if (process.platform === "openharmony") if (process.arch === "arm64") {
		try {
			return __require("../rolldown-binding.openharmony-arm64.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-openharmony-arm64");
			const bindingPackageVersion = __require("@rolldown/binding-openharmony-arm64/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else if (process.arch === "x64") {
		try {
			return __require("../rolldown-binding.openharmony-x64.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-openharmony-x64");
			const bindingPackageVersion = __require("@rolldown/binding-openharmony-x64/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else if (process.arch === "arm") {
		try {
			return __require("../rolldown-binding.openharmony-arm.node");
		} catch (e$2) {
			loadErrors.push(e$2);
		}
		try {
			const binding = __require("@rolldown/binding-openharmony-arm");
			const bindingPackageVersion = __require("@rolldown/binding-openharmony-arm/package.json").version;
			if (bindingPackageVersion !== "1.0.0-beta.41" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 1.0.0-beta.41 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e$2) {
			loadErrors.push(e$2);
		}
	} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on OpenHarmony: ${process.arch}`));
	else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported OS: ${process.platform}, architecture: ${process.arch}`));
}
nativeBinding = requireNative();
if (!nativeBinding || process.env.NAPI_RS_FORCE_WASI) {
	let wasiBinding = null;
	let wasiBindingError = null;
	try {
		wasiBinding = require_rolldown_binding_wasi();
		nativeBinding = wasiBinding;
	} catch (err) {
		if (process.env.NAPI_RS_FORCE_WASI) wasiBindingError = err;
	}
	if (!nativeBinding) try {
		wasiBinding = __require("@rolldown/binding-wasm32-wasi");
		nativeBinding = wasiBinding;
	} catch (err) {
		if (process.env.NAPI_RS_FORCE_WASI) {
			wasiBindingError.cause = err;
			loadErrors.push(err);
		}
	}
	if (process.env.NAPI_RS_FORCE_WASI === "error" && !wasiBinding) {
		const error$1 = /* @__PURE__ */ new Error("WASI binding not found and NAPI_RS_FORCE_WASI is set to error");
		error$1.cause = wasiBindingError;
		throw error$1;
	}
}
if (!nativeBinding && globalThis.process?.versions?.["webcontainer"]) try {
	nativeBinding = require_webcontainer_fallback();
} catch (err) {
	loadErrors.push(err);
}
if (!nativeBinding) {
	if (loadErrors.length > 0) throw new Error("Cannot find native binding. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.", { cause: loadErrors.reduce((err, cur) => {
		cur.cause = err;
		return cur;
	}) });
	throw new Error(`Failed to load native binding`);
}
const { minify, Severity, ParseResult, ExportExportNameKind, ExportImportNameKind, ExportLocalNameKind, ImportNameKind, parseAsync, parseSync, rawTransferSupported, ResolverFactory, EnforceExtension, ModuleType: ModuleType$1, sync, HelperMode, isolatedDeclaration, moduleRunnerTransform, transform, transformAsync, BindingBundleEndEventData, BindingBundleErrorEventData, BindingBundler, BindingBundlerImpl, BindingCallableBuiltinPlugin, BindingChunkingContext, BindingClientHmrUpdate, BindingDevEngine, BindingHmrOutput, BindingMagicString, BindingModuleInfo, BindingNormalizedOptions, BindingOutputAsset, BindingOutputChunk, BindingOutputs, BindingPluginContext, BindingRenderedChunk, BindingRenderedChunkMeta, BindingRenderedModule, BindingTransformPluginContext, BindingWatcher, BindingWatcherChangeData, BindingWatcherEvent, ParallelJsPluginRegistry, ScheduledBuild, TraceSubscriberGuard, BindingAttachDebugInfo, BindingBuiltinPluginName, BindingChunkModuleOrderBy, BindingJsx, BindingLogLevel, BindingPluginOrder, BindingPropertyReadSideEffects, BindingPropertyWriteSideEffects, FilterTokenKind, initTraceSubscriber, registerPlugins, shutdownAsyncRuntime, startAsyncRuntime, JsWatcher } = nativeBinding;
function spaces(index) {
	let result = "";
	while (index--) result += " ";
	return result;
}
function tabsToSpaces(value) {
	return value.replace(/^\t+/, (match) => match.split("	").join("  "));
}
const LINE_TRUNCATE_LENGTH = 120;
const MIN_CHARACTERS_SHOWN_AFTER_LOCATION = 10;
const ELLIPSIS = "...";
function getCodeFrame(source, line, column) {
	let lines = source.split("\n");
	if (line > lines.length) return "";
	const maxLineLength = Math.max(tabsToSpaces(lines[line - 1].slice(0, column)).length + MIN_CHARACTERS_SHOWN_AFTER_LOCATION + 3, LINE_TRUNCATE_LENGTH);
	const frameStart = Math.max(0, line - 3);
	let frameEnd = Math.min(line + 2, lines.length);
	lines = lines.slice(frameStart, frameEnd);
	while (!/\S/.test(lines[lines.length - 1])) {
		lines.pop();
		frameEnd -= 1;
	}
	const digits = String(frameEnd).length;
	return lines.map((sourceLine, index) => {
		const isErrorLine = frameStart + index + 1 === line;
		let lineNumber = String(index + frameStart + 1);
		while (lineNumber.length < digits) lineNumber = ` ${lineNumber}`;
		let displayedLine = tabsToSpaces(sourceLine);
		if (displayedLine.length > maxLineLength) displayedLine = `${displayedLine.slice(0, maxLineLength - 3)}${ELLIPSIS}`;
		if (isErrorLine) {
			const indicator = spaces(digits + 2 + tabsToSpaces(sourceLine.slice(0, column)).length) + "^";
			return `${lineNumber}: ${displayedLine}\n${indicator}`;
		}
		return `${lineNumber}: ${displayedLine}`;
	}).join("\n");
}
/** @typedef {import('./types').Location} Location */
/**
* @param {import('./types').Range} range
* @param {number} index
*/
function rangeContains(range, index) {
	return range.start <= index && index < range.end;
}
/**
* @param {string} source
* @param {import('./types').Options} [options]
*/
function getLocator(source, options = {}) {
	const { offsetLine = 0, offsetColumn = 0 } = options;
	let start = 0;
	const ranges = source.split("\n").map((line, i$1$1) => {
		const end = start + line.length + 1;
		/** @type {import('./types').Range} */
		const range = {
			start,
			end,
			line: i$1$1
		};
		start = end;
		return range;
	});
	let i$1 = 0;
	/**
	* @param {string | number} search
	* @param {number} [index]
	* @returns {Location | undefined}
	*/
	function locator(search, index) {
		if (typeof search === "string") search = source.indexOf(search, index ?? 0);
		if (search === -1) return void 0;
		let range = ranges[i$1];
		const d$1 = search >= range.end ? 1 : -1;
		while (range) {
			if (rangeContains(range, search)) return {
				line: offsetLine + range.line,
				column: offsetColumn + search - range.start,
				character: search
			};
			i$1 += d$1;
			range = ranges[i$1];
		}
	}
	return locator;
}
/**
* @param {string} source
* @param {string | number} search
* @param {import('./types').Options} [options]
* @returns {Location | undefined}
*/
function locate(source, search, options) {
	return getLocator(source, options)(search, options && options.startIndex);
}
const INVALID_LOG_POSITION = "INVALID_LOG_POSITION", PLUGIN_ERROR = "PLUGIN_ERROR", INPUT_HOOK_IN_OUTPUT_PLUGIN = "INPUT_HOOK_IN_OUTPUT_PLUGIN", CYCLE_LOADING = "CYCLE_LOADING", MULTIPLY_NOTIFY_OPTION = "MULTIPLY_NOTIFY_OPTION", PARSE_ERROR = "PARSE_ERROR", DUPLICATE_JSX_CONFIG = "DUPLICATE_JSX_CONFIG", NO_FS_IN_BROWSER = "NO_FS_IN_BROWSER";
function logParseError(message) {
	return {
		code: PARSE_ERROR,
		message
	};
}
function logInvalidLogPosition(pluginName) {
	return {
		code: INVALID_LOG_POSITION,
		message: `Plugin "${pluginName}" tried to add a file position to a log or warning. This is only supported in the "transform" hook at the moment and will be ignored.`
	};
}
function logInputHookInOutputPlugin(pluginName, hookName) {
	return {
		code: INPUT_HOOK_IN_OUTPUT_PLUGIN,
		message: `The "${hookName}" hook used by the output plugin ${pluginName} is a build time hook and will not be run for that plugin. Either this plugin cannot be used as an output plugin, or it should have an option to configure it as an output plugin.`
	};
}
function logCycleLoading(pluginName, moduleId) {
	return {
		code: CYCLE_LOADING,
		message: `Found the module "${moduleId}" cycle loading at ${pluginName} plugin, it maybe blocking fetching modules.`
	};
}
function logMultiplyNotifyOption() {
	return {
		code: MULTIPLY_NOTIFY_OPTION,
		message: `Found multiply notify option at watch options, using first one to start notify watcher.`
	};
}
function logDuplicateJsxConfig() {
	return {
		code: DUPLICATE_JSX_CONFIG,
		message: "Both `options.jsx` and `options.transform.jsx` are set so `options.jsx` is ignored"
	};
}
function logPluginError(error$1, plugin, { hook, id: id$1 } = {}) {
	try {
		const code$1 = error$1.code;
		if (!error$1.pluginCode && code$1 != null && (typeof code$1 !== "string" || !code$1.startsWith("PLUGIN_"))) error$1.pluginCode = code$1;
		error$1.code = PLUGIN_ERROR;
		error$1.plugin = plugin;
		if (hook) error$1.hook = hook;
		if (id$1) error$1.id = id$1;
	} catch (_) {} finally {
		return error$1;
	}
}
function error(base) {
	if (!(base instanceof Error)) {
		base = Object.assign(new Error(base.message), base);
		Object.defineProperty(base, "name", {
			value: "RollupError",
			writable: true
		});
	}
	throw base;
}
function augmentCodeLocation(properties, pos, source, id$1) {
	if (typeof pos === "object") {
		const { line, column } = pos;
		properties.loc = {
			column,
			file: id$1,
			line
		};
	} else {
		properties.pos = pos;
		const location = locate(source, pos, { offsetLine: 1 });
		if (!location) return;
		const { line, column } = location;
		properties.loc = {
			column,
			file: id$1,
			line
		};
	}
	if (properties.frame === void 0) {
		const { line, column } = properties.loc;
		properties.frame = getCodeFrame(source, line, column);
	}
}
function wrap$1(result) {
	let program, module$1, comments, errors;
	return {
		get program() {
			if (!program) program = jsonParseAst(result.program);
			return program;
		},
		get module() {
			if (!module$1) module$1 = result.module;
			return module$1;
		},
		get comments() {
			if (!comments) comments = result.comments;
			return comments;
		},
		get errors() {
			if (!errors) errors = result.errors;
			return errors;
		}
	};
}
function jsonParseAst(programJson) {
	const { node: program, fixes } = JSON.parse(programJson);
	for (const fixPath of fixes) applyFix(program, fixPath);
	return program;
}
function applyFix(program, fixPath) {
	let node = program;
	for (const key of fixPath) node = node[key];
	if (node.bigint) node.value = BigInt(node.bigint);
	else try {
		node.value = RegExp(node.regex.pattern, node.regex.flags);
	} catch (_err) {}
}
function wrap(result, sourceText) {
	result = wrap$1(result);
	if (result.errors.length > 0) return normalizeParseError(sourceText, result.errors);
	return result.program;
}
function normalizeParseError(sourceText, errors) {
	let message = `Parse failed with ${errors.length} error${errors.length < 2 ? "" : "s"}:\n`;
	for (let i$1 = 0; i$1 < errors.length; i$1++) {
		if (i$1 >= 5) {
			message += "\n...";
			break;
		}
		const e$2 = errors[i$1];
		message += e$2.message + "\n" + e$2.labels.map((label) => {
			const location = locate(sourceText, label.start, { offsetLine: 1 });
			if (!location) return;
			return getCodeFrame(sourceText, location.line, location.column);
		}).filter(Boolean).join("\n");
	}
	return error(logParseError(message));
}
const defaultParserOptions = {
	lang: "js",
	preserveParens: false
};
function parseAst(sourceText, options, filename) {
	return wrap(parseSync(filename ?? "file.js", sourceText, {
		...defaultParserOptions,
		...options
	}), sourceText);
}
async function parseAstAsync(sourceText, options, filename) {
	return wrap(await parseAsync(filename ?? "file.js", sourceText, {
		...defaultParserOptions,
		...options
	}), sourceText);
}

//#endregion
//#region node_modules/@databricks/appkit/node_modules/rolldown/dist/shared/misc-CQeo-AFx.mjs
function arraify(value) {
	return Array.isArray(value) ? value : [value];
}
function unimplemented(info) {
	if (info) throw new Error(`unimplemented: ${info}`);
	throw new Error("unimplemented");
}
function unreachable(info) {
	if (info) throw new Error(`unreachable: ${info}`);
	throw new Error("unreachable");
}
function unsupported(info) {
	throw new Error(`UNSUPPORTED: ${info}`);
}
function noop(..._args) {}

//#endregion
//#region node_modules/@databricks/appkit/node_modules/ansis/index.cjs
var require_ansis = __commonJS({ "node_modules/@databricks/appkit/node_modules/ansis/index.cjs"(exports, module) {
	let e$1, t$2, r, { defineProperty: l, setPrototypeOf: n$1, create: o, keys: s } = Object, i = "", { round: c, max: a } = Math, p = (e$2) => {
		let t$3 = /([a-f\d]{3,6})/i.exec(e$2)?.[1], r$1 = t$3?.length, l$1 = parseInt(6 ^ r$1 ? 3 ^ r$1 ? "0" : t$3[0] + t$3[0] + t$3[1] + t$3[1] + t$3[2] + t$3[2] : t$3, 16);
		return [
			l$1 >> 16 & 255,
			l$1 >> 8 & 255,
			255 & l$1
		];
	}, u = (e$2, t$3, r$1) => e$2 ^ t$3 || t$3 ^ r$1 ? 16 + 36 * c(e$2 / 51) + 6 * c(t$3 / 51) + c(r$1 / 51) : 8 > e$2 ? 16 : e$2 > 248 ? 231 : c(24 * (e$2 - 8) / 247) + 232, d = (e$2) => {
		let t$3, r$1, l$1, n$2, o$1;
		return 8 > e$2 ? 30 + e$2 : 16 > e$2 ? e$2 - 8 + 90 : (232 > e$2 ? (o$1 = (e$2 -= 16) % 36, t$3 = (e$2 / 36 | 0) / 5, r$1 = (o$1 / 6 | 0) / 5, l$1 = o$1 % 6 / 5) : t$3 = r$1 = l$1 = (10 * (e$2 - 232) + 8) / 255, n$2 = 2 * a(t$3, r$1, l$1), n$2 ? 30 + (c(l$1) << 2 | c(r$1) << 1 | c(t$3)) + (2 ^ n$2 ? 0 : 60) : 30);
	}, f = (() => {
		let r$1 = (e$2) => o$1.some((t$3) => e$2.test(t$3)), l$1 = globalThis, n$2 = l$1.process ?? {}, o$1 = n$2.argv ?? [], i$1 = n$2.env ?? {}, c$1 = -1;
		try {
			e$1 = "," + s(i$1).join(",");
		} catch (e$2) {
			i$1 = {}, c$1 = 0;
		}
		let a$1 = "FORCE_COLOR", p$1 = {
			false: 0,
			0: 0,
			1: 1,
			2: 2,
			3: 3
		}[i$1[a$1]] ?? -1, u$1 = a$1 in i$1 && p$1 || r$1(/^--color=?(true|always)?$/);
		return u$1 && (c$1 = p$1), ~c$1 || (c$1 = ((r$2, l$2, n$3) => (t$2 = r$2.TERM, {
			"24bit": 3,
			truecolor: 3,
			ansi256: 2,
			ansi: 1
		}[r$2.COLORTERM] || (r$2.CI ? /,GITHUB/.test(e$1) ? 3 : 1 : l$2 && "dumb" !== t$2 ? n$3 ? 3 : /-256/.test(t$2) ? 2 : 1 : 0)))(i$1, !!i$1.PM2_HOME || i$1.NEXT_RUNTIME?.includes("edge") || !!n$2.stdout?.isTTY, "win32" === n$2.platform)), !p$1 || i$1.NO_COLOR || r$1(/^--(no-color|color=(false|never))$/) ? 0 : l$1.window?.chrome || u$1 && !c$1 ? 3 : c$1;
	})(), g = {
		open: i,
		close: i
	}, h = 39, b = 49, O = {}, m = ({ p: e$2 }, { open: t$3, close: l$1 }) => {
		let o$1 = (e$3, ...r$1) => {
			if (!e$3) {
				if (t$3 && t$3 === l$1) return t$3;
				if ((e$3 ?? i) === i) return i;
			}
			let n$2, s$2 = e$3.raw ? String.raw({ raw: e$3 }, ...r$1) : i + e$3, c$2 = o$1.p, a$1 = c$2.o, p$1 = c$2.c;
			if (s$2.includes("\x1B")) for (; c$2; c$2 = c$2.p) {
				let { open: e$4, close: t$4 } = c$2, r$2 = t$4.length, l$2 = i, o$2 = 0;
				if (r$2) for (; ~(n$2 = s$2.indexOf(t$4, o$2)); o$2 = n$2 + r$2) l$2 += s$2.slice(o$2, n$2) + e$4;
				s$2 = l$2 + s$2.slice(o$2);
			}
			return a$1 + (s$2.includes("\n") ? s$2.replace(/(\r?\n)/g, p$1 + "$1" + a$1) : s$2) + p$1;
		}, s$1 = t$3, c$1 = l$1;
		return e$2 && (s$1 = e$2.o + t$3, c$1 = l$1 + e$2.c), n$1(o$1, r), o$1.p = {
			open: t$3,
			close: l$1,
			o: s$1,
			c: c$1,
			p: e$2
		}, o$1.open = s$1, o$1.close = c$1, o$1;
	};
	const w = new function e$2(t$3 = f) {
		let s$1 = {
			Ansis: e$2,
			level: t$3,
			isSupported: () => a$1,
			strip: (e$3) => e$3.replace(/[][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, i),
			extend(e$3) {
				for (let t$4 in e$3) {
					let r$1 = e$3[t$4], l$1 = (typeof r$1)[0];
					"s" === l$1 ? (c$1(t$4, T(...p(r$1))), c$1(_(t$4), v(...p(r$1)))) : c$1(t$4, r$1, "f" === l$1);
				}
				return r = o({}, O), n$1(s$1, r), s$1;
			}
		}, c$1 = (e$3, t$4, r$1) => {
			O[e$3] = { get() {
				let n$2 = r$1 ? (...e$4) => m(this, t$4(...e$4)) : m(this, t$4);
				return l(this, e$3, { value: n$2 }), n$2;
			} };
		}, a$1 = t$3 > 0, w$1 = (e$3, t$4) => a$1 ? {
			open: `[${e$3}m`,
			close: `[${t$4}m`
		} : g, y = (e$3) => (t$4) => (e$3(...p(t$4))), R = (e$3, t$4) => (r$1, l$1, n$2) => (w$1(`${e$3}8;2;${r$1};${l$1};${n$2}`, t$4)), $ = (e$3, t$4) => (r$1, l$1, n$2) => (w$1(((e$4, t$5, r$2) => d(u(e$4, t$5, r$2)))(r$1, l$1, n$2) + e$3, t$4)), x = (e$3) => (t$4, r$1, l$1) => (e$3(u(t$4, r$1, l$1))), T = (R(3, h)), v = (R(4, b)), C = (e$3) => (w$1("38;5;" + e$3, h)), E = (e$3) => (w$1("48;5;" + e$3, b));
		2 === t$3 ? (T = x(C), v = x(E)) : 1 === t$3 && (T = $(0, h), v = $(10, b), C = (e$3) => w$1(d(e$3), h), E = (e$3) => w$1(d(e$3) + 10, b));
		let M, I = {
			fg: C,
			bg: E,
			rgb: T,
			bgRgb: v,
			hex: y(T),
			bgHex: y(v),
			visible: g,
			reset: w$1(0, 0),
			bold: w$1(1, 22),
			dim: w$1(2, 22),
			italic: w$1(3, 23),
			underline: w$1(4, 24),
			inverse: w$1(7, 27),
			hidden: w$1(8, 28),
			strikethrough: w$1(9, 29)
		}, _ = (e$3) => "bg" + (e$3[0].toUpperCase()) + (e$3.slice(1)), k = "Bright";
		return "black,red,green,yellow,blue,magenta,cyan,white,gray".split(",").map((e$3, t$4) => {
			M = _(e$3), 8 > t$4 ? (I[e$3 + k] = w$1(90 + t$4, h), I[M + k] = w$1(100 + t$4, b)) : t$4 = 60, I[e$3] = w$1(30 + t$4, h), I[M] = w$1(40 + t$4, b);
		}), s$1.extend(I);
	}();
	module.exports = w, w.default = w;
} });
var import_ansis = __toESM(require_ansis(), 1);

//#endregion
//#region node_modules/@databricks/appkit/node_modules/ansis/index.mjs
var ansis_default = import_ansis.default;
const { Ansis, fg, bg, rgb, bgRgb, hex, bgHex, reset, inverse, hidden, visible, bold, dim, italic, underline, strikethrough, black, red, green, yellow, blue, magenta, cyan, white, gray, redBright, greenBright, yellowBright, blueBright, magentaBright, cyanBright, whiteBright, bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite, bgGray, bgRedBright, bgGreenBright, bgYellowBright, bgBlueBright, bgMagentaBright, bgCyanBright, bgWhiteBright } = import_ansis.default;

//#endregion
//#region node_modules/@databricks/appkit/node_modules/@rolldown/pluginutils/dist/index.mjs
var And = class {
	kind;
	args;
	constructor(...args$1) {
		if (args$1.length === 0) throw new Error("`And` expects at least one operand");
		this.args = args$1;
		this.kind = "and";
	}
};
var Or = class {
	kind;
	args;
	constructor(...args$1) {
		if (args$1.length === 0) throw new Error("`Or` expects at least one operand");
		this.args = args$1;
		this.kind = "or";
	}
};
var Id = class {
	kind;
	pattern;
	params;
	constructor(pattern, params) {
		this.pattern = pattern;
		this.kind = "id";
		this.params = params ?? { cleanUrl: false };
	}
};
var ModuleType = class {
	kind;
	pattern;
	constructor(pattern) {
		this.pattern = pattern;
		this.kind = "moduleType";
	}
};
var Code = class {
	kind;
	pattern;
	constructor(expr) {
		this.pattern = expr;
		this.kind = "code";
	}
};
var Include = class {
	kind;
	expr;
	constructor(expr) {
		this.expr = expr;
		this.kind = "include";
	}
};
var Exclude = class {
	kind;
	expr;
	constructor(expr) {
		this.expr = expr;
		this.kind = "exclude";
	}
};
function and(...args$1) {
	return new And(...args$1);
}
function or(...args$1) {
	return new Or(...args$1);
}
function id(pattern, params) {
	return new Id(pattern, params);
}
function moduleType(pattern) {
	return new ModuleType(pattern);
}
function code(pattern) {
	return new Code(pattern);
}
function include(expr) {
	return new Include(expr);
}
function exclude(expr) {
	return new Exclude(expr);
}

//#endregion
//#region node_modules/@databricks/appkit/node_modules/rolldown/dist/shared/src-DkvlJJsC.mjs
/**
* This is not the set of all possible signals.
*
* It IS, however, the set of all signals that trigger
* an exit on either Linux or BSD systems.  Linux is a
* superset of the signal names supported on BSD, and
* the unknown signals just fail to register, so we can
* catch that easily enough.
*
* Windows signals are a different set, since there are
* signals that terminate Windows processes, but don't
* terminate (or don't even exist) on Posix systems.
*
* Don't bother with SIGKILL.  It's uncatchable, which
* means that we can't fire any callbacks anyway.
*
* If a user does happen to register a handler on a non-
* fatal signal like SIGWINCH or something, and then
* exit, it'll end up firing `process.emit('exit')`, so
* the handler will be fired anyway.
*
* SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
* artificially, inherently leave the process in a
* state from which it is not safe to try and enter JS
* listeners.
*/
const signals = [];
signals.push("SIGHUP", "SIGINT", "SIGTERM");
if (process.platform !== "win32") signals.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
if (process.platform === "linux") signals.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
const processOk = (process$2) => !!process$2 && typeof process$2 === "object" && typeof process$2.removeListener === "function" && typeof process$2.emit === "function" && typeof process$2.reallyExit === "function" && typeof process$2.listeners === "function" && typeof process$2.kill === "function" && typeof process$2.pid === "number" && typeof process$2.on === "function";
const kExitEmitter = Symbol.for("signal-exit emitter");
const global$1 = globalThis;
const ObjectDefineProperty = Object.defineProperty.bind(Object);
var Emitter = class {
	emitted = {
		afterExit: false,
		exit: false
	};
	listeners = {
		afterExit: [],
		exit: []
	};
	count = 0;
	id = Math.random();
	constructor() {
		if (global$1[kExitEmitter]) return global$1[kExitEmitter];
		ObjectDefineProperty(global$1, kExitEmitter, {
			value: this,
			writable: false,
			enumerable: false,
			configurable: false
		});
	}
	on(ev, fn) {
		this.listeners[ev].push(fn);
	}
	removeListener(ev, fn) {
		const list = this.listeners[ev];
		const i$1 = list.indexOf(fn);
		/* c8 ignore start */
		if (i$1 === -1) return;
		/* c8 ignore stop */
		if (i$1 === 0 && list.length === 1) list.length = 0;
		else list.splice(i$1, 1);
	}
	emit(ev, code$1, signal) {
		if (this.emitted[ev]) return false;
		this.emitted[ev] = true;
		let ret = false;
		for (const fn of this.listeners[ev]) ret = fn(code$1, signal) === true || ret;
		if (ev === "exit") ret = this.emit("afterExit", code$1, signal) || ret;
		return ret;
	}
};
var SignalExitBase = class {};
const signalExitWrap = (handler) => {
	return {
		onExit(cb, opts) {
			return handler.onExit(cb, opts);
		},
		load() {
			return handler.load();
		},
		unload() {
			return handler.unload();
		}
	};
};
var SignalExitFallback = class extends SignalExitBase {
	onExit() {
		return () => {};
	}
	load() {}
	unload() {}
};
var SignalExit = class extends SignalExitBase {
	/* c8 ignore start */
	#hupSig = process$1.platform === "win32" ? "SIGINT" : "SIGHUP";
	/* c8 ignore stop */
	#emitter = new Emitter();
	#process;
	#originalProcessEmit;
	#originalProcessReallyExit;
	#sigListeners = {};
	#loaded = false;
	constructor(process$2) {
		super();
		this.#process = process$2;
		this.#sigListeners = {};
		for (const sig of signals) this.#sigListeners[sig] = () => {
			const listeners = this.#process.listeners(sig);
			let { count } = this.#emitter;
			/* c8 ignore start */
			const p$1 = process$2;
			if (typeof p$1.__signal_exit_emitter__ === "object" && typeof p$1.__signal_exit_emitter__.count === "number") count += p$1.__signal_exit_emitter__.count;
			/* c8 ignore stop */
			if (listeners.length === count) {
				this.unload();
				const ret = this.#emitter.emit("exit", null, sig);
				/* c8 ignore start */
				const s$1 = sig === "SIGHUP" ? this.#hupSig : sig;
				if (!ret) process$2.kill(process$2.pid, s$1);
			}
		};
		this.#originalProcessReallyExit = process$2.reallyExit;
		this.#originalProcessEmit = process$2.emit;
	}
	onExit(cb, opts) {
		/* c8 ignore start */
		if (!processOk(this.#process)) return () => {};
		/* c8 ignore stop */
		if (this.#loaded === false) this.load();
		const ev = opts?.alwaysLast ? "afterExit" : "exit";
		this.#emitter.on(ev, cb);
		return () => {
			this.#emitter.removeListener(ev, cb);
			if (this.#emitter.listeners["exit"].length === 0 && this.#emitter.listeners["afterExit"].length === 0) this.unload();
		};
	}
	load() {
		if (this.#loaded) return;
		this.#loaded = true;
		this.#emitter.count += 1;
		for (const sig of signals) try {
			const fn = this.#sigListeners[sig];
			if (fn) this.#process.on(sig, fn);
		} catch (_) {}
		this.#process.emit = (ev, ...a$1) => {
			return this.#processEmit(ev, ...a$1);
		};
		this.#process.reallyExit = (code$1) => {
			return this.#processReallyExit(code$1);
		};
	}
	unload() {
		if (!this.#loaded) return;
		this.#loaded = false;
		signals.forEach((sig) => {
			const listener = this.#sigListeners[sig];
			/* c8 ignore start */
			if (!listener) throw new Error("Listener not defined for signal: " + sig);
			/* c8 ignore stop */
			try {
				this.#process.removeListener(sig, listener);
			} catch (_) {}
			/* c8 ignore stop */
		});
		this.#process.emit = this.#originalProcessEmit;
		this.#process.reallyExit = this.#originalProcessReallyExit;
		this.#emitter.count -= 1;
	}
	#processReallyExit(code$1) {
		/* c8 ignore start */
		if (!processOk(this.#process)) return 0;
		this.#process.exitCode = code$1 || 0;
		/* c8 ignore stop */
		this.#emitter.emit("exit", this.#process.exitCode, null);
		return this.#originalProcessReallyExit.call(this.#process, this.#process.exitCode);
	}
	#processEmit(ev, ...args$1) {
		const og = this.#originalProcessEmit;
		if (ev === "exit" && processOk(this.#process)) {
			if (typeof args$1[0] === "number") this.#process.exitCode = args$1[0];
			/* c8 ignore start */
			const ret = og.call(this.#process, ev, ...args$1);
			/* c8 ignore start */
			this.#emitter.emit("exit", this.#process.exitCode, null);
			/* c8 ignore stop */
			return ret;
		} else return og.call(this.#process, ev, ...args$1);
	}
};
const process$1 = globalThis.process;
const { onExit, load, unload } = signalExitWrap(processOk(process$1) ? new SignalExit(process$1) : new SignalExitFallback());
if (isMainThread) {
	const subscriberGuard = initTraceSubscriber();
	onExit(() => {
		subscriberGuard?.close();
	});
}
var version = "1.0.0-beta.41";
var BuiltinPlugin = class {
	constructor(name, _options) {
		this.name = name;
		this._options = _options;
	}
};
function makeBuiltinPluginCallable(plugin) {
	let callablePlugin = new BindingCallableBuiltinPlugin(bindingifyBuiltInPlugin(plugin));
	const wrappedPlugin = plugin;
	for (const key in callablePlugin) wrappedPlugin[key] = async function(...args$1) {
		try {
			return await callablePlugin[key](...args$1);
		} catch (e$1$1) {
			if (e$1$1 instanceof Error && !e$1$1.stack?.includes("at ")) Error.captureStackTrace(e$1$1, wrappedPlugin[key]);
			return error(logPluginError(e$1$1, plugin.name, {
				hook: key,
				id: key === "transform" ? args$1[2] : void 0
			}));
		}
	};
	return wrappedPlugin;
}
function bindingifyBuiltInPlugin(plugin) {
	return {
		__name: plugin.name,
		options: plugin._options
	};
}
const LOG_LEVEL_SILENT = "silent";
const LOG_LEVEL_ERROR = "error";
const LOG_LEVEL_WARN = "warn";
const LOG_LEVEL_INFO = "info";
const LOG_LEVEL_DEBUG = "debug";
const logLevelPriority = {
	[LOG_LEVEL_DEBUG]: 0,
	[LOG_LEVEL_INFO]: 1,
	[LOG_LEVEL_WARN]: 2,
	[LOG_LEVEL_SILENT]: 3
};
const normalizeLog = (log) => typeof log === "string" ? { message: log } : typeof log === "function" ? normalizeLog(log()) : log;
function getLogHandler(level, code$1, logger, pluginName, logLevel) {
	if (logLevelPriority[level] < logLevelPriority[logLevel]) return noop;
	return (log, pos) => {
		if (pos != null) logger(LOG_LEVEL_WARN, logInvalidLogPosition(pluginName));
		log = normalizeLog(log);
		if (log.code && !log.pluginCode) log.pluginCode = log.code;
		log.code = code$1;
		log.plugin = pluginName;
		logger(level, log);
	};
}
function getLogger(plugins, onLog, logLevel, watchMode) {
	const minimalPriority = logLevelPriority[logLevel];
	const logger = (level, log, skipped = /* @__PURE__ */ new Set()) => {
		if (logLevelPriority[level] < minimalPriority) return;
		for (const plugin of getSortedPlugins("onLog", plugins)) {
			if (skipped.has(plugin)) continue;
			const { onLog: pluginOnLog } = plugin;
			if (pluginOnLog) {
				const getLogHandler$1 = (level$1) => {
					if (logLevelPriority[level$1] < minimalPriority) return () => {};
					return (log$1) => logger(level$1, normalizeLog(log$1), new Set(skipped).add(plugin));
				};
				if (("handler" in pluginOnLog ? pluginOnLog.handler : pluginOnLog).call({
					debug: getLogHandler$1(LOG_LEVEL_DEBUG),
					error: (log$1) => error(normalizeLog(log$1)),
					info: getLogHandler$1(LOG_LEVEL_INFO),
					meta: {
						rollupVersion: "4.23.0",
						rolldownVersion: VERSION,
						watchMode
					},
					warn: getLogHandler$1(LOG_LEVEL_WARN),
					pluginName: plugin.name || "unknown"
				}, level, log) === false) return;
			}
		}
		onLog(level, log);
	};
	return logger;
}
const getOnLog = (config, logLevel, printLog = defaultPrintLog) => {
	const { onwarn, onLog } = config;
	const defaultOnLog = getDefaultOnLog(printLog, onwarn);
	if (onLog) {
		const minimalPriority = logLevelPriority[logLevel];
		return (level, log) => onLog(level, addLogToString(log), (level$1, handledLog) => {
			if (level$1 === LOG_LEVEL_ERROR) return error(normalizeLog(handledLog));
			if (logLevelPriority[level$1] >= minimalPriority) defaultOnLog(level$1, normalizeLog(handledLog));
		});
	}
	return defaultOnLog;
};
const getDefaultOnLog = (printLog, onwarn) => onwarn ? (level, log) => {
	if (level === LOG_LEVEL_WARN) onwarn(addLogToString(log), (warning) => printLog(LOG_LEVEL_WARN, normalizeLog(warning)));
	else printLog(level, log);
} : printLog;
const addLogToString = (log) => {
	Object.defineProperty(log, "toString", {
		value: () => getExtendedLogMessage(log),
		writable: true
	});
	return log;
};
const defaultPrintLog = (level, log) => {
	const message = getExtendedLogMessage(log);
	switch (level) {
		case LOG_LEVEL_WARN: return console.warn(message);
		case LOG_LEVEL_DEBUG: return console.debug(message);
		default: return console.info(message);
	}
};
const getExtendedLogMessage = (log) => {
	let prefix = "";
	if (log.plugin) prefix += `(${log.plugin} plugin) `;
	if (log.loc) prefix += `${relativeId(log.loc.file)} (${log.loc.line}:${log.loc.column}) `;
	return prefix + log.message;
};
function relativeId(id$1) {
	if (!path.isAbsolute(id$1)) return id$1;
	return path.relative(path.resolve(), id$1);
}
function normalizeHook(hook) {
	if (typeof hook === "function" || typeof hook === "string") return {
		handler: hook,
		options: {},
		meta: {}
	};
	if (typeof hook === "object" && hook !== null) {
		const { handler, order,...options } = hook;
		return {
			handler,
			options,
			meta: { order }
		};
	}
	unreachable("Invalid hook type");
}
const ENUMERATED_INPUT_PLUGIN_HOOK_NAMES = [
	"options",
	"buildStart",
	"resolveId",
	"load",
	"transform",
	"moduleParsed",
	"buildEnd",
	"onLog",
	"resolveDynamicImport",
	"closeBundle",
	"closeWatcher",
	"watchChange"
];
const ENUMERATED_OUTPUT_PLUGIN_HOOK_NAMES = [
	"augmentChunkHash",
	"outputOptions",
	"renderChunk",
	"renderStart",
	"renderError",
	"writeBundle",
	"generateBundle"
];
const ENUMERATED_PLUGIN_HOOK_NAMES = [
	...ENUMERATED_INPUT_PLUGIN_HOOK_NAMES,
	...ENUMERATED_OUTPUT_PLUGIN_HOOK_NAMES,
	"footer",
	"banner",
	"intro",
	"outro"
];
/**
* Names of all defined hooks. It's like
* ```js
* const DEFINED_HOOK_NAMES ={
*   options: 'options',
*   buildStart: 'buildStart',
*   ...
* }
* ```
*/
const DEFINED_HOOK_NAMES = {
	[ENUMERATED_PLUGIN_HOOK_NAMES[0]]: ENUMERATED_PLUGIN_HOOK_NAMES[0],
	[ENUMERATED_PLUGIN_HOOK_NAMES[1]]: ENUMERATED_PLUGIN_HOOK_NAMES[1],
	[ENUMERATED_PLUGIN_HOOK_NAMES[2]]: ENUMERATED_PLUGIN_HOOK_NAMES[2],
	[ENUMERATED_PLUGIN_HOOK_NAMES[3]]: ENUMERATED_PLUGIN_HOOK_NAMES[3],
	[ENUMERATED_PLUGIN_HOOK_NAMES[4]]: ENUMERATED_PLUGIN_HOOK_NAMES[4],
	[ENUMERATED_PLUGIN_HOOK_NAMES[5]]: ENUMERATED_PLUGIN_HOOK_NAMES[5],
	[ENUMERATED_PLUGIN_HOOK_NAMES[6]]: ENUMERATED_PLUGIN_HOOK_NAMES[6],
	[ENUMERATED_PLUGIN_HOOK_NAMES[7]]: ENUMERATED_PLUGIN_HOOK_NAMES[7],
	[ENUMERATED_PLUGIN_HOOK_NAMES[8]]: ENUMERATED_PLUGIN_HOOK_NAMES[8],
	[ENUMERATED_PLUGIN_HOOK_NAMES[9]]: ENUMERATED_PLUGIN_HOOK_NAMES[9],
	[ENUMERATED_PLUGIN_HOOK_NAMES[10]]: ENUMERATED_PLUGIN_HOOK_NAMES[10],
	[ENUMERATED_PLUGIN_HOOK_NAMES[11]]: ENUMERATED_PLUGIN_HOOK_NAMES[11],
	[ENUMERATED_PLUGIN_HOOK_NAMES[12]]: ENUMERATED_PLUGIN_HOOK_NAMES[12],
	[ENUMERATED_PLUGIN_HOOK_NAMES[13]]: ENUMERATED_PLUGIN_HOOK_NAMES[13],
	[ENUMERATED_PLUGIN_HOOK_NAMES[14]]: ENUMERATED_PLUGIN_HOOK_NAMES[14],
	[ENUMERATED_PLUGIN_HOOK_NAMES[15]]: ENUMERATED_PLUGIN_HOOK_NAMES[15],
	[ENUMERATED_PLUGIN_HOOK_NAMES[16]]: ENUMERATED_PLUGIN_HOOK_NAMES[16],
	[ENUMERATED_PLUGIN_HOOK_NAMES[17]]: ENUMERATED_PLUGIN_HOOK_NAMES[17],
	[ENUMERATED_PLUGIN_HOOK_NAMES[18]]: ENUMERATED_PLUGIN_HOOK_NAMES[18],
	[ENUMERATED_PLUGIN_HOOK_NAMES[19]]: ENUMERATED_PLUGIN_HOOK_NAMES[19],
	[ENUMERATED_PLUGIN_HOOK_NAMES[20]]: ENUMERATED_PLUGIN_HOOK_NAMES[20],
	[ENUMERATED_PLUGIN_HOOK_NAMES[21]]: ENUMERATED_PLUGIN_HOOK_NAMES[21],
	[ENUMERATED_PLUGIN_HOOK_NAMES[22]]: ENUMERATED_PLUGIN_HOOK_NAMES[22]
};
async function asyncFlatten(array$1) {
	do
		array$1 = (await Promise.all(array$1)).flat(Infinity);
	while (array$1.some((v) => v?.then));
	return array$1;
}
const normalizePluginOption = async (plugins) => (await asyncFlatten([plugins])).filter(Boolean);
function checkOutputPluginOption(plugins, onLog) {
	for (const plugin of plugins) for (const hook of ENUMERATED_INPUT_PLUGIN_HOOK_NAMES) if (hook in plugin) {
		delete plugin[hook];
		onLog(LOG_LEVEL_WARN, logInputHookInOutputPlugin(plugin.name, hook));
	}
	return plugins;
}
function normalizePlugins(plugins, anonymousPrefix) {
	for (const [index, plugin] of plugins.entries()) {
		if ("_parallel" in plugin) continue;
		if (plugin instanceof BuiltinPlugin) continue;
		if (!plugin.name) plugin.name = `${anonymousPrefix}${index + 1}`;
	}
	return plugins;
}
const ANONYMOUS_PLUGIN_PREFIX = "at position ";
const ANONYMOUS_OUTPUT_PLUGIN_PREFIX = "at output position ";
var MinimalPluginContextImpl = class {
	info;
	warn;
	debug;
	meta;
	constructor(onLog, logLevel, pluginName, watchMode, hookName) {
		this.pluginName = pluginName;
		this.hookName = hookName;
		this.debug = getLogHandler(LOG_LEVEL_DEBUG, "PLUGIN_LOG", onLog, pluginName, logLevel);
		this.info = getLogHandler(LOG_LEVEL_INFO, "PLUGIN_LOG", onLog, pluginName, logLevel);
		this.warn = getLogHandler(LOG_LEVEL_WARN, "PLUGIN_WARNING", onLog, pluginName, logLevel);
		this.meta = {
			rollupVersion: "4.23.0",
			rolldownVersion: VERSION,
			watchMode
		};
	}
	error(e$1$1) {
		return error(logPluginError(normalizeLog(e$1$1), this.pluginName, { hook: this.hookName }));
	}
};
var PluginDriver = class {
	static async callOptionsHook(inputOptions, watchMode = false) {
		const logLevel = inputOptions.logLevel || LOG_LEVEL_INFO;
		const plugins = getSortedPlugins("options", getObjectPlugins(await normalizePluginOption(inputOptions.plugins)));
		const logger = getLogger(plugins, getOnLog(inputOptions, logLevel), logLevel, watchMode);
		for (const plugin of plugins) {
			const name = plugin.name || "unknown";
			const options = plugin.options;
			if (options) {
				const { handler } = normalizeHook(options);
				const result = await handler.call(new MinimalPluginContextImpl(logger, logLevel, name, watchMode, "onLog"), inputOptions);
				if (result) inputOptions = result;
			}
		}
		return inputOptions;
	}
	static callOutputOptionsHook(rawPlugins, outputOptions, onLog, logLevel, watchMode) {
		const sortedPlugins = getSortedPlugins("outputOptions", getObjectPlugins(rawPlugins));
		for (const plugin of sortedPlugins) {
			const name = plugin.name || "unknown";
			const options = plugin.outputOptions;
			if (options) {
				const { handler } = normalizeHook(options);
				const result = handler.call(new MinimalPluginContextImpl(onLog, logLevel, name, watchMode), outputOptions);
				if (result) outputOptions = result;
			}
		}
		return outputOptions;
	}
};
function getObjectPlugins(plugins) {
	return plugins.filter((plugin) => {
		if (!plugin) return;
		if ("_parallel" in plugin) return;
		if (plugin instanceof BuiltinPlugin) return;
		return plugin;
	});
}
function getSortedPlugins(hookName, plugins) {
	const pre = [];
	const normal = [];
	const post = [];
	for (const plugin of plugins) {
		const hook = plugin[hookName];
		if (hook) {
			if (typeof hook === "object") {
				if (hook.order === "pre") {
					pre.push(plugin);
					continue;
				}
				if (hook.order === "post") {
					post.push(plugin);
					continue;
				}
			}
			normal.push(plugin);
		}
	}
	return [
		...pre,
		...normal,
		...post
	];
}
var store;
/* @__NO_SIDE_EFFECTS__ */
function getGlobalConfig(config2) {
	return {
		lang: config2?.lang ?? store?.lang,
		message: config2?.message,
		abortEarly: config2?.abortEarly ?? store?.abortEarly,
		abortPipeEarly: config2?.abortPipeEarly ?? store?.abortPipeEarly
	};
}
var store2;
/* @__NO_SIDE_EFFECTS__ */
function getGlobalMessage(lang) {
	return store2?.get(lang);
}
var store3;
/* @__NO_SIDE_EFFECTS__ */
function getSchemaMessage(lang) {
	return store3?.get(lang);
}
var store4;
/* @__NO_SIDE_EFFECTS__ */
function getSpecificMessage(reference, lang) {
	return store4?.get(reference)?.get(lang);
}
/* @__NO_SIDE_EFFECTS__ */
function _stringify(input) {
	const type = typeof input;
	if (type === "string") return `"${input}"`;
	if (type === "number" || type === "bigint" || type === "boolean") return `${input}`;
	if (type === "object" || type === "function") return (input && Object.getPrototypeOf(input)?.constructor?.name) ?? "null";
	return type;
}
function _addIssue(context, label, dataset, config2, other) {
	const input = other && "input" in other ? other.input : dataset.value;
	const expected = other?.expected ?? context.expects ?? null;
	const received = other?.received ?? /* @__PURE__ */ _stringify(input);
	const issue = {
		kind: context.kind,
		type: context.type,
		input,
		expected,
		received,
		message: `Invalid ${label}: ${expected ? `Expected ${expected} but r` : "R"}eceived ${received}`,
		requirement: context.requirement,
		path: other?.path,
		issues: other?.issues,
		lang: config2.lang,
		abortEarly: config2.abortEarly,
		abortPipeEarly: config2.abortPipeEarly
	};
	const isSchema = context.kind === "schema";
	const message2 = other?.message ?? context.message ?? /* @__PURE__ */ getSpecificMessage(context.reference, issue.lang) ?? (isSchema ? /* @__PURE__ */ getSchemaMessage(issue.lang) : null) ?? config2.message ?? /* @__PURE__ */ getGlobalMessage(issue.lang);
	if (message2 !== void 0) issue.message = typeof message2 === "function" ? message2(issue) : message2;
	if (isSchema) dataset.typed = false;
	if (dataset.issues) dataset.issues.push(issue);
	else dataset.issues = [issue];
}
/* @__NO_SIDE_EFFECTS__ */
function _getStandardProps(context) {
	return {
		version: 1,
		vendor: "valibot",
		validate(value2) {
			return context["~run"]({ value: value2 }, /* @__PURE__ */ getGlobalConfig());
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function _isValidObjectKey(object2, key) {
	return Object.hasOwn(object2, key) && key !== "__proto__" && key !== "prototype" && key !== "constructor";
}
/* @__NO_SIDE_EFFECTS__ */
function _joinExpects(values2, separator) {
	const list = [...new Set(values2)];
	if (list.length > 1) return `(${list.join(` ${separator} `)})`;
	return list[0] ?? "never";
}
var ValiError = class extends Error {
	/**
	* Creates a Valibot error with useful information.
	*
	* @param issues The error issues.
	*/
	constructor(issues) {
		super(issues[0].message);
		this.name = "ValiError";
		this.issues = issues;
	}
};
/* @__NO_SIDE_EFFECTS__ */
function args(schema) {
	return {
		kind: "transformation",
		type: "args",
		reference: args,
		async: false,
		schema,
		"~run"(dataset, config2) {
			const func = dataset.value;
			dataset.value = (...args_) => {
				const argsDataset = this.schema["~run"]({ value: args_ }, config2);
				if (argsDataset.issues) throw new ValiError(argsDataset.issues);
				return func(...argsDataset.value);
			};
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function awaitAsync() {
	return {
		kind: "transformation",
		type: "await",
		reference: awaitAsync,
		async: true,
		async "~run"(dataset) {
			dataset.value = await dataset.value;
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function description(description_) {
	return {
		kind: "metadata",
		type: "description",
		reference: description,
		description: description_
	};
}
/* @__NO_SIDE_EFFECTS__ */
function returns(schema) {
	return {
		kind: "transformation",
		type: "returns",
		reference: returns,
		async: false,
		schema,
		"~run"(dataset, config2) {
			const func = dataset.value;
			dataset.value = (...args_) => {
				const returnsDataset = this.schema["~run"]({ value: func(...args_) }, config2);
				if (returnsDataset.issues) throw new ValiError(returnsDataset.issues);
				return returnsDataset.value;
			};
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function returnsAsync(schema) {
	return {
		kind: "transformation",
		type: "returns",
		reference: returnsAsync,
		async: false,
		schema,
		"~run"(dataset, config2) {
			const func = dataset.value;
			dataset.value = async (...args_) => {
				const returnsDataset = await this.schema["~run"]({ value: await func(...args_) }, config2);
				if (returnsDataset.issues) throw new ValiError(returnsDataset.issues);
				return returnsDataset.value;
			};
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function getFallback(schema, dataset, config2) {
	return typeof schema.fallback === "function" ? schema.fallback(dataset, config2) : schema.fallback;
}
/* @__NO_SIDE_EFFECTS__ */
function getDefault(schema, dataset, config2) {
	return typeof schema.default === "function" ? schema.default(dataset, config2) : schema.default;
}
/* @__NO_SIDE_EFFECTS__ */
function any() {
	return {
		kind: "schema",
		type: "any",
		reference: any,
		expects: "any",
		async: false,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset) {
			dataset.typed = true;
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function array(item, message2) {
	return {
		kind: "schema",
		type: "array",
		reference: array,
		expects: "Array",
		async: false,
		item,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				for (let key = 0; key < input.length; key++) {
					const value2 = input[key];
					const itemDataset = this.item["~run"]({ value: value2 }, config2);
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value2
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config2.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
			} else _addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function boolean(message2) {
	return {
		kind: "schema",
		type: "boolean",
		reference: boolean,
		expects: "boolean",
		async: false,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			if (typeof dataset.value === "boolean") dataset.typed = true;
			else _addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function custom(check2, message2) {
	return {
		kind: "schema",
		type: "custom",
		reference: custom,
		expects: "unknown",
		async: false,
		check: check2,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			if (this.check(dataset.value)) dataset.typed = true;
			else _addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function function_(message2) {
	return {
		kind: "schema",
		type: "function",
		reference: function_,
		expects: "Function",
		async: false,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			if (typeof dataset.value === "function") dataset.typed = true;
			else _addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function instance(class_, message2) {
	return {
		kind: "schema",
		type: "instance",
		reference: instance,
		expects: class_.name,
		async: false,
		class: class_,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			if (dataset.value instanceof this.class) dataset.typed = true;
			else _addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function literal(literal_, message2) {
	return {
		kind: "schema",
		type: "literal",
		reference: literal,
		expects: /* @__PURE__ */ _stringify(literal_),
		async: false,
		literal: literal_,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			if (dataset.value === this.literal) dataset.typed = true;
			else _addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function looseObject(entries2, message2) {
	return {
		kind: "schema",
		type: "loose_object",
		reference: looseObject,
		expects: "Object",
		async: false,
		entries: entries2,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const key in this.entries) {
					const valueSchema = this.entries[key];
					if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
						const value2 = key in input ? input[key] : /* @__PURE__ */ getDefault(valueSchema);
						const valueDataset = valueSchema["~run"]({ value: value2 }, config2);
						if (valueDataset.issues) {
							const pathItem = {
								type: "object",
								origin: "value",
								input,
								key,
								value: value2
							};
							for (const issue of valueDataset.issues) {
								if (issue.path) issue.path.unshift(pathItem);
								else issue.path = [pathItem];
								dataset.issues?.push(issue);
							}
							if (!dataset.issues) dataset.issues = valueDataset.issues;
							if (config2.abortEarly) {
								dataset.typed = false;
								break;
							}
						}
						if (!valueDataset.typed) dataset.typed = false;
						dataset.value[key] = valueDataset.value;
					} else if (valueSchema.fallback !== void 0) dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
					else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
						_addIssue(this, "key", dataset, config2, {
							input: void 0,
							expected: `"${key}"`,
							path: [{
								type: "object",
								origin: "key",
								input,
								key,
								value: input[key]
							}]
						});
						if (config2.abortEarly) break;
					}
				}
				if (!dataset.issues || !config2.abortEarly) {
					for (const key in input) if (/* @__PURE__ */ _isValidObjectKey(input, key) && !(key in this.entries)) dataset.value[key] = input[key];
				}
			} else _addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function never(message2) {
	return {
		kind: "schema",
		type: "never",
		reference: never,
		expects: "never",
		async: false,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			_addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function nullish(wrapped, default_) {
	return {
		kind: "schema",
		type: "nullish",
		reference: nullish,
		expects: `(${wrapped.expects} | null | undefined)`,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			if (dataset.value === null || dataset.value === void 0) {
				if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config2);
				if (dataset.value === null || dataset.value === void 0) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config2);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function number(message2) {
	return {
		kind: "schema",
		type: "number",
		reference: number,
		expects: "number",
		async: false,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			if (typeof dataset.value === "number" && !isNaN(dataset.value)) dataset.typed = true;
			else _addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function object(entries2, message2) {
	return {
		kind: "schema",
		type: "object",
		reference: object,
		expects: "Object",
		async: false,
		entries: entries2,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const key in this.entries) {
					const valueSchema = this.entries[key];
					if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
						const value2 = key in input ? input[key] : /* @__PURE__ */ getDefault(valueSchema);
						const valueDataset = valueSchema["~run"]({ value: value2 }, config2);
						if (valueDataset.issues) {
							const pathItem = {
								type: "object",
								origin: "value",
								input,
								key,
								value: value2
							};
							for (const issue of valueDataset.issues) {
								if (issue.path) issue.path.unshift(pathItem);
								else issue.path = [pathItem];
								dataset.issues?.push(issue);
							}
							if (!dataset.issues) dataset.issues = valueDataset.issues;
							if (config2.abortEarly) {
								dataset.typed = false;
								break;
							}
						}
						if (!valueDataset.typed) dataset.typed = false;
						dataset.value[key] = valueDataset.value;
					} else if (valueSchema.fallback !== void 0) dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
					else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
						_addIssue(this, "key", dataset, config2, {
							input: void 0,
							expected: `"${key}"`,
							path: [{
								type: "object",
								origin: "key",
								input,
								key,
								value: input[key]
							}]
						});
						if (config2.abortEarly) break;
					}
				}
			} else _addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function optional(wrapped, default_) {
	return {
		kind: "schema",
		type: "optional",
		reference: optional,
		expects: `(${wrapped.expects} | undefined)`,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			if (dataset.value === void 0) {
				if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config2);
				if (dataset.value === void 0) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config2);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function promise(message2) {
	return {
		kind: "schema",
		type: "promise",
		reference: promise,
		expects: "Promise",
		async: false,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			if (dataset.value instanceof Promise) dataset.typed = true;
			else _addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function record(key, value2, message2) {
	return {
		kind: "schema",
		type: "record",
		reference: record,
		expects: "Object",
		async: false,
		key,
		value: value2,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const entryKey in input) if (/* @__PURE__ */ _isValidObjectKey(input, entryKey)) {
					const entryValue = input[entryKey];
					const keyDataset = this.key["~run"]({ value: entryKey }, config2);
					if (keyDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "key",
							input,
							key: entryKey,
							value: entryValue
						};
						for (const issue of keyDataset.issues) {
							issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = keyDataset.issues;
						if (config2.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					const valueDataset = this.value["~run"]({ value: entryValue }, config2);
					if (valueDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "value",
							input,
							key: entryKey,
							value: entryValue
						};
						for (const issue of valueDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = valueDataset.issues;
						if (config2.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!keyDataset.typed || !valueDataset.typed) dataset.typed = false;
					if (keyDataset.typed) dataset.value[keyDataset.value] = valueDataset.value;
				}
			} else _addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function strictObject(entries2, message2) {
	return {
		kind: "schema",
		type: "strict_object",
		reference: strictObject,
		expects: "Object",
		async: false,
		entries: entries2,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const key in this.entries) {
					const valueSchema = this.entries[key];
					if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
						const value2 = key in input ? input[key] : /* @__PURE__ */ getDefault(valueSchema);
						const valueDataset = valueSchema["~run"]({ value: value2 }, config2);
						if (valueDataset.issues) {
							const pathItem = {
								type: "object",
								origin: "value",
								input,
								key,
								value: value2
							};
							for (const issue of valueDataset.issues) {
								if (issue.path) issue.path.unshift(pathItem);
								else issue.path = [pathItem];
								dataset.issues?.push(issue);
							}
							if (!dataset.issues) dataset.issues = valueDataset.issues;
							if (config2.abortEarly) {
								dataset.typed = false;
								break;
							}
						}
						if (!valueDataset.typed) dataset.typed = false;
						dataset.value[key] = valueDataset.value;
					} else if (valueSchema.fallback !== void 0) dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
					else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
						_addIssue(this, "key", dataset, config2, {
							input: void 0,
							expected: `"${key}"`,
							path: [{
								type: "object",
								origin: "key",
								input,
								key,
								value: input[key]
							}]
						});
						if (config2.abortEarly) break;
					}
				}
				if (!dataset.issues || !config2.abortEarly) {
					for (const key in input) if (!(key in this.entries)) {
						_addIssue(this, "key", dataset, config2, {
							input: key,
							expected: "never",
							path: [{
								type: "object",
								origin: "key",
								input,
								key,
								value: input[key]
							}]
						});
						break;
					}
				}
			} else _addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function string(message2) {
	return {
		kind: "schema",
		type: "string",
		reference: string,
		expects: "string",
		async: false,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			if (typeof dataset.value === "string") dataset.typed = true;
			else _addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function tuple(items, message2) {
	return {
		kind: "schema",
		type: "tuple",
		reference: tuple,
		expects: "Array",
		async: false,
		items,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			const input = dataset.value;
			if (Array.isArray(input)) {
				dataset.typed = true;
				dataset.value = [];
				for (let key = 0; key < this.items.length; key++) {
					const value2 = input[key];
					const itemDataset = this.items[key]["~run"]({ value: value2 }, config2);
					if (itemDataset.issues) {
						const pathItem = {
							type: "array",
							origin: "value",
							input,
							key,
							value: value2
						};
						for (const issue of itemDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = itemDataset.issues;
						if (config2.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!itemDataset.typed) dataset.typed = false;
					dataset.value.push(itemDataset.value);
				}
			} else _addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function _subIssues(datasets) {
	let issues;
	if (datasets) for (const dataset of datasets) if (issues) issues.push(...dataset.issues);
	else issues = dataset.issues;
	return issues;
}
/* @__NO_SIDE_EFFECTS__ */
function union(options, message2) {
	return {
		kind: "schema",
		type: "union",
		reference: union,
		expects: /* @__PURE__ */ _joinExpects(options.map((option) => option.expects), "|"),
		async: false,
		options,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			let validDataset;
			let typedDatasets;
			let untypedDatasets;
			for (const schema of this.options) {
				const optionDataset = schema["~run"]({ value: dataset.value }, config2);
				if (optionDataset.typed) if (optionDataset.issues) if (typedDatasets) typedDatasets.push(optionDataset);
				else typedDatasets = [optionDataset];
				else {
					validDataset = optionDataset;
					break;
				}
				else if (untypedDatasets) untypedDatasets.push(optionDataset);
				else untypedDatasets = [optionDataset];
			}
			if (validDataset) return validDataset;
			if (typedDatasets) {
				if (typedDatasets.length === 1) return typedDatasets[0];
				_addIssue(this, "type", dataset, config2, { issues: /* @__PURE__ */ _subIssues(typedDatasets) });
				dataset.typed = true;
			} else if (untypedDatasets?.length === 1) return untypedDatasets[0];
			else _addIssue(this, "type", dataset, config2, { issues: /* @__PURE__ */ _subIssues(untypedDatasets) });
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function unionAsync(options, message2) {
	return {
		kind: "schema",
		type: "union",
		reference: unionAsync,
		expects: /* @__PURE__ */ _joinExpects(options.map((option) => option.expects), "|"),
		async: true,
		options,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config2) {
			let validDataset;
			let typedDatasets;
			let untypedDatasets;
			for (const schema of this.options) {
				const optionDataset = await schema["~run"]({ value: dataset.value }, config2);
				if (optionDataset.typed) if (optionDataset.issues) if (typedDatasets) typedDatasets.push(optionDataset);
				else typedDatasets = [optionDataset];
				else {
					validDataset = optionDataset;
					break;
				}
				else if (untypedDatasets) untypedDatasets.push(optionDataset);
				else untypedDatasets = [optionDataset];
			}
			if (validDataset) return validDataset;
			if (typedDatasets) {
				if (typedDatasets.length === 1) return typedDatasets[0];
				_addIssue(this, "type", dataset, config2, { issues: /* @__PURE__ */ _subIssues(typedDatasets) });
				dataset.typed = true;
			} else if (untypedDatasets?.length === 1) return untypedDatasets[0];
			else _addIssue(this, "type", dataset, config2, { issues: /* @__PURE__ */ _subIssues(untypedDatasets) });
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function void_(message2) {
	return {
		kind: "schema",
		type: "void",
		reference: void_,
		expects: "void",
		async: false,
		message: message2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			if (dataset.value === void 0) dataset.typed = true;
			else _addIssue(this, "type", dataset, config2);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function omit(schema, keys) {
	const entries2 = { ...schema.entries };
	for (const key of keys) delete entries2[key];
	return {
		...schema,
		entries: entries2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function partial(schema, keys) {
	const entries2 = {};
	for (const key in schema.entries) entries2[key] = !keys || keys.includes(key) ? /* @__PURE__ */ optional(schema.entries[key]) : schema.entries[key];
	return {
		...schema,
		entries: entries2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function pipe(...pipe2) {
	return {
		...pipe2[0],
		pipe: pipe2,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config2) {
			for (const item of pipe2) if (item.kind !== "metadata") {
				if (dataset.issues && (item.kind === "schema" || item.kind === "transformation")) {
					dataset.typed = false;
					break;
				}
				if (!dataset.issues || !config2.abortEarly && !config2.abortPipeEarly) dataset = item["~run"](dataset, config2);
			}
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function pipeAsync(...pipe2) {
	return {
		...pipe2[0],
		pipe: pipe2,
		async: true,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		async "~run"(dataset, config2) {
			for (const item of pipe2) if (item.kind !== "metadata") {
				if (dataset.issues && (item.kind === "schema" || item.kind === "transformation")) {
					dataset.typed = false;
					break;
				}
				if (!dataset.issues || !config2.abortEarly && !config2.abortPipeEarly) dataset = await item["~run"](dataset, config2);
			}
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function safeParse(schema, input, config2) {
	const dataset = schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig(config2));
	return {
		typed: dataset.typed,
		success: !dataset.issues,
		output: dataset.value,
		issues: dataset.issues
	};
}
const StringOrRegExpSchema = /* @__PURE__ */ union([/* @__PURE__ */ string(), /* @__PURE__ */ instance(RegExp)]);
const LogLevelSchema = /* @__PURE__ */ union([
	/* @__PURE__ */ literal("debug"),
	/* @__PURE__ */ literal("info"),
	/* @__PURE__ */ literal("warn")
]);
const LogLevelOptionSchema = /* @__PURE__ */ union([LogLevelSchema, /* @__PURE__ */ literal("silent")]);
const LogLevelWithErrorSchema = /* @__PURE__ */ union([LogLevelSchema, /* @__PURE__ */ literal("error")]);
const RollupLogSchema = /* @__PURE__ */ any();
const RollupLogWithStringSchema = /* @__PURE__ */ union([RollupLogSchema, /* @__PURE__ */ string()]);
const InputOptionSchema = /* @__PURE__ */ union([
	/* @__PURE__ */ string(),
	/* @__PURE__ */ array(/* @__PURE__ */ string()),
	/* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ string())
]);
const ExternalSchema = /* @__PURE__ */ union([
	StringOrRegExpSchema,
	/* @__PURE__ */ array(StringOrRegExpSchema),
	/* @__PURE__ */ pipe(/* @__PURE__ */ function_(), /* @__PURE__ */ args(/* @__PURE__ */ tuple([
		/* @__PURE__ */ string(),
		/* @__PURE__ */ optional(/* @__PURE__ */ string()),
		/* @__PURE__ */ boolean()
	])), /* @__PURE__ */ returns(/* @__PURE__ */ nullish(/* @__PURE__ */ boolean())))
]);
const ModuleTypesSchema = /* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ union([
	/* @__PURE__ */ literal("asset"),
	/* @__PURE__ */ literal("base64"),
	/* @__PURE__ */ literal("binary"),
	/* @__PURE__ */ literal("css"),
	/* @__PURE__ */ literal("dataurl"),
	/* @__PURE__ */ literal("empty"),
	/* @__PURE__ */ literal("js"),
	/* @__PURE__ */ literal("json"),
	/* @__PURE__ */ literal("jsx"),
	/* @__PURE__ */ literal("text"),
	/* @__PURE__ */ literal("ts"),
	/* @__PURE__ */ literal("tsx")
]));
const JsxOptionsSchema = /* @__PURE__ */ strictObject({
	runtime: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ literal("classic"), /* @__PURE__ */ literal("automatic")])), /* @__PURE__ */ description("Which runtime to use")),
	development: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Development specific information")),
	throwIfNamespace: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Toggles whether to throw an error when a tag name uses an XML namespace")),
	importSource: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Import the factory of element and fragment if mode is classic")),
	pragma: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Jsx element transformation")),
	pragmaFrag: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Jsx fragment transformation")),
	refresh: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Enable react fast refresh"))
});
const RollupJsxOptionsSchema = /* @__PURE__ */ strictObject({
	mode: /* @__PURE__ */ optional(/* @__PURE__ */ union([
		/* @__PURE__ */ literal("classic"),
		/* @__PURE__ */ literal("automatic"),
		/* @__PURE__ */ literal("preserve")
	])),
	factory: /* @__PURE__ */ optional(/* @__PURE__ */ string()),
	fragment: /* @__PURE__ */ optional(/* @__PURE__ */ string()),
	importSource: /* @__PURE__ */ optional(/* @__PURE__ */ string()),
	jsxImportSource: /* @__PURE__ */ optional(/* @__PURE__ */ string())
});
const HelperModeSchema = /* @__PURE__ */ union([/* @__PURE__ */ literal("Runtime"), /* @__PURE__ */ literal("External")]);
const DecoratorOptionSchema = /* @__PURE__ */ object({
	legacy: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	emitDecoratorMetadata: /* @__PURE__ */ optional(/* @__PURE__ */ boolean())
});
const HelpersSchema = /* @__PURE__ */ object({ mode: /* @__PURE__ */ optional(HelperModeSchema) });
const RewriteImportExtensionsSchema = /* @__PURE__ */ union([
	/* @__PURE__ */ literal("rewrite"),
	/* @__PURE__ */ literal("remove"),
	/* @__PURE__ */ boolean()
]);
const TypescriptSchema = /* @__PURE__ */ object({
	jsxPragma: /* @__PURE__ */ optional(/* @__PURE__ */ string()),
	jsxPragmaFrag: /* @__PURE__ */ optional(/* @__PURE__ */ string()),
	onlyRemoveTypeImports: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	allowNamespaces: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	allowDeclareFields: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	declaration: /* @__PURE__ */ optional(/* @__PURE__ */ object({
		stripInternal: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
		sourcemap: /* @__PURE__ */ optional(/* @__PURE__ */ boolean())
	})),
	rewriteImportExtensions: /* @__PURE__ */ optional(RewriteImportExtensionsSchema)
});
const AssumptionsSchema = /* @__PURE__ */ object({
	ignoreFunctionLength: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	noDocumentAll: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	objectRestNoSymbols: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	pureGetters: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	setPublicClassFields: /* @__PURE__ */ optional(/* @__PURE__ */ boolean())
});
const TransformOptionsSchema = /* @__PURE__ */ object({
	assumptions: /* @__PURE__ */ optional(AssumptionsSchema),
	typescript: /* @__PURE__ */ optional(TypescriptSchema),
	helpers: /* @__PURE__ */ optional(HelpersSchema),
	decorators: /* @__PURE__ */ optional(DecoratorOptionSchema),
	jsx: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ literal("preserve"), JsxOptionsSchema])),
	target: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ string(), /* @__PURE__ */ array(/* @__PURE__ */ string())])), /* @__PURE__ */ description("The JavaScript target environment"))
});
const WatchOptionsSchema = /* @__PURE__ */ strictObject({
	chokidar: /* @__PURE__ */ optional(/* @__PURE__ */ never(`The "watch.chokidar" option is deprecated, please use "watch.notify" instead of it`)),
	exclude: /* @__PURE__ */ optional(/* @__PURE__ */ union([StringOrRegExpSchema, /* @__PURE__ */ array(StringOrRegExpSchema)])),
	include: /* @__PURE__ */ optional(/* @__PURE__ */ union([StringOrRegExpSchema, /* @__PURE__ */ array(StringOrRegExpSchema)])),
	notify: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ strictObject({
		compareContents: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
		pollInterval: /* @__PURE__ */ optional(/* @__PURE__ */ number())
	})), /* @__PURE__ */ description("Notify options")),
	skipWrite: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Skip the bundle.write() step")),
	buildDelay: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ number()), /* @__PURE__ */ description("Throttle watch rebuilds")),
	clearScreen: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Whether to clear the screen when a rebuild is triggered")),
	onInvalidate: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ pipe(/* @__PURE__ */ function_(), /* @__PURE__ */ args(/* @__PURE__ */ tuple([/* @__PURE__ */ string()])))), /* @__PURE__ */ description("An optional function that will be called immediately every time a module changes that is part of the build."))
});
const ChecksOptionsSchema = /* @__PURE__ */ strictObject({
	circularDependency: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Whether to emit warning when detecting circular dependency")),
	eval: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Whether to emit warning when detecting eval")),
	missingGlobalName: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Whether to emit warning when detecting missing global name")),
	missingNameOptionForIifeExport: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Whether to emit warning when detecting missing name option for iife export")),
	mixedExport: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Whether to emit warning when detecting mixed export")),
	unresolvedEntry: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Whether to emit warning when detecting unresolved entry")),
	unresolvedImport: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Whether to emit warning when detecting unresolved import")),
	filenameConflict: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Whether to emit warning when detecting filename conflict")),
	commonJsVariableInEsm: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Whether to emit warning when detecting common js variable in esm")),
	importIsUndefined: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Whether to emit warning when detecting import is undefined")),
	emptyImportMeta: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Whether to emit warning when detecting empty import meta")),
	configurationFieldConflict: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Whether to emit warning when detecting configuration field conflict")),
	preferBuiltinFeature: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Whether to emit warning when detecting prefer builtin feature"))
});
const CompressOptionsKeepNamesSchema = /* @__PURE__ */ strictObject({
	function: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	class: /* @__PURE__ */ optional(/* @__PURE__ */ boolean())
});
const CompressOptionsSchema = /* @__PURE__ */ strictObject({
	target: /* @__PURE__ */ optional(/* @__PURE__ */ union([
		/* @__PURE__ */ literal("esnext"),
		/* @__PURE__ */ literal("es2015"),
		/* @__PURE__ */ literal("es2016"),
		/* @__PURE__ */ literal("es2017"),
		/* @__PURE__ */ literal("es2018"),
		/* @__PURE__ */ literal("es2019"),
		/* @__PURE__ */ literal("es2020"),
		/* @__PURE__ */ literal("es2021"),
		/* @__PURE__ */ literal("es2022"),
		/* @__PURE__ */ literal("es2023"),
		/* @__PURE__ */ literal("es2024")
	])),
	dropConsole: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	dropDebugger: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	keepNames: /* @__PURE__ */ optional(CompressOptionsKeepNamesSchema),
	unused: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ boolean(), /* @__PURE__ */ literal("keep_assign")]))
});
const MangleOptionsKeepNamesSchema = /* @__PURE__ */ strictObject({
	function: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	class: /* @__PURE__ */ optional(/* @__PURE__ */ boolean())
});
const MangleOptionsSchema = /* @__PURE__ */ strictObject({
	toplevel: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	keepNames: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ boolean(), MangleOptionsKeepNamesSchema])),
	debug: /* @__PURE__ */ optional(/* @__PURE__ */ boolean())
});
const CodegenOptionsSchema = /* @__PURE__ */ strictObject({ removeWhitespace: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()) });
const MinifyOptionsSchema = /* @__PURE__ */ strictObject({
	compress: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ boolean(), CompressOptionsSchema])),
	mangle: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ boolean(), MangleOptionsSchema])),
	codegen: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ boolean(), CodegenOptionsSchema]))
});
const ResolveOptionsSchema = /* @__PURE__ */ strictObject({
	alias: /* @__PURE__ */ optional(/* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ union([
		/* @__PURE__ */ literal(false),
		/* @__PURE__ */ string(),
		/* @__PURE__ */ array(/* @__PURE__ */ string())
	]))),
	aliasFields: /* @__PURE__ */ optional(/* @__PURE__ */ array(/* @__PURE__ */ array(/* @__PURE__ */ string()))),
	conditionNames: /* @__PURE__ */ optional(/* @__PURE__ */ array(/* @__PURE__ */ string())),
	extensionAlias: /* @__PURE__ */ optional(/* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ array(/* @__PURE__ */ string()))),
	exportsFields: /* @__PURE__ */ optional(/* @__PURE__ */ array(/* @__PURE__ */ array(/* @__PURE__ */ string()))),
	extensions: /* @__PURE__ */ optional(/* @__PURE__ */ array(/* @__PURE__ */ string())),
	mainFields: /* @__PURE__ */ optional(/* @__PURE__ */ array(/* @__PURE__ */ string())),
	mainFiles: /* @__PURE__ */ optional(/* @__PURE__ */ array(/* @__PURE__ */ string())),
	modules: /* @__PURE__ */ optional(/* @__PURE__ */ array(/* @__PURE__ */ string())),
	symlinks: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	yarnPnp: /* @__PURE__ */ optional(/* @__PURE__ */ boolean())
});
const TreeshakingOptionsSchema = /* @__PURE__ */ union([/* @__PURE__ */ boolean(), /* @__PURE__ */ looseObject({
	annotations: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	manualPureFunctions: /* @__PURE__ */ optional(/* @__PURE__ */ array(/* @__PURE__ */ string())),
	unknownGlobalSideEffects: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	commonjs: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	propertyReadSideEffects: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ literal(false), /* @__PURE__ */ literal("always")])),
	propertyWriteSideEffects: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ literal(false), /* @__PURE__ */ literal("always")]))
})]);
const OptimizationOptionsSchema = /* @__PURE__ */ strictObject({
	inlineConst: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ union([
		/* @__PURE__ */ boolean(),
		/* @__PURE__ */ literal("smart"),
		/* @__PURE__ */ strictObject({
			mode: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ literal("all"), /* @__PURE__ */ literal("smart")])),
			pass: /* @__PURE__ */ optional(/* @__PURE__ */ number())
		})
	])), /* @__PURE__ */ description("Enable crossmodule constant inlining")),
	pifeForModuleWrappers: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Use PIFE pattern for module wrappers"))
});
const OnLogSchema = /* @__PURE__ */ pipe(/* @__PURE__ */ function_(), /* @__PURE__ */ args(/* @__PURE__ */ tuple([
	LogLevelSchema,
	RollupLogSchema,
	/* @__PURE__ */ pipe(/* @__PURE__ */ function_(), /* @__PURE__ */ args(/* @__PURE__ */ tuple([LogLevelWithErrorSchema, RollupLogWithStringSchema])))
])));
const OnwarnSchema = /* @__PURE__ */ pipe(/* @__PURE__ */ function_(), /* @__PURE__ */ args(/* @__PURE__ */ tuple([RollupLogSchema, /* @__PURE__ */ pipe(/* @__PURE__ */ function_(), /* @__PURE__ */ args(/* @__PURE__ */ tuple([/* @__PURE__ */ union([RollupLogWithStringSchema, /* @__PURE__ */ pipe(/* @__PURE__ */ function_(), /* @__PURE__ */ returns(RollupLogWithStringSchema))])])))])));
const HmrSchema = /* @__PURE__ */ union([/* @__PURE__ */ boolean(), /* @__PURE__ */ strictObject({
	new: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	port: /* @__PURE__ */ optional(/* @__PURE__ */ number()),
	host: /* @__PURE__ */ optional(/* @__PURE__ */ string()),
	implement: /* @__PURE__ */ optional(/* @__PURE__ */ string())
})]);
const InputOptionsSchema = /* @__PURE__ */ strictObject({
	input: /* @__PURE__ */ optional(InputOptionSchema),
	plugins: /* @__PURE__ */ optional(/* @__PURE__ */ custom(() => true)),
	external: /* @__PURE__ */ optional(ExternalSchema),
	makeAbsoluteExternalsRelative: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ boolean(), /* @__PURE__ */ literal("ifRelativeSource")])),
	resolve: /* @__PURE__ */ optional(ResolveOptionsSchema),
	cwd: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Current working directory")),
	platform: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ union([
		/* @__PURE__ */ literal("browser"),
		/* @__PURE__ */ literal("neutral"),
		/* @__PURE__ */ literal("node")
	])), /* @__PURE__ */ description(`Platform for which the code should be generated (node, ${ansis_default.underline("browser")}, neutral)`)),
	shimMissingExports: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Create shim variables for missing exports")),
	treeshake: /* @__PURE__ */ optional(TreeshakingOptionsSchema),
	optimization: /* @__PURE__ */ optional(OptimizationOptionsSchema),
	logLevel: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(LogLevelOptionSchema), /* @__PURE__ */ description(`Log level (${ansis_default.dim("silent")}, ${ansis_default.underline(ansis_default.gray("info"))}, debug, ${ansis_default.yellow("warn")})`)),
	onLog: /* @__PURE__ */ optional(OnLogSchema),
	onwarn: /* @__PURE__ */ optional(OnwarnSchema),
	moduleTypes: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(ModuleTypesSchema), /* @__PURE__ */ description("Module types for customized extensions")),
	experimental: /* @__PURE__ */ optional(/* @__PURE__ */ strictObject({
		disableLiveBindings: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
		enableComposingJsPlugins: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
		viteMode: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
		resolveNewUrlToAsset: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
		strictExecutionOrder: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
		onDemandWrapping: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
		incrementalBuild: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
		hmr: /* @__PURE__ */ optional(HmrSchema),
		attachDebugInfo: /* @__PURE__ */ optional(/* @__PURE__ */ union([
			/* @__PURE__ */ literal("none"),
			/* @__PURE__ */ literal("simple"),
			/* @__PURE__ */ literal("full")
		])),
		chunkModulesOrder: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ literal("module-id"), /* @__PURE__ */ literal("exec-order")])),
		chunkImportMap: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ boolean(), /* @__PURE__ */ object({
			baseUrl: /* @__PURE__ */ optional(/* @__PURE__ */ string()),
			fileName: /* @__PURE__ */ optional(/* @__PURE__ */ string())
		})]))
	})),
	define: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ string())), /* @__PURE__ */ description("Define global variables")),
	inject: /* @__PURE__ */ optional(/* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ union([/* @__PURE__ */ string(), /* @__PURE__ */ tuple([/* @__PURE__ */ string(), /* @__PURE__ */ string()])]))),
	profilerNames: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	jsx: /* @__PURE__ */ optional(/* @__PURE__ */ union([
		/* @__PURE__ */ literal(false),
		/* @__PURE__ */ literal("react"),
		/* @__PURE__ */ literal("react-jsx"),
		/* @__PURE__ */ literal("preserve"),
		RollupJsxOptionsSchema
	])),
	transform: /* @__PURE__ */ optional(TransformOptionsSchema),
	watch: /* @__PURE__ */ optional(/* @__PURE__ */ union([WatchOptionsSchema, /* @__PURE__ */ literal(false)])),
	dropLabels: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ array(/* @__PURE__ */ string())), /* @__PURE__ */ description("Remove labeled statements with these label names")),
	checks: /* @__PURE__ */ optional(ChecksOptionsSchema),
	keepNames: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Keep function/class name")),
	debug: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ object({ sessionId: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Used to name the build.")) })), /* @__PURE__ */ description("Enable debug mode. Emit debug information to disk. This might slow down the build process significantly.")),
	preserveEntrySignatures: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ union([
		/* @__PURE__ */ literal("strict"),
		/* @__PURE__ */ literal("allow-extension"),
		/* @__PURE__ */ literal("exports-only"),
		/* @__PURE__ */ literal(false)
	]))),
	tsconfig: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Path to the tsconfig.json file."))
});
const InputCliOverrideSchema = /* @__PURE__ */ strictObject({
	input: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ array(/* @__PURE__ */ string())), /* @__PURE__ */ description("Entry file")),
	external: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ array(/* @__PURE__ */ string())), /* @__PURE__ */ description("Comma-separated list of module ids to exclude from the bundle `<module-id>,...`")),
	inject: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ string())), /* @__PURE__ */ description("Inject import statements on demand")),
	treeshake: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("enable treeshaking")),
	makeAbsoluteExternalsRelative: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Prevent normalization of external imports")),
	jsx: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ union([
		/* @__PURE__ */ literal(false),
		/* @__PURE__ */ literal("react"),
		/* @__PURE__ */ literal("react-jsx"),
		/* @__PURE__ */ literal("preserve")
	])), /* @__PURE__ */ description("Jsx options preset")),
	preserveEntrySignatures: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ literal(false)), /* @__PURE__ */ description("Avoid facade chunks for entry points")),
	context: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("The entity top-level `this` represents."))
});
const InputCliOptionsSchema = /* @__PURE__ */ omit(/* @__PURE__ */ strictObject({
	...InputOptionsSchema.entries,
	...InputCliOverrideSchema.entries
}), [
	"plugins",
	"onwarn",
	"onLog",
	"resolve",
	"experimental",
	"profilerNames",
	"watch"
]);
const ModuleFormatSchema = /* @__PURE__ */ union([
	/* @__PURE__ */ literal("es"),
	/* @__PURE__ */ literal("cjs"),
	/* @__PURE__ */ literal("esm"),
	/* @__PURE__ */ literal("module"),
	/* @__PURE__ */ literal("commonjs"),
	/* @__PURE__ */ literal("iife"),
	/* @__PURE__ */ literal("umd")
]);
const AddonFunctionSchema = /* @__PURE__ */ pipe(/* @__PURE__ */ function_(), /* @__PURE__ */ args(/* @__PURE__ */ tuple([/* @__PURE__ */ custom(() => true)])), /* @__PURE__ */ returnsAsync(/* @__PURE__ */ unionAsync([/* @__PURE__ */ string(), /* @__PURE__ */ pipeAsync(/* @__PURE__ */ promise(), /* @__PURE__ */ awaitAsync(), /* @__PURE__ */ string())])));
const ChunkFileNamesSchema = /* @__PURE__ */ union([/* @__PURE__ */ string(), /* @__PURE__ */ pipe(/* @__PURE__ */ function_(), /* @__PURE__ */ args(/* @__PURE__ */ tuple([/* @__PURE__ */ custom(() => true)])), /* @__PURE__ */ returns(/* @__PURE__ */ string()))]);
const AssetFileNamesSchema = /* @__PURE__ */ union([/* @__PURE__ */ string(), /* @__PURE__ */ pipe(/* @__PURE__ */ function_(), /* @__PURE__ */ args(/* @__PURE__ */ tuple([/* @__PURE__ */ custom(() => true)])), /* @__PURE__ */ returns(/* @__PURE__ */ string()))]);
const SanitizeFileNameSchema = /* @__PURE__ */ union([/* @__PURE__ */ boolean(), /* @__PURE__ */ pipe(/* @__PURE__ */ function_(), /* @__PURE__ */ args(/* @__PURE__ */ tuple([/* @__PURE__ */ string()])), /* @__PURE__ */ returns(/* @__PURE__ */ string()))]);
const GlobalsFunctionSchema = /* @__PURE__ */ pipe(/* @__PURE__ */ function_(), /* @__PURE__ */ args(/* @__PURE__ */ tuple([/* @__PURE__ */ string()])), /* @__PURE__ */ returns(/* @__PURE__ */ string()));
const AdvancedChunksSchema = /* @__PURE__ */ strictObject({
	includeDependenciesRecursively: /* @__PURE__ */ optional(/* @__PURE__ */ boolean()),
	minSize: /* @__PURE__ */ optional(/* @__PURE__ */ number()),
	maxSize: /* @__PURE__ */ optional(/* @__PURE__ */ number()),
	minModuleSize: /* @__PURE__ */ optional(/* @__PURE__ */ number()),
	maxModuleSize: /* @__PURE__ */ optional(/* @__PURE__ */ number()),
	minShareCount: /* @__PURE__ */ optional(/* @__PURE__ */ number()),
	groups: /* @__PURE__ */ optional(/* @__PURE__ */ array(/* @__PURE__ */ strictObject({
		name: /* @__PURE__ */ union([/* @__PURE__ */ string(), /* @__PURE__ */ pipe(/* @__PURE__ */ function_(), /* @__PURE__ */ args(/* @__PURE__ */ tuple([/* @__PURE__ */ string()])), /* @__PURE__ */ returns(/* @__PURE__ */ nullish(/* @__PURE__ */ string())))]),
		test: /* @__PURE__ */ optional(/* @__PURE__ */ union([
			/* @__PURE__ */ string(),
			/* @__PURE__ */ instance(RegExp),
			/* @__PURE__ */ pipe(/* @__PURE__ */ function_(), /* @__PURE__ */ args(/* @__PURE__ */ tuple([/* @__PURE__ */ string()])), /* @__PURE__ */ returns(/* @__PURE__ */ union([/* @__PURE__ */ nullish(/* @__PURE__ */ boolean()), /* @__PURE__ */ void_()])))
		])),
		priority: /* @__PURE__ */ optional(/* @__PURE__ */ number()),
		minSize: /* @__PURE__ */ optional(/* @__PURE__ */ number()),
		minShareCount: /* @__PURE__ */ optional(/* @__PURE__ */ number()),
		maxSize: /* @__PURE__ */ optional(/* @__PURE__ */ number()),
		minModuleSize: /* @__PURE__ */ optional(/* @__PURE__ */ number()),
		maxModuleSize: /* @__PURE__ */ optional(/* @__PURE__ */ number())
	})))
});
const GeneratedCodePresetSchema = /* @__PURE__ */ union([/* @__PURE__ */ literal("es5"), /* @__PURE__ */ literal("es2015")]);
const GeneratedCodeOptionsSchema = /* @__PURE__ */ strictObject({
	symbols: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Whether to use Symbol.toStringTag for namespace objects")),
	preset: GeneratedCodePresetSchema
});
const OutputOptionsSchema = /* @__PURE__ */ strictObject({
	dir: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Output directory, defaults to `dist` if `file` is not set")),
	file: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Single output file")),
	exports: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ union([
		/* @__PURE__ */ literal("auto"),
		/* @__PURE__ */ literal("named"),
		/* @__PURE__ */ literal("default"),
		/* @__PURE__ */ literal("none")
	])), /* @__PURE__ */ description(`Specify a export mode (${ansis_default.underline("auto")}, named, default, none)`)),
	hashCharacters: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ union([
		/* @__PURE__ */ literal("base64"),
		/* @__PURE__ */ literal("base36"),
		/* @__PURE__ */ literal("hex")
	])), /* @__PURE__ */ description("Use the specified character set for file hashes")),
	format: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(ModuleFormatSchema), /* @__PURE__ */ description(`Output format of the generated bundle (supports ${ansis_default.underline("esm")}, cjs, and iife)`)),
	sourcemap: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ union([
		/* @__PURE__ */ boolean(),
		/* @__PURE__ */ literal("inline"),
		/* @__PURE__ */ literal("hidden")
	])), /* @__PURE__ */ description(`Generate sourcemap (\`-s inline\` for inline, or ${ansis_default.bold("pass the `-s` on the last argument if you want to generate `.map` file")})`)),
	sourcemapBaseUrl: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Base URL used to prefix sourcemap paths")),
	sourcemapDebugIds: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Inject sourcemap debug IDs")),
	sourcemapIgnoreList: /* @__PURE__ */ optional(/* @__PURE__ */ union([
		/* @__PURE__ */ boolean(),
		/* @__PURE__ */ custom(() => true),
		StringOrRegExpSchema
	])),
	sourcemapPathTransform: /* @__PURE__ */ optional(/* @__PURE__ */ custom(() => true)),
	banner: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ string(), AddonFunctionSchema])),
	footer: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ string(), AddonFunctionSchema])),
	intro: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ string(), AddonFunctionSchema])),
	outro: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ string(), AddonFunctionSchema])),
	extend: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Extend global variable defined by name in IIFE / UMD formats")),
	esModule: /* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ boolean(), /* @__PURE__ */ literal("if-default-prop")])),
	assetFileNames: /* @__PURE__ */ optional(AssetFileNamesSchema),
	entryFileNames: /* @__PURE__ */ optional(ChunkFileNamesSchema),
	chunkFileNames: /* @__PURE__ */ optional(ChunkFileNamesSchema),
	cssEntryFileNames: /* @__PURE__ */ optional(ChunkFileNamesSchema),
	cssChunkFileNames: /* @__PURE__ */ optional(ChunkFileNamesSchema),
	sanitizeFileName: /* @__PURE__ */ optional(SanitizeFileNameSchema),
	minify: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ union([
		/* @__PURE__ */ boolean(),
		/* @__PURE__ */ string("dce-only"),
		MinifyOptionsSchema
	])), /* @__PURE__ */ description("Minify the bundled file")),
	name: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Name for UMD / IIFE format outputs")),
	globals: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ string()), GlobalsFunctionSchema])), /* @__PURE__ */ description("Global variable of UMD / IIFE dependencies (syntax: `key=value`)")),
	generatedCode: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ partial(GeneratedCodeOptionsSchema)), /* @__PURE__ */ description("Generated code options")),
	externalLiveBindings: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("external live bindings")),
	inlineDynamicImports: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Inline dynamic imports")),
	manualChunks: /* @__PURE__ */ optional(/* @__PURE__ */ pipe(/* @__PURE__ */ function_(), /* @__PURE__ */ args(/* @__PURE__ */ tuple([/* @__PURE__ */ string(), /* @__PURE__ */ object({})])), /* @__PURE__ */ returns(/* @__PURE__ */ union([/* @__PURE__ */ string(), /* @__PURE__ */ nullish(/* @__PURE__ */ string())])))),
	advancedChunks: /* @__PURE__ */ optional(AdvancedChunksSchema),
	legalComments: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ literal("none"), /* @__PURE__ */ literal("inline")])), /* @__PURE__ */ description("Control comments in the output")),
	plugins: /* @__PURE__ */ optional(/* @__PURE__ */ custom(() => true)),
	polyfillRequire: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Disable require polyfill injection")),
	hoistTransitiveImports: /* @__PURE__ */ optional(/* @__PURE__ */ custom((input) => {
		if (input) return false;
		return true;
	}, () => `The 'true' value is not supported`)),
	preserveModules: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Preserve module structure")),
	preserveModulesRoot: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Put preserved modules under this path at root level")),
	virtualDirname: /* @__PURE__ */ optional(/* @__PURE__ */ string()),
	minifyInternalExports: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Minify internal exports")),
	topLevelVar: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Rewrite top-level declarations to use `var`."))
});
const getAddonDescription = (placement, wrapper) => {
	return `Code to insert the ${ansis_default.bold(placement)} of the bundled file (${ansis_default.bold(wrapper)} the wrapper function)`;
};
const OutputCliOverrideSchema = /* @__PURE__ */ strictObject({
	assetFileNames: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Name pattern for asset files")),
	entryFileNames: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Name pattern for emitted entry chunks")),
	chunkFileNames: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Name pattern for emitted secondary chunks")),
	cssEntryFileNames: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Name pattern for emitted css entry chunks")),
	cssChunkFileNames: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description("Name pattern for emitted css secondary chunks")),
	sanitizeFileName: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Sanitize file name")),
	banner: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description(getAddonDescription("top", "outside"))),
	footer: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description(getAddonDescription("bottom", "outside"))),
	intro: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description(getAddonDescription("top", "inside"))),
	outro: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ string()), /* @__PURE__ */ description(getAddonDescription("bottom", "inside"))),
	esModule: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Always generate `__esModule` marks in non-ESM formats, defaults to `if-default-prop` (use `--no-esModule` to always disable)")),
	globals: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ string())), /* @__PURE__ */ description("Global variable of UMD / IIFE dependencies (syntax: `key=value`)")),
	advancedChunks: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ strictObject({
		minSize: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ number()), /* @__PURE__ */ description("Minimum size of the chunk")),
		minShareCount: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ number()), /* @__PURE__ */ description("Minimum share count of the chunk"))
	})), /* @__PURE__ */ description("Global variable of UMD / IIFE dependencies (syntax: `key=value`)")),
	minify: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Minify the bundled file"))
});
const OutputCliOptionsSchema = /* @__PURE__ */ omit(/* @__PURE__ */ strictObject({
	...OutputOptionsSchema.entries,
	...OutputCliOverrideSchema.entries
}), [
	"sourcemapIgnoreList",
	"sourcemapPathTransform",
	"plugins",
	"hoistTransitiveImports"
]);
const CliOptionsSchema = /* @__PURE__ */ strictObject({
	config: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ union([/* @__PURE__ */ string(), /* @__PURE__ */ boolean()])), /* @__PURE__ */ description("Path to the config file (default: `rolldown.config.js`)")),
	help: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Show help")),
	version: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Show version number")),
	watch: /* @__PURE__ */ pipe(/* @__PURE__ */ optional(/* @__PURE__ */ boolean()), /* @__PURE__ */ description("Watch files in bundle and rebuild on changes")),
	...InputCliOptionsSchema.entries,
	...OutputCliOptionsSchema.entries
});
const inputHelperMsgRecord = {
	output: { ignored: true },
	"resolve.tsconfigFilename": { issueMsg: "It is deprecated. Please use the top-level `tsconfig` option instead." }
};
const outputHelperMsgRecord = {};
function validateOption(key, options) {
	if (typeof options !== "object") throw new Error(`Invalid ${key} options. Expected an Object but received ${JSON.stringify(options)}.`);
	if (globalThis.process?.env?.ROLLUP_TEST) return;
	let parsed = /* @__PURE__ */ safeParse(key === "input" ? InputOptionsSchema : OutputOptionsSchema, options);
	if (!parsed.success) {
		const errors = parsed.issues.map((issue) => {
			let issueMsg = issue.message;
			const issuePaths = issue.path.map((path$1) => path$1.key);
			if (issue.type === "union") {
				const subIssue = issue.issues?.find((i$1) => !(i$1.type !== issue.received && i$1.input === issue.input));
				if (subIssue) {
					if (subIssue.path) issuePaths.push(subIssue.path.map((path$1) => path$1.key));
					issueMsg = subIssue.message;
				}
			}
			const stringPath = issuePaths.join(".");
			const helper = key === "input" ? inputHelperMsgRecord[stringPath] : outputHelperMsgRecord[stringPath];
			if (helper && helper.ignored) return "";
			return `- For the "${stringPath}". ${helper?.issueMsg || issueMsg + "."} ${helper?.help ? `\n  Help: ${helper.help}` : ""}`;
		}).filter(Boolean);
		if (errors.length) console.warn(`\x1b[33mWarning: Invalid ${key} options (${errors.length} issue${errors.length === 1 ? "" : "s"} found)\n${errors.join("\n")}\x1b[0m`);
	}
}
function bindingifySourcemap$1(map) {
	if (map == null) return;
	return { inner: typeof map === "string" ? map : {
		file: map.file ?? void 0,
		mappings: map.mappings,
		sourceRoot: "sourceRoot" in map ? map.sourceRoot ?? void 0 : void 0,
		sources: map.sources?.map((s$1) => s$1 ?? void 0),
		sourcesContent: map.sourcesContent?.map((s$1) => s$1 ?? void 0),
		names: map.names,
		x_google_ignoreList: map.x_google_ignoreList,
		debugId: "debugId" in map ? map.debugId : void 0
	} };
}
function normalizeErrors(rawErrors) {
	const errors = rawErrors.map((e$1$1) => e$1$1 instanceof Error ? e$1$1 : Object.assign(/* @__PURE__ */ new Error(), {
		kind: e$1$1.kind,
		message: e$1$1.message,
		stack: void 0
	}));
	let summary = `Build failed with ${errors.length} error${errors.length < 2 ? "" : "s"}:\n`;
	for (let i$1 = 0; i$1 < errors.length; i$1++) {
		summary += "\n";
		if (i$1 >= 5) {
			summary += "...";
			break;
		}
		summary += getErrorMessage(errors[i$1]);
	}
	const wrapper = new Error(summary);
	Object.defineProperty(wrapper, "errors", {
		configurable: true,
		enumerable: true,
		get: () => errors,
		set: (value) => Object.defineProperty(wrapper, "errors", {
			configurable: true,
			enumerable: true,
			value
		})
	});
	return wrapper;
}
function getErrorMessage(e$1$1) {
	if (Object.hasOwn(e$1$1, "kind")) return e$1$1.message;
	let s$1 = "";
	if (e$1$1.plugin) s$1 += `[plugin ${e$1$1.plugin}]`;
	const id$1 = e$1$1.id ?? e$1$1.loc?.file;
	if (id$1) {
		s$1 += " " + id$1;
		if (e$1$1.loc) s$1 += `:${e$1$1.loc.line}:${e$1$1.loc.column}`;
	}
	if (s$1) s$1 += "\n";
	const message = `${e$1$1.name ?? "Error"}: ${e$1$1.message}`;
	s$1 += message;
	if (e$1$1.frame) s$1 = joinNewLine(s$1, e$1$1.frame);
	if (e$1$1.stack) s$1 = joinNewLine(s$1, e$1$1.stack.replace(message, ""));
	if (e$1$1.cause) {
		s$1 = joinNewLine(s$1, "Caused by:");
		s$1 = joinNewLine(s$1, getErrorMessage(e$1$1.cause).split("\n").map((line) => "  " + line).join("\n"));
	}
	return s$1;
}
function joinNewLine(s1, s2) {
	return s1.replace(/\n+$/, "") + "\n" + s2.replace(/^\n+/, "");
}
function transformModuleInfo(info, option) {
	return {
		get ast() {
			return unsupported("ModuleInfo#ast");
		},
		get code() {
			return info.code;
		},
		id: info.id,
		importers: info.importers,
		dynamicImporters: info.dynamicImporters,
		importedIds: info.importedIds,
		dynamicallyImportedIds: info.dynamicallyImportedIds,
		exports: info.exports,
		isEntry: info.isEntry,
		...option
	};
}
function isEmptySourcemapFiled(array$1) {
	if (!array$1) return true;
	if (array$1.length === 0 || !array$1[0]) return true;
	return false;
}
function normalizeTransformHookSourcemap(id$1, originalCode, rawMap) {
	if (!rawMap) return;
	let map = typeof rawMap === "object" ? rawMap : JSON.parse(rawMap);
	if (isEmptySourcemapFiled(map.sourcesContent)) map.sourcesContent = [originalCode];
	if (isEmptySourcemapFiled(map.sources) || map.sources && map.sources.length === 1 && map.sources[0] !== id$1) map.sources = [id$1];
	return map;
}
function e(e$1$1, t$2$1, n$1$1) {
	let r$1 = (n$2) => e$1$1(n$2, ...t$2$1);
	return n$1$1 === void 0 ? r$1 : Object.assign(r$1, {
		lazy: n$1$1,
		lazyArgs: t$2$1
	});
}
function t(t$2$1, n$1$1, r$1) {
	let i$1 = t$2$1.length - n$1$1.length;
	if (i$1 === 0) return t$2$1(...n$1$1);
	if (i$1 === 1) return e(t$2$1, n$1$1, r$1);
	throw Error(`Wrong number of arguments`);
}
function t$1(...t$2$1) {
	return t(n, t$2$1);
}
const n = (e$1$1, t$2$1) => {
	let n$1$1 = [[], []];
	for (let [r$1, i$1] of e$1$1.entries()) t$2$1(i$1, r$1, e$1$1) ? n$1$1[0].push(i$1) : n$1$1[1].push(i$1);
	return n$1$1;
};
function generalHookFilterMatcherToFilterExprs(matcher, stringKind) {
	if (typeof matcher === "string" || matcher instanceof RegExp) return [include(generateAtomMatcher(stringKind, matcher))];
	if (Array.isArray(matcher)) return matcher.map((m$1) => include(generateAtomMatcher(stringKind, m$1)));
	let ret = [];
	if (matcher.exclude) ret.push(...arraify(matcher.exclude).map((m$1) => exclude(generateAtomMatcher(stringKind, m$1))));
	if (matcher.include) ret.push(...arraify(matcher.include).map((m$1) => include(generateAtomMatcher(stringKind, m$1))));
	return ret;
}
function generateAtomMatcher(kind, matcher) {
	return kind === "code" ? code(matcher) : id(matcher);
}
function transformFilterMatcherToFilterExprs(filterOption) {
	if (!filterOption) return;
	if (Array.isArray(filterOption)) return filterOption;
	const { id: id$1, code: code$1, moduleType: moduleType$1 } = filterOption;
	let ret = [];
	let idIncludes = [];
	let idExcludes = [];
	let codeIncludes = [];
	let codeExcludes = [];
	if (id$1) [idIncludes, idExcludes] = t$1(generalHookFilterMatcherToFilterExprs(id$1, "id") ?? [], (m$1) => m$1.kind === "include");
	if (code$1) [codeIncludes, codeExcludes] = t$1(generalHookFilterMatcherToFilterExprs(code$1, "code") ?? [], (m$1) => m$1.kind === "include");
	ret.push(...idExcludes);
	ret.push(...codeExcludes);
	let andExprList = [];
	if (moduleType$1) {
		let moduleTypes = Array.isArray(moduleType$1) ? moduleType$1 : moduleType$1.include ?? [];
		andExprList.push(or(...moduleTypes.map((m$1) => moduleType(m$1))));
	}
	if (idIncludes.length) andExprList.push(or(...idIncludes.map((item) => item.expr)));
	if (codeIncludes.length) andExprList.push(or(...codeIncludes.map((item) => item.expr)));
	if (andExprList.length) ret.push(include(and(...andExprList)));
	return ret;
}
function bindingifyGeneralHookFilter(stringKind, pattern) {
	let filterExprs = generalHookFilterMatcherToFilterExprs(pattern, stringKind);
	let ret = [];
	if (filterExprs) ret = filterExprs.map(bindingifyFilterExpr);
	return ret.length > 0 ? { value: ret } : void 0;
}
function bindingifyFilterExpr(expr) {
	let list = [];
	bindingifyFilterExprImpl(expr, list);
	return list;
}
function bindingifyFilterExprImpl(expr, list) {
	switch (expr.kind) {
		case "and": {
			let args$1 = expr.args;
			for (let i$1 = args$1.length - 1; i$1 >= 0; i$1--) bindingifyFilterExprImpl(args$1[i$1], list);
			list.push({
				kind: "And",
				payload: args$1.length
			});
			break;
		}
		case "or": {
			let args$1 = expr.args;
			for (let i$1 = args$1.length - 1; i$1 >= 0; i$1--) bindingifyFilterExprImpl(args$1[i$1], list);
			list.push({
				kind: "Or",
				payload: args$1.length
			});
			break;
		}
		case "not":
			bindingifyFilterExprImpl(expr.expr, list);
			list.push({ kind: "Not" });
			break;
		case "id":
			list.push({
				kind: "Id",
				payload: expr.pattern
			});
			if (expr.params.cleanUrl) list.push({ kind: "CleanUrl" });
			break;
		case "moduleType":
			list.push({
				kind: "ModuleType",
				payload: expr.pattern
			});
			break;
		case "code":
			list.push({
				kind: "Code",
				payload: expr.pattern
			});
			break;
		case "include":
			bindingifyFilterExprImpl(expr.expr, list);
			list.push({ kind: "Include" });
			break;
		case "exclude":
			bindingifyFilterExprImpl(expr.expr, list);
			list.push({ kind: "Exclude" });
			break;
		case "query":
			list.push({
				kind: "QueryKey",
				payload: expr.key
			});
			list.push({
				kind: "QueryValue",
				payload: expr.pattern
			});
			break;
		default: throw new Error(`Unknown filter expression: ${expr}`);
	}
}
function bindingifyResolveIdFilter(filterOption) {
	if (!filterOption) return;
	if (Array.isArray(filterOption)) return { value: filterOption.map(bindingifyFilterExpr) };
	return filterOption.id ? bindingifyGeneralHookFilter("id", filterOption.id) : void 0;
}
function bindingifyLoadFilter(filterOption) {
	if (!filterOption) return;
	if (Array.isArray(filterOption)) return { value: filterOption.map(bindingifyFilterExpr) };
	return filterOption.id ? bindingifyGeneralHookFilter("id", filterOption.id) : void 0;
}
function bindingifyTransformFilter(filterOption) {
	if (!filterOption) return;
	let filterExprs = transformFilterMatcherToFilterExprs(filterOption);
	let ret = [];
	if (filterExprs) ret = filterExprs.map(bindingifyFilterExpr);
	return { value: ret.length > 0 ? ret : void 0 };
}
function bindingifyRenderChunkFilter(filterOption) {
	if (!filterOption) return;
	if (Array.isArray(filterOption)) return { value: filterOption.map(bindingifyFilterExpr) };
	return filterOption.code ? bindingifyGeneralHookFilter("code", filterOption.code) : void 0;
}
function bindingifyPluginHookMeta(options) {
	return { order: bindingPluginOrder(options.order) };
}
function bindingPluginOrder(order) {
	switch (order) {
		case "post": return BindingPluginOrder.Post;
		case "pre": return BindingPluginOrder.Pre;
		case null:
		case void 0: return;
		default: throw new Error(`Unknown plugin order: ${order}`);
	}
}
function transformAssetSource(bindingAssetSource$1) {
	return bindingAssetSource$1.inner;
}
function bindingAssetSource(source) {
	return { inner: source };
}
const fsModule = {
	appendFile: fs.appendFile,
	copyFile: fs.copyFile,
	mkdir: fs.mkdir,
	mkdtemp: fs.mkdtemp,
	readdir: fs.readdir,
	readFile: fs.readFile,
	realpath: fs.realpath,
	rename: fs.rename,
	rmdir: fs.rmdir,
	stat: fs.stat,
	lstat: fs.lstat,
	unlink: fs.unlink,
	writeFile: fs.writeFile
};
var PluginContextImpl = class extends MinimalPluginContextImpl {
	fs = fsModule;
	getModuleInfo;
	constructor(outputOptions, context, plugin, data, onLog, logLevel, watchMode, currentLoadingModule) {
		super(onLog, logLevel, plugin.name, watchMode);
		this.outputOptions = outputOptions;
		this.context = context;
		this.data = data;
		this.onLog = onLog;
		this.currentLoadingModule = currentLoadingModule;
		this.getModuleInfo = (id$1) => this.data.getModuleInfo(id$1, context);
	}
	async load(options) {
		const id$1 = options.id;
		if (id$1 === this.currentLoadingModule) this.onLog(LOG_LEVEL_WARN, logCycleLoading(this.pluginName, this.currentLoadingModule));
		const moduleInfo = this.data.getModuleInfo(id$1, this.context);
		if (moduleInfo && moduleInfo.code !== null) return moduleInfo;
		const rawOptions = {
			meta: options.meta || {},
			moduleSideEffects: options.moduleSideEffects || null,
			invalidate: false
		};
		this.data.updateModuleOption(id$1, rawOptions);
		let loadPromise = this.data.loadModulePromiseMap.get(id$1);
		if (!loadPromise) {
			loadPromise = this.context.load(id$1, options.moduleSideEffects ?? void 0).catch(() => {
				this.data.loadModulePromiseMap.delete(id$1);
			});
			this.data.loadModulePromiseMap.set(id$1, loadPromise);
		}
		await loadPromise;
		return this.data.getModuleInfo(id$1, this.context);
	}
	async resolve(source, importer, options) {
		let receipt = void 0;
		if (options != null) receipt = this.data.saveResolveOptions(options);
		const vitePluginCustom = Object.entries(options?.custom ?? {}).reduce((acc, [key, value]) => {
			if (key.startsWith("vite:")) (acc ??= {})[key] = value;
			return acc;
		}, void 0);
		const res = await this.context.resolve(source, importer, {
			custom: receipt,
			isEntry: options?.isEntry,
			skipSelf: options?.skipSelf,
			vitePluginCustom
		});
		if (receipt != null) this.data.removeSavedResolveOptions(receipt);
		if (res == null) return null;
		const info = this.data.getModuleOption(res.id) || {};
		return {
			...res,
			external: res.external === "relative" ? unreachable(`The PluginContext resolve result external couldn't be 'relative'`) : res.external,
			...info,
			moduleSideEffects: info.moduleSideEffects ?? res.moduleSideEffects ?? null,
			packageJsonPath: res.packageJsonPath
		};
	}
	emitFile = (file) => {
		if (file.type === "prebuilt-chunk") return unimplemented("PluginContext.emitFile with type prebuilt-chunk");
		if (file.type === "chunk") return this.context.emitChunk({
			preserveEntrySignatures: bindingifyPreserveEntrySignatures(file.preserveSignature),
			...file
		});
		const fnSanitizedFileName = file.fileName || typeof this.outputOptions.sanitizeFileName !== "function" ? void 0 : this.outputOptions.sanitizeFileName(file.name || "asset");
		const filename = file.fileName ? void 0 : this.getAssetFileNames(file);
		return this.context.emitFile({
			...file,
			originalFileName: file.originalFileName || void 0,
			source: bindingAssetSource(file.source)
		}, filename, fnSanitizedFileName);
	};
	getAssetFileNames(file) {
		if (typeof this.outputOptions.assetFileNames === "function") return this.outputOptions.assetFileNames({
			type: "asset",
			name: file.name,
			names: file.name ? [file.name] : [],
			originalFileName: file.originalFileName,
			originalFileNames: file.originalFileName ? [file.originalFileName] : [],
			source: file.source
		});
	}
	getFileName(referenceId) {
		return this.context.getFileName(referenceId);
	}
	getModuleIds() {
		return this.data.getModuleIds(this.context);
	}
	addWatchFile(id$1) {
		this.context.addWatchFile(id$1);
	}
	parse(input, options) {
		return parseAst(input, options);
	}
};
var TransformPluginContextImpl = class extends PluginContextImpl {
	constructor(outputOptions, context, plugin, data, inner, moduleId, moduleSource, onLog, LogLevelOption, watchMode) {
		super(outputOptions, context, plugin, data, onLog, LogLevelOption, watchMode, moduleId);
		this.inner = inner;
		this.moduleId = moduleId;
		this.moduleSource = moduleSource;
		const getLogHandler$1 = (handler) => (log, pos) => {
			log = normalizeLog(log);
			if (pos) augmentCodeLocation(log, pos, moduleSource, moduleId);
			log.id = moduleId;
			log.hook = "transform";
			handler(log);
		};
		this.debug = getLogHandler$1(this.debug);
		this.warn = getLogHandler$1(this.warn);
		this.info = getLogHandler$1(this.info);
	}
	error(e$1$1, pos) {
		if (typeof e$1$1 === "string") e$1$1 = { message: e$1$1 };
		if (pos) augmentCodeLocation(e$1$1, pos, this.moduleSource, this.moduleId);
		e$1$1.id = this.moduleId;
		e$1$1.hook = "transform";
		return error(logPluginError(normalizeLog(e$1$1), this.pluginName));
	}
	getCombinedSourcemap() {
		return JSON.parse(this.inner.getCombinedSourcemap());
	}
	addWatchFile(id$1) {
		this.inner.addWatchFile(id$1);
	}
};
function bindingifyBuildStart(args$1) {
	const hook = args$1.plugin.buildStart;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx, opts) => {
			await handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode), args$1.pluginContextData.getInputOptions(opts));
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
function bindingifyBuildEnd(args$1) {
	const hook = args$1.plugin.buildEnd;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx, err) => {
			await handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode), err ? normalizeErrors(err) : void 0);
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
function bindingifyResolveId(args$1) {
	const hook = args$1.plugin.resolveId;
	if (!hook) return {};
	const { handler, meta, options } = normalizeHook(hook);
	return {
		plugin: async (ctx, specifier, importer, extraOptions) => {
			const contextResolveOptions = extraOptions.custom != null ? args$1.pluginContextData.getSavedResolveOptions(extraOptions.custom) : void 0;
			const ret = await handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode), specifier, importer ?? void 0, {
				...extraOptions,
				custom: contextResolveOptions?.custom
			});
			if (ret == null) return;
			if (ret === false) return {
				id: specifier,
				external: true,
				normalizeExternalId: true
			};
			if (typeof ret === "string") return {
				id: ret,
				normalizeExternalId: false
			};
			let exist = args$1.pluginContextData.updateModuleOption(ret.id, {
				meta: ret.meta || {},
				moduleSideEffects: ret.moduleSideEffects ?? null,
				invalidate: false
			});
			return {
				id: ret.id,
				external: ret.external,
				normalizeExternalId: false,
				moduleSideEffects: exist.moduleSideEffects ?? void 0,
				packageJsonPath: ret.packageJsonPath
			};
		},
		meta: bindingifyPluginHookMeta(meta),
		filter: bindingifyResolveIdFilter(options.filter)
	};
}
function bindingifyResolveDynamicImport(args$1) {
	const hook = args$1.plugin.resolveDynamicImport;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx, specifier, importer) => {
			const ret = await handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode), specifier, importer ?? void 0);
			if (ret == null) return;
			if (ret === false) return {
				id: specifier,
				external: true
			};
			if (typeof ret === "string") return { id: ret };
			const result = {
				id: ret.id,
				external: ret.external
			};
			if (ret.moduleSideEffects !== null) result.moduleSideEffects = ret.moduleSideEffects;
			args$1.pluginContextData.updateModuleOption(ret.id, {
				meta: ret.meta || {},
				moduleSideEffects: ret.moduleSideEffects || null,
				invalidate: false
			});
			return result;
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
function bindingifyTransform(args$1) {
	const hook = args$1.plugin.transform;
	if (!hook) return {};
	const { handler, meta, options } = normalizeHook(hook);
	return {
		plugin: async (ctx, code$1, id$1, meta$1) => {
			const ret = await handler.call(new TransformPluginContextImpl(args$1.outputOptions, ctx.inner(), args$1.plugin, args$1.pluginContextData, ctx, id$1, code$1, args$1.onLog, args$1.logLevel, args$1.watchMode), code$1, id$1, meta$1);
			if (ret == null) return;
			if (typeof ret === "string") return { code: ret };
			let moduleOption = args$1.pluginContextData.updateModuleOption(id$1, {
				meta: ret.meta ?? {},
				moduleSideEffects: ret.moduleSideEffects ?? null,
				invalidate: false
			});
			return {
				code: ret.code,
				map: bindingifySourcemap$1(normalizeTransformHookSourcemap(id$1, code$1, ret.map)),
				moduleSideEffects: moduleOption.moduleSideEffects ?? void 0,
				moduleType: ret.moduleType
			};
		},
		meta: bindingifyPluginHookMeta(meta),
		filter: bindingifyTransformFilter(options.filter)
	};
}
function bindingifyLoad(args$1) {
	const hook = args$1.plugin.load;
	if (!hook) return {};
	const { handler, meta, options } = normalizeHook(hook);
	return {
		plugin: async (ctx, id$1) => {
			const ret = await handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode, id$1), id$1);
			if (ret == null) return;
			if (typeof ret === "string") return { code: ret };
			let moduleOption = args$1.pluginContextData.updateModuleOption(id$1, {
				meta: ret.meta || {},
				moduleSideEffects: ret.moduleSideEffects ?? null,
				invalidate: false
			});
			let map = preProcessSourceMap(ret, id$1);
			return {
				code: ret.code,
				map: bindingifySourcemap$1(map),
				moduleType: ret.moduleType,
				moduleSideEffects: moduleOption.moduleSideEffects ?? void 0
			};
		},
		meta: bindingifyPluginHookMeta(meta),
		filter: bindingifyLoadFilter(options.filter)
	};
}
function preProcessSourceMap(ret, id$1) {
	if (!ret.map) return;
	let map = typeof ret.map === "object" ? ret.map : JSON.parse(ret.map);
	if (!isEmptySourcemapFiled(map.sources)) {
		const directory = path.dirname(id$1) || ".";
		const sourceRoot = map.sourceRoot || ".";
		map.sources = map.sources.map((source) => path.resolve(directory, sourceRoot, source));
	}
	return map;
}
function bindingifyModuleParsed(args$1) {
	const hook = args$1.plugin.moduleParsed;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx, moduleInfo) => {
			await handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode), transformModuleInfo(moduleInfo, args$1.pluginContextData.getModuleOption(moduleInfo.id)));
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
function transformToRenderedModule(bindingRenderedModule) {
	return {
		get code() {
			return bindingRenderedModule.code;
		},
		get renderedLength() {
			return bindingRenderedModule.code?.length || 0;
		},
		get renderedExports() {
			return bindingRenderedModule.renderedExports;
		}
	};
}
function transformRenderedChunk(chunk) {
	let modules = null;
	return {
		type: "chunk",
		get name() {
			return chunk.name;
		},
		get isEntry() {
			return chunk.isEntry;
		},
		get isDynamicEntry() {
			return chunk.isDynamicEntry;
		},
		get facadeModuleId() {
			return chunk.facadeModuleId;
		},
		get moduleIds() {
			return chunk.moduleIds;
		},
		get exports() {
			return chunk.exports;
		},
		get fileName() {
			return chunk.fileName;
		},
		get imports() {
			return chunk.imports;
		},
		get dynamicImports() {
			return chunk.dynamicImports;
		},
		get modules() {
			if (!modules) modules = transformChunkModules(chunk.modules);
			return modules;
		}
	};
}
function transformChunkModules(modules) {
	const result = {};
	for (let i$1 = 0; i$1 < modules.values.length; i$1++) {
		let key = modules.keys[i$1];
		const mod = modules.values[i$1];
		result[key] = transformToRenderedModule(mod);
	}
	return result;
}
function transformToRollupSourceMap(map) {
	const obj = {
		...JSON.parse(map),
		toString() {
			return JSON.stringify(obj);
		},
		toUrl() {
			return `data:application/json;charset=utf-8;base64,${Buffer.from(obj.toString(), "utf-8").toString("base64")}`;
		}
	};
	return obj;
}
function transformToRollupOutputChunk(bindingChunk, changed) {
	const chunk = {
		type: "chunk",
		get code() {
			return bindingChunk.code;
		},
		fileName: bindingChunk.fileName,
		name: bindingChunk.name,
		get modules() {
			return transformChunkModules(bindingChunk.modules);
		},
		get imports() {
			return bindingChunk.imports;
		},
		get dynamicImports() {
			return bindingChunk.dynamicImports;
		},
		exports: bindingChunk.exports,
		isEntry: bindingChunk.isEntry,
		facadeModuleId: bindingChunk.facadeModuleId || null,
		isDynamicEntry: bindingChunk.isDynamicEntry,
		get moduleIds() {
			return bindingChunk.moduleIds;
		},
		get map() {
			return bindingChunk.map ? transformToRollupSourceMap(bindingChunk.map) : null;
		},
		sourcemapFileName: bindingChunk.sourcemapFileName || null,
		preliminaryFileName: bindingChunk.preliminaryFileName
	};
	const cache = {};
	return new Proxy(chunk, {
		get(target, p$1) {
			if (p$1 in cache) return cache[p$1];
			const value = target[p$1];
			cache[p$1] = value;
			return value;
		},
		set(_target, p$1, newValue) {
			cache[p$1] = newValue;
			changed?.updated.add(bindingChunk.fileName);
			return true;
		},
		has(target, p$1) {
			if (p$1 in cache) return true;
			return p$1 in target;
		}
	});
}
function transformToRollupOutputAsset(bindingAsset, changed) {
	const asset = {
		type: "asset",
		fileName: bindingAsset.fileName,
		originalFileName: bindingAsset.originalFileName || null,
		originalFileNames: bindingAsset.originalFileNames,
		get source() {
			return transformAssetSource(bindingAsset.source);
		},
		name: bindingAsset.name ?? void 0,
		names: bindingAsset.names
	};
	const cache = {};
	return new Proxy(asset, {
		get(target, p$1) {
			if (p$1 in cache) return cache[p$1];
			const value = target[p$1];
			cache[p$1] = value;
			return value;
		},
		set(_target, p$1, newValue) {
			cache[p$1] = newValue;
			changed?.updated.add(bindingAsset.fileName);
			return true;
		}
	});
}
function transformToRollupOutput(output, changed) {
	handleOutputErrors(output);
	const { chunks, assets } = output;
	return { output: [...chunks.map((chunk) => transformToRollupOutputChunk(chunk, changed)), ...assets.map((asset) => transformToRollupOutputAsset(asset, changed))] };
}
function handleOutputErrors(output) {
	const rawErrors = output.errors;
	if (rawErrors.length > 0) throw normalizeErrors(rawErrors);
}
function transformToOutputBundle(context, output, changed) {
	const bundle = Object.fromEntries(transformToRollupOutput(output, changed).output.map((item) => [item.fileName, item]));
	return new Proxy(bundle, {
		set(_target, _p, _newValue, _receiver) {
			const originalStackTraceLimit = Error.stackTraceLimit;
			Error.stackTraceLimit = 2;
			const message = "This plugin assigns to bundle variable. This is discouraged by Rollup and is not supported by Rolldown. This will be ignored. https://rollupjs.org/plugin-development/#generatebundle:~:text=DANGER,this.emitFile.";
			const stack = new Error(message).stack ?? message;
			Error.stackTraceLimit = originalStackTraceLimit;
			context.warn({
				message: stack,
				code: "UNSUPPORTED_BUNDLE_ASSIGNMENT"
			});
			return true;
		},
		deleteProperty(target, property) {
			if (typeof property === "string") changed.deleted.add(property);
			return true;
		}
	});
}
function collectChangedBundle(changed, bundle) {
	const changes = {};
	for (const key in bundle) {
		if (changed.deleted.has(key) || !changed.updated.has(key)) continue;
		const item = bundle[key];
		if (item.type === "asset") changes[key] = {
			filename: item.fileName,
			originalFileNames: item.originalFileNames,
			source: bindingAssetSource(item.source),
			names: item.names
		};
		else changes[key] = {
			code: item.code,
			filename: item.fileName,
			name: item.name,
			isEntry: item.isEntry,
			exports: item.exports,
			modules: {},
			imports: item.imports,
			dynamicImports: item.dynamicImports,
			facadeModuleId: item.facadeModuleId || void 0,
			isDynamicEntry: item.isDynamicEntry,
			moduleIds: item.moduleIds,
			map: bindingifySourcemap$1(item.map),
			sourcemapFilename: item.sourcemapFileName || void 0,
			preliminaryFilename: item.preliminaryFileName
		};
	}
	return {
		changes,
		deleted: changed.deleted
	};
}
function bindingifyRenderStart(args$1) {
	const hook = args$1.plugin.renderStart;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx, opts) => {
			handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode), args$1.pluginContextData.getOutputOptions(opts), args$1.pluginContextData.getInputOptions(opts));
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
function bindingifyRenderChunk(args$1) {
	const hook = args$1.plugin.renderChunk;
	if (!hook) return {};
	const { handler, meta, options } = normalizeHook(hook);
	return {
		plugin: async (ctx, code$1, chunk, opts, meta$1) => {
			if (args$1.pluginContextData.getRenderChunkMeta() == null) args$1.pluginContextData.setRenderChunkMeta({ chunks: Object.fromEntries(Object.entries(meta$1.chunks).map(([key, value]) => [key, transformRenderedChunk(value)])) });
			const ret = await handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode), code$1, transformRenderedChunk(chunk), args$1.pluginContextData.getOutputOptions(opts), args$1.pluginContextData.getRenderChunkMeta());
			if (ret == null) return;
			if (typeof ret === "string") return { code: ret };
			if (!ret.map) return { code: ret.code };
			return {
				code: ret.code,
				map: bindingifySourcemap$1(ret.map)
			};
		},
		meta: bindingifyPluginHookMeta(meta),
		filter: bindingifyRenderChunkFilter(options.filter)
	};
}
function bindingifyAugmentChunkHash(args$1) {
	const hook = args$1.plugin.augmentChunkHash;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx, chunk) => {
			return await handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode), transformRenderedChunk(chunk));
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
function bindingifyRenderError(args$1) {
	const hook = args$1.plugin.renderError;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx, err) => {
			handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode), normalizeErrors(err));
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
function bindingifyGenerateBundle(args$1) {
	const hook = args$1.plugin.generateBundle;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx, bundle, isWrite, opts) => {
			const changed = {
				updated: /* @__PURE__ */ new Set(),
				deleted: /* @__PURE__ */ new Set()
			};
			const context = new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode);
			const output = transformToOutputBundle(context, bundle, changed);
			await handler.call(context, args$1.pluginContextData.getOutputOptions(opts), output, isWrite);
			return collectChangedBundle(changed, output);
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
function bindingifyWriteBundle(args$1) {
	const hook = args$1.plugin.writeBundle;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx, bundle, opts) => {
			const changed = {
				updated: /* @__PURE__ */ new Set(),
				deleted: /* @__PURE__ */ new Set()
			};
			const context = new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode);
			const output = transformToOutputBundle(context, bundle, changed);
			await handler.call(context, args$1.pluginContextData.getOutputOptions(opts), output);
			return collectChangedBundle(changed, output);
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
function bindingifyCloseBundle(args$1) {
	const hook = args$1.plugin.closeBundle;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx) => {
			await handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode));
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
function bindingifyBanner(args$1) {
	const hook = args$1.plugin.banner;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx, chunk) => {
			if (typeof handler === "string") return handler;
			return handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode), transformRenderedChunk(chunk));
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
function bindingifyFooter(args$1) {
	const hook = args$1.plugin.footer;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx, chunk) => {
			if (typeof handler === "string") return handler;
			return handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode), transformRenderedChunk(chunk));
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
function bindingifyIntro(args$1) {
	const hook = args$1.plugin.intro;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx, chunk) => {
			if (typeof handler === "string") return handler;
			return handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode), transformRenderedChunk(chunk));
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
function bindingifyOutro(args$1) {
	const hook = args$1.plugin.outro;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx, chunk) => {
			if (typeof handler === "string") return handler;
			return handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode), transformRenderedChunk(chunk));
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
function bindingifyWatchChange(args$1) {
	const hook = args$1.plugin.watchChange;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx, id$1, event) => {
			await handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode), id$1, { event });
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
function bindingifyCloseWatcher(args$1) {
	const hook = args$1.plugin.closeWatcher;
	if (!hook) return {};
	const { handler, meta } = normalizeHook(hook);
	return {
		plugin: async (ctx) => {
			await handler.call(new PluginContextImpl(args$1.outputOptions, ctx, args$1.plugin, args$1.pluginContextData, args$1.onLog, args$1.logLevel, args$1.watchMode));
		},
		meta: bindingifyPluginHookMeta(meta)
	};
}
let HookUsageKind = /* @__PURE__ */ function(HookUsageKind$1) {
	HookUsageKind$1[HookUsageKind$1["buildStart"] = 1] = "buildStart";
	HookUsageKind$1[HookUsageKind$1["resolveId"] = 2] = "resolveId";
	HookUsageKind$1[HookUsageKind$1["resolveDynamicImport"] = 4] = "resolveDynamicImport";
	HookUsageKind$1[HookUsageKind$1["load"] = 8] = "load";
	HookUsageKind$1[HookUsageKind$1["transform"] = 16] = "transform";
	HookUsageKind$1[HookUsageKind$1["moduleParsed"] = 32] = "moduleParsed";
	HookUsageKind$1[HookUsageKind$1["buildEnd"] = 64] = "buildEnd";
	HookUsageKind$1[HookUsageKind$1["renderStart"] = 128] = "renderStart";
	HookUsageKind$1[HookUsageKind$1["renderError"] = 256] = "renderError";
	HookUsageKind$1[HookUsageKind$1["renderChunk"] = 512] = "renderChunk";
	HookUsageKind$1[HookUsageKind$1["augmentChunkHash"] = 1024] = "augmentChunkHash";
	HookUsageKind$1[HookUsageKind$1["generateBundle"] = 2048] = "generateBundle";
	HookUsageKind$1[HookUsageKind$1["writeBundle"] = 4096] = "writeBundle";
	HookUsageKind$1[HookUsageKind$1["closeBundle"] = 8192] = "closeBundle";
	HookUsageKind$1[HookUsageKind$1["watchChange"] = 16384] = "watchChange";
	HookUsageKind$1[HookUsageKind$1["closeWatcher"] = 32768] = "closeWatcher";
	HookUsageKind$1[HookUsageKind$1["transformAst"] = 65536] = "transformAst";
	HookUsageKind$1[HookUsageKind$1["banner"] = 131072] = "banner";
	HookUsageKind$1[HookUsageKind$1["footer"] = 262144] = "footer";
	HookUsageKind$1[HookUsageKind$1["intro"] = 524288] = "intro";
	HookUsageKind$1[HookUsageKind$1["outro"] = 1048576] = "outro";
	return HookUsageKind$1;
}({});
var HookUsage = class {
	bitflag = BigInt(0);
	constructor() {}
	union(kind) {
		this.bitflag |= BigInt(kind);
	}
	inner() {
		return Number(this.bitflag);
	}
};
function extractHookUsage(plugin) {
	let hookUsage = new HookUsage();
	if (plugin.buildStart) hookUsage.union(HookUsageKind.buildStart);
	if (plugin.resolveId) hookUsage.union(HookUsageKind.resolveId);
	if (plugin.resolveDynamicImport) hookUsage.union(HookUsageKind.resolveDynamicImport);
	if (plugin.load) hookUsage.union(HookUsageKind.load);
	if (plugin.transform) hookUsage.union(HookUsageKind.transform);
	if (plugin.moduleParsed) hookUsage.union(HookUsageKind.moduleParsed);
	if (plugin.buildEnd) hookUsage.union(HookUsageKind.buildEnd);
	if (plugin.renderStart) hookUsage.union(HookUsageKind.renderStart);
	if (plugin.renderError) hookUsage.union(HookUsageKind.renderError);
	if (plugin.renderChunk) hookUsage.union(HookUsageKind.renderChunk);
	if (plugin.augmentChunkHash) hookUsage.union(HookUsageKind.augmentChunkHash);
	if (plugin.generateBundle) hookUsage.union(HookUsageKind.generateBundle);
	if (plugin.writeBundle) hookUsage.union(HookUsageKind.writeBundle);
	if (plugin.closeBundle) hookUsage.union(HookUsageKind.closeBundle);
	if (plugin.watchChange) hookUsage.union(HookUsageKind.watchChange);
	if (plugin.closeWatcher) hookUsage.union(HookUsageKind.closeWatcher);
	if (plugin.banner) hookUsage.union(HookUsageKind.banner);
	if (plugin.footer) hookUsage.union(HookUsageKind.footer);
	if (plugin.intro) hookUsage.union(HookUsageKind.intro);
	if (plugin.outro) hookUsage.union(HookUsageKind.outro);
	return hookUsage;
}
function bindingifyPlugin(plugin, options, outputOptions, pluginContextData, normalizedOutputPlugins, onLog, logLevel, watchMode) {
	const args$1 = {
		plugin,
		options,
		outputOptions,
		pluginContextData,
		onLog,
		logLevel,
		watchMode,
		normalizedOutputPlugins
	};
	const { plugin: buildStart, meta: buildStartMeta } = bindingifyBuildStart(args$1);
	const { plugin: resolveId, meta: resolveIdMeta, filter: resolveIdFilter } = bindingifyResolveId(args$1);
	const { plugin: resolveDynamicImport, meta: resolveDynamicImportMeta } = bindingifyResolveDynamicImport(args$1);
	const { plugin: buildEnd, meta: buildEndMeta } = bindingifyBuildEnd(args$1);
	const { plugin: transform$1, meta: transformMeta, filter: transformFilter } = bindingifyTransform(args$1);
	const { plugin: moduleParsed, meta: moduleParsedMeta } = bindingifyModuleParsed(args$1);
	const { plugin: load$1$1, meta: loadMeta, filter: loadFilter } = bindingifyLoad(args$1);
	const { plugin: renderChunk, meta: renderChunkMeta, filter: renderChunkFilter } = bindingifyRenderChunk(args$1);
	const { plugin: augmentChunkHash, meta: augmentChunkHashMeta } = bindingifyAugmentChunkHash(args$1);
	const { plugin: renderStart, meta: renderStartMeta } = bindingifyRenderStart(args$1);
	const { plugin: renderError, meta: renderErrorMeta } = bindingifyRenderError(args$1);
	const { plugin: generateBundle, meta: generateBundleMeta } = bindingifyGenerateBundle(args$1);
	const { plugin: writeBundle, meta: writeBundleMeta } = bindingifyWriteBundle(args$1);
	const { plugin: closeBundle, meta: closeBundleMeta } = bindingifyCloseBundle(args$1);
	const { plugin: banner, meta: bannerMeta } = bindingifyBanner(args$1);
	const { plugin: footer, meta: footerMeta } = bindingifyFooter(args$1);
	const { plugin: intro, meta: introMeta } = bindingifyIntro(args$1);
	const { plugin: outro, meta: outroMeta } = bindingifyOutro(args$1);
	const { plugin: watchChange, meta: watchChangeMeta } = bindingifyWatchChange(args$1);
	const { plugin: closeWatcher, meta: closeWatcherMeta } = bindingifyCloseWatcher(args$1);
	let hookUsage = extractHookUsage(plugin).inner();
	const result = {
		name: plugin.name,
		buildStart,
		buildStartMeta,
		resolveId,
		resolveIdMeta,
		resolveIdFilter,
		resolveDynamicImport,
		resolveDynamicImportMeta,
		buildEnd,
		buildEndMeta,
		transform: transform$1,
		transformMeta,
		transformFilter,
		moduleParsed,
		moduleParsedMeta,
		load: load$1$1,
		loadMeta,
		loadFilter,
		renderChunk,
		renderChunkMeta,
		renderChunkFilter,
		augmentChunkHash,
		augmentChunkHashMeta,
		renderStart,
		renderStartMeta,
		renderError,
		renderErrorMeta,
		generateBundle,
		generateBundleMeta,
		writeBundle,
		writeBundleMeta,
		closeBundle,
		closeBundleMeta,
		banner,
		bannerMeta,
		footer,
		footerMeta,
		intro,
		introMeta,
		outro,
		outroMeta,
		watchChange,
		watchChangeMeta,
		closeWatcher,
		closeWatcherMeta,
		hookUsage
	};
	return wrapHandlers(result);
}
function wrapHandlers(plugin) {
	for (const hookName of [
		"buildStart",
		"resolveId",
		"resolveDynamicImport",
		"buildEnd",
		"transform",
		"moduleParsed",
		"load",
		"renderChunk",
		"augmentChunkHash",
		"renderStart",
		"renderError",
		"generateBundle",
		"writeBundle",
		"closeBundle",
		"banner",
		"footer",
		"intro",
		"outro",
		"watchChange",
		"closeWatcher"
	]) {
		const handler = plugin[hookName];
		if (handler) plugin[hookName] = async (...args$1) => {
			try {
				return await handler(...args$1);
			} catch (e$1$1) {
				return error(logPluginError(e$1$1, plugin.name, {
					hook: hookName,
					id: hookName === "transform" ? args$1[2] : void 0
				}));
			}
		};
	}
	return plugin;
}
var NormalizedInputOptionsImpl = class {
	inner;
	constructor(inner, onLog) {
		this.onLog = onLog;
		this.inner = inner;
	}
	get shimMissingExports() {
		return this.inner.shimMissingExports;
	}
	get input() {
		return this.inner.input;
	}
	get cwd() {
		return this.inner.cwd ?? void 0;
	}
	get platform() {
		return this.inner.platform;
	}
	get context() {
		return this.inner.context;
	}
};
var NormalizedOutputOptionsImpl = class {
	constructor(inner, outputOptions, normalizedOutputPlugins) {
		this.inner = inner;
		this.outputOptions = outputOptions;
		this.normalizedOutputPlugins = normalizedOutputPlugins;
	}
	get dir() {
		return this.inner.dir ?? void 0;
	}
	get entryFileNames() {
		return this.inner.entryFilenames || this.outputOptions.entryFileNames;
	}
	get chunkFileNames() {
		return this.inner.chunkFilenames || this.outputOptions.chunkFileNames;
	}
	get assetFileNames() {
		return this.inner.assetFilenames || this.outputOptions.assetFileNames;
	}
	get format() {
		return this.inner.format;
	}
	get exports() {
		return this.inner.exports;
	}
	get sourcemap() {
		return this.inner.sourcemap;
	}
	get sourcemapBaseUrl() {
		return this.inner.sourcemapBaseUrl ?? void 0;
	}
	get cssEntryFileNames() {
		return this.inner.cssEntryFilenames || this.outputOptions.cssEntryFileNames;
	}
	get cssChunkFileNames() {
		return this.inner.cssChunkFilenames || this.outputOptions.cssChunkFileNames;
	}
	get shimMissingExports() {
		return this.inner.shimMissingExports;
	}
	get name() {
		return this.inner.name ?? void 0;
	}
	get file() {
		return this.inner.file ?? void 0;
	}
	get inlineDynamicImports() {
		return this.inner.inlineDynamicImports;
	}
	get externalLiveBindings() {
		return this.inner.externalLiveBindings;
	}
	get banner() {
		return normalizeAddon(this.outputOptions.banner);
	}
	get footer() {
		return normalizeAddon(this.outputOptions.footer);
	}
	get intro() {
		return normalizeAddon(this.outputOptions.intro);
	}
	get outro() {
		return normalizeAddon(this.outputOptions.outro);
	}
	get esModule() {
		return this.inner.esModule;
	}
	get extend() {
		return this.inner.extend;
	}
	get globals() {
		return this.inner.globals || this.outputOptions.globals;
	}
	get hashCharacters() {
		return this.inner.hashCharacters;
	}
	get sourcemapDebugIds() {
		return this.inner.sourcemapDebugIds;
	}
	get sourcemapIgnoreList() {
		return this.outputOptions.sourcemapIgnoreList;
	}
	get sourcemapPathTransform() {
		return this.outputOptions.sourcemapPathTransform;
	}
	get minify() {
		let ret = this.inner.minify;
		if (typeof ret === "object" && ret !== null) {
			delete ret["codegen"];
			delete ret["module"];
			delete ret["sourcemap"];
		}
		return ret;
	}
	get legalComments() {
		return this.inner.legalComments;
	}
	get polyfillRequire() {
		return this.inner.polyfillRequire;
	}
	get plugins() {
		return this.normalizedOutputPlugins;
	}
	get preserveModules() {
		return this.inner.preserveModules;
	}
	get preserveModulesRoot() {
		return this.inner.preserveModulesRoot;
	}
	get virtualDirname() {
		return this.inner.virtualDirname;
	}
	get topLevelVar() {
		return this.inner.topLevelVar ?? false;
	}
	get minifyInternalExports() {
		return this.inner.minifyInternalExports ?? false;
	}
};
function normalizeAddon(value) {
	if (typeof value === "function") return value;
	return () => value || "";
}
var PluginContextData = class {
	moduleOptionMap = /* @__PURE__ */ new Map();
	resolveOptionsMap = /* @__PURE__ */ new Map();
	loadModulePromiseMap = /* @__PURE__ */ new Map();
	renderedChunkMeta = null;
	normalizedInputOptions = null;
	normalizedOutputOptions = null;
	constructor(onLog, outputOptions, normalizedOutputPlugins) {
		this.onLog = onLog;
		this.outputOptions = outputOptions;
		this.normalizedOutputPlugins = normalizedOutputPlugins;
	}
	updateModuleOption(id$1, option) {
		const existing = this.moduleOptionMap.get(id$1);
		if (existing) {
			if (option.moduleSideEffects != null) existing.moduleSideEffects = option.moduleSideEffects;
			if (option.meta != null) Object.assign(existing.meta, option.meta);
			if (option.invalidate != null) existing.invalidate = option.invalidate;
		} else {
			this.moduleOptionMap.set(id$1, option);
			return option;
		}
		return existing;
	}
	getModuleOption(id$1) {
		const option = this.moduleOptionMap.get(id$1);
		if (!option) {
			const raw = {
				moduleSideEffects: null,
				meta: {}
			};
			this.moduleOptionMap.set(id$1, raw);
			return raw;
		}
		return option;
	}
	getModuleInfo(id$1, context) {
		const bindingInfo = context.getModuleInfo(id$1);
		if (bindingInfo) {
			const info = transformModuleInfo(bindingInfo, this.getModuleOption(id$1));
			return this.proxyModuleInfo(id$1, info);
		}
		return null;
	}
	proxyModuleInfo(id$1, info) {
		let moduleSideEffects = info.moduleSideEffects;
		Object.defineProperty(info, "moduleSideEffects", {
			get() {
				return moduleSideEffects;
			},
			set: (v) => {
				this.updateModuleOption(id$1, {
					moduleSideEffects: v,
					meta: info.meta,
					invalidate: true
				});
				moduleSideEffects = v;
			}
		});
		return info;
	}
	getModuleIds(context) {
		return context.getModuleIds().values();
	}
	saveResolveOptions(options) {
		const index = this.resolveOptionsMap.size;
		this.resolveOptionsMap.set(index, options);
		return index;
	}
	getSavedResolveOptions(receipt) {
		return this.resolveOptionsMap.get(receipt);
	}
	removeSavedResolveOptions(receipt) {
		this.resolveOptionsMap.delete(receipt);
	}
	setRenderChunkMeta(meta) {
		this.renderedChunkMeta = meta;
	}
	getRenderChunkMeta() {
		return this.renderedChunkMeta;
	}
	getInputOptions(opts) {
		this.normalizedInputOptions ??= new NormalizedInputOptionsImpl(opts, this.onLog);
		return this.normalizedInputOptions;
	}
	getOutputOptions(opts) {
		this.normalizedOutputOptions ??= new NormalizedOutputOptionsImpl(opts, this.outputOptions, this.normalizedOutputPlugins);
		return this.normalizedOutputOptions;
	}
	clear() {
		this.renderedChunkMeta = null;
		this.loadModulePromiseMap.clear();
	}
};
function normalizedStringOrRegex(pattern) {
	if (!pattern) return;
	if (!isReadonlyArray(pattern)) return [pattern];
	return pattern;
}
function isReadonlyArray(input) {
	return Array.isArray(input);
}
function bindingifyInputOptions(rawPlugins, inputOptions, outputOptions, normalizedOutputPlugins, onLog, logLevel, watchMode) {
	const pluginContextData = new PluginContextData(onLog, outputOptions, normalizedOutputPlugins);
	const plugins = rawPlugins.map((plugin) => {
		if ("_parallel" in plugin) return;
		if (plugin instanceof BuiltinPlugin) return bindingifyBuiltInPlugin(plugin);
		return bindingifyPlugin(plugin, inputOptions, outputOptions, pluginContextData, normalizedOutputPlugins, onLog, logLevel, watchMode);
	});
	const { jsx, transform: transform$1 } = bindingifyJsx(onLog, inputOptions.jsx, inputOptions.transform);
	return {
		input: bindingifyInput(inputOptions.input),
		plugins,
		cwd: inputOptions.cwd ?? process.cwd(),
		external: bindingifyExternal(inputOptions.external),
		resolve: bindingifyResolve(inputOptions.resolve),
		platform: inputOptions.platform,
		shimMissingExports: inputOptions.shimMissingExports,
		logLevel: bindingifyLogLevel(logLevel),
		onLog: async (level, log) => onLog(level, log),
		treeshake: bindingifyTreeshakeOptions(inputOptions.treeshake),
		moduleTypes: inputOptions.moduleTypes,
		define: inputOptions.define ? Object.entries(inputOptions.define) : void 0,
		inject: bindingifyInject(inputOptions.inject),
		experimental: bindingifyExperimental(inputOptions.experimental),
		profilerNames: inputOptions?.profilerNames,
		jsx,
		transform: transform$1,
		watch: bindingifyWatch(inputOptions.watch),
		dropLabels: inputOptions.dropLabels,
		keepNames: inputOptions.keepNames,
		checks: inputOptions.checks,
		deferSyncScanData: () => {
			let ret = [];
			pluginContextData.moduleOptionMap.forEach((value, key) => {
				if (value.invalidate) ret.push({
					id: key,
					sideEffects: value.moduleSideEffects ?? void 0
				});
			});
			return ret;
		},
		makeAbsoluteExternalsRelative: bindingifyMakeAbsoluteExternalsRelative(inputOptions.makeAbsoluteExternalsRelative),
		debug: inputOptions.debug,
		invalidateJsSideCache: pluginContextData.clear.bind(pluginContextData),
		preserveEntrySignatures: bindingifyPreserveEntrySignatures(inputOptions.preserveEntrySignatures),
		optimization: inputOptions.optimization,
		context: inputOptions.context,
		tsconfig: inputOptions.resolve?.tsconfigFilename ?? inputOptions.tsconfig
	};
}
function bindingifyHmr(hmr) {
	if (hmr) {
		if (typeof hmr === "boolean") return hmr ? {} : void 0;
		return hmr;
	}
}
function bindingifyAttachDebugInfo(attachDebugInfo) {
	switch (attachDebugInfo) {
		case void 0: return;
		case "full": return BindingAttachDebugInfo.Full;
		case "simple": return BindingAttachDebugInfo.Simple;
		case "none": return BindingAttachDebugInfo.None;
	}
}
function bindingifyExternal(external) {
	if (external) {
		if (typeof external === "function") return (id$1, importer, isResolved) => {
			if (id$1.startsWith("\0")) return false;
			return external(id$1, importer, isResolved) ?? false;
		};
		return arraify(external);
	}
}
function bindingifyExperimental(experimental) {
	let chunkModulesOrder = BindingChunkModuleOrderBy.ExecOrder;
	if (experimental?.chunkModulesOrder) switch (experimental.chunkModulesOrder) {
		case "exec-order":
			chunkModulesOrder = BindingChunkModuleOrderBy.ExecOrder;
			break;
		case "module-id":
			chunkModulesOrder = BindingChunkModuleOrderBy.ModuleId;
			break;
		default: throw new Error(`Unexpected chunkModulesOrder: ${experimental.chunkModulesOrder}`);
	}
	return {
		strictExecutionOrder: experimental?.strictExecutionOrder,
		disableLiveBindings: experimental?.disableLiveBindings,
		viteMode: experimental?.viteMode,
		resolveNewUrlToAsset: experimental?.resolveNewUrlToAsset,
		hmr: bindingifyHmr(experimental?.hmr),
		attachDebugInfo: bindingifyAttachDebugInfo(experimental?.attachDebugInfo),
		chunkModulesOrder,
		chunkImportMap: experimental?.chunkImportMap,
		onDemandWrapping: experimental?.onDemandWrapping,
		incrementalBuild: experimental?.incrementalBuild
	};
}
function bindingifyResolve(resolve$2) {
	const yarnPnp = typeof process === "object" && !!process.versions?.pnp;
	if (resolve$2) {
		const { alias, extensionAlias,...rest } = resolve$2;
		return {
			alias: alias ? Object.entries(alias).map(([name, replacement]) => ({
				find: name,
				replacements: replacement === false ? [void 0] : arraify(replacement)
			})) : void 0,
			extensionAlias: extensionAlias ? Object.entries(extensionAlias).map(([name, value]) => ({
				target: name,
				replacements: value
			})) : void 0,
			yarnPnp,
			...rest
		};
	} else return { yarnPnp };
}
function bindingifyInject(inject) {
	if (inject) return Object.entries(inject).map(([alias, item]) => {
		if (Array.isArray(item)) {
			if (item[1] === "*") return {
				tagNamespace: true,
				alias,
				from: item[0]
			};
			return {
				tagNamed: true,
				alias,
				from: item[0],
				imported: item[1]
			};
		} else return {
			tagNamed: true,
			imported: "default",
			alias,
			from: item
		};
	});
}
function bindingifyLogLevel(logLevel) {
	switch (logLevel) {
		case "silent": return BindingLogLevel.Silent;
		case "debug": return BindingLogLevel.Debug;
		case "warn": return BindingLogLevel.Warn;
		case "info": return BindingLogLevel.Info;
		default: throw new Error(`Unexpected log level: ${logLevel}`);
	}
}
function bindingifyInput(input) {
	if (input === void 0) return [];
	if (typeof input === "string") return [{ import: input }];
	if (Array.isArray(input)) return input.map((src) => ({ import: src }));
	return Object.entries(input).map(([name, import_path]) => {
		return {
			name,
			import: import_path
		};
	});
}
function bindingifyJsx(onLog, input, transform$1) {
	if (transform$1?.jsx) {
		if (input !== void 0) onLog(LOG_LEVEL_WARN, logDuplicateJsxConfig());
		return { transform: transform$1 };
	}
	if (typeof input === "object") {
		if (input.mode === "preserve") return {
			jsx: BindingJsx.Preserve,
			transform: transform$1
		};
		const mode = input.mode ?? "automatic";
		transform$1 ??= {};
		transform$1.jsx = {
			runtime: mode,
			pragma: input.factory,
			pragmaFrag: input.fragment,
			importSource: mode === "classic" ? input.importSource : mode === "automatic" ? input.jsxImportSource : void 0
		};
		return { transform: transform$1 };
	}
	let jsx;
	switch (input) {
		case false:
			jsx = BindingJsx.Disable;
			break;
		case "react":
			jsx = BindingJsx.React;
			break;
		case "react-jsx":
			jsx = BindingJsx.ReactJsx;
			break;
		case "preserve":
			jsx = BindingJsx.Preserve;
			break;
	}
	return {
		jsx,
		transform: transform$1
	};
}
function bindingifyWatch(watch$1) {
	if (watch$1) return {
		buildDelay: watch$1.buildDelay,
		skipWrite: watch$1.skipWrite,
		include: normalizedStringOrRegex(watch$1.include),
		exclude: normalizedStringOrRegex(watch$1.exclude),
		onInvalidate: (...args$1) => watch$1.onInvalidate?.(...args$1)
	};
}
function bindingifyTreeshakeOptions(config) {
	if (config === false) return;
	if (config === true || config === void 0) return { moduleSideEffects: true };
	let normalizedConfig = {
		moduleSideEffects: true,
		annotations: config.annotations,
		manualPureFunctions: config.manualPureFunctions,
		unknownGlobalSideEffects: config.unknownGlobalSideEffects,
		commonjs: config.commonjs
	};
	switch (config.propertyReadSideEffects) {
		case "always":
			normalizedConfig.propertyReadSideEffects = BindingPropertyReadSideEffects.Always;
			break;
		case false:
			normalizedConfig.propertyReadSideEffects = BindingPropertyReadSideEffects.False;
			break;
		default:
	}
	switch (config.propertyWriteSideEffects) {
		case "always":
			normalizedConfig.propertyWriteSideEffects = BindingPropertyWriteSideEffects.Always;
			break;
		case false:
			normalizedConfig.propertyWriteSideEffects = BindingPropertyWriteSideEffects.False;
			break;
		default:
	}
	if (config.moduleSideEffects === void 0) normalizedConfig.moduleSideEffects = true;
	else if (config.moduleSideEffects === "no-external") normalizedConfig.moduleSideEffects = [{
		external: true,
		sideEffects: false
	}, {
		external: false,
		sideEffects: true
	}];
	else normalizedConfig.moduleSideEffects = config.moduleSideEffects;
	return normalizedConfig;
}
function bindingifyMakeAbsoluteExternalsRelative(makeAbsoluteExternalsRelative) {
	if (makeAbsoluteExternalsRelative === "ifRelativeSource") return { type: "IfRelativeSource" };
	if (typeof makeAbsoluteExternalsRelative === "boolean") return {
		type: "Bool",
		field0: makeAbsoluteExternalsRelative
	};
}
function bindingifyPreserveEntrySignatures(preserveEntrySignatures) {
	if (preserveEntrySignatures == void 0) return;
	else if (typeof preserveEntrySignatures === "string") return {
		type: "String",
		field0: preserveEntrySignatures
	};
	else return {
		type: "Bool",
		field0: preserveEntrySignatures
	};
}
var ChunkingContextImpl = class {
	constructor(context) {
		this.context = context;
	}
	getModuleInfo(moduleId) {
		const bindingInfo = this.context.getModuleInfo(moduleId);
		if (bindingInfo) return transformModuleInfo(bindingInfo, {
			moduleSideEffects: null,
			meta: {}
		});
		return null;
	}
};
function bindingifyOutputOptions(outputOptions) {
	const { dir, format, exports, hashCharacters, sourcemap, sourcemapBaseUrl, sourcemapDebugIds, sourcemapIgnoreList, sourcemapPathTransform, name, assetFileNames, entryFileNames, chunkFileNames, cssEntryFileNames, cssChunkFileNames, banner, footer, intro, outro, esModule, globals, generatedCode, file, sanitizeFileName, preserveModules, virtualDirname, legalComments, preserveModulesRoot, manualChunks, topLevelVar } = outputOptions;
	const advancedChunks = bindingifyAdvancedChunks(outputOptions.advancedChunks, manualChunks);
	return {
		dir,
		file: file == null ? void 0 : file,
		format: bindingifyFormat(format),
		exports,
		hashCharacters,
		sourcemap: bindingifySourcemap(sourcemap),
		sourcemapBaseUrl,
		sourcemapDebugIds,
		sourcemapIgnoreList: sourcemapIgnoreList ?? /node_modules/,
		sourcemapPathTransform,
		banner: bindingifyAddon(banner),
		footer: bindingifyAddon(footer),
		intro: bindingifyAddon(intro),
		outro: bindingifyAddon(outro),
		extend: outputOptions.extend,
		globals,
		generatedCode,
		esModule,
		name,
		assetFileNames: bindingifyAssetFilenames(assetFileNames),
		entryFileNames,
		chunkFileNames,
		cssEntryFileNames,
		cssChunkFileNames,
		plugins: [],
		minify: outputOptions.minify,
		externalLiveBindings: outputOptions.externalLiveBindings,
		inlineDynamicImports: outputOptions.inlineDynamicImports,
		advancedChunks,
		polyfillRequire: outputOptions.polyfillRequire,
		sanitizeFileName,
		preserveModules,
		virtualDirname,
		legalComments,
		preserveModulesRoot,
		topLevelVar,
		minifyInternalExports: outputOptions.minifyInternalExports
	};
}
function bindingifyAddon(configAddon) {
	return async (chunk) => {
		if (typeof configAddon === "function") return configAddon(transformRenderedChunk(chunk));
		return configAddon || "";
	};
}
function bindingifyFormat(format) {
	switch (format) {
		case void 0:
		case "es":
		case "esm":
		case "module": return "es";
		case "cjs":
		case "commonjs": return "cjs";
		case "iife": return "iife";
		case "umd": return "umd";
		default: unimplemented(`output.format: ${format}`);
	}
}
function bindingifySourcemap(sourcemap) {
	switch (sourcemap) {
		case true: return "file";
		case "inline": return "inline";
		case false:
		case void 0: return;
		case "hidden": return "hidden";
		default: throw new Error(`unknown sourcemap: ${sourcemap}`);
	}
}
function bindingifyAssetFilenames(assetFileNames) {
	if (typeof assetFileNames === "function") return (asset) => {
		return assetFileNames({
			name: asset.name,
			names: asset.names,
			originalFileName: asset.originalFileName,
			originalFileNames: asset.originalFileNames,
			source: transformAssetSource(asset.source),
			type: "asset"
		});
	};
	return assetFileNames;
}
function bindingifyAdvancedChunks(advancedChunks, manualChunks) {
	if (manualChunks != null && advancedChunks != null) console.warn("`manualChunks` option is ignored due to `advancedChunks` option is specified.");
	else if (manualChunks != null) advancedChunks = { groups: [{ name(moduleId, ctx) {
		return manualChunks(moduleId, { getModuleInfo: (id$1) => ctx.getModuleInfo(id$1) });
	} }] };
	if (advancedChunks == null) return;
	const { groups,...restAdvancedChunks } = advancedChunks;
	return {
		...restAdvancedChunks,
		groups: groups?.map((group) => {
			const { name,...restGroup } = group;
			return {
				...restGroup,
				name: typeof name === "function" ? (id$1, ctx) => name(id$1, new ChunkingContextImpl(ctx)) : name
			};
		})
	};
}
async function initializeParallelPlugins(plugins) {
	const pluginInfos = [];
	for (const [index, plugin] of plugins.entries()) if ("_parallel" in plugin) {
		const { fileUrl, options } = plugin._parallel;
		pluginInfos.push({
			index,
			fileUrl,
			options
		});
	}
	if (pluginInfos.length <= 0) return;
	const count = availableParallelism();
	const parallelJsPluginRegistry = new ParallelJsPluginRegistry(count);
	const registryId = parallelJsPluginRegistry.id;
	const workers = await initializeWorkers(registryId, count, pluginInfos);
	const stopWorkers = async () => {
		await Promise.all(workers.map((worker) => worker.terminate()));
	};
	return {
		registry: parallelJsPluginRegistry,
		stopWorkers
	};
}
function initializeWorkers(registryId, count, pluginInfos) {
	return Promise.all(Array.from({ length: count }, (_, i$1) => initializeWorker(registryId, pluginInfos, i$1)));
}
async function initializeWorker(registryId, pluginInfos, threadNumber) {
	const urlString = import.meta.resolve("#parallel-plugin-worker");
	const workerData$1 = {
		registryId,
		pluginInfos,
		threadNumber
	};
	let worker;
	try {
		worker = new Worker(new URL(urlString), { workerData: workerData$1 });
		worker.unref();
		await new Promise((resolve$2, reject) => {
			worker.once("message", async (message) => {
				if (message.type === "error") reject(message.error);
				else resolve$2();
			});
		});
		return worker;
	} catch (e$1$1) {
		worker?.terminate();
		throw e$1$1;
	}
}
const availableParallelism = () => {
	let availableParallelism$1 = 1;
	try {
		availableParallelism$1 = os.availableParallelism();
	} catch {
		const cpus = os.cpus();
		if (Array.isArray(cpus) && cpus.length > 0) availableParallelism$1 = cpus.length;
	}
	return Math.min(availableParallelism$1, 8);
};
async function createBundlerOptions(inputOptions, outputOptions, watchMode) {
	const inputPlugins = await normalizePluginOption(inputOptions.plugins);
	const outputPlugins = await normalizePluginOption(outputOptions.plugins);
	const logLevel = inputOptions.logLevel || LOG_LEVEL_INFO;
	const onLog = getLogger(getObjectPlugins(inputPlugins), getOnLog(inputOptions, logLevel), logLevel, watchMode);
	outputOptions = PluginDriver.callOutputOptionsHook([...inputPlugins, ...outputPlugins], outputOptions, onLog, logLevel, watchMode);
	const normalizedOutputPlugins = await normalizePluginOption(outputOptions.plugins);
	let plugins = [...normalizePlugins(inputPlugins, ANONYMOUS_PLUGIN_PREFIX), ...checkOutputPluginOption(normalizePlugins(normalizedOutputPlugins, ANONYMOUS_OUTPUT_PLUGIN_PREFIX), onLog)];
	const parallelPluginInitResult = await initializeParallelPlugins(plugins);
	try {
		const bindingInputOptions = bindingifyInputOptions(plugins, inputOptions, outputOptions, normalizedOutputPlugins, onLog, logLevel, watchMode);
		const bindingOutputOptions = bindingifyOutputOptions(outputOptions);
		return {
			bundlerOptions: {
				inputOptions: bindingInputOptions,
				outputOptions: bindingOutputOptions,
				parallelPluginsRegistry: parallelPluginInitResult?.registry
			},
			inputOptions,
			onLog,
			stopWorkers: parallelPluginInitResult?.stopWorkers
		};
	} catch (e$1$1) {
		await parallelPluginInitResult?.stopWorkers();
		throw e$1$1;
	}
}
Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose");
var RolldownBuild = class RolldownBuild$1 {
	#inputOptions;
	#bundler;
	#bundlerImpl;
	static asyncRuntimeShutdown = false;
	constructor(inputOptions) {
		this.#inputOptions = inputOptions;
		this.#bundler = new BindingBundler();
	}
	get closed() {
		return this.#bundlerImpl?.impl.closed ?? true;
	}
	async #getBundlerWithStopWorker(outputOptions) {
		if (this.#bundlerImpl) await this.#bundlerImpl.stopWorkers?.();
		const option = await createBundlerOptions(this.#inputOptions, outputOptions, false);
		if (RolldownBuild$1.asyncRuntimeShutdown) startAsyncRuntime();
		try {
			return this.#bundlerImpl = {
				impl: this.#bundler.createImpl(option.bundlerOptions),
				stopWorkers: option.stopWorkers,
				shutdown: () => {
					shutdownAsyncRuntime();
					RolldownBuild$1.asyncRuntimeShutdown = true;
				}
			};
		} catch (e$1$1) {
			await option.stopWorkers?.();
			throw e$1$1;
		}
	}
	async scan() {
		const { impl } = await this.#getBundlerWithStopWorker({});
		const output = await impl.scan();
		return handleOutputErrors(output);
	}
	async generate(outputOptions = {}) {
		validateOption("output", outputOptions);
		const { impl } = await this.#getBundlerWithStopWorker(outputOptions);
		const output = await impl.generate();
		return transformToRollupOutput(output);
	}
	async write(outputOptions = {}) {
		validateOption("output", outputOptions);
		const { impl } = await this.#getBundlerWithStopWorker(outputOptions);
		const output = await impl.write();
		return transformToRollupOutput(output);
	}
	async close() {
		if (this.#bundlerImpl) {
			await this.#bundlerImpl.stopWorkers?.();
			await this.#bundlerImpl.impl.close();
			this.#bundlerImpl.shutdown();
			this.#bundlerImpl = void 0;
		}
	}
	async [Symbol.asyncDispose]() {
		await this.close();
	}
	get watchFiles() {
		return this.#bundlerImpl?.impl.getWatchFiles() ?? Promise.resolve([]);
	}
};
const rolldown = async (input) => {
	validateOption("input", input);
	const inputOptions = await PluginDriver.callOptionsHook(input);
	return new RolldownBuild(inputOptions);
};
var WatcherEmitter = class {
	listeners = /* @__PURE__ */ new Map();
	timer;
	constructor() {
		this.timer = setInterval(() => {}, 1e9);
	}
	on(event, listener) {
		const listeners = this.listeners.get(event);
		if (listeners) listeners.push(listener);
		else this.listeners.set(event, [listener]);
		return this;
	}
	off(event, listener) {
		const listeners = this.listeners.get(event);
		if (listeners) {
			const index = listeners.indexOf(listener);
			if (index !== -1) listeners.splice(index, 1);
		}
		return this;
	}
	clear(event) {
		if (this.listeners.has(event)) this.listeners.delete(event);
	}
	async onEvent(event) {
		const listeners = this.listeners.get(event.eventKind());
		if (listeners) switch (event.eventKind()) {
			case "close":
			case "restart":
				for (const listener of listeners) await listener();
				break;
			case "event":
				for (const listener of listeners) {
					const code$1 = event.bundleEventKind();
					switch (code$1) {
						case "BUNDLE_END":
							const { duration, output, result } = event.bundleEndData();
							await listener({
								code: "BUNDLE_END",
								duration,
								output: [output],
								result
							});
							break;
						case "ERROR":
							const data = event.bundleErrorData();
							await listener({
								code: "ERROR",
								error: normalizeErrors(data.error),
								result: data.result
							});
							break;
						default:
							await listener({ code: code$1 });
							break;
					}
				}
				break;
			case "change":
				for (const listener of listeners) {
					const { path: path$1, kind } = event.watchChangeData();
					await listener(path$1, { event: kind });
				}
				break;
			default: throw new Error(`Unknown event: ${event}`);
		}
	}
	async close() {
		clearInterval(this.timer);
	}
};
var Watcher = class {
	closed;
	inner;
	emitter;
	stopWorkers;
	constructor(emitter, inner, stopWorkers) {
		this.closed = false;
		this.inner = inner;
		this.emitter = emitter;
		const originClose = emitter.close.bind(emitter);
		emitter.close = async () => {
			await this.close();
			originClose();
		};
		this.stopWorkers = stopWorkers;
	}
	async close() {
		if (this.closed) return;
		this.closed = true;
		for (const stop of this.stopWorkers) await stop?.();
		await this.inner.close();
		shutdownAsyncRuntime();
	}
	start() {
		process.nextTick(() => this.inner.start(this.emitter.onEvent.bind(this.emitter)));
	}
};
async function createWatcher(emitter, input) {
	const options = arraify(input);
	const bundlerOptions = await Promise.all(options.map((option) => arraify(option.output || {}).map(async (output) => {
		const inputOptions = await PluginDriver.callOptionsHook(option, true);
		return createBundlerOptions(inputOptions, output, true);
	})).flat());
	const notifyOptions = getValidNotifyOption(bundlerOptions);
	const bindingWatcher = new BindingWatcher(bundlerOptions.map((option) => option.bundlerOptions), notifyOptions);
	new Watcher(emitter, bindingWatcher, bundlerOptions.map((option) => option.stopWorkers)).start();
}
function getValidNotifyOption(bundlerOptions) {
	let result;
	for (const option of bundlerOptions) if (option.inputOptions.watch) {
		const notifyOption = option.inputOptions.watch.notify;
		if (notifyOption) if (result) {
			option.onLog(LOG_LEVEL_WARN, logMultiplyNotifyOption());
			return result;
		} else result = notifyOption;
	}
}
const watch = (input) => {
	const emitter = new WatcherEmitter();
	createWatcher(emitter, input);
	return emitter;
};
const VERSION = version;

//#endregion
export { BindingDevEngine, BuiltinPlugin, PluginDriver, RolldownBuild, VERSION as VERSION$2, createBundlerOptions, makeBuiltinPluginCallable, normalizedStringOrRegex, parseAst as parseAst$1, parseAstAsync as parseAstAsync$1, rolldown, transform, watch };