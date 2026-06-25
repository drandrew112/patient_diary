import de from "./lang/de.json";
import en from "./lang/en.json";
import hu from "./lang/hu.json";
import it from "./lang/it.json";

export const LANGUAGES = [
  {
    code: "de",
    label: {
      de: "Deutsch",
      en: "German",
      hu: "Német",
      it: "Tedesco"
    }
  },
  {
    code: "en",
    label: {
      de: "Englisch",
      en: "English",
      hu: "Angol",
      it: "Inglese"
    }
  },
  {
    code: "hu",
    label: {
      de: "Ungarisch",
      en: "Hungarian",
      hu: "Magyar",
      it: "Ungherese"
    }
  },
  {
    code: "it",
    label: {
      de: "Italienisch",
      en: "Italian",
      hu: "Olasz",
      it: "Italiano"
    }
  }
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

type PrimitiveTranslation = string;
type TranslationObject = {
  [key: string]: PrimitiveTranslation | TranslationObject;
};

type DeepTranslation<T> = {
  [K in keyof T]: T[K] extends string ? string : T[K] extends object ? DeepTranslation<T[K]> : string;
} & {
  [key: string]: any;
};

export type Translation = DeepTranslation<typeof en>;

const dictionaries: Record<Lang, TranslationObject> = {
  de,
  en,
  hu,
  it
};

function isObject(value: unknown): value is TranslationObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createTranslationProxy(
  selected: TranslationObject | undefined,
  fallback: TranslationObject | undefined
): TranslationObject {
  return new Proxy(
    {},
    {
      get(_target, property) {
        if (typeof property !== "string") {
          return undefined;
        }

        if (property === "toJSON") {
          return () => selected ?? fallback ?? {};
        }

        const selectedValue = selected?.[property];
        const fallbackValue = fallback?.[property];

        if (typeof selectedValue === "string") {
          return selectedValue;
        }

        if (typeof fallbackValue === "string") {
          return fallbackValue;
        }

        if (isObject(selectedValue) || isObject(fallbackValue)) {
          return createTranslationProxy(
            isObject(selectedValue) ? selectedValue : undefined,
            isObject(fallbackValue) ? fallbackValue : undefined
          );
        }

        return property;
      }
    }
  ) as TranslationObject;
}

export function getDictionary(lang: Lang): Translation {
  const selected = dictionaries[lang] ?? dictionaries.en;
  return createTranslationProxy(selected, dictionaries.en) as Translation;
}
