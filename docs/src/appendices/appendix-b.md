---
layout: book
order: 13
title: "付録B: 設定テンプレート集"
---

### B.1.1 情報セキュリティ基礎

**国際標準・フレームワーク**
- ISO/IEC 27001:2022 - Information Security Management Systems (ISMS)
- ISO/IEC 27002:2022 - Code of Practice for Information Security Controls
- ISO/IEC 27005:2018 - Information Security Risk Management
- NIST Cybersecurity Framework (CSF) Version 1.1
- NIST SP 800-53 Rev.5 - Security and Privacy Controls for Federal Information Systems

**セキュリティガイドライン**
- NIST SP 800-30 Rev.1 - Guide for Conducting Risk Assessments
- NIST SP 800-37 Rev.2 - Risk Management Framework for Information Systems
- OWASP Security Knowledge Framework
- CIS Controls Version 8 - A Defense in Depth Cybersecurity Framework
- ENISA Threat Landscape Reports

**日本国内基準**
- 情報セキュリティマネジメントシステム (ISMS) 適合性評価制度
- サイバーセキュリティ基本法・基本戦略
- 政府機関等の情報セキュリティ対策のための統一基準群
- 金融庁「金融機関のITガバナンスに関する対話のための論点・プラクティスの整理」
- 経済産業省「サイバーセキュリティ経営ガイドライン」

### B.1.2 リスク管理・評価

**理論・手法**
- OCTAVE (Operationally Critical Threat, Asset, and Vulnerability Evaluation)
- FAIR (Factor Analysis of Information Risk)
- CRAMM (CCTA Risk Analysis and Management Method)
- Microsoft STRIDE/DREAD Threat Modeling
- PASTA (Process for Attack Simulation and Threat Analysis)

**実践ガイド**
- NIST SP 800-39 - Managing Information Security Risk
- ISO/IEC 31000:2018 - Risk Management Guidelines
- COSO Enterprise Risk Management Framework
- ISACA COBIT 2019 Framework
- PMI Risk Management Professional (PMI-RMP) Body of Knowledge

## B.2 技術実装関連リソース

### B.2.1 ネットワークセキュリティ

**技術標準・仕様**
- RFC 2828 - Internet Security Glossary
- RFC 4301 - Security Architecture for the Internet Protocol (IPsec)
- RFC 5246 - The Transport Layer Security (TLS) Protocol Version 1.2
- RFC 8446 - The Transport Layer Security (TLS) Protocol Version 1.3
- IEEE 802.1X - Port-Based Network Access Control

**実装ガイド**
- NIST SP 800-41 Rev.1 - Guidelines for Firewalls and Firewall Policy
- NIST SP 800-52 Rev.2 - Guidelines for the Selection, Configuration, and Use of TLS
- NIST SP 800-77 Rev.1 - Guide to IPsec VPNs
- NSA Network Infrastructure Security Guidance
- SANS Network Security Resources

**ゼロトラスト関連**
- NIST SP 800-207 - Zero Trust Architecture
- CISA Zero Trust Maturity Model
- NCSC Zero Trust Architecture Design Principles
- Google BeyondCorp Research Papers
- Microsoft Zero Trust Architecture Guide

### B.2.2 サーバー・OS Hardening

**ベンチマーク・ガイド**
- CIS Benchmarks (Windows, Linux, Unix, macOS)
- NIST National Checklist Program Repository
- DISA Security Technical Implementation Guides (STIGs)
- Microsoft Security Compliance Toolkit
- Red Hat Enterprise Linux Security Guide

**Linux/Unix セキュリティ**
- The Linux Documentation Project - Security HOWTO
- Red Hat Product Security
- Ubuntu Security Notices
- SUSE Security Announcements
- FreeBSD Security Advisories

**Windows セキュリティ**
- Microsoft Security Development Lifecycle (SDL)
- Windows Server Security Baselines
- Microsoft Defender for Business
- Windows Security Compliance Toolkit
- Microsoft Security Intelligence Report

### B.2.3 クラウドセキュリティ

**クラウドセキュリティフレームワーク**
- Cloud Security Alliance (CSA) Cloud Controls Matrix
- NIST SP 800-144 - Guidelines for Security and Privacy in Public Cloud Computing
- NIST SP 800-145 - The NIST Definition of Cloud Computing
- ISO/IEC 27017:2015 - Cloud Services Security Controls
- ISO/IEC 27018:2019 - Cloud Privacy Protection

**主要クラウドプロバイダー別リソース**

**Amazon Web Services (AWS)**
- AWS Well-Architected Framework - Security Pillar
- AWS Security Best Practices
- AWS Security Maturity Model
- AWS Compliance and Certification Reports
- AWS Security Documentation

**Microsoft Azure**
- Microsoft Azure Security Benchmark
- Azure Security Center Documentation
- Azure Architecture Center - Security
- Microsoft Cloud Adoption Framework for Azure
- Azure Compliance Documentation

**Google Cloud Platform (GCP)**
- Google Cloud Security Command Center
- Google Cloud Security Best Practices
- Google Cloud Compliance Reports Manager
- Google Cloud Architecture Framework
- Google Cloud Security Documentation

### B.2.4 コンテナ・Kubernetes セキュリティ

**コンテナセキュリティ**
- NIST SP 800-190 - Application Container Security Guide
- CIS Docker Benchmark
- CIS Kubernetes Benchmark
- Docker Security Best Practices
- OWASP Container Security Top 10

**Kubernetes セキュリティ**
- Kubernetes Official Security Documentation
- CNCF Kubernetes Security Best Practices
- NSA/CISA Kubernetes Hardening Guidance
- Kubernetes Pod Security Standards
- RBAC (Role-Based Access Control) Best Practices

**コンテナセキュリティツール**
- Falco - Cloud Native Runtime Security
- Twistlock/Prisma Cloud - Container Security Platform
- Aqua Security - Container Security Platform
- Sysdig Secure - Container Security and Compliance
- Harbor - Container Registry with Security Scanning

## B.3 セキュリティ運用・監視

### B.3.1 SIEM・ログ管理

**SIEM プラットフォーム**
- Splunk Enterprise Security
- IBM QRadar SIEM
- Microsoft Azure Sentinel
- LogRhythm NextGen SIEM Platform
- Elastic Security (ELK Stack)

**ログ管理・分析**
- NIST SP 800-92 - Guide to Computer Security Log Management
- RFC 3164 - The BSD Syslog Protocol
- RFC 5424 - The Syslog Protocol
- Common Event Format (CEF) Specification
- Structured Threat Information eXpression (STIX) 2.1

**オープンソースツール**
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Graylog - Log Management Platform
- OSSEC - Host-based Intrusion Detection System
- Suricata - Network IDS, IPS and NSM engine
- Zeek (formerly Bro) - Network Security Monitor

### B.3.2 脅威インテリジェンス・分析

**フレームワーク・標準**
- MITRE ATT&CK Framework
- Cyber Kill Chain (Lockheed Martin)
- Diamond Model of Intrusion Analysis
- Threat Intelligence Platform (TIP) Evaluation Criteria
- STIX/TAXII - Structured Threat Information Standards

**脅威インテリジェンスソース**
- MITRE CVE Database
- National Vulnerability Database (NVD)
- CERT/CC Vulnerability Notes
- US-CERT Alerts and Tips
- JPCERT/CC インシデント報告

**商用プラットフォーム**
- Recorded Future - Threat Intelligence Platform
- ThreatConnect - Threat Intelligence Platform
- Anomali - Threat Intelligence Management
- CrowdStrike Falcon Intelligence
- FireEye Mandiant Threat Intelligence

### B.3.3 インシデント対応・フォレンジック

**インシデント対応フレームワーク**
- NIST SP 800-61 Rev.2 - Computer Security Incident Handling Guide
- SANS Incident Response Methodology
- ENISA Good Practice Guide for Incident Management
- ISO/IEC 27035:2023 - Incident Management
- FIRST Computer Security Incident Response Team (CSIRT) Services Framework

**デジタルフォレンジック**
- NIST SP 800-86 - Guide to Integrating Forensic Techniques into Incident Response
- Scientific Working Group on Digital Evidence (SWGDE)
- International Organization on Computer Evidence (IOCE)
- Association of Digital Forensics, Security and Law (ADFSL)
- Computer Forensics Tool Testing (CFTT) Project

**フォレンジックツール**
- The Sleuth Kit + Autopsy - Digital Investigation Platform
- Volatility Framework - Memory Forensics
- YARA - Pattern Matching Engine for Malware Research
- Wireshark - Network Protocol Analyzer
- X-Ways Forensics - Computer Forensics Software

## B.4 学習・認定リソース

### B.4.1 専門認定資格

**情報セキュリティ基礎**
- CISSP (Certified Information Systems Security Professional)
- CISM (Certified Information Security Manager)
- CISA (Certified Information Systems Auditor)
- Security+ (CompTIA Security+)
- GSEC (GIAC Security Essentials)

**技術専門分野**
- CEH (Certified Ethical Hacker)
- OSCP (Offensive Security Certified Professional)
- GCIH (GIAC Certified Incident Handler)
- GCFA (GIAC Certified Forensic Analyst)
- CISPA (Certified Information Systems Penetration Analysis)

**クラウド・インフラ特化**
- AWS Certified Security - Specialty
- Microsoft Azure Security Engineer Associate
- Google Professional Cloud Security Engineer
- Certified Cloud Security Professional (CCSP)
- Certificate of Cloud Auditing Knowledge (CCAK)

**日本国内認定**
- 情報処理安全確保支援士 (RISS)
- 情報セキュリティマネジメント試験 (SG)
- 情報セキュリティ監査アソシエイト
- SPREAD情報セキュリティサポーター能力検定
- 情報セキュリティ大学院大学認定資格

### B.4.2 教育・トレーニングリソース

**オンライン学習プラットフォーム**
- SANS Training - Information Security Training
- Cybrary - Free Cyber Security Training
- Coursera - Cybersecurity Specializations
- edX - Cybersecurity Courses
- Udemy - Security and Network Courses

**実践的トレーニング**
- Hack The Box - Penetration Testing Labs
- TryHackMe - Learn Cybersecurity
- VulnHub - Vulnerable Virtual Machines
- OverTheWire Wargames
- PentesterLab - Web Application Security

**日本語リソース**
- JPCERT/CC セキュリティセミナー
- IPA 情報セキュリティ関連資料
- LAC セキュリティ技術情報
- NRI Secure セキュリティブログ
- トレンドマイクロ セキュリティブログ

### B.4.3 技術コミュニティ・イベント

**国際カンファレンス**
- Black Hat / DEF CON
- RSA Conference
- BSides (Local Security Conferences)
- OWASP Global Conferences
- (ISC)² Security Congress

**アジア・太平洋地域**
- CODE BLUE (Japan)
- HITCON (Taiwan)
- ROOTCON (Philippines)
- SECUINSIDE (South Korea)
- OWASP AppSec APAC

**日本国内イベント**
- SECCON (セキュリティコンテスト)
- InternetWeek Security Session
- CSS (Computer Security Symposium)
- JSSEC セキュリティセミナー
- JPCERT/CC フォーラム

## B.5 技術ツール・プラットフォーム

### B.5.1 脆弱性評価・ペネトレーションテスト

**商用スキャナー**
- Nessus Professional - Vulnerability Scanner
- Qualys VMDR - Vulnerability Management
- Rapid7 InsightVM - Vulnerability Management
- Burp Suite Professional - Web Application Security
- Acunetix - Web Application Security Scanner

**オープンソースツール**
- OpenVAS - Open Source Vulnerability Scanner
- Nikto - Web Server Scanner
- OWASP ZAP - Web Application Security Scanner
- Metasploit Framework - Penetration Testing Platform
- Nmap - Network Discovery and Security Auditing

### B.5.2 セキュリティ自動化・オーケストレーション

**SOAR プラットフォーム**
- Phantom (Splunk SOAR) - Security Orchestration Platform
- Demisto (Palo Alto XSOAR) - Security Orchestration Platform
- IBM Resilient - Incident Response Platform
- Swimlane - Security Automation Platform
- TheHive - Security Incident Response Platform

**Infrastructure as Code セキュリティ**
- Terraform - Infrastructure as Code
- Ansible - IT Automation Platform
- Chef InSpec - Infrastructure Testing Framework
- Puppet - IT Automation Software
- SaltStack - Intelligent IT Automation

### B.5.3 クラウドセキュリティツール

**マルチクラウド管理**
- CloudHealth by VMware - Cloud Management Platform
- CloudCheckr - Cloud Management Platform
- Evident.io (Palo Alto Prisma Cloud) - Cloud Security
- Dome9 (Check Point CloudGuard) - Cloud Security
- Lacework - Cloud Security Platform

**コンプライアンス・ガバナンス**
- AWS Config - Configuration Management
- Azure Policy - Governance and Compliance
- Google Cloud Asset Inventory - Resource Management
- Cloud Custodian - Cloud Resource Management
- ScoutSuite - Multi-Cloud Security Auditing

## B.6 法的・規制要件関連

### B.6.1 プライバシー・データ保護

**国際規制**
- GDPR (General Data Protection Regulation) - EU
- CCPA (California Consumer Privacy Act) - California, USA
- PIPEDA (Personal Information Protection and Electronic Documents Act) - Canada
- Lei Geral de Proteção de Dados (LGPD) - Brazil
- Personal Data Protection Act (PDPA) - Singapore

**業界固有規制**
- PCI DSS (Payment Card Industry Data Security Standard)
- HIPAA (Health Insurance Portability and Accountability Act)
- SOX (Sarbanes-Oxley Act) - Financial Reporting
- GLBA (Gramm-Leach-Bliley Act) - Financial Services
- FERPA (Family Educational Rights and Privacy Act)

**日本国内法令**
- 個人情報保護法
- 不正競争防止法
- 金融商品取引法
- 医療情報システムの安全管理に関するガイドライン
- 政府機関等の情報セキュリティ対策のための統一基準

### B.6.2 業界ガイドライン・ベストプラクティス

**金融業界**
- バーゼルIII規制枠組み
- 金融庁「金融検査マニュアル」
- FISC（金融情報システムセンター）安全対策基準
- ISO 22301 (Business Continuity Management)
- PCI DSS Requirements and Security Assessment Procedures

**医療・ヘルスケア**
- 医療情報システムの安全管理に関するガイドライン
- HL7 FHIR Security Implementation Guide
- DICOM Security and Privacy Profiles
- FDA Cybersecurity Guidance for Medical Devices
- HIPAA Security Rule

**製造業・OT/IoT**
- IEC 62443 - Industrial Automation and Control Systems Security
- NIST Cybersecurity Framework Manufacturing Profile
- ISA/IEC 62443 Series Standards
- Industrial Internet Consortium (IIC) Security Working Group
- ENISA Guidelines for Securing the Internet of Things

## B.7 継続的学習・情報収集

### B.7.1 セキュリティニュース・情報源

**英語情報源**
- Krebs on Security (Brian Krebs)
- Schneier on Security (Bruce Schneier)
- Dark Reading - Cybersecurity News
- The Hacker News
- Threatpost - Security News

**日本語情報源**
- @IT セキュリティ
- ITmedia エンタープライズ セキュリティ
- 日経XTECH セキュリティ
- ScanNetSecurity
- Security NEXT

**政府・公的機関**
- US-CERT (Cybersecurity & Infrastructure Security Agency)
- JPCERT/CC (Japan Computer Emergency Response Team)
- IPA (Information-technology Promotion Agency)
- NISC (National center of Incident readiness and Strategy for Cybersecurity)
- ENISA (European Union Agency for Cybersecurity)

### B.7.2 研究・学術リソース

**学術論文・研究**
- IEEE Computer Society Digital Library
- ACM Digital Library - Security and Privacy
- USENIX Security Symposium Proceedings
- Network and Distributed System Security (NDSS) Symposium
- Computer and Communications Security (CCS) Conference

**研究機関・大学**
- Carnegie Mellon University - CyLab
- MIT Computer Science and Artificial Intelligence Laboratory (CSAIL)
- Stanford Security Laboratory
- UC Berkeley - Computer Security Group
- RIKEN - Advanced Intelligence Project

**日本国内研究機関**
- 情報セキュリティ大学院大学
- NICT (National Institute of Information and Communications Technology)
- 産業技術総合研究所 (AIST)
- NTT セキュアプラットフォーム研究所
- NEC セキュリティ研究所

### B.7.3 専門書籍・出版物

**セキュリティ基礎**
- "Computer Security: Principles and Practice" by William Stallings
- "Security Engineering" by Ross Anderson
- "The Art of Software Security Assessment" by Mark Dowd
- "Applied Cryptography" by Bruce Schneier
- "Network Security Essentials" by William Stallings

**インシデント対応・フォレンジック**
- "Incident Response & Computer Forensics" by Jason Luttgens
- "The Practice of Network Security Monitoring" by Richard Bejtlich
- "Malware Analyst's Cookbook" by Michael Ligh
- "Windows Forensic Analysis Toolkit" by Harlan Carvey
- "File System Forensic Analysis" by Brian Carrier

**クラウド・モダンインフラ**
- "Cloud Security and Privacy" by Tim Mather
- "Container Security" by Liz Rice
- "Kubernetes Security" by Liz Rice and Michael Hausenblas
- "Infrastructure as Code" by Kief Morris
- "Site Reliability Engineering" by Google SRE Team

**日本語専門書**
- 「体系的に学ぶ 安全なWebアプリケーションの作り方」 徳丸浩
- 「セキュアプログラミング講座」 IPA
- 「情報セキュリティ白書」 IPA
- 「サイバーセキュリティ2030」 内閣サイバーセキュリティセンター
- 「インシデント対応実践ガイド」 JPCERT/CC

---

## リソース活用のガイドライン

### 情報の信頼性評価

情報源を選択する際は、以下の基準で評価することを推奨します：

1. **権威性**: 公的機関、標準化団体、著名な研究機関からの情報
2. **最新性**: 脅威環境の変化に対応した最新の情報
3. **実証性**: 実環境での検証や実装例が示されている情報
4. **透明性**: 情報源、作成者、更新履歴が明確な情報

### 継続的学習の進め方

1. **基礎固め**: 標準規格とフレームワークの理解
2. **実践経験**: ラボ環境での実装と検証
3. **最新動向**: 業界ニュースと脅威情報の定期収集
4. **コミュニティ参加**: 専門家ネットワークの構築
5. **認定取得**: 体系的知識の証明と継続的な学習

このリソース集を出発点として、組織の要件と個人のキャリア目標に応じて、継続的な学習と実践を進めることで、インフラセキュリティの専門性を深めていってください。