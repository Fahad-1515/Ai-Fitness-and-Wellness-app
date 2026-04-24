export class TextToSpeech {
  private synth: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private lastSpokenText: string = "";
  private lastSpokenTime: number = 0;
  private minTimeBetweenSpeech: number = 3000; // 3 seconds

  constructor() {
    this.synth = window.speechSynthesis;
  }

  speak(text: string, priority: 'high' | 'normal' = 'normal') {
    // Avoid repeating the same message too quickly
    const now = Date.now();
    if (text === this.lastSpokenText && (now - this.lastSpokenTime) < this.minTimeBetweenSpeech) {
      return;
    }

    // Cancel current speech for high priority messages
    if (priority === 'high' && this.synth.speaking) {
      this.synth.cancel();
    }

    // If already speaking and normal priority, queue it
    if (this.synth.speaking && priority === 'normal') {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    // Try to use a more natural voice
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Female') ||
      voice.name.includes('Samantha')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.lastSpokenText = text;
    this.lastSpokenTime = now;
    
    this.synth.speak(utterance);
  }

  stop() {
    this.synth.cancel();
    this.currentUtterance = null;
  }

  isSpeaking(): boolean {
    return this.synth.speaking;
  }
}

export const tts = new TextToSpeech();
