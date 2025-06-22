  // Al submit del form, costruisce l'URL per recuperare l'SVG e lo inietta inline nel DOM.
      document.getElementById("svgForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        if (!username) return;

        // Crea l'URL dell'SVG con il tema "radical".
        const externalUrl = "https://streak-stats.demolab.com/?user=" +
          encodeURIComponent(username) + "&theme=radical";

        // Usiamo un proxy CORS (ThingProxy) per recuperare l'SVG in quanto il browser non ci permetterebbe di fetcharlo direttamente.
        const proxy = "https://thingproxy.freeboard.io/fetch/";
        // Importante: codifica l'URL del servizio prima di concatenarlo.
        const fetchUrl = proxy + encodeURIComponent(externalUrl);

        try {
          const response = await fetch(fetchUrl);
          if (!response.ok) {
            alert("Failed to fetch SVG (status " + response.status + ")");
            return;
          }
          // Otteniamo il contenuto SVG come testo.
          const svgContent = await response.text();
          // Inietta il contenuto SVG direttamente nel DOM (inline) in modo da avere il suo intero DOM.
          document.getElementById("preview").innerHTML = svgContent;
          document.getElementById("downloadSection").style.display = "block";
        } catch (err) {
          alert("Error fetching SVG: " + err.message);
          console.error(err);
        }
      });
      
      // Funzione per inlinare gli stili computati in ciascun elemento dell'SVG.
      function inlineStyles(svgElement) {
        inlineComputedStyle(svgElement);
        // Seleziona tutti gli elementi figli.
        const elements = svgElement.querySelectorAll("*");
        elements.forEach(el => {
          inlineComputedStyle(el);
        });
      }
      
      function inlineComputedStyle(el) {
        const computed = window.getComputedStyle(el);
        let styleStr = "";
        for (let i = 0; i < computed.length; i++) {
          const prop = computed[i];
          const value = computed.getPropertyValue(prop);
          styleStr += prop + ":" + value + ";";
        }
        el.setAttribute("style", styleStr);
      }
      
      // Al click del pulsante di download, si inlinano gli stili, si serializza l'SVG e si scarica.
      document.getElementById("downloadBtn").addEventListener("click", function () {
        try {
          // Seleziona il nodo SVG inline.
          const svgElement = document.querySelector("#preview svg");
          if (!svgElement) {
            alert("SVG non disponibile per il download.");
            return;
          }
          // Inline tutti gli stili computati per preservare l'aspetto completo.
          inlineStyles(svgElement);
          // Serializza l'elemento SVG in una stringa.
          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(svgElement);
          const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "steak-stats-completo.svg";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (error) {
          alert("Error downloading SVG: " + error.message);
          console.error(error);
        }
      });
