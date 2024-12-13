// src/components/shared/ReviewDialog.tsx
import { useState } from 'react';
import { 
  View,
  Flex,
  Text,
  Button,
  Heading,
  Rating
} from '@aws-amplify/ui-react';

interface ReviewRating {
  value: number;
  onChange: (newValue: number) => void;
  label: string;
  description?: string;
}

const RatingItem = ({ value,label, description }: ReviewRating) => (
  <Flex direction="column" gap="small">
    <Text>{label}</Text>
    {description && (
      <Text variation="secondary" fontSize="small">
        {description}
      </Text>
    )}
    <Rating
      value={value}
      //onChange={(e: CustomEvent<number>) => onChange(e.detail)}
      maxValue={7}
    />
  </Flex>
);

interface ReviewData {
  ratings: {
    continuity: number;
    emotional: number;
    contextual: number;
  };
  additionalFeedback: {
    wantToSkip: boolean;
    feltDiscomfort: boolean;
    wouldUseAgain: boolean;
  };
  timestamp: number;
}

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ratings: ReviewData) => void;
  currentTrack: { title: string; artist: string } | null;
}

export const ReviewDialog = ({
  isOpen,
  onClose,
  onSubmit,
  currentTrack
}: ReviewDialogProps) => {
  const [ratings, setRatings] = useState({
    continuity: 4,
    emotional: 4,
    contextual: 4
  });

  const [additionalFeedback, setAdditionalFeedback] = useState({
    wantToSkip: false,
    feltDiscomfort: false,
    wouldUseAgain: true
  });

  const handleSubmit = () => {
    onSubmit({
      ratings,
      additionalFeedback,
      timestamp: Date.now()
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <View
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      backgroundColor="rgba(0, 0, 0, 0.5)"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <View
        backgroundColor="white"
        padding="1.5rem"
        borderRadius="medium"
        width="400px"
        maxHeight="90vh"
        overflow="auto"
      >
        <Flex direction="column" gap="medium">
          <Heading level={3}>遷移評価</Heading>

          {currentTrack && (
            <Text variation="secondary">
              評価曲: {currentTrack.title} - {currentTrack.artist}
            </Text>
          )}

          <Flex direction="column" gap="large">
            <RatingItem
              value={ratings.continuity}
              onChange={(value: number) => setRatings(prev => ({...prev, continuity: value}))}
              label="音楽の流れの自然さ"
              description="1: 非常に不自然 - 7: 非常に自然"
            />

            <RatingItem
              value={ratings.emotional}
              onChange={(value: number) => setRatings(prev => ({...prev, emotional: value}))}
              label="感情の繋がり"
              description="1: 不連続 - 7: スムーズな連続性"
            />

            <RatingItem
              value={ratings.contextual}
              onChange={(value: number) => setRatings(prev => ({...prev, contextual: value}))}
              label="環境音の適切さ"
              description="1: 不適切 - 7: 非常に適切"
            />
          </Flex>

          <Flex direction="column" gap="small" padding="medium">
            {Object.entries({
              wantToSkip: "この遷移はスキップしたいと感じた",
              feltDiscomfort: "違和感を覚えた",
              wouldUseAgain: "この環境音をまた使いたい"
            }).map(([key, label]) => (
              <View 
                key={key} 
                onClick={() => 
                  setAdditionalFeedback(prev => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof additionalFeedback]
                  }))
                }
                style={{ cursor: 'pointer' }}
              >
                <Flex alignItems="center" gap="small">
                  <View
                    width="20px"
                    height="20px"
                    style={{
                      backgroundColor: additionalFeedback[key as keyof typeof additionalFeedback] ? '#1a365d' : 'white',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                  <Text>{label}</Text>
                </Flex>
              </View>
            ))}
          </Flex>

          <Flex 
            direction="row" 
            gap="medium"
            style={{ 
              justifyContent: 'flex-end'
            }}
          >
            <Button onClick={onClose} variation="link">
              スキップ
            </Button>
            <Button onClick={handleSubmit} variation="primary">
              送信
            </Button>
          </Flex>
        </Flex>
      </View>
    </View>
  );
};