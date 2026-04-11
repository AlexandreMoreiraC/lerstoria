import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- 1. DICIONÁRIO GLOBAL (Funciona para TODOS os textos) ---
// Adicione aqui as palavras de todos os seus livros. 
// Se a palavra já estiver aqui, não precisa repetir para o próximo livro.
const wordBank = {
    // Palavras do Texto de Saturno
    "saturn": "Saturno",
    "is": "é / está",
    "a": "um / uma",
    "very": "muito / bastante",
    "big": "grande / enorme",
    "planet": "planeta",
    "in": "em / no / na",
    "the": "o / a / os / as",
    "sky": "céu",
    "it": "ele / ela (objeto/animal)",
    "has": "tem / possui",
    "many": "muitos / várias",
    "rings": "anéis",
    "are": "são / estão",
    "beautiful": "bonito / lindo / bela",
    "and": "e",
    "bright": "brilhante / reluzente",
    "one day": "um dia",
    "small": "pequeno / baixo",
    "boy": "menino / garoto",
    "looks at": "olha para",
    "stars": "estrelas",
    "he": "ele",
    "telescope": "telescópio",
    "sees": "vê / enxerga",
    "but": "mas / porém",
    "then": "então / depois",
    "something": "algo / alguma coisa",
    "happens": "acontece / ocorre",
    "not": "não",
    "there": "lá / ali / ai",
    "there is": "há / existe",
    "flash": "clarão / brilho",
    "of": "de / do / da",
    "light": "luz",
    "surprised": "surpreso / admirado",
    "where": "onde / aonde",
    "asks": "pergunta / pede",
    "runs": "corre / administra",
    "to": "para / a",
    "his": "dele / seu",
    "father": "pai",
    "scientist": "cientista",
    "too": "também / demais",
    "they": "eles / elas",
    "both": "ambos / os dois",
    "quiet": "quieto / silencioso",
    "for": "por / para / durante",
    "long time": "longo tempo / muito tempo",
    "mystery": "mistério / enigma",
    "next day": "próximo dia / dia seguinte",
    "news": "notícias / jornal",
    "on": "em / no / ligado",
    "everyone": "todos / todo mundo",
    "talking": "falando / conversando",
    "about": "sobre / a respeito de",

    // Palavras de outros textos (Exemplo: do Astronauta Max)
    "today": "hoje",
    "strange": "estranho / esquisito",
    "astronaut": "astronauta",
    "space station": "estação espacial",
    "looks out": "olha para fora",
    "window": "janela",
    "black": "preto / negro",
    "white": "branco",
    "made of": "feito de",
    "ice": "gelo",
    "dust": "poeira / pó",
    "suddenly": "de repente / subitamente",
    "boom": "bum! (explosão)",
    "orange": "laranja",
    "red": "vermelho",
    "purple": "roxo / púrpura",
    "round": "redondo / circular",
    "anymore": "mais (não mais)",
    "exploding": "explodindo",
    "sad": "triste / lamentável",
    "gone": "foi-se / sumiu / partido",
    "bed": "cama"
};
// --- 1. BANCO DE DADOS DE HISTÓRIAS (+280 palavras por texto) ---
const bookData = {
    // ================= LEVEL A1 (Beginner) =================
"book_1": {
  title: "The Lion and the Mouse",
  level: "A1",
  content: `
  <p><span>It</span> <span>is</span> <span>a</span> <span>very</span> <span>hot</span> <span>day</span> <span>in</span> <span>the</span> <span>big</span> <span>forest.</span> <span>The</span> <span>sun</span> <span>is</span> <span>yellow</span> <span>and</span> <span>bright.</span> <span>A</span> <span>big</span> <span>Lion</span> <span>is</span> <span>very</span> <span>tired.</span> <span>He</span> <span>walks</span> <span>to</span> <span>a</span> <span>large</span> <span>tree.</span> <span>The</span> <span>tree</span> <span>has</span> <span>green</span> <span>leaves.</span> <span>The</span> <span>Lion</span> <span>lies</span> <span>down</span> <span>on</span> <span>the</span> <span>grass.</span> <span>Soon,</span> <span>the</span> <span>Lion</span> <span>is</span> <span>sleeping</span> <span>and</span> <span>dreaming.</span></p>
  <a>É um dia muito quente na grande floresta. O sol está amarelo e brilhante. Um Leão grande está muito cansado. Ele caminha até uma árvore grande. A árvore tem folhas verdes. O Leão deita na grama. Logo, o Leão está dormindo e sonhando.</a>

  <p><span>Near</span> <span>the</span> <span>tree,</span> <span>a</span> <span>small</span> <span>Mouse</span> <span>is</span> <span>looking for</span> <span>food.</span> <span>The</span> <span>Mouse</span> <span>is</span> <span>very</span> <span>happy.</span> <span>He</span> <span>sees</span> <span>the</span> <span>Lion,</span> <span>but</span> <span>he</span> <span>is</span> <span>not</span> <span>afraid.</span> <span>The</span> <span>Mouse</span> <span>runs</span> <span>over</span> <span>the</span> <span>Lion's</span> <span>big</span> <span>legs.</span> <span>Then,</span> <span>he</span> <span>runs</span> <span>over</span> <span>the</span> <span>Lion's</span> <span>stomach.</span> <span>Finally,</span> <span>he</span> <span>runs</span> <span>over</span> <span>the</span> <span>Lion's</span> <span>nose.</span> <span>The</span> <span>Mouse</span> <span>is</span> <span>playing.</span></p>
  <a>Perto da árvore, um Ratinho pequeno está procurando comida. O Ratinho está muito feliz. Ele vê o Leão, mas não tem medo. O Ratinho corre sobre as pernas grandes do Leão. Depois, ele corre sobre a barriga do Leão. Finalmente, ele corre sobre o nariz do Leão. O Ratinho está brincando.</a>

  <p><span>Suddenly,</span> <span>the</span> <span>Lion</span> <span>opens</span> <span>his</span> <span>eyes.</span> <span>He</span> <span>is</span> <span>not</span> <span>happy.</span> <span>He</span> <span>is</span> <span>very</span> <span>angry.</span> <span>The</span> <span>Lion</span> <span>puts</span> <span>his</span> <span>heavy</span> <span>paw</span> <span>on</span> <span>the</span> <span>small</span> <span>Mouse.</span> <span>The</span> <span>Mouse</span> <span>cannot</span> <span>move.</span> <span>"Why</span> <span>are</span> <span>you</span> <span>waking</span> <span>me</span> <span>up?"</span> <span>the</span> <span>Lion</span> <span>roars.</span> <span>"I</span> <span>am</span> <span>the</span> <span>King!</span> <span>I</span> <span>will</span> <span>eat</span> <span>you!"</span></p>
  <a>De repente, o Leão abre os olhos. Ele não está feliz. Ele está muito bravo. O Leão coloca sua pata pesada sobre o Ratinho pequeno. O Ratinho não consegue se mover. "Por que você está me acordando?" o Leão ruge. "Eu sou o Rei! Eu vou te comer!"</a>

  <p><span>The</span> <span>Mouse</span> <span>is</span> <span>shaking.</span> <span>"Oh,</span> <span>please,</span> <span>Mr. Lion,"</span> <span>cries</span> <span>the</span> <span>Mouse.</span> <span>"I</span> <span>am</span> <span>very</span> <span>sorry.</span> <span>It</span> <span>was</span> <span>a</span> <span>mistake.</span> <span>Please</span> <span>do not</span> <span>eat</span> <span>me.</span> <span>I</span> <span>am</span> <span>only</span> <span>a</span> <span>small</span> <span>animal.</span> <span>If</span> <span>you</span> <span>let</span> <span>me</span> <span>go,</span> <span>I</span> <span>promise</span> <span>to</span> <span>help</span> <span>you</span> <span>one day."</span></p>
  <a>O Ratinho está tremendo. "Oh, por favor, Sr. Leão," chora o Ratinho. "Sinto muito. Foi um erro. Por favor, não me coma. Sou apenas um animal pequeno. Se você me deixar ir, prometo te ajudar um dia."</a>

  <p><span>The</span> <span>Lion</span> <span>looks at</span> <span>the</span> <span>Mouse</span> <span>and</span> <span>laughs.</span> <span>"You</span> <span>help</span> <span>me?"</span> <span>the</span> <span>Lion</span> <span>asks.</span> <span>"You</span> <span>are</span> <span>tiny!</span> <span>I</span> <span>am</span> <span>big</span> <span>and</span> <span>strong.</span> <span>How</span> <span>can</span> <span>a</span> <span>little</span> <span>Mouse</span> <span>help</span> <span>the</span> <span>King</span> <span>of</span> <span>the</span> <span>forest?</span> <span>This</span> <span>is</span> <span>very</span> <span>funny!"</span> <span>Because</span> <span>the</span> <span>Lion</span> <span>is</span> <span>in</span> <span>a</span> <span>good</span> <span>mood,</span> <span>he</span> <span>lifts</span> <span>his</span> <span>paw.</span> <span>"Go away,</span> <span>little</span> <span>one,"</span> <span>he</span> <span>says.</span> <span>The</span> <span>Mouse</span> <span>runs</span> <span>away</span> <span>very</span> <span>fast.</span></p>
  <a>O Leão olha para o Ratinho e ri. "Você me ajudar?" o Leão pergunta. "Você é minúsculo! Eu sou grande e forte. Como um Ratinho pequeno pode ajudar o Rei da floresta? Isso é muito engraçado!" Como o Leão está de bom humor, ele levanta a pata. "Vá embora, pequeno," ele diz. O Ratinho foge muito rápido.</a>

  <p><span>A</span> <span>few</span> <span>weeks</span> <span>later,</span> <span>the</span> <span>Lion</span> <span>is</span> <span>walking</span> <span>and</span> <span>looking for</span> <span>his</span> <span>dinner.</span> <span>Suddenly,</span> <span>he</span> <span>walks</span> <span>into</span> <span>a</span> <span>trap.</span> <span>The</span> <span>trap</span> <span>is</span> <span>a</span> <span>large</span> <span>net</span> <span>made of</span> <span>very</span> <span>strong</span> <span>ropes.</span> <span>The</span> <span>Lion</span> <span>is</span> <span>caught.</span> <span>He</span> <span>pulls</span> <span>and</span> <span>pulls,</span> <span>but</span> <span>the</span> <span>ropes</span> <span>do not</span> <span>break.</span> <span>The</span> <span>Lion</span> <span>is</span> <span>scared.</span> <span>He</span> <span>roars</span> <span>for</span> <span>help.</span> <span>His</span> <span>voice</span> <span>goes</span> <span>everywhere</span> <span>in</span> <span>the</span> <span>forest.</span></p>
  <a>Algumas semanas depois, o Leão está caminhando e procurando seu jantar. De repente, ele cai em uma armadilha. A armadilha é uma rede grande feita de cordas muito fortes. O Leão está preso. Ele puxa e puxa, mas as cordas não quebram. O Leão está com medo. Ele ruge por ajuda. Sua voz vai por toda parte na floresta.</a>

  <p><span>The</span> <span>small</span> <span>Mouse</span> <span>is</span> <span>eating</span> <span>a</span> <span>nut</span> <span>when</span> <span>he</span> <span>hears</span> <span>the</span> <span>noise.</span> <span>"I</span> <span>know</span> <span>that</span> <span>voice,"</span> <span>the</span> <span>Mouse</span> <span>says.</span> <span>"It</span> <span>is</span> <span>my</span> <span>friend,</span> <span>the</span> <span>Lion."</span> <span>The</span> <span>Mouse</span> <span>runs</span> <span>to</span> <span>the</span> <span>Lion.</span> <span>He</span> <span>sees</span> <span>the</span> <span>King</span> <span>in</span> <span>the</span> <span>net.</span> <span>"Don't</span> <span>worry,"</span> <span>says</span> <span>the</span> <span>Mouse.</span> <span>"I</span> <span>will</span> <span>help</span> <span>you</span> <span>now."</span></p>
  <a>O Ratinho pequeno está comendo uma noz quando ouve o barulho. "Eu conheço essa voz," o Ratinho diz. "É meu amigo, o Leão." O Ratinho corre até o Leão. Ele vê o Rei na rede. "Não se preocupe," diz o Ratinho. "Eu vou te ajudar agora."</a>

  <p><span>The</span> <span>Lion</span> <span>looks</span> <span>sad.</span> <span>"How</span> <span>can</span> <span>you</span> <span>help?"</span> <span>he</span> <span>asks.</span> <span>"The</span> <span>ropes</span> <span>are</span> <span>too</span> <span>thick."</span> <span>The</span> <span>Mouse</span> <span>does not</span> <span>talk.</span> <span>He</span> <span>starts</span> <span>to</span> <span>use</span> <span>his</span> <span>teeth.</span> <span>He</span> <span>bites</span> <span>one</span> <span>rope.</span> <span>Then</span> <span>he</span> <span>bites</span> <span>another</span> <span>rope.</span> <span>The</span> <span>Mouse</span> <span>is</span> <span>working</span> <span>very</span> <span>hard.</span> <span>Finally,</span> <span>a</span> <span>big</span> <span>hole</span> <span>is</span> <span>in</span> <span>the</span> <span>net.</span></p>
  <a>O Leão parece triste. "Como você pode ajudar?" ele pergunta. "As cordas são muito grossas." O Ratinho não fala. Ele começa a usar seus dentes. Ele morde uma corda. Depois morde outra corda. O Ratinho está trabalhando muito duro. Finalmente, há um buraco grande na rede.</a>

  <p><span>The</span> <span>Lion</span> <span>crawls</span> <span>out of</span> <span>the</span> <span>net.</span> <span>He</span> <span>is</span> <span>free!</span> <span>The</span> <span>Lion</span> <span>looks at</span> <span>the</span> <span>small</span> <span>Mouse.</span> <span>"I</span> <span>was</span> <span>wrong,"</span> <span>says</span> <span>the</span> <span>Lion.</span> <span>"You</span> <span>are</span> <span>small,</span> <span>but</span> <span>you</span> <span>are</span> <span>very</span> <span>brave</span> <span>and</span> <span>kind.</span> <span>Thank you</span> <span>for</span> <span>saving</span> <span>my</span> <span>life."</span> <span>The</span> <span>Lion</span> <span>and</span> <span>the</span> <span>Mouse</span> <span>are</span> <span>best</span> <span>friends</span> <span>forever.</span></p>
  <a>O Leão rasteja para fora da rede. Ele está livre! O Leão olha para o Ratinho pequeno. "Eu estava errado," diz o Leão. "Você é pequeno, mas é muito bravo e gentil. Obrigado por salvar minha vida." O Leão e o Ratinho são melhores amigos para sempre.</a>
  `
},

"book_2": {
  title: "The Tortoise and the Hare",
  level: "A1",
  content: `
  <p><span>The</span> <span>Hare</span> <span>is</span> <span>a</span> <span>very</span> <span>happy</span> <span>animal.</span> <span>He</span> <span>has</span> <span>long</span> <span>ears</span> <span>and</span> <span>very</span> <span>fast</span> <span>legs.</span> <span>He</span> <span>runs</span> <span>every</span> <span>day</span> <span>in</span> <span>the</span> <span>green</span> <span>field.</span> <span>The</span> <span>Hare</span> <span>is</span> <span>very</span> <span>proud.</span> <span>He</span> <span>always</span> <span>says</span> <span>to</span> <span>the</span> <span>other</span> <span>animals,</span> <span>"I</span> <span>am</span> <span>the</span> <span>fastest</span> <span>animal</span> <span>in</span> <span>the</span> <span>world!</span> <span>No</span> <span>one</span> <span>can</span> <span>beat</span> <span>me."</span></p>
  <a>A Lebre é um animal muito feliz. Ela tem orelhas longas e pernas muito rápidas. Ela corre todos os dias no campo verde. A Lebre é muito orgulhosa. Ela sempre diz aos outros animais: "Eu sou o animal mais rápido do mundo! Ninguém pode me vencer."</a>

  <p><span>The</span> <span>Tortoise</span> <span>is</span> <span>very</span> <span>different.</span> <span>He</span> <span>is</span> <span>quiet</span> <span>and</span> <span>calm.</span> <span>He</span> <span>has</span> <span>short</span> <span>legs</span> <span>and</span> <span>a</span> <span>heavy</span> <span>shell</span> <span>on</span> <span>his</span> <span>back.</span> <span>He</span> <span>walks</span> <span>very</span> <span>slowly.</span> <span>*Step...</span> <span>step...</span> <span>step.*</span> <span>When</span> <span>the</span> <span>Hare</span> <span>sees</span> <span>the</span> <span>Tortoise,</span> <span>he</span> <span>laughs</span> <span>loudly.</span> <span>"You</span> <span>are</span> <span>so</span> <span>slow,</span> <span>Tortoise!</span> <span>It</span> <span>takes</span> <span>you</span> <span>all</span> <span>day</span> <span>to</span> <span>cross</span> <span>the</span> <span>road!"</span></p>
  <a>A Tartaruga é muito diferente. Ela é quieta e calma. Ela tem pernas curtas e uma carapaça pesada nas costas. Ela caminha muito devagar. *Passo... passo... passo.* Quando a Lebre vê a Tartaruga, ela ri alto. "Você é tão lenta, Tartaruga! Você leva o dia todo para atravessar a estrada!"</a>

  <p><span>The</span> <span>Tortoise</span> <span>stops</span> <span>and</span> <span>looks at</span> <span>the</span> <span>Hare.</span> <span>"You</span> <span>are</span> <span>fast,</span> <span>yes,"</span> <span>the</span> <span>Tortoise</span> <span>says</span> <span>quietly.</span> <span>"But</span> <span>I</span> <span>want</span> <span>to</span> <span>race</span> <span>you.</span> <span>Let's</span> <span>have</span> <span>a</span> <span>race</span> <span>tomorrow</span> <span>morning."</span> <span>The</span> <span>Hare</span> <span>laughs</span> <span>even</span> <span>more.</span> <span>"A</span> <span>race?</span> <span>This</span> <span>is</span> <span>a</span> <span>great</span> <span>joke!</span> <span>Okay,</span> <span>Tortoise.</span> <span>We</span> <span>will</span> <span>race."</span></p>
  <a>A Tartaruga para e olha para a Lebre. "Você é rápida, sim," a Tartaruga diz calmamente. "Mas eu quero correr contra você. Vamos fazer uma corrida amanhã de manhã." A Lebre ri ainda mais. "Uma corrida? Isso é uma ótima piada! Ok, Tartaruga. Nós vamos correr."</a>

  <p><span>The</span> <span>next</span> <span>morning,</span> <span>all</span> <span>the</span> <span>animals</span> <span>come</span> <span>to</span> <span>the</span> <span>field.</span> <span>The</span> <span>Fox</span> <span>is</span> <span>the</span> <span>judge.</span> <span>"Ready,</span> <span>set,</span> <span>go!"</span> <span>shouts</span> <span>the</span> <span>Fox.</span> <span>The</span> <span>Hare</span> <span>runs</span> <span>like</span> <span>the</span> <span>wind.</span> <span>In</span> <span>one</span> <span>minute,</span> <span>he</span> <span>is</span> <span>on</span> <span>top</span> <span>of</span> <span>the</span> <span>hill.</span> <span>He</span> <span>looks</span> <span>back.</span> <span>The</span> <span>Tortoise</span> <span>is</span> <span>very,</span> <span>very</span> <span>far</span> <span>away.</span> <span>He</span> <span>is</span> <span>just</span> <span>starting</span> <span>to</span> <span>move.</span></p>
  <a>Na manhã seguinte, todos os animais vêm ao campo. A Raposa é a juíza. "Preparar, apontar, já!" grita a Raposa. A Lebre corre como o vento. Em um minuto, ela está no topo da colina. Ela olha para trás. A Tartaruga está muito, muito longe. Ela está apenas começando a se mover.</a>

  <p><span>The</span> <span>sun</span> <span>is</span> <span>getting</span> <span>hot.</span> <span>The</span> <span>Hare</span> <span>feels</span> <span>very</span> <span>confident.</span> <span>"The</span> <span>Tortoise</span> <span>is</span> <span>too</span> <span>slow,"</span> <span>he</span> <span>thinks.</span> <span>"I</span> <span>have</span> <span>many</span> <span>hours.</span> <span>I</span> <span>will</span> <span>sit</span> <span>under</span> <span>this</span> <span>shady</span> <span>tree.</span> <span>I</span> <span>can</span> <span>take</span> <span>a</span> <span>small</span> <span>nap.</span> <span>When</span> <span>I</span> <span>wake up,</span> <span>I</span> <span>will</span> <span>finish</span> <span>the</span> <span>race."</span> <span>The</span> <span>Hare</span> <span>closes</span> <span>his</span> <span>eyes</span> <span>and</span> <span>soon</span> <span>he</span> <span>is</span> <span>sleeping</span> <span>deeply.</span></p>
  <a>O sol está ficando quente. A Lebre se sente muito confiante. "A Tartaruga é lenta demais", ela pensa. "Eu tenho muitas horas. Vou sentar debaixo desta árvore sombreada. Posso tirar uma soneca. Quando eu acordar, terminarei a corrida." A Lebre fecha os olhos e logo está dormindo profundamente.</a>

  <p><span>Meanwhile,</span> <span>the</span> <span>Tortoise</span> <span>keeps</span> <span>walking.</span> <span>He</span> <span>is</span> <span>very</span> <span>tired.</span> <span>His</span> <span>legs</span> <span>hurt.</span> <span>But</span> <span>he</span> <span>does</span> <span>not</span> <span>stop.</span> <span>He</span> <span>walks</span> <span>past</span> <span>the</span> <span>flowers.</span> <span>He</span> <span>walks</span> <span>past</span> <span>the</span> <span>river.</span> <span>He</span> <span>reaches</span> <span>the</span> <span>shady</span> <span>tree.</span> <span>He</span> <span>sees</span> <span>the</span> <span>Hare</span> <span>sleeping.</span> <span>The</span> <span>Tortoise</span> <span>is</span> <span>quiet.</span> <span>He</span> <span>walks</span> <span>past</span> <span>the</span> <span>Hare.</span></p>
  <a>Enquanto isso, a Tartaruga continua caminhando. Ela está muito cansada. Suas pernas doem. Mas ela não para. Ela passa pelas flores. Ela passa pelo rio. Ela chega à árvore sombreada. Ela vê a Lebre dormindo. A Tartaruga fica quieta. Ela passa pela Lebre.</a>

  <p><span>The</span> <span>afternoon</span> <span>comes.</span> <span>The</span> <span>sun</span> <span>is</span> <span>going</span> <span>down.</span> <span>Finally,</span> <span>the</span> <span>Hare</span> <span>wakes up.</span> <span>He</span> <span>looks</span> <span>around.</span> <span>"Oh!</span> <span>Where</span> <span>is</span> <span>the</span> <span>Tortoise?"</span> <span>he</span> <span>asks.</span> <span>He</span> <span>runs</span> <span>to</span> <span>the</span> <span>finish</span> <span>line</span> <span>very,</span> <span>very</span> <span>fast.</span> <span>But</span> <span>when</span> <span>he</span> <span>arrives,</span> <span>all</span> <span>the</span> <span>animals</span> <span>are</span> <span>cheering.</span> <span>"Hooray!</span> <span>Hooray!"</span></p>
  <a>A tarde chega. O sol está se pondo. Finalmente, a Lebre acorda. Ela olha em volta. "Oh! Onde está a Tartaruga?" ela pergunta. Ela corre para a linha de chegada muito, muito rápido. Mas quando ela chega, todos os animais estão torcendo. "Viva! Viva!"</a>

  <p><span>The</span> <span>Tortoise</span> <span>is</span> <span>already</span> <span>there.</span> <span>He</span> <span>is</span> <span>the</span> <span>winner!</span> <span>The</span> <span>Hare</span> <span>is</span> <span>very</span> <span>sad</span> <span>and</span> <span>ashamed.</span> <span>The</span> <span>Tortoise</span> <span>smiles</span> <span>at</span> <span>the</span> <span>Hare.</span> <span>"Remember,</span> <span>my</span> <span>friend,"</span> <span>the</span> <span>Tortoise</span> <span>says,</span> <span>"being</span> <span>fast</span> <span>is</span> <span>not</span> <span>everything.</span> <span>Slow</span> <span>and</span> <span>steady</span> <span>wins</span> <span>the</span> <span>race."</span></p>
  <a>A Tartaruga já está lá. Ela é a vencedora! A Lebre está muito triste e envergonhada. A Tartaruga sorri para a Lebre. "Lembre-se, minha amiga", diz a Tartaruga, "ser rápida não é tudo. Devagar e sempre se vence a corrida."</a>
  `
},

 "book_3": {
  title: "The Little Red Hen",
  level: "A1",
  content: `
  <p><span>Once</span> <span>upon</span> <span>a</span> <span>time,</span> <span>there</span> <span>is</span> <span>a</span> <span>Little</span> <span>Red</span> <span>Hen.</span> <span>She</span> <span>lives</span> <span>on</span> <span>a</span> <span>farm.</span> <span>The</span> <span>farm</span> <span>is</span> <span>very</span> <span>pretty.</span> <span>She</span> <span>has</span> <span>three</span> <span>friends:</span> <span>a</span> <span>Dog,</span> <span>a</span> <span>Cat,</span> <span>and</span> <span>a</span> <span>Duck.</span> <span>But</span> <span>her</span> <span>friends</span> <span>are</span> <span>very</span> <span>lazy.</span> <span>They</span> <span>only</span> <span>want</span> <span>to</span> <span>sleep</span> <span>all</span> <span>day</span> <span>in</span> <span>the</span> <span>warm</span> <span>sun.</span></p>
  <a>Era uma vez uma Pequena Galinha Ruiva. Ela mora em uma fazenda. A fazenda é muito bonita. Ela tem três amigos: um Cão, um Gato e um Pato. Mas os amigos dela são muito preguiçosos. Eles só querem dormir o dia todo no sol quente.</a>

  <p><span>One</span> <span>morning,</span> <span>the</span> <span>Little</span> <span>Red</span> <span>Hen</span> <span>is</span> <span>walking</span> <span>near</span> <span>the</span> <span>barn.</span> <span>She</span> <span>finds</span> <span>some</span> <span>seeds.</span> <span>They</span> <span>are</span> <span>wheat</span> <span>seeds.</span> <span>"This</span> <span>is</span> <span>good,"</span> <span>she</span> <span>thinks.</span> <span>She</span> <span>goes</span> <span>to</span> <span>her</span> <span>friends.</span> <span>"Who</span> <span>will</span> <span>help</span> <span>me</span> <span>plant</span> <span>these</span> <span>seeds?"</span> <span>she</span> <span>asks.</span></p>
  <a>Uma manhã, a Pequena Galinha Ruiva está caminhando perto do celeiro. Ela encontra algumas sementes. São sementes de trigo. "Isso é bom", ela pensa. Ela vai até seus amigos. "Quem vai me ajudar a plantar estas sementes?" ela pergunta.</a>

  <p><span>"Not</span> <span>I,"</span> <span>says</span> <span>the</span> <span>sleepy</span> <span>Dog.</span> <span>"Not</span> <span>I,"</span> <span>says</span> <span>the</span> <span>lazy</span> <span>Cat.</span> <span>"Not</span> <span>I,"</span> <span>says</span> <span>the</span> <span>noisy</span> <span>Duck.</span> <span>"Very</span> <span>well,"</span> <span>says</span> <span>the</span> <span>Little</span> <span>Red</span> <span>Hen.</span> <span>"I</span> <span>will</span> <span>do</span> <span>it</span> <span>myself."</span> <span>And</span> <span>she</span> <span>plants</span> <span>the</span> <span>wheat</span> <span>seeds</span> <span>in</span> <span>the</span> <span>brown</span> <span>dirt.</span></p>
  <a>"Eu não", diz o Cão sonolento. "Eu não", diz o Gato preguiçoso. "Eu não", diz o Pato barulhento. "Muito bem", diz a Pequena Galinha Ruiva. "Eu farei isso sozinha." E ela planta as sementes de trigo na terra marrom.</a>

  <p><span>Every</span> <span>day,</span> <span>she</span> <span>gives</span> <span>the</span> <span>seeds</span> <span>water.</span> <span>The</span> <span>sun</span> <span>shines.</span> <span>The</span> <span>wheat</span> <span>grows</span> <span>and</span> <span>grows.</span> <span>Soon,</span> <span>it</span> <span>is</span> <span>tall</span> <span>and</span> <span>yellow.</span> <span>"The</span> <span>wheat</span> <span>is</span> <span>ready,"</span> <span>says</span> <span>the</span> <span>Hen.</span> <span>"Who</span> <span>will</span> <span>help</span> <span>me</span> <span>cut</span> <span>the</span> <span>wheat?"</span> <span>she</span> <span>asks</span> <span>her</span> <span>friends.</span></p>
  <a>Todos os dias, ela dá água às sementes. O sol brilha. O trigo cresce e cresce. Logo, ele está alto e amarelo. "O trigo está pronto", diz a Galinha. "Quem vai me ajudar a colher o trigo?" ela pergunta aos amigos.</a>

  <p><span>"Not</span> <span>I,"</span> <span>says</span> <span>the</span> <span>Dog.</span> <span>"Not</span> <span>I,"</span> <span>says</span> <span>the</span> <span>Cat.</span> <span>"Not</span> <span>I,"</span> <span>says</span> <span>the</span> <span>Duck.</span> <span>"Very</span> <span>well,"</span> <span>says</span> <span>the</span> <span>Hen.</span> <span>"I</span> <span>will</span> <span>do</span> <span>it</span> <span>myself."</span> <span>She</span> <span>cuts</span> <span>the</span> <span>wheat</span> <span>with</span> <span>her</span> <span>beak.</span> <span>It</span> <span>is</span> <span>very</span> <span>hard</span> <span>work.</span> <span>Her</span> <span>friends</span> <span>just</span> <span>watch</span> <span>her.</span></p>
  <a>"Eu não", diz o Cão. "Eu não", diz o Gato. "Eu não", diz o Pato. "Muito bem", diz a Galinha. "Eu farei isso sozinha." Ela colhe o trigo com o bico. É um trabalho muito duro. Seus amigos apenas a observam.</a>

  <p><span>"Now,"</span> <span>says</span> <span>the</span> <span>Hen,</span> <span>"who</span> <span>will</span> <span>help</span> <span>me</span> <span>take</span> <span>this</span> <span>wheat</span> <span>to</span> <span>the</span> <span>mill?"</span> <span>The</span> <span>mill</span> <span>makes</span> <span>flour</span> <span>for</span> <span>bread.</span> <span>But</span> <span>the</span> <span>friends</span> <span>say,</span> <span>"Not</span> <span>I."</span> <span>The</span> <span>Little</span> <span>Red</span> <span>Hen</span> <span>goes</span> <span>to</span> <span>the</span> <span>mill</span> <span>alone.</span> <span>She</span> <span>carries</span> <span>the</span> <span>heavy</span> <span>bag.</span> <span>She</span> <span>is</span> <span>very</span> <span>tired,</span> <span>but</span> <span>she</span> <span>is</span> <span>very</span> <span>strong.</span></p>
  <a>"Agora", diz a Galinha, "quem vai me ajudar a levar este trigo ao moinho?" O moinho faz farinha para pão. Mas os amigos dizem: "Eu não". A Pequena Galinha Ruiva vai ao moinho sozinha. Ela carrega a sacola pesada. Ela está muito cansada, mas ela é muito forte.</a>

  <p><span>She</span> <span>comes</span> <span>back</span> <span>with</span> <span>the</span> <span>flour.</span> <span>"Who</span> <span>will</span> <span>help</span> <span>me</span> <span>bake</span> <span>the</span> <span>bread?"</span> <span>"Not</span> <span>I,"</span> <span>say</span> <span>the</span> <span>friends.</span> <span>The</span> <span>Hen</span> <span>goes</span> <span>to</span> <span>the</span> <span>kitchen.</span> <span>She</span> <span>mixes</span> <span>the</span> <span>flour</span> <span>and</span> <span>water.</span> <span>She</span> <span>puts</span> <span>the</span> <span>bread</span> <span>in</span> <span>the</span> <span>oven.</span> <span>Soon,</span> <span>the</span> <span>house</span> <span>smells</span> <span>wonderful.</span> <span>The</span> <span>bread</span> <span>is</span> <span>hot</span> <span>and</span> <span>fresh.</span></p>
  <a>Ela volta com a farinha. "Quem vai me ajudar a assar o pão?" "Eu não", dizem os amigos. A Galinha vai para a cozinha. Ela mistura a farinha e a água. Ela coloca o pão no forno. Logo, a casa cheira maravilhosamente bem. O pão está quente e fresco.</a>

  <p><span>The</span> <span>Dog,</span> <span>the</span> <span>Cat,</span> <span>and</span> <span>the</span> <span>Duck</span> <span>run</span> <span>to</span> <span>the</span> <span>kitchen.</span> <span>They</span> <span>are</span> <span>very</span> <span>hungry.</span> <span>"Who</span> <span>will</span> <span>help</span> <span>me</span> <span>eat</span> <span>this</span> <span>bread?"</span> <span>asks</span> <span>the</span> <span>Little</span> <span>Red</span> <span>Hen.</span> <span>"I</span> <span>will!"</span> <span>shouts</span> <span>the</span> <span>Dog.</span> <span>"I</span> <span>will!"</span> <span>shouts</span> <span>the</span> <span>Cat.</span> <span>"I</span> <span>will!"</span> <span>shouts</span> <span>the</span> <span>Duck.</span></p>
  <a>O Cão, o Gato e o Pato correm para a cozinha. Eles estão com muita fome. "Quem vai me ajudar a comer este pão?" pergunta a Pequena Galinha Ruiva. "Eu vou!" grita o Cão. "Eu vou!" grita o Gato. "Eu vou!" grita o Pato.</a>

  <p><span>"No,"</span> <span>says</span> <span>the</span> <span>Little</span> <span>Red</span> <span>Hen.</span> <span>"You</span> <span>did</span> <span>not</span> <span>help</span> <span>me</span> <span>plant</span> <span>the</span> <span>seeds.</span> <span>You</span> <span>did</span> <span>not</span> <span>help</span> <span>me</span> <span>cut</span> <span>the</span> <span>wheat.</span> <span>You</span> <span>did</span> <span>not</span> <span>help</span> <span>me</span> <span>bake</span> <span>the</span> <span>bread.</span> <span>I</span> <span>did</span> <span>all</span> <span>the</span> <span>work.</span> <span>Now,</span> <span>my</span> <span>little</span> <span>chicks</span> <span>and</span> <span>I</span> <span>will</span> <span>eat</span> <span>the</span> <span>bread."</span> <span>The</span> <span>Hen</span> <span>and</span> <span>her</span> <span>chicks</span> <span>eat</span> <span>everything.</span> <span>The</span> <span>lazy</span> <span>friends</span> <span>get</span> <span>nothing.</span></p>
  <a>"Não", diz a Pequena Galinha Ruiva. "Vocês não me ajudaram a plantar as sementes. Vocês não me ajudaram a colher o trigo. Vocês não me ajudaram a assar o pão. Eu fiz todo o trabalho. Agora, meus pintinhos e eu comeremos o pão." A Galinha e seus pintinhos comem tudo. Os amigos preguiçosos não ganham nada.</a>
  `
},

  "book_4": {
  title: "The Boy Who Cried Wolf",
  level: "A1",
  content: `
  <p><span>In</span> <span>a</span> <span>small</span> <span>village,</span> <span>there</span> <span>is</span> <span> a</span> <span>young</span> <span>boy.</span> <span>His</span> <span>name</span> <span>is</span> <span>Peter.</span> <span>Peter</span> <span>has</span> <span>an</span> <span>important</span> <span>job.</span> <span>Every</span> <span>day,</span> <span>he</span> <span>takes</span> <span>the</span> <span>sheep</span> <span>to</span> <span>the</span> <span>top</span> <span>of</span> <span>the</span> <span>hill.</span> <span>He</span> <span>must</span> <span>watch</span> <span>them</span> <span>and</span> <span>keep</span> <span>them</span> <span>safe.</span> <span>The</span> <span>villagers</span> <span>tell</span> <span>him,</span> <span>"If</span> <span>you</span> <span>see</span> <span>a</span> <span>wolf,</span> <span>shout</span> <span>loudly.</span> <span>We</span> <span>will</span> <span>come</span> <span>to</span> <span>help</span> <span>you."</span></p>
  <a>Em uma pequena vila, há um menino jovem. O nome dele é Peter. Peter tem um trabalho importante. Todos os dias, ele leva as ovelhas para o topo da colina. Ele deve observá-las e mantê-las seguras. Os moradores da vila dizem a ele: "Se você vir um lobo, grite alto. Nós viremos para te ajudar."</a>

  <p><span>The</span> <span>hill</span> <span>is</span> <span>very</span> <span>quiet.</span> <span>Peter</span> <span>sits</span> <span>on</span> <span>a</span> <span>rock.</span> <span>He</span> <span>looks at</span> <span>the</span> <span>blue</span> <span>sky.</span> <span>He</span> <span>looks at</span> <span>the</span> <span>white</span> <span>sheep.</span> <span>He</span> <span>is</span> <span>very</span> <span>bored.</span> <span>"I</span> <span>want</span> <span>to</span> <span>have</span> <span>some</span> <span>fun,"</span> <span>Peter</span> <span>thinks.</span> <span>"I</span> <span>want</span> <span>to</span> <span>see</span> <span>the</span> <span>people."</span> <span>Suddenly,</span> <span>he</span> <span>stands</span> <span>up</span> <span>and</span> <span>shouts,</span> <span>"Wolf!</span> <span>Wolf!</span> <span>There</span> <span>is</span> <span>a</span> <span>wolf!"</span></p>
  <a>A colina é muito silenciosa. Peter senta em uma pedra. Ele olha para o céu azul. Ele olha para as ovelhas brancas. Ele está muito entediado. "Eu quero me divertir um pouco", pensa Peter. "Eu quero ver as pessoas." De repente, ele se levanta e grita: "Lobo! Lobo! Há um lobo!"</a>

  <p><span>Down</span> <span>in</span> <span>the</span> <span>village,</span> <span>the</span> <span>men</span> <span>and</span> <span>women</span> <span>hear</span> <span>Peter.</span> <span>"Quick!"</span> <span>they</span> <span>say.</span> <span>"The</span> <span>boy</span> <span>needs</span> <span>us!"</span> <span>They</span> <span>stop</span> <span>their</span> <span>work.</span> <span>They</span> <span>run</span> <span>up</span> <span>the</span> <span>hill</span> <span>very</span> <span>fast.</span> <span>When</span> <span>they</span> <span>arrive,</span> <span>they</span> <span>look</span> <span>everywhere.</span> <span>They</span> <span>don't</span> <span>see</span> <span>a</span> <span>wolf.</span> <span>They</span> <span>only</span> <span>see</span> <span>Peter</span> <span>laughing.</span></p>
  <a>Lá embaixo na vila, os homens e mulheres ouvem Peter. "Rápido!", eles dizem. "O menino precisa de nós!" Eles param seu trabalho. Eles correm colina acima muito rápido. Quando chegam, olham para todos os lugares. Eles não veem um lobo. Eles apenas veem Peter rindo.</a>

  <p><span>"It</span> <span>was</span> <span>just</span> <span>a</span> <span>joke,"</span> <span>says</span> <span>Peter.</span> <span>The</span> <span>villagers</span> <span>are</span> <span>not</span> <span>happy.</span> <span>"Don't</span> <span>lie,</span> <span>Peter,"</span> <span>they</span> <span>say.</span> <span>"It</span> <span>is</span> <span>dangerous."</span> <span>The</span> <span>people</span> <span>go</span> <span>back</span> <span>to</span> <span>the</span> <span>village.</span> <span>Peter</span> <span>is</span> <span>happy</span> <span>because</span> <span>he</span> <span>is</span> <span>not</span> <span>bored</span> <span>anymore.</span></p>
  <a>"Foi apenas uma piada", diz Peter. Os moradores não estão felizes. "Não minta, Peter", eles dizem. "É perigoso." As pessoas voltam para a vila. Peter está feliz porque não está mais entediado.</a>

  <p><span>The</span> <span>next</span> <span>day,</span> <span>Peter</span> <span>is</span> <span>on</span> <span>the</span> <span>hill</span> <span>again.</span> <span>"That</span> <span>was</span> <span>very</span> <span>fun,"</span> <span>he</span> <span>thinks.</span> <span>He</span> <span>shouts</span> <span>again,</span> <span>"Wolf!</span> <span>Wolf!</span> <span>Help!"</span> <span>The</span> <span>villagers</span> <span>run</span> <span>up</span> <span>the</span> <span>hill</span> <span>again.</span> <span>Again,</span> <span>there</span> <span>is</span> <span>no</span> <span>wolf.</span> <span>"Stop</span> <span>this</span> <span>now,</span> <span>Peter!"</span> <span>the</span> <span>people</span> <span>shout.</span> <span>They</span> <span>are</span> <span>very</span> <span>angry</span> <span>now.</span></p>
  <a>No dia seguinte, Peter está na colina novamente. "Aquilo foi muito divertido", ele pensa. Ele grita novamente: "Lobo! Lobo! Socorro!" Os moradores correm colina acima novamente. Novamente, não há lobo. "Pare com isso agora, Peter!", as pessoas gritam. Elas estão muito bravas agora.</a>

  <p><span>That</span> <span>evening,</span> <span>the</span> <span>sun</span> <span>is</span> <span>going</span> <span>down.</span> <span>The</span> <span>sky</span> <span>is</span> <span>orange</span> <span>and</span> <span>red.</span> <span>Suddenly,</span> <span>Peter</span> <span>sees</span> <span>something</span> <span>in</span> <span>the</span> <span>trees.</span> <span>It</span> <span>is</span> <span>big.</span> <span>It</span> <span>has</span> <span>gray</span> <span>fur</span> <span>and</span> <span>hungry</span> <span>eyes.</span> <span>It</span> <span>is</span> <span>a</span> <span>real</span> <span>wolf!</span> <span>The</span> <span>wolf</span> <span>starts</span> <span>to</span> <span>run</span> <span>toward</span> <span>the</span> <span>sheep.</span></p>
  <a>Naquela tarde, o sol está se pondo. O céu está laranja e vermelho. De repente, Peter vê algo nas árvores. É grande. Tem pelo cinza e olhos famintos. É um lobo de verdade! O lobo começa a correr em direção às ovelhas.</a>

  <p><span>Peter</span> <span>is</span> <span>very</span> <span>scared.</span> <span>He</span> <span>shouts</span> <span>with</span> <span>all</span> <span>his</span> <span>voice,</span> <span>"Wolf!</span> <span>Wolf!</span> <span>There</span> <span>is</span> <span>a</span> <span>real</span> <span>wolf!</span> <span>Please</span> <span>come!"</span> <span>The</span> <span>villagers</span> <span>hear</span> <span>him.</span> <span>"It</span> <span>is</span> <span>just</span> <span>Peter,"</span> <span>says</span> <span>one</span> <span>man.</span> <span>"He</span> <span>is</span> <span>playing</span> <span>another</span> <span>joke,"</span> <span>says</span> <span>a</span> <span>woman.</span> <span>"We</span> <span>will</span> <span>not</span> <span>go."</span></p>
  <a>Peter está com muito medo. Ele grita com toda a sua voz: "Lobo! Lobo! Há um lobo de verdade! Por favor, venham!" Os moradores o ouvem. "É apenas o Peter", diz um homem. "Ele está fazendo outra piada", diz uma mulher. "Nós não iremos."</a>

  <p><span>No one</span> <span>runs</span> <span>up</span> <span>the</span> <span>hill.</span> <span>Peter</span> <span>cries</span> <span>and</span> <span>cries.</span> <span>The</span> <span>wolf</span> <span>takes</span> <span>many</span> <span>sheep.</span> <span>When</span> <span>Peter</span> <span>comes</span> <span>home</span> <span>without</span> <span>the</span> <span>sheep,</span> <span>he</span> <span>is</span> <span>very</span> <span>sad.</span> <span>"Nobody</span> <span>believes</span> <span>a</span> <span>liar,"</span> <span>says</span> <span>his</span> <span>father,</span> <span>"even</span> <span>when</span> <span>he</span> <span>tells</span> <span>the</span> <span>truth."</span> <span>Peter</span> <span>learns</span> <span>his</span> <span>lesson.</span></p>
  <a>Ninguém corre colina acima. Peter chora e chora. O lobo leva muitas ovelhas. Quando Peter chega em casa sem as ovelhas, ele está muito triste. "Ninguém acredita em um mentiroso", diz seu pai, "mesmo quando ele diz a verdade." Peter aprende sua lição.</a>
  `
},

  "book_5": {
  title: "The Golden Goose",
  level: "A1",
  content: `
  <p><span>Once</span> <span>upon</span> <span>a</span> <span>time,</span> <span>there</span> <span>is</span> <span>a</span> <span>man</span> <span>named</span> <span>Dummling.</span> <span>He</span> <span>has</span> <span>two</span> <span>older</span> <span>brothers.</span> <span>Everyone</span> <span>thinks</span> <span>Dummling</span> <span>is</span> <span>not</span> <span>smart.</span> <span>But</span> <span>Dummling</span> <span>is</span> <span>very</span> <span>kind.</span> <span>One</span> <span>day,</span> <span>his</span> <span>brothers</span> <span>go</span> <span>to</span> <span>the</span> <span>forest</span> <span>to</span> <span>cut</span> <span>wood.</span> <span>They</span> <span>don't</span> <span>come</span> <span>back</span> <span>with</span> <span>anything.</span></p>
  <a>Era uma vez um homem chamado Dummling. Ele tem dois irmãos mais velhos. Todos acham que Dummling não é esperto. Mas Dummling é muito gentil. Um dia, seus irmãos vão à floresta cortar madeira. Eles não voltam com nada.</a>

  <p><span>Dummling</span> <span>says,</span> <span>"Father,</span> <span>I</span> <span>want</span> <span>to</span> <span>go</span> <span>to</span> <span>the</span> <span>forest</span> <span>too."</span> <span>His</span> <span>father</span> <span>says,</span> <span>"Okay,</span> <span>go."</span> <span>Dummling</span> <span>takes</span> <span>some</span> <span>old</span> <span>bread</span> <span>and</span> <span>water.</span> <span>In</span> <span>the</span> <span>forest,</span> <span>he</span> <span>meets</span> <span>a</span> <span>little</span> <span>old</span> <span>man.</span> <span>The</span> <span>man</span> <span>is</span> <span>very</span> <span>small</span> <span>and</span> <span>has</span> <span>a</span> <span>gray</span> <span>beard.</span> <span>"I</span> <span>am</span> <span>very</span> <span>hungry,"</span> <span>says</span> <span>the</span> <span>man.</span></p>
  <a>Dummling diz: "Pai, eu também quero ir à floresta." Seu pai diz: "Ok, vá." Dummling leva um pouco de pão velho e água. Na floresta, ele encontra um homenzinho velho. O homem é muito pequeno e tem uma barba cinza. "Estou com muita fome", diz o homem.</a>

  <p><span>Dummling</span> <span>smiles.</span> <span>"I</span> <span>only</span> <span>have</span> <span>old</span> <span>bread,</span> <span>but</span> <span>we</span> <span>can</span> <span>eat</span> <span>together."</span> <span>They</span> <span>sit</span> <span>on</span> <span>the</span> <span>ground.</span> <span>Suddenly,</span> <span>the</span> <span>old</span> <span>bread</span> <span>becomes</span> <span>delicious</span> <span>cake!</span> <span>The</span> <span>water</span> <span>becomes</span> <span>sweet</span> <span>juice!</span> <span>The</span> <span>little</span> <span>man</span> <span>is</span> <span>happy.</span> <span>"You</span> <span>are</span> <span>kind,"</span> <span>he</span> <span>says.</span> <span>"Look</span> <span>under</span> <span>that</span> <span>tree.</span> <span>There</span> <span>is</span> <span>a</span> <span>gift</span> <span>for</span> <span>you."</span></p>
  <a>Dummling sorri. "Eu só tenho pão velho, mas podemos comer juntos." Eles sentam no chão. De repente, o pão velho se torna um bolo delicioso! A água se torna suco doce! O homenzinho está feliz. "Você é gentil", ele diz. "Olhe debaixo daquela árvore. Há um presente para você."</a>

  <p><span>Dummling</span> <span>looks</span> <span>under</span> <span>the</span> <span>tree.</span> <span>He</span> <span>finds</span> <span>a</span> <span>Goose.</span> <span>But</span> <span>this</span> <span>is</span> <span>not</span> <span>a</span> <span>white</span> <span>goose.</span> <span>All</span> <span>its</span> <span>feathers</span> <span>are</span> <span>made of</span> <span>gold!</span> <span>It</span> <span>is</span> <span>very</span> <span>beautiful.</span> <span>Dummling</span> <span>takes</span> <span>the</span> <span>Golden</span> <span>Goose</span> <span>and</span> <span>walks</span> <span>to</span> <span>the</span> <span>city.</span> <span>He</span> <span>is</span> <span>very</span> <span>excited.</span></p>
  <a>Dummling olha debaixo da árvore. Ele encontra um Ganso. Mas este não é um ganso branco. Todas as suas penas são feitas de ouro! É muito bonito. Dummling pega o Ganso de Ouro e caminha para a cidade. Ele está muito animado.</a>

  <p><span>He</span> <span>stops</span> <span>at</span> <span>an</span> <span>inn.</span> <span>The</span> <span>innkeeper</span> <span>has</span> <span>three</span> <span>daughters.</span> <span>They</span> <span>see</span> <span>the</span> <span>Goose.</span> <span>"I</span> <span>want</span> <span>a</span> <span>golden</span> <span>feather!"</span> <span>says</span> <span>the</span> <span>first</span> <span>girl.</span> <span>She</span> <span>touches</span> <span>the</span> <span>Goose.</span> <span>Suddenly,</span> <span>she</span> <span>cannot</span> <span>move</span> <span>her</span> <span>hand.</span> <span>She</span> <span>is</span> <span>stuck!</span> <span>The</span> <span>second</span> <span>girl</span> <span>touches</span> <span>her</span> <span>sister.</span> <span>Now,</span> <span>she</span> <span>is</span> <span>stuck</span> <span>too!</span> <span>The</span> <span>third</span> <span>girl</span> <span>touches</span> <span>her</span> <span>sister.</span> <span>She</span> <span>is</span> <span>also</span> <span>stuck!</span></p>
  <a>Ele para em uma estalagem. O estalajadeiro tem três filhas. Elas veem o Ganso. "Eu quero uma pena de ouro!", diz a primeira garota. Ela toca o Ganso. De repente, ela não consegue mover a mão. Ela está presa! A segunda garota toca a irmã. Agora, ela está presa também! A terceira garota toca a irmã. Ela também está presa!</a>

  <p><span>Dummling</span> <span>wakes up</span> <span>and</span> <span>takes</span> <span>the</span> <span>Goose.</span> <span>He</span> <span>does not</span> <span>look</span> <span>back.</span> <span>The</span> <span>three</span> <span>girls</span> <span>must</span> <span>run</span> <span>behind</span> <span>him.</span> <span>Then,</span> <span>a</span> <span>priest</span> <span>sees</span> <span>them.</span> <span>"Stop!"</span> <span>he</span> <span>cries.</span> <span>He</span> <span>touches</span> <span>the</span> <span>girls.</span> <span>Now</span> <span>he</span> <span>is</span> <span>stuck!</span> <span>A</span> <span>farmer</span> <span>touches</span> <span>the</span> <span>priest.</span> <span>Now</span> <span>the</span> <span>farmer</span> <span>is</span> <span>stuck!</span> <span>There</span> <span>are</span> <span>five</span> <span>people</span> <span>stuck</span> <span>to</span> <span>the</span> <span>Goose.</span></p>
  <a>Dummling acorda e pega o Ganso. Ele não olha para trás. As três garotas devem correr atrás dele. Então, um padre os vê. "Parem!", ele grita. Ele toca as garotas. Agora ele está preso! Um fazendeiro toca o padre. Agora o fazendeiro está preso! Há cinco pessoas presas ao Ganso.</a>

  <p><span>They</span> <span>arrive</span> <span>at</span> <span>the</span> <span>King's</span> <span>castle.</span> <span>The</span> <span>King</span> <span>has</span> <span>a</span> <span>daughter.</span> <span>The</span> <span>Princess</span> <span>is</span> <span>very</span> <span>sad.</span> <span>She</span> <span>never</span> <span>laughs.</span> <span>The</span> <span>King</span> <span>says,</span> <span>"The</span> <span>man</span> <span>who</span> <span>makes</span> <span>the</span> <span>Princess</span> <span>laugh</span> <span>can</span> <span>marry</span> <span>her."</span> <span>Dummling</span> <span>walks</span> <span>past</span> <span>the</span> <span>Princess</span> <span>with</span> <span>the</span> <span>Goose</span> <span>and</span> <span>the</span> <span>five</span> <span>stuck</span> <span>people.</span></p>
  <a>Eles chegam ao castelo do Rei. O Rei tem uma filha. A Princesa está muito triste. Ela nunca ri. O Rei diz: "O homem que fizer a Princesa rir pode se casar com ela." Dummling passa pela Princesa com o Ganso e as cinco pessoas presas.</a>

  <p><span>The</span> <span>Princess</span> <span>looks</span> <span>out</span> <span>the</span> <span>window.</span> <span>She</span> <span>sees</span> <span>the</span> <span>silly</span> <span>line</span> <span>of</span> <span>people.</span> <span>She</span> <span>sees</span> <span>them</span> <span>jumping</span> <span>and</span> <span>shouting.</span> <span>It</span> <span>is</span> <span>so</span> <span>funny!</span> <span>Suddenly,</span> <span>the</span> <span>Princess</span> <span>starts</span> <span>to</span> <span>smile.</span> <span>Then,</span> <span>she</span> <span>starts</span> <span>to</span> <span>laugh.</span> <span>She</span> <span>laughs</span> <span>very</span> <span>loudly.</span> <span>Everyone</span> <span>is</span> <span>happy!</span></p>
  <a>A Princesa olha pela janela. Ela vê a fila boba de pessoas. Ela os vê pulando e gritando. É tão engraçado! De repente, a Princesa começa a sorrir. Então, ela começa a rir. Ela ri muito alto. Todos estão felizes!</a>

  <p><span>Dummling</span> <span>goes</span> <span>to</span> <span>the</span> <span>King.</span> <span>The</span> <span>people</span> <span>are</span> <span>finally</span> <span>free</span> <span>from</span> <span>the</span> <span>Goose.</span> <span>The</span> <span>King</span> <span>is</span> <span>very</span> <span>happy</span> <span>because</span> <span>the</span> <span>Princess</span> <span>is</span> <span>happy.</span> <span>Dummling</span> <span>marries</span> <span>the</span> <span>Princess.</span> <span>They</span> <span>have</span> <span>a</span> <span>big</span> <span>party.</span> <span>Dummling</span> <span>is</span> <span>now</span> <span>a</span> <span>Prince.</span> <span>He</span> <span>is</span> <span>not</span> <span>Dummling</span> <span>anymore;</span> <span>he</span> <span>is</span> <span>a</span> <span>smart</span> <span>and</span> <span>kind</span> <span>hero.</span></p>
  <a>Dummling vai até o Rei. As pessoas finalmente estão livres do Ganso. O Rei está muito feliz porque a Princesa está feliz. Dummling se casa com a Princesa. Eles fazem uma grande festa. Dummling agora é um Príncipe. Ele não é mais o Dummling; ele é um herói esperto e gentil.</a>
  `
},

    "a2_island": {
        title: "The Blue Island",
        level: "A2",
        content: `
            <p><span>Deep</span> <span>in the ocean</span>, <span>there is</span> <span>a</span> <span>place</span> <span>called</span> <span>the</span> <span>Blue Island</span>. <span>It</span> <span>is</span> <span>not</span> <span>on</span> <span>most</span> <span>maps</span> <span>because</span> <span>it is</span> <span>very</span> <span>small</span>. <span>The</span> <span>sand</span> <span>is</span> <span>white</span> <span>like</span> <span>sugar</span>, <span>and</span> <span>the</span> <span>water</span> <span>is</span> <span>very</span> <span>clear</span>. <span>Last summer</span>, <span>a</span> <span>group of students</span> <span>went there</span> <span>to</span> <span>study</span> <span>the</span> <span>fish</span>.</p>
            <p><span>They</span> <span>traveled</span> <span>by</span> <span>boat</span> <span>for</span> <span>two</span> <span>days</span>. <span>When</span> <span>they</span> <span>arrived</span>, <span>they</span> <span>were</span> <span>very</span> <span>tired</span> <span>but</span> <span>excited</span>. <span>They</span> <span>built</span> <span>tents</span> <span>on the beach</span>. <span>At night</span>, <span>they</span> <span>could see</span> <span>thousands of stars</span>. <span>There are</span> <span>no</span> <span>city lights</span> <span>on the island</span>, <span>so</span> <span>the</span> <span>sky</span> <span>is</span> <span>very</span> <span>dark</span> <span>and</span> <span>beautiful</span>.</p>
            <p><span>One</span> <span>student</span>, <span>named</span> <span>Julia</span>, <span>found</span> <span>a</span> <span>strange</span> <span>cave</span> <span>near</span> <span>the</span> <span>rocks</span>. <span>Inside</span> <span>the</span> <span>cave</span>, <span>the</span> <span>walls</span> <span>were</span> <span>glowing</span> <span>with</span> <span>a</span> <span>soft</span> <span>blue</span> <span>light</span>. <span>It was</span> <span>a</span> <span>special</span> <span>kind of plant</span> <span>that</span> <span>lives</span> <span>in the dark</span>. <span>The</span> <span>students</span> <span>took</span> <span>many</span> <span>photos</span> <span>and</span> <span>wrote</span> <span>in their journals</span> <span>about it</span>.</p>
            <p><span>On the third day</span>, <span>a</span> <span>big</span> <span>storm</span> <span>arrived</span>. <span>The</span> <span>wind</span> <span>was</span> <span>very</span> <span>strong</span> <span>and</span> <span>the</span> <span>waves</span> <span>were</span> <span>high</span>. <span>The</span> <span>students</span> <span>stayed</span> <span>inside</span> <span>the</span> <span>cave</span> <span>to be safe</span>. <span>They</span> <span>learned</span> <span>that</span> <span>nature</span> <span>is</span> <span>powerful</span>. <span>Julia</span> <span>promised</span> <span>to return</span> <span>one day</span>. <span>She</span> <span>wants</span> <span>to become</span> <span>a</span> <span>marine biologist</span> <span>soon</span>.</p>
        `
    },
    "a2_chef": {
        title: "The Italian Chef",
        level: "A2",
        content: `
            <p><span>Marco</span> <span>is</span> <span>a</span> <span>chef</span> <span>in</span> <span>a</span> <span>famous</span> <span>restaurant</span> <span>in</span> <span>Rome</span>. <span>He</span> <span>started</span> <span>cooking</span> <span>when</span> <span>he</span> <span>was</span> <span>only</span> <span>ten</span> <span>years old</span>. <span>His</span> <span>grandmother</span> <span>taught</span> <span>him</span> <span>how to make</span> <span>fresh</span> <span>pasta</span> <span>and</span> <span>secret</span> <span>sauces</span>. <span>Every</span> <span>morning</span>, <span>Marco</span> <span>goes to</span> <span>the</span> <span>local</span> <span>market</span> <span>to buy</span> <span>fresh</span> <span>tomatoes</span> <span>and</span> <span>basil</span>.</p>
            <p><span>He</span> <span>knows</span> <span>all</span> <span>the</span> <span>farmers</span> <span>and</span> <span>they</span> <span>always</span> <span>give</span> <span>him</span> <span>the</span> <span>best</span> <span>products</span>. <span>In</span> <span>his</span> <span>kitchen</span>, <span>Marco</span> <span>is</span> <span>very</span> <span>organized</span>. <span>He</span> <span>says</span> <span>that</span> <span>a</span> <span>good</span> <span>chef</span> <span>must be</span> <span>clean</span> <span>and</span> <span>fast</span>. <span>His</span> <span>favorite</span> <span>dish</span> <span>to cook</span> <span>is</span> <span>lasagna</span>. <span>It</span> <span>takes</span> <span>a</span> <span>long time</span>, <span>but</span> <span>customers</span> <span>love it</span>.</p>
            <p><span>One day</span>, <span>a</span> <span>famous</span> <span>actor</span> <span>came to</span> <span>the</span> <span>restaurant</span>. <span>Everyone</span> <span>was</span> <span>nervous</span>, <span>but</span> <span>Marco</span> <span>was</span> <span>calm</span>. <span>He</span> <span>cooked</span> <span>a</span> <span>special</span> <span>meal</span> <span>with</span> <span>mushrooms</span>. <span>The</span> <span>actor</span> <span>loved</span> <span>the</span> <span>food</span> <span>and</span> <span>went to</span> <span>the</span> <span>kitchen</span> <span>to say</span> <span>thank you</span>. <span>Marco</span> <span>was</span> <span>very</span> <span>proud</span> <span>of</span> <span>his</span> <span>work</span> <span>that</span> <span>night</span>.</p>
            <p><span>Marco</span> <span>believes</span> <span>that</span> <span>food</span> <span>is</span> <span>a</span> <span>way</span> <span>to make</span> <span>people</span> <span>happy</span>. "<span>When</span> <span>you</span> <span>cook</span> <span>with</span> <span>love</span>, <span>the</span> <span>food</span> <span>tastes</span> <span>better</span>," <span>he</span> <span>says</span>. <span>At the end of the day</span>, <span>Marco</span> <span>sits with</span> <span>his</span> <span>staff</span> <span>and</span> <span>they</span> <span>eat</span> <span>dinner</span> <span>together</span>. <span>They</span> <span>are</span> <span>like</span> <span>a</span> <span>big</span>, <span>happy</span> <span>Italian</span> <span>family</span>.</p>
        `
    },
    "a2_mountain": {
        title: "Cold Mountain",
        level: "A2",
        content: `
            <p><span>The</span> <span>Cold Mountain</span> <span>is</span> <span>the</span> <span>highest</span> <span>place</span> <span>in the country</span>. <span>People</span> <span>say</span> <span>that</span> <span>even</span> <span>in</span> <span>summer</span>, <span>there is</span> <span>snow</span> <span>on the top</span>. <span>Many</span> <span>people</span> <span>try to</span> <span>climb it</span>, <span>but</span> <span>it is</span> <span>very</span> <span>difficult</span>. <span>Last winter</span>, <span>a</span> <span>man</span> <span>named</span> <span>Robert</span> <span>decided</span> <span>to go to</span> <span>the</span> <span>peak</span> <span>alone</span>.</p>
            <p><span>He</span> <span>bought</span> <span>expensive</span> <span>boots</span>, <span>a</span> <span>warm</span> <span>jacket</span>, <span>and</span> <span>a</span> <span>special</span> <span>rope</span>. <span>He</span> <span>started</span> <span>his</span> <span>journey</span> <span>early</span> <span>on a Saturday morning</span>. <span>The</span> <span>forest</span> <span>at the bottom</span> <span>was</span> <span>quiet</span> <span>and</span> <span>beautiful</span>. <span>He</span> <span>saw</span> <span>some</span> <span>deer</span>. <span>As</span> <span>he</span> <span>climbed</span> <span>higher</span>, <span>the</span> <span>air</span> <span>became</span> <span>very</span> <span>thin</span> <span>and</span> <span>extremely</span> <span>cold</span>.</p>
            <p><span>Robert</span> <span>had to</span> <span>stop</span> <span>many</span> <span>times</span> <span>to rest</span> <span>and</span> <span>drink</span> <span>water</span>. <span>In the afternoon</span>, <span>the</span> <span>clouds</span> <span>covered</span> <span>the</span> <span>mountain</span>. <span>He</span> <span>couldn't</span> <span>see</span> <span>the</span> <span>path</span> <span>anymore</span>. <span>He</span> <span>felt</span> <span>a little</span> <span>afraid</span>, <span>but</span> <span>he</span> <span>used</span> <span>his</span> <span>compass</span>. <span>He</span> <span>found</span> <span>a</span> <span>small</span> <span>wooden</span> <span>cabin</span> <span>and</span> <span>stayed</span> <span>there</span> <span>for</span> <span>night</span>.</p>
            <p><span>The</span> <span>next</span> <span>morning</span>, <span>the</span> <span>sky</span> <span>was</span> <span>blue</span>. <span>He</span> <span>reached</span> <span>the</span> <span>top</span> <span>at ten o'clock</span>. <span>He</span> <span>took</span> <span>a</span> <span>flag</span> <span>and</span> <span>put</span> <span>it</span> <span>in the snow</span>. <span>He</span> <span>felt</span> <span>like</span> <span>a</span> <span>king</span>. <span>When</span> <span>he</span> <span>returned</span> <span>home</span>, <span>he</span> <span>showed</span> <span>the</span> <span>photos</span> <span>to his children</span>. <span>Now</span>, <span>they</span> <span>want</span> <span>to go</span> <span>too</span>!</p>
        `
    },
    "a2_library": {
        title: "The Old Library",
        level: "A2",
        content: `
            <p><span>In the center of the town</span>, <span>there is</span> <span>a</span> <span>building</span> <span>with</span> <span>big</span> <span>stone</span> <span>walls</span>. <span>It</span> <span>is</span> <span>the</span> <span>old</span> <span>library</span>. <span>It was</span> <span>built</span> <span>more than</span> <span>a hundred years ago</span>. <span>Inside</span>, <span>it is</span> <span>very</span> <span>quiet</span> <span>and</span> <span>it</span> <span>smells like</span> <span>old</span> <span>paper</span>. <span>There are</span> <span>thousands of</span> <span>books</span> <span>on</span> <span>shelves</span>.</p>
            <p><span>Mrs. Higgins</span> <span>is</span> <span>the</span> <span>librarian</span>. <span>She</span> <span>has</span> <span>worked</span> <span>there</span> <span>for</span> <span>forty</span> <span>years</span>. <span>She</span> <span>knows</span> <span>where</span> <span>every</span> <span>book</span> <span>is</span>. <span>Many</span> <span>students</span> <span>go there</span> <span>to study</span> <span>because</span> <span>they</span> <span>like</span> <span>the</span> <span>silence</span>. <span>There is</span> <span>a</span> <span>special</span> <span>room</span> <span>for children</span> <span>with</span> <span>colorful</span> <span>chairs</span> <span>and</span> <span>many</span> <span>beautiful</span> <span>posters</span> <span>on the walls</span>.</p>
            <p><span>Every</span> <span>Wednesday</span>, <span>Mrs. Higgins</span> <span>reads</span> <span>a</span> <span>story</span> <span>to the kids</span>. <span>Last week</span>, <span>the</span> <span>story</span> <span>was about</span> <span>a</span> <span>dragon</span> <span>that</span> <span>liked to</span> <span>eat</span> <span>vegetables</span>. <span>The</span> <span>children</span> <span>laughed</span> <span>a lot</span>. <span>The</span> <span>library</span> <span>also</span> <span>has</span> <span>old</span> <span>newspapers</span>. <span>You</span> <span>can</span> <span>read about</span> <span>what</span> <span>happened</span> <span>in the town</span> <span>in</span> <span>1920</span>.</p>
            <p><span>Recently</span>, <span>the</span> <span>mayor</span> <span>wanted to</span> <span>close</span> <span>it</span> <span>to build</span> <span>a</span> <span>parking lot</span>. <span>The</span> <span>people</span> <span>were</span> <span>very</span> <span>angry</span>. <span>They</span> <span>signed</span> <span>a</span> <span>petition</span> <span>to save</span> <span>the</span> <span>building</span>. <span>Fortunately</span>, <span>the</span> <span>mayor</span> <span>changed</span> <span>his</span> <span>mind</span>. <span>Now</span>, <span>the</span> <span>library</span> <span>is</span> <span>being</span> <span>painted</span>. <span>It</span> <span>is</span> <span>a</span> <span>treasure</span> <span>in our</span> <span>small</span> <span>community</span>.</p>
        `
    },
    "a2_train": {
        title: "The Midnight Train",
        level: "A2",
        content: `
            <p><span>Traveling</span> <span>by</span> <span>train</span> <span>is</span> <span>my</span> <span>favorite</span> <span>way</span> <span>to see</span> <span>the</span> <span>world</span>. <span>Last</span> <span>month</span>, <span>I</span> <span>took</span> <span>the</span> <span>Midnight Train</span> <span>from</span> <span>London</span> <span>to</span> <span>Edinburgh</span>. <span>It</span> <span>is</span> <span>a</span> <span>long</span> <span>journey</span>, <span>but</span> <span>it is</span> <span>comfortable</span>. <span>I</span> <span>had</span> <span>a</span> <span>small</span> <span>cabin</span> <span>with</span> <span>a</span> <span>bed</span>. <span>I</span> <span>boarded</span> <span>the</span> <span>train</span> <span>at night</span>.</p>
            <p><span>The</span> <span>station</span> <span>was</span> <span>cold</span> <span>and</span> <span>foggy</span>. <span>When</span> <span>the</span> <span>train</span> <span>started to</span> <span>move</span>, <span>I</span> <span>felt</span> <span>a</span> <span>gentle</span> <span>vibration</span>. <span>I</span> <span>looked out the window</span> <span>and</span> <span>saw</span> <span>the</span> <span>city lights</span> <span>disappearing</span>. <span>After</span> <span>an hour</span>, <span>the</span> <span>train</span> <span>was</span> <span>in the countryside</span>. <span>Everything</span> <span>was</span> <span>dark</span>, <span>but</span> <span>I</span> <span>saw</span> <span>farm</span> <span>lights</span>.</p>
            <p><span>I</span> <span>went to the</span> <span>dining car</span> <span>to have</span> <span>tea</span>. <span>I</span> <span>met</span> <span>an</span> <span>interesting</span> <span>woman</span> <span>named</span> <span>Elena</span>. <span>She</span> <span>was</span> <span>a</span> <span>photographer</span> <span>traveling</span> <span>to</span> <span>Scotland</span> <span>to take pictures</span> <span>of the</span> <span>mountains</span>. <span>We</span> <span>talked about</span> <span>our</span> <span>favorite</span> <span>places</span> <span>for a long time</span>. <span>She</span> <span>showed me</span> <span>her</span> <span>amazing</span> <span>camera</span> <span>photos</span>.</p>
            <p><span>I</span> <span>woke up</span> <span>at</span> <span>six o'clock</span> <span>because</span> <span>the</span> <span>sun</span> <span>was</span> <span>rising</span>. <span>The</span> <span>landscape</span> <span>was</span> <span>different</span>. <span>There were</span> <span>green</span> <span>hills</span> <span>and</span> <span>many</span> <span>sheep</span>. <span>The</span> <span>train</span> <span>arrived</span> <span>on time</span>. <span>I</span> <span>said goodbye</span> <span>to</span> <span>Elena</span>. <span>A</span> <span>train journey</span> <span>gives</span> <span>you</span> <span>time to think</span>. <span>I</span> <span>want to</span> <span>travel</span> <span>more</span>!</p>
        `
    },

    // ================= LEVEL B1 (Intermediate) =================
    "b1_future": {
        title: "Future Cities",
        level: "B1",
        content: `
            <p><span>Imagine</span> <span>a</span> <span>city</span> <span>where</span> <span>there are</span> <span>no</span> <span>cars</span> <span>on the streets</span> <span>and</span> <span>the</span> <span>buildings</span> <span>are</span> <span>covered in</span> <span>trees</span>. <span>This</span> <span>is</span> <span>not</span> <span>a</span> <span>dream</span>; <span>it is</span> <span>the</span> <span>plan</span> <span>for</span> <span>future</span> <span>cities</span> <span>in</span> <span>many</span> <span>parts</span> <span>of the world</span>. <span>Scientists</span> <span>are</span> <span>working together</span> <span>to</span> <span>solve</span> <span>the</span> <span>problems</span> <span>of</span> <span>pollution</span>.</p>
            <p><span>In these cities</span>, <span>people</span> <span>will use</span> <span>underground</span> <span>high-speed trains</span> <span>to</span> <span>get around</span>, <span>or</span> <span>they will</span> <span>simply</span> <span>walk</span>. <span>The</span> <span>air</span> <span>will be</span> <span>clean</span> <span>because</span> <span>there will be</span> <span>no</span> <span>gasoline engines</span>. <span>Energy</span> <span>will come from</span> <span>the</span> <span>sun</span>. <span>Every</span> <span>building</span> <span>will have</span> <span>solar panels</span> <span>on the roof</span>.</p>
            <p><span>One of the</span> <span>most</span> <span>interesting</span> <span>ideas</span> <span>is</span> <span>the</span> "<span>vertical farm</span>." <span>Instead of</span> <span>growing</span> <span>food</span> <span>in the countryside</span>, <span>we will</span> <span>grow</span> <span>vegetables</span> <span>inside</span> <span>tall</span> <span>buildings</span>. <span>This means</span> <span>the</span> <span>food</span> <span>will be</span> <span>fresher</span> <span>and</span> <span>we won't need</span> <span>big</span> <span>trucks</span>. <span>Water</span> <span>will be</span> <span>recycled</span> <span>perfectly</span> <span>to</span> <span>save</span> <span>resources</span>.</p>
            <p><span>However</span>, <span>there are</span> <span>challenges</span>. <span>Building</span> <span>these</span> <span>cities</span> <span>is</span> <span>expensive</span>, <span>and</span> <span>we need</span> <span>new</span> <span>technology</span>. <span>Some</span> <span>people</span> <span>are afraid</span> <span>that</span> <span>life</span> <span>will be</span> <span>too</span> <span>controlled</span> <span>by</span> <span>computers</span>. <span>Despite</span> <span>these</span> <span>concerns</span>, <span>future</span> <span>cities</span> <span>offer</span> <span>a way</span> <span>to live</span> <span>in harmony with</span> <span>nature</span> <span>while</span> <span>enjoying</span> <span>modern</span> <span>technology</span>.</p>
        `
    },
    "b1_mystery": {
        title: "The Missing Key",
        level: "B1",
        content: `
            <p><span>Detective Miller</span> <span>was</span> <span>sitting</span> <span>in his office</span> <span>when</span> <span>a</span> <span>worried</span> <span>woman</span> <span>entered</span>. <span>Her name</span> <span>was</span> <span>Clara</span>, <span>and</span> <span>she</span> <span>claimed</span> <span>that</span> <span>a</span> <span>very</span> <span>important</span> <span>key</span> <span>had been</span> <span>stolen</span>. <span>It</span> <span>opened</span> <span>a</span> <span>safe</span> <span>containing</span> <span>her</span> <span>grandfather's</span> <span>secret</span> <span>diary</span>. <span>Clara</span> <span>believed</span> <span>the</span> <span>diary</span> <span>held</span> <span>the</span> <span>location</span> <span>of</span> <span>treasure</span>.</p>
            <p><span>Miller</span> <span>visited</span> <span>Clara's</span> <span>mansion</span> <span>to</span> <span>investigate</span>. <span>The house</span> <span>was</span> <span>enormous</span> <span>and</span> <span>filled with</span> <span>old</span> <span>paintings</span>. <span>He</span> <span>interviewed</span> <span>the</span> <span>three</span> <span>people</span> <span>in the house</span>: <span>the</span> <span>cook</span>, <span>the</span> <span>gardener</span>, <span>and</span> <span>Clara's</span> <span>brother</span>, <span>James</span>. <span>The gardener</span> <span>claimed</span> <span>he</span> <span>was</span> <span>cutting</span> <span>the</span> <span>grass</span> <span>all morning</span>, <span>which</span> <span>seemed</span> <span>normal</span>.</p>
            <p><span>However</span>, <span>Miller</span> <span>noticed</span> <span>that</span> <span>the</span> <span>gardener's</span> <span>shoes</span> <span>were</span> <span>perfectly</span> <span>clean</span>, <span>even though</span> <span>it had</span> <span>rained</span>. <span>This</span> <span>was</span> <span>a</span> <span>suspicious</span> <span>detail</span>. <span>Then</span>, <span>he</span> <span>spoke to</span> <span>James</span>, <span>who</span> <span>seemed</span> <span>very</span> <span>nervous</span>. <span>Miller</span> <span>searched</span> <span>the</span> <span>library</span> <span>and</span> <span>found</span> <span>a</span> <span>small</span> <span>scratch</span> <span>on the floor</span> <span>near</span> <span>the</span> <span>large</span> <span>bookshelf</span>.</p>
            <p><span>He</span> <span>found</span> <span>a</span> <span>hidden</span> <span>compartment</span>, <span>but</span> <span>it was</span> <span>empty</span>. <span>He</span> <span>called</span> <span>everyone</span> <span>to the</span> <span>living room</span> <span>and</span> <span>looked at</span> <span>James</span>. <span>James</span> <span>started to</span> <span>cry</span> <span>and</span> <span>pulled out</span> <span>the</span> <span>golden</span> <span>key</span>. <span>He</span> <span>wanted</span> <span>the</span> <span>treasure</span> <span>to</span> <span>pay</span> <span>his debts</span>. <span>In the end</span>, <span>the</span> <span>diary</span> <span>had</span> <span>no</span> <span>gold</span>.</p>
        `
    },
    "b1_job": {
        title: "The New Job",
        level: "B1",
        content: `
            <p><span>Starting</span> <span>a</span> <span>new</span> <span>job</span> <span>can be</span> <span>both</span> <span>exciting</span> <span>and</span> <span>terrifying</span>. <span>Last Monday</span>, <span>Sarah</span> <span>began</span> <span>her</span> <span>career</span> <span>as a</span> <span>marketing executive</span> <span>at a</span> <span>large company</span>. <span>She</span> <span>had spent</span> <span>weeks</span> <span>preparing for</span> <span>the interview</span>, <span>and</span> <span>she was</span> <span>thrilled</span> <span>when</span> <span>they</span> <span>finally</span> <span>offered</span> <span>her</span> <span>the position</span> <span>in London</span>.</p>
            <p><span>On her first day</span>, <span>she</span> <span>arrived</span> <span>twenty minutes</span> <span>early</span>. <span>The office</span> <span>was</span> <span>located in</span> <span>a</span> <span>modern</span> <span>skyscraper</span> <span>with a</span> <span>glass elevator</span>. <span>Her</span> <span>manager</span>, <span>Mr. Thompson</span>, <span>introduced</span> <span>her</span> <span>to the team</span>. <span>Everyone</span> <span>seemed</span> <span>friendly</span>, <span>but</span> <span>they</span> <span>were</span> <span>all</span> <span>very</span> <span>busy</span> <span>talking on phones</span> <span>and</span> <span>typing</span> <span>laptops</span>.</p>
            <p><span>Sarah</span> <span>felt</span> <span>a bit</span> <span>overwhelmed</span> <span>by the</span> <span>fast pace</span>. <span>She was</span> <span>given</span> <span>a</span> <span>desk</span> <span>near the window</span> <span>with a view</span>. <span>During</span> <span>the first week</span>, <span>she</span> <span>had to</span> <span>attend</span> <span>many</span> <span>meetings</span> <span>and</span> <span>learn</span> <span>the</span> <span>software</span>. <span>She</span> <span>realized</span> <span>that</span> <span>the</span> <span>job</span> <span>was</span> <span>demanding</span> <span>and</span> <span>required</span> <span>great</span> <span>focus</span>.</p>
            <p><span>By Friday</span>, <span>Sarah</span> <span>felt</span> <span>more</span> <span>confident</span>. <span>She had</span> <span>successfully</span> <span>completed</span> <span>her first report</span> <span>and</span> <span>received</span> <span>positive feedback</span>. <span>She</span> <span>understood</span> <span>that</span> <span>she</span> <span>still had</span> <span>a lot to learn</span>, <span>but</span> <span>she was</span> <span>eager</span>. <span>The transition</span> <span>was</span> <span>difficult</span>, <span>but</span> <span>she knew</span> <span>this was</span> <span>a</span> <span>great</span> <span>professional</span> <span>opportunity</span>.</p>
        `
    },
    "b1_climate": {
        title: "Green Planet",
        level: "B1",
        content: `
            <p><span>Climate change</span> <span>is</span> <span>one of the</span> <span>most</span> <span>pressing</span> <span>issues</span> <span>facing</span> <span>our world</span> <span>today</span>. <span>For</span> <span>decades</span>, <span>human activities</span> <span>like</span> <span>burning</span> <span>fossil fuels</span> <span>have</span> <span>increased</span> <span>greenhouse gases</span>. <span>This</span> <span>has led to</span> <span>a rise</span> <span>in</span> <span>global</span> <span>temperatures</span>, <span>causing</span> <span>glaciers</span> <span>to melt</span> <span>and</span> <span>sea levels</span> <span>to rise</span> <span>dangerously</span>.</p>
            <p><span>Many</span> <span>coastal</span> <span>cities</span> <span>are</span> <span>now</span> <span>at risk of</span> <span>flooding</span>. <span>Furthermore</span>, <span>extreme</span> <span>weather events</span> <span>like</span> <span>hurricanes</span> <span>and</span> <span>droughts</span> <span>are</span> <span>becoming</span> <span>more</span> <span>frequent</span>. <span>However</span>, <span>there is</span> <span>still</span> <span>hope</span> <span>if we</span> <span>act now</span>. <span>Governments</span> <span>are starting to</span> <span>invest in</span> <span>renewable energy</span> <span>sources</span> <span>like</span> <span>solar</span> <span>and</span> <span>wind power</span>.</p>
            <p><span>Individuals</span> <span>can also</span> <span>make a difference</span> <span>by</span> <span>changing</span> <span>their</span> <span>daily habits</span>. <span>For example</span>, <span>reducing</span> <span>meat consumption</span> <span>and</span> <span>using</span> <span>public transportation</span> <span>are</span> <span>effective ways</span> <span>to lower</span> <span>our</span> <span>carbon footprint</span>. <span>Education</span> <span>is also</span> <span>crucial</span>; <span>the more</span> <span>people</span> <span>understand</span> <span>the science</span>, <span>the more</span> <span>they</span> <span>support</span> <span>green policies</span>.</p>
            <p><span>Protecting</span> <span>our</span> <span>forests</span> <span>is</span> <span>another</span> <span>vital step</span>, <span>as</span> <span>trees</span> <span>absorb</span> <span>carbon</span>. <span>The transition</span> <span>to a</span> <span>green economy</span> <span>will not be</span> <span>easy</span>, <span>and it</span> <span>requires</span> <span>international cooperation</span>. <span>We must</span> <span>move away from</span> <span>the</span> "<span>throwaway</span>" <span>culture</span>. <span>It is</span> <span>a</span> <span>collective</span> <span>responsibility</span> <span>to save</span> <span>our home</span>, <span>Earth</span>.</p>
        `
    },
    "b1_festival": {
        title: "Music Festival",
        level: "B1",
        content: `
            <p><span>Every summer</span>, <span>thousands of</span> <span>music lovers</span> <span>gather</span> <span>in the countryside</span> <span>for the</span> <span>annual</span> <span>Harmony Music Festival</span>. <span>It is</span> <span>a</span> <span>three-day</span> <span>event</span> <span>featuring</span> <span>artists</span> <span>from</span> <span>all over the world</span>. <span>This year</span>, <span>I</span> <span>decided to</span> <span>go with</span> <span>a group of friends</span>. <span>We</span> <span>packed</span> <span>our</span> <span>tents</span> <span>and</span> <span>bags</span>.</p>
            <p><span>When we arrived</span>, <span>the</span> <span>atmosphere</span> <span>was</span> <span>electric</span>. <span>There were</span> <span>colorful</span> <span>flags</span> <span>everywhere</span>, <span>and the</span> <span>sound</span> <span>of drums</span> <span>echoed</span> <span>through the trees</span>. <span>We spent</span> <span>the first afternoon</span> <span>setting up</span> <span>our camp</span> <span>and</span> <span>exploring</span> <span>the stages</span>. <span>One of the</span> <span>best things</span> <span>is</span> <span>discovering</span> <span>new</span> <span>indie bands</span>.</p>
            <p><span>The food</span> <span>was also</span> <span>a highlight</span>; <span>there were</span> <span>stalls</span> <span>selling</span> <span>delicious</span> <span>street food</span> <span>from</span> <span>every continent</span>. <span>We tried</span> <span>spicy</span> <span>tacos</span> <span>and</span> <span>vegan burgers</span>. <span>At night</span>, <span>the</span> <span>main stage</span> <span>was lit up</span> <span>with</span> <span>spectacular</span> <span>lasers</span>. <span>The</span> <span>headline act</span> <span>was a</span> <span>famous singer</span>, <span>and we</span> <span>sang along</span>.</p>
            <p><span>Despite</span> <span>the mud</span> <span>and the</span> <span>lack of</span> <span>hot showers</span>, <span>the experience</span> <span>was</span> <span>unforgettable</span>. <span>There is</span> <span>a</span> <span>unique</span> <span>sense of community</span> <span>at a festival</span>; <span>everyone</span> <span>is there</span> <span>to enjoy</span> <span>the music</span>. <span>We</span> <span>promised to</span> <span>come back</span> <span>next year</span>. <span>It's</span> <span>about the</span> <span>memories</span> <span>you create</span> <span>together</span>.</p>
        `
    },
    "c1_politics": {
        title: "Diplomacy",
        level: "C1",
        content: `
            <p><span>In an era</span> <span>defined by</span> <span>geopolitical volatility</span>, <span>the practice of</span> <span>diplomacy</span> <span>has become</span> <span>more convoluted</span> <span>than ever before</span>. <span>Traditional statecraft</span> <span>is being</span> <span>increasingly supplanted by</span> "<span>soft power</span>" <span>initiatives</span> <span>and the influence of</span> <span>non-state actors</span>, <span>including</span> <span>NGOs</span> <span>and</span> <span>multinational corporations</span>. <span>The resurgence of</span> <span>great power competition</span> <span>has necessitated</span> <span>balancing</span>.</p>
            <p><span>Furthermore</span>, <span>the rise of</span> <span>digital diplomacy</span>—<span>the use of</span> <span>social media</span> <span>to influence</span> <span>public opinion</span>—<span>has introduced</span> <span>new vulnerabilities</span>, <span>including</span> <span>state-sponsored cyberattacks</span>. <span>These tools</span> <span>can bypass</span> <span>traditional channels</span>, <span>often with</span> <span>destabilizing effects</span>. <span>Another challenge is</span> <span>the crisis of</span> <span>multilateralism</span>; <span>international organizations</span> <span>struggle to</span> <span>address</span> <span>global issues</span> <span>like</span> <span>climate change</span>.</p>
            <p><span>Effective diplomacy</span> <span>in the 21st century</span> <span>requires a shift</span> <span>to a</span> <span>more holistic approach</span> <span>that considers</span> <span>cultural nuances</span> <span>and</span> <span>economic interdependencies</span>. <span>The</span> "<span>climate diplomacy</span>" <span>seen in</span> <span>summits</span> <span>highlights the difficulty of</span> <span>reconciling</span> <span>national interests</span> <span>with</span> <span>urgent global action</span>. <span>Sovereignty</span> <span>is being redefined</span> <span>in an</span> <span>interconnected world</span>.</p>
            <p><span>Successful</span> <span>diplomats</span> <span>must now be</span> <span>as proficient in</span> <span>data analysis</span> <span>as they are in</span> <span>the nuances of</span> <span>international law</span>. <span>Despite</span> <span>technological shifts</span>, <span>the fundamental</span> <span>essence remains</span>: <span>the art of</span> <span>preventing conflict</span> <span>through communication</span>. <span>In a world with</span> <span>sophisticated weaponry</span>, <span>the alternative to</span> <span>effective diplomacy</span> <span>is too</span> <span>catastrophic</span>.</p>
        `
    },
    "c1_art": {
        title: "Modern Art",
        level: "C1",
        content: `
            <p><span>Modern art</span> <span>emerged as</span> <span>a radical departure from</span> <span>the representational constraints</span> <span>of the 19th century</span>, <span>provoking debate</span> <span>regarding</span> <span>aesthetic expression</span>. <span>By prioritizing</span> <span>subjective experience</span>, <span>modern artists</span> <span>sought to</span> <span>capture</span> <span>psychological fragmentation</span>. <span>Movements like</span> <span>Cubism</span> <span>and</span> <span>Surrealism</span> <span>dismantled</span> <span>traditional notions of</span> <span>perspective</span>, <span>forcing viewers to</span> <span>engage conceptually</span>.</p>
            <p><span>This shift toward</span> <span>abstraction</span> <span>was a</span> <span>profound philosophical inquiry</span> <span>into the</span> <span>subconscious mind</span>. <span>In the contemporary era</span>, <span>the boundaries of</span> <span>art</span> <span>have expanded with</span> <span>digital media</span> <span>and</span> <span>installation art</span>. <span>This has led to</span> <span>the</span> "<span>democratization</span>" <span>of art</span>, <span>where the</span> <span>distinction between</span> <span>high and low culture</span> <span>is increasingly blurred</span>.</p>
            <p><span>However</span>, <span>commercialization</span> <span>has raised concerns about</span> <span>the integrity of</span> <span>creative expression</span>. <span>Astronomical prices</span> <span>at auctions</span> <span>for works</span> <span>lacking</span> <span>traditional skill</span> <span>have led to</span> <span>accusations of</span> <span>financial speculation</span>. <span>Furthermore</span>, <span>the role of the museum</span> <span>is being reconsidered</span> <span>as institutions</span> <span>struggle to</span> <span>address</span> <span>colonial legacies</span> <span>and</span> <span>diversity in collections</span>.</p>
            <p><span>Despite controversies</span>, <span>art remains</span> <span>a vital mirror of</span> <span>society</span>, <span>reflecting</span> <span>our collective anxieties</span> <span>and aspirations</span>. <span>Whether it serves as</span> <span>a tool for</span> <span>political activism</span> <span>or a</span> <span>sanctuary for</span> <span>contemplation</span>, <span>modern art</span> <span>challenges us to</span> <span>see the world differently</span>, <span>reminding us that</span> <span>beauty is found in</span> <span>unconventional places</span>.</p>
        `
    },
    };

    function getVoicesAsync() {
    return new Promise((resolve) => {
        let voices = speechSynthesis.getVoices();
        if (voices.length) return resolve(voices);

        speechSynthesis.onvoiceschanged = () => {
            resolve(speechSynthesis.getVoices());
        };
    });
}

// --- VARIÁVEIS GLOBAIS DE ÁUDIO ---
let sintetizador = window.speechSynthesis;
let locucao = null;

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.btn-tab');
    const storyContainer = document.querySelector('.story-content');
    const storyTitle = document.querySelector('.story-title');
    let activeTooltip = null;

    // --- 2. CARREGAMENTO DINÂMICO DO LIVRO ---
    const loadBookContent = () => {
        const params = new URLSearchParams(window.location.search);
        const bookId = params.get('id');

        if (window.location.pathname.includes('book.html')) {
            if (bookId && bookData[bookId]) {
                if (storyTitle) storyTitle.innerText = bookData[bookId].title;
                if (storyContainer) storyContainer.innerHTML = bookData[bookId].content;
                document.title = `${bookData[bookId].title} - Lersotoria`;
                
                sintetizador.cancel();
            } else {
                if (storyTitle) storyTitle.innerText = "Livro não encontrado 404";
            }
        }
    };

    loadBookContent();

window.toggleOuvir = async () => {
    if (sintetizador.speaking) {
        sintetizador.cancel();
        atualizarBotaoAudio(false);
        return;
    }

    if (!storyContainer) return;

    const spans = storyContainer.querySelectorAll('span:not([aria-hidden="true"]):not(.no-tts)');
    const texto = Array.from(spans).map(s => s.innerText).join(' ');

    const utterance = new SpeechSynthesisUtterance(texto);

    // 🌍 idioma inglês
    utterance.lang = 'en-us';

    // 🎧 deixa mais natural
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 5;

   const voices = await getVoicesAsync();
    // 🎯 tenta pegar a melhor voz disponível
    const bestVoice =
    voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('google')) ||
    voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('female')) ||
    voices.find(v => v.lang === 'en-GB') ||
    voices.find(v => v.lang.includes('en')) ||
    null;

    if (bestVoice) {
        utterance.voice = bestVoice;
    }

    utterance.onstart = () => atualizarBotaoAudio(true);
    utterance.onend = () => atualizarBotaoAudio(false);
    utterance.onerror = () => atualizarBotaoAudio(false);

    sintetizador.speak(utterance);
};

// Função corrigida para atualizar botão
const atualizarBotaoAudio = (tocando) => {
    const btn = document.getElementById('btn-read-aloud');
    if (btn) {
        btn.innerHTML = tocando 
            ? '<span>✦</span> Parar Leitura ⏹' 
            : '<span>✦</span> Ouvir Capítulo 🔊';
        btn.classList.toggle('playing', tocando);
    }
};

    // --- 4. ESTADO DO USUÁRIO (FIREBASE) ---
    let currentUser = null;
    let userData = { history: [], favorites: [], quizzes: {} };

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                userData = userDoc.data();
                const nameDisplay = document.querySelector('.user-name');
                if (nameDisplay && userData.name) {
                    nameDisplay.innerText = userData.name;
                }
            }
            renderLibrary();
        } else {
            const path = window.location.pathname;
            if (path.includes('library.html') || path.includes('book.html')) {
                window.location.href = 'login.html';
            }
        }
    });

    const renderLibrary = () => {
        updateFavVisuals();
        checkLevelUnlocks();
    };

const checkLevelUnlocks = () => {
    if (!userData || !userData.quizzes) return;

    const levelsOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']; 

    levelsOrder.forEach((level, index) => {
        const currentSection = document.querySelector(`[data-level="${level}"]`);
        if (!currentSection) return;

        const quizBtn = currentSection.querySelector('.btn-quiz');
        const nextLevelId = levelsOrder[index + 1];
        const nextSection = document.querySelector(`[data-level="${nextLevelId}"]`);

        // 🔓 Desbloquear próximo nível
        if (nextSection && userData.quizzes[level] === true) {
            nextSection.classList.remove('locked');
            nextSection.style.opacity = "1";
            nextSection.style.pointerEvents = "auto";
            nextSection.style.filter = "grayscale(0)";

            const tag = nextSection.querySelector('.level-tag');
            if (tag) {
                tag.innerText = tag.innerText.replace('🔒', '🔓');
            }
        }

        // 👁️ Mostrar botão do quiz apenas se desbloqueado
        if (quizBtn) {
            quizBtn.style.display = currentSection.classList.contains('locked') 
                ? 'none' 
                : 'inline-block';
        }

        // ✅ Marcar nível como completo
        if (userData.quizzes[level] === true) {
            const tag = currentSection.querySelector('.level-tag');
            if (tag) {
                tag.innerText = tag.innerText.replace(/[🔒🔓]/g, '✅');
            }
        }
    });
};

const updateFavVisuals = () => {
    if (!userData) return;

    document.querySelectorAll('.book-item').forEach(item => {
        const id = item.getAttribute('data-id');
        const badge = item.querySelector('.fav-badge');

        if (!badge) return;

        const isFav = (userData.favorites || []).includes(id);

        badge.classList.toggle('active', isFav);
        badge.innerText = isFav ? '❤️' : '✦';
    });
};

    // --- 6. EVENTOS DE CLIQUE ---
    document.addEventListener('click', async (e) => {
        if (e.target.closest('#btn-read-aloud')) {
            window.toggleOuvir();
        }

        if (e.target.closest('.book-card-link')) {
            const item = e.target.closest('.book-item');
            const id = item.getAttribute('data-id');

            if (currentUser && !userData.history.includes(id)) {
                userData.history.push(id);
                await updateDoc(doc(db, "users", currentUser.uid), {
                    history: arrayUnion(id)
                });
                checkLevelUnlocks();
            }
        }

        if (e.target.classList.contains('fav-badge')) {
            e.preventDefault();
            const item = e.target.closest('.book-item');
            const id = item.getAttribute('data-id');

            if (currentUser) {
                let newFavs = userData.favorites.includes(id) 
                    ? userData.favorites.filter(favId => favId !== id)
                    : [...userData.favorites, id];

                userData.favorites = newFavs;
                await updateDoc(doc(db, "users", currentUser.uid), { favorites: newFavs });
                updateFavVisuals();
            }
        }
    });

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterId = btn.id;
            document.querySelectorAll('.book-item').forEach(item => {
                const id = item.getAttribute('data-id');
                let show = filterId === 'btn-all' || (filterId === 'btn-fav' && userData.favorites.includes(id));
                item.style.display = show ? 'block' : 'none';
            });
        });
    });

// Variável global para controlar o tooltip ativo

// --- 7. TRADUTOR (VERSÃO CORRIGIDA) ---
// Usamos document.addEventListener para capturar cliques em SPANs mesmo que eles sejam injetados depois
document.addEventListener('click', async (e) => {
    const el = e.target;

    // Verifica se o clique foi em um SPAN dentro do conteúdo da história
    if (el.tagName === 'SPAN' && el.closest('#story-content')) {
        
        // 1. Limpa a palavra (remove pontuação e números)
        const word = el.innerText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()0-9]/g, "").trim();
        if (!word) return;

        // 2. Remove tooltip anterior se existir
        if (activeTooltip) activeTooltip.remove();

        // 3. Cria o Tooltip com o estilo de livro
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerText = "🔍 Traduzindo...";
        document.body.appendChild(tooltip);
        activeTooltip = tooltip;

        // 4. Posicionamento Dinâmico
        const rect = el.getBoundingClientRect();
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;

        // Ajuste centralizado acima da palavra
        tooltip.style.position = 'absolute';
        tooltip.style.zIndex = '9999';
        tooltip.style.left = `${rect.left + scrollX + (rect.width / 2)}px`;
        tooltip.style.top = `${rect.top + scrollY - 10}px`;
        tooltip.style.transform = 'translate(-50%, -100%)';

        try {
            // 5. Requisição para API MyMemory
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|pt-BR`);
            const data = await response.json();

            let translations = [];

            // Pega a tradução principal
            if (data.responseData && data.responseData.translatedText) {
                const mainTrans = data.responseData.translatedText.toLowerCase().trim();
                translations.push(mainTrans);
            }

            // Pega matches alternativos (limita a 2 para não ficar gigante)
            if (data.matches) {
                data.matches.forEach(m => {
                    const t = m.translation.toLowerCase().trim();
                    if (t && !translations.includes(t) && t.length < 20 && translations.length < 2) {
                        translations.push(t);
                    }
                });
            }

            // 6. Exibe o resultado
            tooltip.innerText = translations.length ? translations.join(' / ') : "Sem tradução";
            
        } catch (err) {
            console.error('Erro na tradução:', err);
            tooltip.innerText = "Erro ❌";
        }
    } else {
        // Se clicar em qualquer outro lugar que não seja um SPAN, fecha o tooltip
        if (activeTooltip && !el.classList.contains('tooltip')) {
            activeTooltip.remove();
            activeTooltip = null;
        }
    }
});
    // Remove tooltip ao clicar fora
    document.addEventListener('mousedown', (e) => {
        if (activeTooltip && !e.target.closest('.tooltip') && e.target.tagName !== 'SPAN') {
            activeTooltip.remove();
            activeTooltip = null;
} }); } );