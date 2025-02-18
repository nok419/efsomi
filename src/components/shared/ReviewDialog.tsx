// src/components/shared/ReviewDialog.tsx
import { useState, useEffect } from 'react';
import { View, Flex, Text, Button, Heading, Card, SliderField, Divider } from '@aws-amplify/ui-react';
import { ReviewData } from '../../types/audio';

// スライダー1つ分
interface ReviewRating {
  value: number;
  onChange: (value: number) => void;
  label: string;
  description?: string;
}

const RatingSlider = ({ value, onChange, label, description }: ReviewRating) => {
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
        {/* ティックマーク */}
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
        
        {/* 端点(1,7)ラベル */}
        <Flex justifyContent="space-between" padding="2px" marginTop="4px">
          <Text fontSize="xs">1</Text>
          <Text fontSize="xs">7</Text>
        </Flex>
      </View>
    </Flex>
  );
};

interface AdditionalFeedback {
  wantToSkip: boolean;
  feltDiscomfort: boolean;
  wouldUseAgain: boolean;
}

interface DialogProps {
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
}: DialogProps) => {
  // 3種のスライダー
  const [ratings, setRatings] = useState({
    continuity: 4,
    emotional: 4,
    contextual: 4
  });

  // チェックボックス系
  const [additionalFeedback, setAdditionalFeedback] = useState<AdditionalFeedback>({
    wantToSkip: false,
    feltDiscomfort: false,
    wouldUseAgain: true
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  useEffect(() => {
    const anyOutOfRange = Object.values(ratings).some(v => v < 1 || v > 7);
    setIsSubmitDisabled(anyOutOfRange);
  }, [ratings]);

  const handleSubmit = () => {
    if (isSubmitDisabled) {
      console.warn('Some ratings are invalid');
      return;
    }
    const reviewData: ReviewData = {
      ratings,
      additionalFeedback,
      timestamp: Date.now()
    };
    onSubmit(reviewData);
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
        zIndex: 9999
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
          <Heading level={4} padding="xs">楽曲遷移の印象評価</Heading>

          {/* 遷移情報 */}
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

          {/* スライダー3種 */}
          <Flex direction="column" gap="medium">
            <RatingSlider
              value={ratings.continuity}
              onChange={(value) => setRatings(prev => ({...prev, continuity: value}))}
              label="音楽の流れの自然さ"
              description="遷移の滑らかさを評価 (1-7)"
            />
            <RatingSlider
              value={ratings.emotional}
              onChange={(value) => setRatings(prev => ({...prev, emotional: value}))}
              label="感情の繋がり"
              description="曲想の連続性を評価 (1-7)"
            />
            <RatingSlider
              value={ratings.contextual}
              onChange={(value) => setRatings(prev => ({...prev, contextual: value}))}
              label="環境音の適切さ"
              description="環境音の選択が適切か (1-7)"
            />
          </Flex>

          <Divider />

          {/* チェックボックス */}
          <Card padding="xs">
            <Flex direction="column" gap="xs">
              {Object.entries({
                wantToSkip: "スキップしたいと感じた",
                feltDiscomfort: "違和感を覚えた",
                wouldUseAgain: "また使いたい"
              }).map(([key, label]) => (
                <View 
                  key={key} 
                  onClick={() => 
                    setAdditionalFeedback(prev => ({
                      ...prev,
                      [key]: !prev[key as keyof AdditionalFeedback]
                    }))
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <Flex alignItems="center" gap="xs">
                    <View
                      width="16px"
                      height="16px"
                      backgroundColor={
                        additionalFeedback[key as keyof AdditionalFeedback] 
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

          {/* ボタン */}
          <Flex direction="row" gap="small" justifyContent="flex-end">
            <Button onClick={onClose} variation="link" size="small">
              キャンセル
            </Button>
            <Button 
              onClick={handleSubmit} 
              variation="primary" 
              size="small"
              isDisabled={isSubmitDisabled}
            >
              送信
            </Button>
          </Flex>
        </Flex>
      </Card>
    </View>
  );
};
