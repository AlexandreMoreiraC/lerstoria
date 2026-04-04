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
"book_tree": {
    title: "Saturn Exploded",
    level: "A1",
    content: `
        <p><span>Saturn</span> <span>is</span> <span>a</span> <span>very</span> <span>big</span> <span>planet</span> <span>in</span> <span>the</span> <span>sky</span>. <span>It</span> <span>has</span> <span>many</span> <span>rings</span>. <span>The</span> <span>rings</span> <span>are</span> <span>beautiful</span> <span>and</span> <span>bright</span>. <span>One day</span>, <span>a</span> <span>small</span> <span>boy</span> <span>looks at</span> <span>the</span> <span>stars</span>. <span>He</span> <span>has</span> <span>a</span> <span>big</span> <span>telescope</span>. <span>He</span> <span>sees</span> <span>Saturn</span>. <span>But</span> <span>then</span>, <span>something</span> <span>happens</span>. <span>Saturn</span> <span>is</span> <span>not</span> <span>there</span>. <span>There is</span> <span>a</span> <span>big</span> <span>flash</span> <span>of</span> <span>light</span>.</p>
        
        <p><span>The</span> <span>boy</span> <span>is</span> <span>very</span> <span>surprised</span>. "<span>Where</span> <span>is</span> <span>Saturn</span>?" <span>he</span> <span>asks</span>. <span>He</span> <span>runs</span> <span>to</span> <span>his</span> <span>father</span>. <span>His</span> <span>father</span> <span>is</span> <span>a</span> <span>scientist</span>. <span>The</span> <span>father</span> <span>looks at</span> <span>the</span> <span>sky</span>. <span>He</span> <span>sees</span> <span>the</span> <span>light</span> <span>too</span>. <span>They</span> <span>are</span> <span>both</span> <span>quiet</span> <span>for</span> <span>a</span> <span>long time</span>. <span>It</span> <span>is</span> <span>a</span> <span>mystery</span>. <span>The</span> <span>next day</span>, <span>the</span> <span>news</span> <span>is</span> <span>on</span> <span>TV</span>. <span>Everyone</span> <span>is</span> <span>talking</span> <span>about</span> <span>the</span> <span>planet</span>.</p>
        
        <p><span>The</span> <span>boy</span> <span>thinks</span> <span>about</span> <span>the</span> <span>rings</span>. <span>He</span> <span>thinks</span> <span>about</span> <span>the</span> <span>dust</span> <span>and</span> <span>the</span> <span>ice</span>. <span>He</span> <span>wants</span> <span>to</span> <span>know</span> <span>the</span> <span>truth</span>. <span>Was</span> <span>it</span> <span>a</span> <span>bomb</span>? <span>Was</span> <span>it</span> <span>a</span> <span>rock</span>? <span>The</span> <span>science</span> <span>books</span> <span>say</span> <span>planets</span> <span>are</span> <span>very</span> <span>strong</span>. <span>But</span> <span>Saturn</span> <span>is</span> <span>gone</span> <span>now</span>. <span>The</span> <span>sky</span> <span>looks</span> <span>different</span> <span>at</span> <span>night</span>. <span>The</span> <span>stars</span> <span>are</span> <span>still</span> <span>there</span>, <span>but</span> <span>the</span> <span>giant</span> <span>is</span> <span>not</span>.</p>
        
        <p><span>He</span> <span>dreams</span> <span>of</span> <span>traveling</span> <span>to</span> <span>the</span> <span>place</span> <span>where</span> <span>Saturn</span> <span>was</span>. <span>He</span> <span>wants</span> <span>to</span> <span>find</span> <span>a</span> <span>small</span> <span>piece</span> <span>of</span> <span>the</span> <span>ring</span>. <span>He</span> <span>wants</span> <span>to</span> <span>keep</span> <span>it</span> <span>in</span> <span>a</span> <span>jar</span>. <span>It</span> <span>is</span> <span>a</span> <span>sad</span> <span>day</span> <span>for</span> <span>astronomy</span>, <span>but</span> <span>a</span> <span>big</span> <span>day</span> <span>for</span> <span>his</span> <span>imagination</span>. <span>The</span> <span>universe</span> <span>is</span> <span>full of</span> <span>secrets</span>. <span>He</span> <span>looks at</span> <span>his</span> <span>telescope</span> <span>one last time</span> <span>before</span> <span>bed</span>.</p>
    `
},
   "a1_pet": {
        title: "The Happy Dog",
        level: "A1",
        content: `
            <p><span>Max</span> <span>is</span> <span>a</span> <span>dog</span>. <span>He</span> <span>is</span> <span>a</span> <span>very</span> <span>happy</span> <span>dog</span>. <span>Max</span> <span>lives</span> <span>in</span> <span>a</span> <span>big</span> <span>house</span> <span>with</span> <span>a</span> <span>garden</span>. <span>He</span> <span>has</span> <span>a</span> <span>friend</span> <span>named</span> <span>Leo</span>. <span>Leo</span> <span>is</span> <span>a</span> <span>small</span> <span>cat</span>. <span>Every</span> <span>morning</span>, <span>Max</span> <span>wakes up</span> <span>at</span> <span>seven o'clock</span>. <span>He</span> <span>eats</span> <span>his</span> <span>food</span> <span>and</span> <span>drinks</span> <span>some</span> <span>water</span>. <span>Then</span>, <span>he</span> <span>goes to</span> <span>the</span> <span>garden</span> <span>to</span> <span>play</span>.</p>
            <p><span>The</span> <span>ball</span> <span>is</span> <span>blue</span> <span>and</span> <span>green</span>. <span>Max</span> <span>runs</span> <span>very</span> <span>fast</span>. <span>He</span> <span>likes</span> <span>the</span> <span>sun</span> <span>and</span> <span>the</span> <span>grass</span>. <span>In the afternoon</span>, <span>Max</span> <span>and</span> <span>Leo</span> <span>sleep</span> <span>under</span> <span>a</span> <span>big</span> <span>tree</span>. <span>The</span> <span>tree</span> <span>has</span> <span>many</span> <span>green</span> <span>leaves</span>. <span>Sometimes</span>, <span>it</span> <span>rains</span>. <span>Max</span> <span>does not</span> <span>like</span> <span>the</span> <span>rain</span>. <span>He</span> <span>goes inside</span> <span>the</span> <span>house</span> <span>and</span> <span>sits on</span> <span>the</span> <span>rug</span>.</p>
            <p><span>At night</span>, <span>the</span> <span>family</span> <span>comes home</span>. <span>They</span> <span>play with</span> <span>Max</span> <span>and</span> <span>give</span> <span>him</span> <span>a</span> <span>bone</span>. <span>Max</span> <span>wags</span> <span>his</span> <span>tail</span> <span>because</span> <span>he</span> <span>is</span> <span>happy</span>. <span>He</span> <span>loves</span> <span>his</span> <span>family</span> <span>very much</span>. <span>Life</span> <span>is</span> <span>good</span> <span>for</span> <span>a</span> <span>dog</span> <span>like</span> <span>Max</span>. <span>He</span> <span>doesn't</span> <span>have</span> <span>a</span> <span>job</span> <span>or</span> <span>school</span>. <span>He</span> <span>only</span> <span>has</span> <span>friends</span> <span>and</span> <span>toys</span> <span>in the garden</span>.</p>
            <p><span>He</span> <span>dreams</span> <span>of</span> <span>chasing</span> <span>birds</span> <span>in the park</span>. <span>He</span> <span>dreams</span> <span>of</span> <span>big</span> <span>bones</span> <span>and</span> <span>sweet</span> <span>treats</span>. <span>When</span> <span>he</span> <span>sleeps</span>, <span>he</span> <span>makes</span> <span>small</span> <span>noises</span>. <span>His</span> <span>paws</span> <span>move</span> <span>in the air</span>. <span>Max</span> <span>is</span> <span>the</span> <span>best</span> <span>dog</span> <span>in the world</span>. <span>Everyone</span> <span>in the street</span> <span>knows</span> <span>his</span> <span>name</span>. <span>He</span> <span>barks</span> <span>once</span> <span>to say hello</span> <span>back</span>.</p>
        `
    },
    "a1_morning": {
        title: "My Morning",
        level: "A1",
        content: `
            <p><span>Every</span> <span>day</span>, <span>I</span> <span>get up</span> <span>early</span>. <span>I</span> <span>open</span> <span>my</span> <span>window</span> <span>and</span> <span>see</span> <span>the</span> <span>sun</span>. <span>I</span> <span>make</span> <span>a</span> <span>cup of coffee</span>. <span>I</span> <span>like</span> <span>my</span> <span>coffee</span> <span>with</span> <span>milk</span> <span>and</span> <span>sugar</span>. <span>Then</span>, <span>I</span> <span>eat</span> <span>breakfast</span>. <span>I</span> <span>usually</span> <span>eat</span> <span>bread</span> <span>with</span> <span>butter</span> <span>and</span> <span>an</span> <span>egg</span>. <span>Breakfast</span> <span>is</span> <span>the</span> <span>most</span> <span>important</span> <span>meal</span> <span>for me</span>.</p>
            <p><span>After</span> <span>breakfast</span>, <span>I</span> <span>wash</span> <span>my</span> <span>face</span> <span>and</span> <span>brush</span> <span>my</span> <span>teeth</span>. <span>I</span> <span>put on</span> <span>my</span> <span>clothes</span>. <span>I</span> <span>wear</span> <span>blue</span> <span>jeans</span> <span>and</span> <span>a</span> <span>white</span> <span>T-shirt</span>. <span>I</span> <span>look at</span> <span>my</span> <span>watch</span>. <span>It</span> <span>is</span> <span>eight o'clock</span>. <span>I</span> <span>need</span> <span>to go to</span> <span>work</span>. <span>I</span> <span>walk to</span> <span>the</span> <span>bus stop</span>. <span>The</span> <span>bus</span> <span>is</span> <span>always</span> <span>on time</span>.</p>
            <p><span>On the bus</span>, <span>I</span> <span>read</span> <span>a</span> <span>book</span>. <span>The</span> <span>book</span> <span>is</span> <span>about</span> <span>a</span> <span>small</span> <span>town</span> <span>in</span> <span>Italy</span>. <span>I</span> <span>want</span> <span>to visit</span> <span>Italy</span> <span>one day</span>. <span>I</span> <span>want</span> <span>to see</span> <span>the</span> <span>old</span> <span>buildings</span> <span>and</span> <span>eat</span> <span>pizza</span>. <span>The</span> <span>bus</span> <span>stops</span> <span>near</span> <span>my</span> <span>office</span>. <span>I</span> <span>say</span> "<span>Good morning</span>" <span>to the girl</span> <span>at the door</span>.</p>
            <p><span>I</span> <span>sit at</span> <span>my</span> <span>desk</span> <span>and</span> <span>turn on</span> <span>my</span> <span>computer</span>. <span>I</span> <span>have</span> <span>many</span> <span>emails</span> <span>today</span>. <span>I</span> <span>start to</span> <span>work</span>. <span>At ten o'clock</span>, <span>I</span> <span>talk to</span> <span>my</span> <span>friend</span> <span>Carlos</span>. <span>The</span> <span>sun</span> <span>is</span> <span>shining</span> <span>today</span>, <span>so</span> <span>it is</span> <span>a</span> <span>beautiful</span> <span>morning</span>. <span>At twelve o'clock</span>, <span>it is</span> <span>time for</span> <span>lunch</span>. <span>I</span> <span>am</span> <span>hungry</span>!</p>
        `
    },
    "book_lunch": {
        title: "Lunch Time",
        level: "A1",
        content: `
            <p><span>Lunch time</span> <span>is</span> <span>at</span> <span>noon</span>. <span>In</span> <span>my</span> <span>city</span>, <span>people</span> <span>love to</span> <span>eat</span>. <span>There are</span> <span>many</span> <span>restaurants</span> <span>in the street</span>. <span>I</span> <span>go to</span> <span>a</span> <span>small</span> <span>cafe</span> <span>with</span> <span>my</span> <span>sister</span>. <span>My</span> <span>sister's</span> <span>name</span> <span>is</span> <span>Maria</span>. <span>She</span> <span>is</span> <span>a</span> <span>teacher</span>. <span>We</span> <span>sit</span> <span>near</span> <span>the</span> <span>window</span>. <span>The</span> <span>menu</span> <span>is</span> <span>on the table</span>.</p>
            <p><span>I</span> <span>want</span> <span>a</span> <span>salad</span> <span>and</span> <span>fish</span>. <span>Maria</span> <span>wants</span> <span>pasta</span> <span>with</span> <span>tomato sauce</span>. <span>We</span> <span>drink</span> <span>orange juice</span>. <span>It</span> <span>is</span> <span>very</span> <span>fresh</span> <span>and</span> <span>cold</span>. <span>We</span> <span>talk about</span> <span>our</span> <span>family</span>. <span>Our</span> <span>mother</span> <span>is</span> <span>in the kitchen</span> <span>today</span>. <span>She</span> <span>is</span> <span>cooking</span> <span>a</span> <span>big</span> <span>cake</span> <span>for dinner</span>. <span>Our</span> <span>father</span> <span>is</span> <span>at the park</span>.</p>
            <p><span>The</span> <span>cafe</span> <span>is</span> <span>very</span> <span>busy</span>. <span>Many</span> <span>people</span> <span>are</span> <span>eating</span> <span>and</span> <span>talking</span>. <span>I</span> <span>see</span> <span>a</span> <span>man</span> <span>with</span> <span>a</span> <span>big hat</span>. <span>He</span> <span>is</span> <span>eating</span> <span>a</span> <span>very</span> <span>large</span> <span>pizza</span>. <span>The</span> <span>pizza</span> <span>looks</span> <span>delicious</span>. <span>I</span> <span>like</span> <span>cheese</span> <span>and</span> <span>olives</span> <span>on my pizza</span>. <span>After the meal</span>, <span>the</span> <span>waiter</span> <span>brings</span> <span>the bill</span>. <span>We</span> <span>pay</span> <span>cash</span>.</p>
            <p><span>Then</span>, <span>we</span> <span>walk</span> <span>in the park</span> <span>for</span> <span>ten</span> <span>minutes</span>. <span>There are</span> <span>many</span> <span>flowers</span> <span>in the park</span>. <span>I</span> <span>see</span> <span>children</span> <span>playing with</span> <span>a</span> <span>ball</span>. <span>They</span> <span>are</span> <span>laughing</span> <span>and</span> <span>running</span>. <span>Lunch time</span> <span>is</span> <span>a</span> <span>very</span> <span>good</span> <span>part</span> <span>of the day</span>. <span>Now</span>, <span>I</span> <span>must</span> <span>go back to</span> <span>the</span> <span>office</span>. <span>See you later</span>!</p>
        `
    },
    "book_bike": {
        title: "The New Bike",
        level: "A1",
        content: `
            <p><span>Today</span> <span>is</span> <span>my</span> <span>birthday</span>. <span>I am</span> <span>very</span> <span>excited</span>. <span>My</span> <span>parents</span> <span>have</span> <span>a</span> <span>surprise</span> <span>for me</span>. <span>We</span> <span>go to</span> <span>the</span> <span>garage</span>. <span>In</span> <span>the</span> <span>garage</span>, <span>there is</span> <span>a</span> <span>new</span> <span>bike</span>. <span>The</span> <span>bike</span> <span>is</span> <span>red</span> <span>and</span> <span>very</span> <span>shiny</span>. <span>It</span> <span>has</span> <span>a</span> <span>bell</span> <span>and</span> <span>a</span> <span>basket</span>. <span>I</span> <span>love it</span>! <span>I</span> <span>put on</span> <span>my</span> <span>black</span> <span>helmet</span>.</p>
            <p><span>I</span> <span>go to</span> <span>the</span> <span>street</span>. <span>I</span> <span>start to</span> <span>ride</span>. <span>It</span> <span>is</span> <span>very</span> <span>fast</span>. <span>I</span> <span>feel</span> <span>the</span> <span>wind</span> <span>on my face</span>. <span>My</span> <span>friend</span> <span>Sarah</span> <span>is</span> <span>there</span> <span>too</span>. <span>She</span> <span>has</span> <span>a</span> <span>green</span> <span>bike</span>. <span>We</span> <span>ride</span> <span>together</span> <span>to the park</span>. <span>The</span> <span>park</span> <span>is</span> <span>very</span> <span>big</span> <span>and</span> <span>has</span> <span>many</span> <span>paths</span> <span>for our new bikes</span>.</p>
            <p><span>We</span> <span>see</span> <span>a</span> <span>lake</span>. <span>There are</span> <span>ducks</span> <span>in the lake</span>. <span>The</span> <span>ducks</span> <span>are</span> <span>white</span> <span>and</span> <span>brown</span>. <span>We</span> <span>stop</span> <span>the</span> <span>bikes</span> <span>and</span> <span>sit on</span> <span>a</span> <span>bench</span>. <span>We</span> <span>watch</span> <span>the</span> <span>water</span>. <span>Then</span>, <span>I</span> <span>ring</span> <span>my</span> <span>bell</span>. "<span>Ring, ring</span>!" <span>it</span> <span>sounds</span> <span>very</span> <span>loud</span>. <span>Sarah</span> <span>laughs</span>. <span>We</span> <span>ride</span> <span>for</span> <span>one</span> <span>long</span> <span>hour</span>.</p>
            <p><span>I am</span> <span>a little</span> <span>tired</span> <span>now</span>, <span>but</span> <span>I am</span> <span>very</span> <span>happy</span>. <span>This</span> <span>is</span> <span>the</span> <span>best</span> <span>birthday gift</span>. <span>My</span> <span>legs</span> <span>are</span> <span>strong</span>. <span>I</span> <span>want</span> <span>to ride</span> <span>my</span> <span>bike</span> <span>every</span> <span>day</span> <span>after</span> <span>school</span>. <span>I</span> <span>go home</span> <span>and</span> <span>eat</span> <span>some</span> <span>chocolate</span> <span>birthday cake</span> <span>with</span> <span>white cream</span>. <span>What a wonderful day</span>!</p>
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

    // --- 3. FUNÇÃO DE VOZ (TEXT-TO-SPEECH) ---
    window.toggleOuvir = () => {
        if (sintetizador.speaking) {
            sintetizador.cancel();
            atualizarBotaoAudio(false);
            return;
        }

        if (storyContainer) {
            const texto = storyContainer.innerText;
            locucao = new SpeechSynthesisUtterance(texto);
            locucao.lang = 'en-US';
            locucao.rate = 0.9;

            locucao.onstart = () => atualizarBotaoAudio(true);
            locucao.onend = () => atualizarBotaoAudio(false);
            locucao.onerror = () => atualizarBotaoAudio(false);

            sintetizador.speak(locucao);
        }
    };

    const atualizarBotaoAudio = (tocando) => {
        const btn = document.getElementById('btn-read-aloud');
        if (btn) {
            btn.innerHTML = tocando 
                ? `<span>✦</span> Parar Leitura ⏹` 
                : `<span>✦</span> Ouvir Capítulo 🔊`;
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

    // --- 5. LÓGICA DE NÍVEIS E DESBLOQUEIO ---
    const checkLevelUnlocks = () => {
        const levelsOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']; 
        
        levelsOrder.forEach((level, index) => {
            const currentSection = document.querySelector(`[data-level="${level}"]`);
            if (!currentSection) return;

            const quizBtn = currentSection.querySelector('.btn-quiz');
            const nextLevelId = levelsOrder[index + 1];
            const nextSection = document.querySelector(`[data-level="${nextLevelId}"]`);
            
            if (nextSection) {
                if (userData.quizzes && userData.quizzes[level] === true) {
                    nextSection.classList.remove('locked');
                    nextSection.style.opacity = "1";
                    nextSection.style.pointerEvents = "auto";
                    nextSection.style.filter = "grayscale(0)";
                    
                    const tag = nextSection.querySelector('.level-tag');
                    if (tag && tag.innerText.includes('🔒')) {
                        tag.innerText = tag.innerText.replace('🔒', '🔓');
                    }
                }
            }

            if (quizBtn) {
                quizBtn.style.display = !currentSection.classList.contains('locked') ? 'inline-block' : 'none';
            }

            if (userData.quizzes && userData.quizzes[level] === true) {
                const tag = currentSection.querySelector('.level-tag');
                if (tag) tag.innerText = tag.innerText.replace(/[🔒🔓]/, '✅');
            }
        });
    };

    const updateFavVisuals = () => {
        document.querySelectorAll('.book-item').forEach(item => {
            const id = item.getAttribute('data-id');
            const badge = item.querySelector('.fav-badge');
            if (badge) {
                const isFav = (userData.favorites || []).includes(id);
                badge.classList.toggle('active', isFav);
                badge.innerText = isFav ? '❤️' : '✦';
            }
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

    // --- 7. TRADUTOR ---
    if (storyContainer) {
        storyContainer.addEventListener('click', async (e) => {
            const el = e.target;
            if (el.tagName === 'SPAN') {
                const word = el.innerText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
                if (!word) return;

                if (activeTooltip) activeTooltip.remove();
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.innerText = "🔍...";
                document.body.appendChild(tooltip);
                
                const rect = el.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
                tooltip.style.top = `${rect.top + window.scrollY - 45}px`;
                activeTooltip = tooltip;

                try {
                    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|pt-BR`);
                    const data = await response.json();
                    let translations = [data.responseData.translatedText.toLowerCase()];
                    
                    if (data.matches) {
                        data.matches.forEach(m => {
                            const t = m.translation.toLowerCase().trim();
                            if (!translations.includes(t) && t.length < 20) translations.push(t);
                        });
                    }
                    tooltip.innerText = translations.slice(0, 3).join(' / ');
                } catch { tooltip.innerText = "Erro ❌"; }
            }
        });

        document.addEventListener('mousedown', (e) => {
            if (activeTooltip && !e.target.closest('.tooltip') && e.target.tagName !== 'SPAN') {
                activeTooltip.remove();
                activeTooltip = null;
            }
        });
    }
});