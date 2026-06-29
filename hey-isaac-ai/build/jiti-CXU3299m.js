import { __commonJS, __require, __toESM } from "./chunk-B_1218FY.js";
import { createRequire } from "node:module";

//#region node_modules/jiti/dist/jiti.cjs
var require_jiti = __commonJS({ "node_modules/jiti/dist/jiti.cjs"(exports, module) {
	(() => {
		var e = {
			"./node_modules/.pnpm/mlly@1.8.2/node_modules/mlly/dist lazy recursive"(e$1) {
				function webpackEmptyAsyncContext(e$2) {
					return Promise.resolve().then(function() {
						var t$1 = new Error("Cannot find module '" + e$2 + "'");
						throw t$1.code = "MODULE_NOT_FOUND", t$1;
					});
				}
				webpackEmptyAsyncContext.keys = () => [], webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext, webpackEmptyAsyncContext.id = "./node_modules/.pnpm/mlly@1.8.2/node_modules/mlly/dist lazy recursive", e$1.exports = webpackEmptyAsyncContext;
			},
			fs(e$1) {
				"use strict";
				e$1.exports = __require("fs");
			},
			"node:fs"(e$1) {
				"use strict";
				e$1.exports = __require("node:fs");
			},
			"node:module"(e$1) {
				"use strict";
				e$1.exports = __require("node:module");
			},
			"node:path"(e$1) {
				"use strict";
				e$1.exports = __require("node:path");
			},
			os(e$1) {
				"use strict";
				e$1.exports = __require("os");
			},
			path(e$1) {
				"use strict";
				e$1.exports = __require("path");
			},
			"./node_modules/.pnpm/get-tsconfig@4.14.0/node_modules/get-tsconfig/dist/index.cjs"(e$1, t$1, i$1) {
				"use strict";
				var n = Object.defineProperty, r = (e$2, t$2) => n(e$2, "name", {
					value: t$2,
					configurable: !0
				}), a = i$1("node:path"), c = i$1("node:fs"), l = i$1("node:module"), y = i$1("./node_modules/.pnpm/resolve-pkg-maps@1.0.0/node_modules/resolve-pkg-maps/dist/index.cjs"), E = i$1("fs"), w = i$1("os"), C = i$1("path");
				function h(e$2) {
					return e$2.startsWith("\\\\?\\") ? e$2 : e$2.replace(/\\/g, "/");
				}
				r(h, "slash");
				const S = r((e$2) => {
					const t$2 = c[e$2];
					return (i$2, ...n$1) => {
						const a$1 = `${e$2}:${n$1.join(":")}`;
						let l$1 = null == i$2 ? void 0 : i$2.get(a$1);
						return void 0 === l$1 && (l$1 = Reflect.apply(t$2, c, n$1), i$2?.set(a$1, l$1)), l$1;
					};
				}, "cacheFs"), I = S("existsSync"), N = S("readFileSync"), O = S("statSync"), j = r((e$2, t$2, i$2) => {
					for (;;) {
						const n$1 = a.posix.join(e$2, t$2);
						if (I(i$2, n$1)) return n$1;
						const c$1 = a.dirname(e$2);
						if (c$1 === e$2) return;
						e$2 = c$1;
					}
				}, "findUp"), F = /^\.{1,2}(\/.*)?$/, B = r((e$2) => {
					const t$2 = h(e$2);
					return F.test(t$2) ? t$2 : `./${t$2}`;
				}, "normalizeRelativePath");
				function Ne(e$2, t$2 = !1) {
					const i$2 = e$2.length;
					let n$1 = 0, a$1 = "", c$1 = 0, l$1 = 16, y$1 = 0, E$1 = 0, w$1 = 0, C$1 = 0, S$1 = 0;
					function _(t$3, i$3) {
						let a$2 = 0, c$2 = 0;
						for (; a$2 < t$3;) {
							let t$4 = e$2.charCodeAt(n$1);
							if (t$4 >= 48 && t$4 <= 57) c$2 = 16 * c$2 + t$4 - 48;
							else if (t$4 >= 65 && t$4 <= 70) c$2 = 16 * c$2 + t$4 - 65 + 10;
							else {
								if (!(t$4 >= 97 && t$4 <= 102)) break;
								c$2 = 16 * c$2 + t$4 - 97 + 10;
							}
							n$1++, a$2++;
						}
						return a$2 < t$3 && (c$2 = -1), c$2;
					}
					function b(e$3) {
						n$1 = e$3, a$1 = "", c$1 = 0, l$1 = 16, S$1 = 0;
					}
					function p() {
						let t$3 = n$1;
						if (48 === e$2.charCodeAt(n$1)) n$1++;
						else for (n$1++; n$1 < e$2.length && R(e$2.charCodeAt(n$1));) n$1++;
						if (n$1 < e$2.length && 46 === e$2.charCodeAt(n$1)) {
							if (n$1++, !(n$1 < e$2.length && R(e$2.charCodeAt(n$1)))) return S$1 = 3, e$2.substring(t$3, n$1);
							for (n$1++; n$1 < e$2.length && R(e$2.charCodeAt(n$1));) n$1++;
						}
						let i$3 = n$1;
						if (n$1 < e$2.length && (69 === e$2.charCodeAt(n$1) || 101 === e$2.charCodeAt(n$1))) if (n$1++, (n$1 < e$2.length && 43 === e$2.charCodeAt(n$1) || 45 === e$2.charCodeAt(n$1)) && n$1++, n$1 < e$2.length && R(e$2.charCodeAt(n$1))) {
							for (n$1++; n$1 < e$2.length && R(e$2.charCodeAt(n$1));) n$1++;
							i$3 = n$1;
						} else S$1 = 3;
						return e$2.substring(t$3, i$3);
					}
					function L() {
						let t$3 = "", a$2 = n$1;
						for (;;) {
							if (n$1 >= i$2) {
								t$3 += e$2.substring(a$2, n$1), S$1 = 2;
								break;
							}
							const c$2 = e$2.charCodeAt(n$1);
							if (34 === c$2) {
								t$3 += e$2.substring(a$2, n$1), n$1++;
								break;
							}
							if (92 !== c$2) {
								if (c$2 >= 0 && c$2 <= 31) {
									if (M(c$2)) {
										t$3 += e$2.substring(a$2, n$1), S$1 = 2;
										break;
									}
									S$1 = 6;
								}
								n$1++;
							} else {
								if (t$3 += e$2.substring(a$2, n$1), n$1++, n$1 >= i$2) {
									S$1 = 2;
									break;
								}
								switch (e$2.charCodeAt(n$1++)) {
									case 34:
										t$3 += "\"";
										break;
									case 92:
										t$3 += "\\";
										break;
									case 47:
										t$3 += "/";
										break;
									case 98:
										t$3 += "\b";
										break;
									case 102:
										t$3 += "\f";
										break;
									case 110:
										t$3 += "\n";
										break;
									case 114:
										t$3 += "\r";
										break;
									case 116:
										t$3 += "	";
										break;
									case 117:
										const e$3 = _(4);
										e$3 >= 0 ? t$3 += String.fromCharCode(e$3) : S$1 = 4;
										break;
									default: S$1 = 5;
								}
								a$2 = n$1;
							}
						}
						return t$3;
					}
					function A() {
						if (a$1 = "", S$1 = 0, c$1 = n$1, E$1 = y$1, C$1 = w$1, n$1 >= i$2) return c$1 = i$2, l$1 = 17;
						let t$3 = e$2.charCodeAt(n$1);
						if (ee(t$3)) {
							do
								n$1++, a$1 += String.fromCharCode(t$3), t$3 = e$2.charCodeAt(n$1);
							while (ee(t$3));
							return l$1 = 15;
						}
						if (M(t$3)) return n$1++, a$1 += String.fromCharCode(t$3), 13 === t$3 && 10 === e$2.charCodeAt(n$1) && (n$1++, a$1 += "\n"), y$1++, w$1 = n$1, l$1 = 14;
						switch (t$3) {
							case 123: return n$1++, l$1 = 1;
							case 125: return n$1++, l$1 = 2;
							case 91: return n$1++, l$1 = 3;
							case 93: return n$1++, l$1 = 4;
							case 58: return n$1++, l$1 = 6;
							case 44: return n$1++, l$1 = 5;
							case 34: return n$1++, a$1 = L(), l$1 = 10;
							case 47:
								const E$2 = n$1 - 1;
								if (47 === e$2.charCodeAt(n$1 + 1)) {
									for (n$1 += 2; n$1 < i$2 && !M(e$2.charCodeAt(n$1));) n$1++;
									return a$1 = e$2.substring(E$2, n$1), l$1 = 12;
								}
								if (42 === e$2.charCodeAt(n$1 + 1)) {
									n$1 += 2;
									const t$4 = i$2 - 1;
									let c$2 = !1;
									for (; n$1 < t$4;) {
										const t$5 = e$2.charCodeAt(n$1);
										if (42 === t$5 && 47 === e$2.charCodeAt(n$1 + 1)) {
											n$1 += 2, c$2 = !0;
											break;
										}
										n$1++, M(t$5) && (13 === t$5 && 10 === e$2.charCodeAt(n$1) && n$1++, y$1++, w$1 = n$1);
									}
									return c$2 || (n$1++, S$1 = 1), a$1 = e$2.substring(E$2, n$1), l$1 = 13;
								}
								return a$1 += String.fromCharCode(t$3), n$1++, l$1 = 16;
							case 45: if (a$1 += String.fromCharCode(t$3), n$1++, n$1 === i$2 || !R(e$2.charCodeAt(n$1))) return l$1 = 16;
							case 48:
							case 49:
							case 50:
							case 51:
							case 52:
							case 53:
							case 54:
							case 55:
							case 56:
							case 57: return a$1 += p(), l$1 = 11;
							default:
								for (; n$1 < i$2 && D(t$3);) n$1++, t$3 = e$2.charCodeAt(n$1);
								if (c$1 !== n$1) {
									switch (a$1 = e$2.substring(c$1, n$1), a$1) {
										case "true": return l$1 = 8;
										case "false": return l$1 = 9;
										case "null": return l$1 = 7;
									}
									return l$1 = 16;
								}
								return a$1 += String.fromCharCode(t$3), n$1++, l$1 = 16;
						}
					}
					function D(e$3) {
						if (ee(e$3) || M(e$3)) return !1;
						switch (e$3) {
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
					function x() {
						let e$3;
						do
							e$3 = A();
						while (e$3 >= 12 && e$3 <= 15);
						return e$3;
					}
					return r(_, "scanHexDigits"), r(b, "setPosition"), r(p, "scanNumber"), r(L, "scanString"), r(A, "scanNext"), r(D, "isUnknownContentCharacter"), r(x, "scanNextNonTrivia"), {
						setPosition: b,
						getPosition: r(() => n$1, "getPosition"),
						scan: t$2 ? x : A,
						getToken: r(() => l$1, "getToken"),
						getTokenValue: r(() => a$1, "getTokenValue"),
						getTokenOffset: r(() => c$1, "getTokenOffset"),
						getTokenLength: r(() => n$1 - c$1, "getTokenLength"),
						getTokenStartLine: r(() => E$1, "getTokenStartLine"),
						getTokenStartCharacter: r(() => c$1 - C$1, "getTokenStartCharacter"),
						getTokenError: r(() => S$1, "getTokenError")
					};
				}
				function ee(e$2) {
					return 32 === e$2 || 9 === e$2;
				}
				function M(e$2) {
					return 10 === e$2 || 13 === e$2;
				}
				function R(e$2) {
					return e$2 >= 48 && e$2 <= 57;
				}
				var $, q;
				r(Ne, "createScanner"), r(ee, "isWhiteSpace"), r(M, "isLineBreak"), r(R, "isDigit"), (q = $ || ($ = {}))[q.lineFeed = 10] = "lineFeed", q[q.carriageReturn = 13] = "carriageReturn", q[q.space = 32] = "space", q[q._0 = 48] = "_0", q[q._1 = 49] = "_1", q[q._2 = 50] = "_2", q[q._3 = 51] = "_3", q[q._4 = 52] = "_4", q[q._5 = 53] = "_5", q[q._6 = 54] = "_6", q[q._7 = 55] = "_7", q[q._8 = 56] = "_8", q[q._9 = 57] = "_9", q[q.a = 97] = "a", q[q.b = 98] = "b", q[q.c = 99] = "c", q[q.d = 100] = "d", q[q.e = 101] = "e", q[q.f = 102] = "f", q[q.g = 103] = "g", q[q.h = 104] = "h", q[q.i = 105] = "i", q[q.j = 106] = "j", q[q.k = 107] = "k", q[q.l = 108] = "l", q[q.m = 109] = "m", q[q.n = 110] = "n", q[q.o = 111] = "o", q[q.p = 112] = "p", q[q.q = 113] = "q", q[q.r = 114] = "r", q[q.s = 115] = "s", q[q.t = 116] = "t", q[q.u = 117] = "u", q[q.v = 118] = "v", q[q.w = 119] = "w", q[q.x = 120] = "x", q[q.y = 121] = "y", q[q.z = 122] = "z", q[q.A = 65] = "A", q[q.B = 66] = "B", q[q.C = 67] = "C", q[q.D = 68] = "D", q[q.E = 69] = "E", q[q.F = 70] = "F", q[q.G = 71] = "G", q[q.H = 72] = "H", q[q.I = 73] = "I", q[q.J = 74] = "J", q[q.K = 75] = "K", q[q.L = 76] = "L", q[q.M = 77] = "M", q[q.N = 78] = "N", q[q.O = 79] = "O", q[q.P = 80] = "P", q[q.Q = 81] = "Q", q[q.R = 82] = "R", q[q.S = 83] = "S", q[q.T = 84] = "T", q[q.U = 85] = "U", q[q.V = 86] = "V", q[q.W = 87] = "W", q[q.X = 88] = "X", q[q.Y = 89] = "Y", q[q.Z = 90] = "Z", q[q.asterisk = 42] = "asterisk", q[q.backslash = 92] = "backslash", q[q.closeBrace = 125] = "closeBrace", q[q.closeBracket = 93] = "closeBracket", q[q.colon = 58] = "colon", q[q.comma = 44] = "comma", q[q.dot = 46] = "dot", q[q.doubleQuote = 34] = "doubleQuote", q[q.minus = 45] = "minus", q[q.openBrace = 123] = "openBrace", q[q.openBracket = 91] = "openBracket", q[q.plus = 43] = "plus", q[q.slash = 47] = "slash", q[q.formFeed = 12] = "formFeed", q[q.tab = 9] = "tab", new Array(20).fill(0).map((e$2, t$2) => " ".repeat(t$2));
				const W = 200;
				var K, H, Y;
				function Pe(e$2, t$2 = [], i$2 = K.DEFAULT) {
					let n$1 = null, a$1 = [];
					const c$1 = [];
					function o(e$3) {
						Array.isArray(a$1) ? a$1.push(e$3) : null !== n$1 && (a$1[n$1] = e$3);
					}
					return r(o, "onValue"), We(e$2, {
						onObjectBegin: r(() => {
							const e$3 = {};
							o(e$3), c$1.push(a$1), a$1 = e$3, n$1 = null;
						}, "onObjectBegin"),
						onObjectProperty: r((e$3) => {
							n$1 = e$3;
						}, "onObjectProperty"),
						onObjectEnd: r(() => {
							a$1 = c$1.pop();
						}, "onObjectEnd"),
						onArrayBegin: r(() => {
							const e$3 = [];
							o(e$3), c$1.push(a$1), a$1 = e$3, n$1 = null;
						}, "onArrayBegin"),
						onArrayEnd: r(() => {
							a$1 = c$1.pop();
						}, "onArrayEnd"),
						onLiteralValue: o,
						onError: r((e$3, i$3, n$2) => {
							t$2.push({
								error: e$3,
								offset: i$3,
								length: n$2
							});
						}, "onError")
					}, i$2), a$1[0];
				}
				function We(e$2, t$2, i$2 = K.DEFAULT) {
					const n$1 = Ne(e$2, !1), a$1 = [];
					let c$1 = 0;
					function o(e$3) {
						return e$3 ? () => 0 === c$1 && e$3(n$1.getTokenOffset(), n$1.getTokenLength(), n$1.getTokenStartLine(), n$1.getTokenStartCharacter()) : () => !0;
					}
					function f(e$3) {
						return e$3 ? (t$3) => 0 === c$1 && e$3(t$3, n$1.getTokenOffset(), n$1.getTokenLength(), n$1.getTokenStartLine(), n$1.getTokenStartCharacter()) : () => !0;
					}
					function u(e$3) {
						return e$3 ? (t$3) => 0 === c$1 && e$3(t$3, n$1.getTokenOffset(), n$1.getTokenLength(), n$1.getTokenStartLine(), n$1.getTokenStartCharacter(), () => a$1.slice()) : () => !0;
					}
					function g(e$3) {
						return e$3 ? () => {
							c$1 > 0 ? c$1++ : !1 === e$3(n$1.getTokenOffset(), n$1.getTokenLength(), n$1.getTokenStartLine(), n$1.getTokenStartCharacter(), () => a$1.slice()) && (c$1 = 1);
						} : () => !0;
					}
					function m(e$3) {
						return e$3 ? () => {
							c$1 > 0 && c$1--, 0 === c$1 && e$3(n$1.getTokenOffset(), n$1.getTokenLength(), n$1.getTokenStartLine(), n$1.getTokenStartCharacter());
						} : () => !0;
					}
					r(o, "toNoArgVisit"), r(f, "toOneArgVisit"), r(u, "toOneArgVisitWithPath"), r(g, "toBeginVisit"), r(m, "toEndVisit");
					const l$1 = g(t$2.onObjectBegin), y$1 = u(t$2.onObjectProperty), E$1 = m(t$2.onObjectEnd), w$1 = g(t$2.onArrayBegin), C$1 = m(t$2.onArrayEnd), S$1 = u(t$2.onLiteralValue), I$1 = f(t$2.onSeparator), N$1 = o(t$2.onComment), O$1 = f(t$2.onError), j$1 = i$2 && i$2.disallowComments, F$1 = i$2 && i$2.allowTrailingComma;
					function T() {
						for (;;) {
							const e$3 = n$1.scan();
							switch (n$1.getTokenError()) {
								case 4:
									k(14);
									break;
								case 5:
									k(15);
									break;
								case 3:
									k(13);
									break;
								case 1:
									j$1 || k(11);
									break;
								case 2:
									k(12);
									break;
								case 6: k(16);
							}
							switch (e$3) {
								case 12:
								case 13:
									j$1 ? k(10) : N$1();
									break;
								case 16:
									k(1);
									break;
								case 15:
								case 14: break;
								default: return e$3;
							}
						}
					}
					function k(e$3, t$3 = [], i$3 = []) {
						if (O$1(e$3), t$3.length + i$3.length > 0) {
							let e$4 = n$1.getToken();
							for (; 17 !== e$4;) {
								if (-1 !== t$3.indexOf(e$4)) {
									T();
									break;
								}
								if (-1 !== i$3.indexOf(e$4)) break;
								e$4 = T();
							}
						}
					}
					function P(e$3) {
						const t$3 = n$1.getTokenValue();
						return e$3 ? S$1(t$3) : (y$1(t$3), a$1.push(t$3)), T(), !0;
					}
					function J() {
						switch (n$1.getToken()) {
							case 11:
								const e$3 = n$1.getTokenValue();
								let t$3 = Number(e$3);
								isNaN(t$3) && (k(2), t$3 = 0), S$1(t$3);
								break;
							case 7:
								S$1(null);
								break;
							case 8:
								S$1(!0);
								break;
							case 9:
								S$1(!1);
								break;
							default: return !1;
						}
						return T(), !0;
					}
					function V() {
						return 10 !== n$1.getToken() ? (k(3, [], [2, 5]), !1) : (P(!1), 6 === n$1.getToken() ? (I$1(":"), T(), U() || k(4, [], [2, 5])) : k(5, [], [2, 5]), a$1.pop(), !0);
					}
					function z() {
						l$1(), T();
						let e$3 = !1;
						for (; 2 !== n$1.getToken() && 17 !== n$1.getToken();) {
							if (5 === n$1.getToken()) {
								if (e$3 || k(4, [], []), I$1(","), T(), 2 === n$1.getToken() && F$1) break;
							} else e$3 && k(6, [], []);
							V() || k(4, [], [2, 5]), e$3 = !0;
						}
						return E$1(), 2 !== n$1.getToken() ? k(7, [2], []) : T(), !0;
					}
					function G() {
						w$1(), T();
						let e$3 = !0, t$3 = !1;
						for (; 4 !== n$1.getToken() && 17 !== n$1.getToken();) {
							if (5 === n$1.getToken()) {
								if (t$3 || k(4, [], []), I$1(","), T(), 4 === n$1.getToken() && F$1) break;
							} else t$3 && k(6, [], []);
							e$3 ? (a$1.push(0), e$3 = !1) : a$1[a$1.length - 1]++, U() || k(4, [], [4, 5]), t$3 = !0;
						}
						return C$1(), e$3 || a$1.pop(), 4 !== n$1.getToken() ? k(8, [4], []) : T(), !0;
					}
					function U() {
						switch (n$1.getToken()) {
							case 3: return G();
							case 1: return z();
							case 10: return P(!0);
							default: return J();
						}
					}
					return r(T, "scanNext"), r(k, "handleError"), r(P, "parseString"), r(J, "parseLiteral"), r(V, "parseProperty"), r(z, "parseObject"), r(G, "parseArray"), r(U, "parseValue"), T(), 17 === n$1.getToken() ? !!i$2.allowEmptyContent || (k(4, [], []), !1) : U() ? (17 !== n$1.getToken() && k(9, [], []), !0) : (k(4, [], []), !1);
				}
				new Array(W).fill(0).map((e$2, t$2) => "\n" + " ".repeat(t$2)), new Array(W).fill(0).map((e$2, t$2) => "\r" + " ".repeat(t$2)), new Array(W).fill(0).map((e$2, t$2) => "\r\n" + " ".repeat(t$2)), new Array(W).fill(0).map((e$2, t$2) => "\n" + "	".repeat(t$2)), new Array(W).fill(0).map((e$2, t$2) => "\r" + "	".repeat(t$2)), new Array(W).fill(0).map((e$2, t$2) => "\r\n" + "	".repeat(t$2)), function(e$2) {
					e$2.DEFAULT = { allowTrailingComma: !1 };
				}(K || (K = {})), r(Pe, "parse$1"), r(We, "visit"), function(e$2) {
					e$2[e$2.None = 0] = "None", e$2[e$2.UnexpectedEndOfComment = 1] = "UnexpectedEndOfComment", e$2[e$2.UnexpectedEndOfString = 2] = "UnexpectedEndOfString", e$2[e$2.UnexpectedEndOfNumber = 3] = "UnexpectedEndOfNumber", e$2[e$2.InvalidUnicode = 4] = "InvalidUnicode", e$2[e$2.InvalidEscapeCharacter = 5] = "InvalidEscapeCharacter", e$2[e$2.InvalidCharacter = 6] = "InvalidCharacter";
				}(H || (H = {})), function(e$2) {
					e$2[e$2.OpenBraceToken = 1] = "OpenBraceToken", e$2[e$2.CloseBraceToken = 2] = "CloseBraceToken", e$2[e$2.OpenBracketToken = 3] = "OpenBracketToken", e$2[e$2.CloseBracketToken = 4] = "CloseBracketToken", e$2[e$2.CommaToken = 5] = "CommaToken", e$2[e$2.ColonToken = 6] = "ColonToken", e$2[e$2.NullKeyword = 7] = "NullKeyword", e$2[e$2.TrueKeyword = 8] = "TrueKeyword", e$2[e$2.FalseKeyword = 9] = "FalseKeyword", e$2[e$2.StringLiteral = 10] = "StringLiteral", e$2[e$2.NumericLiteral = 11] = "NumericLiteral", e$2[e$2.LineCommentTrivia = 12] = "LineCommentTrivia", e$2[e$2.BlockCommentTrivia = 13] = "BlockCommentTrivia", e$2[e$2.LineBreakTrivia = 14] = "LineBreakTrivia", e$2[e$2.Trivia = 15] = "Trivia", e$2[e$2.Unknown = 16] = "Unknown", e$2[e$2.EOF = 17] = "EOF";
				}(Y || (Y = {}));
				const Q = Pe;
				var Z;
				(function(e$2) {
					e$2[e$2.InvalidSymbol = 1] = "InvalidSymbol", e$2[e$2.InvalidNumberFormat = 2] = "InvalidNumberFormat", e$2[e$2.PropertyNameExpected = 3] = "PropertyNameExpected", e$2[e$2.ValueExpected = 4] = "ValueExpected", e$2[e$2.ColonExpected = 5] = "ColonExpected", e$2[e$2.CommaExpected = 6] = "CommaExpected", e$2[e$2.CloseBraceExpected = 7] = "CloseBraceExpected", e$2[e$2.CloseBracketExpected = 8] = "CloseBracketExpected", e$2[e$2.EndOfFileExpected = 9] = "EndOfFileExpected", e$2[e$2.InvalidCommentToken = 10] = "InvalidCommentToken", e$2[e$2.UnexpectedEndOfComment = 11] = "UnexpectedEndOfComment", e$2[e$2.UnexpectedEndOfString = 12] = "UnexpectedEndOfString", e$2[e$2.UnexpectedEndOfNumber = 13] = "UnexpectedEndOfNumber", e$2[e$2.InvalidUnicode = 14] = "InvalidUnicode", e$2[e$2.InvalidEscapeCharacter = 15] = "InvalidEscapeCharacter", e$2[e$2.InvalidCharacter = 16] = "InvalidCharacter";
				})(Z || (Z = {}));
				const X = r((e$2, t$2) => Q(N(t$2, e$2, "utf8")), "readJsonc"), te = Symbol("implicitBaseUrl"), ie = "${configDir}", se = r(() => {
					const { findPnpApi: e$2 } = l;
					return e$2 && e$2(process.cwd());
				}, "getPnpApi"), re = r((e$2, t$2, i$2, n$1) => {
					const c$1 = `resolveFromPackageJsonPath:${e$2}:${t$2}:${i$2}`;
					if (null != n$1 && n$1.has(c$1)) return n$1.get(c$1);
					const l$1 = X(e$2, n$1);
					if (!l$1) return;
					let E$1 = t$2 || "tsconfig.json";
					if (!i$2 && l$1.exports) try {
						const [e$3] = y.resolveExports(l$1.exports, t$2, ["require", "types"]);
						E$1 = e$3;
					} catch {
						return !1;
					}
					else !t$2 && l$1.tsconfig && (E$1 = l$1.tsconfig);
					return E$1 = a.join(e$2, "..", E$1), n$1?.set(c$1, E$1), E$1;
				}, "resolveFromPackageJsonPath"), ne = "package.json", ae = "tsconfig.json", oe = r((e$2, t$2, i$2) => {
					let n$1 = e$2;
					if (".." === e$2 && (n$1 = a.join(n$1, ae)), "." === e$2[0] && (n$1 = a.resolve(t$2, n$1)), a.isAbsolute(n$1)) {
						if (I(i$2, n$1)) {
							if (O(i$2, n$1).isFile()) return n$1;
						} else if (!n$1.endsWith(".json")) {
							const e$3 = `${n$1}.json`;
							if (I(i$2, e$3)) return e$3;
						}
						return;
					}
					const [c$1, ...l$1] = e$2.split("/"), y$1 = "@" === c$1[0] ? `${c$1}/${l$1.shift()}` : c$1, E$1 = l$1.join("/"), w$1 = se();
					if (w$1) {
						const { resolveRequest: n$2 } = w$1;
						try {
							if (y$1 === e$2) {
								const e$3 = n$2(a.join(y$1, ne), t$2);
								if (e$3) {
									const t$3 = re(e$3, E$1, !1, i$2);
									if (t$3 && I(i$2, t$3)) return t$3;
								}
							} else {
								let i$3;
								try {
									i$3 = n$2(e$2, t$2, { extensions: [".json"] });
								} catch {
									i$3 = n$2(a.join(e$2, ae), t$2);
								}
								if (i$3) return i$3;
							}
						} catch {}
					}
					const C$1 = j(a.resolve(t$2), a.join("node_modules", y$1), i$2);
					if (!C$1 || !O(i$2, C$1).isDirectory()) return;
					const S$1 = a.join(C$1, ne);
					if (I(i$2, S$1)) {
						const e$3 = re(S$1, E$1, !1, i$2);
						if (!1 === e$3) return;
						if (e$3 && I(i$2, e$3) && O(i$2, e$3).isFile()) return e$3;
					}
					const N$1 = a.join(C$1, E$1), F$1 = N$1.endsWith(".json");
					if (!F$1) {
						const e$3 = `${N$1}.json`;
						if (I(i$2, e$3)) return e$3;
					}
					if (I(i$2, N$1)) {
						if (O(i$2, N$1).isDirectory()) {
							const e$3 = a.join(N$1, ne);
							if (I(i$2, e$3)) {
								const t$4 = re(e$3, "", !0, i$2);
								if (t$4 && I(i$2, t$4)) return t$4;
							}
							const t$3 = a.join(N$1, ae);
							if (I(i$2, t$3)) return t$3;
						} else if (F$1) return N$1;
					}
				}, "resolveExtendsPath"), ce = r((e$2, t$2) => B(a.relative(e$2, t$2)), "pathRelative"), he = [
					"files",
					"include",
					"exclude"
				], le = r((e$2, t$2, i$2) => {
					const n$1 = a.join(t$2, i$2);
					return h(a.relative(e$2, n$1)) || "./";
				}, "resolveAndRelativize"), pe = r((e$2, t$2, i$2) => {
					const n$1 = a.relative(e$2, t$2);
					if (!n$1) return i$2;
					return h(`${n$1}/${i$2.startsWith("./") ? i$2.slice(2) : i$2}`);
				}, "prefixPattern"), ue = r((e$2, t$2, i$2, n$1) => {
					const c$1 = oe(e$2, t$2, n$1);
					if (!c$1) throw new Error(`File '${e$2}' not found.`);
					if (i$2.has(c$1)) throw new Error(`Circularity detected while resolving configuration: ${c$1}`);
					i$2.add(c$1);
					const l$1 = a.dirname(c$1), y$1 = fe(c$1, n$1, i$2);
					delete y$1.references;
					const { compilerOptions: E$1 } = y$1;
					if (E$1) {
						const { baseUrl: e$3 } = E$1;
						e$3 && !e$3.startsWith(ie) && (E$1.baseUrl = le(t$2, l$1, e$3));
						const { outDir: i$3 } = E$1;
						i$3 && !i$3.startsWith(ie) && (E$1.outDir = le(t$2, l$1, i$3));
						const { declarationDir: n$2 } = E$1;
						n$2 && !n$2.startsWith(ie) && (E$1.declarationDir = le(t$2, l$1, n$2));
						const { rootDir: a$1 } = E$1;
						a$1 && !a$1.startsWith(ie) && (E$1.rootDir = le(t$2, l$1, a$1));
						const { rootDirs: c$2 } = E$1;
						c$2 && (E$1.rootDirs = c$2.map((e$4) => e$4.startsWith(ie) ? e$4 : le(t$2, l$1, e$4)));
						const { typeRoots: y$2 } = E$1;
						y$2 && (E$1.typeRoots = y$2.map((e$4) => e$4.startsWith(ie) ? e$4 : le(t$2, l$1, e$4)));
					}
					for (const e$3 of he) {
						const i$3 = y$1[e$3];
						i$3 && (y$1[e$3] = i$3.map((e$4) => e$4.startsWith(ie) ? e$4 : pe(t$2, l$1, e$4)));
					}
					return y$1;
				}, "resolveExtends"), de = ["outDir", "declarationDir"], fe = r((e$2, t$2, i$2 = new Set()) => {
					let n$1;
					try {
						n$1 = X(e$2, t$2) || {};
					} catch {
						throw new Error(`Cannot resolve tsconfig at path: ${e$2}`);
					}
					if ("object" != typeof n$1) throw new SyntaxError(`Failed to parse tsconfig at: ${e$2}`);
					const c$1 = a.dirname(e$2);
					if (n$1.compilerOptions) {
						const { compilerOptions: e$3 } = n$1;
						e$3.paths && !e$3.baseUrl && (e$3[te] = c$1);
					}
					if (n$1.extends) {
						const e$3 = Array.isArray(n$1.extends) ? n$1.extends : [n$1.extends];
						delete n$1.extends;
						for (const a$1 of e$3.reverse()) {
							const e$4 = ue(a$1, c$1, new Set(i$2), t$2), l$1 = {
								...e$4,
								...n$1,
								compilerOptions: {
									...e$4.compilerOptions,
									...n$1.compilerOptions
								}
							};
							e$4.watchOptions && (l$1.watchOptions = {
								...e$4.watchOptions,
								...n$1.watchOptions
							}), n$1 = l$1;
						}
					}
					if (n$1.compilerOptions) {
						const { compilerOptions: e$3 } = n$1, t$3 = ["baseUrl", "rootDir"];
						for (const i$3 of t$3) {
							const t$4 = e$3[i$3];
							if (t$4 && !t$4.startsWith(ie)) {
								const n$2 = a.resolve(c$1, t$4), l$1 = ce(c$1, n$2);
								e$3[i$3] = l$1;
							}
						}
						for (const t$4 of de) {
							let i$3 = e$3[t$4];
							i$3 && (Array.isArray(n$1.exclude) || (n$1.exclude = de.map((t$5) => e$3[t$5]).filter(Boolean)), i$3.startsWith(ie) || (i$3 = B(i$3)), e$3[t$4] = i$3);
						}
					} else n$1.compilerOptions = {};
					if (n$1.include && (n$1.include = n$1.include.map(h)), n$1.files && (n$1.files = n$1.files.map((e$3) => e$3.startsWith(ie) ? e$3 : B(e$3))), n$1.watchOptions) {
						const { watchOptions: e$3 } = n$1;
						e$3.excludeDirectories && (e$3.excludeDirectories = e$3.excludeDirectories.map((e$4) => h(a.resolve(c$1, e$4)))), e$3.excludeFiles && (e$3.excludeFiles = e$3.excludeFiles.map((e$4) => h(a.resolve(c$1, e$4)))), e$3.watchFile && (e$3.watchFile = e$3.watchFile.toLowerCase()), e$3.watchDirectory && (e$3.watchDirectory = e$3.watchDirectory.toLowerCase()), e$3.fallbackPolling && (e$3.fallbackPolling = e$3.fallbackPolling.toLowerCase());
					}
					return n$1;
				}, "_parseTsconfig"), me = r((e$2, t$2) => {
					if (e$2.startsWith(ie)) return h(a.join(t$2, e$2.slice(12)));
				}, "interpolateConfigDir"), ge = [
					"outDir",
					"declarationDir",
					"outFile",
					"rootDir",
					"baseUrl",
					"tsBuildInfoFile"
				], xe = r((e$2) => {
					if (e$2.strict) {
						const t$2 = [
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
						for (const i$2 of t$2) void 0 === e$2[i$2] && (e$2[i$2] = !0);
					}
					if (e$2.composite && (e$2.declaration ??= !0, e$2.incremental ??= !0), e$2.target) {
						let t$2 = e$2.target.toLowerCase();
						"es2015" === t$2 && (t$2 = "es6"), e$2.target = t$2, "esnext" === t$2 && (e$2.module ??= "es6", e$2.useDefineForClassFields ??= !0), ("es6" === t$2 || "es2016" === t$2 || "es2017" === t$2 || "es2018" === t$2 || "es2019" === t$2 || "es2020" === t$2 || "es2021" === t$2 || "es2022" === t$2 || "es2023" === t$2 || "es2024" === t$2) && (e$2.module ??= "es6"), ("es2022" === t$2 || "es2023" === t$2 || "es2024" === t$2) && (e$2.useDefineForClassFields ??= !0);
					}
					if (e$2.module) {
						let t$2 = e$2.module.toLowerCase();
						if ("es2015" === t$2 && (t$2 = "es6"), e$2.module = t$2, ("es6" === t$2 || "es2020" === t$2 || "es2022" === t$2 || "esnext" === t$2 || "none" === t$2 || "system" === t$2 || "umd" === t$2 || "amd" === t$2) && (e$2.moduleResolution ??= "classic"), "system" === t$2 && (e$2.allowSyntheticDefaultImports ??= !0), ("node16" === t$2 || "node18" === t$2 || "node20" === t$2 || "nodenext" === t$2 || "preserve" === t$2) && (e$2.esModuleInterop ??= !0, e$2.allowSyntheticDefaultImports ??= !0), ("node16" === t$2 || "node18" === t$2 || "node20" === t$2 || "nodenext" === t$2) && (e$2.moduleDetection ??= "force"), "node16" === t$2 && (e$2.target ??= "es2022", e$2.moduleResolution ??= "node16"), "node18" === t$2 && (e$2.target ??= "es2022", e$2.moduleResolution ??= "node16"), "node20" === t$2 && (e$2.target ??= "es2023", e$2.moduleResolution ??= "node16", e$2.resolveJsonModule ??= !0), "nodenext" === t$2 && (e$2.target ??= "esnext", e$2.moduleResolution ??= "nodenext", e$2.resolveJsonModule ??= !0), "node16" === t$2 || "node18" === t$2 || "node20" === t$2 || "nodenext" === t$2) {
							const t$3 = e$2.target;
							("es3" === t$3 || "es2022" === t$3 || "es2023" === t$3 || "es2024" === t$3 || "esnext" === t$3) && (e$2.useDefineForClassFields ??= !0);
						}
						"preserve" === t$2 && (e$2.moduleResolution ??= "bundler");
					}
					if (e$2.moduleResolution) {
						let t$2 = e$2.moduleResolution.toLowerCase();
						"node" === t$2 && (t$2 = "node10"), e$2.moduleResolution = t$2, ("node16" === t$2 || "nodenext" === t$2 || "bundler" === t$2) && (e$2.resolvePackageJsonExports ??= !0, e$2.resolvePackageJsonImports ??= !0), "bundler" === t$2 && (e$2.allowSyntheticDefaultImports ??= !0, e$2.resolveJsonModule ??= !0);
					}
					e$2.jsx && (e$2.jsx = e$2.jsx.toLowerCase()), e$2.moduleDetection && (e$2.moduleDetection = e$2.moduleDetection.toLowerCase()), e$2.importsNotUsedAsValues && (e$2.importsNotUsedAsValues = e$2.importsNotUsedAsValues.toLowerCase()), e$2.newLine && (e$2.newLine = e$2.newLine.toLowerCase()), e$2.esModuleInterop && (e$2.allowSyntheticDefaultImports ??= !0), e$2.verbatimModuleSyntax && (e$2.isolatedModules ??= !0, e$2.preserveConstEnums ??= !0), e$2.isolatedModules && (e$2.preserveConstEnums ??= !0), e$2.rewriteRelativeImportExtensions && (e$2.allowImportingTsExtensions ??= !0), e$2.lib && (e$2.lib = e$2.lib.map((e$3) => e$3.toLowerCase())), e$2.checkJs && (e$2.allowJs ??= !0);
				}, "normalizeCompilerOptions"), ve = r((e$2, t$2 = new Map()) => {
					const i$2 = a.resolve(e$2), n$1 = fe(i$2, t$2), c$1 = a.dirname(i$2), { compilerOptions: l$1 } = n$1;
					if (l$1) {
						for (const e$4 of ge) {
							const t$3 = l$1[e$4];
							if (t$3) {
								const i$3 = me(t$3, c$1);
								l$1[e$4] = i$3 ? ce(c$1, i$3) : t$3;
							}
						}
						for (const e$4 of ["rootDirs", "typeRoots"]) {
							const t$3 = l$1[e$4];
							t$3 && (l$1[e$4] = t$3.map((e$5) => {
								const t$4 = me(e$5, c$1);
								return t$4 ? ce(c$1, t$4) : B(e$5);
							}));
						}
						const { paths: e$3 } = l$1;
						if (e$3) for (const t$3 of Object.keys(e$3)) e$3[t$3] = e$3[t$3].map((e$4) => {
							var t$4;
							return null != (t$4 = me(e$4, c$1)) ? t$4 : e$4;
						});
						xe(l$1);
					}
					for (const e$3 of he) {
						const t$3 = n$1[e$3];
						t$3 && (n$1[e$3] = t$3.map((e$4) => {
							var t$4;
							return null != (t$4 = me(e$4, c$1)) ? t$4 : e$4;
						}));
					}
					return n$1;
				}, "parseTsconfig");
				var ye = Object.defineProperty, _e = r((e$2, t$2) => ye(e$2, "name", {
					value: t$2,
					configurable: !0
				}), "s");
				const Ee = _e((e$2) => {
					let t$2 = "";
					for (let i$2 = 0; i$2 < e$2.length; i$2 += 1) {
						const n$1 = e$2[i$2], a$1 = n$1.toUpperCase();
						t$2 += n$1 === a$1 ? n$1.toLowerCase() : a$1;
					}
					return t$2;
				}, "invertCase"), be = new Map(), ke = _e((e$2, t$2) => {
					const i$2 = C.join(e$2, `.is-fs-case-sensitive-test-${process.pid}`);
					try {
						return t$2.writeFileSync(i$2, ""), !t$2.existsSync(Ee(i$2));
					} finally {
						try {
							t$2.unlinkSync(i$2);
						} catch {}
					}
				}, "checkDirectoryCaseWithWrite"), we = _e((e$2, t$2, i$2) => {
					try {
						return ke(e$2, i$2);
					} catch (e$3) {
						if (void 0 === t$2) return ke(w.tmpdir(), i$2);
						throw e$3;
					}
				}, "checkDirectoryCaseWithFallback"), Ce = _e((e$2, t$2 = E, i$2 = !0) => {
					const n$1 = null != e$2 ? e$2 : process.cwd();
					if (i$2 && be.has(n$1)) return be.get(n$1);
					let a$1;
					const c$1 = Ee(n$1);
					return a$1 = c$1 !== n$1 && t$2.existsSync(n$1) ? !t$2.existsSync(c$1) : we(n$1, e$2, t$2), i$2 && be.set(n$1, a$1), a$1;
				}, "isFsCaseSensitive"), { join: Se } = a.posix, Ie = {
					ts: [
						".ts",
						".tsx",
						".d.ts"
					],
					cts: [".cts", ".d.cts"],
					mts: [".mts", ".d.mts"]
				}, Te = r((e$2) => {
					const t$2 = [...Ie.ts], i$2 = [...Ie.cts], n$1 = [...Ie.mts];
					return null != e$2 && e$2.allowJs && (t$2.push(".js", ".jsx"), i$2.push(".cjs"), n$1.push(".mjs")), [
						...t$2,
						...i$2,
						...n$1
					];
				}, "getSupportedExtensions"), Re = r((e$2) => {
					const t$2 = [];
					if (!e$2) return t$2;
					const { outDir: i$2, declarationDir: n$1 } = e$2;
					return i$2 && t$2.push(i$2), n$1 && t$2.push(n$1), t$2;
				}, "getDefaultExcludeSpec"), Ae = r((e$2) => e$2.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`), "escapeForRegexp"), Le = `(?!(${[
					"node_modules",
					"bower_components",
					"jspm_packages"
				].join("|")})(/|$))`, Oe = /(?:^|\/)[^.*?]+$/, De = "**/*", Ve = "[^/]", Ue = "[^./]", Me = "win32" === process.platform, je = r(({ config: e$2, path: t$2 }, i$2 = Ce()) => {
					if ("extends" in e$2) throw new Error("tsconfig#extends must be resolved. Use getTsconfig or parseTsconfig to resolve it.");
					if (!a.isAbsolute(t$2)) throw new Error("The tsconfig path must be absolute");
					Me && (t$2 = h(t$2));
					const n$1 = a.dirname(t$2), { files: c$1, include: l$1, exclude: y$1, compilerOptions: E$1 } = e$2, w$1 = r((e$3) => a.isAbsolute(e$3) ? e$3 : Se(n$1, e$3), "resolvePattern"), C$1 = null == c$1 ? void 0 : c$1.map(w$1), S$1 = Te(E$1), I$1 = i$2 ? "" : "i", N$1 = (y$1 || Re(E$1)).map((e$3) => {
						const t$3 = w$1(e$3), i$3 = Ae(t$3).replaceAll(String.raw`\*\*/`, "(.+/)?").replaceAll(String.raw`\*`, `${Ve}*`).replaceAll(String.raw`\?`, Ve);
						return new RegExp(`^${i$3}($|/)`, I$1);
					}), O$1 = c$1 || l$1 ? l$1 : [De], j$1 = O$1 ? O$1.map((e$3) => {
						let t$3 = w$1(e$3);
						Oe.test(t$3) && (t$3 = Se(t$3, De));
						const i$3 = Ae(t$3).replaceAll(String.raw`/\*\*`, `(/${Le}${Ue}${Ve}*)*?`).replaceAll(/(\/)?\\\*/g, (e$4, t$4) => {
							const i$4 = `(${Ue}|(\\.(?!min\\.js$))?)*`;
							return t$4 ? `/${Le}${Ue}${i$4}` : i$4;
						}).replaceAll(/(\/)?\\\?/g, (e$4, t$4) => t$4 ? `/${Le}${Ve}` : Ve);
						return new RegExp(`^${i$3}$`, I$1);
					}) : void 0;
					return (t$3) => {
						if (!a.isAbsolute(t$3)) throw new Error("filePath must be absolute");
						return Me && (t$3 = h(t$3)), null != C$1 && C$1.includes(t$3) || S$1.some((e$3) => t$3.endsWith(e$3)) && !N$1.some((e$3) => e$3.test(t$3)) && j$1 && j$1.some((e$3) => e$3.test(t$3)) ? e$2 : void 0;
					};
				}, "createFilesMatcher"), Fe = r((e$2, t$2, i$2) => {
					const n$1 = a.resolve(e$2);
					let c$1 = h(e$2);
					for (;;) {
						const e$3 = j(c$1, t$2, i$2);
						if (!e$3) return;
						const l$1 = a.resolve(e$3), y$1 = ve(l$1, i$2), E$1 = {
							path: h(l$1),
							config: y$1
						};
						if (je(E$1)(n$1)) return E$1;
						const w$1 = a.dirname(e$3), C$1 = a.dirname(w$1);
						if (C$1 === w$1) return;
						c$1 = C$1;
					}
				}, "findConfigApplicable"), Be = r((e$2 = process.cwd(), t$2 = "tsconfig.json", i$2 = new Map(), n$1 = !1) => {
					var a$1;
					return n$1 ? null == (a$1 = Fe(e$2, t$2, i$2)) ? void 0 : a$1.path : j(h(e$2), t$2, i$2);
				}, "findTsconfig"), $e = r((e$2 = process.cwd(), t$2 = "tsconfig.json", i$2 = new Map(), n$1 = !1) => {
					var a$1;
					if (!n$1) {
						const n$2 = Be(e$2, t$2, i$2);
						if (!n$2) return null;
						return {
							path: n$2,
							config: ve(n$2, i$2)
						};
					}
					return null != (a$1 = Fe(e$2, t$2, i$2)) ? a$1 : null;
				}, "getTsconfig"), qe = /\*/g, Ge = r((e$2, t$2) => {
					const i$2 = e$2.match(qe);
					if (i$2 && i$2.length > 1) throw new Error(t$2);
				}, "assertStarCount"), Ke = r((e$2) => {
					if (e$2.includes("*")) {
						const [t$2, i$2] = e$2.split("*");
						return {
							prefix: t$2,
							suffix: i$2
						};
					}
					return e$2;
				}, "parsePattern"), He = r(({ prefix: e$2, suffix: t$2 }, i$2) => i$2.startsWith(e$2) && i$2.endsWith(t$2), "isPatternMatch"), ze = r((e$2, t$2, i$2) => Object.entries(e$2).map(([e$3, n$1]) => (Ge(e$3, `Pattern '${e$3}' can have at most one '*' character.`), {
					pattern: Ke(e$3),
					substitutions: n$1.map((n$2) => {
						if (Ge(n$2, `Substitution '${n$2}' in pattern '${e$3}' can have at most one '*' character.`), !t$2 && !F.test(n$2) && !a.isAbsolute(n$2)) throw new Error("Non-relative paths are not allowed when 'baseUrl' is not set. Did you forget a leading './'?");
						return a.resolve(i$2, n$2);
					})
				})), "parsePaths"), Je = r((e$2) => {
					const { compilerOptions: t$2 } = e$2.config;
					if (!t$2) return null;
					const { baseUrl: i$2, paths: n$1 } = t$2;
					if (!i$2 && !n$1) return null;
					const c$1 = te in t$2 && t$2[te], l$1 = a.resolve(a.dirname(e$2.path), i$2 || c$1 || "."), y$1 = n$1 ? ze(n$1, i$2, l$1) : [];
					return (e$3) => {
						if (F.test(e$3)) return [];
						const t$3 = [];
						for (const i$3 of y$1) {
							if (i$3.pattern === e$3) return i$3.substitutions.map(h);
							"string" != typeof i$3.pattern && t$3.push(i$3);
						}
						let n$2, c$2 = -1;
						for (const i$3 of t$3) He(i$3.pattern, e$3) && i$3.pattern.prefix.length > c$2 && (c$2 = i$3.pattern.prefix.length, n$2 = i$3);
						if (!n$2) return i$2 ? [h(a.join(l$1, e$3))] : [];
						const E$1 = e$3.slice(n$2.pattern.prefix.length, e$3.length - n$2.pattern.suffix.length);
						return n$2.substitutions.map((e$4) => h(e$4.replace("*", E$1)));
					};
				}, "createPathsMatcher");
				t$1.createPathsMatcher = Je, t$1.getTsconfig = $e;
			},
			"./node_modules/.pnpm/resolve-pkg-maps@1.0.0/node_modules/resolve-pkg-maps/dist/index.cjs"(e$1, t$1) {
				"use strict";
				Object.defineProperty(t$1, "__esModule", { value: !0 });
				const d = (e$2) => null !== e$2 && "object" == typeof e$2, s = (e$2, t$2) => Object.assign(new Error(`[${e$2}]: ${t$2}`), { code: e$2 }), i$1 = "ERR_INVALID_PACKAGE_CONFIG", n = "ERR_INVALID_PACKAGE_TARGET", a = /^\d+$/, c = /^(\.{1,2}|node_modules)$/i, l = /\/|\\/;
				var y, E = ((y = E || {}).Export = "exports", y.Import = "imports", y);
				const f = (e$2, t$2, y$1, E$1, w$1) => {
					if (null == t$2) return [];
					if ("string" == typeof t$2) {
						const [i$2, ...a$1] = t$2.split(l);
						if (".." === i$2 || a$1.some((e$3) => c.test(e$3))) throw s(n, `Invalid "${e$2}" target "${t$2}" defined in the package config`);
						return [w$1 ? t$2.replace(/\*/g, w$1) : t$2];
					}
					if (Array.isArray(t$2)) return t$2.flatMap((t$3) => f(e$2, t$3, y$1, E$1, w$1));
					if (d(t$2)) {
						for (const n$1 of Object.keys(t$2)) {
							if (a.test(n$1)) throw s(i$1, "Cannot contain numeric property keys");
							if ("default" === n$1 || E$1.includes(n$1)) return f(e$2, t$2[n$1], y$1, E$1, w$1);
						}
						return [];
					}
					throw s(n, `Invalid "${e$2}" target "${t$2}"`);
				}, w = "*", v = (e$2, t$2) => {
					const i$2 = e$2.indexOf(w), n$1 = t$2.indexOf(w);
					return i$2 === n$1 ? t$2.length > e$2.length : n$1 > i$2;
				};
				function A(e$2, t$2) {
					if (!t$2.includes(w) && e$2.hasOwnProperty(t$2)) return [t$2];
					let i$2, n$1;
					for (const a$1 of Object.keys(e$2)) if (a$1.includes(w)) {
						const [e$3, c$1, l$1] = a$1.split(w);
						if (void 0 === l$1 && t$2.startsWith(e$3) && t$2.endsWith(c$1)) {
							const l$2 = t$2.slice(e$3.length, -c$1.length || void 0);
							l$2 && (!i$2 || v(i$2, a$1)) && (i$2 = a$1, n$1 = l$2);
						}
					}
					return [i$2, n$1];
				}
				const C = /^\w+:/;
				t$1.resolveExports = (e$2, t$2, a$1) => {
					if (!e$2) throw new Error("\"exports\" is required");
					t$2 = "" === t$2 ? "." : `./${t$2}`, ("string" == typeof e$2 || Array.isArray(e$2) || d(e$2) && ((e$3) => Object.keys(e$3).reduce((e$4, t$3) => {
						const n$1 = "" === t$3 || "." !== t$3[0];
						if (void 0 === e$4 || e$4 === n$1) return n$1;
						throw s(i$1, "\"exports\" cannot contain some keys starting with \".\" and some not");
					}, void 0))(e$2)) && (e$2 = { ".": e$2 });
					const [c$1, l$1] = A(e$2, t$2), y$1 = f(E.Export, e$2[c$1], t$2, a$1, l$1);
					if (0 === y$1.length) throw s("ERR_PACKAGE_PATH_NOT_EXPORTED", "." === t$2 ? "No \"exports\" main defined" : `Package subpath '${t$2}' is not defined by "exports"`);
					for (const e$3 of y$1) if (!e$3.startsWith("./") && !C.test(e$3)) throw s(n, `Invalid "exports" target "${e$3}" defined in the package config`);
					return y$1;
				}, t$1.resolveImports = (e$2, t$2, i$2) => {
					if (!e$2) throw new Error("\"imports\" is required");
					const [n$1, a$1] = A(e$2, t$2), c$1 = f(E.Import, e$2[n$1], t$2, i$2, a$1);
					if (0 === c$1.length) throw s("ERR_PACKAGE_IMPORT_NOT_DEFINED", `Package import specifier "${t$2}" is not defined in package`);
					return c$1;
				};
			}
		}, t = {};
		function __webpack_require__(i$1) {
			var n = t[i$1];
			if (void 0 !== n) return n.exports;
			var a = t[i$1] = { exports: {} };
			return e[i$1](a, a.exports, __webpack_require__), a.exports;
		}
		__webpack_require__.n = (e$1) => {
			var t$1 = e$1 && e$1.__esModule ? () => e$1.default : () => e$1;
			return __webpack_require__.d(t$1, { a: t$1 }), t$1;
		}, __webpack_require__.d = (e$1, t$1) => {
			for (var i$1 in t$1) __webpack_require__.o(t$1, i$1) && !__webpack_require__.o(e$1, i$1) && Object.defineProperty(e$1, i$1, {
				enumerable: !0,
				get: t$1[i$1]
			});
		}, __webpack_require__.o = (e$1, t$1) => Object.prototype.hasOwnProperty.call(e$1, t$1);
		var i = {};
		(() => {
			"use strict";
			__webpack_require__.d(i, { default: () => createJiti$1 });
			const e$1 = __require("node:os");
			var t$1 = [
				509,
				0,
				227,
				0,
				150,
				4,
				294,
				9,
				1368,
				2,
				2,
				1,
				6,
				3,
				41,
				2,
				5,
				0,
				166,
				1,
				574,
				3,
				9,
				9,
				7,
				9,
				32,
				4,
				318,
				1,
				78,
				5,
				71,
				10,
				50,
				3,
				123,
				2,
				54,
				14,
				32,
				10,
				3,
				1,
				11,
				3,
				46,
				10,
				8,
				0,
				46,
				9,
				7,
				2,
				37,
				13,
				2,
				9,
				6,
				1,
				45,
				0,
				13,
				2,
				49,
				13,
				9,
				3,
				2,
				11,
				83,
				11,
				7,
				0,
				3,
				0,
				158,
				11,
				6,
				9,
				7,
				3,
				56,
				1,
				2,
				6,
				3,
				1,
				3,
				2,
				10,
				0,
				11,
				1,
				3,
				6,
				4,
				4,
				68,
				8,
				2,
				0,
				3,
				0,
				2,
				3,
				2,
				4,
				2,
				0,
				15,
				1,
				83,
				17,
				10,
				9,
				5,
				0,
				82,
				19,
				13,
				9,
				214,
				6,
				3,
				8,
				28,
				1,
				83,
				16,
				16,
				9,
				82,
				12,
				9,
				9,
				7,
				19,
				58,
				14,
				5,
				9,
				243,
				14,
				166,
				9,
				71,
				5,
				2,
				1,
				3,
				3,
				2,
				0,
				2,
				1,
				13,
				9,
				120,
				6,
				3,
				6,
				4,
				0,
				29,
				9,
				41,
				6,
				2,
				3,
				9,
				0,
				10,
				10,
				47,
				15,
				199,
				7,
				137,
				9,
				54,
				7,
				2,
				7,
				17,
				9,
				57,
				21,
				2,
				13,
				123,
				5,
				4,
				0,
				2,
				1,
				2,
				6,
				2,
				0,
				9,
				9,
				49,
				4,
				2,
				1,
				2,
				4,
				9,
				9,
				55,
				9,
				266,
				3,
				10,
				1,
				2,
				0,
				49,
				6,
				4,
				4,
				14,
				10,
				5350,
				0,
				7,
				14,
				11465,
				27,
				2343,
				9,
				87,
				9,
				39,
				4,
				60,
				6,
				26,
				9,
				535,
				9,
				470,
				0,
				2,
				54,
				8,
				3,
				82,
				0,
				12,
				1,
				19628,
				1,
				4178,
				9,
				519,
				45,
				3,
				22,
				543,
				4,
				4,
				5,
				9,
				7,
				3,
				6,
				31,
				3,
				149,
				2,
				1418,
				49,
				513,
				54,
				5,
				49,
				9,
				0,
				15,
				0,
				23,
				4,
				2,
				14,
				1361,
				6,
				2,
				16,
				3,
				6,
				2,
				1,
				2,
				4,
				101,
				0,
				161,
				6,
				10,
				9,
				357,
				0,
				62,
				13,
				499,
				13,
				245,
				1,
				2,
				9,
				233,
				0,
				3,
				0,
				8,
				1,
				6,
				0,
				475,
				6,
				110,
				6,
				6,
				9,
				4759,
				9,
				787719,
				239
			], n = [
				0,
				11,
				2,
				25,
				2,
				18,
				2,
				1,
				2,
				14,
				3,
				13,
				35,
				122,
				70,
				52,
				268,
				28,
				4,
				48,
				48,
				31,
				14,
				29,
				6,
				37,
				11,
				29,
				3,
				35,
				5,
				7,
				2,
				4,
				43,
				157,
				19,
				35,
				5,
				35,
				5,
				39,
				9,
				51,
				13,
				10,
				2,
				14,
				2,
				6,
				2,
				1,
				2,
				10,
				2,
				14,
				2,
				6,
				2,
				1,
				4,
				51,
				13,
				310,
				10,
				21,
				11,
				7,
				25,
				5,
				2,
				41,
				2,
				8,
				70,
				5,
				3,
				0,
				2,
				43,
				2,
				1,
				4,
				0,
				3,
				22,
				11,
				22,
				10,
				30,
				66,
				18,
				2,
				1,
				11,
				21,
				11,
				25,
				7,
				25,
				39,
				55,
				7,
				1,
				65,
				0,
				16,
				3,
				2,
				2,
				2,
				28,
				43,
				28,
				4,
				28,
				36,
				7,
				2,
				27,
				28,
				53,
				11,
				21,
				11,
				18,
				14,
				17,
				111,
				72,
				56,
				50,
				14,
				50,
				14,
				35,
				39,
				27,
				10,
				22,
				251,
				41,
				7,
				1,
				17,
				5,
				57,
				28,
				11,
				0,
				9,
				21,
				43,
				17,
				47,
				20,
				28,
				22,
				13,
				52,
				58,
				1,
				3,
				0,
				14,
				44,
				33,
				24,
				27,
				35,
				30,
				0,
				3,
				0,
				9,
				34,
				4,
				0,
				13,
				47,
				15,
				3,
				22,
				0,
				2,
				0,
				36,
				17,
				2,
				24,
				20,
				1,
				64,
				6,
				2,
				0,
				2,
				3,
				2,
				14,
				2,
				9,
				8,
				46,
				39,
				7,
				3,
				1,
				3,
				21,
				2,
				6,
				2,
				1,
				2,
				4,
				4,
				0,
				19,
				0,
				13,
				4,
				31,
				9,
				2,
				0,
				3,
				0,
				2,
				37,
				2,
				0,
				26,
				0,
				2,
				0,
				45,
				52,
				19,
				3,
				21,
				2,
				31,
				47,
				21,
				1,
				2,
				0,
				185,
				46,
				42,
				3,
				37,
				47,
				21,
				0,
				60,
				42,
				14,
				0,
				72,
				26,
				38,
				6,
				186,
				43,
				117,
				63,
				32,
				7,
				3,
				0,
				3,
				7,
				2,
				1,
				2,
				23,
				16,
				0,
				2,
				0,
				95,
				7,
				3,
				38,
				17,
				0,
				2,
				0,
				29,
				0,
				11,
				39,
				8,
				0,
				22,
				0,
				12,
				45,
				20,
				0,
				19,
				72,
				200,
				32,
				32,
				8,
				2,
				36,
				18,
				0,
				50,
				29,
				113,
				6,
				2,
				1,
				2,
				37,
				22,
				0,
				26,
				5,
				2,
				1,
				2,
				31,
				15,
				0,
				24,
				43,
				261,
				18,
				16,
				0,
				2,
				12,
				2,
				33,
				125,
				0,
				80,
				921,
				103,
				110,
				18,
				195,
				2637,
				96,
				16,
				1071,
				18,
				5,
				26,
				3994,
				6,
				582,
				6842,
				29,
				1763,
				568,
				8,
				30,
				18,
				78,
				18,
				29,
				19,
				47,
				17,
				3,
				32,
				20,
				6,
				18,
				433,
				44,
				212,
				63,
				33,
				24,
				3,
				24,
				45,
				74,
				6,
				0,
				67,
				12,
				65,
				1,
				2,
				0,
				15,
				4,
				10,
				7381,
				42,
				31,
				98,
				114,
				8702,
				3,
				2,
				6,
				2,
				1,
				2,
				290,
				16,
				0,
				30,
				2,
				3,
				0,
				15,
				3,
				9,
				395,
				2309,
				106,
				6,
				12,
				4,
				8,
				8,
				9,
				5991,
				84,
				2,
				70,
				2,
				1,
				3,
				0,
				3,
				1,
				3,
				3,
				2,
				11,
				2,
				0,
				2,
				6,
				2,
				64,
				2,
				3,
				3,
				7,
				2,
				6,
				2,
				27,
				2,
				3,
				2,
				4,
				2,
				0,
				4,
				6,
				2,
				339,
				3,
				24,
				2,
				24,
				2,
				30,
				2,
				24,
				2,
				30,
				2,
				24,
				2,
				30,
				2,
				24,
				2,
				30,
				2,
				24,
				2,
				7,
				1845,
				30,
				7,
				5,
				262,
				61,
				147,
				44,
				11,
				6,
				17,
				0,
				322,
				29,
				19,
				43,
				485,
				27,
				229,
				29,
				3,
				0,
				208,
				30,
				2,
				2,
				2,
				1,
				2,
				6,
				3,
				4,
				10,
				1,
				225,
				6,
				2,
				3,
				2,
				1,
				2,
				14,
				2,
				196,
				60,
				67,
				8,
				0,
				1205,
				3,
				2,
				26,
				2,
				1,
				2,
				0,
				3,
				0,
				2,
				9,
				2,
				3,
				2,
				0,
				2,
				0,
				7,
				0,
				5,
				0,
				2,
				0,
				2,
				0,
				2,
				2,
				2,
				1,
				2,
				0,
				3,
				0,
				2,
				0,
				2,
				0,
				2,
				0,
				2,
				0,
				2,
				1,
				2,
				0,
				3,
				3,
				2,
				6,
				2,
				3,
				2,
				3,
				2,
				0,
				2,
				9,
				2,
				16,
				6,
				2,
				2,
				4,
				2,
				16,
				4421,
				42719,
				33,
				4381,
				3,
				5773,
				3,
				7472,
				16,
				621,
				2467,
				541,
				1507,
				4938,
				6,
				8489
			], a = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-࢏ࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚ౜ౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽ೜-ೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-Ƛ꟱-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ", c = {
				3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
				5: "class enum extends super const export import",
				6: "enum",
				strict: "implements interface let package private protected public static yield",
				strictBind: "eval arguments"
			}, l = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this", y = {
				5: l,
				"5module": l + " export import",
				6: l + " const class extends export import super"
			}, E = /^in(stanceof)?$/, w = new RegExp("[" + a + "]"), C = new RegExp("[" + a + "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-᫝᫠-᫫ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･]");
			function isInAstralSet(e$2, t$2) {
				for (var i$1 = 65536, n$1 = 0; n$1 < t$2.length; n$1 += 2) {
					if ((i$1 += t$2[n$1]) > e$2) return !1;
					if ((i$1 += t$2[n$1 + 1]) >= e$2) return !0;
				}
				return !1;
			}
			function isIdentifierStart(e$2, t$2) {
				return e$2 < 65 ? 36 === e$2 : e$2 < 91 || (e$2 < 97 ? 95 === e$2 : e$2 < 123 || (e$2 <= 65535 ? e$2 >= 170 && w.test(String.fromCharCode(e$2)) : !1 !== t$2 && isInAstralSet(e$2, n)));
			}
			function isIdentifierChar(e$2, i$1) {
				return e$2 < 48 ? 36 === e$2 : e$2 < 58 || !(e$2 < 65) && (e$2 < 91 || (e$2 < 97 ? 95 === e$2 : e$2 < 123 || (e$2 <= 65535 ? e$2 >= 170 && C.test(String.fromCharCode(e$2)) : !1 !== i$1 && (isInAstralSet(e$2, n) || isInAstralSet(e$2, t$1)))));
			}
			var acorn_TokenType = function(e$2, t$2) {
				void 0 === t$2 && (t$2 = {}), this.label = e$2, this.keyword = t$2.keyword, this.beforeExpr = !!t$2.beforeExpr, this.startsExpr = !!t$2.startsExpr, this.isLoop = !!t$2.isLoop, this.isAssign = !!t$2.isAssign, this.prefix = !!t$2.prefix, this.postfix = !!t$2.postfix, this.binop = t$2.binop || null, this.updateContext = null;
			};
			function binop(e$2, t$2) {
				return new acorn_TokenType(e$2, {
					beforeExpr: !0,
					binop: t$2
				});
			}
			var S = { beforeExpr: !0 }, I = { startsExpr: !0 }, N = {};
			function kw(e$2, t$2) {
				return void 0 === t$2 && (t$2 = {}), t$2.keyword = e$2, N[e$2] = new acorn_TokenType(e$2, t$2);
			}
			var O = {
				num: new acorn_TokenType("num", I),
				regexp: new acorn_TokenType("regexp", I),
				string: new acorn_TokenType("string", I),
				name: new acorn_TokenType("name", I),
				privateId: new acorn_TokenType("privateId", I),
				eof: new acorn_TokenType("eof"),
				bracketL: new acorn_TokenType("[", {
					beforeExpr: !0,
					startsExpr: !0
				}),
				bracketR: new acorn_TokenType("]"),
				braceL: new acorn_TokenType("{", {
					beforeExpr: !0,
					startsExpr: !0
				}),
				braceR: new acorn_TokenType("}"),
				parenL: new acorn_TokenType("(", {
					beforeExpr: !0,
					startsExpr: !0
				}),
				parenR: new acorn_TokenType(")"),
				comma: new acorn_TokenType(",", S),
				semi: new acorn_TokenType(";", S),
				colon: new acorn_TokenType(":", S),
				dot: new acorn_TokenType("."),
				question: new acorn_TokenType("?", S),
				questionDot: new acorn_TokenType("?."),
				arrow: new acorn_TokenType("=>", S),
				template: new acorn_TokenType("template"),
				invalidTemplate: new acorn_TokenType("invalidTemplate"),
				ellipsis: new acorn_TokenType("...", S),
				backQuote: new acorn_TokenType("`", I),
				dollarBraceL: new acorn_TokenType("${", {
					beforeExpr: !0,
					startsExpr: !0
				}),
				eq: new acorn_TokenType("=", {
					beforeExpr: !0,
					isAssign: !0
				}),
				assign: new acorn_TokenType("_=", {
					beforeExpr: !0,
					isAssign: !0
				}),
				incDec: new acorn_TokenType("++/--", {
					prefix: !0,
					postfix: !0,
					startsExpr: !0
				}),
				prefix: new acorn_TokenType("!/~", {
					beforeExpr: !0,
					prefix: !0,
					startsExpr: !0
				}),
				logicalOR: binop("||", 1),
				logicalAND: binop("&&", 2),
				bitwiseOR: binop("|", 3),
				bitwiseXOR: binop("^", 4),
				bitwiseAND: binop("&", 5),
				equality: binop("==/!=/===/!==", 6),
				relational: binop("</>/<=/>=", 7),
				bitShift: binop("<</>>/>>>", 8),
				plusMin: new acorn_TokenType("+/-", {
					beforeExpr: !0,
					binop: 9,
					prefix: !0,
					startsExpr: !0
				}),
				modulo: binop("%", 10),
				star: binop("*", 10),
				slash: binop("/", 10),
				starstar: new acorn_TokenType("**", { beforeExpr: !0 }),
				coalesce: binop("??", 1),
				_break: kw("break"),
				_case: kw("case", S),
				_catch: kw("catch"),
				_continue: kw("continue"),
				_debugger: kw("debugger"),
				_default: kw("default", S),
				_do: kw("do", {
					isLoop: !0,
					beforeExpr: !0
				}),
				_else: kw("else", S),
				_finally: kw("finally"),
				_for: kw("for", { isLoop: !0 }),
				_function: kw("function", I),
				_if: kw("if"),
				_return: kw("return", S),
				_switch: kw("switch"),
				_throw: kw("throw", S),
				_try: kw("try"),
				_var: kw("var"),
				_const: kw("const"),
				_while: kw("while", { isLoop: !0 }),
				_with: kw("with"),
				_new: kw("new", {
					beforeExpr: !0,
					startsExpr: !0
				}),
				_this: kw("this", I),
				_super: kw("super", I),
				_class: kw("class", I),
				_extends: kw("extends", S),
				_export: kw("export"),
				_import: kw("import", I),
				_null: kw("null", I),
				_true: kw("true", I),
				_false: kw("false", I),
				_in: kw("in", {
					beforeExpr: !0,
					binop: 7
				}),
				_instanceof: kw("instanceof", {
					beforeExpr: !0,
					binop: 7
				}),
				_typeof: kw("typeof", {
					beforeExpr: !0,
					prefix: !0,
					startsExpr: !0
				}),
				_void: kw("void", {
					beforeExpr: !0,
					prefix: !0,
					startsExpr: !0
				}),
				_delete: kw("delete", {
					beforeExpr: !0,
					prefix: !0,
					startsExpr: !0
				})
			}, j = /\r\n?|\n|\u2028|\u2029/, F = new RegExp(j.source, "g");
			function isNewLine(e$2) {
				return 10 === e$2 || 13 === e$2 || 8232 === e$2 || 8233 === e$2;
			}
			function nextLineBreak(e$2, t$2, i$1) {
				void 0 === i$1 && (i$1 = e$2.length);
				for (var n$1 = t$2; n$1 < i$1; n$1++) {
					var a$1 = e$2.charCodeAt(n$1);
					if (isNewLine(a$1)) return n$1 < i$1 - 1 && 13 === a$1 && 10 === e$2.charCodeAt(n$1 + 1) ? n$1 + 2 : n$1 + 1;
				}
				return -1;
			}
			var B = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/, $ = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g, q = Object.prototype, W = q.hasOwnProperty, K = q.toString, H = Object.hasOwn || function(e$2, t$2) {
				return W.call(e$2, t$2);
			}, Y = Array.isArray || function(e$2) {
				return "[object Array]" === K.call(e$2);
			}, Q = Object.create(null);
			function wordsRegexp(e$2) {
				return Q[e$2] || (Q[e$2] = new RegExp("^(?:" + e$2.replace(/ /g, "|") + ")$"));
			}
			function codePointToString(e$2) {
				return e$2 <= 65535 ? String.fromCharCode(e$2) : (e$2 -= 65536, String.fromCharCode(55296 + (e$2 >> 10), 56320 + (1023 & e$2)));
			}
			var Z = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/, acorn_Position = function(e$2, t$2) {
				this.line = e$2, this.column = t$2;
			};
			acorn_Position.prototype.offset = function(e$2) {
				return new acorn_Position(this.line, this.column + e$2);
			};
			var acorn_SourceLocation = function(e$2, t$2, i$1) {
				this.start = t$2, this.end = i$1, null !== e$2.sourceFile && (this.source = e$2.sourceFile);
			};
			function getLineInfo(e$2, t$2) {
				for (var i$1 = 1, n$1 = 0;;) {
					var a$1 = nextLineBreak(e$2, n$1, t$2);
					if (a$1 < 0) return new acorn_Position(i$1, t$2 - n$1);
					++i$1, n$1 = a$1;
				}
			}
			var X = {
				ecmaVersion: null,
				sourceType: "script",
				onInsertedSemicolon: null,
				onTrailingComma: null,
				allowReserved: null,
				allowReturnOutsideFunction: !1,
				allowImportExportEverywhere: !1,
				allowAwaitOutsideFunction: null,
				allowSuperOutsideMethod: null,
				allowHashBang: !1,
				checkPrivateFields: !0,
				locations: !1,
				onToken: null,
				onComment: null,
				ranges: !1,
				program: null,
				sourceFile: null,
				directSourceFile: null,
				preserveParens: !1
			}, te = !1;
			function getOptions(e$2) {
				var t$2 = {};
				for (var i$1 in X) t$2[i$1] = e$2 && H(e$2, i$1) ? e$2[i$1] : X[i$1];
				if ("latest" === t$2.ecmaVersion ? t$2.ecmaVersion = 1e8 : null == t$2.ecmaVersion ? (!te && "object" == typeof console && console.warn && (te = !0, console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.")), t$2.ecmaVersion = 11) : t$2.ecmaVersion >= 2015 && (t$2.ecmaVersion -= 2009), t$2.allowReserved ??= t$2.ecmaVersion < 5, e$2 && null != e$2.allowHashBang || (t$2.allowHashBang = t$2.ecmaVersion >= 14), Y(t$2.onToken)) {
					var n$1 = t$2.onToken;
					t$2.onToken = function(e$3) {
						return n$1.push(e$3);
					};
				}
				if (Y(t$2.onComment) && (t$2.onComment = function(e$3, t$3) {
					return function(i$2, n$2, a$1, c$1, l$1, y$1) {
						var E$1 = {
							type: i$2 ? "Block" : "Line",
							value: n$2,
							start: a$1,
							end: c$1
						};
						e$3.locations && (E$1.loc = new acorn_SourceLocation(this, l$1, y$1)), e$3.ranges && (E$1.range = [a$1, c$1]), t$3.push(E$1);
					};
				}(t$2, t$2.onComment)), "commonjs" === t$2.sourceType && t$2.allowAwaitOutsideFunction) throw new Error("Cannot use allowAwaitOutsideFunction with sourceType: commonjs");
				return t$2;
			}
			var ie = 256, se = 259;
			function functionFlags(e$2, t$2) {
				return 2 | (e$2 ? 4 : 0) | (t$2 ? 8 : 0);
			}
			var acorn_Parser = function(e$2, t$2, i$1) {
				this.options = e$2 = getOptions(e$2), this.sourceFile = e$2.sourceFile, this.keywords = wordsRegexp(y[e$2.ecmaVersion >= 6 ? 6 : "module" === e$2.sourceType ? "5module" : 5]);
				var n$1 = "";
				!0 !== e$2.allowReserved && (n$1 = c[e$2.ecmaVersion >= 6 ? 6 : 5 === e$2.ecmaVersion ? 5 : 3], "module" === e$2.sourceType && (n$1 += " await")), this.reservedWords = wordsRegexp(n$1);
				var a$1 = (n$1 ? n$1 + " " : "") + c.strict;
				this.reservedWordsStrict = wordsRegexp(a$1), this.reservedWordsStrictBind = wordsRegexp(a$1 + " " + c.strictBind), this.input = String(t$2), this.containsEsc = !1, i$1 ? (this.pos = i$1, this.lineStart = this.input.lastIndexOf("\n", i$1 - 1) + 1, this.curLine = this.input.slice(0, this.lineStart).split(j).length) : (this.pos = this.lineStart = 0, this.curLine = 1), this.type = O.eof, this.value = null, this.start = this.end = this.pos, this.startLoc = this.endLoc = this.curPosition(), this.lastTokEndLoc = this.lastTokStartLoc = null, this.lastTokStart = this.lastTokEnd = this.pos, this.context = this.initialContext(), this.exprAllowed = !0, this.inModule = "module" === e$2.sourceType, this.strict = this.inModule || this.strictDirective(this.pos), this.potentialArrowAt = -1, this.potentialArrowInForAwait = !1, this.yieldPos = this.awaitPos = this.awaitIdentPos = 0, this.labels = [], this.undefinedExports = Object.create(null), 0 === this.pos && e$2.allowHashBang && "#!" === this.input.slice(0, 2) && this.skipLineComment(2), this.scopeStack = [], this.enterScope("commonjs" === this.options.sourceType ? 2 : 1), this.regexpState = null, this.privateNameStack = [];
			}, re = {
				inFunction: { configurable: !0 },
				inGenerator: { configurable: !0 },
				inAsync: { configurable: !0 },
				canAwait: { configurable: !0 },
				allowReturn: { configurable: !0 },
				allowSuper: { configurable: !0 },
				allowDirectSuper: { configurable: !0 },
				treatFunctionsAsVar: { configurable: !0 },
				allowNewDotTarget: { configurable: !0 },
				allowUsing: { configurable: !0 },
				inClassStaticBlock: { configurable: !0 }
			};
			acorn_Parser.prototype.parse = function() {
				var e$2 = this.options.program || this.startNode();
				return this.nextToken(), this.parseTopLevel(e$2);
			}, re.inFunction.get = function() {
				return (2 & this.currentVarScope().flags) > 0;
			}, re.inGenerator.get = function() {
				return (8 & this.currentVarScope().flags) > 0;
			}, re.inAsync.get = function() {
				return (4 & this.currentVarScope().flags) > 0;
			}, re.canAwait.get = function() {
				for (var e$2 = this.scopeStack.length - 1; e$2 >= 0; e$2--) {
					var t$2 = this.scopeStack[e$2].flags;
					if (768 & t$2) return !1;
					if (2 & t$2) return (4 & t$2) > 0;
				}
				return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
			}, re.allowReturn.get = function() {
				return !!this.inFunction || !!(this.options.allowReturnOutsideFunction && 1 & this.currentVarScope().flags);
			}, re.allowSuper.get = function() {
				return (64 & this.currentThisScope().flags) > 0 || this.options.allowSuperOutsideMethod;
			}, re.allowDirectSuper.get = function() {
				return (128 & this.currentThisScope().flags) > 0;
			}, re.treatFunctionsAsVar.get = function() {
				return this.treatFunctionsAsVarInScope(this.currentScope());
			}, re.allowNewDotTarget.get = function() {
				for (var e$2 = this.scopeStack.length - 1; e$2 >= 0; e$2--) {
					var t$2 = this.scopeStack[e$2].flags;
					if (768 & t$2 || 2 & t$2 && !(16 & t$2)) return !0;
				}
				return !1;
			}, re.allowUsing.get = function() {
				var e$2 = this.currentScope().flags;
				return !(1024 & e$2) && !(!this.inModule && 1 & e$2);
			}, re.inClassStaticBlock.get = function() {
				return (this.currentVarScope().flags & ie) > 0;
			}, acorn_Parser.extend = function() {
				for (var e$2 = [], t$2 = arguments.length; t$2--;) e$2[t$2] = arguments[t$2];
				for (var i$1 = this, n$1 = 0; n$1 < e$2.length; n$1++) i$1 = e$2[n$1](i$1);
				return i$1;
			}, acorn_Parser.parse = function(e$2, t$2) {
				return new this(t$2, e$2).parse();
			}, acorn_Parser.parseExpressionAt = function(e$2, t$2, i$1) {
				var n$1 = new this(i$1, e$2, t$2);
				return n$1.nextToken(), n$1.parseExpression();
			}, acorn_Parser.tokenizer = function(e$2, t$2) {
				return new this(t$2, e$2);
			}, Object.defineProperties(acorn_Parser.prototype, re);
			var ne = acorn_Parser.prototype, ae = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
			ne.strictDirective = function(e$2) {
				if (this.options.ecmaVersion < 5) return !1;
				for (;;) {
					$.lastIndex = e$2, e$2 += $.exec(this.input)[0].length;
					var t$2 = ae.exec(this.input.slice(e$2));
					if (!t$2) return !1;
					if ("use strict" === (t$2[1] || t$2[2])) {
						$.lastIndex = e$2 + t$2[0].length;
						var i$1 = $.exec(this.input), n$1 = i$1.index + i$1[0].length, a$1 = this.input.charAt(n$1);
						return ";" === a$1 || "}" === a$1 || j.test(i$1[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(a$1) || "!" === a$1 && "=" === this.input.charAt(n$1 + 1));
					}
					e$2 += t$2[0].length, $.lastIndex = e$2, e$2 += $.exec(this.input)[0].length, ";" === this.input[e$2] && e$2++;
				}
			}, ne.eat = function(e$2) {
				return this.type === e$2 && (this.next(), !0);
			}, ne.isContextual = function(e$2) {
				return this.type === O.name && this.value === e$2 && !this.containsEsc;
			}, ne.eatContextual = function(e$2) {
				return !!this.isContextual(e$2) && (this.next(), !0);
			}, ne.expectContextual = function(e$2) {
				this.eatContextual(e$2) || this.unexpected();
			}, ne.canInsertSemicolon = function() {
				return this.type === O.eof || this.type === O.braceR || j.test(this.input.slice(this.lastTokEnd, this.start));
			}, ne.insertSemicolon = function() {
				if (this.canInsertSemicolon()) return this.options.onInsertedSemicolon && this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc), !0;
			}, ne.semicolon = function() {
				this.eat(O.semi) || this.insertSemicolon() || this.unexpected();
			}, ne.afterTrailingComma = function(e$2, t$2) {
				if (this.type === e$2) return this.options.onTrailingComma && this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc), t$2 || this.next(), !0;
			}, ne.expect = function(e$2) {
				this.eat(e$2) || this.unexpected();
			}, ne.unexpected = function(e$2) {
				this.raise(null != e$2 ? e$2 : this.start, "Unexpected token");
			};
			var acorn_DestructuringErrors = function() {
				this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
			};
			ne.checkPatternErrors = function(e$2, t$2) {
				if (e$2) {
					e$2.trailingComma > -1 && this.raiseRecoverable(e$2.trailingComma, "Comma is not permitted after the rest element");
					var i$1 = t$2 ? e$2.parenthesizedAssign : e$2.parenthesizedBind;
					i$1 > -1 && this.raiseRecoverable(i$1, t$2 ? "Assigning to rvalue" : "Parenthesized pattern");
				}
			}, ne.checkExpressionErrors = function(e$2, t$2) {
				if (!e$2) return !1;
				var i$1 = e$2.shorthandAssign, n$1 = e$2.doubleProto;
				if (!t$2) return i$1 >= 0 || n$1 >= 0;
				i$1 >= 0 && this.raise(i$1, "Shorthand property assignments are valid only in destructuring patterns"), n$1 >= 0 && this.raiseRecoverable(n$1, "Redefinition of __proto__ property");
			}, ne.checkYieldAwaitInDefaultParams = function() {
				this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos) && this.raise(this.yieldPos, "Yield expression cannot be a default value"), this.awaitPos && this.raise(this.awaitPos, "Await expression cannot be a default value");
			}, ne.isSimpleAssignTarget = function(e$2) {
				return "ParenthesizedExpression" === e$2.type ? this.isSimpleAssignTarget(e$2.expression) : "Identifier" === e$2.type || "MemberExpression" === e$2.type;
			};
			var oe = acorn_Parser.prototype;
			oe.parseTopLevel = function(e$2) {
				var t$2 = Object.create(null);
				for (e$2.body || (e$2.body = []); this.type !== O.eof;) {
					var i$1 = this.parseStatement(null, !0, t$2);
					e$2.body.push(i$1);
				}
				if (this.inModule) for (var n$1 = 0, a$1 = Object.keys(this.undefinedExports); n$1 < a$1.length; n$1 += 1) {
					var c$1 = a$1[n$1];
					this.raiseRecoverable(this.undefinedExports[c$1].start, "Export '" + c$1 + "' is not defined");
				}
				return this.adaptDirectivePrologue(e$2.body), this.next(), e$2.sourceType = "commonjs" === this.options.sourceType ? "script" : this.options.sourceType, this.finishNode(e$2, "Program");
			};
			var ce = { kind: "loop" }, he = { kind: "switch" };
			oe.isLet = function(e$2) {
				if (this.options.ecmaVersion < 6 || !this.isContextual("let")) return !1;
				$.lastIndex = this.pos;
				var t$2 = $.exec(this.input), i$1 = this.pos + t$2[0].length, n$1 = this.fullCharCodeAt(i$1);
				if (91 === n$1 || 92 === n$1) return !0;
				if (e$2) return !1;
				if (123 === n$1) return !0;
				if (isIdentifierStart(n$1)) {
					var a$1 = i$1;
					do
						i$1 += n$1 <= 65535 ? 1 : 2;
					while (isIdentifierChar(n$1 = this.fullCharCodeAt(i$1)));
					if (92 === n$1) return !0;
					var c$1 = this.input.slice(a$1, i$1);
					if (!E.test(c$1)) return !0;
				}
				return !1;
			}, oe.isAsyncFunction = function() {
				if (this.options.ecmaVersion < 8 || !this.isContextual("async")) return !1;
				$.lastIndex = this.pos;
				var e$2, t$2 = $.exec(this.input), i$1 = this.pos + t$2[0].length;
				return !(j.test(this.input.slice(this.pos, i$1)) || "function" !== this.input.slice(i$1, i$1 + 8) || i$1 + 8 !== this.input.length && (isIdentifierChar(e$2 = this.fullCharCodeAt(i$1 + 8)) || 92 === e$2));
			}, oe.isUsingKeyword = function(e$2, t$2) {
				if (this.options.ecmaVersion < 17 || !this.isContextual(e$2 ? "await" : "using")) return !1;
				$.lastIndex = this.pos;
				var i$1 = $.exec(this.input), n$1 = this.pos + i$1[0].length;
				if (j.test(this.input.slice(this.pos, n$1))) return !1;
				if (e$2) {
					var a$1, c$1 = n$1 + 5;
					if ("using" !== this.input.slice(n$1, c$1) || c$1 === this.input.length || isIdentifierChar(a$1 = this.fullCharCodeAt(c$1)) || 92 === a$1) return !1;
					$.lastIndex = c$1;
					var l$1 = $.exec(this.input);
					if (n$1 = c$1 + l$1[0].length, l$1 && j.test(this.input.slice(c$1, n$1))) return !1;
				}
				var y$1 = this.fullCharCodeAt(n$1);
				if (!isIdentifierStart(y$1) && 92 !== y$1) return !1;
				var w$1 = n$1;
				do
					n$1 += y$1 <= 65535 ? 1 : 2;
				while (isIdentifierChar(y$1 = this.fullCharCodeAt(n$1)));
				if (92 === y$1) return !0;
				var C$1 = this.input.slice(w$1, n$1);
				return !(E.test(C$1) || t$2 && "of" === C$1);
			}, oe.isAwaitUsing = function(e$2) {
				return this.isUsingKeyword(!0, e$2);
			}, oe.isUsing = function(e$2) {
				return this.isUsingKeyword(!1, e$2);
			}, oe.parseStatement = function(e$2, t$2, i$1) {
				var n$1, a$1 = this.type, c$1 = this.startNode();
				switch (this.isLet(e$2) && (a$1 = O._var, n$1 = "let"), a$1) {
					case O._break:
					case O._continue: return this.parseBreakContinueStatement(c$1, a$1.keyword);
					case O._debugger: return this.parseDebuggerStatement(c$1);
					case O._do: return this.parseDoStatement(c$1);
					case O._for: return this.parseForStatement(c$1);
					case O._function: return e$2 && (this.strict || "if" !== e$2 && "label" !== e$2) && this.options.ecmaVersion >= 6 && this.unexpected(), this.parseFunctionStatement(c$1, !1, !e$2);
					case O._class: return e$2 && this.unexpected(), this.parseClass(c$1, !0);
					case O._if: return this.parseIfStatement(c$1);
					case O._return: return this.parseReturnStatement(c$1);
					case O._switch: return this.parseSwitchStatement(c$1);
					case O._throw: return this.parseThrowStatement(c$1);
					case O._try: return this.parseTryStatement(c$1);
					case O._const:
					case O._var: return n$1 = n$1 || this.value, e$2 && "var" !== n$1 && this.unexpected(), this.parseVarStatement(c$1, n$1);
					case O._while: return this.parseWhileStatement(c$1);
					case O._with: return this.parseWithStatement(c$1);
					case O.braceL: return this.parseBlock(!0, c$1);
					case O.semi: return this.parseEmptyStatement(c$1);
					case O._export:
					case O._import:
						if (this.options.ecmaVersion > 10 && a$1 === O._import) {
							$.lastIndex = this.pos;
							var l$1 = $.exec(this.input), y$1 = this.pos + l$1[0].length, E$1 = this.input.charCodeAt(y$1);
							if (40 === E$1 || 46 === E$1) return this.parseExpressionStatement(c$1, this.parseExpression());
						}
						return this.options.allowImportExportEverywhere || (t$2 || this.raise(this.start, "'import' and 'export' may only appear at the top level"), this.inModule || this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'")), a$1 === O._import ? this.parseImport(c$1) : this.parseExport(c$1, i$1);
					default:
						if (this.isAsyncFunction()) return e$2 && this.unexpected(), this.next(), this.parseFunctionStatement(c$1, !0, !e$2);
						var w$1 = this.isAwaitUsing(!1) ? "await using" : this.isUsing(!1) ? "using" : null;
						if (w$1) return this.allowUsing || this.raise(this.start, "Using declaration cannot appear in the top level when source type is `script` or in the bare case statement"), "await using" === w$1 && (this.canAwait || this.raise(this.start, "Await using cannot appear outside of async function"), this.next()), this.next(), this.parseVar(c$1, !1, w$1), this.semicolon(), this.finishNode(c$1, "VariableDeclaration");
						var C$1 = this.value, S$1 = this.parseExpression();
						return a$1 === O.name && "Identifier" === S$1.type && this.eat(O.colon) ? this.parseLabeledStatement(c$1, C$1, S$1, e$2) : this.parseExpressionStatement(c$1, S$1);
				}
			}, oe.parseBreakContinueStatement = function(e$2, t$2) {
				var i$1 = "break" === t$2;
				this.next(), this.eat(O.semi) || this.insertSemicolon() ? e$2.label = null : this.type !== O.name ? this.unexpected() : (e$2.label = this.parseIdent(), this.semicolon());
				for (var n$1 = 0; n$1 < this.labels.length; ++n$1) {
					var a$1 = this.labels[n$1];
					if (null == e$2.label || a$1.name === e$2.label.name) {
						if (null != a$1.kind && (i$1 || "loop" === a$1.kind)) break;
						if (e$2.label && i$1) break;
					}
				}
				return n$1 === this.labels.length && this.raise(e$2.start, "Unsyntactic " + t$2), this.finishNode(e$2, i$1 ? "BreakStatement" : "ContinueStatement");
			}, oe.parseDebuggerStatement = function(e$2) {
				return this.next(), this.semicolon(), this.finishNode(e$2, "DebuggerStatement");
			}, oe.parseDoStatement = function(e$2) {
				return this.next(), this.labels.push(ce), e$2.body = this.parseStatement("do"), this.labels.pop(), this.expect(O._while), e$2.test = this.parseParenExpression(), this.options.ecmaVersion >= 6 ? this.eat(O.semi) : this.semicolon(), this.finishNode(e$2, "DoWhileStatement");
			}, oe.parseForStatement = function(e$2) {
				this.next();
				var t$2 = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
				if (this.labels.push(ce), this.enterScope(0), this.expect(O.parenL), this.type === O.semi) return t$2 > -1 && this.unexpected(t$2), this.parseFor(e$2, null);
				var i$1 = this.isLet();
				if (this.type === O._var || this.type === O._const || i$1) {
					var n$1 = this.startNode(), a$1 = i$1 ? "let" : this.value;
					return this.next(), this.parseVar(n$1, !0, a$1), this.finishNode(n$1, "VariableDeclaration"), this.parseForAfterInit(e$2, n$1, t$2);
				}
				var c$1 = this.isContextual("let"), l$1 = !1, y$1 = this.isUsing(!0) ? "using" : this.isAwaitUsing(!0) ? "await using" : null;
				if (y$1) {
					var E$1 = this.startNode();
					return this.next(), "await using" === y$1 && (this.canAwait || this.raise(this.start, "Await using cannot appear outside of async function"), this.next()), this.parseVar(E$1, !0, y$1), this.finishNode(E$1, "VariableDeclaration"), this.parseForAfterInit(e$2, E$1, t$2);
				}
				var w$1 = this.containsEsc, C$1 = new acorn_DestructuringErrors(), S$1 = this.start, I$1 = t$2 > -1 ? this.parseExprSubscripts(C$1, "await") : this.parseExpression(!0, C$1);
				return this.type === O._in || (l$1 = this.options.ecmaVersion >= 6 && this.isContextual("of")) ? (t$2 > -1 ? (this.type === O._in && this.unexpected(t$2), e$2.await = !0) : l$1 && this.options.ecmaVersion >= 8 && (I$1.start !== S$1 || w$1 || "Identifier" !== I$1.type || "async" !== I$1.name ? this.options.ecmaVersion >= 9 && (e$2.await = !1) : this.unexpected()), c$1 && l$1 && this.raise(I$1.start, "The left-hand side of a for-of loop may not start with 'let'."), this.toAssignable(I$1, !1, C$1), this.checkLValPattern(I$1), this.parseForIn(e$2, I$1)) : (this.checkExpressionErrors(C$1, !0), t$2 > -1 && this.unexpected(t$2), this.parseFor(e$2, I$1));
			}, oe.parseForAfterInit = function(e$2, t$2, i$1) {
				return (this.type === O._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && 1 === t$2.declarations.length ? (this.options.ecmaVersion >= 9 && (this.type === O._in ? i$1 > -1 && this.unexpected(i$1) : e$2.await = i$1 > -1), this.parseForIn(e$2, t$2)) : (i$1 > -1 && this.unexpected(i$1), this.parseFor(e$2, t$2));
			}, oe.parseFunctionStatement = function(e$2, t$2, i$1) {
				return this.next(), this.parseFunction(e$2, pe | (i$1 ? 0 : ue), !1, t$2);
			}, oe.parseIfStatement = function(e$2) {
				return this.next(), e$2.test = this.parseParenExpression(), e$2.consequent = this.parseStatement("if"), e$2.alternate = this.eat(O._else) ? this.parseStatement("if") : null, this.finishNode(e$2, "IfStatement");
			}, oe.parseReturnStatement = function(e$2) {
				return this.allowReturn || this.raise(this.start, "'return' outside of function"), this.next(), this.eat(O.semi) || this.insertSemicolon() ? e$2.argument = null : (e$2.argument = this.parseExpression(), this.semicolon()), this.finishNode(e$2, "ReturnStatement");
			}, oe.parseSwitchStatement = function(e$2) {
				var t$2;
				this.next(), e$2.discriminant = this.parseParenExpression(), e$2.cases = [], this.expect(O.braceL), this.labels.push(he), this.enterScope(1024);
				for (var i$1 = !1; this.type !== O.braceR;) if (this.type === O._case || this.type === O._default) {
					var n$1 = this.type === O._case;
					t$2 && this.finishNode(t$2, "SwitchCase"), e$2.cases.push(t$2 = this.startNode()), t$2.consequent = [], this.next(), n$1 ? t$2.test = this.parseExpression() : (i$1 && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"), i$1 = !0, t$2.test = null), this.expect(O.colon);
				} else t$2 || this.unexpected(), t$2.consequent.push(this.parseStatement(null));
				return this.exitScope(), t$2 && this.finishNode(t$2, "SwitchCase"), this.next(), this.labels.pop(), this.finishNode(e$2, "SwitchStatement");
			}, oe.parseThrowStatement = function(e$2) {
				return this.next(), j.test(this.input.slice(this.lastTokEnd, this.start)) && this.raise(this.lastTokEnd, "Illegal newline after throw"), e$2.argument = this.parseExpression(), this.semicolon(), this.finishNode(e$2, "ThrowStatement");
			};
			var le = [];
			oe.parseCatchClauseParam = function() {
				var e$2 = this.parseBindingAtom(), t$2 = "Identifier" === e$2.type;
				return this.enterScope(t$2 ? 32 : 0), this.checkLValPattern(e$2, t$2 ? 4 : 2), this.expect(O.parenR), e$2;
			}, oe.parseTryStatement = function(e$2) {
				if (this.next(), e$2.block = this.parseBlock(), e$2.handler = null, this.type === O._catch) {
					var t$2 = this.startNode();
					this.next(), this.eat(O.parenL) ? t$2.param = this.parseCatchClauseParam() : (this.options.ecmaVersion < 10 && this.unexpected(), t$2.param = null, this.enterScope(0)), t$2.body = this.parseBlock(!1), this.exitScope(), e$2.handler = this.finishNode(t$2, "CatchClause");
				}
				return e$2.finalizer = this.eat(O._finally) ? this.parseBlock() : null, e$2.handler || e$2.finalizer || this.raise(e$2.start, "Missing catch or finally clause"), this.finishNode(e$2, "TryStatement");
			}, oe.parseVarStatement = function(e$2, t$2, i$1) {
				return this.next(), this.parseVar(e$2, !1, t$2, i$1), this.semicolon(), this.finishNode(e$2, "VariableDeclaration");
			}, oe.parseWhileStatement = function(e$2) {
				return this.next(), e$2.test = this.parseParenExpression(), this.labels.push(ce), e$2.body = this.parseStatement("while"), this.labels.pop(), this.finishNode(e$2, "WhileStatement");
			}, oe.parseWithStatement = function(e$2) {
				return this.strict && this.raise(this.start, "'with' in strict mode"), this.next(), e$2.object = this.parseParenExpression(), e$2.body = this.parseStatement("with"), this.finishNode(e$2, "WithStatement");
			}, oe.parseEmptyStatement = function(e$2) {
				return this.next(), this.finishNode(e$2, "EmptyStatement");
			}, oe.parseLabeledStatement = function(e$2, t$2, i$1, n$1) {
				for (var a$1 = 0, c$1 = this.labels; a$1 < c$1.length; a$1 += 1) c$1[a$1].name === t$2 && this.raise(i$1.start, "Label '" + t$2 + "' is already declared");
				for (var l$1 = this.type.isLoop ? "loop" : this.type === O._switch ? "switch" : null, y$1 = this.labels.length - 1; y$1 >= 0; y$1--) {
					var E$1 = this.labels[y$1];
					if (E$1.statementStart !== e$2.start) break;
					E$1.statementStart = this.start, E$1.kind = l$1;
				}
				return this.labels.push({
					name: t$2,
					kind: l$1,
					statementStart: this.start
				}), e$2.body = this.parseStatement(n$1 ? -1 === n$1.indexOf("label") ? n$1 + "label" : n$1 : "label"), this.labels.pop(), e$2.label = i$1, this.finishNode(e$2, "LabeledStatement");
			}, oe.parseExpressionStatement = function(e$2, t$2) {
				return e$2.expression = t$2, this.semicolon(), this.finishNode(e$2, "ExpressionStatement");
			}, oe.parseBlock = function(e$2, t$2, i$1) {
				for (void 0 === e$2 && (e$2 = !0), void 0 === t$2 && (t$2 = this.startNode()), t$2.body = [], this.expect(O.braceL), e$2 && this.enterScope(0); this.type !== O.braceR;) {
					var n$1 = this.parseStatement(null);
					t$2.body.push(n$1);
				}
				return i$1 && (this.strict = !1), this.next(), e$2 && this.exitScope(), this.finishNode(t$2, "BlockStatement");
			}, oe.parseFor = function(e$2, t$2) {
				return e$2.init = t$2, this.expect(O.semi), e$2.test = this.type === O.semi ? null : this.parseExpression(), this.expect(O.semi), e$2.update = this.type === O.parenR ? null : this.parseExpression(), this.expect(O.parenR), e$2.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e$2, "ForStatement");
			}, oe.parseForIn = function(e$2, t$2) {
				var i$1 = this.type === O._in;
				return this.next(), "VariableDeclaration" === t$2.type && null != t$2.declarations[0].init && (!i$1 || this.options.ecmaVersion < 8 || this.strict || "var" !== t$2.kind || "Identifier" !== t$2.declarations[0].id.type) && this.raise(t$2.start, (i$1 ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"), e$2.left = t$2, e$2.right = i$1 ? this.parseExpression() : this.parseMaybeAssign(), this.expect(O.parenR), e$2.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e$2, i$1 ? "ForInStatement" : "ForOfStatement");
			}, oe.parseVar = function(e$2, t$2, i$1, n$1) {
				for (e$2.declarations = [], e$2.kind = i$1;;) {
					var a$1 = this.startNode();
					if (this.parseVarId(a$1, i$1), this.eat(O.eq) ? a$1.init = this.parseMaybeAssign(t$2) : n$1 || "const" !== i$1 || this.type === O._in || this.options.ecmaVersion >= 6 && this.isContextual("of") ? n$1 || "using" !== i$1 && "await using" !== i$1 || !(this.options.ecmaVersion >= 17) || this.type === O._in || this.isContextual("of") ? n$1 || "Identifier" === a$1.id.type || t$2 && (this.type === O._in || this.isContextual("of")) ? a$1.init = null : this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value") : this.raise(this.lastTokEnd, "Missing initializer in " + i$1 + " declaration") : this.unexpected(), e$2.declarations.push(this.finishNode(a$1, "VariableDeclarator")), !this.eat(O.comma)) break;
				}
				return e$2;
			}, oe.parseVarId = function(e$2, t$2) {
				e$2.id = "using" === t$2 || "await using" === t$2 ? this.parseIdent() : this.parseBindingAtom(), this.checkLValPattern(e$2.id, "var" === t$2 ? 1 : 2, !1);
			};
			var pe = 1, ue = 2;
			function isPrivateNameConflicted(e$2, t$2) {
				var i$1 = t$2.key.name, n$1 = e$2[i$1], a$1 = "true";
				return "MethodDefinition" !== t$2.type || "get" !== t$2.kind && "set" !== t$2.kind || (a$1 = (t$2.static ? "s" : "i") + t$2.kind), "iget" === n$1 && "iset" === a$1 || "iset" === n$1 && "iget" === a$1 || "sget" === n$1 && "sset" === a$1 || "sset" === n$1 && "sget" === a$1 ? (e$2[i$1] = "true", !1) : !!n$1 || (e$2[i$1] = a$1, !1);
			}
			function checkKeyName(e$2, t$2) {
				var i$1 = e$2.computed, n$1 = e$2.key;
				return !i$1 && ("Identifier" === n$1.type && n$1.name === t$2 || "Literal" === n$1.type && n$1.value === t$2);
			}
			oe.parseFunction = function(e$2, t$2, i$1, n$1, a$1) {
				this.initFunction(e$2), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !n$1) && (this.type === O.star && t$2 & ue && this.unexpected(), e$2.generator = this.eat(O.star)), this.options.ecmaVersion >= 8 && (e$2.async = !!n$1), t$2 & pe && (e$2.id = 4 & t$2 && this.type !== O.name ? null : this.parseIdent(), !e$2.id || t$2 & ue || this.checkLValSimple(e$2.id, this.strict || e$2.generator || e$2.async ? this.treatFunctionsAsVar ? 1 : 2 : 3));
				var c$1 = this.yieldPos, l$1 = this.awaitPos, y$1 = this.awaitIdentPos;
				return this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(functionFlags(e$2.async, e$2.generator)), t$2 & pe || (e$2.id = this.type === O.name ? this.parseIdent() : null), this.parseFunctionParams(e$2), this.parseFunctionBody(e$2, i$1, !1, a$1), this.yieldPos = c$1, this.awaitPos = l$1, this.awaitIdentPos = y$1, this.finishNode(e$2, t$2 & pe ? "FunctionDeclaration" : "FunctionExpression");
			}, oe.parseFunctionParams = function(e$2) {
				this.expect(O.parenL), e$2.params = this.parseBindingList(O.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams();
			}, oe.parseClass = function(e$2, t$2) {
				this.next();
				var i$1 = this.strict;
				this.strict = !0, this.parseClassId(e$2, t$2), this.parseClassSuper(e$2);
				var n$1 = this.enterClassBody(), a$1 = this.startNode(), c$1 = !1;
				for (a$1.body = [], this.expect(O.braceL); this.type !== O.braceR;) {
					var l$1 = this.parseClassElement(null !== e$2.superClass);
					l$1 && (a$1.body.push(l$1), "MethodDefinition" === l$1.type && "constructor" === l$1.kind ? (c$1 && this.raiseRecoverable(l$1.start, "Duplicate constructor in the same class"), c$1 = !0) : l$1.key && "PrivateIdentifier" === l$1.key.type && isPrivateNameConflicted(n$1, l$1) && this.raiseRecoverable(l$1.key.start, "Identifier '#" + l$1.key.name + "' has already been declared"));
				}
				return this.strict = i$1, this.next(), e$2.body = this.finishNode(a$1, "ClassBody"), this.exitClassBody(), this.finishNode(e$2, t$2 ? "ClassDeclaration" : "ClassExpression");
			}, oe.parseClassElement = function(e$2) {
				if (this.eat(O.semi)) return null;
				var t$2 = this.options.ecmaVersion, i$1 = this.startNode(), n$1 = "", a$1 = !1, c$1 = !1, l$1 = "method", y$1 = !1;
				if (this.eatContextual("static")) {
					if (t$2 >= 13 && this.eat(O.braceL)) return this.parseClassStaticBlock(i$1), i$1;
					this.isClassElementNameStart() || this.type === O.star ? y$1 = !0 : n$1 = "static";
				}
				if (i$1.static = y$1, !n$1 && t$2 >= 8 && this.eatContextual("async") && (!this.isClassElementNameStart() && this.type !== O.star || this.canInsertSemicolon() ? n$1 = "async" : c$1 = !0), !n$1 && (t$2 >= 9 || !c$1) && this.eat(O.star) && (a$1 = !0), !n$1 && !c$1 && !a$1) {
					var E$1 = this.value;
					(this.eatContextual("get") || this.eatContextual("set")) && (this.isClassElementNameStart() ? l$1 = E$1 : n$1 = E$1);
				}
				if (n$1 ? (i$1.computed = !1, i$1.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc), i$1.key.name = n$1, this.finishNode(i$1.key, "Identifier")) : this.parseClassElementName(i$1), t$2 < 13 || this.type === O.parenL || "method" !== l$1 || a$1 || c$1) {
					var w$1 = !i$1.static && checkKeyName(i$1, "constructor"), C$1 = w$1 && e$2;
					w$1 && "method" !== l$1 && this.raise(i$1.key.start, "Constructor can't have get/set modifier"), i$1.kind = w$1 ? "constructor" : l$1, this.parseClassMethod(i$1, a$1, c$1, C$1);
				} else this.parseClassField(i$1);
				return i$1;
			}, oe.isClassElementNameStart = function() {
				return this.type === O.name || this.type === O.privateId || this.type === O.num || this.type === O.string || this.type === O.bracketL || this.type.keyword;
			}, oe.parseClassElementName = function(e$2) {
				this.type === O.privateId ? ("constructor" === this.value && this.raise(this.start, "Classes can't have an element named '#constructor'"), e$2.computed = !1, e$2.key = this.parsePrivateIdent()) : this.parsePropertyName(e$2);
			}, oe.parseClassMethod = function(e$2, t$2, i$1, n$1) {
				var a$1 = e$2.key;
				"constructor" === e$2.kind ? (t$2 && this.raise(a$1.start, "Constructor can't be a generator"), i$1 && this.raise(a$1.start, "Constructor can't be an async method")) : e$2.static && checkKeyName(e$2, "prototype") && this.raise(a$1.start, "Classes may not have a static property named prototype");
				var c$1 = e$2.value = this.parseMethod(t$2, i$1, n$1);
				return "get" === e$2.kind && 0 !== c$1.params.length && this.raiseRecoverable(c$1.start, "getter should have no params"), "set" === e$2.kind && 1 !== c$1.params.length && this.raiseRecoverable(c$1.start, "setter should have exactly one param"), "set" === e$2.kind && "RestElement" === c$1.params[0].type && this.raiseRecoverable(c$1.params[0].start, "Setter cannot use rest params"), this.finishNode(e$2, "MethodDefinition");
			}, oe.parseClassField = function(e$2) {
				return checkKeyName(e$2, "constructor") ? this.raise(e$2.key.start, "Classes can't have a field named 'constructor'") : e$2.static && checkKeyName(e$2, "prototype") && this.raise(e$2.key.start, "Classes can't have a static field named 'prototype'"), this.eat(O.eq) ? (this.enterScope(576), e$2.value = this.parseMaybeAssign(), this.exitScope()) : e$2.value = null, this.semicolon(), this.finishNode(e$2, "PropertyDefinition");
			}, oe.parseClassStaticBlock = function(e$2) {
				e$2.body = [];
				var t$2 = this.labels;
				for (this.labels = [], this.enterScope(320); this.type !== O.braceR;) {
					var i$1 = this.parseStatement(null);
					e$2.body.push(i$1);
				}
				return this.next(), this.exitScope(), this.labels = t$2, this.finishNode(e$2, "StaticBlock");
			}, oe.parseClassId = function(e$2, t$2) {
				this.type === O.name ? (e$2.id = this.parseIdent(), t$2 && this.checkLValSimple(e$2.id, 2, !1)) : (!0 === t$2 && this.unexpected(), e$2.id = null);
			}, oe.parseClassSuper = function(e$2) {
				e$2.superClass = this.eat(O._extends) ? this.parseExprSubscripts(null, !1) : null;
			}, oe.enterClassBody = function() {
				var e$2 = {
					declared: Object.create(null),
					used: []
				};
				return this.privateNameStack.push(e$2), e$2.declared;
			}, oe.exitClassBody = function() {
				var e$2 = this.privateNameStack.pop(), t$2 = e$2.declared, i$1 = e$2.used;
				if (this.options.checkPrivateFields) for (var n$1 = this.privateNameStack.length, a$1 = 0 === n$1 ? null : this.privateNameStack[n$1 - 1], c$1 = 0; c$1 < i$1.length; ++c$1) {
					var l$1 = i$1[c$1];
					H(t$2, l$1.name) || (a$1 ? a$1.used.push(l$1) : this.raiseRecoverable(l$1.start, "Private field '#" + l$1.name + "' must be declared in an enclosing class"));
				}
			}, oe.parseExportAllDeclaration = function(e$2, t$2) {
				return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (e$2.exported = this.parseModuleExportName(), this.checkExport(t$2, e$2.exported, this.lastTokStart)) : e$2.exported = null), this.expectContextual("from"), this.type !== O.string && this.unexpected(), e$2.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (e$2.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(e$2, "ExportAllDeclaration");
			}, oe.parseExport = function(e$2, t$2) {
				if (this.next(), this.eat(O.star)) return this.parseExportAllDeclaration(e$2, t$2);
				if (this.eat(O._default)) return this.checkExport(t$2, "default", this.lastTokStart), e$2.declaration = this.parseExportDefaultDeclaration(), this.finishNode(e$2, "ExportDefaultDeclaration");
				if (this.shouldParseExportStatement()) e$2.declaration = this.parseExportDeclaration(e$2), "VariableDeclaration" === e$2.declaration.type ? this.checkVariableExport(t$2, e$2.declaration.declarations) : this.checkExport(t$2, e$2.declaration.id, e$2.declaration.id.start), e$2.specifiers = [], e$2.source = null, this.options.ecmaVersion >= 16 && (e$2.attributes = []);
				else {
					if (e$2.declaration = null, e$2.specifiers = this.parseExportSpecifiers(t$2), this.eatContextual("from")) this.type !== O.string && this.unexpected(), e$2.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (e$2.attributes = this.parseWithClause());
					else {
						for (var i$1 = 0, n$1 = e$2.specifiers; i$1 < n$1.length; i$1 += 1) {
							var a$1 = n$1[i$1];
							this.checkUnreserved(a$1.local), this.checkLocalExport(a$1.local), "Literal" === a$1.local.type && this.raise(a$1.local.start, "A string literal cannot be used as an exported binding without `from`.");
						}
						e$2.source = null, this.options.ecmaVersion >= 16 && (e$2.attributes = []);
					}
					this.semicolon();
				}
				return this.finishNode(e$2, "ExportNamedDeclaration");
			}, oe.parseExportDeclaration = function(e$2) {
				return this.parseStatement(null);
			}, oe.parseExportDefaultDeclaration = function() {
				var e$2;
				if (this.type === O._function || (e$2 = this.isAsyncFunction())) {
					var t$2 = this.startNode();
					return this.next(), e$2 && this.next(), this.parseFunction(t$2, 4 | pe, !1, e$2);
				}
				if (this.type === O._class) {
					var i$1 = this.startNode();
					return this.parseClass(i$1, "nullableID");
				}
				var n$1 = this.parseMaybeAssign();
				return this.semicolon(), n$1;
			}, oe.checkExport = function(e$2, t$2, i$1) {
				e$2 && ("string" != typeof t$2 && (t$2 = "Identifier" === t$2.type ? t$2.name : t$2.value), H(e$2, t$2) && this.raiseRecoverable(i$1, "Duplicate export '" + t$2 + "'"), e$2[t$2] = !0);
			}, oe.checkPatternExport = function(e$2, t$2) {
				var i$1 = t$2.type;
				if ("Identifier" === i$1) this.checkExport(e$2, t$2, t$2.start);
				else if ("ObjectPattern" === i$1) for (var n$1 = 0, a$1 = t$2.properties; n$1 < a$1.length; n$1 += 1) {
					var c$1 = a$1[n$1];
					this.checkPatternExport(e$2, c$1);
				}
				else if ("ArrayPattern" === i$1) for (var l$1 = 0, y$1 = t$2.elements; l$1 < y$1.length; l$1 += 1) {
					var E$1 = y$1[l$1];
					E$1 && this.checkPatternExport(e$2, E$1);
				}
				else "Property" === i$1 ? this.checkPatternExport(e$2, t$2.value) : "AssignmentPattern" === i$1 ? this.checkPatternExport(e$2, t$2.left) : "RestElement" === i$1 && this.checkPatternExport(e$2, t$2.argument);
			}, oe.checkVariableExport = function(e$2, t$2) {
				if (e$2) for (var i$1 = 0, n$1 = t$2; i$1 < n$1.length; i$1 += 1) {
					var a$1 = n$1[i$1];
					this.checkPatternExport(e$2, a$1.id);
				}
			}, oe.shouldParseExportStatement = function() {
				return "var" === this.type.keyword || "const" === this.type.keyword || "class" === this.type.keyword || "function" === this.type.keyword || this.isLet() || this.isAsyncFunction();
			}, oe.parseExportSpecifier = function(e$2) {
				var t$2 = this.startNode();
				return t$2.local = this.parseModuleExportName(), t$2.exported = this.eatContextual("as") ? this.parseModuleExportName() : t$2.local, this.checkExport(e$2, t$2.exported, t$2.exported.start), this.finishNode(t$2, "ExportSpecifier");
			}, oe.parseExportSpecifiers = function(e$2) {
				var t$2 = [], i$1 = !0;
				for (this.expect(O.braceL); !this.eat(O.braceR);) {
					if (i$1) i$1 = !1;
					else if (this.expect(O.comma), this.afterTrailingComma(O.braceR)) break;
					t$2.push(this.parseExportSpecifier(e$2));
				}
				return t$2;
			}, oe.parseImport = function(e$2) {
				return this.next(), this.type === O.string ? (e$2.specifiers = le, e$2.source = this.parseExprAtom()) : (e$2.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), e$2.source = this.type === O.string ? this.parseExprAtom() : this.unexpected()), this.options.ecmaVersion >= 16 && (e$2.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(e$2, "ImportDeclaration");
			}, oe.parseImportSpecifier = function() {
				var e$2 = this.startNode();
				return e$2.imported = this.parseModuleExportName(), this.eatContextual("as") ? e$2.local = this.parseIdent() : (this.checkUnreserved(e$2.imported), e$2.local = e$2.imported), this.checkLValSimple(e$2.local, 2), this.finishNode(e$2, "ImportSpecifier");
			}, oe.parseImportDefaultSpecifier = function() {
				var e$2 = this.startNode();
				return e$2.local = this.parseIdent(), this.checkLValSimple(e$2.local, 2), this.finishNode(e$2, "ImportDefaultSpecifier");
			}, oe.parseImportNamespaceSpecifier = function() {
				var e$2 = this.startNode();
				return this.next(), this.expectContextual("as"), e$2.local = this.parseIdent(), this.checkLValSimple(e$2.local, 2), this.finishNode(e$2, "ImportNamespaceSpecifier");
			}, oe.parseImportSpecifiers = function() {
				var e$2 = [], t$2 = !0;
				if (this.type === O.name && (e$2.push(this.parseImportDefaultSpecifier()), !this.eat(O.comma))) return e$2;
				if (this.type === O.star) return e$2.push(this.parseImportNamespaceSpecifier()), e$2;
				for (this.expect(O.braceL); !this.eat(O.braceR);) {
					if (t$2) t$2 = !1;
					else if (this.expect(O.comma), this.afterTrailingComma(O.braceR)) break;
					e$2.push(this.parseImportSpecifier());
				}
				return e$2;
			}, oe.parseWithClause = function() {
				var e$2 = [];
				if (!this.eat(O._with)) return e$2;
				this.expect(O.braceL);
				for (var t$2 = {}, i$1 = !0; !this.eat(O.braceR);) {
					if (i$1) i$1 = !1;
					else if (this.expect(O.comma), this.afterTrailingComma(O.braceR)) break;
					var n$1 = this.parseImportAttribute(), a$1 = "Identifier" === n$1.key.type ? n$1.key.name : n$1.key.value;
					H(t$2, a$1) && this.raiseRecoverable(n$1.key.start, "Duplicate attribute key '" + a$1 + "'"), t$2[a$1] = !0, e$2.push(n$1);
				}
				return e$2;
			}, oe.parseImportAttribute = function() {
				var e$2 = this.startNode();
				return e$2.key = this.type === O.string ? this.parseExprAtom() : this.parseIdent("never" !== this.options.allowReserved), this.expect(O.colon), this.type !== O.string && this.unexpected(), e$2.value = this.parseExprAtom(), this.finishNode(e$2, "ImportAttribute");
			}, oe.parseModuleExportName = function() {
				if (this.options.ecmaVersion >= 13 && this.type === O.string) {
					var e$2 = this.parseLiteral(this.value);
					return Z.test(e$2.value) && this.raise(e$2.start, "An export name cannot include a lone surrogate."), e$2;
				}
				return this.parseIdent(!0);
			}, oe.adaptDirectivePrologue = function(e$2) {
				for (var t$2 = 0; t$2 < e$2.length && this.isDirectiveCandidate(e$2[t$2]); ++t$2) e$2[t$2].directive = e$2[t$2].expression.raw.slice(1, -1);
			}, oe.isDirectiveCandidate = function(e$2) {
				return this.options.ecmaVersion >= 5 && "ExpressionStatement" === e$2.type && "Literal" === e$2.expression.type && "string" == typeof e$2.expression.value && ("\"" === this.input[e$2.start] || "'" === this.input[e$2.start]);
			};
			var de = acorn_Parser.prototype;
			de.toAssignable = function(e$2, t$2, i$1) {
				if (this.options.ecmaVersion >= 6 && e$2) switch (e$2.type) {
					case "Identifier":
						this.inAsync && "await" === e$2.name && this.raise(e$2.start, "Cannot use 'await' as identifier inside an async function");
						break;
					case "ObjectPattern":
					case "ArrayPattern":
					case "AssignmentPattern":
					case "RestElement": break;
					case "ObjectExpression":
						e$2.type = "ObjectPattern", i$1 && this.checkPatternErrors(i$1, !0);
						for (var n$1 = 0, a$1 = e$2.properties; n$1 < a$1.length; n$1 += 1) {
							var c$1 = a$1[n$1];
							this.toAssignable(c$1, t$2), "RestElement" !== c$1.type || "ArrayPattern" !== c$1.argument.type && "ObjectPattern" !== c$1.argument.type || this.raise(c$1.argument.start, "Unexpected token");
						}
						break;
					case "Property":
						"init" !== e$2.kind && this.raise(e$2.key.start, "Object pattern can't contain getter or setter"), this.toAssignable(e$2.value, t$2);
						break;
					case "ArrayExpression":
						e$2.type = "ArrayPattern", i$1 && this.checkPatternErrors(i$1, !0), this.toAssignableList(e$2.elements, t$2);
						break;
					case "SpreadElement":
						e$2.type = "RestElement", this.toAssignable(e$2.argument, t$2), "AssignmentPattern" === e$2.argument.type && this.raise(e$2.argument.start, "Rest elements cannot have a default value");
						break;
					case "AssignmentExpression":
						"=" !== e$2.operator && this.raise(e$2.left.end, "Only '=' operator can be used for specifying default value."), e$2.type = "AssignmentPattern", delete e$2.operator, this.toAssignable(e$2.left, t$2);
						break;
					case "ParenthesizedExpression":
						this.toAssignable(e$2.expression, t$2, i$1);
						break;
					case "ChainExpression":
						this.raiseRecoverable(e$2.start, "Optional chaining cannot appear in left-hand side");
						break;
					case "MemberExpression": if (!t$2) break;
					default: this.raise(e$2.start, "Assigning to rvalue");
				}
				else i$1 && this.checkPatternErrors(i$1, !0);
				return e$2;
			}, de.toAssignableList = function(e$2, t$2) {
				for (var i$1 = e$2.length, n$1 = 0; n$1 < i$1; n$1++) {
					var a$1 = e$2[n$1];
					a$1 && this.toAssignable(a$1, t$2);
				}
				if (i$1) {
					var c$1 = e$2[i$1 - 1];
					6 === this.options.ecmaVersion && t$2 && c$1 && "RestElement" === c$1.type && "Identifier" !== c$1.argument.type && this.unexpected(c$1.argument.start);
				}
				return e$2;
			}, de.parseSpread = function(e$2) {
				var t$2 = this.startNode();
				return this.next(), t$2.argument = this.parseMaybeAssign(!1, e$2), this.finishNode(t$2, "SpreadElement");
			}, de.parseRestBinding = function() {
				var e$2 = this.startNode();
				return this.next(), 6 === this.options.ecmaVersion && this.type !== O.name && this.unexpected(), e$2.argument = this.parseBindingAtom(), this.finishNode(e$2, "RestElement");
			}, de.parseBindingAtom = function() {
				if (this.options.ecmaVersion >= 6) switch (this.type) {
					case O.bracketL:
						var e$2 = this.startNode();
						return this.next(), e$2.elements = this.parseBindingList(O.bracketR, !0, !0), this.finishNode(e$2, "ArrayPattern");
					case O.braceL: return this.parseObj(!0);
				}
				return this.parseIdent();
			}, de.parseBindingList = function(e$2, t$2, i$1, n$1) {
				for (var a$1 = [], c$1 = !0; !this.eat(e$2);) if (c$1 ? c$1 = !1 : this.expect(O.comma), t$2 && this.type === O.comma) a$1.push(null);
				else {
					if (i$1 && this.afterTrailingComma(e$2)) break;
					if (this.type === O.ellipsis) {
						var l$1 = this.parseRestBinding();
						this.parseBindingListItem(l$1), a$1.push(l$1), this.type === O.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.expect(e$2);
						break;
					}
					a$1.push(this.parseAssignableListItem(n$1));
				}
				return a$1;
			}, de.parseAssignableListItem = function(e$2) {
				var t$2 = this.parseMaybeDefault(this.start, this.startLoc);
				return this.parseBindingListItem(t$2), t$2;
			}, de.parseBindingListItem = function(e$2) {
				return e$2;
			}, de.parseMaybeDefault = function(e$2, t$2, i$1) {
				if (i$1 = i$1 || this.parseBindingAtom(), this.options.ecmaVersion < 6 || !this.eat(O.eq)) return i$1;
				var n$1 = this.startNodeAt(e$2, t$2);
				return n$1.left = i$1, n$1.right = this.parseMaybeAssign(), this.finishNode(n$1, "AssignmentPattern");
			}, de.checkLValSimple = function(e$2, t$2, i$1) {
				void 0 === t$2 && (t$2 = 0);
				var n$1 = 0 !== t$2;
				switch (e$2.type) {
					case "Identifier":
						this.strict && this.reservedWordsStrictBind.test(e$2.name) && this.raiseRecoverable(e$2.start, (n$1 ? "Binding " : "Assigning to ") + e$2.name + " in strict mode"), n$1 && (2 === t$2 && "let" === e$2.name && this.raiseRecoverable(e$2.start, "let is disallowed as a lexically bound name"), i$1 && (H(i$1, e$2.name) && this.raiseRecoverable(e$2.start, "Argument name clash"), i$1[e$2.name] = !0), 5 !== t$2 && this.declareName(e$2.name, t$2, e$2.start));
						break;
					case "ChainExpression":
						this.raiseRecoverable(e$2.start, "Optional chaining cannot appear in left-hand side");
						break;
					case "MemberExpression":
						n$1 && this.raiseRecoverable(e$2.start, "Binding member expression");
						break;
					case "ParenthesizedExpression": return n$1 && this.raiseRecoverable(e$2.start, "Binding parenthesized expression"), this.checkLValSimple(e$2.expression, t$2, i$1);
					default: this.raise(e$2.start, (n$1 ? "Binding" : "Assigning to") + " rvalue");
				}
			}, de.checkLValPattern = function(e$2, t$2, i$1) {
				switch (void 0 === t$2 && (t$2 = 0), e$2.type) {
					case "ObjectPattern":
						for (var n$1 = 0, a$1 = e$2.properties; n$1 < a$1.length; n$1 += 1) {
							var c$1 = a$1[n$1];
							this.checkLValInnerPattern(c$1, t$2, i$1);
						}
						break;
					case "ArrayPattern":
						for (var l$1 = 0, y$1 = e$2.elements; l$1 < y$1.length; l$1 += 1) {
							var E$1 = y$1[l$1];
							E$1 && this.checkLValInnerPattern(E$1, t$2, i$1);
						}
						break;
					default: this.checkLValSimple(e$2, t$2, i$1);
				}
			}, de.checkLValInnerPattern = function(e$2, t$2, i$1) {
				switch (void 0 === t$2 && (t$2 = 0), e$2.type) {
					case "Property":
						this.checkLValInnerPattern(e$2.value, t$2, i$1);
						break;
					case "AssignmentPattern":
						this.checkLValPattern(e$2.left, t$2, i$1);
						break;
					case "RestElement":
						this.checkLValPattern(e$2.argument, t$2, i$1);
						break;
					default: this.checkLValPattern(e$2, t$2, i$1);
				}
			};
			var acorn_TokContext = function(e$2, t$2, i$1, n$1, a$1) {
				this.token = e$2, this.isExpr = !!t$2, this.preserveSpace = !!i$1, this.override = n$1, this.generator = !!a$1;
			}, fe = {
				b_stat: new acorn_TokContext("{", !1),
				b_expr: new acorn_TokContext("{", !0),
				b_tmpl: new acorn_TokContext("${", !1),
				p_stat: new acorn_TokContext("(", !1),
				p_expr: new acorn_TokContext("(", !0),
				q_tmpl: new acorn_TokContext("`", !0, !0, function(e$2) {
					return e$2.tryReadTemplateToken();
				}),
				f_stat: new acorn_TokContext("function", !1),
				f_expr: new acorn_TokContext("function", !0),
				f_expr_gen: new acorn_TokContext("function", !0, !1, null, !0),
				f_gen: new acorn_TokContext("function", !1, !1, null, !0)
			}, me = acorn_Parser.prototype;
			me.initialContext = function() {
				return [fe.b_stat];
			}, me.curContext = function() {
				return this.context[this.context.length - 1];
			}, me.braceIsBlock = function(e$2) {
				var t$2 = this.curContext();
				return t$2 === fe.f_expr || t$2 === fe.f_stat || (e$2 !== O.colon || t$2 !== fe.b_stat && t$2 !== fe.b_expr ? e$2 === O._return || e$2 === O.name && this.exprAllowed ? j.test(this.input.slice(this.lastTokEnd, this.start)) : e$2 === O._else || e$2 === O.semi || e$2 === O.eof || e$2 === O.parenR || e$2 === O.arrow || (e$2 === O.braceL ? t$2 === fe.b_stat : e$2 !== O._var && e$2 !== O._const && e$2 !== O.name && !this.exprAllowed) : !t$2.isExpr);
			}, me.inGeneratorContext = function() {
				for (var e$2 = this.context.length - 1; e$2 >= 1; e$2--) {
					var t$2 = this.context[e$2];
					if ("function" === t$2.token) return t$2.generator;
				}
				return !1;
			}, me.updateContext = function(e$2) {
				var t$2, i$1 = this.type;
				i$1.keyword && e$2 === O.dot ? this.exprAllowed = !1 : (t$2 = i$1.updateContext) ? t$2.call(this, e$2) : this.exprAllowed = i$1.beforeExpr;
			}, me.overrideContext = function(e$2) {
				this.curContext() !== e$2 && (this.context[this.context.length - 1] = e$2);
			}, O.parenR.updateContext = O.braceR.updateContext = function() {
				if (1 !== this.context.length) {
					var e$2 = this.context.pop();
					e$2 === fe.b_stat && "function" === this.curContext().token && (e$2 = this.context.pop()), this.exprAllowed = !e$2.isExpr;
				} else this.exprAllowed = !0;
			}, O.braceL.updateContext = function(e$2) {
				this.context.push(this.braceIsBlock(e$2) ? fe.b_stat : fe.b_expr), this.exprAllowed = !0;
			}, O.dollarBraceL.updateContext = function() {
				this.context.push(fe.b_tmpl), this.exprAllowed = !0;
			}, O.parenL.updateContext = function(e$2) {
				var t$2 = e$2 === O._if || e$2 === O._for || e$2 === O._with || e$2 === O._while;
				this.context.push(t$2 ? fe.p_stat : fe.p_expr), this.exprAllowed = !0;
			}, O.incDec.updateContext = function() {}, O._function.updateContext = O._class.updateContext = function(e$2) {
				!e$2.beforeExpr || e$2 === O._else || e$2 === O.semi && this.curContext() !== fe.p_stat || e$2 === O._return && j.test(this.input.slice(this.lastTokEnd, this.start)) || (e$2 === O.colon || e$2 === O.braceL) && this.curContext() === fe.b_stat ? this.context.push(fe.f_stat) : this.context.push(fe.f_expr), this.exprAllowed = !1;
			}, O.colon.updateContext = function() {
				"function" === this.curContext().token && this.context.pop(), this.exprAllowed = !0;
			}, O.backQuote.updateContext = function() {
				this.curContext() === fe.q_tmpl ? this.context.pop() : this.context.push(fe.q_tmpl), this.exprAllowed = !1;
			}, O.star.updateContext = function(e$2) {
				if (e$2 === O._function) {
					var t$2 = this.context.length - 1;
					this.context[t$2] === fe.f_expr ? this.context[t$2] = fe.f_expr_gen : this.context[t$2] = fe.f_gen;
				}
				this.exprAllowed = !0;
			}, O.name.updateContext = function(e$2) {
				var t$2 = !1;
				this.options.ecmaVersion >= 6 && e$2 !== O.dot && ("of" === this.value && !this.exprAllowed || "yield" === this.value && this.inGeneratorContext()) && (t$2 = !0), this.exprAllowed = t$2;
			};
			var ge = acorn_Parser.prototype;
			function isLocalVariableAccess(e$2) {
				return "Identifier" === e$2.type || "ParenthesizedExpression" === e$2.type && isLocalVariableAccess(e$2.expression);
			}
			function isPrivateFieldAccess(e$2) {
				return "MemberExpression" === e$2.type && "PrivateIdentifier" === e$2.property.type || "ChainExpression" === e$2.type && isPrivateFieldAccess(e$2.expression) || "ParenthesizedExpression" === e$2.type && isPrivateFieldAccess(e$2.expression);
			}
			ge.checkPropClash = function(e$2, t$2, i$1) {
				if (!(this.options.ecmaVersion >= 9 && "SpreadElement" === e$2.type || this.options.ecmaVersion >= 6 && (e$2.computed || e$2.method || e$2.shorthand))) {
					var n$1, a$1 = e$2.key;
					switch (a$1.type) {
						case "Identifier":
							n$1 = a$1.name;
							break;
						case "Literal":
							n$1 = String(a$1.value);
							break;
						default: return;
					}
					var c$1 = e$2.kind;
					if (this.options.ecmaVersion >= 6) "__proto__" === n$1 && "init" === c$1 && (t$2.proto && (i$1 ? i$1.doubleProto < 0 && (i$1.doubleProto = a$1.start) : this.raiseRecoverable(a$1.start, "Redefinition of __proto__ property")), t$2.proto = !0);
					else {
						var l$1 = t$2[n$1 = "$" + n$1];
						if (l$1) ("init" === c$1 ? this.strict && l$1.init || l$1.get || l$1.set : l$1.init || l$1[c$1]) && this.raiseRecoverable(a$1.start, "Redefinition of property");
						else l$1 = t$2[n$1] = {
							init: !1,
							get: !1,
							set: !1
						};
						l$1[c$1] = !0;
					}
				}
			}, ge.parseExpression = function(e$2, t$2) {
				var i$1 = this.start, n$1 = this.startLoc, a$1 = this.parseMaybeAssign(e$2, t$2);
				if (this.type === O.comma) {
					var c$1 = this.startNodeAt(i$1, n$1);
					for (c$1.expressions = [a$1]; this.eat(O.comma);) c$1.expressions.push(this.parseMaybeAssign(e$2, t$2));
					return this.finishNode(c$1, "SequenceExpression");
				}
				return a$1;
			}, ge.parseMaybeAssign = function(e$2, t$2, i$1) {
				if (this.isContextual("yield")) {
					if (this.inGenerator) return this.parseYield(e$2);
					this.exprAllowed = !1;
				}
				var n$1 = !1, a$1 = -1, c$1 = -1, l$1 = -1;
				t$2 ? (a$1 = t$2.parenthesizedAssign, c$1 = t$2.trailingComma, l$1 = t$2.doubleProto, t$2.parenthesizedAssign = t$2.trailingComma = -1) : (t$2 = new acorn_DestructuringErrors(), n$1 = !0);
				var y$1 = this.start, E$1 = this.startLoc;
				this.type !== O.parenL && this.type !== O.name || (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = "await" === e$2);
				var w$1 = this.parseMaybeConditional(e$2, t$2);
				if (i$1 && (w$1 = i$1.call(this, w$1, y$1, E$1)), this.type.isAssign) {
					var C$1 = this.startNodeAt(y$1, E$1);
					return C$1.operator = this.value, this.type === O.eq && (w$1 = this.toAssignable(w$1, !1, t$2)), n$1 || (t$2.parenthesizedAssign = t$2.trailingComma = t$2.doubleProto = -1), t$2.shorthandAssign >= w$1.start && (t$2.shorthandAssign = -1), this.type === O.eq ? this.checkLValPattern(w$1) : this.checkLValSimple(w$1), C$1.left = w$1, this.next(), C$1.right = this.parseMaybeAssign(e$2), l$1 > -1 && (t$2.doubleProto = l$1), this.finishNode(C$1, "AssignmentExpression");
				}
				return n$1 && this.checkExpressionErrors(t$2, !0), a$1 > -1 && (t$2.parenthesizedAssign = a$1), c$1 > -1 && (t$2.trailingComma = c$1), w$1;
			}, ge.parseMaybeConditional = function(e$2, t$2) {
				var i$1 = this.start, n$1 = this.startLoc, a$1 = this.parseExprOps(e$2, t$2);
				if (this.checkExpressionErrors(t$2)) return a$1;
				if (this.eat(O.question)) {
					var c$1 = this.startNodeAt(i$1, n$1);
					return c$1.test = a$1, c$1.consequent = this.parseMaybeAssign(), this.expect(O.colon), c$1.alternate = this.parseMaybeAssign(e$2), this.finishNode(c$1, "ConditionalExpression");
				}
				return a$1;
			}, ge.parseExprOps = function(e$2, t$2) {
				var i$1 = this.start, n$1 = this.startLoc, a$1 = this.parseMaybeUnary(t$2, !1, !1, e$2);
				return this.checkExpressionErrors(t$2) || a$1.start === i$1 && "ArrowFunctionExpression" === a$1.type ? a$1 : this.parseExprOp(a$1, i$1, n$1, -1, e$2);
			}, ge.parseExprOp = function(e$2, t$2, i$1, n$1, a$1) {
				var c$1 = this.type.binop;
				if (null != c$1 && (!a$1 || this.type !== O._in) && c$1 > n$1) {
					var l$1 = this.type === O.logicalOR || this.type === O.logicalAND, y$1 = this.type === O.coalesce;
					y$1 && (c$1 = O.logicalAND.binop);
					var E$1 = this.value;
					this.next();
					var w$1 = this.start, C$1 = this.startLoc, S$1 = this.parseExprOp(this.parseMaybeUnary(null, !1, !1, a$1), w$1, C$1, c$1, a$1), I$1 = this.buildBinary(t$2, i$1, e$2, S$1, E$1, l$1 || y$1);
					return (l$1 && this.type === O.coalesce || y$1 && (this.type === O.logicalOR || this.type === O.logicalAND)) && this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses"), this.parseExprOp(I$1, t$2, i$1, n$1, a$1);
				}
				return e$2;
			}, ge.buildBinary = function(e$2, t$2, i$1, n$1, a$1, c$1) {
				"PrivateIdentifier" === n$1.type && this.raise(n$1.start, "Private identifier can only be left side of binary expression");
				var l$1 = this.startNodeAt(e$2, t$2);
				return l$1.left = i$1, l$1.operator = a$1, l$1.right = n$1, this.finishNode(l$1, c$1 ? "LogicalExpression" : "BinaryExpression");
			}, ge.parseMaybeUnary = function(e$2, t$2, i$1, n$1) {
				var a$1, c$1 = this.start, l$1 = this.startLoc;
				if (this.isContextual("await") && this.canAwait) a$1 = this.parseAwait(n$1), t$2 = !0;
				else if (this.type.prefix) {
					var y$1 = this.startNode(), E$1 = this.type === O.incDec;
					y$1.operator = this.value, y$1.prefix = !0, this.next(), y$1.argument = this.parseMaybeUnary(null, !0, E$1, n$1), this.checkExpressionErrors(e$2, !0), E$1 ? this.checkLValSimple(y$1.argument) : this.strict && "delete" === y$1.operator && isLocalVariableAccess(y$1.argument) ? this.raiseRecoverable(y$1.start, "Deleting local variable in strict mode") : "delete" === y$1.operator && isPrivateFieldAccess(y$1.argument) ? this.raiseRecoverable(y$1.start, "Private fields can not be deleted") : t$2 = !0, a$1 = this.finishNode(y$1, E$1 ? "UpdateExpression" : "UnaryExpression");
				} else if (t$2 || this.type !== O.privateId) {
					if (a$1 = this.parseExprSubscripts(e$2, n$1), this.checkExpressionErrors(e$2)) return a$1;
					for (; this.type.postfix && !this.canInsertSemicolon();) {
						var w$1 = this.startNodeAt(c$1, l$1);
						w$1.operator = this.value, w$1.prefix = !1, w$1.argument = a$1, this.checkLValSimple(a$1), this.next(), a$1 = this.finishNode(w$1, "UpdateExpression");
					}
				} else (n$1 || 0 === this.privateNameStack.length) && this.options.checkPrivateFields && this.unexpected(), a$1 = this.parsePrivateIdent(), this.type !== O._in && this.unexpected();
				return i$1 || !this.eat(O.starstar) ? a$1 : t$2 ? void this.unexpected(this.lastTokStart) : this.buildBinary(c$1, l$1, a$1, this.parseMaybeUnary(null, !1, !1, n$1), "**", !1);
			}, ge.parseExprSubscripts = function(e$2, t$2) {
				var i$1 = this.start, n$1 = this.startLoc, a$1 = this.parseExprAtom(e$2, t$2);
				if ("ArrowFunctionExpression" === a$1.type && ")" !== this.input.slice(this.lastTokStart, this.lastTokEnd)) return a$1;
				var c$1 = this.parseSubscripts(a$1, i$1, n$1, !1, t$2);
				return e$2 && "MemberExpression" === c$1.type && (e$2.parenthesizedAssign >= c$1.start && (e$2.parenthesizedAssign = -1), e$2.parenthesizedBind >= c$1.start && (e$2.parenthesizedBind = -1), e$2.trailingComma >= c$1.start && (e$2.trailingComma = -1)), c$1;
			}, ge.parseSubscripts = function(e$2, t$2, i$1, n$1, a$1) {
				for (var c$1 = this.options.ecmaVersion >= 8 && "Identifier" === e$2.type && "async" === e$2.name && this.lastTokEnd === e$2.end && !this.canInsertSemicolon() && e$2.end - e$2.start === 5 && this.potentialArrowAt === e$2.start, l$1 = !1;;) {
					var y$1 = this.parseSubscript(e$2, t$2, i$1, n$1, c$1, l$1, a$1);
					if (y$1.optional && (l$1 = !0), y$1 === e$2 || "ArrowFunctionExpression" === y$1.type) {
						if (l$1) {
							var E$1 = this.startNodeAt(t$2, i$1);
							E$1.expression = y$1, y$1 = this.finishNode(E$1, "ChainExpression");
						}
						return y$1;
					}
					e$2 = y$1;
				}
			}, ge.shouldParseAsyncArrow = function() {
				return !this.canInsertSemicolon() && this.eat(O.arrow);
			}, ge.parseSubscriptAsyncArrow = function(e$2, t$2, i$1, n$1) {
				return this.parseArrowExpression(this.startNodeAt(e$2, t$2), i$1, !0, n$1);
			}, ge.parseSubscript = function(e$2, t$2, i$1, n$1, a$1, c$1, l$1) {
				var y$1 = this.options.ecmaVersion >= 11, E$1 = y$1 && this.eat(O.questionDot);
				n$1 && E$1 && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
				var w$1 = this.eat(O.bracketL);
				if (w$1 || E$1 && this.type !== O.parenL && this.type !== O.backQuote || this.eat(O.dot)) {
					var C$1 = this.startNodeAt(t$2, i$1);
					C$1.object = e$2, w$1 ? (C$1.property = this.parseExpression(), this.expect(O.bracketR)) : this.type === O.privateId && "Super" !== e$2.type ? C$1.property = this.parsePrivateIdent() : C$1.property = this.parseIdent("never" !== this.options.allowReserved), C$1.computed = !!w$1, y$1 && (C$1.optional = E$1), e$2 = this.finishNode(C$1, "MemberExpression");
				} else if (!n$1 && this.eat(O.parenL)) {
					var S$1 = new acorn_DestructuringErrors(), I$1 = this.yieldPos, N$1 = this.awaitPos, j$1 = this.awaitIdentPos;
					this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
					var F$1 = this.parseExprList(O.parenR, this.options.ecmaVersion >= 8, !1, S$1);
					if (a$1 && !E$1 && this.shouldParseAsyncArrow()) return this.checkPatternErrors(S$1, !1), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = I$1, this.awaitPos = N$1, this.awaitIdentPos = j$1, this.parseSubscriptAsyncArrow(t$2, i$1, F$1, l$1);
					this.checkExpressionErrors(S$1, !0), this.yieldPos = I$1 || this.yieldPos, this.awaitPos = N$1 || this.awaitPos, this.awaitIdentPos = j$1 || this.awaitIdentPos;
					var B$1 = this.startNodeAt(t$2, i$1);
					B$1.callee = e$2, B$1.arguments = F$1, y$1 && (B$1.optional = E$1), e$2 = this.finishNode(B$1, "CallExpression");
				} else if (this.type === O.backQuote) {
					(E$1 || c$1) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
					var $$1 = this.startNodeAt(t$2, i$1);
					$$1.tag = e$2, $$1.quasi = this.parseTemplate({ isTagged: !0 }), e$2 = this.finishNode($$1, "TaggedTemplateExpression");
				}
				return e$2;
			}, ge.parseExprAtom = function(e$2, t$2, i$1) {
				this.type === O.slash && this.readRegexp();
				var n$1, a$1 = this.potentialArrowAt === this.start;
				switch (this.type) {
					case O._super: return this.allowSuper || this.raise(this.start, "'super' keyword outside a method"), n$1 = this.startNode(), this.next(), this.type !== O.parenL || this.allowDirectSuper || this.raise(n$1.start, "super() call outside constructor of a subclass"), this.type !== O.dot && this.type !== O.bracketL && this.type !== O.parenL && this.unexpected(), this.finishNode(n$1, "Super");
					case O._this: return n$1 = this.startNode(), this.next(), this.finishNode(n$1, "ThisExpression");
					case O.name:
						var c$1 = this.start, l$1 = this.startLoc, y$1 = this.containsEsc, E$1 = this.parseIdent(!1);
						if (this.options.ecmaVersion >= 8 && !y$1 && "async" === E$1.name && !this.canInsertSemicolon() && this.eat(O._function)) return this.overrideContext(fe.f_expr), this.parseFunction(this.startNodeAt(c$1, l$1), 0, !1, !0, t$2);
						if (a$1 && !this.canInsertSemicolon()) {
							if (this.eat(O.arrow)) return this.parseArrowExpression(this.startNodeAt(c$1, l$1), [E$1], !1, t$2);
							if (this.options.ecmaVersion >= 8 && "async" === E$1.name && this.type === O.name && !y$1 && (!this.potentialArrowInForAwait || "of" !== this.value || this.containsEsc)) return E$1 = this.parseIdent(!1), !this.canInsertSemicolon() && this.eat(O.arrow) || this.unexpected(), this.parseArrowExpression(this.startNodeAt(c$1, l$1), [E$1], !0, t$2);
						}
						return E$1;
					case O.regexp:
						var w$1 = this.value;
						return (n$1 = this.parseLiteral(w$1.value)).regex = {
							pattern: w$1.pattern,
							flags: w$1.flags
						}, n$1;
					case O.num:
					case O.string: return this.parseLiteral(this.value);
					case O._null:
					case O._true:
					case O._false: return (n$1 = this.startNode()).value = this.type === O._null ? null : this.type === O._true, n$1.raw = this.type.keyword, this.next(), this.finishNode(n$1, "Literal");
					case O.parenL:
						var C$1 = this.start, S$1 = this.parseParenAndDistinguishExpression(a$1, t$2);
						return e$2 && (e$2.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(S$1) && (e$2.parenthesizedAssign = C$1), e$2.parenthesizedBind < 0 && (e$2.parenthesizedBind = C$1)), S$1;
					case O.bracketL: return n$1 = this.startNode(), this.next(), n$1.elements = this.parseExprList(O.bracketR, !0, !0, e$2), this.finishNode(n$1, "ArrayExpression");
					case O.braceL: return this.overrideContext(fe.b_expr), this.parseObj(!1, e$2);
					case O._function: return n$1 = this.startNode(), this.next(), this.parseFunction(n$1, 0);
					case O._class: return this.parseClass(this.startNode(), !1);
					case O._new: return this.parseNew();
					case O.backQuote: return this.parseTemplate();
					case O._import: return this.options.ecmaVersion >= 11 ? this.parseExprImport(i$1) : this.unexpected();
					default: return this.parseExprAtomDefault();
				}
			}, ge.parseExprAtomDefault = function() {
				this.unexpected();
			}, ge.parseExprImport = function(e$2) {
				var t$2 = this.startNode();
				if (this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword import"), this.next(), this.type === O.parenL && !e$2) return this.parseDynamicImport(t$2);
				if (this.type === O.dot) {
					var i$1 = this.startNodeAt(t$2.start, t$2.loc && t$2.loc.start);
					return i$1.name = "import", t$2.meta = this.finishNode(i$1, "Identifier"), this.parseImportMeta(t$2);
				}
				this.unexpected();
			}, ge.parseDynamicImport = function(e$2) {
				if (this.next(), e$2.source = this.parseMaybeAssign(), this.options.ecmaVersion >= 16) this.eat(O.parenR) ? e$2.options = null : (this.expect(O.comma), this.afterTrailingComma(O.parenR) ? e$2.options = null : (e$2.options = this.parseMaybeAssign(), this.eat(O.parenR) || (this.expect(O.comma), this.afterTrailingComma(O.parenR) || this.unexpected())));
				else if (!this.eat(O.parenR)) {
					var t$2 = this.start;
					this.eat(O.comma) && this.eat(O.parenR) ? this.raiseRecoverable(t$2, "Trailing comma is not allowed in import()") : this.unexpected(t$2);
				}
				return this.finishNode(e$2, "ImportExpression");
			}, ge.parseImportMeta = function(e$2) {
				this.next();
				var t$2 = this.containsEsc;
				return e$2.property = this.parseIdent(!0), "meta" !== e$2.property.name && this.raiseRecoverable(e$2.property.start, "The only valid meta property for import is 'import.meta'"), t$2 && this.raiseRecoverable(e$2.start, "'import.meta' must not contain escaped characters"), "module" === this.options.sourceType || this.options.allowImportExportEverywhere || this.raiseRecoverable(e$2.start, "Cannot use 'import.meta' outside a module"), this.finishNode(e$2, "MetaProperty");
			}, ge.parseLiteral = function(e$2) {
				var t$2 = this.startNode();
				return t$2.value = e$2, t$2.raw = this.input.slice(this.start, this.end), 110 === t$2.raw.charCodeAt(t$2.raw.length - 1) && (t$2.bigint = null != t$2.value ? t$2.value.toString() : t$2.raw.slice(0, -1).replace(/_/g, "")), this.next(), this.finishNode(t$2, "Literal");
			}, ge.parseParenExpression = function() {
				this.expect(O.parenL);
				var e$2 = this.parseExpression();
				return this.expect(O.parenR), e$2;
			}, ge.shouldParseArrow = function(e$2) {
				return !this.canInsertSemicolon();
			}, ge.parseParenAndDistinguishExpression = function(e$2, t$2) {
				var i$1, n$1 = this.start, a$1 = this.startLoc, c$1 = this.options.ecmaVersion >= 8;
				if (this.options.ecmaVersion >= 6) {
					this.next();
					var l$1, y$1 = this.start, E$1 = this.startLoc, w$1 = [], C$1 = !0, S$1 = !1, I$1 = new acorn_DestructuringErrors(), N$1 = this.yieldPos, j$1 = this.awaitPos;
					for (this.yieldPos = 0, this.awaitPos = 0; this.type !== O.parenR;) {
						if (C$1 ? C$1 = !1 : this.expect(O.comma), c$1 && this.afterTrailingComma(O.parenR, !0)) {
							S$1 = !0;
							break;
						}
						if (this.type === O.ellipsis) {
							l$1 = this.start, w$1.push(this.parseParenItem(this.parseRestBinding())), this.type === O.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
							break;
						}
						w$1.push(this.parseMaybeAssign(!1, I$1, this.parseParenItem));
					}
					var F$1 = this.lastTokEnd, B$1 = this.lastTokEndLoc;
					if (this.expect(O.parenR), e$2 && this.shouldParseArrow(w$1) && this.eat(O.arrow)) return this.checkPatternErrors(I$1, !1), this.checkYieldAwaitInDefaultParams(), this.yieldPos = N$1, this.awaitPos = j$1, this.parseParenArrowList(n$1, a$1, w$1, t$2);
					w$1.length && !S$1 || this.unexpected(this.lastTokStart), l$1 && this.unexpected(l$1), this.checkExpressionErrors(I$1, !0), this.yieldPos = N$1 || this.yieldPos, this.awaitPos = j$1 || this.awaitPos, w$1.length > 1 ? ((i$1 = this.startNodeAt(y$1, E$1)).expressions = w$1, this.finishNodeAt(i$1, "SequenceExpression", F$1, B$1)) : i$1 = w$1[0];
				} else i$1 = this.parseParenExpression();
				if (this.options.preserveParens) {
					var $$1 = this.startNodeAt(n$1, a$1);
					return $$1.expression = i$1, this.finishNode($$1, "ParenthesizedExpression");
				}
				return i$1;
			}, ge.parseParenItem = function(e$2) {
				return e$2;
			}, ge.parseParenArrowList = function(e$2, t$2, i$1, n$1) {
				return this.parseArrowExpression(this.startNodeAt(e$2, t$2), i$1, !1, n$1);
			};
			var xe = [];
			ge.parseNew = function() {
				this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
				var e$2 = this.startNode();
				if (this.next(), this.options.ecmaVersion >= 6 && this.type === O.dot) {
					var t$2 = this.startNodeAt(e$2.start, e$2.loc && e$2.loc.start);
					t$2.name = "new", e$2.meta = this.finishNode(t$2, "Identifier"), this.next();
					var i$1 = this.containsEsc;
					return e$2.property = this.parseIdent(!0), "target" !== e$2.property.name && this.raiseRecoverable(e$2.property.start, "The only valid meta property for new is 'new.target'"), i$1 && this.raiseRecoverable(e$2.start, "'new.target' must not contain escaped characters"), this.allowNewDotTarget || this.raiseRecoverable(e$2.start, "'new.target' can only be used in functions and class static block"), this.finishNode(e$2, "MetaProperty");
				}
				var n$1 = this.start, a$1 = this.startLoc;
				return e$2.callee = this.parseSubscripts(this.parseExprAtom(null, !1, !0), n$1, a$1, !0, !1), this.eat(O.parenL) ? e$2.arguments = this.parseExprList(O.parenR, this.options.ecmaVersion >= 8, !1) : e$2.arguments = xe, this.finishNode(e$2, "NewExpression");
			}, ge.parseTemplateElement = function(e$2) {
				var t$2 = e$2.isTagged, i$1 = this.startNode();
				return this.type === O.invalidTemplate ? (t$2 || this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal"), i$1.value = {
					raw: this.value.replace(/\r\n?/g, "\n"),
					cooked: null
				}) : i$1.value = {
					raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
					cooked: this.value
				}, this.next(), i$1.tail = this.type === O.backQuote, this.finishNode(i$1, "TemplateElement");
			}, ge.parseTemplate = function(e$2) {
				void 0 === e$2 && (e$2 = {});
				var t$2 = e$2.isTagged;
				void 0 === t$2 && (t$2 = !1);
				var i$1 = this.startNode();
				this.next(), i$1.expressions = [];
				var n$1 = this.parseTemplateElement({ isTagged: t$2 });
				for (i$1.quasis = [n$1]; !n$1.tail;) this.type === O.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(O.dollarBraceL), i$1.expressions.push(this.parseExpression()), this.expect(O.braceR), i$1.quasis.push(n$1 = this.parseTemplateElement({ isTagged: t$2 }));
				return this.next(), this.finishNode(i$1, "TemplateLiteral");
			}, ge.isAsyncProp = function(e$2) {
				return !e$2.computed && "Identifier" === e$2.key.type && "async" === e$2.key.name && (this.type === O.name || this.type === O.num || this.type === O.string || this.type === O.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === O.star) && !j.test(this.input.slice(this.lastTokEnd, this.start));
			}, ge.parseObj = function(e$2, t$2) {
				var i$1 = this.startNode(), n$1 = !0, a$1 = {};
				for (i$1.properties = [], this.next(); !this.eat(O.braceR);) {
					if (n$1) n$1 = !1;
					else if (this.expect(O.comma), this.options.ecmaVersion >= 5 && this.afterTrailingComma(O.braceR)) break;
					var c$1 = this.parseProperty(e$2, t$2);
					e$2 || this.checkPropClash(c$1, a$1, t$2), i$1.properties.push(c$1);
				}
				return this.finishNode(i$1, e$2 ? "ObjectPattern" : "ObjectExpression");
			}, ge.parseProperty = function(e$2, t$2) {
				var i$1, n$1, a$1, c$1, l$1 = this.startNode();
				if (this.options.ecmaVersion >= 9 && this.eat(O.ellipsis)) return e$2 ? (l$1.argument = this.parseIdent(!1), this.type === O.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.finishNode(l$1, "RestElement")) : (l$1.argument = this.parseMaybeAssign(!1, t$2), this.type === O.comma && t$2 && t$2.trailingComma < 0 && (t$2.trailingComma = this.start), this.finishNode(l$1, "SpreadElement"));
				this.options.ecmaVersion >= 6 && (l$1.method = !1, l$1.shorthand = !1, (e$2 || t$2) && (a$1 = this.start, c$1 = this.startLoc), e$2 || (i$1 = this.eat(O.star)));
				var y$1 = this.containsEsc;
				return this.parsePropertyName(l$1), !e$2 && !y$1 && this.options.ecmaVersion >= 8 && !i$1 && this.isAsyncProp(l$1) ? (n$1 = !0, i$1 = this.options.ecmaVersion >= 9 && this.eat(O.star), this.parsePropertyName(l$1)) : n$1 = !1, this.parsePropertyValue(l$1, e$2, i$1, n$1, a$1, c$1, t$2, y$1), this.finishNode(l$1, "Property");
			}, ge.parseGetterSetter = function(e$2) {
				var t$2 = e$2.key.name;
				this.parsePropertyName(e$2), e$2.value = this.parseMethod(!1), e$2.kind = t$2;
				var i$1 = "get" === e$2.kind ? 0 : 1;
				if (e$2.value.params.length !== i$1) {
					var n$1 = e$2.value.start;
					"get" === e$2.kind ? this.raiseRecoverable(n$1, "getter should have no params") : this.raiseRecoverable(n$1, "setter should have exactly one param");
				} else "set" === e$2.kind && "RestElement" === e$2.value.params[0].type && this.raiseRecoverable(e$2.value.params[0].start, "Setter cannot use rest params");
			}, ge.parsePropertyValue = function(e$2, t$2, i$1, n$1, a$1, c$1, l$1, y$1) {
				(i$1 || n$1) && this.type === O.colon && this.unexpected(), this.eat(O.colon) ? (e$2.value = t$2 ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(!1, l$1), e$2.kind = "init") : this.options.ecmaVersion >= 6 && this.type === O.parenL ? (t$2 && this.unexpected(), e$2.method = !0, e$2.value = this.parseMethod(i$1, n$1), e$2.kind = "init") : t$2 || y$1 || !(this.options.ecmaVersion >= 5) || e$2.computed || "Identifier" !== e$2.key.type || "get" !== e$2.key.name && "set" !== e$2.key.name || this.type === O.comma || this.type === O.braceR || this.type === O.eq ? this.options.ecmaVersion >= 6 && !e$2.computed && "Identifier" === e$2.key.type ? ((i$1 || n$1) && this.unexpected(), this.checkUnreserved(e$2.key), "await" !== e$2.key.name || this.awaitIdentPos || (this.awaitIdentPos = a$1), t$2 ? e$2.value = this.parseMaybeDefault(a$1, c$1, this.copyNode(e$2.key)) : this.type === O.eq && l$1 ? (l$1.shorthandAssign < 0 && (l$1.shorthandAssign = this.start), e$2.value = this.parseMaybeDefault(a$1, c$1, this.copyNode(e$2.key))) : e$2.value = this.copyNode(e$2.key), e$2.kind = "init", e$2.shorthand = !0) : this.unexpected() : ((i$1 || n$1) && this.unexpected(), this.parseGetterSetter(e$2));
			}, ge.parsePropertyName = function(e$2) {
				if (this.options.ecmaVersion >= 6) {
					if (this.eat(O.bracketL)) return e$2.computed = !0, e$2.key = this.parseMaybeAssign(), this.expect(O.bracketR), e$2.key;
					e$2.computed = !1;
				}
				return e$2.key = this.type === O.num || this.type === O.string ? this.parseExprAtom() : this.parseIdent("never" !== this.options.allowReserved);
			}, ge.initFunction = function(e$2) {
				e$2.id = null, this.options.ecmaVersion >= 6 && (e$2.generator = e$2.expression = !1), this.options.ecmaVersion >= 8 && (e$2.async = !1);
			}, ge.parseMethod = function(e$2, t$2, i$1) {
				var n$1 = this.startNode(), a$1 = this.yieldPos, c$1 = this.awaitPos, l$1 = this.awaitIdentPos;
				return this.initFunction(n$1), this.options.ecmaVersion >= 6 && (n$1.generator = e$2), this.options.ecmaVersion >= 8 && (n$1.async = !!t$2), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(64 | functionFlags(t$2, n$1.generator) | (i$1 ? 128 : 0)), this.expect(O.parenL), n$1.params = this.parseBindingList(O.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(n$1, !1, !0, !1), this.yieldPos = a$1, this.awaitPos = c$1, this.awaitIdentPos = l$1, this.finishNode(n$1, "FunctionExpression");
			}, ge.parseArrowExpression = function(e$2, t$2, i$1, n$1) {
				var a$1 = this.yieldPos, c$1 = this.awaitPos, l$1 = this.awaitIdentPos;
				return this.enterScope(16 | functionFlags(i$1, !1)), this.initFunction(e$2), this.options.ecmaVersion >= 8 && (e$2.async = !!i$1), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, e$2.params = this.toAssignableList(t$2, !0), this.parseFunctionBody(e$2, !0, !1, n$1), this.yieldPos = a$1, this.awaitPos = c$1, this.awaitIdentPos = l$1, this.finishNode(e$2, "ArrowFunctionExpression");
			}, ge.parseFunctionBody = function(e$2, t$2, i$1, n$1) {
				var a$1 = t$2 && this.type !== O.braceL, c$1 = this.strict, l$1 = !1;
				if (a$1) e$2.body = this.parseMaybeAssign(n$1), e$2.expression = !0, this.checkParams(e$2, !1);
				else {
					var y$1 = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(e$2.params);
					c$1 && !y$1 || (l$1 = this.strictDirective(this.end)) && y$1 && this.raiseRecoverable(e$2.start, "Illegal 'use strict' directive in function with non-simple parameter list");
					var E$1 = this.labels;
					this.labels = [], l$1 && (this.strict = !0), this.checkParams(e$2, !c$1 && !l$1 && !t$2 && !i$1 && this.isSimpleParamList(e$2.params)), this.strict && e$2.id && this.checkLValSimple(e$2.id, 5), e$2.body = this.parseBlock(!1, void 0, l$1 && !c$1), e$2.expression = !1, this.adaptDirectivePrologue(e$2.body.body), this.labels = E$1;
				}
				this.exitScope();
			}, ge.isSimpleParamList = function(e$2) {
				for (var t$2 = 0, i$1 = e$2; t$2 < i$1.length; t$2 += 1) if ("Identifier" !== i$1[t$2].type) return !1;
				return !0;
			}, ge.checkParams = function(e$2, t$2) {
				for (var i$1 = Object.create(null), n$1 = 0, a$1 = e$2.params; n$1 < a$1.length; n$1 += 1) {
					var c$1 = a$1[n$1];
					this.checkLValInnerPattern(c$1, 1, t$2 ? null : i$1);
				}
			}, ge.parseExprList = function(e$2, t$2, i$1, n$1) {
				for (var a$1 = [], c$1 = !0; !this.eat(e$2);) {
					if (c$1) c$1 = !1;
					else if (this.expect(O.comma), t$2 && this.afterTrailingComma(e$2)) break;
					var l$1 = void 0;
					i$1 && this.type === O.comma ? l$1 = null : this.type === O.ellipsis ? (l$1 = this.parseSpread(n$1), n$1 && this.type === O.comma && n$1.trailingComma < 0 && (n$1.trailingComma = this.start)) : l$1 = this.parseMaybeAssign(!1, n$1), a$1.push(l$1);
				}
				return a$1;
			}, ge.checkUnreserved = function(e$2) {
				var t$2 = e$2.start, i$1 = e$2.end, n$1 = e$2.name;
				(this.inGenerator && "yield" === n$1 && this.raiseRecoverable(t$2, "Cannot use 'yield' as identifier inside a generator"), this.inAsync && "await" === n$1 && this.raiseRecoverable(t$2, "Cannot use 'await' as identifier inside an async function"), this.currentThisScope().flags & se || "arguments" !== n$1 || this.raiseRecoverable(t$2, "Cannot use 'arguments' in class field initializer"), !this.inClassStaticBlock || "arguments" !== n$1 && "await" !== n$1 || this.raise(t$2, "Cannot use " + n$1 + " in class static initialization block"), this.keywords.test(n$1) && this.raise(t$2, "Unexpected keyword '" + n$1 + "'"), this.options.ecmaVersion < 6 && -1 !== this.input.slice(t$2, i$1).indexOf("\\")) || (this.strict ? this.reservedWordsStrict : this.reservedWords).test(n$1) && (this.inAsync || "await" !== n$1 || this.raiseRecoverable(t$2, "Cannot use keyword 'await' outside an async function"), this.raiseRecoverable(t$2, "The keyword '" + n$1 + "' is reserved"));
			}, ge.parseIdent = function(e$2) {
				var t$2 = this.parseIdentNode();
				return this.next(!!e$2), this.finishNode(t$2, "Identifier"), e$2 || (this.checkUnreserved(t$2), "await" !== t$2.name || this.awaitIdentPos || (this.awaitIdentPos = t$2.start)), t$2;
			}, ge.parseIdentNode = function() {
				var e$2 = this.startNode();
				return this.type === O.name ? e$2.name = this.value : this.type.keyword ? (e$2.name = this.type.keyword, "class" !== e$2.name && "function" !== e$2.name || this.lastTokEnd === this.lastTokStart + 1 && 46 === this.input.charCodeAt(this.lastTokStart) || this.context.pop(), this.type = O.name) : this.unexpected(), e$2;
			}, ge.parsePrivateIdent = function() {
				var e$2 = this.startNode();
				return this.type === O.privateId ? e$2.name = this.value : this.unexpected(), this.next(), this.finishNode(e$2, "PrivateIdentifier"), this.options.checkPrivateFields && (0 === this.privateNameStack.length ? this.raise(e$2.start, "Private field '#" + e$2.name + "' must be declared in an enclosing class") : this.privateNameStack[this.privateNameStack.length - 1].used.push(e$2)), e$2;
			}, ge.parseYield = function(e$2) {
				this.yieldPos || (this.yieldPos = this.start);
				var t$2 = this.startNode();
				return this.next(), this.type === O.semi || this.canInsertSemicolon() || this.type !== O.star && !this.type.startsExpr ? (t$2.delegate = !1, t$2.argument = null) : (t$2.delegate = this.eat(O.star), t$2.argument = this.parseMaybeAssign(e$2)), this.finishNode(t$2, "YieldExpression");
			}, ge.parseAwait = function(e$2) {
				this.awaitPos || (this.awaitPos = this.start);
				var t$2 = this.startNode();
				return this.next(), t$2.argument = this.parseMaybeUnary(null, !0, !1, e$2), this.finishNode(t$2, "AwaitExpression");
			};
			var ve = acorn_Parser.prototype;
			ve.raise = function(e$2, t$2) {
				var i$1 = getLineInfo(this.input, e$2);
				t$2 += " (" + i$1.line + ":" + i$1.column + ")", this.sourceFile && (t$2 += " in " + this.sourceFile);
				var n$1 = new SyntaxError(t$2);
				throw n$1.pos = e$2, n$1.loc = i$1, n$1.raisedAt = this.pos, n$1;
			}, ve.raiseRecoverable = ve.raise, ve.curPosition = function() {
				if (this.options.locations) return new acorn_Position(this.curLine, this.pos - this.lineStart);
			};
			var ye = acorn_Parser.prototype, acorn_Scope = function(e$2) {
				this.flags = e$2, this.var = [], this.lexical = [], this.functions = [];
			};
			ye.enterScope = function(e$2) {
				this.scopeStack.push(new acorn_Scope(e$2));
			}, ye.exitScope = function() {
				this.scopeStack.pop();
			}, ye.treatFunctionsAsVarInScope = function(e$2) {
				return 2 & e$2.flags || !this.inModule && 1 & e$2.flags;
			}, ye.declareName = function(e$2, t$2, i$1) {
				var n$1 = !1;
				if (2 === t$2) {
					var a$1 = this.currentScope();
					n$1 = a$1.lexical.indexOf(e$2) > -1 || a$1.functions.indexOf(e$2) > -1 || a$1.var.indexOf(e$2) > -1, a$1.lexical.push(e$2), this.inModule && 1 & a$1.flags && delete this.undefinedExports[e$2];
				} else if (4 === t$2) this.currentScope().lexical.push(e$2);
				else if (3 === t$2) {
					var c$1 = this.currentScope();
					n$1 = this.treatFunctionsAsVar ? c$1.lexical.indexOf(e$2) > -1 : c$1.lexical.indexOf(e$2) > -1 || c$1.var.indexOf(e$2) > -1, c$1.functions.push(e$2);
				} else for (var l$1 = this.scopeStack.length - 1; l$1 >= 0; --l$1) {
					var y$1 = this.scopeStack[l$1];
					if (y$1.lexical.indexOf(e$2) > -1 && !(32 & y$1.flags && y$1.lexical[0] === e$2) || !this.treatFunctionsAsVarInScope(y$1) && y$1.functions.indexOf(e$2) > -1) {
						n$1 = !0;
						break;
					}
					if (y$1.var.push(e$2), this.inModule && 1 & y$1.flags && delete this.undefinedExports[e$2], y$1.flags & se) break;
				}
				n$1 && this.raiseRecoverable(i$1, "Identifier '" + e$2 + "' has already been declared");
			}, ye.checkLocalExport = function(e$2) {
				-1 === this.scopeStack[0].lexical.indexOf(e$2.name) && -1 === this.scopeStack[0].var.indexOf(e$2.name) && (this.undefinedExports[e$2.name] = e$2);
			}, ye.currentScope = function() {
				return this.scopeStack[this.scopeStack.length - 1];
			}, ye.currentVarScope = function() {
				for (var e$2 = this.scopeStack.length - 1;; e$2--) {
					var t$2 = this.scopeStack[e$2];
					if (771 & t$2.flags) return t$2;
				}
			}, ye.currentThisScope = function() {
				for (var e$2 = this.scopeStack.length - 1;; e$2--) {
					var t$2 = this.scopeStack[e$2];
					if (771 & t$2.flags && !(16 & t$2.flags)) return t$2;
				}
			};
			var acorn_Node = function(e$2, t$2, i$1) {
				this.type = "", this.start = t$2, this.end = 0, e$2.options.locations && (this.loc = new acorn_SourceLocation(e$2, i$1)), e$2.options.directSourceFile && (this.sourceFile = e$2.options.directSourceFile), e$2.options.ranges && (this.range = [t$2, 0]);
			}, _e = acorn_Parser.prototype;
			function finishNodeAt(e$2, t$2, i$1, n$1) {
				return e$2.type = t$2, e$2.end = i$1, this.options.locations && (e$2.loc.end = n$1), this.options.ranges && (e$2.range[1] = i$1), e$2;
			}
			_e.startNode = function() {
				return new acorn_Node(this, this.start, this.startLoc);
			}, _e.startNodeAt = function(e$2, t$2) {
				return new acorn_Node(this, e$2, t$2);
			}, _e.finishNode = function(e$2, t$2) {
				return finishNodeAt.call(this, e$2, t$2, this.lastTokEnd, this.lastTokEndLoc);
			}, _e.finishNodeAt = function(e$2, t$2, i$1, n$1) {
				return finishNodeAt.call(this, e$2, t$2, i$1, n$1);
			}, _e.copyNode = function(e$2) {
				var t$2 = new acorn_Node(this, e$2.start, this.startLoc);
				for (var i$1 in e$2) t$2[i$1] = e$2[i$1];
				return t$2;
			};
			var Ee = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS", be = Ee + " Extended_Pictographic", ke = be + " EBase EComp EMod EPres ExtPict", we = {
				9: Ee,
				10: be,
				11: be,
				12: ke,
				13: ke,
				14: ke
			}, Ce = {
				9: "",
				10: "",
				11: "",
				12: "",
				13: "",
				14: "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji"
			}, Se = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu", Ie = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb", Te = Ie + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd", Re = Te + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho", Ae = Re + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi", Le = Ae + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith", Oe = {
				9: Ie,
				10: Te,
				11: Re,
				12: Ae,
				13: Le,
				14: Le + " Berf Beria_Erfe Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sidetic Sidt Sunu Sunuwar Tai_Yo Tayo Todhri Todr Tolong_Siki Tols Tulu_Tigalari Tutg Unknown Zzzz"
			}, De = {};
			function buildUnicodeData(e$2) {
				var t$2 = De[e$2] = {
					binary: wordsRegexp(we[e$2] + " " + Se),
					binaryOfStrings: wordsRegexp(Ce[e$2]),
					nonBinary: {
						General_Category: wordsRegexp(Se),
						Script: wordsRegexp(Oe[e$2])
					}
				};
				t$2.nonBinary.Script_Extensions = t$2.nonBinary.Script, t$2.nonBinary.gc = t$2.nonBinary.General_Category, t$2.nonBinary.sc = t$2.nonBinary.Script, t$2.nonBinary.scx = t$2.nonBinary.Script_Extensions;
			}
			for (var Ve = 0, Ue = [
				9,
				10,
				11,
				12,
				13,
				14
			]; Ve < Ue.length; Ve += 1) buildUnicodeData(Ue[Ve]);
			var Me = acorn_Parser.prototype, acorn_BranchID = function(e$2, t$2) {
				this.parent = e$2, this.base = t$2 || this;
			};
			acorn_BranchID.prototype.separatedFrom = function(e$2) {
				for (var t$2 = this; t$2; t$2 = t$2.parent) for (var i$1 = e$2; i$1; i$1 = i$1.parent) if (t$2.base === i$1.base && t$2 !== i$1) return !0;
				return !1;
			}, acorn_BranchID.prototype.sibling = function() {
				return new acorn_BranchID(this.parent, this.base);
			};
			var acorn_RegExpValidationState = function(e$2) {
				this.parser = e$2, this.validFlags = "gim" + (e$2.options.ecmaVersion >= 6 ? "uy" : "") + (e$2.options.ecmaVersion >= 9 ? "s" : "") + (e$2.options.ecmaVersion >= 13 ? "d" : "") + (e$2.options.ecmaVersion >= 15 ? "v" : ""), this.unicodeProperties = De[e$2.options.ecmaVersion >= 14 ? 14 : e$2.options.ecmaVersion], this.source = "", this.flags = "", this.start = 0, this.switchU = !1, this.switchV = !1, this.switchN = !1, this.pos = 0, this.lastIntValue = 0, this.lastStringValue = "", this.lastAssertionIsQuantifiable = !1, this.numCapturingParens = 0, this.maxBackReference = 0, this.groupNames = Object.create(null), this.backReferenceNames = [], this.branchID = null;
			};
			function isRegularExpressionModifier(e$2) {
				return 105 === e$2 || 109 === e$2 || 115 === e$2;
			}
			function isSyntaxCharacter(e$2) {
				return 36 === e$2 || e$2 >= 40 && e$2 <= 43 || 46 === e$2 || 63 === e$2 || e$2 >= 91 && e$2 <= 94 || e$2 >= 123 && e$2 <= 125;
			}
			function isControlLetter(e$2) {
				return e$2 >= 65 && e$2 <= 90 || e$2 >= 97 && e$2 <= 122;
			}
			acorn_RegExpValidationState.prototype.reset = function(e$2, t$2, i$1) {
				var n$1 = -1 !== i$1.indexOf("v"), a$1 = -1 !== i$1.indexOf("u");
				this.start = 0 | e$2, this.source = t$2 + "", this.flags = i$1, n$1 && this.parser.options.ecmaVersion >= 15 ? (this.switchU = !0, this.switchV = !0, this.switchN = !0) : (this.switchU = a$1 && this.parser.options.ecmaVersion >= 6, this.switchV = !1, this.switchN = a$1 && this.parser.options.ecmaVersion >= 9);
			}, acorn_RegExpValidationState.prototype.raise = function(e$2) {
				this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + e$2);
			}, acorn_RegExpValidationState.prototype.at = function(e$2, t$2) {
				void 0 === t$2 && (t$2 = !1);
				var i$1 = this.source, n$1 = i$1.length;
				if (e$2 >= n$1) return -1;
				var a$1 = i$1.charCodeAt(e$2);
				if (!t$2 && !this.switchU || a$1 <= 55295 || a$1 >= 57344 || e$2 + 1 >= n$1) return a$1;
				var c$1 = i$1.charCodeAt(e$2 + 1);
				return c$1 >= 56320 && c$1 <= 57343 ? (a$1 << 10) + c$1 - 56613888 : a$1;
			}, acorn_RegExpValidationState.prototype.nextIndex = function(e$2, t$2) {
				void 0 === t$2 && (t$2 = !1);
				var i$1 = this.source, n$1 = i$1.length;
				if (e$2 >= n$1) return n$1;
				var a$1, c$1 = i$1.charCodeAt(e$2);
				return !t$2 && !this.switchU || c$1 <= 55295 || c$1 >= 57344 || e$2 + 1 >= n$1 || (a$1 = i$1.charCodeAt(e$2 + 1)) < 56320 || a$1 > 57343 ? e$2 + 1 : e$2 + 2;
			}, acorn_RegExpValidationState.prototype.current = function(e$2) {
				return void 0 === e$2 && (e$2 = !1), this.at(this.pos, e$2);
			}, acorn_RegExpValidationState.prototype.lookahead = function(e$2) {
				return void 0 === e$2 && (e$2 = !1), this.at(this.nextIndex(this.pos, e$2), e$2);
			}, acorn_RegExpValidationState.prototype.advance = function(e$2) {
				void 0 === e$2 && (e$2 = !1), this.pos = this.nextIndex(this.pos, e$2);
			}, acorn_RegExpValidationState.prototype.eat = function(e$2, t$2) {
				return void 0 === t$2 && (t$2 = !1), this.current(t$2) === e$2 && (this.advance(t$2), !0);
			}, acorn_RegExpValidationState.prototype.eatChars = function(e$2, t$2) {
				void 0 === t$2 && (t$2 = !1);
				for (var i$1 = this.pos, n$1 = 0, a$1 = e$2; n$1 < a$1.length; n$1 += 1) {
					var c$1 = a$1[n$1], l$1 = this.at(i$1, t$2);
					if (-1 === l$1 || l$1 !== c$1) return !1;
					i$1 = this.nextIndex(i$1, t$2);
				}
				return this.pos = i$1, !0;
			}, Me.validateRegExpFlags = function(e$2) {
				for (var t$2 = e$2.validFlags, i$1 = e$2.flags, n$1 = !1, a$1 = !1, c$1 = 0; c$1 < i$1.length; c$1++) {
					var l$1 = i$1.charAt(c$1);
					-1 === t$2.indexOf(l$1) && this.raise(e$2.start, "Invalid regular expression flag"), i$1.indexOf(l$1, c$1 + 1) > -1 && this.raise(e$2.start, "Duplicate regular expression flag"), "u" === l$1 && (n$1 = !0), "v" === l$1 && (a$1 = !0);
				}
				this.options.ecmaVersion >= 15 && n$1 && a$1 && this.raise(e$2.start, "Invalid regular expression flag");
			}, Me.validateRegExpPattern = function(e$2) {
				this.regexp_pattern(e$2), !e$2.switchN && this.options.ecmaVersion >= 9 && function(e$3) {
					for (var t$2 in e$3) return !0;
					return !1;
				}(e$2.groupNames) && (e$2.switchN = !0, this.regexp_pattern(e$2));
			}, Me.regexp_pattern = function(e$2) {
				e$2.pos = 0, e$2.lastIntValue = 0, e$2.lastStringValue = "", e$2.lastAssertionIsQuantifiable = !1, e$2.numCapturingParens = 0, e$2.maxBackReference = 0, e$2.groupNames = Object.create(null), e$2.backReferenceNames.length = 0, e$2.branchID = null, this.regexp_disjunction(e$2), e$2.pos !== e$2.source.length && (e$2.eat(41) && e$2.raise("Unmatched ')'"), (e$2.eat(93) || e$2.eat(125)) && e$2.raise("Lone quantifier brackets")), e$2.maxBackReference > e$2.numCapturingParens && e$2.raise("Invalid escape");
				for (var t$2 = 0, i$1 = e$2.backReferenceNames; t$2 < i$1.length; t$2 += 1) {
					var n$1 = i$1[t$2];
					e$2.groupNames[n$1] || e$2.raise("Invalid named capture referenced");
				}
			}, Me.regexp_disjunction = function(e$2) {
				var t$2 = this.options.ecmaVersion >= 16;
				for (t$2 && (e$2.branchID = new acorn_BranchID(e$2.branchID, null)), this.regexp_alternative(e$2); e$2.eat(124);) t$2 && (e$2.branchID = e$2.branchID.sibling()), this.regexp_alternative(e$2);
				t$2 && (e$2.branchID = e$2.branchID.parent), this.regexp_eatQuantifier(e$2, !0) && e$2.raise("Nothing to repeat"), e$2.eat(123) && e$2.raise("Lone quantifier brackets");
			}, Me.regexp_alternative = function(e$2) {
				for (; e$2.pos < e$2.source.length && this.regexp_eatTerm(e$2););
			}, Me.regexp_eatTerm = function(e$2) {
				return this.regexp_eatAssertion(e$2) ? (e$2.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(e$2) && e$2.switchU && e$2.raise("Invalid quantifier"), !0) : !!(e$2.switchU ? this.regexp_eatAtom(e$2) : this.regexp_eatExtendedAtom(e$2)) && (this.regexp_eatQuantifier(e$2), !0);
			}, Me.regexp_eatAssertion = function(e$2) {
				var t$2 = e$2.pos;
				if (e$2.lastAssertionIsQuantifiable = !1, e$2.eat(94) || e$2.eat(36)) return !0;
				if (e$2.eat(92)) {
					if (e$2.eat(66) || e$2.eat(98)) return !0;
					e$2.pos = t$2;
				}
				if (e$2.eat(40) && e$2.eat(63)) {
					var i$1 = !1;
					if (this.options.ecmaVersion >= 9 && (i$1 = e$2.eat(60)), e$2.eat(61) || e$2.eat(33)) return this.regexp_disjunction(e$2), e$2.eat(41) || e$2.raise("Unterminated group"), e$2.lastAssertionIsQuantifiable = !i$1, !0;
				}
				return e$2.pos = t$2, !1;
			}, Me.regexp_eatQuantifier = function(e$2, t$2) {
				return void 0 === t$2 && (t$2 = !1), !!this.regexp_eatQuantifierPrefix(e$2, t$2) && (e$2.eat(63), !0);
			}, Me.regexp_eatQuantifierPrefix = function(e$2, t$2) {
				return e$2.eat(42) || e$2.eat(43) || e$2.eat(63) || this.regexp_eatBracedQuantifier(e$2, t$2);
			}, Me.regexp_eatBracedQuantifier = function(e$2, t$2) {
				var i$1 = e$2.pos;
				if (e$2.eat(123)) {
					var n$1 = 0, a$1 = -1;
					if (this.regexp_eatDecimalDigits(e$2) && (n$1 = e$2.lastIntValue, e$2.eat(44) && this.regexp_eatDecimalDigits(e$2) && (a$1 = e$2.lastIntValue), e$2.eat(125))) return -1 !== a$1 && a$1 < n$1 && !t$2 && e$2.raise("numbers out of order in {} quantifier"), !0;
					e$2.switchU && !t$2 && e$2.raise("Incomplete quantifier"), e$2.pos = i$1;
				}
				return !1;
			}, Me.regexp_eatAtom = function(e$2) {
				return this.regexp_eatPatternCharacters(e$2) || e$2.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e$2) || this.regexp_eatCharacterClass(e$2) || this.regexp_eatUncapturingGroup(e$2) || this.regexp_eatCapturingGroup(e$2);
			}, Me.regexp_eatReverseSolidusAtomEscape = function(e$2) {
				var t$2 = e$2.pos;
				if (e$2.eat(92)) {
					if (this.regexp_eatAtomEscape(e$2)) return !0;
					e$2.pos = t$2;
				}
				return !1;
			}, Me.regexp_eatUncapturingGroup = function(e$2) {
				var t$2 = e$2.pos;
				if (e$2.eat(40)) {
					if (e$2.eat(63)) {
						if (this.options.ecmaVersion >= 16) {
							var i$1 = this.regexp_eatModifiers(e$2), n$1 = e$2.eat(45);
							if (i$1 || n$1) {
								for (var a$1 = 0; a$1 < i$1.length; a$1++) {
									var c$1 = i$1.charAt(a$1);
									i$1.indexOf(c$1, a$1 + 1) > -1 && e$2.raise("Duplicate regular expression modifiers");
								}
								if (n$1) {
									var l$1 = this.regexp_eatModifiers(e$2);
									i$1 || l$1 || 58 !== e$2.current() || e$2.raise("Invalid regular expression modifiers");
									for (var y$1 = 0; y$1 < l$1.length; y$1++) {
										var E$1 = l$1.charAt(y$1);
										(l$1.indexOf(E$1, y$1 + 1) > -1 || i$1.indexOf(E$1) > -1) && e$2.raise("Duplicate regular expression modifiers");
									}
								}
							}
						}
						if (e$2.eat(58)) {
							if (this.regexp_disjunction(e$2), e$2.eat(41)) return !0;
							e$2.raise("Unterminated group");
						}
					}
					e$2.pos = t$2;
				}
				return !1;
			}, Me.regexp_eatCapturingGroup = function(e$2) {
				if (e$2.eat(40)) {
					if (this.options.ecmaVersion >= 9 ? this.regexp_groupSpecifier(e$2) : 63 === e$2.current() && e$2.raise("Invalid group"), this.regexp_disjunction(e$2), e$2.eat(41)) return e$2.numCapturingParens += 1, !0;
					e$2.raise("Unterminated group");
				}
				return !1;
			}, Me.regexp_eatModifiers = function(e$2) {
				for (var t$2 = "", i$1 = 0; -1 !== (i$1 = e$2.current()) && isRegularExpressionModifier(i$1);) t$2 += codePointToString(i$1), e$2.advance();
				return t$2;
			}, Me.regexp_eatExtendedAtom = function(e$2) {
				return e$2.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e$2) || this.regexp_eatCharacterClass(e$2) || this.regexp_eatUncapturingGroup(e$2) || this.regexp_eatCapturingGroup(e$2) || this.regexp_eatInvalidBracedQuantifier(e$2) || this.regexp_eatExtendedPatternCharacter(e$2);
			}, Me.regexp_eatInvalidBracedQuantifier = function(e$2) {
				return this.regexp_eatBracedQuantifier(e$2, !0) && e$2.raise("Nothing to repeat"), !1;
			}, Me.regexp_eatSyntaxCharacter = function(e$2) {
				var t$2 = e$2.current();
				return !!isSyntaxCharacter(t$2) && (e$2.lastIntValue = t$2, e$2.advance(), !0);
			}, Me.regexp_eatPatternCharacters = function(e$2) {
				for (var t$2 = e$2.pos, i$1 = 0; -1 !== (i$1 = e$2.current()) && !isSyntaxCharacter(i$1);) e$2.advance();
				return e$2.pos !== t$2;
			}, Me.regexp_eatExtendedPatternCharacter = function(e$2) {
				var t$2 = e$2.current();
				return !(-1 === t$2 || 36 === t$2 || t$2 >= 40 && t$2 <= 43 || 46 === t$2 || 63 === t$2 || 91 === t$2 || 94 === t$2 || 124 === t$2) && (e$2.advance(), !0);
			}, Me.regexp_groupSpecifier = function(e$2) {
				if (e$2.eat(63)) {
					this.regexp_eatGroupName(e$2) || e$2.raise("Invalid group");
					var t$2 = this.options.ecmaVersion >= 16, i$1 = e$2.groupNames[e$2.lastStringValue];
					if (i$1) if (t$2) for (var n$1 = 0, a$1 = i$1; n$1 < a$1.length; n$1 += 1) a$1[n$1].separatedFrom(e$2.branchID) || e$2.raise("Duplicate capture group name");
					else e$2.raise("Duplicate capture group name");
					t$2 ? (i$1 || (e$2.groupNames[e$2.lastStringValue] = [])).push(e$2.branchID) : e$2.groupNames[e$2.lastStringValue] = !0;
				}
			}, Me.regexp_eatGroupName = function(e$2) {
				if (e$2.lastStringValue = "", e$2.eat(60)) {
					if (this.regexp_eatRegExpIdentifierName(e$2) && e$2.eat(62)) return !0;
					e$2.raise("Invalid capture group name");
				}
				return !1;
			}, Me.regexp_eatRegExpIdentifierName = function(e$2) {
				if (e$2.lastStringValue = "", this.regexp_eatRegExpIdentifierStart(e$2)) {
					for (e$2.lastStringValue += codePointToString(e$2.lastIntValue); this.regexp_eatRegExpIdentifierPart(e$2);) e$2.lastStringValue += codePointToString(e$2.lastIntValue);
					return !0;
				}
				return !1;
			}, Me.regexp_eatRegExpIdentifierStart = function(e$2) {
				var t$2 = e$2.pos, i$1 = this.options.ecmaVersion >= 11, n$1 = e$2.current(i$1);
				return e$2.advance(i$1), 92 === n$1 && this.regexp_eatRegExpUnicodeEscapeSequence(e$2, i$1) && (n$1 = e$2.lastIntValue), function(e$3) {
					return isIdentifierStart(e$3, !0) || 36 === e$3 || 95 === e$3;
				}(n$1) ? (e$2.lastIntValue = n$1, !0) : (e$2.pos = t$2, !1);
			}, Me.regexp_eatRegExpIdentifierPart = function(e$2) {
				var t$2 = e$2.pos, i$1 = this.options.ecmaVersion >= 11, n$1 = e$2.current(i$1);
				return e$2.advance(i$1), 92 === n$1 && this.regexp_eatRegExpUnicodeEscapeSequence(e$2, i$1) && (n$1 = e$2.lastIntValue), function(e$3) {
					return isIdentifierChar(e$3, !0) || 36 === e$3 || 95 === e$3 || 8204 === e$3 || 8205 === e$3;
				}(n$1) ? (e$2.lastIntValue = n$1, !0) : (e$2.pos = t$2, !1);
			}, Me.regexp_eatAtomEscape = function(e$2) {
				return !!(this.regexp_eatBackReference(e$2) || this.regexp_eatCharacterClassEscape(e$2) || this.regexp_eatCharacterEscape(e$2) || e$2.switchN && this.regexp_eatKGroupName(e$2)) || (e$2.switchU && (99 === e$2.current() && e$2.raise("Invalid unicode escape"), e$2.raise("Invalid escape")), !1);
			}, Me.regexp_eatBackReference = function(e$2) {
				var t$2 = e$2.pos;
				if (this.regexp_eatDecimalEscape(e$2)) {
					var i$1 = e$2.lastIntValue;
					if (e$2.switchU) return i$1 > e$2.maxBackReference && (e$2.maxBackReference = i$1), !0;
					if (i$1 <= e$2.numCapturingParens) return !0;
					e$2.pos = t$2;
				}
				return !1;
			}, Me.regexp_eatKGroupName = function(e$2) {
				if (e$2.eat(107)) {
					if (this.regexp_eatGroupName(e$2)) return e$2.backReferenceNames.push(e$2.lastStringValue), !0;
					e$2.raise("Invalid named reference");
				}
				return !1;
			}, Me.regexp_eatCharacterEscape = function(e$2) {
				return this.regexp_eatControlEscape(e$2) || this.regexp_eatCControlLetter(e$2) || this.regexp_eatZero(e$2) || this.regexp_eatHexEscapeSequence(e$2) || this.regexp_eatRegExpUnicodeEscapeSequence(e$2, !1) || !e$2.switchU && this.regexp_eatLegacyOctalEscapeSequence(e$2) || this.regexp_eatIdentityEscape(e$2);
			}, Me.regexp_eatCControlLetter = function(e$2) {
				var t$2 = e$2.pos;
				if (e$2.eat(99)) {
					if (this.regexp_eatControlLetter(e$2)) return !0;
					e$2.pos = t$2;
				}
				return !1;
			}, Me.regexp_eatZero = function(e$2) {
				return 48 === e$2.current() && !isDecimalDigit(e$2.lookahead()) && (e$2.lastIntValue = 0, e$2.advance(), !0);
			}, Me.regexp_eatControlEscape = function(e$2) {
				var t$2 = e$2.current();
				return 116 === t$2 ? (e$2.lastIntValue = 9, e$2.advance(), !0) : 110 === t$2 ? (e$2.lastIntValue = 10, e$2.advance(), !0) : 118 === t$2 ? (e$2.lastIntValue = 11, e$2.advance(), !0) : 102 === t$2 ? (e$2.lastIntValue = 12, e$2.advance(), !0) : 114 === t$2 && (e$2.lastIntValue = 13, e$2.advance(), !0);
			}, Me.regexp_eatControlLetter = function(e$2) {
				var t$2 = e$2.current();
				return !!isControlLetter(t$2) && (e$2.lastIntValue = t$2 % 32, e$2.advance(), !0);
			}, Me.regexp_eatRegExpUnicodeEscapeSequence = function(e$2, t$2) {
				void 0 === t$2 && (t$2 = !1);
				var i$1, n$1 = e$2.pos, a$1 = t$2 || e$2.switchU;
				if (e$2.eat(117)) {
					if (this.regexp_eatFixedHexDigits(e$2, 4)) {
						var c$1 = e$2.lastIntValue;
						if (a$1 && c$1 >= 55296 && c$1 <= 56319) {
							var l$1 = e$2.pos;
							if (e$2.eat(92) && e$2.eat(117) && this.regexp_eatFixedHexDigits(e$2, 4)) {
								var y$1 = e$2.lastIntValue;
								if (y$1 >= 56320 && y$1 <= 57343) return e$2.lastIntValue = 1024 * (c$1 - 55296) + (y$1 - 56320) + 65536, !0;
							}
							e$2.pos = l$1, e$2.lastIntValue = c$1;
						}
						return !0;
					}
					if (a$1 && e$2.eat(123) && this.regexp_eatHexDigits(e$2) && e$2.eat(125) && (i$1 = e$2.lastIntValue) >= 0 && i$1 <= 1114111) return !0;
					a$1 && e$2.raise("Invalid unicode escape"), e$2.pos = n$1;
				}
				return !1;
			}, Me.regexp_eatIdentityEscape = function(e$2) {
				if (e$2.switchU) return !!this.regexp_eatSyntaxCharacter(e$2) || !!e$2.eat(47) && (e$2.lastIntValue = 47, !0);
				var t$2 = e$2.current();
				return !(99 === t$2 || e$2.switchN && 107 === t$2) && (e$2.lastIntValue = t$2, e$2.advance(), !0);
			}, Me.regexp_eatDecimalEscape = function(e$2) {
				e$2.lastIntValue = 0;
				var t$2 = e$2.current();
				if (t$2 >= 49 && t$2 <= 57) {
					do
						e$2.lastIntValue = 10 * e$2.lastIntValue + (t$2 - 48), e$2.advance();
					while ((t$2 = e$2.current()) >= 48 && t$2 <= 57);
					return !0;
				}
				return !1;
			};
			function isUnicodePropertyNameCharacter(e$2) {
				return isControlLetter(e$2) || 95 === e$2;
			}
			function isUnicodePropertyValueCharacter(e$2) {
				return isUnicodePropertyNameCharacter(e$2) || isDecimalDigit(e$2);
			}
			function isDecimalDigit(e$2) {
				return e$2 >= 48 && e$2 <= 57;
			}
			function isHexDigit(e$2) {
				return e$2 >= 48 && e$2 <= 57 || e$2 >= 65 && e$2 <= 70 || e$2 >= 97 && e$2 <= 102;
			}
			function hexToInt(e$2) {
				return e$2 >= 65 && e$2 <= 70 ? e$2 - 65 + 10 : e$2 >= 97 && e$2 <= 102 ? e$2 - 97 + 10 : e$2 - 48;
			}
			function isOctalDigit(e$2) {
				return e$2 >= 48 && e$2 <= 55;
			}
			Me.regexp_eatCharacterClassEscape = function(e$2) {
				var t$2 = e$2.current();
				if (function(e$3) {
					return 100 === e$3 || 68 === e$3 || 115 === e$3 || 83 === e$3 || 119 === e$3 || 87 === e$3;
				}(t$2)) return e$2.lastIntValue = -1, e$2.advance(), 1;
				var i$1 = !1;
				if (e$2.switchU && this.options.ecmaVersion >= 9 && ((i$1 = 80 === t$2) || 112 === t$2)) {
					var n$1;
					if (e$2.lastIntValue = -1, e$2.advance(), e$2.eat(123) && (n$1 = this.regexp_eatUnicodePropertyValueExpression(e$2)) && e$2.eat(125)) return i$1 && 2 === n$1 && e$2.raise("Invalid property name"), n$1;
					e$2.raise("Invalid property name");
				}
				return 0;
			}, Me.regexp_eatUnicodePropertyValueExpression = function(e$2) {
				var t$2 = e$2.pos;
				if (this.regexp_eatUnicodePropertyName(e$2) && e$2.eat(61)) {
					var i$1 = e$2.lastStringValue;
					if (this.regexp_eatUnicodePropertyValue(e$2)) {
						var n$1 = e$2.lastStringValue;
						return this.regexp_validateUnicodePropertyNameAndValue(e$2, i$1, n$1), 1;
					}
				}
				if (e$2.pos = t$2, this.regexp_eatLoneUnicodePropertyNameOrValue(e$2)) {
					var a$1 = e$2.lastStringValue;
					return this.regexp_validateUnicodePropertyNameOrValue(e$2, a$1);
				}
				return 0;
			}, Me.regexp_validateUnicodePropertyNameAndValue = function(e$2, t$2, i$1) {
				H(e$2.unicodeProperties.nonBinary, t$2) || e$2.raise("Invalid property name"), e$2.unicodeProperties.nonBinary[t$2].test(i$1) || e$2.raise("Invalid property value");
			}, Me.regexp_validateUnicodePropertyNameOrValue = function(e$2, t$2) {
				return e$2.unicodeProperties.binary.test(t$2) ? 1 : e$2.switchV && e$2.unicodeProperties.binaryOfStrings.test(t$2) ? 2 : void e$2.raise("Invalid property name");
			}, Me.regexp_eatUnicodePropertyName = function(e$2) {
				var t$2 = 0;
				for (e$2.lastStringValue = ""; isUnicodePropertyNameCharacter(t$2 = e$2.current());) e$2.lastStringValue += codePointToString(t$2), e$2.advance();
				return "" !== e$2.lastStringValue;
			}, Me.regexp_eatUnicodePropertyValue = function(e$2) {
				var t$2 = 0;
				for (e$2.lastStringValue = ""; isUnicodePropertyValueCharacter(t$2 = e$2.current());) e$2.lastStringValue += codePointToString(t$2), e$2.advance();
				return "" !== e$2.lastStringValue;
			}, Me.regexp_eatLoneUnicodePropertyNameOrValue = function(e$2) {
				return this.regexp_eatUnicodePropertyValue(e$2);
			}, Me.regexp_eatCharacterClass = function(e$2) {
				if (e$2.eat(91)) {
					var t$2 = e$2.eat(94), i$1 = this.regexp_classContents(e$2);
					return e$2.eat(93) || e$2.raise("Unterminated character class"), t$2 && 2 === i$1 && e$2.raise("Negated character class may contain strings"), !0;
				}
				return !1;
			}, Me.regexp_classContents = function(e$2) {
				return 93 === e$2.current() ? 1 : e$2.switchV ? this.regexp_classSetExpression(e$2) : (this.regexp_nonEmptyClassRanges(e$2), 1);
			}, Me.regexp_nonEmptyClassRanges = function(e$2) {
				for (; this.regexp_eatClassAtom(e$2);) {
					var t$2 = e$2.lastIntValue;
					if (e$2.eat(45) && this.regexp_eatClassAtom(e$2)) {
						var i$1 = e$2.lastIntValue;
						!e$2.switchU || -1 !== t$2 && -1 !== i$1 || e$2.raise("Invalid character class"), -1 !== t$2 && -1 !== i$1 && t$2 > i$1 && e$2.raise("Range out of order in character class");
					}
				}
			}, Me.regexp_eatClassAtom = function(e$2) {
				var t$2 = e$2.pos;
				if (e$2.eat(92)) {
					if (this.regexp_eatClassEscape(e$2)) return !0;
					if (e$2.switchU) {
						var i$1 = e$2.current();
						(99 === i$1 || isOctalDigit(i$1)) && e$2.raise("Invalid class escape"), e$2.raise("Invalid escape");
					}
					e$2.pos = t$2;
				}
				var n$1 = e$2.current();
				return 93 !== n$1 && (e$2.lastIntValue = n$1, e$2.advance(), !0);
			}, Me.regexp_eatClassEscape = function(e$2) {
				var t$2 = e$2.pos;
				if (e$2.eat(98)) return e$2.lastIntValue = 8, !0;
				if (e$2.switchU && e$2.eat(45)) return e$2.lastIntValue = 45, !0;
				if (!e$2.switchU && e$2.eat(99)) {
					if (this.regexp_eatClassControlLetter(e$2)) return !0;
					e$2.pos = t$2;
				}
				return this.regexp_eatCharacterClassEscape(e$2) || this.regexp_eatCharacterEscape(e$2);
			}, Me.regexp_classSetExpression = function(e$2) {
				var t$2, i$1 = 1;
				if (this.regexp_eatClassSetRange(e$2));
				else if (t$2 = this.regexp_eatClassSetOperand(e$2)) {
					2 === t$2 && (i$1 = 2);
					for (var n$1 = e$2.pos; e$2.eatChars([38, 38]);) 38 !== e$2.current() && (t$2 = this.regexp_eatClassSetOperand(e$2)) ? 2 !== t$2 && (i$1 = 1) : e$2.raise("Invalid character in character class");
					if (n$1 !== e$2.pos) return i$1;
					for (; e$2.eatChars([45, 45]);) this.regexp_eatClassSetOperand(e$2) || e$2.raise("Invalid character in character class");
					if (n$1 !== e$2.pos) return i$1;
				} else e$2.raise("Invalid character in character class");
				for (;;) if (!this.regexp_eatClassSetRange(e$2)) {
					if (!(t$2 = this.regexp_eatClassSetOperand(e$2))) return i$1;
					2 === t$2 && (i$1 = 2);
				}
			}, Me.regexp_eatClassSetRange = function(e$2) {
				var t$2 = e$2.pos;
				if (this.regexp_eatClassSetCharacter(e$2)) {
					var i$1 = e$2.lastIntValue;
					if (e$2.eat(45) && this.regexp_eatClassSetCharacter(e$2)) {
						var n$1 = e$2.lastIntValue;
						return -1 !== i$1 && -1 !== n$1 && i$1 > n$1 && e$2.raise("Range out of order in character class"), !0;
					}
					e$2.pos = t$2;
				}
				return !1;
			}, Me.regexp_eatClassSetOperand = function(e$2) {
				return this.regexp_eatClassSetCharacter(e$2) ? 1 : this.regexp_eatClassStringDisjunction(e$2) || this.regexp_eatNestedClass(e$2);
			}, Me.regexp_eatNestedClass = function(e$2) {
				var t$2 = e$2.pos;
				if (e$2.eat(91)) {
					var i$1 = e$2.eat(94), n$1 = this.regexp_classContents(e$2);
					if (e$2.eat(93)) return i$1 && 2 === n$1 && e$2.raise("Negated character class may contain strings"), n$1;
					e$2.pos = t$2;
				}
				if (e$2.eat(92)) {
					var a$1 = this.regexp_eatCharacterClassEscape(e$2);
					if (a$1) return a$1;
					e$2.pos = t$2;
				}
				return null;
			}, Me.regexp_eatClassStringDisjunction = function(e$2) {
				var t$2 = e$2.pos;
				if (e$2.eatChars([92, 113])) {
					if (e$2.eat(123)) {
						var i$1 = this.regexp_classStringDisjunctionContents(e$2);
						if (e$2.eat(125)) return i$1;
					} else e$2.raise("Invalid escape");
					e$2.pos = t$2;
				}
				return null;
			}, Me.regexp_classStringDisjunctionContents = function(e$2) {
				for (var t$2 = this.regexp_classString(e$2); e$2.eat(124);) 2 === this.regexp_classString(e$2) && (t$2 = 2);
				return t$2;
			}, Me.regexp_classString = function(e$2) {
				for (var t$2 = 0; this.regexp_eatClassSetCharacter(e$2);) t$2++;
				return 1 === t$2 ? 1 : 2;
			}, Me.regexp_eatClassSetCharacter = function(e$2) {
				var t$2 = e$2.pos;
				if (e$2.eat(92)) return !(!this.regexp_eatCharacterEscape(e$2) && !this.regexp_eatClassSetReservedPunctuator(e$2)) || (e$2.eat(98) ? (e$2.lastIntValue = 8, !0) : (e$2.pos = t$2, !1));
				var i$1 = e$2.current();
				return !(i$1 < 0 || i$1 === e$2.lookahead() && function(e$3) {
					return 33 === e$3 || e$3 >= 35 && e$3 <= 38 || e$3 >= 42 && e$3 <= 44 || 46 === e$3 || e$3 >= 58 && e$3 <= 64 || 94 === e$3 || 96 === e$3 || 126 === e$3;
				}(i$1)) && !function(e$3) {
					return 40 === e$3 || 41 === e$3 || 45 === e$3 || 47 === e$3 || e$3 >= 91 && e$3 <= 93 || e$3 >= 123 && e$3 <= 125;
				}(i$1) && (e$2.advance(), e$2.lastIntValue = i$1, !0);
			}, Me.regexp_eatClassSetReservedPunctuator = function(e$2) {
				var t$2 = e$2.current();
				return !!function(e$3) {
					return 33 === e$3 || 35 === e$3 || 37 === e$3 || 38 === e$3 || 44 === e$3 || 45 === e$3 || e$3 >= 58 && e$3 <= 62 || 64 === e$3 || 96 === e$3 || 126 === e$3;
				}(t$2) && (e$2.lastIntValue = t$2, e$2.advance(), !0);
			}, Me.regexp_eatClassControlLetter = function(e$2) {
				var t$2 = e$2.current();
				return !(!isDecimalDigit(t$2) && 95 !== t$2) && (e$2.lastIntValue = t$2 % 32, e$2.advance(), !0);
			}, Me.regexp_eatHexEscapeSequence = function(e$2) {
				var t$2 = e$2.pos;
				if (e$2.eat(120)) {
					if (this.regexp_eatFixedHexDigits(e$2, 2)) return !0;
					e$2.switchU && e$2.raise("Invalid escape"), e$2.pos = t$2;
				}
				return !1;
			}, Me.regexp_eatDecimalDigits = function(e$2) {
				var t$2 = e$2.pos, i$1 = 0;
				for (e$2.lastIntValue = 0; isDecimalDigit(i$1 = e$2.current());) e$2.lastIntValue = 10 * e$2.lastIntValue + (i$1 - 48), e$2.advance();
				return e$2.pos !== t$2;
			}, Me.regexp_eatHexDigits = function(e$2) {
				var t$2 = e$2.pos, i$1 = 0;
				for (e$2.lastIntValue = 0; isHexDigit(i$1 = e$2.current());) e$2.lastIntValue = 16 * e$2.lastIntValue + hexToInt(i$1), e$2.advance();
				return e$2.pos !== t$2;
			}, Me.regexp_eatLegacyOctalEscapeSequence = function(e$2) {
				if (this.regexp_eatOctalDigit(e$2)) {
					var t$2 = e$2.lastIntValue;
					if (this.regexp_eatOctalDigit(e$2)) {
						var i$1 = e$2.lastIntValue;
						t$2 <= 3 && this.regexp_eatOctalDigit(e$2) ? e$2.lastIntValue = 64 * t$2 + 8 * i$1 + e$2.lastIntValue : e$2.lastIntValue = 8 * t$2 + i$1;
					} else e$2.lastIntValue = t$2;
					return !0;
				}
				return !1;
			}, Me.regexp_eatOctalDigit = function(e$2) {
				var t$2 = e$2.current();
				return isOctalDigit(t$2) ? (e$2.lastIntValue = t$2 - 48, e$2.advance(), !0) : (e$2.lastIntValue = 0, !1);
			}, Me.regexp_eatFixedHexDigits = function(e$2, t$2) {
				var i$1 = e$2.pos;
				e$2.lastIntValue = 0;
				for (var n$1 = 0; n$1 < t$2; ++n$1) {
					var a$1 = e$2.current();
					if (!isHexDigit(a$1)) return e$2.pos = i$1, !1;
					e$2.lastIntValue = 16 * e$2.lastIntValue + hexToInt(a$1), e$2.advance();
				}
				return !0;
			};
			var acorn_Token = function(e$2) {
				this.type = e$2.type, this.value = e$2.value, this.start = e$2.start, this.end = e$2.end, e$2.options.locations && (this.loc = new acorn_SourceLocation(e$2, e$2.startLoc, e$2.endLoc)), e$2.options.ranges && (this.range = [e$2.start, e$2.end]);
			}, je = acorn_Parser.prototype;
			function stringToBigInt(e$2) {
				return "function" != typeof BigInt ? null : BigInt(e$2.replace(/_/g, ""));
			}
			je.next = function(e$2) {
				!e$2 && this.type.keyword && this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword), this.options.onToken && this.options.onToken(new acorn_Token(this)), this.lastTokEnd = this.end, this.lastTokStart = this.start, this.lastTokEndLoc = this.endLoc, this.lastTokStartLoc = this.startLoc, this.nextToken();
			}, je.getToken = function() {
				return this.next(), new acorn_Token(this);
			}, "undefined" != typeof Symbol && (je[Symbol.iterator] = function() {
				var e$2 = this;
				return { next: function() {
					var t$2 = e$2.getToken();
					return {
						done: t$2.type === O.eof,
						value: t$2
					};
				} };
			}), je.nextToken = function() {
				var e$2 = this.curContext();
				return e$2 && e$2.preserveSpace || this.skipSpace(), this.start = this.pos, this.options.locations && (this.startLoc = this.curPosition()), this.pos >= this.input.length ? this.finishToken(O.eof) : e$2.override ? e$2.override(this) : void this.readToken(this.fullCharCodeAtPos());
			}, je.readToken = function(e$2) {
				return isIdentifierStart(e$2, this.options.ecmaVersion >= 6) || 92 === e$2 ? this.readWord() : this.getTokenFromCode(e$2);
			}, je.fullCharCodeAt = function(e$2) {
				var t$2 = this.input.charCodeAt(e$2);
				if (t$2 <= 55295 || t$2 >= 56320) return t$2;
				var i$1 = this.input.charCodeAt(e$2 + 1);
				return i$1 <= 56319 || i$1 >= 57344 ? t$2 : (t$2 << 10) + i$1 - 56613888;
			}, je.fullCharCodeAtPos = function() {
				return this.fullCharCodeAt(this.pos);
			}, je.skipBlockComment = function() {
				var e$2 = this.options.onComment && this.curPosition(), t$2 = this.pos, i$1 = this.input.indexOf("*/", this.pos += 2);
				if (-1 === i$1 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = i$1 + 2, this.options.locations) for (var n$1 = void 0, a$1 = t$2; (n$1 = nextLineBreak(this.input, a$1, this.pos)) > -1;) ++this.curLine, a$1 = this.lineStart = n$1;
				this.options.onComment && this.options.onComment(!0, this.input.slice(t$2 + 2, i$1), t$2, this.pos, e$2, this.curPosition());
			}, je.skipLineComment = function(e$2) {
				for (var t$2 = this.pos, i$1 = this.options.onComment && this.curPosition(), n$1 = this.input.charCodeAt(this.pos += e$2); this.pos < this.input.length && !isNewLine(n$1);) n$1 = this.input.charCodeAt(++this.pos);
				this.options.onComment && this.options.onComment(!1, this.input.slice(t$2 + e$2, this.pos), t$2, this.pos, i$1, this.curPosition());
			}, je.skipSpace = function() {
				e: for (; this.pos < this.input.length;) {
					var e$2 = this.input.charCodeAt(this.pos);
					switch (e$2) {
						case 32:
						case 160:
							++this.pos;
							break;
						case 13: 10 === this.input.charCodeAt(this.pos + 1) && ++this.pos;
						case 10:
						case 8232:
						case 8233:
							++this.pos, this.options.locations && (++this.curLine, this.lineStart = this.pos);
							break;
						case 47:
							switch (this.input.charCodeAt(this.pos + 1)) {
								case 42:
									this.skipBlockComment();
									break;
								case 47:
									this.skipLineComment(2);
									break;
								default: break e;
							}
							break;
						default:
							if (!(e$2 > 8 && e$2 < 14 || e$2 >= 5760 && B.test(String.fromCharCode(e$2)))) break e;
							++this.pos;
					}
				}
			}, je.finishToken = function(e$2, t$2) {
				this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
				var i$1 = this.type;
				this.type = e$2, this.value = t$2, this.updateContext(i$1);
			}, je.readToken_dot = function() {
				var e$2 = this.input.charCodeAt(this.pos + 1);
				if (e$2 >= 48 && e$2 <= 57) return this.readNumber(!0);
				var t$2 = this.input.charCodeAt(this.pos + 2);
				return this.options.ecmaVersion >= 6 && 46 === e$2 && 46 === t$2 ? (this.pos += 3, this.finishToken(O.ellipsis)) : (++this.pos, this.finishToken(O.dot));
			}, je.readToken_slash = function() {
				var e$2 = this.input.charCodeAt(this.pos + 1);
				return this.exprAllowed ? (++this.pos, this.readRegexp()) : 61 === e$2 ? this.finishOp(O.assign, 2) : this.finishOp(O.slash, 1);
			}, je.readToken_mult_modulo_exp = function(e$2) {
				var t$2 = this.input.charCodeAt(this.pos + 1), i$1 = 1, n$1 = 42 === e$2 ? O.star : O.modulo;
				return this.options.ecmaVersion >= 7 && 42 === e$2 && 42 === t$2 && (++i$1, n$1 = O.starstar, t$2 = this.input.charCodeAt(this.pos + 2)), 61 === t$2 ? this.finishOp(O.assign, i$1 + 1) : this.finishOp(n$1, i$1);
			}, je.readToken_pipe_amp = function(e$2) {
				var t$2 = this.input.charCodeAt(this.pos + 1);
				if (t$2 === e$2) {
					if (this.options.ecmaVersion >= 12) {
						if (61 === this.input.charCodeAt(this.pos + 2)) return this.finishOp(O.assign, 3);
					}
					return this.finishOp(124 === e$2 ? O.logicalOR : O.logicalAND, 2);
				}
				return 61 === t$2 ? this.finishOp(O.assign, 2) : this.finishOp(124 === e$2 ? O.bitwiseOR : O.bitwiseAND, 1);
			}, je.readToken_caret = function() {
				return 61 === this.input.charCodeAt(this.pos + 1) ? this.finishOp(O.assign, 2) : this.finishOp(O.bitwiseXOR, 1);
			}, je.readToken_plus_min = function(e$2) {
				var t$2 = this.input.charCodeAt(this.pos + 1);
				return t$2 === e$2 ? 45 !== t$2 || this.inModule || 62 !== this.input.charCodeAt(this.pos + 2) || 0 !== this.lastTokEnd && !j.test(this.input.slice(this.lastTokEnd, this.pos)) ? this.finishOp(O.incDec, 2) : (this.skipLineComment(3), this.skipSpace(), this.nextToken()) : 61 === t$2 ? this.finishOp(O.assign, 2) : this.finishOp(O.plusMin, 1);
			}, je.readToken_lt_gt = function(e$2) {
				var t$2 = this.input.charCodeAt(this.pos + 1), i$1 = 1;
				return t$2 === e$2 ? (i$1 = 62 === e$2 && 62 === this.input.charCodeAt(this.pos + 2) ? 3 : 2, 61 === this.input.charCodeAt(this.pos + i$1) ? this.finishOp(O.assign, i$1 + 1) : this.finishOp(O.bitShift, i$1)) : 33 !== t$2 || 60 !== e$2 || this.inModule || 45 !== this.input.charCodeAt(this.pos + 2) || 45 !== this.input.charCodeAt(this.pos + 3) ? (61 === t$2 && (i$1 = 2), this.finishOp(O.relational, i$1)) : (this.skipLineComment(4), this.skipSpace(), this.nextToken());
			}, je.readToken_eq_excl = function(e$2) {
				var t$2 = this.input.charCodeAt(this.pos + 1);
				return 61 === t$2 ? this.finishOp(O.equality, 61 === this.input.charCodeAt(this.pos + 2) ? 3 : 2) : 61 === e$2 && 62 === t$2 && this.options.ecmaVersion >= 6 ? (this.pos += 2, this.finishToken(O.arrow)) : this.finishOp(61 === e$2 ? O.eq : O.prefix, 1);
			}, je.readToken_question = function() {
				var e$2 = this.options.ecmaVersion;
				if (e$2 >= 11) {
					var t$2 = this.input.charCodeAt(this.pos + 1);
					if (46 === t$2) {
						var i$1 = this.input.charCodeAt(this.pos + 2);
						if (i$1 < 48 || i$1 > 57) return this.finishOp(O.questionDot, 2);
					}
					if (63 === t$2) {
						if (e$2 >= 12) {
							if (61 === this.input.charCodeAt(this.pos + 2)) return this.finishOp(O.assign, 3);
						}
						return this.finishOp(O.coalesce, 2);
					}
				}
				return this.finishOp(O.question, 1);
			}, je.readToken_numberSign = function() {
				var e$2 = 35;
				if (this.options.ecmaVersion >= 13 && (++this.pos, isIdentifierStart(e$2 = this.fullCharCodeAtPos(), !0) || 92 === e$2)) return this.finishToken(O.privateId, this.readWord1());
				this.raise(this.pos, "Unexpected character '" + codePointToString(e$2) + "'");
			}, je.getTokenFromCode = function(e$2) {
				switch (e$2) {
					case 46: return this.readToken_dot();
					case 40: return ++this.pos, this.finishToken(O.parenL);
					case 41: return ++this.pos, this.finishToken(O.parenR);
					case 59: return ++this.pos, this.finishToken(O.semi);
					case 44: return ++this.pos, this.finishToken(O.comma);
					case 91: return ++this.pos, this.finishToken(O.bracketL);
					case 93: return ++this.pos, this.finishToken(O.bracketR);
					case 123: return ++this.pos, this.finishToken(O.braceL);
					case 125: return ++this.pos, this.finishToken(O.braceR);
					case 58: return ++this.pos, this.finishToken(O.colon);
					case 96:
						if (this.options.ecmaVersion < 6) break;
						return ++this.pos, this.finishToken(O.backQuote);
					case 48:
						var t$2 = this.input.charCodeAt(this.pos + 1);
						if (120 === t$2 || 88 === t$2) return this.readRadixNumber(16);
						if (this.options.ecmaVersion >= 6) {
							if (111 === t$2 || 79 === t$2) return this.readRadixNumber(8);
							if (98 === t$2 || 66 === t$2) return this.readRadixNumber(2);
						}
					case 49:
					case 50:
					case 51:
					case 52:
					case 53:
					case 54:
					case 55:
					case 56:
					case 57: return this.readNumber(!1);
					case 34:
					case 39: return this.readString(e$2);
					case 47: return this.readToken_slash();
					case 37:
					case 42: return this.readToken_mult_modulo_exp(e$2);
					case 124:
					case 38: return this.readToken_pipe_amp(e$2);
					case 94: return this.readToken_caret();
					case 43:
					case 45: return this.readToken_plus_min(e$2);
					case 60:
					case 62: return this.readToken_lt_gt(e$2);
					case 61:
					case 33: return this.readToken_eq_excl(e$2);
					case 63: return this.readToken_question();
					case 126: return this.finishOp(O.prefix, 1);
					case 35: return this.readToken_numberSign();
				}
				this.raise(this.pos, "Unexpected character '" + codePointToString(e$2) + "'");
			}, je.finishOp = function(e$2, t$2) {
				var i$1 = this.input.slice(this.pos, this.pos + t$2);
				return this.pos += t$2, this.finishToken(e$2, i$1);
			}, je.readRegexp = function() {
				for (var e$2, t$2, i$1 = this.pos;;) {
					this.pos >= this.input.length && this.raise(i$1, "Unterminated regular expression");
					var n$1 = this.input.charAt(this.pos);
					if (j.test(n$1) && this.raise(i$1, "Unterminated regular expression"), e$2) e$2 = !1;
					else {
						if ("[" === n$1) t$2 = !0;
						else if ("]" === n$1 && t$2) t$2 = !1;
						else if ("/" === n$1 && !t$2) break;
						e$2 = "\\" === n$1;
					}
					++this.pos;
				}
				var a$1 = this.input.slice(i$1, this.pos);
				++this.pos;
				var c$1 = this.pos, l$1 = this.readWord1();
				this.containsEsc && this.unexpected(c$1);
				var y$1 = this.regexpState || (this.regexpState = new acorn_RegExpValidationState(this));
				y$1.reset(i$1, a$1, l$1), this.validateRegExpFlags(y$1), this.validateRegExpPattern(y$1);
				var E$1 = null;
				try {
					E$1 = new RegExp(a$1, l$1);
				} catch (e$3) {}
				return this.finishToken(O.regexp, {
					pattern: a$1,
					flags: l$1,
					value: E$1
				});
			}, je.readInt = function(e$2, t$2, i$1) {
				for (var n$1 = this.options.ecmaVersion >= 12 && void 0 === t$2, a$1 = i$1 && 48 === this.input.charCodeAt(this.pos), c$1 = this.pos, l$1 = 0, y$1 = 0, E$1 = 0, w$1 = null == t$2 ? Infinity : t$2; E$1 < w$1; ++E$1, ++this.pos) {
					var C$1 = this.input.charCodeAt(this.pos), S$1 = void 0;
					if (n$1 && 95 === C$1) a$1 && this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"), 95 === y$1 && this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"), 0 === E$1 && this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"), y$1 = C$1;
					else {
						if ((S$1 = C$1 >= 97 ? C$1 - 97 + 10 : C$1 >= 65 ? C$1 - 65 + 10 : C$1 >= 48 && C$1 <= 57 ? C$1 - 48 : Infinity) >= e$2) break;
						y$1 = C$1, l$1 = l$1 * e$2 + S$1;
					}
				}
				return n$1 && 95 === y$1 && this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"), this.pos === c$1 || null != t$2 && this.pos - c$1 !== t$2 ? null : l$1;
			}, je.readRadixNumber = function(e$2) {
				var t$2 = this.pos;
				this.pos += 2;
				var i$1 = this.readInt(e$2);
				return i$1 ?? this.raise(this.start + 2, "Expected number in radix " + e$2), this.options.ecmaVersion >= 11 && 110 === this.input.charCodeAt(this.pos) ? (i$1 = stringToBigInt(this.input.slice(t$2, this.pos)), ++this.pos) : isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(O.num, i$1);
			}, je.readNumber = function(e$2) {
				var t$2 = this.pos;
				e$2 || null !== this.readInt(10, void 0, !0) || this.raise(t$2, "Invalid number");
				var i$1 = this.pos - t$2 >= 2 && 48 === this.input.charCodeAt(t$2);
				i$1 && this.strict && this.raise(t$2, "Invalid number");
				var n$1 = this.input.charCodeAt(this.pos);
				if (!i$1 && !e$2 && this.options.ecmaVersion >= 11 && 110 === n$1) {
					var a$1 = stringToBigInt(this.input.slice(t$2, this.pos));
					return ++this.pos, isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(O.num, a$1);
				}
				i$1 && /[89]/.test(this.input.slice(t$2, this.pos)) && (i$1 = !1), 46 !== n$1 || i$1 || (++this.pos, this.readInt(10), n$1 = this.input.charCodeAt(this.pos)), 69 !== n$1 && 101 !== n$1 || i$1 || (43 !== (n$1 = this.input.charCodeAt(++this.pos)) && 45 !== n$1 || ++this.pos, null === this.readInt(10) && this.raise(t$2, "Invalid number")), isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
				var c$1, l$1 = (c$1 = this.input.slice(t$2, this.pos), i$1 ? parseInt(c$1, 8) : parseFloat(c$1.replace(/_/g, "")));
				return this.finishToken(O.num, l$1);
			}, je.readCodePoint = function() {
				var e$2;
				if (123 === this.input.charCodeAt(this.pos)) {
					this.options.ecmaVersion < 6 && this.unexpected();
					var t$2 = ++this.pos;
					e$2 = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos), ++this.pos, e$2 > 1114111 && this.invalidStringToken(t$2, "Code point out of bounds");
				} else e$2 = this.readHexChar(4);
				return e$2;
			}, je.readString = function(e$2) {
				for (var t$2 = "", i$1 = ++this.pos;;) {
					this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
					var n$1 = this.input.charCodeAt(this.pos);
					if (n$1 === e$2) break;
					92 === n$1 ? (t$2 += this.input.slice(i$1, this.pos), t$2 += this.readEscapedChar(!1), i$1 = this.pos) : 8232 === n$1 || 8233 === n$1 ? (this.options.ecmaVersion < 10 && this.raise(this.start, "Unterminated string constant"), ++this.pos, this.options.locations && (this.curLine++, this.lineStart = this.pos)) : (isNewLine(n$1) && this.raise(this.start, "Unterminated string constant"), ++this.pos);
				}
				return t$2 += this.input.slice(i$1, this.pos++), this.finishToken(O.string, t$2);
			};
			var Fe = {};
			je.tryReadTemplateToken = function() {
				this.inTemplateElement = !0;
				try {
					this.readTmplToken();
				} catch (e$2) {
					if (e$2 !== Fe) throw e$2;
					this.readInvalidTemplateToken();
				}
				this.inTemplateElement = !1;
			}, je.invalidStringToken = function(e$2, t$2) {
				if (this.inTemplateElement && this.options.ecmaVersion >= 9) throw Fe;
				this.raise(e$2, t$2);
			}, je.readTmplToken = function() {
				for (var e$2 = "", t$2 = this.pos;;) {
					this.pos >= this.input.length && this.raise(this.start, "Unterminated template");
					var i$1 = this.input.charCodeAt(this.pos);
					if (96 === i$1 || 36 === i$1 && 123 === this.input.charCodeAt(this.pos + 1)) return this.pos !== this.start || this.type !== O.template && this.type !== O.invalidTemplate ? (e$2 += this.input.slice(t$2, this.pos), this.finishToken(O.template, e$2)) : 36 === i$1 ? (this.pos += 2, this.finishToken(O.dollarBraceL)) : (++this.pos, this.finishToken(O.backQuote));
					if (92 === i$1) e$2 += this.input.slice(t$2, this.pos), e$2 += this.readEscapedChar(!0), t$2 = this.pos;
					else if (isNewLine(i$1)) {
						switch (e$2 += this.input.slice(t$2, this.pos), ++this.pos, i$1) {
							case 13: 10 === this.input.charCodeAt(this.pos) && ++this.pos;
							case 10:
								e$2 += "\n";
								break;
							default: e$2 += String.fromCharCode(i$1);
						}
						this.options.locations && (++this.curLine, this.lineStart = this.pos), t$2 = this.pos;
					} else ++this.pos;
				}
			}, je.readInvalidTemplateToken = function() {
				for (; this.pos < this.input.length; this.pos++) switch (this.input[this.pos]) {
					case "\\":
						++this.pos;
						break;
					case "$": if ("{" !== this.input[this.pos + 1]) break;
					case "`": return this.finishToken(O.invalidTemplate, this.input.slice(this.start, this.pos));
					case "\r": "\n" === this.input[this.pos + 1] && ++this.pos;
					case "\n":
					case "\u2028":
					case "\u2029": ++this.curLine, this.lineStart = this.pos + 1;
				}
				this.raise(this.start, "Unterminated template");
			}, je.readEscapedChar = function(e$2) {
				var t$2 = this.input.charCodeAt(++this.pos);
				switch (++this.pos, t$2) {
					case 110: return "\n";
					case 114: return "\r";
					case 120: return String.fromCharCode(this.readHexChar(2));
					case 117: return codePointToString(this.readCodePoint());
					case 116: return "	";
					case 98: return "\b";
					case 118: return "\v";
					case 102: return "\f";
					case 13: 10 === this.input.charCodeAt(this.pos) && ++this.pos;
					case 10: return this.options.locations && (this.lineStart = this.pos, ++this.curLine), "";
					case 56:
					case 57: if (this.strict && this.invalidStringToken(this.pos - 1, "Invalid escape sequence"), e$2) {
						var i$1 = this.pos - 1;
						this.invalidStringToken(i$1, "Invalid escape sequence in template string");
					}
					default:
						if (t$2 >= 48 && t$2 <= 55) {
							var n$1 = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0], a$1 = parseInt(n$1, 8);
							return a$1 > 255 && (n$1 = n$1.slice(0, -1), a$1 = parseInt(n$1, 8)), this.pos += n$1.length - 1, t$2 = this.input.charCodeAt(this.pos), "0" === n$1 && 56 !== t$2 && 57 !== t$2 || !this.strict && !e$2 || this.invalidStringToken(this.pos - 1 - n$1.length, e$2 ? "Octal literal in template string" : "Octal literal in strict mode"), String.fromCharCode(a$1);
						}
						return isNewLine(t$2) ? (this.options.locations && (this.lineStart = this.pos, ++this.curLine), "") : String.fromCharCode(t$2);
				}
			}, je.readHexChar = function(e$2) {
				var t$2 = this.pos, i$1 = this.readInt(16, e$2);
				return null === i$1 && this.invalidStringToken(t$2, "Bad character escape sequence"), i$1;
			}, je.readWord1 = function() {
				this.containsEsc = !1;
				for (var e$2 = "", t$2 = !0, i$1 = this.pos, n$1 = this.options.ecmaVersion >= 6; this.pos < this.input.length;) {
					var a$1 = this.fullCharCodeAtPos();
					if (isIdentifierChar(a$1, n$1)) this.pos += a$1 <= 65535 ? 1 : 2;
					else {
						if (92 !== a$1) break;
						this.containsEsc = !0, e$2 += this.input.slice(i$1, this.pos);
						var c$1 = this.pos;
						117 !== this.input.charCodeAt(++this.pos) && this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"), ++this.pos;
						var l$1 = this.readCodePoint();
						(t$2 ? isIdentifierStart : isIdentifierChar)(l$1, n$1) || this.invalidStringToken(c$1, "Invalid Unicode escape"), e$2 += codePointToString(l$1), i$1 = this.pos;
					}
					t$2 = !1;
				}
				return e$2 + this.input.slice(i$1, this.pos);
			}, je.readWord = function() {
				var e$2 = this.readWord1(), t$2 = O.name;
				return this.keywords.test(e$2) && (t$2 = N[e$2]), this.finishToken(t$2, e$2);
			};
			acorn_Parser.acorn = {
				Parser: acorn_Parser,
				version: "8.16.0",
				defaultOptions: X,
				Position: acorn_Position,
				SourceLocation: acorn_SourceLocation,
				getLineInfo,
				Node: acorn_Node,
				TokenType: acorn_TokenType,
				tokTypes: O,
				keywordTypes: N,
				TokContext: acorn_TokContext,
				tokContexts: fe,
				isIdentifierChar,
				isIdentifierStart,
				Token: acorn_Token,
				isNewLine,
				lineBreak: j,
				lineBreakG: F,
				nonASCIIwhitespace: B
			};
			var Be = __webpack_require__("node:module"), $e = __webpack_require__("node:fs");
			String.fromCharCode;
			const qe = /\/$|\/\?|\/#/, Ge = /^\.?\//;
			function hasTrailingSlash(e$2 = "", t$2) {
				return t$2 ? qe.test(e$2) : e$2.endsWith("/");
			}
			function withTrailingSlash(e$2 = "", t$2) {
				if (!t$2) return e$2.endsWith("/") ? e$2 : e$2 + "/";
				if (hasTrailingSlash(e$2, !0)) return e$2 || "/";
				let i$1 = e$2, n$1 = "";
				const a$1 = e$2.indexOf("#");
				if (-1 !== a$1 && (i$1 = e$2.slice(0, a$1), n$1 = e$2.slice(a$1), !i$1)) return n$1;
				const [c$1, ...l$1] = i$1.split("?");
				return c$1 + "/" + (l$1.length > 0 ? `?${l$1.join("?")}` : "") + n$1;
			}
			function isNonEmptyURL(e$2) {
				return e$2 && "/" !== e$2;
			}
			function dist_joinURL(e$2, ...t$2) {
				let i$1 = e$2 || "";
				for (const e$3 of t$2.filter((e$4) => isNonEmptyURL(e$4))) if (i$1) {
					const t$3 = e$3.replace(Ge, "");
					i$1 = withTrailingSlash(i$1) + t$3;
				} else i$1 = e$3;
				return i$1;
			}
			Symbol.for("ufo:protocolRelative");
			const Ke = /^[A-Za-z]:\//;
			function pathe_M_eThtNZ_normalizeWindowsPath(e$2 = "") {
				return e$2 ? e$2.replace(/\\/g, "/").replace(Ke, (e$3) => e$3.toUpperCase()) : e$2;
			}
			const He = /^[/\\]{2}/, ze = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/, Je = /^[A-Za-z]:$/, Ye = /.(\.[^./]+|\.)$/, pathe_M_eThtNZ_normalize = function(e$2) {
				if (0 === e$2.length) return ".";
				const t$2 = (e$2 = pathe_M_eThtNZ_normalizeWindowsPath(e$2)).match(He), i$1 = isAbsolute(e$2), n$1 = "/" === e$2[e$2.length - 1];
				return 0 === (e$2 = normalizeString(e$2, !i$1)).length ? i$1 ? "/" : n$1 ? "./" : "." : (n$1 && (e$2 += "/"), Je.test(e$2) && (e$2 += "/"), t$2 ? i$1 ? `//${e$2}` : `//./${e$2}` : i$1 && !isAbsolute(e$2) ? `/${e$2}` : e$2);
			}, pathe_M_eThtNZ_join = function(...e$2) {
				let t$2 = "";
				for (const i$1 of e$2) if (i$1) if (t$2.length > 0) {
					const e$3 = "/" === t$2[t$2.length - 1], n$1 = "/" === i$1[0];
					t$2 += e$3 && n$1 ? i$1.slice(1) : e$3 || n$1 ? i$1 : `/${i$1}`;
				} else t$2 += i$1;
				return pathe_M_eThtNZ_normalize(t$2);
			};
			function pathe_M_eThtNZ_cwd() {
				return "undefined" != typeof process && "function" == typeof process.cwd ? process.cwd().replace(/\\/g, "/") : "/";
			}
			const pathe_M_eThtNZ_resolve = function(...e$2) {
				let t$2 = "", i$1 = !1;
				for (let n$1 = (e$2 = e$2.map((e$3) => pathe_M_eThtNZ_normalizeWindowsPath(e$3))).length - 1; n$1 >= -1 && !i$1; n$1--) {
					const a$1 = n$1 >= 0 ? e$2[n$1] : pathe_M_eThtNZ_cwd();
					a$1 && 0 !== a$1.length && (t$2 = `${a$1}/${t$2}`, i$1 = isAbsolute(a$1));
				}
				return t$2 = normalizeString(t$2, !i$1), i$1 && !isAbsolute(t$2) ? `/${t$2}` : t$2.length > 0 ? t$2 : ".";
			};
			function normalizeString(e$2, t$2) {
				let i$1 = "", n$1 = 0, a$1 = -1, c$1 = 0, l$1 = null;
				for (let y$1 = 0; y$1 <= e$2.length; ++y$1) {
					if (y$1 < e$2.length) l$1 = e$2[y$1];
					else {
						if ("/" === l$1) break;
						l$1 = "/";
					}
					if ("/" === l$1) {
						if (a$1 === y$1 - 1 || 1 === c$1);
						else if (2 === c$1) {
							if (i$1.length < 2 || 2 !== n$1 || "." !== i$1[i$1.length - 1] || "." !== i$1[i$1.length - 2]) {
								if (i$1.length > 2) {
									const e$3 = i$1.lastIndexOf("/");
									-1 === e$3 ? (i$1 = "", n$1 = 0) : (i$1 = i$1.slice(0, e$3), n$1 = i$1.length - 1 - i$1.lastIndexOf("/")), a$1 = y$1, c$1 = 0;
									continue;
								}
								if (i$1.length > 0) {
									i$1 = "", n$1 = 0, a$1 = y$1, c$1 = 0;
									continue;
								}
							}
							t$2 && (i$1 += i$1.length > 0 ? "/.." : "..", n$1 = 2);
						} else i$1.length > 0 ? i$1 += `/${e$2.slice(a$1 + 1, y$1)}` : i$1 = e$2.slice(a$1 + 1, y$1), n$1 = y$1 - a$1 - 1;
						a$1 = y$1, c$1 = 0;
					} else "." === l$1 && -1 !== c$1 ? ++c$1 : c$1 = -1;
				}
				return i$1;
			}
			const isAbsolute = function(e$2) {
				return ze.test(e$2);
			}, extname = function(e$2) {
				if (".." === e$2) return "";
				const t$2 = Ye.exec(pathe_M_eThtNZ_normalizeWindowsPath(e$2));
				return t$2 && t$2[1] || "";
			}, pathe_M_eThtNZ_dirname = function(e$2) {
				const t$2 = pathe_M_eThtNZ_normalizeWindowsPath(e$2).replace(/\/$/, "").split("/").slice(0, -1);
				return 1 === t$2.length && Je.test(t$2[0]) && (t$2[0] += "/"), t$2.join("/") || (isAbsolute(e$2) ? "/" : ".");
			}, basename = function(e$2, t$2) {
				const i$1 = pathe_M_eThtNZ_normalizeWindowsPath(e$2).split("/");
				let n$1 = "";
				for (let e$3 = i$1.length - 1; e$3 >= 0; e$3--) {
					const t$3 = i$1[e$3];
					if (t$3) {
						n$1 = t$3;
						break;
					}
				}
				return t$2 && n$1.endsWith(t$2) ? n$1.slice(0, -t$2.length) : n$1;
			}, Qe = __require("node:url"), Ze = __require("node:assert"), Xe = __require("node:process");
			var et = __webpack_require__("node:path");
			const tt = __require("node:v8"), it = __require("node:util"), st = new Set(Be.builtinModules);
			function normalizeSlash(e$2) {
				return e$2.replace(/\\/g, "/");
			}
			const rt = {}.hasOwnProperty, nt = /^([A-Z][a-z\d]*)+$/, at = new Set([
				"string",
				"function",
				"number",
				"object",
				"Function",
				"Object",
				"boolean",
				"bigint",
				"symbol"
			]), ot = {};
			function formatList(e$2, t$2 = "and") {
				return e$2.length < 3 ? e$2.join(` ${t$2} `) : `${e$2.slice(0, -1).join(", ")}, ${t$2} ${e$2[e$2.length - 1]}`;
			}
			const ct = new Map();
			let ht;
			function createError(e$2, t$2, i$1) {
				return ct.set(e$2, t$2), function(e$3, t$3) {
					return NodeError;
					function NodeError(...i$2) {
						const n$1 = Error.stackTraceLimit;
						isErrorStackTraceLimitWritable() && (Error.stackTraceLimit = 0);
						const a$1 = new e$3();
						isErrorStackTraceLimitWritable() && (Error.stackTraceLimit = n$1);
						const c$1 = function(e$4, t$4, i$3) {
							const n$2 = ct.get(e$4);
							if (Ze.ok(void 0 !== n$2, "expected `message` to be found"), "function" == typeof n$2) return Ze.ok(n$2.length <= t$4.length, `Code: ${e$4}; The provided arguments length (${t$4.length}) does not match the required ones (${n$2.length}).`), Reflect.apply(n$2, i$3, t$4);
							const a$2 = /%[dfijoOs]/g;
							let c$2 = 0;
							for (; null !== a$2.exec(n$2);) c$2++;
							return Ze.ok(c$2 === t$4.length, `Code: ${e$4}; The provided arguments length (${t$4.length}) does not match the required ones (${c$2}).`), 0 === t$4.length ? n$2 : (t$4.unshift(n$2), Reflect.apply(it.format, null, t$4));
						}(t$3, i$2, a$1);
						return Object.defineProperties(a$1, {
							message: {
								value: c$1,
								enumerable: !1,
								writable: !0,
								configurable: !0
							},
							toString: {
								value() {
									return `${this.name} [${t$3}]: ${this.message}`;
								},
								enumerable: !1,
								writable: !0,
								configurable: !0
							}
						}), lt(a$1), a$1.code = t$3, a$1;
					}
				}(i$1, e$2);
			}
			function isErrorStackTraceLimitWritable() {
				try {
					if (tt.startupSnapshot.isBuildingSnapshot()) return !1;
				} catch {}
				const e$2 = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
				return void 0 === e$2 ? Object.isExtensible(Error) : rt.call(e$2, "writable") && void 0 !== e$2.writable ? e$2.writable : void 0 !== e$2.set;
			}
			ot.ERR_INVALID_ARG_TYPE = createError("ERR_INVALID_ARG_TYPE", (e$2, t$2, i$1) => {
				Ze.ok("string" == typeof e$2, "'name' must be a string"), Array.isArray(t$2) || (t$2 = [t$2]);
				let n$1 = "The ";
				if (e$2.endsWith(" argument")) n$1 += `${e$2} `;
				else {
					const t$3 = e$2.includes(".") ? "property" : "argument";
					n$1 += `"${e$2}" ${t$3} `;
				}
				n$1 += "must be ";
				const a$1 = [], c$1 = [], l$1 = [];
				for (const e$3 of t$2) Ze.ok("string" == typeof e$3, "All expected entries have to be of type string"), at.has(e$3) ? a$1.push(e$3.toLowerCase()) : null === nt.exec(e$3) ? (Ze.ok("object" !== e$3, "The value \"object\" should be written as \"Object\""), l$1.push(e$3)) : c$1.push(e$3);
				if (c$1.length > 0) {
					const e$3 = a$1.indexOf("object");
					-1 !== e$3 && (a$1.slice(e$3, 1), c$1.push("Object"));
				}
				return a$1.length > 0 && (n$1 += `${a$1.length > 1 ? "one of type" : "of type"} ${formatList(a$1, "or")}`, (c$1.length > 0 || l$1.length > 0) && (n$1 += " or ")), c$1.length > 0 && (n$1 += `an instance of ${formatList(c$1, "or")}`, l$1.length > 0 && (n$1 += " or ")), l$1.length > 0 && (l$1.length > 1 ? n$1 += `one of ${formatList(l$1, "or")}` : (l$1[0].toLowerCase() !== l$1[0] && (n$1 += "an "), n$1 += `${l$1[0]}`)), n$1 += `. Received ${function(e$3) {
					if (null == e$3) return String(e$3);
					if ("function" == typeof e$3 && e$3.name) return `function ${e$3.name}`;
					if ("object" == typeof e$3) return e$3.constructor && e$3.constructor.name ? `an instance of ${e$3.constructor.name}` : `${(0, it.inspect)(e$3, { depth: -1 })}`;
					let t$3 = (0, it.inspect)(e$3, { colors: !1 });
					t$3.length > 28 && (t$3 = `${t$3.slice(0, 25)}...`);
					return `type ${typeof e$3} (${t$3})`;
				}(i$1)}`, n$1;
			}, TypeError), ot.ERR_INVALID_MODULE_SPECIFIER = createError("ERR_INVALID_MODULE_SPECIFIER", (e$2, t$2, i$1 = void 0) => `Invalid module "${e$2}" ${t$2}${i$1 ? ` imported from ${i$1}` : ""}`, TypeError), ot.ERR_INVALID_PACKAGE_CONFIG = createError("ERR_INVALID_PACKAGE_CONFIG", (e$2, t$2, i$1) => `Invalid package config ${e$2}${t$2 ? ` while importing ${t$2}` : ""}${i$1 ? `. ${i$1}` : ""}`, Error), ot.ERR_INVALID_PACKAGE_TARGET = createError("ERR_INVALID_PACKAGE_TARGET", (e$2, t$2, i$1, n$1 = !1, a$1 = void 0) => {
				const c$1 = "string" == typeof i$1 && !n$1 && i$1.length > 0 && !i$1.startsWith("./");
				return "." === t$2 ? (Ze.ok(!1 === n$1), `Invalid "exports" main target ${JSON.stringify(i$1)} defined in the package config ${e$2}package.json${a$1 ? ` imported from ${a$1}` : ""}${c$1 ? "; targets must start with \"./\"" : ""}`) : `Invalid "${n$1 ? "imports" : "exports"}" target ${JSON.stringify(i$1)} defined for '${t$2}' in the package config ${e$2}package.json${a$1 ? ` imported from ${a$1}` : ""}${c$1 ? "; targets must start with \"./\"" : ""}`;
			}, Error), ot.ERR_MODULE_NOT_FOUND = createError("ERR_MODULE_NOT_FOUND", (e$2, t$2, i$1 = !1) => `Cannot find ${i$1 ? "module" : "package"} '${e$2}' imported from ${t$2}`, Error), ot.ERR_NETWORK_IMPORT_DISALLOWED = createError("ERR_NETWORK_IMPORT_DISALLOWED", "import of '%s' by %s is not supported: %s", Error), ot.ERR_PACKAGE_IMPORT_NOT_DEFINED = createError("ERR_PACKAGE_IMPORT_NOT_DEFINED", (e$2, t$2, i$1) => `Package import specifier "${e$2}" is not defined${t$2 ? ` in package ${t$2}package.json` : ""} imported from ${i$1}`, TypeError), ot.ERR_PACKAGE_PATH_NOT_EXPORTED = createError("ERR_PACKAGE_PATH_NOT_EXPORTED", (e$2, t$2, i$1 = void 0) => "." === t$2 ? `No "exports" main defined in ${e$2}package.json${i$1 ? ` imported from ${i$1}` : ""}` : `Package subpath '${t$2}' is not defined by "exports" in ${e$2}package.json${i$1 ? ` imported from ${i$1}` : ""}`, Error), ot.ERR_UNSUPPORTED_DIR_IMPORT = createError("ERR_UNSUPPORTED_DIR_IMPORT", "Directory import '%s' is not supported resolving ES modules imported from %s", Error), ot.ERR_UNSUPPORTED_RESOLVE_REQUEST = createError("ERR_UNSUPPORTED_RESOLVE_REQUEST", "Failed to resolve module specifier \"%s\" from \"%s\": Invalid relative URL or base scheme is not hierarchical.", TypeError), ot.ERR_UNKNOWN_FILE_EXTENSION = createError("ERR_UNKNOWN_FILE_EXTENSION", (e$2, t$2) => `Unknown file extension "${e$2}" for ${t$2}`, TypeError), ot.ERR_INVALID_ARG_VALUE = createError("ERR_INVALID_ARG_VALUE", (e$2, t$2, i$1 = "is invalid") => {
				let n$1 = (0, it.inspect)(t$2);
				n$1.length > 128 && (n$1 = `${n$1.slice(0, 128)}...`);
				return `The ${e$2.includes(".") ? "property" : "argument"} '${e$2}' ${i$1}. Received ${n$1}`;
			}, TypeError);
			const lt = function(e$2) {
				const t$2 = "__node_internal_" + e$2.name;
				return Object.defineProperty(e$2, "name", { value: t$2 }), e$2;
			}(function(e$2) {
				const t$2 = isErrorStackTraceLimitWritable();
				return t$2 && (ht = Error.stackTraceLimit, Error.stackTraceLimit = Number.POSITIVE_INFINITY), Error.captureStackTrace(e$2), t$2 && (Error.stackTraceLimit = ht), e$2;
			});
			const pt = {}.hasOwnProperty, { ERR_INVALID_PACKAGE_CONFIG: ut } = ot, dt = new Map();
			function read(e$2, { base: t$2, specifier: i$1 }) {
				const n$1 = dt.get(e$2);
				if (n$1) return n$1;
				let a$1;
				try {
					a$1 = $e.readFileSync(et.toNamespacedPath(e$2), "utf8");
				} catch (e$3) {
					const t$3 = e$3;
					if ("ENOENT" !== t$3.code) throw t$3;
				}
				const c$1 = {
					exists: !1,
					pjsonPath: e$2,
					main: void 0,
					name: void 0,
					type: "none",
					exports: void 0,
					imports: void 0
				};
				if (void 0 !== a$1) {
					let n$2;
					try {
						n$2 = JSON.parse(a$1);
					} catch (n$3) {
						const a$2 = n$3, c$2 = new ut(e$2, (t$2 ? `"${i$1}" from ` : "") + (0, Qe.fileURLToPath)(t$2 || i$1), a$2.message);
						throw c$2.cause = a$2, c$2;
					}
					c$1.exists = !0, pt.call(n$2, "name") && "string" == typeof n$2.name && (c$1.name = n$2.name), pt.call(n$2, "main") && "string" == typeof n$2.main && (c$1.main = n$2.main), pt.call(n$2, "exports") && (c$1.exports = n$2.exports), pt.call(n$2, "imports") && (c$1.imports = n$2.imports), !pt.call(n$2, "type") || "commonjs" !== n$2.type && "module" !== n$2.type || (c$1.type = n$2.type);
				}
				return dt.set(e$2, c$1), c$1;
			}
			function getPackageScopeConfig(e$2) {
				let t$2 = new URL("package.json", e$2);
				for (;;) {
					if (t$2.pathname.endsWith("node_modules/package.json")) break;
					const i$1 = read((0, Qe.fileURLToPath)(t$2), { specifier: e$2 });
					if (i$1.exists) return i$1;
					const n$1 = t$2;
					if (t$2 = new URL("../package.json", t$2), t$2.pathname === n$1.pathname) break;
				}
				return {
					pjsonPath: (0, Qe.fileURLToPath)(t$2),
					exists: !1,
					type: "none"
				};
			}
			function getPackageType(e$2) {
				return getPackageScopeConfig(e$2).type;
			}
			const { ERR_UNKNOWN_FILE_EXTENSION: ft } = ot, mt = {}.hasOwnProperty, gt = {
				__proto__: null,
				".cjs": "commonjs",
				".js": "module",
				".json": "json",
				".mjs": "module"
			};
			const xt = {
				__proto__: null,
				"data:": function(e$2) {
					const { 1: t$2 } = /^([^/]+\/[^;,]+)[^,]*?(;base64)?,/.exec(e$2.pathname) || [
						null,
						null,
						null
					];
					return function(e$3) {
						return e$3 && /\s*(text|application)\/javascript\s*(;\s*charset=utf-?8\s*)?/i.test(e$3) ? "module" : "application/json" === e$3 ? "json" : null;
					}(t$2);
				},
				"file:": function(e$2, t$2, i$1) {
					const n$1 = function(e$3) {
						const t$3 = e$3.pathname;
						let i$2 = t$3.length;
						for (; i$2--;) {
							const e$4 = t$3.codePointAt(i$2);
							if (47 === e$4) return "";
							if (46 === e$4) return 47 === t$3.codePointAt(i$2 - 1) ? "" : t$3.slice(i$2);
						}
						return "";
					}(e$2);
					if (".js" === n$1) {
						const t$3 = getPackageType(e$2);
						return "none" !== t$3 ? t$3 : "commonjs";
					}
					if ("" === n$1) {
						const t$3 = getPackageType(e$2);
						return "none" === t$3 || "commonjs" === t$3 ? "commonjs" : "module";
					}
					const a$1 = gt[n$1];
					if (a$1) return a$1;
					if (i$1) return;
					const c$1 = (0, Qe.fileURLToPath)(e$2);
					throw new ft(n$1, c$1);
				},
				"http:": getHttpProtocolModuleFormat,
				"https:": getHttpProtocolModuleFormat,
				"node:": () => "builtin"
			};
			function getHttpProtocolModuleFormat() {}
			const vt = Object.freeze(["node", "import"]), yt = new Set(vt);
			function getConditionsSet(e$2) {
				return yt;
			}
			const _t = RegExp.prototype[Symbol.replace], { ERR_INVALID_MODULE_SPECIFIER: Et, ERR_INVALID_PACKAGE_CONFIG: bt, ERR_INVALID_PACKAGE_TARGET: kt, ERR_MODULE_NOT_FOUND: wt, ERR_PACKAGE_IMPORT_NOT_DEFINED: Ct, ERR_PACKAGE_PATH_NOT_EXPORTED: St, ERR_UNSUPPORTED_DIR_IMPORT: It, ERR_UNSUPPORTED_RESOLVE_REQUEST: Tt } = ot, Rt = {}.hasOwnProperty, At = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))?(\\|\/|$)/i, Pt = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))(\\|\/|$)/i, Lt = /^\.|%|\\/, Nt = /\*/g, Ot = /%2f|%5c/i, Dt = new Set(), Vt = /[/\\]{2}/;
			function emitInvalidSegmentDeprecation(e$2, t$2, i$1, n$1, a$1, c$1, l$1) {
				if (Xe.noDeprecation) return;
				const y$1 = (0, Qe.fileURLToPath)(n$1), E$1 = null !== Vt.exec(l$1 ? e$2 : t$2);
				Xe.emitWarning(`Use of deprecated ${E$1 ? "double slash" : "leading or trailing slash matching"} resolving "${e$2}" for module request "${t$2}" ${t$2 === i$1 ? "" : `matched to "${i$1}" `}in the "${a$1 ? "imports" : "exports"}" field module resolution of the package at ${y$1}${c$1 ? ` imported from ${(0, Qe.fileURLToPath)(c$1)}` : ""}.`, "DeprecationWarning", "DEP0166");
			}
			function emitLegacyIndexDeprecation(e$2, t$2, i$1, n$1) {
				if (Xe.noDeprecation) return;
				const a$1 = function(e$3, t$3) {
					const i$2 = e$3.protocol;
					return mt.call(xt, i$2) && xt[i$2](e$3, t$3, !0) || null;
				}(e$2, { parentURL: i$1.href });
				if ("module" !== a$1) return;
				const c$1 = (0, Qe.fileURLToPath)(e$2.href), l$1 = (0, Qe.fileURLToPath)(new URL(".", t$2)), y$1 = (0, Qe.fileURLToPath)(i$1);
				n$1 ? et.resolve(l$1, n$1) !== c$1 && Xe.emitWarning(`Package ${l$1} has a "main" field set to "${n$1}", excluding the full filename and extension to the resolved file at "${c$1.slice(l$1.length)}", imported from ${y$1}.\n Automatic extension resolution of the "main" field is deprecated for ES modules.`, "DeprecationWarning", "DEP0151") : Xe.emitWarning(`No "main" or "exports" field defined in the package.json for ${l$1} resolving the main entry point "${c$1.slice(l$1.length)}", imported from ${y$1}.\nDefault "index" lookups for the main are deprecated for ES modules.`, "DeprecationWarning", "DEP0151");
			}
			function tryStatSync(e$2) {
				try {
					return (0, $e.statSync)(e$2);
				} catch {}
			}
			function fileExists(e$2) {
				const t$2 = (0, $e.statSync)(e$2, { throwIfNoEntry: !1 }), i$1 = t$2 ? t$2.isFile() : void 0;
				return null != i$1 && i$1;
			}
			function legacyMainResolve(e$2, t$2, i$1) {
				let n$1;
				if (void 0 !== t$2.main) {
					if (n$1 = new URL(t$2.main, e$2), fileExists(n$1)) return n$1;
					const a$2 = [
						`./${t$2.main}.js`,
						`./${t$2.main}.json`,
						`./${t$2.main}.node`,
						`./${t$2.main}/index.js`,
						`./${t$2.main}/index.json`,
						`./${t$2.main}/index.node`
					];
					let c$2 = -1;
					for (; ++c$2 < a$2.length && (n$1 = new URL(a$2[c$2], e$2), !fileExists(n$1));) n$1 = void 0;
					if (n$1) return emitLegacyIndexDeprecation(n$1, e$2, i$1, t$2.main), n$1;
				}
				const a$1 = [
					"./index.js",
					"./index.json",
					"./index.node"
				];
				let c$1 = -1;
				for (; ++c$1 < a$1.length && (n$1 = new URL(a$1[c$1], e$2), !fileExists(n$1));) n$1 = void 0;
				if (n$1) return emitLegacyIndexDeprecation(n$1, e$2, i$1, t$2.main), n$1;
				throw new wt((0, Qe.fileURLToPath)(new URL(".", e$2)), (0, Qe.fileURLToPath)(i$1));
			}
			function exportsNotFound(e$2, t$2, i$1) {
				return new St((0, Qe.fileURLToPath)(new URL(".", t$2)), e$2, i$1 && (0, Qe.fileURLToPath)(i$1));
			}
			function invalidPackageTarget(e$2, t$2, i$1, n$1, a$1) {
				return t$2 = "object" == typeof t$2 && null !== t$2 ? JSON.stringify(t$2, null, "") : `${t$2}`, new kt((0, Qe.fileURLToPath)(new URL(".", i$1)), e$2, t$2, n$1, a$1 && (0, Qe.fileURLToPath)(a$1));
			}
			function resolvePackageTargetString(e$2, t$2, i$1, n$1, a$1, c$1, l$1, y$1, E$1) {
				if ("" !== t$2 && !c$1 && "/" !== e$2[e$2.length - 1]) throw invalidPackageTarget(i$1, e$2, n$1, l$1, a$1);
				if (!e$2.startsWith("./")) {
					if (l$1 && !e$2.startsWith("../") && !e$2.startsWith("/")) {
						let i$2 = !1;
						try {
							new URL(e$2), i$2 = !0;
						} catch {}
						if (!i$2) return packageResolve(c$1 ? _t.call(Nt, e$2, () => t$2) : e$2 + t$2, n$1, E$1);
					}
					throw invalidPackageTarget(i$1, e$2, n$1, l$1, a$1);
				}
				if (null !== At.exec(e$2.slice(2))) {
					if (null !== Pt.exec(e$2.slice(2))) throw invalidPackageTarget(i$1, e$2, n$1, l$1, a$1);
					if (!y$1) {
						const y$2 = c$1 ? i$1.replace("*", () => t$2) : i$1 + t$2;
						emitInvalidSegmentDeprecation(c$1 ? _t.call(Nt, e$2, () => t$2) : e$2, y$2, i$1, n$1, l$1, a$1, !0);
					}
				}
				const w$1 = new URL(e$2, n$1), C$1 = w$1.pathname, S$1 = new URL(".", n$1).pathname;
				if (!C$1.startsWith(S$1)) throw invalidPackageTarget(i$1, e$2, n$1, l$1, a$1);
				if ("" === t$2) return w$1;
				if (null !== At.exec(t$2)) {
					const E$2 = c$1 ? i$1.replace("*", () => t$2) : i$1 + t$2;
					if (null === Pt.exec(t$2)) {
						if (!y$1) emitInvalidSegmentDeprecation(c$1 ? _t.call(Nt, e$2, () => t$2) : e$2, E$2, i$1, n$1, l$1, a$1, !1);
					} else (function(e$3, t$3, i$2, n$2, a$2) {
						const c$2 = `request is not a valid match in pattern "${t$3}" for the "${n$2 ? "imports" : "exports"}" resolution of ${(0, Qe.fileURLToPath)(i$2)}`;
						throw new Et(e$3, c$2, a$2 && (0, Qe.fileURLToPath)(a$2));
					})(E$2, i$1, n$1, l$1, a$1);
				}
				return c$1 ? new URL(_t.call(Nt, w$1.href, () => t$2)) : new URL(t$2, w$1);
			}
			function isArrayIndex(e$2) {
				const t$2 = Number(e$2);
				return `${t$2}` === e$2 && t$2 >= 0 && t$2 < 4294967295;
			}
			function resolvePackageTarget(e$2, t$2, i$1, n$1, a$1, c$1, l$1, y$1, E$1) {
				if ("string" == typeof t$2) return resolvePackageTargetString(t$2, i$1, n$1, e$2, a$1, c$1, l$1, y$1, E$1);
				if (Array.isArray(t$2)) {
					const w$1 = t$2;
					if (0 === w$1.length) return null;
					let C$1, S$1 = -1;
					for (; ++S$1 < w$1.length;) {
						const t$3 = w$1[S$1];
						let I$1;
						try {
							I$1 = resolvePackageTarget(e$2, t$3, i$1, n$1, a$1, c$1, l$1, y$1, E$1);
						} catch (e$3) {
							if (C$1 = e$3, "ERR_INVALID_PACKAGE_TARGET" === e$3.code) continue;
							throw e$3;
						}
						if (void 0 !== I$1) {
							if (null !== I$1) return I$1;
							C$1 = null;
						}
					}
					if (null == C$1) return null;
					throw C$1;
				}
				if ("object" == typeof t$2 && null !== t$2) {
					const w$1 = Object.getOwnPropertyNames(t$2);
					let C$1 = -1;
					for (; ++C$1 < w$1.length;) if (isArrayIndex(w$1[C$1])) throw new bt((0, Qe.fileURLToPath)(e$2), a$1, "\"exports\" cannot contain numeric property keys.");
					for (C$1 = -1; ++C$1 < w$1.length;) {
						const S$1 = w$1[C$1];
						if ("default" === S$1 || E$1 && E$1.has(S$1)) {
							const w$2 = resolvePackageTarget(e$2, t$2[S$1], i$1, n$1, a$1, c$1, l$1, y$1, E$1);
							if (void 0 === w$2) continue;
							return w$2;
						}
					}
					return null;
				}
				if (null === t$2) return null;
				throw invalidPackageTarget(n$1, t$2, e$2, l$1, a$1);
			}
			function emitTrailingSlashPatternDeprecation(e$2, t$2, i$1) {
				if (Xe.noDeprecation) return;
				const n$1 = (0, Qe.fileURLToPath)(t$2);
				Dt.has(n$1 + "|" + e$2) || (Dt.add(n$1 + "|" + e$2), Xe.emitWarning(`Use of deprecated trailing slash pattern mapping "${e$2}" in the "exports" field module resolution of the package at ${n$1}${i$1 ? ` imported from ${(0, Qe.fileURLToPath)(i$1)}` : ""}. Mapping specifiers ending in "/" is no longer supported.`, "DeprecationWarning", "DEP0155"));
			}
			function packageExportsResolve(e$2, t$2, i$1, n$1, a$1) {
				let c$1 = i$1.exports;
				if (function(e$3, t$3, i$2) {
					if ("string" == typeof e$3 || Array.isArray(e$3)) return !0;
					if ("object" != typeof e$3 || null === e$3) return !1;
					const n$2 = Object.getOwnPropertyNames(e$3);
					let a$2 = !1, c$2 = 0, l$2 = -1;
					for (; ++l$2 < n$2.length;) {
						const e$4 = n$2[l$2], y$2 = "" === e$4 || "." !== e$4[0];
						if (0 === c$2++) a$2 = y$2;
						else if (a$2 !== y$2) throw new bt((0, Qe.fileURLToPath)(t$3), i$2, "\"exports\" cannot contain some keys starting with '.' and some not. The exports object must either be an object of package subpath keys or an object of main entry condition name keys only.");
					}
					return a$2;
				}(c$1, e$2, n$1) && (c$1 = { ".": c$1 }), Rt.call(c$1, t$2) && !t$2.includes("*") && !t$2.endsWith("/")) {
					const i$2 = resolvePackageTarget(e$2, c$1[t$2], "", t$2, n$1, !1, !1, !1, a$1);
					if (null == i$2) throw exportsNotFound(t$2, e$2, n$1);
					return i$2;
				}
				let l$1 = "", y$1 = "";
				const E$1 = Object.getOwnPropertyNames(c$1);
				let w$1 = -1;
				for (; ++w$1 < E$1.length;) {
					const i$2 = E$1[w$1], a$2 = i$2.indexOf("*");
					if (-1 !== a$2 && t$2.startsWith(i$2.slice(0, a$2))) {
						t$2.endsWith("/") && emitTrailingSlashPatternDeprecation(t$2, e$2, n$1);
						const c$2 = i$2.slice(a$2 + 1);
						t$2.length >= i$2.length && t$2.endsWith(c$2) && 1 === patternKeyCompare(l$1, i$2) && i$2.lastIndexOf("*") === a$2 && (l$1 = i$2, y$1 = t$2.slice(a$2, t$2.length - c$2.length));
					}
				}
				if (l$1) {
					const i$2 = resolvePackageTarget(e$2, c$1[l$1], y$1, l$1, n$1, !0, !1, t$2.endsWith("/"), a$1);
					if (null == i$2) throw exportsNotFound(t$2, e$2, n$1);
					return i$2;
				}
				throw exportsNotFound(t$2, e$2, n$1);
			}
			function patternKeyCompare(e$2, t$2) {
				const i$1 = e$2.indexOf("*"), n$1 = t$2.indexOf("*"), a$1 = -1 === i$1 ? e$2.length : i$1 + 1, c$1 = -1 === n$1 ? t$2.length : n$1 + 1;
				return a$1 > c$1 ? -1 : c$1 > a$1 || -1 === i$1 ? 1 : -1 === n$1 || e$2.length > t$2.length ? -1 : t$2.length > e$2.length ? 1 : 0;
			}
			function packageImportsResolve(e$2, t$2, i$1) {
				if ("#" === e$2 || e$2.startsWith("#/") || e$2.endsWith("/")) throw new Et(e$2, "is not a valid internal imports specifier name", (0, Qe.fileURLToPath)(t$2));
				let n$1;
				const a$1 = getPackageScopeConfig(t$2);
				if (a$1.exists) {
					n$1 = (0, Qe.pathToFileURL)(a$1.pjsonPath);
					const c$1 = a$1.imports;
					if (c$1) if (Rt.call(c$1, e$2) && !e$2.includes("*")) {
						const a$2 = resolvePackageTarget(n$1, c$1[e$2], "", e$2, t$2, !1, !0, !1, i$1);
						if (null != a$2) return a$2;
					} else {
						let a$2 = "", l$1 = "";
						const y$1 = Object.getOwnPropertyNames(c$1);
						let E$1 = -1;
						for (; ++E$1 < y$1.length;) {
							const t$3 = y$1[E$1], i$2 = t$3.indexOf("*");
							if (-1 !== i$2 && e$2.startsWith(t$3.slice(0, -1))) {
								const n$2 = t$3.slice(i$2 + 1);
								e$2.length >= t$3.length && e$2.endsWith(n$2) && 1 === patternKeyCompare(a$2, t$3) && t$3.lastIndexOf("*") === i$2 && (a$2 = t$3, l$1 = e$2.slice(i$2, e$2.length - n$2.length));
							}
						}
						if (a$2) {
							const e$3 = resolvePackageTarget(n$1, c$1[a$2], l$1, a$2, t$2, !0, !0, !1, i$1);
							if (null != e$3) return e$3;
						}
					}
				}
				throw function(e$3, t$3, i$2) {
					return new Ct(e$3, t$3 && (0, Qe.fileURLToPath)(new URL(".", t$3)), (0, Qe.fileURLToPath)(i$2));
				}(e$2, n$1, t$2);
			}
			function packageResolve(e$2, t$2, i$1) {
				if (Be.builtinModules.includes(e$2)) return new URL("node:" + e$2);
				const { packageName: n$1, packageSubpath: a$1, isScoped: c$1 } = function(e$3, t$3) {
					let i$2 = e$3.indexOf("/"), n$2 = !0, a$2 = !1;
					"@" === e$3[0] && (a$2 = !0, -1 === i$2 || 0 === e$3.length ? n$2 = !1 : i$2 = e$3.indexOf("/", i$2 + 1));
					const c$2 = -1 === i$2 ? e$3 : e$3.slice(0, i$2);
					if (null !== Lt.exec(c$2) && (n$2 = !1), !n$2) throw new Et(e$3, "is not a valid package name", (0, Qe.fileURLToPath)(t$3));
					return {
						packageName: c$2,
						packageSubpath: "." + (-1 === i$2 ? "" : e$3.slice(i$2)),
						isScoped: a$2
					};
				}(e$2, t$2), l$1 = getPackageScopeConfig(t$2);
				if (l$1.exists) {
					const e$3 = (0, Qe.pathToFileURL)(l$1.pjsonPath);
					if (l$1.name === n$1 && void 0 !== l$1.exports && null !== l$1.exports) return packageExportsResolve(e$3, a$1, l$1, t$2, i$1);
				}
				let y$1, E$1 = new URL("./node_modules/" + n$1 + "/package.json", t$2), w$1 = (0, Qe.fileURLToPath)(E$1);
				do {
					const l$2 = tryStatSync(w$1.slice(0, -13));
					if (!l$2 || !l$2.isDirectory()) {
						y$1 = w$1, E$1 = new URL((c$1 ? "../../../../node_modules/" : "../../../node_modules/") + n$1 + "/package.json", E$1), w$1 = (0, Qe.fileURLToPath)(E$1);
						continue;
					}
					const C$1 = read(w$1, {
						base: t$2,
						specifier: e$2
					});
					return void 0 !== C$1.exports && null !== C$1.exports ? packageExportsResolve(E$1, a$1, C$1, t$2, i$1) : "." === a$1 ? legacyMainResolve(E$1, C$1, t$2) : new URL(a$1, E$1);
				} while (w$1.length !== y$1.length);
			}
			function moduleResolve(e$2, t$2, i$1, n$1) {
				void 0 === i$1 && (i$1 = getConditionsSet());
				const a$1 = t$2.protocol, c$1 = "data:" === a$1 || "http:" === a$1 || "https:" === a$1;
				let l$1;
				if (function(e$3) {
					return "" !== e$3 && ("/" === e$3[0] || function(e$4) {
						if ("." === e$4[0]) {
							if (1 === e$4.length || "/" === e$4[1]) return !0;
							if ("." === e$4[1] && (2 === e$4.length || "/" === e$4[2])) return !0;
						}
						return !1;
					}(e$3));
				}(e$2)) try {
					l$1 = new URL(e$2, t$2);
				} catch (i$2) {
					const n$2 = new Tt(e$2, t$2);
					throw n$2.cause = i$2, n$2;
				}
				else if ("file:" === a$1 && "#" === e$2[0]) l$1 = packageImportsResolve(e$2, t$2, i$1);
				else try {
					l$1 = new URL(e$2);
				} catch (n$2) {
					if (c$1 && !Be.builtinModules.includes(e$2)) {
						const i$2 = new Tt(e$2, t$2);
						throw i$2.cause = n$2, i$2;
					}
					l$1 = packageResolve(e$2, t$2, i$1);
				}
				return Ze.ok(void 0 !== l$1, "expected to be defined"), "file:" !== l$1.protocol ? l$1 : function(e$3, t$3) {
					if (null !== Ot.exec(e$3.pathname)) throw new Et(e$3.pathname, "must not include encoded \"/\" or \"\\\" characters", (0, Qe.fileURLToPath)(t$3));
					let i$2;
					try {
						i$2 = (0, Qe.fileURLToPath)(e$3);
					} catch (i$3) {
						const n$3 = i$3;
						throw Object.defineProperty(n$3, "input", { value: String(e$3) }), Object.defineProperty(n$3, "module", { value: String(t$3) }), n$3;
					}
					const n$2 = tryStatSync(i$2.endsWith("/") ? i$2.slice(-1) : i$2);
					if (n$2 && n$2.isDirectory()) {
						const n$3 = new It(i$2, (0, Qe.fileURLToPath)(t$3));
						throw n$3.url = String(e$3), n$3;
					}
					if (!n$2 || !n$2.isFile()) {
						const n$3 = new wt(i$2 || e$3.pathname, t$3 && (0, Qe.fileURLToPath)(t$3), !0);
						throw n$3.url = String(e$3), n$3;
					}
					{
						const t$4 = (0, $e.realpathSync)(i$2), { search: n$3, hash: a$2 } = e$3;
						(e$3 = (0, Qe.pathToFileURL)(t$4 + (i$2.endsWith(et.sep) ? "/" : ""))).search = n$3, e$3.hash = a$2;
					}
					return e$3;
				}(l$1, t$2);
			}
			function fileURLToPath(e$2) {
				return "string" != typeof e$2 || e$2.startsWith("file://") ? normalizeSlash((0, Qe.fileURLToPath)(e$2)) : normalizeSlash(e$2);
			}
			function pathToFileURL(e$2) {
				return (0, Qe.pathToFileURL)(fileURLToPath(e$2)).toString();
			}
			const Ut = new Set(["node", "import"]), Mt = [
				".mjs",
				".cjs",
				".js",
				".json"
			], jt = new Set([
				"ERR_MODULE_NOT_FOUND",
				"ERR_UNSUPPORTED_DIR_IMPORT",
				"MODULE_NOT_FOUND",
				"ERR_PACKAGE_PATH_NOT_EXPORTED"
			]);
			function _tryModuleResolve(e$2, t$2, i$1) {
				try {
					return moduleResolve(e$2, t$2, i$1);
				} catch (e$3) {
					if (!jt.has(e$3?.code)) throw e$3;
				}
			}
			function _resolve(e$2, t$2 = {}) {
				if ("string" != typeof e$2) {
					if (!(e$2 instanceof URL)) throw new TypeError("input must be a `string` or `URL`");
					e$2 = fileURLToPath(e$2);
				}
				if (/(?:node|data|http|https):/.test(e$2)) return e$2;
				if (st.has(e$2)) return "node:" + e$2;
				if (e$2.startsWith("file://") && (e$2 = fileURLToPath(e$2)), isAbsolute(e$2)) try {
					if ((0, $e.statSync)(e$2).isFile()) return pathToFileURL(e$2);
				} catch (e$3) {
					if ("ENOENT" !== e$3?.code) throw e$3;
				}
				const i$1 = t$2.conditions ? new Set(t$2.conditions) : Ut, n$1 = (Array.isArray(t$2.url) ? t$2.url : [t$2.url]).filter(Boolean).map((e$3) => new URL(function(e$4) {
					return "string" != typeof e$4 && (e$4 = e$4.toString()), /(?:node|data|http|https|file):/.test(e$4) ? e$4 : st.has(e$4) ? "node:" + e$4 : "file://" + encodeURI(normalizeSlash(e$4));
				}(e$3.toString())));
				0 === n$1.length && n$1.push(new URL(pathToFileURL(process.cwd())));
				const a$1 = [...n$1];
				for (const e$3 of n$1) "file:" === e$3.protocol && a$1.push(new URL("./", e$3), new URL(dist_joinURL(e$3.pathname, "_index.js"), e$3), new URL("node_modules", e$3));
				let c$1;
				for (const n$2 of a$1) {
					if (c$1 = _tryModuleResolve(e$2, n$2, i$1), c$1) break;
					for (const a$2 of ["", "/index"]) {
						for (const l$1 of t$2.extensions || Mt) if (c$1 = _tryModuleResolve(dist_joinURL(e$2, a$2) + l$1, n$2, i$1), c$1) break;
						if (c$1) break;
					}
					if (c$1) break;
				}
				if (!c$1) {
					const t$3 = new Error(`Cannot find module ${e$2} imported from ${a$1.join(", ")}`);
					throw t$3.code = "ERR_MODULE_NOT_FOUND", t$3;
				}
				return pathToFileURL(c$1);
			}
			function resolveSync(e$2, t$2) {
				return _resolve(e$2, t$2);
			}
			function resolvePathSync(e$2, t$2) {
				return fileURLToPath(resolveSync(e$2, t$2));
			}
			const Ft = /(?:[\s;]|^)(?:import[\s\w*,{}]*from|import\s*["'*{]|export\b\s*(?:[*{]|default|class|type|function|const|var|let|async function)|import\.meta\b)/m, Bt = /\/\*.+?\*\/|\/\/.*(?=[nr])/g;
			function hasESMSyntax(e$2, t$2 = {}) {
				return t$2.stripComments && (e$2 = e$2.replace(Bt, "")), Ft.test(e$2);
			}
			function escapeStringRegexp(e$2) {
				if ("string" != typeof e$2) throw new TypeError("Expected a string");
				return e$2.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
			}
			const $t = new Set([
				"/",
				"\\",
				void 0
			]), qt = Symbol.for("pathe:normalizedAlias"), Wt = /[/\\]/;
			function normalizeAliases(e$2) {
				if (e$2[qt]) return e$2;
				const t$2 = Object.fromEntries(Object.entries(e$2).sort(([e$3], [t$3]) => function(e$4, t$4) {
					return t$4.split("/").length - e$4.split("/").length;
				}(e$3, t$3)));
				for (const e$3 in t$2) for (const i$1 in t$2) i$1 === e$3 || e$3.startsWith(i$1) || t$2[e$3]?.startsWith(i$1) && $t.has(t$2[e$3][i$1.length]) && (t$2[e$3] = t$2[i$1] + t$2[e$3].slice(i$1.length));
				return Object.defineProperty(t$2, qt, {
					value: !0,
					enumerable: !1
				}), t$2;
			}
			function utils_hasTrailingSlash(e$2 = "/") {
				const t$2 = e$2[e$2.length - 1];
				return "/" === t$2 || "\\" === t$2;
			}
			var Gt = { rE: "2.6.1" };
			const Kt = __require("node:crypto");
			var Ht = __webpack_require__.n(Kt);
			const zt = globalThis.process?.env || Object.create(null), Jt = globalThis.process || { env: zt }, Yt = void 0 !== Jt && Jt.env && Jt.env.NODE_ENV || void 0, Qt = [
				["claude", ["CLAUDECODE", "CLAUDE_CODE"]],
				["replit", ["REPL_ID"]],
				["gemini", ["GEMINI_CLI"]],
				["codex", ["CODEX_SANDBOX", "CODEX_THREAD_ID"]],
				["opencode", ["OPENCODE"]],
				["pi", [dist_i("PATH", /\.pi[\\/]agent/)]],
				["auggie", ["AUGMENT_AGENT"]],
				["goose", ["GOOSE_PROVIDER"]],
				["devin", [dist_i("EDITOR", /devin/)]],
				["cursor", ["CURSOR_AGENT"]],
				["kiro", [dist_i("TERM_PROGRAM", /kiro/)]]
			];
			function dist_i(e$2, t$2) {
				return () => {
					let i$1 = zt[e$2];
					return !!i$1 && t$2.test(i$1);
				};
			}
			const Zt = function() {
				let e$2 = zt.AI_AGENT;
				if (e$2) return { name: e$2.toLowerCase() };
				for (let [e$3, t$2] of Qt) for (let i$1 of t$2) if ("string" == typeof i$1 ? zt[i$1] : i$1()) return { name: e$3 };
				return {};
			}(), Xt = (Zt.name, Zt.name, [
				["APPVEYOR"],
				[
					"AWS_AMPLIFY",
					"AWS_APP_ID",
					{ ci: !0 }
				],
				["AZURE_PIPELINES", "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"],
				["AZURE_STATIC", "INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN"],
				["APPCIRCLE", "AC_APPCIRCLE"],
				["BAMBOO", "bamboo_planKey"],
				["BITBUCKET", "BITBUCKET_COMMIT"],
				["BITRISE", "BITRISE_IO"],
				["BUDDY", "BUDDY_WORKSPACE_ID"],
				["BUILDKITE"],
				["CIRCLE", "CIRCLECI"],
				["CIRRUS", "CIRRUS_CI"],
				[
					"CLOUDFLARE_PAGES",
					"CF_PAGES",
					{ ci: !0 }
				],
				[
					"CLOUDFLARE_WORKERS",
					"WORKERS_CI",
					{ ci: !0 }
				],
				["GOOGLE_CLOUDRUN", "K_SERVICE"],
				["GOOGLE_CLOUDRUN_JOB", "CLOUD_RUN_JOB"],
				["CODEBUILD", "CODEBUILD_BUILD_ARN"],
				["CODEFRESH", "CF_BUILD_ID"],
				["DRONE"],
				["DRONE", "DRONE_BUILD_EVENT"],
				["DSARI"],
				["GITHUB_ACTIONS"],
				["GITLAB", "GITLAB_CI"],
				["GITLAB", "CI_MERGE_REQUEST_ID"],
				["GOCD", "GO_PIPELINE_LABEL"],
				["LAYERCI"],
				["JENKINS", "JENKINS_URL"],
				["HUDSON", "HUDSON_URL"],
				["MAGNUM"],
				["NETLIFY"],
				[
					"NETLIFY",
					"NETLIFY_LOCAL",
					{ ci: !1 }
				],
				["NEVERCODE"],
				["RENDER"],
				["SAIL", "SAILCI"],
				["SEMAPHORE"],
				["SCREWDRIVER"],
				["SHIPPABLE"],
				["SOLANO", "TDDIUM"],
				["STRIDER"],
				["TEAMCITY", "TEAMCITY_VERSION"],
				["TRAVIS"],
				["VERCEL", "NOW_BUILDER"],
				[
					"VERCEL",
					"VERCEL",
					{ ci: !1 }
				],
				[
					"VERCEL",
					"VERCEL_ENV",
					{ ci: !1 }
				],
				["APPCENTER", "APPCENTER_BUILD_ID"],
				[
					"CODESANDBOX",
					"CODESANDBOX_SSE",
					{ ci: !1 }
				],
				[
					"CODESANDBOX",
					"CODESANDBOX_HOST",
					{ ci: !1 }
				],
				["STACKBLITZ"],
				["STORMKIT"],
				["CLEAVR"],
				["ZEABUR"],
				[
					"CODESPHERE",
					"CODESPHERE_APP_ID",
					{ ci: !0 }
				],
				["RAILWAY", "RAILWAY_PROJECT_ID"],
				["RAILWAY", "RAILWAY_SERVICE_ID"],
				["DENO-DEPLOY", "DENO_DEPLOY"],
				["DENO-DEPLOY", "DENO_DEPLOYMENT_ID"],
				[
					"FIREBASE_APP_HOSTING",
					"FIREBASE_APP_HOSTING",
					{ ci: !0 }
				],
				[
					"EDGEONE_PAGES",
					"EO_PAGES_CI",
					{ ci: !0 }
				]
			]);
			const ei = function() {
				for (let e$2 of Xt) if (zt[e$2[1] || e$2[0]]) return {
					name: e$2[0].toLowerCase(),
					...e$2[2]
				};
				return "/bin/jsh" === zt.SHELL && Jt.versions?.webcontainer ? {
					name: "stackblitz",
					ci: !1
				} : {
					name: "",
					ci: !1
				};
			}(), ti = (ei.name, Jt.platform || ""), ii = !!zt.CI || !1 !== ei.ci, si = !!Jt.stdout?.isTTY, ri = (zt.DEBUG, "test" === Yt || !!zt.TEST), ni = ("production" === Yt || zt.MODE, "dev" === Yt || "development" === Yt || zt.MODE, zt.MINIMAL, /^win/i.test(ti)), ai = (/^linux/i.test(ti), /^darwin/i.test(ti), !zt.NO_COLOR && (zt.FORCE_COLOR || (si || ni) && zt.TERM), (Jt.versions?.node || "").replace(/^v/, "") || null), oi = (Number(ai?.split(".")[0]), !!Jt?.versions?.node), ci = "Bun" in globalThis, hi = "Deno" in globalThis, li = "fastly" in globalThis, pi = [
				["Netlify" in globalThis, "netlify"],
				["EdgeRuntime" in globalThis, "edge-light"],
				["Cloudflare-Workers" === globalThis.navigator?.userAgent, "workerd"],
				[li, "fastly"],
				[hi, "deno"],
				[ci, "bun"],
				[oi, "node"]
			];
			(function() {
				let e$2 = pi.find((e$3) => e$3[0]);
				if (e$2) e$2[1];
			})();
			const ui = __require("node:tty"), di = ui?.WriteStream?.prototype?.hasColors?.() ?? !1, base_format = (e$2, t$2) => {
				if (!di) return (e$3) => e$3;
				const i$1 = `[${e$2}m`, n$1 = `[${t$2}m`;
				return (e$3) => {
					const a$1 = e$3 + "";
					let c$1 = a$1.indexOf(n$1);
					if (-1 === c$1) return i$1 + a$1 + n$1;
					let l$1 = i$1, y$1 = 0;
					const E$1 = (22 === t$2 ? n$1 : "") + i$1;
					for (; -1 !== c$1;) l$1 += a$1.slice(y$1, c$1) + E$1, y$1 = c$1 + n$1.length, c$1 = a$1.indexOf(n$1, y$1);
					return l$1 += a$1.slice(y$1) + n$1, l$1;
				};
			}, fi = (base_format(0, 0), base_format(1, 22), base_format(2, 22), base_format(3, 23), base_format(4, 24), base_format(53, 55), base_format(7, 27), base_format(8, 28), base_format(9, 29), base_format(30, 39), base_format(31, 39)), mi = base_format(32, 39), gi = base_format(33, 39), xi = base_format(34, 39), vi = (base_format(35, 39), base_format(36, 39)), yi = (base_format(37, 39), base_format(90, 39));
			base_format(40, 49), base_format(41, 49), base_format(42, 49), base_format(43, 49), base_format(44, 49), base_format(45, 49), base_format(46, 49), base_format(47, 49), base_format(100, 49), base_format(91, 39), base_format(92, 39), base_format(93, 39), base_format(94, 39), base_format(95, 39), base_format(96, 39), base_format(97, 39), base_format(101, 49), base_format(102, 49), base_format(103, 49), base_format(104, 49), base_format(105, 49), base_format(106, 49), base_format(107, 49);
			function isDir(e$2) {
				if ("string" != typeof e$2 || e$2.startsWith("file://")) return !1;
				try {
					return (0, $e.lstatSync)(e$2).isDirectory();
				} catch {
					return !1;
				}
			}
			function utils_hash(e$2, t$2 = 8) {
				return (function() {
					if (void 0 !== Ei) return Ei;
					try {
						return Ei = !!Ht().getFips?.(), Ei;
					} catch {
						return Ei = !1, Ei;
					}
				}() ? Ht().createHash("sha256") : Ht().createHash("md5")).update(e$2).digest("hex").slice(0, t$2);
			}
			const _i = {
				true: mi("true"),
				false: gi("false"),
				"[rebuild]": gi("[rebuild]"),
				"[esm]": xi("[esm]"),
				"[cjs]": mi("[cjs]"),
				"[import]": xi("[import]"),
				"[require]": mi("[require]"),
				"[native]": vi("[native]"),
				"[transpile]": gi("[transpile]"),
				"[fallback]": fi("[fallback]"),
				"[unknown]": fi("[unknown]"),
				"[hit]": mi("[hit]"),
				"[miss]": gi("[miss]"),
				"[json]": mi("[json]"),
				"[data]": mi("[data]")
			};
			function debug(e$2, ...t$2) {
				if (!e$2.opts.debug) return;
				const i$1 = process.cwd();
				console.log(yi(["[jiti]", ...t$2.map((e$3) => e$3 in _i ? _i[e$3] : "string" != typeof e$3 ? JSON.stringify(e$3) : e$3.replace(i$1, "."))].join(" ")));
			}
			function jitiInteropDefault(e$2, t$2) {
				return e$2.opts.interopDefault ? function(e$3) {
					const t$3 = typeof e$3;
					if (null === e$3 || "object" !== t$3 && "function" !== t$3) return e$3;
					const i$1 = e$3.default, n$1 = typeof i$1, a$1 = null == i$1, c$1 = "object" === n$1 || "function" === n$1;
					if (a$1 && e$3 instanceof Promise) return e$3;
					const l$1 = "function" === n$1 && "function" !== t$3, y$1 = c$1 && !(i$1 instanceof Promise), E$1 = new Map();
					return new Proxy(e$3, {
						get(t$4, n$2) {
							if (E$1.has(n$2)) return E$1.get(n$2);
							let c$2;
							return "__esModule" === n$2 ? c$2 = !0 : "default" === n$2 ? c$2 = a$1 ? e$3 : "function" == typeof i$1?.default && e$3.__esModule ? i$1.default : i$1 : n$2 in t$4 ? c$2 = t$4[n$2] : y$1 && (c$2 = i$1[n$2], "function" == typeof c$2 && (c$2 = c$2.bind(i$1))), E$1.set(n$2, c$2), c$2;
						},
						apply: l$1 ? (e$4, t$4, n$2) => Reflect.apply(i$1, t$4, n$2) : void 0
					});
				}(t$2) : t$2;
			}
			let Ei;
			function _booleanEnv(e$2, t$2) {
				const i$1 = _jsonEnv(e$2, t$2);
				return Boolean(i$1);
			}
			function _jsonEnv(e$2, t$2, i$1) {
				const n$1 = process.env[e$2];
				if (!(e$2 in process.env)) return t$2;
				try {
					return JSON.parse(n$1);
				} catch {
					return i$1 ? n$1 : t$2;
				}
			}
			const bi = /\.(c|m)?j(sx?)$/, ki = /\.(c|m)?t(sx?)$/;
			function jitiResolve(e$2, t$2, i$1) {
				let n$1, a$1;
				if (e$2.isNativeRe.test(t$2)) return t$2;
				if (e$2.resolveTsConfigPaths && !i$1.skipTsConfigPaths) {
					const n$2 = e$2.resolveTsConfigPaths(t$2);
					for (const t$3 of n$2) {
						const n$3 = jitiResolve(e$2, t$3, {
							...i$1,
							try: !0,
							skipTsConfigPaths: !0
						});
						if (n$3) return n$3;
					}
				}
				e$2.alias && (t$2 = function(e$3, t$3) {
					const i$2 = pathe_M_eThtNZ_normalizeWindowsPath(e$3);
					t$3 = normalizeAliases(t$3);
					for (const [e$4, n$2] of Object.entries(t$3)) {
						if (!i$2.startsWith(e$4)) continue;
						const t$4 = utils_hasTrailingSlash(e$4) ? e$4.slice(0, -1) : e$4;
						if (utils_hasTrailingSlash(i$2[t$4.length])) return pathe_M_eThtNZ_join(n$2, i$2.slice(e$4.length));
					}
					return i$2;
				}(t$2, e$2.alias));
				let c$1 = i$1?.parentURL || e$2.url;
				isDir(c$1) && (c$1 = pathe_M_eThtNZ_join(c$1, "_index.js"));
				const l$1 = (i$1?.async ? [
					i$1?.conditions,
					["node", "import"],
					["node", "require"]
				] : [
					i$1?.conditions,
					["node", "require"],
					["node", "import"]
				]).filter(Boolean);
				for (const i$2 of l$1) {
					try {
						n$1 = resolvePathSync(t$2, {
							url: c$1,
							conditions: i$2,
							extensions: e$2.opts.extensions
						});
					} catch (e$3) {
						a$1 = e$3;
					}
					if (n$1) return n$1;
				}
				try {
					return e$2.nativeRequire.resolve(t$2, { paths: i$1.paths });
				} catch (e$3) {
					a$1 = e$3;
				}
				for (const a$2 of e$2.additionalExts) {
					if (n$1 = tryNativeRequireResolve(e$2, t$2 + a$2, c$1, i$1) || tryNativeRequireResolve(e$2, t$2 + "/index" + a$2, c$1, i$1), n$1) return n$1;
					if ((ki.test(e$2.filename) || ki.test(e$2.parentModule?.filename || "") || bi.test(t$2)) && (n$1 = tryNativeRequireResolve(e$2, t$2.replace(bi, ".$1t$2"), c$1, i$1), n$1)) return n$1;
				}
				if (!i$1?.try) throw a$1;
			}
			function tryNativeRequireResolve(e$2, t$2, i$1, n$1) {
				try {
					return e$2.nativeRequire.resolve(t$2, {
						...n$1,
						paths: [pathe_M_eThtNZ_dirname(fileURLToPath(i$1)), ...n$1?.paths || []]
					});
				} catch {}
			}
			const wi = __require("node:fs/promises"), Ci = __require("node:perf_hooks"), Si = __require("node:vm");
			var Ii = __webpack_require__.n(Si);
			function jitiRequire(e$2, t$2, i$1) {
				const n$1 = e$2.parentCache || {};
				if (t$2.startsWith("node:")) return nativeImportOrRequire(e$2, t$2, i$1.async);
				if (t$2.startsWith("file:")) t$2 = (0, Qe.fileURLToPath)(t$2);
				else if (t$2.startsWith("data:")) {
					if (!i$1.async) throw new Error("`data:` URLs are only supported in ESM context. Use `import` or `jiti.import` instead.");
					return debug(e$2, "[native]", "[data]", "[import]", t$2), nativeImportOrRequire(e$2, t$2, !0);
				}
				if (Be.builtinModules.includes(t$2) || ".pnp.js" === t$2) return nativeImportOrRequire(e$2, t$2, i$1.async);
				if (e$2.opts.virtualModules && t$2 in e$2.opts.virtualModules) {
					debug(e$2, "[virtual]", t$2);
					const n$2 = e$2.opts.virtualModules[t$2];
					return i$1.async ? Promise.resolve(jitiInteropDefault(e$2, n$2)) : jitiInteropDefault(e$2, n$2);
				}
				if (e$2.opts.tryNative && !e$2.opts.transformOptions) try {
					if (!(t$2 = jitiResolve(e$2, t$2, i$1)) && i$1.try) return;
					if (debug(e$2, "[try-native]", i$1.async && e$2.nativeImport ? "[import]" : "[require]", t$2), i$1.async && e$2.nativeImport) return e$2.nativeImport(t$2).then((i$2) => (!1 === e$2.opts.moduleCache && delete e$2.nativeRequire.cache[t$2], jitiInteropDefault(e$2, i$2))).catch((n$2) => (debug(e$2, `[try-native] Using fallback for ${t$2} because of an error:`, n$2), jitiRequire({
						...e$2,
						opts: {
							...e$2.opts,
							tryNative: !1
						}
					}, t$2, i$1)));
					{
						const i$2 = e$2.nativeRequire(t$2);
						return !1 === e$2.opts.moduleCache && delete e$2.nativeRequire.cache[t$2], jitiInteropDefault(e$2, i$2);
					}
				} catch (i$2) {
					debug(e$2, `[try-native] Using fallback for ${t$2} because of an error:`, i$2);
				}
				const a$1 = jitiResolve(e$2, t$2, i$1);
				if (!a$1 && i$1.try) return;
				const c$1 = extname(a$1);
				if (".json" === c$1) {
					debug(e$2, "[json]", a$1);
					const t$3 = e$2.nativeRequire(a$1);
					return t$3 && !("default" in t$3) && Object.defineProperty(t$3, "default", {
						value: t$3,
						enumerable: !1
					}), t$3;
				}
				if (c$1 && !e$2.opts.extensions.includes(c$1)) return debug(e$2, "[native]", "[unknown]", i$1.async ? "[import]" : "[require]", a$1), nativeImportOrRequire(e$2, a$1, i$1.async);
				if (e$2.isNativeRe.test(a$1)) return debug(e$2, "[native]", i$1.async ? "[import]" : "[require]", a$1), nativeImportOrRequire(e$2, a$1, i$1.async);
				if (n$1[a$1]) return jitiInteropDefault(e$2, n$1[a$1]?.exports);
				if (e$2.opts.moduleCache) {
					const t$3 = e$2.nativeRequire.cache[a$1];
					if (t$3?.loaded) return jitiInteropDefault(e$2, t$3.exports);
				}
				const l$1 = (0, $e.readFileSync)(a$1, "utf8");
				return eval_evalModule(e$2, l$1, {
					id: t$2,
					filename: a$1,
					ext: c$1,
					cache: n$1,
					async: i$1.async
				});
			}
			function nativeImportOrRequire(e$2, t$2, i$1) {
				return i$1 && e$2.nativeImport ? e$2.nativeImport(function(e$3) {
					return ni && isAbsolute(e$3) ? pathToFileURL(e$3) : e$3;
				}(t$2)).then((t$3) => jitiInteropDefault(e$2, t$3)) : jitiInteropDefault(e$2, e$2.nativeRequire(t$2));
			}
			const Ti = "9";
			function getCache(e$2, t$2, i$1) {
				if (!e$2.opts.fsCache || !t$2.filename) return i$1();
				const n$1 = ` /* v${Ti}-${utils_hash(t$2.source, 16)} */\n`;
				let a$1 = `${basename(pathe_M_eThtNZ_dirname(t$2.filename))}-${function(e$3) {
					const t$3 = e$3.split(Wt).pop();
					if (!t$3) return;
					const i$2 = t$3.lastIndexOf(".");
					return i$2 <= 0 ? t$3 : t$3.slice(0, i$2);
				}(t$2.filename)}` + (e$2.opts.sourceMaps ? "+map" : "") + (t$2.interopDefault ? ".i" : "") + `.${utils_hash(t$2.filename)}` + (t$2.async ? ".mjs" : ".cjs");
				t$2.jsx && t$2.filename.endsWith("x") && (a$1 += "x");
				const c$1 = e$2.opts.fsCache, l$1 = pathe_M_eThtNZ_join(c$1, a$1);
				if (!e$2.opts.rebuildFsCache && (0, $e.existsSync)(l$1)) {
					const i$2 = (0, $e.readFileSync)(l$1, "utf8");
					if (i$2.endsWith(n$1)) return debug(e$2, "[cache]", "[hit]", t$2.filename, "~>", l$1), i$2;
				}
				debug(e$2, "[cache]", "[miss]", t$2.filename);
				const y$1 = i$1();
				return y$1.includes("__JITI_ERROR__") || ((0, $e.writeFileSync)(l$1, y$1 + n$1, "utf8"), debug(e$2, "[cache]", "[store]", t$2.filename, "~>", l$1)), y$1;
			}
			function prepareCacheDir(t$2) {
				if (!0 === t$2.opts.fsCache && (t$2.opts.fsCache = function(t$3) {
					const i$1 = t$3.filename && pathe_M_eThtNZ_resolve(t$3.filename, "../node_modules");
					if (i$1 && (0, $e.existsSync)(i$1)) return pathe_M_eThtNZ_join(i$1, ".cache/jiti");
					let n$1 = (0, e$1.tmpdir)();
					if (process.env.TMPDIR && n$1 === process.cwd() && !process.env.JITI_RESPECT_TMPDIR_ENV) {
						const t$4 = process.env.TMPDIR;
						delete process.env.TMPDIR, n$1 = (0, e$1.tmpdir)(), process.env.TMPDIR = t$4;
					}
					return pathe_M_eThtNZ_join(n$1, "jiti");
				}(t$2)), t$2.opts.fsCache) try {
					if ((0, $e.mkdirSync)(t$2.opts.fsCache, { recursive: !0 }), !function(e$2) {
						try {
							return (0, $e.accessSync)(e$2, $e.constants.W_OK), !0;
						} catch {
							return !1;
						}
					}(t$2.opts.fsCache)) throw new Error("directory is not writable!");
				} catch (e$2) {
					debug(t$2, "Error creating cache directory at ", t$2.opts.fsCache, e$2), t$2.opts.fsCache = !1;
				}
			}
			function transform(e$2, t$2) {
				let i$1 = getCache(e$2, t$2, () => {
					const i$2 = e$2.opts.transform({
						...e$2.opts.transformOptions,
						babel: {
							...e$2.opts.sourceMaps ? {
								sourceFileName: t$2.filename,
								sourceMaps: "inline"
							} : {},
							...e$2.opts.transformOptions?.babel
						},
						interopDefault: e$2.opts.interopDefault,
						...t$2
					});
					return i$2.error && e$2.opts.debug && debug(e$2, i$2.error), i$2.code;
				});
				return i$1.startsWith("#!") && (i$1 = "// " + i$1), i$1;
			}
			function eval_evalModule(t$2, i$1, n$1 = {}) {
				const a$1 = n$1.id || (n$1.filename ? basename(n$1.filename) : `_jitiEval.${n$1.ext || (n$1.async ? "mjs" : "js")}`), c$1 = n$1.filename || jitiResolve(t$2, a$1, { async: n$1.async }), l$1 = n$1.ext || extname(c$1), y$1 = n$1.cache || t$2.parentCache || {}, E$1 = /\.[cm]?tsx?$/.test(l$1), w$1 = ".mjs" === l$1 || ".js" === l$1 && "module" === function(e$2) {
					for (; e$2 && "." !== e$2 && "/" !== e$2;) {
						e$2 = pathe_M_eThtNZ_join(e$2, "..");
						try {
							const t$3 = (0, $e.readFileSync)(pathe_M_eThtNZ_join(e$2, "package.json"), "utf8");
							try {
								return JSON.parse(t$3);
							} catch {}
							break;
						} catch {}
					}
				}(c$1)?.type, C$1 = ".cjs" === l$1, S$1 = n$1.forceTranspile ?? (!C$1 && !(w$1 && n$1.async) && (E$1 || w$1 || t$2.isTransformRe.test(c$1) || hasESMSyntax(i$1))), I$1 = Ci.performance.now();
				if (S$1) {
					i$1 = transform(t$2, {
						filename: c$1,
						source: i$1,
						ts: E$1,
						async: n$1.async ?? !1,
						jsx: t$2.opts.jsx
					});
					const e$2 = Math.round(1e3 * (Ci.performance.now() - I$1)) / 1e3;
					debug(t$2, "[transpile]", n$1.async ? "[esm]" : "[cjs]", c$1, `(${e$2}ms)`);
				} else {
					if (debug(t$2, "[native]", n$1.async ? "[import]" : "[require]", c$1), n$1.async) return Promise.resolve(nativeImportOrRequire(t$2, c$1, n$1.async)).catch((e$2) => (debug(t$2, "Native import error:", e$2), debug(t$2, "[fallback]", c$1), eval_evalModule(t$2, i$1, {
						...n$1,
						forceTranspile: !0
					})));
					try {
						return nativeImportOrRequire(t$2, c$1, n$1.async);
					} catch (e$2) {
						debug(t$2, "Native require error:", e$2), debug(t$2, "[fallback]", c$1), i$1 = transform(t$2, {
							filename: c$1,
							source: i$1,
							ts: E$1,
							async: n$1.async ?? !1,
							jsx: t$2.opts.jsx
						});
					}
				}
				const N$1 = new Be.Module(c$1);
				N$1.filename = c$1, t$2.parentModule && (N$1.parent = t$2.parentModule, Array.isArray(t$2.parentModule.children) && !t$2.parentModule.children.includes(N$1) && t$2.parentModule.children.push(N$1));
				const O$1 = createJiti$1(c$1, t$2.opts, {
					parentModule: N$1,
					parentCache: y$1,
					nativeImport: t$2.nativeImport,
					onError: t$2.onError,
					createRequire: t$2.createRequire
				}, !0);
				let j$1;
				N$1.require = O$1, N$1.path = pathe_M_eThtNZ_dirname(c$1), N$1.paths = Be.Module._nodeModulePaths(N$1.path), y$1[c$1] = N$1, t$2.opts.moduleCache && (t$2.nativeRequire.cache[c$1] = N$1);
				const F$1 = function(e$2, t$3) {
					return `(${t$3?.async ? "async " : ""}function (exports, require, module, __filename, __dirname, jitiImport, jitiESMResolve) { ${e$2}\n});`;
				}(i$1, { async: n$1.async });
				try {
					j$1 = Ii().runInThisContext(F$1, {
						filename: c$1,
						lineOffset: 0,
						displayErrors: !1
					});
				} catch (i$2) {
					"SyntaxError" === i$2.name && n$1.async && t$2.nativeImport ? (debug(t$2, "[esm]", "[import]", "[fallback]", c$1), j$1 = function(t$3, i$3, n$2, a$2, c$2) {
						const l$2 = `export default ${i$3}`, y$2 = c$2 ? void 0 : `data:text/javascript;base64,${Buffer.from(l$2).toString("base64")}`;
						return (...i$4) => {
							let c$3;
							const importViaTempFile = () => (c$3 = function(t$4, i$5) {
								const n$3 = pathe_M_eThtNZ_join((0, e$1.tmpdir)(), "jiti-esm");
								try {
									(0, $e.mkdirSync)(n$3, { recursive: !0 });
								} catch {}
								const a$3 = pathe_M_eThtNZ_join(n$3, `${basename(i$5, extname(i$5))}-${Date.now()}-${Math.random().toString(36).slice(2)}.mjs`);
								return (0, $e.writeFileSync)(a$3, t$4), a$3;
							}(l$2, n$2), debug(t$3, "[esm]", "[tempfile]", c$3), a$2(pathToFileURL(c$3))), E$2 = y$2 ? a$2(y$2).catch((e$2) => {
								if ("ENAMETOOLONG" !== e$2?.code) throw e$2;
								return importViaTempFile();
							}) : importViaTempFile();
							return E$2.then((e$2) => e$2.default(...i$4)).finally(() => {
								c$3 && (0, wi.unlink)(c$3).catch(() => {});
							});
						};
					}(t$2, F$1, c$1, t$2.nativeImport, t$2.opts.esmEvalTempFile)) : (t$2.opts.moduleCache && delete t$2.nativeRequire.cache[c$1], t$2.onError(i$2));
				}
				let B$1;
				try {
					B$1 = j$1(N$1.exports, N$1.require, N$1, N$1.filename, pathe_M_eThtNZ_dirname(N$1.filename), O$1.import, O$1.esmResolve);
				} catch (e$2) {
					t$2.opts.moduleCache && delete t$2.nativeRequire.cache[c$1], t$2.onError(e$2);
				}
				function next() {
					if (N$1.exports && N$1.exports.__JITI_ERROR__) {
						const { filename: e$2, line: i$2, column: n$2, code: a$2, message: c$2 } = N$1.exports.__JITI_ERROR__, l$2 = new Error(`${a$2}: ${c$2} \n ${`${e$2}:${i$2}:${n$2}`}`);
						Error.captureStackTrace(l$2, jitiRequire), t$2.onError(l$2);
					}
					N$1.loaded = !0;
					return jitiInteropDefault(t$2, N$1.exports);
				}
				return n$1.async ? Promise.resolve(B$1).then(next) : next();
			}
			const Ri = "win32" === (0, e$1.platform)();
			function createJiti$1(e$2, t$2 = {}, i$1, n$1 = !1) {
				const a$1 = n$1 ? t$2 : function(e$3) {
					const t$3 = {
						fsCache: _booleanEnv("JITI_FS_CACHE", _booleanEnv("JITI_CACHE", !0)),
						rebuildFsCache: _booleanEnv("JITI_REBUILD_FS_CACHE", !1),
						moduleCache: _booleanEnv("JITI_MODULE_CACHE", _booleanEnv("JITI_REQUIRE_CACHE", !0)),
						debug: _booleanEnv("JITI_DEBUG", !1),
						sourceMaps: _booleanEnv("JITI_SOURCE_MAPS", !1),
						interopDefault: _booleanEnv("JITI_INTEROP_DEFAULT", !0),
						extensions: _jsonEnv("JITI_EXTENSIONS", [
							".js",
							".mjs",
							".cjs",
							".ts",
							".tsx",
							".mts",
							".cts",
							".mtsx",
							".ctsx"
						]),
						alias: _jsonEnv("JITI_ALIAS", {}),
						nativeModules: _jsonEnv("JITI_NATIVE_MODULES", []),
						transformModules: _jsonEnv("JITI_TRANSFORM_MODULES", []),
						tryNative: _jsonEnv("JITI_TRY_NATIVE", "Bun" in globalThis),
						esmEvalTempFile: _booleanEnv("JITI_ESM_EVAL_TEMP_FILE", !1),
						jsx: _booleanEnv("JITI_JSX", !1),
						tsconfigPaths: _jsonEnv("JITI_TSCONFIG_PATHS", !1, !0)
					};
					t$3.jsx && t$3.extensions.push(".jsx", ".tsx");
					const i$2 = {};
					return void 0 !== e$3.cache && (i$2.fsCache = e$3.cache), void 0 !== e$3.requireCache && (i$2.moduleCache = e$3.requireCache), {
						...t$3,
						...i$2,
						...e$3
					};
				}(t$2);
				"string" == typeof e$2 && e$2.startsWith("file://") && (e$2 = fileURLToPath(e$2));
				const c$1 = a$1.alias && Object.keys(a$1.alias).length > 0 ? normalizeAliases(a$1.alias || {}) : void 0;
				let l$1;
				if (a$1.tsconfigPaths) {
					const { getTsconfig: t$3, createPathsMatcher: i$2 } = __webpack_require__("./node_modules/.pnpm/get-tsconfig@4.14.0/node_modules/get-tsconfig/dist/index.cjs"), n$2 = t$3("string" == typeof a$1.tsconfigPaths ? a$1.tsconfigPaths : pathe_M_eThtNZ_dirname(e$2));
					n$2 && (l$1 = i$2(n$2));
				}
				const y$1 = [
					"typescript",
					"jiti",
					...a$1.nativeModules || []
				], E$1 = new RegExp(`node_modules/(${y$1.map((e$3) => escapeStringRegexp(e$3)).join("|")})/`), w$1 = [...a$1.transformModules || []], C$1 = new RegExp(`node_modules/(${w$1.map((e$3) => escapeStringRegexp(e$3)).join("|")})/`);
				e$2 || (e$2 = process.cwd()), !n$1 && isDir(e$2) && (e$2 = pathe_M_eThtNZ_join(e$2, "_index.js"));
				const S$1 = pathToFileURL(e$2), I$1 = [...a$1.extensions].filter((e$3) => ".js" !== e$3), N$1 = i$1.createRequire(Ri ? e$2.replace(/\//g, "\\") : e$2), O$1 = {
					filename: e$2,
					url: S$1,
					opts: a$1,
					alias: c$1,
					resolveTsConfigPaths: l$1,
					nativeModules: y$1,
					transformModules: w$1,
					isNativeRe: E$1,
					isTransformRe: C$1,
					additionalExts: I$1,
					nativeRequire: N$1,
					onError: i$1.onError,
					parentModule: i$1.parentModule,
					parentCache: i$1.parentCache,
					nativeImport: i$1.nativeImport,
					createRequire: i$1.createRequire
				};
				n$1 || debug(O$1, "[init]", ...[
					["version:", Gt.rE],
					["module-cache:", a$1.moduleCache],
					["fs-cache:", a$1.fsCache],
					["rebuild-fs-cache:", a$1.rebuildFsCache],
					["interop-defaults:", a$1.interopDefault]
				].flat()), n$1 || prepareCacheDir(O$1);
				const j$1 = Object.assign(function(e$3) {
					return jitiRequire(O$1, e$3, { async: !1 });
				}, {
					cache: a$1.moduleCache ? N$1.cache : Object.create(null),
					extensions: N$1.extensions,
					main: N$1.main,
					options: a$1,
					resolve: Object.assign(function(e$3, t$3) {
						return jitiResolve(O$1, e$3, {
							...t$3,
							async: !1
						});
					}, { paths: N$1.resolve.paths }),
					transform: (e$3) => transform(O$1, e$3),
					evalModule: (e$3, t$3) => eval_evalModule(O$1, e$3, t$3),
					async import(e$3, t$3) {
						const i$2 = await jitiRequire(O$1, e$3, {
							...t$3,
							async: !0
						});
						return t$3?.default ? i$2?.default ?? i$2 : i$2;
					},
					esmResolve(e$3, t$3) {
						"string" == typeof t$3 && (t$3 = { parentURL: t$3 });
						const i$2 = jitiResolve(O$1, e$3, {
							parentURL: S$1,
							...t$3,
							async: !0
						});
						return !i$2 || "string" != typeof i$2 || i$2.startsWith("file://") ? i$2 : pathToFileURL(i$2);
					}
				});
				return j$1;
			}
		})(), module.exports = i.default;
	})();
} });
var import_jiti = __toESM(require_jiti(), 1);

//#endregion
//#region node_modules/jiti/lib/jiti.mjs
function onError(err) {
	throw err;
}
const nativeImport = (id) => import(id);
let _transform;
function lazyTransform(...args) {
	if (!_transform) _transform = createRequire(import.meta.url)("../dist/babel.cjs");
	return _transform(...args);
}
function createJiti(id, opts = {}) {
	if (!opts.transform) opts = {
		...opts,
		transform: lazyTransform
	};
	return (0, import_jiti.default)(id, opts, {
		onError,
		nativeImport,
		createRequire
	});
}
var jiti_default = createJiti;

//#endregion
export { jiti_default as default };