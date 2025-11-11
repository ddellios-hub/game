import type { Locale, TranslationDictionary } from "./types";

export const dictionaries: TranslationDictionary[] = [
  {
    locale: "en",
    strings: {
      welcome: "Welcome to Sandbox Hub",
      lobby: "Lobby",
      rooms: "Rooms",
      createRoom: "Create room",
      quickPlay: "Quick Play",
      editor: "World Creator",
      shop: "Shop",
      reports: "Reports",
      moderation: "Moderation",
      logout: "Log out"
    }
  },
  {
    locale: "el",
    strings: {
      welcome: "Καλώς ήρθες στο Sandbox Hub",
      lobby: "Λόμπι",
      rooms: "Δωμάτια",
      createRoom: "Δημιουργία δωματίου",
      quickPlay: "Γρήγορο παιχνίδι",
      editor: "Δημιουργός Κόσμων",
      shop: "Κατάστημα",
      reports: "Αναφορές",
      moderation: "Διαχείριση",
      logout: "Αποσύνδεση"
    }
  }
];

export function getDictionary(locale: Locale): Record<string, string> {
  return dictionaries.find((dict) => dict.locale === locale)?.strings ?? dictionaries[0].strings;
}
