// src/lib/experiment/ExperimentController.ts
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../../amplify/data/resource';
import { AudioEngine } from '../audio/AudioEngine';
import { SoundManager } from '../audio/SoundManager';

export class ExperimentController {
  private client = generateClient<Schema>();
  private audioEngine: AudioEngine;
  private soundManager: SoundManager;
  private currentSessionId: string | null = null;

  constructor() {
    this.audioEngine = new AudioEngine();
    this.soundManager = new SoundManager();
  }

  async startSession(): Promise<string> {
    const session = await this.client.models.ExperimentSession.create({
      sessionId: `session_${Date.now()}`,
      startTime: new Date().toISOString()
    });
    this.currentSessionId = session.sessionId;
    return session.sessionId;
  }

  async logTransition(data: TransitionEvent): Promise<void> {
    if (!this.currentSessionId) {
      throw new Error('No active session');
    }

    await this.client.models.TransitionEvent.create({
      ...data,
      sessionId: this.currentSessionId
    });
  }

  async saveReview(data: ReviewData): Promise<void> {
    if (!this.currentSessionId) {
      throw new Error('No active session');
    }

    await this.client.models.ReviewData.create({
      ...data,
      timestamp: Date.now()
    });
  }
}