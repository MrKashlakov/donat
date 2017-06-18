/**
 * Voice speeker
 */
class Speaker {
  constructor(voice, rate, pitch) {
    if (!speechSynthesis) {
      throw new Error('This browser not support SpeechSinthesis');
    }
    this._voice = voice;
    this._rate = rate || 1;
    this._pitch = pitch || 1;
  }

  /**
   * Get available voices by language
   * @param {String} lang actual language, for example en-GB or ru-RU
   */
  static getVoicesByLang(lang) {
    const voices = speechSynthesis.getVoices();
    return voices.filter((voice) => {
      return voice.lang === lang;
    });
  };

  /**
   * Adding event listener on speech end
   * @param {Function} callback speech end handler
   */
  onSpeechEnd(callback) {
    this._onSpeechEndCallback = callback;
  }

  /**
   * Is speak now
   */
  isSpeaking() {
    return speechSynthesis.speaking;
  }

  /**
   * Read given text
   * @param {String} text text for speech
   */
  speak(text) {
    const textToSpeech = new SpeechSynthesisUtterance(text);
    textToSpeech.voice = this._voice;
    textToSpeech.rate = this._rate;
    textToSpeech.pitch = this._pitch;
    textToSpeech.onend = this._onSpeechEndCallback;
    speechSynthesis.speak(textToSpeech);
  }
}

export default Speaker;
