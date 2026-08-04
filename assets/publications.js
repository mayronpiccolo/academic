/* Publications data + renderer (publications.html only). */
(function () {
  "use strict";
  var host = document.getElementById("publist");
  if (!host) return;

  var PUBS = [
    { y: 2026, t: "First Tones: Effects of a communal music-engagement intervention on the mental and behavioral health of preschoolers: A pilot randomized controlled trial", a: "Piccolo M, Dos Santos DW, Pancheri V, Teixeira W, Stocchero M, Galdino S, Sato J, Pinheiro E, Tencatt AP, Zatorre L, Vanzella P, Hooley JM", j: "The Arts in Psychotherapy", url: "https://doi.org/10.1016/j.aip.2026.102508", arms: ["treating"], tags: ["music"] },
    { y: 2026, t: "An exploratory study on portion size estimation errors: psychological correlates in a non-clinical sample with normal weight", a: "Piccolo M, Tandon T, Wadji DL, Haymoz S, Mueller-Pfeiffer C, Milos G, Martin-Soelch C", j: "Eating and Weight Disorders", url: "https://link.springer.com/article/10.1007/s40519-026-01864-2", arms: ["assessing", "understanding"], tags: ["eating"] },
    { y: 2025, t: "Communal music as a tool to improve positive affect after social ostracism or negative autobiographical memory recollection", a: "Piccolo M, Dos Santos DW, Herold S, Hooley JM", j: "Scientific Reports", url: "https://pubmed.ncbi.nlm.nih.gov/41028871/", arms: ["treating", "understanding"], tags: ["music", "reward"] },
    { y: 2025, t: "Ensuring clinical validity: the case for reconsidering “several days” in the PHQ-9 Brazilian version", a: "Piccolo M", j: "Brazilian Journal of Psychiatry", url: "https://doi.org/10.47626/1516-4446-2025-4635", arms: ["assessing"], tags: ["cross"] },
    { y: 2025, t: "The role of Vietnamese mourning culture in grief symptomatology: a study protocol", a: "Le HH, Piccolo M, Killikelly C", j: "Grief: The Journal", url: "https://doi.org/10.70089/xdf7c696", arms: ["assessing"], tags: ["cross"] },
    { y: 2024, t: "Mental health markers and protective factors in students with symptoms of physical pain across WEIRD and non-WEIRD samples — a network analysis", a: "Tandon T, Piccolo M, Ledermann K, McNally RJ, Gupta R, Morina N, Martin-Soelch C", j: "BMC Psychiatry", url: "https://pubmed.ncbi.nlm.nih.gov/38658915/", arms: ["understanding"], tags: ["cross", "reward"] },
    { y: 2023, t: "Alterations in resting-state functional activity and connectivity for major depressive disorder appetite and weight disturbance phenotypes", a: "Piccolo M, Belleau EL, Holsen LM, Trivedi MH, Parsey RV, McGrath PJ, Weissman MM, Pizzagalli DA, Javaras KN", j: "Psychological Medicine", url: "https://pubmed.ncbi.nlm.nih.gov/35670301/", arms: ["understanding"], tags: ["eating", "reward"] },
    { y: 2022, t: "Relationship between behavioral and mood responses to monetary rewards in a sample of Indian students with and without reported pain", a: "Tandon T, Piccolo M, Ledermann K, Gupta R, Morina N, Martin-Soelch C", j: "Scientific Reports", url: "https://pubmed.ncbi.nlm.nih.gov/36424426/", arms: ["understanding"], tags: ["reward", "cross"] },
    { y: 2022, t: "Estimation of meal portions in bulimia nervosa compared to anorexia nervosa and healthy controls", a: "Pasi P, Piccolo M, Kaufmann LK, Martin-Soelch C, Müller-Pfeiffer C, Milos G", j: "Eating and Weight Disorders", url: "https://pubmed.ncbi.nlm.nih.gov/35587335/", arms: ["assessing", "understanding"], tags: ["eating"] },
    { y: 2022, t: "The relationship between behavioural and mood responses to monetary rewards in a sample of students with and without reported pain", a: "Tandon T, Ledermann K, Gupta R, Morina N, Wadji DL, Piccolo M, Martin-Soelch C", j: "Humanities and Social Sciences Communications", url: "https://doi.org/10.1057/s41599-022-01044-4", arms: ["understanding"], tags: ["reward", "cross"] },
    { y: 2020, t: "Effects of hunger on mood and affect reactivity to monetary reward in women with obesity — a pilot study", a: "Piccolo M, Milos G, Bluemel S, Schumacher S, Müller-Pfeiffer C, Fried M, Ernst M, Martin-Soelch C", j: "PLoS One", url: "https://doi.org/10.1371/journal.pone.0232813", arms: ["understanding"], tags: ["eating", "reward"] },
    { y: 2020, t: "Altered circulating endocannabinoids in anorexia nervosa during acute and weight-restored phases: a pilot study", a: "Piccolo M, Claussen MC, Bluemel S, Schumacher S, Cronin A, Fried M, Goetze O, Martin-Soelch C, Milos G", j: "European Eating Disorders Review", url: "https://doi.org/10.1002/erv.2709", arms: ["understanding"], tags: ["eating"] },
    { y: 2019, t: "Behavioral responses to uncertainty in weight-restored anorexia nervosa — preliminary results", a: "Piccolo M, Milos GF, Bluemel S, Schumacher S, Mueller-Pfeiffer C, Fried M, Ernst M, Martin-Soelch C", j: "Frontiers in Psychology", url: "https://doi.org/10.3389/fpsyg.2019.02492", arms: ["understanding"], tags: ["eating", "reward"] },
    { y: 2019, t: "Food vs money? Effects of hunger on mood and behavioral reactivity to reward in anorexia nervosa", a: "Piccolo M, Milos G, Bluemel S, Schumacher S, Müller-Pfeiffer C, Fried M, Ernst M, Martin-Soelch C", j: "Appetite", url: "https://doi.org/10.1016/j.appet.2018.12.017", arms: ["understanding"], tags: ["eating", "reward"] }
  ];
  var TAGNAMES = { reward: "Reward", eating: "Eating & Weight", music: "Music", cross: "Cross-cultural" };
  var ARMNAMES = { understanding: "Mechanisms", assessing: "Assessment", treating: "Intervention" };
  var CHAPTERS = [
    { y: 2019, t: "A anorexia nervosa e os sistemas neurobiológicos que regulam o consumo de alimentos", a: "Piccolo M, Martin-Soelch C, Araujo J de C, Estanislau C", b: "Psicologia e Análise do Comportamento: Pesquisa e Intervenção", pages: "chap. 3, pp. 35–43", pub: "Universidade Estadual de Londrina", url: "https://www.uel.br/pos/pgac/wp-content/uploads/2019/02/Psicologia-e-Analise-do-Comportamento-Interven%C3%A7%C3%A3o-e-Pesquisa-2019.pdf" },
    { y: 2019, t: "Aspectos neurobiológicos e sociais da evolução da empatia humana", a: "Filgueiras GB, Maio TP, Bibiano AG, David L, Piccolo M, Ribeiro L, Luzia JC", b: "Psicologia e Análise do Comportamento: Pesquisa e Intervenção", pages: "chap. 12, pp. 147–157", pub: "Universidade Estadual de Londrina", url: "https://www.uel.br/pos/pgac/wp-content/uploads/2019/02/Psicologia-e-Analise-do-Comportamento-Interven%C3%A7%C3%A3o-e-Pesquisa-2019.pdf" },
    { y: 2018, t: "Causal versus funcional: um diálogo entre Mayr e Skinner", a: "Piccolo M, David L, Dantas LZ, Cinel KC, Muchon C", b: "Análise do Comportamento: conceitos e aplicações a processos educativos, clínicos e organizacionais", pages: "chap. 6, pp. 105–115", pub: "Universidade Estadual de Londrina", url: "https://www.uel.br/pos/pgac/wp-content/uploads/2019/01/UELlivro5dez18press.pdf" }
  ];

  var lastYear = null, html = "";
  for (var i = 0; i < PUBS.length; i++) {
    var p = PUBS[i];
    if (p.y !== lastYear) { html += '<div class="pub-year">' + p.y + "</div>"; lastYear = p.y; }
    var title = p.url ? '<a href="' + p.url + '">' + p.t + "</a>" : p.t;
    var armChips = (p.arms || []).map(function (a) { return '<span class="arm">' + ARMNAMES[a] + "</span>"; }).join("");
    var tags = armChips;
    html += '<div class="pub"><p class="pub-title">' + title + '</p><p class="pub-meta">' + p.a + " · <i>" + p.j + '</i></p><div class="tags">' + tags + "</div></div>";
  }
  html += '<div class="pub-group">Book Chapters</div>';
  lastYear = null;
  for (var k = 0; k < CHAPTERS.length; k++) {
    var c = CHAPTERS[k];
    if (c.y !== lastYear) { html += '<div class="pub-year">' + c.y + "</div>"; lastYear = c.y; }
    var pages = c.pages ? " (" + c.pages + ")" : "";
    var ct = c.url ? '<a href="' + c.url + '">' + c.t + "</a>" : c.t;
    html += '<div class="pub"><p class="pub-title">' + ct + '</p><p class="pub-meta">' + c.a + " · In <i>" + c.b + "</i>" + pages + " · " + c.pub + "</p></div>";
  }
  host.innerHTML = html;
})();
