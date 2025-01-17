1. 研究の位置づけと学術的意義
1.1 既存研究の現状と課題
音楽遷移の最適化に関する既存研究は、主に以下の3つのアプローチに分類されます：
音響特徴量ベースのアプローチ

テンポ、キー、音圧等の音楽的特徴量の類似性に基づく最適化
課題：知覚的な連続性と音響的な類似性が必ずしも一致しない

感情価ベースのアプローチ

Valence-Arousalモデル等を用いた感情的連続性の最適化
課題：文脈依存的な感情解釈の考慮が不十分

メタデータベースのアプローチ

ジャンル、年代、アーティスト等の関連性に基づく推薦
課題：実際の聴取体験の質を直接的に考慮していない

1.2 本研究の新規性
環境音による遷移最適化

楽曲間の「知覚的な架け橋」として5秒の環境音bridgeを導入
サウンドスケープ理論に基づく文脈形成効果の応用
ホワイトノイズとの比較による環境音効果の検証

マルチモーダルな遷移品質評価

7段階評価による定量的分析
知覚的連続性、感情的連続性、文脈適合性の3軸評価
補足的評価指標による多面的分析

データ駆動型の実験基盤

AWS Amplify Gen2を用いた大規模データ収集システム
Spotify APIとDCASE指標の統合
再現可能な実験プロトコルの確立

2. データ収集基盤の構成
2.1 データソース

Spotify API：楽曲特徴量（テンポ、キー、エネルギー値等）
DCASE：環境音のカテゴリ、サブカテゴリ、環境状況
実験アプリケーション：ユーザー評価データ

2.2 評価システム
主要評価指標（7段階評価）

知覚的連続性：音量、テンポ、音色の遷移
感情的連続性：ムードの流れ、エネルギー遷移
文脈適合性：シーンの一貫性、没入感

補足評価指標

スキップ傾向
自然さの認識
再利用意向

2.3 実験アプリケーション

Web UIによる直感的な評価インターフェース
リアルタイムデータ収集
実験プロトコルの標準化

3. 期待される成果と展望
3.1 学術的貢献

環境音による音楽遷移最適化の定量的評価
サウンドスケープが音楽体験に与える影響の解明
音楽推薦システムにおける新しいアプローチの提案

3.2 実践的価値

音楽ストリーミングサービスにおける体験向上
プレイリスト構築の柔軟化
楽曲間の相性の制約緩和

3.3 将来展開
実装済み機能の拡張

評価システムの精緻化
データ分析基盤の強化
UI/UXの最適化

将来課題

延長bridge（オーバーラップ型）の研究
評価者属性情報の収集と分析
AIによる環境音選択の自動化

# ディレクトリ構造
## efsomi/
amplify
node_modules
public
src
types
.eslintrc.cjs
.gitignore
amplify.yml
amplify_outputs.json
CODE_OF_CONDUCT.md
CONTRIBUTING.md
index.html
LICENSE
package-lock.json
package.json
README.md
tsconfig.json
tsconfig.node.json
vite.config.ts

## efsomi/src
assets
components
data
lib
pages
App.css
App.tsx
index.css
main.tsx
vite-env.d.ts
assets\react.svg
components\shared
components\ui
components\shared\AudioPlayer.tsx
components\shared\BridgeController.tsx
components\shared\MusicSelector.tsx
components\shared\SoundSelector.tsx
components\ui\button.tsx
components\ui\card.tsx
components\ui\slider.tsx
data\environmentalSounds.tsx
data\songs.tsx
lib\utils.ts
pages\Experiment.tsx