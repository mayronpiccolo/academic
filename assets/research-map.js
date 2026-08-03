/* Interactive research map (research.html only). */
(function () {
  "use strict";
  var canvas = document.getElementById("map");
  var tip = document.getElementById("maptip");
  if (!canvas || !tip) return;

  var REDUCED =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    new URLSearchParams(window.location.search).has("static");

  var TRAUMA_DESC = "Partner country in the Global Trauma Network — a 13-country study of how child maltreatment and cultural social norms shape mental health (paper forthcoming).";
  var SITES = [
    { id: "cam", name: "Cambridge & Boston, USA", inst: "Harvard · McLean · Cambridge Health Alliance", lat: 42.4, lon: -71.1, hub: true, labelDy: -10,
      desc: "Home base. Papers: communal music to improve positive affect after social ostracism (Scientific Reports, 2025) with the Hooley Lab, and resting-state fMRI of MDD appetite and weight phenotypes (Psychological Medicine, 2023) from postdoctoral training at McLean Hospital with Diego Pizzagalli and Kristin Javaras, and multi-site U.S. collaborators. The United States is also a partner country in the Global Trauma Network.", arms: ["understanding","treating"], themes: ["reward", "eating", "music", "cross"] },
    { id: "fri", name: "Fribourg, Switzerland", inst: "University of Fribourg", lat: 46.8, lon: 7.2, labelDy: 15, labelLeft: true,
      desc: "Doctoral papers with Chantal Martin-Soelch on reward reactivity: hunger and reward in anorexia nervosa (Appetite, 2019), behavioral responses to uncertainty (Frontiers in Psychology, 2019), and hunger and reward in obesity (PLoS One, 2020). Also where he taught as a Chargé de Cours (2018–2022); Switzerland is a partner country in the Global Trauma Network.", arms: ["understanding"], themes: ["reward", "eating", "cross"] },
    { id: "zur", name: "Zurich, Switzerland", inst: "University Hospital Zurich", lat: 47.4, lon: 8.8, labelDy: -9,
      desc: "Eating-disorder papers with Gabriella Milos: altered endocannabinoids in anorexia nervosa (European Eating Disorders Review, 2020), meal-portion estimation in bulimia (Eating and Weight Disorders, 2022), and portion-size estimation errors (Eating and Weight Disorders, 2026).", arms: ["understanding","assessing"], themes: ["eating"] },
    { id: "mum", name: "Mumbai, India", inst: "IIT Bombay", lat: 19.1, lon: 72.9,
      desc: "Papers with Rashmi Gupta on monetary reward, mood, and pain in Indian students (Scientific Reports, 2022) and a cross-sample network analysis of pain and mental health across WEIRD and non-WEIRD samples (BMC Psychiatry, 2024). India is also a partner country in the Global Trauma Network.", arms: ["understanding"], themes: ["reward", "cross"] },
    { id: "bra", name: "São Paulo, Brazil", inst: "Universidade Federal do ABC (UFABC)", lat: -23.6, lon: -46.6, labelDy: 15,
      desc: "A First Tones site: the “First Tones” fNIRS study on communal music-making and brain oxygenation, with UFABC collaborators (Vanzella, Sato, and colleagues), and session chair at the 18th International Conference on Music Perception and Cognition, held in São Paulo (2025). Also where he authored the case for revisiting “several days” in the PHQ-9 Brazilian version (Brazilian Journal of Psychiatry, 2025).", arms: ["understanding","assessing","treating"], themes: ["music", "cross"] },
    { id: "cga", name: "Campo Grande, Brazil", inst: "Universidade Federal do Mato Grosso do Sul (UFMS)", lat: -20.47, lon: -54.62, labelLeft: true, labelDy: -6,
      desc: "A First Tones site: communal music-making intervention work with UFMS, and an invited talk on communal music, social reward, and sense of belonging.", arms: ["understanding","treating"], themes: ["music", "cross"] },
    { id: "vnm", name: "Hanoi, Vietnam", inst: "Cross-cultural grief network", lat: 21.0, lon: 105.8, labelDy: -10, labelLeft: true,
      desc: "Paper on the role of Vietnamese mourning culture in grief symptomatology, a study protocol with Le and Killikelly (Grief: The Journal, 2025).", arms: ["assessing"], themes: ["cross"] },
    // Global Trauma Network partner countries (secondary nodes; US, India, and Switzerland already appear above)
    { id: "gtn-ca", name: "Canada", inst: "Global Trauma Network", lat: 53.0, lon: -102.0, secondary: true, always: true, arms: ["understanding"], themes: ["cross"], desc: TRAUMA_DESC },
    { id: "gtn-uk", name: "United Kingdom", inst: "Global Trauma Network", lat: 52.6, lon: -1.5, secondary: true, arms: ["understanding"], themes: ["cross"], desc: TRAUMA_DESC },
    { id: "gtn-de", name: "Germany", inst: "Global Trauma Network", lat: 52.5, lon: 13.4, secondary: true, arms: ["understanding"], themes: ["cross"], desc: TRAUMA_DESC },
    { id: "gtn-se", name: "Sweden", inst: "Global Trauma Network", lat: 59.3, lon: 18.1, secondary: true, arms: ["understanding"], themes: ["cross"], desc: TRAUMA_DESC },
    { id: "gtn-tr", name: "Türkiye", inst: "Global Trauma Network", lat: 39.9, lon: 32.9, secondary: true, arms: ["understanding"], themes: ["cross"], desc: TRAUMA_DESC },
    { id: "gtn-ge", name: "Georgia", inst: "Global Trauma Network", lat: 41.7, lon: 44.8, secondary: true, arms: ["understanding"], themes: ["cross"], desc: TRAUMA_DESC },
    { id: "gtn-il", name: "Israel", inst: "Global Trauma Network", lat: 31.8, lon: 35.2, secondary: true, arms: ["understanding"], themes: ["cross"], desc: TRAUMA_DESC },
    { id: "gtn-ir", name: "Iran", inst: "Global Trauma Network", lat: 35.7, lon: 51.4, secondary: true, arms: ["understanding"], themes: ["cross"], desc: TRAUMA_DESC },
    { id: "gtn-mo", name: "Macau", inst: "Global Trauma Network", lat: 22.2, lon: 113.5, secondary: true, always: true, labelDy: 15, arms: ["understanding"], themes: ["cross"], desc: TRAUMA_DESC },
    { id: "gtn-za", name: "South Africa", inst: "Global Trauma Network", lat: -26.2, lon: 28.0, secondary: true, always: true, arms: ["understanding"], themes: ["cross"], desc: TRAUMA_DESC }
  ];

  // Simplified world coastlines (Natural Earth 110m land, Douglas-Peucker simplified) for a sketch-style map behind the nodes.
  var WORLD = [
    [[107.0,77.0],[114.1,75.8],[109.4,74.2],[123.2,73.0],[123.3,73.7],[127.0,73.6],[131.3,70.8],[132.3,71.8],[139.9,71.5],[139.1,72.4],[140.5,72.8],[159.0,70.9],[160.9,69.4],[167.8,69.6],[169.6,68.7],[170.8,69.0],[170.5,70.1],[178.6,69.4],[180,69.0],[180,65.0],[177.4,64.6],[179.5,62.6],[173.7,61.7],[170.3,59.9],[163.5,59.9],[162.0,58.2],[163.2,57.6],[162.1,54.9],[156.8,51.0],[155.9,56.8],[163.7,61.1],[164.5,62.6],[160.1,60.5],[159.3,61.8],[156.7,61.4],[154.2,59.8],[155.0,59.1],[142.2,59.0],[135.1,54.7],[139.9,54.2],[141.4,52.2],[138.2,46.3],[134.9,43.4],[132.3,43.3],[127.5,39.8],[129.5,36.8],[129.1,35.1],[126.5,34.4],[126.1,36.7],[126.9,36.9],[124.7,38.1],[125.3,39.6],[121.1,38.9],[121.6,40.9],[118.0,39.2],[118.9,37.4],[122.4,37.5],[119.2,34.9],[121.9,31.7],[121.7,28.2],[115.9,22.8],[110.8,21.4],[110.4,20.3],[108.5,21.7],[105.9,19.8],[109.3,13.4],[109.2,11.7],[105.2,8.6],[105.1,9.9],[100.1,13.4],[99.2,9.2],[103.0,5.5],[104.2,1.3],[101.4,2.8],[100.1,6.5],[98.3,7.8],[98.8,11.4],[97.2,16.9],[94.2,16.0],[94.3,18.2],[91.4,22.8],[87.0,21.5],[86.5,20.2],[80.3,15.9],[79.9,10.4],[77.5,8.0],[73.5,16.0],[72.6,21.4],[70.5,20.9],[66.4,25.4],[57.4,25.7],[56.5,27.1],[54.7,26.5],[51.5,27.9],[50.1,30.1],[48.0,30.0],[50.8,24.8],[51.6,25.8],[51.8,24.0],[54.0,24.1],[56.4,26.4],[56.8,24.2],[59.8,22.3],[55.3,17.2],[43.5,12.6],[42.6,16.8],[34.6,28.1],[34.9,29.5],[33.9,27.6],[32.4,29.9],[36.9,22.0],[37.5,18.6],[43.3,12.4],[42.7,11.7],[44.6,10.4],[51.1,12.0],[51.0,10.6],[47.7,4.2],[39.2,-4.7],[40.8,-14.7],[34.8,-19.8],[35.6,-23.7],[32.6,-25.7],[32.2,-28.8],[25.8,-33.9],[19.6,-34.8],[18.4,-34.1],[18.2,-31.7],[15.2,-27.1],[14.3,-22.1],[11.8,-18.1],[13.7,-10.7],[11.9,-5.0],[8.8,-1.1],[9.4,3.7],[8.5,4.8],[5.9,4.3],[4.3,6.3],[-2.0,4.7],[-9.0,4.8],[-16.6,12.2],[-17.6,14.7],[-16.1,18.1],[-17.0,21.9],[-14.4,26.3],[-9.6,29.9],[-9.3,32.6],[-5.9,35.8],[-2.2,35.2],[1.5,36.6],[9.5,37.4],[11.1,36.9],[10.3,33.8],[19.1,30.3],[21.5,32.8],[28.9,30.9],[33.8,31.0],[36.2,36.7],[27.6,36.7],[26.2,39.5],[33.5,42.0],[38.3,40.9],[41.7,42.0],[36.7,45.2],[39.1,47.3],[35.0,46.3],[36.3,45.1],[33.9,44.4],[32.5,45.3],[33.3,46.1],[30.7,46.6],[27.7,42.6],[28.8,41.1],[22.6,40.3],[24.0,37.7],[23.1,37.9],[22.5,36.4],[19.4,40.3],[19.5,41.7],[13.1,45.7],[12.6,44.1],[18.5,40.2],[16.9,40.4],[16.1,38.0],[15.4,40.0],[8.9,44.4],[3.1,43.1],[3.0,41.9],[0.8,41.0],[0.1,38.7],[-2.1,36.7],[-5.4,35.9],[-8.9,36.9],[-9.4,43.0],[-1.4,44.0],[-1.2,46.0],[-4.6,48.7],[-1.6,48.6],[-1.9,49.8],[1.3,50.1],[4.7,53.1],[8.1,53.5],[8.5,57.1],[10.6,57.7],[10.9,56.5],[9.7,55.5],[10.9,54.0],[19.7,54.4],[21.3,55.2],[21.6,57.4],[24.1,57.0],[24.4,58.4],[23.3,59.2],[29.1,60.0],[22.9,59.8],[21.3,60.7],[21.5,63.2],[25.4,65.1],[22.2,65.7],[17.8,62.7],[17.1,61.3],[18.8,60.1],[16.8,58.7],[15.9,56.1],[12.9,55.4],[10.4,59.5],[8.4,58.3],[5.7,58.6],[5.0,62.0],[14.8,67.8],[24.5,71.0],[28.2,71.2],[31.3,70.5],[30.0,70.2],[31.1,69.6],[40.3,67.9],[41.1,66.8],[40.0,66.3],[33.2,66.6],[34.8,65.9],[34.9,64.4],[37.0,63.8],[37.2,65.1],[39.6,64.5],[42.1,66.5],[43.9,66.1],[44.5,66.8],[43.5,68.6],[46.3,68.3],[46.8,67.7],[45.6,67.0],[46.3,66.7],[53.7,68.9],[59.9,68.3],[61.1,68.9],[60.6,69.9],[68.5,68.1],[69.2,68.6],[66.9,69.5],[66.7,71.0],[69.2,72.8],[72.6,72.8],[71.8,71.4],[73.7,68.4],[71.3,66.3],[72.4,66.2],[75.1,67.8],[73.6,69.6],[74.4,70.6],[73.1,71.4],[74.7,72.8],[76.4,71.2],[75.9,71.9],[77.6,72.3],[81.5,71.8],[80.5,73.6],[86.8,73.9],[86.0,74.5],[87.2,75.1],[100.8,76.4],[104.4,77.7]],
    [[-90.5,69.5],[-90.6,68.5],[-89.2,69.3],[-87.4,67.2],[-85.5,69.9],[-82.6,69.7],[-81.3,69.2],[-81.3,67.6],[-85.8,66.6],[-87.3,64.8],[-93.2,62.0],[-94.7,58.9],[-93.2,58.8],[-92.3,57.1],[-82.3,55.1],[-82.1,53.3],[-79.9,51.2],[-78.6,52.6],[-79.8,54.7],[-76.5,56.5],[-78.5,58.8],[-77.3,59.9],[-78.1,62.3],[-73.8,62.4],[-69.6,61.1],[-69.3,59.0],[-67.6,58.2],[-64.6,60.3],[-61.8,56.3],[-57.3,54.6],[-55.7,52.1],[-60.0,50.2],[-66.4,50.2],[-71.1,46.8],[-65.1,49.2],[-64.2,48.7],[-65.1,48.1],[-64.5,46.2],[-61.5,45.9],[-60.5,47.0],[-59.8,45.9],[-65.4,43.5],[-66.2,44.5],[-64.4,45.3],[-67.1,45.1],[-70.7,43.0],[-70.0,41.6],[-73.7,40.9],[-71.9,40.9],[-74.0,40.8],[-74.9,38.9],[-75.5,39.5],[-75.9,37.2],[-76.3,39.2],[-77.0,38.2],[-75.7,35.6],[-81.3,31.4],[-80.4,25.2],[-84.1,30.1],[-89.2,30.3],[-90.2,29.1],[-93.8,29.7],[-96.6,28.3],[-97.9,22.4],[-96.3,19.3],[-94.4,18.1],[-92.0,18.7],[-90.3,21.0],[-87.1,21.5],[-88.9,15.9],[-83.4,15.3],[-83.8,11.1],[-81.4,8.8],[-79.6,9.6],[-76.8,8.6],[-74.9,11.1],[-71.8,12.4],[-71.7,9.1],[-69.9,12.2],[-68.2,10.6],[-61.9,10.7],[-62.4,9.9],[-57.1,6.0],[-54.0,5.8],[-51.3,4.2],[-50.0,1.7],[-50.4,-0.1],[-44.9,-1.6],[-44.6,-2.7],[-40.0,-2.9],[-35.6,-5.1],[-34.7,-7.3],[-38.7,-13.1],[-40.9,-21.9],[-47.6,-24.9],[-48.9,-28.7],[-53.8,-34.4],[-56.2,-34.9],[-58.4,-33.9],[-56.8,-36.9],[-59.2,-38.7],[-62.3,-38.8],[-62.7,-41.0],[-65.1,-41.1],[-63.5,-42.6],[-67.3,-45.6],[-67.6,-46.3],[-65.6,-47.2],[-66.0,-48.1],[-69.1,-50.7],[-68.2,-52.3],[-70.8,-52.9],[-71.0,-53.8],[-74.9,-52.3],[-75.6,-48.7],[-74.1,-46.9],[-75.6,-46.6],[-74.4,-44.1],[-73.2,-44.5],[-72.7,-42.4],[-74.3,-43.2],[-73.6,-37.2],[-71.4,-32.4],[-70.2,-19.8],[-71.5,-17.4],[-76.0,-14.6],[-79.8,-7.2],[-81.2,-6.1],[-79.8,-2.7],[-81.0,-2.2],[-80.9,-1.1],[-77.1,3.8],[-78.2,8.3],[-79.6,8.9],[-80.9,7.2],[-85.7,9.9],[-87.5,13.3],[-103.5,18.3],[-105.5,19.9],[-106.0,22.8],[-113.9,31.6],[-114.8,31.8],[-114.7,30.2],[-109.4,23.4],[-110.0,22.8],[-112.2,24.7],[-112.3,26.0],[-115.1,27.7],[-114.2,28.6],[-117.3,33.0],[-120.6,34.6],[-124.4,40.3],[-124.7,48.2],[-122.6,47.1],[-122.8,49.0],[-127.4,50.8],[-127.9,52.3],[-134.1,58.1],[-147.1,60.9],[-151.7,59.2],[-150.6,61.3],[-158.4,56.0],[-164.8,54.4],[-157.7,57.6],[-157.0,58.9],[-162.0,58.7],[-161.9,59.6],[-166.1,61.5],[-164.6,63.1],[-160.8,63.8],[-161.5,64.4],[-160.8,64.8],[-165.0,64.4],[-168.1,65.7],[-161.7,66.1],[-166.8,68.4],[-156.6,71.4],[-136.5,68.9],[-128.1,70.5],[-108.9,67.4],[-107.8,67.9],[-108.8,68.3],[-108.2,68.7],[-106.2,68.8],[-101.5,67.6],[-97.7,68.6],[-96.1,68.2],[-96.1,67.3],[-94.2,69.1],[-96.5,70.1],[-95.2,71.9]],
    [[-27.1,83.5],[-20.8,82.7],[-31.4,82.0],[-12.2,81.3],[-20.0,80.2],[-17.7,80.1],[-19.7,78.8],[-18.5,77.0],[-21.7,76.6],[-19.8,76.1],[-19.6,75.2],[-20.7,75.2],[-19.4,74.3],[-23.6,73.3],[-22.3,72.2],[-24.8,72.3],[-21.8,70.7],[-25.5,71.4],[-26.4,70.2],[-22.3,70.1],[-39.8,65.5],[-42.8,62.7],[-43.4,60.1],[-48.3,60.9],[-51.6,63.6],[-54.0,67.2],[-50.9,69.9],[-54.7,69.6],[-54.4,70.8],[-51.4,70.6],[-55.8,71.7],[-54.7,72.6],[-58.6,75.5],[-68.5,76.1],[-71.4,77.0],[-66.8,77.4],[-73.3,78.0],[-65.7,79.4],[-68.0,80.1],[-62.7,81.8],[-50.4,82.4],[-44.5,81.7],[-46.8,82.6],[-43.4,83.2]],
    [[143.6,-13.8],[145.4,-15.0],[146.4,-19.0],[148.8,-20.4],[153.1,-26.1],[152.9,-31.6],[150.0,-37.4],[146.3,-39.0],[145.0,-37.9],[143.6,-38.8],[140.6,-38.0],[138.1,-35.6],[138.2,-34.4],[136.8,-35.3],[137.8,-32.9],[136.0,-34.9],[134.3,-32.6],[131.3,-31.5],[118.0,-35.1],[115.0,-34.2],[115.7,-31.6],[113.3,-26.1],[114.2,-26.3],[113.4,-24.4],[114.1,-21.8],[114.2,-22.5],[120.9,-19.7],[125.7,-14.2],[129.6,-15.0],[130.6,-12.5],[132.6,-12.1],[132.4,-11.1],[136.5,-11.9],[135.5,-15.0],[140.2,-17.7],[142.1,-11.0]],
    [[-86.6,73.2],[-85.8,72.5],[-82.3,73.8],[-80.7,72.1],[-77.8,72.7],[-72.2,71.6],[-67.9,70.1],[-67.0,69.2],[-68.8,68.7],[-61.9,66.9],[-63.9,65.0],[-68.0,66.3],[-64.7,63.4],[-65.0,62.7],[-68.8,63.7],[-66.2,61.9],[-74.8,64.7],[-77.7,64.2],[-78.6,64.6],[-77.9,65.3],[-74.0,65.5],[-72.9,67.7],[-79.0,70.2],[-88.7,70.4],[-90.2,72.2],[-88.4,73.5],[-85.8,73.8]],
    [[134.1,-1.2],[135.5,-3.4],[138.3,-1.7],[144.6,-3.9],[147.6,-6.1],[147.2,-7.4],[150.7,-10.6],[147.9,-10.1],[144.7,-7.6],[142.6,-9.3],[137.6,-8.4],[138.7,-7.3],[137.9,-5.4],[133.7,-3.5],[133.0,-4.1],[132.0,-2.8],[133.7,-2.2],[130.5,-0.9]],
    [[141.0,37.1],[140.3,35.1],[135.8,33.5],[135.1,34.6],[131.0,33.9],[132.0,33.1],[131.3,31.5],[130.2,31.4],[129.4,33.3],[132.6,35.4],[135.7,35.5],[136.7,37.3],[139.4,38.2],[140.3,41.2],[141.4,41.4],[141.9,40.0]],
    [[-3.0,58.6],[-4.1,57.6],[-2.0,57.7],[-3.1,56.0],[1.7,52.7],[1.4,51.3],[-5.2,50.0],[-3.4,51.4],[-5.3,52.0],[-4.2,52.3],[-4.6,53.5],[-2.9,54.0],[-5.6,55.3],[-6.1,56.8],[-5.0,58.6]],
    [[-114.2,73.1],[-109.9,73.0],[-108.2,71.7],[-108.4,73.1],[-106.5,73.1],[-101.1,69.6],[-102.7,69.5],[-102.4,68.8],[-116.1,69.2],[-117.3,70.0],[-112.4,70.4],[-117.9,70.5],[-116.1,71.3],[-119.4,71.6]],
    [[125.2,1.4],[123.7,0.2],[120.2,0.2],[120.9,-1.4],[123.3,-0.6],[121.5,-1.9],[123.2,-5.3],[121.5,-4.6],[121.0,-2.6],[120.4,-5.5],[119.4,-5.4],[118.8,-2.8],[120.0,0.6]],
    [[117.9,1.8],[119.0,0.9],[117.8,0.8],[116.1,-4.0],[110.2,-2.9],[109.1,-0.5],[109.7,2.0],[113.0,3.1],[116.7,6.9],[119.2,5.4],[117.3,3.2]],
    [[50.1,-13.6],[50.4,-15.7],[47.1,-24.9],[44.0,-25.0],[43.3,-22.1],[44.4,-20.1],[44.4,-16.2],[47.7,-14.6],[49.2,-12.0]],
    [[-56.1,50.7],[-56.8,49.8],[-53.5,49.2],[-53.1,46.7],[-54.2,47.8],[-55.4,46.9],[-59.3,47.6],[-57.4,50.7],[-55.9,51.6]],
    [[-79.7,22.8],[-74.2,20.3],[-77.8,19.9],[-77.1,20.4],[-78.7,21.6],[-81.8,22.6],[-85.0,21.9],[-82.3,23.2]],
    [[143.6,50.7],[144.7,49.0],[143.2,49.3],[142.6,47.9],[143.5,46.1],[142.1,46.0],[141.7,53.3],[142.7,54.4]],
    [[-14.5,66.5],[-13.6,65.1],[-18.7,63.5],[-22.8,64.0],[-21.8,64.4],[-24.0,64.9],[-22.2,65.4],[-24.3,65.6]],
    [[-100.4,73.8],[-97.4,73.8],[-98.1,73.0],[-96.5,72.6],[-96.7,71.7],[-102.5,72.5],[-100.4,72.7],[-101.5,73.4]],
    [[105.8,-5.9],[102.6,-4.2],[95.3,5.5],[97.5,5.2],[103.8,0.1],[103.4,-0.7],[106.1,-3.1]],
    [[-120.5,71.4],[-123.1,70.9],[-125.9,71.9],[-123.9,73.7],[-124.9,74.3],[-117.6,74.2],[-115.5,73.5]],
    [[108.6,-6.8],[110.8,-6.5],[115.7,-8.4],[108.3,-7.8],[105.4,-6.9],[106.1,-5.9]],
    [[152.0,-5.5],[150.2,-6.3],[148.3,-5.7],[150.8,-5.5],[151.5,-4.2],[152.3,-4.3]],
    [[121.3,18.5],[122.5,17.1],[121.7,14.3],[124.0,13.8],[124.1,12.5],[120.1,15.0]],
    [[-72.6,19.9],[-68.3,18.6],[-73.9,18.0],[-74.4,18.7],[-72.3,18.7],[-73.4,19.6]],
    [[57.5,70.7],[51.6,71.5],[55.6,75.1],[68.9,76.5],[58.5,74.3],[55.4,72.4]],
    [[126.4,8.4],[125.4,5.6],[123.6,7.8],[121.9,7.2],[125.4,9.8]],
    [[143.9,44.2],[145.3,44.4],[145.5,43.3],[140.0,41.6],[142.0,45.6]],
    [[-6.8,52.3],[-10.0,51.8],[-9.7,53.9],[-6.7,55.2],[-5.7,54.6]]
  ];

  var ctx = canvas.getContext("2d");
  var holder = canvas.parentElement;
  var reduced = REDUCED;
  var W = 0, H = 0, dpr = 1, filter = "all", hovered = null, t = 0, visible = false, raf = null;

  var LON0 = -130, LON1 = 150, LAT0 = 72, LAT1 = -45;
  var px = function (s) { return { x: (s.lon - LON0) / (LON1 - LON0) * W, y: (s.lat - LAT0) / (LAT1 - LAT0) * H }; };

  function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = holder.clientWidth;
    H = Math.max(300, Math.min(430, W * 0.52));
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function arcPath(a, b) {
    var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    var dx = b.x - a.x, dy = b.y - a.y;
    var dist = Math.hypot(dx, dy);
    var cx = mx - dy * 0.22, cy = my + dx * 0.22 - dist * 0.12;
    return { cx: cx, cy: cy };
  }

  function active(s) { return filter === "all" || (s.arms && s.arms.includes(filter)); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var grid = cssVar("--map-grid"), arcC = cssVar("--map-arc"),
        nodeC = cssVar("--map-node"), accent = cssVar("--accent"),
        ink = cssVar("--ink"), soft = cssVar("--ink-soft"),
        land = cssVar("--map-land"), coast = cssVar("--map-coast");

    // continents (sketch-style background)
    ctx.lineJoin = "round";
    ctx.fillStyle = land; ctx.strokeStyle = coast; ctx.lineWidth = 1;
    for (var w = 0; w < WORLD.length; w++) {
      var poly = WORLD[w];
      ctx.beginPath();
      for (var i = 0; i < poly.length; i++) {
        var x = (poly[i][0] - LON0) / (LON1 - LON0) * W;
        var y = (poly[i][1] - LAT0) / (LAT1 - LAT0) * H;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    // graticule
    ctx.strokeStyle = grid; ctx.lineWidth = 1;
    for (var lon = -120; lon <= 140; lon += 20) {
      var gx = (lon - LON0) / (LON1 - LON0) * W;
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
    }
    for (var lat = 60; lat >= -40; lat -= 20) {
      var gy = (lat - LAT0) / (LAT1 - LAT0) * H;
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }
    // equator emphasis
    var eq = (0 - LAT0) / (LAT1 - LAT0) * H;
    ctx.strokeStyle = grid; ctx.setLineDash([2, 5]);
    ctx.beginPath(); ctx.moveTo(0, eq); ctx.lineTo(W, eq); ctx.stroke();
    ctx.setLineDash([]);

    var hub = px(SITES[0]);

    // arcs from hub
    for (var a = 0; a < SITES.length; a++) {
      var s = SITES[a];
      if (s.hub) continue;
      var p = px(s), on = active(s) && active(SITES[0]);
      var c = arcPath(hub, p);
      ctx.strokeStyle = on ? arcC : grid;
      ctx.lineWidth = on ? (s.secondary ? 0.8 : 1.6) : 0.9;
      ctx.globalAlpha = s.secondary ? 0.6 : 1;
      ctx.setLineDash([1, 6]);
      ctx.lineDashOffset = reduced ? 0 : -t * 18;
      ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.quadraticCurveTo(c.cx, c.cy, p.x, p.y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      // travelling pulse
      if (on && !reduced && !s.secondary) {
        var u = (t * 0.14 + SITES.indexOf(s) * 0.13) % 1;
        var bx = (1 - u) * (1 - u) * hub.x + 2 * (1 - u) * u * c.cx + u * u * p.x;
        var by = (1 - u) * (1 - u) * hub.y + 2 * (1 - u) * u * c.cy + u * u * p.y;
        ctx.fillStyle = accent;
        ctx.beginPath(); ctx.arc(bx, by, 2.2, 0, Math.PI * 2); ctx.fill();
      }
    }

    // nodes
    for (var n = 0; n < SITES.length; n++) {
      var sn = SITES[n];
      var pn = px(sn), onN = active(sn), isHov = hovered === sn;
      var r = sn.hub ? 7 : (sn.secondary ? 3.2 : 5);
      if (onN && !reduced && !sn.secondary) {
        var pulse = (Math.sin(t * 2 + pn.x) + 1) / 2;
        ctx.beginPath(); ctx.arc(pn.x, pn.y, r + 4 + pulse * 4, 0, Math.PI * 2);
        ctx.strokeStyle = sn.hub ? accent : nodeC;
        ctx.globalAlpha = 0.25 * (onN ? 1 : 0.3);
        ctx.stroke(); ctx.globalAlpha = 1;
      }
      ctx.beginPath(); ctx.arc(pn.x, pn.y, isHov ? r + 2 : r, 0, Math.PI * 2);
      ctx.fillStyle = onN ? (sn.hub ? accent : nodeC) : grid;
      ctx.globalAlpha = sn.secondary && !isHov ? 0.85 : 1;
      ctx.fill();
      ctx.globalAlpha = 1;
      if (isHov) { ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.stroke(); }
      // label — always for primary and flagged nodes; only on hover for the rest of the secondary (trauma-network) cluster
      if (onN && (!sn.secondary || sn.always || isHov)) {
        ctx.font = "600 11px system-ui, sans-serif";
        ctx.fillStyle = isHov ? ink : soft;
        var short = sn.name.split(",")[0].split(" &")[0];
        var tw = ctx.measureText(short).width;
        var lx = pn.x + 10, ly = pn.y + 4;
        if (sn.labelLeft) lx = pn.x - 10 - tw;
        if (sn.labelDy) ly = pn.y + sn.labelDy;
        if (lx + tw > W - 6) { lx = pn.x - 10 - tw; }
        ctx.fillText(short, lx, ly);
      }
    }

    raf = null;
    if (!reduced && visible) { t += 0.016; raf = requestAnimationFrame(draw); }
  }
  function kick() { if (raf === null) raf = requestAnimationFrame(draw); }

  function pick(mx, my) {
    var best = null, bd = 22;
    for (var i = 0; i < SITES.length; i++) {
      var p = px(SITES[i]), d = Math.hypot(p.x - mx, p.y - my);
      if (d < bd) { bd = d; best = SITES[i]; }
    }
    return best;
  }

  function showTip(s) {
    var p = px(s);
    tip.innerHTML = "<h4>" + s.name + '</h4><p class="tip-inst">' + s.inst + "</p><p>" + s.desc + "</p>";
    tip.classList.add("show");
    var tw = Math.min(260, W * 0.8);
    var left = p.x + 16;
    if (left + tw > W) left = Math.max(4, p.x - tw - 16);
    var top = p.y + 14;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
    requestAnimationFrame(function () {
      var r = tip.getBoundingClientRect(), hr = holder.getBoundingClientRect();
      if (r.bottom > hr.bottom) tip.style.top = Math.max(4, p.y - r.height - 14) + "px";
    });
  }

  canvas.addEventListener("pointermove", function (e) {
    var r = canvas.getBoundingClientRect();
    var s = pick(e.clientX - r.left, e.clientY - r.top);
    if (s !== hovered) {
      hovered = s;
      if (s) showTip(s); else tip.classList.remove("show");
      kick();
    }
    canvas.style.cursor = s ? "pointer" : "crosshair";
  });
  canvas.addEventListener("pointerleave", function () { hovered = null; tip.classList.remove("show"); kick(); });
  canvas.addEventListener("click", function (e) {
    var r = canvas.getBoundingClientRect();
    var s = pick(e.clientX - r.left, e.clientY - r.top);
    hovered = s;
    if (s) showTip(s); else tip.classList.remove("show");
    kick();
  });

  document.querySelectorAll(".chip").forEach(function (ch) {
    ch.addEventListener("click", function () {
      document.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
      ch.classList.add("active");
      filter = ch.dataset.filter;
      kick();
    });
  });

  window.addEventListener("resize", function () { resize(); kick(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) kick();
    }).observe(canvas);
  } else {
    visible = true;
  }
  resize();
  draw();
})();
