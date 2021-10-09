var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/globrex/index.js
var require_globrex = __commonJS({
  "node_modules/globrex/index.js"(exports2, module2) {
    var isWin = process.platform === "win32";
    var SEP = isWin ? `\\\\+` : `\\/`;
    var SEP_ESC = isWin ? `\\\\` : `/`;
    var GLOBSTAR = `((?:[^/]*(?:/|$))*)`;
    var WILDCARD = `([^/]*)`;
    var GLOBSTAR_SEGMENT = `((?:[^${SEP_ESC}]*(?:${SEP_ESC}|$))*)`;
    var WILDCARD_SEGMENT = `([^${SEP_ESC}]*)`;
    function globrex(glob2, { extended = false, globstar = false, strict = false, filepath = false, flags = "" } = {}) {
      let regex = "";
      let segment = "";
      let path2 = { regex: "", segments: [] };
      let inGroup = false;
      let inRange = false;
      const ext = [];
      function add(str, { split, last, only } = {}) {
        if (only !== "path")
          regex += str;
        if (filepath && only !== "regex") {
          path2.regex += str === "\\/" ? SEP : str;
          if (split) {
            if (last)
              segment += str;
            if (segment !== "") {
              if (!flags.includes("g"))
                segment = `^${segment}$`;
              path2.segments.push(new RegExp(segment, flags));
            }
            segment = "";
          } else {
            segment += str;
          }
        }
      }
      let c, n;
      for (let i = 0; i < glob2.length; i++) {
        c = glob2[i];
        n = glob2[i + 1];
        if (["\\", "$", "^", ".", "="].includes(c)) {
          add(`\\${c}`);
          continue;
        }
        if (c === "/") {
          add(`\\${c}`, { split: true });
          if (n === "/" && !strict)
            regex += "?";
          continue;
        }
        if (c === "(") {
          if (ext.length) {
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === ")") {
          if (ext.length) {
            add(c);
            let type = ext.pop();
            if (type === "@") {
              add("{1}");
            } else if (type === "!") {
              add("([^/]*)");
            } else {
              add(type);
            }
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "|") {
          if (ext.length) {
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "+") {
          if (n === "(" && extended) {
            ext.push(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "@" && extended) {
          if (n === "(") {
            ext.push(c);
            continue;
          }
        }
        if (c === "!") {
          if (extended) {
            if (inRange) {
              add("^");
              continue;
            }
            if (n === "(") {
              ext.push(c);
              add("(?!");
              i++;
              continue;
            }
            add(`\\${c}`);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "?") {
          if (extended) {
            if (n === "(") {
              ext.push(c);
            } else {
              add(".");
            }
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "[") {
          if (inRange && n === ":") {
            i++;
            let value = "";
            while (glob2[++i] !== ":")
              value += glob2[i];
            if (value === "alnum")
              add("(\\w|\\d)");
            else if (value === "space")
              add("\\s");
            else if (value === "digit")
              add("\\d");
            i++;
            continue;
          }
          if (extended) {
            inRange = true;
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "]") {
          if (extended) {
            inRange = false;
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "{") {
          if (extended) {
            inGroup = true;
            add("(");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "}") {
          if (extended) {
            inGroup = false;
            add(")");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === ",") {
          if (inGroup) {
            add("|");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "*") {
          if (n === "(" && extended) {
            ext.push(c);
            continue;
          }
          let prevChar = glob2[i - 1];
          let starCount = 1;
          while (glob2[i + 1] === "*") {
            starCount++;
            i++;
          }
          let nextChar = glob2[i + 1];
          if (!globstar) {
            add(".*");
          } else {
            let isGlobstar = starCount > 1 && (prevChar === "/" || prevChar === void 0) && (nextChar === "/" || nextChar === void 0);
            if (isGlobstar) {
              add(GLOBSTAR, { only: "regex" });
              add(GLOBSTAR_SEGMENT, { only: "path", last: true, split: true });
              i++;
            } else {
              add(WILDCARD, { only: "regex" });
              add(WILDCARD_SEGMENT, { only: "path" });
            }
          }
          continue;
        }
        add(c);
      }
      if (!flags.includes("g")) {
        regex = `^${regex}$`;
        segment = `^${segment}$`;
        if (filepath)
          path2.regex = `^${path2.regex}$`;
      }
      const result = { regex: new RegExp(regex, flags) };
      if (filepath) {
        path2.segments.push(new RegExp(segment, flags));
        path2.regex = new RegExp(path2.regex, flags);
        path2.globstar = new RegExp(!flags.includes("g") ? `^${GLOBSTAR_SEGMENT}$` : GLOBSTAR_SEGMENT, flags);
        result.path = path2;
      }
      return result;
    }
    module2.exports = globrex;
  }
});

// node_modules/globalyzer/src/index.js
var require_src = __commonJS({
  "node_modules/globalyzer/src/index.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var path2 = require("path");
    var isWin = os.platform() === "win32";
    var CHARS = { "{": "}", "(": ")", "[": "]" };
    var STRICT = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\)|(\\).|([@?!+*]\(.*\)))/;
    var RELAXED = /\\(.)|(^!|[*?{}()[\]]|\(\?)/;
    function isglob(str, { strict = true } = {}) {
      if (str === "")
        return false;
      let match, rgx = strict ? STRICT : RELAXED;
      while (match = rgx.exec(str)) {
        if (match[2])
          return true;
        let idx = match.index + match[0].length;
        let open = match[1];
        let close = open ? CHARS[open] : null;
        if (open && close) {
          let n = str.indexOf(close, idx);
          if (n !== -1)
            idx = n + 1;
        }
        str = str.slice(idx);
      }
      return false;
    }
    function parent(str, { strict = false } = {}) {
      if (isWin && str.includes("/"))
        str = str.split("\\").join("/");
      if (/[\{\[].*[\/]*.*[\}\]]$/.test(str))
        str += "/";
      str += "a";
      do {
        str = path2.dirname(str);
      } while (isglob(str, { strict }) || /(^|[^\\])([\{\[]|\([^\)]+$)/.test(str));
      return str.replace(/\\([\*\?\|\[\]\(\)\{\}])/g, "$1");
    }
    function globalyzer(pattern, opts = {}) {
      let base = parent(pattern, opts);
      let isGlob = isglob(pattern, opts);
      let glob2;
      if (base != ".") {
        glob2 = pattern.substr(base.length);
        if (glob2.startsWith("/"))
          glob2 = glob2.substr(1);
      } else {
        glob2 = pattern;
      }
      if (!isGlob) {
        base = path2.dirname(pattern);
        glob2 = base !== "." ? pattern.substr(base.length) : pattern;
      }
      if (glob2.startsWith("./"))
        glob2 = glob2.substr(2);
      if (glob2.startsWith("/"))
        glob2 = glob2.substr(1);
      return { base, glob: glob2, isGlob };
    }
    module2.exports = globalyzer;
  }
});

// node_modules/tiny-glob/index.js
var require_tiny_glob = __commonJS({
  "node_modules/tiny-glob/index.js"(exports2, module2) {
    var fs2 = require("fs");
    var globrex = require_globrex();
    var { promisify } = require("util");
    var globalyzer = require_src();
    var { join, resolve, relative } = require("path");
    var isHidden = /(^|[\\\/])\.[^\\\/\.]/g;
    var readdir = promisify(fs2.readdir);
    var stat = promisify(fs2.stat);
    var CACHE = {};
    async function walk(output, prefix, lexer, opts, dirname = "", level = 0) {
      const rgx = lexer.segments[level];
      const dir = resolve(opts.cwd, prefix, dirname);
      const files = await readdir(dir);
      const { dot, filesOnly } = opts;
      let i = 0, len = files.length, file;
      let fullpath, relpath, stats, isMatch;
      for (; i < len; i++) {
        fullpath = join(dir, file = files[i]);
        relpath = dirname ? join(dirname, file) : file;
        if (!dot && isHidden.test(relpath))
          continue;
        isMatch = lexer.regex.test(relpath);
        if ((stats = CACHE[relpath]) === void 0) {
          CACHE[relpath] = stats = fs2.lstatSync(fullpath);
        }
        if (!stats.isDirectory()) {
          isMatch && output.push(relative(opts.cwd, fullpath));
          continue;
        }
        if (rgx && !rgx.test(file))
          continue;
        !filesOnly && isMatch && output.push(join(prefix, relpath));
        await walk(output, prefix, lexer, opts, relpath, rgx && rgx.toString() !== lexer.globstar && level + 1);
      }
    }
    module2.exports = async function(str, opts = {}) {
      if (!str)
        return [];
      let glob2 = globalyzer(str);
      opts.cwd = opts.cwd || ".";
      if (!glob2.isGlob) {
        try {
          let resolved = resolve(opts.cwd, str);
          let dirent = await stat(resolved);
          if (opts.filesOnly && !dirent.isFile())
            return [];
          return opts.absolute ? [resolved] : [str];
        } catch (err) {
          if (err.code != "ENOENT")
            throw err;
          return [];
        }
      }
      if (opts.flush)
        CACHE = {};
      let matches = [];
      const { path: path2 } = globrex(glob2.glob, { filepath: true, globstar: true, extended: true });
      path2.globstar = path2.globstar.toString();
      await walk(matches, glob2.base, path2, opts, ".", 0);
      return opts.absolute ? matches.map((x) => resolve(opts.cwd, x)) : matches;
    };
  }
});

// node_modules/colorette/index.cjs
var require_colorette = __commonJS({
  "node_modules/colorette/index.cjs"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tty = require("tty");
    function _interopNamespace(e) {
      if (e && e.__esModule)
        return e;
      var n = Object.create(null);
      if (e) {
        Object.keys(e).forEach(function(k) {
          if (k !== "default") {
            var d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: function() {
                return e[k];
              }
            });
          }
        });
      }
      n["default"] = e;
      return Object.freeze(n);
    }
    var tty__namespace = /* @__PURE__ */ _interopNamespace(tty);
    var env = process.env || {};
    var argv = process.argv || [];
    var isDisabled = "NO_COLOR" in env || argv.includes("--no-color");
    var isForced = "FORCE_COLOR" in env || argv.includes("--color");
    var isWindows = process.platform === "win32";
    var isCompatibleTerminal = tty__namespace && tty__namespace.isatty && tty__namespace.isatty(1) && env.TERM && env.TERM !== "dumb";
    var isCI = "CI" in env && ("GITHUB_ACTIONS" in env || "GITLAB_CI" in env || "CIRCLECI" in env);
    var isColorSupported = !isDisabled && (isForced || isWindows || isCompatibleTerminal || isCI);
    var replaceClose = (index, string, close, replace, head = string.substring(0, index) + replace, tail = string.substring(index + close.length), next = tail.indexOf(close)) => head + (next < 0 ? tail : replaceClose(next, tail, close, replace));
    var clearBleed = (index, string, open, close, replace) => index < 0 ? open + string + close : open + replaceClose(index, string, close, replace) + close;
    var filterEmpty = (open, close, replace = open, at = open.length + 1) => (string) => string || !(string === "" || string === void 0) ? clearBleed(("" + string).indexOf(close, at), string, open, close, replace) : "";
    var init = (open, close, replace) => filterEmpty(`[${open}m`, `[${close}m`, replace);
    var colors = {
      reset: init(0, 0),
      bold: init(1, 22, "[22m[1m"),
      dim: init(2, 22, "[22m[2m"),
      italic: init(3, 23),
      underline: init(4, 24),
      inverse: init(7, 27),
      hidden: init(8, 28),
      strikethrough: init(9, 29),
      black: init(30, 39),
      red: init(31, 39),
      green: init(32, 39),
      yellow: init(33, 39),
      blue: init(34, 39),
      magenta: init(35, 39),
      cyan: init(36, 39),
      white: init(37, 39),
      gray: init(90, 39),
      bgBlack: init(40, 49),
      bgRed: init(41, 49),
      bgGreen: init(42, 49),
      bgYellow: init(43, 49),
      bgBlue: init(44, 49),
      bgMagenta: init(45, 49),
      bgCyan: init(46, 49),
      bgWhite: init(47, 49),
      blackBright: init(90, 39),
      redBright: init(91, 39),
      greenBright: init(92, 39),
      yellowBright: init(93, 39),
      blueBright: init(94, 39),
      magentaBright: init(95, 39),
      cyanBright: init(96, 39),
      whiteBright: init(97, 39),
      bgBlackBright: init(100, 49),
      bgRedBright: init(101, 49),
      bgGreenBright: init(102, 49),
      bgYellowBright: init(103, 49),
      bgBlueBright: init(104, 49),
      bgMagentaBright: init(105, 49),
      bgCyanBright: init(106, 49),
      bgWhiteBright: init(107, 49)
    };
    var none = (any) => any;
    var createColors = ({ useColor = isColorSupported } = {}) => useColor ? colors : Object.keys(colors).reduce((colors2, key) => __spreadProps(__spreadValues({}, colors2), { [key]: none }), {});
    var {
      reset,
      bold,
      dim,
      italic,
      underline,
      inverse,
      hidden,
      strikethrough,
      black,
      red,
      green,
      yellow,
      blue,
      magenta,
      cyan,
      white,
      gray,
      bgBlack,
      bgRed,
      bgGreen,
      bgYellow,
      bgBlue,
      bgMagenta,
      bgCyan,
      bgWhite,
      blackBright,
      redBright,
      greenBright,
      yellowBright,
      blueBright,
      magentaBright,
      cyanBright,
      whiteBright,
      bgBlackBright,
      bgRedBright,
      bgGreenBright,
      bgYellowBright,
      bgBlueBright,
      bgMagentaBright,
      bgCyanBright,
      bgWhiteBright
    } = createColors();
    exports2.bgBlack = bgBlack;
    exports2.bgBlackBright = bgBlackBright;
    exports2.bgBlue = bgBlue;
    exports2.bgBlueBright = bgBlueBright;
    exports2.bgCyan = bgCyan;
    exports2.bgCyanBright = bgCyanBright;
    exports2.bgGreen = bgGreen;
    exports2.bgGreenBright = bgGreenBright;
    exports2.bgMagenta = bgMagenta;
    exports2.bgMagentaBright = bgMagentaBright;
    exports2.bgRed = bgRed;
    exports2.bgRedBright = bgRedBright;
    exports2.bgWhite = bgWhite;
    exports2.bgWhiteBright = bgWhiteBright;
    exports2.bgYellow = bgYellow;
    exports2.bgYellowBright = bgYellowBright;
    exports2.black = black;
    exports2.blackBright = blackBright;
    exports2.blue = blue;
    exports2.blueBright = blueBright;
    exports2.bold = bold;
    exports2.createColors = createColors;
    exports2.cyan = cyan;
    exports2.cyanBright = cyanBright;
    exports2.dim = dim;
    exports2.gray = gray;
    exports2.green = green;
    exports2.greenBright = greenBright;
    exports2.hidden = hidden;
    exports2.inverse = inverse;
    exports2.isColorSupported = isColorSupported;
    exports2.italic = italic;
    exports2.magenta = magenta;
    exports2.magentaBright = magentaBright;
    exports2.red = red;
    exports2.redBright = redBright;
    exports2.reset = reset;
    exports2.strikethrough = strikethrough;
    exports2.underline = underline;
    exports2.white = white;
    exports2.whiteBright = whiteBright;
    exports2.yellow = yellow;
    exports2.yellowBright = yellowBright;
  }
});

// src/node/index.js
var path = require("path");
var fs = require("fs");
var glob = require_tiny_glob();
var crypto = require("crypto");
var colorette = require_colorette();
var indexPath = fs.existsSync("public") ? "public/" : "";
var assetsDir = `${indexPath}assets`;
var hashedFilenameRE = /\w{8}\.(?:css|js)$/;
function getHash(path2) {
  const buffer = fs.readFileSync(path2);
  const sum = crypto.createHash("sha256").update(buffer);
  const hex = sum.digest("hex");
  return hex.substr(0, 8);
}
function trimIndex(i) {
  return i.slice(indexPath.length);
}
async function main() {
  const assetFiles = await glob(`${assetsDir}/{css,js}/**/*.{css,js}`);
  const manifest = Object.create(null);
  console.log(colorette.green("Hashing build assets..."));
  for (const filePath of assetFiles) {
    const parsedPath = path.parse(filePath);
    if (hashedFilenameRE.test(parsedPath.base))
      continue;
    const hash = getHash(filePath);
    const newFilePath = path.format(__spreadProps(__spreadValues({}, parsedPath), {
      base: void 0,
      ext: "." + hash + parsedPath.ext
    }));
    fs.renameSync(filePath, newFilePath);
    manifest[trimIndex(filePath)] = trimIndex(newFilePath);
  }
  fs.writeFileSync(`${assetsDir}/manifest.json`, JSON.stringify(manifest, null, 2));
  console.log(`${colorette.green("\u2713")} Hashed ${assetFiles.length} asset files.`);
}
main().catch((err) => console.error(err));
