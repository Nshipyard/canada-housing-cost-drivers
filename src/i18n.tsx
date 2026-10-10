"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Lang = "en" | "fr";

const en = {
  banner: {
    line: "An open-source civic project. Not affiliated with the Government of Canada or the City of Toronto.",
    badge: "Open source",
  },
  nav: { chart: "Chart", drivers: "Drivers", levers: "Policy levers", sources: "Sources", data: "Data", back: "All projects" },
  hero: {
    kicker: "Open Nshipyard Canada · Housing cost drivers",
    title: "What drove Toronto's 4.6x construction-cost rise?",
    sub: "We split Toronto's new-house price index into house-only and land-only, then matched the house-only series against union wages, materials prices, and building prices from 1981 to 2026. Union construction wages rose 4.55x, tracking the 4.64x construction-cost rise almost exactly. Materials rose less: fabricated metal 4.01x, concrete 3.66x, lumber 3.11x.",
    cta1: "See the chart",
    cta2: "Read the sources",
  },
  stats: [
    { value: "4.64x", label: "rise in the house-only (construction cost) component of Toronto's New Housing Price Index, 1981 to 2026" },
    { value: "4.55x", label: "rise in Toronto union construction wages including supplements, 1981 to 2026; the closest tracker of the 4.64x construction-cost rise" },
    { value: "4.01x", label: "rise in fabricated metal products, the fastest-rising major material nationally, still below construction costs" },
    { value: "3 gaps", label: "drivers with no open StatCan series: development charges, code-compliance costs, Toronto-residential productivity" },
  ],
  chart: {
    kicker: "The decomposition",
    title: "Wages tracked construction costs. Materials did not.",
    body: "All series rebased to 1981=100. Toronto union construction wages (including supplements) move with the house-only construction-cost index across the full 45 years, ending at 4.55x against 4.64x. National materials prices sit below both: fabricated metal 4.01x, concrete 3.66x, lumber 3.11x with a sharp 2021-2022 spike, total industrial prices 3.12x.",
    legend: [
      { key: "nhpi", label: "Construction costs (NHPI house-only, Toronto CMA)" },
      { key: "cuwr", label: "Union construction wages (Toronto CMA, proxy)" },
      { key: "metal", label: "Fabricated metal products (national)" },
      { key: "concrete", label: "Ready-mix concrete (national)" },
      { key: "lumber", label: "Softwood lumber (national)" },
      { key: "ippi", label: "All industrial products (national)" },
    ],
    chartNote: "IPPI series are national factory-gate producer prices, shown as upstream input-price shocks, not Toronto builder costs. Lumber January values are volatile; the 2021-2022 spike is flagged in the data file.",
    shortTitle: "Shorter windows, shown separately",
    shortBody: "These series cannot start in 1981, so they are shown on their own base and never stretched. StatCan's residential building-type detail begins in 2017; detailed iron and steel products begin in 2010.",
    bcpiTitle: "Toronto residential building prices, 2017=100",
    bcpiNote: "Single-detached 2.33x and townhouse 2.32x, 2017 to 2026, with the house-only index rebased to 2017=100 for comparison.",
    steelTitle: "Iron and steel products, 2010=100, national",
    steelNote: "Basic and semi-finished iron or steel products rose 1.54x from 2010 to 2026, below total industrial prices at 1.64x over the same window.",
  },
  drivers: {
    kicker: "Driver ranking",
    title: "Five drivers, ranked by evidence.",
    body: "Each driver carries one sourced number. Where the evidence comes from industry surveys instead of a Statistics Canada series, the panel says so plainly.",
    openBadge: "Open series",
    surveyBadge: "No open series",
    items: [
      {
        title: "Productivity stagnation",
        body: "Residential construction output per hour in 2024 sat about 8% below its 2000 level, falling roughly 0.4% per year; CMHC estimates lost productivity added $6-8B to housing construction costs, up to 20% of the price rise.",
        badge: "No open series: CSLS and CMHC analytical reports, not a downloadable Toronto-residential series.",
      },
      {
        title: "Labour and wage costs",
        body: "Toronto union construction wages including supplements rose 4.55x from 1981 to 2026, tracking the 4.64x construction-cost rise almost exactly; the national construction job vacancy rate peaked at 8.3% in April 2022.",
        badge: "Open series: StatCan 18-10-0140-01, Toronto CMA. Union wage-scale proxy, not all-worker earnings.",
      },
      {
        title: "Materials",
        body: "Fabricated metal products rose 4.01x and ready-mix concrete 3.66x nationally since 1981, both below the 4.64x construction-cost rise; softwood lumber rose 3.11x with a sharp 2021-2022 spike that later receded.",
        badge: "Open series: StatCan 18-10-0266-01, national factory-gate prices, not builder acquisition cost.",
      },
      {
        title: "Codes and approval delays",
        body: "Toronto's development approval backlog grew from 21 months in 2020 to a 32-month weighted average in 2022; CHBA estimates 2025 code changes could add over $100,000 to a typical 2,500 sq ft home.",
        badge: "No open series: CHBA and Altus Group surveys, not a government statistical program.",
      },
      {
        title: "Development charges and fees",
        body: "Development taxes, fees and levies rose about 700% over two decades, averaging about $82,600 per low-rise unit in 2024, up $27,500 since 2022.",
        badge: "No open series: CHBA municipal benchmarking surveys for 2022 and 2024.",
      },
    ],
  },
  levers: {
    kicker: "What this means",
    title: "Three levers the data points to.",
    items: [
      {
        title: "Speed up approvals.",
        body: "Toronto's approval backlog reached a 32-month weighted average in 2022; every month of delay adds carrying costs that compound into the final price.",
      },
      {
        title: "Rebuild productivity.",
        body: "Output per hour fell about 0.4% per year from 2000 to 2024; factory-built and modular methods attack the largest structural driver directly.",
      },
      {
        title: "Publish the fees.",
        body: "No open series tracks development charges over time; a public longitudinal series would let every municipality's fee burden be compared and debated.",
      },
    ],
  },
  sources: {
    kicker: "Sources",
    title: "Every number has a table.",
    body: "All index series come from Statistics Canada -01 level tables, extracted 2026-10-10 and rebased as documented in the data file. Driver research came from three Keenable SELECT reports run 2026-10-10.",
    tables: [
      { id: "18-10-0205-01", desc: "New Housing Price Index levels, house-only and land-only, Toronto CMA, monthly 1981-2026; January panel used." },
      { id: "18-10-0140-01", desc: "Construction union wage rate indexes including selected pay supplements, composite, Toronto, monthly 1971 to latest; January panel used." },
      { id: "18-10-0266-01", desc: "Industrial product price indexes by product, national, monthly; softwood lumber, fabricated metal products, ready-mix concrete, iron and steel, total." },
      { id: "18-10-0289-01", desc: "Building construction price indexes by building type, Toronto CMA, quarterly; single-detached and townhouse from Q1 2017; Q1 panel used." },
    ],
    gapsTitle: "What open data cannot answer",
    gaps: [
      "Development charges and municipal fees: no StatCan longitudinal series exists for any period; the 700% figure comes from CHBA benchmarking surveys.",
      "Building-code compliance costs: no open series; the $100,000-per-home estimate is a CHBA industry figure.",
      "Toronto-residential productivity 1981-2026: no downloadable series; the cited facts come from CSLS and CMHC analytical reports.",
      "Contractor profit margins: baked into the BCPI selling-price concept, never published separately.",
    ],
    keenable: "Driver research: three Keenable SELECT reports (25, 39, and 55 evidence rows) run 2026-10-10, covering cost drivers, the StatCan table catalogue, and normalization fixes.",
  },
  downloads: {
    kicker: "Data",
    title: "Take the files.",
    body: "The driver series with metadata and the build note, MIT licensed, as JSON and Markdown.",
    files: [
      { name: "drivers.json", desc: "Nine rebased series with table IDs, vectors, geography, and coverage" },
      { name: "BUILD_NOTE.md", desc: "How the series were built, what could not be built, and the caveats" },
    ],
    download: "Download",
  },
  footer: {
    line: "An open-source civic project. Not affiliated with the Government of Canada or the City of Toronto.",
    sources: "Construction costs and wages: StatCan tables 18-10-0205-01, 18-10-0140-01, 18-10-0266-01, 18-10-0289-01. Driver research: Keenable SELECT, 2026-10-10.",
  },
};

export type Dict = typeof en;

const fr: Dict = {
  banner: {
    line: "Un projet civique à code source ouvert. Sans affiliation avec le gouvernement du Canada ni la Ville de Toronto.",
    badge: "Code source ouvert",
  },
  nav: { chart: "Graphique", drivers: "Facteurs", levers: "Leviers", sources: "Sources", data: "Données", back: "Tous les projets" },
  hero: {
    kicker: "Nshipyard Canada · Facteurs des coûts du logement",
    title: "Qu'est-ce qui a fait grimper de 4,6x les coûts de construction à Toronto?",
    sub: "Nous avons scindé l'Indice des prix des logements neufs de Toronto en composantes maison seule et terrain seul, puis comparé la série maison seule aux salaires syndicaux, aux prix des matériaux et aux prix des bâtiments de 1981 à 2026. Les salaires syndicaux de la construction ont augmenté de 4,55x, suivant presque exactement la hausse de 4,64x des coûts de construction. Les matériaux ont moins augmenté : produits métalliques fabriqués 4,01x, béton 3,66x, bois d'œuvre 3,11x.",
    cta1: "Voir le graphique",
    cta2: "Lire les sources",
  },
  stats: [
    { value: "4,64x", label: "hausse de la composante maison seule (coût de construction) de l'Indice des prix des logements neufs de Toronto, 1981 à 2026" },
    { value: "4,55x", label: "hausse des salaires syndicaux de la construction à Toronto, suppléments compris, 1981 à 2026; le plus proche indicateur de la hausse de 4,64x des coûts de construction" },
    { value: "4,01x", label: "hausse des produits métalliques fabriqués, le matériau majeur à la plus forte hausse à l'échelle nationale, toujours sous les coûts de construction" },
    { value: "3 lacunes", label: "facteurs sans série ouverte de StatCan : droits d'aménagement, coûts de conformité aux codes, productivité résidentielle à Toronto" },
  ],
  chart: {
    kicker: "La décomposition",
    title: "Les salaires ont suivi les coûts de construction. Les matériaux, non.",
    body: "Toutes les séries sont ramenées à 1981=100. Les salaires syndicaux de la construction à Toronto (suppléments compris) suivent l'indice des coûts de construction maison seule sur les 45 années, terminant à 4,55x contre 4,64x. Les prix nationaux des matériaux restent en dessous : produits métalliques fabriqués 4,01x, béton 3,66x, bois d'œuvre 3,11x avec un pic marqué en 2021-2022, ensemble des prix industriels 3,12x.",
    legend: [
      { key: "nhpi", label: "Coûts de construction (IPLN maison seule, RMR de Toronto)" },
      { key: "cuwr", label: "Salaires syndicaux de la construction (RMR de Toronto, indicateur)" },
      { key: "metal", label: "Produits métalliques fabriqués (national)" },
      { key: "concrete", label: "Béton prêt à l'emploi (national)" },
      { key: "lumber", label: "Bois d'œuvre résineux (national)" },
      { key: "ippi", label: "Ensemble des prix industriels (national)" },
    ],
    chartNote: "Les séries de l'IPPI sont des prix nationaux à la sortie d'usine, présentés comme des chocs de prix des intrants en amont, pas comme des coûts d'acquisition des constructeurs torontois. Les valeurs de janvier du bois d'œuvre sont volatiles; le pic de 2021-2022 est signalé dans le fichier de données.",
    shortTitle: "Fenêtres plus courtes, présentées séparément",
    shortBody: "Ces séries ne peuvent pas commencer en 1981; elles sont donc présentées sur leur propre base et jamais étirées. Le détail des types de bâtiments résidentiels de StatCan commence en 2017; les produits détaillés du fer et de l'acier commencent en 2010.",
    bcpiTitle: "Prix des bâtiments résidentiels à Toronto, 2017=100",
    bcpiNote: "Maisons unifamiliales 2,33x et maisons en rangée 2,32x, de 2017 à 2026, avec l'indice maison seule ramené à 2017=100 pour comparaison.",
    steelTitle: "Produits du fer et de l'acier, 2010=100, national",
    steelNote: "Les produits de base et semi-finis du fer ou de l'acier ont augmenté de 1,54x de 2010 à 2026, sous l'ensemble des prix industriels à 1,64x sur la même période.",
  },
  drivers: {
    kicker: "Classement des facteurs",
    title: "Cinq facteurs, classés par preuve.",
    body: "Chaque facteur porte un chiffre sourcé. Quand la preuve vient d'enquêtes sectorielles plutôt que d'une série de Statistique Canada, le panneau le dit plainement.",
    openBadge: "Série ouverte",
    surveyBadge: "Aucune série ouverte",
    items: [
      {
        title: "Stagnation de la productivité",
        body: "La production horaire de la construction résidentielle en 2024 se situait environ 8 % sous son niveau de 2000, en baisse d'environ 0,4 % par an; la SCHL estime que la productivité perdue a ajouté 6 à 8 G$ aux coûts de construction, jusqu'à 20 % de la hausse des prix.",
        badge: "Aucune série ouverte : rapports analytiques du CSLC et de la SCHL, pas une série téléchargeable pour le résidentiel torontois.",
      },
      {
        title: "Coûts de main-d'œuvre",
        body: "Les salaires syndicaux de la construction à Toronto, suppléments compris, ont augmenté de 4,55x de 1981 à 2026, suivant presque exactement la hausse de 4,64x des coûts de construction; le taux national de postes vacants en construction a culminé à 8,3 % en avril 2022.",
        badge: "Série ouverte : tableau 18-10-0140-01 de StatCan, RMR de Toronto. Indicateur des échelles salariales syndicales, pas des gains de tous les travailleurs.",
      },
      {
        title: "Matériaux",
        body: "Les produits métalliques fabriqués ont augmenté de 4,01x et le béton prêt à l'emploi de 3,66x à l'échelle nationale depuis 1981, sous la hausse de 4,64x des coûts de construction; le bois d'œuvre résineux a augmenté de 3,11x avec un pic marqué en 2021-2022 suivi d'un repli.",
        badge: "Série ouverte : tableau 18-10-0266-01 de StatCan, prix nationaux à la sortie d'usine, pas coûts d'acquisition des constructeurs.",
      },
      {
        title: "Codes et délais d'approbation",
        body: "L'arriéré des approbations de développement à Toronto est passé de 21 mois en 2020 à une moyenne pondérée de 32 mois en 2022; l'ACHC estime que les changements de codes de 2025 pourraient ajouter plus de 100 000 $ à une maison typique de 2 500 pi².",
        badge: "Aucune série ouverte : enquêtes de l'ACHC et d'Altus Group, pas un programme statistique gouvernemental.",
      },
      {
        title: "Droits d'aménagement et redevances",
        body: "Les taxes, droits et redevances d'aménagement ont augmenté d'environ 700 % en deux décennies, soit environ 82 600 $ par logement de faible hauteur en 2024, en hausse de 27 500 $ depuis 2022.",
        badge: "Aucune série ouverte : enquêtes de référence municipales de l'ACHC pour 2022 et 2024.",
      },
    ],
  },
  levers: {
    kicker: "Ce que cela signifie",
    title: "Trois leviers indiqués par les données.",
    items: [
      {
        title: "Accélérer les approbations.",
        body: "L'arriéré des approbations à Toronto a atteint une moyenne pondérée de 32 mois en 2022; chaque mois de retard ajoute des coûts de portage qui se composent dans le prix final.",
      },
      {
        title: "Rebâtir la productivité.",
        body: "La production horaire a baissé d'environ 0,4 % par an de 2000 à 2024; la construction en usine et modulaire s'attaque directement au principal facteur structurel.",
      },
      {
        title: "Publier les redevances.",
        body: "Aucune série ouverte ne suit les droits d'aménagement dans le temps; une série longitudinale publique permettrait de comparer et de débattre du fardeau des redevances de chaque municipalité.",
      },
    ],
  },
  sources: {
    kicker: "Sources",
    title: "Chaque chiffre a un tableau.",
    body: "Toutes les séries d'indices viennent des tableaux de niveau -01 de Statistique Canada, extraits le 2026-10-10 et rebasés comme documenté dans le fichier de données. La recherche sur les facteurs vient de trois rapports Keenable SELECT exécutés le 2026-10-10.",
    tables: [
      { id: "18-10-0205-01", desc: "Indice des prix des logements neufs en niveaux, maison seule et terrain seul, RMR de Toronto, mensuel 1981-2026; panel de janvier utilisé." },
      { id: "18-10-0140-01", desc: "Indices des taux de salaires syndicaux de la construction, suppléments choisis compris, composite, Toronto, mensuel 1971 à aujourd'hui; panel de janvier utilisé." },
      { id: "18-10-0266-01", desc: "Indices des prix des produits industriels par produit, national, mensuel; bois d'œuvre résineux, produits métalliques fabriqués, béton prêt à l'emploi, fer et acier, ensemble." },
      { id: "18-10-0289-01", desc: "Indices des prix de la construction de bâtiments par type de bâtiment, RMR de Toronto, trimestriel; maisons unifamiliales et en rangée dès le T1 2017; panel T1 utilisé." },
    ],
    gapsTitle: "Ce que les données ouvertes ne peuvent pas répondre",
    gaps: [
      "Droits d'aménagement et redevances municipales : aucune série longitudinale de StatCan n'existe pour aucune période; le chiffre de 700 % vient d'enquêtes de référence de l'ACHC.",
      "Coûts de conformité aux codes du bâtiment : aucune série ouverte; l'estimation de 100 000 $ par maison est un chiffre sectoriel de l'ACHC.",
      "Productivité résidentielle à Toronto 1981-2026 : aucune série téléchargeable; les faits cités viennent de rapports analytiques du CSLC et de la SCHL.",
      "Marges bénéficiaires des entrepreneurs : intégrées au concept de prix de vente de l'IPCB, jamais publiées séparément.",
    ],
    keenable: "Recherche sur les facteurs : trois rapports Keenable SELECT (25, 39 et 55 lignes de preuve) exécutés le 2026-10-10, couvrant les facteurs de coûts, le catalogue des tableaux de StatCan et les correctifs de normalisation.",
  },
  downloads: {
    kicker: "Données",
    title: "Prenez les fichiers.",
    body: "Les séries de facteurs avec métadonnées et la note de construction, sous licence MIT, en JSON et Markdown.",
    files: [
      { name: "drivers.json", desc: "Neuf séries rebasées avec identifiants de tableaux, vecteurs, géographie et couverture" },
      { name: "BUILD_NOTE.md", desc: "Comment les séries ont été construites, ce qui n'a pas pu l'être, et les réserves" },
    ],
    download: "Télécharger",
  },
  footer: {
    line: "Un projet civique à code source ouvert. Sans affiliation avec le gouvernement du Canada ni la Ville de Toronto.",
    sources: "Coûts de construction et salaires : tableaux 18-10-0205-01, 18-10-0140-01, 18-10-0266-01 et 18-10-0289-01 de StatCan. Recherche sur les facteurs : Keenable SELECT, 2026-10-10.",
  },
};

const dicts: Record<Lang, Dict> = { en, fr };

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: "en",
  setLang: () => {},
  t: en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return <LangCtx.Provider value={{ lang, setLang, t: dicts[lang] }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}
