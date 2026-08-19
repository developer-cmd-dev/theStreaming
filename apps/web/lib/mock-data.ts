export type Stream = {
  id: string;
  title: string;
  streamer: string;
  category: string;
  language: string;
  viewers: number;
  thumbnail: string;
  avatar: string;
  isLive: boolean;
  tags?: string[];
};

export type Channel = {
  id: string;
  name: string;
  category: string;
  viewers: number;
  avatar: string;
  isLive: boolean;
};

export type Category = {
  id: string;
  name: string;
  viewers: number;
  thumbnail: string;
  gradient: string;
};

export type Creator = {
  id: string;
  name: string;
  followers: number;
  avatar: string;
  isLive: boolean;
  category: string;
};

export type ChatMessage = {
  id: string;
  username: string;
  color: string;
  message: string;
  timestamp?: string;
  isEmote?: boolean;
};

export const featuredStreams: Stream[] = [
  {
    id: "fs-1",
    title: "Late Night Vibes — Chill beats & community hangout",
    streamer: "NovaPulse",
    category: "Just Chatting",
    language: "English",
    viewers: 11200,
    thumbnail: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=1200&h=675&fit=crop",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NovaPulse",
    isLive: true,
  },
  {
    id: "fs-2",
    title: "Ranked grind to Diamond — come hang!",
    streamer: "ShadowKite",
    category: "Valorant",
    language: "English",
    viewers: 8430,
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=675&fit=crop",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ShadowKite",
    isLive: true,
  },
  {
    id: "fs-3",
    title: "IRL Tokyo street food tour 🍜",
    streamer: "WanderLens",
    category: "IRL",
    language: "English",
    viewers: 6210,
    thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=675&fit=crop",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=WanderLens",
    isLive: true,
  },
];

export const recommendedChannels: Channel[] = [
  { id: "rc-1", name: "NovaPulse", category: "Just Chatting", viewers: 11200, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NovaPulse", isLive: true },
  { id: "rc-2", name: "PixelForge", category: "League of Legends", viewers: 9800, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PixelForge", isLive: true },
  { id: "rc-3", name: "BeatDrop", category: "Music", viewers: 5400, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BeatDrop", isLive: true },
  { id: "rc-4", name: "CryptoKing", category: "Slots & Casino", viewers: 3200, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoKing", isLive: true },
  { id: "rc-5", name: "ShadowKite", category: "Valorant", viewers: 8430, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ShadowKite", isLive: true },
  { id: "rc-6", name: "WanderLens", category: "IRL", viewers: 6210, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=WanderLens", isLive: true },
  { id: "rc-7", name: "TurboRacer", category: "Grand Theft Auto", viewers: 4100, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TurboRacer", isLive: true },
  { id: "rc-8", name: "MysticMage", category: "Dota 2", viewers: 2800, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MysticMage", isLive: true },
  { id: "rc-9", name: "LunaStreams", category: "Chat Roulette", viewers: 1900, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LunaStreams", isLive: true },
  { id: "rc-10", name: "NightOwl", category: "Just Chatting", viewers: 7600, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NightOwl", isLive: true },
];

export const topCategories: Category[] = [
  { id: "cat-1", name: "Just Chatting", viewers: 245000, thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=560&fit=crop", gradient: "from-violet-900/80 to-purple-950/90" },
  { id: "cat-2", name: "Grand Theft Auto", viewers: 89000, thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=560&fit=crop", gradient: "from-orange-900/80 to-red-950/90" },
  { id: "cat-3", name: "IRL", viewers: 67000, thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=560&fit=crop", gradient: "from-teal-900/80 to-cyan-950/90" },
  { id: "cat-4", name: "Slots & Casino", viewers: 52000, thumbnail: "https://images.unsplash.com/photo-1596838132731-330791c7e309?w=400&h=560&fit=crop", gradient: "from-amber-900/80 to-yellow-950/90" },
  { id: "cat-5", name: "League of Legends", viewers: 134000, thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=560&fit=crop", gradient: "from-blue-900/80 to-indigo-950/90" },
  { id: "cat-6", name: "Dota 2", viewers: 78000, thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=560&fit=crop", gradient: "from-red-900/80 to-rose-950/90" },
  { id: "cat-7", name: "Valorant", viewers: 96000, thumbnail: "https://images.unsplash.com/photo-1614294148960-9aa2726b605f?w=400&h=560&fit=crop", gradient: "from-rose-900/80 to-red-950/90" },
  { id: "cat-8", name: "Music", viewers: 43000, thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=560&fit=crop", gradient: "from-fuchsia-900/80 to-purple-950/90" },
  { id: "cat-9", name: "Chat Roulette", viewers: 21000, thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=560&fit=crop", gradient: "from-emerald-900/80 to-green-950/90" },
];

export const recommendedStreams: Stream[] = [
  { id: "rs-1", title: "Building my dream setup live!", streamer: "TechTinker", category: "Just Chatting", language: "English", viewers: 4200, thumbnail: "https://images.unsplash.com/photo-1587825140708-dfaf12aecc66?w=640&h=360&fit=crop", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechTinker", isLive: true },
  { id: "rs-2", title: "Speedrun attempts — any% world record chase", streamer: "GlitchRunner", category: "Grand Theft Auto", language: "English", viewers: 3100, thumbnail: "https://images.unsplash.com/photo-1511884642898-4c92249e20b9?w=640&h=360&fit=crop", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GlitchRunner", isLive: true },
  { id: "rs-3", title: "Acoustic session + song requests", streamer: "MelodyWave", category: "Music", language: "English", viewers: 2800, thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=640&h=360&fit=crop", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MelodyWave", isLive: true },
  { id: "rs-4", title: "High stakes blackjack night", streamer: "LuckyDraw", category: "Slots & Casino", language: "English", viewers: 5600, thumbnail: "https://images.unsplash.com/photo-1596838132731-330791c7e309?w=640&h=360&fit=crop", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LuckyDraw", isLive: true },
];

export const trendingStreams: Stream[] = [
  { id: "ts-1", title: "Pro scrims with the squad", streamer: "ApexElite", category: "Valorant", language: "English", viewers: 15200, thumbnail: "https://images.unsplash.com/photo-1614294148960-9aa2726b605f?w=640&h=360&fit=crop", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ApexElite", isLive: true },
  { id: "ts-2", title: "Patch 7.35 breakdown & ranked", streamer: "MysticMage", category: "Dota 2", language: "English", viewers: 9800, thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=640&h=360&fit=crop", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MysticMage", isLive: true },
  { id: "ts-3", title: "Random collabs — you never know who's next", streamer: "LunaStreams", category: "Chat Roulette", language: "English", viewers: 7200, thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&h=360&fit=crop", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LunaStreams", isLive: true },
  { id: "ts-4", title: "Exploring hidden gems in Seoul", streamer: "WanderLens", category: "IRL", language: "English", viewers: 8900, thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=640&h=360&fit=crop", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=WanderLens", isLive: true },
];

export const recentlyWatched: Stream[] = [
  { id: "rw-1", title: "Weekly community AMA", streamer: "NovaPulse", category: "Just Chatting", language: "English", viewers: 0, thumbnail: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=640&h=360&fit=crop", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NovaPulse", isLive: false },
  { id: "rw-2", title: "LoL ranked climb", streamer: "PixelForge", category: "League of Legends", language: "English", viewers: 0, thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PixelForge", isLive: false },
  { id: "rw-3", title: "Sunset DJ set", streamer: "BeatDrop", category: "Music", language: "English", viewers: 0, thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=640&h=360&fit=crop", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BeatDrop", isLive: false },
  { id: "rw-4", title: "Heist planning session", streamer: "TurboRacer", category: "Grand Theft Auto", language: "English", viewers: 0, thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=640&h=360&fit=crop", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TurboRacer", isLive: false },
];

export const featuredCreators: Creator[] = [
  { id: "fc-1", name: "NovaPulse", followers: 892000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NovaPulse", isLive: true, category: "Just Chatting" },
  { id: "fc-2", name: "PixelForge", followers: 654000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PixelForge", isLive: true, category: "League of Legends" },
  { id: "fc-3", name: "ShadowKite", followers: 421000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ShadowKite", isLive: true, category: "Valorant" },
  { id: "fc-4", name: "BeatDrop", followers: 312000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BeatDrop", isLive: false, category: "Music" },
  { id: "fc-5", name: "WanderLens", followers: 278000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=WanderLens", isLive: true, category: "IRL" },
  { id: "fc-6", name: "ApexElite", followers: 198000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ApexElite", isLive: true, category: "Valorant" },
];

export const chatMessages: ChatMessage[] = [
  { id: "cm-1", username: "xNightFox", color: "#FF6B9D", message: "lets goooo 🔥" },
  { id: "cm-2", username: "StreamFan42", color: "#6BCBFF", message: "this vibe is immaculate" },
  { id: "cm-3", username: "PulseMod", color: "#CCF300", message: "Welcome everyone! Be respectful in chat 💚" },
  { id: "cm-4", username: "RetroGamer", color: "#FFB347", message: "first time here, loving the energy" },
  { id: "cm-5", username: "BeatHead", color: "#B388FF", message: "song request: something chill pls" },
  { id: "cm-6", username: "NovaPulse", color: "#CCF300", message: "appreciate you all being here tonight ✨" },
  { id: "cm-7", username: "ChatKing", color: "#FF5252", message: "LUL LUL" },
  { id: "cm-8", username: "PixelPeep", color: "#69F0AE", message: "anyone else from EU?" },
  { id: "cm-9", username: "VibeCheck", color: "#40C4FF", message: "the production quality is insane" },
  { id: "cm-10", username: "LateNight", color: "#FF80AB", message: "3am gang where u at 👀" },
  { id: "cm-11", username: "ModBot", color: "#A1A1A6", message: "!socials for links" },
  { id: "cm-12", username: "HypeTrain", color: "#FFD740", message: "HYPERCLAP HYPERCLAP" },
  { id: "cm-13", username: "NewSub", color: "#84FFFF", message: "just subscribed! 🎉" },
  { id: "cm-14", username: "OldTimer", color: "#CE93D8", message: "been watching since day 1" },
  { id: "cm-15", username: "GamerGirl", color: "#FF8A80", message: "what rank are you going for?" },
  { id: "cm-16", username: "TechBro", color: "#80D8FF", message: "setup tour when?" },
  { id: "cm-17", username: "MusicLover", color: "#A5D6A7", message: "this track hits different 🎵" },
  { id: "cm-18", username: "ClipIt", color: "#FFAB40", message: "!clip that moment" },
];

export const popularCategories = topCategories.slice(0, 6);
