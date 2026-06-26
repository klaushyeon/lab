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

// src/addPost/handler.ts
var handler_exports = {};
__export(handler_exports, {
  addPost: () => addPost
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
var writeDb = async (dbFile, posts) => {
  await import_fs.promises.writeFile(dbFile, JSON.stringify(posts, null, 2), "utf8");
};
var generateObjectId = () => {
  const timestamp = Math.floor(Date.now() / 1e3).toString(16).padStart(8, "0");
  const random = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(
    ""
  );
  return `${timestamp}${random}`;
};
var send = (statusCode, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body)
});

// src/addPost/handler.ts
var import_path2 = __toESM(require("path"));
var postsDbFile2 = import_path2.default.resolve(process.cwd(), "db", "posts.json");
var addPost = async (event) => {
  try {
    if (!event.body) {
      return send(400, { message: "Request body is required." });
    }
    const body = JSON.parse(event.body);
    const title = String(body.title).trim();
    const content = String(body.content).trim();
    if (!title || !content) {
      return send(400, { message: "title and content are required." });
    }
    const posts = await readDb(postsDbFile2);
    const newPost = {
      id: generateObjectId(),
      title,
      content,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    posts.unshift(newPost);
    await writeDb(postsDbFile2, posts);
    return send(201, newPost);
  } catch (error) {
    console.error(error);
    return send(500, { message: "Internal server error." });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addPost
});
