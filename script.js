const nome = prompt('Qual o seu nome de usuário?');

const lista = {
    'name':nome
};

function conectando(){
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",lista);
    promessa.then(respostaChegou);
    promessa.catch(deuRuim);
}

conectando();

function respostaChegou(){
    
    buscarMensagem();

}

function deuRuim(erro){

    const erroDoUsuario = erro.response.status;

    if(erroDoUsuario === 400){
        document.location.reload(true);
    }
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
            corpoDasMensagens.innerHTML = corpoDasMensagens.innerHTML + `<div data-test='message' class ='entrada-saida'><p><span class='horario'>(${todasMensagens[i].time})</span><span class='usuario'>  ${todasMensagens[i].from}</span> para <span class='usuario'>${todasMensagens[i].to}</span>:  <span>${todasMensagens[i].text}</span></p></div>`;            
        }else if(todasMensagens[i].to === 'Todos'){
            corpoDasMensagens.innerHTML = corpoDasMensagens.innerHTML + `<div data-test='message' class ='mensagem-todos'><p><span class='horario'>(${todasMensagens[i].time})</span><span class='usuario'>  ${todasMensagens[i].from}</span> para <span class='usuario'>${todasMensagens[i].to}</span>:  <span>${todasMensagens[i].text}</span></p></div>`;
        }else{
            corpoDasMensagens.innerHTML = corpoDasMensagens.innerHTML + `<div data-test='message' class ='mensagem-reservada'><p><span class='horario'>(${todasMensagens[i].time})</span><span class='usuario'>  ${todasMensagens[i].from}</span> reservadamente para <span class='usuario'>${todasMensagens[i].to}</span>:  <span>${todasMensagens[i].text}</span></p></div>`;
        }
        corpoDasMensagens.lastChild.scrollIntoView(); 
    }

}

const recarregarMensagens = setInterval(buscarMensagem,mensagensChegaram, 3000);

function deuErroMensagens(erro){

}

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
    enviarMensagem.catch();

}

function deuCertoMensagem(){

    buscarMensagem();
}