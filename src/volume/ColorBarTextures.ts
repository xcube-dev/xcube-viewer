/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as THREE from "three";

import { ColorBar, formatColorBarName } from "@/model/colorBar";

class ColorBarTextures {
  private readonly textures: { [cmName: string]: THREE.Texture };

  constructor() {
    this.textures = {};
  }

  get(colorBar: ColorBar, onLoad?: () => void): THREE.Texture {
    const key = formatColorBarName(colorBar);
    let texture = this.textures[key];
    if (!texture) {
      // const image = new Image();
      // loadColorBarImage(colorBar, image).then();
      // texture = new THREE.Texture(image);
      texture = new THREE.TextureLoader().load(
        `data:image/png;base64,${colorBar.imageData}`,
        onLoad,
      );
      this.textures[key] = texture;
    }
    return texture;
  }
}

export const colorBarTextures = new ColorBarTextures();
