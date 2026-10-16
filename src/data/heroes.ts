export type HeroId =
  | "iron-man"
  | "spider-man"
  | "thor"
  | "captain-america"
  | "doctor-strange"
  | "black-panther";

export type Hero = {
  id: HeroId;
  index: string;
  name: string;
  alias: string;
  title: string;
  tagline: string;
  quote: string;
  color: string;
  accent: string;
  sfx: string;
  firstAppearance: { issue: string; date: string };
  creators: string;
  bio: string;
  powers: { label: string; value: number }[];
  abilities: string[];
  personality: string[];
  universe: { base: string; affiliations: string[]; origin: string };
};

export const HEROES: Hero[] = [
  {
    id: "iron-man",
    index: "01",
    name: "Iron Man",
    alias: "Anthony Edward Stark",
    title: "The Armored Avenger",
    tagline: "Genius. Billionaire. A heart built in a cave.",
    quote: "I am Iron Man.",
    color: "#c8161d",
    accent: "#f3b33d",
    sfx: "WHRRR!",
    firstAppearance: { issue: "Tales of Suspense #39", date: "March 1963" },
    creators: "Stan Lee, Larry Lieber, Don Heck & Jack Kirby",
    bio: "Captured and wounded, inventor Tony Stark forged a suit of armor to keep shrapnel from his heart and escape. He never stopped iterating — every crisis becomes a new prototype, every failure a new design.",
    powers: [
      { label: "Intelligence", value: 98 },
      { label: "Firepower", value: 92 },
      { label: "Flight", value: 90 },
      { label: "Durability", value: 84 },
      { label: "Speed", value: 80 },
    ],
    abilities: ["Repulsor arrays", "Unibeam", "Supersonic flight", "Nanotech armor", "Tactical AI"],
    personality: ["Brilliant", "Restless", "Sardonic", "Self-sacrificing"],
    universe: {
      base: "Stark Tower, New York",
      affiliations: ["Avengers", "Stark Industries", "Illuminati"],
      origin: "Long Island, New York",
    },
  },
  {
    id: "spider-man",
    index: "02",
    name: "Spider-Man",
    alias: "Peter Benjamin Parker",
    title: "The Friendly Neighborhood Hero",
    tagline: "Bitten by fate. Raised by responsibility.",
    quote: "With great power there must also come great responsibility.",
    color: "#d71920",
    accent: "#1d4fb8",
    sfx: "THWIP!",
    firstAppearance: { issue: "Amazing Fantasy #15", date: "August 1962" },
    creators: "Stan Lee & Steve Ditko",
    bio: "A radioactive spider bite gave a bookish teenager from Queens the proportional strength and agility of a spider. A tragedy taught him the rest: power is a promise to the people around you.",
    powers: [
      { label: "Agility", value: 97 },
      { label: "Spider-Sense", value: 95 },
      { label: "Intelligence", value: 88 },
      { label: "Speed", value: 82 },
      { label: "Strength", value: 78 },
    ],
    abilities: ["Wall-crawling", "Spider-sense", "Web-shooters", "Superhuman reflexes", "Acrobatics"],
    personality: ["Witty", "Resilient", "Guilt-driven", "Kind"],
    universe: {
      base: "Queens, New York",
      affiliations: ["Avengers", "Daily Bugle", "Fantastic Four (honorary)"],
      origin: "Forest Hills, Queens",
    },
  },
  {
    id: "thor",
    index: "03",
    name: "Thor",
    alias: "Thor Odinson",
    title: "The God of Thunder",
    tagline: "Prince of Asgard. Wielder of Mjolnir.",
    quote: "Whosoever holds this hammer, if he be worthy, shall possess the power of Thor.",
    color: "#10213a",
    accent: "#7cc4ff",
    sfx: "KRAKOOM!",
    firstAppearance: { issue: "Journey into Mystery #83", date: "August 1962" },
    creators: "Stan Lee, Larry Lieber & Jack Kirby",
    bio: "Prince of Asgard and wielder of the enchanted hammer Mjolnir. Exiled to Midgard to learn humility, the God of Thunder chose Earth as a second home — and its defense as his oath.",
    powers: [
      { label: "Strength", value: 99 },
      { label: "Durability", value: 97 },
      { label: "Energy", value: 96 },
      { label: "Combat", value: 92 },
      { label: "Flight", value: 88 },
    ],
    abilities: ["Weather control", "Mjolnir", "Godly strength", "Lightning summoning", "Dimensional travel"],
    personality: ["Noble", "Boisterous", "Fearless", "Loyal"],
    universe: {
      base: "Asgard & Midgard",
      affiliations: ["Avengers", "House of Odin", "Warriors Three"],
      origin: "Asgard",
    },
  },
  {
    id: "captain-america",
    index: "04",
    name: "Captain America",
    alias: "Steven Grant Rogers",
    title: "The Sentinel of Liberty",
    tagline: "A kid from Brooklyn who never backs down.",
    quote: "I can do this all day.",
    color: "#1b3f8f",
    accent: "#e8202a",
    sfx: "KLANGG!",
    firstAppearance: { issue: "Captain America Comics #1", date: "March 1941" },
    creators: "Joe Simon & Jack Kirby",
    bio: "A frail volunteer transformed by the Super-Soldier Serum, frozen in ice, and revived decades later. Steve Rogers carries a vibranium-alloy shield and a stubborn belief that ordinary people deserve a defender.",
    powers: [
      { label: "Leadership", value: 99 },
      { label: "Combat", value: 96 },
      { label: "Agility", value: 88 },
      { label: "Durability", value: 82 },
      { label: "Strength", value: 80 },
    ],
    abilities: ["Super-Soldier physiology", "Shield mastery", "Tactical genius", "Hand-to-hand combat", "Peak endurance"],
    personality: ["Principled", "Steadfast", "Humble", "Inspiring"],
    universe: {
      base: "Brooklyn, New York",
      affiliations: ["Avengers", "Howling Commandos", "S.H.I.E.L.D."],
      origin: "Brooklyn, New York",
    },
  },
  {
    id: "doctor-strange",
    index: "05",
    name: "Doctor Strange",
    alias: "Stephen Vincent Strange",
    title: "The Sorcerer Supreme",
    tagline: "A surgeon's hands. A master's mind.",
    quote: "We're in the endgame now.",
    color: "#2a0f3d",
    accent: "#ff8a1f",
    sfx: "SHAZZZ!",
    firstAppearance: { issue: "Strange Tales #110", date: "July 1963" },
    creators: "Steve Ditko & Stan Lee",
    bio: "A brilliant, arrogant neurosurgeon lost the use of his hands and found the Ancient One instead. Now Earth's foremost defender against mystic threats, he guards reality from the Sanctum Sanctorum.",
    powers: [
      { label: "Sorcery", value: 99 },
      { label: "Dimensions", value: 96 },
      { label: "Intelligence", value: 93 },
      { label: "Energy", value: 90 },
      { label: "Combat", value: 70 },
    ],
    abilities: ["Eye of Agamotto", "Astral projection", "Sling Ring portals", "Cloak of Levitation", "Mystic shields"],
    personality: ["Disciplined", "Proud", "Cerebral", "Protective"],
    universe: {
      base: "177A Bleecker Street, New York",
      affiliations: ["Avengers", "Masters of the Mystic Arts", "Defenders"],
      origin: "Philadelphia, Pennsylvania",
    },
  },
  {
    id: "black-panther",
    index: "06",
    name: "Black Panther",
    alias: "T'Challa",
    title: "The King of Wakanda",
    tagline: "Warrior. Scientist. King.",
    quote: "Wakanda forever!",
    color: "#121014",
    accent: "#9b6bff",
    sfx: "SHNNK!",
    firstAppearance: { issue: "Fantastic Four #52", date: "July 1966" },
    creators: "Stan Lee & Jack Kirby",
    bio: "Ruler of the hidden, technologically unmatched nation of Wakanda. Empowered by the heart-shaped herb and a vibranium weave suit, T'Challa balances the duties of a king with the instincts of a protector.",
    powers: [
      { label: "Stealth", value: 96 },
      { label: "Combat", value: 95 },
      { label: "Intelligence", value: 94 },
      { label: "Agility", value: 92 },
      { label: "Durability", value: 85 },
    ],
    abilities: ["Vibranium suit", "Kinetic absorption", "Enhanced senses", "Master strategist", "Vibranium claws"],
    personality: ["Regal", "Calculated", "Honorable", "Reserved"],
    universe: {
      base: "Birnin Zana, Wakanda",
      affiliations: ["Avengers", "Wakandan Throne", "Illuminati"],
      origin: "Wakanda",
    },
  },
];

export type Moment = {
  year: string;
  issue: string;
  title: string;
  body: string;
  hero: HeroId;
};

export const MOMENTS: Moment[] = [
  {
    year: "1941",
    issue: "Captain America Comics #1",
    title: "A Shield Is Raised",
    body: "Joe Simon and Jack Kirby debut a star-spangled super-soldier — famously punching a dictator on the cover months before America entered the war.",
    hero: "captain-america",
  },
  {
    year: "1962",
    issue: "Amazing Fantasy #15",
    title: "With Great Power",
    body: "In the final issue of a cancelled anthology, Stan Lee and Steve Ditko introduce a teenage hero with everyday problems. Comics never recover.",
    hero: "spider-man",
  },
  {
    year: "1962",
    issue: "Journey into Mystery #83",
    title: "The Thunder God Falls",
    body: "Lame physician Donald Blake strikes a walking stick in a cave in Norway — and becomes the Mighty Thor.",
    hero: "thor",
  },
  {
    year: "1963",
    issue: "Tales of Suspense #39",
    title: "Forged in a Cave",
    body: "Tony Stark builds his first suit — grey, bulky and brilliant. The golden armor follows an issue later; the red-and-gold arrives before the year is out.",
    hero: "iron-man",
  },
  {
    year: "1963",
    issue: "Strange Tales #110",
    title: "Master of the Mystic Arts",
    body: "Steve Ditko's impossible dimensions open a new door in comics — a sorcerer who guards reality itself.",
    hero: "doctor-strange",
  },
  {
    year: "1963",
    issue: "The Avengers #1",
    title: "Earth's Mightiest Heroes",
    body: "Iron Man, Thor, Hulk, Ant-Man and the Wasp unite against Loki. Captain America is thawed out and joins in issue #4.",
    hero: "iron-man",
  },
  {
    year: "1966",
    issue: "Fantastic Four #52",
    title: "The King Arrives",
    body: "Stan Lee and Jack Kirby introduce T'Challa, ruler of Wakanda — the first Black superhero in mainstream American comics.",
    hero: "black-panther",
  },
];

export const heroById = (id: HeroId) => HEROES.find((h) => h.id === id)!;
