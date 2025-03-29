(function() {
  console.error("dsjihd")
  if (window.hasRun) return;
  window.hasRun = true;

  const normalize = (str) => {
    return str.trim().replace(/\s+/g, "_").replace(/[^\w.]+/g, "");
  };
  const getCurrentTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}${month}${day}_${hours}${minutes}`;
  };

  browser.runtime.onMessage.addListener(() => {
    const dir = `${normalize(
      document.title.substring(document.title.indexOf(" ") + 1),
    )
      }_${getCurrentTimestamp()}`;
    Array.from(document.querySelectorAll("li.section a"))
      .filter((e) => e.href.includes("resource"))
      .forEach((e) => {
        fetch(e).then((r) => {
          downloadFile(
            r.url,
            `${dir}/${normalize(
              decodeURIComponent(r.url.split("/").pop().split("?")[0]),
            )
            }`,
          );
        });
      });
  });

  function downloadFile(url, filename) {
    browser.runtime.sendMessage({ url, filename, conflictAction: "overwrite" });
  }
})();
