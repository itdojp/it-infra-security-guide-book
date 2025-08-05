---
layout: book
order: 1
title: "インフラエンジニアのための情報セキュリティ実装ガイド"
---

# {{ page.title }}

{{ page.description }}
{: .fs-6 .fw-300 }

---

## 概要

現代のインフラエンジニアは、ネットワーク、サーバー、クラウド、コンテナなど多様な技術領域にまたがるセキュリティ実装を求められています。本書は、これらの横断的なセキュリティ課題に対する実践的なアプローチを提供します。

## 本書の特徴

- **実装重視のアプローチ**：概念30%、実装50%、運用20%のバランス
- **横断的な視点**：技術領域を超えたセキュリティ統合
- **設計思想の解説**：設定の背景にある判断根拠を詳しく説明
- **段階的な学習**：基礎から応用まで体系的な構成

## 目次

### はじめに
- [はじめに](src/chapter-introduction/index.html) - 本書の目的と構成

### Part I: セキュリティ基礎

**第1章: [情報セキュリティの基礎概念](src/chapter-chapter01/index.html)**  
CIA Triad、リスク評価、脅威モデリング
- 機密性・完全性・可用性の実装
- リスクの定量化手法
- 脅威とリスクの基本概念

**第2章: [インフラエンジニアのためのセキュリティ設計](src/chapter-chapter02/index.html)**  
多層防御、セキュリティフレームワーク
- 多層防御の設計原理
- セキュリティフレームワークの実装アプローチ
- インフラエンジニアの役割と責任

**第3章: [セキュリティ要件の定義と実装計画](src/chapter-chapter03/index.html)**  
要件定義、リスクベースアプローチ
- ビジネス要件からセキュリティ要件への変換
- リスクベースアプローチによる実装優先度
- セキュリティ・バイ・デザインの実装手法

### Part II: 技術実装

**第4章: [ネットワークセキュリティの実装](src/chapter-chapter04/index.html)**  
ファイアウォール、VPN、ゼロトラスト
- ファイアウォール設計と最適化
- VPN構築と管理
- ネットワークセグメンテーション戦略

**第5章: [サーバーとOSのセキュリティ強化](src/chapter-chapter05/index.html)**  
OS Hardening、パッチ管理
- OS Hardening の実践
- パッチ管理システムの構築
- アクセス制御と特権管理

**第6章: [クラウドインフラのセキュリティ](src/chapter-chapter06/index.html)**  
責任共有モデル、IAM、データ保護
- クラウドセキュリティの責任共有モデル
- IAM（Identity and Access Management）の設計と運用
- クラウドネイティブなデータ保護

**第7章: [コンテナとKubernetesのセキュリティ](src/chapter-chapter07/index.html)**  
コンテナセキュリティ、K8sセキュリティ
- コンテナセキュリティの基盤
- Kubernetesクラスターのセキュリティ強化
- ランタイムセキュリティと脅威検知

### Part III: 統合運用

**第8章: [継続的セキュリティ運用](src/chapter-chapter08/index.html)**  
SOC、SIEM、自動化
- SOC（Security Operations Center）の設計と構築
- SIEM・SOAR統合による高度な脅威検知
- セキュリティメトリクスと継続的改善

**第9章: [インシデント対応と継続的改善](src/chapter-chapter09/index.html)**  
インシデント対応、フォレンジック
- インシデント対応プロセスの体系化
- デジタルフォレンジックと証拠保全
- セキュリティ成熟度の継続的向上

### 付録
- [付録A：セキュリティチェックリスト](src/appendices/appendix-a.html)
- [付録B：参考文献とリソース](src/appendices/appendix-b.html)
- [あとがき](src/appendices/afterword.html)

## 想定読者

- インフラエンジニア（1-5年経験）
- セキュリティエンジニア
- DevOpsエンジニア
- SRE（Site Reliability Engineer）
- ITアーキテクト

## 著者について

**株式会社アイティードゥ**  
インフラエンジニアの技術力向上と組織のセキュリティ成熟度向上を支援する企業です。

---

[はじめにお読みください](src/chapter-introduction/index.html){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }



---

**著者:** 株式会社アイティードゥ  
**バージョン:** 1.0.0  
**最終更新:** 2025-07-17
