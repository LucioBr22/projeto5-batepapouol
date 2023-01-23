const nome = prompt('Qual o seu nome de usuário?');

let lista = {
    'name':nome
};

function testarNomeUsuario(){

    const testeUsuario = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    testeUsuario.then(testeDeUsuario);
}

function testeDeUsuario(resposta){

    let nomesDeUsuario = resposta.data;
    let primeiroUsuario;

    for(let i=0;i<nomesDeUsuario.length;i++){
        primeiroUsuario = nomesDeUsuario[i].name;
        if(primeiroUsuario === nome){
            document.location.reload(true);
        }
    }

    conectando();

}   

testarNomeUsuario();


function conectando(){
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",lista);
    promessa.then(respostaChegou);
}

function respostaChegou(){
    
    buscarMensagem();

}

function statusDoUsuario(){
    const status = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', lista);
}

const statusUsuario = setInterval(statusDoUsuario,5000);

function buscarMensagem(){

    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(mensagensChegaram);
    promise.catch();

}

let corpoDasMensagens = document.querySelector('.conversas');

function mensagensChegaram(resposta){

    corpoDasMensagens.innerHTML = "";

    let todasMensagens = resposta.data;

    for(let i=0;i<todasMensagens.length;i++){
        if(todasMensagens[i].text === 'entra na sala...' || todasMensagens[i].text === 'sai da sala...'){
            corpoDasMensagens.innerHTML = corpoDasMensagens.innerHTML + `<div data-test="message" class ='entrada-saida'><p><span class='horario'>(${todasMensagens[i].time})</span><span class='usuario'>  ${todasMensagens[i].from}</span> para <span class='usuario'>${todasMensagens[i].to}</span>:  <span>${todasMensagens[i].text}</span></p></div>`;            
        }else if(todasMensagens[i].to === 'Todos'){
            corpoDasMensagens.innerHTML = corpoDasMensagens.innerHTML + `<div data-test="message" class ='mensagem-todos'><p><span class='horario'>(${todasMensagens[i].time})</span><span class='usuario'>  ${todasMensagens[i].from}</span> para <span class='usuario'>${todasMensagens[i].to}</span>:  <span>${todasMensagens[i].text}</span></p></div>`;
        }else if(todasMensagens[i].to === nome) {  
            corpoDasMensagens.innerHTML = corpoDasMensagens.innerHTML + `<div data-test="message" class ='mensagem-reservada'><p><span class='horario'>(${todasMensagens[i].time})</span><span class='usuario'>  ${todasMensagens[i].from}</span> reservadamente para <span class='usuario'>${todasMensagens[i].to}</span>:  <span>${todasMensagens[i].text}</span></p></div>`;
        }else{
            i++;
        }
        corpoDasMensagens.lastChild.scrollIntoView(); 
    }

}

const recarregarMensagens = setInterval(buscarMensagem,mensagensChegaram, 3000);

let mensagem;

function enviarMensagem(){

    const mensagemGuardada = document.querySelector('.texto-enviado');

    mensagem = mensagemGuardada.value;

    mensagemGuardada.value='';

    const mensagemEnviada = {
        "from": nome,
        "to": "Todos",
        "text": mensagem,
        "type": "message"
    }

    const enviarMensagem = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",mensagemEnviada);
    enviarMensagem.then(deuCertoMensagem);
    enviarMensagem.catch(deuErradoEnviarMensagem);

}

function deuCertoMensagem(){
    buscarMensagem();
}

function deuErradoEnviarMensagem(){
    window.location.reload();
}