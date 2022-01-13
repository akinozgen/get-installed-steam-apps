import { suite, test } from '@testdeck/mocha';
import { should, assert } from 'chai';
import { join } from 'path';

import getSteamApps, { appInfo, mapLibraryToGameInfo, parseSteamApps } from '../index';
import { GameType, IGameInfo, ILibraryFolders } from '../interfaces';
import { config, parse } from 'dotenv';

should();

@suite
class GetSteamAppsUnitTest {
  private steamApps: ILibraryFolders;
  private ENV: any;
  private gameInfo: IGameInfo;

  async before() {
    this.steamApps = await getSteamApps(join(__dirname, 'stubs', 'myfolders.vdf'));
    this.ENV = config({
      path: join(__dirname, '..', '.env'),
    }).parsed;

    const fo4Id: number = 377160;
    const apiKey: string = this.ENV['STEAM_API_KEY'];

    this.gameInfo = await appInfo(fo4Id.toString(), apiKey);
  }

  @test 'should get steam apps'() {
    assert('libraryfolders' in this.steamApps, 'steamApps has libraryfolders object');
  }

  @test 'libraryfolders should be an array of ILibraryFolderList'() {
    const lb = [];
    this.steamApps.libraryfolders.forEach((_) => lb.push(_));

    assert(
      lb.length === this.steamApps.libraryfolders.length,
      'libraryfolders is an array of ILibraryFolderList',
    );
  }

  @test 'it should not throw error'() {
    const filePath: string = join(__dirname, 'stubs', 'myfolders.vdf');
    const loadSteamApps = () => {
      return getSteamApps(filePath);
    };

    loadSteamApps.should.be.not.throw(`${filePath} doesn't exists.\n`);
    loadSteamApps.should.be.not.throw(`Cannot parse ${filePath}`);
  }

  @test 'it should throw not exists error'() {
    // Intentionally wrong path.
    const filePath: string = join(__dirname, 'stUbs', 'myf0ld3rs.vdf');
    const loadSteamApps = () => {
      return getSteamApps(filePath);
    };

    loadSteamApps.should.be.throw(`${filePath} doesn't exists.\n`);
  }

  @test 'it should throw cannot parse error'() {
    // Intentionally wrong path.
    const filePath: string = __filename;
    const loadSteamApps = () => {
      return getSteamApps(filePath);
    };

    loadSteamApps.should.be.throw(`Cannot parse ${filePath}`);
  }

  @test 'it should check throw undefined'() {
    const stringLibrary = () => parseSteamApps(this.steamApps);
    const stringLibraryUndef = () => parseSteamApps(undefined);

    stringLibrary.should.be.not.throw('steamLibrary is undefined');
    stringLibraryUndef.should.be.throw('steamLibrary is undefined');
  }

  @test 'it should check doesnt have libraryfolders'() {
    const stringLibrary = () => parseSteamApps(this.steamApps);
    // @ts-ignore
    const stringLibraryEmpty = () => parseSteamApps({});

    stringLibrary.should.be.not.throw("steamLibrary doesn't have libraryfolders");
    stringLibraryEmpty.should.be.throw("steamLibrary doesn't have libraryfolders");
  }

  @test 'it should check cannot convert error'() {
    const stringLibrary = () => parseSteamApps(this.steamApps);

    stringLibrary.should.be.not.throw('Cannot convert to string');
  }

  @test async 'it should get info of Fallout 4'() {
    const fo4Id: number = 377160;
    const gameDescription =
      'Bethesda Game Studios, the award-winning creators of Fallout 3 and The Elder Scrolls V: Skyrim, welcome you to the world of Fallout 4 – their most ambitious game ever, and the next generation of open-world gaming.';

    const gameInfo = async () => await appInfo(fo4Id.toString(), this.ENV['STEAM_API_KEY']);

    gameInfo.should.be.not.throw('HTTP Error');
    gameInfo.should.be.not.throw('Parse Error');
    gameInfo.should.be.not.throw('Not Found');

    assert(this.gameInfo.name === 'Fallout 4', 'Game name is correct.');
    assert(this.gameInfo.steam_appid === fo4Id, 'Game id is correct.');
    assert(this.gameInfo.type === GameType.Game, 'Game type is correct.');
    assert(this.gameInfo.short_description === gameDescription, 'Game description is correct.');
    assert(this.gameInfo.developers[0] == 'Bethesda Game Studios', 'Game developers are correct.');
    assert(this.gameInfo.platforms['windows'] === true, 'Game windows platform is correct.');
  }
}
