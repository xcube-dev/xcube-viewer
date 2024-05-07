A color bar comprises mappings from a sample value 
to a color value. Each line in the text box is such a 
mapping. The general syntax for the lines is `<value> : <color>`.
`<value>` can be any number, in the end, the values are normalized 
in the range 0 to 1 and the list of color mappings is sorted
by sample value. `<color>` can be 

* a list of RGB values, with values in the range 0 to 255, for example,
  `255,128,0` for the color orange;
* a hexadecimal RGB value, e.g., `#FFF` or `#30E50A`;
* or a valid [HTML color name](https://www.w3schools.com/colors/colors_names.asp)
  such as `Red` or `BlanchedAlmond` or `MediumSeaGreen`.  

The color value may be suffixed by a opaqueness (alpha) value in the range
0 to 1, e.g., `110,220,230,0.5`, `#30E50A,0.8`, or `Blue,0`
