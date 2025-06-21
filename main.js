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
        
        // When downloading, fetch the SVG from the external source.
        document.getElementById("downloadBtn").onclick = async function () {
          try {
            const response = await fetch(imageUrl);
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
