/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { getCurrentLocale, LanguageDictionary } from "@/util/lang";
import lang from "@/resources/lang.json";

const i18n = new LanguageDictionary(lang);
i18n.locale = getCurrentLocale();

export default i18n;
