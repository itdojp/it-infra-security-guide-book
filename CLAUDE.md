# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Japanese-language technical book project about "インフラエンジニアのための情報セキュリティ実装ガイド" (Infrastructure Security Implementation Guide). The book provides practical approaches for design, build, and operations of security in infrastructure engineering.

## Repository Structure

This project uses the **book-formatter** system:

```
it-infra-security-guide-book/
├── docs/                    # Generated output (GitHub Pages)
├── src/                     # Source content
│   ├── introduction/        # Introduction section
│   ├── chapters/           # 9 chapters (chapter01-09)
│   ├── appendices/         # Appendices
│   └── afterword/          # Afterword
├── book-config.json        # Book configuration (book-formatter format)
├── package.json           # Project dependencies and scripts
└── CLAUDE.md             # This file
```

## Writing Philosophy (From project_handover_document.md)

### Core Approach
- **概念と原理の説明を主体**: Focus on explaining concepts and principles
- **コードは理解を助ける補助として最小限に使用**: Use code minimally, only as aid for understanding
- **設定の背景にある設計思想と実装判断の根拠を丁寧に説明**: Carefully explain design philosophy and implementation rationale behind configurations

### Differentiation Strategy
- Position between "theory-heavy books" and "code-heavy books"
- Focus on the practical bridge of "how infrastructure engineers actually implement security after understanding theory"
- Comprehensive coverage of cross-cutting security implementation challenges

### Content Balance (from Phase 3 findings)
- 概念説明 30%
- 実装アプローチ 50%
- 運用考慮点 20%

## Key Commands and Workflows

### Development
```bash
npm start                    # Start development server
npm run build               # Build the book for production
npm run preview             # Local preview of built book
npm run deploy              # Deploy to GitHub Pages
```

### Content Management
```bash
npm run lint                # Check markdown formatting
npm run check-links         # Validate internal links
npm test                    # Run all tests (lint + links)
npm run clean               # Clean build artifacts
```

## Content Guidelines

### Book Structure
- **3 Parts, 9 Chapters** covering infrastructure security implementation
- **Part I**: Security fundamentals and principles (Chapters 1-3)
- **Part II**: Technical implementation (Chapters 4-7)
- **Part III**: Integrated operations (Chapters 8-9)

### Writing Style
- **Target Audience**: Infrastructure engineers (1-5 years experience)
- **Language**: Japanese (professional technical writing)
- **Tone**: 対等で探求的な文体 (Equal and exploratory tone)
- **Approach**: Practical implementation with theoretical foundation

### Technical Requirements
- **Format**: Markdown (CommonMark + extensions)
- **Encoding**: UTF-8
- **Line endings**: LF (Unix format)
- **Framework**: book-formatter

## Phase Status

Based on project_handover_document.md:
- ✅ Phase 1: 企画立案・価値設計 (Complete)
- ✅ Phase 2: 構造設計・目次詳細化 (Complete)
- ✅ Phase 3: 探索的執筆・内容検証 (Complete - all 9 chapters rough draft)
- ✅ Phase 4: 構造改善・方針確定 (Complete)
- 🚧 Phase 5: 本格執筆・内容充実 (Current - using Claude 4 Sonnet)
- ⏳ Phase 6: 品質保証・最終調整 (Pending)

## Important Notes

1. **Current Phase**: Phase 5 - Full writing and content enrichment
2. **AI Model Strategy**: 
   - Rough drafts: Claude 4 Opus (completed)
   - Final drafts: Claude 4 Sonnet (current)
3. **Key Examples**: 
   - 銀行ATMシステム (CIA Triad)
   - 緊急通報システム (Availability)
   - 城郭の防御システム (Defense in depth)
   - 企業ネットワーク (Practical infrastructure)

## Quality Standards

- **Conceptual Clarity**: Focus on why, not just how
- **Practical Value**: Enable readers to successfully implement security
- **Progressive Understanding**: Build knowledge step by step
- **Minimal Code**: Code only when it aids understanding

## Contact Information

**Author**: 太田和彦（株式会社アイティードゥ）  
**Email**: knowledge@itdo.jp  
**GitHub**: [@itdojp](https://github.com/itdojp)  
**Organization**: 株式会社アイティードゥ