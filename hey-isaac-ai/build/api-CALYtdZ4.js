import { import_main$1 as import_main } from "./main-4rJYphZw.js";
import { createRequire } from "module";
import path$1 from "path";
import require$$0$4 from "fs";
import { inspect } from "node:util";
import require$$0$6 from "node:module";
import crypto from "node:crypto";
import require$$2 from "os";
import path from "node:path";
import os from "node:os";
import net from "node:net";
import fs, { writeSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

//#region node_modules/tsx/dist/temporary-directory-BDDVQOvU.mjs
const { geteuid: r } = process, t$3 = r ? r() : os.userInfo().username, e$2 = path.join(os.tmpdir(), `tsx-${t$3}`);

//#endregion
//#region node_modules/tsx/dist/get-pipe-path-_tAJyU_v.mjs
var o$2 = Object.defineProperty;
var t$2 = (e$3, r$1) => o$2(e$3, "name", {
	value: r$1,
	configurable: !0
});
var m$3 = createRequire(import.meta.url);
const i$3 = process.platform === "win32", n$1 = t$2((e$3) => {
	const r$1 = path.join(e$2, `${e$3}.pipe`);
	return i$3 ? `\\\\?\\pipe\\${r$1}` : r$1;
}, "getPipePath");

//#endregion
//#region node_modules/tsx/dist/node-features-B9BBLzwu.mjs
var i$2 = Object.defineProperty;
var o$1 = (e$3, t$4) => i$2(e$3, "name", {
	value: t$4,
	configurable: !0
});
const n = o$1((e$3, t$4) => {
	const s$2 = e$3[0] - t$4[0];
	if (s$2 === 0) {
		const r$1 = e$3[1] - t$4[1];
		return r$1 === 0 ? e$3[2] >= t$4[2] : r$1 > 0;
	}
	return s$2 > 0;
}, "isVersionGreaterOrEqual"), a$2 = process.versions.node.split(".").map(Number), c$1 = o$1((e$3, t$4 = a$2) => {
	for (let s$2 = 0; s$2 < e$3.length; s$2 += 1) {
		const r$1 = e$3[s$2];
		if (s$2 === e$3.length - 1 || t$4[0] === r$1[0]) return n(t$4, r$1);
	}
	return !1;
}, "isFeatureSupported"), u$2 = [[
	18,
	19,
	0
], [
	20,
	6,
	0
]], l$1 = [
	[
		24,
		11,
		1
	],
	[
		25,
		1,
		0
	],
	[
		26,
		0,
		0
	]
], m$2 = [
	[
		18,
		19,
		0
	],
	[
		20,
		10,
		0
	],
	[
		21,
		0,
		0
	]
], f$1 = [[
	21,
	0,
	0
]], p$1 = [[
	20,
	11,
	0
], [
	21,
	3,
	0
]], d$1 = [[
	20,
	11,
	0
], [
	21,
	2,
	0
]], R$1 = [
	[
		20,
		19,
		0
	],
	[
		22,
		12,
		0
	],
	[
		23,
		0,
		0
	]
];

//#endregion
//#region node_modules/tsx/dist/index-XurvG3JN.mjs
var Xt$1 = Object.defineProperty;
var h = (s$2, e$3) => Xt$1(s$2, "name", {
	value: e$3,
	configurable: !0
});
const Ce$1 = h((s$2) => crypto.createHash("sha1").update(s$2).digest("hex"), "sha1");
var nr = 44, ir = 59, Fe$1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Be$1 = new Uint8Array(64), sr = new Uint8Array(128);
for (let s$2 = 0; s$2 < Fe$1.length; s$2++) {
	const e$3 = Fe$1.charCodeAt(s$2);
	Be$1[s$2] = e$3, sr[e$3] = s$2;
}
function Y(s$2, e$3, r$1) {
	let i$4 = e$3 - r$1;
	i$4 = i$4 < 0 ? -i$4 << 1 | 1 : i$4 << 1;
	do {
		let o$3 = i$4 & 31;
		i$4 >>>= 5, i$4 > 0 && (o$3 |= 32), s$2.write(Be$1[o$3]);
	} while (i$4 > 0);
	return e$3;
}
h(Y, "encodeInteger$1");
var We$1 = 1024 * 16, Pe$1 = typeof TextDecoder < "u" ? new TextDecoder() : typeof Buffer < "u" ? { decode(s$2) {
	return Buffer.from(s$2.buffer, s$2.byteOffset, s$2.byteLength).toString();
} } : { decode(s$2) {
	let e$3 = "";
	for (let r$1 = 0; r$1 < s$2.length; r$1++) e$3 += String.fromCharCode(s$2[r$1]);
	return e$3;
} }, or = class {
	static {
		h(this, "StringWriter");
	}
	constructor() {
		this.pos = 0, this.out = "", this.buffer = new Uint8Array(We$1);
	}
	write(s$2) {
		const { buffer: e$3 } = this;
		e$3[this.pos++] = s$2, this.pos === We$1 && (this.out += Pe$1.decode(e$3), this.pos = 0);
	}
	flush() {
		const { buffer: s$2, out: e$3, pos: r$1 } = this;
		return r$1 > 0 ? e$3 + Pe$1.decode(s$2.subarray(0, r$1)) : e$3;
	}
};
function ar(s$2) {
	const e$3 = new or();
	let r$1 = 0, i$4 = 0, o$3 = 0, c$2 = 0;
	for (let u$3 = 0; u$3 < s$2.length; u$3++) {
		const p$2 = s$2[u$3];
		if (u$3 > 0 && e$3.write(ir), p$2.length === 0) continue;
		let g$1 = 0;
		for (let b$1 = 0; b$1 < p$2.length; b$1++) {
			const d$2 = p$2[b$1];
			b$1 > 0 && e$3.write(nr), g$1 = Y(e$3, d$2[0], g$1), d$2.length !== 1 && (r$1 = Y(e$3, d$2[1], r$1), i$4 = Y(e$3, d$2[2], i$4), o$3 = Y(e$3, d$2[3], o$3), d$2.length !== 4 && (c$2 = Y(e$3, d$2[4], c$2)));
		}
	}
	return e$3.flush();
}
h(ar, "encode$1");
var ue$1 = class ue$1 {
	static {
		h(this, "BitSet");
	}
	constructor(e$3) {
		this.bits = e$3 instanceof ue$1 ? e$3.bits.slice() : [];
	}
	add(e$3) {
		this.bits[e$3 >> 5] |= 1 << (e$3 & 31);
	}
	has(e$3) {
		return !!(this.bits[e$3 >> 5] & 1 << (e$3 & 31));
	}
};
var re$1 = class re$1 {
	static {
		h(this, "Chunk");
	}
	constructor(e$3, r$1, i$4) {
		this.start = e$3, this.end = r$1, this.original = i$4, this.intro = "", this.outro = "", this.content = i$4, this.storeName = !1, this.edited = !1, this.previous = null, this.next = null;
	}
	appendLeft(e$3) {
		this.outro += e$3;
	}
	appendRight(e$3) {
		this.intro = this.intro + e$3;
	}
	clone() {
		const e$3 = new re$1(this.start, this.end, this.original);
		return e$3.intro = this.intro, e$3.outro = this.outro, e$3.content = this.content, e$3.storeName = this.storeName, e$3.edited = this.edited, e$3;
	}
	contains(e$3) {
		return this.start < e$3 && e$3 < this.end;
	}
	eachNext(e$3) {
		let r$1 = this;
		for (; r$1;) e$3(r$1), r$1 = r$1.next;
	}
	eachPrevious(e$3) {
		let r$1 = this;
		for (; r$1;) e$3(r$1), r$1 = r$1.previous;
	}
	edit(e$3, r$1, i$4) {
		return this.content = e$3, i$4 || (this.intro = "", this.outro = ""), this.storeName = r$1, this.edited = !0, this;
	}
	prependLeft(e$3) {
		this.outro = e$3 + this.outro;
	}
	prependRight(e$3) {
		this.intro = e$3 + this.intro;
	}
	reset() {
		this.intro = "", this.outro = "", this.edited && (this.content = this.original, this.storeName = !1, this.edited = !1);
	}
	split(e$3) {
		const r$1 = e$3 - this.start, i$4 = this.original.slice(0, r$1), o$3 = this.original.slice(r$1);
		this.original = i$4;
		const c$2 = new re$1(e$3, this.end, o$3);
		return c$2.outro = this.outro, this.outro = "", this.end = e$3, this.edited ? (c$2.edit("", !1), this.content = "") : this.content = i$4, c$2.next = this.next, c$2.next && (c$2.next.previous = c$2), c$2.previous = this, this.next = c$2, c$2;
	}
	toString() {
		return this.intro + this.content + this.outro;
	}
	trimEnd(e$3) {
		if (this.outro = this.outro.replace(e$3, ""), this.outro.length) return !0;
		const r$1 = this.content.replace(e$3, "");
		if (r$1.length) return r$1 !== this.content && (this.split(this.start + r$1.length).edit("", void 0, !0), this.edited && this.edit(r$1, this.storeName, !0)), !0;
		if (this.edit("", void 0, !0), this.intro = this.intro.replace(e$3, ""), this.intro.length) return !0;
	}
	trimStart(e$3) {
		if (this.intro = this.intro.replace(e$3, ""), this.intro.length) return !0;
		const r$1 = this.content.replace(e$3, "");
		if (r$1.length) {
			if (r$1 !== this.content) {
				const i$4 = this.split(this.end - r$1.length);
				this.edited && i$4.edit(r$1, this.storeName, !0), this.edit("", void 0, !0);
			}
			return !0;
		} else if (this.edit("", void 0, !0), this.outro = this.outro.replace(e$3, ""), this.outro.length) return !0;
	}
};
function cr() {
	return typeof globalThis < "u" && typeof globalThis.btoa == "function" ? (s$2) => globalThis.btoa(unescape(encodeURIComponent(s$2))) : typeof Buffer == "function" ? (s$2) => Buffer.from(s$2, "utf-8").toString("base64") : () => {
		throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.");
	};
}
h(cr, "getBtoa");
const ur = cr();
let lr = class {
	static {
		h(this, "SourceMap");
	}
	constructor(e$3) {
		this.version = 3, this.file = e$3.file, this.sources = e$3.sources, this.sourcesContent = e$3.sourcesContent, this.names = e$3.names, this.mappings = ar(e$3.mappings), typeof e$3.x_google_ignoreList < "u" && (this.x_google_ignoreList = e$3.x_google_ignoreList), typeof e$3.debugId < "u" && (this.debugId = e$3.debugId);
	}
	toString() {
		return JSON.stringify(this);
	}
	toUrl() {
		return "data:application/json;charset=utf-8;base64," + ur(this.toString());
	}
};
function fr(s$2) {
	const e$3 = s$2.split(`
`), r$1 = e$3.filter((c$2) => /^\t+/.test(c$2)), i$4 = e$3.filter((c$2) => /^ {2,}/.test(c$2));
	if (r$1.length === 0 && i$4.length === 0) return null;
	if (r$1.length >= i$4.length) return "	";
	const o$3 = i$4.reduce((c$2, u$3) => {
		const p$2 = /^ +/.exec(u$3)[0].length;
		return Math.min(p$2, c$2);
	}, Infinity);
	return new Array(o$3 + 1).join(" ");
}
h(fr, "guessIndent");
function hr(s$2, e$3) {
	const r$1 = s$2.split(/[/\\]/), i$4 = e$3.split(/[/\\]/);
	for (r$1.pop(); r$1[0] === i$4[0];) r$1.shift(), i$4.shift();
	if (r$1.length) {
		let o$3 = r$1.length;
		for (; o$3--;) r$1[o$3] = "..";
	}
	return r$1.concat(i$4).join("/");
}
h(hr, "getRelativePath");
const dr = Object.prototype.toString;
function gr(s$2) {
	return dr.call(s$2) === "[object Object]";
}
h(gr, "isObject");
function Je$1(s$2) {
	const e$3 = s$2.split(`
`), r$1 = [];
	for (let i$4 = 0, o$3 = 0; i$4 < e$3.length; i$4++) r$1.push(o$3), o$3 += e$3[i$4].length + 1;
	return h(function(o$3) {
		let c$2 = 0, u$3 = r$1.length;
		for (; c$2 < u$3;) {
			const b$1 = c$2 + u$3 >> 1;
			o$3 < r$1[b$1] ? u$3 = b$1 : c$2 = b$1 + 1;
		}
		const p$2 = c$2 - 1, g$1 = o$3 - r$1[p$2];
		return {
			line: p$2,
			column: g$1
		};
	}, "locate");
}
h(Je$1, "getLocator");
const br = /\w/;
var pr = class {
	static {
		h(this, "Mappings");
	}
	constructor(e$3) {
		this.hires = e$3, this.generatedCodeLine = 0, this.generatedCodeColumn = 0, this.raw = [], this.rawSegments = this.raw[this.generatedCodeLine] = [], this.pending = null;
	}
	addEdit(e$3, r$1, i$4, o$3) {
		if (r$1.length) {
			const c$2 = r$1.length - 1;
			let u$3 = r$1.indexOf(`
`, 0), p$2 = -1;
			for (; u$3 >= 0 && c$2 > u$3;) {
				const b$1 = [
					this.generatedCodeColumn,
					e$3,
					i$4.line,
					i$4.column
				];
				o$3 >= 0 && b$1.push(o$3), this.rawSegments.push(b$1), this.generatedCodeLine += 1, this.raw[this.generatedCodeLine] = this.rawSegments = [], this.generatedCodeColumn = 0, p$2 = u$3, u$3 = r$1.indexOf(`
`, u$3 + 1);
			}
			const g$1 = [
				this.generatedCodeColumn,
				e$3,
				i$4.line,
				i$4.column
			];
			o$3 >= 0 && g$1.push(o$3), this.rawSegments.push(g$1), this.advance(r$1.slice(p$2 + 1));
		} else this.pending && (this.rawSegments.push(this.pending), this.advance(r$1));
		this.pending = null;
	}
	addUneditedChunk(e$3, r$1, i$4, o$3, c$2) {
		let u$3 = r$1.start, p$2 = !0, g$1 = !1;
		for (; u$3 < r$1.end;) {
			if (i$4[u$3] === `
`) o$3.line += 1, o$3.column = 0, this.generatedCodeLine += 1, this.raw[this.generatedCodeLine] = this.rawSegments = [], this.generatedCodeColumn = 0, p$2 = !0, g$1 = !1;
			else {
				if (this.hires || p$2 || c$2.has(u$3)) {
					const b$1 = [
						this.generatedCodeColumn,
						e$3,
						o$3.line,
						o$3.column
					];
					this.hires === "boundary" ? br.test(i$4[u$3]) ? g$1 || (this.rawSegments.push(b$1), g$1 = !0) : (this.rawSegments.push(b$1), g$1 = !1) : this.rawSegments.push(b$1);
				}
				o$3.column += 1, this.generatedCodeColumn += 1, p$2 = !1;
			}
			u$3 += 1;
		}
		this.pending = null;
	}
	advance(e$3) {
		if (!e$3) return;
		const r$1 = e$3.split(`
`);
		if (r$1.length > 1) {
			for (let i$4 = 0; i$4 < r$1.length - 1; i$4++) this.generatedCodeLine++, this.raw[this.generatedCodeLine] = this.rawSegments = [];
			this.generatedCodeColumn = 0;
		}
		this.generatedCodeColumn += r$1[r$1.length - 1].length;
	}
};
const Q$1 = `
`, G$1 = {
	insertLeft: !1,
	insertRight: !1,
	storeName: !1
};
var Me$1 = class Me$1 {
	static {
		h(this, "MagicString");
	}
	constructor(e$3, r$1 = {}) {
		const i$4 = new re$1(0, e$3.length, e$3);
		Object.defineProperties(this, {
			original: {
				writable: !0,
				value: e$3
			},
			outro: {
				writable: !0,
				value: ""
			},
			intro: {
				writable: !0,
				value: ""
			},
			firstChunk: {
				writable: !0,
				value: i$4
			},
			lastChunk: {
				writable: !0,
				value: i$4
			},
			lastSearchedChunk: {
				writable: !0,
				value: i$4
			},
			byStart: {
				writable: !0,
				value: {}
			},
			byEnd: {
				writable: !0,
				value: {}
			},
			filename: {
				writable: !0,
				value: r$1.filename
			},
			indentExclusionRanges: {
				writable: !0,
				value: r$1.indentExclusionRanges
			},
			sourcemapLocations: {
				writable: !0,
				value: new ue$1()
			},
			storedNames: {
				writable: !0,
				value: {}
			},
			indentStr: {
				writable: !0,
				value: void 0
			},
			ignoreList: {
				writable: !0,
				value: r$1.ignoreList
			},
			offset: {
				writable: !0,
				value: r$1.offset || 0
			}
		}), this.byStart[0] = i$4, this.byEnd[e$3.length] = i$4;
	}
	addSourcemapLocation(e$3) {
		this.sourcemapLocations.add(e$3);
	}
	append(e$3) {
		if (typeof e$3 != "string") throw new TypeError("outro content must be a string");
		return this.outro += e$3, this;
	}
	appendLeft(e$3, r$1) {
		if (e$3 = e$3 + this.offset, typeof r$1 != "string") throw new TypeError("inserted content must be a string");
		this._split(e$3);
		const i$4 = this.byEnd[e$3];
		return i$4 ? i$4.appendLeft(r$1) : this.intro += r$1, this;
	}
	appendRight(e$3, r$1) {
		if (e$3 = e$3 + this.offset, typeof r$1 != "string") throw new TypeError("inserted content must be a string");
		this._split(e$3);
		const i$4 = this.byStart[e$3];
		return i$4 ? i$4.appendRight(r$1) : this.outro += r$1, this;
	}
	clone() {
		const e$3 = new Me$1(this.original, {
			filename: this.filename,
			offset: this.offset
		});
		let r$1 = this.firstChunk, i$4 = e$3.firstChunk = e$3.lastSearchedChunk = r$1.clone();
		for (; r$1;) {
			e$3.byStart[i$4.start] = i$4, e$3.byEnd[i$4.end] = i$4;
			const o$3 = r$1.next, c$2 = o$3 && o$3.clone();
			c$2 && (i$4.next = c$2, c$2.previous = i$4, i$4 = c$2), r$1 = o$3;
		}
		return e$3.lastChunk = i$4, this.indentExclusionRanges && (e$3.indentExclusionRanges = this.indentExclusionRanges.slice()), e$3.sourcemapLocations = new ue$1(this.sourcemapLocations), e$3.intro = this.intro, e$3.outro = this.outro, e$3;
	}
	generateDecodedMap(e$3) {
		e$3 = e$3 || {};
		const r$1 = 0, i$4 = Object.keys(this.storedNames), o$3 = new pr(e$3.hires), c$2 = Je$1(this.original);
		return this.intro && o$3.advance(this.intro), this.firstChunk.eachNext((u$3) => {
			const p$2 = c$2(u$3.start);
			u$3.intro.length && o$3.advance(u$3.intro), u$3.edited ? o$3.addEdit(r$1, u$3.content, p$2, u$3.storeName ? i$4.indexOf(u$3.original) : -1) : o$3.addUneditedChunk(r$1, u$3, this.original, p$2, this.sourcemapLocations), u$3.outro.length && o$3.advance(u$3.outro);
		}), {
			file: e$3.file ? e$3.file.split(/[/\\]/).pop() : void 0,
			sources: [e$3.source ? hr(e$3.file || "", e$3.source) : e$3.file || ""],
			sourcesContent: e$3.includeContent ? [this.original] : void 0,
			names: i$4,
			mappings: o$3.raw,
			x_google_ignoreList: this.ignoreList ? [r$1] : void 0
		};
	}
	generateMap(e$3) {
		return new lr(this.generateDecodedMap(e$3));
	}
	_ensureindentStr() {
		this.indentStr === void 0 && (this.indentStr = fr(this.original));
	}
	_getRawIndentString() {
		return this._ensureindentStr(), this.indentStr;
	}
	getIndentString() {
		return this._ensureindentStr(), this.indentStr === null ? "	" : this.indentStr;
	}
	indent(e$3, r$1) {
		const i$4 = /^[^\r\n]/gm;
		if (gr(e$3) && (r$1 = e$3, e$3 = void 0), e$3 === void 0 && (this._ensureindentStr(), e$3 = this.indentStr || "	"), e$3 === "") return this;
		r$1 = r$1 || {};
		const o$3 = {};
		r$1.exclude && (typeof r$1.exclude[0] == "number" ? [r$1.exclude] : r$1.exclude).forEach((d$2) => {
			for (let n$2 = d$2[0]; n$2 < d$2[1]; n$2 += 1) o$3[n$2] = !0;
		});
		let c$2 = r$1.indentStart !== !1;
		const u$3 = h((b$1) => c$2 ? `${e$3}${b$1}` : (c$2 = !0, b$1), "replacer");
		this.intro = this.intro.replace(i$4, u$3);
		let p$2 = 0, g$1 = this.firstChunk;
		for (; g$1;) {
			const b$1 = g$1.end;
			if (g$1.edited) o$3[p$2] || (g$1.content = g$1.content.replace(i$4, u$3), g$1.content.length && (c$2 = g$1.content[g$1.content.length - 1] === `
`));
			else for (p$2 = g$1.start; p$2 < b$1;) {
				if (!o$3[p$2]) {
					const d$2 = this.original[p$2];
					d$2 === `
` ? c$2 = !0 : d$2 !== "\r" && c$2 && (c$2 = !1, p$2 === g$1.start || (this._splitChunk(g$1, p$2), g$1 = g$1.next), g$1.prependRight(e$3));
				}
				p$2 += 1;
			}
			p$2 = g$1.end, g$1 = g$1.next;
		}
		return this.outro = this.outro.replace(i$4, u$3), this;
	}
	insert() {
		throw new Error("magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)");
	}
	insertLeft(e$3, r$1) {
		return G$1.insertLeft || (console.warn("magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead"), G$1.insertLeft = !0), this.appendLeft(e$3, r$1);
	}
	insertRight(e$3, r$1) {
		return G$1.insertRight || (console.warn("magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead"), G$1.insertRight = !0), this.prependRight(e$3, r$1);
	}
	move(e$3, r$1, i$4) {
		if (e$3 = e$3 + this.offset, r$1 = r$1 + this.offset, i$4 = i$4 + this.offset, i$4 >= e$3 && i$4 <= r$1) throw new Error("Cannot move a selection inside itself");
		this._split(e$3), this._split(r$1), this._split(i$4);
		const o$3 = this.byStart[e$3], c$2 = this.byEnd[r$1], u$3 = o$3.previous, p$2 = c$2.next, g$1 = this.byStart[i$4];
		if (!g$1 && c$2 === this.lastChunk) return this;
		const b$1 = g$1 ? g$1.previous : this.lastChunk;
		return u$3 && (u$3.next = p$2), p$2 && (p$2.previous = u$3), b$1 && (b$1.next = o$3), g$1 && (g$1.previous = c$2), o$3.previous || (this.firstChunk = c$2.next), c$2.next || (this.lastChunk = o$3.previous, this.lastChunk.next = null), o$3.previous = b$1, c$2.next = g$1 || null, b$1 || (this.firstChunk = o$3), g$1 || (this.lastChunk = c$2), this;
	}
	overwrite(e$3, r$1, i$4, o$3) {
		return o$3 = o$3 || {}, this.update(e$3, r$1, i$4, {
			...o$3,
			overwrite: !o$3.contentOnly
		});
	}
	update(e$3, r$1, i$4, o$3) {
		if (e$3 = e$3 + this.offset, r$1 = r$1 + this.offset, typeof i$4 != "string") throw new TypeError("replacement content must be a string");
		if (this.original.length !== 0) {
			for (; e$3 < 0;) e$3 += this.original.length;
			for (; r$1 < 0;) r$1 += this.original.length;
		}
		if (r$1 > this.original.length) throw new Error("end is out of bounds");
		if (e$3 === r$1) throw new Error("Cannot overwrite a zero-length range – use appendLeft or prependRight instead");
		this._split(e$3), this._split(r$1), o$3 === !0 && (G$1.storeName || (console.warn("The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string"), G$1.storeName = !0), o$3 = { storeName: !0 });
		const c$2 = o$3 !== void 0 ? o$3.storeName : !1, u$3 = o$3 !== void 0 ? o$3.overwrite : !1;
		if (c$2) {
			const b$1 = this.original.slice(e$3, r$1);
			Object.defineProperty(this.storedNames, b$1, {
				writable: !0,
				value: !0,
				enumerable: !0
			});
		}
		const p$2 = this.byStart[e$3], g$1 = this.byEnd[r$1];
		if (p$2) {
			let b$1 = p$2;
			for (; b$1 !== g$1;) {
				if (b$1.next !== this.byStart[b$1.end]) throw new Error("Cannot overwrite across a split point");
				b$1 = b$1.next, b$1.edit("", !1);
			}
			p$2.edit(i$4, c$2, !u$3);
		} else {
			const b$1 = new re$1(e$3, r$1, "").edit(i$4, c$2);
			g$1.next = b$1, b$1.previous = g$1;
		}
		return this;
	}
	prepend(e$3) {
		if (typeof e$3 != "string") throw new TypeError("outro content must be a string");
		return this.intro = e$3 + this.intro, this;
	}
	prependLeft(e$3, r$1) {
		if (e$3 = e$3 + this.offset, typeof r$1 != "string") throw new TypeError("inserted content must be a string");
		this._split(e$3);
		const i$4 = this.byEnd[e$3];
		return i$4 ? i$4.prependLeft(r$1) : this.intro = r$1 + this.intro, this;
	}
	prependRight(e$3, r$1) {
		if (e$3 = e$3 + this.offset, typeof r$1 != "string") throw new TypeError("inserted content must be a string");
		this._split(e$3);
		const i$4 = this.byStart[e$3];
		return i$4 ? i$4.prependRight(r$1) : this.outro = r$1 + this.outro, this;
	}
	remove(e$3, r$1) {
		if (e$3 = e$3 + this.offset, r$1 = r$1 + this.offset, this.original.length !== 0) {
			for (; e$3 < 0;) e$3 += this.original.length;
			for (; r$1 < 0;) r$1 += this.original.length;
		}
		if (e$3 === r$1) return this;
		if (e$3 < 0 || r$1 > this.original.length) throw new Error("Character is out of bounds");
		if (e$3 > r$1) throw new Error("end must be greater than start");
		this._split(e$3), this._split(r$1);
		let i$4 = this.byStart[e$3];
		for (; i$4;) i$4.intro = "", i$4.outro = "", i$4.edit(""), i$4 = r$1 > i$4.end ? this.byStart[i$4.end] : null;
		return this;
	}
	reset(e$3, r$1) {
		if (e$3 = e$3 + this.offset, r$1 = r$1 + this.offset, this.original.length !== 0) {
			for (; e$3 < 0;) e$3 += this.original.length;
			for (; r$1 < 0;) r$1 += this.original.length;
		}
		if (e$3 === r$1) return this;
		if (e$3 < 0 || r$1 > this.original.length) throw new Error("Character is out of bounds");
		if (e$3 > r$1) throw new Error("end must be greater than start");
		this._split(e$3), this._split(r$1);
		let i$4 = this.byStart[e$3];
		for (; i$4;) i$4.reset(), i$4 = r$1 > i$4.end ? this.byStart[i$4.end] : null;
		return this;
	}
	lastChar() {
		if (this.outro.length) return this.outro[this.outro.length - 1];
		let e$3 = this.lastChunk;
		do {
			if (e$3.outro.length) return e$3.outro[e$3.outro.length - 1];
			if (e$3.content.length) return e$3.content[e$3.content.length - 1];
			if (e$3.intro.length) return e$3.intro[e$3.intro.length - 1];
		} while (e$3 = e$3.previous);
		return this.intro.length ? this.intro[this.intro.length - 1] : "";
	}
	lastLine() {
		let e$3 = this.outro.lastIndexOf(Q$1);
		if (e$3 !== -1) return this.outro.substr(e$3 + 1);
		let r$1 = this.outro, i$4 = this.lastChunk;
		do {
			if (i$4.outro.length > 0) {
				if (e$3 = i$4.outro.lastIndexOf(Q$1), e$3 !== -1) return i$4.outro.substr(e$3 + 1) + r$1;
				r$1 = i$4.outro + r$1;
			}
			if (i$4.content.length > 0) {
				if (e$3 = i$4.content.lastIndexOf(Q$1), e$3 !== -1) return i$4.content.substr(e$3 + 1) + r$1;
				r$1 = i$4.content + r$1;
			}
			if (i$4.intro.length > 0) {
				if (e$3 = i$4.intro.lastIndexOf(Q$1), e$3 !== -1) return i$4.intro.substr(e$3 + 1) + r$1;
				r$1 = i$4.intro + r$1;
			}
		} while (i$4 = i$4.previous);
		return e$3 = this.intro.lastIndexOf(Q$1), e$3 !== -1 ? this.intro.substr(e$3 + 1) + r$1 : this.intro + r$1;
	}
	slice(e$3 = 0, r$1 = this.original.length - this.offset) {
		if (e$3 = e$3 + this.offset, r$1 = r$1 + this.offset, this.original.length !== 0) {
			for (; e$3 < 0;) e$3 += this.original.length;
			for (; r$1 < 0;) r$1 += this.original.length;
		}
		let i$4 = "", o$3 = this.firstChunk;
		for (; o$3 && (o$3.start > e$3 || o$3.end <= e$3);) {
			if (o$3.start < r$1 && o$3.end >= r$1) return i$4;
			o$3 = o$3.next;
		}
		if (o$3 && o$3.edited && o$3.start !== e$3) throw new Error(`Cannot use replaced character ${e$3} as slice start anchor.`);
		const c$2 = o$3;
		for (; o$3;) {
			o$3.intro && (c$2 !== o$3 || o$3.start === e$3) && (i$4 += o$3.intro);
			const u$3 = o$3.start < r$1 && o$3.end >= r$1;
			if (u$3 && o$3.edited && o$3.end !== r$1) throw new Error(`Cannot use replaced character ${r$1} as slice end anchor.`);
			const p$2 = c$2 === o$3 ? e$3 - o$3.start : 0, g$1 = u$3 ? o$3.content.length + r$1 - o$3.end : o$3.content.length;
			if (i$4 += o$3.content.slice(p$2, g$1), o$3.outro && (!u$3 || o$3.end === r$1) && (i$4 += o$3.outro), u$3) break;
			o$3 = o$3.next;
		}
		return i$4;
	}
	snip(e$3, r$1) {
		const i$4 = this.clone();
		return i$4.remove(0, e$3), i$4.remove(r$1, i$4.original.length), i$4;
	}
	_split(e$3) {
		if (this.byStart[e$3] || this.byEnd[e$3]) return;
		let r$1 = this.lastSearchedChunk, i$4 = r$1;
		const o$3 = e$3 > r$1.end;
		for (; r$1;) {
			if (r$1.contains(e$3)) return this._splitChunk(r$1, e$3);
			if (r$1 = o$3 ? this.byStart[r$1.end] : this.byEnd[r$1.start], r$1 === i$4) return;
			i$4 = r$1;
		}
	}
	_splitChunk(e$3, r$1) {
		if (e$3.edited && e$3.content.length) {
			const o$3 = Je$1(this.original)(r$1);
			throw new Error(`Cannot split a chunk that has already been edited (${o$3.line}:${o$3.column} \u2013 "${e$3.original}")`);
		}
		const i$4 = e$3.split(r$1);
		return this.byEnd[r$1] = e$3, this.byStart[r$1] = i$4, this.byEnd[i$4.end] = i$4, e$3 === this.lastChunk && (this.lastChunk = i$4), this.lastSearchedChunk = e$3, !0;
	}
	toString() {
		let e$3 = this.intro, r$1 = this.firstChunk;
		for (; r$1;) e$3 += r$1.toString(), r$1 = r$1.next;
		return e$3 + this.outro;
	}
	isEmpty() {
		let e$3 = this.firstChunk;
		do
			if (e$3.intro.length && e$3.intro.trim() || e$3.content.length && e$3.content.trim() || e$3.outro.length && e$3.outro.trim()) return !1;
		while (e$3 = e$3.next);
		return !0;
	}
	length() {
		let e$3 = this.firstChunk, r$1 = 0;
		do
			r$1 += e$3.intro.length + e$3.content.length + e$3.outro.length;
		while (e$3 = e$3.next);
		return r$1;
	}
	trimLines() {
		return this.trim("[\\r\\n]");
	}
	trim(e$3) {
		return this.trimStart(e$3).trimEnd(e$3);
	}
	trimEndAborted(e$3) {
		const r$1 = new RegExp((e$3 || "\\s") + "+$");
		if (this.outro = this.outro.replace(r$1, ""), this.outro.length) return !0;
		let i$4 = this.lastChunk;
		do {
			const o$3 = i$4.end, c$2 = i$4.trimEnd(r$1);
			if (i$4.end !== o$3 && (this.lastChunk === i$4 && (this.lastChunk = i$4.next), this.byEnd[i$4.end] = i$4, this.byStart[i$4.next.start] = i$4.next, this.byEnd[i$4.next.end] = i$4.next), c$2) return !0;
			i$4 = i$4.previous;
		} while (i$4);
		return !1;
	}
	trimEnd(e$3) {
		return this.trimEndAborted(e$3), this;
	}
	trimStartAborted(e$3) {
		const r$1 = new RegExp("^" + (e$3 || "\\s") + "+");
		if (this.intro = this.intro.replace(r$1, ""), this.intro.length) return !0;
		let i$4 = this.firstChunk;
		do {
			const o$3 = i$4.end, c$2 = i$4.trimStart(r$1);
			if (i$4.end !== o$3 && (i$4 === this.lastChunk && (this.lastChunk = i$4.next), this.byEnd[i$4.end] = i$4, this.byStart[i$4.next.start] = i$4.next, this.byEnd[i$4.next.end] = i$4.next), c$2) return !0;
			i$4 = i$4.next;
		} while (i$4);
		return !1;
	}
	trimStart(e$3) {
		return this.trimStartAborted(e$3), this;
	}
	hasChanged() {
		return this.original !== this.toString();
	}
	_replaceRegexp(e$3, r$1) {
		function i$4(c$2, u$3) {
			return typeof r$1 == "string" ? r$1.replace(/\$(\$|&|\d+)/g, (p$2, g$1) => g$1 === "$" ? "$" : g$1 === "&" ? c$2[0] : +g$1 < c$2.length ? c$2[+g$1] : `$${g$1}`) : r$1(...c$2, c$2.index, u$3, c$2.groups);
		}
		h(i$4, "getReplacement");
		function o$3(c$2, u$3) {
			let p$2;
			const g$1 = [];
			for (; p$2 = c$2.exec(u$3);) g$1.push(p$2);
			return g$1;
		}
		if (h(o$3, "matchAll"), e$3.global) o$3(e$3, this.original).forEach((u$3) => {
			if (u$3.index != null) {
				const p$2 = i$4(u$3, this.original);
				p$2 !== u$3[0] && this.overwrite(u$3.index, u$3.index + u$3[0].length, p$2);
			}
		});
		else {
			const c$2 = this.original.match(e$3);
			if (c$2 && c$2.index != null) {
				const u$3 = i$4(c$2, this.original);
				u$3 !== c$2[0] && this.overwrite(c$2.index, c$2.index + c$2[0].length, u$3);
			}
		}
		return this;
	}
	_replaceString(e$3, r$1) {
		const { original: i$4 } = this, o$3 = i$4.indexOf(e$3);
		return o$3 !== -1 && this.overwrite(o$3, o$3 + e$3.length, r$1), this;
	}
	replace(e$3, r$1) {
		return typeof e$3 == "string" ? this._replaceString(e$3, r$1) : this._replaceRegexp(e$3, r$1);
	}
	_replaceAllString(e$3, r$1) {
		const { original: i$4 } = this, o$3 = e$3.length;
		for (let c$2 = i$4.indexOf(e$3); c$2 !== -1; c$2 = i$4.indexOf(e$3, c$2 + o$3)) i$4.slice(c$2, c$2 + o$3) !== r$1 && this.overwrite(c$2, c$2 + o$3, r$1);
		return this;
	}
	replaceAll(e$3, r$1) {
		if (typeof e$3 == "string") return this._replaceAllString(e$3, r$1);
		if (!e$3.global) throw new TypeError("MagicString.prototype.replaceAll called with a non-global RegExp argument");
		return this._replaceRegexp(e$3, r$1);
	}
};
let x, se$1, Se, Z = 2 << 19;
const Ge$1 = new Uint8Array(new Uint16Array([1]).buffer)[0] === 1 ? function(s$2, e$3) {
	const r$1 = s$2.length;
	let i$4 = 0;
	for (; i$4 < r$1;) e$3[i$4] = s$2.charCodeAt(i$4++);
} : function(s$2, e$3) {
	const r$1 = s$2.length;
	let i$4 = 0;
	for (; i$4 < r$1;) {
		const o$3 = s$2.charCodeAt(i$4);
		e$3[i$4++] = (255 & o$3) << 8 | o$3 >>> 8;
	}
}, mr = "xportmportlassforetaourceromsyncunctionssertvoyiedelecontininstantybreareturdebuggeawaithrwhileifcatcfinallels";
let E$1, qe$1, y;
function wr(s$2, e$3 = "@") {
	E$1 = s$2, qe$1 = e$3;
	const r$1 = 2 * E$1.length + (2 << 18);
	if (r$1 > Z || !x) {
		for (; r$1 > Z;) Z *= 2;
		se$1 = new ArrayBuffer(Z), Ge$1(mr, new Uint16Array(se$1, 16, 110)), x = function(u$3, p$2, g$1) {
			var b$1 = new u$3.Int8Array(g$1), d$2 = new u$3.Int16Array(g$1), n$2 = new u$3.Int32Array(g$1), A$1 = new u$3.Uint8Array(g$1), O$1 = new u$3.Uint16Array(g$1), _ = 1040;
			function I$2() {
				var t$4 = 0, a$3 = 0, f$2 = 0, l$2 = 0, m$4 = 0, w = 0, C$1 = 0;
				C$1 = _, _ = _ + 10240 | 0, b$1[804] = 1, b$1[803] = 0, d$2[399] = 0, d$2[400] = 0, n$2[69] = n$2[2], b$1[805] = 0, n$2[68] = 0, b$1[802] = 0, n$2[70] = C$1 + 2048, n$2[71] = C$1, b$1[806] = 0, t$4 = (n$2[3] | 0) + -2 | 0, n$2[72] = t$4, a$3 = t$4 + (n$2[66] << 1) | 0, n$2[73] = a$3;
				e: for (;;) {
					if (f$2 = t$4 + 2 | 0, n$2[72] = f$2, t$4 >>> 0 >= a$3 >>> 0) {
						l$2 = 18;
						break;
					}
					t: do
						switch (d$2[f$2 >> 1] | 0) {
							case 9:
							case 10:
							case 11:
							case 12:
							case 13:
							case 32: break;
							case 101: {
								if (!(d$2[400] | 0) && X$1(f$2) | 0 && !(R$2(t$4 + 4 | 0, 16, 10) | 0) && ($(), (b$1[804] | 0) == 0)) {
									l$2 = 9;
									break e;
								} else l$2 = 17;
								break;
							}
							case 105: {
								X$1(f$2) | 0 && !(R$2(t$4 + 4 | 0, 26, 10) | 0) && B(), l$2 = 17;
								break;
							}
							case 59: {
								l$2 = 17;
								break;
							}
							case 47: switch (d$2[t$4 + 4 >> 1] | 0) {
								case 47: {
									ge$1();
									break t;
								}
								case 42: {
									he$1(1);
									break t;
								}
								default: {
									l$2 = 16;
									break e;
								}
							}
							default: {
								l$2 = 16;
								break e;
							}
						}
					while (!1);
					(l$2 | 0) == 17 && (l$2 = 0, n$2[69] = n$2[72]), t$4 = n$2[72] | 0, a$3 = n$2[73] | 0;
				}
				(l$2 | 0) == 9 ? (t$4 = n$2[72] | 0, n$2[69] = t$4, l$2 = 19) : (l$2 | 0) == 16 ? (b$1[804] = 0, n$2[72] = t$4, l$2 = 19) : (l$2 | 0) == 18 && (b$1[802] | 0 ? t$4 = 0 : (t$4 = f$2, l$2 = 19));
				do
					if ((l$2 | 0) == 19) {
						e: for (;;) {
							if (a$3 = t$4 + 2 | 0, n$2[72] = a$3, t$4 >>> 0 >= (n$2[73] | 0) >>> 0) {
								l$2 = 92;
								break;
							}
							t: do
								switch (d$2[a$3 >> 1] | 0) {
									case 9:
									case 10:
									case 11:
									case 12:
									case 13:
									case 32: break;
									case 101: {
										!(d$2[400] | 0) && X$1(a$3) | 0 && !(R$2(t$4 + 4 | 0, 16, 10) | 0) && $(), l$2 = 91;
										break;
									}
									case 105: {
										X$1(a$3) | 0 && !(R$2(t$4 + 4 | 0, 26, 10) | 0) && B(), l$2 = 91;
										break;
									}
									case 99: {
										X$1(a$3) | 0 && !(R$2(t$4 + 4 | 0, 36, 8) | 0) && P(d$2[t$4 + 12 >> 1] | 0) | 0 && (b$1[806] = 1), l$2 = 91;
										break;
									}
									case 40: {
										f$2 = n$2[70] | 0, t$4 = d$2[400] | 0, l$2 = t$4 & 65535, n$2[f$2 + (l$2 << 3) >> 2] = 1, a$3 = n$2[69] | 0, d$2[400] = t$4 + 1 << 16 >> 16, n$2[f$2 + (l$2 << 3) + 4 >> 2] = a$3, l$2 = 91;
										break;
									}
									case 41: {
										if (a$3 = d$2[400] | 0, !(a$3 << 16 >> 16)) {
											l$2 = 36;
											break e;
										}
										f$2 = a$3 + -1 << 16 >> 16, d$2[400] = f$2, l$2 = d$2[399] | 0, a$3 = l$2 & 65535, l$2 << 16 >> 16 && (n$2[(n$2[70] | 0) + ((f$2 & 65535) << 3) >> 2] | 0) == 5 && (a$3 = n$2[(n$2[71] | 0) + (a$3 + -1 << 2) >> 2] | 0, f$2 = a$3 + 4 | 0, n$2[f$2 >> 2] | 0 || (n$2[f$2 >> 2] = (n$2[69] | 0) + 2), n$2[a$3 + 12 >> 2] = t$4 + 4, d$2[399] = l$2 + -1 << 16 >> 16), l$2 = 91;
										break;
									}
									case 123: {
										l$2 = n$2[69] | 0, f$2 = n$2[63] | 0, t$4 = l$2;
										do
											if ((d$2[l$2 >> 1] | 0) == 41 & (f$2 | 0) != 0 && (n$2[f$2 + 4 >> 2] | 0) == (l$2 | 0)) if (a$3 = n$2[64] | 0, n$2[63] = a$3, a$3) {
												n$2[a$3 + 32 >> 2] = 0;
												break;
											} else {
												n$2[59] = 0;
												break;
											}
										while (!1);
										f$2 = n$2[70] | 0, a$3 = d$2[400] | 0, l$2 = a$3 & 65535, n$2[f$2 + (l$2 << 3) >> 2] = b$1[806] | 0 ? 6 : 2, d$2[400] = a$3 + 1 << 16 >> 16, n$2[f$2 + (l$2 << 3) + 4 >> 2] = t$4, b$1[806] = 0, l$2 = 91;
										break;
									}
									case 125: {
										if (t$4 = d$2[400] | 0, !(t$4 << 16 >> 16)) {
											l$2 = 49;
											break e;
										}
										f$2 = n$2[70] | 0, l$2 = t$4 + -1 << 16 >> 16, d$2[400] = l$2, (n$2[f$2 + ((l$2 & 65535) << 3) >> 2] | 0) == 4 && $e(), l$2 = 91;
										break;
									}
									case 39: {
										N$1(39), l$2 = 91;
										break;
									}
									case 34: {
										N$1(34), l$2 = 91;
										break;
									}
									case 47: switch (d$2[t$4 + 4 >> 1] | 0) {
										case 47: {
											ge$1();
											break t;
										}
										case 42: {
											he$1(1);
											break t;
										}
										default: {
											t$4 = n$2[69] | 0, a$3 = d$2[t$4 >> 1] | 0;
											r: do
												if (!(_t(a$3) | 0)) a$3 << 16 >> 16 == 41 ? (f$2 = d$2[400] | 0, At(n$2[(n$2[70] | 0) + ((f$2 & 65535) << 3) + 4 >> 2] | 0) | 0 || (l$2 = 65)) : l$2 = 64;
												else switch (a$3 << 16 >> 16) {
													case 46: if (((d$2[t$4 + -2 >> 1] | 0) + -48 & 65535) < 10) {
														l$2 = 64;
														break r;
													} else break r;
													case 43: if ((d$2[t$4 + -2 >> 1] | 0) == 43) {
														l$2 = 64;
														break r;
													} else break r;
													case 45: if ((d$2[t$4 + -2 >> 1] | 0) == 45) {
														l$2 = 64;
														break r;
													} else break r;
													default: break r;
												}
											while (!1);
											(l$2 | 0) == 64 && (f$2 = d$2[400] | 0, l$2 = 65);
											r: do
												if ((l$2 | 0) == 65) {
													if (l$2 = 0, f$2 << 16 >> 16 && (m$4 = n$2[70] | 0, w = (f$2 & 65535) + -1 | 0, a$3 << 16 >> 16 == 102 ? (n$2[m$4 + (w << 3) >> 2] | 0) == 1 : 0)) {
														if ((d$2[t$4 + -2 >> 1] | 0) == 111 && L$1(n$2[m$4 + (w << 3) + 4 >> 2] | 0, 44, 3) | 0) break;
													} else l$2 = 69;
													if ((l$2 | 0) == 69 && a$3 << 16 >> 16 == 125 && (l$2 = n$2[70] | 0, f$2 = f$2 & 65535, xt(n$2[l$2 + (f$2 << 3) + 4 >> 2] | 0) | 0 || (n$2[l$2 + (f$2 << 3) >> 2] | 0) == 6)) break;
													if (!(St(t$4) | 0)) {
														switch (a$3 << 16 >> 16) {
															case 0: break r;
															case 47: {
																if (b$1[805] | 0) break r;
																break;
															}
															default:
														}
														if (l$2 = n$2[65] | 0, l$2 | 0 && t$4 >>> 0 >= (n$2[l$2 >> 2] | 0) >>> 0 && t$4 >>> 0 <= (n$2[l$2 + 4 >> 2] | 0) >>> 0) {
															fe$1(), b$1[805] = 0, l$2 = 91;
															break t;
														}
														f$2 = n$2[3] | 0;
														do {
															if (t$4 >>> 0 <= f$2 >>> 0) break;
															t$4 = t$4 + -2 | 0, n$2[69] = t$4, a$3 = d$2[t$4 >> 1] | 0;
														} while (!(de$1(a$3) | 0));
														if (ie$1(a$3) | 0) {
															do {
																if (t$4 >>> 0 <= f$2 >>> 0) break;
																t$4 = t$4 + -2 | 0, n$2[69] = t$4;
															} while (ie$1(d$2[t$4 >> 1] | 0) | 0);
															if (Lt(t$4) | 0) {
																fe$1(), b$1[805] = 0, l$2 = 91;
																break t;
															}
														}
														b$1[805] = 1, l$2 = 91;
														break t;
													}
												}
											while (!1);
											fe$1(), b$1[805] = 0, l$2 = 91;
											break t;
										}
									}
									case 96: {
										f$2 = n$2[70] | 0, a$3 = d$2[400] | 0, l$2 = a$3 & 65535, n$2[f$2 + (l$2 << 3) + 4 >> 2] = n$2[69], d$2[400] = a$3 + 1 << 16 >> 16, n$2[f$2 + (l$2 << 3) >> 2] = 3, $e(), l$2 = 91;
										break;
									}
									default: l$2 = 91;
								}
							while (!1);
							(l$2 | 0) == 91 && (l$2 = 0, n$2[69] = n$2[72]), t$4 = n$2[72] | 0;
						}
						if ((l$2 | 0) == 36) {
							M$1(), t$4 = 0;
							break;
						} else if ((l$2 | 0) == 49) {
							M$1(), t$4 = 0;
							break;
						} else if ((l$2 | 0) == 92) {
							t$4 = b$1[802] | 0 ? 0 : (d$2[399] | d$2[400]) << 16 >> 16 == 0;
							break;
						}
					}
				while (!1);
				return _ = C$1, t$4 | 0;
			}
			h(I$2, "b");
			function $() {
				var t$4 = 0, a$3 = 0, f$2 = 0, l$2 = 0, m$4 = 0, w = 0, C$1 = 0, D$1 = 0, pe$1 = 0, me$1 = 0, we$1 = 0, ke$1 = 0, S = 0, v = 0;
				D$1 = n$2[72] | 0, pe$1 = n$2[65] | 0, v = D$1 + 12 | 0, n$2[72] = v, f$2 = k(1) | 0, t$4 = n$2[72] | 0, (t$4 | 0) == (v | 0) && !(ne$1(f$2) | 0) || (S = 3);
				e: do
					if ((S | 0) == 3) {
						t: do
							switch (f$2 << 16 >> 16) {
								case 123: {
									for (n$2[72] = t$4 + 2, t$4 = k(1) | 0, a$3 = n$2[72] | 0;;) {
										if (K$1(t$4) | 0 ? (N$1(t$4), t$4 = (n$2[72] | 0) + 2 | 0, n$2[72] = t$4) : (U$1(t$4) | 0, t$4 = n$2[72] | 0), k(1) | 0, t$4 = je$1(a$3, t$4) | 0, t$4 << 16 >> 16 == 44 && (n$2[72] = (n$2[72] | 0) + 2, t$4 = k(1) | 0), t$4 << 16 >> 16 == 125) {
											S = 15;
											break;
										}
										if (v = a$3, a$3 = n$2[72] | 0, (a$3 | 0) == (v | 0)) {
											S = 12;
											break;
										}
										if (a$3 >>> 0 > (n$2[73] | 0) >>> 0) {
											S = 14;
											break;
										}
									}
									if ((S | 0) == 12) {
										M$1();
										break e;
									} else if ((S | 0) == 14) {
										M$1();
										break e;
									} else if ((S | 0) == 15) {
										b$1[803] = 1, n$2[72] = (n$2[72] | 0) + 2;
										break t;
									}
									break;
								}
								case 42: {
									n$2[72] = t$4 + 2, k(1) | 0, v = n$2[72] | 0, je$1(v, v) | 0;
									break;
								}
								default: {
									switch (b$1[804] = 0, f$2 << 16 >> 16) {
										case 100: {
											switch (D$1 = t$4 + 14 | 0, n$2[72] = D$1, (k(1) | 0) << 16 >> 16) {
												case 97: {
													a$3 = n$2[72] | 0, !(R$2(a$3 + 2 | 0, 72, 8) | 0) && (m$4 = a$3 + 10 | 0, ie$1(d$2[m$4 >> 1] | 0) | 0) && (n$2[72] = m$4, k(0) | 0, S = 22);
													break;
												}
												case 102: {
													S = 22;
													break;
												}
												case 99: {
													a$3 = n$2[72] | 0, !(R$2(a$3 + 2 | 0, 36, 8) | 0) && (l$2 = a$3 + 10 | 0, v = d$2[l$2 >> 1] | 0, P(v) | 0 | v << 16 >> 16 == 123) && (n$2[72] = l$2, w = k(1) | 0, w << 16 >> 16 != 123) && (ke$1 = w, S = 31);
													break;
												}
												default:
											}
											r: do
												if ((S | 0) == 22 && (C$1 = n$2[72] | 0, (R$2(C$1 + 2 | 0, 80, 14) | 0) == 0)) {
													if (f$2 = C$1 + 16 | 0, a$3 = d$2[f$2 >> 1] | 0, !(P(a$3) | 0)) switch (a$3 << 16 >> 16) {
														case 40:
														case 42: break;
														default: break r;
													}
													n$2[72] = f$2, a$3 = k(1) | 0, a$3 << 16 >> 16 == 42 && (n$2[72] = (n$2[72] | 0) + 2, a$3 = k(1) | 0), a$3 << 16 >> 16 != 40 && (ke$1 = a$3, S = 31);
												}
											while (!1);
											if ((S | 0) == 31 && (me$1 = n$2[72] | 0, U$1(ke$1) | 0, we$1 = n$2[72] | 0, we$1 >>> 0 > me$1 >>> 0)) {
												W$1(t$4, D$1, me$1, we$1), n$2[72] = (n$2[72] | 0) + -2;
												break e;
											}
											W$1(t$4, D$1, 0, 0), n$2[72] = t$4 + 12;
											break e;
										}
										case 97: {
											n$2[72] = t$4 + 10, k(0) | 0, t$4 = n$2[72] | 0, S = 35;
											break;
										}
										case 102: {
											S = 35;
											break;
										}
										case 99: {
											if (!(R$2(t$4 + 2 | 0, 36, 8) | 0) && (a$3 = t$4 + 10 | 0, de$1(d$2[a$3 >> 1] | 0) | 0)) {
												n$2[72] = a$3, v = k(1) | 0, S = n$2[72] | 0, U$1(v) | 0, v = n$2[72] | 0, W$1(S, v, S, v), n$2[72] = (n$2[72] | 0) + -2;
												break e;
											}
											t$4 = t$4 + 4 | 0, n$2[72] = t$4;
											break;
										}
										case 108:
										case 118: break;
										default: break e;
									}
									if ((S | 0) == 35) {
										n$2[72] = t$4 + 16, t$4 = k(1) | 0, t$4 << 16 >> 16 == 42 && (n$2[72] = (n$2[72] | 0) + 2, t$4 = k(1) | 0), S = n$2[72] | 0, U$1(t$4) | 0, v = n$2[72] | 0, W$1(S, v, S, v), n$2[72] = (n$2[72] | 0) + -2;
										break e;
									}
									n$2[72] = t$4 + 6, b$1[804] = 0, f$2 = k(1) | 0, t$4 = n$2[72] | 0, f$2 = (U$1(f$2) | 32) << 16 >> 16 == 123, l$2 = n$2[72] | 0, f$2 && (n$2[72] = l$2 + 2, v = k(1) | 0, t$4 = n$2[72] | 0, U$1(v) | 0);
									r: for (; a$3 = n$2[72] | 0, (a$3 | 0) != (t$4 | 0);) {
										if (W$1(t$4, a$3, t$4, a$3), a$3 = k(1) | 0, f$2) switch (a$3 << 16 >> 16) {
											case 93:
											case 125: break e;
											default:
										}
										if (t$4 = n$2[72] | 0, a$3 << 16 >> 16 != 44) {
											S = 51;
											break;
										}
										switch (n$2[72] = t$4 + 2, a$3 = k(1) | 0, t$4 = n$2[72] | 0, a$3 << 16 >> 16) {
											case 91:
											case 123: {
												S = 51;
												break r;
											}
											default:
										}
										U$1(a$3) | 0;
									}
									if ((S | 0) == 51 && (n$2[72] = t$4 + -2), !f$2) break e;
									n$2[72] = l$2 + -2;
									break e;
								}
							}
						while (!1);
						if (v = (k(1) | 0) << 16 >> 16 == 102, t$4 = n$2[72] | 0, v && !(R$2(t$4 + 2 | 0, 66, 6) | 0)) for (n$2[72] = t$4 + 8, z$1(D$1, k(1) | 0, 0), t$4 = pe$1 | 0 ? pe$1 + 16 | 0 : 240;;) {
							if (t$4 = n$2[t$4 >> 2] | 0, !t$4) break e;
							n$2[t$4 + 12 >> 2] = 0, n$2[t$4 + 8 >> 2] = 0, t$4 = t$4 + 16 | 0;
						}
						n$2[72] = t$4 + -2;
					}
				while (!1);
			}
			h($, "k");
			function B() {
				var t$4 = 0, a$3 = 0, f$2 = 0, l$2 = 0, m$4 = 0, w = 0, C$1 = 0;
				m$4 = n$2[72] | 0, f$2 = m$4 + 12 | 0, n$2[72] = f$2, l$2 = k(1) | 0, a$3 = n$2[72] | 0;
				e: do
					if (l$2 << 16 >> 16 != 46) l$2 << 16 >> 16 == 115 & a$3 >>> 0 > f$2 >>> 0 ? !(R$2(a$3 + 2 | 0, 56, 10) | 0) && (t$4 = a$3 + 12 | 0, P(d$2[t$4 >> 1] | 0) | 0) ? w = 14 : (a$3 = 6, f$2 = 0, w = 46) : (t$4 = l$2, f$2 = 0, w = 15);
					else switch (n$2[72] = a$3 + 2, (k(1) | 0) << 16 >> 16) {
						case 109: {
							if (t$4 = n$2[72] | 0, R$2(t$4 + 2 | 0, 50, 6) | 0 || (a$3 = n$2[69] | 0, !(be$1(a$3) | 0) && (d$2[a$3 >> 1] | 0) == 46)) break e;
							le$1(m$4, m$4, t$4 + 8 | 0, 2);
							break e;
						}
						case 115: {
							if (t$4 = n$2[72] | 0, R$2(t$4 + 2 | 0, 56, 10) | 0 || (a$3 = n$2[69] | 0, !(be$1(a$3) | 0) && (d$2[a$3 >> 1] | 0) == 46)) break e;
							t$4 = t$4 + 12 | 0, w = 14;
							break e;
						}
						default: break e;
					}
				while (!1);
				(w | 0) == 14 && (n$2[72] = t$4, t$4 = k(1) | 0, f$2 = 1, w = 15);
				e: do
					if ((w | 0) == 15) switch (t$4 << 16 >> 16) {
						case 40: {
							if (a$3 = n$2[70] | 0, C$1 = d$2[400] | 0, l$2 = C$1 & 65535, n$2[a$3 + (l$2 << 3) >> 2] = 5, t$4 = n$2[72] | 0, d$2[400] = C$1 + 1 << 16 >> 16, n$2[a$3 + (l$2 << 3) + 4 >> 2] = t$4, (d$2[n$2[69] >> 1] | 0) == 46) break e;
							switch (n$2[72] = t$4 + 2, a$3 = k(1) | 0, le$1(m$4, n$2[72] | 0, 0, t$4), f$2 ? (t$4 = n$2[63] | 0, n$2[t$4 + 28 >> 2] = 5) : t$4 = n$2[63] | 0, m$4 = n$2[71] | 0, C$1 = d$2[399] | 0, d$2[399] = C$1 + 1 << 16 >> 16, n$2[m$4 + ((C$1 & 65535) << 2) >> 2] = t$4, a$3 << 16 >> 16) {
								case 39: {
									N$1(39);
									break;
								}
								case 34: {
									N$1(34);
									break;
								}
								default: {
									n$2[72] = (n$2[72] | 0) + -2;
									break e;
								}
							}
							switch (t$4 = (n$2[72] | 0) + 2 | 0, n$2[72] = t$4, (k(1) | 0) << 16 >> 16) {
								case 44: {
									n$2[72] = (n$2[72] | 0) + 2, k(1) | 0, m$4 = n$2[63] | 0, n$2[m$4 + 4 >> 2] = t$4, C$1 = n$2[72] | 0, n$2[m$4 + 16 >> 2] = C$1, b$1[m$4 + 24 >> 0] = 1, n$2[72] = C$1 + -2;
									break e;
								}
								case 41: {
									d$2[400] = (d$2[400] | 0) + -1 << 16 >> 16, C$1 = n$2[63] | 0, n$2[C$1 + 4 >> 2] = t$4, n$2[C$1 + 12 >> 2] = (n$2[72] | 0) + 2, b$1[C$1 + 24 >> 0] = 1, d$2[399] = (d$2[399] | 0) + -1 << 16 >> 16;
									break e;
								}
								default: {
									n$2[72] = (n$2[72] | 0) + -2;
									break e;
								}
							}
						}
						case 123: {
							if (f$2) {
								a$3 = 12, f$2 = 1, w = 46;
								break e;
							}
							if (t$4 = n$2[72] | 0, d$2[400] | 0) {
								n$2[72] = t$4 + -2;
								break e;
							}
							for (; !(t$4 >>> 0 >= (n$2[73] | 0) >>> 0);) {
								if (t$4 = k(1) | 0, K$1(t$4) | 0) N$1(t$4);
								else if (t$4 << 16 >> 16 == 125) {
									w = 36;
									break;
								}
								t$4 = (n$2[72] | 0) + 2 | 0, n$2[72] = t$4;
							}
							if ((w | 0) == 36 && (n$2[72] = (n$2[72] | 0) + 2), C$1 = (k(1) | 0) << 16 >> 16 == 102, t$4 = n$2[72] | 0, C$1 && R$2(t$4 + 2 | 0, 66, 6) | 0) {
								M$1();
								break e;
							}
							if (n$2[72] = t$4 + 8, t$4 = k(1) | 0, K$1(t$4) | 0) {
								z$1(m$4, t$4, 0);
								break e;
							} else {
								M$1();
								break e;
							}
						}
						default: {
							if (f$2) {
								a$3 = 12, f$2 = 1, w = 46;
								break e;
							}
							switch (t$4 << 16 >> 16) {
								case 42:
								case 39:
								case 34: {
									f$2 = 0, w = 48;
									break e;
								}
								default: {
									a$3 = 6, f$2 = 0, w = 46;
									break e;
								}
							}
						}
					}
				while (!1);
				(w | 0) == 46 && (t$4 = n$2[72] | 0, (t$4 | 0) == (m$4 + (a$3 << 1) | 0) ? n$2[72] = t$4 + -2 : w = 48);
				do
					if ((w | 0) == 48) {
						if (d$2[400] | 0) {
							n$2[72] = (n$2[72] | 0) + -2;
							break;
						}
						for (t$4 = n$2[73] | 0, a$3 = n$2[72] | 0;;) {
							if (a$3 >>> 0 >= t$4 >>> 0) {
								w = 55;
								break;
							}
							if (l$2 = d$2[a$3 >> 1] | 0, K$1(l$2) | 0) {
								w = 53;
								break;
							}
							C$1 = a$3 + 2 | 0, n$2[72] = C$1, a$3 = C$1;
						}
						if ((w | 0) == 53) {
							z$1(m$4, l$2, f$2);
							break;
						} else if ((w | 0) == 55) {
							M$1();
							break;
						}
					}
				while (!1);
			}
			h(B, "l");
			function z$1(t$4, a$3, f$2) {
				t$4 = t$4 | 0, a$3 = a$3 | 0, f$2 = f$2 | 0;
				var l$2 = 0, m$4 = 0;
				switch (l$2 = (n$2[72] | 0) + 2 | 0, a$3 << 16 >> 16) {
					case 39: {
						N$1(39), m$4 = 5;
						break;
					}
					case 34: {
						N$1(34), m$4 = 5;
						break;
					}
					default: M$1();
				}
				do
					if ((m$4 | 0) == 5) {
						if (le$1(t$4, l$2, n$2[72] | 0, 1), f$2 && (n$2[(n$2[63] | 0) + 28 >> 2] = 4), n$2[72] = (n$2[72] | 0) + 2, a$3 = k(0) | 0, f$2 = a$3 << 16 >> 16 == 97, f$2 ? (l$2 = n$2[72] | 0, R$2(l$2 + 2 | 0, 94, 10) | 0 && (m$4 = 13)) : (l$2 = n$2[72] | 0, a$3 << 16 >> 16 == 119 && (d$2[l$2 + 2 >> 1] | 0) == 105 && (d$2[l$2 + 4 >> 1] | 0) == 116 && (d$2[l$2 + 6 >> 1] | 0) == 104 || (m$4 = 13)), (m$4 | 0) == 13) {
							n$2[72] = l$2 + -2;
							break;
						}
						if (n$2[72] = l$2 + ((f$2 ? 6 : 4) << 1), (k(1) | 0) << 16 >> 16 != 123) {
							n$2[72] = l$2;
							break;
						}
						f$2 = n$2[72] | 0, a$3 = f$2;
						e: for (;;) {
							switch (n$2[72] = a$3 + 2, a$3 = k(1) | 0, a$3 << 16 >> 16) {
								case 39: {
									N$1(39), n$2[72] = (n$2[72] | 0) + 2, a$3 = k(1) | 0;
									break;
								}
								case 34: {
									N$1(34), n$2[72] = (n$2[72] | 0) + 2, a$3 = k(1) | 0;
									break;
								}
								default: a$3 = U$1(a$3) | 0;
							}
							if (a$3 << 16 >> 16 != 58) {
								m$4 = 22;
								break;
							}
							switch (n$2[72] = (n$2[72] | 0) + 2, (k(1) | 0) << 16 >> 16) {
								case 39: {
									N$1(39);
									break;
								}
								case 34: {
									N$1(34);
									break;
								}
								default: {
									m$4 = 26;
									break e;
								}
							}
							switch (n$2[72] = (n$2[72] | 0) + 2, (k(1) | 0) << 16 >> 16) {
								case 125: {
									m$4 = 31;
									break e;
								}
								case 44: break;
								default: {
									m$4 = 30;
									break e;
								}
							}
							if (n$2[72] = (n$2[72] | 0) + 2, (k(1) | 0) << 16 >> 16 == 125) {
								m$4 = 31;
								break;
							}
							a$3 = n$2[72] | 0;
						}
						if ((m$4 | 0) == 22) {
							n$2[72] = l$2;
							break;
						} else if ((m$4 | 0) == 26) {
							n$2[72] = l$2;
							break;
						} else if ((m$4 | 0) == 30) {
							n$2[72] = l$2;
							break;
						} else if ((m$4 | 0) == 31) {
							m$4 = n$2[63] | 0, n$2[m$4 + 16 >> 2] = f$2, n$2[m$4 + 12 >> 2] = (n$2[72] | 0) + 2;
							break;
						}
					}
				while (!1);
			}
			h(z$1, "u");
			function St(t$4) {
				t$4 = t$4 | 0;
				e: do
					switch (d$2[t$4 >> 1] | 0) {
						case 100: switch (d$2[t$4 + -2 >> 1] | 0) {
							case 105: {
								t$4 = L$1(t$4 + -4 | 0, 104, 2) | 0;
								break e;
							}
							case 108: {
								t$4 = L$1(t$4 + -4 | 0, 108, 3) | 0;
								break e;
							}
							default: {
								t$4 = 0;
								break e;
							}
						}
						case 101: switch (d$2[t$4 + -2 >> 1] | 0) {
							case 115: switch (d$2[t$4 + -4 >> 1] | 0) {
								case 108: {
									t$4 = H$1(t$4 + -6 | 0, 101) | 0;
									break e;
								}
								case 97: {
									t$4 = H$1(t$4 + -6 | 0, 99) | 0;
									break e;
								}
								default: {
									t$4 = 0;
									break e;
								}
							}
							case 116: {
								t$4 = L$1(t$4 + -4 | 0, 114, 4) | 0;
								break e;
							}
							case 117: {
								t$4 = L$1(t$4 + -4 | 0, 122, 6) | 0;
								break e;
							}
							default: {
								t$4 = 0;
								break e;
							}
						}
						case 102: {
							if ((d$2[t$4 + -2 >> 1] | 0) == 111 && (d$2[t$4 + -4 >> 1] | 0) == 101) switch (d$2[t$4 + -6 >> 1] | 0) {
								case 99: {
									t$4 = L$1(t$4 + -8 | 0, 134, 6) | 0;
									break e;
								}
								case 112: {
									t$4 = L$1(t$4 + -8 | 0, 146, 2) | 0;
									break e;
								}
								default: {
									t$4 = 0;
									break e;
								}
							}
							else t$4 = 0;
							break;
						}
						case 107: {
							t$4 = L$1(t$4 + -2 | 0, 150, 4) | 0;
							break;
						}
						case 110: {
							t$4 = t$4 + -2 | 0, H$1(t$4, 105) | 0 ? t$4 = 1 : t$4 = L$1(t$4, 158, 5) | 0;
							break;
						}
						case 111: {
							t$4 = H$1(t$4 + -2 | 0, 100) | 0;
							break;
						}
						case 114: {
							t$4 = L$1(t$4 + -2 | 0, 168, 7) | 0;
							break;
						}
						case 116: {
							t$4 = L$1(t$4 + -2 | 0, 182, 4) | 0;
							break;
						}
						case 119: switch (d$2[t$4 + -2 >> 1] | 0) {
							case 101: {
								t$4 = H$1(t$4 + -4 | 0, 110) | 0;
								break e;
							}
							case 111: {
								t$4 = L$1(t$4 + -4 | 0, 190, 3) | 0;
								break e;
							}
							default: {
								t$4 = 0;
								break e;
							}
						}
						default: t$4 = 0;
					}
				while (!1);
				return t$4 | 0;
			}
			h(St, "o");
			function $e() {
				var t$4 = 0, a$3 = 0, f$2 = 0, l$2 = 0;
				a$3 = n$2[73] | 0, f$2 = n$2[72] | 0;
				e: for (;;) {
					if (t$4 = f$2 + 2 | 0, f$2 >>> 0 >= a$3 >>> 0) {
						a$3 = 10;
						break;
					}
					switch (d$2[t$4 >> 1] | 0) {
						case 96: {
							a$3 = 7;
							break e;
						}
						case 36: {
							if ((d$2[f$2 + 4 >> 1] | 0) == 123) {
								a$3 = 6;
								break e;
							}
							break;
						}
						case 92: {
							t$4 = f$2 + 4 | 0;
							break;
						}
						default:
					}
					f$2 = t$4;
				}
				(a$3 | 0) == 6 ? (t$4 = f$2 + 4 | 0, n$2[72] = t$4, a$3 = n$2[70] | 0, l$2 = d$2[400] | 0, f$2 = l$2 & 65535, n$2[a$3 + (f$2 << 3) >> 2] = 4, d$2[400] = l$2 + 1 << 16 >> 16, n$2[a$3 + (f$2 << 3) + 4 >> 2] = t$4) : (a$3 | 0) == 7 ? (n$2[72] = t$4, f$2 = n$2[70] | 0, l$2 = (d$2[400] | 0) + -1 << 16 >> 16, d$2[400] = l$2, (n$2[f$2 + ((l$2 & 65535) << 3) >> 2] | 0) != 3 && M$1()) : (a$3 | 0) == 10 && (n$2[72] = t$4, M$1());
			}
			h($e, "h");
			function k(t$4) {
				t$4 = t$4 | 0;
				var a$3 = 0, f$2 = 0, l$2 = 0;
				f$2 = n$2[72] | 0;
				e: do {
					a$3 = d$2[f$2 >> 1] | 0;
					t: do
						if (a$3 << 16 >> 16 != 47) if (t$4) {
							if (P(a$3) | 0) break;
							break e;
						} else {
							if (ie$1(a$3) | 0) break;
							break e;
						}
						else switch (d$2[f$2 + 2 >> 1] | 0) {
							case 47: {
								ge$1();
								break t;
							}
							case 42: {
								he$1(t$4);
								break t;
							}
							default: {
								a$3 = 47;
								break e;
							}
						}
					while (!1);
					l$2 = n$2[72] | 0, f$2 = l$2 + 2 | 0, n$2[72] = f$2;
				} while (l$2 >>> 0 < (n$2[73] | 0) >>> 0);
				return a$3 | 0;
			}
			h(k, "w");
			function le$1(t$4, a$3, f$2, l$2) {
				t$4 = t$4 | 0, a$3 = a$3 | 0, f$2 = f$2 | 0, l$2 = l$2 | 0;
				var m$4 = 0, w = 0;
				w = n$2[67] | 0, n$2[67] = w + 36, m$4 = n$2[63] | 0, n$2[(m$4 | 0 ? m$4 + 32 | 0 : 236) >> 2] = w, n$2[64] = m$4, n$2[63] = w, n$2[w + 8 >> 2] = t$4, (l$2 | 0) == 2 ? (t$4 = 3, m$4 = f$2) : (m$4 = (l$2 | 0) == 1, t$4 = m$4 ? 1 : 2, m$4 = m$4 ? f$2 + 2 | 0 : 0), n$2[w + 12 >> 2] = m$4, n$2[w + 28 >> 2] = t$4, n$2[w >> 2] = a$3, n$2[w + 4 >> 2] = f$2, n$2[w + 16 >> 2] = 0, n$2[w + 20 >> 2] = l$2, a$3 = (l$2 | 0) == 1, b$1[w + 24 >> 0] = a$3 & 1, n$2[w + 32 >> 2] = 0, a$3 | (l$2 | 0) == 2 && (b$1[803] = 1);
			}
			h(le$1, "d");
			function N$1(t$4) {
				t$4 = t$4 | 0;
				var a$3 = 0, f$2 = 0, l$2 = 0, m$4 = 0;
				for (m$4 = n$2[73] | 0, a$3 = n$2[72] | 0;;) {
					if (l$2 = a$3 + 2 | 0, a$3 >>> 0 >= m$4 >>> 0) {
						a$3 = 9;
						break;
					}
					if (f$2 = d$2[l$2 >> 1] | 0, f$2 << 16 >> 16 == t$4 << 16 >> 16) {
						a$3 = 10;
						break;
					}
					if (f$2 << 16 >> 16 == 92) f$2 = a$3 + 4 | 0, (d$2[f$2 >> 1] | 0) == 13 ? (a$3 = a$3 + 6 | 0, a$3 = (d$2[a$3 >> 1] | 0) == 10 ? a$3 : f$2) : a$3 = f$2;
					else if (Te$1(f$2) | 0) {
						a$3 = 9;
						break;
					} else a$3 = l$2;
				}
				(a$3 | 0) == 9 ? (n$2[72] = l$2, M$1()) : (a$3 | 0) == 10 && (n$2[72] = l$2);
			}
			h(N$1, "v");
			function je$1(t$4, a$3) {
				t$4 = t$4 | 0, a$3 = a$3 | 0;
				var f$2 = 0, l$2 = 0, m$4 = 0, w = 0;
				return f$2 = n$2[72] | 0, l$2 = d$2[f$2 >> 1] | 0, w = (t$4 | 0) == (a$3 | 0), m$4 = w ? 0 : t$4, w = w ? 0 : a$3, l$2 << 16 >> 16 == 97 && (n$2[72] = f$2 + 4, f$2 = k(1) | 0, t$4 = n$2[72] | 0, K$1(f$2) | 0 ? (N$1(f$2), a$3 = (n$2[72] | 0) + 2 | 0, n$2[72] = a$3) : (U$1(f$2) | 0, a$3 = n$2[72] | 0), l$2 = k(1) | 0, f$2 = n$2[72] | 0), (f$2 | 0) != (t$4 | 0) && W$1(t$4, a$3, m$4, w), l$2 | 0;
			}
			h(je$1, "A");
			function vt() {
				var t$4 = 0, a$3 = 0, f$2 = 0;
				f$2 = n$2[73] | 0, a$3 = n$2[72] | 0;
				e: for (;;) {
					if (t$4 = a$3 + 2 | 0, a$3 >>> 0 >= f$2 >>> 0) {
						a$3 = 6;
						break;
					}
					switch (d$2[t$4 >> 1] | 0) {
						case 13:
						case 10: {
							a$3 = 6;
							break e;
						}
						case 93: {
							a$3 = 7;
							break e;
						}
						case 92: {
							t$4 = a$3 + 4 | 0;
							break;
						}
						default:
					}
					a$3 = t$4;
				}
				return (a$3 | 0) == 6 ? (n$2[72] = t$4, M$1(), t$4 = 0) : (a$3 | 0) == 7 && (n$2[72] = t$4, t$4 = 93), t$4 | 0;
			}
			h(vt, "C");
			function fe$1() {
				var t$4 = 0, a$3 = 0, f$2 = 0;
				e: for (;;) {
					if (t$4 = n$2[72] | 0, a$3 = t$4 + 2 | 0, n$2[72] = a$3, t$4 >>> 0 >= (n$2[73] | 0) >>> 0) {
						f$2 = 7;
						break;
					}
					switch (d$2[a$3 >> 1] | 0) {
						case 13:
						case 10: {
							f$2 = 7;
							break e;
						}
						case 47: break e;
						case 91: {
							vt() | 0;
							break;
						}
						case 92: {
							n$2[72] = t$4 + 4;
							break;
						}
						default:
					}
				}
				(f$2 | 0) == 7 && M$1();
			}
			h(fe$1, "g");
			function xt(t$4) {
				switch (t$4 = t$4 | 0, d$2[t$4 >> 1] | 0) {
					case 62: {
						t$4 = (d$2[t$4 + -2 >> 1] | 0) == 61;
						break;
					}
					case 41:
					case 59: {
						t$4 = 1;
						break;
					}
					case 104: {
						t$4 = L$1(t$4 + -2 | 0, 210, 4) | 0;
						break;
					}
					case 121: {
						t$4 = L$1(t$4 + -2 | 0, 218, 6) | 0;
						break;
					}
					case 101: {
						t$4 = L$1(t$4 + -2 | 0, 230, 3) | 0;
						break;
					}
					default: t$4 = 0;
				}
				return t$4 | 0;
			}
			h(xt, "p");
			function he$1(t$4) {
				t$4 = t$4 | 0;
				var a$3 = 0, f$2 = 0, l$2 = 0, m$4 = 0, w = 0;
				for (m$4 = (n$2[72] | 0) + 2 | 0, n$2[72] = m$4, f$2 = n$2[73] | 0; a$3 = m$4 + 2 | 0, !(m$4 >>> 0 >= f$2 >>> 0 || (l$2 = d$2[a$3 >> 1] | 0, !t$4 && Te$1(l$2) | 0));) {
					if (l$2 << 16 >> 16 == 42 && (d$2[m$4 + 4 >> 1] | 0) == 47) {
						w = 8;
						break;
					}
					m$4 = a$3;
				}
				(w | 0) == 8 && (n$2[72] = a$3, a$3 = m$4 + 4 | 0), n$2[72] = a$3;
			}
			h(he$1, "y");
			function R$2(t$4, a$3, f$2) {
				t$4 = t$4 | 0, a$3 = a$3 | 0, f$2 = f$2 | 0;
				var l$2 = 0, m$4 = 0;
				e: do
					if (!f$2) t$4 = 0;
					else {
						for (; l$2 = b$1[t$4 >> 0] | 0, m$4 = b$1[a$3 >> 0] | 0, l$2 << 24 >> 24 == m$4 << 24 >> 24;) if (f$2 = f$2 + -1 | 0, f$2) t$4 = t$4 + 1 | 0, a$3 = a$3 + 1 | 0;
						else {
							t$4 = 0;
							break e;
						}
						t$4 = (l$2 & 255) - (m$4 & 255) | 0;
					}
				while (!1);
				return t$4 | 0;
			}
			h(R$2, "m");
			function ne$1(t$4) {
				t$4 = t$4 | 0;
				e: do
					switch (t$4 << 16 >> 16) {
						case 38:
						case 37:
						case 33: {
							t$4 = 1;
							break;
						}
						default: if ((t$4 & -8) << 16 >> 16 == 40 | (t$4 + -58 & 65535) < 6) t$4 = 1;
						else {
							switch (t$4 << 16 >> 16) {
								case 91:
								case 93:
								case 94: {
									t$4 = 1;
									break e;
								}
								default:
							}
							t$4 = (t$4 + -123 & 65535) < 4;
						}
					}
				while (!1);
				return t$4 | 0;
			}
			h(ne$1, "I");
			function _t(t$4) {
				t$4 = t$4 | 0;
				e: do
					switch (t$4 << 16 >> 16) {
						case 38:
						case 37:
						case 33: break;
						default: if (!((t$4 + -58 & 65535) < 6 | (t$4 + -40 & 65535) < 7 & t$4 << 16 >> 16 != 41)) {
							switch (t$4 << 16 >> 16) {
								case 91:
								case 94: break e;
								default:
							}
							return t$4 << 16 >> 16 != 125 & (t$4 + -123 & 65535) < 4 | 0;
						}
					}
				while (!1);
				return 1;
			}
			h(_t, "U");
			function Ue$1(t$4) {
				t$4 = t$4 | 0;
				var a$3 = 0;
				a$3 = d$2[t$4 >> 1] | 0;
				e: do
					if ((a$3 + -9 & 65535) >= 5) {
						switch (a$3 << 16 >> 16) {
							case 160:
							case 32: {
								a$3 = 1;
								break e;
							}
							default:
						}
						if (ne$1(a$3) | 0) return a$3 << 16 >> 16 != 46 | (be$1(t$4) | 0) | 0;
						a$3 = 0;
					} else a$3 = 1;
				while (!1);
				return a$3 | 0;
			}
			h(Ue$1, "x");
			function Et(t$4) {
				t$4 = t$4 | 0;
				var a$3 = 0, f$2 = 0, l$2 = 0, m$4 = 0;
				return f$2 = _, _ = _ + 16 | 0, l$2 = f$2, n$2[l$2 >> 2] = 0, n$2[66] = t$4, a$3 = n$2[3] | 0, m$4 = a$3 + (t$4 << 1) | 0, t$4 = m$4 + 2 | 0, d$2[m$4 >> 1] = 0, n$2[l$2 >> 2] = t$4, n$2[67] = t$4, n$2[59] = 0, n$2[63] = 0, n$2[61] = 0, n$2[60] = 0, n$2[65] = 0, n$2[62] = 0, _ = f$2, a$3 | 0;
			}
			h(Et, "S");
			function W$1(t$4, a$3, f$2, l$2) {
				t$4 = t$4 | 0, a$3 = a$3 | 0, f$2 = f$2 | 0, l$2 = l$2 | 0;
				var m$4 = 0, w = 0;
				m$4 = n$2[67] | 0, n$2[67] = m$4 + 20, w = n$2[65] | 0, n$2[(w | 0 ? w + 16 | 0 : 240) >> 2] = m$4, n$2[65] = m$4, n$2[m$4 >> 2] = t$4, n$2[m$4 + 4 >> 2] = a$3, n$2[m$4 + 8 >> 2] = f$2, n$2[m$4 + 12 >> 2] = l$2, n$2[m$4 + 16 >> 2] = 0, b$1[803] = 1;
			}
			h(W$1, "O");
			function L$1(t$4, a$3, f$2) {
				t$4 = t$4 | 0, a$3 = a$3 | 0, f$2 = f$2 | 0;
				var l$2 = 0, m$4 = 0;
				return l$2 = t$4 + (0 - f$2 << 1) | 0, m$4 = l$2 + 2 | 0, t$4 = n$2[3] | 0, m$4 >>> 0 >= t$4 >>> 0 && !(R$2(m$4, a$3, f$2 << 1) | 0) ? (m$4 | 0) == (t$4 | 0) ? t$4 = 1 : t$4 = Ue$1(l$2) | 0 : t$4 = 0, t$4 | 0;
			}
			h(L$1, "$");
			function Lt(t$4) {
				switch (t$4 = t$4 | 0, d$2[t$4 >> 1] | 0) {
					case 107: {
						t$4 = L$1(t$4 + -2 | 0, 150, 4) | 0;
						break;
					}
					case 101: {
						(d$2[t$4 + -2 >> 1] | 0) == 117 ? t$4 = L$1(t$4 + -4 | 0, 122, 6) | 0 : t$4 = 0;
						break;
					}
					default: t$4 = 0;
				}
				return t$4 | 0;
			}
			h(Lt, "j");
			function H$1(t$4, a$3) {
				t$4 = t$4 | 0, a$3 = a$3 | 0;
				var f$2 = 0;
				return f$2 = n$2[3] | 0, f$2 >>> 0 <= t$4 >>> 0 && (d$2[t$4 >> 1] | 0) == a$3 << 16 >> 16 ? (f$2 | 0) == (t$4 | 0) ? f$2 = 1 : f$2 = de$1(d$2[t$4 + -2 >> 1] | 0) | 0 : f$2 = 0, f$2 | 0;
			}
			h(H$1, "B");
			function de$1(t$4) {
				t$4 = t$4 | 0;
				e: do
					if ((t$4 + -9 & 65535) < 5) t$4 = 1;
					else {
						switch (t$4 << 16 >> 16) {
							case 32:
							case 160: {
								t$4 = 1;
								break e;
							}
							default:
						}
						t$4 = t$4 << 16 >> 16 != 46 & (ne$1(t$4) | 0);
					}
				while (!1);
				return t$4 | 0;
			}
			h(de$1, "E");
			function ge$1() {
				var t$4 = 0, a$3 = 0, f$2 = 0;
				t$4 = n$2[73] | 0, f$2 = n$2[72] | 0;
				e: for (; a$3 = f$2 + 2 | 0, !(f$2 >>> 0 >= t$4 >>> 0);) switch (d$2[a$3 >> 1] | 0) {
					case 13:
					case 10: break e;
					default: f$2 = a$3;
				}
				n$2[72] = a$3;
			}
			h(ge$1, "P");
			function U$1(t$4) {
				for (t$4 = t$4 | 0; !(P(t$4) | 0 || ne$1(t$4) | 0);) if (t$4 = (n$2[72] | 0) + 2 | 0, n$2[72] = t$4, t$4 = d$2[t$4 >> 1] | 0, !(t$4 << 16 >> 16)) {
					t$4 = 0;
					break;
				}
				return t$4 | 0;
			}
			h(U$1, "q");
			function Ot() {
				var t$4 = 0;
				switch (t$4 = n$2[(n$2[61] | 0) + 20 >> 2] | 0, t$4 | 0) {
					case 1: {
						t$4 = -1;
						break;
					}
					case 2: {
						t$4 = -2;
						break;
					}
					default: t$4 = t$4 - (n$2[3] | 0) >> 1;
				}
				return t$4 | 0;
			}
			h(Ot, "z");
			function At(t$4) {
				return t$4 = t$4 | 0, !(L$1(t$4, 196, 5) | 0) && !(L$1(t$4, 44, 3) | 0) ? t$4 = L$1(t$4, 206, 2) | 0 : t$4 = 1, t$4 | 0;
			}
			h(At, "D");
			function ie$1(t$4) {
				switch (t$4 = t$4 | 0, t$4 << 16 >> 16) {
					case 160:
					case 32:
					case 12:
					case 11:
					case 9: {
						t$4 = 1;
						break;
					}
					default: t$4 = 0;
				}
				return t$4 | 0;
			}
			h(ie$1, "F");
			function be$1(t$4) {
				return t$4 = t$4 | 0, (d$2[t$4 >> 1] | 0) == 46 && (d$2[t$4 + -2 >> 1] | 0) == 46 ? t$4 = (d$2[t$4 + -4 >> 1] | 0) == 46 : t$4 = 0, t$4 | 0;
			}
			h(be$1, "G");
			function X$1(t$4) {
				return t$4 = t$4 | 0, (n$2[3] | 0) == (t$4 | 0) ? t$4 = 1 : t$4 = Ue$1(t$4 + -2 | 0) | 0, t$4 | 0;
			}
			h(X$1, "H");
			function Rt$1() {
				var t$4 = 0;
				return t$4 = n$2[(n$2[62] | 0) + 12 >> 2] | 0, t$4 ? t$4 = t$4 - (n$2[3] | 0) >> 1 : t$4 = -1, t$4 | 0;
			}
			h(Rt$1, "J");
			function It$1() {
				var t$4 = 0;
				return t$4 = n$2[(n$2[61] | 0) + 12 >> 2] | 0, t$4 ? t$4 = t$4 - (n$2[3] | 0) >> 1 : t$4 = -1, t$4 | 0;
			}
			h(It$1, "K");
			function Nt$1() {
				var t$4 = 0;
				return t$4 = n$2[(n$2[62] | 0) + 8 >> 2] | 0, t$4 ? t$4 = t$4 - (n$2[3] | 0) >> 1 : t$4 = -1, t$4 | 0;
			}
			h(Nt$1, "L");
			function Mt$1() {
				var t$4 = 0;
				return t$4 = n$2[(n$2[61] | 0) + 16 >> 2] | 0, t$4 ? t$4 = t$4 - (n$2[3] | 0) >> 1 : t$4 = -1, t$4 | 0;
			}
			h(Mt$1, "M");
			function $t() {
				var t$4 = 0;
				return t$4 = n$2[(n$2[61] | 0) + 4 >> 2] | 0, t$4 ? t$4 = t$4 - (n$2[3] | 0) >> 1 : t$4 = -1, t$4 | 0;
			}
			h($t, "N");
			function jt() {
				var t$4 = 0;
				return t$4 = n$2[61] | 0, t$4 = n$2[(t$4 | 0 ? t$4 + 32 | 0 : 236) >> 2] | 0, n$2[61] = t$4, (t$4 | 0) != 0 | 0;
			}
			h(jt, "Q");
			function Ut$1() {
				var t$4 = 0;
				return t$4 = n$2[62] | 0, t$4 = n$2[(t$4 | 0 ? t$4 + 16 | 0 : 240) >> 2] | 0, n$2[62] = t$4, (t$4 | 0) != 0 | 0;
			}
			h(Ut$1, "R");
			function M$1() {
				b$1[802] = 1, n$2[68] = (n$2[72] | 0) - (n$2[3] | 0) >> 1, n$2[72] = (n$2[73] | 0) + 2;
			}
			h(M$1, "T");
			function P(t$4) {
				return t$4 = t$4 | 0, (t$4 | 128) << 16 >> 16 == 160 | (t$4 + -9 & 65535) < 5 | 0;
			}
			h(P, "V");
			function K$1(t$4) {
				return t$4 = t$4 | 0, t$4 << 16 >> 16 == 39 | t$4 << 16 >> 16 == 34 | 0;
			}
			h(K$1, "W");
			function Tt() {
				return (n$2[(n$2[61] | 0) + 8 >> 2] | 0) - (n$2[3] | 0) >> 1 | 0;
			}
			h(Tt, "X");
			function Dt() {
				return (n$2[(n$2[62] | 0) + 4 >> 2] | 0) - (n$2[3] | 0) >> 1 | 0;
			}
			h(Dt, "Y");
			function Te$1(t$4) {
				return t$4 = t$4 | 0, t$4 << 16 >> 16 == 13 | t$4 << 16 >> 16 == 10 | 0;
			}
			h(Te$1, "Z");
			function Ft$1() {
				return (n$2[n$2[61] >> 2] | 0) - (n$2[3] | 0) >> 1 | 0;
			}
			h(Ft$1, "_");
			function Bt$1() {
				return (n$2[n$2[62] >> 2] | 0) - (n$2[3] | 0) >> 1 | 0;
			}
			h(Bt$1, "ee");
			function Wt$1() {
				return A$1[(n$2[61] | 0) + 24 >> 0] | 0;
			}
			h(Wt$1, "ae");
			function Pt(t$4) {
				t$4 = t$4 | 0, n$2[3] = t$4;
			}
			h(Pt, "re");
			function Jt$1() {
				return n$2[(n$2[61] | 0) + 28 >> 2] | 0;
			}
			h(Jt$1, "ie");
			function Gt$1() {
				return (b$1[803] | 0) != 0 | 0;
			}
			h(Gt$1, "se");
			function qt$1() {
				return (b$1[804] | 0) != 0 | 0;
			}
			h(qt$1, "fe");
			function zt$1() {
				return n$2[68] | 0;
			}
			h(zt$1, "te");
			function Ht$1(t$4) {
				return t$4 = t$4 | 0, _ = t$4 + 992 + 15 & -16, 992;
			}
			return h(Ht$1, "ce"), {
				su: Ht$1,
				ai: Mt$1,
				e: zt$1,
				ee: Dt,
				ele: Rt$1,
				els: Nt$1,
				es: Bt$1,
				f: qt$1,
				id: Ot,
				ie: $t,
				ip: Wt$1,
				is: Ft$1,
				it: Jt$1,
				ms: Gt$1,
				p: I$2,
				re: Ut$1,
				ri: jt,
				sa: Et,
				se: It$1,
				ses: Pt,
				ss: Tt
			};
		}(typeof self < "u" ? self : global, {}, se$1), Se = x.su(Z - (2 << 17));
	}
	const i$4 = E$1.length + 1;
	x.ses(Se), x.sa(i$4 - 1), Ge$1(E$1, new Uint16Array(se$1, Se, i$4)), x.p() || (y = x.e(), T$1());
	const o$3 = [], c$2 = [];
	for (; x.ri();) {
		const u$3 = x.is(), p$2 = x.ie(), g$1 = x.ai(), b$1 = x.id(), d$2 = x.ss(), n$2 = x.se(), A$1 = x.it();
		let O$1;
		x.ip() && (O$1 = ve$1(b$1 === -1 ? u$3 : u$3 + 1, E$1.charCodeAt(b$1 === -1 ? u$3 - 1 : u$3))), o$3.push({
			t: A$1,
			n: O$1,
			s: u$3,
			e: p$2,
			ss: d$2,
			se: n$2,
			d: b$1,
			a: g$1
		});
	}
	for (; x.re();) {
		const u$3 = x.es(), p$2 = x.ee(), g$1 = x.els(), b$1 = x.ele(), d$2 = E$1.charCodeAt(u$3), n$2 = g$1 >= 0 ? E$1.charCodeAt(g$1) : -1;
		c$2.push({
			s: u$3,
			e: p$2,
			ls: g$1,
			le: b$1,
			n: d$2 === 34 || d$2 === 39 ? ve$1(u$3 + 1, d$2) : E$1.slice(u$3, p$2),
			ln: g$1 < 0 ? void 0 : n$2 === 34 || n$2 === 39 ? ve$1(g$1 + 1, n$2) : E$1.slice(g$1, b$1)
		});
	}
	return [
		o$3,
		c$2,
		!!x.f(),
		!!x.ms()
	];
}
h(wr, "parse");
function ve$1(s$2, e$3) {
	y = s$2;
	let r$1 = "", i$4 = y;
	for (;;) {
		y >= E$1.length && T$1();
		const o$3 = E$1.charCodeAt(y);
		if (o$3 === e$3) break;
		o$3 === 92 ? (r$1 += E$1.slice(i$4, y), r$1 += kr(), i$4 = y) : (o$3 === 8232 || o$3 === 8233 || ze$1(o$3) && T$1(), ++y);
	}
	return r$1 += E$1.slice(i$4, y++), r$1;
}
h(ve$1, "b");
function kr() {
	let s$2 = E$1.charCodeAt(++y);
	switch (++y, s$2) {
		case 110: return `
`;
		case 114: return "\r";
		case 120: return String.fromCharCode(xe$1(2));
		case 117: return function() {
			const e$3 = E$1.charCodeAt(y);
			let r$1;
			return e$3 === 123 ? (++y, r$1 = xe$1(E$1.indexOf("}", y) - y), ++y, r$1 > 1114111 && T$1()) : r$1 = xe$1(4), r$1 <= 65535 ? String.fromCharCode(r$1) : (r$1 -= 65536, String.fromCharCode(55296 + (r$1 >> 10), 56320 + (1023 & r$1)));
		}();
		case 116: return "	";
		case 98: return "\b";
		case 118: return "\v";
		case 102: return "\f";
		case 13: E$1.charCodeAt(y) === 10 && ++y;
		case 10: return "";
		case 56:
		case 57: T$1();
		default:
			if (s$2 >= 48 && s$2 <= 55) {
				let e$3 = E$1.substr(y - 1, 3).match(/^[0-7]+/)[0], r$1 = parseInt(e$3, 8);
				return r$1 > 255 && (e$3 = e$3.slice(0, -1), r$1 = parseInt(e$3, 8)), y += e$3.length - 1, s$2 = E$1.charCodeAt(y), e$3 === "0" && s$2 !== 56 && s$2 !== 57 || T$1(), String.fromCharCode(r$1);
			}
			return ze$1(s$2) ? "" : String.fromCharCode(s$2);
	}
}
h(kr, "k");
function xe$1(s$2) {
	const e$3 = y;
	let r$1 = 0, i$4 = 0;
	for (let o$3 = 0; o$3 < s$2; ++o$3, ++y) {
		let c$2, u$3 = E$1.charCodeAt(y);
		if (u$3 !== 95) {
			if (u$3 >= 97) c$2 = u$3 - 97 + 10;
			else if (u$3 >= 65) c$2 = u$3 - 65 + 10;
			else {
				if (!(u$3 >= 48 && u$3 <= 57)) break;
				c$2 = u$3 - 48;
			}
			if (c$2 >= 16) break;
			i$4 = u$3, r$1 = 16 * r$1 + c$2;
		} else i$4 !== 95 && o$3 !== 0 || T$1(), i$4 = u$3;
	}
	return i$4 !== 95 && y - e$3 === s$2 || T$1(), r$1;
}
h(xe$1, "l");
function ze$1(s$2) {
	return s$2 === 13 || s$2 === 10;
}
h(ze$1, "u");
function T$1() {
	throw Object.assign(Error(`Parse error ${qe$1}:${E$1.slice(0, y).split(`
`).length}:${y - E$1.lastIndexOf(`
`, y - 1)}`), { idx: y });
}
h(T$1, "o");
let _e$1;
typeof WebAssembly < "u" && (async () => {
	const { parse: s$2, init: e$3 } = await import("./lexer-DQCqS3nf-Cbp6RgKt.js");
	await e$3, _e$1 = s$2;
})();
const Ee$1 = h((s$2, e$3) => _e$1 ? _e$1(s$2, e$3) : wr(s$2, e$3), "parseEsm"), yr = h((s$2) => {
	if (!s$2.includes("import") && !s$2.includes("export")) return !1;
	try {
		return Ee$1(s$2)[3];
	} catch {
		return !0;
	}
}, "isESM"), Le$1 = "2", Cr = ((s$2) => {
	const e$3 = "default";
	return s$2[e$3] && typeof s$2[e$3] == "object" && "__esModule" in s$2[e$3] ? s$2[e$3] : s$2;
}).toString(), Sr = `.then(${Cr})`, oe$1 = h((s$2, e$3, r$1) => {
	if (r$1) {
		if (!e$3.includes("import(")) return;
	} else if (!e$3.includes("import")) return;
	const o$3 = Ee$1(e$3, s$2)[0].filter((g$1) => g$1.d > -1);
	if (o$3.length === 0) return;
	const c$2 = new Me$1(e$3);
	for (const g$1 of o$3) c$2.appendRight(g$1.se, Sr);
	const u$3 = c$2.toString(), p$2 = c$2.generateMap({
		source: s$2,
		includeContent: !1,
		hires: "boundary"
	});
	return {
		code: u$3,
		map: p$2
	};
}, "transformDynamicImport"), He$1 = h((s$2) => {
	try {
		const e$3 = fs.readFileSync(s$2, "utf8");
		return JSON.parse(e$3);
	} catch {}
}, "readJsonFile"), Xe$1 = h(() => {}, "noop"), Ke$1 = h(() => Math.floor(Date.now() / 1e8), "getTime");
var vr = class extends Map {
	static {
		h(this, "FileCache");
	}
	cacheDirectory = e$2;
	oldCacheDirectory = path.join(os.tmpdir(), "tsx");
	cacheFiles;
	constructor() {
		super(), fs.mkdirSync(this.cacheDirectory, { recursive: !0 }), this.cacheFiles = fs.readdirSync(this.cacheDirectory).map((e$3) => {
			const [r$1, i$4] = e$3.split("-");
			return {
				time: Number(r$1),
				key: i$4,
				fileName: e$3
			};
		}), setImmediate(() => {
			this.expireDiskCache(), this.removeOldCacheDirectory();
		});
	}
	get(e$3) {
		const r$1 = super.get(e$3);
		if (r$1) return r$1;
		const i$4 = this.cacheFiles.find((u$3) => u$3.key === e$3);
		if (!i$4) return;
		const o$3 = path.join(this.cacheDirectory, i$4.fileName), c$2 = He$1(o$3);
		if (!c$2) {
			fs.promises.unlink(o$3).then(() => {
				const u$3 = this.cacheFiles.indexOf(i$4);
				this.cacheFiles.splice(u$3, 1);
			}, () => {});
			return;
		}
		return super.set(e$3, c$2), c$2;
	}
	set(e$3, r$1) {
		if (super.set(e$3, r$1), r$1) {
			const i$4 = Ke$1();
			fs.promises.writeFile(path.join(this.cacheDirectory, `${i$4}-${e$3}`), JSON.stringify(r$1)).catch(Xe$1);
		}
		return this;
	}
	expireDiskCache() {
		const e$3 = Ke$1();
		for (const r$1 of this.cacheFiles) e$3 - r$1.time > 7 && fs.promises.unlink(path.join(this.cacheDirectory, r$1.fileName)).catch(Xe$1);
	}
	async removeOldCacheDirectory() {
		try {
			await fs.promises.access(this.oldCacheDirectory).then(() => !0) && ("rm" in fs.promises ? await fs.promises.rm(this.oldCacheDirectory, {
				recursive: !0,
				force: !0
			}) : await fs.promises.rmdir(this.oldCacheDirectory, { recursive: !0 }));
		} catch {}
	}
};
var q = process.env.TSX_DISABLE_CACHE ? new Map() : new vr();
const Ye$1 = 44, xr = 59, Qe$1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Ze$1 = new Uint8Array(64), Ve$1 = new Uint8Array(128);
for (let s$2 = 0; s$2 < Qe$1.length; s$2++) {
	const e$3 = Qe$1.charCodeAt(s$2);
	Ze$1[s$2] = e$3, Ve$1[e$3] = s$2;
}
const Oe = typeof TextDecoder < "u" ? new TextDecoder() : typeof Buffer < "u" ? { decode(s$2) {
	return Buffer.from(s$2.buffer, s$2.byteOffset, s$2.byteLength).toString();
} } : { decode(s$2) {
	let e$3 = "";
	for (let r$1 = 0; r$1 < s$2.length; r$1++) e$3 += String.fromCharCode(s$2[r$1]);
	return e$3;
} };
function _r(s$2) {
	const e$3 = new Int32Array(5), r$1 = [];
	let i$4 = 0;
	do {
		const o$3 = Er(s$2, i$4), c$2 = [];
		let u$3 = !0, p$2 = 0;
		e$3[0] = 0;
		for (let g$1 = i$4; g$1 < o$3; g$1++) {
			let b$1;
			g$1 = V$1(s$2, g$1, e$3, 0);
			const d$2 = e$3[0];
			d$2 < p$2 && (u$3 = !1), p$2 = d$2, et$1(s$2, g$1, o$3) ? (g$1 = V$1(s$2, g$1, e$3, 1), g$1 = V$1(s$2, g$1, e$3, 2), g$1 = V$1(s$2, g$1, e$3, 3), et$1(s$2, g$1, o$3) ? (g$1 = V$1(s$2, g$1, e$3, 4), b$1 = [
				d$2,
				e$3[1],
				e$3[2],
				e$3[3],
				e$3[4]
			]) : b$1 = [
				d$2,
				e$3[1],
				e$3[2],
				e$3[3]
			]) : b$1 = [d$2], c$2.push(b$1);
		}
		u$3 || Lr(c$2), r$1.push(c$2), i$4 = o$3 + 1;
	} while (i$4 <= s$2.length);
	return r$1;
}
h(_r, "decode");
function Er(s$2, e$3) {
	const r$1 = s$2.indexOf(";", e$3);
	return r$1 === -1 ? s$2.length : r$1;
}
h(Er, "indexOf");
function V$1(s$2, e$3, r$1, i$4) {
	let o$3 = 0, c$2 = 0, u$3 = 0;
	do {
		const g$1 = s$2.charCodeAt(e$3++);
		u$3 = Ve$1[g$1], o$3 |= (u$3 & 31) << c$2, c$2 += 5;
	} while (u$3 & 32);
	const p$2 = o$3 & 1;
	return o$3 >>>= 1, p$2 && (o$3 = -2147483648 | -o$3), r$1[i$4] += o$3, e$3;
}
h(V$1, "decodeInteger");
function et$1(s$2, e$3, r$1) {
	return e$3 >= r$1 ? !1 : s$2.charCodeAt(e$3) !== Ye$1;
}
h(et$1, "hasMoreVlq");
function Lr(s$2) {
	s$2.sort(Or);
}
h(Lr, "sort");
function Or(s$2, e$3) {
	return s$2[0] - e$3[0];
}
h(Or, "sortComparator$1");
function Ar(s$2) {
	const e$3 = new Int32Array(5), r$1 = 1024 * 16, i$4 = r$1 - 36, o$3 = new Uint8Array(r$1), c$2 = o$3.subarray(0, i$4);
	let u$3 = 0, p$2 = "";
	for (let g$1 = 0; g$1 < s$2.length; g$1++) {
		const b$1 = s$2[g$1];
		if (g$1 > 0 && (u$3 === r$1 && (p$2 += Oe.decode(o$3), u$3 = 0), o$3[u$3++] = xr), b$1.length !== 0) {
			e$3[0] = 0;
			for (let d$2 = 0; d$2 < b$1.length; d$2++) {
				const n$2 = b$1[d$2];
				u$3 > i$4 && (p$2 += Oe.decode(c$2), o$3.copyWithin(0, i$4, u$3), u$3 -= i$4), d$2 > 0 && (o$3[u$3++] = Ye$1), u$3 = ee$1(o$3, u$3, e$3, n$2, 0), n$2.length !== 1 && (u$3 = ee$1(o$3, u$3, e$3, n$2, 1), u$3 = ee$1(o$3, u$3, e$3, n$2, 2), u$3 = ee$1(o$3, u$3, e$3, n$2, 3), n$2.length !== 4 && (u$3 = ee$1(o$3, u$3, e$3, n$2, 4)));
			}
		}
	}
	return p$2 + Oe.decode(o$3.subarray(0, u$3));
}
h(Ar, "encode");
function ee$1(s$2, e$3, r$1, i$4, o$3) {
	const c$2 = i$4[o$3];
	let u$3 = c$2 - r$1[o$3];
	r$1[o$3] = c$2, u$3 = u$3 < 0 ? -u$3 << 1 | 1 : u$3 << 1;
	do {
		let p$2 = u$3 & 31;
		u$3 >>>= 5, u$3 > 0 && (p$2 |= 32), s$2[e$3++] = Ze$1[p$2];
	} while (u$3 > 0);
	return e$3;
}
h(ee$1, "encodeInteger");
const Rr = /^[\w+.-]+:\/\//, Ir = /^([\w+.-]+:)\/\/([^@/#?]*@)?([^:/#?]*)(:\d+)?(\/[^#?]*)?(\?[^#]*)?(#.*)?/, Nr = /^file:(?:\/\/((?![a-z]:)[^/#?]*)?)?(\/?[^#?]*)(\?[^#]*)?(#.*)?/i;
function Mr(s$2) {
	return Rr.test(s$2);
}
h(Mr, "isAbsoluteUrl");
function $r(s$2) {
	return s$2.startsWith("//");
}
h($r, "isSchemeRelativeUrl");
function tt$1(s$2) {
	return s$2.startsWith("/");
}
h(tt$1, "isAbsolutePath");
function jr(s$2) {
	return s$2.startsWith("file:");
}
h(jr, "isFileUrl");
function rt$1(s$2) {
	return /^[.?#]/.test(s$2);
}
h(rt$1, "isRelative");
function ae$1(s$2) {
	const e$3 = Ir.exec(s$2);
	return nt$1(e$3[1], e$3[2] || "", e$3[3], e$3[4] || "", e$3[5] || "/", e$3[6] || "", e$3[7] || "");
}
h(ae$1, "parseAbsoluteUrl");
function Ur(s$2) {
	const e$3 = Nr.exec(s$2), r$1 = e$3[2];
	return nt$1("file:", "", e$3[1] || "", "", tt$1(r$1) ? r$1 : "/" + r$1, e$3[3] || "", e$3[4] || "");
}
h(Ur, "parseFileUrl");
function nt$1(s$2, e$3, r$1, i$4, o$3, c$2, u$3) {
	return {
		scheme: s$2,
		user: e$3,
		host: r$1,
		port: i$4,
		path: o$3,
		query: c$2,
		hash: u$3,
		type: 7
	};
}
h(nt$1, "makeUrl");
function it$1(s$2) {
	if ($r(s$2)) {
		const r$1 = ae$1("http:" + s$2);
		return r$1.scheme = "", r$1.type = 6, r$1;
	}
	if (tt$1(s$2)) {
		const r$1 = ae$1("http://foo.com" + s$2);
		return r$1.scheme = "", r$1.host = "", r$1.type = 5, r$1;
	}
	if (jr(s$2)) return Ur(s$2);
	if (Mr(s$2)) return ae$1(s$2);
	const e$3 = ae$1("http://foo.com/" + s$2);
	return e$3.scheme = "", e$3.host = "", e$3.type = s$2 ? s$2.startsWith("?") ? 3 : s$2.startsWith("#") ? 2 : 4 : 1, e$3;
}
h(it$1, "parseUrl");
function Tr(s$2) {
	if (s$2.endsWith("/..")) return s$2;
	const e$3 = s$2.lastIndexOf("/");
	return s$2.slice(0, e$3 + 1);
}
h(Tr, "stripPathFilename");
function Dr(s$2, e$3) {
	st$1(e$3, e$3.type), s$2.path === "/" ? s$2.path = e$3.path : s$2.path = Tr(e$3.path) + s$2.path;
}
h(Dr, "mergePaths");
function st$1(s$2, e$3) {
	const r$1 = e$3 <= 4, i$4 = s$2.path.split("/");
	let o$3 = 1, c$2 = 0, u$3 = !1;
	for (let g$1 = 1; g$1 < i$4.length; g$1++) {
		const b$1 = i$4[g$1];
		if (!b$1) {
			u$3 = !0;
			continue;
		}
		if (u$3 = !1, b$1 !== ".") {
			if (b$1 === "..") {
				c$2 ? (u$3 = !0, c$2--, o$3--) : r$1 && (i$4[o$3++] = b$1);
				continue;
			}
			i$4[o$3++] = b$1, c$2++;
		}
	}
	let p$2 = "";
	for (let g$1 = 1; g$1 < o$3; g$1++) p$2 += "/" + i$4[g$1];
	(!p$2 || u$3 && !p$2.endsWith("/..")) && (p$2 += "/"), s$2.path = p$2;
}
h(st$1, "normalizePath");
function Fr(s$2, e$3) {
	if (!s$2 && !e$3) return "";
	const r$1 = it$1(s$2);
	let i$4 = r$1.type;
	if (e$3 && i$4 !== 7) {
		const c$2 = it$1(e$3), u$3 = c$2.type;
		switch (i$4) {
			case 1: r$1.hash = c$2.hash;
			case 2: r$1.query = c$2.query;
			case 3:
			case 4: Dr(r$1, c$2);
			case 5: r$1.user = c$2.user, r$1.host = c$2.host, r$1.port = c$2.port;
			case 6: r$1.scheme = c$2.scheme;
		}
		u$3 > i$4 && (i$4 = u$3);
	}
	st$1(r$1, i$4);
	const o$3 = r$1.query + r$1.hash;
	switch (i$4) {
		case 2:
		case 3: return o$3;
		case 4: {
			const c$2 = r$1.path.slice(1);
			return c$2 ? rt$1(e$3 || s$2) && !rt$1(c$2) ? "./" + c$2 + o$3 : c$2 + o$3 : o$3 || ".";
		}
		case 5: return r$1.path + o$3;
		default: return r$1.scheme + "//" + r$1.user + r$1.host + r$1.port + r$1.path + o$3;
	}
}
h(Fr, "resolve$1");
function ot$1(s$2, e$3) {
	return e$3 && !e$3.endsWith("/") && (e$3 += "/"), Fr(s$2, e$3);
}
h(ot$1, "resolve");
function Br(s$2) {
	if (!s$2) return "";
	const e$3 = s$2.lastIndexOf("/");
	return s$2.slice(0, e$3 + 1);
}
h(Br, "stripFilename");
const F$1 = 0;
function Wr(s$2, e$3) {
	const r$1 = at$1(s$2, 0);
	if (r$1 === s$2.length) return s$2;
	e$3 || (s$2 = s$2.slice());
	for (let i$4 = r$1; i$4 < s$2.length; i$4 = at$1(s$2, i$4 + 1)) s$2[i$4] = Jr(s$2[i$4], e$3);
	return s$2;
}
h(Wr, "maybeSort");
function at$1(s$2, e$3) {
	for (let r$1 = e$3; r$1 < s$2.length; r$1++) if (!Pr(s$2[r$1])) return r$1;
	return s$2.length;
}
h(at$1, "nextUnsortedSegmentLine");
function Pr(s$2) {
	for (let e$3 = 1; e$3 < s$2.length; e$3++) if (s$2[e$3][F$1] < s$2[e$3 - 1][F$1]) return !1;
	return !0;
}
h(Pr, "isSorted");
function Jr(s$2, e$3) {
	return e$3 || (s$2 = s$2.slice()), s$2.sort(Gr);
}
h(Jr, "sortSegments");
function Gr(s$2, e$3) {
	return s$2[F$1] - e$3[F$1];
}
h(Gr, "sortComparator");
let ce$1 = !1;
function qr(s$2, e$3, r$1, i$4) {
	for (; r$1 <= i$4;) {
		const o$3 = r$1 + (i$4 - r$1 >> 1), c$2 = s$2[o$3][F$1] - e$3;
		if (c$2 === 0) return ce$1 = !0, o$3;
		c$2 < 0 ? r$1 = o$3 + 1 : i$4 = o$3 - 1;
	}
	return ce$1 = !1, r$1 - 1;
}
h(qr, "binarySearch");
function zr(s$2, e$3, r$1) {
	for (let i$4 = r$1 - 1; i$4 >= 0 && s$2[i$4][F$1] === e$3; r$1 = i$4--);
	return r$1;
}
h(zr, "lowerBound");
function Hr() {
	return {
		lastKey: -1,
		lastNeedle: -1,
		lastIndex: -1
	};
}
h(Hr, "memoizedState");
function Xr(s$2, e$3, r$1, i$4) {
	const { lastKey: o$3, lastNeedle: c$2, lastIndex: u$3 } = r$1;
	let p$2 = 0, g$1 = s$2.length - 1;
	if (i$4 === o$3) {
		if (e$3 === c$2) return ce$1 = u$3 !== -1 && s$2[u$3][F$1] === e$3, u$3;
		e$3 >= c$2 ? p$2 = u$3 === -1 ? 0 : u$3 : g$1 = u$3;
	}
	return r$1.lastKey = i$4, r$1.lastNeedle = e$3, r$1.lastIndex = qr(s$2, e$3, p$2, g$1);
}
h(Xr, "memoizedBinarySearch");
var ct$1 = class {
	static {
		h(this, "TraceMap");
	}
	constructor(e$3, r$1) {
		const i$4 = typeof e$3 == "string";
		if (!i$4 && e$3._decodedMemo) return e$3;
		const o$3 = i$4 ? JSON.parse(e$3) : e$3, { version: c$2, file: u$3, names: p$2, sourceRoot: g$1, sources: b$1, sourcesContent: d$2 } = o$3;
		this.version = c$2, this.file = u$3, this.names = p$2 || [], this.sourceRoot = g$1, this.sources = b$1, this.sourcesContent = d$2, this.ignoreList = o$3.ignoreList || o$3.x_google_ignoreList || void 0;
		const n$2 = ot$1(g$1 || "", Br(r$1));
		this.resolvedSources = b$1.map((O$1) => ot$1(O$1 || "", n$2));
		const { mappings: A$1 } = o$3;
		typeof A$1 == "string" ? (this._encoded = A$1, this._decoded = void 0) : (this._encoded = void 0, this._decoded = Wr(A$1, i$4)), this._decodedMemo = Hr(), this._bySources = void 0, this._bySourceMemos = void 0;
	}
};
function Fn$1(s$2) {
	return s$2;
}
h(Fn$1, "cast$2");
function ut$1(s$2) {
	var e$3;
	return (e$3 = s$2)._decoded || (e$3._decoded = _r(s$2._encoded));
}
h(ut$1, "decodedMappings");
function Kr(s$2, e$3, r$1) {
	const i$4 = ut$1(s$2);
	if (e$3 >= i$4.length) return null;
	const o$3 = i$4[e$3], c$2 = Yr(o$3, s$2._decodedMemo, e$3, r$1);
	return c$2 === -1 ? null : o$3[c$2];
}
h(Kr, "traceSegment");
function Yr(s$2, e$3, r$1, i$4, o$3) {
	let c$2 = Xr(s$2, i$4, e$3, r$1);
	return ce$1 && (c$2 = zr(s$2, i$4, c$2)), c$2 === -1 || c$2 === s$2.length ? -1 : c$2;
}
h(Yr, "traceSegmentInternal");
var Ae = class {
	static {
		h(this, "SetArray");
	}
	constructor() {
		this._indexes = { __proto__: null }, this.array = [];
	}
};
function Bn$1(s$2) {
	return s$2;
}
h(Bn$1, "cast$1");
function lt$1(s$2, e$3) {
	return s$2._indexes[e$3];
}
h(lt$1, "get");
function te$1(s$2, e$3) {
	const r$1 = lt$1(s$2, e$3);
	if (r$1 !== void 0) return r$1;
	const { array: i$4, _indexes: o$3 } = s$2, c$2 = i$4.push(e$3);
	return o$3[e$3] = c$2 - 1;
}
h(te$1, "put");
function Qr(s$2, e$3) {
	const r$1 = lt$1(s$2, e$3);
	if (r$1 === void 0) return;
	const { array: i$4, _indexes: o$3 } = s$2;
	for (let c$2 = r$1 + 1; c$2 < i$4.length; c$2++) {
		const u$3 = i$4[c$2];
		i$4[c$2 - 1] = u$3, o$3[u$3]--;
	}
	o$3[e$3] = void 0, i$4.pop();
}
h(Qr, "remove");
const Zr = 0, Vr = 1, en$1 = 2, tn$1 = 3, rn$1 = 4, ft$1 = -1;
var nn$1 = class {
	static {
		h(this, "GenMapping");
	}
	constructor({ file: e$3, sourceRoot: r$1 } = {}) {
		this._names = new Ae(), this._sources = new Ae(), this._sourcesContent = [], this._mappings = [], this.file = e$3, this.sourceRoot = r$1, this._ignoreList = new Ae();
	}
};
function Wn$1(s$2) {
	return s$2;
}
h(Wn$1, "cast");
const sn$1 = h((s$2, e$3, r$1, i$4, o$3, c$2, u$3, p$2) => un$1(!0, s$2, e$3, r$1, i$4, o$3, c$2, u$3), "maybeAddSegment");
function on$1(s$2, e$3, r$1) {
	const { _sources: i$4, _sourcesContent: o$3 } = s$2, c$2 = te$1(i$4, e$3);
	o$3[c$2] = r$1;
}
h(on$1, "setSourceContent");
function an$1(s$2, e$3, r$1 = !0) {
	const { _sources: i$4, _sourcesContent: o$3, _ignoreList: c$2 } = s$2, u$3 = te$1(i$4, e$3);
	u$3 === o$3.length && (o$3[u$3] = null), r$1 ? te$1(c$2, u$3) : Qr(c$2, u$3);
}
h(an$1, "setIgnore");
function ht$1(s$2) {
	const { _mappings: e$3, _sources: r$1, _sourcesContent: i$4, _names: o$3, _ignoreList: c$2 } = s$2;
	return hn$1(e$3), {
		version: 3,
		file: s$2.file || void 0,
		names: o$3.array,
		sourceRoot: s$2.sourceRoot || void 0,
		sources: r$1.array,
		sourcesContent: i$4,
		mappings: e$3,
		ignoreList: c$2.array
	};
}
h(ht$1, "toDecodedMap");
function cn$1(s$2) {
	const e$3 = ht$1(s$2);
	return Object.assign(Object.assign({}, e$3), { mappings: Ar(e$3.mappings) });
}
h(cn$1, "toEncodedMap");
function un$1(s$2, e$3, r$1, i$4, o$3, c$2, u$3, p$2, g$1) {
	const { _mappings: b$1, _sources: d$2, _sourcesContent: n$2, _names: A$1 } = e$3, O$1 = ln$1(b$1, r$1), _ = fn$1(O$1, i$4);
	if (!o$3) return dn$1(O$1, _) ? void 0 : dt$1(O$1, _, [i$4]);
	const I$2 = te$1(d$2, o$3), $ = p$2 ? te$1(A$1, p$2) : ft$1;
	if (I$2 === n$2.length && (n$2[I$2] = null), !gn$1(O$1, _, I$2, c$2, u$3, $)) return dt$1(O$1, _, p$2 ? [
		i$4,
		I$2,
		c$2,
		u$3,
		$
	] : [
		i$4,
		I$2,
		c$2,
		u$3
	]);
}
h(un$1, "addSegmentInternal");
function ln$1(s$2, e$3) {
	for (let r$1 = s$2.length; r$1 <= e$3; r$1++) s$2[r$1] = [];
	return s$2[e$3];
}
h(ln$1, "getLine");
function fn$1(s$2, e$3) {
	let r$1 = s$2.length;
	for (let i$4 = r$1 - 1; i$4 >= 0; r$1 = i$4--) {
		const o$3 = s$2[i$4];
		if (e$3 >= o$3[Zr]) break;
	}
	return r$1;
}
h(fn$1, "getColumnIndex");
function dt$1(s$2, e$3, r$1) {
	for (let i$4 = s$2.length; i$4 > e$3; i$4--) s$2[i$4] = s$2[i$4 - 1];
	s$2[e$3] = r$1;
}
h(dt$1, "insert");
function hn$1(s$2) {
	const { length: e$3 } = s$2;
	let r$1 = e$3;
	for (let i$4 = r$1 - 1; i$4 >= 0 && !(s$2[i$4].length > 0); r$1 = i$4, i$4--);
	r$1 < e$3 && (s$2.length = r$1);
}
h(hn$1, "removeEmptyFinalLines");
function dn$1(s$2, e$3) {
	return e$3 === 0 ? !0 : s$2[e$3 - 1].length === 1;
}
h(dn$1, "skipSourceless");
function gn$1(s$2, e$3, r$1, i$4, o$3, c$2) {
	if (e$3 === 0) return !1;
	const u$3 = s$2[e$3 - 1];
	return u$3.length === 1 ? !1 : r$1 === u$3[Vr] && i$4 === u$3[en$1] && o$3 === u$3[tn$1] && c$2 === (u$3.length === 5 ? u$3[rn$1] : ft$1);
}
h(gn$1, "skipSource");
const gt$1 = bt("", -1, -1, "", null, !1), bn$1 = [];
function bt(s$2, e$3, r$1, i$4, o$3, c$2) {
	return {
		source: s$2,
		line: e$3,
		column: r$1,
		name: i$4,
		content: o$3,
		ignore: c$2
	};
}
h(bt, "SegmentObject");
function pt$1(s$2, e$3, r$1, i$4, o$3) {
	return {
		map: s$2,
		sources: e$3,
		source: r$1,
		content: i$4,
		ignore: o$3
	};
}
h(pt$1, "Source");
function mt$1(s$2, e$3) {
	return pt$1(s$2, e$3, "", null, !1);
}
h(mt$1, "MapSource");
function pn$1(s$2, e$3, r$1) {
	return pt$1(null, bn$1, s$2, e$3, r$1);
}
h(pn$1, "OriginalSource");
function mn$1(s$2) {
	const e$3 = new nn$1({ file: s$2.map.file }), { sources: r$1, map: i$4 } = s$2, o$3 = i$4.names, c$2 = ut$1(i$4);
	for (let u$3 = 0; u$3 < c$2.length; u$3++) {
		const p$2 = c$2[u$3];
		for (let g$1 = 0; g$1 < p$2.length; g$1++) {
			const b$1 = p$2[g$1], d$2 = b$1[0];
			let n$2 = gt$1;
			if (b$1.length !== 1) {
				const z$1 = r$1[b$1[1]];
				if (n$2 = wt(z$1, b$1[2], b$1[3], b$1.length === 5 ? o$3[b$1[4]] : ""), n$2 == null) continue;
			}
			const { column: A$1, line: O$1, name: _, content: I$2, source: $, ignore: B } = n$2;
			sn$1(e$3, u$3, d$2, $, O$1, A$1, _), $ && I$2 != null && on$1(e$3, $, I$2), B && an$1(e$3, $, !0);
		}
	}
	return e$3;
}
h(mn$1, "traceMappings");
function wt(s$2, e$3, r$1, i$4) {
	if (!s$2.map) return bt(s$2.source, e$3, r$1, i$4, s$2.content, s$2.ignore);
	const o$3 = Kr(s$2.map, e$3, r$1);
	return o$3 == null ? null : o$3.length === 1 ? gt$1 : wt(s$2.sources[o$3[1]], o$3[2], o$3[3], o$3.length === 5 ? s$2.map.names[o$3[4]] : i$4);
}
h(wt, "originalPositionFor");
function wn$1(s$2) {
	return Array.isArray(s$2) ? s$2 : [s$2];
}
h(wn$1, "asArray");
function kn$1(s$2, e$3) {
	const r$1 = wn$1(s$2).map((c$2) => new ct$1(c$2, "")), i$4 = r$1.pop();
	for (let c$2 = 0; c$2 < r$1.length; c$2++) if (r$1[c$2].sources.length > 1) throw new Error(`Transformation map ${c$2} must have exactly one source file.
Did you specify these with the most recent transformation maps first?`);
	let o$3 = kt$1(i$4, e$3, "", 0);
	for (let c$2 = r$1.length - 1; c$2 >= 0; c$2--) o$3 = mt$1(r$1[c$2], [o$3]);
	return o$3;
}
h(kn$1, "buildSourceMapTree");
function kt$1(s$2, e$3, r$1, i$4) {
	const { resolvedSources: o$3, sourcesContent: c$2, ignoreList: u$3 } = s$2, p$2 = i$4 + 1, g$1 = o$3.map((b$1, d$2) => {
		const n$2 = {
			importer: r$1,
			depth: p$2,
			source: b$1 || "",
			content: void 0,
			ignore: void 0
		}, A$1 = e$3(n$2.source, n$2), { source: O$1, content: _, ignore: I$2 } = n$2;
		if (A$1) return kt$1(new ct$1(A$1, O$1), e$3, O$1, p$2);
		const $ = _ !== void 0 ? _ : c$2 ? c$2[d$2] : null, B = I$2 !== void 0 ? I$2 : u$3 ? u$3.includes(d$2) : !1;
		return pn$1(O$1, $, B);
	});
	return mt$1(s$2, g$1);
}
h(kt$1, "build");
var yn$1 = class {
	static {
		h(this, "SourceMap");
	}
	constructor(e$3, r$1) {
		const i$4 = r$1.decodedMappings ? ht$1(e$3) : cn$1(e$3);
		this.version = i$4.version, this.file = i$4.file, this.mappings = i$4.mappings, this.names = i$4.names, this.ignoreList = i$4.ignoreList, this.sourceRoot = i$4.sourceRoot, this.sources = i$4.sources, r$1.excludeContent || (this.sourcesContent = i$4.sourcesContent);
	}
	toString() {
		return JSON.stringify(this);
	}
};
function yt$1(s$2, e$3, r$1) {
	const i$4 = {
		excludeContent: !!r$1,
		decodedMappings: !1
	}, o$3 = kn$1(s$2, e$3);
	return new yn$1(mn$1(o$3), i$4);
}
h(yt$1, "remapping");
const Ct = h((s$2, e$3, r$1) => {
	const i$4 = [], o$3 = { code: e$3 };
	for (const c$2 of r$1) {
		const u$3 = c$2(s$2, o$3.code);
		u$3 && (Object.assign(o$3, u$3), i$4.unshift(u$3.map));
	}
	return {
		...o$3,
		map: yt$1(i$4, () => null)
	};
}, "applyTransformersSync"), Cn$1 = h(async (s$2, e$3, r$1) => {
	const i$4 = [], o$3 = { code: e$3 };
	for (const c$2 of r$1) {
		const u$3 = await c$2(s$2, o$3.code);
		u$3 && (Object.assign(o$3, u$3), i$4.unshift(u$3.map));
	}
	return {
		...o$3,
		map: yt$1(i$4, () => null)
	};
}, "applyTransformers"), Sn$1 = Object.freeze({
	target: `node${process.versions.node}`,
	loader: "default"
}), vn$1 = /^--inspect(?:-brk|-port|-publish-uid|-wait)?(?:=|$)/, xn$1 = process.execArgv.some((s$2) => vn$1.test(s$2)), Re$1 = {
	...Sn$1,
	sourcemap: !0,
	sourcesContent: !!process.env.NODE_V8_COVERAGE || xn$1,
	minifyWhitespace: !0,
	keepNames: !0
}, Ie$1 = h((s$2) => {
	const e$3 = s$2.sourcefile;
	if (e$3) {
		const r$1 = path.extname(e$3.split("?")[0]);
		r$1 ? r$1 === ".cts" || r$1 === ".mts" ? s$2.sourcefile = `${e$3.slice(0, -3)}ts` : r$1 === ".mjs" && (s$2.sourcefile = `${e$3.slice(0, -3)}js`) : s$2.sourcefile += ".js";
	}
	return (r$1) => (r$1.map && (s$2.sourcefile !== e$3 && (r$1.map = r$1.map.replace(JSON.stringify(s$2.sourcefile), JSON.stringify(e$3))), r$1.map = JSON.parse(r$1.map)), r$1);
}, "patchOptions"), Ne$1 = h((s$2) => {
	throw s$2.name = "TransformError", delete s$2.errors, delete s$2.warnings, s$2;
}, "formatEsbuildError"), _n$1 = h((s$2, e$3) => ({
	...c$1(d$1) ? {
		dirname: path.dirname(s$2),
		filename: s$2
	} : {},
	url: e$3
}), "getImportMeta"), En$1 = h((s$2, e$3, r$1) => {
	let i$4, o$3, c$2;
	if (e$3.startsWith("file://")) {
		i$4 = e$3;
		const n$2 = new URL(e$3);
		o$3 = fileURLToPath(n$2);
	} else [o$3, c$2] = e$3.split("?"), i$4 = pathToFileURL(o$3) + (c$2 ? `?${c$2}` : "");
	const { cjsBanner: u$3,...p$2 } = r$1 ?? {}, g$1 = {
		...Re$1,
		format: "cjs",
		sourcefile: o$3,
		banner: `__filename=${JSON.stringify(o$3)};(()=>{${u$3 ?? ""}`,
		footer: "})()",
		platform: "node",
		...p$2
	};
	s$2.includes("import.meta") && g$1.format === "cjs" && !o$3.endsWith(".cjs") && !o$3.endsWith(".cts") && (g$1.define = {
		...g$1.define,
		"import.meta": JSON.stringify(_n$1(o$3, i$4))
	});
	const b$1 = Ce$1([
		s$2,
		i$4,
		JSON.stringify(g$1),
		import_main.version,
		Le$1
	].join("-"));
	let d$2 = q.get(b$1);
	return d$2 || (d$2 = Ct(e$3, s$2, [(n$2, A$1) => {
		const O$1 = Ie$1(g$1);
		let _;
		try {
			_ = (0, import_main.transformSync)(A$1, g$1);
		} catch (I$2) {
			throw Ne$1(I$2);
		}
		return O$1(_);
	}, (n$2, A$1) => oe$1(n$2, A$1, !0)]), q.set(b$1, d$2)), d$2;
}, "transformSync"), Ln$1 = h(async (s$2, e$3, r$1) => {
	const i$4 = {
		...Re$1,
		format: "esm",
		sourcefile: e$3,
		...r$1
	}, o$3 = Ce$1([
		s$2,
		JSON.stringify(i$4),
		import_main.version,
		Le$1
	].join("-"));
	let c$2 = q.get(o$3);
	return c$2 || (c$2 = await Cn$1(e$3, s$2, [async (u$3, p$2) => {
		const g$1 = Ie$1(i$4);
		let b$1;
		try {
			b$1 = await (0, import_main.transform)(p$2, i$4);
		} catch (d$2) {
			throw Ne$1(d$2);
		}
		return g$1(b$1);
	}, (u$3, p$2) => oe$1(u$3, p$2, !0)]), q.set(o$3, c$2)), c$2;
}, "transform"), On$1 = h((s$2, e$3, r$1) => {
	const i$4 = {
		...Re$1,
		format: "esm",
		sourcefile: e$3,
		...r$1
	}, o$3 = Ce$1([
		s$2,
		JSON.stringify(i$4),
		import_main.version,
		Le$1
	].join("-"));
	let c$2 = q.get(o$3);
	return c$2 || (c$2 = Ct(e$3, s$2, [(u$3, p$2) => {
		const g$1 = Ie$1(i$4);
		let b$1;
		try {
			b$1 = (0, import_main.transformSync)(p$2, i$4);
		} catch (d$2) {
			throw Ne$1(d$2);
		}
		return g$1(b$1);
	}, (u$3, p$2) => oe$1(u$3, p$2, !0)]), q.set(o$3, c$2)), c$2;
}, "transformEsmSync");

//#endregion
//#region node_modules/tsx/dist/client-D_mPDF5S.mjs
var p = Object.defineProperty;
var t$1 = (e$3, n$2) => p(e$3, "name", {
	value: n$2,
	configurable: !0
});
let o = [];
const m$1 = t$1(() => new Promise((e$3) => {
	const n$2 = n$1(process.ppid), r$1 = net.createConnection(n$2, () => {
		e$3(t$1((i$4) => {
			const c$2 = Buffer.from(JSON.stringify(i$4)), f$2 = Buffer.alloc(4);
			f$2.writeInt32BE(c$2.length, 0), r$1.write(Buffer.concat([f$2, c$2]));
		}, "sendToParent"));
	});
	r$1.on("error", () => {
		e$3();
	}), r$1.unref();
}), "connectToServer"), s$1 = { send: t$1((e$3) => {
	o.push(e$3);
}, "send") }, a$1 = m$1();
a$1.then((e$3) => {
	if (e$3) for (const n$2 of o) e$3(n$2);
	o = [], s$1.send = e$3;
}, () => {
	o = [], s$1.send = void 0;
});

//#endregion
//#region node_modules/tsx/dist/index-gbaejti9.mjs
var u$1 = Object.defineProperty;
var g = (s$2, n$2) => u$1(s$2, "name", {
	value: n$2,
	configurable: !0
});
let t = !0;
const l = typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
let i$1 = 0;
if (l.process && l.process.env && l.process.stdout) {
	const { FORCE_COLOR: s$2, NODE_DISABLE_COLORS: n$2, NO_COLOR: r$1, TERM: o$3, COLORTERM: c$2 } = l.process.env;
	n$2 || r$1 || s$2 === "0" ? t = !1 : s$2 === "1" || s$2 === "2" || s$2 === "3" ? t = !0 : o$3 === "dumb" ? t = !1 : "CI" in l.process.env && [
		"TRAVIS",
		"CIRCLECI",
		"APPVEYOR",
		"GITLAB_CI",
		"GITHUB_ACTIONS",
		"BUILDKITE",
		"DRONE"
	].some((a$3) => a$3 in l.process.env) ? t = !0 : t = process.stdout.isTTY, t && (process.platform === "win32" || c$2 && (c$2 === "truecolor" || c$2 === "24bit") ? i$1 = 3 : o$3 && (o$3.endsWith("-256color") || o$3.endsWith("256")) ? i$1 = 2 : i$1 = 1);
}
let f = {
	enabled: t,
	supportLevel: i$1
};
function e$1(s$2, n$2, r$1 = 1) {
	const o$3 = `\x1B[${s$2}m`, c$2 = `\x1B[${n$2}m`, a$3 = new RegExp(`\\x1b\\[${n$2}m`, "g");
	return (p$2) => f.enabled && f.supportLevel >= r$1 ? o$3 + ("" + p$2).replace(a$3, o$3) + c$2 : "" + p$2;
}
g(e$1, "kolorist");
const b = e$1(30, 39), d = e$1(33, 39), O = e$1(90, 39), C = e$1(92, 39), R = e$1(95, 39), I$1 = e$1(96, 39), L = e$1(44, 49), E = e$1(100, 49), T = e$1(103, 49);

//#endregion
//#region node_modules/tsx/dist/register-BnTWPeIB.mjs
var yt = Object.defineProperty;
var u = (e$3, t$4) => yt(e$3, "name", {
	value: t$4,
	configurable: !0
});
const Pe = u((e$3) => {
	if (!e$3.startsWith("data:text/javascript,")) return;
	const t$4 = e$3.indexOf("?");
	if (t$4 === -1) return;
	const n$2 = new URLSearchParams(e$3.slice(t$4 + 1)).get("filePath");
	if (n$2) return n$2;
}, "getOriginalFilePath"), De = u((e$3) => {
	const t$4 = Pe(e$3);
	return t$4 && (require$$0$6._cache[t$4] = require$$0$6._cache[e$3], delete require$$0$6._cache[e$3], e$3 = t$4), e$3;
}, "interopCjsExports"), _e = u((e$3) => e$3 !== null && typeof e$3 == "object", "A"), W = u((e$3, t$4) => Object.assign(new Error(`[${e$3}]: ${t$4}`), { code: e$3 }), "a"), Le = "ERR_INVALID_PACKAGE_CONFIG", ue = "ERR_INVALID_PACKAGE_TARGET", Ut = "ERR_PACKAGE_PATH_NOT_EXPORTED", Ft = /^\d+$/, Rt = /^(\.{1,2}|node_modules)$/i, It = /\/|\\/;
var Ue = ((e$3) => (e$3.Export = "exports", e$3.Import = "imports", e$3))(Ue || {});
const fe = u((e$3, t$4, r$1, n$2, s$2) => {
	if (t$4 == null) return [];
	if (typeof t$4 == "string") {
		const [o$3, ...a$3] = t$4.split(It);
		if (o$3 === ".." || a$3.some((i$4) => Rt.test(i$4))) throw W(ue, `Invalid "${e$3}" target "${t$4}" defined in the package config`);
		return [s$2 ? t$4.replace(/\*/g, s$2) : t$4];
	}
	if (Array.isArray(t$4)) return t$4.flatMap((o$3) => fe(e$3, o$3, r$1, n$2, s$2));
	if (_e(t$4)) {
		for (const o$3 of Object.keys(t$4)) {
			if (Ft.test(o$3)) throw W(Le, "Cannot contain numeric property keys");
			if (o$3 === "default" || n$2.includes(o$3)) return fe(e$3, t$4[o$3], r$1, n$2, s$2);
		}
		return [];
	}
	throw W(ue, `Invalid "${e$3}" target "${t$4}"`);
}, "f"), G = "*", Nt = u((e$3, t$4) => {
	const r$1 = e$3.indexOf(G), n$2 = t$4.indexOf(G);
	return r$1 === n$2 ? t$4.length > e$3.length : n$2 > r$1;
}, "m");
function Bt(e$3, t$4) {
	if (!t$4.includes(G) && e$3.hasOwnProperty(t$4)) return [t$4];
	let r$1, n$2;
	for (const s$2 of Object.keys(e$3)) if (s$2.includes(G)) {
		const [o$3, a$3, i$4] = s$2.split(G);
		if (i$4 === void 0 && t$4.startsWith(o$3) && t$4.endsWith(a$3)) {
			const d$2 = t$4.slice(o$3.length, -a$3.length || void 0);
			d$2 && (!r$1 || Nt(r$1, s$2)) && (r$1 = s$2, n$2 = d$2);
		}
	}
	return [r$1, n$2];
}
u(Bt, "d");
const Wt = u((e$3) => Object.keys(e$3).reduce((t$4, r$1) => {
	const n$2 = r$1 === "" || r$1[0] !== ".";
	if (t$4 === void 0 || t$4 === n$2) return n$2;
	throw W(Le, "\"exports\" cannot contain some keys starting with \".\" and some not");
}, void 0), "p"), Mt = /^\w+:/, Jt = u((e$3, t$4, r$1) => {
	if (!e$3) throw new Error("\"exports\" is required");
	t$4 = t$4 === "" ? "." : `./${t$4}`, (typeof e$3 == "string" || Array.isArray(e$3) || _e(e$3) && Wt(e$3)) && (e$3 = { ".": e$3 });
	const [n$2, s$2] = Bt(e$3, t$4), o$3 = fe(Ue.Export, e$3[n$2], t$4, r$1, s$2);
	if (o$3.length === 0) throw W(Ut, t$4 === "." ? "No \"exports\" main defined" : `Package subpath '${t$4}' is not defined by "exports"`);
	for (const a$3 of o$3) if (!a$3.startsWith("./") && !Mt.test(a$3)) throw W(ue, `Invalid "exports" target "${a$3}" defined in the package config`);
	return o$3;
}, "v");
var Vt = Object.defineProperty, c = u((e$3, t$4) => Vt(e$3, "name", {
	value: t$4,
	configurable: !0
}), "i");
function A(e$3) {
	return e$3.startsWith("\\\\?\\") ? e$3 : e$3.replace(/\\/g, "/");
}
u(A, "x"), c(A, "slash");
const Gt = c((e$3, t$4) => {
	const r$1 = `readFileSync:${t$4}`;
	let n$2 = e$3?.get(r$1);
	return n$2 === void 0 && (n$2 = fs.readFileSync(t$4, "utf8"), e$3?.set(r$1, n$2)), n$2;
}, "readFile"), D = c((e$3, t$4) => {
	const r$1 = `tryStat:${t$4}`;
	let n$2 = e$3?.get(r$1);
	if (n$2 === void 0) {
		try {
			n$2 = fs.statSync(t$4);
		} catch {
			n$2 = null;
		}
		e$3?.set(r$1, n$2);
	}
	return n$2 ?? void 0;
}, "tryStat"), Q = c((e$3, t$4, r$1) => {
	for (;;) {
		const n$2 = path.posix.join(e$3, t$4);
		if (D(r$1, n$2)) return n$2;
		const s$2 = path.dirname(e$3);
		if (s$2 === e$3) return;
		e$3 = s$2;
	}
}, "findUp");
function Fe(e$3, t$4 = !1) {
	const r$1 = e$3.length;
	let n$2 = 0, s$2 = "", o$3 = 0, a$3 = 16, i$4 = 0, d$2 = 0, p$2 = 0, k = 0, m$4 = 0;
	function v(l$2, C$1) {
		let S = 0, x$1 = 0;
		for (; S < l$2;) {
			let y$1 = e$3.charCodeAt(n$2);
			if (y$1 >= 48 && y$1 <= 57) x$1 = x$1 * 16 + y$1 - 48;
			else if (y$1 >= 65 && y$1 <= 70) x$1 = x$1 * 16 + y$1 - 65 + 10;
			else if (y$1 >= 97 && y$1 <= 102) x$1 = x$1 * 16 + y$1 - 97 + 10;
			else break;
			n$2++, S++;
		}
		return S < l$2 && (x$1 = -1), x$1;
	}
	u(v, "A"), c(v, "scanHexDigits");
	function w(l$2) {
		n$2 = l$2, s$2 = "", o$3 = 0, a$3 = 16, m$4 = 0;
	}
	u(w, "O"), c(w, "setPosition");
	function b$1() {
		let l$2 = n$2;
		if (e$3.charCodeAt(n$2) === 48) n$2++;
		else for (n$2++; n$2 < e$3.length && I(e$3.charCodeAt(n$2));) n$2++;
		if (n$2 < e$3.length && e$3.charCodeAt(n$2) === 46) if (n$2++, n$2 < e$3.length && I(e$3.charCodeAt(n$2))) for (n$2++; n$2 < e$3.length && I(e$3.charCodeAt(n$2));) n$2++;
		else return m$4 = 3, e$3.substring(l$2, n$2);
		let C$1 = n$2;
		if (n$2 < e$3.length && (e$3.charCodeAt(n$2) === 69 || e$3.charCodeAt(n$2) === 101)) if (n$2++, (n$2 < e$3.length && e$3.charCodeAt(n$2) === 43 || e$3.charCodeAt(n$2) === 45) && n$2++, n$2 < e$3.length && I(e$3.charCodeAt(n$2))) {
			for (n$2++; n$2 < e$3.length && I(e$3.charCodeAt(n$2));) n$2++;
			C$1 = n$2;
		} else m$4 = 3;
		return e$3.substring(l$2, C$1);
	}
	u(b$1, "h"), c(b$1, "scanNumber");
	function E$2() {
		let l$2 = "", C$1 = n$2;
		for (;;) {
			if (n$2 >= r$1) {
				l$2 += e$3.substring(C$1, n$2), m$4 = 2;
				break;
			}
			const S = e$3.charCodeAt(n$2);
			if (S === 34) {
				l$2 += e$3.substring(C$1, n$2), n$2++;
				break;
			}
			if (S === 92) {
				if (l$2 += e$3.substring(C$1, n$2), n$2++, n$2 >= r$1) {
					m$4 = 2;
					break;
				}
				switch (e$3.charCodeAt(n$2++)) {
					case 34:
						l$2 += "\"";
						break;
					case 92:
						l$2 += "\\";
						break;
					case 47:
						l$2 += "/";
						break;
					case 98:
						l$2 += "\b";
						break;
					case 102:
						l$2 += "\f";
						break;
					case 110:
						l$2 += `
`;
						break;
					case 114:
						l$2 += "\r";
						break;
					case 116:
						l$2 += "	";
						break;
					case 117:
						const x$1 = v(4);
						x$1 >= 0 ? l$2 += String.fromCharCode(x$1) : m$4 = 4;
						break;
					default: m$4 = 5;
				}
				C$1 = n$2;
				continue;
			}
			if (S >= 0 && S <= 31) if (M(S)) {
				l$2 += e$3.substring(C$1, n$2), m$4 = 2;
				break;
			} else m$4 = 6;
			n$2++;
		}
		return l$2;
	}
	u(E$2, "D"), c(E$2, "scanString");
	function f$2() {
		if (s$2 = "", m$4 = 0, o$3 = n$2, d$2 = i$4, k = p$2, n$2 >= r$1) return o$3 = r$1, a$3 = 17;
		let l$2 = e$3.charCodeAt(n$2);
		if (ee(l$2)) {
			do
				n$2++, s$2 += String.fromCharCode(l$2), l$2 = e$3.charCodeAt(n$2);
			while (ee(l$2));
			return a$3 = 15;
		}
		if (M(l$2)) return n$2++, s$2 += String.fromCharCode(l$2), l$2 === 13 && e$3.charCodeAt(n$2) === 10 && (n$2++, s$2 += `
`), i$4++, p$2 = n$2, a$3 = 14;
		switch (l$2) {
			case 123: return n$2++, a$3 = 1;
			case 125: return n$2++, a$3 = 2;
			case 91: return n$2++, a$3 = 3;
			case 93: return n$2++, a$3 = 4;
			case 58: return n$2++, a$3 = 6;
			case 44: return n$2++, a$3 = 5;
			case 34: return n$2++, s$2 = E$2(), a$3 = 10;
			case 47:
				const C$1 = n$2 - 1;
				if (e$3.charCodeAt(n$2 + 1) === 47) {
					for (n$2 += 2; n$2 < r$1 && !M(e$3.charCodeAt(n$2));) n$2++;
					return s$2 = e$3.substring(C$1, n$2), a$3 = 12;
				}
				if (e$3.charCodeAt(n$2 + 1) === 42) {
					n$2 += 2;
					const S = r$1 - 1;
					let x$1 = !1;
					for (; n$2 < S;) {
						const y$1 = e$3.charCodeAt(n$2);
						if (y$1 === 42 && e$3.charCodeAt(n$2 + 1) === 47) {
							n$2 += 2, x$1 = !0;
							break;
						}
						n$2++, M(y$1) && (y$1 === 13 && e$3.charCodeAt(n$2) === 10 && n$2++, i$4++, p$2 = n$2);
					}
					return x$1 || (n$2++, m$4 = 1), s$2 = e$3.substring(C$1, n$2), a$3 = 13;
				}
				return s$2 += String.fromCharCode(l$2), n$2++, a$3 = 16;
			case 45: if (s$2 += String.fromCharCode(l$2), n$2++, n$2 === r$1 || !I(e$3.charCodeAt(n$2))) return a$3 = 16;
			case 48:
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57: return s$2 += b$1(), a$3 = 11;
			default:
				for (; n$2 < r$1 && g$1(l$2);) n$2++, l$2 = e$3.charCodeAt(n$2);
				if (o$3 !== n$2) {
					switch (s$2 = e$3.substring(o$3, n$2), s$2) {
						case "true": return a$3 = 8;
						case "false": return a$3 = 9;
						case "null": return a$3 = 7;
					}
					return a$3 = 16;
				}
				return s$2 += String.fromCharCode(l$2), n$2++, a$3 = 16;
		}
	}
	u(f$2, "c"), c(f$2, "scanNext");
	function g$1(l$2) {
		if (ee(l$2) || M(l$2)) return !1;
		switch (l$2) {
			case 125:
			case 93:
			case 123:
			case 91:
			case 34:
			case 58:
			case 44:
			case 47: return !1;
		}
		return !0;
	}
	u(g$1, "p"), c(g$1, "isUnknownContentCharacter");
	function T$2() {
		let l$2;
		do
			l$2 = f$2();
		while (l$2 >= 12 && l$2 <= 15);
		return l$2;
	}
	return u(T$2, "b"), c(T$2, "scanNextNonTrivia"), {
		setPosition: w,
		getPosition: c(() => n$2, "getPosition"),
		scan: t$4 ? T$2 : f$2,
		getToken: c(() => a$3, "getToken"),
		getTokenValue: c(() => s$2, "getTokenValue"),
		getTokenOffset: c(() => o$3, "getTokenOffset"),
		getTokenLength: c(() => n$2 - o$3, "getTokenLength"),
		getTokenStartLine: c(() => d$2, "getTokenStartLine"),
		getTokenStartCharacter: c(() => o$3 - k, "getTokenStartCharacter"),
		getTokenError: c(() => m$4, "getTokenError")
	};
}
u(Fe, "Ne"), c(Fe, "createScanner");
function ee(e$3) {
	return e$3 === 32 || e$3 === 9;
}
u(ee, "X"), c(ee, "isWhiteSpace");
function M(e$3) {
	return e$3 === 10 || e$3 === 13;
}
u(M, "P"), c(M, "isLineBreak");
function I(e$3) {
	return e$3 >= 48 && e$3 <= 57;
}
u(I, "S"), c(I, "isDigit");
var Re;
(function(e$3) {
	e$3[e$3.lineFeed = 10] = "lineFeed", e$3[e$3.carriageReturn = 13] = "carriageReturn", e$3[e$3.space = 32] = "space", e$3[e$3._0 = 48] = "_0", e$3[e$3._1 = 49] = "_1", e$3[e$3._2 = 50] = "_2", e$3[e$3._3 = 51] = "_3", e$3[e$3._4 = 52] = "_4", e$3[e$3._5 = 53] = "_5", e$3[e$3._6 = 54] = "_6", e$3[e$3._7 = 55] = "_7", e$3[e$3._8 = 56] = "_8", e$3[e$3._9 = 57] = "_9", e$3[e$3.a = 97] = "a", e$3[e$3.b = 98] = "b", e$3[e$3.c = 99] = "c", e$3[e$3.d = 100] = "d", e$3[e$3.e = 101] = "e", e$3[e$3.f = 102] = "f", e$3[e$3.g = 103] = "g", e$3[e$3.h = 104] = "h", e$3[e$3.i = 105] = "i", e$3[e$3.j = 106] = "j", e$3[e$3.k = 107] = "k", e$3[e$3.l = 108] = "l", e$3[e$3.m = 109] = "m", e$3[e$3.n = 110] = "n", e$3[e$3.o = 111] = "o", e$3[e$3.p = 112] = "p", e$3[e$3.q = 113] = "q", e$3[e$3.r = 114] = "r", e$3[e$3.s = 115] = "s", e$3[e$3.t = 116] = "t", e$3[e$3.u = 117] = "u", e$3[e$3.v = 118] = "v", e$3[e$3.w = 119] = "w", e$3[e$3.x = 120] = "x", e$3[e$3.y = 121] = "y", e$3[e$3.z = 122] = "z", e$3[e$3.A = 65] = "A", e$3[e$3.B = 66] = "B", e$3[e$3.C = 67] = "C", e$3[e$3.D = 68] = "D", e$3[e$3.E = 69] = "E", e$3[e$3.F = 70] = "F", e$3[e$3.G = 71] = "G", e$3[e$3.H = 72] = "H", e$3[e$3.I = 73] = "I", e$3[e$3.J = 74] = "J", e$3[e$3.K = 75] = "K", e$3[e$3.L = 76] = "L", e$3[e$3.M = 77] = "M", e$3[e$3.N = 78] = "N", e$3[e$3.O = 79] = "O", e$3[e$3.P = 80] = "P", e$3[e$3.Q = 81] = "Q", e$3[e$3.R = 82] = "R", e$3[e$3.S = 83] = "S", e$3[e$3.T = 84] = "T", e$3[e$3.U = 85] = "U", e$3[e$3.V = 86] = "V", e$3[e$3.W = 87] = "W", e$3[e$3.X = 88] = "X", e$3[e$3.Y = 89] = "Y", e$3[e$3.Z = 90] = "Z", e$3[e$3.asterisk = 42] = "asterisk", e$3[e$3.backslash = 92] = "backslash", e$3[e$3.closeBrace = 125] = "closeBrace", e$3[e$3.closeBracket = 93] = "closeBracket", e$3[e$3.colon = 58] = "colon", e$3[e$3.comma = 44] = "comma", e$3[e$3.dot = 46] = "dot", e$3[e$3.doubleQuote = 34] = "doubleQuote", e$3[e$3.minus = 45] = "minus", e$3[e$3.openBrace = 123] = "openBrace", e$3[e$3.openBracket = 91] = "openBracket", e$3[e$3.plus = 43] = "plus", e$3[e$3.slash = 47] = "slash", e$3[e$3.formFeed = 12] = "formFeed", e$3[e$3.tab = 9] = "tab";
})(Re || (Re = {})), new Array(20).fill(0).map((e$3, t$4) => " ".repeat(t$4));
const J = 200;
new Array(J).fill(0).map((e$3, t$4) => `
` + " ".repeat(t$4)), new Array(J).fill(0).map((e$3, t$4) => "\r" + " ".repeat(t$4)), new Array(J).fill(0).map((e$3, t$4) => `\r
` + " ".repeat(t$4)), new Array(J).fill(0).map((e$3, t$4) => `
` + "	".repeat(t$4)), new Array(J).fill(0).map((e$3, t$4) => "\r" + "	".repeat(t$4)), new Array(J).fill(0).map((e$3, t$4) => `\r
` + "	".repeat(t$4));
var te;
(function(e$3) {
	e$3.DEFAULT = { allowTrailingComma: !1 };
})(te || (te = {}));
function Ie(e$3, t$4 = [], r$1 = te.DEFAULT) {
	let n$2 = null, s$2 = [];
	const o$3 = [];
	function a$3(i$4) {
		Array.isArray(s$2) ? s$2.push(i$4) : n$2 !== null && (s$2[n$2] = i$4);
	}
	return u(a$3, "l"), c(a$3, "onValue"), Ne(e$3, {
		onObjectBegin: c(() => {
			const i$4 = {};
			a$3(i$4), o$3.push(s$2), s$2 = i$4, n$2 = null;
		}, "onObjectBegin"),
		onObjectProperty: c((i$4) => {
			n$2 = i$4;
		}, "onObjectProperty"),
		onObjectEnd: c(() => {
			s$2 = o$3.pop();
		}, "onObjectEnd"),
		onArrayBegin: c(() => {
			const i$4 = [];
			a$3(i$4), o$3.push(s$2), s$2 = i$4, n$2 = null;
		}, "onArrayBegin"),
		onArrayEnd: c(() => {
			s$2 = o$3.pop();
		}, "onArrayEnd"),
		onLiteralValue: a$3,
		onError: c((i$4, d$2, p$2) => {
			t$4.push({
				error: i$4,
				offset: d$2,
				length: p$2
			});
		}, "onError")
	}, r$1), s$2[0];
}
u(Ie, "Re"), c(Ie, "parse$1");
function Ne(e$3, t$4, r$1 = te.DEFAULT) {
	const n$2 = Fe(e$3, !1), s$2 = [];
	let o$3 = 0;
	function a$3(j) {
		return j ? () => o$3 === 0 && j(n$2.getTokenOffset(), n$2.getTokenLength(), n$2.getTokenStartLine(), n$2.getTokenStartCharacter()) : () => !0;
	}
	u(a$3, "l"), c(a$3, "toNoArgVisit");
	function i$4(j) {
		return j ? (O$1) => o$3 === 0 && j(O$1, n$2.getTokenOffset(), n$2.getTokenLength(), n$2.getTokenStartLine(), n$2.getTokenStartCharacter()) : () => !0;
	}
	u(i$4, "g"), c(i$4, "toOneArgVisit");
	function d$2(j) {
		return j ? (O$1) => o$3 === 0 && j(O$1, n$2.getTokenOffset(), n$2.getTokenLength(), n$2.getTokenStartLine(), n$2.getTokenStartCharacter(), () => s$2.slice()) : () => !0;
	}
	u(d$2, "m"), c(d$2, "toOneArgVisitWithPath");
	function p$2(j) {
		return j ? () => {
			o$3 > 0 ? o$3++ : j(n$2.getTokenOffset(), n$2.getTokenLength(), n$2.getTokenStartLine(), n$2.getTokenStartCharacter(), () => s$2.slice()) === !1 && (o$3 = 1);
		} : () => !0;
	}
	u(p$2, "k"), c(p$2, "toBeginVisit");
	function k(j) {
		return j ? () => {
			o$3 > 0 && o$3--, o$3 === 0 && j(n$2.getTokenOffset(), n$2.getTokenLength(), n$2.getTokenStartLine(), n$2.getTokenStartCharacter());
		} : () => !0;
	}
	u(k, "w"), c(k, "toEndVisit");
	const m$4 = p$2(t$4.onObjectBegin), v = d$2(t$4.onObjectProperty), w = k(t$4.onObjectEnd), b$1 = p$2(t$4.onArrayBegin), E$2 = k(t$4.onArrayEnd), f$2 = d$2(t$4.onLiteralValue), g$1 = i$4(t$4.onSeparator), T$2 = a$3(t$4.onComment), l$2 = i$4(t$4.onError), C$1 = r$1 && r$1.disallowComments, S = r$1 && r$1.allowTrailingComma;
	function x$1() {
		for (;;) {
			const j = n$2.scan();
			switch (n$2.getTokenError()) {
				case 4:
					y$1(14);
					break;
				case 5:
					y$1(15);
					break;
				case 3:
					y$1(13);
					break;
				case 1:
					C$1 || y$1(11);
					break;
				case 2:
					y$1(12);
					break;
				case 6:
					y$1(16);
					break;
			}
			switch (j) {
				case 12:
				case 13:
					C$1 ? y$1(10) : T$2();
					break;
				case 16:
					y$1(1);
					break;
				case 15:
				case 14: break;
				default: return j;
			}
		}
	}
	u(x$1, "v"), c(x$1, "scanNext");
	function y$1(j, O$1 = [], Oe$1 = []) {
		if (l$2(j), O$1.length + Oe$1.length > 0) {
			let Z$1 = n$2.getToken();
			for (; Z$1 !== 17;) {
				if (O$1.indexOf(Z$1) !== -1) {
					x$1();
					break;
				} else if (Oe$1.indexOf(Z$1) !== -1) break;
				Z$1 = x$1();
			}
		}
	}
	u(y$1, "d"), c(y$1, "handleError");
	function _(j) {
		const O$1 = n$2.getTokenValue();
		return j ? f$2(O$1) : (v(O$1), s$2.push(O$1)), x$1(), !0;
	}
	u(_, "L"), c(_, "parseString");
	function L$1() {
		switch (n$2.getToken()) {
			case 11:
				const j = n$2.getTokenValue();
				let O$1 = Number(j);
				isNaN(O$1) && (y$1(2), O$1 = 0), f$2(O$1);
				break;
			case 7:
				f$2(null);
				break;
			case 8:
				f$2(!0);
				break;
			case 9:
				f$2(!1);
				break;
			default: return !1;
		}
		return x$1(), !0;
	}
	u(L$1, "B"), c(L$1, "parseLiteral");
	function P() {
		return n$2.getToken() !== 10 ? (y$1(3, [], [2, 5]), !1) : (_(!1), n$2.getToken() === 6 ? (g$1(":"), x$1(), Y$1() || y$1(4, [], [2, 5])) : y$1(5, [], [2, 5]), s$2.pop(), !0);
	}
	u(P, "$"), c(P, "parseProperty");
	function B() {
		m$4(), x$1();
		let j = !1;
		for (; n$2.getToken() !== 2 && n$2.getToken() !== 17;) {
			if (n$2.getToken() === 5) {
				if (j || y$1(4, [], []), g$1(","), x$1(), n$2.getToken() === 2 && S) break;
			} else j && y$1(6, [], []);
			P() || y$1(4, [], [2, 5]), j = !0;
		}
		return w(), n$2.getToken() !== 2 ? y$1(7, [2], []) : x$1(), !0;
	}
	u(B, "N"), c(B, "parseObject");
	function Se$1() {
		b$1(), x$1();
		let j = !0, O$1 = !1;
		for (; n$2.getToken() !== 4 && n$2.getToken() !== 17;) {
			if (n$2.getToken() === 5) {
				if (O$1 || y$1(4, [], []), g$1(","), x$1(), n$2.getToken() === 4 && S) break;
			} else O$1 && y$1(6, [], []);
			j ? (s$2.push(0), j = !1) : s$2[s$2.length - 1]++, Y$1() || y$1(4, [], [4, 5]), O$1 = !0;
		}
		return E$2(), j || s$2.pop(), n$2.getToken() !== 4 ? y$1(8, [4], []) : x$1(), !0;
	}
	u(Se$1, "$e"), c(Se$1, "parseArray");
	function Y$1() {
		switch (n$2.getToken()) {
			case 3: return Se$1();
			case 1: return B();
			case 10: return _(!0);
			default: return L$1();
		}
	}
	return u(Y$1, "H"), c(Y$1, "parseValue"), x$1(), n$2.getToken() === 17 ? r$1.allowEmptyContent ? !0 : (y$1(4, [], []), !1) : Y$1() ? (n$2.getToken() !== 17 && y$1(9, [], []), !0) : (y$1(4, [], []), !1);
}
u(Ne, "Pe"), c(Ne, "visit");
var Be;
(function(e$3) {
	e$3[e$3.None = 0] = "None", e$3[e$3.UnexpectedEndOfComment = 1] = "UnexpectedEndOfComment", e$3[e$3.UnexpectedEndOfString = 2] = "UnexpectedEndOfString", e$3[e$3.UnexpectedEndOfNumber = 3] = "UnexpectedEndOfNumber", e$3[e$3.InvalidUnicode = 4] = "InvalidUnicode", e$3[e$3.InvalidEscapeCharacter = 5] = "InvalidEscapeCharacter", e$3[e$3.InvalidCharacter = 6] = "InvalidCharacter";
})(Be || (Be = {}));
var We;
(function(e$3) {
	e$3[e$3.OpenBraceToken = 1] = "OpenBraceToken", e$3[e$3.CloseBraceToken = 2] = "CloseBraceToken", e$3[e$3.OpenBracketToken = 3] = "OpenBracketToken", e$3[e$3.CloseBracketToken = 4] = "CloseBracketToken", e$3[e$3.CommaToken = 5] = "CommaToken", e$3[e$3.ColonToken = 6] = "ColonToken", e$3[e$3.NullKeyword = 7] = "NullKeyword", e$3[e$3.TrueKeyword = 8] = "TrueKeyword", e$3[e$3.FalseKeyword = 9] = "FalseKeyword", e$3[e$3.StringLiteral = 10] = "StringLiteral", e$3[e$3.NumericLiteral = 11] = "NumericLiteral", e$3[e$3.LineCommentTrivia = 12] = "LineCommentTrivia", e$3[e$3.BlockCommentTrivia = 13] = "BlockCommentTrivia", e$3[e$3.LineBreakTrivia = 14] = "LineBreakTrivia", e$3[e$3.Trivia = 15] = "Trivia", e$3[e$3.Unknown = 16] = "Unknown", e$3[e$3.EOF = 17] = "EOF";
})(We || (We = {}));
const Qt = Ie;
var Me;
(function(e$3) {
	e$3[e$3.InvalidSymbol = 1] = "InvalidSymbol", e$3[e$3.InvalidNumberFormat = 2] = "InvalidNumberFormat", e$3[e$3.PropertyNameExpected = 3] = "PropertyNameExpected", e$3[e$3.ValueExpected = 4] = "ValueExpected", e$3[e$3.ColonExpected = 5] = "ColonExpected", e$3[e$3.CommaExpected = 6] = "CommaExpected", e$3[e$3.CloseBraceExpected = 7] = "CloseBraceExpected", e$3[e$3.CloseBracketExpected = 8] = "CloseBracketExpected", e$3[e$3.EndOfFileExpected = 9] = "EndOfFileExpected", e$3[e$3.InvalidCommentToken = 10] = "InvalidCommentToken", e$3[e$3.UnexpectedEndOfComment = 11] = "UnexpectedEndOfComment", e$3[e$3.UnexpectedEndOfString = 12] = "UnexpectedEndOfString", e$3[e$3.UnexpectedEndOfNumber = 13] = "UnexpectedEndOfNumber", e$3[e$3.InvalidUnicode = 14] = "InvalidUnicode", e$3[e$3.InvalidEscapeCharacter = 15] = "InvalidEscapeCharacter", e$3[e$3.InvalidCharacter = 16] = "InvalidCharacter";
})(Me || (Me = {}));
const de = c((e$3, t$4) => Qt(Gt(t$4, e$3)), "readJsonc"), Je = c(() => {
	const { findPnpApi: e$3 } = require$$0$6;
	return e$3 && e$3(process.cwd());
}, "getPnpApi"), Kt = "detectTypeScriptVersion:", zt = c((e$3, t$4) => {
	const r$1 = `${Kt}${e$3}`, n$2 = t$4?.get(r$1);
	if (n$2 !== void 0) return n$2 ?? void 0;
	let s$2;
	const o$3 = Je();
	if (o$3) try {
		s$2 = o$3.resolveRequest("typescript/package.json", e$3) ?? void 0;
	} catch {}
	s$2 ??= Q(path.resolve(e$3), path.join("node_modules", "typescript", "package.json"), t$4);
	let a$3;
	if (s$2) try {
		const i$4 = de(s$2, t$4);
		typeof i$4?.version == "string" && (a$3 = i$4.version);
	} catch {}
	return t$4?.set(r$1, a$3 ?? null), a$3;
}, "detectTypeScriptVersion"), N = "package.json", ne = "tsconfig.json", Ht = c((e$3, t$4, r$1) => {
	const n$2 = require$$0$6.createRequire(path.join(r$1, "tsconfig.json"));
	if (e$3 !== t$4) try {
		return n$2.resolve(e$3);
	} catch {}
	try {
		return n$2.resolve(t$4);
	} catch {}
	try {
		return n$2.resolve(`${t$4}/${N}`);
	} catch {}
}, "resolvePackageEntryWithNode"), me = c((e$3, t$4, r$1, n$2) => {
	const s$2 = `resolveFromPackageJsonPath:${e$3}:${t$4}:${r$1}`;
	if (n$2?.has(s$2)) return n$2.get(s$2) || !1;
	const o$3 = de(e$3, n$2);
	if (!o$3) return;
	let a$3 = t$4 || ne;
	if (!r$1 && o$3.exports) try {
		const [i$4] = Jt(o$3.exports, t$4, ["require", "types"]);
		a$3 = i$4;
	} catch {
		return n$2?.set(s$2, ""), !1;
	}
	else !t$4 && o$3.tsconfig && (a$3 = o$3.tsconfig);
	return a$3 = path.join(e$3, "..", a$3), n$2?.set(s$2, a$3), a$3;
}, "resolveFromPackageJsonPath"), Xt = c((e$3, t$4, r$1) => {
	const n$2 = `resolveExtendsPath:${e$3}:${t$4}`;
	if (r$1?.has(n$2)) return r$1.get(n$2) || void 0;
	const s$2 = Yt(e$3, t$4, r$1);
	return r$1?.set(n$2, s$2 || ""), s$2;
}, "resolveExtendsPath"), Yt = c((e$3, t$4, r$1) => {
	let n$2 = e$3;
	if (e$3 === ".." && (n$2 = path.join(n$2, ne)), e$3[0] === "." && (n$2 = path.resolve(t$4, n$2)), path.isAbsolute(n$2)) {
		const f$2 = D(r$1, n$2);
		if (f$2) {
			if (f$2.isFile()) return n$2;
		} else if (!n$2.endsWith(".json")) {
			const g$1 = `${n$2}.json`;
			if (D(r$1, g$1)) return g$1;
		}
		return;
	}
	const [s$2, ...o$3] = e$3.split("/"), a$3 = s$2[0] === "@" ? `${s$2}/${o$3.shift()}` : s$2, i$4 = o$3.join("/"), d$2 = Je();
	if (d$2) {
		const { resolveRequest: f$2 } = d$2;
		try {
			if (a$3 === e$3) {
				const g$1 = f$2(path.join(a$3, N), t$4);
				if (g$1) {
					const T$2 = me(g$1, i$4, !1, r$1);
					if (T$2 && D(r$1, T$2)) return T$2;
				}
			} else {
				let g$1;
				try {
					g$1 = f$2(e$3, t$4, { extensions: [".json"] });
				} catch {
					g$1 = f$2(path.join(e$3, ne), t$4);
				}
				if (g$1) return g$1;
			}
		} catch {}
	}
	const p$2 = Ht(e$3, a$3, t$4);
	let k;
	if (p$2) {
		if (path.basename(p$2) !== N && p$2.endsWith(".json")) return p$2;
		k = path.basename(p$2) === N ? p$2 : Q(path.dirname(p$2), N, r$1);
	}
	const m$4 = k && path.dirname(k) || Q(path.resolve(t$4), path.join("node_modules", a$3), r$1);
	if (!m$4 || !D(r$1, m$4)?.isDirectory()) return;
	const v = path.join(m$4, N);
	if (D(r$1, v)) {
		const f$2 = me(v, i$4, !1, r$1);
		if (f$2 === !1) return;
		if (f$2 && D(r$1, f$2)?.isFile()) return f$2;
	}
	const w = path.join(m$4, i$4), b$1 = w.endsWith(".json");
	if (!b$1) {
		const f$2 = `${w}.json`;
		if (D(r$1, f$2)) return f$2;
	}
	const E$2 = D(r$1, w);
	if (E$2) {
		if (E$2.isDirectory()) {
			const f$2 = path.join(w, N);
			if (D(r$1, f$2)) {
				const T$2 = me(f$2, "", !0, r$1);
				if (T$2 && D(r$1, T$2)) return T$2;
			}
			const g$1 = path.join(w, ne);
			if (D(r$1, g$1)) return g$1;
		} else if (b$1) return w;
	}
}, "resolveExtendsPathUncached"), he = Symbol("implicitBaseUrl"), U = "${configDir}", ge = /^\.{1,2}(\/.*)?$/, re = c((e$3) => {
	const t$4 = A(e$3);
	return ge.test(t$4) ? t$4 : `./${t$4}`;
}, "normalizeRelativePath"), Zt = c((e$3) => {
	const t$4 = { ...e$3 };
	if (t$4.strict) {
		const r$1 = [
			"noImplicitAny",
			"noImplicitThis",
			"strictNullChecks",
			"strictFunctionTypes",
			"strictBindCallApply",
			"strictPropertyInitialization",
			"strictBuiltinIteratorReturn",
			"alwaysStrict",
			"useUnknownInCatchVariables"
		];
		for (const n$2 of r$1) t$4[n$2] === void 0 && (t$4[n$2] = !0);
	}
	if (t$4.composite && (t$4.declaration ??= !0, t$4.incremental ??= !0), t$4.target) {
		let r$1 = t$4.target.toLowerCase();
		r$1 === "es2015" && (r$1 = "es6"), t$4.target = r$1, r$1 === "esnext" && (t$4.module ??= "es6", t$4.useDefineForClassFields ??= !0), (r$1 === "es6" || r$1 === "es2016" || r$1 === "es2017" || r$1 === "es2018" || r$1 === "es2019" || r$1 === "es2020" || r$1 === "es2021" || r$1 === "es2022" || r$1 === "es2023" || r$1 === "es2024" || r$1 === "es2025") && (t$4.module ??= "es6"), (r$1 === "es2022" || r$1 === "es2023" || r$1 === "es2024" || r$1 === "es2025") && (t$4.useDefineForClassFields ??= !0);
	}
	if (t$4.module) {
		let r$1 = t$4.module.toLowerCase();
		if (r$1 === "es2015" && (r$1 = "es6"), t$4.module = r$1, (r$1 === "es6" || r$1 === "es2020" || r$1 === "es2022" || r$1 === "esnext" || r$1 === "none" || r$1 === "system" || r$1 === "umd" || r$1 === "amd") && (t$4.moduleResolution ??= "classic"), r$1 === "system" && (t$4.allowSyntheticDefaultImports ??= !0), (r$1 === "node16" || r$1 === "node18" || r$1 === "node20" || r$1 === "nodenext" || r$1 === "preserve") && (t$4.esModuleInterop ??= !0, t$4.allowSyntheticDefaultImports ??= !0), (r$1 === "node16" || r$1 === "node18" || r$1 === "node20" || r$1 === "nodenext") && (t$4.moduleDetection ??= "force"), (r$1 === "node16" || r$1 === "node18") && (t$4.target ??= "es2022", t$4.moduleResolution ??= "node16"), r$1 === "node20" && (t$4.target ??= "es2023", t$4.moduleResolution ??= "node16", t$4.resolveJsonModule ??= !0), r$1 === "nodenext" && (t$4.target ??= "esnext", t$4.moduleResolution ??= "nodenext", t$4.resolveJsonModule ??= !0), r$1 === "node16" || r$1 === "node18" || r$1 === "node20" || r$1 === "nodenext") {
			const n$2 = t$4.target;
			(n$2 === "es3" || n$2 === "es2022" || n$2 === "es2023" || n$2 === "es2024" || n$2 === "esnext") && (t$4.useDefineForClassFields ??= !0);
		}
		r$1 === "preserve" && (t$4.moduleResolution ??= "bundler");
	}
	if (t$4.moduleResolution) {
		let r$1 = t$4.moduleResolution.toLowerCase();
		r$1 === "node" && (r$1 = "node10"), t$4.moduleResolution = r$1, (r$1 === "node16" || r$1 === "nodenext" || r$1 === "bundler") && (t$4.resolvePackageJsonExports ??= !0, t$4.resolvePackageJsonImports ??= !0), r$1 === "bundler" && (t$4.allowSyntheticDefaultImports ??= !0, t$4.resolveJsonModule ??= !0);
	}
	for (const r$1 of [
		"jsx",
		"moduleDetection",
		"importsNotUsedAsValues",
		"newLine"
	]) t$4[r$1] && (t$4[r$1] = t$4[r$1].toLowerCase());
	return t$4.esModuleInterop && (t$4.allowSyntheticDefaultImports ??= !0), t$4.verbatimModuleSyntax && (t$4.isolatedModules ??= !0, t$4.preserveConstEnums ??= !0), t$4.isolatedModules && (t$4.preserveConstEnums ??= !0), t$4.rewriteRelativeImportExtensions && (t$4.allowImportingTsExtensions ??= !0), t$4.lib && (t$4.lib = t$4.lib.map((r$1) => r$1.toLowerCase())), t$4.checkJs && (t$4.allowJs ??= !0), t$4;
}, "normalizeCompilerOptions"), qt = c((e$3, t$4) => {
	!t$4.has("target") && !en(e$3.module) && (e$3.target = "es3");
}, "applyV4Defaults"), en = c((e$3) => e$3 === "node16" || e$3 === "node18" || e$3 === "node20" || e$3 === "nodenext", "moduleDictatesTarget$1"), tn = c((e$3, t$4) => {
	!t$4.has("target") && !nn(e$3.module) && (e$3.target = "es5");
}, "applyV5Defaults"), nn = c((e$3) => e$3 === "node16" || e$3 === "node18" || e$3 === "node20" || e$3 === "nodenext", "moduleDictatesTarget"), rn = c((e$3, t$4) => {
	t$4.has("strict") || (e$3.strict = !0), t$4.has("target") || (e$3.target = "es2025"), t$4.has("module") || (e$3.module = "es2022"), t$4.has("moduleResolution") || (e$3.moduleResolution = "bundler"), t$4.has("rootDir") || (e$3.rootDir = "."), t$4.has("types") || (e$3.types = []), t$4.has("noUncheckedSideEffectImports") || (e$3.noUncheckedSideEffectImports = !0), t$4.has("libReplacement") || (e$3.libReplacement = !1);
}, "applyV6Defaults"), sn = [
	[4, qt],
	[5, tn],
	[6, rn]
], on = c((e$3) => {
	const t$4 = /^v?(\d+)/.exec(e$3);
	return t$4 ? Number(t$4[1]) : void 0;
}, "parseMajor"), an = c((e$3, t$4) => {
	const r$1 = on(t$4);
	if (r$1 === void 0) return;
	const n$2 = new Set(Object.keys(e$3));
	for (const [s$2, o$3] of sn) s$2 <= r$1 && o$3(e$3, n$2);
}, "applyVersionDefaults"), ke = c((e$3, t$4) => re(path.relative(e$3, t$4)), "pathRelative"), Ve = [
	"files",
	"include",
	"exclude"
], Ge = c((e$3, t$4, r$1) => {
	const n$2 = path.join(t$4, r$1), s$2 = path.relative(e$3, n$2);
	return A(s$2) || "./";
}, "resolveAndRelativize"), cn = c((e$3, t$4, r$1) => {
	const n$2 = path.relative(e$3, t$4);
	if (!n$2) return r$1;
	const s$2 = r$1.startsWith("./") ? r$1.slice(2) : r$1;
	return A(`${n$2}/${s$2}`);
}, "prefixPattern"), Qe = ["outDir", "declarationDir"], se = c((e$3, t$4) => {
	if (e$3.startsWith(U)) return A(path.join(t$4, e$3.slice(U.length)));
}, "interpolateConfigDir"), ln = [
	"outDir",
	"declarationDir",
	"outFile",
	"rootDir",
	"baseUrl",
	"tsBuildInfoFile"
], pn = c((e$3, t$4 = {}) => {
	if (e$3.length === 0) throw new Error("Chain must not be empty");
	const { typescriptVersion: r$1 } = t$4, n$2 = new Map(e$3.map((m$4) => [m$4.path, m$4])), s$2 = new Map(), o$3 = c((m$4) => {
		const v = s$2.get(m$4);
		if (v) return v;
		const w = n$2.get(m$4);
		if (!w) throw new Error(`Config not found in chain: ${m$4}`);
		const b$1 = w.config, E$2 = path.dirname(m$4);
		let f$2 = {
			...b$1,
			...b$1.compilerOptions && { compilerOptions: { ...b$1.compilerOptions } },
			...b$1.watchOptions && { watchOptions: { ...b$1.watchOptions } }
		};
		if (delete f$2.extends, f$2.compilerOptions?.paths && !f$2.compilerOptions.baseUrl && (f$2.compilerOptions[he] = E$2), b$1.extends) {
			const g$1 = Array.isArray(b$1.extends) ? b$1.extends : [b$1.extends];
			for (const T$2 of g$1.toReversed()) {
				const l$2 = o$3(T$2), C$1 = path.dirname(T$2), { references: S,...x$1 } = l$2;
				if (x$1.compilerOptions) {
					const _ = { ...x$1.compilerOptions };
					for (const L$1 of [
						"baseUrl",
						"outDir",
						"declarationDir",
						"rootDir"
					]) {
						const P = _[L$1];
						P && !P.startsWith(U) && (_[L$1] = Ge(E$2, C$1, P));
					}
					for (const L$1 of ["rootDirs", "typeRoots"]) {
						const P = _[L$1];
						P && (_[L$1] = P.map((B) => B.startsWith(U) ? B : Ge(E$2, C$1, B)));
					}
					x$1.compilerOptions = _;
				}
				for (const _ of Ve) {
					const L$1 = x$1[_];
					L$1 && (x$1[_] = L$1.map((P) => P.startsWith(U) ? P : cn(E$2, C$1, P)));
				}
				const y$1 = {
					...x$1,
					...f$2,
					compilerOptions: {
						...x$1.compilerOptions,
						...f$2.compilerOptions
					}
				};
				x$1.watchOptions && (y$1.watchOptions = {
					...x$1.watchOptions,
					...f$2.watchOptions
				}), f$2 = y$1;
			}
		}
		if (f$2.compilerOptions) {
			const { compilerOptions: g$1 } = f$2, T$2 = ["baseUrl", "rootDir"];
			for (const l$2 of T$2) {
				const C$1 = g$1[l$2];
				if (C$1 && !C$1.startsWith(U)) {
					const S = path.resolve(E$2, C$1), x$1 = ke(E$2, S);
					g$1[l$2] = x$1;
				}
			}
			for (const l$2 of Qe) {
				let C$1 = g$1[l$2];
				C$1 && (Array.isArray(f$2.exclude) || (f$2.exclude = Qe.map((S) => g$1[S]).filter(Boolean)), C$1.startsWith(U) || (C$1 = re(C$1)), g$1[l$2] = C$1);
			}
		} else f$2.compilerOptions = {};
		if (f$2.include && (f$2.include = f$2.include.map(A)), f$2.files && (f$2.files = f$2.files.map((g$1) => g$1.startsWith(U) ? g$1 : re(g$1))), f$2.watchOptions) {
			const { watchOptions: g$1 } = f$2;
			for (const T$2 of ["excludeDirectories", "excludeFiles"]) g$1[T$2] && (g$1[T$2] = g$1[T$2].map((l$2) => A(path.resolve(E$2, l$2))));
			for (const T$2 of [
				"watchFile",
				"watchDirectory",
				"fallbackPolling"
			]) if (g$1[T$2]) {
				const l$2 = g$1;
				l$2[T$2] = g$1[T$2].toLowerCase();
			}
		}
		return s$2.set(m$4, f$2), f$2;
	}, "resolveEntry"), a$3 = e$3[0], i$4 = o$3(a$3.path), d$2 = path.dirname(a$3.path), p$2 = {
		...i$4,
		compilerOptions: i$4.compilerOptions ? { ...i$4.compilerOptions } : {}
	}, { compilerOptions: k } = p$2;
	if (k) {
		for (const m$4 of ln) {
			const v = k[m$4];
			if (v) {
				const w = se(v, d$2);
				k[m$4] = w ? ke(d$2, w) : v;
			}
		}
		for (const m$4 of ["rootDirs", "typeRoots"]) {
			const v = k[m$4];
			v && (k[m$4] = v.map((w) => {
				const b$1 = se(w, d$2);
				return b$1 ? ke(d$2, b$1) : re(w);
			}));
		}
		if (k.paths) {
			const m$4 = {};
			for (const [v, w] of Object.entries(k.paths)) m$4[v] = w.map((b$1) => se(b$1, d$2) ?? b$1);
			k.paths = m$4;
		}
		r$1 && an(k, r$1), p$2.compilerOptions = Zt(k);
	}
	for (const m$4 of Ve) {
		const v = p$2[m$4];
		v && (p$2[m$4] = v.map((w) => se(w, d$2) ?? w));
	}
	return {
		path: a$3.path,
		config: p$2,
		sources: e$3.map((m$4) => m$4.path)
	};
}, "resolveExtendsChain"), un = c((e$3, t$4 = {}) => {
	const { cache: r$1 = new Map() } = t$4, n$2 = path.resolve(e$3), s$2 = [], o$3 = new Set(), a$3 = c((i$4, d$2) => {
		const p$2 = A(i$4);
		if (o$3.has(p$2)) return;
		o$3.add(p$2);
		let k;
		try {
			k = de(i$4, r$1) || {};
		} catch {
			throw new Error(`Cannot resolve tsconfig at path: ${i$4}`);
		}
		if (typeof k != "object") throw new SyntaxError(`Failed to parse tsconfig at: ${i$4}`);
		const m$4 = path.dirname(i$4);
		if (k.extends) {
			const v = Array.isArray(k.extends), w = (v ? k.extends : [k.extends]).map((E$2) => {
				const f$2 = Xt(E$2, m$4, r$1);
				if (!f$2) throw new Error(`File '${E$2}' not found.`);
				const g$1 = A(f$2);
				if (d$2.has(g$1) || g$1 === p$2) throw new Error(`Circularity detected while resolving configuration: ${g$1}`);
				return g$1;
			});
			k.extends = v ? w : w[0], s$2.push({
				path: p$2,
				config: k
			});
			const b$1 = new Set(d$2);
			b$1.add(p$2);
			for (const E$2 of [...w].reverse()) a$3(E$2, b$1);
		} else s$2.push({
			path: p$2,
			config: k
		});
	}, "collect");
	return a$3(n$2, new Set()), s$2;
}, "getExtendsChain"), ye = c((e$3, t$4 = {}) => {
	const { cache: r$1 = new Map(), typescriptVersion: n$2 = "auto" } = t$4, s$2 = un(e$3, { cache: r$1 });
	let o$3;
	return n$2 === "auto" ? o$3 = zt(path.dirname(s$2[0].path), r$1) : n$2 !== !1 && (o$3 = n$2), pn(s$2, { typescriptVersion: o$3 });
}, "readTsconfig");
var fn = Object.defineProperty, oe = c((e$3, t$4) => fn(e$3, "name", {
	value: t$4,
	configurable: !0
}), "s");
const Ke = oe((e$3) => {
	let t$4 = "";
	for (let r$1 = 0; r$1 < e$3.length; r$1 += 1) {
		const n$2 = e$3[r$1], s$2 = n$2.toUpperCase();
		t$4 += n$2 === s$2 ? n$2.toLowerCase() : s$2;
	}
	return t$4;
}, "invertCase"), be = new Map(), ze = oe((e$3, t$4) => {
	const r$1 = path$1.join(e$3, `.is-fs-case-sensitive-test-${process.pid}`);
	try {
		return t$4.writeFileSync(r$1, ""), !t$4.existsSync(Ke(r$1));
	} finally {
		try {
			t$4.unlinkSync(r$1);
		} catch {}
	}
}, "checkDirectoryCaseWithWrite"), dn = oe((e$3, t$4, r$1) => {
	try {
		return ze(e$3, r$1);
	} catch (n$2) {
		if (t$4 === void 0) return ze(require$$2.tmpdir(), r$1);
		throw n$2;
	}
}, "checkDirectoryCaseWithFallback"), mn = oe((e$3, t$4 = require$$0$4, r$1 = !0) => {
	const n$2 = e$3 ?? process.cwd();
	if (r$1 && be.has(n$2)) return be.get(n$2);
	let s$2;
	const o$3 = Ke(n$2);
	return o$3 !== n$2 && t$4.existsSync(n$2) ? s$2 = !t$4.existsSync(o$3) : s$2 = dn(n$2, e$3, t$4), r$1 && be.set(n$2, s$2), s$2;
}, "isFsCaseSensitive"), { join: He } = path.posix, xe = {
	ts: [
		".ts",
		".tsx",
		".d.ts"
	],
	cts: [".cts", ".d.cts"],
	mts: [".mts", ".d.mts"]
}, hn = c((e$3) => {
	const t$4 = [...xe.ts], r$1 = [...xe.cts], n$2 = [...xe.mts];
	return e$3?.allowJs && (t$4.push(".js", ".jsx"), r$1.push(".cjs"), n$2.push(".mjs")), [
		...t$4,
		...r$1,
		...n$2
	];
}, "getSupportedExtensions"), gn = c((e$3) => {
	const t$4 = [];
	if (!e$3) return t$4;
	const { outDir: r$1, declarationDir: n$2 } = e$3;
	return r$1 && t$4.push(r$1), n$2 && t$4.push(n$2), t$4;
}, "getDefaultExcludeSpec"), Xe = c((e$3) => e$3.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`), "escapeForRegexp"), kn = [
	"node_modules",
	"bower_components",
	"jspm_packages"
], we = `(?!(${kn.join("|")})(/|$))`, yn = /(?:^|\/)[^.*?]+$/, Ye = "**/*", ae = "[^/]", ve = "[^./]", Ze = process.platform === "win32", bn = c(({ config: e$3, path: t$4 }, r$1) => {
	if ("extends" in e$3) throw new Error("tsconfig#extends must be resolved. Use getTsconfig or readTsconfig to resolve it.");
	if (!path.isAbsolute(t$4)) throw new Error("The tsconfig path must be absolute");
	Ze && (t$4 = A(t$4));
	const n$2 = path.dirname(t$4), { files: s$2, include: o$3, exclude: a$3, compilerOptions: i$4 } = e$3, d$2 = c((E$2) => path.isAbsolute(E$2) ? E$2 : He(n$2, E$2), "resolvePattern"), p$2 = s$2 ? new Set(s$2.map(d$2)) : void 0, k = hn(i$4), m$4 = r$1 ? "" : "i", v = (a$3 || gn(i$4)).map((E$2) => {
		const f$2 = d$2(E$2), g$1 = Xe(f$2).replaceAll(String.raw`\*\*/`, "(.+/)?").replaceAll(String.raw`\*`, `${ae}*`).replaceAll(String.raw`\?`, ae);
		return new RegExp(`^${g$1}($|/)`, m$4);
	}), w = s$2 || o$3 ? o$3 : [Ye], b$1 = w ? w.map((E$2) => {
		let f$2 = d$2(E$2);
		yn.test(f$2) && (f$2 = He(f$2, Ye));
		const g$1 = Xe(f$2).replaceAll(String.raw`/\*\*`, `(/${we}${ve}${ae}*)*?`).replaceAll(/(\/)?\\\*/g, (T$2, l$2) => {
			const C$1 = String.raw`(${ve}|(\.(?!min\.js$))?)*`;
			return l$2 ? `/${we}${ve}${C$1}` : C$1;
		}).replaceAll(/(\/)?\\\?/g, (T$2, l$2) => {
			const C$1 = ae;
			return l$2 ? `/${we}${C$1}` : C$1;
		});
		return new RegExp(`^${g$1}$`, m$4);
	}) : void 0;
	return {
		filesSet: p$2,
		extensions: k,
		excludePatterns: v,
		includePatterns: b$1
	};
}, "compilePatterns"), qe = new WeakMap(), Ee = c((e$3, t$4) => {
	if (!path.isAbsolute(t$4)) return !1;
	Ze && (t$4 = A(t$4));
	let r$1 = qe.get(e$3);
	r$1 || (r$1 = bn(e$3, mn()), qe.set(e$3, r$1));
	const { filesSet: n$2, extensions: s$2, excludePatterns: o$3, includePatterns: a$3 } = r$1;
	return n$2?.has(t$4) ? !0 : !s$2.some((i$4) => t$4.endsWith(i$4)) || o$3.some((i$4) => i$4.test(t$4)) ? !1 : !!(a$3 && a$3.some((i$4) => i$4.test(t$4)));
}, "isFileIncluded"), et = c((e$3, t$4, r$1, n$2) => {
	const s$2 = path.resolve(e$3);
	let o$3 = A(e$3);
	for (;;) {
		const a$3 = Q(o$3, t$4, r$1);
		if (!a$3) return;
		const i$4 = path.resolve(a$3), d$2 = ye(i$4, {
			cache: r$1,
			typescriptVersion: n$2
		});
		if (Ee(d$2, s$2)) return d$2;
		const p$2 = path.dirname(a$3), k = path.dirname(p$2);
		if (k === p$2) return;
		o$3 = k;
	}
}, "findConfigApplicable"), xn = c((e$3 = process.cwd(), t$4 = {}) => {
	const { configName: r$1 = "tsconfig.json", cache: n$2 = new Map(), includes: s$2 = !1 } = t$4;
	if (!s$2) {
		const o$3 = path.resolve(e$3);
		return path.basename(o$3) === r$1 && D(n$2, o$3)?.isFile() ? A(o$3) : Q(A(e$3), r$1, n$2);
	}
	return et(e$3, r$1, n$2, !1)?.path;
}, "findTsconfig"), wn = c((e$3 = process.cwd(), t$4 = {}) => {
	const { configName: r$1 = "tsconfig.json", cache: n$2 = new Map(), includes: s$2 = !1, typescriptVersion: o$3 = "auto" } = t$4;
	if (!s$2) {
		const a$3 = xn(e$3, {
			configName: r$1,
			cache: n$2
		});
		return a$3 ? ye(a$3, {
			cache: n$2,
			typescriptVersion: o$3
		}) : void 0;
	}
	return et(e$3, r$1, n$2, o$3);
}, "getTsconfig"), vn = /\*/g, tt = c((e$3, t$4) => {
	const r$1 = e$3.match(vn);
	if (r$1 && r$1.length > 1) throw new Error(t$4);
}, "assertStarCount"), En = c((e$3) => {
	if (e$3.includes("*")) {
		const [t$4, r$1] = e$3.split("*");
		return {
			prefix: t$4,
			suffix: r$1
		};
	}
	return e$3;
}, "parsePattern"), Cn = c(({ prefix: e$3, suffix: t$4 }, r$1) => r$1.startsWith(e$3) && r$1.endsWith(t$4), "isPatternMatch"), jn = c((e$3, t$4, r$1) => Object.entries(e$3).map(([n$2, s$2]) => (tt(n$2, `Pattern '${n$2}' can have at most one '*' character.`), {
	pattern: En(n$2),
	substitutions: s$2.map((o$3) => {
		if (tt(o$3, `Substitution '${o$3}' in pattern '${n$2}' can have at most one '*' character.`), !t$4 && !ge.test(o$3) && !path.isAbsolute(o$3)) throw new Error("Non-relative paths are not allowed when 'baseUrl' is not set. Did you forget a leading './'?");
		return path.resolve(r$1, o$3);
	})
})), "parsePaths"), Tn = c((e$3) => {
	const { compilerOptions: t$4 } = e$3.config;
	if (!t$4) return null;
	const { baseUrl: r$1, paths: n$2 } = t$4;
	if (!r$1 && !n$2) return null;
	const s$2 = he in t$4 && t$4[he], o$3 = path.resolve(path.dirname(e$3.path), r$1 || s$2 || "."), a$3 = n$2 ? jn(n$2, r$1, o$3) : [], i$4 = new Map(), d$2 = [];
	for (const p$2 of a$3) typeof p$2.pattern == "string" ? i$4.set(p$2.pattern, p$2.substitutions) : d$2.push(p$2);
	return {
		exactEntries: i$4,
		patternEntries: d$2,
		resolvedBaseUrl: o$3,
		baseUrl: r$1
	};
}, "compilePaths"), nt = new WeakMap(), rt = c((e$3, t$4) => {
	let r$1 = nt.get(e$3);
	if (r$1 === void 0 && (r$1 = Tn(e$3), nt.set(e$3, r$1)), !r$1) return [];
	if (ge.test(t$4)) return [];
	const { exactEntries: n$2, patternEntries: s$2, resolvedBaseUrl: o$3, baseUrl: a$3 } = r$1, i$4 = n$2.get(t$4);
	if (i$4) return i$4.map(A);
	let d$2, p$2 = -1;
	for (const m$4 of s$2) Cn(m$4.pattern, t$4) && m$4.pattern.prefix.length > p$2 && (p$2 = m$4.pattern.prefix.length, d$2 = m$4);
	if (!d$2) return a$3 ? [A(path.join(o$3, t$4))] : [];
	const k = t$4.slice(d$2.pattern.prefix.length, t$4.length - d$2.pattern.suffix.length);
	return d$2.substitutions.map((m$4) => A(m$4.replace("*", k)));
}, "resolvePathAlias"), st = u((e$3) => {
	if (e$3) return ye(e$3);
	try {
		return wn() ?? void 0;
	} catch {}
}, "loadTsconfig"), Sn = `
//# sourceMappingURL=data:application/json;base64,`, ot = u(() => process.sourceMapsEnabled ?? !0, "shouldApplySourceMap"), Ce = u(({ code: e$3, map: t$4 }) => e$3 + Sn + Buffer.from(JSON.stringify(t$4), "utf8").toString("base64"), "inlineSourceMap"), K = Symbol.for("tsx:global-cjs-loader-count"), z = globalThis, On = u(() => (z[K] ?? 0) > 0, "isGlobalCjsLoaderActive"), An = u(() => (z[K] = (z[K] ?? 0) + 1, () => {
	z[K] = Math.max((z[K] ?? 1) - 1, 0);
}), "activateGlobalCjsLoader"), at = u((e$3) => e$3[0] === "." && (e$3[1] === "/" || e$3[1] === "." || e$3[2] === "/"), "isRelativePath"), H = u((e$3) => at(e$3) || path.isAbsolute(e$3), "isFilePath"), ie = "file://", $n = [
	".ts",
	".tsx",
	".jsx",
	".mts",
	".cts"
], it = /\.([cm]?ts|[tj]sx)($|\?)/, Pn = /\.(?:ts|tsx|jsx)($|\?)/, Dn = /[/\\].+\.(?:cts|cjs)(?:$|\?)/, _n = /\.json($|\?)/, ce = /\/(?:$|\?)/, Ln = /^(?:@[^/]+\/)?[^/\\]+$/, ct = `${path.sep}node_modules${path.sep}`, le = Number(process.env.TSX_DEBUG);
le && (f.enabled = !0, f.supportLevel = 3);
const lt = u((e$3) => (t$4, ...r$1) => {
	if (!le || t$4 > le) return;
	const n$2 = `${E(` tsx P${process.pid} `)} ${e$3}`, s$2 = r$1.map((o$3) => typeof o$3 == "string" ? o$3 : inspect(o$3, { colors: !0 })).join(" ");
	writeSync(1, `${n$2} ${s$2}
`);
}, "createLog"), V = lt(T(b(" CJS "))), Un = lt(L(" ESM ")), F = new Map(), Fn = u(async (e$3) => {
	if (F.has(e$3)) return F.get(e$3);
	if (!await fs.promises.access(e$3).then(() => !0, () => !1)) {
		F.set(e$3, void 0);
		return;
	}
	const r$1 = await fs.promises.readFile(e$3, "utf8");
	try {
		const n$2 = JSON.parse(r$1);
		return F.set(e$3, n$2), n$2;
	} catch {
		throw new Error(`Error parsing: ${e$3}`);
	}
}, "readPackageJson"), Rn = u((e$3) => {
	if (F.has(e$3)) return F.get(e$3);
	if (!fs.existsSync(e$3)) {
		F.set(e$3, void 0);
		return;
	}
	const t$4 = fs.readFileSync(e$3, "utf8");
	try {
		const r$1 = JSON.parse(t$4);
		return F.set(e$3, r$1), r$1;
	} catch {
		throw new Error(`Error parsing: ${e$3}`);
	}
}, "readPackageJsonSync"), In = u(async (e$3) => {
	let t$4 = new URL("package.json", e$3);
	for (; !t$4.pathname.endsWith("/node_modules/package.json");) {
		const r$1 = fileURLToPath(t$4), n$2 = await Fn(r$1);
		if (n$2) return n$2;
		const s$2 = t$4;
		if (t$4 = new URL("../package.json", t$4), t$4.pathname === s$2.pathname) break;
	}
}, "findPackageJson"), pt = u((e$3) => {
	let t$4 = new URL("package.json", e$3);
	for (; !t$4.pathname.endsWith("/node_modules/package.json");) {
		const r$1 = fileURLToPath(t$4), n$2 = Rn(r$1);
		if (n$2) return n$2;
		const s$2 = t$4;
		if (t$4 = new URL("../package.json", t$4), t$4.pathname === s$2.pathname) break;
	}
}, "findPackageJsonSync"), Nn = u(async (e$3) => (await In(e$3))?.type ?? "commonjs", "getPackageType"), Bn = u((e$3) => pt(e$3)?.type ?? "commonjs", "getPackageTypeSync"), Wn = u((e$3) => pt(e$3)?.type, "getNearestPackageTypeSync"), ut = [".js", ".json"], ft = [
	".ts",
	".tsx",
	".jsx"
], Mn = [...ft, ...ut], Jn = [...ut, ...ft], X = Object.create(null);
X[".js"] = [
	".ts",
	".tsx",
	".js",
	".jsx"
], X[".jsx"] = [
	".tsx",
	".ts",
	".jsx",
	".js"
], X[".cjs"] = [".cts"], X[".mjs"] = [".mts"];
const dt = u((e$3) => {
	const t$4 = e$3.split("?"), r$1 = t$4[1] ? `?${t$4[1]}` : "", [n$2] = t$4, s$2 = path.extname(n$2), o$3 = [], a$3 = X[s$2];
	if (a$3) {
		const d$2 = n$2.slice(0, -s$2.length);
		o$3.push(...a$3.map((p$2) => d$2 + p$2 + r$1));
	}
	const i$4 = !(e$3.startsWith(ie) || H(n$2)) || n$2.includes(ct) || n$2.includes("/node_modules/") ? Jn : Mn;
	return o$3.push(...i$4.map((d$2) => n$2 + d$2 + r$1)), o$3;
}, "mapTsExtensions"), je = u((e$3) => Array.from(e$3).length > 0 ? `?${e$3.toString()}` : "", "urlSearchParamsStringify"), Vn = [
	".cts",
	".mts",
	".ts",
	".tsx",
	".jsx"
], Gn = [
	".js",
	".cjs",
	".mjs"
], mt = [
	".ts",
	".tsx",
	".jsx"
], ht = "module.exports", Qn = u((e$3) => {
	const t$4 = path.extname(e$3);
	return t$4 === ".mjs" || t$4 === ".mts" || (t$4 === ".js" || t$4 === ".ts") && Wn(pathToFileURL(e$3).toString()) !== "commonjs";
}, "isRequireEsmCandidate"), Te = u((e$3, t$4, r$1, n$2) => {
	const s$2 = Object.getOwnPropertyDescriptor(e$3, t$4);
	s$2?.set ? e$3[t$4] = r$1 : (!s$2 || s$2.configurable) && Object.defineProperty(e$3, t$4, {
		value: r$1,
		enumerable: s$2?.enumerable || n$2?.enumerable,
		writable: n$2?.writable ?? (s$2 ? s$2.writable : !0),
		configurable: n$2?.configurable ?? (s$2 ? s$2.configurable : !0)
	});
}, "safeSet"), Kn = u((e$3, t$4, r$1, n$2) => {
	const s$2 = t$4[".js"], o$3 = c$1(R$1), a$3 = u((i$4, d$2) => {
		if (e$3.enabled === !1) return s$2(i$4, d$2);
		const [p$2, k] = d$2.split("?");
		if ((new URLSearchParams(k).get("namespace") ?? void 0) !== n$2) return s$2(i$4, d$2);
		V(2, "load", { filePath: d$2 }), i$4.id.startsWith("data:text/javascript,") && (i$4.path = path.dirname(p$2)), s$1?.send && s$1.send({
			type: "dependency",
			path: p$2
		});
		const v = Vn.some((l$2) => p$2.endsWith(l$2)), w = Gn.some((l$2) => p$2.endsWith(l$2));
		if (!v && !w) return s$2(i$4, p$2);
		let b$1 = fs.readFileSync(p$2, "utf8");
		const E$2 = w && !p$2.endsWith(".cjs") && !p$2.endsWith(".cts") && yr(b$1), f$2 = (v || E$2) && r$1 && Ee(r$1, p$2) ? r$1.config : void 0;
		if (p$2.endsWith(".cjs")) {
			const l$2 = oe$1(d$2, b$1);
			l$2 && (b$1 = ot() ? Ce(l$2) : l$2.code);
		} else if (v || E$2) {
			const l$2 = En$1(b$1, d$2, { tsconfigRaw: f$2 });
			b$1 = ot() ? Ce(l$2) : l$2.code;
		}
		V(1, "loaded", { filePath: p$2 }), i$4._compile(b$1, p$2), k && require$$0$6._cache[p$2] === i$4 && (require$$0$6._cache[d$2] = i$4, delete require$$0$6._cache[p$2]);
		const { exports: g$1 } = i$4;
		(o$3 && g$1 && (typeof g$1 == "object" || typeof g$1 == "function") ? Object.getOwnPropertyDescriptor(g$1, ht) : void 0)?.get && Qn(p$2) && (i$4.exports = g$1[ht]);
	}, "transformer");
	Te(t$4, ".js", a$3);
	for (const i$4 of mt) Te(t$4, i$4, a$3, {
		enumerable: !n$2,
		writable: !0,
		configurable: !0
	});
	return Te(t$4, ".mjs", a$3, {
		writable: !0,
		configurable: !0
	}), () => {
		t$4[".js"] === a$3 && (t$4[".js"] = s$2);
		for (const i$4 of [...mt, ".mjs"]) t$4[i$4] === a$3 && delete t$4[i$4];
	};
}, "createExtensions"), zn = u((e$3) => (t$4) => {
	if ((t$4 === "." || t$4 === ".." || t$4.endsWith("/..")) && (t$4 += "/"), ce.test(t$4)) {
		let r$1 = path.join(t$4, "index");
		t$4.startsWith("./") && (r$1 = `./${r$1}`);
		try {
			return e$3(r$1);
		} catch {}
	}
	try {
		return e$3(t$4);
	} catch (r$1) {
		const n$2 = r$1;
		if (n$2.code === "MODULE_NOT_FOUND") try {
			return e$3(`${t$4}${path.sep}index`);
		} catch {}
		throw n$2;
	}
}, "createImplicitResolver"), pe = u((e$3, t$4, r$1, n$2) => {
	if (V(3, "resolveTsFilename", {
		request: t$4,
		isDirectory: ce.test(t$4),
		isTsParent: r$1,
		allowJs: n$2
	}), ce.test(t$4) || !r$1 && !n$2) return;
	const s$2 = dt(t$4);
	if (s$2) for (const o$3 of s$2) try {
		return e$3(o$3);
	} catch (a$3) {
		const { code: i$4 } = a$3;
		if (i$4 !== "MODULE_NOT_FOUND" && i$4 !== "ERR_PACKAGE_PATH_NOT_EXPORTED") throw a$3;
	}
}, "resolveTsFilename"), Hn = u((e$3, t$4, r$1) => (n$2) => {
	if (V(3, "resolveTsFilename", {
		request: n$2,
		isTsParent: t$4,
		isFilePath: H(n$2)
	}), H(n$2)) {
		const s$2 = pe(e$3, n$2, t$4, r$1);
		if (s$2) return s$2;
	}
	try {
		return e$3(n$2);
	} catch (s$2) {
		const o$3 = s$2;
		if (o$3.code === "MODULE_NOT_FOUND") {
			if (o$3.path) {
				const i$4 = o$3.message.match(/^Cannot find module '([^']+)'$/);
				if (i$4) {
					const p$2 = i$4[1], k = pe(e$3, p$2, t$4, r$1);
					if (k) return k;
				}
				const d$2 = o$3.message.match(/^Cannot find module '([^']+)'. Please verify that the package.json has a valid "main" entry$/);
				if (d$2) {
					const p$2 = d$2[1], k = pe(e$3, p$2, t$4, r$1);
					if (k) return k;
				}
			}
			const a$3 = pe(e$3, n$2, t$4, r$1);
			if (a$3) return a$3;
		}
		throw o$3;
	}
}, "createTsExtensionResolver"), gt = "at cjsPreparseModuleExports (node:internal", Xn = u((e$3) => {
	const t$4 = e$3.stack.split(`
`).slice(1);
	return t$4[1].includes(gt) || t$4[2].includes(gt);
}, "isFromCjsLexer"), Yn = u((e$3, t$4) => {
	const r$1 = e$3.split("?"), n$2 = new URLSearchParams(r$1[1]);
	if (t$4?.filename) {
		const s$2 = Pe(t$4.filename);
		let o$3;
		if (s$2) {
			const d$2 = s$2.split("?"), p$2 = d$2[0];
			o$3 = d$2[1];
			const m$4 = new URLSearchParams(o$3).get("namespace");
			t$4.filename = p$2, t$4.path = path.dirname(p$2), t$4.paths = require$$0$6._nodeModulePaths(t$4.path), m$4 || (require$$0$6._cache[p$2] = t$4);
		}
		o$3 || (o$3 = t$4.filename.split("?")[1]);
		const i$4 = new URLSearchParams(o$3).get("namespace");
		i$4 && n$2.append("namespace", i$4);
	}
	return [
		r$1[0],
		n$2,
		(s$2, o$3) => (path.isAbsolute(s$2) && !s$2.endsWith(".json") && !s$2.endsWith(".node") && !(o$3 === 0 && Xn(new Error())) && (s$2 += je(n$2)), s$2)
	];
}, "preserveQuery"), Zn = u((e$3, t$4, r$1, n$2) => {
	if (e$3.startsWith(ie) && (e$3 = fileURLToPath(e$3)), n$2 && !H(e$3) && !t$4?.filename?.includes(ct)) {
		const s$2 = rt(n$2, e$3);
		for (const o$3 of s$2) try {
			return r$1(o$3);
		} catch {}
	}
	return r$1(e$3);
}, "resolveTsPaths"), qn = u((e$3, t$4, r$1, n$2) => (s$2, o$3, ...a$3) => {
	if (e$3.enabled === !1) return t$4(s$2, o$3, ...a$3);
	s$2 = De(s$2);
	const [i$4, d$2, p$2] = Yn(s$2, o$3);
	if ((d$2.get("namespace") ?? void 0) !== n$2) return t$4(s$2, o$3, ...a$3);
	V(2, "resolve", {
		request: s$2,
		parent: o$3?.filename ?? o$3,
		restOfArgs: a$3
	});
	let k = u((v) => t$4(v, o$3, ...a$3), "nextResolveSimple");
	k = Hn(k, !!(n$2 || o$3?.filename && it.test(o$3.filename)), r$1?.config.compilerOptions?.allowJs ?? !1), k = zn(k);
	const m$4 = p$2(Zn(i$4, o$3, k, r$1), a$3.length);
	return V(1, "resolved", {
		request: s$2,
		parent: o$3?.filename ?? o$3,
		resolved: m$4
	}), m$4;
}, "createResolveFilename"), kt = u((e$3, t$4) => {
	if (!t$4) throw new Error("The current file path (__filename or import.meta.url) must be provided in the second argument of tsx.require()");
	return e$3.startsWith(".") ? ((typeof t$4 == "string" && t$4.startsWith(ie) || t$4 instanceof URL) && (t$4 = fileURLToPath(t$4)), path.resolve(path.dirname(t$4), e$3)) : e$3;
}, "resolveContext"), er = u((e$3) => {
	const { sourceMapsEnabled: t$4 } = process, r$1 = { enabled: !0 }, n$2 = st(process.env.TSX_TSCONFIG_PATH);
	process.setSourceMapsEnabled(!0);
	const s$2 = require$$0$6._resolveFilename, o$3 = qn(r$1, s$2, n$2, e$3?.namespace);
	require$$0$6._resolveFilename = o$3;
	const a$3 = Kn(r$1, require$$0$6._extensions, n$2, e$3?.namespace), i$4 = e$3?.namespace ? void 0 : An(), d$2 = u(() => {
		t$4 === !1 && process.setSourceMapsEnabled(!1), r$1.enabled = !1, require$$0$6._resolveFilename === o$3 && (require$$0$6._resolveFilename = s$2), a$3(), i$4?.();
	}, "unregister");
	if (e$3?.namespace) {
		const p$2 = u((m$4, v) => {
			const w = kt(m$4, v), [b$1, E$2] = w.split("?"), f$2 = new URLSearchParams(E$2);
			return e$3.namespace && !b$1.startsWith("node:") && f$2.set("namespace", e$3.namespace), m$3(b$1 + je(f$2));
		}, "scopedRequire");
		d$2.require = p$2;
		const k = u((m$4, v, w) => {
			const b$1 = kt(m$4, v), [E$2, f$2] = b$1.split("?"), g$1 = new URLSearchParams(f$2);
			return e$3.namespace && !E$2.startsWith("node:") && g$1.set("namespace", e$3.namespace), o$3(E$2 + je(g$1), module, !1, w);
		}, "scopedResolve");
		d$2.resolve = k, d$2.unregister = d$2;
	}
	return d$2;
}, "register");

//#endregion
//#region node_modules/tsx/dist/require-DzmC1hVr.mjs
var m = Object.defineProperty;
var a = (r$1, t$4) => m(r$1, "name", {
	value: t$4,
	configurable: !0
});
let e;
const s = a((r$1, t$4) => (e || (e = er({ namespace: Date.now().toString() })), e.require(r$1, t$4)), "tsxRequire"), i = a((r$1, t$4, c$2) => (e || (e = er({ namespace: Date.now().toString() })), e.resolve(r$1, t$4, c$2)), "resolve");
i.paths = m$3.resolve.paths, s.resolve = i, s.main = m$3.main, s.extensions = m$3.extensions, s.cache = m$3.cache;

//#endregion
export { er as register, s as require };