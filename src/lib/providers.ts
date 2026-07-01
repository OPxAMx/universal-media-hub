export interface Provider {
  key: string;
  name: string;
  aliases: string[];
  logo: string;
  video: string;
}

export const PROVIDERS: Provider[] = [
  { key: "netflix", name: "Netflix", aliases: ["netflix"], logo: "https://u.cubeupload.com/mystic/8df6ce62504c1ab31aab.png", video: "https://media.tenor.com/hd7jyV_dMS8AAAPo/netflix-media-services-provider.mp4" },
  { key: "prime", name: "Prime Video", aliases: ["prime video", "amazon"], logo: "https://u.cubeupload.com/mystic/b222691607d658c2fa52.png", video: "https://media.tenor.com/T7L_NCdPIvAAAAPo/prime-video.mp4" },
  { key: "paramount", name: "Paramount+", aliases: ["paramount"], logo: "https://u.cubeupload.com/mystic/35734306149c1a6eb0a9.png", video: "https://media4.giphy.com/media/qCEXQzkScYOBIRusVA/giphy.mp4" },
  { key: "disney", name: "Disney+", aliases: ["disney"], logo: "https://u.cubeupload.com/mystic/c40fe782c450e170eea6.png", video: "https://media.tenor.com/h6-0yzk8pbAAAAPo/disney-disney-plus.mp4" },
  { key: "marvel", name: "Marvel Studios", aliases: ["marvel"], logo: "https://u.cubeupload.com/mystic/hUzeosd33nzE5MCNsZxC.png", video: "https://i.giphy.com/media/vBjLa5DQwwxbi/giphy.mp4" },
  { key: "apple", name: "Apple TV+", aliases: ["apple tv", "apple studios"], logo: "https://u.cubeupload.com/mystic/b2fb6956993e2ee5b4e3.png", video: "https://media.tenor.com/Oxl9xEn7kTEAAAPo/applo-tv.mp4" },
  { key: "warner", name: "Warner Bros", aliases: ["warner"], logo: "https://u.cubeupload.com/mystic/ky0xOc5OrhzkZ1N6KyUx.png", video: "https://i.giphy.com/media/3o7TKt3pMpzozdUsus/giphy.mp4" },
  { key: "dc", name: "DC Comics", aliases: ["dc comics", "dc entertainment", "dc studios"], logo: "https://u.cubeupload.com/mystic/2Tc1P3Ac8M479naPp1kY.png", video: "https://media.tenor.com/ag74wyAzYkMAAAPo/dc-comics-dceu.mp4" },
  { key: "hbo", name: "HBO Max", aliases: ["hbo", "max"], logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/HBO_Max_%282025%29.svg/250px-HBO_Max_%282025%29.svg.png", video: "https://media.tenor.com/7xmvr-fKGLMAAAAd/hbo-max-warner-bros-pictures.gif" },
];

export const buildProviderHaystack = (item: any): string => {
  const pc = item.meta?.production_companies;
  const pcStr = Array.isArray(pc) ? pc.join(" ") : (pc || "");
  const networks = item.meta?.networks;
  const nwStr = Array.isArray(networks) ? networks.join(" ") : (networks || "");
  return [
    pcStr,
    nwStr,
    item.embed?.provider || "",
    (item.tags || []).join(" "),
  ].join(" ").toLowerCase();
};
