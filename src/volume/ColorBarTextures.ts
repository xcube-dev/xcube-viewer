/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as THREE from "three";
import { ColorBar, formatColorBar } from "../model/colorBar";

class ColorBarTextures {
  private readonly textures: { [cmName: string]: THREE.Texture };

  constructor() {
    this.textures = {};
  }

  get(colorBar: ColorBar, onLoad?: () => any): THREE.Texture {
    const key = formatColorBar(colorBar);
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
