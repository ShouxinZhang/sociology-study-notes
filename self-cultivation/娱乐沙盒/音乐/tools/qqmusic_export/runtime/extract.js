(async () => {
  let webpackRequire;
  const chunkId = Math.floor(Date.now() + Math.random() * 1_000_000);
  globalThis.webpackChunkqqmusic.push([
    [chunkId],
    {},
    (runtimeRequire) => {
      webpackRequire = runtimeRequire;
    },
  ]);

  if (!webpackRequire) {
    throw new Error("无法取得 QQ 音乐 webpack runtime");
  }

  const playlistService = webpackRequire(67891);
  const store = webpackRequire(49068);
  const network = webpackRequire(32590).D;
  const assetApi = webpackRequire(65972);
  const login = webpackRequire(68010).Z;
  if (
    typeof playlistService.f$ !== "function" ||
    typeof playlistService.Vj !== "function" ||
    typeof store.y0 !== "function" ||
    typeof network !== "function" ||
    typeof assetApi.Ee !== "function" ||
    typeof assetApi.EP !== "function"
  ) {
    throw new Error("QQ 音乐运行时模块接口已变化");
  }

  await playlistService.f$();
  await new Promise((resolve) => setTimeout(resolve, 800));

  const selfCreated = store.y0("SelfCreatePlayList") || [];
  const favoritePlaylists = store.y0("SelfFavPlayList") || [];
  const playlistInputs = [
    ...selfCreated.map((metadata) => ({
      category: "self_created",
      metadata,
    })),
    ...favoritePlaylists.map((metadata) => ({
      category: "favorited",
      metadata,
    })),
  ];

  const playlists = [];
  for (const input of playlistInputs) {
    const tid = input.metadata.tid;
    if (!tid) {
      throw new Error(
        `歌单 ${input.metadata.dirName || input.metadata.name || "未命名"} 缺少 tid`,
      );
    }
    const songs = await playlistService.Vj(tid);
    if (!Array.isArray(songs)) {
      throw new Error(`歌单 tid=${tid} 未返回歌曲数组`);
    }
    playlists.push({ ...input, songs });
  }

  const albumListResponse = await network({
    albums: assetApi.Ee({ uin: String(login.musicId) }),
  });
  const albumMetadata = albumListResponse?.albums?.data?.v_list;
  if (!Array.isArray(albumMetadata)) {
    throw new Error("收藏专辑接口未返回 v_list 数组");
  }

  const albums = [];
  for (const metadata of albumMetadata) {
    if (!metadata.mid) {
      throw new Error(`收藏专辑 ${metadata.name || "未命名"} 缺少 MID`);
    }
    const albumResponse = await network({
      albumTracks: assetApi.EP({ albumMid: metadata.mid }),
    });
    const details = albumResponse?.albumTracks?.data;
    if (
      albumResponse?.albumTracks?.code !== 0 ||
      !details ||
      !Array.isArray(details.songList)
    ) {
      throw new Error(`收藏专辑 ${metadata.name || metadata.mid} 曲目读取失败`);
    }
    albums.push({ metadata, details });
  }

  return JSON.stringify({
    collectedAt: new Date().toISOString(),
    collections: {
      selfCreatedCount: selfCreated.length,
      favoritePlaylistCount: favoritePlaylists.length,
      favoriteAlbumCount: albums.length,
    },
    playlists,
    albums,
  });
})()
