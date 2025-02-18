// src/components/shared/SessionController.tsx
import { useState } from 'react';
import { Flex, Button, Card, Text } from '@aws-amplify/ui-react';
import { ExperimentDataStore } from '../../lib/ExperimentDataStore';

interface SessionControllerProps {
  onSessionStart: () => void;
  onSessionEnd: () => void;
  dataStore: ExperimentDataStore;
}

export default function SessionController({
  onSessionStart,
  onSessionEnd,
  dataStore,
}: SessionControllerProps) {
  const [sessionActive, setSessionActive] = useState<boolean>(dataStore.isSessionActive());

  // セッション開始
  const handleStartSession = async () => {
    try {
      const sessionId = await dataStore.startSession();
      console.log('Session started:', sessionId);
      setSessionActive(true);
      onSessionStart();  // App 側に通知
    } catch (error) {
      console.error(error);
    }
  };

  // セッション終了
  const handleEndSession = async () => {
    try {
      await dataStore.endSession();
      console.log('Session ended');
      setSessionActive(false);
      onSessionEnd(); // App 側に通知
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card padding="medium">
      <Text fontWeight="bold">Session Control</Text>
      <Flex gap="small" marginTop="small">
        <Button 
          variation="primary" 
          onClick={handleStartSession}
          isDisabled={sessionActive}
        >
          実験開始
        </Button>
        <Button
          variation="warning"
          onClick={handleEndSession}
          isDisabled={!sessionActive}
        >
          実験終了
        </Button>
      </Flex>
    </Card>
  );
}
