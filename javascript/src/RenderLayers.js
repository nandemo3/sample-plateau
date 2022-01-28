import { Tile3DLayer } from "deck.gl";
import { Tiles3DLoader } from "@loaders.gl/3d-tiles";

//ads s3 の3dtile置き場、　こちらは突然アクセスできなくなる可能性があります
const P3D_DATA =
  "https://ggg-plateau.s3-ap-northeast-1.amazonaws.com/3d-tiles/13102_chuo-ku_notexture/tileset.json";

const RenderLayers = (props) => {
  //3d-tileデータを読み込んで表示するレイヤ
  const tile3dLayer = new Tile3DLayer({
    id: "tile3dlayer",
    pickable: true,
    data: P3D_DATA,
    loader: Tiles3DLoader,
    onTileLoad: (tileHeader) => {
      tileHeader.content.gltf.materials.forEach(function (m) {
        if (m.name == "default_material") {
          //テクスチャの貼られていないマテリアルを緑色に
          m.pbrMetallicRoughness.baseColorFactor = [0.0, 1.0, 0.0, 1]; //rgba
          m.pbrMetallicRoughness.metallicFactor = 1;
          m.pbrMetallicRoughness.roughnessFactor = 0.6;
        }
      });
    },
  });
  return [tile3dLayer];
};

export default RenderLayers;
