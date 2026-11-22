const urlDaBiblioteca = "https://cdn.jsdelivr.net/npm/@ybouane/liquidglass@1.0.3/dist/index.js";
const bannerInicial = document.querySelector(".hero-inicial");

if (bannerInicial) {
  const barraDeNavegacao = bannerInicial.querySelector(".barra-navegacao");
  const botaoDosDestinos = bannerInicial.querySelector(".hero-inicial__acao");
  const configuracaoBase = {
    blurAmount: 0.16,
    refraction: 0.3,
    chromAberration: 0.015,
    edgeHighlight: 0.08,
    specular: 0.05,
    fresnel: 0.55,
    opacity: 0.72,
    tintStrength: 0.04,
    brightness: 0,
    shadowOpacity: 0.2,
    shadowSpread: 8,
    shadowOffsetY: 2
  };

  barraDeNavegacao.dataset.config = JSON.stringify({
    ...configuracaoBase,
    cornerRadius: 32,
    button: false
  });
  botaoDosDestinos.dataset.config = JSON.stringify({
    ...configuracaoBase,
    cornerRadius: 24,
    button: true
  });
  import(urlDaBiblioteca)
    .then(({ LiquidGlass }) => LiquidGlass.init({
      root: bannerInicial,
      glassElements: [barraDeNavegacao, botaoDosDestinos]
    }))
    .catch((erro) => {
      console.info("Liquid Glass não carregou; usando o acabamento de vidro do CSS.", erro);
    });
}
