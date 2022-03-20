export declare type CensorLocale = 'en';
export declare enum CensorTier {
    Slurs = 1,
    CommonProfanity = 2,
    SexualTerms = 3,
    PossiblyOffensive = 4,
    UserAdded = 5,
}
export declare class CensorSensor {
    private locale;
    private blackList;
    private customDictionary;
    private enabledTiers;
    private defaultCleanFunction;
    private customCleanFunction;
    private readonly currentDictionary;
    private readonly cleanFunction;
    addLocale(newLocale: string, dict: {
        [word: string]: CensorTier;
    }): void;
    setLocale(locale: CensorLocale | string): void;
    disableTier(tier: CensorTier): void;
    enableTier(tier: CensorTier): void;
    addWord(word: string, tier?: CensorTier): void;
    removeWord(word: string): void;
    private prepareForParsing(phrase);
    private _isProfane(word, dict);
    isProfane(phrase: string): boolean;
    private _isProfaneIsh(phrase, dict);
    isProfaneIsh(phrase: string): boolean;
    private _profaneIshWords(phrase, dict);
    profaneIshWords(phrase: string): string[];
    setCleanFunction(func: (str: string) => string): void;
    resetCleanFunction(): void;
    cleanProfanity(phrase: string): string;
    cleanProfanityIsh(phrase: string): string;
}
