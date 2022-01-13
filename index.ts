import { IGameInfo, ILibraryFolders } from './interfaces';
import { parse, stringify } from '@node-steam/vdf';
import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';

export function parseSteamApps(steamLibrary: ILibraryFolders): string {
  if (typeof steamLibrary === 'undefined' || steamLibrary === null) {
    throw 'steamLibrary is undefined';
  }

  if (!('libraryfolders' in steamLibrary)) {
    throw "steamLibrary doesn't have libraryfolders";
  }

  try {
    const stringLibrary = stringify(steamLibrary);

    return stringLibrary;
  } catch (ex) {
    throw `Cannot convert to string`;
  }
}

export function appInfo(appId: string, apiKey: string): Promise<IGameInfo> {
  return new Promise<IGameInfo>((resolve, reject) => {
    axios({
      url: `https://store.steampowered.com/api/appdetails?appids=${appId}&key=${apiKey}`,
      method: 'GET',
      responseType: 'json',
    })
      .then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw 'HTTP Error';
        }

        if (`${appId}` in response.data) {
          try {
            return resolve(<IGameInfo>response.data[appId].data);
          } catch (ex) {
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

export default function loadSteamApps(steamLibraryFoldersFilePath: string = ''): ILibraryFolders {
  if (steamLibraryFoldersFilePath.length === 0) {
    steamLibraryFoldersFilePath = 'C:\\Program Files (x86)\\Steam\\config\\libraryfolders.vdf';
  }
  const isExists: boolean = fs.existsSync(steamLibraryFoldersFilePath);

  if (!isExists) {
    throw `${steamLibraryFoldersFilePath} doesn't exists.\n`;
  }

  const contents: string = fs.readFileSync(steamLibraryFoldersFilePath).toString();

  try {
    const libraryFolders: ILibraryFolders = parse(contents);

    libraryFolders.libraryfolders = Object.values(libraryFolders.libraryfolders);

    return libraryFolders;
  } catch (ex) {
    throw `Cannot parse ${steamLibraryFoldersFilePath}`;
  }
}

export async function mapLibraryToGameInfo(library: ILibraryFolders): Promise<ILibraryFolders> {
  library.libraryfolders = await Promise.all(
    library.libraryfolders
      .filter((libraryFolder) => typeof libraryFolder === 'object')
      .map(async (libraryFolder) => {
        if (libraryFolder.apps === undefined) {
          return libraryFolder;
        }

        libraryFolder.apps = (
          await Promise.all(
            Object.keys(libraryFolder.apps).map(async (_appId) => {
              return await appInfo(_appId, '');
            }),
          )
        ).filter((_) => _ !== undefined);

        return libraryFolder;
      }),
  );

  return library;
}
