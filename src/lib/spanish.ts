// A curated set of common Spanish words and phrases for beginner practice —
// hand-picked across everyday categories (greetings, numbers, family, food,
// common verbs, question words, useful phrases). This is not a scrape of
// any specific course's proprietary curriculum; it's an original, broadly
// representative set of high-frequency beginner vocabulary with English
// translations and simple phonetic (English-style) pronunciations.

export interface SpanishEntry {
  spanish: string
  english: string
  pronunciation: string
  category: string
}

export const SPANISH_BANK: SpanishEntry[] = [
  // Greetings & basics
  { spanish: 'hola', english: 'hello', pronunciation: 'OH-lah', category: 'Greetings' },
  { spanish: 'adiós', english: 'goodbye', pronunciation: 'ah-dee-OHS', category: 'Greetings' },
  { spanish: 'buenos días', english: 'good morning', pronunciation: 'BWAY-nohs DEE-ahs', category: 'Greetings' },
  { spanish: 'buenas tardes', english: 'good afternoon', pronunciation: 'BWAY-nahs TAR-dess', category: 'Greetings' },
  { spanish: 'buenas noches', english: 'good night', pronunciation: 'BWAY-nahs NOH-chess', category: 'Greetings' },
  { spanish: 'por favor', english: 'please', pronunciation: 'por fah-VOR', category: 'Greetings' },
  { spanish: 'gracias', english: 'thank you', pronunciation: 'GRAH-see-ahs', category: 'Greetings' },
  { spanish: 'de nada', english: "you're welcome", pronunciation: 'deh NAH-dah', category: 'Greetings' },
  { spanish: 'lo siento', english: "I'm sorry", pronunciation: 'loh see-EN-toh', category: 'Greetings' },
  { spanish: 'perdón', english: 'excuse me', pronunciation: 'per-DOHN', category: 'Greetings' },
  { spanish: 'sí', english: 'yes', pronunciation: 'see', category: 'Greetings' },
  { spanish: 'no', english: 'no', pronunciation: 'noh', category: 'Greetings' },
  { spanish: '¿cómo estás?', english: 'how are you?', pronunciation: 'KOH-moh es-TAHS', category: 'Greetings' },
  { spanish: 'bien', english: 'fine / well', pronunciation: 'bee-EN', category: 'Greetings' },
  { spanish: 'mal', english: 'bad', pronunciation: 'mahl', category: 'Greetings' },

  // Numbers 1-20
  { spanish: 'uno', english: 'one', pronunciation: 'OO-noh', category: 'Numbers' },
  { spanish: 'dos', english: 'two', pronunciation: 'dohs', category: 'Numbers' },
  { spanish: 'tres', english: 'three', pronunciation: 'trehs', category: 'Numbers' },
  { spanish: 'cuatro', english: 'four', pronunciation: 'KWAH-troh', category: 'Numbers' },
  { spanish: 'cinco', english: 'five', pronunciation: 'SEEN-koh', category: 'Numbers' },
  { spanish: 'seis', english: 'six', pronunciation: 'SAY-ees', category: 'Numbers' },
  { spanish: 'siete', english: 'seven', pronunciation: 'see-EH-teh', category: 'Numbers' },
  { spanish: 'ocho', english: 'eight', pronunciation: 'OH-choh', category: 'Numbers' },
  { spanish: 'nueve', english: 'nine', pronunciation: 'noo-EH-veh', category: 'Numbers' },
  { spanish: 'diez', english: 'ten', pronunciation: 'dee-EHS', category: 'Numbers' },
  { spanish: 'once', english: 'eleven', pronunciation: 'OHN-seh', category: 'Numbers' },
  { spanish: 'doce', english: 'twelve', pronunciation: 'DOH-seh', category: 'Numbers' },
  { spanish: 'trece', english: 'thirteen', pronunciation: 'TREH-seh', category: 'Numbers' },
  { spanish: 'catorce', english: 'fourteen', pronunciation: 'kah-TOR-seh', category: 'Numbers' },
  { spanish: 'quince', english: 'fifteen', pronunciation: 'KEEN-seh', category: 'Numbers' },
  { spanish: 'dieciséis', english: 'sixteen', pronunciation: 'dee-eh-see-SAY-ees', category: 'Numbers' },
  { spanish: 'diecisiete', english: 'seventeen', pronunciation: 'dee-eh-see-see-EH-teh', category: 'Numbers' },
  { spanish: 'dieciocho', english: 'eighteen', pronunciation: 'dee-eh-see-OH-choh', category: 'Numbers' },
  { spanish: 'diecinueve', english: 'nineteen', pronunciation: 'dee-eh-see-noo-EH-veh', category: 'Numbers' },
  { spanish: 'veinte', english: 'twenty', pronunciation: 'VAYN-teh', category: 'Numbers' },

  // Days of the week
  { spanish: 'lunes', english: 'Monday', pronunciation: 'LOO-ness', category: 'Days & Time' },
  { spanish: 'martes', english: 'Tuesday', pronunciation: 'MAR-tess', category: 'Days & Time' },
  { spanish: 'miércoles', english: 'Wednesday', pronunciation: 'mee-EHR-koh-less', category: 'Days & Time' },
  { spanish: 'jueves', english: 'Thursday', pronunciation: 'HWEH-vess', category: 'Days & Time' },
  { spanish: 'viernes', english: 'Friday', pronunciation: 'vee-EHR-ness', category: 'Days & Time' },
  { spanish: 'sábado', english: 'Saturday', pronunciation: 'SAH-bah-doh', category: 'Days & Time' },
  { spanish: 'domingo', english: 'Sunday', pronunciation: 'doh-MEEN-goh', category: 'Days & Time' },
  { spanish: 'hoy', english: 'today', pronunciation: 'oy', category: 'Days & Time' },
  { spanish: 'mañana', english: 'tomorrow', pronunciation: 'mah-NYAH-nah', category: 'Days & Time' },
  { spanish: 'ayer', english: 'yesterday', pronunciation: 'ah-YEHR', category: 'Days & Time' },
  { spanish: 'ahora', english: 'now', pronunciation: 'ah-OH-rah', category: 'Days & Time' },
  { spanish: 'después', english: 'after / later', pronunciation: 'des-PWES', category: 'Days & Time' },
  { spanish: 'antes', english: 'before', pronunciation: 'AHN-tess', category: 'Days & Time' },
  { spanish: 'siempre', english: 'always', pronunciation: 'see-EM-preh', category: 'Days & Time' },
  { spanish: 'nunca', english: 'never', pronunciation: 'NOON-kah', category: 'Days & Time' },
  { spanish: 'a veces', english: 'sometimes', pronunciation: 'ah VEH-sess', category: 'Days & Time' },
  { spanish: 'temprano', english: 'early', pronunciation: 'tem-PRAH-noh', category: 'Days & Time' },

  // Colors
  { spanish: 'rojo', english: 'red', pronunciation: 'ROH-hoh', category: 'Colors' },
  { spanish: 'azul', english: 'blue', pronunciation: 'ah-SOOL', category: 'Colors' },
  { spanish: 'verde', english: 'green', pronunciation: 'VEHR-deh', category: 'Colors' },
  { spanish: 'amarillo', english: 'yellow', pronunciation: 'ah-mah-REE-yoh', category: 'Colors' },
  { spanish: 'negro', english: 'black', pronunciation: 'NEH-groh', category: 'Colors' },
  { spanish: 'blanco', english: 'white', pronunciation: 'BLAHN-koh', category: 'Colors' },
  { spanish: 'naranja', english: 'orange', pronunciation: 'nah-RAHN-hah', category: 'Colors' },
  { spanish: 'morado', english: 'purple', pronunciation: 'moh-RAH-doh', category: 'Colors' },
  { spanish: 'rosa', english: 'pink', pronunciation: 'ROH-sah', category: 'Colors' },
  { spanish: 'gris', english: 'gray', pronunciation: 'grees', category: 'Colors' },

  // Family
  { spanish: 'familia', english: 'family', pronunciation: 'fah-MEE-lee-ah', category: 'Family' },
  { spanish: 'madre', english: 'mother', pronunciation: 'MAH-dreh', category: 'Family' },
  { spanish: 'padre', english: 'father', pronunciation: 'PAH-dreh', category: 'Family' },
  { spanish: 'hermano', english: 'brother', pronunciation: 'ehr-MAH-noh', category: 'Family' },
  { spanish: 'hermana', english: 'sister', pronunciation: 'ehr-MAH-nah', category: 'Family' },
  { spanish: 'hijo', english: 'son', pronunciation: 'EE-hoh', category: 'Family' },
  { spanish: 'hija', english: 'daughter', pronunciation: 'EE-hah', category: 'Family' },
  { spanish: 'abuelo', english: 'grandfather', pronunciation: 'ah-BWEH-loh', category: 'Family' },
  { spanish: 'abuela', english: 'grandmother', pronunciation: 'ah-BWEH-lah', category: 'Family' },
  { spanish: 'tío', english: 'uncle', pronunciation: 'TEE-oh', category: 'Family' },
  { spanish: 'tía', english: 'aunt', pronunciation: 'TEE-ah', category: 'Family' },
  { spanish: 'amigo', english: 'friend', pronunciation: 'ah-MEE-goh', category: 'Family' },

  // Common verbs
  { spanish: 'ser', english: 'to be (permanent)', pronunciation: 'sehr', category: 'Verbs' },
  { spanish: 'estar', english: 'to be (temporary)', pronunciation: 'es-TAHR', category: 'Verbs' },
  { spanish: 'tener', english: 'to have', pronunciation: 'teh-NEHR', category: 'Verbs' },
  { spanish: 'hacer', english: 'to do / make', pronunciation: 'ah-SEHR', category: 'Verbs' },
  { spanish: 'ir', english: 'to go', pronunciation: 'eer', category: 'Verbs' },
  { spanish: 'poder', english: 'to be able to / can', pronunciation: 'poh-DEHR', category: 'Verbs' },
  { spanish: 'querer', english: 'to want', pronunciation: 'keh-REHR', category: 'Verbs' },
  { spanish: 'decir', english: 'to say', pronunciation: 'deh-SEER', category: 'Verbs' },
  { spanish: 'ver', english: 'to see', pronunciation: 'vehr', category: 'Verbs' },
  { spanish: 'dar', english: 'to give', pronunciation: 'dahr', category: 'Verbs' },
  { spanish: 'saber', english: 'to know (facts)', pronunciation: 'sah-BEHR', category: 'Verbs' },
  { spanish: 'conocer', english: 'to know (people/places)', pronunciation: 'koh-noh-SEHR', category: 'Verbs' },
  { spanish: 'comer', english: 'to eat', pronunciation: 'koh-MEHR', category: 'Verbs' },
  { spanish: 'beber', english: 'to drink', pronunciation: 'beh-BEHR', category: 'Verbs' },
  { spanish: 'dormir', english: 'to sleep', pronunciation: 'dor-MEER', category: 'Verbs' },
  { spanish: 'hablar', english: 'to speak', pronunciation: 'ah-BLAHR', category: 'Verbs' },
  { spanish: 'vivir', english: 'to live', pronunciation: 'vee-VEER', category: 'Verbs' },
  { spanish: 'trabajar', english: 'to work', pronunciation: 'trah-bah-HAHR', category: 'Verbs' },
  { spanish: 'estudiar', english: 'to study', pronunciation: 'es-too-dee-AHR', category: 'Verbs' },
  { spanish: 'escribir', english: 'to write', pronunciation: 'es-kree-BEER', category: 'Verbs' },
  { spanish: 'leer', english: 'to read', pronunciation: 'leh-EHR', category: 'Verbs' },
  { spanish: 'caminar', english: 'to walk', pronunciation: 'kah-mee-NAHR', category: 'Verbs' },
  { spanish: 'correr', english: 'to run', pronunciation: 'koh-RREHR', category: 'Verbs' },
  { spanish: 'jugar', english: 'to play', pronunciation: 'hoo-GAHR', category: 'Verbs' },
  { spanish: 'amar', english: 'to love', pronunciation: 'ah-MAHR', category: 'Verbs' },

  // Food
  { spanish: 'agua', english: 'water', pronunciation: 'AH-gwah', category: 'Food' },
  { spanish: 'pan', english: 'bread', pronunciation: 'pahn', category: 'Food' },
  { spanish: 'leche', english: 'milk', pronunciation: 'LEH-cheh', category: 'Food' },
  { spanish: 'huevo', english: 'egg', pronunciation: 'WEH-voh', category: 'Food' },
  { spanish: 'queso', english: 'cheese', pronunciation: 'KEH-soh', category: 'Food' },
  { spanish: 'carne', english: 'meat', pronunciation: 'KAHR-neh', category: 'Food' },
  { spanish: 'pollo', english: 'chicken', pronunciation: 'POH-yoh', category: 'Food' },
  { spanish: 'pescado', english: 'fish', pronunciation: 'pehs-KAH-doh', category: 'Food' },
  { spanish: 'arroz', english: 'rice', pronunciation: 'ah-RROHS', category: 'Food' },
  { spanish: 'fruta', english: 'fruit', pronunciation: 'FROO-tah', category: 'Food' },
  { spanish: 'manzana', english: 'apple', pronunciation: 'mahn-SAH-nah', category: 'Food' },
  { spanish: 'plátano', english: 'banana', pronunciation: 'PLAH-tah-noh', category: 'Food' },
  { spanish: 'verdura', english: 'vegetable', pronunciation: 'vehr-DOO-rah', category: 'Food' },
  { spanish: 'ensalada', english: 'salad', pronunciation: 'en-sah-LAH-dah', category: 'Food' },
  { spanish: 'sopa', english: 'soup', pronunciation: 'SOH-pah', category: 'Food' },
  { spanish: 'café', english: 'coffee', pronunciation: 'kah-FEH', category: 'Food' },
  { spanish: 'té', english: 'tea', pronunciation: 'teh', category: 'Food' },
  { spanish: 'azúcar', english: 'sugar', pronunciation: 'ah-SOO-kar', category: 'Food' },
  { spanish: 'sal', english: 'salt', pronunciation: 'sahl', category: 'Food' },

  // Question words
  { spanish: 'qué', english: 'what', pronunciation: 'keh', category: 'Questions' },
  { spanish: 'quién', english: 'who', pronunciation: 'kee-EHN', category: 'Questions' },
  { spanish: 'cuándo', english: 'when', pronunciation: 'KWAHN-doh', category: 'Questions' },
  { spanish: 'dónde', english: 'where', pronunciation: 'DOHN-deh', category: 'Questions' },
  { spanish: 'por qué', english: 'why', pronunciation: 'por keh', category: 'Questions' },
  { spanish: 'cómo', english: 'how', pronunciation: 'KOH-moh', category: 'Questions' },
  { spanish: 'cuál', english: 'which', pronunciation: 'kwahl', category: 'Questions' },
  { spanish: 'cuánto', english: 'how much', pronunciation: 'KWAHN-toh', category: 'Questions' },

  // Common phrases
  { spanish: '¿cómo te llamas?', english: "what's your name?", pronunciation: 'KOH-moh teh YAH-mahs', category: 'Phrases' },
  { spanish: 'me llamo...', english: 'my name is...', pronunciation: 'meh YAH-moh', category: 'Phrases' },
  { spanish: 'mucho gusto', english: 'nice to meet you', pronunciation: 'MOO-choh GOOS-toh', category: 'Phrases' },
  { spanish: '¿de dónde eres?', english: 'where are you from?', pronunciation: 'deh DOHN-deh EH-rehs', category: 'Phrases' },
  { spanish: 'no entiendo', english: "I don't understand", pronunciation: 'noh en-tee-EHN-doh', category: 'Phrases' },
  { spanish: '¿puedes ayudarme?', english: 'can you help me?', pronunciation: 'PWEH-dess ah-yoo-DAHR-meh', category: 'Phrases' },
  { spanish: '¿cuánto cuesta?', english: 'how much does it cost?', pronunciation: 'KWAHN-toh KWES-tah', category: 'Phrases' },
  { spanish: 'tengo hambre', english: "I'm hungry", pronunciation: 'TEHN-goh AHM-breh', category: 'Phrases' },
  { spanish: 'tengo sed', english: "I'm thirsty", pronunciation: 'TEHN-goh sehd', category: 'Phrases' },
  { spanish: 'tengo frío', english: "I'm cold", pronunciation: 'TEHN-goh FREE-oh', category: 'Phrases' },
  { spanish: 'tengo calor', english: "I'm hot", pronunciation: 'TEHN-goh kah-LOR', category: 'Phrases' },
  { spanish: '¿qué hora es?', english: 'what time is it?', pronunciation: 'keh OH-rah ess', category: 'Phrases' },
  { spanish: 'buen provecho', english: 'enjoy your meal', pronunciation: 'bwen proh-VEH-choh', category: 'Phrases' },
  { spanish: 'salud', english: 'cheers / bless you', pronunciation: 'sah-LOOD', category: 'Phrases' },
  { spanish: 'feliz cumpleaños', english: 'happy birthday', pronunciation: 'feh-LEES koom-pleh-AH-nyohs', category: 'Phrases' },
  { spanish: 'buen viaje', english: 'have a good trip', pronunciation: 'bwen vee-AH-heh', category: 'Phrases' },
  { spanish: 'buena suerte', english: 'good luck', pronunciation: 'BWEH-nah SWEHR-teh', category: 'Phrases' },
  { spanish: '¡cuidado!', english: 'watch out!', pronunciation: 'kwee-DAH-doh', category: 'Phrases' },
  { spanish: 'no pasa nada', english: "it's okay / no worries", pronunciation: 'noh PAH-sah NAH-dah', category: 'Phrases' },
  { spanish: 'más o menos', english: 'more or less / so-so', pronunciation: 'mahs oh MEH-nohs', category: 'Phrases' },
  { spanish: 'claro que sí', english: 'of course', pronunciation: 'KLAH-roh keh see', category: 'Phrases' },
  { spanish: 'tal vez', english: 'maybe', pronunciation: 'tahl vess', category: 'Phrases' },
  { spanish: 'ahora mismo', english: 'right now', pronunciation: 'ah-OH-rah MEES-moh', category: 'Phrases' },
  { spanish: 'todo bien', english: 'all good', pronunciation: 'TOH-doh bee-EN', category: 'Phrases' },
  { spanish: 'nos vemos', english: 'see you later', pronunciation: 'nohs VEH-mohs', category: 'Phrases' },

  // Adjectives
  { spanish: 'grande', english: 'big', pronunciation: 'GRAHN-deh', category: 'Adjectives' },
  { spanish: 'pequeño', english: 'small', pronunciation: 'peh-KEH-nyoh', category: 'Adjectives' },
  { spanish: 'bueno', english: 'good', pronunciation: 'BWEH-noh', category: 'Adjectives' },
  { spanish: 'malo', english: 'bad', pronunciation: 'MAH-loh', category: 'Adjectives' },
  { spanish: 'feliz', english: 'happy', pronunciation: 'feh-LEES', category: 'Adjectives' },
  { spanish: 'triste', english: 'sad', pronunciation: 'TREES-teh', category: 'Adjectives' },
  { spanish: 'caliente', english: 'hot', pronunciation: 'kah-lee-EN-teh', category: 'Adjectives' },
  { spanish: 'frío', english: 'cold', pronunciation: 'FREE-oh', category: 'Adjectives' },
  { spanish: 'nuevo', english: 'new', pronunciation: 'NWEH-voh', category: 'Adjectives' },
  { spanish: 'viejo', english: 'old', pronunciation: 'vee-EH-hoh', category: 'Adjectives' },
  { spanish: 'bonito', english: 'pretty', pronunciation: 'boh-NEE-toh', category: 'Adjectives' },
  { spanish: 'feo', english: 'ugly', pronunciation: 'FEH-oh', category: 'Adjectives' },
  { spanish: 'rápido', english: 'fast', pronunciation: 'RAH-pee-doh', category: 'Adjectives' },
  { spanish: 'lento', english: 'slow', pronunciation: 'LEN-toh', category: 'Adjectives' },
  { spanish: 'fácil', english: 'easy', pronunciation: 'FAH-seel', category: 'Adjectives' },

  // Places
  { spanish: 'casa', english: 'house', pronunciation: 'KAH-sah', category: 'Places' },
  { spanish: 'escuela', english: 'school', pronunciation: 'es-KWEH-lah', category: 'Places' },
  { spanish: 'trabajo', english: 'work', pronunciation: 'trah-BAH-hoh', category: 'Places' },
  { spanish: 'ciudad', english: 'city', pronunciation: 'see-oo-DAHD', category: 'Places' },
  { spanish: 'país', english: 'country', pronunciation: 'pah-EES', category: 'Places' },
  { spanish: 'calle', english: 'street', pronunciation: 'KAH-yeh', category: 'Places' },
  { spanish: 'tienda', english: 'store', pronunciation: 'tee-EN-dah', category: 'Places' },
  { spanish: 'restaurante', english: 'restaurant', pronunciation: 'res-tow-RAHN-teh', category: 'Places' },
  { spanish: 'hospital', english: 'hospital', pronunciation: 'ohs-pee-TAHL', category: 'Places' },
  { spanish: 'parque', english: 'park', pronunciation: 'PAR-keh', category: 'Places' },
]

export const SPANISH_CATEGORIES = Array.from(new Set(SPANISH_BANK.map((e) => e.category)))

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Picks a practice deck, preferring entries not yet marked learned and
 * excluding words already in the user's deck to keep sessions fresh. */
export function pickPracticeDeck(
  learnedSpanishWords: Set<string>,
  count = 10,
  category?: string
): SpanishEntry[] {
  const pool = category ? SPANISH_BANK.filter((e) => e.category === category) : SPANISH_BANK
  const unseen = pool.filter((e) => !learnedSpanishWords.has(e.spanish.toLowerCase()))
  const source = unseen.length >= count ? unseen : pool
  return shuffle(source).slice(0, Math.min(count, source.length))
}
