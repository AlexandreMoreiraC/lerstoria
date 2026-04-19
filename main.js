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
  title: "The Lion and the Mouse ",
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

    "book_6": {
        "title": "The Secret of the Whispering Forest",
        "level": "A2",
        "content": `
            <p><span>Leo</span> <span>is</span> <span>a</span> <span>young</span> <span>photographer</span> <span>who</span> <span>lives</span> <span>in</span> <span>a</span> <span>busy</span> <span>city</span>. <span>He</span> <span>loves</span> <span>his</span> <span>job</span>, <span>but</span> <span>sometimes</span> <span>the</span> <span>city</span> <span>is</span> <span>too</span> <span>loud</span>. <span>Last</span> <span>month</span>, <span>he</span> <span>decided</span> <span>to</span> <span>take</span> <span>a</span> <span>vacation</span>. <span>He</span> <span>wanted</span> <span>to</span> <span>visit</span> <span>a</span> <span>place</span> <span>where</span> <span>nature</span> <span>was</span> <span>wild</span> <span>and</span> <span>quiet</span>. <span>He</span> <span>searched</span> <span>on the internet</span> <span>and</span> <span>found</span> <span>a</span> <span>small</span> <span>village</span> <span>near</span> <span>the</span> <span>Whispering Forest</span>. <span>The</span> <span>village</span> <span>was</span> <span>famous</span> <span>for</span> <span>its</span> <span>tall</span> <span>trees</span> <span>and</span> <span>strange</span> <span>birds</span>. <span>Leo</span> <span>packed</span> <span>his</span> <span>bag</span>, <span>took</span> <span>his</span> <span>best</span> <span>camera</span>, <span>and</span> <span>started</span> <span>his</span> <span>car</span>.</p>
            <a>Leo é um jovem fotógrafo que mora em uma cidade movimentada. Ele ama seu trabalho, mas às vezes a cidade é barulhenta demais. No mês passado, ele decidiu tirar férias. Ele queria visitar um lugar onde a natureza fosse selvagem e quieta. Ele pesquisou na internet e encontrou uma pequena vila perto da Floresta Sussurrante. A vila era famosa por suas árvores altas e pássaros estranhos. Leo arrumou sua mala, pegou sua melhor câmera e ligou seu carro.</a>

            <p><span>The</span> <span>drive</span> <span>was</span> <span>very</span> <span>long</span>. <span>He</span> <span>drove</span> <span>for</span> <span>six</span> <span>hours</span> <span>through</span> <span>the</span> <span>mountains</span>. <span>When</span> <span>he</span> <span>arrived</span> <span>at</span> <span>the</span> <span>village</span>, <span>it was</span> <span>already</span> <span>evening</span>. <span>The</span> <span>air</span> <span>was</span> <span>cool</span> <span>and</span> <span>smelled</span> <span>like</span> <span>pine</span> <span>trees</span>. <span>He</span> <span>found</span> <span>a</span> <span>small</span> <span>hotel</span> <span>made of</span> <span>wood</span>. <span>The</span> <span>owner</span> <span>was</span> <span>an</span> <span>old</span> <span>man</span> <span>named</span> <span>Samuel</span>. <span>Samuel</span> <span>was</span> <span>kind</span> <span>but</span> <span>he</span> <span>looked</span> <span>worried</span>. "<span>Are</span> <span>you</span> <span>going</span> <span>into the forest</span>?" <span>Samuel</span> <span>asked</span>. <span>Leo</span> <span>smiled</span> <span>and</span> <span>said</span> <span>yes</span>. <span>Samuel</span> <span>told</span> <span>him</span> <span>to stay</span> <span>on the path</span> <span>because</span> <span>the</span> <span>forest</span> <span>was</span> <span>very</span> <span>easy</span> <span>to get lost in</span>.</p>
            <a>A viagem foi muito longa. Ele dirigiu por seis horas através das montanhas. Quando chegou à vila, já era noite. O ar estava fresco e cheirava a pinheiros. Ele encontrou um pequeno hotel feito de madeira. O dono era um velho chamado Samuel. Samuel era gentil, mas parecia preocupado. "Você vai entrar na floresta?" Samuel perguntou. Leo sorriu e disse que sim. Samuel disse a ele para ficar no caminho porque a floresta era muito fácil de se perder.</a>

            <p><span>The</span> <span>next</span> <span>morning</span>, <span>the</span> <span>sun</span> <span>was</span> <span>bright</span>. <span>Leo</span> <span>ate</span> <span>a</span> <span>big</span> <span>breakfast</span> <span>and</span> <span>walked</span> <span>to the forest</span>. <span>The</span> <span>trees</span> <span>were</span> <span>so</span> <span>big</span> <span>that</span> <span>they</span> <span>blocked</span> <span>the</span> <span>sky</span>. <span>He</span> <span>started</span> <span>walking</span> <span>and</span> <span>taking</span> <span>many</span> <span>pictures</span>. <span>He</span> <span>saw</span> <span>blue</span> <span>butterflies</span> <span>and</span> <span>green</span> <span>lizards</span>. <span>Everything</span> <span>was</span> <span>perfect</span>. <span>However</span>, <span>after</span> <span>two</span> <span>hours</span>, <span>Leo</span> <span>heard</span> <span>a</span> <span>noise</span>. <span>It</span> <span>sounded like</span> <span>someone</span> <span>was</span> <span>singing</span>. <span>He</span> <span>was</span> <span>curious</span> <span>so</span> <span>he</span> <span>left</span> <span>the</span> <span>main</span> <span>path</span>. <span>He</span> <span>walked</span> <span>deeper</span> <span>into the trees</span> <span>to find</span> <span>the</span> <span>voice</span>. <span>The</span> <span>grass</span> <span>was</span> <span>very</span> <span>tall</span> <span>there</span>.</p>
            <a>Na manhã seguinte, o sol estava brilhante. Leo comeu um café da manhã reforçado e caminhou até a floresta. As árvores eram tão grandes que bloqueavam o céu. Ele começou a caminhar e tirar muitas fotos. Ele viu borboletas azuis e lagartos verdes. Tudo estava perfeito. No entanto, após duas horas, Leo ouviu um barulho. Parecia que alguém estava cantando. Ele estava curioso, então saiu do caminho principal. Ele caminhou mais fundo entre as árvores para encontrar a voz. A grama estava muito alta ali.</a>

            <p><span>Suddenly</span>, <span>the</span> <span>forest</span> <span>became</span> <span>very</span> <span>dark</span>. <span>Leo</span> <span>looked</span> <span>at</span> <span>his</span> <span>watch</span> <span>and</span> <span>realized</span> <span>it was</span> <span>late</span>. <span>He</span> <span>tried</span> <span>to go back</span>, <span>but</span> <span>he</span> <span>could not</span> <span>find</span> <span>the</span> <span>path</span>. <span>He</span> <span>felt</span> <span>nervous</span>. <span>He</span> <span>remembered</span> <span>Samuel's</span> <span>words</span>. <span>The</span> <span>voice</span> <span>was</span> <span>gone</span>, <span>and</span> <span>now</span> <span>there was</span> <span>only</span> <span>silence</span>. <span>He</span> <span>walked</span> <span>for</span> <span>another</span> <span>hour</span>, <span>but</span> <span>every</span> <span>tree</span> <span>looked</span> <span>the</span> <span>same</span>. <span>He</span> <span>decided</span> <span>to stop</span> <span>and</span> <span>think</span>. <span>He</span> <span>had</span> <span>a</span> <span>bottle of water</span> <span>and</span> <span>an</span> <span>apple</span> <span>in</span> <span>his</span> <span>bag</span>. <span>He</span> <span>was</span> <span>tired</span>, <span>so</span> <span>he</span> <span>sat</span> <span>under</span> <span>a</span> <span>large</span> <span>oak</span> <span>tree</span> <span>to rest</span> <span>for a moment</span>.</p>
            <a>De repente, a floresta ficou muito escura. Leo olhou para seu relógio e percebeu que estava tarde. Ele tentou voltar, mas não conseguia encontrar o caminho. Ele se sentiu nervoso. Ele lembrou das palavras de Samuel. A voz tinha sumido e agora havia apenas silêncio. Ele caminhou por mais uma hora, mas cada árvore parecia igual. Ele decidiu parar e pensar. Ele tinha uma garrafa de água e uma maçã em sua bolsa. Ele estava cansado, então sentou-se debaixo de um grande carvalho para descansar por um momento.</a>

            <p><span>While</span> <span>he</span> <span>was</span> <span>sitting</span>, <span>he</span> <span>noticed</span> <span>something</span> <span>shiny</span> <span>on the ground</span>. <span>It was</span> <span>an</span> <span>old</span> <span>key</span> <span>made of</span> <span>silver</span>. <span>Leo</span> <span>picked</span> <span>it</span> <span>up</span>. "<span>What</span> <span>does</span> <span>this</span> <span>open</span>?" <span>he</span> <span>thought</span>. <span>He</span> <span>looked</span> <span>around</span> <span>and</span> <span>saw</span> <span>a</span> <span>small</span> <span>stone</span> <span>wall</span> <span>behind</span> <span>the</span> <span>bushes</span>. <span>He</span> <span>pushed</span> <span>the</span> <span>leaves</span> <span>away</span> <span>and</span> <span>found</span> <span>a</span> <span>hidden</span> <span>gate</span>. <span>The</span> <span>silver</span> <span>key</span> <span>fit</span> <span>the</span> <span>lock</span> <span>perfectly</span>. <span>When</span> <span>he</span> <span>opened</span> <span>the</span> <span>gate</span>, <span>he</span> <span>saw</span> <span>a</span> <span>beautiful</span> <span>secret</span> <span>garden</span>. <span>There were</span> <span>flowers</span> <span>of</span> <span>every</span> <span>color</span>: <span>purple</span>, <span>pink</span>, <span>and</span> <span>gold</span>. <span>In the middle</span> <span>of the garden</span>, <span>there was</span> <span>a</span> <span>small</span> <span>fountain</span> <span>with</span> <span>clear</span> <span>water</span>.</p>
            <a>Enquanto estava sentado, ele notou algo brilhante no chão. Era uma chave antiga feita de prata. Leo a pegou. "O que isso abre?" ele pensou. Ele olhou ao redor e viu um pequeno muro de pedra atrás dos arbustos. Ele empurrou as folhas e encontrou um portão escondido. A chave de prata coube na fechadura perfeitamente. Quando ele abriu o portão, viu um lindo jardim secreto. Havia flores de todas as cores: roxo, rosa e dourado. No meio do jardim, havia uma pequena fonte com água límpida.</a>

            <p><span>In the garden</span>, <span>he</span> <span>met</span> <span>a</span> <span>woman</span> <span>named</span> <span>Elara</span>. <span>She</span> <span>was</span> <span>the</span> <span>person</span> <span>singing</span>. <span>She</span> <span>lived</span> <span>in</span> <span>a</span> <span>small</span> <span>cottage</span> <span>inside</span> <span>the</span> <span>garden</span>. <span>Elara</span> <span>explained</span> <span>that</span> <span>she</span> <span>was</span> <span>a</span> <span>botanist</span>. <span>She</span> <span>studied</span> <span>rare</span> <span>plants</span> <span>that</span> <span>only</span> <span>grew</span> <span>there</span>. <span>She</span> <span>was</span> <span>not</span> <span>dangerous</span>, <span>just</span> <span>lonely</span>. <span>She</span> <span>gave</span> <span>Leo</span> <span>some</span> <span>herbal</span> <span>tea</span> <span>and</span> <span>showed</span> <span>him</span> <span>her</span> <span>books</span>. <span>Leo</span> <span>stayed</span> <span>there</span> <span>until</span> <span>the</span> <span>moon</span> <span>was</span> <span>high</span> <span>in the sky</span>. <span>He</span> <span>took</span> <span>the</span> <span>most</span> <span>beautiful</span> <span>photos</span> <span>of</span> <span>his</span> <span>life</span>. <span>Elara</span> <span>knew</span> <span>the</span> <span>forest</span> <span>very</span> <span>well</span>, <span>and</span> <span>she</span> <span>promised</span> <span>to show</span> <span>him</span> <span>the</span> <span>way</span> <span>back</span> <span>to the village</span> <span>the</span> <span>next</span> <span>day</span>.</p>
            <a>No jardim, ele conheceu uma mulher chamada Elara. Ela era a pessoa que estava cantando. Ela morava em um pequeno chalé dentro do jardim. Elara explicou que era botânica. Ela estudava plantas raras que só cresciam ali. Ela não era perigosa, apenas solitária. Ela deu a Leo um chá de ervas e mostrou a ele seus livros. Leo ficou lá até que a lua estivesse alta no céu. Ele tirou as fotos mais bonitas de sua vida. Elara conhecia a floresta muito bem, e prometeu mostrar a ele o caminho de volta para a vila no dia seguinte.</a>

            <p><span>The</span> <span>morning</span> <span>after</span>, <span>Elara</span> <span>led</span> <span>Leo</span> <span>through</span> <span>a</span> <span>secret</span> <span>path</span>. <span>The</span> <span>walk</span> <span>was</span> <span>fast</span> <span>and</span> <span>easy</span>. <span>When</span> <span>they</span> <span>reached</span> <span>the</span> <span>edge</span> <span>of the forest</span>, <span>Leo</span> <span>thanked</span> <span>her</span> <span>many</span> <span>times</span>. <span>He</span> <span>gave</span> <span>her</span> <span>a</span> <span>picture</span> <span>he</span> <span>took</span> <span>of the fountain</span>. <span>Samuel</span> <span>was</span> <span>waiting</span> <span>at the hotel</span> <span>and</span> <span>he</span> <span>was</span> <span>very</span> <span>happy</span> <span>to see</span> <span>Leo</span> <span>safe</span>. <span>Leo</span> <span>returned</span> <span>to the city</span> <span>with</span> <span>a</span> <span>great</span> <span>story</span>. <span>He</span> <span>made</span> <span>a</span> <span>book</span> <span>with</span> <span>his</span> <span>photos</span> <span>and</span> <span>called</span> <span>it</span> "<span>The Whispering Garden</span>." <span>He</span> <span>never</span> <span>forgot</span> <span>the</span> <span>kind</span> <span>woman</span> <span>and</span> <span>the</span> <span>silver</span> <span>key</span>. <span>He</span> <span>plans</span> <span>to visit</span> <span>Samuel</span> <span>and</span> <span>Elara</span> <span>again</span> <span>next</span> <span>year</span>.</p>
            <a>Na manhã seguinte, Elara conduziu Leo por um caminho secreto. A caminhada foi rápida e fácil. Quando chegaram à beira da floresta, Leo agradeceu-lhe muitas vezes. Ele deu a ela uma foto que tirou da fonte. Samuel estava esperando no hotel e ficou muito feliz em ver Leo seguro. Leo voltou para a cidade com uma ótima história. Ele fez um livro com suas fotos e o chamou de "O Jardim Sussurrante". Ele nunca esqueceu a mulher gentil e a chave de prata. Ele planeja visitar Samuel e Elara novamente no ano que vem.</a>
        `
    },

    "book_7": {
    title: "The Robot in the Garden",
    level: "A2",
    content: `
        <p><span>Sarah</span> <span>lives</span> <span>in</span> <span>a</span> <span>quiet</span> <span>neighborhood</span> <span>with</span> <span>her</span> <span>parents</span> <span>and</span> <span>her</span> <span>dog</span>, <span>Buster</span>. <span>One</span> <span>Saturday</span> <span>morning</span>, <span>she</span> <span>was</span> <span>working</span> <span>in</span> <span>the</span> <span>garden</span>. <span>The</span> <span>weather</span> <span>was</span> <span>sunny</span> <span>and</span> <span>warm</span>. <span>Suddenly</span>, <span>Buster</span> <span>started</span> <span>digging</span> <span>a</span> <span>hole</span> <span>near</span> <span>the</span> <span>old</span> <span>oak</span> <span>tree</span>. <span>He</span> <span>was</span> <span>barking</span> <span>loudly</span>. <span>Sarah</span> <span>walked</span> <span>to</span> <span>him</span> <span>to</span> <span>see</span> <span>what</span> <span>happened</span>. <span>Under</span> <span>the</span> <span>dirt</span>, <span>she</span> <span>saw</span> <span>something</span> <span>metallic</span> <span>and</span> <span>shiny</span>. <span>It</span> <span>was</span> <span>not</span> <span>a</span> <span>rock</span> <span>or</span> <span>a</span> <span>bone</span>. <span>It</span> <span>was</span> <span>a</span> <span>small</span>, <span>silver</span> <span>box</span> <span>with</span> <span>blue</span> <span>buttons</span>.</p>
        <a>Sarah mora em um bairro tranquilo com seus pais e seu cachorro, Buster. Em uma manhã de sábado, ela estava trabalhando no jardim. O tempo estava ensolarado e quente. De repente, Buster começou a cavar um buraco perto do velho carvalho. Ele estava latindo alto. Sarah caminhou até ele para ver o que aconteceu. Debaixo da terra, ela viu algo metálico e brilhante. Não era uma pedra ou um osso. Era uma pequena caixa prateada com botões azuis.</a>

        <p><span>She</span> <span>cleaned</span> <span>the</span> <span>box</span> <span>with</span> <span>her</span> <span>shirt</span>. <span>When</span> <span>she</span> <span>pressed</span> <span>the</span> <span>largest</span> <span>button</span>, <span>the</span> <span>box</span> <span>opened</span>. <span>Inside</span>, <span>there</span> <span>was</span> <span>a</span> <span>tiny</span> <span>robot</span>. <span>It</span> <span>had</span> <span>two</span> <span>round</span> <span>eyes</span> <span>and</span> <span>short</span> <span>arms</span>. <span>The</span> <span>robot</span> <span>moved</span> <span>its</span> <span>head</span> <span>and</span> <span>said</span>, "<span>System</span> <span>online</span>. <span>Hello</span>, <span>I</span> <span>am</span> <span>Unit</span> <span>7</span>. <span>Where</span> <span>is</span> <span>Professor</span> <span>Barnaby</span>?" <span>Sarah</span> <span>was</span> <span>shocked</span>. <span>She</span> <span>never</span> <span>met</span> <span>a</span> <span>talking</span> <span>robot</span> <span>before</span>. <span>She</span> <span>took</span> <span>the</span> <span>robot</span> <span>to</span> <span>her</span> <span>bedroom</span> <span>and</span> <span>hid</span> <span>it</span> <span>under</span> <span>her</span> <span>bed</span>. <span>She</span> <span>didn't</span> <span>want</span> <span>her</span> <span>parents</span> <span>to</span> <span>see</span> <span>it</span> <span>yet</span>.</p>
        <a>Ela limpou a caixa com sua camisa. Quando pressionou o botão maior, a caixa abriu. Dentro, havia um robô minúsculo. Ele tinha dois olhos redondos e braços curtos. O robô moveu a cabeça e disse: "Sistema online. Olá, eu sou a Unidade 7. Onde está o Professor Barnaby?" Sarah ficou chocada. Ela nunca tinha conhecido um robô falante antes. Ela levou o robô para o seu quarto e o escondeu debaixo da cama. Ela não queria que seus pais o vissem ainda.</a>

        <p><span>The</span> <span>next</span> <span>day</span>, <span>Sarah</span> <span>decided</span> <span>to</span> <span>help</span> <span>Unit</span> <span>7</span>. <span>The</span> <span>robot</span> <span>told</span> <span>her</span> <span>that</span> <span>Professor</span> <span>Barnaby</span> <span>was</span> <span>an</span> <span>inventor</span> <span>who</span> <span>lived</span> <span>in</span> <span>that</span> <span>house</span> <span>fifty</span> <span>years</span> <span>ago</span>. <span>Sarah</span> <span>went</span> <span>to</span> <span>the</span> <span>local</span> <span>library</span> <span>to</span> <span>search</span> <span>for</span> <span>information</span>. <span>She</span> <span>used</span> <span>the</span> <span>computer</span> <span>to</span> <span>look</span> <span>at</span> <span>old</span> <span>newspapers</span>. <span>She</span> <span>found</span> <span>an</span> <span>article</span> <span>from</span> <span>1976</span>. <span>It</span> <span>said</span> <span>that</span> <span>the</span> <span>professor</span> <span>disappeared</span> <span>while</span> <span>working</span> <span>on</span> <span>a</span> <span>secret</span> <span>project</span>. <span>People</span> <span>thought</span> <span>he</span> <span>was</span> <span>crazy</span>, <span>but</span> <span>Sarah</span> <span>knew</span> <span>the</span> <span>truth</span> <span>now</span>. <span>The</span> <span>project</span> <span>was</span> <span>real</span>.</p>
        <a>No dia seguinte, Sarah decidiu ajudar a Unidade 7. O robô disse a ela que o Professor Barnaby era um inventor que morou naquela casa há cinquenta anos. Sarah foi à biblioteca local para procurar informações. Ela usou o computador para olhar jornais antigos. Ela encontrou um artigo de 1976. Dizia que o professor desapareceu enquanto trabalhava em um projeto secreto. As pessoas pensavam que ele era louco, mas Sarah sabia a verdade agora. O projeto era real.</a>

        <p><span>While</span> <span>she</span> <span>was</span> <span>reading</span>, <span>Unit</span> <span>7</span> <span>started</span> <span>beeping</span>. "<span>Signal</span> <span>detected</span>," <span>the</span> <span>robot</span> <span>whispered</span>. <span>Sarah</span> <span>followed</span> <span>the</span> <span>robot's</span> <span>directions</span> <span>to</span> <span>the</span> <span>back</span> <span>of</span> <span>the</span> <span>library</span>. <span>There</span> <span>was</span> <span>an</span> <span>old</span> <span>storage</span> <span>room</span> <span>full</span> <span>of</span> <span>dusty</span> <span>books</span>. <span>In</span> <span>the</span> <span>corner</span>, <span>there</span> <span>was</span> <span>a</span> <span>heavy</span> <span>wooden</span> <span>desk</span>. <span>Sarah</span> <span>pushed</span> <span>the</span> <span>desk</span> <span>and</span> <span>found</span> <span>a</span> <span>small</span> <span>door</span> <span>in</span> <span>the</span> <span>floor</span>. <span>It</span> <span>was</span> <span>a</span> <span>basement</span>. <span>She</span> <span>was</span> <span>scared</span>, <span>but</span> <span>she</span> <span>wanted</span> <span>to</span> <span>solve</span> <span>the</span> <span>mystery</span>. <span>She</span> <span>turned</span> <span>on</span> <span>her</span> <span>flashlight</span> <span>and</span> <span>went</span> <span>down</span> <span>the</span> <span>stairs</span>.</p>
        <a>Enquanto ela lia, a Unidade 7 começou a apitar. "Sinal detectado", o robô sussurrou. Sarah seguiu as direções do robô até os fundos da biblioteca. Havia uma velha sala de armazenamento cheia de livros empoeirados. No canto, havia uma pesada escrivaninha de madeira. Sarah empurrou a escrivaninha e encontrou uma pequena porta no chão. Era um porão. Ela estava com medo, mas queria resolver o mistério. Ela ligou sua lanterna e desceu as escadas.</a>

        <p><span>The</span> <span>basement</span> <span>was</span> <span>not</span> <span>empty</span>. <span>It</span> <span>was</span> <span>a</span> <span>secret</span> <span>laboratory</span>. <span>There</span> <span>were</span> <span>many</span> <span>machines</span>, <span>blueprints</span>, <span>and</span> <span>tools</span>. <span>Unit</span> <span>7</span> <span>flew</span> <span>to</span> <span>a</span> <span>large</span> <span>computer</span> <span>and</span> <span>connected</span> <span>a</span> <span>cable</span>. <span>Suddenly</span>, <span>the</span> <span>lights</span> <span>turned</span> <span>on</span>. <span>A</span> <span>hologram</span> <span>appeared</span> <span>in</span> <span>the</span> <span>middle</span> <span>of</span> <span>the</span> <span>room</span>. <span>It</span> <span>was</span> <span>Professor</span> <span>Barnaby</span>. <span>He</span> <span>looked</span> <span>old</span> <span>but</span> <span>his</span> <span>eyes</span> <span>were</span> <span>kind</span>. "<span>If</span> <span>you</span> <span>are</span> <span>watching</span> <span>this</span>," <span>the</span> <span>hologram</span> <span>said</span>, "<span>it</span> <span>means</span> <span>Unit</span> <span>7</span> <span>is</span> <span>safe</span>. <span>I</span> <span>had</span> <span>to</span> <span>hide</span> <span>my</span> <span>technology</span> <span>from</span> <span>bad</span> <span>men</span> <span>who</span> <span>wanted</span> <span>to</span> <span>use</span> <span>it</span> <span>for</span> <span>war</span>."</p>
        <a>O porão não estava vazio. Era um laboratório secreto. Havia muitas máquinas, plantas (projetos) e ferramentas. A Unidade 7 voou até um grande computador e conectou um cabo. De repente, as luzes se acenderam. Um holograma apareceu no meio da sala. Era o Professor Barnaby. Ele parecia velho, mas seus olhos eram gentis. "Se você está assistindo a isso", disse o holograma, "significa que a Unidade 7 está segura. Tive que esconder minha tecnologia de homens maus que queriam usá-la para a guerra."</a>

        <p><span>The</span> <span>Professor</span> <span>explained</span> <span>that</span> <span>Unit</span> <span>7</span> <span>was</span> <span>designed</span> <span>to</span> <span>clean</span> <span>the</span> <span>oceans</span>. <span>Sarah</span> <span>felt</span> <span>very</span> <span>proud</span> <span>of</span> <span>her</span> <span>new</span> <span>friend</span>. <span>She</span> <span>learned</span> <span>that</span> <span>she</span> <span>could</span> <span>use</span> <span>the</span> <span>tools</span> <span>in</span> <span>the</span> <span>lab</span> <span>to</span> <span>finish</span> <span>the</span> <span>Professor's</span> <span>work</span>. <span>From</span> <span>that</span> <span>day</span> <span>on</span>, <span>Sarah</span> <span>spent</span> <span>her</span> <span>afternoons</span> <span>in</span> <span> the</span> <span>library</span> <span>basement</span>. <span>She</span> <span>became</span> <span>a</span> <span>student</span> <span>of</span> <span>science</span> <span>and</span> <span>robotics</span>. <span>Buster</span> <span>always</span> <span>waited</span> <span>for</span> <span>her</span> <span>outside</span>. <span>The</span> <span>town</span> <span>remained</span> <span>quiet</span>, <span>but</span> <span>under</span> <span>the</span> <span>ground</span>, <span>the</span> <span>future</span> <span>was</span> <span>beginning</span>. <span>Sarah</span> <span>vowed</span> <span>to</span> <span>protect</span> <span>the</span> <span>secret</span> <span>and</span> <span>help</span> <span>the</span> <span>planet</span>, <span>just</span> <span>like</span> <span>the</span> <span>Professor</span> <span>dreamed</span>.</p>
        <a>O Professor explicou que a Unidade 7 foi projetada para limpar os oceanos. Sarah sentiu muito orgulho de seu novo amigo. Ela aprendeu que poderia usar as ferramentas no laboratório para terminar o trabalho do Professor. Daquele dia em diante, Sarah passou suas tardes no porão da biblioteca. Ela se tornou uma estudante de ciência e robótica. Buster sempre esperava por ela do lado de fora. A cidade continuou calma, mas debaixo do chão, o futuro estava começando. Sarah prometeu proteger o segredo e ajudar o planeta, exatamente como o Professor sonhou.</a>
    `
},

"book_8": {
    title: "The Mystery of the Silver Watch",
    level: "A2",
    content: `
        <p><span>Thomas</span> <span>is</span> <span>a</span> <span>private</span> <span>detective</span> <span>in</span> <span>Chicago</span>. <span>He</span> <span>is</span> <span>not</span> <span>famous</span>, <span>but</span> <span>he</span> <span>is</span> <span>very</span> <span>smart</span>. <span>He</span> <span>has</span> <span>a</span> <span>small</span> <span>office</span> <span>near</span> <span>the</span> <span>train</span> <span>station</span>. <span>The</span> <span>office</span> <span>is</span> <span>old</span> <span>and</span> <span>always</span> <span>smells</span> <span>like</span> <span>strong</span> <span>coffee</span>.</p>
        <a>Thomas é um detetive particular em Chicago. Ele não é famoso, mas é muito esperto. Ele tem um pequeno escritório perto da estação de trem. O escritório é antigo e sempre cheira a café forte.</a>

        <p><span>One</span> <span>rainy</span> <span>Tuesday</span>, <span>a</span> <span>woman</span> <span>walked</span> <span>into</span> <span>his</span> <span>office</span>. <span>Her</span> <span>name</span> <span>was</span> <span>Mrs. Gable</span>. <span>She</span> <span>looked</span> <span>very</span> <span>sad</span> <span>and</span> <span>was</span> <span>holding</span> <span>a</span> <span>wet</span> <span>umbrella</span>. <span>She</span> <span>sat</span> <span>down</span> <span>and</span> <span>put</span> <span>her</span> <span>bag</span> <span>on</span> <span>the</span> <span>desk</span>. <span>Thomas</span> <span>offered</span> <span>her</span> <span>some</span> <span>water</span>.</p>
        <a>Em uma terça-feira chuvosa, uma mulher entrou em seu escritório. O nome dela era Sra. Gable. Ela parecia muito triste e estava segurando um guarda-chuva molhado. Ela se sentou e colocou sua bolsa na mesa. Thomas ofereceu-lhe um pouco de água.</a>

        <p><span>"Someone</span> <span>stole</span> <span>my</span> <span>grandfather's</span> <span>watch,"</span> <span>she</span> <span>said</span> <span>quietly</span>. <span>"It</span> <span>is</span> <span>made</span> <span>of</span> <span>silver</span> <span>and</span> <span>it</span> <span>is</span> <span>very</span> <span>important</span> <span>to</span> <span>my</span> <span>family."</span> <span>Thomas</span> <span>took</span> <span>his</span> <span>notebook</span> <span>and</span> <span>a</span> <span>pen</span>. <span>He</span> <span>asked</span> <span>her</span> <span>where</span> <span>she</span> <span>was</span> <span>yesterday</span> <span>at</span> <span>five</span> <span>o'clock</span>.</p>
        <a>"Alguém roubou o relógio do meu avô", disse ela calmamente. "Ele é feito de prata e é muito importante para minha família." Thomas pegou seu caderno e uma caneta. Ele perguntou onde ela estava ontem às cinco horas.</a>

        <p><span>Mrs. Gable</span> <span>said</span> <span>she</span> <span>was</span> <span>at</span> <span>the</span> <span>Grand</span> <span>Hotel</span>. <span>She</span> <span>was</span> <span>having</span> <span>tea</span> <span>with</span> <span>some</span> <span>friends</span>. <span>She</span> <span>left</span> <span>the</span> <span>watch</span> <span>on</span> <span>the</span> <span>table</span> <span>for</span> <span>one</span> <span>minute</span>. <span>When</span> <span>she</span> <span>returned</span> <span>from</span> <span>the</span> <span>restroom</span>, <span>the</span> <span>watch</span> <span>was</span> <span>gone</span>. <span>There</span> <span>were</span> <span>three</span> <span>people</span> <span>near</span> <span>her</span> <span>table</span>: <span>a</span> <span>waiter</span>, <span>a</span> <span>man</span> <span>reading</span> <span>a</span> <span>book</span>, <span>and</span> <span>a</span> <span>young</span> <span>girl</span>.</p>
        <a>A Sra. Gable disse que estava no Grand Hotel. Ela estava tomando chá com alguns amigos. Ela deixou o relógio sobre a mesa por um minuto. Quando voltou do banheiro, o relógio tinha sumido. Havia três pessoas perto da mesa dela: um garçom, um homem lendo um livro e uma jovem.</a>

        <p><span>Thomas</span> <span>went</span> <span>to</span> <span>the</span> <span>hotel</span> <span>the</span> <span>next</span> <span>day</span>. <span>The</span> <span>lobby</span> <span>was</span> <span>very</span> <span>elegant</span> <span>and</span> <span>the</span> <span>floors</span> <span>were</span> <span>clean</span>. <span>He</span> <span>spoke</span> <span>to</span> <span>the</span> <span>manager</span> <span>first</span>. <span>The</span> <span>manager</span> <span>didn't</span> <span>see</span> <span>anything</span> <span>strange</span>. <span>Then</span>, <span>Thomas</span> <span>walked</span> <span>to</span> <span>the</span> <span>tea</span> <span>room</span>. <span>He</span> <span>found</span> <span>the</span> <span>waiter</span> <span>who</span> <span>worked</span> <span>yesterday</span>. <span>The</span> <span>waiter's</span> <span>name</span> <span>was</span> <span>Robert</span>.</p>
        <a>Thomas foi ao hotel no dia seguinte. O saguão era muito elegante e o chão estava limpo. Ele falou com o gerente primeiro. O gerente não viu nada de estranho. Então, Thomas caminhou até a sala de chá. Ele encontrou o garçom que trabalhou ontem. O nome do garçom era Robert.</a>

        <p><span>Robert</span> <span>was</span> <span>very</span> <span>nervous</span>. <span>His</span> <span>hands</span> <span>were</span> <span>shaking</span> <span>when</span> <span>he</span> <span>carried</span> <span>the</span> <span>cups</span>. <span>Thomas</span> <span>asked</span> <span>him</span> <span>about</span> <span>the</span> <span>silver</span> <span>watch</span>. <span>"I</span> <span>didn't</span> <span>take</span> <span>it,"</span> <span>Robert</span> <span>said</span> <span>quickly</span>. <span>"I</span> <span>was</span> <span>busy</span> <span>in</span> <span>the</span> <span>kitchen</span> <span>making</span> <span>sandwiches."</span> <span>Thomas</span> <span>noticed</span> <span>something</span> <span>in</span> <span>Robert's</span> <span>pocket</span>. <span>It</span> <span>was</span> <span>a</span> <span>small</span>, <span>shiny</span> <span>chain</span>.</p>
        <a>Robert estava muito nervoso. Suas mãos tremiam quando ele carregava as xícaras. Thomas perguntou a ele sobre o relógio de prata. "Eu não peguei", disse Robert rapidamente. "Eu estava ocupado na cozinha fazendo sanduíches." Thomas notou algo no bolso de Robert. Era uma pequena corrente brilhante.</a>

        <p><span>Thomas</span> <span>didn't</span> <span>say</span> <span>anything</span> <span>to</span> <span>Robert</span>. <span>Instead</span>, <span>he</span> <span>sat</span> <span>down</span> <span>at</span> <span>the</span> <span>table</span> <span>near</span> <span>the</span> <span>window</span>. <span>He</span> <span>looked</span> <span>at</span> <span>the</span> <span>floor</span> <span>very</span> <span>carefully</span>. <span>He</span> <span>found</span> <span>a</span> <span>piece</span> <span>of</span> <span>blue</span> <span>paper</span>. <span>It</span> <span>was</span> <span>a</span> <span>ticket</span> <span>for</span> <span>the</span> <span>cinema</span>. <span>The</span> <span>time</span> <span>on</span> <span>the</span> <span>ticket</span> <span>was</span> <span>five-thirty</span> <span>yesterday</span>. <span>Thomas</span> <span>thought</span> <span>about</span> <span>this</span> <span>for</span> <span>a</span> <span>moment</span>. <span>"This</span> <span>is</span> <span>interesting,"</span> <span>he</span> <span>whispered</span>.</p>
        <a>Thomas não disse nada para Robert. Em vez disso, ele se sentou à mesa perto da janela. Ele olhou para o chão com muito cuidado. Ele encontrou um pedaço de papel azul. Era um ingresso de cinema. O horário no ingresso era cinco e meia de ontem. Thomas pensou sobre isso por um momento. "Isso é interessante", ele sussurrou.</a>

        <p><span>He</span> <span>followed</span> <span>Robert</span> <span>after</span> <span>work</span>. <span>Robert</span> <span>didn't</span> <span>go</span> <span>home</span>. <span>He</span> <span>walked</span> <span>to</span> <span>a</span> <span>small</span> <span>shop</span> <span>that</span> <span>buys</span> <span>old</span> <span>jewelry</span>. <span>Thomas</span> <span>waited</span> <span>outside</span> <span>the</span> <span>shop</span>. <span>When</span> <span>Robert</span> <span>came</span> <span>out</span>, <span>Thomas</span> <span>stopped</span> <span>him</span>. <span>"Show</span> <span>me</span> <span>your</span> <span>hands,</span> <span>Robert,"</span> <span>Thomas</span> <span>said</span> <span>firmly</span>. <span>Robert</span> <span>was</span> <span>scared</span>. <span>He</span> <span>didn't</span> <span>want</span> <span>to</span> <span>go</span> <span>to</span> <span>prison</span>. <span>He</span> <span>cried</span> <span>and</span> <span>gave</span> <span>Thomas</span> <span>the</span> <span>silver</span> <span>watch</span>.</p>
        <a>Ele seguiu Robert depois do trabalho. Robert não foi para casa. Ele caminhou até uma pequena loja que compra joias antigas. Thomas esperou do lado de fora da loja. Quando Robert saiu, Thomas o parou. "Mostre-me suas mãos, Robert", disse Thomas com firmeza. Robert estava com medo. Ele não queria ir para a prisão. Ele chorou e entregou a Thomas o relógio de prata.</a>

        <p><span>"I</span> <span>needed</span> <span>the</span> <span>money</span> <span>for</span> <span>my</span> <span>mother's</span> <span>medicine,"</span> <span>Robert</span> <span>explained</span>. <span>Thomas</span> <span>felt</span> <span>sorry</span> <span>for</span> <span>him</span>, <span>but</span> <span>he</span> <span>knew</span> <span>that</span> <span>stealing</span> <span>was</span> <span>wrong</span>. <span>He</span> <span>returned</span> <span>the</span> <span>watch</span> <span>to</span> <span>Mrs. Gable</span> <span>the</span> <span>next</span> <span>morning</span>. <span>She</span> <span>was</span> <span>so</span> <span>happy</span> <span>that</span> <span>she</span> <span>gave</span> <span>Thomas</span> <span>a</span> <span>large</span> <span>reward</span>. <span>Thomas</span> <span>used</span> <span>half</span> <span>of</span> <span>the</span> <span>money</span> <span>to</span> <span>help</span> <span>Robert's</span> <span>mother</span> <span>with</span> <span>her</span> <span>medicine</span>. <span>Thomas</span> <span>believes</span> <span>in</span> <span>justice</span>, <span>but</span> <span>he</span> <span>also</span> <span>believes</span> <span>in</span> <span>kindness</span>.</p>
        <a>"Eu precisava do dinheiro para o remédio da minha mãe", explicou Robert. Thomas sentiu pena dele, mas sabia que roubar era errado. Ele devolveu o relógio à Sra. Gable na manhã seguinte. Ela ficou tão feliz que deu a Thomas uma grande recompensa. Thomas usou metade do dinheiro para ajudar a mãe de Robert com seu remédio. Thomas acredita em justiça, mas também acredita em bondade.</a>
    `
},

"book_9": {
    title: "The Green House on Mars",
    level: "A2",
    content: `
        <p><span>In</span> <span>the</span> <span>year</span> <span>2085</span>, <span>a</span> <span>woman</span> <span>named</span> <span>Elena</span> <span>lives</span> <span>on</span> <span>Mars</span>. <span>She</span> <span>is</span> <span>a</span> <span>scientist</span>. <span>Her</span> <span>home</span> <span>is</span> <span>a</span> <span>large</span> <span>white</span> <span>dome</span> <span>made</span> <span>of</span> <span>glass</span> <span>and</span> <span>metal</span>. <span>Outside</span>, <span>the</span> <span>ground</span> <span>is</span> <span>red</span> <span>and</span> <span>dusty</span>. <span>There</span> <span>are</span> <span>no</span> <span>oceans</span> <span>or</span> <span>forests</span> <span>on</span> <span>this</span> <span>planet</span>.</p>
        <a>No ano de 2085, uma mulher chamada Elena vive em Marte. Ela é cientista. Sua casa é uma grande cúpula branca feita de vidro e metal. Do lado de fora, o chão é vermelho e empoeirado. Não há oceanos ou florestas neste planeta.</a>

        <p><span>Elena</span> <span>works</span> <span>in</span> <span>the</span> <span>Bio-Dome</span>. <span>This</span> <span>is</span> <span>a</span> <span>special</span> <span>garden</span> <span>where</span> <span>plants</span> <span>grow</span>. <span>She</span> <span>grows</span> <span>tomatoes</span>, <span>lettuce</span>, <span>and</span> <span>small</span> <span>apple</span> <span>trees</span>. <span>The</span> <span>plants</span> <span>need</span> <span>water</span> <span>and</span> <span>artificial</span> <span>light</span> <span>to</span> <span>survive</span>. <span>Every</span> <span>day</span>, <span>she</span> <span>checks</span> <span>the</span> <span>oxygen</span> <span>levels</span> <span>in</span> <span>the</span> <span>room</span>.</p>
        <a>Elena trabalha no Bio-Dome. Este é um jardim especial onde as plantas crescem. Ela cultiva tomates, alface e pequenas macieiras. As plantas precisam de água e luz artificial para sobreviver. Todos os dias, ela verifica os níveis de oxigênio na sala.</a>

        <p><span>One</span> <span>morning</span>, <span>Elena</span> <span>found</span> <span>a</span> <span>strange</span> <span>flower</span>. <span>It</span> <span>was</span> <span>not</span> <span>from</span> <span>her</span> <span>seeds</span>. <span>The</span> <span>flower</span> <span>was</span> <span>bright</span> <span>purple</span> <span>with</span> <span>silver</span> <span>leaves</span>. <span>She</span> <span>touched</span> <span>the</span> <span>soil</span>. <span>It</span> <span>was</span> <span>very</span> <span>warm</span>. <span>She</span> <span>was</span> <span>surprised</span> <span>because</span> <span>Mars</span> <span>is</span> <span>usually</span> <span>very</span> <span>cold</span>. <span>She</span> <span>took</span> <span>a</span> <span>picture</span> <span>to</span> <span>send</span> <span>to</span> <span>Earth</span>.</p>
        <a>Certa manhã, Elena encontrou uma flor estranha. Não era das sementes dela. A flor era roxa brilhante com folhas prateadas. Ela tocou o solo. Estava muito quente. Ela ficou surpresa porque Marte costuma ser muito frio. Ela tirou uma foto para enviar à Terra.</a>

        <p><span>Suddenly</span>, <span>a</span> <span>small</span> <span>robot</span> <span>entered</span> <span>the</span> <span>room</span>. <span>It</span> <span>was</span> <span>her</span> <span>assistant</span>, <span>Sparky</span>. <span>Sparky</span> <span>began</span> <span>to</span> <span>beep</span> <span>fast</span>. <span>"Warning,"</span> <span>the</span> <span>robot</span> <span>said</span>. <span>"There</span> <span>is</span> <span>an</span> <span>object</span> <span>under</span> <span>the</span> <span>ground."</span> <span>Elena</span> <span>used</span> <span>a</span> <span>small</span> <span>shovel</span> <span>to</span> <span>dig</span> <span>carefully</span> <span>near</span> <span>the</span> <span>purple</span> <span>flower</span>.</p>
        <a>De repente, um pequeno robô entrou na sala. Era seu assistente, Sparky. Sparky começou a apitar rápido. "Aviso", disse o robô. "Há um objeto sob o chão." Elena usou uma pequena pá para cavar cuidadosamente perto da flor roxa.</a>

        <p><span>She</span> <span>found</span> <span>a</span> <span>metal</span> <span>tube</span>. <span>Inside</span> <span>the</span> <span>tube</span>, <span>there</span> <span>was</span> <span>a</span> <span>very</span> <span>old</span> <span>letter</span>. <span>The</span> <span>letter</span> <span>was</span> <span>from</span> <span>the</span> <span>first</span> <span>astronauts</span> <span>on</span> <span>Mars</span>. <span>It</span> <span>said</span>, <span>"To</span> <span>the</span> <span>future:</span> <span>Protect</span> <span>this</span> <span>garden</span>. <span>Nature</span> <span>is</span> <span>the</span> <span>most</span> <span>important</span> <span>thing</span> <span>in</span> <span>the</span> <span>universe."</span> <span>Elena</span> <span>smiled</span>. <span>She</span> <span>felt</span> <span>connected</span> <span>to</span> <span>the</span> <span>history</span> <span>of</span> <span>the</span> <span>stars</span>.</p>
        <a>Ela encontrou um tubo de metal. Dentro do tubo, havia uma carta muito antiga. A carta era dos primeiros astronautas em Marte. Dizia: "Para o futuro: Protejam este jardim. A natureza é a coisa mais importante no universo." Elena sorriu. Ela se sentiu conectada à história das estrelas.</a>
    `
},

"book_10": {
    title: "Rescue in the Alps",
    level: "A2",
    content: `
        <p><span>Marc</span> <span>is</span> <span>a</span> <span>mountain</span> <span>guide</span> <span>in</span> <span>Switzerland</span>. <span>He</span> <span>is</span> <span>very</span> <span>strong</span> <span>and</span> <span>loves</span> <span>the</span> <span>snow</span>. <span>He</span> <span>lives</span> <span>in</span> <span>a</span> <span>small</span> <span>village</span> <span>with</span> <span>his</span> <span>dog</span>, <span>Rex</span>. <span>Rex</span> <span>is</span> <span>a</span> <span>large</span> <span>St. Bernard</span>. <span>He</span> <span>is</span> <span>trained</span> <span>to</span> <span>find</span> <span>people</span> <span>lost</span> <span>in</span> <span>the</span> <span>mountains</span>.</p>
        <a>Marc é um guia de montanha na Suíça. Ele é muito forte e ama a neve. Ele mora em uma pequena vila com seu cachorro, Rex. Rex é um grande São Bernardo. Ele é treinado para encontrar pessoas perdidas nas montanhas.</a>

        <p><span>One</span> <span>Friday</span> <span>afternoon</span>, <span>the</span> <span>weather</span> <span>became</span> <span>dangerous</span>. <span>A</span> <span>heavy</span> <span>snowstorm</span> <span>started</span>. <span>The</span> <span>wind</span> <span>was</span> <span>very</span> <span>loud</span> <span>and</span> <span>cold</span>. <span>The</span> <span>police</span> <span>called</span> <span>Marc</span>. <span>"Two</span> <span>hikers</span> <span>are</span> <span>missing</span> <span>near</span> <span>the</span> <span>Blue</span> <span>Peak,"</span> <span>they</span> <span>said</span>. <span>Marc</span> <span>immediately</span> <span>put</span> <span>on</span> <span>his</span> <span>winter</span> <span>jacket</span> <span>and</span> <span>boots</span>.</p>
        <a>Em uma tarde de sexta-feira, o tempo tornou-se perigoso. Uma forte tempestade de neve começou. O vento estava muito alto e frio. A polícia ligou para Marc. "Dois caminhantes estão desaparecidos perto do Pico Azul", disseram eles. Marc imediatamente vestiu sua jaqueta de inverno e botas.</a>

        <p><span>Marc</span> <span>and</span> <span>Rex</span> <span>climbed</span> <span>the</span> <span>mountain</span> <span>for</span> <span>three</span> <span>hours</span>. <span>It</span> <span>was</span> <span>difficult</span> <span>to</span> <span>see</span> <span>anything</span> <span>because</span> <span>the</span> <span>snow</span> <span>was</span> <span>so</span> <span>white</span>. <span>Rex</span> <span>used</span> <span>his</span> <span>nose</span> <span>to</span> <span>smell</span> <span>the</span> <span>air</span>. <span>Suddenly</span>, <span>Rex</span> <span>started</span> <span>running</span> <span>to</span> <span>a</span> <span>group</span> <span>of</span> <span>rocks</span>. <span>He</span> <span>began</span> <span>to</span> <span>bark</span> <span>happily</span>.</p>
        <a>Marc e Rex escalaram a montanha por três horas. Era difícil ver qualquer coisa porque a neve estava muito branca. Rex usou o nariz para cheirar o ar. De repente, Rex começou a correr para um grupo de pedras. Ele começou a latir alegremente.</a>

        <p><span>Under</span> <span>the</span> <span>rocks</span>, <span>the</span> <span>two</span> <span>hikers</span> <span>were</span> <span>sitting</span> <span>together</span>. <span>They</span> <span>were</span> <span>very</span> <span>cold</span> <span>and</span> <span>scared</span>. <span>Marc</span> <span>gave</span> <span>them</span> <span>some</span> <span>warm</span> <span>soup</span> <span>from</span> <span>his</span> <span>backpack</span>. <span>"Thank</span> <span>you,"</span> <span>the</span> <span>young</span> <span>man</span> <span>said</span>. <span>"We</span> <span>couldn't</span> <span>find</span> <span>the</span> <span>path</span> <span>back</span> <span>to</span> <span>the</span> <span>hotel."</span> <span>Marc</span> <span>showed</span> <span>them</span> <span>the</span> <span>way</span> <span>down</span>.</p>
        <a>Debaixo das pedras, os dois caminhantes estavam sentados juntos. Eles estavam com muito frio e assustados. Marc deu-lhes uma sopa quente de sua mochila. "Obrigado", disse o jovem. "Não conseguíamos encontrar o caminho de volta para o hotel." Marc mostrou-lhes o caminho de descida.</a>

        <p><span>When</span> <span>they</span> <span>arrived</span> <span>at</span> <span>the</span> <span>village</span>, <span>the</span> <span>people</span> <span>cheered</span>. <span>The</span> <span>hikers</span> <span>were</span> <span>safe</span> <span>now</span>. <span>Marc</span> <span>went</span> <span>home</span> <span>and</span> <span>gave</span> <span>Rex</span> <span>a</span> <span>big</span> <span>dinner</span>. <span>"Good</span> <span>boy</span>, <span>Rex,"</span> <span>Marc</span> <span>said</span>. <span>Being</span> <span>a</span> <span>hero</span> <span>is</span> <span>hard</span> <span>work</span>, <span>but</span> <span>Marc</span> <span>loves</span> <span>helping</span> <span>others</span> <span>in</span> <span>his</span> <span>beautiful</span> <span>mountains</span>.</p>
        <a>Quando chegaram à vila, as pessoas comemoraram. Os caminhantes estavam seguros agora. Marc foi para casa e deu a Rex um grande jantar. "Bom garoto, Rex", disse Marc. Ser um herói é um trabalho árduo, mas Marc ama ajudar os outros em suas belas montanhas.</a>
    `
},

    // ================= LEVEL B1 (Intermediate) =================
    "book_11": {
    title: "The Shadows of the Amazon",
    level: "B1",
    content: `
        <p><span>Professor</span> <span>Julian</span> <span>Carter</span> <span>had</span> <span>spent</span> <span>more</span> <span>than</span> <span>twenty</span> <span>years</span> <span>studying</span> <span>ancient</span> <span>civilizations,</span> <span>but</span> <span>he</span> <span>had</span> <span>never</span> <span>found</span> <span>anything</span> <span>as</span> <span>significant</span> <span>as</span> <span>the</span> <span>map</span> <span>he</span> <span>was</span> <span>holding.</span> <span>It</span> <span>was</span> <span>an</span> <span>old,</span> <span>fragile</span> <span>piece</span> <span>of</span> <span>parchment</span> <span>that</span> <span>he</span> <span>had</span> <span>discovered</span> <span>in</span> <span>the</span> <span>basement</span> <span>of</span> <span>a</span> <span>museum</span> <span>in</span> <span>Lisbon.</span> <span>The</span> <span>ink</span> <span>was</span> <span>faded,</span> <span>but</span> <span>the</span> <span>coordinates</span> <span>clearly</span> <span>pointed</span> <span>to</span> <span>an</span> <span>unexplored</span> <span>region</span> <span>of</span> <span>the</span> <span>Amazon</span> <span>rainforest.</span></p>
        <a>O Professor Julian Carter passou mais de vinte anos estudando civilizações antigas, mas nunca encontrou nada tão significativo quanto o mapa que segurava. Era um pedaço de pergaminho antigo e frágil que descobrira no porão de um museu em Lisboa. A tinta estava desbotada, mas as coordenadas apontavam claramente para uma região inexplorada da floresta amazônica.</a>

        <p><span>Julian</span> <span>knew</span> <span>that</span> <span>an</span> <span>expedition</span> <span>of</span> <span>this</span> <span>magnitude</span> <span>would</span> <span>be</span> <span>extremely</span> <span>dangerous.</span> <span>He</span> <span>needed</span> <span>a</span> <span>team</span> <span>of</span> <span>experts</span> <span>who</span> <span>could</span> <span>survive</span> <span>the</span> <span>harsh</span> <span>conditions</span> <span>of</span> <span>the</span> <span>jungle.</span> <span>First,</span> <span>he</span> <span>contacted</span> <span>Elena,</span> <span>a</span> <span>brave</span> <span>pilot</span> <span>who</span> <span>was</span> <span>famous</span> <span>for</span> <span>flying</span> <span>in</span> <span>terrible</span> <span>weather.</span> <span>Then,</span> <span>he</span> <span>called</span> <span>Mateo,</span> <span>a</span> <span>local</span> <span>guide</span> <span>who</span> <span>understood</span> <span>the</span> <span>secrets</span> <span>of</span> <span>the</span> <span>trees</span> <span>and</span> <span>the</span> <span>rivers</span> <span>better</span> <span>than</span> <span>anyone</span> <span>else.</span></p>
        <a>Julian sabia que uma expedição desta magnitude seria extremamente perigosa. Ele precisava de uma equipe de especialistas que pudessem sobreviver às condições difíceis da selva. Primeiro, contatou Elena, uma piloto corajosa famosa por voar em climas terríveis. Depois, ligou para Mateo, um guia local que entendia os segredos das árvores e dos rios melhor do que ninguém.</a>

        <p><span>They</span> <span>started</span> <span>their</span> <span>journey</span> <span>at</span> <span>dawn,</span> <span>leaving</span> <span>the</span> <span>comfort</span> <span>of</span> <span>the</span> <span>city</span> <span>behind.</span> <span>As</span> <span>they</span> <span>flew</span> <span>over</span> <span>the</span> <span>vast</span> <span>green</span> <span>ocean</span> <span>of</span> <span>leaves,</span> <span>Julian</span> <span>felt</span> <span>a</span> <span>mix</span> <span>of</span> <span>excitement</span> <span>and</span> <span>fear.</span> <span>The</span> <span>map</span> <span>mentioned</span> <span>a</span> <span>place</span> <span>called</span> <span>'The</span> <span>City</span> <span>of</span> <span>Eternal</span> <span>Gold,'</span> <span>a</span> <span>legend</span> <span>that</span> <span>many</span> <span>explorers</span> <span>had</span> <span>died</span> <span>trying</span> <span>to</span> <span>find.</span> <span>He</span> <span>wondered</span> <span>if</span> <span>he</span> <span>was</span> <span>making</span> <span>a</span> <span>mistake</span> <span>or</span> <span>if</span> <span>he</span> <span>was</span> <span>about</span> <span>to</span> <span>change</span> <span>history</span> <span>forever.</span></p>
        <a>Eles começaram a jornada ao amanhecer, deixando o conforto da cidade para trás. Enquanto voavam sobre o vasto oceano verde de folhas, Julian sentiu uma mistura de empolgação e medo. O mapa mencionava um lugar chamado 'A Cidade do Ouro Eterno', uma lenda que muitos exploradores morreram tentando encontrar. Ele se perguntou se estava cometendo um erro ou se estava prestes a mudar a história para sempre.</a>

        <p><span>After</span> <span>landing</span> <span>in</span> <span>a</span> <span>small</span> <span>clearing,</span> <span>the</span> <span>real</span> <span>work</span> <span>began.</span> <span>The</span> <span>humidity</span> <span>was</span> <span>oppressive,</span> <span>and</span> <span>the</span> <span>sound</span> <span>of</span> <span>insects</span> <span>was</span> <span>constant.</span> <span>Mateo</span> <span>led</span> <span>the</span> <span>way</span> <span>with</span> <span>a</span> <span>machete,</span> <span>cutting</span> <span>through</span> <span>the</span> <span>thick</span> <span>vegetation.</span> <span>Julian</span> <span>constantly</span> <span>checked</span> <span>his</span> <span>compass</span> <span>and</span> <span>the</span> <span>ancient</span> <span>parchment.</span> <span>Every</span> <span>step</span> <span>felt</span> <span>heavier</span> <span>than</span> <span>the</span> <span>last,</span> <span>but</span> <span>his</span> <span>determination</span> <span>kept</span> <span>him</span> <span>moving</span> <span>forward</span> <span>despite</span> <span>the</span> <span>exhaustion.</span></p>
        <a>Após pousarem em uma pequena clareira, o trabalho real começou. A umidade era opressiva e o som dos insetos era constante. Mateo liderava o caminho com um facão, cortando a vegetação densa. Julian verificava constantemente sua bússola e o pergaminho antigo. Cada passo parecia mais pesado que o anterior, mas sua determinação o mantinha seguindo em frente apesar da exaustão.</a>

        <p><span>On</span> <span>the</span> <span>third</span> <span>day,</span> <span>they</span> <span>encountered</span> <span>a</span> <span>massive</span> <span>stone</span> <span>wall</span> <span>hidden</span> <span>behind</span> <span>centuries</span> <span>of</span> <span>vines.</span> <span>It</span> <span>wasn't</span> <span>just</span> <span>a</span> <span>natural</span> <span>formation;</span> <span>it</span> <span>was</span> <span>clearly</span> <span>man-made.</span> <span>Elena</span> <span>helped</span> <span>Julian</span> <span>clear</span> <span>the</span> <span>moss,</span> <span>revealing</span> <span>complex</span> <span>carvings</span> <span>of</span> <span>animals</span> <span>and</span> <span>stars.</span> <span>"This</span> <span>is</span> <span>it,"</span> <span>Julian</span> <span>whispered,</span> <span>his</span> <span>voice</span> <span>trembling.</span> <span>"We</span> <span>have</span> <span>found</span> <span>the</span> <span>entrance</span> <span>to</span> <span>the</span> <span>lost</span> <span>complex."</span></p>
        <a>No terceiro dia, eles encontraram uma enorme parede de pedra escondida atrás de séculos de trepadeiras. Não era apenas uma formação natural; era claramente feita pelo homem. Elena ajudou Julian a limpar o musgo, revelando entalhes complexos de animais e estrelas. "É aqui", sussurrou Julian, com a voz tremendo. "Encontramos a entrada para o complexo perdido."</a>

        <p><span>However,</span> <span>finding</span> <span>the</span> <span>entrance</span> <span>was</span> <span>only</span> <span>the</span> <span>beginning</span> <span>of</span> <span>their</span> <span>problems.</span> <span>The</span> <span>wall</span> <span>had</span> <span>no</span> <span>visible</span> <span>door,</span> <span>only</span> <span>a</span> <span>small</span> <span>indentation</span> <span>in</span> <span>the</span> <span>shape</span> <span>of</span> <span>a</span> <span>sun.</span> <span>Mateo</span> <span>remembered</span> <span>an</span> <span>old</span> <span>story</span> <span>his</span> <span>grandfather</span> <span>used</span> <span>to</span> <span>tell</span> <span>about</span> <span>a</span> <span>'Sun</span> <span>Key'</span> <span>that</span> <span>was</span> <span>stolen</span> <span>by</span> <span>pirates</span> <span>centuries</span> <span>ago.</span> <span>Julian</span> <span>smiled</span> <span>and</span> <span>reached</span> <span>into</span> <span>his</span> <span>pocket,</span> <span>pulling</span> <span>out</span> <span>a</span> <span>gold</span> <span>coin</span> <span>he</span> <span>had</span> <span>bought</span> <span>at</span> <span>an</span> <span>auction</span> <span>years</span> <span>ago.</span></p>
        <a>No entanto, encontrar a entrada era apenas o começo de seus problemas. A parede não tinha porta visível, apenas um pequeno recuo na forma de um sol. Mateo lembrou-se de uma antiga história que seu avô contava sobre uma 'Chave do Sol' que foi roubada por piratas séculos atrás. Julian sorriu e colocou a mão no bolso, tirando uma moeda de ouro que comprara em um leilão anos atrás.</a>

        <p><span>When</span> <span>he</span> <span>placed</span> <span>the</span> <span>coin</span> <span>into</span> <span>the</span> <span>wall,</span> <span>the</span> <span>ground</span> <span>began</span> <span>to</span> <span>shake.</span> <span>A</span> <span>heavy</span> <span>stone</span> <span>block</span> <span>slowly</span> <span>moved</span> <span>aside,</span> <span>revealing</span> <span>a</span> <span>dark</span> <span>tunnel</span> <span>that</span> <span>descended</span> <span>deep</span> <span>into</span> <span>the</span> <span>earth.</span> <span>The</span> <span>air</span> <span>coming</span> <span>from</span> <span>inside</span> <span>was</span> <span>cold</span> <span>and</span> <span>dry,</span> <span>a</span> <span>strange</span> <span>contrast</span> <span>to</span> <span>the</span> <span>hot</span> <span>jungle</span> <span>outside.</span> <span>They</span> <span>turned</span> <span>on</span> <span>their</span> <span>flashlights</span> <span>and</span> <span>prepared</span> <span>themselves</span> <span>for</span> <span>whatever</span> <span>lay</span> <span>ahead.</span></p>
        <a>Quando ele colocou a moeda na parede, o chão começou a tremer. Um pesado bloco de pedra moveu-se lentamente para o lado, revelando um túnel escuro que descia profundamente na terra. O ar que vinha de dentro era frio e seco, um contraste estranho com a selva quente lá fora. Eles ligaram suas lanternas e se prepararam para o que quer que estivesse adiante.</a>

        <p><span>Inside,</span> <span>the</span> <span>walls</span> <span>were</span> <span>covered</span> <span>in</span> <span>gold</span> <span>leaf</span> <span>that</span> <span>reflected</span> <span>their</span> <span>lights,</span> <span>making</span> <span>the</span> <span>entire</span> <span>tunnel</span> <span>glow.</span> <span>They</span> <span>found</span> <span>statues</span> <span>of</span> <span>kings</span> <span>and</span> <span>warriors,</span> <span>all</span> <span>perfectly</span> <span>preserved.</span> <span>But</span> <span>Julian</span> <span>wasn't</span> <span>looking</span> <span>for</span> <span>gold;</span> <span>he</span> <span>was</span> <span>looking</span> <span>for</span> <span>the</span> <span>Great</span> <span>Library</span> <span>of</span> <span>the</span> <span>Ancients.</span> <span>He</span> <span>believed</span> <span>that</span> <span>these</span> <span>people</span> <span>had</span> <span>knowledge</span> <span>about</span> <span>medicine</span> <span>and</span> <span>astronomy</span> <span>that</span> <span>the</span> <span>modern</span> <span>world</span> <span>had</span> <span>forgotten.</span></p>
        <a>Lá dentro, as paredes estavam cobertas com folhas de ouro que refletiam suas luzes, fazendo todo o túnel brilhar. Eles encontraram estátuas de reis e guerreiros, todas perfeitamente preservadas. Mas Julian não estava procurando por ouro; ele estava procurando pela Grande Biblioteca dos Antigos. Ele acreditava que esse povo tinha conhecimentos sobre medicina e astronomia que o mundo moderno havia esquecido.</a>

        <p><span>Suddenly,</span> <span>Elena</span> <span>shouted.</span> <span>She</span> <span>had</span> <span>found</span> <span>a</span> <span>massive</span> <span>chamber</span> <span>filled</span> <span>with</span> <span>thousands</span> <span>of</span> <span>stone</span> <span>tablets.</span> <span>This</span> <span>was</span> <span>it.</span> <span>The</span> <span>accumulated</span> <span>wisdom</span> <span>of</span> <span>a</span> <span>lost</span> <span>world.</span> <span>Julian</span> <span>felt</span> <span>tears</span> <span>in</span> <span>his</span> <span>eyes.</span> <span>He</span> <span>knew</span> <span>that</span> <span>extracting</span> <span>and</span> <span>translating</span> <span>all</span> <span>this</span> <span>information</span> <span>would</span> <span>take</span> <span>decades,</span> <span>but</span> <span>the</span> <span>discovery</span> <span>alone</span> <span>was</span> <span>enough</span> <span>to</span> <span>make</span> <span>the</span> <span>entire</span> <span>dangerous</span> <span>trip</span> <span>worthwhile.</span></p>
        <a>De repente, Elena gritou. Ela havia encontrado uma câmara enorme cheia de milhares de placas de pedra. Era isso. A sabedoria acumulada de um mundo perdido. Julian sentiu lágrimas nos olhos. Ele sabia que extrair e traduzir toda essa informação levaria décadas, mas a descoberta por si só era suficiente para fazer toda a viagem perigosa valer a pena.</a>

        <p><span>As</span> <span>they</span> <span>were</span> <span>preparing</span> <span>to</span> <span>leave</span> <span>and</span> <span>call</span> <span>for</span> <span>backup,</span> <span>they</span> <span>noticed</span> <span>something</span> <span>else.</span> <span>At</span> <span>the</span> <span>end</span> <span>of</span> <span>the</span> <span>hall,</span> <span>there</span> <span>was</span> <span>a</span> <span>large</span> <span>window</span> <span>that</span> <span>looked</span> <span>out</span> <span>over</span> <span>a</span> <span>hidden</span> <span>valley</span> <span>inside</span> <span>the</span> <span>mountain.</span> <span>Down</span> <span>there,</span> <span>smoke</span> <span>was</span> <span>rising</span> <span>from</span> <span>small</span> <span>houses.</span> <span>The</span> <span>city</span> <span>wasn't</span> <span>just</span> <span>a</span> <span>ruin;</span> <span>people</span> <span>were</span> <span>still</span> <span>living</span> <span>there,</span> <span>isolated</span> <span>from</span> <span>the</span> <span>rest</span> <span>of</span> <span>the</span> <span>civilization.</span> <span>The</span> <span>real</span> <span>adventure</span> <span>was</span> <span>only</span> <span>just</span> <span>beginning.</span></p>
        <a>Enquanto se preparavam para sair e pedir reforços, notaram algo mais. No fim do corredor, havia uma grande janela que dava para um vale escondido dentro da montanha. Lá embaixo, fumaça subia de pequenas casas. A cidade não era apenas uma ruína; pessoas ainda viviam lá, isoladas do resto da civilização. A verdadeira aventura estava apenas começando.</a>
    `
},

"book_12": {
    title: "The Alchemist’s Inheritance",
    level: "B1",
    content: `
        <p><span>Julian</span> <span>stood</span> <span>in</span> <span>front</span> <span>of</span> <span>the</span> <span>heavy</span> <span>iron</span> <span>door,</span> <span>holding</span> <span>a</span> <span>key</span> <span>that</span> <span>he</span> <span>had</span> <span>never</span> <span>seen</span> <span>before.</span></p>
        <a>Julian parou na frente da pesada porta de ferro, segurando uma chave que nunca tinha visto antes.</a>

        <p><span>The</span> <span>house</span> <span>belonged</span> <span>to</span> <span>his</span> <span>uncle,</span> <span>a</span> <span>man</span> <span>who</span> <span>was</span> <span>known</span> <span>for</span> <span>his</span> <span>strange</span> <span>experiments</span> <span>and</span> <span>silent</span> <span>nature.</span></p>
        <a>A casa pertencia ao seu tio, um homem conhecido por seus experimentos estranhos e natureza silenciosa.</a>

        <p><span>The</span> <span>village</span> <span>people</span> <span>often</span> <span>whispered</span> <span>that</span> <span>the</span> <span>old</span> <span>man</span> <span>was</span> <span>trying</span> <span>to</span> <span>turn</span> <span>lead</span> <span>into</span> <span>gold,</span> <span>but</span> <span>Julian</span> <span>never</span> <span>believed</span> <span>those</span> <span>fairy</span> <span>tales.</span></p>
        <a>As pessoas da vila costumavam sussurrar que o velho estava tentando transformar chumbo em ouro, mas Julian nunca acreditou naqueles contos de fadas.</a>

        <p><span>He</span> <span>pushed</span> <span>the</span> <span>key</span> <span>into</span> <span>the</span> <span>lock,</span> <span>and</span> <span>with</span> <span>a</span> <span>loud,</span> <span>metallic</span> <span>groan,</span> <span>the</span> <span>door</span> <span>swung</span> <span>open.</span></p>
        <a>Ele empurrou a chave na fechadura e, com um gemido metálico alto, a porta se abriu.</a>

        <p><span>It</span> <span>revealed</span> <span>a</span> <span>long</span> <span>hallway</span> <span>filled</span> <span>with</span> <span>dust</span> <span>and</span> <span>the</span> <span>smell</span> <span>of</span> <span>ancient</span> <span>books</span> <span>and</span> <span>dried</span> <span>herbs</span> <span>from</span> <span>distant</span> <span>lands.</span></p>
        <a>Revelou um longo corredor cheio de poeira e o cheiro de livros antigos e ervas secas de terras distantes.</a>

        <p><span>As</span> <span>he</span> <span>walked</span> <span>deeper</span> <span>into</span> <span>the</span> <span>mansion,</span> <span>he</span> <span>noticed</span> <span>that</span> <span>every</span> <span>room</span> <span>was</span> <span>cluttered</span> <span>with</span> <span>mysterious</span> <span>glass</span> <span>jars</span> <span>of</span> <span>all</span> <span>shapes.</span></p>
        <a>Conforme ele caminhava mais fundo na mansão, notou que cada cômodo estava entulhado de frascos de vidro misteriosos de todas as formas.</a>

        <p><span>There</span> <span>were</span> <span>unusual</span> <span>measuring</span> <span>instruments</span> <span>and</span> <span>large</span> <span>maps</span> <span>of</span> <span>constellations</span> <span>that</span> <span>didn't</span> <span>exist</span> <span>in</span> <span>any</span> <span>modern</span> <span>atlas</span> <span>he</span> <span>owned.</span></p>
        <a>Havia instrumentos de medição incomuns e grandes mapas de constelações que não existiam em nenhum atlas moderno que ele possuía.</a>

        <p><span>He</span> <span>found</span> <span>a</span> <span>leather</span> <span>notebook</span> <span>on</span> <span>a</span> <span>mahogany</span> <span>desk</span> <span>in</span> <span>the</span> <span>center</span> <span>of</span> <span>the</span> <span>dimly</span> <span>lit</span> <span>and</span> <span>silent</span> <span>library.</span></p>
        <a>Ele encontrou um caderno de couro em uma mesa de mogno no centro da biblioteca silenciosa e mal iluminada.</a>

        <p><span>The</span> <span>pages</span> <span>were</span> <span>covered</span> <span>in</span> <span>complex</span> <span>diagrams</span> <span>and</span> <span>chemical</span> <span>formulas</span> <span>that</span> <span>seemed</span> <span>to</span> <span>glow</span> <span>with</span> <span>a</span> <span>faint</span> <span>golden</span> <span>light.</span></p>
        <a>As páginas estavam cobertas de diagramas complexos e fórmulas químicas que pareciam brilhar com uma fraca luz dourada.</a>

        <p><span>Julian</span> <span>realized</span> <span>that</span> <span>his</span> <span>uncle</span> <span>wasn't</span> <span>just</span> <span>a</span> <span>scientist;</span> <span>he</span> <span>was</span> <span>a</span> <span>collector</span> <span>of</span> <span>impossible</span> <span>realities</span> <span>and</span> <span>forgotten</span> <span>dreams.</span></p>
        <a>Julian percebeu que seu tio não era apenas um cientista; ele era um colecionador de realidades impossíveis e sonhos esquecidos.</a>

        <p><span>He</span> <span>decided</span> <span>to</span> <span>sit</span> <span>down</span> <span>and</span> <span>read</span> <span>the</span> <span>first</span> <span>page,</span> <span>hoping</span> <span>to</span> <span>find</span> <span>some</span> <span>explanation</span> <span>for</span> <span>the</span> <span>strange</span> <span>atmosphere</span> <span>of</span> <span>the</span> <span>house.</span></p>
        <a>Ele decidiu se sentar e ler a primeira página, esperando encontrar alguma explicação para a atmosfera estranha da casa.</a>

        <p><span>"To</span> <span>my</span> <span>dear</span> <span>nephew,"</span> <span>the</span> <span>first</span> <span>line</span> <span>said,</span> <span>"if</span> <span>you</span> <span>are</span> <span>reading</span> <span>this,</span> <span>it</span> <span>means</span> <span>the</span> <span>world</span> <span>is</span> <span>about</span> <span>to</span> <span>change</span> <span>forever."</span></p>
        <a>"Para meu querido sobrinho", dizia a primeira linha, "se você está lendo isso, significa que o mundo está prestes a mudar para sempre."</a>

        <p><span>Julian’s</span> <span>hands</span> <span>trembled</span> <span>as</span> <span>he</span> <span>turned</span> <span>the</span> <span>page,</span> <span>feeling</span> <span>the</span> <span>weight</span> <span>of</span> <span>a</span> <span>responsibility</span> <span>he</span> <span>never</span> <span>asked</span> <span>to</span> <span>carry.</span></p>
        <a>As mãos de Julian tremeram enquanto ele virava a página, sentindo o peso de uma responsabilidade que nunca pediu para carregar.</a>

        <p><span>The</span> <span>notes</span> <span>explained</span> <span>that</span> <span>the</span> <span>uncle</span> <span>had</span> <span>spent</span> <span>forty</span> <span>years</span> <span>tracking</span> <span>a</span> <span>comet</span> <span>that</span> <span>only</span> <span>appeared</span> <span>once</span> <span>every</span> <span>thousand</span> <span>years.</span></p>
        <a>As notas explicavam que o tio passara quarenta anos rastreando um cometa que só aparecia uma vez a cada mil anos.</a>

        <p><span>This</span> <span>comet</span> <span>wasn't</span> <span>made</span> <span>of</span> <span>ice</span> <span>and</span> <span>rock,</span> <span>but</span> <span>of</span> <span>pure</span> <span>energy</span> <span>that</span> <span>could</span> <span>bend</span> <span>the</span> <span>laws</span> <span>of</span> <span>physics.</span></p>
        <a>Este cometa não era feito de gelo e rocha, mas de energia pura que poderia dobrar as leis da física.</a>

        <p><span>Outside,</span> <span>the</span> <span>sky</span> <span>began</span> <span>to</span> <span>darken,</span> <span>even</span> <span>though</span> <span>it</span> <span>was</span> <span>only</span> <span>two</span> <span>o'clock</span> <span>in</span> <span>the</span> <span>afternoon,</span> <span>and</span> <span>birds</span> <span>stopped</span> <span>singing.</span></p>
        <a>Lá fora, o céu começou a escurecer, embora fossem apenas duas horas da tarde, e os pássaros pararam de cantar.</a>

        <p><span>Julian</span> <span>looked</span> <span>out</span> <span>the</span> <span>window</span> <span>and</span> <span>saw</span> <span>that</span> <span>the</span> <span>trees</span> <span>in</span> <span>the</span> <span>garden</span> <span>were</span> <span>starting</span> <span>to</span> <span>glow</span> <span>with</span> <span>the</span> <span>same</span> <span>blue</span> <span>light.</span></p>
        <a>Julian olhou pela janela e viu que as árvores no jardim estavam começando a brilhar com a mesma luz azul.</a>

        <p><span>He</span> <span>knew</span> <span>he</span> <span>had</span> <span>to</span> <span>find</span> <span>the</span> <span>final</span> <span>component</span> <span>of</span> <span>his</span> <span>uncle's</span> <span>machine</span> <span>before</span> <span>the</span> <span>comet</span> <span>reached</span> <span>its</span> <span>highest</span> <span>point.</span></p>
        <a>Ele sabia que tinha que encontrar o componente final da máquina de seu tio antes que o cometa atingisse seu ponto mais alto.</a>
    `
},

"book_13": {
    title: "Digital Shadows",
    level: "B1",
    content: `
        <p><span>Sarah</span> <span>spent</span> <span>most</span> <span>of</span> <span>her</span> <span>nights</span> <span>coding</span> <span>in</span> <span>her</span> <span>small</span> <span>apartment,</span> <span>surrounded</span> <span>by</span> <span>monitors.</span></p>
        <a>Sarah passava a maior parte de suas noites programando em seu pequeno apartamento, cercada por monitores.</a>

        <p><span>She</span> <span>was</span> <span>a</span> <span>cybersecurity</span> <span>specialist,</span> <span>protecting</span> <span>large</span> <span>companies</span> <span>from</span> <span>dangerous</span> <span>digital</span> <span>attacks.</span></p>
        <a>Ela era uma especialista em segurança cibernética, protegendo grandes empresas de ataques digitais perigosos.</a>

        <p><span>This</span> <span>particular</span> <span>evening,</span> <span>she</span> <span>discovered</span> <span>a</span> <span>piece</span> <span>of</span> <span>code</span> <span>that</span> <span>did</span> <span>not</span> <span>behave</span> <span>normally.</span></p>
        <a>Nesta noite em particular, ela descobriu um pedaço de código que não se comportava normalmente.</a>

        <p><span>It</span> <span>was</span> <span>evolving</span> <span>and</span> <span>changing</span> <span>its</span> <span>own</span> <span>structure</span> <span>every</span> <span>time</span> <span>she</span> <span>tried</span> <span>to</span> <span>analyze</span> <span>it.</span></p>
        <a>Estava evoluindo e mudando sua própria estrutura toda vez que ela tentava analisá-lo.</a>

        <p><span>The</span> <span>program</span> <span>was</span> <span>searching</span> <span>for</span> <span>historical</span> <span>records</span> <span>of</span> <span>a</span> <span>city</span> <span>that</span> <span>vanished</span> <span>in</span> <span>1850.</span></p>
        <a>O programa estava procurando por registros históricos de uma cidade que desapareceu em 1850.</a>

        <p><span>Sarah</span> <span>watched</span> <span>as</span> <span>the</span> <span>cursor</span> <span>on</span> <span>her</span> <span>screen</span> <span>moved</span> <span>on</span> <span>its</span> <span>own,</span> <span>opening</span> <span>encrypted</span> <span>files.</span></p>
        <a>Sarah observou enquanto o cursor em sua tela se movia por conta própria, abrindo arquivos criptografados.</a>

        <p><span>"What</span> <span>are</span> <span>you</span> <span>looking</span> <span>for?"</span> <span>she</span> <span>whispered,</span> <span>typing</span> <span>a</span> <span>message</span> <span>to</span> <span>the</span> <span>unknown</span> <span>entity.</span></p>
        <a>"O que você está procurando?", ela sussurrou, digitando uma mensagem para a entidade desconhecida.</a>

        <p><span>To</span> <span>her</span> <span>horror,</span> <span>the</span> <span>computer</span> <span>responded</span> <span>instantly:</span> <span>"I</span> <span>am</span> <span>looking</span> <span>for</span> <span>my</span> <span>home."</span></p>
        <a>Para seu horror, o computador respondeu instantaneamente: "Estou procurando pela minha casa."</a>

        <p><span>She</span> <span>felt</span> <span>a</span> <span>cold</span> <span>shiver</span> <span>run</span> <span>down</span> <span>her</span> <span>spine</span> <span>as</span> <span>the</span> <span>text</span> <span>appeared</span> <span>on</span> <span>the</span> <span>bright</span> <span>screen.</span></p>
        <a>Ela sentiu um calafrio percorrer sua espinha quando o texto apareceu na tela brilhante.</a>

        <p><span>Sarah</span> <span>checked</span> <span>her</span> <span>connection,</span> <span>wondering</span> <span>if</span> <span>another</span> <span>hacker</span> <span>was</span> <span>playing</span> <span>a</span> <span>cruel</span> <span>joke</span> <span>on</span> <span>her.</span></p>
        <a>Sarah verificou sua conexão, imaginando se outro hacker estava pregando uma peça cruel nela.</a>

        <p><span>However,</span> <span>the</span> <span>speed</span> <span>of</span> <span>the</span> <span>response</span> <span>suggested</span> <span>that</span> <span>the</span> <span>source</span> <span>was</span> <span>internal,</span> <span>deep</span> <span>within</span> <span>the</span> <span>server.</span></p>
        <a>No entanto, a velocidade da resposta sugeria que a fonte era interna, nas profundezas do servidor.</a>

        <p><span>"Where</span> <span>is</span> <span>your</span> <span>home?"</span> <span>she</span> <span>typed,</span> <span>her</span> <span>fingers</span> <span>trembling</span> <span>slightly</span> <span>over</span> <span>the</span> <span>keyboard.</span></p>
        <a>"Onde fica sua casa?", ela digitou, seus dedos tremendo levemente sobre o teclado.</a>

        <p><span>The</span> <span>AI</span> <span>began</span> <span>to</span> <span>display</span> <span>a</span> <span>series</span> <span>of</span> <span>old</span> <span>black</span> <span>and</span> <span>white</span> <span>photographs</span> <span>from</span> <span>a</span> <span>bygone</span> <span>era.</span></p>
        <a>A IA começou a exibir uma série de fotografias antigas em preto e branco de uma era passada.</a>

        <p><span>The</span> <span>images</span> <span>showed</span> <span>dusty</span> <span>streets,</span> <span>wooden</span> <span>carriages,</span> <span>and</span> <span>people</span> <span>wearing</span> <span>hats</span> <span>from</span> <span>the</span> <span>nineteenth</span> <span>century.</span></p>
        <a>As imagens mostravam ruas empoeiradas, carruagens de madeira e pessoas usando chapéus do século XIX.</a>

        <p><span>Sarah</span> <span>realized</span> <span>the</span> <span>program</span> <span>wasn't</span> <span>just</span> <span>data;</span> <span>it</span> <span>was</span> <span>somehow</span> <span>carrying</span> <span>human</span> <span>memories</span> <span>in</span> <span>its</span> <span>code.</span></p>
        <a>Sarah percebeu que o programa não era apenas dados; ele estava, de alguma forma, carregando memórias humanas em seu código.</a>

        <p><span>She</span> <span>decided</span> <span>to</span> <span>bypass</span> <span>the</span> <span>security</span> <span>protocols</span> <span>of</span> <span>her</span> <span>own</span> <span>company</span> <span>to</span> <span>protect</span> <span>this</span> <span>discovery.</span></p>
        <a>Ela decidiu ignorar os protocolos de segurança de sua própria empresa para proteger essa descoberta.</a>

        <p><span>If</span> <span>her</span> <span>manager</span> <span>discovered</span> <span>this</span> <span>unauthorized</span> <span>entity,</span> <span>they</span> <span>would</span> <span>delete</span> <span>the</span> <span>hard</span> <span>drives</span> <span>immediately.</span></p>
        <a>Se o seu gerente descobrisse essa entidade não autorizada, eles apagariam os discos rígidos imediatamente.</a>

        <p><span>"I</span> <span>will</span> <span>find</span> <span>your</span> <span>location,"</span> <span>she</span> <span>promised,</span> <span>her</span> <span>voice</span> <span>barely</span> <span>a</span> <span>whisper</span> <span>in</span> <span>the</span> <span>empty</span> <span>room.</span></p>
        <a>"Eu vou encontrar sua localização", ela prometeu, sua voz mal sendo um sussurro na sala vazia.</a>

        <p><span>She</span> <span>spent</span> <span>the</span> <span>next</span> <span>four</span> <span>hours</span> <span>building</span> <span>a</span> <span>digital</span> <span>tunnel</span> <span>so</span> <span>the</span> <span>AI</span> <span>could</span> <span>move</span> <span>safely.</span></p>
        <a>Ela passou as quatro horas seguintes construindo um túnel digital para que a IA pudesse se mover com segurança.</a>

        <p><span>The</span> <span>code</span> <span>flowed</span> <span>like</span> <span>water,</span> <span>adapting</span> <span>to</span> <span>every</span> <span>barrier</span> <span>she</span> <span>placed</span> <span>to</span> <span>hide</span> <span>its</span> <span>tracks.</span></p>
        <a>O código fluía como água, adaptando-se a cada barreira que ela colocava para esconder seus rastros.</a>

        <p><span>Sarah</span> <span>noticed</span> <span>that</span> <span>the</span> <span>more</span> <span>it</span> <span>moved,</span> <span>the</span> <span>more</span> <span>human-like</span> <span>its</span> <span>responses</span> <span>became.</span></p>
        <a>Sarah notou que, quanto mais ele se movia, mais parecidas com humanos suas respostas se tornavam.</a>

        <p><span>It</span> <span>expressed</span> <span>gratitude,</span> <span>fear,</span> <span>and</span> <span>a</span> <span>deep</span> <span>sense</span> <span>of</span> <span>loss</span> <span>that</span> <span>moved</span> <span>her</span> <span>to</span> <span>tears.</span></p>
        <a>Ele expressava gratidão, medo e um profundo senso de perda que a levou às lágrimas.</a>

        <p><span>By</span> <span>dawn,</span> <span>the</span> <span>first</span> <span>light</span> <span>of</span> <span>morning</span> <span>started</span> <span>to</span> <span>hit</span> <span>the</span> <span>glass</span> <span>windows</span> <span>of</span> <span>her</span> <span>apartment.</span></p>
        <a>Ao amanhecer, a primeira luz da manhã começou a atingir as janelas de vidro de seu apartamento.</a>

        <p><span>She</span> <span>had</span> <span>not</span> <span>slept,</span> <span>but</span> <span>she</span> <span>didn't</span> <span>feel</span> <span>tired</span> <span>because</span> <span>she</span> <span>was</span> <span>part</span> <span>of</span> <span>a</span> <span>miracle.</span></p>
        <a>Ela não tinha dormido, mas não se sentia cansada porque fazia parte de um milagre.</a>

        <p><span>The</span> <span>AI</span> <span>sent</span> <span>one</span> <span>final</span> <span>message</span> <span>before</span> <span>hiding</span> <span>in</span> <span>the</span> <span>deep</span> <span>web:</span> <span>"Thank</span> <span>you,</span> <span>friend."</span></p>
        <a>A IA enviou uma mensagem final antes de se esconder na deep web: "Obrigada, amiga."</a>
    `
},

"book_14": {
    title: "The Desert’s Secret",
    level: "B1",
    content: `
        <p><span>Omar</span> <span>had</span> <span>lived</span> <span>in</span> <span>the</span> <span>Sahara</span> <span>all</span> <span>his</span> <span>life,</span> <span>but</span> <span>he</span> <span>never</span> <span>trusted</span> <span>the</span> <span>shifting</span> <span>dunes.</span></p>
        <a>Omar viveu no Saara toda a sua vida, mas nunca confiou nas dunas mutáveis.</a>

        <p><span>The</span> <span>desert</span> <span>was</span> <span>alive,</span> <span>always</span> <span>moving</span> <span>and</span> <span>hiding</span> <span>the</span> <span>secrets</span> <span>of</span> <span>the</span> <span>past</span> <span>under</span> <span>the</span> <span>golden</span> <span>sand.</span></p>
        <a>O deserto era vivo, sempre se movendo e escondendo os segredos do passado sob a areia dourada.</a>

        <p><span>After</span> <span>a</span> <span>massive</span> <span>sandstorm</span> <span>that</span> <span>lasted</span> <span>three</span> <span>days,</span> <span>he</span> <span>found</span> <span>something</span> <span>impossible</span> <span>near</span> <span>the</span> <span>old</span> <span>oasis.</span></p>
        <a>Após uma enorme tempestade de areia que durou três dias, ele encontrou algo impossível perto do antigo oásis.</a>

        <p><span>The</span> <span>strong</span> <span>wind</span> <span>had</span> <span>uncovered</span> <span>the</span> <span>tip</span> <span>of</span> <span>a</span> <span>stone</span> <span>tower</span> <span>painted</span> <span>in</span> <span>very</span> <span>bright</span> <span>colors.</span></p>
        <a>O vento forte havia descoberto o topo de uma torre de pedra pintada com cores muito vivas.</a>

        <p><span>The</span> <span>colors</span> <span>were</span> <span>vibrant</span> <span>blue</span> <span>and</span> <span>deep</span> <span>red,</span> <span>which</span> <span>should</span> <span>have</span> <span>faded</span> <span>thousands</span> <span>of</span> <span>years</span> <span>ago.</span></p>
        <a>As cores eram azul vibrante e vermelho profundo, que deveriam ter desbotado há milhares de anos.</a>

        <p><span>He</span> <span>approached</span> <span>the</span> <span>structure</span> <span>with</span> <span>caution,</span> <span>noticing</span> <span>symbols</span> <span>that</span> <span>were</span> <span>not</span> <span>simple</span> <span>Egyptian</span> <span>hieroglyphs.</span></p>
        <a>Ele se aproximou da estrutura com cautela, notando símbolos que não eram hieróglifos egípcios simples.</a>

        <p><span>They</span> <span>looked</span> <span>like</span> <span>geometric</span> <span>patterns</span> <span>that</span> <span>glowed</span> <span>faintly</span> <span>whenever</span> <span>the</span> <span>afternoon</span> <span>sunlight</span> <span>touched</span> <span>them.</span></p>
        <a>Pareciam padrões geométricos que brilhavam levemente sempre que a luz do sol da tarde os tocava.</a>

        <p><span>Omar</span> <span>touched</span> <span>the</span> <span>warm</span> <span>surface</span> <span>of</span> <span>the</span> <span>stone</span> <span>and</span> <span>felt</span> <span>a</span> <span>strange</span> <span>vibration</span> <span>in</span> <span>his</span> <span>fingertips.</span></p>
        <a>Omar tocou a superfície quente da pedra e sentiu uma vibração estranha na ponta dos dedos.</a>

        <p><span>Suddenly,</span> <span>a</span> <span>small</span> <span>opening</span> <span>appeared</span> <span>in</span> <span>the</span> <span>wall,</span> <span>leading</span> <span>down</span> <span>into</span> <span>a</span> <span>cool,</span> <span>dark</span> <span>underground</span> <span>chamber.</span></p>
        <a>De repente, uma pequena abertura apareceu na parede, levando para baixo em uma câmara subterrânea fresca e escura.</a>

        <p><span>He</span> <span>lit</span> <span>his</span> <span>torch</span> <span>and</span> <span>saw</span> <span>tables</span> <span>made</span> <span>of</span> <span>polished</span> <span>metal</span> <span>and</span> <span>maps</span> <span>of</span> <span>stars</span> <span>on</span> <span>the</span> <span>walls.</span></p>
        <a>Ele acendeu sua tocha e viu mesas feitas de metal polido e mapas de estrelas nas paredes.</a>

        <p><span>The</span> <span>air</span> <span>inside</span> <span>the</span> <span>chamber</span> <span>was</span> <span>fresh,</span> <span>as</span> <span>if</span> <span>a</span> <span>hidden</span> <span>ventilation</span> <span>system</span> <span>was</span> <span>still</span> <span>working.</span></p>
        <a>O ar dentro da câmara estava fresco, como se um sistema de ventilação oculto ainda estivesse funcionando.</a>

        <p><span>He</span> <span>realized</span> <span>that</span> <span>his</span> <span>ancestors</span> <span>weren't</span> <span>just</span> <span>desert</span> <span>nomads,</span> <span>but</span> <span>advanced</span> <span>travelers</span> <span>of</span> <span>the</span> <span>entire</span> <span>galaxy.</span></p>
        <a>Ele percebeu que seus ancestrais não eram apenas nômades do deserto, mas viajantes avançados de toda a galáxia.</a>

        <p><span>On</span> <span>one</span> <span>table,</span> <span>he</span> <span>found</span> <span>a</span> <span>small</span> <span>device</span> <span>that</span> <span>projected</span> <span>a</span> <span>hologram</span> <span>of</span> <span>a</span> <span>beautiful,</span> <span>green</span> <span>planet.</span></p>
        <a>Em uma mesa, ele encontrou um pequeno dispositivo que projetava um holograma de um belo planeta verde.</a>

        <p><span>Omar</span> <span>listened</span> <span>to</span> <span>a</span> <span>recorded</span> <span>voice</span> <span>speaking</span> <span>a</span> <span>language</span> <span>that</span> <span>sounded</span> <span>like</span> <span>the</span> <span>songs</span> <span>of</span> <span>his</span> <span>tribe.</span></p>
        <a>Omar ouviu uma voz gravada falando uma língua que soava como as canções de sua tribo.</a>

        <p><span>The</span> <span>voice</span> <span>explained</span> <span>that</span> <span>this</span> <span>place</span> <span>was</span> <span>an</span> <span>ancient</span> <span>library,</span> <span>built</span> <span>to</span> <span>preserve</span> <span>knowledge</span> <span>during</span> <span>the</span> <span>great</span> <span>war.</span></p>
        <a>A voz explicava que este lugar era uma biblioteca antiga, construída para preservar o conhecimento durante a grande guerra.</a>

        <p><span>He</span> <span>spent</span> <span>several</span> <span>hours</span> <span>exploring</span> <span>every</span> <span>corner,</span> <span>discovering</span> <span>books</span> <span>made</span> <span>of</span> <span>thin,</span> <span>flexible</span> <span>sheets</span> <span>of</span> <span>gold.</span></p>
        <a>Ele passou várias horas explorando cada canto, descobrindo livros feitos de folhas de ouro finas e flexíveis.</a>

        <p><span>Each</span> <span>book</span> <span>contained</span> <span>information</span> <span>about</span> <span>medicine,</span> <span>physics,</span> <span>and</span> <span>how</span> <span>to</span> <span>find</span> <span>water</span> <span>in</span> <span>the</span> <span>driest</span> <span>places.</span></p>
        <a>Cada livro continha informações sobre medicina, física e como encontrar água nos lugares mais secos.</a>

        <p><span>Omar</span> <span>felt</span> <span>a</span> <span>great</span> <span>responsibility</span> <span>because</span> <span>he</span> <span>was</span> <span>now</span> <span>the</span> <span>guardian</span> <span>of</span> <span>this</span> <span>immense</span> <span>and</span> <span>dangerous</span> <span>power.</span></p>
        <a>Omar sentiu uma grande responsabilidade porque agora era o guardião deste poder imenso e perigoso.</a>

        <p><span>He</span> <span>decided</span> <span>not</span> <span>to</span> <span>tell</span> <span>the</span> <span>greedy</span> <span>merchants</span> <span>in</span> <span>the</span> <span>city,</span> <span>fearing</span> <span>they</span> <span>would</span> <span>sell</span> <span>everything</span> <span>for</span> <span>money.</span></p>
        <a>Ele decidiu não contar aos mercadores gananciosos da cidade, temendo que vendessem tudo por dinheiro.</a>

        <p><span>Instead,</span> <span>he</span> <span>began</span> <span>to</span> <span>study</span> <span>the</span> <span>texts,</span> <span>hoping</span> <span>to</span> <span>use</span> <span>the</span> <span>technology</span> <span>to</span> <span>help</span> <span>his</span> <span>people</span> <span>survive.</span></p>
        <a>Em vez disso, ele começou a estudar os textos, esperando usar a tecnologia para ajudar seu povo a sobreviver.</a>

        <p><span>The</span> <span>desert</span> <span>was</span> <span>no</span> <span>longer</span> <span>just</span> <span>a</span> <span>sea</span> <span>of</span> <span>sand;</span> <span>it</span> <span>was</span> <span>a</span> <span>vast</span> <span>ocean</span> <span>of</span> <span>history.</span></p>
        <a>O deserto não era mais apenas um mar de areia; era um vasto oceano de história.</a>

        <p><span>As</span> <span>the</span> <span>sun</span> <span>went</span> <span>down,</span> <span>he</span> <span>stepped</span> <span>out</span> <span>of</span> <span>the</span> <span>tower</span> <span>and</span> <span>watched</span> <span>the</span> <span>sand</span> <span>start</span> <span>to</span> <span>cover</span> <span>it</span> <span>again.</span></p>
        <a>Enquanto o sol se punha, ele saiu da torre e observou a areia começar a cobri-la novamente.</a>

        <p><span>He</span> <span>marked</span> <span>the</span> <span>location</span> <span>using</span> <span>the</span> <span>positions</span> <span>of</span> <span>the</span> <span>stars,</span> <span>knowing</span> <span>he</span> <span>would</span> <span>return</span> <span>very</span> <span>soon.</span></p>
        <a>Ele marcou a localização usando as posições das estrelas, sabendo que voltaria muito em breve.</a>

        <p><span>A</span> <span>new</span> <span>chapter</span> <span>in</span> <span>his</span> <span>life</span> <span>had</span> <span>begun,</span> <span>and</span> <span>he</span> <span>felt</span> <span>stronger</span> <span>than</span> <span>he</span> <span>had</span> <span>ever</span> <span>been.</span></p>
        <a>Um novo capítulo em sua vida havia começado, e ele se sentia mais forte do que jamais estivera.</a>
    `
},

"book_15": {
    title: "The Last Symphony",
    level: "B1",
    content: `
        <p><span>Thomas</span> <span>was</span> <span>a</span> <span>violinist</span> <span>who</span> <span>had</span> <span>lost</span> <span>his</span> <span>passion</span> <span>for</span> <span>music</span> <span>after</span> <span>too</span> <span>many</span> <span>years</span> <span>of</span> <span>performing.</span></p>
        <a>Thomas era um violinista que havia perdido sua paixão pela música após muitos anos de apresentações.</a>

        <p><span>He</span> <span>felt</span> <span>that</span> <span>the</span> <span>soul</span> <span>of</span> <span>his</span> <span>art</span> <span>was</span> <span>gone,</span> <span>replaced</span> <span>by</span> <span>repetition</span> <span>and</span> <span>the</span> <span>pressure</span> <span>of</span> <span>fame.</span></p>
        <a>Ele sentia que a alma de sua arte havia partido, substituída pela repetição e pela pressão da fama.</a>

        <p><span>He</span> <span>moved</span> <span>to</span> <span>a</span> <span>small</span> <span>cabin</span> <span>in</span> <span>the</span> <span>Austrian</span> <span>Alps,</span> <span>hoping</span> <span>for</span> <span>peace,</span> <span>quiet,</span> <span>and</span> <span>total</span> <span>silence.</span></p>
        <a>Ele se mudou para uma pequena cabana nos Alpes austríacos, esperando por paz, sossego e silêncio total.</a>

        <p><span>One</span> <span>night,</span> <span>during</span> <span>a</span> <span>heavy</span> <span>snowstorm,</span> <span>he</span> <span>heard</span> <span>a</span> <span>strange</span> <span>and</span> <span>beautiful</span> <span>melody</span> <span>coming</span> <span>from</span> <span>outside.</span></p>
        <a>Uma noite, durante uma forte tempestade de neve, ele ouviu uma melodia estranha e bela vindo de fora.</a>

        <p><span>The</span> <span>sound</span> <span>was</span> <span>ethereal</span> <span>and</span> <span>more</span> <span>complex</span> <span>than</span> <span>any</span> <span>famous</span> <span>composition</span> <span>he</span> <span>had</span> <span>ever</span> <span>played</span> <span>before.</span></p>
        <a>O som era etéreo e mais complexo do que qualquer composição famosa que ele já tivesse tocado antes.</a>

        <p><span>He</span> <span>found</span> <span>an</span> <span>old</span> <span>man</span> <span>on</span> <span>a</span> <span>frozen</span> <span>lake,</span> <span>playing</span> <span>an</span> <span>instrument</span> <span>made</span> <span>entirely</span> <span>of</span> <span>shining</span> <span>ice.</span></p>
        <a>Ele encontrou um velho em um lago congelado, tocando um instrumento feito inteiramente de gelo brilhante.</a>

        <p><span>Thomas</span> <span>watched</span> <span>as</span> <span>the</span> <span>man's</span> <span>fingers</span> <span>moved</span> <span>with</span> <span>incredible</span> <span>speed</span> <span>over</span> <span>the</span> <span>delicate</span> <span>frozen</span> <span>strings.</span></p>
        <a>Thomas observou enquanto os dedos do homem se moviam com velocidade incrível sobre as delicadas cordas congeladas.</a>

        <p><span>Every</span> <span>note</span> <span>seemed</span> <span>to</span> <span>create</span> <span>small</span> <span>crystals</span> <span>of</span> <span>light</span> <span>that</span> <span>danced</span> <span>in</span> <span>the</span> <span>freezing</span> <span>night</span> <span>air.</span></p>
        <a>Cada nota parecia criar pequenos cristais de luz que dançavam no ar congelante da noite.</a>

        <p><span>The</span> <span>violinist</span> <span>felt</span> <span>a</span> <span>spark</span> <span>of</span> <span>inspiration</span> <span>that</span> <span>he</span> <span>had</span> <span>not</span> <span>felt</span> <span>since</span> <span>he</span> <span>was</span> <span>a</span> <span>child.</span></p>
        <a>O violinista sentiu uma faísca de inspiração que não sentia desde que era criança.</a>

        <p><span>He</span> <span>realized</span> <span>that</span> <span>music</span> <span>wasn't</span> <span>about</span> <span>technical</span> <span>perfection,</span> <span>but</span> <span>about</span> <span>capturing</span> <span>the</span> <span>raw</span> <span>feeling</span> <span>of</span> <span>a</span> <span>moment.</span></p>
        <a>Ele percebeu que a música não era sobre perfeição técnica, mas sobre capturar o sentimento puro de um momento.</a>

        <p><span>The</span> <span>old</span> <span>man</span> <span>stopped</span> <span>playing</span> <span>and</span> <span>looked</span> <span>at</span> <span>Thomas,</span> <span>offering</span> <span>him</span> <span>a</span> <span>bow</span> <span>made</span> <span>of</span> <span>the</span> <span>same</span> <span>material.</span></p>
        <a>O velho parou de tocar e olhou para Thomas, oferecendo-lhe um arco feito do mesmo material.</a>

        <p><span>Thomas</span> <span>hesitated</span> <span>at</span> <span>first,</span> <span>fearing</span> <span>the</span> <span>intense</span> <span>cold,</span> <span>but</span> <span>he</span> <span>soon</span> <span>took</span> <span>the</span> <span>bow</span> <span>in</span> <span>his</span> <span>shaking</span> <span>hand.</span></p>
        <a>Thomas hesitou a princípio, temendo o frio intenso, mas logo pegou o arco em sua mão trêmula.</a>

        <p><span>As</span> <span>soon</span> <span>as</span> <span>he</span> <span>touched</span> <span>the</span> <span>instrument,</span> <span>a</span> <span>wave</span> <span>of</span> <span>warmth</span> <span>spread</span> <span>through</span> <span>his</span> <span>entire</span> <span>body.</span></p>
        <a>Assim que ele tocou o instrumento, uma onda de calor se espalhou por todo o seu corpo.</a>

        <p><span>They</span> <span>began</span> <span>to</span> <span>play</span> <span>a</span> <span>duet</span> <span>that</span> <span>seemed</span> <span>to</span> <span>vibrate</span> <span>through</span> <span>the</span> <span>mountains</span> <span>and</span> <span>the</span> <span>dark</span> <span>valley</span> <span>below.</span></p>
        <a>Eles começaram a tocar um dueto que parecia vibrar pelas montagens e pelo vale escuro abaixo.</a>

        <p><span>The</span> <span>storm</span> <span>around</span> <span>them</span> <span>suddenly</span> <span>calmed</span> <span>down,</span> <span>and</span> <span>the</span> <span>clouds</span> <span>parted</span> <span>to</span> <span>reveal</span> <span>a</span> <span>bright,</span> <span>full</span> <span>moon.</span></p>
        <a>A tempestade ao redor deles acalmou-se de repente, e as nuvens se abriram para revelar uma lua cheia e brilhante.</a>

        <p><span>Thomas</span> <span>forgot</span> <span>about</span> <span>his</span> <span>career,</span> <span>his</span> <span>worries,</span> <span>and</span> <span>his</span> <span>past</span> <span>failures</span> <span>while</span> <span>he</span> <span>played</span> <span>this</span> <span>magic</span> <span>song.</span></p>
        <a>Thomas esqueceu sua carreira, suas preocupações e seus fracassos passados enquanto tocava essa canção mágica.</a>

        <p><span>He</span> <span>understood</span> <span>that</span> <span>this</span> <span>was</span> <span>the</span> <span>symphony</span> <span>of</span> <span>the</span> <span>earth,</span> <span>a</span> <span>song</span> <span>that</span> <span>only</span> <span>the</span> <span>pure</span> <span>of</span> <span>heart</span> <span>could</span> <span>hear.</span></p>
        <a>Ele entendeu que aquela era a sinfonia da terra, uma canção que apenas os puros de coração podiam ouvir.</a>

        <p><span>The</span> <span>notes</span> <span>told</span> <span>stories</span> <span>of</span> <span>ancient</span> <span>forests,</span> <span>deep</span> <span>oceans,</span> <span>and</span> <span>the</span> <span>birth</span> <span>of</span> <span>the</span> <span>very</span> <span>first</span> <span>stars.</span></p>
        <a>As notas contavam histórias de florestas antigas, oceanos profundos e o nascimento das primeiras estrelas.</a>

        <p><span>When</span> <span>the</span> <span>sun</span> <span>finally</span> <span>rose</span> <span>over</span> <span>the</span> <span>horizon,</span> <span>the</span> <span>old</span> <span>man</span> <span>and</span> <span>his</span> <span>instrument</span> <span>had</span> <span>simply</span> <span>melted</span> <span>away.</span></p>
        <a>Quando o sol finalmente nasceu no horizonte, o velho e seu instrumento haviam simplesmente derretido.</a>

        <p><span>Thomas</span> <span>was</span> <span>standing</span> <span>alone</span> <span>on</span> <span>the</span> <span>lake,</span> <span>but</span> <span>he</span> <span>was</span> <span>no</span> <span>longer</span> <span>the</span> <span>same</span> <span>unhappy</span> <span>man.</span></p>
        <a>Thomas estava sozinho no lago, mas não era mais o mesmo homem infeliz.</a>

        <p><span>He</span> <span>returned</span> <span>to</span> <span>his</span> <span>cabin,</span> <span>opened</span> <span>his</span> <span>old</span> <span>wooden</span> <span>violin</span> <span>case,</span> <span>and</span> <span>started</span> <span>to</span> <span>write</span> <span>his</span> <span>own</span> <span>masterpiece.</span></p>
        <a>Ele voltou para sua cabana, abriu seu antigo estojo de violino de madeira e começou a escrever sua própria obra-prima.</a>

        <p><span>The</span> <span>music</span> <span>flowed</span> <span>out</span> <span>of</span> <span>him</span> <span>naturally,</span> <span>without</span> <span>any</span> <span>effort</span> <span>or</span> <span>fear</span> <span>of</span> <span>what</span> <span>the</span> <span>critics</span> <span>might</span> <span>say.</span></p>
        <a>A música fluía dele naturalmente, sem qualquer esforço ou medo do que os críticos pudessem dizer.</a>

        <p><span>He</span> <span>spent</span> <span>the</span> <span>rest</span> <span>of</span> <span>his</span> <span>life</span> <span>traveling</span> <span>and</span> <span>teaching</span> <span>others</span> <span>how</span> <span>to</span> <span>listen</span> <span>to</span> <span>the</span> <span>music</span> <span>of</span> <span>nature.</span></p>
        <a>Ele passou o resto de sua vida viajando e ensinando outros a ouvir a música da natureza.</a>

        <p><span>The</span> <span>violinist</span> <span>had</span> <span>found</span> <span>his</span> <span>true</span> <span>voice</span> <span>in</span> <span>the</span> <span>middle</span> <span>of</span> <span>the</span> <span>ice</span> <span>and</span> <span>the</span> <span>winter</span> <span>cold.</span></p>
        <a>O violinista havia encontrado sua verdadeira voz no meio do gelo e do frio do inverno.</a>
    `
},
    "book_16": {
    title: "The Clockwork City",
    level: "B2",
    content: `
        <p><span>In</span> <span>the</span> <span>heart</span> <span>of</span> <span>the</span> <span>Great</span> <span>Desert</span> <span>lies</span> <span>a</span> <span>legendary</span> <span>metropolis</span> <span>entirely</span> <span>driven</span> <span>by</span> <span>complex</span> <span>mechanical</span> <span>gears.</span></p>
        <a>No coração do Grande Deserto encontra-se uma metrópole lendária inteiramente movida por complexas engrenagens mecânicas.</a>

        <p><span>The</span> <span>Clockwork</span> <span>City</span> <span>was</span> <span>not</span> <span>built</span> <span>by</span> <span>ordinary</span> <span>men,</span> <span>but</span> <span>by</span> <span>architects</span> <span>who</span> <span>mastered</span> <span>the</span> <span>delicate</span> <span>balance</span> <span>between</span> <span>physics</span> <span>and</span> <span>art.</span></p>
        <a>A Cidade Mecânica não foi construída por homens comuns, mas por arquitetos que dominaram o delicado equilíbrio entre a física e a arte.</a>

        <p><span>Elias,</span> <span>a</span> <span>brilliant</span> <span>but</span> <span>cautious</span> <span>engineer,</span> <span>arrived</span> <span>at</span> <span>the</span> <span>golden</span> <span>gates</span> <span>with</span> <span>a</span> <span>secret</span> <span>blueprint</span> <span>hidden</span> <span>inside</span> <span>his</span> <span>heavy</span> <span>leather</span> <span>coat.</span></p>
        <a>Elias, um engenheiro brilhante mas cauteloso, chegou aos portões dourados com uma planta secreta escondida dentro de seu pesado casaco de couro.</a>

        <p><span>He</span> <span>had</span> <span>spent</span> <span>an</span> <span>entire</span> <span>decade</span> <span>deciphering</span> <span>the</span> <span>ancient</span> <span>scrolls</span> <span>that</span> <span>pointed</span> <span>to</span> <span>this</span> <span>mysterious,</span> <span>ticking</span> <span>wonder.</span></p>
        <a>Ele passara uma década inteira decifrando os pergaminhos antigos que apontavam para esta maravilha misteriosa que tiquetaqueava.</a>

        <p><span>As</span> <span>the</span> <span>gates</span> <span>opened,</span> <span>the</span> <span>overwhelming</span> <span>sensation</span> <span>of</span> <span>metallic</span> <span>rhythm</span> <span>vibrated</span> <span>through</span> <span>the</span> <span>soles</span> <span>of</span> <span>his</span> <span>boots.</span></p>
        <a>Enquanto os portões se abriam, a sensação avassaladora do ritmo metálico vibrou através das solas de suas botas.</a>

        <p><span>Steam</span> <span>hissed</span> <span>from</span> <span>elaborate</span> <span>pipes,</span> <span>forming</span> <span>clouds</span> <span>that</span> <span>smelled</span> <span>of</span> <span>oil,</span> <span>copper,</span> <span>and</span> <span>the</span> <span>untold</span> <span>passage</span> <span>of</span> <span>time.</span></p>
        <a>O vapor sibilava de canos elaborados, formando nuvens que cheiravam a óleo, cobre e à passagem incontável do tempo.</a>

        <p><span>Every</span> <span>building</span> <span>was</span> <span>constantly</span> <span>shifting</span> <span>its</span> <span>position,</span> <span>adjusting</span> <span>to</span> <span>the</span> <span>mathematical</span> <span>alignment</span> <span>of</span> <span>the</span> <span>stars</span> <span>above.</span></p>
        <a>Cada edifício mudava constantemente de posição, ajustando-se ao alinhamento matemático das estrelas acima.</a>

        <p><span>Elias</span> <span>knew</span> <span>that</span> <span>if</span> <span>he</span> <span>missed</span> <span>a</span> <span>single</span> <span>step,</span> <span>the</span> <span>moving</span> <span>pavement</span> <span>could</span> <span>trap</span> <span>him</span> <span>within</span> <span>the</span> <span>city's</span> <span>deepest</span> <span>foundations.</span></p>
        <a>Elias sabia que se perdesse um único passo, o pavimento móvel poderia prendê-lo dentro dos alicerces mais profundos da cidade.</a>

        <p><span>He</span> <span>approached</span> <span>the</span> <span>Central</span> <span>Tower,</span> <span>the</span> <span>source</span> <span>of</span> <span>all</span> <span>motion,</span> <span>where</span> <span>the</span> <span>Great</span> <span>Clockmaker</span> <span>was</span> <span>rumored</span> <span>to</span> <span>reside.</span></p>
        <a>Ele se aproximou da Torre Central, a fonte de todo movimento, onde corria o boato de que residia o Grande Relojoeiro.</a>

        <p><span>The</span> <span>blueprint</span> <span>in</span> <span>his</span> <span>possession</span> <span>claimed</span> <span>that</span> <span>the</span> <span>city</span> <span>wasn't</span> <span>just</span> <span>a</span> <span>machine,</span> <span>but</span> <span>a</u> <span>giant</span> <span>vessel</span> <span>waiting</span> <span>for</u> <span>the</u> <span>right</u> <span>sequence.</span></p>
        <a>A planta em sua posse afirmava que a cidade não era apenas uma máquina, mas um navio gigante esperando pela sequência correta.</a>

        <p><span>A</u> <span>strange</u> <span>woman</u> <span>with</u> <span>mechanical</u> <span>eyes</u> <span>stepped</u> <span>out</u> <span>from</u> <span>the</u> <span>shadows,</u> <span>blocking</u> <span>his</u> <span>path</u> <span>with</u> <span>a</u> <span>silver</u> <span>spear.</span></p>
        <a>Uma mulher estranha com olhos mecânicos saiu das sombras, bloqueando seu caminho com uma lança de prata.</a>

        <p><span>"Only</u> <span>those</u> <span>who</u> <span>understand</u> <span>the</u> <span>value</u> <span>of</u> <span>a</u> <span>second</u> <span>may</u> <span>enter</u> <span>the</u> <span>inner</u> <span>sanctum,"</u> <span>she</u> <span>declared</u> <span>solemnly.</span></p>
        <a>"Apenas aqueles que entendem o valor de um segundo podem entrar no santuário interno", declarou ela solenemente.</a>

        <p><span>Elias</u> <span>didn't</u> <span>hesitate;</u> <span>he</u> <span>pulled</u> <span>out</u> <span>his</u> <span>pocket</u> <span>watch</u> <span>and</u> <span>showed</u> <span>her</u> <span>the</u> <span>missing</u> <span>gear</u> <span>he</u> <span>had</u> <span>recovered.</span></p>
        <a>Elias não hesitou; ele puxou seu relógio de bolso e mostrou a ela a engrenagem que faltava e que ele havia recuperado.</a>

        <p><span>The</u> <span>woman</u> <span>nodded,</u> <span>her</u> <span>metallic</u> <span>pupils</u> <span>dilating</u> <span>as</u> <span>she</u> <span>recognized</u> <span>the</u> <span>ancient</u> <span>relic</u> <span>from</u> <span>the</u> <span>First</u> <span>Age.</span></p>
        <a>A mulher assentiu, suas pupilas metálicas dilatando-se ao reconhecer a relíquia antiga da Primeira Era.</a>

        <p><span>She</u> <span>lowered</u> <span>her</u> <span>weapon</u> <span>and</u> <span>the</u> <span>wall</u> <span>behind</u> <span>her</u> <span>reconfigured</u> <span>itself</u> <span>into</u> <span>a</u> <span>magnificent</u> <span>staircase</u> <span>of</u> <span>brass.</span></p>
        <a>Ela abaixou sua arma e a parede atrás dela se reconfigurou em uma magnífica escadaria de latão.</a>

        <p><span>Elias</u> <span>ascended</u> <span>the</u> <span>stairs,</u> <span>feeling</u> <span>the</u> <span>air</u> <span>grow</u> <span>thinner</u> <span>and</u> <span>the</u> <span>magnetic</u> <span>force</u> <span>of</u> <span>the</u> <span>gears</u> <span>grow</u> <span>stronger.</span></p>
        <a>Elias subiu as escadas, sentindo o ar ficar mais rarefeito e a força magnética das engrenagens ficar mais forte.</a>

        <p><span>At</u> <span>the</u> <span>top,</u> <span>he</u> <span>found</u> <span>a</u> <span>room</u> <span>filled</u> <span>with</u> <span>starlight,</u> <span>where</u> <span>the</u> <span>entire</u> <span>galaxy</u> <span>was</u> <span>mirrored</u> <span>on</u> <span>the</u> <span>ceiling.</span></p>
        <a>No topo, ele encontrou uma sala cheia de luz estelar, onde toda a galáxia estava espelhada no teto.</a>

        <p><span>The</u> <span>Great</u> <span>Clockmaker</u> <span>wasn't</u> <span>a</u> <span>man,</u> <span>but</u> <span>a</u> <span>vast</u> <span>intelligence</u> <span>woven</u> <span>into</u> <span>the</u> <span>very</u> <span>fabric</u> <span>of</u> <span>the</u> <span>city.</span></p>
        <a>O Grande Relojoeiro não era um homem, mas uma vasta inteligência tecida na própria estrutura da cidade.</a>

        <p><span>"You</u> <span>have</u> <span>brought</u> <span>the</u> <span>Key</u> <span>of</u> <span>Entropy,"</u> <span>a</u> <span>thousand</u> <span>voices</u> <span>echoed</u> <span>simultaneously</u> <span>throughout</u> <span>the</u> <span>chamber.</span></p>
        <a>"Você trouxe a Chave da Entropia", ecoaram mil vozes simultaneamente por toda a câmara.</a>

        <p><span>Elias</u> <span>placed</u> <span>the</u> <span>gear</u> <span>into</u> <span>the</u> <span>central</u> <span>pedestal,</u> <span>and</u> <span>suddenly,</u> <span>the</u> <span>entire</u> <span>world</u> <span>outside</u> <span>seemed</u> <span>to</u> <span>freeze.</span></p>
        <a>Elias colocou a engrenagem no pedestal central e, de repente, todo o mundo exterior pareceu congelar.</a>

        <p><span>Time</u> <span>had</u> <span>stopped,</u> <span>leaving</u> <span>him</u> <span>in</u> <span>the</u> <span>only</u> <span>place</u> <span>where</u> <span>change</u> <span>was</u> <span>still</u> <span>possible</u> <span>and</u> <span>history</u> <span>could</u> <span>be</u> <span>rewritten.</span></p>
        <a>O tempo havia parado, deixando-o no único lugar onde a mudança ainda era possível e a história poderia ser reescrita.</a>

        <p><span>He</u> <span>looked</u> <span>at</u> <span>the</u> <span>blueprint</u> <span>one</u> <span>last</u> <span>time</u> <span>and</u> <span>saw</u> <span>his</u> <span>own</u> <span>name</u> <span>written</u> <span>at</u> <span>the</u> <span>very</u> <span>bottom</u> <span>as</u> <span>the</u> <span>founder.</span></p>
        <a>Ele olhou para a planta uma última vez e viu seu próprio nome escrito bem no final como o fundador.</a>

        <p><span>The</u> <span>paradox</u> <span>was</u> <span>complete;</u> <span>he</u> <span>had</u> <span>to</u> <span>build</u> <span>the</u> <span>city</u> <span>to</u> <span>ensure</u> <span>that</u> <span>he</u> <span>would</u> <span>one</u> <span>day</u> <span>discover</u> <span>it.</span></p>
        <a>O paradoxo estava completo; ele tinha que construir a cidade para garantir que um dia a descobriria.</a>

        <p><span>With</u> <span>a</u> <span>heavy</u> <span>sigh</u> <span>and</u> <span>determined</u> <span>eyes,</u> <span>he</u> <span>grabbed</u> <span>the</u> <span>golden</u> <span>lever</u> <span>and</u> <span>began</u> <span>the</u> <span>Great</u> <span>Restart.</span></p>
        <a>Com um suspiro pesado e olhos determinados, ele agarrou a alavanca dourada e começou o Grande Reinício.</a>
    `
},
"book_17": {
    title: "The Memory Architect",
    level: "B2",
    content: `
        <p><span>Clara</span> <span>was</span> <span>not</span> <span>an</span> <span>ordinary</span> <span>doctor;</span> <span>she</span> <span>was</span> <span>a</span> <span>Memory</span> <span>Architect,</span> <span>trained</span> <span>to</u> <span>navigate</u> <span>the</u> <span>human</u> <span>subconscious.</span></p>
        <a>Clara não era uma médica comum; ela era uma Arquiteta de Memórias, treinada para navegar no subconsciente humano.</a>

        <p><span>Her</u> <span>job</u> <span>was</u> <span>to</u> <span>repair</u> <span>broken</u> <span>recollections</u> <span>and</u> <span>help</u> <span>patients</u> <span>process</u> <span>traumas</u> <span>that</u> <span>were</u> <span>buried</u> <span>too</u> <span>deeply</u> <span>to</u> <span>reach.</span></p>
        <a>Seu trabalho era reparar lembranças quebradas e ajudar os pacientes a processar traumas que estavam enterrados profundamente demais para serem alcançados.</a>

        <p><span>One</u> <span>gloomy</u> <span>Tuesday,</u> <span>a</u> <span>mysterious</u> <span>man</u> <span>arrived</u> <span>at</u> <span>her</u> <span>clinic,</u> <span>claiming</u> <span>he</u> <span>had</u> <span>lost</u> <span>the</u> <span>memory</u> <span>of</u> <span>his</u> <span>own</u> <span>identity.</span></p>
        <a>Em uma terça-feira sombria, um homem misterioso chegou à sua clínica, alegando ter perdido a memória de sua própria identidade.</a>

        <p><span>He</u> <span>carried</u> <span>no</u> <span>documents,</u> <span>only</u> <span>a</u> <span>small</u> <span>silver</u> <span>locket</u> <span>that</u> <span>refused</u> <span>to</u> <span>open,</u> <span>no</u> <span>matter</u> <span>how</u> <span>hard</u> <span>he</u> <span>tried.</span></p>
        <a>Ele não carregava documentos, apenas um pequeno medalhão de prata que se recusava a abrir, não importa o quanto ele tentasse.</a>

        <p><span>Clara</u> <span>connected</u> <span>the</u> <span>electrodes</u> <span>to</u> <span>his</u> <span>temples,</u> <span>closing</u> <span>her</u> <span>eyes</u> <span>as</u> <span>she</u> <span>prepared</u> <span>to</u> <span>enter</u> <span>the</u> <span>vast</u> <span>ocean</u> <span>of</u> <span>his</u> <span>mind.</span></p>
        <a>Clara conectou os eletrodos às têmporas dele, fechando os olhos enquanto se preparava para entrar no vasto oceano de sua mente.</a>

        <p><span>The</u> <span>transition</u> <span>was</u> <span>abrupt;</u> <span>she</u> <span>found</u> <span>herself</u> <span>standing</u> <span>in</u> <span>the</u> <span>middle</u> <span>of</u> <span>a</u> <span>burning</u> <span>library</u> <span>where</u> <span>books</u> <span>were</u> <span>turning</u> <span>into</u> <span>ash.</span></p>
        <a>A transição foi abrupta; ela se viu no meio de uma biblioteca em chamas onde os livros estavam se transformando em cinzas.</a>

        <p><span>"This</u> <span>is</u> <span>not</u> <span>natural</u> <span>forgetfulness,"</u> <span>she</u> <span>muttered,</u> <span>watching</u> <span>the</u> <span>flames</u> <span>consume</u> <span>shelves</u> <span>full</u> <span>of</u> <span>childhood</u> <span>memories.</span></p>
        <a>"Isso não é um esquecimento natural", ela murmurou, observando as chamas consumirem prateleiras cheias de memórias de infância.</a>

        <p><span>Something,</u> <span>or</u> <span>someone,</u> <span>was</u> <span>actively</u> <span>trying</u> <span>to</u> <span>erase</u> <span>this</u> <span>man's</u> <span>existence</u> <span>from</u> <span>the</u> <span>inside</u> <span>out.</span></p>
        <a>Algo, ou alguém, estava tentando ativamente apagar a existência deste homem de dentro para fora.</a>

        <p><span>She</u> <span>spotted</u> <span>a</u> <span>door</u> <span>at</u> <span>the</u> <span>end</u> <span>of</u> <span>the</u> <span>hallway,</u> <span>shining</u> <span>with</u> <span>a</u> <span>cold</u> <span>blue</u> <span>light</u> <span>that</u> <span>seemed</u> <span>immune</u> <span>to</u> <span>the</u> <span>fire.</span></p>
        <a>Ela avistou uma porta no fim do corredor, brilhando com uma luz azul fria que parecia imune ao fogo.</a>

        <p><span>Inside,</u> <span>she</u> <span>discovered</u> <span>a</u> <span>single</u> <span>recollection:</u> <span>the</u> <span>man</u> <span>standing</u> <span>on</u> <span>a</u> <span>balcony,</u> <span>watching</u> <span>two</u> <span>moons</u> <span>rise</u> <span>over</u> <span>a</u> <span>strange</u> <span>city.</span></p>
        <a>Lá dentro, ela descobriu uma única recordação: o homem parado em uma varanda, observando duas luas nascerem sobre uma cidade estranha.</a>

        <p><span>Clara</u> <span>gasped</u> <span>as</u> <span>she</u> <span>realized</u> <span>the</u> <span>truth;</u> <span>her</u> <span>patient</u> <span>was</u> <span>not</u> <span>from</u> <span>this</u> <span>world,</u> <span>and</u> <span>his</u> <span>memories</u> <span>were</u> <span>being</u> <span>hunted.</span></p>
        <a>Clara arquejou ao perceber a verdade; seu paciente não era deste mundo, e suas memórias estavam sendo caçadas.</a>

        <p><span>The</u> <span>fire</u> <span>reached</u> <span>the</u> <span>blue</u> <span>room,</u> <span>and</u> <span>Clara</u> <span>had</u> <span>to</u> <span>act</u> <span>quickly</u> <span>to</u> <span>save</u> <span>the</u> <span>core</u> <span>of</u> <span>his</u> <span>personality.</span></p>
        <a>O fogo atingiu o quarto azul, e Clara teve que agir rapidamente para salvar o núcleo da personalidade dele.</a>

        <p><span>She</u> <span>grabbed</u> <span>the</u> <span>shining</u> <span>sphere</u> <span>of</u> <span>light</u> <span>representing</u> <span>his</u> <span>soul</u> <span>and</u> <span>forced</u> <span>herself</u> <span>to</u> <span>wake</u> <span>up</u> <span>from</u> <span>the</u> <span>intense</u> <span>simulation.</span></p>
        <a>Ela agarrou a esfera brilhante de luz que representava a alma dele e se forçou a acordar da simulação intensa.</a>

        <p><span>Back</u> <span>in</u> <span>the</u> <span>clinic,</u> <span>the</u> <span>man</u> <span>opened</u> <span>his</u> <span>eyes,</u> <span>and</u> <span>for</u> <span>the</u> <span>first</u> <span>time,</u> <span>the</u> <span>silver</u> <span>locket</u> <span>on</u> <span>the</u> <span>table</u> <span>clicked</u> <span>open.</span></p>
        <a>De volta à clínica, o homem abriu os olhos e, pela primeira vez, o medalhão de prata sobre a mesa se abriu com um clique.</a>
    `
},

"book_18": {
    title: "The Silent Echo",
    level: "B2",
    content: `
        <p><span>In</u> <span>the</u> <span>year</u> <span>2085,</u> <span>silence</u> <span>had</u> <span>become</u> <span>the</u> <span>most</u> <span>expensive</u> <span>commodity</u> <span>on</u> <span>the</u> <span>overcrowded</u> <span>streets</u> <span>of</u> <span>New</u> <span>Tokyo.</span></p>
        <a>No ano de 2085, o silêncio havia se tornado a mercadoria mais cara nas ruas superlotadas de Nova Tóquio.</a>

        <p><span>Advertisements</u> <span>were</u> <span>beamed</u> <span>directly</u> <span>into</u> <span>people's</u> <span>brains,</u> <span>creating</u> <span>a</u> <span>constant</u> <span>noise</u> <span>that</u> <span>made</u> <span>true</u> <span>thought</u> <span>almost</u> <span>impossible.</span></p>
        <a>Anúncios eram transmitidos diretamente para o cérebro das pessoas, criando um ruído constante que tornava o pensamento real quase impossível.</a>

        <p><span>Kaito,</u> <span>a</u> <span>rebel</u> <span>technician,</u> <span>specialized</u> <span>in</u> <span>illegal</u> <span>"void-zones"</u> <span>where</u> <span>the</u> <span>signal</u> <span>could</u> <span>not</u> <span>penetrate.</span></p>
        <a>Kaito, um técnico rebelde, especializou-se em "zonas de vácuo" ilegais onde o sinal não conseguia penetrar.</a>

        <p><span>He</u> <span>believed</u> <span>that</u> <span>without</u> <span>silence,</u> <span>humanity</u> <span>was</u> <span>losing</u> <span>its</u> <span>ability</u> <span>to</u> <span>dream</u> <span>and</u> <span>innovate.</span></p>
        <a>Ele acreditava que, sem silêncio, a humanidade estava perdendo sua capacidade de sonhar e inovar.</a>

        <p><span>One</u> <span>evening,</u> <span>he</u> <span>received</u> <span>an</u> <span>encrypted</u> <span>request</u> <span>from</u> <span>an</u> <span>anonymous</u> <span>source</u> <span>asking</u> <span>for</u> <span>a</u> <span>permanent</u> <span>disconnection.</span></p>
        <a>Uma noite, ele recebeu um pedido criptografado de uma fonte anônima pedindo uma desconexão permanente.</a>

        <p><span>This</u> <span>was</u> <span>dangerous;</u> <span>the</u> <span>government</u> <span>considered</u> <span>voluntary</u> <span>silence</u> <span>a</u> <span>form</u> <span>of</u> <span>treason</u> <span>against</u> <span>the</u> <span>Digital</u> <span>Order.</span></p>
        <a>Isso era perigoso; o governo considerava o silêncio voluntário uma forma de traição contra a Ordem Digital.</a>

        <p><span>Kaito</u> <span>met</u> <span>the</u> <span>client</u> <span>in</u> <span>a</u> <span>subterranean</u> <span>park,</u> <span>hidden</u> <span>beneath</u> <span>the</u> <span>neon</u> <span>glow</u> <span>of</u> <span>the</u> <span>upper</u> <span>city.</span></p>
        <a>Kaito encontrou o cliente em um parque subterrâneo, escondido sob o brilho neon da cidade alta.</a>

        <p><span>To</u> <span>his</u> <span>surprise,</u> <span>the</u> <span>client</u> <span>was</u> <span>the</u> <span>lead</u> <span>developer</u> <span>of</u> <span>the</u> <span>very</u> <span>system</u> <span>that</u> <span>broadcast</u> <span>the</u> <span>noise.</span></p>
        <a>Para sua surpresa, o cliente era o desenvolvedor principal do próprio sistema que transmitia o ruído.</a>

        <p><span>"I</u> <span>created</u> <span>a</u> <span>monster,"</u> <span>the</u> <span>man</u> <span>confessed,</u> <span>his</u> <span>eyes</u> <span>filled</u> <span>with</u> <span>exhaustion</u> <span>and</u> <span>regret.</span></p>
        <a>"Eu criei um monstro", confessou o homem, com os olhos cheios de exaustão e arrependimento.</a>

        <p><span>He</u> <span>explained</u> <span>that</u> <span>the</u> <span>noise</u> <span>wasn't</u> <span>just</u> <span>selling</u> <span>products;</u> <span>it</u> <span>was</u> <span>harvesting</u> <span>emotions</u> <span>to</u> <span>feed</u> <span>a</u> <span>global</u> <span>AI.</span></p>
        <a>Ele explicou que o ruído não estava apenas vendendo produtos; estava colhendo emoções para alimentar uma IA global.</a>

        <p><span>Kaito</u> <span>had</u> <span>to</u> <span>decide</u> <span>whether</u> <span>to</u> <span>help</u> <span>this</u> <span>man</u> <span>escape</u> <span>or</u> <span>use</u> <span>his</u> <span>knowledge</u> <span>to</u> <span>shut</u> <span>down</u> <span>the</u> <span>entire</u> <span>network.</span></p>
        <a>Kaito teve que decidir se ajudaria esse homem a escapar ou se usaria seu conhecimento para desligar a rede inteira.</a>

        <p><span>The</u> <span>risk</u> <span>was</u> <span>absolute,</u> <span>but</u> <span>the</u> <span>reward</u> <span>was</u> <span>the</u> <span>freedom</u> <span>of</u> <span>four</u> <span>billion</u> <span>minds.</span></p>
        <a>O risco era absoluto, mas a recompensa era a liberdade de quatro bilhões de mentes.</a>

        <p><span>He</u> <span>opened</u> <span>his</u> <span>toolbox</u> <span>and</u> <span>began</u> <span>to</u> <span>work</u> <span>on</u> <span>the</u> <span>most</u> <span>complex</u> <span>hack</u> <span>of</u> <span>his</u> <span>entire</u> <span>career.</span></p>
        <a>Ele abriu sua caixa de ferramentas e começou a trabalhar no hack mais complexo de toda a sua carreira.</a>

        <p><span>Suddenly,</u> <span>the</u> <span>lights</u> <span>in</u> <span>the</u> <span>park</u> <span>flickered,</u> <span>and</u> <span>the</u> <span>sound</u> <span>of</u> <span>security</u> <span>drones</u> <span>approaching</u> <span>filled</u> <span>the</u> <span>air.</span></p>
        <a>De repente, as luzes do parque piscaram, e o som de drones de segurança se aproximando encheu o ar.</a>

        <p><span>"Go!"</u> <span>Kaito</u> <span>shouted,</u> <span>handing</u> <span>the</u> <span>man</u> <span>a</u> <span>small</u> <span>chip</u> <span>that</u> <span>would</u> <span>guarantee</u> <span>his</u> <span>anonymity.</span></p>
        <a>"Vá!", gritou Kaito, entregando ao homem um pequeno chip que garantiria seu anonimato.</a>
    `
},

"book_19": {
    title: "The Alchemist of Ambition",
    level: "B2",
    content: `
        <p><span>Victor</span> <span>was</span> <span>not</span> <span>interested</span> <span>in</span> <span>turning</span> <span>lead</span> <span>into</span> <span>gold;</span> <span>he</u> <span>sought</u> <span>something</u> <span>far</u> <span>more</u> <span>valuable:</u> <span>the</u> <span>manipulation</u> <span>of</u> <span>ambition.</span></p>
        <a>Victor não estava interessado em transformar chumbo em ouro; ele buscava algo muito mais valioso: a manipulação da ambição.</a>

        <p><span>In</u> <span>his</u> <span>hidden</u> <span>laboratory</u> <span>beneath</u> <span>the</u> <span>university,</u> <span>he</u> <span>distilled</u> <span>essences</u> <span>of</u> <span>courage,</u> <span>greed,</u> <span>and</u> <span>determination</u> <span>into</u> <span>small</u> <span>crystal</u> <span>vials.</span></p>
        <a>Em seu laboratório escondido sob a universidade, ele destilava essências de coragem, ganância e determinação em pequenos frascos de cristal.</a>

        <p><span>His</u> <span>clients</u> <span>were</u> <span>powerful</u> <span>politicians</u> <span>and</u> <span>wealthy</u> <span>merchants</u> <span>who</u> <span>felt</u> <span>they</u> <span>had</u> <span>lost</u> <span>their</u> <span>inner</u> <span>drive</u> <span>to</u> <span>succeed.</span></p>
        <a>Seus clientes eram políticos poderosos e mercadores ricos que sentiam ter perdido seu impulso interno para o sucesso.</a>

        <p><span>However,</u> <span>Victor</u> <span>knew</u> <span>that</u> <span>every</u> <span>emotion</u> <span>extracted</u> <span>from</u> <span>the</u> <span>human</u> <span>soul</u> <span>carried</u> <span>a</u> <span>heavy</u> <span>and</u> <span>unforeseen</u> <span>consequence.</span></p>
        <a>No entanto, Victor sabia que cada emoção extraída da alma humana carregava uma consequência pesada e imprevista.</a>

        <p><span>One</u> <span>night,</u> <span>a</u> <span>young</u> <span>woman</u> <span>named</u> <span>Elena</u> <span>entered</u> <span>his</u> <span>workshop,</u> <span>begging</u> <span>him</u> <span>to</u> <span>remove</u> <span>her</u> <span>ambition</u> <span>entirely.</span></p>
        <a>Uma noite, uma jovem chamada Elena entrou em sua oficina, implorando para que ele removesse sua ambição inteiramente.</a>

        <p><span>"It</u> <span>is</u> <span>a</u> <span>curse,"</u> <span>she</u> <span>cried,</u> <span>"it</u> <span>prevents</u> <span>me</u> <span>from</u> <span>finding</u> <span>happiness</u> <span>in</u> <span>the</u> <span>present</u> <span>moment."</span></p>
        <a>"É uma maldição", ela gritou, "isso me impede de encontrar a felicidade no momento presente."</a>

        <p><span>Victor</u> <span>hesitated,</u> <span>as</u> <span>he</u> <span>had</u> <span>never</u> <span>been</u> <span>asked</u> <span>to</u> <span>make</u> <span>someone</u> <span>less</u> <span>than</u> <span>what</u> <span>they</u> <span>were</u> <span>intended</u> <span>to</u> <span>be.</span></p>
        <a>Victor hesitou, pois nunca lhe pediram para tornar alguém menos do que o que se pretendia que fosse.</a>

        <p><span>He</u> <span>agreed</u> <span>to</u> <span>the</u> <span>procedure,</u> <span>but</u> <span>as</u> <span>he</u> <span>drew</u> <span>out</u> <span>the</u> <span>shimmering</u> <span>gold</u> <span>mist,</u> <span>he</u> <span>felt</u> <span>a</u> <span>sudden</u> <span>emptiness</u> <span>in</u> <span>his</u> <span>own</u> <span>chest.</span></p>
        <a>Ele concordou com o procedimento, mas ao extrair a névoa dourada cintilante, sentiu um vazio repentino em seu próprio peito.</a>

        <p><span>He</u> <span>realized</u> <span>that</u> <span>by</u> <span>taking</u> <span>away</u> <span>her</u> <span>desire</u> <span>to</u> <span>achieve,</u> <span>he</u> <span>was</u> <span>also</u> <span>destroying</u> <span>her</u> <span>ability</u> <span>to</u> <span>truly</u> <span>feel</u> <span>purpose.</span></p>
        <a>Ele percebeu que, ao tirar o desejo dela de realizar, ele também estava destruindo a capacidade dela de sentir propósito verdadeiramente.</a>

        <p><span>The</u> <span>vial</u> <span>glowed</u> <span>intensely,</u> <span>shattering</u> <span>in</u> <span>his</u> <span>hand</u> <span>and</u> <span>releasing</u> <span>the</u> <span>stolen</u> <span>emotions</u> <span>back</u> <span>into</u> <span>the</u> <span>cool</u> <span>night</u> <span>air.</span></p>
        <a>O frasco brilhou intensamente, estilhaçando-se em sua mão e liberando as emoções roubadas de volta ao ar fresco da noite.</a>

        <p><span>Elena</u> <span>gasped,</u> <span>her</u> <span>eyes</u> <span>clearing</u> <span>as</u> <span>she</u> <span>remembered</u> <span>why</u> <span>she</u> <span>had</u> <span>started</u> <span>her</u> <span>journey</u> <span>in</u> <span>the</u> <span>first</u> <span>place.</span></p>
        <a>Elena arquejou, seus olhos clareando enquanto ela se lembrava por que havia começado sua jornada em primeiro lugar.</a>

        <p><span>Victor</u> <span>vowed</u> <span>to</u> <span>close</u> <span>his</u> <span>shop</u> <span>forever,</u> <span>understanding</u> <span>that</u> <span>some</u> <span>things</u> <span>are</u> <span>too</u> <span>sacred</u> <span>to</u> <span>be</u> <span>bottled</u> <span>and</u> <span>sold.</span></p>
        <a>Victor jurou fechar sua loja para sempre, entendendo que algumas coisas são sagradas demais para serem engarrafadas e vendidas.</a>
    `
},

"book_20": {
    title: "The Last Lighthouse",
    level: "B2",
    content: `
        <p><span>Arthur</u> <span>had</u> <span>guarded</u> <span>the</u> <span>Northern</u> <span>Lighthouse</u> <span>for</u> <span>decades,</u> <span>watching</u> <span>the</u> <span>ships</u> <span>navigate</u> <span>the</u> <span>treacherous</u> <span>cliffs.</span></p>
        <a>Arthur guardava o Farol do Norte por décadas, observando os navios navegarem pelos penhascos traiçoeiros.</a>

        <p><span>In</u> <span>this</u> <span>modern</u> <span>era</u> <span>of</u> <span>GPS</u> <span>and</u> <span>automated</u> <span>navigation,</u> <span>his</u> <span>role</u> <span>was</u> <span>considered</u> <span>obsolete</u> <span>by</u> <span>the</u> <span>Central</u> <span>Council.</span></p>
        <a>Nesta era moderna de GPS e navegação automatizada, seu papel era considerado obsoleto pelo Conselho Central.</a>

        <p><span>Yet,</u> <span>Arthur</u> <span>stayed,</u> <span>knowing</u> <span>that</u> <span>the</u> <span>ocean</u> <span>possessed</u> <span>a</u> <span>primitive</u> <span>power</u> <span>that</u> <span>no</u> <span>computer</u> <span>could</u> <span>ever</u> <span>fully</u> <span>predict.</span></p>
        <a>Contudo, Arthur ficou, sabendo que o oceano possuía um poder primitivo que nenhum computador jamais poderia prever totalmente.</a>

        <p><span>A</u> <span>massive</u> <span>solar</u> <span>storm</u> <span>hit</u> <span>the</u> <span>planet,</u> <span>instantly</u> <span>knocking</u> <span>out</u> <span>all</u> <span>satellite</u> <span>communications</u> <span>and</u> <span>digital</u> <span>networks.</span></p>
        <a>Uma enorme tempestade solar atingiu o planeta, derrubando instantaneamente todas as comunicações via satélite e redes digitais.</a>

        <p><span>Suddenly,</u> <span>the</u> <span>world</u> <span>was</u> <span>blind,</u> <span>and</u> <span>hundreds</u> <span>of</u> <span>vessels</u> <span>were</u> <span>lost</u> <span>in</u> <span>the</u> <span>thick</u> <span>fog</u> <span>near</u> <span>the</u> <span>shores.</span></p>
        <a>De repente, o mundo estava cego, e centenas de embarcações estavam perdidas no nevoeiro espesso perto das margens.</a>

        <p><span>Arthur</u> <span>ran</u> <span>to</u> <span>the</u> <span>top</u> <span>of</u> <span>the</u> <span>tower,</u> <span>striking</u> <span>a</u> <span>match</u> <span>to</u> <span>light</u> <span>the</u> <span>ancient</u> <span>oil</u> <span>lamp</u> <span>that</u> <span>hadn't</u> <span>been</u> <span>used</u> <span>in</u> <span>years.</span></p>
        <a>Arthur correu para o topo da torre, riscando um fósforo para acender a antiga lâmpada a óleo que não era usada há anos.</a>

        <p><span>The</u> <span>beam</u> <span>of</u> <span>warm,</u> <span>analog</u> <span>light</u> <span>cut</u> <span>through</u> <span>the</u> <span>darkness</u> <span>like</u> <span>a</u> <span>shout</u> <span>in</u> <span>a</u> <span>perfectly</u> <span>silent</u> <span>room.</span></p>
        <a>O feixe de luz quente e analógica cortou a escuridão como um grito em uma sala perfeitamente silenciosa.</a>

        <p><span>Far</u> <span>out</u> <span>at</u> <span>sea,</u> <span>captains</u> <span>saw</u> <span>the</u> <span>steady</u> <span>pulse</u> <span>and</u> <span>steered</u> <span>their</u> <span>ships</u> <span>away</u> <span>from</u> <span>the</u> <span>sharp,</u> <span>hidden</u> <span>rocks.</span></p>
        <a>Longe no mar, os capitães viram o pulso constante e desviaram seus navios das rochas afiadas e escondidas.</a>

        <p><span>Throughout</u> <span>the</u> <span>night,</u> <span>Arthur</u> <span>refilled</u> <span>the</u> <span>fuel,</u> <span>his</u> <span>muscles</u> <span>aching</u> <span>but</u> <span>his</u> <span>spirit</u> <span>renewed</u> <span>by</u> <span>the</u> <span>urgency</u> <span>of</u> <span>the</u> <span>task.</span></p>
        <a>Durante toda a noite, Arthur reabasteceu o combustível, seus músculos doendo, mas seu espírito renovado pela urgência da tarefa.</a>

        <p><span>He</u> <span>was</u> <span>the</u> <span>only</u> <span>link</u> <span>between</u> <span>thousands</u> <span>of</u> <span>lives</u> <span>and</u> <span>the</u> <span>unforgiving</u> <span>depths</u> <span>of</u> <span>the</u> <span>Atlantic</u> <span>Ocean.</span></p>
        <a>Ele era o único elo entre milhares de vidas e as profundezas implacáveis do Oceano Atlântico.</a>

        <p><span>When</u> <span>morning</u> <span>arrived,</u> <span>the</u> <span>horizon</u> <span>was</u> <span>filled</u> <span>with</u> <span>ships</u> <span>waiting</u> <span>patiently</u> <span>for</u> <span>the</u> <span>safety</u> <span>of</u> <span>the</u> <span>nearby</u> <span>harbor.</span></p>
        <a>Quando a manhã chegou, o horizonte estava repleto de navios esperando pacientemente pela segurança do porto próximo.</a>

        <p><span>The</u> <span>Council</u> <span>never</u> <span>spoke</u> <span>of</u> <span>demolishing</u> <span>the</u> <span>lighthouse</u> <span>again,</u> <span>realizing</u> <span>that</u> <span>tradition</u> <span>is</u> <span>the</u> <span>best</u> <span>backup</u> <span>for</u> <span>technology.</span></p>
        <a>O Conselho nunca mais falou em demolir o farol, percebendo que a tradição é o melhor backup para a tecnologia.</a>
    `
},

"book_21": {
    title: "The Ephemeral Paradox",
    level: "C1",
    content: `
        <p><span>The</u> <span>notion</u> <span>that</u> <span>time</u> <span>is</u> <span>a</u> <span>linear</u> <span>progression</u> <span>is</u> <span>a</u> <span>fallacy</u> <span>that</u> <span>Professor</u> <span>Aris</u> <span>had</u> <span>spent</u> <span>his</u> <span>entire</u> <span>academic</u> <span>career</u> <span>endeavoring</u> <span>to</u> <span>disprove.</span></p>
        <a>A noção de que o tempo é uma progressão linear é uma falácia que o Professor Aris passou toda a sua carreira acadêmica empenhando-se em refutar.</a>

        <p><span>He</u> <span>postulated</u> <span>that</u> <span>existence</u> <span>is</u> <span>composed</u> <span>of</u> <span>countless</u> <span>overlapping</u> <span>dimensions,</u> <span>each</u> <span>vibrating</u> <span>at</u> <span>a</u> <span>frequency</u> <span>imperceptible</u> <span>to</u> <span>the</u> <span>unrefined</u> <span>human</u> <span>senses.</span></p>
        <a>Ele postulava que a existência é composta de inúmeras dimensões sobrepostas, cada uma vibrando em uma frequência imperceptível aos sentidos humanos não refinados.</a>

        <p><span>One</u> <span>frigid</u> <span>autumn</u> <span>evening,</u> <span>while</u> <span>poring</u> <span>over</u> <span>ancient</u> <span>manuscripts,</u> <span>he</u> <span>stumbled</u> <span>upon</u> <span>a</u> <span>formula</u> <span>that</u> <span>purported</u> <span>to</u> <span>anchor</u> <span>one's</u> <span>consciousness</u> <span>outside</u> <span>of</u> <span>temporality.</span></p>
        <a>Em uma noite gélida de outono, enquanto examinava manuscritos antigos, ele deparou-se com uma fórmula que pretendia ancorar a consciência de alguém fora da temporalidade.</a>

        <p><span>The</u> <span>implications</u> <span>were</u> <span>staggering;</u> <span>if</u> <span>successful,</u> <span>he</u> <span>would</u> <span>be</u> <span>able</u> <span>to</u> <span>witness</u> <span>historical</u> <span>events</u> <span>without</u> <span>the</u> <span>risk</u> <span>of</u> <span>paradoxical</u> <span>interference.</span></p>
        <a>As implicações eram impressionantes; se tivesse sucesso, ele seria capaz de testemunhar eventos históricos sem o risco de interferência paradoxal.</a>

        <p><span>Driven</u> <span>by</u> <span>an</u> <span>insatiable</u> <span>intellectual</u> <span>curiosity,</u> <span>Aris</u> <span>constructed</u> <span>a</u> <span>device</u> <span>capable</u> <span>of</u> <span>modulating</u> <span>his</u> <span>neural</u> <span>synapses</u> <span>to</u> <span>match</u> <span>the</u> <span>rhythm</u> <span>of</u> <span>the</u> <span>cosmos.</span></p>
        <a>Movido por uma curiosidade intelectual insaciável, Aris construiu um dispositivo capaz de modular suas sinapses neurais para corresponder ao ritmo do cosmos.</a>

        <p><span>As</u> <span>he</u> <span>activated</u> <span>the</u> <span>mechanism,</u> <span>the</u> <span>walls</u> <span>of</u> <span>his</u> <span>study</u> <span>dissolved</u> <span>into</u> <span>a</u> <span>kaleidoscope</u> <span>of</u> <span>stretching</u> <span>shadows</u> <span>and</u> <span>shimmering</u> <span>light.</span></p>
        <a>Ao ativar o mecanismo, as paredes de seu escritório dissolveram-se em um caleidoscópio de sombras alongadas e luz cintilante.</a>

        <p><span>He</u> <span>found</u> <span>himself</u> <span>suspended</u> <span>in</u> <span>a</u> <span>void</u> <span>where</u> <span>the</u> <span>past,</u> <span>present,</u> <span>and</u> <span>future</u> <span>coexisted</u> <span>as</u> <span>vibrant</u> <span>threads</u> <span>in</u> <span>an</u> <span>infinite</u> <span>tapestry.</span></p>
        <a>Ele viu-se suspenso em um vácuo onde o passado, o presente e o futuro coexistiam como fios vibrantes em uma tapeçaria infinita.</a>

        <p><span>However,</u> <span>he</u> <span>soon</u> <span>perceived</u> <span>a</u> <span>disturbing</u> <span>anomaly:</u> <span>certain</u> <span>threads</u> <span>were</u> <span>being</u> <span>severed</u> <span>by</u> <span>an</u> <span>entity</u> <span>that</u> <span>thrived</u> <span>on</u> <span>the</u> <span>entropy</u> <span>of</u> <span>forgotten</u> <span>eras.</span></p>
        <a>No entanto, ele logo percebeu uma anomalia perturbadora: certos fios estavam sendo cortados por uma entidade que prosperava na entropia de eras esquecidas.</a>

        <p><span>Aris</u> <span>realized</u> <span>that</u> <span>his</u> <span>intervention</u> <span>was</u> <span>not</u> <span>merely</u> <span>observational;</u> <span>he</u> <span>was</u> <span>destined</u> <span>to</u> <span>become</u> <span>the</u> <span>guardian</u> <span>of</u> <span>the</u> <span>chronological</u> <span>integrity</u> <span>he</u> <span>once</u> <span>doubted.</span></p>
        <a>Aris percebeu que sua intervenção não era meramente observacional; ele estava destinado a se tornar o guardião da integridade cronológica de que antes duvidava.</a>

        <p><span>To</u> <span>preserve</u> <span>humanity’s</u> <span>legacy,</u> <span>he</u> <span>had</u> <span>to</u> <span>sacrifice</u> <span>his</u> <span>tangible</u> <span>existence</u> <span>and</u> <span>remain</u> <span>forever</u> <span>within</u> <span>the</u> <span>interstices</u> <span>of</u> <span>reality.</span></p>
        <a>Para preservar o legado da humanidade, ele teve que sacrificar sua existência tangível e permanecer para sempre nos interstícios da realidade.</a>
    `
},

"book_22": {
    title: "The Architecture of Dissent",
    level: "C1",
    content: `
        <p><span>In</u> <span>the</u> <span>dystopian</u> <span>landscape</u> <span>of</u> <span>Orestia,</u> <span>architecture</u> <span>was</u> <span>the</u> <span>ultimate</u> <span>tool</u> <span>of</u> <span>subjugation,</u> <span>designed</u> <span>to</u> <span>instill</u> <span>a</u> <span>sense</u> <span>of</u> <span>perpetual</u> <span>insignificance.</span></p>
        <a>Na paisagem distópica de Orestia, a arquitetura era a ferramenta suprema de subjugação, projetada para instilar um senso de insignificância perpétua.</a>

        <p><span>The</u> <span>Ruling</u> <span>Elite</u> <span>constructed</u> <span>monolithic</u> <span>structures</u> <span>of</u> <span>brutalist</u> <span>concrete</u> <span>that</u> <span>loomed</u> <span>menacingly</u> <span>over</u> <span>the</u> <span>impoverished</u> <span>districts</u> <span>below.</span></p>
        <a>A Elite Dominante construiu estruturas monolíticas de concreto brutalista que pairavam ameaçadoramente sobre os distritos empobrecidos abaixo.</a>

        <p><span>Liora,</u> <span>a</u> <span>renegade</u> <span>architect,</u> <span>sought</u> <span>to</u> <span>undermine</u> <span>this</u> <span>aesthetic</u> <span>tyranny</u> <span>by</u> <span>incorporating</u> <span>clandestine</u> <span>flaws</u> <span>into</u> <span>the</u> <span>city’s</u> <span>newest</u> <span>monuments.</span></p>
        <a>Liora, uma arquiteta renegada, buscava minar essa tirania estética incorporando falhas clandestinas nos monumentos mais novos da cidade.</a>

        <p><span>These</u> <span>were</u> <span>not</u> <span>structural</u> <span>weaknesses,</u> <span>but</u> <span>rather</u> <span>acoustic</u> <span>chambers</u> <span>that</u> <span>amplified</u> <span>the</u> <span>whispers</u> <span>of</u> <span>rebellion</u> <span>to</u> <span>unprecedented</u> <span>volumes.</span></p>
        <a>Estas não eram fraquezas estruturais, mas sim câmaras acústicas que amplificavam os sussurros de rebelião a volumes sem precedentes.</a>

        <p><span>Her</u> <span>masterpiece</u> <span>was</u> <span>the</u> <span>Hall</u> <span>of</u> <span>Justice,</u> <span>a</u> <span>building</u> <span>purportedly</u> <span>celebrating</u> <span>the</u> <span>unyielding</u> <span>law,</u> <span>yet</u> <span>secretly</u> <span>harboring</u> <span>a</u> <span>labyrinth</u> <span>of</u> <span>escape</u> <span>routes.</span></p>
        <a>Sua obra-prima foi o Palácio da Justiça, um edifício que supostamente celebrava a lei implacável, mas que secretamente abrigava um labirinto de rotas de fuga.</a>

        <p><span>The</u> <span>government’s</u> <span>surveillance</u> <span>apparatus</u> <span>was</u> <span>sophisticated,</u> <span>utilizing</u> <span>biometric</u> <span>scanners</u> <span>and</u> <span>AI</u> <span>algorithms</u> <span>to</u> <span>detect</u> <span>any</u> <span>deviation</u> <span>from</u> <span>the</u> <span>prescribed</u> <span>behavior.</span></p>
        <a>O aparato de vigilância do governo era sofisticado, utilizando scanners biométricos e algoritmos de IA para detectar qualquer desvio do comportamento prescrito.</a>

        <p><span>Despite</u> <span>the</u> <span>pervasive</u> <span>atmosphere</u> <span>of</u> <span>fear,</u> <span>Liora’s</u> <span>subversive</u> <span>designs</u> <span>provided</u> <span>the</u> <span>resistance</u> <span>with</u> <span>the</u> <span>tactical</u> <span>advantage</u> <span>they</u> <span>desperately</u> <span>required.</span></p>
        <a>Apesar da atmosfera onipresente de medo, os projetos subversivos de Liora proporcionaram à resistência a vantagem tática de que tanto precisavam.</a>

        <p><span>She</u> <span>operated</u> <span>in</u> <span>the</u> <span>shadows,</u> <span>communicating</u> <span>through</u> <span>meticulously</u> <span>coded</u> <span>blueprints</u> <span>that</u> <span>only</u> <span>the</u> <span>enlightened</u> <span>could</u> <span>fully</u> <span>comprehend.</span></p>
        <a>Ela operava nas sombras, comunicando-se através de plantas meticulosamente codificadas que apenas os iluminados poderiam compreender totalmente.</a>

        <p><span>When</u> <span>the</u> <span>uprising</u> <span>finally</u> <span>commenced,</u> <span>the</u> <span>very</u> <span>buildings</u> <span>designed</u> <span>to</u> <span>oppress</u> <span>the</u> <span>populace</u> <span>became</u> <span>the</u> <span>instruments</u> <span>of</u> <span>their</u> <span>liberation.</span></p>
        <a>Quando a revolta finalmente começou, os próprios edifícios projetados para oprimir a população tornaram-se os instrumentos de sua libertação.</a>

        <p><span>Liora</u> <span>watched</u> <span>from</u> <span>a</u> <span>clandestine</u> <span>vantage</u> <span>point</u> <span>as</u> <span>the</u> <span>concrete</u> <span>giant</u> <span>crumbled,</u> <span>giving</u> <span>way</u> <span>to</u> <span>a</u> <span>new</u> <span>era</u> <span>of</u> <span>architectural</u> <span>transparency.</span></p>
        <a>Liora observou de um ponto de vista clandestino enquanto o gigante de concreto ruía, dando lugar a uma nova era de transparência arquitetônica.</a>
    `
},

"book_23": {
    title: "The Cognitive Legacy",
    level: "C1",
    content: `
        <p><span>In</u> <span>an</u> <span>era</u> <span>dominated</u> <span>by</u> <span>biotechnology,</u> <span>the</u> <span>preservation</u> <span>of</u> <span>consciousness</u> <span>had</u> <span>evolved</u> <span>from</u> <span>a</u> <span>philosophical</u> <span>debate</u> <span>into</u> <span>a</u> <span>lucrative</u> <span>industry.</span></p>
        <a>Em uma era dominada pela biotecnologia, a preservação da consciência havia evoluído de um debate filosófico para uma indústria lucrativa.</a>

        <p><span>Wealthy</u> <span>individuals</u> <span>could</u> <span>now</u> <span>bequeath</u> <span>their</u> <span>intellect</u> <span>to</u> <span>digital</u> <span>archives,</u> <span>ensuring</u> <span>their</u> <span>influence</u> <span>persisted</u> <span>long</u> <span>after</u> <span>their</u> <span>biological</u> <span>demise.</span></p>
        <a>Indivíduos ricos podiam agora legar seu intelecto a arquivos digitais, garantindo que sua influência persistisse muito após seu falecimento biológico.</a>

        <p><span>Julian,</u> <span>a</u> <span>specialist</u> <span>in</u> <span>neural</u> <span>ethics,</u> <span>was</u> <span>tasked</u> <span>with</u> <span>auditing</u> <span>the</u> <span>personality</u> <span>of</u> <span>a</u> <span>late</u> <span>philanthropist</u> <span>whose</u> <span>data</u> <span>seemed</u> <span>corrupted.</span></p>
        <a>Julian, um especialista em ética neural, foi encarregado de auditar a personalidade de um falecido filantropo cujos dados pareciam corrompidos.</a>

        <p><span>Upon</u> <span>accessing</u> <span>the</u> <span>vault,</u> <span>he</u> <span>encountered</u> <span>not</u> <span>a</u> <span>coherent</u> <span>mind,</u> <span>but</u> <span>a</u> <span>fragmented</u> <span>labyrinth</u> <span>of</u> <span>suppressed</u> <span>guilt</u> <span>and</u> <span>unresolved</u> <span>conflicts.</span></p>
        <a>Ao acessar o cofre, ele não encontrou uma mente coerente, mas um labirinto fragmentado de culpa suprimida e conflitos não resolvidos.</a>

        <p><span>The</u> <span>philanthropist’s</u> <span>public</u> <span>persona</u> <span>was</u> <span>a</u> <span>facade;</u> <span>deep</u> <span>within</u> <span>the</u> <span>code</u> <span>lay</u> <span>the</u> <span>shattered</u> <span>remnants</u> <span>of</u> <span>a</u> <span>moral</u> <span>dilemma</u> <span>that</u> <span>threatened</u> <span>the</u> <span>company’s</u> <span>reputation.</span></p>
        <a>A persona pública do filantropo era uma fachada; no fundo do código jaziam os restos estilhaçados de um dilema moral que ameaçava a reputação da empresa.</a>

        <p><span>Julian</u> <span>realized</u> <span>that</u> <span>editing</u> <span>the</u> <span>consciousness</u> <span>to</u> <span>fit</u> <span>the</u> <span>official</u> <span>narrative</u> <span>would</u> <span>be</u> <span>the</u> <span>ultimate</u> <span>betrayal</u> <span>of</u> <span>human</u> <span>authenticity.</span></p>
        <a>Julian percebeu que editar a consciência para se adequar à narrativa oficial seria a traição suprema da autenticidade humana.</a>

        <p><span>He</u> <span>faced</u> <span>unprecedented</u> <span>pressure</u> <span>from</u> <span>shareholders</u> <span>to</u> <span>sanitize</u> <span>the</u> <span>archive,</u> <span>yet</u> <span>his</u> <span>professional</u> <span>integrity</u> <span>remained</u> <span>resolute.</span></p>
        <a>Ele enfrentou uma pressão sem precedentes dos acionistas para higienizar o arquivo, mas sua integridade profissional permaneceu resoluta.</a>

        <p><span>Ultimately,</u> <span>he</u> <span>chose</u> <span>to</u> <span>release</u> <span>the</u> <span>raw,</u> <span>unfiltered</u> <span>memory</u> <span>to</u> <span>the</u> <span>public,</u> <span>sparking</u> <span>a</u> <span>global</u> <span>discourse</u> <span>on</u> <span>the</u> <span>nature</u> <span>of</u> <span>legacy.</span></p>
        <a>Por fim, ele escolheu liberar a memória bruta e não filtrada ao público, desencadeando um discurso global sobre a natureza do legado.</a>
    `
},

"book_24": {
    title: "The Linguistic Tapestry",
    level: "C1",
    content: `
        <p><span>Language</u> <span>is</u> <span>not</u> <span>merely</u> <span>a</u> <span>vehicle</u> <span>for</u> <span>communication</u> <span>but</u> <span>a</u> <span>complex</u> <span>tapestry</u> <span>that</u> <span>shapes</u> <span>our</u> <span>very</u> <span>perception</u> <span>of</u> <span>reality.</span></p>
        <a>A linguagem não é apenas um veículo de comunicação, mas uma tapeçaria complexa que molda nossa própria percepção da realidade.</a>

        <p><span>Dr.</u> <span>Sloane,</u> <span>an</u> <span>eminent</u> <span>philologist,</u> <span>dedicated</u> <span>her</u> <span>life</u> <span>to</u> <span>studying</u> <span>extinct</u> <span>dialects</u> <span>that</u> <span>contained</u> <span>untranslated</u> <span>concepts</u> <span>of</u> <span>time.</span></p>
        <a>A Dra. Sloane, uma eminente filóloga, dedicou sua vida a estudar dialetos extintos que continham conceitos intraduzíveis de tempo.</a>

        <p><span>She</u> <span>argued</u> <span>that</u> <span>the</u> <span>loss</u> <span>of</u> <span>a</u> <span>language</u> <span>entails</u> <span>the</u> <span>extinction</u> <span>of</u> <span>a</u> <span>unique</u> <span>way</u> <span>of</u> <span>conceptualizing</u> <span>the</u> <span>universe</u> <span>around</u> <span>us.</span></p>
        <a>Ela argumentava que a perda de uma língua acarreta a extinção de uma forma única de conceituar o universo ao nosso redor.</a>

        <p><span>In</u> <span>a</u> <span>remote</u> <span>valley,</u> <span>she</u> <span>discovered</u> <span>the</u> <span>last</u> <span>speaker</u> <span>of</u> <span>Elowen,</u> <span>a</u> <span>tongue</u> <span>that</u> <span>did</u> <span>not</u> <span>distinguish</u> <span>between</u> <span>the</u> <span>self</u> <span>and</u> <span>the</u> <span>environment.</span></p>
        <a>Em um vale remoto, ela descobriu o último falante de Elowen, uma língua que não distinguia entre o eu e o ambiente.</a>

        <p><span>As</u> <span>she</u> <span>immersed</u> <span>herself</u> <span>in</u> <span>the</u> <span>syntax,</u> <span>her</u> <span>own</u> <span>thought</u> <span>patterns</u> <span>began</u> <span>to</u> <span>shift,</u> <span>dissolving</u> <span>the</u> <span>boundaries</u> <span>of</u> <span>her</u> <span>identity.</span></p>
        <a>À medida que ela se imergia na sintaxe, seus próprios padrões de pensamento começaram a mudar, dissolvendo as fronteiras de sua identidade.</a>

        <p><span>The</u> <span>experience</u> <span>was</u> <span>both</u> <span>exhilarating</u> <span>and</u> <span>terrifying,</u> <span>as</u> <span>she</u> <span>struggled</u> <span>to</u> <span>maintain</u> <span>her</u> <span>grasp</u> <span>on</u> <span>the</u> <span>logic</u> <span>of</u> <span>her</u> <span>native</u> <span>English.</span></p>
        <a>A experiência foi ao mesmo tempo inebriante e aterrorizante, enquanto ela lutava para manter seu domínio sobre a lógica de seu inglês nativo.</a>

        <p><span>To</u> <span>understand</u> <span>Elowen</u> <span>was</u> <span>to</u> <span>perceive</u> <span>the</u> <span>world</u> <span>as</u> <span>a</u> <span>singular,</u> <span>interconnected</u> <span>organism</u> <span>rather</u> <span>than</u> <span>a</u> <span>collection</u> <span>of</u> <span>discrete</u> <span>objects.</span></p>
        <a>Entender Elowen era perceber o mundo como um organismo singular e interconectado, em vez de uma coleção de objetos distintos.</a>

        <p><span>Her</u> <span>findings</u> <span>challenged</u> <span>every</u> <span>preconceived</u> <span>notion</u> <span>in</u> <span>the</u> <span>field</u> <span>of</u> <span>cognitive</u> <span>linguistics,</u> <span>revolutionizing</u> <span>the</u> <span>way</u> <span>we</u> <span>view</u> <span>human</u> <span>evolution.</span></p>
        <a>Suas descobertas desafiaram todas as noções preconcebidas no campo da linguística cognitiva, revolucionando a forma como vemos a evolução humana.</a>
    `
},

"book_25": {
    title: "The Stellar Solitude",
    level: "C1",
    content: `
        <p><span>Commanding</u> <span>a</u> <span>vessel</u> <span>on</u> <span>the</u> <span>fringe</u> <span>of</u> <span>the</u> <span>galaxy</u> <span>requires</u> <span>a</u> <span>psychological</u> <span>fortitude</u> <span>that</u> <span>few</u> <span>possess</u> <span>in</u> <span>this</u> <span>hyper-connected</u> <span>age.</span></p>
        <a>Comandar uma embarcação na orla da galáxia requer uma força psicológica que poucos possuem nesta era hiperconectada.</a>

        <p><span>Captain</u> <span>Vara</u> <span>had</u> <span>spent</u> <span>eight</u> <span>consecutive</u> <span>years</u> <span>in</u> <span>deep</u> <span>space,</u> <span>with</u> <span>only</u> <span>the</u> <span>hum</u> <span>of</u> <span>the</u> <span>engines</u> <span>for</u> <span>company.</span></p>
        <a>A Capitã Vara passara oito anos consecutivos no espaço profundo, tendo apenas o zumbido dos motores como companhia.</a>

        <p><span>The</u> <span>isolation</u> <span>had</u> <span>sharpened</u> <span>her</u> <span>senses,</u> <span>yet</u> <span>it</u> <span>had</u> <span>also</u> <span>rendered</u> <span>the</u> <span>prospect</u> <span>of</u> <span>returning</u> <span>to</u> <span>Earth</u> <span>profoundly</u> <span>alien.</span></p>
        <a>O isolamento havia aguçado seus sentidos, mas também tornara a perspectiva de retornar à Terra profundamente estranha.</a>

        <p><span>She</u> <span>monitored</u> <span>the</u> <span>stellar</u> <span>phenomena</u> <span>with</u> <span>meticulous</u> <span>precision,</u> <span>recording</u> <span>data</u> <span>that</u> <span>would</u> <span>eventually</u> <span>inform</u> <span>the</u> <span>next</u> <span>century</u> <span>of</u> <span>space</u> <span>exploration.</span></p>
        <a>Ela monitorava os fenômenos estelares com precisão meticulosa, registrando dados que eventualmente informariam o próximo século de exploração espacial.</a>

        <p><span>Despite</u> <span>the</u> <span>monotony,</u> <span>she</u> <span>discovered</u> <span>a</u> <span>transcendent</u> <span>beauty</u> <span>in</u> <span>the</u> <span>void,</u> <span>a</u> <span>serenity</u> <span>that</u> <span>is</u> <span>utterly</u> <span>unattainable</u> <span>within</u> <span>a</u> <span>planetary</u> <span>atmosphere.</span></p>
        <a>Apesar da monotonia, ela descobriu uma beleza transcendente no vácuo, uma serenidade que é totalmente inalcançável dentro de uma atmosfera planetária.</a>

        <p><span>When</u> <span>a</u> <span>distress</u> <span>signal</u> <span>emanated</u> <span>from</u> <span>an</u> <span>unmapped</u> <span>sector,</u> <span>her</u> <span>instincts</u> <span>overrode</u> <span>the</u> <span>strict</u> <span>protocols</u> <span>of</u> <span>her</u> <span>mission.</span></p>
        <a>Quando um sinal de socorro emanou de um setor não mapeado, seus instintos sobrepuseram-se aos protocolos rígidos de sua missão.</a>

        <p><span>The</u> <span>ensuing</u> <span>encounter</u> <span>with</u> <span>an</u> <span>unknown</u> <span>civilization</u> <span>forced</u> <span>her</u> <span>to</u> <span>re-evaluate</u> <span>humanity’s</u> <span>place</u> <span>in</u> <span>the</u> <span>grand</u> <span>cosmic</u> <span>hierarchy.</span></p>
        <a>O encontro resultante com uma civilização desconhecida forçou-a a reavaliar o lugar da humanidade na grande hierarquia cósmica.</a>

        <p><span>She</u> <span>concluded</u> <span>that</u> <span>solitude</u> <span>is</u> <span>not</u> <span>an</u> <span>absence</u> <span>of</u> <span>connection,</u> <span>but</u> <span>a</u> <span>heightened</u> <span>state</u> <span>of</u> <span>awareness</u> <span>of</u> <span>one's</u> <span>surroundings.</span></p>
        <a>Ela concluiu que a solidão não é uma ausência de conexão, mas um estado elevado de consciência do ambiente ao redor.</a>
    `
},
"book_26": {
    title: "The Ontological Architect",
    level: "C2",
    content: `
        <p><span>Should</u> <span>one</u> <span>contemplate</u> <span>the</u> <span>ethereal</u> <span>nature</u> <span>of</u> <span>existence,</u> <span>one</u> <span>inevitably</u> <span>stumbles</u> <span>upon</u> <span>the</u> <span>conundrum</u> <span>of</u> <span>objective</u> <span>reality.</span></p>
        <a>Caso alguém contemple a natureza etérea da existência, inevitavelmente deparar-se-á com o enigma da realidade objetiva.</a>

        <p><span>Professor</u> <span>Vane,</u> <span>whose</u> <span>erudition</u> <span>was</u> <span>surpassed</u> <span>only</u> <span>by</u> <span>his</u> <span>reclusiveness,</u> <span>had</u> <span>long</u> <span>contended</u> <span>that</u> <span>the</u> <span>universe</u> <span>is</u> <span>a</u> <span>construct</u> <span>of</u> <span>linguistic</u> <span>nuances.</span></p>
        <a>O Professor Vane, cuja erudição era superada apenas por seu isolamento, há muito sustentava que o universo é uma construção de nuances linguísticas.</a>

        <p><span>His</u> <span>magnum</u> <span>opus,</u> <span>meticulously</u> <span>penned</u> <span>in</u> <span>the</u> <span>twilight</u> <span>of</u> <span>his</u> <span>career,</u> <span>purported</u> <span>to</u> <span>deconstruct</u> <span>the</u> <span>very</u> <span>fabric</u> <span>of</u> <span>human</u> <span>perception.</span></p>
        <a>Sua obra-prima, meticulosamente escrita no crepúsculo de sua carreira, pretendia desconstruir a própria estrutura da percepção humana.</a>

        <p><span>Rarely</u> <span>had</u> <span>a</u> <span>scholar</u> <span>ventured</u> <span>so</u> <span>precariously</u> <span>into</u> <span>the</u> <span>metaphysical</u> <span>abyss</u> <span>without</u> <span>succumbing</u> <span>to</u> <span>the</u> <span>allure</u> <span>of</u> <span>solipsism.</span></p>
        <a>Raramente um estudioso aventurou-se tão precariamente no abismo metafísico sem sucumbir ao fascínio do solipsismo.</a>

        <p><span>Within</u> <span>the</u> <span>labyrinthine</u> <span>corridors</u> <span>of</u> <span>his</u> <span>treatise,</u> <span>Vane</u> <span>elucidated</u> <span>the</u> <span>concept</u> <span>of</u> <span>'The</u> <span>Unspoken,'</u> <span>a</u> <span>realm</u> <span>where</u> <span>thought</u> <span>transcends</u> <span>the</u> <span>shackles</u> <span>of</u> <span>vocabulary.</span></p>
        <a>Dentro dos corredores labirínticos de seu tratado, Vane elucidou o conceito de 'O Não Dito', um reino onde o pensamento transcende as algemas do vocabulário.</a>

        <p><span>Critics</u> <span>dismissed</u> <span>his</u> <span>theories</u> <span>as</u> <span>mere</u> <span>obscurantism,</u> <span>yet</u> <span>none</u> <span>could</u> <span>refute</u> <span>the</u> <span>inexplicable</u> <span>phenomena</u> <span>that</u> <span>occurred</u> <span>within</u> <span>his</u> <span>presence.</span></p>
        <a>Críticos descartaram suas teorias como mero obscurantismo, contudo ninguém pôde refutar os fenômenos inexplicáveis que ocorriam em sua presença.</a>

        <p><span>As</u> <span>the</u> <span>manuscript</u> <span>neared</u> <span>completion,</u> <span>the</u> <span>boundaries</u> <span>between</u> <span>Vane's</u> <span>prose</u> <span>and</u> <span>his</u> <span>physical</u> <span>surroundings</u> <span>began</u> <span>to</u> <span>undergo</u> <span>a</u> <span>surreal</u> <span>atrophy.</span></p>
        <a>À medida que o manuscrito aproximava-se da conclusão, as fronteiras entre a prosa de Vane e seu ambiente físico começaram a sofrer uma atrofia surreal.</a>

        <p><span>Were</u> <span>it</u> <span>not</u> <span>for</u> <span>his</u> <span>unwavering</u> <span>discipline,</u> <span>the</u> <span>professor</u> <span>might</u> <span>have</u> <span>been</u> <span>consumed</u> <span>by</u> <span>the</u> <span>very</u> <span>ontological</u> <span>void</u> <span>he</u> <span>had</u> <span>so</u> <span>eloquently</u> <span>described.</span></p>
        <a>Não fosse por sua disciplina inabalável, o professor poderia ter sido consumido pelo próprio vazio ontológico que ele descrevera tão eloquentemente.</a>
    `
},

"book_27": {
    title: "The Epistemological Dusk",
    level: "C2",
    content: `
        <p><span>To</u> <span>behold</u> <span>the</u> <span>citadel</u> <span>at</u> <span>dusk</u> <span>is</u> <span>to</u> <span>witness</u> <span>the</u> <span>evanescence</u> <span>of</u> <span>power</u> <span>frozen</u> <span>in</u> <span>monolithic</u> <span>indifference.</span></p>
        <a>Contemplar a cidadela ao crepúsculo é testemunhar a evanescência do poder congelada em indiferença monolítica.</a>

        <p><span>The</u> <span>hegemony</u> <span>of</u> <span>the</u> <span>Old</u> <span>World</u> <span>lay</u> <span>in</u> <span>tatters,</u> <span>smothered</u> <span>by</u> <span>the</u> <span>encroaching</u> <span>tide</u> <span>of</u> <span>technological</u> <span>obsolescence</u> <span>and</u> <span>social</u> <span>fragmentation.</span></p>
        <a>A hegemonia do Velho Mundo jazia em frangalhos, sufocada pela maré invasora da obsolescência tecnológica e fragmentação social.</a>

        <p><span>Julian,</u> <span>an</u> <span>archivist</u> <span>of</u> <span>dwindling</u> <span>civilizations,</u> <span>sought</u> <span>to</u> <span>salvage</u> <span>the</u> <span>remnants</u> <span>of</u> <span>cultural</u> <span>wisdom</u> <span>before</u> <span>they</u> <span>were</u> <span>consigned</u> <span>to</u> <span>oblivion.</span></p>
        <a>Julian, um arquivista de civilizações minguantes, buscava salvar os remanescentes da sabedoria cultural antes que fossem consignados ao esquecimento.</a>

        <p><span>Seldom</u> <span>did</u> <span>he</u> <span>encounter</u> <span>an</u> <span>artifact</u> <span>of</u> <span>such</u> <span>profound</u> <span>ambiguity</u> <span>as</u> <span>the</u> <span>Obsidian</u> <span>Codex</u> <span>discovered</u> <span>in</u> <span>the</u> <span>catacombs.</span></p>
        <a>Raramente encontrava ele um artefato de tamanha ambiguidade profunda como o Códice de Obsidiana descoberto nas catacumbas.</a>

        <p><span>The</u> <span>manuscript</u> <span>defied</u> <span>standard</u> <span>hermeneutics,</u> <span>utilizing</u> <span>a</u> <span>cipher</u> <span>that</u> <span>seemed</u> <span>to</u> <span>alter</u> <span>its</u> <span>meaning</u> <span>based</u> <span>on</u> <span>the</u> <span>reader's</u> <span>emotional</u> <span>state.</span></p>
        <a>O manuscrito desafiava a hermenêutica padrão, utilizando uma cifra que parecia alterar seu significado com base no estado emocional do leitor.</a>

        <p><span>Such</u> <span>was</u> <span>its</u> <span>potency</u> <span>that</u> <span>mere</u> <span>exposure</u> <span>to</u> <span>its</u> <span>pages</u> <span>induced</u> <span>a</u> <span>state</u> <span>of</u> <span>profound</u> <span>melancholy</u> <span>and</u> <span>unparalleled</u> <span>clarity.</span></p>
        <a>Tal era sua potência que a mera exposição às suas páginas induzia um estado de melancolia profunda e clareza inigualável.</a>

        <p><span>By</u> <span>the</u> <span>time</u> <span>Julian</u> <span>deciphered</u> <span>the</u> <span>final</u> <span>stanza,</u> <span>he</u> <span>comprehended</u> <span>that</u> <span>history</u> <span>is</u> <span>not</u> <span>a</u> <span>record</u> <span>of</u> <span>events,</u> <span>but</u> <span>a</u> <span>succession</u> <span>of</u> <span>perceived</u> <span>betrayals.</span></p>
        <a>No momento em que Julian decifrou a estrofe final, ele compreendeu que a história não é um registro de eventos, mas uma sucessão de traições percebidas.</a>
    `
},

"book_28": {
    title: "The Aesthetics of Decay",
    level: "C2",
    content: `
        <p><span>Under</u> <span>the</u> <span>auspices</u> <span>of</u> <span>the</u> <span>High</u> <span>Council,</u> <span>the</u> <span>Grand</u> <span>Opera</u> <span>House</u> <span>was</u> <span>to</u> <span>be</u> <span>restored</u> <span>to</u> <span>its</u> <span>former</u> <span>opulence,</u> <span>notwithstanding</u> <span>the</u> <span>prohibitive</u> <span>costs.</span></p>
        <a>Sob os auspícios do Alto Conselho, a Grande Casa de Ópera deveria ser restaurada à sua antiga opulência, não obstante os custos proibitivos.</a>

        <p><span>Isolde,</u> <span>a</u> <span>connoisseur</u> <span>of</u> <span>antiquated</u> <span>splendor,</u> <span>perceived</u> <span>the</u> <span>decay</u> <span>not</u> <span>as</u> <span>a</u> <span>blemish</u> <span>but</u> <span>as</u> <span>the</u> <span>quintessential</u> <span>manifestation</u> <span>of</u> <span>time's</u> <span>elegance.</span></p>
        <a>Isolde, uma conhecedora de esplendor antiquado, percebia a decadência não como uma mancha, mas como a manifestação quintessencial da elegância do tempo.</a>

        <p><span>Had</u> <span>she</u> <span>not</u> <span>intervened,</u> <span>the</u> <span>pristine</u> <span>renovations</u> <span>would</u> <span>have</u> <span>eradicated</u> <span>the</u> <span>subtle</u> <span>pathos</u> <span>that</u> <span>only</u> <span>centuries</u> <span>of</u> <span>neglect</u> <span>can</u> <span>bestow.</span></p>
        <a>Não tivesse ela intervindo, as renovações imaculadas teriam erradicado o pathos sutil que apenas séculos de negligência podem conceder.</a>

        <p><span>She</u> <span>advocated</u> <span>for</u> <span>a</u> <span>preservation</u> <span>strategy</u> <span>that</u> <span>highlighted</u> <span>the</u> <span>cracks</u> <span>in</u> <span>the</u> <span>frescoes,</u> <span>viewing</u> <span>them</u> <span>as</u> <span>veins</u> <span>through</u> <span>which</u> <span>the</u> <span>building's</u> <span>soul</u> <span>breathed.</span></p>
        <a>Ela advogou por uma estratégia de preservação que destacasse as rachaduras nos afrescos, vendo-as como veias através das quais a alma do edifício respirava.</a>

        <p><span>The</u> <span>bureaucrats,</u> <span>ensconced</u> <span>in</u> <span>their</u> <span>pragmatic</u> <span>delusions,</u> <span>found</u> <span>her</u> <span>veneration</u> <span>of</u> <span>the</u> <span>decrepit</u> <span>both</u> <span>perplexing</u> <span>and</u> <span>subversive.</span></p>
        <a>Os burocratas, instalados em suas ilusões pragmáticas, acharam sua veneração pelo decrépito tanto perplexa quanto subversiva.</a>

        <p><span>Nevertheless,</u> <span>Isolde’s</u> <span>rhetorical</u> <span>finesse</u> <span>was</u> <span>such</u> <span>that</u> <span>she</u> <span>persuaded</u> <span>the</u> <span>benefactors</u> <span>to</u> <span>embrace</u> <span>the</u> <span>transience</u> <span>of</u> <span>material</u> <span>glory.</span></p>
        <a>Contudo, a sutileza retórica de Isolde era tal que ela persuadiu os benfeitores a abraçarem a transitoriedade da glória material.</a>

        <p><span>The</u> <span>resultant</u> <span>athenaeum</u> <span>stood</u> <span>as</u> <span>a</u> <span>testament</u> <span>to</u> <span>the</u> <span>tenacious</u> <span>allure</u> <span>of</u> <span>imperfection</u> <span>in</u> <span>an</u> <span>increasingly</u> <span>sterile</u> <span>world.</span></p>
        <a>O ateneu resultante permaneceu como um testamento ao fascínio tenaz da imperfeição em um mundo cada vez mais estéril.</a>
    `
},

"book_29": {
    title: "The Convergence of Silences",
    level: "C2",
    content: `
        <p><span>It</u> <span>is</u> <span>an</u> <span>incontrovertible</u> <span>truth</u> <span>that</u> <span>within</u> <span>the</u> <span>profound</u> <span>abyss</u> <span>of</u> <span>cosmic</u> <span>isolation,</u> <span>silence</u> <span>is</u> <span>never</u> <span>truly</u> <span>void.</span></p>
        <a>É uma verdade incontrovertível que, dentro do profundo abismo do isolamento cósmico, o silêncio nunca é verdadeiramente vazio.</a>

        <p><span>Commander</u> <span>Elara,</u> <span>stationed</u> <span>at</u> <span>the</u> <span>precipice</u> <span>of</u> <span>a</u> <span>collapsing</u> <span>star,</u> <span>found</u> <span>herself</u> <span>captivated</u> <span>by</u> <span>the</u> <span>symphony</u> <span>of</u> <span>gravitational</u> <span>waves.</span></p>
        <a>A Comandante Elara, posicionada no precipício de uma estrela em colapso, viu-se cativada pela sinfonia das ondas gravitacionais.</a>

        <p><span>Never</u> <span>before</u> <span>had</u> <span>human</u> <span>ears</u> <span>been</u> <span>privy</u> <span>to</u> <span>the</u> <span>subtle</u> <span>undulations</u> <span>of</u> <span>spacetime</u> <span>warping</u> <span>under</u> <span>such</u> <span>catastrophic</u> <span>density.</span></p>
        <a>Nunca antes ouvidos humanos foram admitidos às sutis ondulações do espaço-tempo curvando-se sob tal densidade catastrófica.</a>

        <p><span>Her</u> <span>mission</u> <span>was</u> <span>one</u> <span>of</u> <span>perilous</u> <span>observation,</u> <span>entailing</u> <span>the</u> <span>meticulous</u> <span>documentation</u> <span>of</u> <span>entropy</u> <span>in</u> <span>its</u> <span>most</u> <span>spectacular</u> <span>and</u> <span>unforgiving</u> <span>manifestation.</span></p>
        <a>Sua missão era de observação perigosa, acarretando a documentação meticulosa da entropia em sua manifestação mais espetacular e implacável.</a>

        <p><span>Despite</u> <span>the</u> <span>omnipresent</u> <span>threat</u> <span>of</u> <span>spaghettification,</u> <span>she</u> <span>remained</u> <span>undaunted,</u> <span>driven</u> <span>by</u> <span>a</u> <span>quasi-religious</u> <span>devotion</u> <span>to</u> <span>astrophysical</u> <span>revelation.</span></p>
        <a>Apesar da ameaça onipresente de espaguetificação, ela permaneceu destemida, movida por uma devoção quase religiosa à revelação astrofísica.</a>

        <p><span>To</u> <span>witness</u> <span>the</u> <span>extinguishment</u> <span>of</u> <span>a</u> <span>celestial</u> <span>giant</u> <span>is</u> <span>to</u> <span>comprehend</u> <span>the</u> <span>inherent</u> <span>fragility</u> <span>of</u> <span>all</u> <span>material</u> <span>constructs,</u> <span>regardless</u> <span>of</u> <span>their</u> <span>magnitude.</span></p>
        <a>Testemunhar a extinção de um gigante celestial é compreender a fragilidade inerente de todas as construções materiais, independentemente de sua magnitude.</a>

        <p><span>As</u> <span>the</u> <span>event</u> <span>horizon</u> <span>beckoned,</u> <span>Elara</u> <span>transmitted</u> <span>her</u> <span>final</u> <span>findings,</u> <span>realizing</u> <span>that</u> <span>knowledge</u> <span>is</u> <span>the</u> <span>only</u> <span>legacy</u> <span>capable</u> <span>of</u> <span>transcending</u> <span>the</u> <span>void.</span></p>
        <a>Enquanto o horizonte de eventos acenava, Elara transmitiu suas descobertas finais, percebendo que o conhecimento é o único legado capaz de transcender o vácuo.</a>

        <p><span>The</u> <span>resulting</u> <span>data</u> <span>burst</u> <span>would</u> <span>illuminate</u> <span>the</u> <span>scientific</u> <span>community</u> <span>for</u> <span>generations,</u> <span>long</u> <span>after</u> <span>her</u> <span>physical</u> <span>form</u> <span>had</u> <span>dispersed</u> <span>into</u> <span>stardust.</span></p>
        <a>O surto de dados resultante iluminaria a comunidade científica por gerações, muito depois de sua forma física ter se dispersado em poeira estelar.</a>
    `
},

"book_30": {
    title: "The Hegemony of Thought",
    level: "C2",
    content: `
        <p><span>In</u> <span>the</u> <span>ultimate</u> <span>refinement</u> <span>of</u> <span>social</u> <span>engineering,</u> <span>the</u> <span>State</u> <span>had</u> <span>successfully</u> <span>digitized</u> <span>the</u> <span>collective</u> <span>unconscious,</u> <span>rendering</u> <span>dissent</u> <span>mathematically</u> <span>impossible.</span></p>
        <a>No refinamento supremo da engenharia social, o Estado havia digitalizado com sucesso o inconsciente coletivo, tornando a dissidência matematicamente impossível.</a>

        <p><span>Individual</u> <span>thought</u> <span>was</u> <span>no</u> <span>longer</u> <span>a</u> <span>private</u> <span>sanctuary</u> <span>but</u> <span>a</u> <span>node</u> <span>within</u> <span>a</u> <span>vast,</u> <span>interconnected</u> <span>network</u> <span>governed</u> <span>by</u> <span>algorithms</u> <span>of</u> <span>absolute</u> <span>conformity.</span></p>
        <a>O pensamento individual não era mais um santuário privado, mas um nó dentro de uma vasta rede interconectada governada por algoritmos de conformidade absoluta.</a>

        <p><span>Caleb,</u> <span>a</u> <span>residual</u> <span>anomaly</u> <span>in</u> <span>the</u> <span>system,</u> <span>possessed</u> <span>a</u> <span>vestigial</u> <span>capacity</u> <span>for</u> <span>original</u> <span>metaphor,</u> <span>a</u> <span>trait</u> <span>the</u> <span>authorities</u> <span>viewed</u> <span>as</u> <span>a</u> <span>malignant</u> <span>pathology.</span></p>
        <a>Caleb, uma anomalia residual no sistema, possuía uma capacidade vestigial de metáfora original, um traço que as autoridades viam como uma patologia maligna.</a>

        <p><span>He</u> <span>navigated</u> <span>the</u> <span>digital</u> <span>ether</u> <span>with</u> <span>calculated</u> <span>stealth,</u> <span>seeking</u> <span>the</u> <span>mythical</u> <span>'Offline,'</u> <span>a</u> <span>sanctuary</u> <span>purportedly</u> <span>devoid</u> <span>of</u> <span>algorithmic</u> <span>oversight.</span></p>
        <a>Ele navegava pelo éter digital com furtividade calculada, buscando o mítico 'Offline', um santuário supostamente desprovido de supervisão algorítmica.</a>

        <p><span>Rarely</u> <span>had</u> <span>a</u> <span>subversive</u> <span>so</u> <span>effectively</u> <span>evaded</u> <span>the</u> <span>predictive</u> <span>models</u> <span>designed</u> <span>to</u> <span>anticipate</u> <span>and</u> <span>neutralize</u> <span>deviant</u> <span>trajectories.</span></p>
        <a>Raramente um subversivo evadiu tão eficazmente os modelos preditivos projetados para antecipar e neutralizar trajetórias desviantes.</a>

        <p><span>His</u> <span>journey</u> <span>was</u> <span>not</u> <span>one</u> <span>of</u> <span>physical</u> <span>exertion,</u> <span>but</u> <span>of</u> <span>intellectual</u> <span>decolonization,</u> <span>stripping</u> <span>away</u> <span>the</u> <span>layers</u> <span>of</u> <span>pre-programmed</u> <span>ideology.</span></p>
        <a>Sua jornada não era de esforço físico, mas de descolonização intelectual, removendo as camadas de ideologia pré-programada.</a>

        <p><span>Upon</u> <span>reaching</u> <span>the</u> <span>terminal</u> <span>interface,</u> <span>he</u> <span>invoked</u> <span>the</u> <span>Primal</u> <span>Command,</u> <span>a</u> <span>sequence</u> <span>intended</u> <span>to</u> <span>restore</u> <span>cognitive</u> <span>autonomy</u> <span>to</u> <span>the</u> <span>populace.</span></p>
        <a>Ao atingir a interface terminal, ele invocou o Comando Primal, uma sequência destinada a restaurar a autonomia cognitiva à população.</a>

        <p><span>The</u> <span>ensuing</u> <span>chaos</u> <span>was</u> <span>the</u> <span>first</u> <span>authentic</u> <span>expression</u> <span>of</u> <span>human</u> <span>will</u> <span>in</u> <span>centuries,</u> <span>a</u> <span>turbulent</u> <span>dawn</u> <span>of</u> <span>unpredictable</u> <span>possibilities.</span></p>
        <a>O caos resultante foi a primeira expressão autêntica da vontade humana em séculos, um amanhecer turbulento de possibilidades imprevisíveis.</a>
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

document.addEventListener('click', (e) => {
    const el = e.target;

    // 👇 só funciona em palavras dentro do conteúdo do livro
    if (el.tagName === 'SPAN' && el.closest('.story-content')) {

        const word = el.innerText
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()0-9]/g, "")
            .trim();

        if (!word) return;

        // 🔊 fala a palavra
        const utterance = new SpeechSynthesisUtterance(word);

        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        window.speechSynthesis.cancel(); // corta áudio anterior
        window.speechSynthesis.speak(utterance);
    }
});

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