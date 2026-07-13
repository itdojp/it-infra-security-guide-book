---
layout: book
order: 13
title: "セキュリティ実装トラブルシューティング"
---
# セキュリティ実装トラブルシューティング

この付録は、設定変更や攻撃的な検証を先に行うための手順ではありません。異常を安全に切り分け、証跡を保全し、担当者へ引き継ぐための判断フローです。

## 開始前の安全ゲート

次の条件を確認できない場合は作業を開始せず、変更管理責任者またはインシデント対応責任者へエスカレーションします。

- 対象、担当者、許可された操作、時間帯、停止条件が明示されている。
- 本番・共有環境への影響範囲とロールバック責任者が明確である。
- ログ、時刻、対象識別子、変更前状態を保存でき、証跡保全の方法が合意されている。
- credential、秘密鍵、token、個人情報を記録・共有する際のマスキング規則がある。

## 6段階の判断フロー

1. **止める・守る**: active incident、情報漏えい、可用性低下、証拠毀損のおそれがあれば通常変更を止め、インシデント手順へ移行する。
2. **read-onlyで観測する**: 時刻、症状、対象、直前変更、監視アラート、監査ログを収集する。設定変更や再起動はまだ行わない。
3. **症状を分類する**: identity/権限、network、host/container、cloud/Kubernetes、monitoring/incidentのどこで期待結果と差が生じたかを特定する。
4. **最小安全テストを設計する**: 隔離した検証環境、read-only query、単一対象で仮説を一つだけ検証する。productionでの試行錯誤を避ける。
5. **復旧またはエスカレーションする**: 承認済みのrollbackがある場合だけ適用する。責任境界を越える、原因が不明、影響が拡大する場合は停止して担当者へ渡す。
6. **記録して再確認する**: 実施者、時刻、観測、変更、結果、未解決リスクを記録し、監視・アクセス・ログ保全が期待状態へ戻ったことを別担当者と確認する。

## 症状別ルート

### identity・権限

- 401/403、MFA失敗、role assumption失敗では、まず対象identity、認証方式、期限、監査ログをread-onlyで確認する。
- 一時的な権限追加や共有credentialで回避しない。
- 設計原則は[第2章](../chapter-chapter02/)、cloud IAMは[第6章](../chapter-chapter06/)、特権管理は[第5章](../chapter-chapter05/)を参照する。

### network

- 到達不能やtimeoutでは、名前解決、経路、security group/firewall、proxy、TLSのどの境界で失敗したかを一段ずつ確認する。
- firewall全面開放や検証用公開を暫定対処にしない。
- [第4章](../chapter-chapter04/)のnetwork設計と変更管理へ戻る。

### host・container

- patch、service、container、Kubernetesの異常では、対象version、直前deploy、event/log、readinessを収集する。
- 証跡保存前の再起動、image差し替え、host上の直接修正を避ける。
- [第5章](../chapter-chapter05/)と[第7章](../chapter-chapter07/)を参照する。

### cloud・Kubernetes

- provider側障害、quota、policy、region、責任共有境界を分ける。契約・billing・組織policyの変更は所有者へ引き継ぐ。
- 管理者権限の常用や監査ログ無効化で回避しない。
- [第6章](../chapter-chapter06/)と[第7章](../chapter-chapter07/)を参照する。

### monitoring・incident

- alert欠落、log欠落、複数系統の同時異常、侵害兆候がある場合は、通常の設定トラブルとして扱わない。
- 原本を上書きせず、時刻同期とchain of custodyを維持して[第8章](../chapter-chapter08/)・[第9章](../chapter-chapter09/)へ移行する。

## 即時停止・引き継ぎ条件

- credential、秘密鍵、token、個人情報が露出した。
- 許可範囲外、shared/production、第三者管理対象へ影響する。
- active incident、横展開、データ改ざん、可用性低下が疑われる。
- 証跡保全と復旧の両立を判断できない。
- rollback手順、承認者、連絡経路のいずれかがない。

停止時は「何をしなかったか」も記録し、[付録A](appendix-a.md)のチェックリストと[第9章](../chapter-chapter09/)のインシデント対応へ引き継ぎます。
