import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const kpopGroups = [
  {
    name: "BTS",
    slug: "bts",
    agency: "HYBE",
    debutYear: 2013,
    members: ["RM", "Jin", "SUGA", "j-hope", "Jimin", "V", "Jungkook"],
    description: "One of the biggest K-pop acts globally.",
  },
  {
    name: "BLACKPINK",
    slug: "blackpink",
    agency: "YG Entertainment",
    debutYear: 2016,
    members: ["Jisoo", "Jennie", "Rosé", "Lisa"],
    description: "Global icons of 4th gen K-pop.",
  },
  {
    name: "TWICE",
    slug: "twice",
    agency: "JYP Entertainment",
    debutYear: 2015,
    members: [
      "Nayeon",
      "Jeongyeon",
      "Momo",
      "Sana",
      "Jihyo",
      "Mina",
      "Dahyun",
      "Chaeyoung",
      "Tzuyu",
    ],
    description: "Queens of cute & lovely concepts.",
  },
  {
    name: "EXO",
    slug: "exo",
    agency: "SM Entertainment",
    debutYear: 2012,
    members: [
      "Xiumin",
      "Suho",
      "Lay",
      "Baekhyun",
      "Chen",
      "Chanyeol",
      "D.O.",
      "Kai",
      "Sehun",
    ],
    description: "Legendary SM group.",
  },
  {
    name: "NCT 127",
    slug: "nct-127",
    agency: "SM Entertainment",
    debutYear: 2016,
    members: [
      "Taeil",
      "Johnny",
      "Taeyong",
      "Yuta",
      "Doyoung",
      "Jaehyun",
      "Jungwoo",
      "Mark",
      "Haechan",
    ],
    description: "Seoul-based unit of NCT.",
  },
  {
    name: "aespa",
    slug: "aespa",
    agency: "SM Entertainment",
    debutYear: 2020,
    members: ["Karina", "Giselle", "Winter", "Ningning"],
    description: "Metaverse concept girl group.",
  },
  {
    name: "ITZY",
    slug: "itzy",
    agency: "JYP Entertainment",
    debutYear: 2019,
    members: ["Yeji", "Lia", "Ryujin", "Chaeryeong", "Yuna"],
    description: "Known for fierce, confident concepts.",
  },
  {
    name: "Stray Kids",
    slug: "stray-kids",
    agency: "JYP Entertainment",
    debutYear: 2018,
    members: [
      "Bang Chan",
      "Lee Know",
      "Changbin",
      "Hyunjin",
      "Han",
      "Felix",
      "Seungmin",
      "I.N",
    ],
    description: "Self-producing boy group.",
  },
  {
    name: "SEVENTEEN",
    slug: "seventeen",
    agency: "PLEDIS Entertainment",
    debutYear: 2015,
    members: [
      "S.Coups",
      "Jeonghan",
      "Joshua",
      "Jun",
      "Hoshi",
      "Wonwoo",
      "Woozi",
      "DK",
      "Mingyu",
      "The8",
      "Seungkwan",
      "Vernon",
      "Dino",
    ],
    description: "13-member self-producing group.",
  },
  {
    name: "NewJeans",
    slug: "newjeans",
    agency: "ADOR",
    debutYear: 2022,
    members: ["Minji", "Hanni", "Danielle", "Haerin", "Hyein"],
    description: "Y2K aesthetic and retro-pop vibes.",
  },
  {
    name: "IVE",
    slug: "ive",
    agency: "Starship Entertainment",
    debutYear: 2021,
    members: ["Yujin", "Gaeul", "Rei", "Wonyoung", "Liz", "Leeseo"],
    description: "Known for powerful girl crush concepts.",
  },
  {
    name: "LE SSERAFIM",
    slug: "le-sserafim",
    agency: "SOURCE MUSIC",
    debutYear: 2022,
    members: ["Chaewon", "Sakura", "Yunjin", "Kazuha", "Eunchae"],
    description: "Fearless girl group.",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  for (const group of kpopGroups) {
    await prisma.kpopGroup.upsert({
      where: { slug: group.slug },
      update: {},
      create: {
        name: group.name,
        slug: group.slug,
        agency: group.agency,
        debutYear: group.debutYear,
        members: group.members,
        description: group.description,
      },
    });
  }

  console.log(`✅ Seeded ${kpopGroups.length} K-pop groups`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
