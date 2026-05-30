export const CATEGORIES = [
  { slug: "gazdasag", hu: "Gazdaság", en: "Economy" },
  { slug: "kultura", hu: "Kultúra", en: "Culture" },
  { slug: "kozelet", hu: "Közélet", en: "Public Life" },
  { slug: "sport", hu: "Sport", en: "Sport" },
  { slug: "turizmus", hu: "Turizmus", en: "Tourism" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const CITIES = [
  "Abony","Alsónémedi","Aszód","Biatorbágy","Budajenő","Budakalász","Budakeszi","Budaörs",
  "Cegléd","Csemő","Csömör","Dabas","Diósd","Dunaharaszti","Dunakeszi","Ecser","Érd","Fót",
  "Galgahévíz","Göd","Gödöllő","Gomba","Gyál","Halásztelek","Hévízgyörk","Ikland","Isaszeg",
  "Jászkarajenő","Kistarcsa","Kocsér","Kóspallag","Mogyoród","Nagykáta","Nagykőrös","Nagytarcsa",
  "Páty","Pécel","Perbál","Pilis","Pilisborosjenő","Piliscsaba","Pócsmegyer","Pomáz","Ráckeve",
  "Százhalombatta","Szentendre","Szigetbecse","Szigetcsép","Szigethalom","Szigetszentmárton",
  "Szigetszentmiklós","Szob","Taksony","Tápiószecső","Tápiószele","Tinnye","Tök","Tököl",
  "Törökbálint","Tura","Újhartyán","Újszilvás","Üllő","Vác","Vácrátót","Vecsés","Veresegyház",
  "Visegrád","Zebegény","Zsámbék","Zsámbok",
];

export const slugifyCity = (name: string) =>
  name
    .toLowerCase()
    .replaceAll("á", "a").replaceAll("é", "e").replaceAll("í", "i")
    .replaceAll("ó", "o").replaceAll("ö", "o").replaceAll("ő", "o")
    .replaceAll("ú", "u").replaceAll("ü", "u").replaceAll("ű", "u")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export interface Article {
  id: string;
  titleHu: string;
  titleEn: string;
  excerptHu: string;
  excerptEn: string;
  bodyHu: string;
  bodyEn: string;
  category: CategorySlug;
  city: string;
  author: string;
  date: string;
  image: string;
}

const img = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?w=1200&q=80&auto=format&fit=crop`;

export const ARTICLES: Article[] = [
  {
    id: "1", category: "gazdasag", city: "Érd", author: "Kovács Anna", date: "2026-05-20",
    titleHu: "Új ipari park nyílik Érden", titleEn: "New industrial park opens in Érd",
    excerptHu: "Több mint ezer új munkahelyet teremt a beruházás.",
    excerptEn: "The investment creates over a thousand new jobs.",
    bodyHu: "Pest megye egyik legjelentősebb beruházása indul el Érden, ahol egy 40 hektáros ipari park épül modern logisztikai és gyártóüzemekkel. A projekt várhatóan 2027 nyarára készül el.",
    bodyEn: "One of Pest County's most significant investments is launching in Érd, where a 40-hectare industrial park is being built with modern logistics and manufacturing facilities. The project is expected to be completed by summer 2027.",
    image: img("1486406146926-c627a92ad1ab"),
  },
  {
    id: "2", category: "kultura", city: "Szentendre", author: "Nagy Péter", date: "2026-05-22",
    titleHu: "Skanzen nyári fesztivál Szentendrén", titleEn: "Skanzen summer festival in Szentendre",
    excerptHu: "Hagyományőrző programok és koncertek várják a látogatókat.",
    excerptEn: "Traditional programs and concerts await visitors.",
    bodyHu: "A Szabadtéri Néprajzi Múzeum minden hétvégén színes programokkal várja a családokat: népi mesterségek bemutatója, néptáncgálák és gasztronómiai bemutatók színesítik a nyarat.",
    bodyEn: "The Open-Air Ethnographic Museum welcomes families every weekend with colorful programs: folk craft demonstrations, dance galas and gastronomic showcases color the summer.",
    image: img("1533174072545-7a4b6ad7a6c3"),
  },
  {
    id: "3", category: "kozelet", city: "Vác", author: "Szabó Júlia", date: "2026-05-24",
    titleHu: "Új kerékpárút épül Vác és Göd között", titleEn: "New bike path between Vác and Göd",
    excerptHu: "12 kilométeres szakasszal bővül a Duna-menti kerékpáros hálózat.",
    excerptEn: "The Danube cycling network expands by a 12-kilometer section.",
    bodyHu: "A beruházás célja, hogy biztonságos közlekedési alternatívát kínáljon a térségben élőknek és a turistáknak egyaránt. Az építkezés ősszel indul.",
    bodyEn: "The aim is to provide a safe transportation alternative for both residents and tourists. Construction begins in the autumn.",
    image: img("1502920917128-1aa500764cbd"),
  },
  {
    id: "4", category: "sport", city: "Gödöllő", author: "Tóth László", date: "2026-05-25",
    titleHu: "Gödöllői atléta olimpiai kvótát szerzett", titleEn: "Gödöllő athlete wins Olympic quota",
    excerptHu: "A fiatal tehetség egyéni csúcsával jutott ki.",
    excerptEn: "The young talent qualified with a personal best.",
    bodyHu: "A városi sportegyesület büszke nevelése magasugrásban érte el a kvalifikációs szintet a budapesti versenyen.",
    bodyEn: "The local club's proud product reached the qualifying mark in high jump at the Budapest competition.",
    image: img("1546519638-68e109498ffc"),
  },
  {
    id: "5", category: "turizmus", city: "Visegrád", author: "Horváth Eszter", date: "2026-05-26",
    titleHu: "Rekordszámú turista a Visegrádi Fellegvárban", titleEn: "Record number of tourists at Visegrád Citadel",
    excerptHu: "Április óta 30%-kal nőtt a látogatószám.",
    excerptEn: "Visitor numbers have grown 30% since April.",
    bodyHu: "A megújult kiállítótermek és a panorámaterasz vonzza a hazai és külföldi vendégeket egyaránt. A vár új interaktív élményközpontja idén ősszel nyit.",
    bodyEn: "The renovated exhibition halls and panoramic terrace attract both domestic and foreign guests. The castle's new interactive experience center opens this autumn.",
    image: img("1467269204594-9661b134dd2b"),
  },
  {
    id: "6", category: "gazdasag", city: "Budaörs", author: "Kiss Márton", date: "2026-05-18",
    titleHu: "Tech-vállalat új székházat épít Budaörsön", titleEn: "Tech company builds new HQ in Budaörs",
    excerptHu: "A 8 emeletes irodaház 2027-ben készül el.",
    excerptEn: "The 8-story office building will be completed in 2027.",
    bodyHu: "A nemzetközi szoftvercég Budaörs új üzleti negyedében hozza létre régiós központját, közel 800 munkavállalót foglalkoztatva.",
    bodyEn: "The international software company is establishing its regional center in Budaörs' new business district, employing nearly 800 people.",
    image: img("1497366216548-37526070297c"),
  },
  {
    id: "7", category: "kultura", city: "Vác", author: "Nagy Péter", date: "2026-05-19",
    titleHu: "Váci Tavaszi Fesztivál: rekord látogatottság", titleEn: "Vác Spring Festival: record attendance",
    excerptHu: "Több mint 20 ezer látogató a háromnapos rendezvényen.",
    excerptEn: "Over 20,000 visitors at the three-day event.",
    bodyHu: "A belváros sétálóutcái megteltek koncertekkel, gasztronómiai standokkal és kézműves vásárral.",
    bodyEn: "The pedestrian streets of downtown filled with concerts, food stalls and a craft fair.",
    image: img("1514525253161-7a46d19cd819"),
  },
  {
    id: "8", category: "sport", city: "Dunakeszi", author: "Tóth László", date: "2026-05-21",
    titleHu: "Új sportcsarnok átadása Dunakeszin", titleEn: "New sports hall opens in Dunakeszi",
    excerptHu: "1500 fős multifunkciós létesítmény szolgálja a várost.",
    excerptEn: "A 1,500-seat multifunctional facility serves the city.",
    bodyHu: "A modern sportcsarnok kézilabda, kosárlabda és röplabda mérkőzéseknek is otthont ad majd, emellett koncerthelyszínként is funkcionál.",
    bodyEn: "The modern sports hall will host handball, basketball and volleyball matches, and also functions as a concert venue.",
    image: img("1505666287802-931582b5ac0c"),
  },
];
