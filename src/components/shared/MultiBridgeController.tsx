// src/components/shared/MultiBridgeController.tsx
import { useState } from 'react';
import { Card, Flex, Text, Button } from '@aws-amplify/ui-react';
import { EnvironmentalSound, BridgeConfig } from '../../types/audio';

interface MultiBridgeControllerProps {
  config: BridgeConfig;
  onConfigChange: (newConfig: BridgeConfig) => void;
  availableSounds: EnvironmentalSound[];
  multiBridgeSounds: EnvironmentalSound[];
  setMultiBridgeSounds: (sounds: EnvironmentalSound[]) => void;
}

export default function MultiBridgeController({
  config,
  onConfigChange,
  availableSounds,
  multiBridgeSounds,
  setMultiBridgeSounds
}: MultiBridgeControllerProps) {

  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const ids = selectedOptions.map(opt => opt.value);
    setTempSelectedIds(ids);
  };

  const handleAddBridgeSound = () => {
    if (tempSelectedIds.length === 0) return;
    // ID一覧からサウンドを抽出
    const newSounds = tempSelectedIds
      .map(id => availableSounds.find(s => s.id === id))
      .filter(Boolean) as EnvironmentalSound[];
    
    setMultiBridgeSounds([...multiBridgeSounds, ...newSounds]);
    setTempSelectedIds([]);
  };

  const removeBridgeSound = (indexToRemove: number) => {
    const updated = multiBridgeSounds.filter((_, i) => i !== indexToRemove);
    setMultiBridgeSounds(updated);
  };

  const handleBridgeSoundCountChange = (val: number) => {
    onConfigChange({ ...config, bridgeSoundCount: val });
  };

  return (
    <Card padding="medium">
      <Flex direction="column" gap="small">
        <Text fontSize="large" fontWeight="bold">
          Multiple Bridge Sounds
        </Text>

        <Flex direction="row" gap="small" alignItems="center">
          <select
            multiple
            value={tempSelectedIds}
            onChange={handleSelectChange}
            style={{
              flex: 1,
              minHeight: '100px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            {availableSounds.map((sound) => (
              <option key={sound.id} value={sound.id}>
                {sound.name} ({sound.category})
              </option>
            ))}
          </select>

          <Button size="small" onClick={handleAddBridgeSound}>
            追加
          </Button>
        </Flex>

        <Flex direction="column" gap="xxs" marginTop="small">
          <Text>選択されたブリッジ音リスト:</Text>
          {multiBridgeSounds.length === 0 && (
            <Text fontSize="small" color="font.tertiary">選択されていません</Text>
          )}
          {multiBridgeSounds.map((bs, idx) => (
            <Flex
              key={`bs-${idx}`}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              marginTop="4px"
            >
              <Text fontSize="small">
                {idx + 1}. {bs.name} ({bs.category})
              </Text>
              <Button
                size="small"
                variation="link"
                onClick={() => removeBridgeSound(idx)}
              >
                削除
              </Button>
            </Flex>
          ))}
        </Flex>

        <Flex direction="column" gap="small" marginTop="small">
          <Text>Bridge Sound Count: {config.bridgeSoundCount}</Text>
          <input
            type="range"
            min={1}
            max={3}
            step={1}
            value={config.bridgeSoundCount}
            onChange={(e) => handleBridgeSoundCountChange(parseInt(e.target.value, 10))}
          />
        </Flex>
      </Flex>
    </Card>
  );
}
