const API_BASE = 'https://development-internship-api.geopostenergy.com/WorldCup';
const GIT_USER = 'Biosca18'; 

const paisesAleatorios = [
    "Japão", "Coreia do Sul", "Austrália", "Irã", "Arábia Saudita", "Catar",
    "Nigéria", "Senegal", "Camarões", "Marrocos", "Egito", "Gana",
    "Brasil", "Argentina", "Colômbia", "Uruguai", "Equador", "Chile",
    "EUA", "México", "Canadá", "Costa Rica", "Jamaica", "Panamá",
    "França", "Alemanha", "Espanha", "Inglaterra", "Itália", "Holanda", "Bélgica", "Portugal"
];

const nomesGrupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

async function iniciarSimulacao() {
    document.getElementById('fase-grupos').innerHTML = 'Carregando dados da API...';
    document.getElementById('mata-mata').innerHTML = '';

    const timesBrutos = await buscarTimes();
    if (!timesBrutos) return;

    embaralharArray(paisesAleatorios);

    let times = timesBrutos.map((time, index) => ({
        ...time,             
        Name: paisesAleatorios[index], 
        pontos: 0,
        golsPro: 0,
        golsContra: 0,
        saldo: 0
    }));

    embaralharArray(times);
    const grupos = separarEmGrupos(times);
 
    simularJogosGrupo(grupos);
    renderizarGrupos(grupos); 

    const classificados = obterClassificados(grupos);
    simularFaseMataMata(classificados);
}

async function buscarTimes() {
    try {
        const resposta = await fetch(`${API_BASE}/GetAllTeams`, {
            method: 'GET',
            headers: { 
                'git-user': GIT_USER,
                'Content-Type': 'application/json' // Adicionamos por precaução
            }
        });

        // Se a resposta HTTP não for 200 (OK), nós forçamos o erro para ver o motivo
        if (!resposta.ok) {
            const textoErro = await resposta.text();
            throw new Error(`Código ${resposta.status} - Mensagem da API: ${textoErro}`);
        }

        return await resposta.json();
    } catch (erro) {
        alert("Erro na API! Olhe o console (F12) para ver o motivo exato.");
        console.error("🔍 DETALHE DO ERRO:", erro);
        return null;
    }
}

async function enviarFinal(dadosFinal) {
    try {
        const resposta = await fetch(`${API_BASE}/FinalResult`, {
            method: 'POST',
            headers: { 
                'git-user': GIT_USER,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(dadosFinal)
        });
        
        if(resposta.ok) {
            alert("Campeão registrado com sucesso na API!");
        }
    } catch (erro) {
        console.error("Erro ao registrar campeão", erro);
    }
}

function embaralharArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
}

function separarEmGrupos(times) {
    let grupos = {};
    for (let i = 0; i < 8; i++) {
        grupos[nomesGrupos[i]] = times.slice(i * 4, (i * 4) + 4);
    }
    return grupos;
}

function gerarGols() {
    return Math.floor(Math.random() * 5);
}

function simularJogosGrupo(grupos) {
    // Para cada grupo (A ao H)
    for (let letra in grupos) {
        let grupo = grupos[letra];
        
        const confrontos = [
            [0, 1], [2, 3], // Rodada 1
            [0, 2], [1, 3], // Rodada 2
            [0, 3], [1, 2]  // Rodada 3
        ];

        confrontos.forEach(jogo => {
            let timeA = grupo[jogo[0]];
            let timeB = grupo[jogo[1]];
            
            let golsA = gerarGols();
            let golsB = gerarGols();

            timeA.golsPro += golsA;
            timeA.golsContra += golsB;
            timeB.golsPro += golsB;
            timeB.golsContra += golsA;

            if (golsA > golsB) {
                timeA.pontos += 3;
            } else if (golsB > golsA) {
                timeB.pontos += 3;
            } else {
                timeA.pontos += 1;
                timeB.pontos += 1;
            }

            timeA.saldo = timeA.golsPro - timeA.golsContra;
            timeB.saldo = timeB.golsPro - timeB.golsContra;
        });

        grupo.sort((a, b) => {
            if (b.pontos !== a.pontos) return b.pontos - a.pontos;
            if (b.saldo !== a.saldo) return b.saldo - a.saldo;    
            return Math.random() - 0.5;                           
        });
    }
}

function obterClassificados(grupos) {
    let classificados = {};
    for (let letra in grupos) {
        classificados[letra] = [grupos[letra][0], grupos[letra][1]];
    }
    return classificados;
}

function simularPartidaMataMata(timeA, timeB) {
    let golsA = gerarGols();
    let golsB = gerarGols();
    let penaltisA = 0;
    let penaltisB = 0;

    if (golsA === golsB) {
        penaltisA = Math.floor(Math.random() * 5) + 1;
        penaltisB = Math.floor(Math.random() * 5) + 1;
        while (penaltisA === penaltisB) {
            penaltisB = Math.floor(Math.random() * 5) + 1;
        }
    }

    let vencedor = (golsA > golsB || penaltisA > penaltisB) ? timeA : timeB;

    return {
        timeA, timeB, golsA, golsB, penaltisA, penaltisB, vencedor
    };
}

function simularFaseMataMata(c) {
    const divMataMata = document.getElementById('mata-mata');
    divMataMata.innerHTML = '<h2>Fase Eliminatória</h2>';

    const oitavas = [
        simularPartidaMataMata(c.A[0], c.B[1]), simularPartidaMataMata(c.C[0], c.D[1]),
        simularPartidaMataMata(c.E[0], c.F[1]), simularPartidaMataMata(c.G[0], c.H[1]),
        simularPartidaMataMata(c.B[0], c.A[1]), simularPartidaMataMata(c.D[0], c.C[1]),
        simularPartidaMataMata(c.F[0], c.E[1]), simularPartidaMataMata(c.H[0], c.G[1])
    ];

    const quartas = [
        simularPartidaMataMata(oitavas[0].vencedor, oitavas[1].vencedor),
        simularPartidaMataMata(oitavas[2].vencedor, oitavas[3].vencedor),
        simularPartidaMataMata(oitavas[4].vencedor, oitavas[5].vencedor),
        simularPartidaMataMata(oitavas[6].vencedor, oitavas[7].vencedor)
    ];

    const semis = [
        simularPartidaMataMata(quartas[0].vencedor, quartas[1].vencedor),
        simularPartidaMataMata(quartas[2].vencedor, quartas[3].vencedor)
    ];

    const final = simularPartidaMataMata(semis[0].vencedor, semis[1].vencedor);

    renderizarJogos("Oitavas de Final", oitavas, divMataMata);
    renderizarJogos("Quartas de Final", quartas, divMataMata);
    renderizarJogos("Semifinal", semis, divMataMata);
    renderizarJogos("GRANDE FINAL", [final], divMataMata);

    const payloadFinal = {
        equipeA: final.timeA.Token, 
        equipeB: final.timeB.Token,
        golsEquipeA: final.golsA,
        golsEquipeB: final.golsB,
        golsPenaltyTimeA: final.penaltisA,
        golsPenaltyTimeB: final.penaltisB
    };

    enviarFinal(payloadFinal);
}

function renderizarGrupos(grupos) {
    const divGrupos = document.getElementById('fase-grupos');
    divGrupos.innerHTML = '';

    for (let letra in grupos) {
        let htmlCard = `<div class="card"><h3>Grupo ${letra}</h3><table><tr><th>Time</th><th>Pts</th><th>SG</th></tr>`;
        
        grupos[letra].forEach((time, index) => {
            // Destaca os 2 primeiros (Classificados)
            let cor = index < 2 ? "style='font-weight:bold; color:#5b21b6;'" : "";
            htmlCard += `<tr ${cor}><td>${time.Name}</td><td>${time.pontos}</td><td>${time.saldo}</td></tr>`;
        });
        
        htmlCard += `</table></div>`;
        divGrupos.innerHTML += htmlCard;
    }
}

function renderizarJogos(faseNome, partidas, container) {
    let htmlBloco = `<div class="card" style="width:100%; max-width: 600px;"><h3>${faseNome}</h3>`;
    
    partidas.forEach(jogo => {
        let placar = `${jogo.golsA} x ${jogo.golsB}`;
        if (jogo.penaltisA > 0 || jogo.penaltisB > 0) {
            placar += ` (Pên: ${jogo.penaltisA} x ${jogo.penaltisB})`;
        }
        
        let destaqueA = jogo.vencedor === jogo.timeA ? "font-weight:bold; color:green;" : "";
        let destaqueB = jogo.vencedor === jogo.timeB ? "font-weight:bold; color:green;" : "";

        htmlBloco += `<div class="match">
            <span style="${destaqueA}">${jogo.timeA.Name}</span> 
            <strong>[ ${placar} ]</strong> 
            <span style="${destaqueB}">${jogo.timeB.Name}</span>
        </div>`;
    });

    htmlBloco += `</div>`;
    container.innerHTML += htmlBloco;
}
