document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#formulario-interesse");
  const mensagemDeRetorno = document.querySelector("#mensagem-formulario");
  if (!formulario || !mensagemDeRetorno) return;
  const parametrosDaPagina = new URLSearchParams(window.location.search);
  const destinoEscolhido = parametrosDaPagina.get("destino");
  const campoDestino = formulario.elements.namedItem("destino");
  const destinoEstaNaLista = Array.from(campoDestino.options)
    .some((opcao) => opcao.value === destinoEscolhido);

  if (destinoEstaNaLista) campoDestino.value = destinoEscolhido;

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    formulario.classList.add("was-validated");

    if (!formulario.checkValidity()) {
      formulario.querySelector(":invalid")?.focus();
      return;
    }

    const estiloEscolhido = formulario.elements.namedItem("estilo").value;
    const epocaEscolhida = formulario.elements.namedItem("epoca").value;
    const preposicoes = {
      Primavera: "na",
      Verão: "no",
      Outono: "no",
      Inverno: "no"
    };
    const melhorEpoca = epocaEscolhida
      ? " para viajar " + preposicoes[epocaEscolhida] + " " + epocaEscolhida.toLowerCase()
      : "";

    mensagemDeRetorno.textContent = "Pronto! Uma ideia de passeio por " + campoDestino.value
      + ", com foco em " + estiloEscolhido + melhorEpoca + ". Suas respostas não foram enviadas nem guardadas.";
    mensagemDeRetorno.classList.remove("d-none");
    mensagemDeRetorno.focus();
  });
  formulario.addEventListener("input", () => {
    mensagemDeRetorno.classList.add("d-none");
  });
});
