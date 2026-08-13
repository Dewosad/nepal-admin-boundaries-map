import maplibregl from "maplibre-gl";

const temperatureColorMapping = [
  { temperature: -50, color: "#481581" },
  { temperature: -49.5, color: "#451882" },
  { temperature: -49, color: "#421b84" },
  { temperature: -48.5, color: "#401e85" },
  { temperature: -48, color: "#3d2187" },
  { temperature: -47.5, color: "#3a2488" },
  { temperature: -47, color: "#382689" },
  { temperature: -46.5, color: "#35298b" },
  { temperature: -46, color: "#322c8c" },
  { temperature: -45.5, color: "#2f2f8e" },
  { temperature: -45, color: "#2c328f" },
  { temperature: -44.5, color: "#2a3590" },
  { temperature: -44, color: "#273892" },
  { temperature: -43.5, color: "#243b93" },
  { temperature: -43, color: "#223e95" },
  { temperature: -42.5, color: "#1f4096" },
  { temperature: -42, color: "#1c4397" },
  { temperature: -41.5, color: "#194699" },
  { temperature: -41, color: "#16499a" },
  { temperature: -40.5, color: "#144c9c" },
  { temperature: -40, color: "#114f9d" },
  { temperature: -39.5, color: "#1553a0" },
  { temperature: -39, color: "#1957a4" },
  { temperature: -38.5, color: "#1d5aa7" },
  { temperature: -38, color: "#225eab" },
  { temperature: -37.5, color: "#2662ae" },
  { temperature: -37, color: "#2a66b2" },
  { temperature: -36.5, color: "#2e6ab5" },
  { temperature: -36, color: "#326db9" },
  { temperature: -35.5, color: "#3671bc" },
  { temperature: -35, color: "#3b75c0" },
  { temperature: -34.5, color: "#3f79c3" },
  { temperature: -34, color: "#437dc6" },
  { temperature: -33.5, color: "#4780ca" },
  { temperature: -33, color: "#4b84cd" },
  { temperature: -32.5, color: "#4f88d1" },
  { temperature: -32, color: "#538cd4" },
  { temperature: -31.5, color: "#5890d8" },
  { temperature: -31, color: "#5c93db" },
  { temperature: -30.5, color: "#6097df" },
  { temperature: -30, color: "#649be2" },
  { temperature: -29.5, color: "#649de3" },
  { temperature: -29, color: "#659fe3" },
  { temperature: -28.5, color: "#65a1e4" },
  { temperature: -28, color: "#65a4e4" },
  { temperature: -27.5, color: "#66a6e5" },
  { temperature: -27, color: "#66a8e6" },
  { temperature: -26.5, color: "#66aae6" },
  { temperature: -26, color: "#66ace7" },
  { temperature: -25.5, color: "#67aee7" },
  { temperature: -25, color: "#67b0e8" },
  { temperature: -24.5, color: "#67b3e9" },
  { temperature: -24, color: "#68b5e9" },
  { temperature: -23.5, color: "#68b7ea" },
  { temperature: -23, color: "#68b9ea" },
  { temperature: -22.5, color: "#68bbeb" },
  { temperature: -22, color: "#69bdec" },
  { temperature: -21.5, color: "#69c0ec" },
  { temperature: -21, color: "#69c2ed" },
  { temperature: -20.5, color: "#6ac4ed" },
  { temperature: -20, color: "#6ac6ee" },
  { temperature: -19.5, color: "#6bc8ee" },
  { temperature: -19, color: "#6dc9ee" },
  { temperature: -18.5, color: "#6ecbee" },
  { temperature: -18, color: "#6fccee" },
  { temperature: -17.5, color: "#71ceee" },
  { temperature: -17, color: "#72cfee" },
  { temperature: -16.5, color: "#73d0ee" },
  { temperature: -16, color: "#75d2ee" },
  { temperature: -15.5, color: "#76d4ee" },
  { temperature: -15, color: "#78d5ee" },
  { temperature: -14.5, color: "#79d6ed" },
  { temperature: -14, color: "#7ad8ed" },
  { temperature: -13.5, color: "#7cdaed" },
  { temperature: -13, color: "#7ddbed" },
  { temperature: -12.5, color: "#7edced" },
  { temperature: -12, color: "#80deed" },
  { temperature: -11.5, color: "#81e0ed" },
  { temperature: -11, color: "#82e1ed" },
  { temperature: -10.5, color: "#84e3ed" },
  { temperature: -10, color: "#85e4ed" },
  { temperature: -9.5, color: "#89e5ec" },
  { temperature: -9, color: "#8ce6eb" },
  { temperature: -8.5, color: "#90e7ea" },
  { temperature: -8, color: "#94e7e9" },
  { temperature: -7.5, color: "#98e8e8" },
  { temperature: -7, color: "#9ce9e7" },
  { temperature: -6.5, color: "#9feae6" },
  { temperature: -6, color: "#a3ebe5" },
  { temperature: -5.5, color: "#a7ece4" },
  { temperature: -5, color: "#abece3" },
  { temperature: -4.5, color: "#aeede2" },
  { temperature: -4, color: "#b2eee1" },
  { temperature: -3.5, color: "#b6efe0" },
  { temperature: -3, color: "#baf0df" },
  { temperature: -2.5, color: "#bdf1de" },
  { temperature: -2, color: "#c1f2dd" },
  { temperature: -1.5, color: "#c5f2dc" },
  { temperature: -1, color: "#c8f3db" },
  { temperature: -0.5, color: "#ccf4da" },
  { temperature: 0, color: "#d0f5d9" },
  { temperature: 0.5, color: "#d2f5d4" },
  { temperature: 1, color: "#d5f5ce" },
  { temperature: 1.5, color: "#d7f5c9" },
  { temperature: 2, color: "#d9f5c4" },
  { temperature: 2.5, color: "#dcf4be" },
  { temperature: 3, color: "#def4b9" },
  { temperature: 3.5, color: "#e0f4b4" },
  { temperature: 4, color: "#e3f4ae" },
  { temperature: 4.5, color: "#e5f4a9" },
  { temperature: 5, color: "#e8f4a3" },
  { temperature: 5.5, color: "#eaf49e" },
  { temperature: 6, color: "#ecf499" },
  { temperature: 6.5, color: "#eff493" },
  { temperature: 7, color: "#f1f48e" },
  { temperature: 7.5, color: "#f3f389" },
  { temperature: 8, color: "#f6f383" },
  { temperature: 8.5, color: "#f8f37e" },
  { temperature: 9, color: "#faf379" },
  { temperature: 9.5, color: "#fdf373" },
  { temperature: 10, color: "#fff36e" },
  { temperature: 10.5, color: "#fff06f" },
  { temperature: 11, color: "#ffed6f" },
  { temperature: 11.5, color: "#ffe970" },
  { temperature: 12, color: "#ffe670" },
  { temperature: 12.5, color: "#ffe371" },
  { temperature: 13, color: "#ffe072" },
  { temperature: 13.5, color: "#ffdd72" },
  { temperature: 14, color: "#ffd973" },
  { temperature: 14.5, color: "#ffd673" },
  { temperature: 15, color: "#ffd374" },
  { temperature: 15.5, color: "#ffd075" },
  { temperature: 16, color: "#ffcd75" },
  { temperature: 16.5, color: "#ffc976" },
  { temperature: 17, color: "#ffc676" },
  { temperature: 17.5, color: "#ffc377" },
  { temperature: 18, color: "#ffc078" },
  { temperature: 18.5, color: "#ffbd78" },
  { temperature: 19, color: "#ffb979" },
  { temperature: 19.5, color: "#ffb679" },
  { temperature: 20, color: "#ffb37a" },
  { temperature: 20.5, color: "#ffaf77" },
  { temperature: 21, color: "#ffaa75" },
  { temperature: 21.5, color: "#ffa672" },
  { temperature: 22, color: "#ffa270" },
  { temperature: 22.5, color: "#ff9d6d" },
  { temperature: 23, color: "#ff996a" },
  { temperature: 23.5, color: "#ff9568" },
  { temperature: 24, color: "#ff9165" },
  { temperature: 24.5, color: "#ff8c63" },
  { temperature: 25, color: "#ff8860" },
  { temperature: 25.5, color: "#ff845d" },
  { temperature: 26, color: "#ff7f5b" },
  { temperature: 26.5, color: "#ff7b58" },
  { temperature: 27, color: "#ff7756" },
  { temperature: 27.5, color: "#ff7253" },
  { temperature: 28, color: "#ff6e50" },
  { temperature: 28.5, color: "#ff6a4e" },
  { temperature: 29, color: "#ff664b" },
  { temperature: 29.5, color: "#ff6149" },
  { temperature: 30, color: "#ff5d46" },
  { temperature: 30.5, color: "#fb5943" },
  { temperature: 31, color: "#f7553f" },
  { temperature: 31.5, color: "#f3513c" },
  { temperature: 32, color: "#f04e38" },
  { temperature: 32.5, color: "#ec4a35" },
  { temperature: 33, color: "#e84632" },
  { temperature: 33.5, color: "#e4422e" },
  { temperature: 34, color: "#e03e2b" },
  { temperature: 34.5, color: "#dc3a27" },
  { temperature: 35, color: "#d83624" },
  { temperature: 35.5, color: "#d53321" },
  { temperature: 36, color: "#d12f1d" },
  { temperature: 36.5, color: "#cd2b1a" },
  { temperature: 37, color: "#c92716" },
  { temperature: 37.5, color: "#c52313" },
  { temperature: 38, color: "#c11f10" },
  { temperature: 38.5, color: "#be1c0c" },
  { temperature: 39, color: "#ba1809" },
  { temperature: 39.5, color: "#b61405" },
  { temperature: 40, color: "#b21002" },
  { temperature: 40.5, color: "#af0f05" },
  { temperature: 41, color: "#ac0e08" },
  { temperature: 41.5, color: "#a90e0b" },
  { temperature: 42, color: "#a60d0e" },
  { temperature: 42.5, color: "#a30c11" },
  { temperature: 43, color: "#a10b14" },
  { temperature: 43.5, color: "#9e0a17" },
  { temperature: 44, color: "#9b0a1a" },
  { temperature: 44.5, color: "#98091d" },
  { temperature: 45, color: "#950820" },
  { temperature: 45.5, color: "#920722" },
  { temperature: 46, color: "#8f0625" },
  { temperature: 46.5, color: "#8c0628" },
  { temperature: 47, color: "#89052b" },
  { temperature: 47.5, color: "#86042e" },
  { temperature: 48, color: "#840331" },
  { temperature: 48.5, color: "#810234" },
  { temperature: 49, color: "#7e0237" },
  { temperature: 49.5, color: "#7b013a" },
  { temperature: 50, color: "#78003d" },
];

const hexToRgb = (hex: string): [number, number, number] => {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);

  return [red, green, blue];
};

const getColorFromTemperature = (temperature: number): [number, number, number] => {
  const match = temperatureColorMapping.find(
    (item) => temperature <= item.temperature,
  );

  return hexToRgb(match?.color ?? temperatureColorMapping.at(-1)?.color ?? "#78003d");
};

let registered = false;

export const registerYrHeatProtocol = () => {
  if (registered) return;
  registered = true;

  maplibregl.addProtocol("yrheat", async (params, abortController) => {
    const tileUrl = params.url.replace("yrheat://", "");
    const response = await fetch(tileUrl, { signal: abortController.signal });

    if (!response.ok) {
      throw new Error(`Yr heat tile fetch failed: ${response.status}`);
    }

    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas 2D context is not available.");
    }

    context.drawImage(bitmap, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let index = 0; index < data.length; index += 4) {
      const alpha = data[index + 3];
      if (alpha === 0) continue;

      const temperature = data[index] - 128;
      const [red, green, blue] = getColorFromTemperature(temperature);

      data[index] = red;
      data[index + 1] = green;
      data[index + 2] = blue;
    }

    context.putImageData(imageData, 0, 0);

    const outputBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((newBlob) => {
        if (!newBlob) {
          reject(new Error("Failed to encode decoded heat tile."));
          return;
        }

        resolve(newBlob);
      }, "image/png");
    });

    return { data: await outputBlob.arrayBuffer() };
  });
};
