const listaDestinos = [
  {
    nome: "Tóquio",
    regiao: "Kantō, Japão",
    categoria: "Cidade e cultura",
    descricao: "Templos, letreiros luminosos e bairros com ritmos diferentes convivem na capital japonesa.",
    imagem: "imgCarrossel/Tokyoskyline.jpg",
    textoAlternativo: "Prédios de Tóquio iluminados à noite"
  },
  {
    nome: "Quioto",
    regiao: "Kansai, Japão",
    categoria: "Templos e jardins",
    descricao: "Em Quioto, templos de madeira, jardins e ruas antigas ficam perto da vida moderna.",
    imagem: "imgCarrossel/kyoto.jpg",
    textoAlternativo: "Templo tradicional entre as árvores em Quioto"
  },
  {
    nome: "Monte Fuji",
    regiao: "Shizuoka e Yamanashi",
    categoria: "Montanha e natureza",
    descricao: "Mirantes e trilhas mostram a montanha de formas diferentes em cada estação.",
    imagem: "imgCarrossel/MonteFuji.jpg",
    textoAlternativo: "Monte Fuji visto de um lago cercado por árvores"
  },
  {
    nome: "Osaka",
    regiao: "Kansai, Japão",
    categoria: "Cidade e gastronomia",
    descricao: "Visite o castelo e prove pratos locais, como takoyaki e okonomiyaki, em Dōtonbori.",
    imagem: "imgCarrossel/osaka.jpg",
    textoAlternativo: "Castelo de Osaka rodeado por árvores"
  },
  {
    nome: "Nara",
    regiao: "Kansai, Japão",
    categoria: "Parques e natureza",
    descricao: "No Parque de Nara, veados circulam entre caminhos arborizados e templos como o Tōdai-ji.",
    imagem: "imgCarrossel/Nara.jpg",
    textoAlternativo: "Veado em uma área arborizada de Nara"
  }
];
document.addEventListener("DOMContentLoaded", () => {
  const secaoParalaxe = document.querySelector(".secao-paralaxe");
  const cenaPixelArt = document.querySelector(".cena-pixel-art");
  const camadasDaPaisagem = document.querySelectorAll(".camada-paralaxe");
  const secaoRota = document.querySelector(".rota-horizontal");
  const faixaDaRota = document.querySelector("[data-faixa-da-rota]");
  const barraDeProgresso = document.querySelector("[data-progresso-da-rota]");
  const prefereMenosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let atualizacaoAgendada = false;
  function criarCartaoDestino(destino, indice, modelo, cartaoDuplicado = false) {
    const cartao = modelo.content.firstElementChild.cloneNode(true);
    const imagem = cartao.querySelector("img");

    cartao.dataset.indice = String(indice);
    cartao.setAttribute("aria-label", "Mostrar " + destino.nome);

    if (cartaoDuplicado) {
      cartao.setAttribute("aria-hidden", "true");
      cartao.tabIndex = -1;
    }
    imagem.loading = "eager";
    imagem.src = destino.imagem;
    imagem.alt = destino.textoAlternativo;
    cartao.querySelector(".destino-card__regiao").textContent = destino.regiao;
    cartao.querySelector(".destino-card__nome").textContent = destino.nome;
    cartao.querySelector(".destino-card__categoria").textContent = destino.categoria;

    return cartao;
  }
  function configurarCarrosselDeDestinos() {
    const carrossel = document.querySelector("#carrossel-destinos");
    const faixaDeCartoes = carrossel?.querySelector("[data-faixa-de-cartoes]");
    const modelo = document.querySelector("#modelo-cartao-destino");
    const imagensDeFundo = document.querySelectorAll(".destinos-fundo");
    const tituloDoDestino = document.querySelector("[data-destino-titulo]");
    const descricaoDoDestino = document.querySelector("[data-destino-descricao]");
    const linkDoFormulario = document.querySelector("[data-destino-link]");

    if (!carrossel || !faixaDeCartoes || !modelo || imagensDeFundo.length < 2 || !tituloDoDestino || !descricaoDoDestino || !linkDoFormulario) return;

    const quantidadeDeDestinos = listaDestinos.length;
    let posicaoNaFaixa = quantidadeDeDestinos;
    let indiceDoDestinoAtual = 0;
    let indiceDoFundoVisivel = 0;
    let numeroDaTrocaDeFundo = 0;
    let cartaoEmMovimento = false;
    let movimentosPendentes = 0;
    listaDestinos.forEach((destino, indice) => {
      faixaDeCartoes.appendChild(criarCartaoDestino(destino, indice, modelo, true));
    });
    listaDestinos.forEach((destino, indice) => {
      faixaDeCartoes.appendChild(criarCartaoDestino(destino, indice, modelo));
    });
    listaDestinos.forEach((destino, indice) => {
      faixaDeCartoes.appendChild(criarCartaoDestino(destino, indice, modelo, true));
    });
    function atualizarImagemDeFundo(destino) {
      const imagemVisivel = imagensDeFundo[indiceDoFundoVisivel];
      const proximaImagem = imagensDeFundo[1 - indiceDoFundoVisivel];
      const numeroDestaTroca = ++numeroDaTrocaDeFundo;

      if (imagemVisivel.getAttribute("src") === destino.imagem) return;

      proximaImagem.style.opacity = "0";
      const mostrarProximaImagem = () => {
        if (numeroDestaTroca !== numeroDaTrocaDeFundo) return;

        proximaImagem.style.opacity = ".62";
        imagemVisivel.style.opacity = "0";
        indiceDoFundoVisivel = 1 - indiceDoFundoVisivel;
      };

      if (proximaImagem.getAttribute("src") === destino.imagem) {
        mostrarProximaImagem();
        return;
      }

      proximaImagem.onload = mostrarProximaImagem;
      proximaImagem.onerror = () => {
        if (numeroDestaTroca === numeroDaTrocaDeFundo) proximaImagem.style.opacity = "0";
      };
      proximaImagem.src = destino.imagem;
    }
    function mostrarDestino(indice) {
      const destino = listaDestinos[indice];
      if (!destino) return;

      tituloDoDestino.textContent = destino.nome;
      descricaoDoDestino.textContent = destino.descricao;
      linkDoFormulario.href = "pagina-2.html?destino=" + encodeURIComponent(destino.nome);
      linkDoFormulario.setAttribute("aria-label", "Planejar uma visita a " + destino.nome);
      atualizarImagemDeFundo(destino);

      carrossel.querySelectorAll("[data-indice-destino]").forEach((indicador) => {
        const selecionado = Number(indicador.dataset.indiceDestino) === indice;
        indicador.classList.toggle("active", selecionado);

        if (selecionado) indicador.setAttribute("aria-current", "true");
        else indicador.removeAttribute("aria-current");
      });
    }
    function posicionarFaixa(animar = true) {
      const cartaoSelecionado = faixaDeCartoes.children[posicaoNaFaixa];
      if (!cartaoSelecionado) return;

      Array.from(faixaDeCartoes.children).forEach((cartao, indice) => {
        cartao.classList.toggle("active", indice === posicaoNaFaixa);
      });

      if (!animar) faixaDeCartoes.style.transition = "none";
      const distancia = (carrossel.clientWidth - cartaoSelecionado.offsetWidth) / 2 - cartaoSelecionado.offsetLeft;
      faixaDeCartoes.style.transform = "translate3d(" + distancia + "px, 0, 0)";

      if (!animar) {
        window.requestAnimationFrame(() => {
          faixaDeCartoes.style.transition = "";
        });
      }
    }
    function avancarCarrossel(passos) {
      if (passos === 0) return;
      movimentosPendentes += passos;
      iniciarProximoMovimento();
    }

    function iniciarProximoMovimento() {
      if (cartaoEmMovimento || movimentosPendentes === 0) return;

      cartaoEmMovimento = true;
      const passo = Math.sign(movimentosPendentes);
      movimentosPendentes -= passo;
      posicaoNaFaixa += passo;
      indiceDoDestinoAtual = (indiceDoDestinoAtual + passo + quantidadeDeDestinos) % quantidadeDeDestinos;
      mostrarDestino(indiceDoDestinoAtual);
      posicionarFaixa();
    }
    function moverParaDestino(indiceEscolhido) {
      const passosParaFrente = (indiceEscolhido - indiceDoDestinoAtual + quantidadeDeDestinos) % quantidadeDeDestinos;
      const passosParaTras = passosParaFrente - quantidadeDeDestinos;
      movimentosPendentes = Math.abs(passosParaFrente) <= Math.abs(passosParaTras)
        ? passosParaFrente
        : passosParaTras;
      iniciarProximoMovimento();
    }

    faixaDeCartoes.addEventListener("transitionend", (evento) => {
      if (evento.target !== faixaDeCartoes || evento.propertyName !== "transform") return;
      if (posicaoNaFaixa < quantidadeDeDestinos) posicaoNaFaixa += quantidadeDeDestinos;
      if (posicaoNaFaixa >= quantidadeDeDestinos * 2) posicaoNaFaixa -= quantidadeDeDestinos;
      posicionarFaixa(false);

      window.requestAnimationFrame(() => {
        cartaoEmMovimento = false;
        iniciarProximoMovimento();
      });
    });

    faixaDeCartoes.addEventListener("click", (evento) => {
      const cartao = evento.target.closest("[data-cartao-destino]");
      if (cartao) moverParaDestino(Number(cartao.dataset.indice));
    });

    carrossel.addEventListener("click", (evento) => {
      const seta = evento.target.closest("[data-destino-direcao]");
      const indicador = evento.target.closest("[data-indice-destino]");

      if (seta) avancarCarrossel(Number(seta.dataset.destinoDirecao));
      if (indicador) moverParaDestino(Number(indicador.dataset.indiceDestino));
    });

    mostrarDestino(indiceDoDestinoAtual);
    posicionarFaixa(false);
    window.addEventListener("resize", () => posicionarFaixa(false));
  }
  function atualizarPaisagemParalaxe() {
    if (prefereMenosMovimento || !secaoParalaxe || !cenaPixelArt) return;

    const limitesDaSecao = secaoParalaxe.getBoundingClientRect();
    if (limitesDaSecao.bottom < 0 || limitesDaSecao.top > window.innerHeight) return;

    const distanciaRolada = Math.min(Math.max(0, -limitesDaSecao.top), cenaPixelArt.offsetHeight);

    camadasDaPaisagem.forEach((camada) => {
      const velocidade = Number(camada.dataset.velocidadeParalaxe);
      const escala = Number(camada.dataset.escalaParalaxe || 1);
      const deslocamento = distanciaRolada * velocidade;

      camada.style.transform = "translate3d(0, " + deslocamento + "px, 0) scale(" + escala + ")";
      camada.style.transformOrigin = escala === 1 ? "center" : "center bottom";
    });
  }
  function atualizarRotaHorizontal() {
    if (prefereMenosMovimento || !secaoRota || !faixaDaRota || !barraDeProgresso) return;

    const limitesDaSecao = secaoRota.getBoundingClientRect();
    if (limitesDaSecao.bottom < 0 || limitesDaSecao.top > window.innerHeight) return;

    const distanciaDaRota = secaoRota.offsetHeight - window.innerHeight;
    if (distanciaDaRota <= 0) return;

    const distanciaPercorrida = -limitesDaSecao.top;
    const progresso = Math.max(0, Math.min(1, distanciaPercorrida / distanciaDaRota));
    const larguraDaFaixa = Math.max(0, faixaDaRota.scrollWidth - secaoRota.clientWidth);

    faixaDaRota.style.transform = "translate3d(" + (-larguraDaFaixa * progresso) + "px, 0, 0)";
    barraDeProgresso.style.transform = "scaleX(" + progresso + ")";
  }
  function atualizarEfeitosDaPagina() {
    atualizarPaisagemParalaxe();
    atualizarRotaHorizontal();
    atualizacaoAgendada = false;
  }

  function agendarAtualizacao() {
    if (atualizacaoAgendada) return;
    atualizacaoAgendada = true;
    window.requestAnimationFrame(atualizarEfeitosDaPagina);
  }

  configurarCarrosselDeDestinos();
  window.addEventListener("scroll", agendarAtualizacao, { passive: true });
  window.addEventListener("resize", agendarAtualizacao);
  agendarAtualizacao();
});
