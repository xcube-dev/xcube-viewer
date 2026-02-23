/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useEffect, useState } from "react";

export default function useFetchText(markdownUrl: string | null | undefined) {
  const [markdownText, setMarkdownText] = useState<string | undefined>();

  useEffect(() => {
    if (!markdownUrl) {
      setMarkdownText(undefined);
    } else {
      fetch(markdownUrl)
        .then((response) => response.text())
        .then((text) => setMarkdownText(text))
        .catch((error) => {
          console.error(error);
        });
    }
  }, [markdownUrl]);

  return markdownText;
}
