// components/shared/ReviewDialog.tsx
import { useState } from 'react';
import { 
  View,
  Flex,
  Text,
  Button,
  Heading,
  Card
} from '@aws-amplify/ui-react';
import { Song,EnvironmentalSound } from '../../../types/audio';

interface ReviewRating {
  value: number;
  onChange: (value: number) => void;
  label: string;
  description?: string;
}

const RatingItem = ({ value, onChange, label, description }: ReviewRating) => (
  <Flex direction="column" gap="small">
    <Text fontSize="medium">{label}</Text>
    {description && (
      <Text variation="secondary" fontSize="small">
        {description}
      </Text>
    )}
    <Flex gap="small" wrap="wrap">
      {[1, 2, 3, 4, 5, 6, 7].map((rating) => (
        <Button
          key={rating}
          variation={value === rating ? "primary" : "link"}  // "default"を"link"に変更
          onClick={() => onChange(rating)}
          padding="medium"
          size="large"
        >
          {rating}
        </Button>
      ))}
    </Flex>
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
  onSubmit: (data: ReviewData) => void;
  currentTrack: Song | null;
  nextTrack: Song | null;
  bridgeSound: EnvironmentalSound | null;
}

export const ReviewDialog = ({
  isOpen,
  onClose,
  onSubmit,
  currentTrack,
  nextTrack,
  bridgeSound
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
      <Card
        backgroundColor="white"
        padding="xl"
        borderRadius="medium"
        width="90%"
        maxWidth="600px"
        maxHeight="90vh"
        overflow="auto"
      >
        <Flex direction="column" gap="large">
          <Heading level={3}>遷移評価</Heading>

          <Text variation="secondary" fontSize="small">
              遷移前: {currentTrack?.title} - {currentTrack?.artist}
          </Text>
          <Text variation="secondary" fontSize="small">
              遷移後: {nextTrack?.title} - {nextTrack?.artist}
          </Text>
            {bridgeSound && (
          <Text variation="secondary" fontSize="small">
            環境音ブリッジ: {bridgeSound.name} ({bridgeSound.category})
          </Text>
        )}

          <RatingItem
            value={ratings.continuity}
            onChange={(value) => setRatings(prev => ({...prev, continuity: value}))}
            label="音楽の流れの自然さ"
            description="1: 非常に不自然 - 7: 非常に自然"
          />

          <RatingItem
            value={ratings.emotional}
            onChange={(value) => setRatings(prev => ({...prev, emotional: value}))}
            label="感情の繋がり"
            description="1: 不連続 - 7: スムーズな連続性"
          />

          <RatingItem
            value={ratings.contextual}
            onChange={(value) => setRatings(prev => ({...prev, contextual: value}))}
            label="環境音の適切さ"
            description="1: 不適切 - 7: 非常に適切"
          />

          <Flex direction="column" gap="medium">
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
                    backgroundColor={
                      additionalFeedback[key as keyof typeof additionalFeedback] 
                        ? 'brand.primary' 
                        : 'white'
                    }
                    borderRadius="small"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="border.primary"
                  />
                  <Text>{label}</Text>
                </Flex>
              </View>
            ))}
          </Flex>

          <Flex direction="row" gap="medium" justifyContent="flex-end">
            <Button onClick={onClose} variation="link">
              キャンセル
            </Button>
            <Button onClick={handleSubmit} variation="primary">
              送信
            </Button>
          </Flex>
        </Flex>
      </Card>
    </View>
  );
};