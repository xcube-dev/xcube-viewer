/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useEffect, useRef } from "react";
import InfoCardContent from "@/components/InfoPanel/common/InfoCardContent";
import Box from "@mui/material/Box";

import { commonSx } from "./styles";

interface HtmlContentProps {
  innerHTML: string;
}

const HtmlContent = ({ innerHTML }: HtmlContentProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divRef.current && innerHTML) {
      divRef.current.innerHTML = innerHTML;
    }
  }, [innerHTML]);

  useEffect(() => {
    const svgTextElements = document.querySelectorAll(
      ".svg-container svg text",
    );
    svgTextElements.forEach((el) => {
      const svgTextElement = el as SVGTextElement;
      svgTextElement.setAttribute("font-size", "11px");
      // The following didn't work:
      // svgTextElement.setAttribute("font-weight", "400");
      // svgTextElement.setAttribute("fill", "grey");
    });
  }, []);

  return (
    innerHTML && (
      <InfoCardContent>
        <Box className="svg-container" ref={divRef} sx={commonSx.htmlContent} />
      </InfoCardContent>
    )
  );
};

export default HtmlContent;
