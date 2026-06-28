import "./supports-color-Dby6C2nt.js";
import "./dist-DAzYJBON.js";
import "./parseAst-CvBqSlpx.js";
import { getDefaultExportFromCjs } from "./dep-Dm0c1Wj2-ANqgf0oC.js";
import { lib } from "./dep-3RmXg9uo-CqDA8_qc.js";
import path$1 from "path";
import { createRequire } from "node:module";

//#region node_modules/vite/dist/node/chunks/dep-CV-fz3CQ.js
const __require = createRequire(import.meta.url);
function _mergeNamespaces(n, m) {
	for (var i = 0; i < m.length; i++) {
		var e = m[i];
		if (typeof e !== "string" && !Array.isArray(e)) {
			for (var k in e) if (k !== "default" && !(k in n)) n[k] = e[k];
		}
	}
	return n;
}
var formatImportPrelude$2 = function formatImportPrelude$3(layer, media, supports) {
	const parts = [];
	if (typeof layer !== "undefined") {
		let layerParams = "layer";
		if (layer) layerParams = `layer(${layer})`;
		parts.push(layerParams);
	}
	if (typeof supports !== "undefined") parts.push(`supports(${supports})`);
	if (typeof media !== "undefined") parts.push(media);
	return parts.join(" ");
};
const formatImportPrelude$1 = formatImportPrelude$2;
var base64EncodedImport = function base64EncodedConditionalImport$1(prelude, conditions) {
	conditions.reverse();
	const first = conditions.pop();
	let params = `${prelude} ${formatImportPrelude$1(first.layer, first.media, first.supports)}`;
	for (const condition of conditions) params = `'data:text/css;base64,${Buffer.from(`@import ${params}`).toString("base64")}' ${formatImportPrelude$1(condition.layer, condition.media, condition.supports)}`;
	return params;
};
const base64EncodedConditionalImport = base64EncodedImport;
var applyConditions$1 = function applyConditions$2(bundle, atRule) {
	bundle.forEach((stmt) => {
		if (stmt.type === "charset" || stmt.type === "warning" || !stmt.conditions?.length) return;
		if (stmt.type === "import") {
			stmt.node.params = base64EncodedConditionalImport(stmt.fullUri, stmt.conditions);
			return;
		}
		const { nodes } = stmt;
		const { parent } = nodes[0];
		const atRules = [];
		for (const condition of stmt.conditions) {
			if (typeof condition.media !== "undefined") {
				const mediaNode = atRule({
					name: "media",
					params: condition.media,
					source: parent.source
				});
				atRules.push(mediaNode);
			}
			if (typeof condition.supports !== "undefined") {
				const supportsNode = atRule({
					name: "supports",
					params: `(${condition.supports})`,
					source: parent.source
				});
				atRules.push(supportsNode);
			}
			if (typeof condition.layer !== "undefined") {
				const layerNode = atRule({
					name: "layer",
					params: condition.layer,
					source: parent.source
				});
				atRules.push(layerNode);
			}
		}
		const outerAtRule = atRules.shift();
		const innerAtRule = atRules.reduce((previous, next) => {
			previous.append(next);
			return next;
		}, outerAtRule);
		parent.insertBefore(nodes[0], outerAtRule);
		nodes.forEach((node) => {
			node.parent = void 0;
		});
		nodes[0].raws.before = nodes[0].raws.before || "\n";
		innerAtRule.append(nodes);
		stmt.type = "nodes";
		stmt.nodes = [outerAtRule];
		delete stmt.node;
	});
};
var applyRaws$1 = function applyRaws$2(bundle) {
	bundle.forEach((stmt, index$2) => {
		if (index$2 === 0) return;
		if (stmt.parent) {
			const { before } = stmt.parent.node.raws;
			if (stmt.type === "nodes") stmt.nodes[0].raws.before = before;
			else stmt.node.raws.before = before;
		} else if (stmt.type === "nodes") stmt.nodes[0].raws.before = stmt.nodes[0].raws.before || "\n";
	});
};
var applyStyles$1 = function applyStyles$2(bundle, styles) {
	styles.nodes = [];
	bundle.forEach((stmt) => {
		if (["charset", "import"].includes(stmt.type)) {
			stmt.node.parent = void 0;
			styles.append(stmt.node);
		} else if (stmt.type === "nodes") stmt.nodes.forEach((node) => {
			node.parent = void 0;
			styles.append(node);
		});
	});
};
const anyDataURLRegexp = /^data:text\/css(?:;(base64|plain))?,/i;
const base64DataURLRegexp = /^data:text\/css;base64,/i;
const plainDataURLRegexp = /^data:text\/css;plain,/i;
function isValid(url) {
	return anyDataURLRegexp.test(url);
}
function contents(url) {
	if (base64DataURLRegexp.test(url)) return Buffer.from(url.slice(21), "base64").toString();
	if (plainDataURLRegexp.test(url)) return decodeURIComponent(url.slice(20));
	return decodeURIComponent(url.slice(14));
}
var dataUrl = {
	isValid,
	contents
};
const valueParser = lib;
const { stringify } = valueParser;
var parseStatements$1 = function parseStatements$2(result, styles, conditions, from) {
	const statements = [];
	let nodes = [];
	styles.each((node) => {
		let stmt;
		if (node.type === "atrule") {
			if (node.name === "import") stmt = parseImport(result, node, conditions, from);
			else if (node.name === "charset") stmt = parseCharset(result, node, conditions, from);
		}
		if (stmt) {
			if (nodes.length) {
				statements.push({
					type: "nodes",
					nodes,
					conditions: [...conditions],
					from
				});
				nodes = [];
			}
			statements.push(stmt);
		} else nodes.push(node);
	});
	if (nodes.length) statements.push({
		type: "nodes",
		nodes,
		conditions: [...conditions],
		from
	});
	return statements;
};
function parseCharset(result, atRule, conditions, from) {
	if (atRule.prev()) return result.warn("@charset must precede all other statements", { node: atRule });
	return {
		type: "charset",
		node: atRule,
		conditions: [...conditions],
		from
	};
}
function parseImport(result, atRule, conditions, from) {
	let prev = atRule.prev();
	if (prev) do {
		if (prev.type === "comment" || prev.type === "atrule" && prev.name === "import") {
			prev = prev.prev();
			continue;
		}
		break;
	} while (prev);
	if (prev) do {
		if (prev.type === "comment" || prev.type === "atrule" && (prev.name === "charset" || prev.name === "layer" && !prev.nodes)) {
			prev = prev.prev();
			continue;
		}
		return result.warn("@import must precede all other statements (besides @charset or empty @layer)", { node: atRule });
	} while (prev);
	if (atRule.nodes) return result.warn("It looks like you didn't end your @import statement correctly. Child nodes are attached to it.", { node: atRule });
	const params = valueParser(atRule.params).nodes;
	const stmt = {
		type: "import",
		uri: "",
		fullUri: "",
		node: atRule,
		conditions: [...conditions],
		from
	};
	let layer;
	let media;
	let supports;
	for (let i = 0; i < params.length; i++) {
		const node = params[i];
		if (node.type === "space" || node.type === "comment") continue;
		if (node.type === "string") {
			if (stmt.uri) return result.warn(`Multiple url's in '${atRule.toString()}'`, { node: atRule });
			if (!node.value) return result.warn(`Unable to find uri in '${atRule.toString()}'`, { node: atRule });
			stmt.uri = node.value;
			stmt.fullUri = stringify(node);
			continue;
		}
		if (node.type === "function" && /^url$/i.test(node.value)) {
			if (stmt.uri) return result.warn(`Multiple url's in '${atRule.toString()}'`, { node: atRule });
			if (!node.nodes?.[0]?.value) return result.warn(`Unable to find uri in '${atRule.toString()}'`, { node: atRule });
			stmt.uri = node.nodes[0].value;
			stmt.fullUri = stringify(node);
			continue;
		}
		if (!stmt.uri) return result.warn(`Unable to find uri in '${atRule.toString()}'`, { node: atRule });
		if ((node.type === "word" || node.type === "function") && /^layer$/i.test(node.value)) {
			if (typeof layer !== "undefined") return result.warn(`Multiple layers in '${atRule.toString()}'`, { node: atRule });
			if (typeof supports !== "undefined") return result.warn(`layers must be defined before support conditions in '${atRule.toString()}'`, { node: atRule });
			if (node.nodes) layer = stringify(node.nodes);
			else layer = "";
			continue;
		}
		if (node.type === "function" && /^supports$/i.test(node.value)) {
			if (typeof supports !== "undefined") return result.warn(`Multiple support conditions in '${atRule.toString()}'`, { node: atRule });
			supports = stringify(node.nodes);
			continue;
		}
		media = stringify(params.slice(i));
		break;
	}
	if (!stmt.uri) return result.warn(`Unable to find uri in '${atRule.toString()}'`, { node: atRule });
	if (typeof media !== "undefined" || typeof layer !== "undefined" || typeof supports !== "undefined") stmt.conditions.push({
		layer,
		media,
		supports
	});
	return stmt;
}
const path$2 = path$1;
let sugarss;
var processContent$1 = function processContent$2(result, content, filename, options, postcss) {
	const { plugins } = options;
	const ext = path$2.extname(filename);
	const parserList = [];
	if (ext === ".sss") {
		if (!sugarss)
 /* c8 ignore next 3 */
		try {
			sugarss = __require("sugarss");
		} catch {}
		if (sugarss) return runPostcss(postcss, content, filename, plugins, [sugarss]);
	}
	if (result.opts.syntax?.parse) parserList.push(result.opts.syntax.parse);
	if (result.opts.parser) parserList.push(result.opts.parser);
	parserList.push(null);
	return runPostcss(postcss, content, filename, plugins, parserList);
};
function runPostcss(postcss, content, filename, plugins, parsers, index$2) {
	if (!index$2) index$2 = 0;
	return postcss(plugins).process(content, {
		from: filename,
		parser: parsers[index$2]
	}).catch((err) => {
		index$2++;
		if (index$2 === parsers.length) throw err;
		return runPostcss(postcss, content, filename, plugins, parsers, index$2);
	});
}
const path$1$1 = path$1;
const dataURL = dataUrl;
const parseStatements = parseStatements$1;
const processContent = processContent$1;
const resolveId$1 = (id) => id;
const formatImportPrelude = formatImportPrelude$2;
async function parseStyles$1(result, styles, options, state, conditions, from, postcss) {
	const statements = parseStatements(result, styles, conditions, from);
	for (const stmt of statements) {
		if (stmt.type !== "import" || !isProcessableURL(stmt.uri)) continue;
		if (options.filter && !options.filter(stmt.uri)) continue;
		await resolveImportId(result, stmt, options, state, postcss);
	}
	let charset;
	const imports = [];
	const bundle = [];
	function handleCharset(stmt) {
		if (!charset) charset = stmt;
		else if (stmt.node.params.toLowerCase() !== charset.node.params.toLowerCase()) throw stmt.node.error(`Incompatible @charset statements:
  ${stmt.node.params} specified in ${stmt.node.source.input.file}
  ${charset.node.params} specified in ${charset.node.source.input.file}`);
	}
	statements.forEach((stmt) => {
		if (stmt.type === "charset") handleCharset(stmt);
		else if (stmt.type === "import") if (stmt.children) stmt.children.forEach((child, index$2) => {
			if (child.type === "import") imports.push(child);
			else if (child.type === "charset") handleCharset(child);
			else bundle.push(child);
			if (index$2 === 0) child.parent = stmt;
		});
		else imports.push(stmt);
		else if (stmt.type === "nodes") bundle.push(stmt);
	});
	return charset ? [charset, ...imports.concat(bundle)] : imports.concat(bundle);
}
async function resolveImportId(result, stmt, options, state, postcss) {
	if (dataURL.isValid(stmt.uri)) {
		stmt.children = await loadImportContent(result, stmt, stmt.uri, options, state, postcss);
		return;
	} else if (dataURL.isValid(stmt.from.slice(-1))) throw stmt.node.error(`Unable to import '${stmt.uri}' from a stylesheet that is embedded in a data url`);
	const atRule = stmt.node;
	let sourceFile;
	if (atRule.source?.input?.file) sourceFile = atRule.source.input.file;
	const base = sourceFile ? path$1$1.dirname(atRule.source.input.file) : options.root;
	const paths = [await options.resolve(stmt.uri, base, options, atRule)].flat();
	const resolved = await Promise.all(paths.map((file) => {
		return !path$1$1.isAbsolute(file) ? resolveId$1(file) : file;
	}));
	resolved.forEach((file) => {
		result.messages.push({
			type: "dependency",
			plugin: "postcss-import",
			file,
			parent: sourceFile
		});
	});
	const importedContent = await Promise.all(resolved.map((file) => {
		return loadImportContent(result, stmt, file, options, state, postcss);
	}));
	stmt.children = importedContent.flat().filter((x) => !!x);
}
async function loadImportContent(result, stmt, filename, options, state, postcss) {
	const atRule = stmt.node;
	const { conditions, from } = stmt;
	const stmtDuplicateCheckKey = conditions.map((condition) => formatImportPrelude(condition.layer, condition.media, condition.supports)).join(":");
	if (options.skipDuplicates) {
		if (state.importedFiles[filename]?.[stmtDuplicateCheckKey]) return;
		if (!state.importedFiles[filename]) state.importedFiles[filename] = {};
		state.importedFiles[filename][stmtDuplicateCheckKey] = true;
	}
	if (from.includes(filename)) return;
	const content = await options.load(filename, options);
	if (content.trim() === "" && options.warnOnEmpty) {
		result.warn(`${filename} is empty`, { node: atRule });
		return;
	}
	if (options.skipDuplicates && state.hashFiles[content]?.[stmtDuplicateCheckKey]) return;
	const importedResult = await processContent(result, content, filename, options, postcss);
	const styles = importedResult.root;
	result.messages = result.messages.concat(importedResult.messages);
	if (options.skipDuplicates) {
		const hasImport = styles.some((child) => {
			return child.type === "atrule" && child.name === "import";
		});
		if (!hasImport) {
			if (!state.hashFiles[content]) state.hashFiles[content] = {};
			state.hashFiles[content][stmtDuplicateCheckKey] = true;
		}
	}
	return parseStyles$1(result, styles, options, state, conditions, [...from, filename], postcss);
}
function isProcessableURL(uri) {
	if (/^(?:[a-z]+:)?\/\//i.test(uri)) return false;
	try {
		const url = new URL(uri, "https://example.com");
		if (url.search) return false;
	} catch {}
	return true;
}
var parseStyles_1 = parseStyles$1;
const path = path$1;
const applyConditions = applyConditions$1;
const applyRaws = applyRaws$1;
const applyStyles = applyStyles$1;
const loadContent = () => "";
const parseStyles = parseStyles_1;
const resolveId = (id) => id;
function AtImport(options) {
	options = {
		root: process.cwd(),
		path: [],
		skipDuplicates: true,
		resolve: resolveId,
		load: loadContent,
		plugins: [],
		addModulesDirectories: [],
		warnOnEmpty: true,
		...options
	};
	options.root = path.resolve(options.root);
	if (typeof options.path === "string") options.path = [options.path];
	if (!Array.isArray(options.path)) options.path = [];
	options.path = options.path.map((p) => path.resolve(options.root, p));
	return {
		postcssPlugin: "postcss-import",
		async Once(styles, { result, atRule, postcss }) {
			const state = {
				importedFiles: {},
				hashFiles: {}
			};
			if (styles.source?.input?.file) state.importedFiles[styles.source.input.file] = {};
			if (options.plugins && !Array.isArray(options.plugins)) throw new Error("plugins option must be an array");
			const bundle = await parseStyles(result, styles, options, state, [], [], postcss);
			applyRaws(bundle);
			applyConditions(bundle, atRule);
			applyStyles(bundle, styles);
		}
	};
}
AtImport.postcss = true;
var postcssImport = AtImport;
var index = /* @__PURE__ */ getDefaultExportFromCjs(postcssImport);
var index$1 = /* @__PURE__ */ _mergeNamespaces({
	__proto__: null,
	default: index
}, [postcssImport]);

//#endregion
export { index$1 as i };