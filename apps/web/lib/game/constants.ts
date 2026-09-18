import type {
  DifficultyConfig,
  DifficultyId,
  GameModeConfig,
  GameModeId,
  PowerUpConfig,
  SymbolAsset,
  ThemeConfig,
} from "./types";

export const DIFFICULTIES: Record<DifficultyId, DifficultyConfig> = {
  beginner: {
    id: "beginner",
    label: "Casual",
    rows: 4,
    cols: 4,
    timeLimitSeconds: 60,
    xpOnClear: 100,
  },
  normal: {
    id: "normal",
    label: "Tactical",
    rows: 6,
    cols: 6,
    timeLimitSeconds: 90,
    xpOnClear: 150,
  },
  expert: {
    id: "expert",
    label: "Expert",
    rows: 8,
    cols: 8,
    timeLimitSeconds: 120,
    xpOnClear: 300,
  },
  master: {
    id: "master",
    label: "Master",
    rows: 10,
    cols: 10,
    timeLimitSeconds: 180,
    xpOnClear: 600,
  },
};

export const DIFFICULTY_ORDER: DifficultyId[] = [
  "beginner",
  "normal",
  "expert",
  "master",
];

export const GAME_MODES: Record<GameModeId, GameModeConfig> = {
  classic: {
    id: "classic",
    label: "Classic Match",
    tagline: "Flip tiles, identify matching symbols, and clear the entire board before the clock expires.",
    badge: "ACTIVE SELECTION",
    footerNote: "Standard Timer",
  },
  "time-rush": {
    id: "time-rush",
    label: "Time Rush",
    tagline: "Rapid-fire reflex mode. The board starts with a short 30s clock — each accurate pair adds +3 seconds.",
    badge: "2.0X MULTIPLIER",
    footerNote: "Dynamic Clock",
  },
  zen: {
    id: "zen",
    label: "Zen / Relaxed",
    tagline: "Zero countdown stress. Solve at your own natural pace to warm up visual memory and unwind.",
    badge: "NO PRESSURE",
    footerNote: "Untimed",
  },
};

export const GAME_MODE_ORDER: GameModeId[] = ["classic", "time-rush", "zen"];

export const TIME_RUSH_START_SECONDS = 30;
export const TIME_RUSH_BONUS_SECONDS = 3;

/** Turns "mecha_bull_minotaur" into "Mecha Bull Minotaur" for labels/aria-text. */
function titleCaseFromFileName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildSymbolSet(folder: string, fileNames: string[]): SymbolAsset[] {
  return fileNames.map((fileName) => ({
    id: `${folder}-${fileName.replace(/\.[^.]+$/, "")}`,
    name: titleCaseFromFileName(fileName),
    src: `/images/${folder}/${fileName}`,
  }));
}

// Each set below has ~30 distinct symbols per theme — enough that Beginner
// through Expert grids never need to repeat an image at all, and Master
// (50 pairs) only repeats a handful. Real picture variety, not a handful of
// icons cycled with a hidden "variant 2" label the player can't see.
const CYBER_BEASTS_FILES = [
  "bear.png", "chameleon.png", "cobra_snake.png", "crocodile_alligator.png",
  "dragon.png", "dragonfly.png", "eagle.png", "falcon.png", "gorilla_ape.png",
  "jellyfish.png", "lion.png", "manta_ray.png", "mecha_bull_minotaur.png",
  "octopus_kraken.png", "owl.png", "panther.png", "pegasus_winged.png",
  "phoenix.png", "plasma_mantis.png", "raven.png", "rhinoceros.png",
  "scorpion.png", "shark.png", "spider.png", "stag_elk.png", "stagbeetle.png",
  "tiger.png", "turtle_tortoise.png", "viper.png", "wolfhound_canine.png",
];

const COSMIC_SPACE_FILES = [
  "alien_exoplanet.png", "asteroid_belt.png", "astronaunt_explorer_helmet.png",
  "binary_star.png", "black_hole.png", "blazing_solar_un.png",
  "celestial_comet_collision.png", "comet_meteor.png",
  "cosmic_celestial_hourglass.png", "dark_matter_quantum_cloud.png",
  "deep_space_orbital_shipyard_station.png",
  "deep_space_satellite_probe_telescope.png", "dyson_sphere_megastructure.png",
  "interstellar_nebula.png", "interstellar_space_beacon_buoy.png",
  "magnetic_magnetar_star.png", "monolith_artifact.png",
  "orbital_space_station_citadel.png", "planetary_eclipse_icon.png",
  "planetary_ring_system.png", "planetary_terraforming_coloney_dome.png",
  "pulsar_neutron_star.png", "quantum_warp_drive_hyper_core.png",
  "quasar_core.png", "solar_sail_starship.png", "spiral_galaxy.png",
  "stellar_nursey_protostar.png", "supernova_stellar_explosion.png",
  "warp_gate_portal.png", "wormhole_stargate.png",
];

const NEON_FLORA_FILES = [
  "agave_succulent_plant.png", "anemone_sea_flower.png", "bamboo_grove_shoot.png",
  "belladonna_deadly_nightshade_berry.png", "bioluminescent.png",
  "bioluminescent_dandelion.png", "bird_of_paradise_flower.png",
  "bleeding_heart_flower.png", "bonsai_tree.png", "chrysanthemums_blossom.png",
  "crystalline_cyber_succulent_cactus.png", "fern_frond_spiral_fiddlehead.png",
  "ghost_orchid.png", "iris_flower.png", "jacaranda_blossom_cluster.png",
  "lotus_flower_icon.png", "mecha_venus_flytrap.png",
  "monstera_deliciosa_leaf.png", "morning_glory_flower.png", "orchid_blossom.png",
  "passionflower_passiflora.png", "pitcher_plant_nepenthes.png", "poppy_flower.png",
  "rafflesia_giant_blossom.png", "robotic_cyber_rose.png",
  "sakura_cherry_blossom_branch.png", "solar_cyber_sunflower.png",
  "sundew_drosera_carnivorous.png", "water_lily_pad.png",
  "weeping_cyber_fern_frond.png",
];

export const THEMES: Record<string, ThemeConfig> = {
  "cyber-beasts": {
    id: "cyber-beasts",
    label: "Cyber Beasts",
    tagline: "Neon cybernetic wolf & fox totems",
    badge: "POPULAR",
    preview: "/images/wolf_icon.png",
    symbols: buildSymbolSet("cyber-beasts", CYBER_BEASTS_FILES),
  },
  "cosmic-space": {
    id: "cosmic-space",
    label: "Cosmic Space",
    tagline: "Luminescent rings, nebulae & orbital stations",
    badge: "PLANETS",
    preview: "/images/planet.png",
    symbols: buildSymbolSet("cosmic-space", COSMIC_SPACE_FILES),
  },
  "solar-relics": {
    id: "solar-relics",
    label: "Solar Relics",
    tagline: "Golden blaze dragons & hex sun sigils",
    badge: "MYTHIC",
    preview: "/images/dragon_fruit_icon.png",
    symbols: [
      { id: "dragon", name: "Solar Dragon", src: "/images/dragon_fruit_icon.png" },
      { id: "apple", name: "Emerald Core", src: "/images/apple_fruit.png" },
      { id: "strawberry", name: "Ruby Shard", src: "/images/strawberry_fruit.png" },
    ],
  },
  "neon-flora": {
    id: "neon-flora",
    label: "Neon Flora",
    tagline: "Bioluminescent lotus blossoms & vines",
    badge: "BOTANICAL",
    preview: "/images/lotus_flower.png",
    symbols: buildSymbolSet("neon-flora", NEON_FLORA_FILES),
  },
};

export const THEME_ORDER = [
  "cyber-beasts",
  "cosmic-space",
  "solar-relics",
  "neon-flora",
] as const;

export const POWER_UPS: Record<string, PowerUpConfig> = {
  peek: {
    id: "peek",
    label: "Peek",
    description: "Briefly reveal all unmatched cards for 1.5s.",
    charges: 2,
  },
  freeze: {
    id: "freeze",
    label: "Freeze",
    description: "Pause the countdown clock for 5 seconds.",
    charges: 1,
  },
  shuffle: {
    id: "shuffle",
    label: "Shuffle",
    description: "Shuffle the positions of all unmatched cards.",
    charges: 1,
  },
  hint: {
    id: "hint",
    label: "Hint",
    description: "Highlight one guaranteed matching pair.",
    charges: 2,
  },
};

export const POWER_UP_ORDER = ["peek", "freeze", "shuffle", "hint"] as const;

export const SCORING = {
  baseMatchPoints: 100,
  comboMultiplierStep: 1,
  maxCombo: 4,
  speedBonusThresholdMs: 3000,
  speedBonusPoints: 40,
  mismatchPenaltySeconds: 2,
  revealDurationMs: 550,
  mismatchHoldMs: 700,
  hideAnimationMs: 320,
};

export const AVATAR_PRESETS = [
  { id: "wolf", src: "/images/wolf_icon.png", label: "Cyber Wolf" },
  { id: "lotus", src: "/images/lotus_flower.png", label: "Memory Lotus" },
  { id: "gamer", src: "/images/gamer_character.png", label: "Neon Valkyrie" },
  { id: "fox", src: "/images/neon_fox.png", label: "Neon Fox" },
] as const;

export function getAvatarSrc(avatarId: string): string {
  return AVATAR_PRESETS.find((a) => a.id === avatarId)?.src ?? AVATAR_PRESETS[0].src;
}
