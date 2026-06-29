import { __export } from "./chunk-B_1218FY.js";
import "./supports-color-BxGNy1vr.js";
import "./dist-BX6FL6Jv.js";
import { parseAst, parseAstAsync } from "./parseAst-qYmeHQ-e.js";
import { BuildEnvironment$1 as BuildEnvironment, DEFAULT_CLIENT_CONDITIONS$1 as DEFAULT_CLIENT_CONDITIONS, DEFAULT_CLIENT_MAIN_FIELDS$1 as DEFAULT_CLIENT_MAIN_FIELDS, DEFAULT_SERVER_CONDITIONS$1 as DEFAULT_SERVER_CONDITIONS, DEFAULT_SERVER_MAIN_FIELDS$1 as DEFAULT_SERVER_MAIN_FIELDS, DevEnvironment$1 as DevEnvironment, VERSION$1 as VERSION, arraify, build, buildErrorMessage$1 as buildErrorMessage, createBuilder, createFilter$1, createIdResolver$1 as createIdResolver, createLogger$2 as createLogger, createRunnableDevEnvironment$1 as createRunnableDevEnvironment, createServer, createServerHotChannel$1 as createServerHotChannel, createServerModuleRunner$1 as createServerModuleRunner, createServerModuleRunnerTransport$1 as createServerModuleRunnerTransport, defaultAllowedOrigins$1 as defaultAllowedOrigins, defineConfig, fetchModule$1 as fetchModule, formatPostcssSourceMap$1 as formatPostcssSourceMap, import_main, isFileLoadingAllowed$1 as isFileLoadingAllowed, isFileServingAllowed, isInNodeModules$1, isRunnableDevEnvironment, loadConfigFromFile$1 as loadConfigFromFile, loadEnv$1 as loadEnv, mergeAlias$1 as mergeAlias, mergeConfig$1 as mergeConfig, normalizePath$3, optimizeDeps, perEnvironmentPlugin$1 as perEnvironmentPlugin, perEnvironmentState$1 as perEnvironmentState, preprocessCSS, preview, resolveConfig$1 as resolveConfig, resolveEnvPrefix$1 as resolveEnvPrefix, rollupVersion$1 as rollupVersion, runnerImport$1 as runnerImport, searchForWorkspaceRoot$1 as searchForWorkspaceRoot, send$1, sortUserPlugins$1 as sortUserPlugins, ssrTransform$1 as ssrTransform, transformWithEsbuild$1 as transformWithEsbuild } from "./dep-Dm0c1Wj2-DcLQSMdK.js";
import { dirname as dirname$1, join as join$1 } from "node:path";
import { readFileSync as readFileSync$1 } from "node:fs";
import { fileURLToPath as fileURLToPath$1 } from "node:url";

//#region node_modules/vite/dist/node/index.js
var node_exports = {};
__export(node_exports, {
	BuildEnvironment: () => BuildEnvironment,
	DevEnvironment: () => DevEnvironment,
	build: () => build,
	buildErrorMessage: () => buildErrorMessage,
	createBuilder: () => createBuilder,
	createFetchableDevEnvironment: () => createFetchableDevEnvironment,
	createFilter: () => createFilter$1,
	createIdResolver: () => createIdResolver,
	createLogger: () => createLogger,
	createRunnableDevEnvironment: () => createRunnableDevEnvironment,
	createServer: () => createServer,
	createServerHotChannel: () => createServerHotChannel,
	createServerModuleRunner: () => createServerModuleRunner,
	createServerModuleRunnerTransport: () => createServerModuleRunnerTransport,
	defaultAllowedOrigins: () => defaultAllowedOrigins,
	defaultClientConditions: () => DEFAULT_CLIENT_CONDITIONS,
	defaultClientMainFields: () => DEFAULT_CLIENT_MAIN_FIELDS,
	defaultServerConditions: () => DEFAULT_SERVER_CONDITIONS,
	defaultServerMainFields: () => DEFAULT_SERVER_MAIN_FIELDS,
	defineConfig: () => defineConfig,
	esbuildVersion: () => import_main.version,
	fetchModule: () => fetchModule,
	formatPostcssSourceMap: () => formatPostcssSourceMap,
	isCSSRequest: () => isCSSRequest,
	isFetchableDevEnvironment: () => isFetchableDevEnvironment,
	isFileLoadingAllowed: () => isFileLoadingAllowed,
	isFileServingAllowed: () => isFileServingAllowed,
	isRunnableDevEnvironment: () => isRunnableDevEnvironment,
	loadConfigFromFile: () => loadConfigFromFile,
	loadEnv: () => loadEnv,
	mergeAlias: () => mergeAlias,
	mergeConfig: () => mergeConfig,
	moduleRunnerTransform: () => ssrTransform,
	normalizePath: () => normalizePath$3,
	optimizeDeps: () => optimizeDeps,
	parseAst: () => parseAst,
	parseAstAsync: () => parseAstAsync,
	perEnvironmentPlugin: () => perEnvironmentPlugin,
	perEnvironmentState: () => perEnvironmentState,
	preprocessCSS: () => preprocessCSS,
	preview: () => preview,
	resolveConfig: () => resolveConfig,
	resolveEnvPrefix: () => resolveEnvPrefix,
	rollupVersion: () => rollupVersion,
	runnerImport: () => runnerImport,
	searchForWorkspaceRoot: () => searchForWorkspaceRoot,
	send: () => send$1,
	sortUserPlugins: () => sortUserPlugins,
	splitVendorChunk: () => splitVendorChunk,
	splitVendorChunkPlugin: () => splitVendorChunkPlugin,
	transformWithEsbuild: () => transformWithEsbuild,
	version: () => VERSION
});
const CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;
const isCSSRequest = (request) => CSS_LANGS_RE.test(request);
var SplitVendorChunkCache = class {
	cache;
	constructor() {
		this.cache = /* @__PURE__ */ new Map();
	}
	reset() {
		this.cache = /* @__PURE__ */ new Map();
	}
};
function splitVendorChunk(options = {}) {
	const cache = options.cache ?? new SplitVendorChunkCache();
	return (id, { getModuleInfo }) => {
		if (isInNodeModules$1(id) && !isCSSRequest(id) && staticImportedByEntry(id, getModuleInfo, cache.cache)) return "vendor";
	};
}
function staticImportedByEntry(id, getModuleInfo, cache, importStack = []) {
	if (cache.has(id)) return cache.get(id);
	if (importStack.includes(id)) {
		cache.set(id, false);
		return false;
	}
	const mod = getModuleInfo(id);
	if (!mod) {
		cache.set(id, false);
		return false;
	}
	if (mod.isEntry) {
		cache.set(id, true);
		return true;
	}
	const someImporterIs = mod.importers.some((importer) => staticImportedByEntry(importer, getModuleInfo, cache, importStack.concat(id)));
	cache.set(id, someImporterIs);
	return someImporterIs;
}
function splitVendorChunkPlugin() {
	const caches = [];
	function createSplitVendorChunk(output, config) {
		const cache = new SplitVendorChunkCache();
		caches.push(cache);
		const build$1 = config.build ?? {};
		const format$2 = output.format;
		if (!build$1.ssr && !build$1.lib && format$2 !== "umd" && format$2 !== "iife") return splitVendorChunk({ cache });
	}
	return {
		name: "vite:split-vendor-chunk",
		config(config) {
			let outputs = config.build?.rollupOptions?.output;
			if (outputs) {
				outputs = arraify(outputs);
				for (const output of outputs) {
					const viteManualChunks = createSplitVendorChunk(output, config);
					if (viteManualChunks) if (output.manualChunks) if (typeof output.manualChunks === "function") {
						const userManualChunks = output.manualChunks;
						output.manualChunks = (id, api) => {
							return userManualChunks(id, api) ?? viteManualChunks(id, api);
						};
					} else console.warn("(!) the `splitVendorChunk` plugin doesn't have any effect when using the object form of `build.rollupOptions.output.manualChunks`. Consider using the function form instead.");
					else output.manualChunks = viteManualChunks;
				}
			} else return { build: { rollupOptions: { output: { manualChunks: createSplitVendorChunk({}, config) } } } };
		},
		buildStart() {
			caches.forEach((cache) => cache.reset());
		}
	};
}
function createFetchableDevEnvironment(name, config, context) {
	if (typeof Request === "undefined" || typeof Response === "undefined") throw new TypeError("FetchableDevEnvironment requires a global `Request` and `Response` object.");
	if (!context.handleRequest) throw new TypeError("FetchableDevEnvironment requires a `handleRequest` method during initialisation.");
	return new FetchableDevEnvironment(name, config, context);
}
function isFetchableDevEnvironment(environment) {
	return environment instanceof FetchableDevEnvironment;
}
var FetchableDevEnvironment = class extends DevEnvironment {
	_handleRequest;
	constructor(name, config, context) {
		super(name, config, context);
		this._handleRequest = context.handleRequest;
	}
	async dispatchFetch(request) {
		if (!(request instanceof Request)) throw new TypeError("FetchableDevEnvironment `dispatchFetch` must receive a `Request` object.");
		const response = await this._handleRequest(request);
		if (!(response instanceof Response)) throw new TypeError("FetchableDevEnvironment `context.handleRequest` must return a `Response` object.");
		return response;
	}
};

//#endregion
//#region node_modules/@rolldown/pluginutils/dist/index.js
/**
* Constructs a RegExp that matches the exact string specified.
*
* This is useful for plugin hook filters.
*
* @param str the string to match.
* @param flags flags for the RegExp.
*
* @example
* ```ts
* import { exactRegex } from '@rolldown/pluginutils';
* const plugin = {
*   name: 'plugin',
*   resolveId: {
*     filter: { id: exactRegex('foo') },
*     handler(id) {} // will only be called for `foo`
*   }
* }
* ```
*/
function exactRegex(str, flags) {
	return new RegExp(`^${escapeRegex(str)}$`, flags);
}
const escapeRegexRE = /[-/\\^$*+?.()|[\]{}]/g;
function escapeRegex(str) {
	return str.replace(escapeRegexRE, "\\$&");
}
function makeIdFiltersToMatchWithQuery(input) {
	if (!Array.isArray(input)) return makeIdFilterToMatchWithQuery(input);
	return input.map((i) => makeIdFilterToMatchWithQuery(i));
}
function makeIdFilterToMatchWithQuery(input) {
	if (typeof input === "string") return `${input}{?*,}`;
	return makeRegexIdFilterToMatchWithQuery(input);
}
function makeRegexIdFilterToMatchWithQuery(input) {
	return new RegExp(input.source.replace(/(?<!\\)\$/g, "(?:\\?.*)?$"), input.flags);
}

//#endregion
//#region node_modules/@vitejs/plugin-react/dist/index.js
const runtimePublicPath = "/@react-refresh";
const reactCompRE = /extends\s+(?:React\.)?(?:Pure)?Component/;
const refreshContentRE = /\$RefreshReg\$\(/;
const preambleCode = `import { injectIntoGlobalHook } from "__BASE__${runtimePublicPath.slice(1)}";
injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;`;
const getPreambleCode = (base) => preambleCode.replace("__BASE__", base);
const avoidSourceMapOption = Symbol();
function addRefreshWrapper(code, map, pluginName, id, reactRefreshHost = "") {
	const hasRefresh = refreshContentRE.test(code);
	const onlyReactComp = !hasRefresh && reactCompRE.test(code);
	const normalizedMap = map === avoidSourceMapOption ? null : map;
	if (!hasRefresh && !onlyReactComp) return {
		code,
		map: normalizedMap
	};
	const avoidSourceMap = map === avoidSourceMapOption;
	const newMap = typeof normalizedMap === "string" ? JSON.parse(normalizedMap) : normalizedMap;
	let newCode = code;
	if (hasRefresh) {
		const refreshHead = removeLineBreaksIfNeeded(`let prevRefreshReg;
let prevRefreshSig;

if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "${pluginName} can't detect preamble. Something is wrong."
    );
  }

  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg(${JSON.stringify(id)});
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}

`, avoidSourceMap);
		newCode = `${refreshHead}${newCode}

if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
`;
		if (newMap) newMap.mappings = ";".repeat(16) + newMap.mappings;
	}
	const sharedHead = removeLineBreaksIfNeeded(`import * as RefreshRuntime from "${reactRefreshHost}${runtimePublicPath}";
const inWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;

`, avoidSourceMap);
	newCode = `${sharedHead}${newCode}

if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh(${JSON.stringify(id)}, currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate(${JSON.stringify(id)}, currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
`;
	if (newMap) newMap.mappings = ";;;" + newMap.mappings;
	return {
		code: newCode,
		map: newMap
	};
}
function removeLineBreaksIfNeeded(code, enabled) {
	return enabled ? code.replace(/\n/g, "") : code;
}
const silenceUseClientWarning = (userConfig) => ({ rollupOptions: { onwarn(warning, defaultHandler) {
	var _userConfig$build;
	if (warning.code === "MODULE_LEVEL_DIRECTIVE" && (warning.message.includes("use client") || warning.message.includes("use server"))) return;
	if (warning.code === "SOURCEMAP_ERROR" && warning.message.includes("resolve original location") && warning.pos === 0) return;
	if ((_userConfig$build = userConfig.build) === null || _userConfig$build === void 0 || (_userConfig$build = _userConfig$build.rollupOptions) === null || _userConfig$build === void 0 ? void 0 : _userConfig$build.onwarn) userConfig.build.rollupOptions.onwarn(warning, defaultHandler);
	else defaultHandler(warning);
} } });
const _dirname = dirname$1(fileURLToPath$1(import.meta.url));
const refreshRuntimePath = join$1(_dirname, "refresh-runtime.js");
let babel;
async function loadBabel() {
	if (!babel) babel = await import("./lib-Dn62puOO.js");
	return babel;
}
const defaultIncludeRE = /\.[tj]sx?$/;
const tsRE = /\.tsx?$/;
function viteReact(opts = {}) {
	var _opts$babel;
	const include = opts.include ?? defaultIncludeRE;
	const exclude = opts.exclude;
	const filter = createFilter$1(include, exclude);
	const jsxImportSource = opts.jsxImportSource ?? "react";
	const jsxImportRuntime = `${jsxImportSource}/jsx-runtime`;
	const jsxImportDevRuntime = `${jsxImportSource}/jsx-dev-runtime`;
	let runningInVite = false;
	let isProduction = true;
	let projectRoot = process.cwd();
	let skipFastRefresh = true;
	let runPluginOverrides;
	let staticBabelOptions;
	const importReactRE = /\bimport\s+(?:\*\s+as\s+)?React\b/;
	const viteBabel = {
		name: "vite:react-babel",
		enforce: "pre",
		config() {
			if (opts.jsxRuntime === "classic") if ("rolldownVersion" in node_exports) return { oxc: { jsx: {
				runtime: "classic",
				development: false
			} } };
			else return { esbuild: { jsx: "transform" } };
			else return {
				esbuild: {
					jsx: "automatic",
					jsxImportSource: opts.jsxImportSource
				},
				optimizeDeps: "rolldownVersion" in node_exports ? { rollupOptions: { jsx: { mode: "automatic" } } } : { esbuildOptions: { jsx: "automatic" } }
			};
		},
		configResolved(config) {
			runningInVite = true;
			projectRoot = config.root;
			isProduction = config.isProduction;
			skipFastRefresh = isProduction || config.command === "build" || config.server.hmr === false;
			if ("jsxPure" in opts) config.logger.warnOnce("[@vitejs/plugin-react] jsxPure was removed. You can configure esbuild.jsxSideEffects directly.");
			const hooks = config.plugins.map((plugin) => {
				var _plugin$api;
				return (_plugin$api = plugin.api) === null || _plugin$api === void 0 ? void 0 : _plugin$api.reactBabel;
			}).filter(defined);
			if ("rolldownVersion" in node_exports && !opts.babel && !hooks.length && !opts.disableOxcRecommendation) config.logger.warn("[vite:react-babel] We recommend switching to `@vitejs/plugin-react-oxc` for improved performance. More information at https://vite.dev/rolldown");
			if (hooks.length > 0) runPluginOverrides = (babelOptions, context) => {
				hooks.forEach((hook) => hook(babelOptions, context, config));
			};
			else if (typeof opts.babel !== "function") {
				staticBabelOptions = createBabelOptions(opts.babel);
				if (canSkipBabel(staticBabelOptions.plugins, staticBabelOptions) && skipFastRefresh && (opts.jsxRuntime === "classic" ? isProduction : true)) delete viteBabel.transform;
			}
		},
		options(options) {
			if (!runningInVite) {
				options.jsx = {
					mode: opts.jsxRuntime,
					importSource: opts.jsxImportSource
				};
				return options;
			}
		},
		transform: {
			filter: { id: {
				include: makeIdFiltersToMatchWithQuery(include),
				exclude: [...exclude ? makeIdFiltersToMatchWithQuery(ensureArray(exclude)) : [], /\/node_modules\//]
			} },
			async handler(code, id, options) {
				if (id.includes("/node_modules/")) return;
				const [filepath] = id.split("?");
				if (!filter(filepath)) return;
				const ssr = (options === null || options === void 0 ? void 0 : options.ssr) === true;
				const babelOptions = (() => {
					if (staticBabelOptions) return staticBabelOptions;
					const newBabelOptions = createBabelOptions(typeof opts.babel === "function" ? opts.babel(id, { ssr }) : opts.babel);
					runPluginOverrides === null || runPluginOverrides === void 0 || runPluginOverrides(newBabelOptions, {
						id,
						ssr
					});
					return newBabelOptions;
				})();
				const plugins = [...babelOptions.plugins];
				const isJSX = filepath.endsWith("x");
				const useFastRefresh = !skipFastRefresh && !ssr && (isJSX || (opts.jsxRuntime === "classic" ? importReactRE.test(code) : code.includes(jsxImportDevRuntime) || code.includes(jsxImportRuntime)));
				if (useFastRefresh) plugins.push([await loadPlugin("react-refresh/babel"), { skipEnvCheck: true }]);
				if (opts.jsxRuntime === "classic" && isJSX) {
					if (!isProduction) plugins.push(await loadPlugin("@babel/plugin-transform-react-jsx-self"), await loadPlugin("@babel/plugin-transform-react-jsx-source"));
				}
				if (canSkipBabel(plugins, babelOptions)) return;
				const parserPlugins = [...babelOptions.parserOpts.plugins];
				if (!filepath.endsWith(".ts")) parserPlugins.push("jsx");
				if (tsRE.test(filepath)) parserPlugins.push("typescript");
				const babel$1 = await loadBabel();
				const result = await babel$1.transformAsync(code, {
					...babelOptions,
					root: projectRoot,
					filename: id,
					sourceFileName: filepath,
					retainLines: getReactCompilerPlugin(plugins) != null ? false : !isProduction && isJSX && opts.jsxRuntime !== "classic",
					parserOpts: {
						...babelOptions.parserOpts,
						sourceType: "module",
						allowAwaitOutsideFunction: true,
						plugins: parserPlugins
					},
					generatorOpts: {
						...babelOptions.generatorOpts,
						importAttributesKeyword: "with",
						decoratorsBeforeExport: true
					},
					plugins,
					sourceMaps: true
				});
				if (result) {
					if (!useFastRefresh) return {
						code: result.code,
						map: result.map
					};
					return addRefreshWrapper(result.code, result.map, "@vitejs/plugin-react", id, opts.reactRefreshHost);
				}
			}
		}
	};
	const dependencies = [
		"react",
		"react-dom",
		jsxImportDevRuntime,
		jsxImportRuntime
	];
	const staticBabelPlugins = typeof opts.babel === "object" ? ((_opts$babel = opts.babel) === null || _opts$babel === void 0 ? void 0 : _opts$babel.plugins) ?? [] : [];
	const reactCompilerPlugin = getReactCompilerPlugin(staticBabelPlugins);
	if (reactCompilerPlugin != null) {
		const reactCompilerRuntimeModule = getReactCompilerRuntimeModule(reactCompilerPlugin);
		dependencies.push(reactCompilerRuntimeModule);
	}
	const viteReactRefresh = {
		name: "vite:react-refresh",
		enforce: "pre",
		config: (userConfig) => ({
			build: silenceUseClientWarning(userConfig),
			optimizeDeps: { include: dependencies },
			resolve: { dedupe: ["react", "react-dom"] }
		}),
		resolveId: {
			filter: { id: exactRegex(runtimePublicPath) },
			handler(id) {
				if (id === runtimePublicPath) return id;
			}
		},
		load: {
			filter: { id: exactRegex(runtimePublicPath) },
			handler(id) {
				if (id === runtimePublicPath) return readFileSync$1(refreshRuntimePath, "utf-8").replace(/__README_URL__/g, "https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react");
			}
		},
		transformIndexHtml(_, config) {
			if (!skipFastRefresh) return [{
				tag: "script",
				attrs: { type: "module" },
				children: getPreambleCode(config.server.config.base)
			}];
		}
	};
	return [viteBabel, viteReactRefresh];
}
viteReact.preambleCode = preambleCode;
function canSkipBabel(plugins, babelOptions) {
	return !(plugins.length || babelOptions.presets.length || babelOptions.configFile || babelOptions.babelrc);
}
const loadedPlugin = /* @__PURE__ */ new Map();
function loadPlugin(path$2) {
	const cached = loadedPlugin.get(path$2);
	if (cached) return cached;
	const promise = import(path$2).then((module) => {
		const value = module.default || module;
		loadedPlugin.set(path$2, value);
		return value;
	});
	loadedPlugin.set(path$2, promise);
	return promise;
}
function createBabelOptions(rawOptions) {
	var _babelOptions$parserO;
	const babelOptions = {
		babelrc: false,
		configFile: false,
		...rawOptions
	};
	babelOptions.plugins || (babelOptions.plugins = []);
	babelOptions.presets || (babelOptions.presets = []);
	babelOptions.overrides || (babelOptions.overrides = []);
	babelOptions.parserOpts || (babelOptions.parserOpts = {});
	(_babelOptions$parserO = babelOptions.parserOpts).plugins || (_babelOptions$parserO.plugins = []);
	return babelOptions;
}
function defined(value) {
	return value !== void 0;
}
function getReactCompilerPlugin(plugins) {
	return plugins.find((p) => p === "babel-plugin-react-compiler" || Array.isArray(p) && p[0] === "babel-plugin-react-compiler");
}
function getReactCompilerRuntimeModule(plugin) {
	let moduleName = "react/compiler-runtime";
	if (Array.isArray(plugin)) {
		var _plugin$, _plugin$2, _plugin$3;
		if (((_plugin$ = plugin[1]) === null || _plugin$ === void 0 ? void 0 : _plugin$.target) === "17" || ((_plugin$2 = plugin[1]) === null || _plugin$2 === void 0 ? void 0 : _plugin$2.target) === "18") moduleName = "react-compiler-runtime";
		else if (typeof ((_plugin$3 = plugin[1]) === null || _plugin$3 === void 0 ? void 0 : _plugin$3.runtimeModule) === "string") {
			var _plugin$4;
			moduleName = (_plugin$4 = plugin[1]) === null || _plugin$4 === void 0 ? void 0 : _plugin$4.runtimeModule;
		}
	}
	return moduleName;
}
function ensureArray(value) {
	return Array.isArray(value) ? value : [value];
}

//#endregion
export { viteReact as default };