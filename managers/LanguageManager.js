class LanguageManager {
    constructor () {
        this.CURRENT_LANGUAGE = "en";

        this.TRANSLATE_IDENTIFIER = "translate_txt";
        this.KEY = "transl_key";

        this.LANG_STRING_TO_KEY = {
            English: "en",
            Česky: "cz",
        };
    }
    setNewLanguage(newLang) {
        if (!this.LANG_STRING_TO_KEY[newLang]) return;

        const newLangKey = this.LANG_STRING_TO_KEY[newLang];

        if (newLangKey === this.CURRENT_LANGUAGE) return;

        CURRENT_LANGUAGE = newLangKey;
        SETTINGS.manageLoadingState();
        Fetcher.fetchTranslations(this.translateGame);
    }
    translateGame(isInit = false) {
        document.querySelectorAll(`.${this.TRANSLATE_IDENTIFIER}`).forEach((el) => {
            const key = el.getAttribute(this.KEY);

            if (!TEXT_TRANSLATIONS[key]) return el.innerText = key;

            el.innerText = TEXT_TRANSLATIONS[key];

            //if (!isInit) SETTINGS.manageLoadingState(false);
        })
    }
}