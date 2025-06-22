document.getElementById("svgForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    if (!username) return;
    
    // Build the external image URL using the "radical" theme.
    const imageUrl = `https://streak-stats.demolab.com/?user=${encodeURIComponent(username)}&theme=radical`;
    
    // Insert an <img> element with the external URL.
    document.getElementById("preview").innerHTML = `
      <img src="${imageUrl}" alt="GitHub Streak for ${username}" />
    `;
    document.getElementById("downloadSection").style.display = "block";
    
    // When downloading, fetch the SVG from the external source using a CORS proxy.
    document.getElementById("downloadBtn").onclick = async function () {
      try {
        /* 
          Use a CORS proxy to bypass CORS restrictions.
          You can choose a free proxy such as:
            - "https://thingproxy.freeboard.io/fetch/"
            - "https://cors-anywhere.herokuapp.com/" (requires manual activation)
          Here we use the thingproxy service:
        */
        const proxyUrl = "https://thingproxy.freeboard.io/fetch/";
        const fetchUrl = proxyUrl + imageUrl;
        
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          alert("Failed to fetch SVG");
          return;
        }
        const svgContent = await response.text();
        const blob = new Blob([svgContent], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "steak-stats.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        alert("Error fetching SVG");
        console.error(error);
      }
    };
});
