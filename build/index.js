"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLibraryToGameInfo = exports.appInfo = exports.parseSteamApps = void 0;
const vdf_1 = require("@node-steam/vdf");
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
function parseSteamApps(steamLibrary) {
    if (typeof steamLibrary === 'undefined' || steamLibrary === null) {
        throw 'steamLibrary is undefined';
    }
    if (!('libraryfolders' in steamLibrary)) {
        throw "steamLibrary doesn't have libraryfolders";
    }
    try {
        const stringLibrary = (0, vdf_1.stringify)(steamLibrary);
        return stringLibrary;
    }
    catch (ex) {
        throw `Cannot convert to string`;
    }
}
exports.parseSteamApps = parseSteamApps;
function appInfo(appId, apiKey) {
    return new Promise((resolve, reject) => {
        (0, axios_1.default)({
            url: `https://store.steampowered.com/api/appdetails?appids=${appId}&key=${apiKey}`,
            method: 'GET',
            responseType: 'json',
        })
            .then((response) => {
            if (response.status !== 200) {
                throw 'HTTP Error';
            }
            if (`${appId}` in response.data) {
                try {
                    return resolve(response.data[appId].data);
                }
                catch (ex) {
                    throw 'Parse Error';
                }
            }
            if (response.data[appId]?.success != true) {
                throw 'Not Found';
            }
            throw 'Parse Error';
        })
            .catch((reason) => {
            throw 'HTTP Error';
        });
    });
}
exports.appInfo = appInfo;
function loadSteamApps(steamLibraryFoldersFilePath = '') {
    if (steamLibraryFoldersFilePath.length === 0) {
        steamLibraryFoldersFilePath = 'C:\\Program Files (x86)\\Steam\\config\\libraryfolders.vdf';
    }
    const isExists = fs.existsSync(steamLibraryFoldersFilePath);
    if (!isExists) {
        throw `${steamLibraryFoldersFilePath} doesn't exists.\n`;
    }
    const contents = fs.readFileSync(steamLibraryFoldersFilePath).toString();
    try {
        const libraryFolders = (0, vdf_1.parse)(contents);
        libraryFolders.libraryfolders = Object.values(libraryFolders.libraryfolders);
        return libraryFolders;
    }
    catch (ex) {
        throw `Cannot parse ${steamLibraryFoldersFilePath}`;
    }
}
exports.default = loadSteamApps;
async function mapLibraryToGameInfo(library) {
    library.libraryfolders = await Promise.all(library.libraryfolders
        .filter((libraryFolder) => typeof libraryFolder === 'object')
        .map(async (libraryFolder) => {
        if (libraryFolder.apps === undefined) {
            return libraryFolder;
        }
        libraryFolder.apps = (await Promise.all(Object.keys(libraryFolder.apps).map(async (_appId) => {
            return await appInfo(_appId, '');
        }))).filter((_) => _ !== undefined);
        return libraryFolder;
    }));
    return library;
}
exports.mapLibraryToGameInfo = mapLibraryToGameInfo;
//# sourceMappingURL=index.js.map