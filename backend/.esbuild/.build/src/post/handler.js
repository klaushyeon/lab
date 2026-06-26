"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/post/handler.ts
var handler_exports = {};
__export(handler_exports, {
  post: () => post
});
module.exports = __toCommonJS(handler_exports);

// src/common/serverCommon.ts
var import_fs = require("fs");
var import_path = __toESM(require("path"));
var postsDbFile = import_path.default.resolve(process.cwd(), "db", "posts.json");
var headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST,OPTIONS"
};
var readDb = async (dbFile) => {
  const json = await import_fs.promises.readFile(dbFile, "utf8");
  return JSON.parse(json);
};
var send = (statusCode, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body)
});

// src/post/handler.ts
var import_path2 = __toESM(require("path"));
var postsDbFile2 = import_path2.default.resolve(process.cwd(), "db", "posts.json");
var post = async (event) => {
  try {
    const posts = await readDb(postsDbFile2);
    return send(200, posts);
  } catch (error) {
    console.error(error);
    return send(500, { message: "Failed to load posts." });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  post
});
