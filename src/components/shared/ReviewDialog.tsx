import { useState, useEffect } from 'react';
import { 
  View,
  Flex,
  Text,
  Button,
  Heading,
  Card,
  SliderField,
  Divider
} from '@aws-amplify/ui-react';

interface ReviewRating {
  value: number;
  onChange: (value: number) => void;
  label: string;
  description?: string;
}

const RatingSlider = ({ value, onChange, label, description }: ReviewRating) => {
  // 値が正しく更新されていることを確認
  useEffect(() => {
    console.log(`Rating changed for ${label}: ${value}`);
  }, [value, label]);

  return (
    <Flex direction="column" gap="xs">
      <Text fontSize="medium">{label}</Text>
      {description && (
        <Text variation="secondary" fontSize="small">
          {description}
        </Text>
      )}
      <View width="100%" paddingTop="xs" position="relative">
        {/* スライダーのティックマーク */}
        <Flex
          position="absolute"
          width="100%"
          justifyContent="space-between"
          padding="2px"
          top="12px"
          style={{ pointerEvents: 'none' }}
        >
          {[...Array(7)].map((_, i) => (
            <View
              key={i}
              width="1px"
              height="8px"
              backgroundColor="border.primary"
            />
          ))}
        </Flex>
        
        {/* スライダー本体 */}
        <SliderField
          label={`評価値: ${value}`}
          labelHidden
          value={value}
          onChange={(e) => onChange(Number(e))}
          min={1}
          max={7}
          step={1}
          size="small"
        />
        
        {/* 端点の数値表示 */}
        <Flex justifyContent="space-between" padding="2px" marginTop="4px">
          <Text fontSize="xs">1</Text>
          <Text fontSize="xs">7</Text>
        </Flex>
      </View>
    </Flex>
  );
};

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
  currentTrack: { title: string; artist: string } | null;
  nextTrack: { title: string; artist: string } | null;
  bridgeSound: { name: string; category: string } | null;
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
    // 送信前に値の検証
    console.log('Submitting ratings:', ratings);
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
        padding="medium"
        borderRadius="medium"
        width="90%"
        maxWidth="500px"
        maxHeight="90vh"
        overflow="auto"
      >
        <Flex direction="column" gap="medium">
          <Heading level={4} padding="xs">遷移評価</Heading>

          {/* 遷移情報の表示 */}
          <Card variation="elevated" padding="xs">
            <Flex direction="column" gap="xs">
              <View>
                <Text fontWeight="bold" fontSize="small">遷移前</Text>
                <Text variation="secondary" fontSize="small">
                  {currentTrack?.title} - {currentTrack?.artist}
                </Text>
              </View>
              
              <View>
                <Text fontWeight="bold" fontSize="small">環境音</Text>
                <Text variation="secondary" fontSize="small">
                  {bridgeSound?.name} ({bridgeSound?.category})
                </Text>
              </View>

              <View>
                <Text fontWeight="bold" fontSize="small">遷移後</Text>
                <Text variation="secondary" fontSize="small">
                  {nextTrack?.title} - {nextTrack?.artist}
                </Text>
              </View>
            </Flex>
          </Card>

          <Divider />

          {/* 評価スライダー */}
          <Flex direction="column" gap="medium">
            <RatingSlider
              value={ratings.continuity}
              onChange={(value) => setRatings(prev => ({...prev, continuity: value}))}
              label="音楽の流れの自然さ"
              description="遷移の滑らかさを評価してください"
            />

            <RatingSlider
              value={ratings.emotional}
              onChange={(value) => setRatings(prev => ({...prev, emotional: value}))}
              label="感情の繋がり"
              description="曲想の連続性を評価してください"
            />

            <RatingSlider
              value={ratings.contextual}
              onChange={(value) => setRatings(prev => ({...prev, contextual: value}))}
              label="環境音の適切さ"
              description="環境音の選択が適切か評価してください"
            />
          </Flex>

          <Divider />

          {/* 補足評価 */}
          <Card padding="xs">
            <Flex direction="column" gap="xs">
              {Object.entries({
                wantToSkip: "スキップしたいと感じた",
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
                  <Flex alignItems="center" gap="xs">
                    <View
                      width="16px"
                      height="16px"
                      backgroundColor={
                        additionalFeedback[key as keyof typeof additionalFeedback] 
                          ? 'brand.primary.80' 
                          : 'white'
                      }
                      borderRadius="small"
                      borderWidth="1px"
                      borderStyle="solid"
                      borderColor="border.primary"
                    />
                    <Text fontSize="small">{label}</Text>
                  </Flex>
                </View>
              ))}
            </Flex>
          </Card>

          <Flex direction="row" gap="small" justifyContent="flex-end">
            <Button onClick={onClose} variation="link" size="small">
              キャンセル
            </Button>
            <Button onClick={handleSubmit} variation="primary" size="small">
              送信
            </Button>
          </Flex>
        </Flex>
      </Card>
    </View>
  );
};