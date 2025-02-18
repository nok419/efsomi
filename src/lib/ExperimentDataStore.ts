// src/lib/ExperimentDataStore.ts
import { DataStore } from 'aws-amplify/datastore';
import { 
  ExperimentSession, 
  TransitionEvent, 
  ReviewData 
} from '../types/audio';

export class ExperimentDataStore {
  private currentSession: ExperimentSession | null = null;
  private transitions: TransitionEvent[] = [];
  private reviews: ReviewData[] = [];
  private retryAttempts = 3;
  private retryDelay = 1000; // 1 second

  private async retry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: unknown;
    for (let i = 0; i < this.retryAttempts; i++) {
      try {
        return await operation();
      } catch (error: unknown) {
        lastError = error;
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
    if (lastError instanceof Error) {
      throw lastError;
    }
    throw new Error('Unknown error occurred during retry');
  }

  /**
   * セッションを開始する。
   * 既にセッションが始まっている場合はエラーを投げずにスキップ。
   */
  async startSession(): Promise<string> {
    // すでにセッションが開始されていればエラーを投げずスキップ
    if (this.currentSession) {
      console.warn('Session is already active. Skipping creation.');
      return this.currentSession.sessionId;
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentSession = {
      sessionId,
      startTime: new Date().toISOString(),
      transitions: [],
      reviews: []
    };

    try {
      await this.retry(() => 
        DataStore.save({
          ...this.currentSession
        })
      );
      return sessionId;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to start session: ${message}`);
    }
  }

  async logTransition(event: Omit<TransitionEvent, 'eventId' | 'sessionId'>): Promise<string> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const transitionEvent: TransitionEvent = {
      eventId: `transition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: this.currentSession.sessionId,
      ...event
    };

    try {
      await this.retry(() => 
        DataStore.save({
          ...transitionEvent
        })
      );

      this.transitions.push(transitionEvent);
      return transitionEvent.eventId;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to log transition: ${message}`);
    }
  }

  async saveReview(reviewData: Omit<ReviewData, 'timestamp'>): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    if (this.transitions.length === 0) {
      throw new Error('No transition event to associate review with');
    }

    const review: ReviewData = {
      ...reviewData,
      timestamp: Date.now()
    };

    try {
      await this.retry(() => 
        DataStore.save({
          ...review
        })
      );

      this.reviews.push(review);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to save review: ${message}`);
    }
  }

  async endSession(): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    try {
      const endTime = new Date().toISOString();
      
      await this.retry(() => 
        DataStore.save({
          ...this.currentSession,
          endTime,
          transitions: this.transitions,
          reviews: this.reviews
        })
      );

      try {
        localStorage.setItem(
          `session_backup_${this.currentSession.sessionId}`, 
          JSON.stringify({
            ...this.currentSession,
            endTime,
            transitions: this.transitions,
            reviews: this.reviews
          })
        );
      } catch (error) {
        console.warn('Failed to save session backup to localStorage:', error);
      }

      this.currentSession = null;
      this.transitions = [];
      this.reviews = [];
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to end session: ${message}`);
    }
  }

  async getSessionData(): Promise<ExperimentSession | null> {
    if (!this.currentSession) {
      return null;
    }

    return {
      ...this.currentSession,
      transitions: [...this.transitions],
      reviews: [...this.reviews]
    };
  }

  isSessionActive(): boolean {
    return this.currentSession !== null;
  }

  getTransitionCount(): number {
    return this.transitions.length;
  }

  getReviewCount(): number {
    return this.reviews.length;
  }

  async exportSessionBackup(): Promise<string> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const sessionData = {
      ...this.currentSession,
      transitions: this.transitions,
      reviews: this.reviews,
      exportedAt: new Date().toISOString()
    };

    return JSON.stringify(sessionData);
  }
}
