export interface ILibraryFolders {
  libraryfolders: ILibraryFolderList[];
}

export interface ILibraryFolderList {
  path: string;
  label: string;
  contentid: number;
  totalsize: number;
  update_clean_bytes_tally: number;
  time_last_update_corruption: number;
  apps: { string: number }[] | IGameInfo[] | null;
}

export interface IGameInfo {
  type: GameType;
  name: string;
  steam_appid: number;
  required_age: number;
  is_free: boolean;
  dlc: number[];
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  supported_languages: string;
  header_image: string;
  website: string | null;
  pc_requirements: IRequirements | null;
  mac_requirements: IRequirements | null;
  linux_requirements: IRequirements | null;

  legal_notice: string;
  developers: string[];
  publishers: string[];
  price_overview: IPriceOverview | null;
  packages: number[];
  package_groups: IPackageGroup | null;

  platforms: IPlatformSupport;
  categories: ICategory[] | null;

  genres: IGenre[] | null;
  screenshots: IScreenshot[] | null;
  movies: IMovie[] | null;
  release_date: IReleaseDate | null;
  support_info: ISupportInfo | null;
  background: string;
}

export interface ISupportInfo {
  url?: string;
  email?: string;
}

export interface IReleaseDate {
  coming_soon: boolean;
  date: string;
}

export interface IMovie {
  id: number;
  name: string;
  thumbnail: string;
  path_full: string;
  webm: IMovieWebm | null;
  mp4: IMovieMP4 | null;
  highlight: boolean;
}

export interface IMovieWebm {
  '480': string;
  '720'?: string;
  '1080'?: string;
  max: string;
}

export interface IMovieMP4 {
  '480': string;
  '720'?: string;
  '1080'?: string;
  max: string;
}

export interface IScreenshot {
  id: number;
  path_thumbnail: string;
  path_full: string;
}

export interface IGenre {
  id: string;
  description: string;
}

export interface ICategory {
  id: number;
  description: string;
}

export interface IPlatformSupport {
  mac: boolean;
  linux: boolean;
  windows: boolean;
}

export interface IPackageGroup {
  name: string;
  title: string;
  descriotion: string;
  selection_text: string;
  save_text: string;
  display_type: number;
  is_recurring_subscription: boolean;
  subs: IPackageGroupSub[] | null;
}

export interface IPackageGroupSub {
  packageid: number;
  percent_savings_text: string;
  percent_savings: number;
  option_text: string;
  option_description: string;
  can_get_free_license: string;
  is_free_license: boolean;
  price_in_cents_with_discount: number;
}

export interface IPriceOverview {
  currency: string;
  initial: number;
  final: number;
  discount_percent: number;
  initial_formatted: string;
  final_formatted: string;
}

export interface IRequirements {
  minimum?: string;
  recommended?: string;
}

export enum GameType {
  Game = 'game',
}
