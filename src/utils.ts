export const tooltipHandler = (d: any) => {
  if (!d || !d.object) return null;
  let obj = d.object;

  if (d.object.properties) obj = d.object.properties;
  const trs = Object.keys(obj)
    .filter((key) => obj[key])
    .map(
      (key) =>
        `<tr><th style="text-align:left">${key}</th><td>${obj[key]}</td></tr>`
    )
    .join("\n");
  const html = ["<table>", trs, "</table>"].join("\n");

  return {
    html: html,
    style: {
      fontSize: "0.5em",
    },
  };
};
