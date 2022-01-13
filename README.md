# Get Installed Steam Apps

Loads library folders of localy installed steam instance with game info objects.

Library folders are located at your local `steam_installation_folder/config/libraryfolders.vdf`

Example usage

```javascript
import { loadSteamApps, mapLibraryToGameInfo } 'steam-get-installed-apps';

const libraryPath = "C:\\Program Files (x86)\\Steam\\config\\libraryfolders.vdf";
const gameLibrary = await loadSteamApps(libraryPath);
// This returns locations of steam library folders.

// returned value:
{
  libraryfolders: [
    {
      path: 'C:\\\\Program Files (x86)\\\\Steam',
      label: '',
      contentid: -7695053421422003000,
      totalsize: 0,
      update_clean_bytes_tally: 30765620916,
      time_last_update_corruption: 0,
      apps: [Object]
    },
    {
      path: 'D:\\\\Steam',
      label: '',
      contentid: 2652265762185892400,
      totalsize: 0,
      update_clean_bytes_tally: 0,
      time_last_update_corruption: 0,
      apps: {}
    },
    {
      path: 'D:\\\\Steam',
      label: '',
      contentid: 537813927753228900,
      totalsize: 0,
      update_clean_bytes_tally: 0,
      time_last_update_corruption: 0,
      apps: {}
    },
    {
      path: 'E:\\\\D\\\\Steam',
      label: '',
      contentid: 537813927753228900,
      totalsize: 500105736192,
      update_clean_bytes_tally: 4397134937,
      time_last_update_corruption: 1634863002,
      apps: [Object]
    },
    -7695053421422003000
  ]
}

// Additionally you can get installed game infos at [apps] property
// Loads game info from steam api. Steam appinfo api currently doesn't require an api key, but this library provides api key option if it needs in the future

// This function below, maps every game id as gameinfo object that contains almost every property of games info. Such as name, price, developers, screenshots, descriptions etc.
const gameLibrary = await mapLibraryToGameInfo(gameLibrary);

// returned value:
{
  libraryfolders: [
    {
      path: 'C:\\\\Program Files (x86)\\\\Steam',
      label: '',
      contentid: -7695053421422003000,
      totalsize: 0,
      update_clean_bytes_tally: 30765620916,
      time_last_update_corruption: 0,
      apps: [
        {
          "type": "game",
          "name": "Cities: Skylines",
          "steam_appid": 255710,
          "required_age": 0,
          "is_free": false,
          "dlc": [Array],
          "detailed_description": "String",
          "about_the_game": "String",
          "short_description": "String",
          "supported_languages": "English, French",
          "reviews": "String",
          // ...
          "price_overview": {
            "currency": "TRY",
            "initial": 4900,
            "final": 4900,
            "discount_percent": 0,
            "initial_formatted": "",
            "final_formatted": "49,00 TL"
          },
          "packages": [
            62700,
            232993,
            62701
          ],
          // ...
        }
      ]
    },
    // ...
  ]
}
```

You can get more type info at `interfaces.ts` file
